import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    phone: {
      type: String,
      default: '',
    },
    researchAreas: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    googleScholarUrl: {
      type: String,
      default: '',
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

facultySchema.index({ displayOrder: 1 });

const Faculty = mongoose.model('Faculty', facultySchema);
export default Faculty;
