import z from "zod";

const formSchema = z.object({
    fullname: z.string().min(3, "use real valid name"),
    username: z.string().min(3, "it must be a valid username"),
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

export default formSchema