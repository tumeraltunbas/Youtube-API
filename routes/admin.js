import {Router} from "express";
import { getAllUsers, getUserById,getAllChannels, getChannelBySlug, getAllStaffs, editStaff } from "../controllers/admin.js";
import {getAccessToRoute, getAdminAccess} from "../middlewares/auth/auth.js";
import { isChannelExist, isUserExists } from "../middlewares/query/queryMiddleware.js";

const router = Router();
router.use([getAccessToRoute, getAdminAccess]);
router.get("/users", getAllUsers);
router.get("/users/:userId", isUserExists, getUserById);
router.get("/staffs", getAllStaffs);
router.put("staff/edit/:userId", isUserExists, editStaff);
router.get("/channels", getAllChannels);
router.get("/channels/:channelSlug", isChannelExist, getChannelBySlug);

export default router;