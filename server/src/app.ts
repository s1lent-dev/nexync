import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import { expressMiddleware } from "@apollo/server/express4";
import { graphqlServer } from "./graphql/graphql.js";
import bodyParser from "body-parser";
import { verifySocket } from './middlewares/verifySocket.middleware.js';
import { ErrorMiddleware } from './middlewares/error.middleware.js';
import { createServer } from 'http';
import { ChatSocket } from './lib/socket/chat.socket.js';
import { intializeGoogleOAuth } from './middlewares/verify.google.js';
import { intializeGithubOAuth } from './middlewares/verify.github.js';

dotenv.config();
const app = express();
const server = createServer(app);
const socketService = new ChatSocket(server);
const io = socketService.getIo();
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true, 
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
await graphqlServer.start();
app.use('/graphql', bodyParser.json(), expressMiddleware(graphqlServer));

intializeGoogleOAuth();
intializeGithubOAuth();
app.use(session({
    secret: process.env.OAUTH_SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('*', (req, res) => {
   res.status(404).json({
       success: false,
       message: 'Resource not found',
   });
});

io.use((socket: any, next: any) => {
    cookieParser()(
        socket.request,
        socket.request.res,
        async(err) => await verifySocket(err, socket, next)
    );
})

app.use(ErrorMiddleware as any);

export { server };