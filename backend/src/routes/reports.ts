import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

// Placeholder route for reports
router.get('/', (req, res) => {
  res.json({ message: 'Reports route' });
});

export default router;