import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { signToken } from '../utils/jwt.js';

const buildTokenForUser = (user) => signToken({ sub: user.id, role: user.role });

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError('El correo ya se encuentra registrado', 409, [
      { field: 'email', message: 'El correo ya se encuentra registrado' }
    ]);
  }

  const user = await User.create({ name, email, password });

  return { user, token: buildTokenForUser(user) };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Las credenciales son incorrectas', 401);
  }

  if (!user.isActive) {
    throw new AppError('La cuenta se encuentra desactivada', 403);
  }

  user.password = undefined;

  return { user, token: buildTokenForUser(user) };
};
