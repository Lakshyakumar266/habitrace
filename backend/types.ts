import z from "zod";


export const CreateUser = z.object({
    username: z.string(),
    email: z.email(),
    fullname: z.string(),
    password: z.string(),
    pic: z.string(),
})

export interface UserSchema {
    uuid: string,
    username: string,
    email: string,
    fullname: string,
}

export const CreateRace = z.object({
    name: z.string(),
    description: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date()
})