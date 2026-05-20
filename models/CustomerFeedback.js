import { apiReq } from '@/lib/common';
import mongoose from 'mongoose';

const { Schema } = mongoose;

const CustomerFeedbackSchema = new Schema({
    userId: {
        type: String,
    },
    title:{
        type: String,
    },

    type: {
        type: String,
    },
    context: {
        type: String,
    },
    image: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },

}, { timestamps: true });

const CustomerFeedback = mongoose.models.CustomerFeedback || mongoose.model('CustomerFeedback', CustomerFeedbackSchema);

export default CustomerFeedback;