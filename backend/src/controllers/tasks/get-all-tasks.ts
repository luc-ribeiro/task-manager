import { Request, Response } from 'express';
import { TaskRepository } from '../../repositories/task.ts';

/**
 * Get all tasks
 * @route GET /api/tasks
 */
export const getAllTasks = async (req: Request, res: Response): Promise<Response> => {
  try {
    const tasks = await TaskRepository.findAll();
    return res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ message: 'Error fetching tasks' });
  }
}; 