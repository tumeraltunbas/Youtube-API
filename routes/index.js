import {Router} from "express";
import authRoutes from "./auth.js";
import channelRoutes from "./channel.js";
import { searchVideo } from "../controllers/index.js";
import { getAccessToRoute } from "../middlewares/auth/auth.js";

const router = Router();
router.use("/auth", authRoutes);
router.use("/channel", channelRoutes);
router.get("/search",[getAccessToRoute], searchVideo);
export default router;