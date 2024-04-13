import express from 'express';
import validate from '../middlewares/validate';
import mapValidation from '../customValidations/mapValidation';
import mapController from '../controller/mapController';
import { auth } from '../middlewares/auth';

const router = express.Router();

router.put('/mapCreate/:userId',auth("mapCreate"),validate(mapValidation.mapValidation),mapController.createMap);

export = router;

