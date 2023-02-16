import {Router} from "express";
import { uploadVideo } from "../controllers/video.js";
import { getAccessToRoute } from "../middlewares/auth/auth.js";

const router = Router({mergeParams:true});
router.post("/upload", getAccessToRoute, uploadVideo);


export default router;