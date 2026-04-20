import { Router } from "express";
import userController from "../controllers/user.controller.js";
import debugLib from "debug";

const debug = debugLib('exp:src:controllers:--USER--')

const router = Router();

router.get('/',userController.getAll);
router.get('/:id',userController.getById);
router.post('/', userController.create);
router.put('/:id',userController.update);
router.delete('/:id', userController.delete);
router.get('/with-things/:id',userController.getUserWithThings);
router.post('/by-email', userController.getByEmail);
router.post('/by-login', userController.getByLogin);

export default router