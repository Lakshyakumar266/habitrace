import { createClient } from "redis";
import { REDIS_URL, SMTP_API } from "./config.js";
import { TransactionalEmailsApi, SendSmtpEmail } from "@getbrevo/brevo";


const client = createClient({
    url: REDIS_URL
});

// Handle errors
client.on("error", (err) => {
    console.error("Redis Client Error: ", err);
});

async function conect() {
    await client.connect();

    console.log("Redis Client Connected");

    client.on("error", (err) => {
        console.log("Redis Client Error", err);
    });


}
conect();


const sendEmail = async (email: string, username: string) => {

    const emailAPI = new TransactionalEmailsApi();
    (emailAPI as any).authentications.apiKey.apiKey = SMTP_API;

    let message = new SendSmtpEmail();
    message.subject = "WELCOME TO HABITRACE";
    message.textContent = "invitation to start racing";
    message.sender = { name: "HabitRace", email: "cherrysoni255@gmail.com" };
    message.to = [{ email: email, name: username }];

    emailAPI
        .sendTransacEmail(message)
        .then((res) => {
            console.log("DONE SENDING EMAIL TO ->", email);
        })
        .catch((err) => {
            console.error("Error sending email:", err.body);
        });
};

while (true) {
    const work = await client.BRPOP("backgroundTasks", 0)
    if (work) {

        const task = JSON.parse(work.element);

        if (task.type === "notification") {
            const userEmail = JSON.parse(work.element).data.email;
            const username = JSON.parse(work.element).data.username;

            await sendEmail(userEmail, username);

            const publishInAppNotification = await client.publish(`notifications:${username}`, JSON.stringify({ type: "notification", payload: { message: `Welcome to HabitRace ${username}` } }))

            if (publishInAppNotification === 1) {
                console.log("PUBLISHED IN APP NOTIFICATION FOR USER ->", username);
            }
        }
    }
}

