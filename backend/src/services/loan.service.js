import { LOAN_DAYS, LOAN_STATUS, MAX_ACTIVE_LOANS, ROLES } from '@biblioteca/shared';

import { Book } from '../models/Book.js';
import { Loan } from '../models/Loan.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { buildListQuery } from '../utils/queryFeatures.js';

const LOAN_POPULATE = [
  { path: 'book', select: 'title isbn coverUrl' },
  { path: 'user', select: 'name email' }
];

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

const buildDefaultDueDate = () => new Date(Date.now() + LOAN_DAYS * DAY_IN_MILLISECONDS);

const withOverdueStatus = (loan) => {
  if (loan.status !== LOAN_STATUS.ACTIVE) {
    return loan;
  }

  const isOverdue = new Date(loan.dueDate).getTime() < Date.now();

  return isOverdue ? { ...loan, status: LOAN_STATUS.OVERDUE } : loan;
};

const reserveCopy = async (bookId) => {
  const book = await Book.findOneAndUpdate(
    { _id: bookId, isActive: true, availableCopies: { $gt: 0 } },
    { $inc: { availableCopies: -1 } },
    { new: true }
  );

  if (!book) {
    const exists = await Book.exists({ _id: bookId, isActive: true });

    if (!exists) {
      throw new AppError('El libro no existe', 404);
    }

    throw new AppError('No hay ejemplares disponibles de este libro', 409);
  }

  return book;
};

const releaseCopy = (bookId) =>
  Book.updateOne({ _id: bookId, $expr: { $lt: ['$availableCopies', '$totalCopies'] } }, {
    $inc: { availableCopies: 1 }
  });

const assertUserCanBorrow = async (userId) => {
  const activeLoans = await Loan.countDocuments({ user: userId, status: LOAN_STATUS.ACTIVE });

  if (activeLoans >= MAX_ACTIVE_LOANS) {
    throw new AppError(`No puede tener mas de ${MAX_ACTIVE_LOANS} prestamos activos`, 409);
  }
};

const resolveLoanOwner = async (requester, requestedUserId) => {
  if (!requestedUserId || requestedUserId === requester.id) {
    return requester.id;
  }

  if (requester.role !== ROLES.ADMIN) {
    throw new AppError('No puede registrar prestamos a nombre de otro usuario', 403);
  }

  const owner = await User.exists({ _id: requestedUserId, isActive: true });

  if (!owner) {
    throw new AppError('El usuario seleccionado no existe', 404, [
      { field: 'user', message: 'El usuario seleccionado no existe' }
    ]);
  }

  return requestedUserId;
};

export const createLoan = async (requester, { book: bookId, user: requestedUserId, dueDate, notes }) => {
  const ownerId = await resolveLoanOwner(requester, requestedUserId);

  await assertUserCanBorrow(ownerId);
  await reserveCopy(bookId);

  try {
    const loan = await Loan.create({
      book: bookId,
      user: ownerId,
      dueDate: dueDate ?? buildDefaultDueDate(),
      notes: notes ?? ''
    });

    return loan.populate(LOAN_POPULATE);
  } catch (error) {
    await releaseCopy(bookId);

    if (error.code === 11000) {
      throw new AppError('Ya tiene un prestamo activo de este libro', 409);
    }

    throw error;
  }
};

const listLoansWithFilters = async (query, filters) => {
  const { items, meta } = await buildListQuery(Loan, query, {
    filters,
    populate: LOAN_POPULATE,
    defaultSort: '-loanDate'
  });

  return { items: items.map(withOverdueStatus), meta };
};

export const listLoans = (query) =>
  listLoansWithFilters(query, {
    status: query.status,
    user: query.user,
    book: query.book
  });

export const listLoansByUser = (userId, query) =>
  listLoansWithFilters(query, { user: userId, status: query.status });

export const getLoanById = async (requester, id) => {
  const loan = await Loan.findById(id).populate(LOAN_POPULATE).lean();

  if (!loan) {
    throw new AppError('El prestamo no existe', 404);
  }

  const isOwner = loan.user?._id?.toString() === requester.id;

  if (!isOwner && requester.role !== ROLES.ADMIN) {
    throw new AppError('No tiene permisos para consultar este prestamo', 403);
  }

  return withOverdueStatus(loan);
};

export const returnLoan = async (id) => {
  const loan = await Loan.findById(id);

  if (!loan) {
    throw new AppError('El prestamo no existe', 404);
  }

  if (loan.status === LOAN_STATUS.RETURNED) {
    throw new AppError('El prestamo ya fue devuelto', 409);
  }

  loan.status = LOAN_STATUS.RETURNED;
  loan.returnDate = new Date();
  await loan.save();

  await releaseCopy(loan.book);

  return loan.populate(LOAN_POPULATE);
};

export const deleteLoan = async (id) => {
  const loan = await Loan.findById(id);

  if (!loan) {
    throw new AppError('El prestamo no existe', 404);
  }

  if (loan.status === LOAN_STATUS.ACTIVE) {
    await releaseCopy(loan.book);
  }

  await loan.deleteOne();
};
