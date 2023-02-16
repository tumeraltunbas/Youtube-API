import {Router} from "express";
import { createChannel,uploadChannelProfilePhoto,editChannelInformations,getChannel } from "../controllers/channel.js";
import { getAccessToRoute } from "../middlewares/auth/auth.js";
import videoRoutes from "./video.js";

const router = Router();
router.post("/create", getAccessToRoute, createChannel);
router.post("/profile-photo", getAccessToRoute, uploadChannelProfilePhoto);
router.put("/edit", getAccessToRoute, editChannelInformations);
router.get("/:channelSlug", getChannel);
router.use("/:channelSlug", videoRoutes);

export default router;