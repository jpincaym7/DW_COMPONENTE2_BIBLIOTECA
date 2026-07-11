import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      unique: true,
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
      maxlength: [40, 'El nombre no puede exceder 40 caracteres']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'La descripcion no puede exceder 200 caracteres'],
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const Category = mongoose.model('Category', categorySchema);
