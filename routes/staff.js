import {Router} from "express";
import { getReports, refuseChannelVerification, verificationRequests, verifyChannel } from "../controllers/staff.js";
import {getAccessToRoute, getStaffAccess} from "../middlewares/auth/auth.js";
import { isVerificationRequestExists } from "../middlewares/query/queryMiddleware.js";

const router = Router();
router.get("/verification-requests", [getAccessToRoute, getStaffAccess], verificationRequests);
router.get("/verification-requests/:channelId/verify", [getAccessToRoute, getStaffAccess, isVerificationRequestExists], verifyChannel);
router.get("/verification-requests/:channelId/refuse", [getAccessToRoute, getStaffAccess, isVerificationRequestExists], refuseChannelVerification);
router.get("/reports", [getAccessToRoute, getStaffAccess], getReports);

export default router;