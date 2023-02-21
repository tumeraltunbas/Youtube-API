import {Router} from "express";
import authRoutes from "./auth.js";
import channelRoutes from "./channel.js";
import playlistRoutes from "./playlist.js";
import staffRoutes from "./staff.js";
import userRoutes from "./user.js";
import { index, trends, searchVideo } from "../controllers/index.js";
import { getAccessToRoute } from "../middlewares/auth/auth.js";

const router = Router();
router.get("/", getAccessToRoute, index);
router.get("/trends", getAccessToRoute, trends);
router.use("/auth", authRoutes);
router.use("/channel", channelRoutes);
router.use("/playlist", playlistRoutes);
router.use("/staff", staffRoutes);
router.use("/user", userRoutes);
router.get("/search",[getAccessToRoute], searchVideo);
export default router;