import httpStatus from 'http-status-codes';

import ErrorResponse from '../classes/ErrorResponse.js';

const notFound = (req, res, next) => {
  next(new ErrorResponse(`Cannot find API route ${req._parsedUrl.pathname}`, httpStatus.NOT_FOUND, 'ROUTE_NOT_FOUND'));
};

export default notFound;
