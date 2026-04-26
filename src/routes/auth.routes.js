import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import debugLib from "debug";

const debug = debugLib('exp:src:routes:>>>AUTH>>>')

const router = Router();
debug('auth routes')

router.post('/sign-in',authController.signIn);
router.get('/logaut',authController.logaut);
router.post('/sign-out', authController.signOut);
router.get('/chek',authController.check);
export default router