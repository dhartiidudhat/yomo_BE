import express from 'express';
import authRoutes from '../routes/userRoute';
import localizRoutes from '../routes/localizationRoute';
import chatRoutes from '../routes/chatRoutes';
import mapRoute from '../routes/mapRoute'

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/chat', chatRoutes);
router.use('/auth', authRoutes);
router.use('/local', localizRoutes);
router.use('/map', mapRoute);
export = router;