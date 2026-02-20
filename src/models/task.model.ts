import { v4 as uuidv4 } from 'uuid';

export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed'
}

export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface Task {
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

// In-memory storage
const tasks: Map<string, Task> = new Map();

export class TaskModel {
  static create(taskData: CreateTaskDTO): Task {
    const task: Task = {
      id: uuidv4(),
      name: taskData.name,
      details: taskData.details,
      status: taskData.status,
      priority: taskData.priority,
      startDate: taskData.startDate,
      dueDate: taskData.dueDate,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    tasks.set(task.id, task);
    return task;
  }

  static findAll(): Task[] {
    return Array.from(tasks.values());
  }

  static findById(id: string): Task | undefined {
    return tasks.get(id);
  }

  static update(id: string, updateData: UpdateTaskDTO): Task | undefined {
    const task = tasks.get(id);
    if (!task) {
      return undefined;
    }

    const updatedTask: Task = {
      ...task,
      ...updateData,
      updatedAt: new Date()
    };

    tasks.set(id, updatedTask);
    return updatedTask;
  }

  static delete(id: string): boolean {
    return tasks.delete(id);
  }
}
