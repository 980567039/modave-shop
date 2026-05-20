import mongoose from 'mongoose';

const { Schema } = mongoose;

const storeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    general:{
        type: Object,
        default: {},
    },
    shipping:{
        type: Object,
        default: {},
    },
    offers:{
        type: Object,
        default: {},
    },
    payments: {
        type: Object,
        default: {
            paypal: true,
            stripe: true,
        },
    },
    productsSettings: {
        type: Object,
        default: {},
    },
    emails: {
        type: Object,
        default: {},
    },
    theme: {
        type: Schema.Types.ObjectId,
        ref: 'StoreTheme'
    }
}, { timestamps: true });

const Store = mongoose.models.Store || mongoose.model('Store', storeSchema);

export default Store;