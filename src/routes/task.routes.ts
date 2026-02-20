import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { TaskController } from '../controllers/task.controller';
import { createTaskSchema, updateTaskSchema, taskIdParamSchema } from '../validations/task.validation';

const router = Router();

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
