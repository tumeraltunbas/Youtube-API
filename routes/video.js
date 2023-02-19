import {Router} from "express";
import { addVideoToPlaylist, removeVideoToPlaylist } from "../controllers/playlist.js";
import { editVideo, uploadVideo,watchVideo,likeVideo,dislikeVideo } from "../controllers/video.js";
import { getAccessToRoute, getPlaylistOwnerAccess, getVideoOwnerAccess } from "../middlewares/auth/auth.js";
import { isPlaylistExists, isVideoExists, isVideoExistsInPlaylist } from "../middlewares/query/queryMiddleware.js";
import commentRoutes from "./comment.js";
import playlistRoutes from "./playlist.js";

const router = Router({mergeParams:true});
router.post("/upload", getAccessToRoute, uploadVideo);
router.put("/edit/:videoSlug", [getAccessToRoute, isVideoExists ,getVideoOwnerAccess], editVideo);
router.get("/watch/:videoSlug", [getAccessToRoute,isVideoExists], watchVideo);
router.get("/like/:videoSlug", [getAccessToRoute, isVideoExists], likeVideo);
router.get("/dislike/:videoSlug", [getAccessToRoute, isVideoExists], dislikeVideo);
router.get("/playlist/:videoSlug/add/:playlistId", [getAccessToRoute, isVideoExists, isPlaylistExists,getPlaylistOwnerAccess], addVideoToPlaylist);
router.get("/playlist/:videoSlug/remove/:playlistId", [getAccessToRoute, isVideoExists, isPlaylistExists, isVideoExistsInPlaylist, getPlaylistOwnerAccess], removeVideoToPlaylist);
router.use("/comments/:videoSlug", commentRoutes)

export default router;