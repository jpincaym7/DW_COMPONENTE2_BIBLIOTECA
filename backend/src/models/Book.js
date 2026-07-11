import mongoose from 'mongoose';

import { MIN_PUBLICATION_YEAR } from '@biblioteca/shared';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El titulo es obligatorio'],
      trim: true,
      minlength: [2, 'El titulo debe tener al menos 2 caracteres'],
      maxlength: [150, 'El titulo no puede exceder 150 caracteres']
    },
    isbn: {
      type: String,
      required: [true, 'El ISBN es obligatorio'],
      unique: true,
      trim: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author',
      required: [true, 'El autor es obligatorio']
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'La categoria es obligatoria']
    },
    publisher: {
      type: String,
      trim: true,
      maxlength: [80, 'La editorial no puede exceder 80 caracteres'],
      default: ''
    },
    publicationYear: {
      type: Number,
      required: [true, 'El anio de publicacion es obligatorio'],
      min: [MIN_PUBLICATION_YEAR, `El anio no puede ser anterior a ${MIN_PUBLICATION_YEAR}`]
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'La descripcion no puede exceder 1000 caracteres'],
      default: ''
    },
    coverUrl: {
      type: String,
      trim: true,
      default: ''
    },
    totalCopies: {
      type: Number,
      required: [true, 'Los ejemplares totales son obligatorios'],
      min: [1, 'Debe existir al menos un ejemplar']
    },
    availableCopies: {
      type: Number,
      required: true,
      min: [0, 'Los ejemplares disponibles no pueden ser negativos']
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

bookSchema.index({ title: 1 });
bookSchema.index({ category: 1, isActive: 1 });
bookSchema.index({ author: 1, isActive: 1 });

export const Book = mongoose.model('Book', bookSchema);
