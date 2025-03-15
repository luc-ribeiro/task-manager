import { Request, Response } from 'express';
import { TaskRepository } from '../../repositories/task.ts';

/**
 * Delete a task
 * @route DELETE /api/tasks/:id
 */
export const deleteTask = async (req: Request, res: Response): Promise<Response> => {
  try {
    const taskId = req.params.id;
    const deleted = await TaskRepository.delete(taskId);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ message: 'Error deleting task' });
  }
}; 