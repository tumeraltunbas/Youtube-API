import {Router} from "express";
import authRoutes from "./auth.js";
import channelRoutes from "./channel.js";

const router = Router();
router.use("/auth", authRoutes);
router.use("/channel", channelRoutes);

export default router;