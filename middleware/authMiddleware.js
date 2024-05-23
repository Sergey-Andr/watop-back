const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(400).json({ message: "User is not sing in" });
    }

    const decodeData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decodeData;

    next();
  } catch (e) {
    consoe.log(e);
    return res.status(400).json({ message: "User is not sing in" });
  }
};
