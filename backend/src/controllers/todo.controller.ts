import { Response, NextFunction } from 'express';
import { Todo } from '../models/Todo';
import { AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';

export const getTodos = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const todos = await Todo.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: todos
    });
  } catch (error) {
    next(error);
  }
};

export const createTodo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: 'Title is required'
      });
      return;
    }

    const todo = await Todo.create({
      userId: req.userId,
      title: title.trim(),
      description: description?.trim() || '',
      completed: false
    });

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: todo
    });
  } catch (error) {
    next(error);
  }
};

export const updateTodo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid todo ID'
      });
      return;
    }

    const todo = await Todo.findOne({
      _id: id,
      userId: req.userId
    });

    if (!todo) {
      res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
      return;
    }

    if (title !== undefined) todo.title = title.trim();
    if (description !== undefined) todo.description = description.trim();
    if (completed !== undefined) todo.completed = completed;

    await todo.save();

    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: todo
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTodo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid todo ID'
      });
      return;
    }

    const todo = await Todo.findOneAndDelete({
      _id: id,
      userId: req.userId
    });

    if (!todo) {
      res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const toggleTodoStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid todo ID'
      });
      return;
    }

    const todo = await Todo.findOne({
      _id: id,
      userId: req.userId
    });

    if (!todo) {
      res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
      return;
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.status(200).json({
      success: true,
      message: 'Todo status updated successfully',
      data: todo
    });
  } catch (error) {
    next(error);
  }
};