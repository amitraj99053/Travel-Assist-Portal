const { errorResponse } = require('../utils/response');

// Check if user has specific role
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 403, 'Forbidden: Insufficient permissions');
    }
    next();
  };
};

module.exports = authorize;
