import ex from "express";
import { PORT } from "./config.js";
import { globalErrorHandling } from "./middelWare/error.middleware.js";
import { bootStrap } from "./DB/DBconnection.js";
import { userController } from "./modules/user/index.js";
import { authController } from "./modules/auth/index.js";
import cors from "cors";
import { messageController } from "./modules/message/index.js";
import helmet from "helmet";
import { identityRequestController } from "./modules/identityRequest/index.js";
import { conversationMssageController } from "./modules/conversationMessages/index.js";
import { generateLimiter } from "./common/utils/limiter.js";
import morgan from "morgan";

var corsOptions = {
  origin: "http://127.0.0.1:5500",
  optionsSuccessStatus: 200,
};

const limiter = generateLimiter({});
const app = ex();
app.set("trust proxy", true);
app.use(helmet(), limiter, morgan("dev"), cors(corsOptions), ex.json());
app.use("/assets", ex.static("./assets"));
app.use(cors());
app.use("/user", userController);
app.use("/auth", authController);
app.use("/message", messageController);
app.use("/identityRequest", identityRequestController);
app.use("/chat", conversationMssageController);
await bootStrap(app, PORT);

app.use(globalErrorHandling);
