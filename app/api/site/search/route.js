// File: app/api/site/search/route.js
const { default: connectDB } = require("@/lib/db");
const { default: Product } = require("@/models/product/Product");
const { NextResponse } = require("next/server");

/**
 * Function to compare string similarity using Levenshtein distance
 * @param {string} str1 - First string to compare
 * @param {string} str2 - Second string to compare
 * @param {number} maxDistance - Maximum allowed distance (for early termination)
 * @returns {number} - Distance between strings (lower means more similar)
*/

function levenshteinDistance(str1, str2, maxDistance = Infinity) {
  // Convert to lowercase for case-insensitive comparison
  const s1 = String(str1).toLowerCase();
  const s2 = String(str2).toLowerCase();
  
  // Quick check for direct matches or empty strings
  if (s1 === s2) return 0;
  if (!s1.length) return s2.length;
  if (!s2.length) return s1.length;
  
  // Initialize the distance matrix
  const matrix = [];
  
  // Initialize the first row
  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i];
  }
  
  // Initialize the first column
  for (let i = 0; i <= s1.length; i++) {
    matrix[0][i] = i;
  }
  
  // Fill the matrix
  let minimumDistance = Infinity;
  for (let i = 1; i <= s1.length; i++) {
    let rowMin = Infinity;
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j - 1][i] + 1, // deletion
        matrix[j][i - 1] + 1, // insertion
        matrix[j - 1][i - 1] + cost // substitution
      );
      rowMin = Math.min(rowMin, matrix[j][i]);
    }
    
    // Early termination if we can't beat maxDistance
    if (rowMin > maxDistance) {
      return maxDistance + 1;
    }
    minimumDistance = rowMin;
  }
  
  return matrix[s2.length][s1.length];
}

/**
 * Processes search terms to improve matching quality
 * @param {string} query - Original search query
 * @returns {Object} - Processed search terms and conditions
 */

function processSearchTerms(query) {
  if (!query) return { terms: [], exact: "" };
  
  // Normalize and split the query
  const normalizedQuery = query.toLowerCase().trim();
  const terms = normalizedQuery
    .split(/\s+/)
    .filter(term => term.length > 1)
    .map(term => term.replace(/[^a-z0-9]/g, '')); // Remove special characters
    
  return {
    terms,
    exact: normalizedQuery
  };
}

/**
 * Creates MongoDB query conditions for search - Title and SKU only
 * @param {Object} searchData - Processed search terms
 * @returns {Object} - MongoDB query conditions
 */
function createSearchConditions(searchData) {
  const { terms, exact } = searchData;
  
  if (!terms.length) return {};
  
  // Only search in title and SKU fields
  const conditions = [
    // Title conditions
    { title: { $regex: exact, $options: 'i' } },
    ...terms.map(term => ({ title: { $regex: term, $options: 'i' } })),
    
    // SKU conditions
    { sku: { $regex: exact, $options: 'i' } },
    ...terms.map(term => ({ sku: { $regex: term, $options: 'i' } }))
  ];
  
  return { $or: conditions };
}

/**
 * Calculates relevance score for search results based on title and SKU only
 * @param {Object} product - Product document
 * @param {Object} searchData - Search terms data
 * @returns {number} - Relevance score (higher is better)
 */
function calculateRelevance(product, searchData) {
  const { terms, exact } = searchData;
  let score = 0;
  
  // Convert product fields to lowercase for comparison
  const title = (product.title || '').toLowerCase();
  const sku = (product.sku || '').toLowerCase();
  
  // Exact match in title gets highest score
  if (title.includes(exact)) {
    score += 100;
  }
  
  // Terms matching in title
  terms.forEach(term => {
    if (title.includes(term)) {
      score += 20;
    }
  });
  
  // Match at beginning of title gets bonus
  if (terms.length > 0 && title.startsWith(terms[0])) {
    score += 30;
  }
  
  // SKU matches
  if (sku.includes(exact)) {
    score += 80;
  }
  
  // SKU term matches
  terms.forEach(term => {
    if (sku.includes(term)) {
      score += 15;
    }
  });
  
  // Stock availability bonus
  if (product.inStock) {
    score += 10;
  }
  
  return score;
}

/**
 * GET method handler for the search API route
 * Next.js App Router requires named exports for HTTP methods
 */
export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const query = searchParams.get('query') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '9', 10);
  const maxDistance = parseInt(searchParams.get('tolerance') || '2', 10);

  // Validate inputs
  if (query && query.length < 2) {
    return NextResponse.json({ 
      error: 'Search query must be at least 2 characters' 
    }, { status: 400 });
  }

  try {
    // Connect to database
    await connectDB();
    
    // Base filter conditions
    const baseFilter = {
      delete: false,
      visibility: true,
    };
    
    // Process search terms
    const searchData = processSearchTerms(query);
    
    // Create search conditions if query exists
    const searchConditions = query ? createSearchConditions(searchData) : {};
    
    // Combine all filter conditions
    const filter = {
      ...baseFilter,
      ...(Object.keys(searchConditions).length ? searchConditions : {})
    };

    // Count total matching documents (for pagination)
    const total = await Product.countDocuments(filter);
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);
    
    // Execute main query
    let products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .populate('defaultImage')
      .populate('category')
      .populate('material')
      .select('attributes defaultImage inStock price salePrice stock title titleSlug sku createdAt')
      .skip(skip)
      .limit(limit)
      .lean();
    
    // If no results with direct matching and query exists, try spelling tolerance
    if (query && products.length === 0 && searchData.terms.length > 0) {
      // Get potential products without strict filtering
      const potentialProducts = await Product.find(baseFilter)
        .select('title sku defaultImage inStock price salePrice stock titleSlug createdAt')
        .limit(200) // Limit for performance
        .lean();
      
      // Apply spelling tolerance - only to title and SKU
      products = potentialProducts.filter(product => {
        const productTitle = (product.title || '').toLowerCase();
        const productSku = (product.sku || '').toLowerCase();
        
        // Check title with Levenshtein distance
        const titleDistance = levenshteinDistance(productTitle, searchData.exact, maxDistance);
        if (titleDistance <= maxDistance) return true;
        
        // Check SKU
        const skuDistance = levenshteinDistance(productSku, searchData.exact, maxDistance);
        if (skuDistance <= maxDistance) return true;
        
        // Check individual terms against title words
        const titleWords = productTitle.split(/\s+/).filter(w => w.length > 1);
        return searchData.terms.some(term => 
          titleWords.some(word => levenshteinDistance(word, term, maxDistance) <= maxDistance)
        );
      }).slice(0, limit); // Take only the limit number
      
      // Populate necessary fields for matching products
      if (products.length > 0) {
        const productIds = products.map(p => p._id);
        products = await Product.find({ _id: { $in: productIds } })
          .populate('defaultImage')
          .populate('category') 
          .populate('material')
          .select('attributes defaultImage inStock price salePrice stock title titleSlug sku createdAt')
          .lean();
      }
    }
    
    // If we have query and results, add relevance scores and sort
    if (query && products.length > 0) {
      products = products
        .map(product => ({
          ...product,
          relevance: calculateRelevance(product, searchData)
        }))
        .sort((a, b) => b.relevance - a.relevance);
    }
    
    // Return response
    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages
      },
      query: query || null,
      searchTerms: searchData.terms,
    });
    
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ 
      error: 'Failed to process search request', 
      message: error.message 
    }, { status: 500 });
  }
}