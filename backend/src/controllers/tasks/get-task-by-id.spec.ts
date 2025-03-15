import { taskController } from "../index";
import { TaskRepository } from "../../repositories/task";
import { Request, Response } from "express";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock('../../repositories/task');

describe('Get Task By Id Unit Test', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = { params: {} };
    res = { 
      status: jest.fn().mockReturnThis() as unknown as Response['status'], 
      json: jest.fn() as unknown as Response['json'] 
    };
  });

  it('should return a task when found', async () => {
    req.params = { id: '1' };
    
    const mockTask = { 
      id: 1, 
      title: 'Tarefa 1', 
      description: 'Descrição 1', 
      status: 'pendente' as 'pendente' | 'em andamento' | 'concluída',
      created_at: new Date(),
      updated_at: new Date()
    };
    
    jest.spyOn(TaskRepository, 'findById').mockResolvedValue(mockTask);
    
    await taskController.getTaskById(req as Request, res as Response);
    
    expect(TaskRepository.findById).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTask);
  });

  it('should return 404 when the task does not exist', async () => {
    req.params = { id: '999' };
    
    jest.spyOn(TaskRepository, 'findById').mockResolvedValue(null);
    
    await taskController.getTaskById(req as Request, res as Response);
    
    expect(TaskRepository.findById).toHaveBeenCalledWith('999');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
  });

  it('should return 500 when an error occurs', async () => {
    req.params = { id: '1' };
    
    jest.spyOn(TaskRepository, 'findById').mockRejectedValue(new Error('Database error'));
    
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    await taskController.getTaskById(req as Request, res as Response);
    
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching task' });
  });
});
