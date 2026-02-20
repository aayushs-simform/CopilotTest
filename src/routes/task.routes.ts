import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { TaskController } from '../controllers/task.controller';
import { TaskStatus, TaskPriority } from '../models/task.model';

const router = Router();

// Joi validation schemas
const createTaskSchema = Joi.object({
  name: Joi.string().required().min(1).max(50).messages({
    'string.empty': 'Task name is required',
    'string.min': 'Task name must be at least 1 character',
    'string.max': 'Task name must not exceed 50 characters',
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
    }),
  startDate: Joi.date().required().messages({
    'date.base': 'Start date must be a valid date',
    'any.required': 'Start date is required'
  }),
  dueDate: Joi.date().required().greater(Joi.ref('startDate')).messages({
    'date.base': 'Due date must be a valid date',
    'date.greater': 'Due date must be after start date',
    'any.required': 'Due date is required'
  })
}).custom((value, helpers) => {
  const { startDate, dueDate, priority } = value;
  
  if (priority === 'High' && startDate && dueDate) {
    const start = new Date(startDate);
    const due = new Date(dueDate);
    const diffTime = due.getTime() - start.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    if (diffDays > 7) {
      return helpers.error('custom.highPriorityDueDate');
    }
  }
  
  return value;
}).messages({
  'custom.highPriorityDueDate': 'High priority tasks must have a due date within 7 days from start date'
});

const updateTaskSchema = Joi.object({
  name: Joi.string().min(1).max(50).messages({
    'string.empty': 'Task name cannot be empty',
    'string.min': 'Task name must be at least 1 character',
    'string.max': 'Task name must not exceed 50 characters'
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
    }),
  startDate: Joi.date().messages({
    'date.base': 'Start date must be a valid date'
  }),
  dueDate: Joi.date().when('startDate', {
    is: Joi.exist(),
    then: Joi.date().greater(Joi.ref('startDate')).messages({
      'date.greater': 'Due date must be after start date'
    }),
    otherwise: Joi.date()
  }).messages({
    'date.base': 'Due date must be a valid date'
  })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
}).custom((value, helpers) => {
  const { startDate, dueDate, priority } = value;
  
  // Only validate if priority is being set to High and we have both dates
  if (priority === 'High' && startDate && dueDate) {
    const start = new Date(startDate);
    const due = new Date(dueDate);
    const diffTime = due.getTime() - start.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    if (diffDays > 7) {
      return helpers.error('custom.highPriorityDueDate');
    }
  }
  
  return value;
}).messages({
  'custom.highPriorityDueDate': 'High priority tasks must have a due date within 7 days from start date'
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
