import { LOAN_STATUS } from '@biblioteca/shared';

import { Book } from '../models/Book.js';
import { Loan } from '../models/Loan.js';
import { User } from '../models/User.js';

const TOP_CATEGORIES_LIMIT = 5;

const getTopCategories = () =>
  Book.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', total: { $sum: 1 } } },
    { $sort: { total: -1 } },
    { $limit: TOP_CATEGORIES_LIMIT },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' },
    { $project: { _id: 0, name: '$category.name', total: 1 } }
  ]);

export const getAdminSummary = async () => {
  const now = new Date();

  const [totalBooks, totalUsers, activeLoans, overdueLoans, topCategories] = await Promise.all([
    Book.countDocuments({ isActive: true }),
    User.countDocuments({ isActive: true }),
    Loan.countDocuments({ status: LOAN_STATUS.ACTIVE }),
    Loan.countDocuments({ status: LOAN_STATUS.ACTIVE, dueDate: { $lt: now } }),
    getTopCategories()
  ]);

  return { totalBooks, totalUsers, activeLoans, overdueLoans, topCategories };
};

export const getUserSummary = async (userId) => {
  const now = new Date();

  const [activeLoans, overdueLoans, returnedLoans, availableBooks] = await Promise.all([
    Loan.countDocuments({ user: userId, status: LOAN_STATUS.ACTIVE }),
    Loan.countDocuments({ user: userId, status: LOAN_STATUS.ACTIVE, dueDate: { $lt: now } }),
    Loan.countDocuments({ user: userId, status: LOAN_STATUS.RETURNED }),
    Book.countDocuments({ isActive: true, availableCopies: { $gt: 0 } })
  ]);

  return { activeLoans, overdueLoans, returnedLoans, availableBooks };
};
