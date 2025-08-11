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


# The production front end URL
APP_PROD_URL=https://app.markedit.net

# The development front end URL
APP_DEV_URL=https://app-dev.markedit.net
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

- Version: 0.1.0
- License: MIT
- Author: Raphael Ragoomundun
