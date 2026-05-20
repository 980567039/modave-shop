import mongoose from 'mongoose';

const { Schema } = mongoose;

const productMaterialSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId,
    },
    title: {
        type: String,
    },
    slug: {
        type: String,
    },
    image: {
        type: Object,
    },
    url: {
        type: String,
    },
    descriptions: {
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

const ProductMaterial = mongoose.models.ProductMaterial || mongoose.model('ProductMaterial', productMaterialSchema);

export default ProductMaterial;