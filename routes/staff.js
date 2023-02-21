import {Router} from "express";
import { verificationRequests } from "../controllers/staff.js";
import {getAccessToRoute, getStaffAccess} from "../middlewares/auth/auth.js";

const router = Router();
router.get("/verification-requests", [getAccessToRoute, getStaffAccess], verificationRequests);

export default router;