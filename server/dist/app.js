// Imports
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from "body-parser";
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import { expressMiddleware } from "@apollo/server/express4";
import { graphqlServer } from "./graphql/graphql.js";
import { intializeGoogleOAuth } from './middlewares/verify.google.js';
import { intializeGithubOAuth } from './middlewares/verify.github.js';
import { ChatSocket } from './lib/socket/chat.socket.js';
import { PubSubRedis } from './lib/redis/pubsub.redis.js';
import { RedisCache } from './lib/redis/cache.redis.js';
import { ChatKafkaService } from './lib/kafka/chat.kafka.js';
import { EmailQueue } from './lib/rabbitmq/email.queue.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import chatRouter from './routes/chat.routes.js';
import { verifySocket } from './middlewares/verifySocket.middleware.js';
import { ErrorMiddleware } from './middlewares/error.middleware.js';
import { FRONTEND_URL } from './config/config.js';
// Server 
const app = express();
const server = createServer(app);
// Socket
const socketService = new ChatSocket(server);
const io = socketService.getIo();
// Services
const pubsub = new PubSubRedis();
const cache = new RedisCache();
const kafka = new ChatKafkaService();
const emailQueue = new EmailQueue();
async function initServices() {
    await kafka.consumeMessages();
    await kafka.consumeMessageRead();
    await emailQueue.connect();
    await emailQueue.initQueues();
    await emailQueue.initConsumers();
    await pubsub.subscribeToChannels();
}
// Middlewares
app.use(cors({
    origin: [FRONTEND_URL],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
// GraphQL
await graphqlServer.start();
app.use('/graphql', bodyParser.json(), expressMiddleware(graphqlServer));
// OAuth Middlewares
intializeGoogleOAuth();
intializeGithubOAuth();
app.use(session({
    secret: process.env.OAUTH_SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
// Routes
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/chat', chatRouter);
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.get('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Resource not found',
    });
});
// Socket Middlewares
io.use((socket, next) => {
    cookieParser()(socket.request, socket.request.res, async (err) => await verifySocket(err, socket, next));
});
// Error Middleware
app.use(ErrorMiddleware);
// Export
export { server, initServices, socketService, pubsub, cache, kafka, emailQueue };
