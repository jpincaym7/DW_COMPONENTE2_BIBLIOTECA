import { Route, Routes } from 'react-router-dom';
import { ROLES } from '@biblioteca/shared';

import { AuthLayout } from '../layouts/AuthLayout.jsx';
import { MainLayout } from '../layouts/MainLayout.jsx';
import { AuthorsPage } from '../pages/AuthorsPage.jsx';
import { BookDetailPage } from '../pages/BookDetailPage.jsx';
import { BookFormPage } from '../pages/BookFormPage.jsx';
import { BooksPage } from '../pages/BooksPage.jsx';
import { CategoriesPage } from '../pages/CategoriesPage.jsx';
import { DashboardPage } from '../pages/DashboardPage.jsx';
import { ForbiddenPage } from '../pages/ForbiddenPage.jsx';
import { LoansAdminPage } from '../pages/LoansAdminPage.jsx';
import { LoginPage } from '../pages/LoginPage.jsx';
import { MyLoansPage } from '../pages/MyLoansPage.jsx';
import { NotFoundPage } from '../pages/NotFoundPage.jsx';
import { RegisterPage } from '../pages/RegisterPage.jsx';
import { StyleguidePage } from '../pages/StyleguidePage.jsx';
import { UsersPage } from '../pages/UsersPage.jsx';
import { ProtectedRoute, PublicRoute } from './ProtectedRoute.jsx';
import { PATHS } from './paths.js';

export const AppRouter = () => (
  <Routes>
    <Route element={<PublicRoute />}>
      <Route element={<AuthLayout />}>
        <Route path={PATHS.LOGIN} element={<LoginPage />} />
        <Route path={PATHS.REGISTER} element={<RegisterPage />} />
      </Route>
    </Route>

    <Route element={<ProtectedRoute />}>
      <Route element={<MainLayout />}>
        <Route path={PATHS.DASHBOARD} element={<DashboardPage />} />
        <Route path={PATHS.BOOKS} element={<BooksPage />} />
        <Route path={PATHS.BOOK_DETAIL()} element={<BookDetailPage />} />
        <Route path={PATHS.MY_LOANS} element={<MyLoansPage />} />
        <Route path={PATHS.STYLEGUIDE} element={<StyleguidePage />} />
        <Route path={PATHS.FORBIDDEN} element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Route>

    <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
      <Route element={<MainLayout />}>
        <Route path={PATHS.BOOK_NEW} element={<BookFormPage />} />
        <Route path={PATHS.BOOK_EDIT()} element={<BookFormPage />} />
        <Route path={PATHS.ADMIN_LOANS} element={<LoansAdminPage />} />
        <Route path={PATHS.ADMIN_CATEGORIES} element={<CategoriesPage />} />
        <Route path={PATHS.ADMIN_AUTHORS} element={<AuthorsPage />} />
        <Route path={PATHS.ADMIN_USERS} element={<UsersPage />} />
      </Route>
    </Route>
  </Routes>
);
