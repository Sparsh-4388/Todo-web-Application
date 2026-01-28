import { Router } from 'express';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoStatus
} from '../controllers/todo.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/todos - Get all todos for authenticated user
router.get('/', getTodos);

// POST /api/todos - Create a new todo
router.post('/', createTodo);

// PUT /api/todos/:id - Update a todo
router.put('/:id', updateTodo);

// DELETE /api/todos/:id - Delete a todo
router.delete('/:id', deleteTodo);

// PATCH /api/todos/:id/toggle - Toggle todo completion status
router.patch('/:id/toggle', toggleTodoStatus);

export default router;