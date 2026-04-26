import { Router } from "express";
import userController from "../controllers/user.controller.js";
import debugLib from "debug";

const debug = debugLib('exp:src:routes:>>>USER>>>')

const router = Router();
debug('user routes')
router.get('/',userController.getAll);
router.get('/:id',userController.getById);
router.patch('/:id',userController.update);
router.delete('/:id', userController.delete);
router.get('/with-things/:id',userController.getUserWithThings);
router.post('/by-email', userController.getByEmail);
router.post('/by-login', userController.getByLogin);

export default router