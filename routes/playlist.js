import {Router} from "express";
import { createPlaylist, hidePlaylist } from "../controllers/playlist.js";
import {getAccessToRoute, getPlaylistOwnerAccess} from "../middlewares/auth/auth.js";
import { isPlaylistExists } from "../middlewares/query/queryMiddleware.js";

const router = Router();

router.use(getAccessToRoute);
router.post("/create", getAccessToRoute, createPlaylist);
router.put("/hide/:playlistId", [getAccessToRoute, isPlaylistExists, getPlaylistOwnerAccess], hidePlaylist);

export default router;