import { Router } from "express";
import { register, verify, resend, login } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);   // student registers
router.post("/verify", verify);       // email + code
router.post("/resend", resend);       // email only
router.post("/login", login);         // login after verified

export default router;