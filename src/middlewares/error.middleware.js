import httpStatus from 'http-status-codes';

const error = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  res.status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
    error: error.message || 'Internal Server Error',
    type: error.type
  });
};

export default error;
