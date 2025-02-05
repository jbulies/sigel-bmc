import { Router } from 'express';
import { 
  getUsers, 
  updateUser, 
  deactivateUser, 
  getProfile,
  updateProfile 
} from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/', getUsers);
router.put('/:id', updateUser);
router.patch('/:id/deactivate', deactivateUser);

export default router;