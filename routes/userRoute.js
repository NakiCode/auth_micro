import * as userController from '../controllers/userController.js';
import express from 'express';

const router = express.Router()

router.post('/signup', userController.createUser);
router.post('/login', userController.login);
router.get('/verifyEmail', userController.verifyUser);
router.get('/verifyPhone', userController.verifyUser);
router.get('/verifyCode', userController.verifyCode);
router.get('/getAll', userController.getAllUser);
router.get('/get', userController.getUser);
router.patch('/update', userController.updateUser);
router.delete('/delete', userController.deleteUser);
router.post('/forgetPassword', userController.forgetPassword);
router.put('/changeEmail', userController.changeEmail);
router.put('/changePassword', userController.changePassword);


export default router
