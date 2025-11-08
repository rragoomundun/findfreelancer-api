import awsServeslessExpress from 'aws-serverless-express';
import app from './src/server.js';

const server = awsServeslessExpress.createServer(app);

export const handler = (event, context) => {
  return awsServeslessExpress.proxy(server, event, context);
};
