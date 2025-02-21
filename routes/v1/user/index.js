import { Router } from "express";
// import { checkForAuthentication } from "../../../middlewares/auth.js";
import { handleUserLoginController,handleUserSignupController } from "../../../controller/userController.js";

const router = Router();

router.post("/signup", handleUserSignupController);
router.post("/signin", handleUserLoginController);

export default router;
