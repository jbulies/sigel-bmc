import { Router } from 'express';
import { 
  createInvitation, 
  resendInvitation, 
  cancelInvitation, 
  getPendingInvitations 
} from '../controllers/invitation.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', createInvitation);
router.get('/pending', getPendingInvitations);
router.post('/:id/resend', resendInvitation);
router.delete('/:id', cancelInvitation);

export default router;