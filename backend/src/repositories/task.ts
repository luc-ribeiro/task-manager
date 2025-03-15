import { query } from '../../db/database.ts';
import { Task, TaskCreationAttributes, TaskUpdateAttributes } from '../types/tasks.ts';

/**
 * Database operations for tasks
 */
export const TaskRepository = {
  /**
   * Search all tasks
   * @returns List of tasks
   */
  findAll: async (): Promise<Task[]> => {
    return await query<Task[]>('SELECT * FROM tasks ORDER BY created_at DESC');
  },

  /**
   * Search a task by ID
   * @param id Task ID
   * @returns Found task or null
   */
  findById: async (id: number | string): Promise<Task | null> => {
    const tasks = await query<Task[]>('SELECT * FROM tasks WHERE id = ?', [id]);
    return tasks.length > 0 ? tasks[0] : null;
  },

  /**
   * Create a new task
   * @param task Task data to be created
   * @returns Created task
   */
  create: async (task: TaskCreationAttributes): Promise<Task> => {
    const result = await query<{ insertId: number }>(
      'INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)',
      [task.title, task.description || null, task.status || 'pendente']
    );
    
    return await TaskRepository.findById(result.insertId) as Task;
  },

  /**
   * Update an existing task
   * @param id Task ID
   * @param task Task data to be updated
   * @returns Updated task or null if not found
   */
  update: async (id: number | string, task: TaskUpdateAttributes): Promise<Task | null> => {
    const existingTask = await TaskRepository.findById(id);
    if (!existingTask) {
      return null;
    }
    
    const updates: string[] = [];
    const values: (string | null)[] = [];
    
    if (task.title !== undefined) {
      updates.push('title = ?');
      values.push(task.title);
    }
    
    if (task.description !== undefined) {
      updates.push('description = ?');
      values.push(task.description);
    }
    
    if (task.status !== undefined) {
      updates.push('status = ?');
      values.push(task.status);
    }
    
    if (updates.length === 0) {
      return existingTask;
    }
    
    values.push(id.toString());
    
    await query(
      `UPDATE tasks SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );
    
    return await TaskRepository.findById(id) as Task;
  },

  /**
   * Remove a task
   * @param id Task ID
   * @returns true if removed successfully, false if not found
   */
  delete: async (id: number | string): Promise<boolean> => {
    const existingTask = await TaskRepository.findById(id);
    if (!existingTask) {
      return false;
    }
    
    await query('DELETE FROM tasks WHERE id = ?', [id]);
    return true;
  }
}; 