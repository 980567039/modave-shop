import mongoose from 'mongoose';
import OrderPayments from './OrderPayments';
import User from './User';
import moment from 'moment-timezone';

const { Schema } = mongoose;

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    customOrderId: {
        type: String,
    },
    ipAddress: {
        type: String,
    },
    ipAddressData: {
        type: Object,
    },
    userSiteUniqueID: {
        type: String,
    },
    date: {
        type: Date,
    },
    items: {
        type: Array,
        default: []
    },
    emailSent: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: [
            "pending",
            "confirmed",
            "processing",
            "onHold",
            "shipped",
            "outForDelivery",
            "delivered",
            "cancelled",
            "refunded",
            "failed",
            "returned",
            "completed",
            "awaitingPayment",
            "confirmPayment",
            "paymentFailed",
            "awaitingFulfillment",
            "awaitingShipment"
        ],
        default: "pending",
    },
    paymentStatus: {
        type: String,
    },
    billingAddress: {
        type: Object,
        default: {},
    },
    shippingAddress: {
        type: Object,
        default: {},
    },
    payment: {
        type: Object,
    },
    paymentId: {
        type: Schema.Types.ObjectId,
        ref: 'OrderPayments'
    },
    orderNote: {
        type: String,
    },
    isNewOrder: {
        type: Boolean,
        default: true,
    },
    fulfillmentType: {
        type: String,
        default: 'delivery',
    },
    pickUpLocation: {
        type: String,
        default: '',
    },
    pickupDate: {
        type: Date,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    delete: {
        type: Boolean,
        default: false,
    },
    offersApplied: {
        type: Boolean,
        default: false,
    },
    typeOfOffer: {
        type: Object,
        default: {},
    },
    totalOrderAmount: {
        type: Number,
    },
    crossSiteReturnUrl: {
        type: String,
    },
}, {
    // Custom timestamp options
    timestamps: {
        currentTime: () => moment.tz('Asia/Colombo').toDate()
    }
});

// Pre-save middleware to generate custom order ID
orderSchema.pre('save', async function (next) {
    if (!this.customOrderId) {
        try {
            const lastOrder = await this.constructor.findOne({}, {}, { sort: { createdAt: -1 } });

            if (lastOrder && lastOrder.customOrderId) {
                const lastOrderId = parseInt(lastOrder.customOrderId.slice(-6)) || 0; // Extract the last 6 digits and convert to number
                const newUserId = `ORD${(lastOrderId + 1).toString().padStart(6, '0')}`; // Increment the number and pad with leading zeros
                this.customOrderId = newUserId;
            } else {
                this.customOrderId = 'ORD000001'; // If no existing user or customOrderId, set a default value
            }
        } catch (error) {
            console.error('Error finding last order:', error);
        }
    }

    // Set current date in Sri Lanka timezone if date field is not set
    if (!this.date) {
        this.date = moment.tz('Asia/Colombo').toDate();
    }

    next();
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;