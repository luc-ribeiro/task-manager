import { Request, Response } from 'express';
import { TaskRepository } from '../../repositories/task.ts';

/**
 * Get a task by ID
 * @route GET /api/tasks/:id
 */
export const getTaskById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const task = await TaskRepository.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    return res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return res.status(500).json({ message: 'Error fetching task' });
  }
};