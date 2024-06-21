const userService = require("../../service/userService");
const tokenService = require("../../service/tokenService");
const User = require("../../models/User.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { compareSync } = require("bcrypt");
const { validationResult } = require("express-validator");
const ApiError = require("../../exceptions/apiError");

class AuthController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("Errors in validation", errors.array()),
        );
      }

      const { email, password } = req.body;
      const userData = await userService.registration(email, password);

      return res.send(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { password, email } = req.body;
      const userData = await userService.login(email, password);

      return res.send(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const token = await userService.logout(refreshToken);
      res.send(token);
    } catch (e) {
      next(e);
    }
  }

  async requestPasswordReset(req, res, next) {
    try {
      const { email } = req.body;
      const changePassword = await userService.requestPasswordReset(email);
      res.send(changePassword);
    } catch (e) {
      next(e);
    }
  }

  async updatePassword(req, res, next) {
    try {
      const { email, password } = req.body;
      const newPassword = await userService.updatePassword(email, password);
      res.send(newPassword);
    } catch (e) {
      next(e);
    }
  }

  async activateLink(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const userData = await userService.refresh(refreshToken);

      return res.send(userData);
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await User.find();
      res.send(users);
    } catch (e) {
      next(e);
    }
  }

  async getUser(req, res, next) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      res.send(user);
    } catch (e) {
      next(e);
    }
  }

  async personalInfo(req, res, next) {
    try {
      const personalData = req.body;
      const accessToken = req.headers["authorization"].split("Bearer ")[1];

      const userData = await userService.personalInfo(
        personalData,
        accessToken,
      );

      res.send(userData);
    } catch (e) {
      next(e);
    }
  }

  async allPersonalData(req, res, next) {
    try {
      const accessToken = req.headers["authorization"].split("Bearer ")[1];
      const { email } = req.query;

      const userData = await userService.allPersonalData(accessToken, email);

      res.send(userData);
    } catch (e) {
      next(e);
    }
  }

  async order(req, res, next) {
    try {
      const personalData = req.body;
      const accessToken = req.headers["authorization"].split("Bearer ")[1];

      const userData = await userService.order(accessToken, personalData);

      res.send(userData);
    } catch (e) {
      next(e);
    }
  }

  async allOrders(req, res, next) {
    try {
      const { email } = req.query;
      const accessToken = req.headers["authorization"].split("Bearer ")[1];

      const userData = await userService.allOrders(accessToken, email);

      res.send(userData);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new AuthController();
