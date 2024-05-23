const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const Role = require("../models/Role");
const mainService = require("./mailService");
const tokenService = require("./tokenService");
const UserDto = require("../dtos/userDto");
const ApiError = require("../exceptions/apiError");
const { compare } = require("bcrypt");
require("dotenv").config();

class UserService {
  async registration(email, password) {
    try {
      const candidate = await User.findOne({ email });
      if (candidate) {
        throw ApiError.BadRequest("User with the same email is already exist");
      }

      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ value: "user" });
      const activationLink = uuid.v4();

      const user = new User({
        email,
        password: hashPassword,
        roles: [userRole.value],
        activationLink,
      });

      await user.save();
      await mainService.sendActivationMail(
        email,
        `${process.env.API_URL}/api/auth/activate/${activationLink}`,
      );

      const userDto = new UserDto(user);
      const tokens = tokenService.generateTokens({ ...userDto });
      await tokenService.saveToken(userDto.id, tokens.refreshToken);

      return {
        ...tokens,
        user: userDto,
      };
    } catch (e) {
      throw ApiError.BadRequest(`${e.message}`);
    }
  }

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest("Incorrect username or password");
    }

    const isPassEquals = compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Incorrect username or password");
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async activate(activationLink) {
    const user = await User.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest("Activation link is incorrect");
    }
    user.isActivated = true;
    await user.save();
  }

  async refresh(refreshToken) {
    console.log(refreshToken);
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await User.findById(userData._id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }
}

module.exports = new UserService();
