const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const { errorResponse } = require('../utils/response');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return errorResponse(res, 401, 'Unauthorized: No token provided');
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return errorResponse(res, 401, 'Unauthorized: User not found');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    errorResponse(res, 401, 'Unauthorized: ' + error.message);
  }
};

module.exports = authenticate;
