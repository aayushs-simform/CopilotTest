import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { TaskController } from '../controllers/task.controller';
import { TaskStatus, TaskPriority } from '../models/task.model';

const router = Router();

// Joi validation schemas
const createTaskSchema = Joi.object({
  name: Joi.string().required().min(1).max(200).messages({
    'string.empty': 'Task name is required',
    'string.min': 'Task name must be at least 1 character',
    'string.max': 'Task name must not exceed 200 characters',
    'any.required': 'Task name is required'
  }),
  details: Joi.string().required().min(1).messages({
    'string.empty': 'Task details are required',
    'string.min': 'Task details must be at least 1 character',
    'any.required': 'Task details are required'
  }),
  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .required()
    .messages({
      'any.only': 'Status must be one of: To Do, In Progress, Completed',
      'any.required': 'Task status is required'
    }),
  priority: Joi.string()
    .valid(...Object.values(TaskPriority))
    .required()
    .messages({
      'any.only': 'Priority must be one of: Low, Medium, High',
      'any.required': 'Task priority is required'
    })
});

const updateTaskSchema = Joi.object({
  name: Joi.string().min(1).max(200).messages({
    'string.empty': 'Task name cannot be empty',
    'string.min': 'Task name must be at least 1 character',
    'string.max': 'Task name must not exceed 200 characters'
  }),
  details: Joi.string().min(1).messages({
    'string.empty': 'Task details cannot be empty',
    'string.min': 'Task details must be at least 1 character'
  }),
  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .messages({
      'any.only': 'Status must be one of: To Do, In Progress, Completed'
    }),
  priority: Joi.string()
    .valid(...Object.values(TaskPriority))
    .messages({
      'any.only': 'Priority must be one of: Low, Medium, High'
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

const taskIdParamSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.guid': 'Invalid task ID format',
    'any.required': 'Task ID is required'
  })
});

// Validation middleware
const validateRequest = (schema: Joi.ObjectSchema, property: 'body' | 'params' | 'query') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    
    if (error) {
      const errorMessage = error.details.map((detail: Joi.ValidationErrorItem) => detail.message).join(', ');
      res.status(400).json({
        status: false,
        message: errorMessage
      });
      return;
    }
    
    next();
  };
};

// Routes
router.post(
  '/tasks',
  validateRequest(createTaskSchema, 'body'),
  TaskController.createTask
);

router.get(
  '/tasks',
  TaskController.getAllTasks
);

router.get(
  '/tasks/:id',
  validateRequest(taskIdParamSchema, 'params'),
  TaskController.getTaskById
);

router.put(
  '/tasks/:id',
  validateRequest(taskIdParamSchema, 'params'),
  validateRequest(updateTaskSchema, 'body'),
  TaskController.updateTask
);

router.patch(
  '/tasks/:id',
  validateRequest(taskIdParamSchema, 'params'),
  validateRequest(updateTaskSchema, 'body'),
  TaskController.updateTask
);

router.delete(
  '/tasks/:id',
  validateRequest(taskIdParamSchema, 'params'),
  TaskController.deleteTask
);

export default router;
