import { taskController } from "../index";
import { TaskRepository } from "../../repositories/task";
import { Request, Response } from "express";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock('../../repositories/task');

describe('Delete Task Unit Test', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = { params: {} };
    res = { 
      status: jest.fn().mockReturnThis() as unknown as Response['status'], 
      json: jest.fn() as unknown as Response['json'] 
    };
  });

  it('should delete a task', async () => {
    req.params = { id: '1' };
    
    jest.spyOn(TaskRepository, 'delete').mockResolvedValue(true);
    
    await taskController.deleteTask(req as Request, res as Response);
    
    expect(TaskRepository.delete).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Task deleted successfully' });
  });

  it('should return 404 when the task does not exist', async () => {
    req.params = { id: '999' };
    
    jest.spyOn(TaskRepository, 'delete').mockResolvedValue(false);
    
    await taskController.deleteTask(req as Request, res as Response);
    
    expect(TaskRepository.delete).toHaveBeenCalledWith('999');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
  });

  it('should return 500 when an error occurs', async () => {
    req.params = { id: '1' };
    
    jest.spyOn(TaskRepository, 'delete').mockRejectedValue(new Error('Database error'));
    
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    await taskController.deleteTask(req as Request, res as Response);
    
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error deleting task' });
  });
});
