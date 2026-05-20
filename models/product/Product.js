import mongoose from 'mongoose';
import MediaLibrary from '../MediaLibrary';
import ProductCategory from './category/ProductCategory';

const { Schema } = mongoose;

const productSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId,
    },
    title: {
        type: String,
    },
    titleSlug: {
        type: String,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
    },
    salePrice: {
        type: Number,
    },
    actualPrice: {
        type: Number,
    },
    modelInfo: {
        type: String,
    },
    stock: {
        type: String,
    },
    category: [{
        type: Schema.Types.ObjectId,
        ref: 'ProductCategory'
    }],
    material: {
        type: Schema.Types.ObjectId,
        ref: 'ProductMaterial'
    },
    materialComposition: {
        type: String,
    },
    defaultImage: {
        type: Schema.Types.ObjectId,
        ref: 'MediaLibrary'
    },
    imageGallery: [{
        type: Schema.Types.ObjectId,
        ref: 'MediaLibrary'
    }],
    attributes: {
        type: Array,
    },
    sku: {
        type: String,
    },
    mappedSku: {
        type: String,
    },
    seoTitle: {
        type: String,
    },
    seoDescription: {
        type: String,
    },
    seoKeywords: {
        type: String,
    },
    ogTitle: {
        type: String,
    },
    ogDescription: {
        type: String,
    },
    ogImage: {
        type: String,
    },
    visibility: {
        type: Boolean,
        default: true
    },
    isGiftCard: {
        type: Boolean,
        default: false
    },
    showInShopPage: {
        type: Boolean,
        default: true
    },
    inStock: {
        type: Boolean,
        default: true
    },
    sizeChart: {
        type: String,
    },
    delete: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: Schema.Types.ObjectId
    },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;