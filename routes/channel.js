import {Router} from "express";
import { createChannel,uploadChannelProfilePhoto,editChannelInformations,getChannel } from "../controllers/channel.js";
import { getAccessToRoute } from "../middlewares/auth/auth.js";

const router = Router();
router.post("/create", getAccessToRoute, createChannel);
router.post("/profile-photo", getAccessToRoute, uploadChannelProfilePhoto);
router.put("/edit", getAccessToRoute, editChannelInformations);
router.get("/:slug", getChannel);

export default router;