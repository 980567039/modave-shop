import mongoose from 'mongoose';
import User from './User';

const { Schema } = mongoose;

const MediaLibrarySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true,
  },
  type: {
    type: String,
  },
  title: {
    type: String,
  },
  alt: {
    type: String,
  },
  description: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
  access: {
    type: Array,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const MediaLibrary = mongoose.models.MediaLibrary || mongoose.model('MediaLibrary', MediaLibrarySchema);

export default MediaLibrary;