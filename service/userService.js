const User = require("../models/User");
const PersonalInfo = require("../models/PersonalInfo");
const Order = require("../models/Order");
const Counter = require("../models/Counter");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const Role = require("../models/Role");
const mainService = require("./mailService");
const tokenService = require("./tokenService");
const UserDto = require("../dtos/userDto");
const ApiError = require("../exceptions/apiError");
const { compare } = require("bcrypt");
const { format } = require("date-fns");
const { bg } = require("date-fns/locale/bg");
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
      throw ApiError.BadRequest("Incorrect email or password");
    }

    const isPassEquals = compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Incorrect email or password");
    }

    const userDto = new UserDto(user);
    const tokens = await tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken) {
    return await tokenService.removeToken(refreshToken);
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
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await User.findById({ _id: userData.id });
    const userDto = new UserDto(user);

    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async personalInfo(personalData, accessToken) {
    if (!accessToken) {
      throw ApiError.UnauthorizedError();
    }

    const { email, ...fieldsToUpdate } = personalData;

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    let updatedPersonalInfo;

    const personalInfoToUpdate = user.personalInfo
      ? { ...user.personalInfo, ...fieldsToUpdate }
      : fieldsToUpdate;

    if (user.personalInfo) {
      updatedPersonalInfo = await PersonalInfo.findByIdAndUpdate(
        user.personalInfo,
        { $set: personalInfoToUpdate },
        { new: true },
      );
    } else {
      const newPersonalInfo = new PersonalInfo(personalInfoToUpdate);

      updatedPersonalInfo = await newPersonalInfo.save();
      user.personalInfo = updatedPersonalInfo._id;
      await user.save();
    }

    return updatedPersonalInfo;
  }

  async allPersonalData(accessToken, email) {
    if (!accessToken) {
      throw ApiError.UnauthorizedError();
    }

    const user = await User.findOne({ email }).populate("personalInfo");
    if (!user) {
      throw new Error("User not found");
    }

    return user.personalInfo;
  }

  async order(accessToken, orderData) {
    if (!accessToken) {
      throw ApiError.UnauthorizedError();
    }

    const { email, ...fieldsToUpdate } = orderData;

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const counter = await Counter.findOneAndUpdate(
      {},
      { $inc: { value: 1 } },
      { new: true, upsert: true },
    );

    const newOrder = new Order({
      ...fieldsToUpdate,
      orderId: counter.value,
      date: format(new Date(), "d MMMM yyyy", { locale: bg }),
    });
    await newOrder.save();

    user.orders.push(newOrder._id);
    await user.save();

    return newOrder;
  }

  async allOrders(accessToken, email) {
    if (!accessToken) {
      throw ApiError.UnauthorizedError();
    }

    const user = await User.findOne({ email }).populate("orders");

    if (!user) {
      throw new Error("User not found");
    }

    return user.orders;
  }
}

module.exports = new UserService();
