import {Router} from "express";
import { addVideoToPlaylist, removeVideoToPlaylist } from "../controllers/playlist.js";
import { editVideo, uploadVideo,watchVideo,likeVideo,dislikeVideo, getVideosByChannel,reportVideo } from "../controllers/video.js";
import { getAccessToRoute, getPlaylistOwnerAccess, getVideoOwnerAccess } from "../middlewares/auth/auth.js";
import { isChannelExist, isPlaylistExists, isVideoExists, isVideoExistsInPlaylist } from "../middlewares/query/queryMiddleware.js";
import commentRoutes from "./comment.js";

const router = Router({mergeParams:true});
router.get("/videos", [getAccessToRoute, isChannelExist], getVideosByChannel);
router.post("/upload", getAccessToRoute, uploadVideo);
router.put("/edit/:videoSlug", [getAccessToRoute, isVideoExists ,getVideoOwnerAccess], editVideo);
router.get("/watch/:videoSlug", [getAccessToRoute,isVideoExists], watchVideo);
router.get("/like/:videoSlug", [getAccessToRoute, isVideoExists], likeVideo);
router.get("/dislike/:videoSlug", [getAccessToRoute, isVideoExists], dislikeVideo);
router.get("/playlist/:videoSlug/add/:playlistId", [getAccessToRoute, isVideoExists, isPlaylistExists,getPlaylistOwnerAccess], addVideoToPlaylist);
router.get("/playlist/:videoSlug/remove/:playlistId", [getAccessToRoute, isVideoExists, isPlaylistExists, isVideoExistsInPlaylist, getPlaylistOwnerAccess], removeVideoToPlaylist);
router.post("/report/:videoSlug", [getAccessToRoute, isVideoExists], reportVideo);
router.use("/comments/:videoSlug", commentRoutes)

export default router;