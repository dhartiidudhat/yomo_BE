import express from 'express';
import validate from '../middlewares/validate';
import authValidation from '../customValidations/userValidation';
import authController from '../controller/userController';
import uploadProfileImage from '../middlewares/multerConfig';
import { auth } from '../middlewares/auth';
import { getSessionValid } from '../middlewares/authSession';

const router = express.Router();
router.post('/register', validate(authValidation.userRegister), authController.registerUser);
router.post('/login', validate(authValidation.Login), authController.loginUser);
router.put('/verifyUser/:id', validate(authValidation.verifyUser), authController.userVerification);
router.put('/refreshToken', authController.userRefreshToken);
router.put('/resend', validate(authValidation.resendOtp), authController.resendOtp);
router.put('/userLogout/:userId', validate(authValidation.getUserById), authController.userLogout);
// router.put('/profileUpdate/:userId', auth("updateProfile"), uploadProfileImage.single('profileImage'), validate(authValidation.userProfile), authController.updateUser);
router.put('/profileUpdate/:userId', auth("updateProfile"),validate(authValidation.userProfile),authController.updateUser);
router.put('/profileImageUpdate/:userId',auth("updateProfile"),uploadProfileImage('profiles', true).single('profileImage'),authController.profileUpdate);
router.get('/getUserById/:userId',auth("getUser") ,validate(authValidation.getUserById), authController.getUserById);
router.get('/getAllUser', authController.getAllUser);
router.post('/connect', auth("connectUsers"), validate(authValidation.connect), authController.createConnection)
router.put('/connectResponse/:requestId', auth("connectUsers"), getSessionValid, validate(authValidation.respond), authController.respondRequest);
router.get('/requestSent', auth("connectUsers"), validate(authValidation.getConnect), authController.getRequestSend);
router.get('/requestReceive', auth("connectUsers"), validate(authValidation.getRequest), authController.getRequestReceive);

router.put('/emailUpdate/:userId',auth("updateProfile"),validate(authValidation.updateEmail),authController.EmailUpdate);
router.put('/verifyEmailOtp/:userId',auth("updateProfile"),validate(authValidation.verifyOtpMail),authController.verifyEmailOtp);
router.put('/verifyNumber/:userId',auth("updateProfile"),validate(authValidation.verifyOtpNumber),authController.verifyNumber);
router.put('/mobileUpdate/:userId',auth("updateProfile"),validate(authValidation.updateMobile), authController.mobileUpdate);
export = router;
