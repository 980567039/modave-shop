import mongoose from 'mongoose';

const { Schema } = mongoose;

const productAttributesSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId,
    },
    name: {
        type: String,
    },
    slug: {
        type: String,
    },
    descriptions: {
        type: String,
    },
    delete: {
        type: Boolean,
        default: false,
    },
    terms: {
        type: Array,
        default: [],
    },
    createdBy: {
        type: Schema.Types.ObjectId
    },
}, { timestamps: true });

const ProductAttributes = mongoose.models.ProductAttributes || mongoose.model('ProductAttributes', productAttributesSchema);

export default ProductAttributes;