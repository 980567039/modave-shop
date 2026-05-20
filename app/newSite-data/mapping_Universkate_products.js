const fs = require('fs');
const csv = require('csv-parser');

// CSV file path
const csvFilePath = 'universkate.csv';

// Output JS file name
const outputFileName = 'products_seba.js';

// Auto-increment ID counter
let idCounter = 1;

// Function to transform CSV row into JSON structure
function transformRow(row) {
  return {
    id: idCounter++,
    title: row['PRODUCT DESCRIPTION'] || '',
    price: parseFloat(row['RETAIL PRICE']) || 0,
    oldPrice: parseFloat(row['RETAIL PRICE']) * 1.2,
    hotSale: row['PRODUCT IN OUTLET'] ? true : false,
    imgSrc: row['PICTURES'] || '',
    imgHover: row['PICTURES'] || '',
    isOnisOnSale: row['PRODUCT IN OUTLET'] ? true : false,
    salePercentage: row['PRODUCT IN OUTLET'] ? '25%' : null,
    colors: [
      {
        bgColor: 'bg-light-blue',
        imgSrc: row['PICTURES'] || '',
      }
    ],
    filterBrands: [row['BRAND'] || ''],
    inStock: parseInt(row['AVAILABLE STOCK']) > 0,
    filterColor: extractColor(row['PRODUCT DESCRIPTION']),
    filterSizes: extractSize(row['PRODUCT DESCRIPTION']),
    tabFilterOptions2: ['New Arrivals'],
    tabFilterOptions: ['Tops', 'Sale'],
  };
}

// Simple example: extract color from product description
function extractColor(description) {
  const colorMatch = description.match(/\b(Black|Blue|Red|Green|Pink|Grey|Yellow)\b/i);
  return colorMatch ? [capitalize(colorMatch[0])] : ['Unknown'];
}

// Simple example: extract size from product description (looks for numbers like 34-37)
function extractSize(description) {
  const sizeMatch = description.match(/\b\d{2}-\d{2}\b/);
  return sizeMatch ? [sizeMatch[0]] : ['M'];
}

// Capitalize helper
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Read CSV and process
const results = [];

fs.createReadStream(csvFilePath)
  .pipe(csv({ separator: ';' }))
  .on('data', (row) => {
    const json = transformRow(row);
    results.push(json);
  })
  .on('end', () => {
    const fileContent = `export const products = ${JSON.stringify(results, null, 2)};`;

    fs.writeFile(outputFileName, fileContent, (err) => {
      if (err) throw err;
      console.log(`✅ JSON exported to ${outputFileName}`);
    });
  });
