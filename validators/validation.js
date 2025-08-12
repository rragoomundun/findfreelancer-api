import httpStatus from 'http-status-codes';
import { validationResult } from 'express-validator';

import ErrorResponse from '../classes/ErrorResponse.js';

const validation = (validations) => {
  return [
    ...validations,
    (req, res, next) => {
      const result = validationResult(req);
      let error = null;

      if (result.isEmpty() === false) {
        const paths = [];
        const originalResultArray = result.array();
        const resultArray = [];

        for (const result of originalResultArray) {
          if (paths.includes(result.path) === false && result.msg !== 'Invalid value') {
            resultArray.push(result);
            paths.push(result.path);
          }
        }

        const errors = {};

        for (const result of resultArray) {
          errors[result.path] = result.msg;
        }

        if (Object.keys(errors).length > 0) {
          error = new ErrorResponse(errors, httpStatus.BAD_REQUEST, 'INVALID_PARAMETERS');
        }
      }

      next(error);
    }
  ];
};

export default validation;
