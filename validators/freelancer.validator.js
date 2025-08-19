import { body } from 'express-validator';

import Freelancer from '../models/Freelancer.js';

import validation from './validation.js';

const identityValidator = validation([
  body('email')
    .notEmpty()
    .withMessage('EMPTY')
    .isEmail()
    .withMessage('NOT_EMAIL')
    .custom(async (value, { req }) => {
      const freelancer = await Freelancer.findOne({ email: value });

      if (freelancer && freelancer._id.toString() !== req.freelancer._id.toString()) {
        throw new Error('EMAIL_IN_USE');
      }
    }),
  body('firstName').notEmpty().withMessage('EMPTY'),
  body('lastName').notEmpty().withMessage('EMPTY')
]);

const securityValidator = validation([
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

export { identityValidator, securityValidator };
