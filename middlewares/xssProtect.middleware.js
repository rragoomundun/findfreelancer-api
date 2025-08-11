import he from 'he';

const xssProtectMiddleware = (req, res, next) => {
  for (const key in req.body) {
    if (typeof req.body[key] === 'string') {
      req.body[key] = he.encode(req.body[key]);
    }
  }

  for (const key in req.query) {
    if (typeof req.query[key] === 'string') {
      req.query[key] = he.encode(req.query[key]);
    }
  }

  for (const key in req.headers) {
    if (typeof req.headers[key] === 'string') {
      req.headers[key] = he.encode(req.headers[key]);
    }
  }

  for (const key in req.params) {
    if (typeof req.params[key] === 'string') {
      req.params[key] = he.encode(req.params[key]);
    }
  }

  next();
};

export default xssProtectMiddleware;
