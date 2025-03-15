import { taskController } from "../index";
import { TaskRepository } from "../../repositories/task";
import { Request, Response } from "express";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock('../../repositories/task');

describe('Update Task Unit Test', () => {
  let req: Partial<Request>;
  let res: Partial<Response>; 

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = { 
      status: jest.fn().mockReturnThis() as unknown as Response['status'], 
      json: jest.fn() as unknown as Response['json'] 
    };
  });

  it('should update an existing task', async () => {
    req.params = { id: '1' };
    req.body = { 
      title: 'Tarefa Atualizada', 
      description: 'Descrição Atualizada', 
      status: 'em andamento' 
    };
    
    const updatedTask = { 
      id: 1, 
      ...req.body,
      status: 'em andamento' as 'pendente' | 'em andamento' | 'concluída',
      created_at: new Date(),
      updated_at: new Date()
    };
    
    jest.spyOn(TaskRepository, 'update').mockResolvedValue(updatedTask);
    
    await taskController.updateTask(req as Request, res as Response);
    
    expect(TaskRepository.update).toHaveBeenCalledWith('1', {
      title: 'Tarefa Atualizada',
      description: 'Descrição Atualizada',
      status: 'em andamento'
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedTask);
  });

  it('should update only the provided fields', async () => {
    req.params = { id: '1' };
    req.body = { title: 'Apenas Título Atualizado' };
    
    const updatedTask = { 
      id: 1, 
      title: 'Apenas Título Atualizado',
      description: 'Descrição Original',
      status: 'pendente' as 'pendente' | 'em andamento' | 'concluída',
      created_at: new Date(),
      updated_at: new Date()
    };
    
    jest.spyOn(TaskRepository, 'update').mockResolvedValue(updatedTask);
    
    await taskController.updateTask(req as Request, res as Response);
    
    expect(TaskRepository.update).toHaveBeenCalledWith('1', {
      title: 'Apenas Título Atualizado',
      description: undefined,
      status: undefined
    });
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedTask);
  });

  it('should return 404 when the task does not exist', async () => {
    req.params = { id: '999' };
    req.body = { title: 'Tarefa Inexistente' };
    
    jest.spyOn(TaskRepository, 'update').mockResolvedValue(null);
    
    await taskController.updateTask(req as Request, res as Response);
    
    expect(TaskRepository.update).toHaveBeenCalledWith('999', expect.any(Object));
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
  });

  it('should return 500 when an error occurs', async () => {
    req.params = { id: '1' };
    req.body = { title: 'Tarefa Erro' };
    
    jest.spyOn(TaskRepository, 'update').mockRejectedValue(new Error('Database error'));
    
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    await taskController.updateTask(req as Request, res as Response);
    
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error updating task' });
  });
});
