import {Router} from "express";
import { getLikedVideos } from "../controllers/user.js";
import { getAccessToRoute } from "../middlewares/auth/auth.js";

const router = Router();
router.get("/liked-videos", [getAccessToRoute], getLikedVideos);
export default router;