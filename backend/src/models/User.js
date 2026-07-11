import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { PASSWORD_MIN_LENGTH, ROLES, ROLE_VALUES } from '@biblioteca/shared';

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
      maxlength: [60, 'El nombre no puede exceder 60 caracteres']
    },
    email: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'La contrasena es obligatoria'],
      minlength: [PASSWORD_MIN_LENGTH, `La contrasena debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`],
      select: false
    },
    role: {
      type: String,
      enum: { values: ROLE_VALUES, message: 'El rol no es valido' },
      default: ROLES.USER
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (document, plainObject) => {
        delete plainObject.password;
        delete plainObject.__v;
        return plainObject;
      }
    }
  }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
