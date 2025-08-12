import httpStatus from 'http-status-codes';

import Freelancer from '../models/Freelancer.js';
import ErrorResponse from '../classes/ErrorResponse.js';

import mailUtil from '../utils/mail.util.js';

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

export { register };
