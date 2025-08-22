# FindFreelancer API

Backend API for FindFreelancer: a platform to find freelancers.

## Usage

Rename file **config.env** to **.env** and update the values.

### .env example

```
# Port to use
PORT=5000


# Maximum number of requests per minute (only used in prod mode)
RATE_LIMIT=100


# The MongoDB connexion uri
MONGO_URI=mongodb://user:password@127.0.0.1:27017/db


# AWS API Access Key
AWS_ACCESS_KEY_ID=accesskeyid

# AWS API Secret Access Key
AWS_SECRET_ACCESS_KEY=secretaccesskey

# AWS S3 Upload Bucket Region
AWS_S3_REGION=s3region

# AWS S3 bucket name
AWS_S3_BUCKET_NAME=bucketname

# AWS SES region
AWS_SES_REGION=sesregion


# From email name
FROM_NAME=FindFreelancer

# From email address
FROM_EMAIL=noreply@ex.com

# Reply email address
REPLY_EMAIL=contact@ex.com


# JWT Token secret code
JWT_SECRET=secret

# JWT Token duration. On this example it will expire in 180 days
JWT_EXPIRE=180d

# JWT Token cookie duration. The value is in days.
JWT_COOKIE_EXPIRE=180


# Clear token cron execution date
CLEAR_TOKENS_CRON_DATE=* * * * *


# The production front end URL
APP_PROD_URL=https://app.findfreelancer.com

# The development front end URL
APP_DEV_URL=https://app-dev.findfreelancer.com
```

## Run API

```
# Run in development mode
npm run dev

# Run in production mode
npm run prod
```

## Generate documentation

```
npm run gendoc
```

- Version: 0.6.0
- License: MIT
- Author: Raphael Ragoomundun
