// models/UserActivity.js
import Mongoose from "mongoose";

const { Schema } = Mongoose;

const UserActivitySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true,
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
  requestData: {
    type: Mongoose.Schema.Types.Mixed,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const UserActivity = Mongoose.models.UserActivitySchema || Mongoose.model('UserActivity', UserActivitySchema);

export default UserActivity;
