import express from 'express';
import { createBoard, getBoards, deleteBoard } from '../controllers/boardController';
import { protect} from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, createBoard);
router.get('/', protect, getBoards);
router.delete('/:boardId', protect, deleteBoard);

export default router;