import mongoose from 'mongoose';

import { LOAN_STATUS, LOAN_STATUS_VALUES } from '@biblioteca/shared';

const loanSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'El libro es obligatorio']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario es obligatorio']
    },
    loanDate: {
      type: Date,
      default: Date.now
    },
    dueDate: {
      type: Date,
      required: [true, 'La fecha de devolucion es obligatoria']
    },
    returnDate: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: { values: LOAN_STATUS_VALUES, message: 'El estado no es valido' },
      default: LOAN_STATUS.ACTIVE
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [300, 'Las notas no pueden exceder 300 caracteres'],
      default: ''
    }
  },
  { timestamps: true }
);

loanSchema.index({ user: 1, status: 1 });
loanSchema.index({ book: 1, status: 1 });
loanSchema.index({ dueDate: 1, status: 1 });
loanSchema.index(
  { user: 1, book: 1 },
  { unique: true, partialFilterExpression: { status: LOAN_STATUS.ACTIVE } }
);

export const Loan = mongoose.model('Loan', loanSchema);
