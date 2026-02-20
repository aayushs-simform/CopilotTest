import { TaskStatus, TaskPriority } from '../types/task.types';

export interface CreateTaskDTO {
  name: string;
  details: string;
  status: TaskStatus;
  priority: TaskPriority;
  startDate: Date;
  dueDate: Date;
}

export interface UpdateTaskDTO {
  name?: string;
  details?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  startDate?: Date;
  dueDate?: Date;
}

export interface TaskResponse {
  id: string;
  name: string;
  details: string;
  status: TaskStatus;
  priority: TaskPriority;
  startDate: Date;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
