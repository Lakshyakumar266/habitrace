import prisma from "./prisma.utility";

const getPosition = (participants: any[]) => {

    return participants.map((participant, index) => {
        return {
            position: index + 1,
            name: participant.username,
            streak: participant.streak
        }
    });
};

const groupLeaderboard = async (participants: any[], checkins: any[]) => {

    const participantCheckinsArray = participants.map(participant => {
        const userCheckins = checkins.filter(checkin =>
            checkin.participationId === participant.id
        );

        return {
            user: participant.id,
            checkins: userCheckins,
        };
    });


    const usersStreak = participantCheckinsArray.map(async participant => {

        const user = await prisma.user.findFirst({ where: { participations: { some: { id: participant.user } } } })


        return {
            username: user?.username,
            streak: participant.checkins.length,
            position: 0
        }
    });

    return usersStreak
}

const persnalStreak = (participant: any, checkins: any[]) => {

    const userStreak = async () => {
        const userCheckins = checkins.filter(checkin =>
            checkin.participationId === participant.id
        );
        const user = await prisma.user.findFirst({ where: { participations: { some: { id: participant.id } } } })
        return {
            username: user?.username,
            streak: userCheckins.length
        };
    }

    return userStreak()

}

export { groupLeaderboard, persnalStreak, getPosition };