import httpStatus from 'http-status-codes';

import Freelancer from '../models/Freelancer.js';

/**
 * @api {GET} /search/freelancer Search Freelancers
 * @apiGroup Search
 * @apiName SearchFreelancer
 *
 * @apiDescription Search for freelancers.
 *
 * @apiQuery {String} query The search query
 * @apiQuery {Number} [page] The page number
 * @apiQuery {String} [locations] The locations of the freelancers
 * @apiQuery {Number} [minHourlyRate] The minimum accepted hourly rate
 * @apiQuery {Number} [maxHourlyRate] The maximum accepted hourly rate
 * @apiQuery {String} [languages] The spoken languages of the freelancers
 *
 * @apiPermission Public
 */
const searchFreelancers = async (req, res) => {
  const pageLimit = 20;
  const query = {
    $text: { $search: req.query.query },
    'location.town': { $exists: true, $ne: '' },
    'location.countryCode': { $exists: true, $ne: '' },
    hourlyRate: { $exists: true, $ne: '' },
    title: { $exists: true, $ne: '' },
    presentationText: { $exists: true, $ne: '' },
    $or: [{ 'contact.email': { $exists: true, $ne: '' } }, { 'contact.phone': { $exists: true, $ne: '' } }]
  };
  let page, offset;

  if (req.query.page) {
    page = Number(req.query.page) - 1;
  } else {
    page = 0;
  }

  offset = page * pageLimit;

  if (req.query.locations) {
    query['location.countryCode'] = { $in: req.query.locations.split(',') };
  }

  if (req.query.minHourlyRate) {
    query.hourlyRate = { $gte: Number(req.query.minHourlyRate) };
  }

  if (req.query.maxHourlyRate) {
    if (query.hourlyRate) {
      query.hourlyRate.$lte = Number(req.query.maxHourlyRate);
    } else {
      query.hourlyRate = { $lte: Number(req.query.maxHourlyRate) };
    }
  }

  if (req.query.languages) {
    query['languages.code'] = { $in: req.query.languages.split(',') };
  }

  const totalFreelancers = await Freelancer.find(query, { sanitizeFilter: 1 }).countDocuments();
  const freelancers = await Freelancer.find(query, { sanitizeFilter: 1 }).skip(offset).limit(pageLimit).select({
    image: 1,
    firstName: 1,
    lastName: 1,
    title: 1,
    presentationText: 1,
    hourlyRate: 1,
    'location.countryCode': 1,
    skills: 1
  });

  res.status(httpStatus.OK).json({ freelancers, totalFreelancers, nbPages: Math.ceil(totalFreelancers / pageLimit) });
};

export { searchFreelancers };
