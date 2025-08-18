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

export { identityValidator };
