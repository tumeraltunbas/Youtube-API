import {Router} from "express";
import { register,emailVerification, login, logout,changePassword,forgotPassword,resetPassword,uploadProfilePhoto,editInformations,phoneVerification, deactiveAccount } from "../controllers/auth.js";
import { isEmailVerified, getAccessToRoute } from "../middlewares/auth/auth.js";

const router = Router();
router.post("/register", register);
router.post("/email-verification", emailVerification);
router.post("/login", isEmailVerified, login);
router.get("/logout", getAccessToRoute, logout);
router.post("/change-password", getAccessToRoute, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/profile-photo-upload", getAccessToRoute, uploadProfilePhoto);
router.put("/edit", getAccessToRoute, editInformations);
router.post("/phone-verification", phoneVerification);
router.post("/deactive", getAccessToRoute, deactiveAccount);
export default router;