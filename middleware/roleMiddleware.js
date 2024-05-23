const jwt = require("jsonwebtoken");
const ApiError = require("../exceptions/apiError");
require("dotenv").config();

module.exports = function (roles) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }

    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return next(ApiError.UnauthorizedError());
      }

      const { roles: userRoles } = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET,
      );
      let hasRole = false;
      userRoles.forEach((role) => {
        if (roles.includes(role)) {
          hasRole = true;
        }
      });

      if (!hasRole) {
        return next(ApiError.UnauthorizedError());
      }
      next();
    } catch (e) {
      return next(ApiError.UnauthorizedError());
    }
  };
};
