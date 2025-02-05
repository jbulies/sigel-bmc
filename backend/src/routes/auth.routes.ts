import { Router } from 'express';
import { register, login, verifyInvitation } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-invitation/:token', verifyInvitation);

export default router;