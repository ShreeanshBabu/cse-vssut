import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    body: {
      type: String,
      required: [true, 'Body is required'],
    },
    priority: {
      type: String,
      enum: ['urgent', 'normal', 'low'],
      default: 'normal',
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

noticeSchema.index({ createdAt: -1 });

const Notice = mongoose.model('Notice', noticeSchema);
export default Notice;
