import httpStatus from 'http-status-codes';

import Freelancer from '../models/Freelancer.js';

/**
 * @api {GET} /freelancer Get Me
 * @apiGroup Freelancer
 * @apiName FreelancerGetMe
 *
 * @apiDescription Get logged in freelancer.
 *
 * @apiSuccess (Success (200)) {String} _id Freelancer's id
 * @apiSuccess (Success (200)) {String} firstName Freelancer's first name
 * @apiSuccess (Success (200)) {String} lastName Freelancer's last name
 * @apiSuccess (Success (200)) {String} email Freelancer's email
 * @apiSuccess (Success (200)) {String} image Freelancer's image
 *
 * @apiError (Error (400)) INVALID_TOKEN Invalid token
 *
 * @apiPermission Private
 */
const getMe = async (req, res) => {
  res.status(httpStatus.OK).json(req.freelancer);
};

/**
 * @api {PUT} /freelancer/settings/identity Update Identity
 * @apiGroup Freelancer
 * @apiName FreelancerSettingsUpdateIdentity
 *
 * @apiDescription Updates a freelancer's identity.
 *
 * @apiBody {String} email Freelancer's login email
 * @apiBody {String} firstName Freelancer's first name
 * @apiBody {String} lastName Freelancer's last name
 *
 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 *
 * @apiPermission Private
 */
const updateIdentity = async (req, res) => {
  const { _id } = req.freelancer;
  const { email, firstName, lastName } = req.body;

  await Freelancer.updateOne({ _id }, { $set: { email, firstName, lastName } });

  res.status(httpStatus.OK).end();
};

export { getMe, updateIdentity };
