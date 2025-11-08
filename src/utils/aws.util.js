import { SESv2Client } from '@aws-sdk/client-sesv2';

const ses = new SESv2Client({
  region: process.env.AWS_SES_REGION,
  credentials: {
    accessKeyId: process.env.APP_ACCESS_KEY_ID,
    secretAccessKey: process.env.APP_SECRET_ACCESS_KEY
  }
});

export { ses };
