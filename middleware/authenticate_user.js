const jwt = require('jsonwebtoken');
const _ = require('lodash')
require('dotenv').config()

module.exports.authenticate_user = async function (req, res, next) {
  let authHeader = req.headers['authorizationtoken'];
  if (_.isNil(authHeader)) {
    return res.status(401).json({
      error: 'Unauthorized'
    });
  }

  let decodedToken = null;
  try {
    decodedToken = jwt.verify(authHeader, process.env.JWT_SECRET);
    res.locals.currentUser = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'bad request'
    });
  }
  if (_.isNil(decodedToken)) {
    return res.status(401).json({
      error: 'bad request'
    });
  };
}

