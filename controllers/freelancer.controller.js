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

/**
 * @api {PUT} /freelancer/settings/security Update Security
 * @apiGroup Freelancer
 * @apiName FreelancerSettingsUpdateSecurity
 *
 * @apiDescription Updates a freelancer's security information.
 *
 * @apiBody {String} password The updated password
 * @apiBody {String} passwordConfirmation The password confirmation
 *
 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 *
 * @apiPermission Private
 */
const updateSecurity = async (req, res) => {
  const { _id } = req.freelancer;
  const { password } = req.body;
  const freelancer = await Freelancer.findById(_id);

  freelancer.password = password;

  await freelancer.save();

  res.status(httpStatus.OK).end();
};

/**
 * @api {DELETE} /freelancer Delete Account
 * @apiGroup Freelancer
 * @apiName FreelancerDelete
 *
 * @apiDescription Delete freelancer.
 *
 * @apiPermission Private
 */
const deleteAccount = async (req, res) => {
  const { _id } = req.freelancer;

  await Freelancer.findByIdAndDelete(_id);

  res.status(httpStatus.OK).end();
};

/**
 * @api {PUT} /freelancer/profile/general Update General Information
 * @apiGroup Freelancer
 * @apiName FreelancerUpdateGeneral
 *
 * @apiDescription Update a freelancer general profil's information.
 *
 * @apiBody {String} image The freelancer profile picture link
 * @apiBody {String} town The freelancer town
 * @apiBody {String} countryCode The freelancer country code
 * @apiBody {Number} hourlyRate The freelancer hourly rate
 *
 * @apiPermission Private
 */
const updateGeneral = async (req, res) => {
  const { _id } = req.freelancer;
  const { image, town, countryCode, hourlyRate } = req.body;

  await Freelancer.findByIdAndUpdate(_id.toString(), { image, location: { town, countryCode }, hourlyRate });

  res.status(httpStatus.OK).end();
};

export { getMe, updateIdentity, updateSecurity, deleteAccount, updateGeneral };
