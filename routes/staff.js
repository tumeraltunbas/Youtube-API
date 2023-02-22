import {Router} from "express";
import { verificationRequests, verifyChannel, refuseChannelVerification, getReports, confirmReport, refuseReport } from "../controllers/staff.js";
import {getAccessToRoute, getStaffAccess} from "../middlewares/auth/auth.js";
import { isReportExists, isVerificationRequestExists } from "../middlewares/query/queryMiddleware.js";

const router = Router();
router.use([getAccessToRoute, getStaffAccess]);
router.get("/verification-requests", verificationRequests);
router.get("/verification-requests/:channelId/verify", isVerificationRequestExists, verifyChannel);
router.get("/verification-requests/:channelId/refuse", isVerificationRequestExists, refuseChannelVerification);
router.get("/reports", getReports);
router.get("/reports/:reportId/confirm", isReportExists, confirmReport);
router.get("/reports/:reportId/refuse", isReportExists, refuseReport);

export default router;