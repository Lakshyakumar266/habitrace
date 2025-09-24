import axios from "axios";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith001" },
                email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
                password: { label: "Password", type: "password" }
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            async authorize(credentials: any, req): Promise<any> {
                const { username, email, password } = credentials as {
                    username: string;
                    email: string;
                    password: string;
                };

                // Add logic here to look up the user from the credentials supplied
                try {
                    const res = await axios.post("http://localhost:3000/api/auth/checkusername", {
                        username: username,
                        email: email,
                        password: password

                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    }) as { data: any };
                    console.log(res.data);

                } catch (err: unknown) {
                    if (err instanceof Error) {
                        throw err;
                    }
                    throw new Error("An unknown error occurred");
                }

            }

        })
    ]
}