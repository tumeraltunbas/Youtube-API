import {Router} from "express";
import { createPlaylist, hidePlaylist,editPlaylist} from "../controllers/playlist.js";
import {getAccessToRoute, getPlaylistOwnerAccess} from "../middlewares/auth/auth.js";
import { isPlaylistExists} from "../middlewares/query/queryMiddleware.js";

const router = Router({mergeParams:true});

router.use(getAccessToRoute);
router.post("/create", getAccessToRoute, createPlaylist);
router.put("/hide/:playlistId", [getAccessToRoute, isPlaylistExists, getPlaylistOwnerAccess], hidePlaylist);
router.put("/edit/:playlistId", [getAccessToRoute, isPlaylistExists, getPlaylistOwnerAccess], editPlaylist);

export default router;