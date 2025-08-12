import jwt from 'jsonwebtoken';
import httpStatus from 'http-status-codes';

import Freelancer from '../models/Freelancer.js';

import ErrorResponse from '../classes/ErrorResponse.js';

const authenticateMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const freelancer = await Freelancer.findOne({ _id: decoded.id });
    const { _id, email, firstName, lastName } = freelancer;

    req.user = {
      _id,
      email,
      firstName,
      lastName
    };

    next();
  } catch {
    return next(new ErrorResponse('Unauthorized', httpStatus.UNAUTHORIZED));
  }
};

export default authenticateMiddleware;
