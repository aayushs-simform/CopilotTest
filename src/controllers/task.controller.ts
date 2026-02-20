import { Request, Response, NextFunction } from 'express';
import { TaskModel } from '../models/task.model';
import { CreateTaskDTO, UpdateTaskDTO, TaskResponse } from '../dtos/task.dto';

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
        startDate: task.startDate,
        dueDate: task.dueDate,
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
        startDate: task.startDate,
        dueDate: task.dueDate,
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
        startDate: task.startDate,
        dueDate: task.dueDate,
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

      // Check if task exists first
      const existingTask = TaskModel.findById(id);
      if (!existingTask) {
        res.status(404).json({
          status: false,
          message: 'Task not found'
        });
        return;
      }

      // If task is completed, only allow status updates
      if (existingTask.status === 'Completed') {
        const updateKeys = Object.keys(updateData);
        const hasNonStatusUpdates = updateKeys.some(key => key !== 'status');
        
        if (hasNonStatusUpdates) {
          res.status(400).json({
            status: false,
            message: 'Completed tasks can only be updated by changing the status field'
          });
          return;
        }
      }

      // Validate high priority date constraint for updates
      const finalPriority = updateData.priority || existingTask.priority;
      const finalStartDate = updateData.startDate || existingTask.startDate;
      const finalDueDate = updateData.dueDate || existingTask.dueDate;

      if (finalPriority === 'High') {
        const start = new Date(finalStartDate);
        const due = new Date(finalDueDate);
        const diffTime = due.getTime() - start.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (diffDays > 7) {
          res.status(400).json({
            status: false,
            message: 'High priority tasks must have a due date within 7 days from start date'
          });
          return;
        }
      }

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
        startDate: updatedTask.startDate,
        dueDate: updatedTask.dueDate,
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
