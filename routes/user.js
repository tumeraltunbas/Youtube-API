import {Router} from "express";
import { getLikedVideos, getWatchHistory,getSubscriptions } from "../controllers/user.js";
import { getAccessToRoute } from "../middlewares/auth/auth.js";

const router = Router();
router.get("/liked-videos", [getAccessToRoute], getLikedVideos);
router.get("/watch-history", [getAccessToRoute], getWatchHistory);
router.get("/subscriptions", [getAccessToRoute], getSubscriptions);
export default router;