import ex from 'express';
import { PORT } from './config.js';
import{globalErrorHandling} from './middelWare/error.middleware.js'
import { bootStrap } from './DB/DBconnection.js';
import { userController } from './modules/user/index.js';
import { authController } from './modules/auth/index.js';
import cors from 'cors'
import { messageController } from './modules/message/index.js';

const app = ex();
console.log(process.env.NODE_ENV);
app.use("/assets" , ex.static("./assets"))
app.use(ex.json());
app.use(cors())
app.use("/user",userController)
app.use("/auth",authController)
app.use("/message",messageController)
await bootStrap(app,PORT)


app.use(globalErrorHandling)

