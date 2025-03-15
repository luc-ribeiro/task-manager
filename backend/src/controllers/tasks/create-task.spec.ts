import { taskController } from "../index";
import { TaskRepository } from "../../repositories/task";
import { Request, Response } from "express";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock('../../repositories/task');

describe('Create Task Unit Test', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = { body: {} };
    res = { 
      status: jest.fn().mockReturnThis() as unknown as Response['status'], 
      json: jest.fn() as unknown as Response['json'] 
    };
  });

  it('should create a new task', async () => {
    const taskData = { title: 'Nova Tarefa', description: 'Descrição', status: 'pendente' };
    const createdTask = { id: 1, ...taskData, created_at: new Date(), updated_at: new Date() };
    req.body = taskData;
    
    const typedCreatedTask = {
      ...createdTask,
      status: 'pendente' as 'pendente' | 'em andamento' | 'concluída'
    };
    
    jest.spyOn(TaskRepository, 'create').mockResolvedValue(typedCreatedTask);
    
    await taskController.createTask(req as Request, res as Response);

    expect(TaskRepository.create).toHaveBeenCalledWith(taskData);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(typedCreatedTask);
  });

  it('should use default status when not provided', async () => {
    const taskData = { title: 'Nova Tarefa', description: 'Descrição' };
    const expectedData = { title: 'Nova Tarefa', description: 'Descrição', status: 'pendente' };
    const createdTask = { id: 1, ...expectedData, created_at: new Date(), updated_at: new Date() };
    req.body = taskData;
    
    const typedCreatedTask = {
      ...createdTask,
      status: 'pendente' as 'pendente' | 'em andamento' | 'concluída'
    };
    
    jest.spyOn(TaskRepository, 'create').mockResolvedValue(typedCreatedTask);
    
    await taskController.createTask(req as Request, res as Response);

    expect(TaskRepository.create).toHaveBeenCalledWith(expectedData);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(typedCreatedTask);
  });

  it('should return 500 when an error occurs', async () => {
    req.body = { title: 'Nova Tarefa', description: 'Descrição' };
    
    jest.spyOn(TaskRepository, 'create').mockRejectedValue(new Error('Database error'));
    
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    await taskController.createTask(req as Request, res as Response);
    
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error creating task' });
  });
});