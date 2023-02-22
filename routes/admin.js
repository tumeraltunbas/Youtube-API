import {Router} from "express";
import { getAllUsers, getUserById } from "../controllers/admin.js";
import {getAccessToRoute, getAdminAccess} from "../middlewares/auth/auth.js";
import { isUserExists } from "../middlewares/query/queryMiddleware.js";

const router = Router();
router.use([getAccessToRoute, getAdminAccess]);
router.get("/users", getAllUsers);
router.get("/users/:userId", isUserExists, getUserById);

export default router;