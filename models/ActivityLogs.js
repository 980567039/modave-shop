import mongoose from 'mongoose';

const { Schema } = mongoose;

const ActivityLogsSchema = new Schema({
    userId: {
        type: String,
    },
    type: {
        type: String,
    },

    activityType: {
        type: String,
        required: true,
    },
    activityDetails: {
        type: String,
    },
    endpoint: {
        type: String,
        required: true,
    },
    method: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },

}, { timestamps: true });

const ActivityLogs = mongoose.models.ActivityLogs || mongoose.model('ActivityLogs', ActivityLogsSchema);

export default ActivityLogs;