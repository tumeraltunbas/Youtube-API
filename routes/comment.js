import {Router} from "express";
import { createComment, hideComment, likeComment } from "../controllers/comment.js";
import { getAccessToRoute, getCommentOwnerAccess } from "../middlewares/auth/auth.js";
import { isCommentExists, isVideoExists } from "../middlewares/query/queryMiddleware.js";

const router = Router({mergeParams:true});

router.post("/",[getAccessToRoute, isVideoExists] ,createComment);
router.delete("/hide/:commentId", [getAccessToRoute, isCommentExists, getCommentOwnerAccess], hideComment);
router.get("/like/:commentId", [getAccessToRoute, isCommentExists], likeComment);

export default router;