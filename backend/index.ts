// import { PrismaClient, type User } from "./generated/prisma";
// import { hash } from 'bcrypt';
import express from 'express'
import cors from 'cors'

// const prisma = new PrismaClient();

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// routes
import authRouter from './routes/auth'

app.use('/api/v1/auth', authRouter)


app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
})
