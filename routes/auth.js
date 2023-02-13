import {Router} from "express";
import { register,emailVerification } from "../controllers/auth.js";

const router = Router();
router.post("/register", register);
router.post("/email-verification", emailVerification);

export default router;