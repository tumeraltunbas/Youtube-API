import {Router} from "express";
import { editVideo, uploadVideo,watchVideo,likeVideo,dislikeVideo } from "../controllers/video.js";
import { getAccessToRoute, getVideoOwnerAccess } from "../middlewares/auth/auth.js";
import { isVideoExists } from "../middlewares/query/queryMiddleware.js";

const router = Router({mergeParams:true});
router.post("/upload", getAccessToRoute, uploadVideo);
router.put("/edit/:videoSlug", [getAccessToRoute, isVideoExists ,getVideoOwnerAccess], editVideo);
router.get("/watch/:videoSlug", [getAccessToRoute,isVideoExists], watchVideo);
router.get("/like/:videoSlug", [getAccessToRoute, isVideoExists], likeVideo);
router.get("/dislike/:videoSlug", [getAccessToRoute, isVideoExists], dislikeVideo);


export default router;