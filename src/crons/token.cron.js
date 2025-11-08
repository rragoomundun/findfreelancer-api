import cron from 'node-cron';

import Freelancer from '../models/Freelancer.js';

const clearTokens = () => {
  cron.schedule(process.env.CLEAR_TOKENS_CRON_DATE, async () => {
    // Delete freelancers that have an expired register-confirm token
    await Freelancer.deleteMany({ tokens: { $elemMatch: { type: 'register-confirm', expire: { $lt: new Date() } } } });

    // Delete expired password-reset token
    await Freelancer.updateMany({}, { $pull: { tokens: { type: 'password-reset', expire: { $lt: new Date() } } } });
  });
};

export default { clearTokens };
