import { Router } from "express";
import userRoutes from "../routes/v1/user/index.js";
import postRoutes from "../routes/v1/post/index.js";
import feedRoutes from "../routes/v1/post/feed/index.js"

import {checkForAuthentication} from "../middlewares/auth.js"


const router = Router()

router.use("/v1/user" , userRoutes);
router.use("/v1/post" ,checkForAuthentication, postRoutes);
router.use("/v1/feeds" , feedRoutes);


export default router;