import {Router} from "express";
import { createPlaylist } from "../controllers/playlist.js";
import {getAccessToRoute} from "../middlewares/auth/auth.js";
const router = Router();
router.use(getAccessToRoute);
router.post("/create", createPlaylist);

export default router;