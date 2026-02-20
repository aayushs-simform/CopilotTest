import { Request, Response, NextFunction } from 'express';
import { TaskModel, CreateTaskDTO, UpdateTaskDTO, TaskResponse } from '../models/task.model';

export class TaskController {
  static async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const taskData: CreateTaskDTO = req.body;
      const task = TaskModel.create(taskData);

      const response: TaskResponse = {
        id: task.id,
        name: task.name,
        details: task.details,
        status: task.status,
        priority: task.priority,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      };

      res.status(201).json({
        status: true,
        message: 'Task created successfully',
        data: response
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tasks = TaskModel.findAll();

      const response: TaskResponse[] = tasks.map(task => ({
        id: task.id,
        name: task.name,
        details: task.details,
        status: task.status,
        priority: task.priority,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }));

      res.status(200).json({
        status: true,
        message: 'Tasks retrieved successfully',
        data: response
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const task = TaskModel.findById(id);

      if (!task) {
        res.status(404).json({
          status: false,
          message: 'Task not found'
        });
        return;
      }

      const response: TaskResponse = {
        id: task.id,
        name: task.name,
        details: task.details,
        status: task.status,
        priority: task.priority,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      };

      res.status(200).json({
        status: true,
        message: 'Task retrieved successfully',
        data: response
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateTaskDTO = req.body;

      const updatedTask = TaskModel.update(id, updateData);

      if (!updatedTask) {
        res.status(404).json({
          status: false,
          message: 'Task not found'
        });
        return;
      }

      const response: TaskResponse = {
        id: updatedTask.id,
        name: updatedTask.name,
        details: updatedTask.details,
        status: updatedTask.status,
        priority: updatedTask.priority,
        createdAt: updatedTask.createdAt,
        updatedAt: updatedTask.updatedAt
      };

      res.status(200).json({
        status: true,
        message: 'Task updated successfully',
        data: response
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = TaskModel.delete(id);

      if (!deleted) {
        res.status(404).json({
          status: false,
          message: 'Task not found'
        });
        return;
      }

      res.status(200).json({
        status: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}
