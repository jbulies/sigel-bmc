import { Router } from 'express';
import { 
  register, 
  login, 
  verifyInvitation,
  requestPasswordReset,
  resetPassword
} from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-invitation/:token', verifyInvitation);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;