import { Router } from "express";
import { registerMiddleware } from "../middlewares/Register-middleware";
import { hash, compare } from "bcrypt";
import { PrismaClient } from "../generated/prisma";
import jwt from 'jsonwebtoken'
import prisma from "../utils/prisma.utility";


const router = Router()

router.route("/register").post(registerMiddleware, async (req, res) => {

    const { username, fullName, fullname, email, password,pic } = req.body;
console.log(pic);

    const passwordHash = await hash(password, 10);
    const result = await prisma.user.create({
        data: {
            username: username,
            fullName: fullName ?? fullname,
            pic: pic,
            email: email,
            passwordHash: passwordHash,
        }
    });


    const token = jwt.sign(
        {
            uuid: result.id?.toString(),
            username: result.username
        },
        String(process.env.SECRET_KEY), {
        expiresIn: '2d',
    });


    return res.send({
        message: "user created successfully",
        success: true,
        data: { token: token }
    })

})


router.route("/login").post(async (req, res) => {
    const { username, password } = req.body;

    const checkUsername = await prisma.user.findFirst({ where: { username } })
    if (!checkUsername) {
        return res.send({
            message: "invalid credentials",
            success: false,
            data: {}
        })
    }

    compare(password, checkUsername.passwordHash, (err: any, result: any) => {
        if (result) {
            // Passwords match, authentication successful
            
            const token = jwt.sign({ uuid: checkUsername.id?.toString(), username: checkUsername.username }, String(process.env.SECRET_KEY), {
                expiresIn: '2d',
            });
            return res.send({
                message: "logdin",  
                success: true,
                data: { token: token }
            })
        } else {
            // Passwords don't match, authentication failed
            return res.status(401).send({
                message: "usern not logdin",
                success: false,
                data: {}
            })
        }
    })

})



router.route("/logout").post((req, res) => {
    res.send({
        message: "user loggedout successfully",
        success: true,
        data: {}
    })
})



//TODO: /api/auth/refresh – Refresh JWT/session
router.route("/refresh").post((req, res) => {
    res.status(401).send({
        message: "",
        success: false,
        data: {}
    })
})

export default router