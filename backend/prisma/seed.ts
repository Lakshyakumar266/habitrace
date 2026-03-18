import { PrismaClient, Racefrequency } from '../generated/prisma';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Helper to generate a unique race slug
function generateRaceSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') + '-' + faker.string.alphanumeric(6);
}

async function main() {
    console.log('🌱 Starting seeding with random data...');

    // Optional: clear existing data (uncomment with caution)
    // await prisma.$executeRaw`TRUNCATE "users", "races", "participants", "checkins", "social_links", "badges" RESTART IDENTITY CASCADE;`;

    const saltRounds = 10;
    const defaultPassword = await bcrypt.hash('password123', saltRounds); // same for all demo users

    // ---------- Create 10 random users ----------
    const users = [];
    for (let i = 0; i < 10; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const username = faker.internet.username({ firstName, lastName }).toLowerCase().slice(0, 20);
        const email = faker.internet.email({ firstName, lastName }).toLowerCase();
        const fullName = faker.person.fullName({ firstName, lastName });
        const pic = faker.image.avatarGitHub();
        const banner = faker.helpers.maybe(() => faker.image.urlPicsumPhotos({ width: 1200, height: 300 }), { probability: 0.7 });
        const location = faker.helpers.maybe(() => faker.location.city(), { probability: 0.5 });
        const streak = faker.number.int({ min: 0, max: 30 });

        const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                username,
                fullName,
                email,
                passwordHash: defaultPassword,
                pic,
                banner,
                location,
                streak,
                // Add 0–2 random social links
                socialLinks: {
                    create: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => ({
                        platform: faker.helpers.arrayElement(['twitter', 'github', 'linkedin', 'instagram']),
                        url: faker.internet.url(),
                    })),
                },
                // Add 0–3 random badges
                Badges: {
                    create: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => ({
                        badgeName: faker.word.words(2),
                        badgeDesc: faker.lorem.sentence(),
                        badgeIcon: faker.internet.emoji(),
                    })),
                },
            },
        });
        users.push(user);
        console.log(`✅ Created user: ${user.username}`);
    }

    // ---------- Create races (some ongoing) ----------
    const now = new Date();
    const raceTemplates = [
        { name: 'Morning Meditation', freq: Racefrequency.DAILY, baseDesc: 'Start your day with 10 minutes of mindfulness.' },
        { name: 'Evening Walk', freq: Racefrequency.DAILY, baseDesc: 'Unwind with a 20-minute walk after work.' },
        { name: 'Read 30 Pages', freq: Racefrequency.WEEKLY, baseDesc: 'Read 30 pages every week – any book you like.' },
        { name: 'No Sugar Week', freq: Racefrequency.WEEKLY, baseDesc: 'Avoid added sugar for a whole week.' },
        { name: 'Learn a Language', freq: Racefrequency.MONTHLY, baseDesc: 'Practice your target language for 15 minutes daily.' },
        { name: 'Home Workout', freq: Racefrequency.DAILY, baseDesc: 'A quick 15-minute bodyweight workout.' },
        { name: 'Write in Journal', freq: Racefrequency.DAILY, baseDesc: 'Reflect on your day with 5 minutes of journaling.' },
        { name: 'Code Challenge', freq: Racefrequency.WEEKLY, baseDesc: 'Solve one coding problem per week.' },
        { name: 'No Social Media', freq: Racefrequency.WEEKLY, baseDesc: 'Stay off social media for one day each week.' },
        { name: 'Drink Water', freq: Racefrequency.DAILY, baseDesc: 'Track your daily water intake (8 glasses).' },
    ];

    // Create 8 races, mix of ongoing/upcoming/completed
    const races = [];
    for (let i = 0; i < 8; i++) {
        const template = faker.helpers.arrayElement(raceTemplates);
        const name = template.name + ' ' + faker.number.int({ min: 1, max: 10 }); // avoid duplicate slugs
        const slug = generateRaceSlug(name);
        const startDate = faker.date.between({ from: new Date(now.getTime() - 30 * 86400000), to: new Date(now.getTime() + 30 * 86400000) });
        const durationDays = template.freq === Racefrequency.DAILY ? 30 : template.freq === Racefrequency.WEEKLY ? 90 : 180;
        const endDate = new Date(startDate.getTime() + durationDays * 86400000);
        const completed = endDate < now;

        const race = await prisma.race.create({
            data: {
                raceSlug: slug,
                name,
                description: template.baseDesc + ' ' + faker.lorem.sentence(),
                startDate,
                endDate,
                completed,
                frequency: template.freq,
                createdById: faker.helpers.arrayElement(users).id,
            },
        });
        races.push(race);
        console.log(`✅ Created race: ${race.name} (${completed ? 'completed' : startDate > now ? 'upcoming' : 'ongoing'})`);
    }

    // ---------- Create participations and check-ins ----------
    for (const race of races) {
        // Randomly select 4–8 participants from users
        const participantCount = faker.number.int({ min: 4, max: 8 });
        const shuffled = faker.helpers.shuffle(users);
        const participants = shuffled.slice(0, participantCount);

        for (const user of participants) {
            const joined = true;
            const joinedAt = race.startDate < now ? faker.date.between({ from: race.startDate, to: now }) : now;

            const participation = await prisma.participation.upsert({
                where: { userId_raceId: { userId: user.id, raceId: race.id } },
                update: {},
                create: {
                    userId: user.id,
                    raceId: race.id,
                    joined,
                    joinedAt,
                },
            });

            // For ongoing races (started and not completed), add some check-ins
            if (race.startDate < now && !race.completed) {
                const daysSinceStart = Math.floor((now.getTime() - race.startDate.getTime()) / 86400000);
                const checkinFrequency = race.frequency === Racefrequency.DAILY ? 0.7 : race.frequency === Racefrequency.WEEKLY ? 0.5 : 0.3;
                const expectedCheckins = Math.floor(daysSinceStart * checkinFrequency);
                const actualCheckins = faker.number.int({ min: 0, max: expectedCheckins });

                for (let c = 0; c < actualCheckins; c++) {
                    const checkinDate = new Date(race.startDate.getTime() + c * 86400000 * (race.frequency === Racefrequency.WEEKLY ? 7 : 1));
                    if (checkinDate > now) break; // don't add future checkins

                    await prisma.checkin.upsert({
                        where: {
                            participationId_checkinDate: {
                                participationId: participation.id,
                                checkinDate,
                            },
                        },
                        update: {},
                        create: {
                            participationId: participation.id,
                            checkinDate,
                        },
                    });
                }
            }
        }
    }

    console.log('✅ Added participations and check-ins');

    console.log('🌱 Seeding finished!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });