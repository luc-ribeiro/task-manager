import { Request, Response } from 'express';
import { TaskRepository } from '../../repositories/task.ts';

/**
 * Update an existing task
 * @route PUT /api/tasks/:id
 */
export const updateTask = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { title, description, status } = req.body;
    const taskId = req.params.id;
    
    const updatedTask = await TaskRepository.update(taskId, {
      title,
      description,
      status
    });
    
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ message: 'Error updating task' });
  }
}; 