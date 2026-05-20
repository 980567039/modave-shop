import mongoose from 'mongoose';

const { Schema } = mongoose;

const paymentsSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Order'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    amount: {
        type: Number,
    },
    paymentMethod: {
        type: String,
        default: 'cod'
    },
    customMessage: {
        type: String,
    },
    status: {
        type: String,
    },
    previousStatus:{
        type:String,
    },
    paymentData: {
        type: Object,
        default: {}
    },
    paymentDate: {
        type: Date,
    },
}, { timestamps: true });

const OrderPayments = mongoose.models.OrderPayments || mongoose.model('OrderPayments', paymentsSchema);

export default OrderPayments;