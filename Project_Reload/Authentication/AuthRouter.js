import express from 'express'
import { Registration } from './RegisterRouter.js'
import { Authentication } from './LoginRouter.js'
import { AuthMiddleware } from '../Middlewares/Auth_middleware.js'
import { AdminAuth } from './AdminAuth.js'
import { AdminMiddleware } from '../Middlewares/Admin_middleare.js'
import { ChangePassword } from './ChangePassword.js'
import { LoggedOut } from './LogOut.js'
import { GetLogout } from './userlogout.js'
import { VerifyToken } from '../Middlewares/LoginVerifyToken.js'
import { GetUsers } from './Getuser.js'

const authRouter = express();

authRouter.get('/get', GetUsers)
authRouter.post('/register', Registration);
authRouter.post('/login', Authentication);
authRouter.post('/logout', VerifyToken, GetLogout)
authRouter.post('/wellcome', AuthMiddleware);
authRouter.post('/admin', AuthMiddleware, AdminMiddleware, AdminAuth);
// authRouter.post('/adminLogout', AuthMiddleware, AdminMiddleware, LoggedOut);
authRouter.post('/changePass', AuthMiddleware, AdminMiddleware, ChangePassword);

export { authRouter }