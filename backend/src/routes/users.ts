import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

// Placeholder route for user profile
router.get('/profile', (req, res) => {
  res.json({ message: 'Profile route' });
});

export default router;