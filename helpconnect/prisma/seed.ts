import bcrypt from "bcryptjs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const dbPath = path.resolve(__dirname, "../dev.db");
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding HelpConnect database...");

  const adminPw = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@helpconnect.dev" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@helpconnect.dev",
      password: adminPw,
      role: "ADMIN",
    },
  });

  const ngoPw = await bcrypt.hash("ngo12345", 12);
  const ngoUser = await prisma.user.upsert({
    where: { email: "ngo@helpconnect.dev" },
    update: {},
    create: {
      name: "Priya Sharma",
      email: "ngo@helpconnect.dev",
      password: ngoPw,
      role: "NGO_COORDINATOR",
    },
  });

  const volunteerPw = await bcrypt.hash("vol12345", 12);
  const vol1 = await prisma.user.upsert({
    where: { email: "vol1@helpconnect.dev" },
    update: {},
    create: {
      name: "Arjun Mehta",
      email: "vol1@helpconnect.dev",
      password: volunteerPw,
      role: "VOLUNTEER",
    },
  });
  const vol2 = await prisma.user.upsert({
    where: { email: "vol2@helpconnect.dev" },
    update: {},
    create: {
      name: "Sneha Kapoor",
      email: "vol2@helpconnect.dev",
      password: volunteerPw,
      role: "VOLUNTEER",
    },
  });
  const vol3 = await prisma.user.upsert({
    where: { email: "vol3@helpconnect.dev" },
    update: {},
    create: {
      name: "Rahul Singh",
      email: "vol3@helpconnect.dev",
      password: volunteerPw,
      role: "VOLUNTEER",
    },
  });

  const ngo = await prisma.nGOProfile.upsert({
    where: { userId: ngoUser.id },
    update: {},
    create: {
      userId: ngoUser.id,
      orgName: "Sahyog Foundation",
      description: "Connecting communities across India.",
      specialization: JSON.stringify(["HEALTHCARE", "FOOD"]),
      coverageZones: JSON.stringify(["Mumbai North", "Pune", "Delhi Zone 2"]),
      verified: true,
    },
  });

  await prisma.volunteer.upsert({
    where: { userId: vol1.id },
    update: {},
    create: {
      userId: vol1.id,
      skills: JSON.stringify(["First Aid", "Logistics"]),
      zone: "Mumbai North",
      totalHours: 120,
      totalPoints: 850,
    },
  });
  await prisma.volunteer.upsert({
    where: { userId: vol2.id },
    update: {},
    create: {
      userId: vol2.id,
      skills: JSON.stringify(["Teaching", "Counselling"]),
      zone: "Pune",
      totalHours: 75,
      totalPoints: 520,
    },
  });
  await prisma.volunteer.upsert({
    where: { userId: vol3.id },
    update: {},
    create: {
      userId: vol3.id,
      skills: JSON.stringify(["Medical", "Emergency"]),
      zone: "Delhi Zone 2",
      totalHours: 200,
      totalPoints: 1400,
    },
  });

  const needsData = [
    {
      title: "Emergency Medical Supplies",
      description: "Critical shortage of medicines for flood-affected families in Zone 4.",
      zone: "Mumbai North",
      lat: 19.076,
      lng: 72.877,
      category: "HEALTHCARE",
      severity: "CRITICAL",
      urgencyScore: 95,
    },
    {
      title: "Food Distribution Drive",
      description: "500+ families need daily food packets in Dharavi.",
      zone: "Mumbai South",
      lat: 19.04,
      lng: 72.855,
      category: "FOOD",
      severity: "HIGH",
      urgencyScore: 78,
    },
    {
      title: "After-School Tutoring Program",
      description: "Students need tutors for Maths and Science, three days a week.",
      zone: "Pune",
      lat: 18.52,
      lng: 73.856,
      category: "EDUCATION",
      severity: "MEDIUM",
      urgencyScore: 55,
    },
    {
      title: "Shelter for Displaced Families",
      description: "15 families displaced by demolition need temporary shelter.",
      zone: "Delhi Zone 2",
      lat: 28.613,
      lng: 77.209,
      category: "SHELTER",
      severity: "CRITICAL",
      urgencyScore: 92,
    },
    {
      title: "Clean Water Installation",
      description: "Ward 7 has no clean water access. Need volunteers to install filters.",
      zone: "Mumbai North",
      lat: 19.082,
      lng: 72.882,
      category: "WATER",
      severity: "HIGH",
      urgencyScore: 80,
    },
    {
      title: "Mental Health Support Camp",
      description: "Post-disaster trauma counselling for women and children.",
      zone: "Pune",
      lat: 18.53,
      lng: 73.845,
      category: "MENTAL_HEALTH",
      severity: "MEDIUM",
      urgencyScore: 62,
    },
  ];

  for (const need of needsData) {
    await prisma.communityNeed.create({ data: { ...need, ngoId: ngo.id } }).catch(() => undefined);
  }

  const badges = [
    { name: "First Responder", emoji: "Responder", description: "Completed first emergency", threshold: 1 },
    { name: "Community Hero", emoji: "Hero", description: "Helped 50+ people", threshold: 50 },
    { name: "100 Hours Club", emoji: "100h", description: "100+ hours volunteered", threshold: 100 },
    { name: "Zone Guardian", emoji: "Guard", description: "Active in 3+ zones", threshold: 3 },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({ where: { name: badge.name }, update: {}, create: badge });
  }

  await prisma.zoneEmergency
    .create({
      data: {
        zone: "Mumbai North",
        declaredBy: admin.id,
        message: "Flood alert. All healthcare needs are escalated to critical priority.",
        alertType: "FLOOD",
      },
    })
    .catch(() => undefined);

  console.log("Seed complete.");
  console.log("Admin: admin@helpconnect.dev / admin123");
  console.log("NGO: ngo@helpconnect.dev / ngo12345");
  console.log("Volunteer: vol1@helpconnect.dev / vol12345");
}

main().catch(console.error).finally(() => prisma.$disconnect());
