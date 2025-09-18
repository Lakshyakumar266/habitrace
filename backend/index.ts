// import { PrismaClient, type User } from "./generated/prisma";
// import { hash } from 'bcrypt';
import express from 'express'
import cors from 'cors'

// const prisma = new PrismaClient();

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// Auth 
// app.post('/v1/auth/register', async (req, res) => {
//     const { username, fullName, fullname, email, password } = req.body;
//     const passwordHash = await hash(password, 10);
//     const checkUsername = await prisma.user.findFirst({where:{OR: [{username},{email}]}})
//     console.log("uext", checkUsername);
//     if(checkUsername){
//         res.send(["user exist"])
//     }
//     const result = await prisma.user.create({
//         data: {
//             username: username,
//             fullName: fullName ?? fullname,
//             email: email,
//             passwordHash: passwordHash,
//         }
//     });
//     res.send({ result })
// })


// app.post('/v1/auth/login', (req, res) => { })
// app.post('/v1/auth/logout', (req, res) => { })


// routes
import authRouter from './routes/auth'

app.use('api/v1/auth', authRouter)


app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
})
