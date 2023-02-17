import {Router} from "express";
import { createComment, hideComment, likeComment,dislikeComment } from "../controllers/comment.js";
import { getAccessToRoute, getCommentOwnerAccess } from "../middlewares/auth/auth.js";
import { isCommentExists, isVideoExists } from "../middlewares/query/queryMiddleware.js";

const router = Router({mergeParams:true});

router.post("/",[getAccessToRoute, isVideoExists] ,createComment);
router.delete("/hide/:commentId", [getAccessToRoute, isCommentExists, getCommentOwnerAccess], hideComment);
router.get("/like/:commentId", [getAccessToRoute, isCommentExists], likeComment);
router.get("/dislike/:commentId", [getAccessToRoute, isCommentExists], dislikeComment);

export default router;