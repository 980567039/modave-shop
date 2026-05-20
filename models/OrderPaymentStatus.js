import mongoose from 'mongoose';

const { Schema } = mongoose;

const orderPaymentStatusSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Order'
    },
    status: {
        type: String,
        required: true,
    },
    changeBy: {
        type: String,
    },
    customMessage: {
        type: String,
    },
    statusDate: {
        type: Date,
    },
    previousStatus:{
        type:String,
    }
}, { timestamps: true });

const OrderPaymentStatus = mongoose.models.OrderPaymentStatus || mongoose.model('OrderPaymentStatus', orderPaymentStatusSchema);

export default OrderPaymentStatus;