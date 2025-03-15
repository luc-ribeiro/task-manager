import { Request, Response } from 'express';
import { TaskRepository } from '../../repositories/task.ts';

/**
 * Create a new task
 * @route POST /api/tasks
 */
export const createTask = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { title, description, status } = req.body;
    
    const newTask = await TaskRepository.create({
      title,
      description,
      status: status || 'pendente'
    });
    
    return res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ message: 'Error creating task' });
  }
}; 