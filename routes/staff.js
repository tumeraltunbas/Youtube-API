import {Router} from "express";
import { refuseChannelVerification, verificationRequests, verifyChannel } from "../controllers/staff.js";
import {getAccessToRoute, getStaffAccess} from "../middlewares/auth/auth.js";
import { isVerificationRequestExists } from "../middlewares/query/queryMiddleware.js";

const router = Router();
router.get("/verification-requests", [getAccessToRoute, getStaffAccess], verificationRequests);
router.get("/verification-requests/:channelId/verify", [getAccessToRoute, getStaffAccess, isVerificationRequestExists], verifyChannel);
router.get("/verification-requests/:channelId/refuse", [getAccessToRoute, getStaffAccess, isVerificationRequestExists], refuseChannelVerification);

export default router;