import {Router} from "express";
import { register,emailVerification, login } from "../controllers/auth.js";
import { isEmailVerified } from "../middlewares/auth/auth.js";

const router = Router();
router.post("/register", register);
router.post("/email-verification", emailVerification);
router.post("/login", isEmailVerified, login);
export default router;