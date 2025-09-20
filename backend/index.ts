// import { PrismaClient, type User } from "./generated/prisma";
// import { hash } from 'bcrypt';
import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth'
import usersRouter from './routes/users'

// const prisma = new PrismaClient();

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// routes
app.use('/api/v1/auth', authRouter)

app.use('/api/v1/users', usersRouter)



app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
})
