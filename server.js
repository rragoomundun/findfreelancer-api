import express from 'express';
import morgan from 'morgan';
import colors from 'colors';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db.js';

import xssProtectMiddleware from './middlewares/xssProtect.middleware.js';
import notFoundMiddleware from './middlewares/notFound.middleware.js';
import errorMiddleware from './middlewares/error.middleware.js';

// Connect to database
connectDB();

const app = express();

// Set static folder
app.use(express.static('public'));

if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
  process.env.APP_URL = process.env.APP_DEV_URL;
} else {
  process.env.APP_URL = process.env.APP_PROD_URL;
}

// Enable CORS
const origin = [];

if (process.env.NODE_ENV === 'dev') {
  origin.push(
    /http:\/\/localhost:.*/,
    /https:\/\/localhost:.*/,
    /http:\/\/127\.0\.0\.1:.*/,
    /https:\/\/127\.0\.0\.1:.*/
  );
} else {
  origin.push(process.env.APP_URL);
}

app.use(
  cors({
    origin,
    credentials: true
  })
);

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Add security headers
app.use(helmet());

// Prevent HTTP parameters pollution
app.use(hpp());

// Protect against XSS attacks
app.use(xssProtectMiddleware);

// Limit the number of requests per minute in prod mode
if (process.env.NODE_ENV === 'prod') {
  app.use(
    rateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: process.env.RATE_LIMIT
    })
  );
}

const versionPrefix = '/v1';

//Route files
import apiRoute from './routes/api.route.js';
import authRoute from './routes/auth.route.js';

// Mount router
app.use(`${versionPrefix}/api`, apiRoute);
app.use(`${versionPrefix}/auth`, authRoute);

// Errors
app.use(notFoundMiddleware);
app.use(errorMiddleware);

// Crons
import tokenCrons from './crons/token.cron.js';

tokenCrons.clearTokens();

app.listen(process.env.PORT, () => {
  console.log(`[OK] Server is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.green);
});
