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
 * @apiBody {String{12..}} repeatedPassword The repeated password
 *
 * @apiParamExample {json} Body Example
 * {
 *   "email": "tom@ex.com",
 *   "firstName": "Tom",
 *   "lastName": "Jedusor"
 *   "password": "pfs83a01jH;B",
 *   "repeatedPassword": "pfs83a01jH;B"
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

// Create token from model, create cookie, and send response
const sendTokenResponse = async (freelancerId, statusCode, res) => {
  const freelancer = await Freelancer.findOne({ _id: freelancerId });
  const token = freelancer.getSignedJWTToken();

  const options = {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * process.env.JWT_COOKIE_EXPIRE),
    sameSite: 'None',
    secure: true
  };

  res.status(statusCode).cookie('token', token, options).json({ token });
};

export { register, registerConfirm };
