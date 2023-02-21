import {Router} from "express";
import { createChannel,uploadChannelProfilePhoto,editChannelInformations,getChannel, subscribe,unsubscribe,channelAbout,searchInChannel, uploadBanner } from "../controllers/channel.js";
import { getAccessToRoute } from "../middlewares/auth/auth.js";
import { isChannelExist } from "../middlewares/query/queryMiddleware.js";
import videoRoutes from "./video.js";

const router = Router();
router.post("/create", getAccessToRoute, createChannel);
router.post("/profile-photo", getAccessToRoute, uploadChannelProfilePhoto);
router.post("/banner", getAccessToRoute, uploadBanner);
router.put("/edit", getAccessToRoute, editChannelInformations);
router.get("/subscribe/:channelSlug", [getAccessToRoute, isChannelExist], subscribe);
router.get("/unsubscribe/:channelSlug", [getAccessToRoute, isChannelExist], unsubscribe);
router.get("/about/:channelSlug", [getAccessToRoute, isChannelExist], channelAbout);
router.get("/search/:channelSlug", [getAccessToRoute,isChannelExist], searchInChannel);
router.get("/:channelSlug", getChannel);
router.use("/:channelSlug", videoRoutes);

export default router;