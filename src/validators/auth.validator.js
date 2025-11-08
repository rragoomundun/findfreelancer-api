import { body } from 'express-validator';

import Freelancer from '../models/Freelancer.js';

import validation from './validation.js';

const registerValidator = validation([
  body('email')
    .notEmpty()
    .withMessage('EMPTY')
    .isEmail()
    .withMessage('NOT_EMAIL')
    .custom(async (value) => {
      const emailExists = await Freelancer.findOne({ email: value });

      if (emailExists) {
        throw new Error('EMAIL_IN_USE');
      }
    }),
  body('firstName').notEmpty().withMessage('EMPTY'),
  body('lastName').notEmpty().withMessage('EMPTY'),
  body('password')
    .notEmpty()
    .withMessage('EMPTY')
    .isLength({ min: 8 })
    .withMessage('PASSWORD_MIN_LENGTH_8')
    .isStrongPassword()
    .withMessage('PASSWORD_NOT_STRONG'),
  body('passwordConfirmation')
    .notEmpty()
    .withMessage('EMPTY')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('PASSWORD_CONFIRMATION_NO_MATCH');
      }

      return true;
    })
]);

const loginValidator = validation([
  body('email').notEmpty().withMessage('EMPTY'),
  body('password').notEmpty().withMessage('EMPTY')
]);

const forgotPasswordValidator = validation([
  body('email')
    .notEmpty()
    .withMessage('EMPTY')
    .custom(async (email) => {
      const freelancer = await Freelancer.findOne({ email });

      if (!freelancer) {
        throw new Error('NO_ACCOUNT_FOR_EMAIL');
      }
    })
]);

const resetPasswordValidator = validation([
  body('password')
    .notEmpty()
    .withMessage('EMPTY')
    .isLength({ min: 8 })
    .withMessage('PASSWORD_MIN_LENGTH_8')
    .isStrongPassword()
    .withMessage('PASSWORD_NOT_STRONG'),
  body('passwordConfirmation')
    .notEmpty()
    .withMessage('EMPTY')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('PASSWORD_CONFIRMATION_NO_MATCH');
      }

      return true;
    })
]);

export { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator };
