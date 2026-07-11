import mongoose from 'mongoose';

import { MIN_PUBLICATION_YEAR } from '@biblioteca/shared';

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      unique: true,
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
      maxlength: [80, 'El nombre no puede exceder 80 caracteres']
    },
    nationality: {
      type: String,
      trim: true,
      maxlength: [50, 'La nacionalidad no puede exceder 50 caracteres'],
      default: ''
    },
    birthYear: {
      type: Number,
      min: [MIN_PUBLICATION_YEAR, `El anio no puede ser anterior a ${MIN_PUBLICATION_YEAR}`],
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const Author = mongoose.model('Author', authorSchema);
