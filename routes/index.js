import { Router } from "express";
import userRoutes from "../routes/v1/user/index.js"

const router = Router()

router.use("/v1/user" , userRoutes)

export default router;