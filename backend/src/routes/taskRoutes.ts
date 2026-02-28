import express from 'express';
import { createTask, getTasks, updateTaskStatus, deleteTask } from '../controllers/taskController';
import { protect} from '../middleware/authMiddleware';

const router = express.Router();

router.post('/:boardId', protect, createTask);
router.get('/:boardId', protect, getTasks);
router.patch("/:taskId", protect, updateTaskStatus);
router.delete("/:taskId", protect, deleteTask);

export default router;