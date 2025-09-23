import prisma from "./prisma.utility";

const groupLeaderboard = async (participants: any[], checkins: any[]) => {

    const checkinsClassifier = participants.map(participant => {
        const userCheckins = checkins.filter(checkin =>
            checkin.participationId === participant.id
        );

        return {
            user: participant.id,
            checkins: userCheckins
        };
    });


    const usersStreak = checkinsClassifier.map(async participant => {

        const user = await prisma.user.findFirst({ where: { participations: { some: { id: participant.user } } } })

        return {
            username: user?.username,
            streak: participant.checkins.length
        }
    })

    return usersStreak
}

const persnalStreak = () => { }

export { groupLeaderboard, persnalStreak };