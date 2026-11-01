import { Router } from "express";
const router = Router();
import {
  signup,
  login,
  confirmEmail,
  signupWithGmail,
  resendconfirmEmail,
  forgetPassword,
  confirmForgetPasswordCode,
  resetForgotPassword,
  verifyLoginOTP,
  loginWith2Step,
} from "./authService.js";
import { successResponse } from "../../common/utils/successResponse.js";
import { validation } from "../../middelWare/index.js";
import * as validators from "./authentication.validation.js";
import { del } from "../../common/service/cache.service.js";
import { generateLimiter } from "../../common/utils/limiter.js";

router.post(
  "/signup",
  validation(validators.signup),
  async (req, res, next) => {
    const user = await signup(req.body);
    successResponse({ res, status: 201, data: user, message: "user added ❤️" });
  },
);
router.post(
  "/verify-login-otp",
  validation(validators.confirmEmail),
  async (req, res, next) => {
    const data = await verifyLoginOTP(
      req.body,
      `${req.protocol}://${req.host}`,
    );
    successResponse({ res, status: 200, data, message: "Login successful" });
  },
);

router.post("/signup-with-gmail", async (req, res, next) => {
  const { status, data } = await signupWithGmail(
    req.body,
    `${req.protocol}://${req.host}`,
  );
  successResponse({ res, status, data });
});
router.patch(
  "/resendconfirm-email",
  validation(validators.resendconfirmEmail),
  async (req, res, next) => {
    const data = await resendconfirmEmail(req.body);
    successResponse({ res, status: 200, data });
  },
);

router.patch(
  "/confirm-email",
  validation(validators.confirmEmail),
  async (req, res, next) => {
    const data = await confirmEmail(req.body);
    successResponse({
      res,
      status: 200,
      data,
      message: "email confirmed successfuly ",
    });
  },
);

router.post(
  "/forget-password",
  validation(validators.resendconfirmEmail),
  async (req, res, next) => {
    const data = await forgetPassword(req.body);
    successResponse({ res, status: 201, data });
  },
);

router.post(
  "/confirm-forgetPassCode",
  validation(validators.confirmEmail),
  async (req, res, next) => {
    const data = await confirmForgetPasswordCode(req.body);
    successResponse({ res, status: 200, data });
  },
);

router.patch(
  "/reset-forget-password",
  validation(validators.resetPassword),
  async (req, res, next) => {
    const data = await resetForgotPassword(req.body);
    successResponse({ res, status: 200, data });
  },
);
const loginLimiter = generateLimiter({
  ttl: 5,
  limit: 5,
  skipSuccessfulRequests: true,
});
router.post(
  "/login",
  loginLimiter,
  validation(validators.login),
  async (req, res, next) => {
    const user = await login(
      req.validate.body,
      `${req.protocol}://${req.host}`,
    );
    await del({ key: req.rateLimit.key });
    successResponse({
      res,
      status: 200,
      data: user,
      message: "Login successful",
    });
  },
);
router.post(
  "/login-with-2step",
  validation(validators.login),
  async (req, res, next) => {
    const data = await loginWith2Step(req.validate.body);
    successResponse({ res, status: 200, data });
  },
);

export default router;
