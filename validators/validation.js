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

        const messages = resultArray.map((result) => {
          const messageSplitted = result.msg.split(';');
          const message = messageSplitted
            .find((messagePart) => messagePart.includes('message=') === true)
            .split('=')[1];
          const type = messageSplitted.find((messagePart) => messagePart.includes('type=') === true).split('=')[1];

          return { message, type, field: result.path };
        });

        if (messages.length) {
          error = new ErrorResponse(messages, httpStatus.BAD_REQUEST, 'INVALID_PARAMETERS');
        }
      }

      next(error);
    }
  ];
};

export default validation;
