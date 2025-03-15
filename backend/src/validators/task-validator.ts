import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';

const validate = (req: Request, res: Response, next: NextFunction): void | Response => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const createTaskValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('O título é obrigatório')
    .isLength({ max: 100 }).withMessage('O título deve ter no máximo 100 caracteres')
    .escape(),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('A descrição deve ter no máximo 500 caracteres')
    .escape(),
  body('status')
    .optional()
    .isIn(['pendente', 'em andamento', 'concluída']).withMessage('Status inválido'),
  validate
];

export const updateTaskValidator = [
  param('id')
    .isInt().withMessage('ID inválido'),
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('O título não pode estar vazio')
    .isLength({ max: 100 }).withMessage('O título deve ter no máximo 100 caracteres')
    .escape(),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('A descrição deve ter no máximo 500 caracteres')
    .escape(),
  body('status')
    .optional()
    .isIn(['pendente', 'em andamento', 'concluída']).withMessage('Status inválido'),
  validate
];

export const taskIdValidator = [
  param('id')
    .isInt().withMessage('ID inválido'),
  validate
]; 