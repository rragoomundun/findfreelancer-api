import { body } from 'express-validator';

import countries from '../misc/countries.js';
import languages from '../misc/languages.js';

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

const generalValidator = validation([
  body('town').notEmpty().withMessage('EMPTY'),
  body('countryCode')
    .notEmpty()
    .withMessage('EMPTY')
    .custom((value) => {
      if (countries.includes(value) === false) {
        throw new Error('INVALID_COUNTRY_CODE');
      }
    }),
  body('hourlyRate')
    .notEmpty()
    .withMessage('EMPTY')
    .isInt({ min: 5, max: 100 })
    .withMessage('INVALID_HOURLY_RATE_RANGE')
]);

const skillsValidator = validation([
  body('skills').custom((value) => {
    for (const val of value) {
      if (typeof val !== 'string') {
        throw new Error('INVALID_SKILLS');
      }
    }
  })
]);

const experiencesValidator = validation([
  body('experiences').isArray().withMessage('NOT_ARRAY'),
  body('experiences.*.title').notEmpty().withMessage('EMPTY'),
  body('experiences.*.organization').notEmpty().withMessage('EMPTY'),
  body('experiences.*.town').notEmpty().withMessage('EMPTY'),
  body('experiences.*.startDate').notEmpty().withMessage('EMPTY').isDate().withMessage('NOT_DATE'),
  body('experiences.*.description').notEmpty().withMessage('EMPTY'),
  body('experiences.*.countryCode')
    .notEmpty()
    .withMessage('EMPTY')
    .custom((value) => {
      if (countries.includes(value) === false) {
        throw new Error('INVALID_COUNTRY_CODE');
      }
    })
]);

const educationValidator = validation([
  body('education').isArray().withMessage('NOT_ARRAY'),
  body('education.*.school').notEmpty().withMessage('EMPTY'),
  body('education.*.town').notEmpty().withMessage('EMPTY'),
  body('education.*.countryCode')
    .notEmpty()
    .withMessage('EMPTY')
    .custom((value) => {
      if (countries.includes(value) === false) {
        throw new Error('INVALID_COUNTRY_CODE');
      }
    }),
  body('education.*.startDate').notEmpty().withMessage('EMPTY').isDate().withMessage('NOT_DATE'),
  body('education.*.description').notEmpty().withMessage('EMPTY')
]);

const languagesValidator = validation([
  body('languages').isArray().withMessage('NOT_ARRAY'),
  body('languages.*.code')
    .notEmpty()
    .withMessage('EMPTY')
    .custom((value) => {
      const languagesCodes = languages.map((language) => language.code);

      if (languagesCodes.includes(value)) {
        throw new Error('INVALID_LANGUAGE');
      }
    }),
  body('languages.*.level')
    .notEmpty()
    .withMessage('EMPTY')
    .isIn(['basic', 'conversational', 'fluent', 'native-bilingual'])
]);

export {
  identityValidator,
  securityValidator,
  generalValidator,
  skillsValidator,
  experiencesValidator,
  educationValidator,
  languagesValidator
};
