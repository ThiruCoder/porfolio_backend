import express from 'express'
import { Registration } from './RegisterRouter.js'
import { Authentication } from './LoginRouter.js'
import { AuthMiddleware, TokenVerify } from '../Middlewares/Auth_middleware.js'
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
authRouter.post('/tokenVerify', TokenVerify);
authRouter.post('/logout', VerifyToken, GetLogout);
authRouter.post('/wellcome', AuthMiddleware);
authRouter.post('/admin', VerifyToken, AdminMiddleware, AdminAuth);
// authRouter.post('/adminLogout', AuthMiddleware, AdminMiddleware, LoggedOut);
authRouter.post('/changePass', AuthMiddleware, AdminMiddleware, ChangePassword);

export { authRouter }