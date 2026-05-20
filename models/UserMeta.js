import mongoose from 'mongoose';
import Order from './Order';
import User from './User';
import Product from './product/Product';
import ProductMaterial from './product/material/ProductMaterial';
import ProductCategory from './product/category/ProductCategory';
import ProductAttributes from './product/attribute/ProductAttributes';

const { Schema } = mongoose;

const userMetaSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    uniqueID:{
        type: String,
        default: ''
    },
    billingAddress:{
        type: Array,
        default: [],
    },
    shippingAddress: {
        type: Array,
        default: [],
    },
    interestProducts: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    interestCategories: [{
        type: Schema.Types.ObjectId,
        ref: 'ProductCategory'
    }],
    interestMaterials:  [{
        type: Schema.Types.ObjectId,
        ref: 'ProductMaterial'
    }],
    interestAttributes: [{
        type: Schema.Types.ObjectId,
        ref: 'ProductAttributes'
    }],
    parches: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }],
    wishlist: {
        type: Array,
        default: [],
    },
    reviews: {
        type: Array,
        default: [],
    }
});

const UserMeta = mongoose.models.UserMeta || mongoose.model('UserMeta', userMetaSchema);

export default UserMeta;