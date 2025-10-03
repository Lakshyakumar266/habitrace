import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth'
import usersRouter from './routes/users'
import raceRouter from './routes/race-services'
import notificationRouter, { notificationHandler } from './routes/notification-services'
import { WebSocketServer, WebSocket } from 'ws'


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: '*',
    credentials: true
}));
// app.options('*', cors());


// routes
app.use('/api/v1/auth', authRouter)

app.use('/api/v1/race', raceRouter)
app.use('/api/v1/user', usersRouter)
app.use('/api/v1/notification', notificationRouter)

const httpServer = app.listen(process.env.APP_PORT, () => {
    console.log(`HabbitRacer Server listening on port ${process.env.APP_PORT}`)
})

const socketServer = new WebSocketServer({ server: httpServer });

socketServer.on('connection', function connection(socket: any, req: any) {

    const username = new URLSearchParams(req.url.split('?')[1]).get('username');
    socket.username = username;
    socket.on('message', function message(data: any, isBinary: any) {
        const messageString = isBinary ? data.toString('utf-8') : data.toString();
        notificationHandler(messageString, socket)
    });
});