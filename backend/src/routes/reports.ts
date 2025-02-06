import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getReports, createReport, updateReport, deleteReport } from '../controllers/report.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', getReports);
router.post('/', createReport);
router.put('/:id', updateReport);
router.delete('/:id', deleteReport);

export default router;