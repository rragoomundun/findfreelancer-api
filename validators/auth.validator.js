import { body } from 'express-validator';

import Freelancer from '../models/Freelancer.js';

import validation from './validation.js';

const registerValidator = validation([
  body('email')
    .notEmpty()
    .withMessage('message=Please add an email;type=NO_EMAIL')
    .isEmail()
    .withMessage('message=Please add a valid email;type=INVALID_EMAIL')
    .custom(async (value) => {
      const emailExists = await Freelancer.findOne({ email: value });

      if (emailExists) {
        throw new Error('message=The email address is already in use;type=EMAIL_IN_USE');
      }
    }),
  body('firstName').notEmpty().withMessage('message=Please add a first name;type=NO_FIRSTNAME'),
  body('lastName').notEmpty().withMessage('message=Please add a last name;type=NO_LASTNAME'),
  body('password')
    .notEmpty()
    .withMessage('message=Please add a password;type=NO_PASSWORD')
    .isLength({ min: process.env.PASSWORD_MIN_LENGTH })
    .withMessage(
      `message=The password has to have at least ${process.env.PASSWORD_MIN_LENGTH} characters;type=PASSWORD_MIN_LENGTH`
    ),
  body('repeatedPassword')
    .notEmpty()
    .withMessage('message=Please add the repeated password;type=NO_REPEATED_PASSWORD')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(`message=The repeated password doesn't match the password;type=REPEATED_PASSWORD_NO_MATCH`);
      }

      return true;
    })
]);

export { registerValidator };
