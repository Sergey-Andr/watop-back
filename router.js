const { Router } = require("express");
const { check } = require("express-validator");
const authMiddleware = require("./middleware/authMiddleware.js");
const roleMiddleware = require("./middleware/roleMiddleware.js");
const CakeController = require("./controllers/Cake/CakeController.js");
const AuthController = require("./controllers/Auth/AuthController.js");

const router = new Router();

router.post("/cake", CakeController.create);
router.get("/cakes", CakeController.getAll);
router.get("/cake/:id", CakeController.getOne);
router.get("/cakes/:name", CakeController.getByName);
router.put("/cake/:id", CakeController.update);
router.delete("/cake/:id", CakeController.delete);

router.post(
  "/auth/registration",
  [
    check("email", "it's not an email").isEmail(),
    check("password", "password should be from 6 to 30 characters").isLength({
      min: 6,
      max: 30,
    }),
  ],
  AuthController.registration,
);
router.post("/auth/login", AuthController.login);
router.post("/auth/logout", AuthController.logout);
router.post("/auth/requestPasswordReset", AuthController.requestPasswordReset);
router.post("/auth/updatePassword", AuthController.updatePassword);
router.post("/auth/refresh", AuthController.refresh);
router.get("/auth/activate/:link", AuthController.activateLink);
router.get("/auth/users", roleMiddleware(["admin"]), AuthController.getUsers);
router.get("/auth/user", roleMiddleware(["admin"]), AuthController.getUser);

router.post("/profile/personalInfo", AuthController.personalInfo);
router.post("/profile/order", AuthController.order);
router.get("/profile/allPersonalData", AuthController.allPersonalData);
router.get("/profile/allOrders", AuthController.allOrders);

module.exports = router;
