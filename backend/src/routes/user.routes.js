import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { loginUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { logoutUser } from "../controllers/user.controller.js";
import { refreshAccessToken } from "../controllers/user.controller.js";
import { updatePassword } from "../controllers/user.controller.js";
import { getUser } from "../controllers/user.controller.js";
import { updateDetails } from "../controllers/user.controller.js";
import { updateAvatar } from "../controllers/user.controller.js";
import { updateCoverImage } from "../controllers/user.controller.js";
import { deleteUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: "1",
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/refresh-access-token").post(refreshAccessToken);
router.route("/updatePassword").post(verifyJWT, updatePassword);
router.route("/getUser").get(verifyJWT, getUser);
router.route("/updateDetails").patch(verifyJWT, updateDetails);
router
  .route("/updateAvatar")
  .patch(
    verifyJWT,
    upload.fields([{ name: "avatar", maxCount: "1" }]),
    updateAvatar
  );
router
  .route("/updateCoverImage")
  .patch(
    verifyJWT,
    upload.fields([{ name: "coverImage", maxCount: "1" }]),
    updateCoverImage
  );
router.route("/deleteUser").delete(verifyJWT, deleteUser);

export default router;
