export const PATHS = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/',
  BOOKS: '/books',
  BOOK_NEW: '/books/new',
  BOOK_DETAIL: (id = ':id') => `/books/${id}`,
  BOOK_EDIT: (id = ':id') => `/books/${id}/edit`,
  MY_LOANS: '/my-loans',
  ADMIN_LOANS: '/admin/loans',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_AUTHORS: '/admin/authors',
  ADMIN_USERS: '/admin/users',
  STYLEGUIDE: '/styleguide',
  FORBIDDEN: '/403'
};
