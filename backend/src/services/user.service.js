import { ROLES } from '@biblioteca/shared';

import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { buildListQuery } from '../utils/queryFeatures.js';

const findUserOrFail = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError('El usuario no existe', 404);
  }

  return user;
};

const assertIsNotSelf = (requester, targetId, message) => {
  if (requester.id === targetId) {
    throw new AppError(message, 409);
  }
};

export const listUsers = (query) =>
  buildListQuery(User, query, {
    searchFields: ['name', 'email'],
    filters: { role: query.role },
    defaultSort: 'name'
  });

export const getUserById = (id) => findUserOrFail(id);

export const updateUserRole = async (requester, id, role) => {
  assertIsNotSelf(requester, id, 'No puede modificar su propio rol');

  const user = await findUserOrFail(id);

  user.role = role;
  await user.save();

  return user;
};

export const updateUserStatus = async (requester, id, isActive) => {
  assertIsNotSelf(requester, id, 'No puede desactivar su propia cuenta');

  const user = await findUserOrFail(id);

  if (!isActive && user.role === ROLES.ADMIN) {
    const activeAdmins = await User.countDocuments({ role: ROLES.ADMIN, isActive: true });

    if (activeAdmins <= 1) {
      throw new AppError('Debe existir al menos un administrador activo', 409);
    }
  }

  user.isActive = isActive;
  await user.save();

  return user;
};
