import mongoose from 'mongoose';

const { Schema } = mongoose;

const productCategorySchema = new Schema({
    id: {
        type: Schema.Types.ObjectId,
    },
    title: {
        type: String,
    },
    slug: {
        type: String,
    },
    parentId: {
        type: String,
        default: "",
    },
    url: {
        type: String,
        default: "",
    },
    description: {
        type: String,
    },
    customCategoryTitle: {
        type: String,
    },
    categoryImage: {
        type: Object,
    },
    categoryFeaturedImage: {
        type: Object,
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
    delete: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: Schema.Types.ObjectId
    },
}, { timestamps: true });

const ProductCategory = mongoose.models.ProductCategory || mongoose.model('ProductCategory', productCategorySchema);

export default ProductCategory;