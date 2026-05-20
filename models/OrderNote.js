import mongoose from 'mongoose';

const { Schema } = mongoose;

const orderNoteSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Order'
    },
    changeBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    customMessage: {
        type: String,
    },
}, { timestamps: true });

const OrderNote = mongoose.models.OrderNote || mongoose.model('OrderNote', orderNoteSchema);

export default OrderNote;