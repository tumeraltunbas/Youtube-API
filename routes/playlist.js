import {Router} from "express";
import { createPlaylist, hidePlaylist,addVideoToPlaylist } from "../controllers/playlist.js";
import {getAccessToRoute, getPlaylistOwnerAccess} from "../middlewares/auth/auth.js";
import { isPlaylistExists, isVideoExists } from "../middlewares/query/queryMiddleware.js";

const router = Router({mergeParams:true});

router.use(getAccessToRoute);
router.post("/create", getAccessToRoute, createPlaylist);
router.put("/hide/:playlistId", [getAccessToRoute, isPlaylistExists, getPlaylistOwnerAccess], hidePlaylist);
router.get("/add/:playlistId", [getAccessToRoute, isVideoExists, isPlaylistExists], addVideoToPlaylist);

export default router;