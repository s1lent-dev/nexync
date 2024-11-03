// Imports
import express, { Request, Response } from 'express';
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
import authRouter from './routes/auth.routes.js';
import { verifySocket } from './middlewares/verifySocket.middleware.js';
import { ErrorMiddleware } from './middlewares/error.middleware.js';

// Server 
const app = express();
const server = createServer(app);
const socketService = new ChatSocket(server);
const io = socketService.getIo();

// Middlewares
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
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

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});
app.get('*', (req: Request, res: Response) => {
   res.status(404).json({
       success: false,
       message: 'Resource not found',
   });
});

// Socket Middlewares
io.use((socket: any, next: any) => {
    cookieParser()(
        socket.request,
        socket.request.res,
        async(err) => await verifySocket(err, socket, next)
    );
})

// Error Middleware
app.use(ErrorMiddleware as any);

// Export
export { server };