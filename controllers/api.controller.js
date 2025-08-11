import httpStatus from 'http-status-codes';

/**
 * @api {GET} /api/status Get Status
 * @apiGroup API
 * @apiName APIGetStatus
 *
 * @apiDescription Get running status of the API.
 *
 * @apiSuccess (Success (200)) {String} message  Running status
 * @apiSuccessExample Success Example
 * {
 *   "message": "API is running in dev mode on port 5000"
 * }
 *
 * @apiPermission Public
 */
const getStatus = (req, res, next) => {
  res.status(httpStatus.OK).json({
    message: `API is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
  });
};

export { getStatus };
