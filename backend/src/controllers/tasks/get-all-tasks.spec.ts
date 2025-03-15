import { taskController } from "../index";
import { TaskRepository } from "../../repositories/task";
import { Request, Response } from "express";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock('../../repositories/task');

describe('Get All Tasks Unit Test', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = { 
      status: jest.fn().mockReturnThis() as unknown as Response['status'], 
      json: jest.fn() as unknown as Response['json'] 
    };
  });

  it('should return all tasks', async () => {
    const mockTasks = [
      { 
        id: 1, 
        title: 'Tarefa 1', 
        description: 'Descrição 1', 
        status: 'pendente' as 'pendente' | 'em andamento' | 'concluída',
        created_at: new Date(),
        updated_at: new Date()
      },
      { 
        id: 2, 
        title: 'Tarefa 2', 
        description: 'Descrição 2', 
        status: 'em andamento' as 'pendente' | 'em andamento' | 'concluída',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    jest.spyOn(TaskRepository, 'findAll').mockResolvedValue(mockTasks);
    
    await taskController.getAllTasks(req as Request, res as Response);
    
    expect(TaskRepository.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTasks);
  });

  it('should return an empty list when there are no tasks', async () => {
    jest.spyOn(TaskRepository, 'findAll').mockResolvedValue([]);
    
    await taskController.getAllTasks(req as Request, res as Response);
    
    expect(TaskRepository.findAll).toHaveBeenCalled();
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('should return 500 when an error occurs', async () => {
    jest.spyOn(TaskRepository, 'findAll').mockRejectedValue(new Error('Database error'));
    
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    await taskController.getAllTasks(req as Request, res as Response);
    
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching tasks' });
  });
});
