import httpStatus from 'http-status-codes';

import Freelancer from '../models/Freelancer.js';
import ErrorResponse from '../classes/ErrorResponse.js';

import mailUtil from '../utils/mail.util.js';
import cryptUtil from '../utils/crypt.util.js';

/**
 * @api {POST} /auth/register Register
 * @apiGroup Auth
 * @apiName AuthRegister
 *
 * @apiDescription Register a new user in the database.
 *
 * @apiBody {String} email User's email
 * @apiBody {String} firstName User's firstname
 * @apiBody {String} lastName User's lastName
 * @apiBody {String{12..}} password User's password
 * @apiBody {String{12..}} passwordConfirmation The password's confirmation
 *
 * @apiParamExample {json} Body Example
 * {
 *   "email": "tom@ex.com",
 *   "firstName": "Tom",
 *   "lastName": "Jedusor",
 *   "password": "pfs83a01jH;B",
 *   "passwordConfirmation": "pfs83a01jH;B"
 * }
 *
 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 * @apiError (Error (500)) ACCOUNT_CREATION Cannot create account
 *
 * @apiPermission Public
 */
const register = async (req, res, next) => {
  const { email, firstName, lastName, password } = req.body;

  const token = await Freelancer.generateToken('register-confirm');
  const freelancer = await Freelancer.insertOne({ email, firstName, lastName, password, tokens: [token.encrypted] });

  // Send confirmation e-mail
  try {
    const mailOptions = {
      mail: 'welcome',
      freelancerId: freelancer._id,
      templateOptions: {
        confirmationLink: `${process.env.APP_URL}/auth/register/confirm/${token.decrypted}`
      }
    };
    await mailUtil.send(mailOptions);
  } catch {
    await Freelancer.deleteOne({ _id: freelancer._id });
    return next(new ErrorResponse('Account creation failed', httpStatus.INTERNAL_SERVER_ERROR, 'ACCOUNT_CREATION'));
  }

  res.status(httpStatus.CREATED).end();
};

/**
 * @api {POST} /auth/register/confirm/:confirmationToken Confirm User Registration
 * @apiGroup Auth
 * @apiName AuthRegisterConfirm
 * 
 * @apiDescription Confirm a user by validating its confirmation token.
 * 
 * @apiParam {String} confirmationToken User's confirmation token

 * @apiSuccess (Success (200)) {String} token JWT token
 * @apiSuccessExample Success Example
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNmY0MDQ1MzVlNzU3NWM1NGExNTMyNyIsImlhdCI6MTU4NDM0OTI1MywiZXhwIjoxNTg2OTQxMjUzfQ.2f59_zRuYVXADCQWnQb6mG8NG3zulj12HZCgoIdMEfw"
 * }
 * 
 * @apiError (Error (400)) INVALID_TOKEN Invalid token
 *
 * @apiPermission Public
 */
const registerConfirm = async (req, res, next) => {
  const { confirmationToken } = req.params;
  const hashedToken = cryptUtil.getDigestHash(confirmationToken);
  const freelancer = await Freelancer.findOne({ 'tokens.value': hashedToken });

  if (freelancer === null) {
    throw new ErrorResponse('Invalid token', httpStatus.BAD_REQUEST, 'INVALID_TOKEN');
  }

  await Freelancer.updateOne({ _id: freelancer._id }, { $set: { tokens: [] } });

  sendTokenResponse(freelancer._id, httpStatus.OK, res);
};

/**
 * @api {POST} /auth/login Login
 * @apiGroup Auth
 * @apiName AuthLogin
 * 
 * @apiDescription Login a user.
 * 
 * @apiBody {String} email User's email
 * @apiBody {String} password User's password
 * 
 * @apiParamExample {json} Body Example
 * {
 *   "email": "tom@ex.com",
 *   "password": "pfs83a01jH;B"
 * }
 * 
 * @apiSuccess (Success (200)) {String} token JWT token
 * @apiSuccessExample Success Example
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNmY0MDQ1MzVlNzU3NWM1NGExNTMyNyIsImlhdCI6MTU4NDM0OTI1MywiZXhwIjoxNTg2OTQxMjUzfQ.2f59_zRuYVXADCQWnQb6mG8NG3zulj12HZCgoIdMEfw"
 * }

 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 * @apiError (Error (401)) INVALID The data entered is invalid
 * @apiError (Error (401)) UNCONFIRMED The account is unconfirmed
 *
 * @apiPermission Public
 */
const login = async (req, res, next) => {
  const { email, password } = req.body;
  const freelancer = await Freelancer.findOne({ email });

  if (freelancer === null || !(await freelancer.verifyPassword(password))) {
    throw new ErrorResponse('Data entered invalid', httpStatus.UNAUTHORIZED, 'INVALID');
  }

  if (freelancer.tokens.find((token) => token.type === 'register-confirm')) {
    throw new ErrorResponse('Account unconfirmed', httpStatus.UNAUTHORIZED, 'UNCONFIRMED');
  }

  sendTokenResponse(freelancer._id, httpStatus.OK, res);
};

/**
 * @api {GET} /auth/logout Logout
 * @apiGroup Auth
 * @apiName AuthLogout
 *
 * @apiDescription Logout user by clearing token cookie.
 *
 * @apiPermission Private
 */
const logout = async (req, res, next) => {
  res
    .cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      sameSite: 'None'
    })
    .status(httpStatus.OK)
    .end();
};

/**
 * @api {POST} /auth/password/forgot Forgot Password
 * @apiGroup Auth
 * @apiName AuthForgotPassword
 *
 * @apiDescription Generate reset password token and send reset email
 *
 * @apiBody {String} email User's email
 *
 * @apiParamExample {json} Body Example
 * {
 *   "email": "tom@ex.com"
 * }
 *
 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 * @apiError (Error (401)) UNCONFIRMED The account is unconfirmed
 * @apiError (Error (409)) ALREADY_RECOVERING A recovery procedure is already in progress
 * @apiError (Error (500)) EMAIL_SENDING_FAILED Cannot send recovery email
 *
 * @apiPermission Public
 */
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const freelancer = await Freelancer.findOne({ email });

  if (freelancer.tokens.find((token) => token.type === 'register-confirm')) {
    throw new ErrorResponse('Acount unconfirmed', httpStatus.UNAUTHORIZED, 'UNCONFIRMED');
  } else if (freelancer.tokens.find((token) => token.type === 'password-reset')) {
    throw new ErrorResponse(
      'A password recovery procedure is already in progress',
      httpStatus.CONFLICT,
      'ALREADY_RECOVERING'
    );
  }

  const resetPasswordToken = await Freelancer.generateToken('password-reset');

  try {
    const mailOptions = {
      mail: 'passwordForgotten',
      freelancerId: freelancer._id,
      templateOptions: {
        resetLink: `${process.env.APP_URL}/auth/password/reset/${resetPasswordToken.decrypted}`
      }
    };

    await mailUtil.send(mailOptions);

    freelancer.tokens.push(resetPasswordToken.encrypted);
    await freelancer.save();

    res.status(httpStatus.OK).end();
  } catch {
    return next(new ErrorResponse('Cannot send email', httpStatus.INTERNAL_SERVER_ERROR, 'EMAIL_SENDING_FAILED'));
  }
};

/**
 * @api {POST} /auth/password/reset/:resetPasswordToken Reset Password
 * @apiGroup Auth
 * @apiName AuthResetPassword
 *
 * @apiDescription Reset user password
 *
 * @apiParam {String} resetPasswordToken User's confirmation token
 * @apiBody {String{12..}} password User's new password
 * @apiBody {String{12...}} passwordConfirmation The password confirmation
 *
 * @apiParamExample {json} Body Example
 * {
 *   "password": "J9u21k%cde1t",
 *   "passwordConfirmation": "J9u21k%cde1t"
 * }
 *
 * @apiSuccess (Success (200)) {String} token JWT token
 * @apiSuccessExample Success Example
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNmY0MDQ1MzVlNzU3NWM1NGExNTMyNyIsImlhdCI6MTU4NDM0OTI1MywiZXhwIjoxNTg2OTQxMjUzfQ.2f59_zRuYVXADCQWnQb6mG8NG3zulj12HZCgoIdMEfw"
 * }
 *
 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 * @apiError (Error (400)) INVALID_TOKEN Invalid token
 *
 * @apiPermission Public
 */
const resetPassword = async (req, res, next) => {
  const { resetPasswordToken } = req.params;
  const { password } = req.body;
  const resetPasswordTokenHash = cryptUtil.getDigestHash(resetPasswordToken);
  const freelancer = await Freelancer.findOne({ 'tokens.value': resetPasswordTokenHash });

  if (freelancer === null) {
    throw new ErrorResponse('Invalid token', httpStatus.BAD_REQUEST, 'INVALID_TOKEN');
  }

  freelancer.password = password;
  freelancer.tokens.pull({ value: resetPasswordTokenHash });

  await freelancer.save();

  sendTokenResponse(freelancer._id, httpStatus.OK, res);
};

/**
 * @api {GET} /auth/authorized Is Authorized
 * @apiGroup Auth
 * @apiName AuthAuthorized
 *
 * @apiDescription Verify if the user token is valid.
 *
 * @apiPermission Private
 */
const authorized = (req, res, next) => {
  res.status(httpStatus.OK).end();
};

// Create token from model, create cookie, and send response
const sendTokenResponse = async (freelancerId, statusCode, res) => {
  const freelancer = await Freelancer.findOne({ _id: freelancerId });
  const token = freelancer.getSignedJWTToken();

  const options = {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * process.env.JWT_COOKIE_EXPIRE)
  };

  res.status(statusCode).cookie('token', token, options).json({ token });
};

export { register, registerConfirm, login, logout, forgotPassword, resetPassword, authorized };
