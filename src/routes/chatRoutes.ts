import express from 'express';
import chatController from '../controller/chatController';
import chatValidation from '../customValidations/chatValidation';
import validate from '../middlewares/validate';
import { getSessionValid } from '../middlewares/authSession';
import uploadImage from '../middlewares/multerConfig';
import { auth } from '../middlewares/auth';

const router = express.Router();
router.get('/getSession', auth("chat"), chatController.getSession);
router.get('/getUsers', auth("chat"), getSessionValid, validate(chatValidation.getDialogs), chatController.listUsers);
router.get('/getDialogs', auth("chat"), getSessionValid, validate(chatValidation.unreadNotification), chatController.listDialogs);
router.post('/login', auth("chat"), getSessionValid, chatController.login);
router.post('/chat', auth("chat"), getSessionValid, uploadImage('others', false).single('chatImg'), validate(chatValidation.chat), chatController.chatStart);
router.get('/getChat/:chatId', auth("chat"), getSessionValid, validate(chatValidation.getChats), chatController.chatById);
router.post('/chatGroup', auth("chat"), getSessionValid, uploadImage('others', false).single('chatImg'), validate(chatValidation.chat), chatController.chatGroup);
router.get('/totalUnread',auth("chat"), getSessionValid, chatController.getTotalUnread);
router.get('/unreadNotification', auth("chat"), getSessionValid, validate(chatValidation.unreadNotification), chatController.getNotification);
router.post('/sendNotification', auth("notification"), getSessionValid, validate(chatValidation.chat), chatController.createNotificationData)
router.post('/subscribe', auth("notification"), getSessionValid, validate(chatValidation.subscribe), chatController.createSubscribe);
router.get('/subscribeList', auth("notification"), getSessionValid, chatController.getSubscribeList);
router.get('/eventList', auth("notification"), getSessionValid, validate(chatValidation.getDialogs), chatController.getEventList);
router.get('/notification', auth("notification"), validate(chatValidation.unreadNotification), chatController.getNotificationData);
router.put('/notificationUpdate', auth("notification"), validate(chatValidation.updateNotification), chatController.updateNotificationData);
router.put('/blockUnblock',auth("chat"), validate(chatValidation.userManage),chatController.userManage);
router.get('/getuserManage',auth("chat"),validate(chatValidation.getDialogs),chatController.getuserManage);
router.get('/searchChat',auth("chat"),validate(chatValidation.searchChat),chatController.seachChat);
router.post('/clearChat',auth("chat"),validate(chatValidation.clearChat),chatController.clearChat);
export = router;