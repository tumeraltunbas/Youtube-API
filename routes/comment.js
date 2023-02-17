import {Router} from "express";
import { createComment } from "../controllers/comment.js";
import { getAccessToRoute } from "../middlewares/auth/auth.js";
import { isVideoExists } from "../middlewares/query/queryMiddleware.js";

const router = Router({mergeParams:true});

router.post("/",[getAccessToRoute, isVideoExists] ,createComment);

export default router;