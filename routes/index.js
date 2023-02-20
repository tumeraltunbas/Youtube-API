import {Router} from "express";
import authRoutes from "./auth.js";
import channelRoutes from "./channel.js";
import { index, trends, searchVideo } from "../controllers/index.js";
import { getAccessToRoute } from "../middlewares/auth/auth.js";
import playlistRoutes from "./playlist.js";

const router = Router();
router.get("/", getAccessToRoute, index);
router.get("/trends", getAccessToRoute, trends);
router.use("/auth", authRoutes);
router.use("/channel", channelRoutes);
router.use("/playlist", playlistRoutes);
router.get("/search",[getAccessToRoute], searchVideo);
export default router;