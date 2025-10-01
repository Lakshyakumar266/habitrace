import { Router } from "express";
import { registerMiddleware } from "../middlewares/Register-middleware";
import { hash, compare } from "bcrypt";
import { PrismaClient } from "../generated/prisma";
import jwt from 'jsonwebtoken'
import prisma from "../utils/prisma.utility";
import { CreateUser } from "../types";


const router = Router()

router.route("/register").post(registerMiddleware, async (req, res) => {

    const { username, fullName, fullname, email, password, pic } = req.body;
    
    const passwordHash = await hash(password, 10);
    
    const result = await prisma.user.create({
        data: {
            username: username,
            fullName: fullName ?? fullname,
            pic: (pic? pic : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"),
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



router.route("/checkusername").get(async (req, res) => {
    const { username, email } = req.body
    try {
        const checkUsername = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } })
        if (checkUsername?.username === username) {
            return res.status(200).send({
                message: "username alredy exist",
                success: false,
                data: { username: false, email: true }
            });
        }

        if (checkUsername?.email === email) {
            return res.status(200).send({
                message: "email alredy exist",
                success: false,
                error: { username: true, email: false }
            });
        }

        return res.status(200).send({
            message: "username & email available",
            success: true,
            data: {}
        });

    } catch (error) {
        return res.status(401).send({
            message: "username unavailabe",
            success: false,
            data: {}
        })
    }
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