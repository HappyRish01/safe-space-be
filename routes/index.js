import { Router } from "express";
import userRoutes from "../routes/v1/user/index.js";
import postRoutes from "../routes/v1/post/index.js";
import feedRoutes from "../routes/v1/post/feed/index.js";
import communityRoutes from "../routes/v1/community/index.js";
import {getPostsController} from "../controller/postController.js";
import {generateUploadSignature,saveImage} from "../controller/mediaController.js";



import {checkForAuthentication} from "../middlewares/auth.js"


const router = Router()

router.use("/v1/user" , userRoutes);
router.use("/v1/post" ,checkForAuthentication, postRoutes);
router.use("/v1/posts" ,checkForAuthentication, getPostsController);
router.use("/v1/feeds" , feedRoutes);
router.use("/v1/community",checkForAuthentication,communityRoutes)
router.use("/v1/generate-upload-signature",checkForAuthentication,generateUploadSignature)
router.use("/v1/save-image",checkForAuthentication,saveImage)


export default router;