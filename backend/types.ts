import z from "zod";


export const CreateUser = z.object({
    username: z.string(),
    email: z.email(),
    fullname: z.string(),
    password: z.string()
})

export interface UserSchema{
    uuid:string,
    username:string,
    email:string,
    fullname:string,
}