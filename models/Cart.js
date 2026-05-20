import mongoose from 'mongoose';

const { Schema } = mongoose;

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
    },
    uniqueID:{
        type: String,
        default: '',
    },
    ipAddress:{
        type: String,
    },
    browser: {
        type: String,
    },
    cart: {
        type: Array,
        default: [],
    },
}, { timestamps: true });

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export default Cart;