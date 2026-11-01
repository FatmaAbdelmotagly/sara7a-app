import { Router } from "express";
const router = Router();

import { successResponse } from "../../common/utils/successResponse.js";
import {
  cacheProfile,
  logout,
  profile,
  rotate,
  update,
} from "./userService.js";
import { authentication, authorization } from "../../middelWare/index.js";

import { TokenTypeEnum } from "../../common/enum/security.tokenEnum.js";
import { RoleEnum } from "../../common/enum/userEnum.js";
import {
  fileValidation,
  localFileUpload,
  uploadMiddleware,
} from "../../common/utils/multer/local.js";

router.get("/", authentication(), async (req, res, next) => {
  const data = await profile(req.user);
  successResponse({ res, status: 201, data });
});
router.patch(
  "/",
  authentication(),
  authorization(RoleEnum.ADMIN),
  async (req, res, next) => {
    const data = await update(req.user, req.body);
    successResponse({ res, status: 201, data });
  },
);
router.patch(
  "/profile-image",
  authentication(),
  uploadMiddleware({
    multerMiddleware: localFileUpload({ maxFileSize: 2 }).single("attachment"),
    customPath: "users",
    validation: fileValidation.image,
  }),
  async (req, res, next) => {
    req.user.image = req.file.finalPath;
    await req.user.save();
    successResponse({ res, status: 201, data: { user: req.user } });
  },
);
router.post(
  "/rotate-token",
  authentication(TokenTypeEnum.REFREASH),
  async (req, res, next) => {
    const data = await rotate(
      req.payLoad,
      req.user,
      ` ${req.protocol}://${req.host}`,
    );
    successResponse({ res, status: 201, data });
  },
);

router.post("/logout", authentication(), async (req, res, next) => {
  const data = await logout(req.payLoad, req.user, req.body);
  successResponse({ res, status: 201, data });
});

router.get("/cacheProfile", authentication(), async (req, res, next) => {
  const data = await cacheProfile(req.user);
  successResponse({ res, status: 200, data });
});

export default router;
