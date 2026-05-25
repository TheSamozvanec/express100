import { Router } from "express";
import thingController from "../controllers/thing.controller.js";
import debugLib from "debug";

const debug = debugLib('exp:src:routes:>>>THING>>>')

const router = Router();
debug('thing routes')

router.get('/',thingController.getAll);
router.post('/',thingController.create);
router.post('/many', thingController.createMany);
router.get('/byUser', thingController.getByUser);
router.get('/:id', thingController.getById);
router.patch('/:id', thingController.update);
router.delete('/:id', thingController.delete);

export default router