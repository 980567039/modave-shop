import mongoose from 'mongoose';

const { Schema } = mongoose;

const orderStatusSchema = new Schema({
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

const OrderStatus = mongoose.models.OrderStatus || mongoose.model('OrderStatus', orderStatusSchema);

export default OrderStatus;