import {Router} from "express";
import { createChannel } from "../controllers/channel.js";
import { getAccessToRoute } from "../middlewares/auth/auth.js";

const router = Router();
router.post("/create", getAccessToRoute, createChannel);

export default router;