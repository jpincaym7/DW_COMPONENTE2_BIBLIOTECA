import { Router } from 'express';

import authRoutes from './auth.routes.js';
import authorRoutes from './author.routes.js';
import bookRoutes from './book.routes.js';
import categoryRoutes from './category.routes.js';
import loanRoutes from './loan.routes.js';
import statsRoutes from './stats.routes.js';
import userRoutes from './user.routes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'La API se encuentra operativa', data: null });
});

router.use('/auth', authRoutes);
router.use('/books', bookRoutes);
router.use('/categories', categoryRoutes);
router.use('/authors', authorRoutes);
router.use('/loans', loanRoutes);
router.use('/users', userRoutes);
router.use('/stats', statsRoutes);

export default router;
