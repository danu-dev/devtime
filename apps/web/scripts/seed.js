const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);
  
  const user = await prisma.user.upsert({
    where: { email: "dev@example.com" },
    update: {},
    create: {
      email: "dev@example.com",
      name: "Developer",
      passwordHash,
    }
  });

  console.log("Created user dev@example.com / password123");

  const projects = ["jurnal_siswa", "portfolio", "backend-api"];
  const languages = ["Dart", "TypeScript", "PHP", "Vue"];

  const now = new Date();
  const heartbeats = [];
  
  for (let i = 0; i < 100; i++) {
    const time = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    heartbeats.push({
      userId: user.id,
      entity: `/src/file_${i}.ts`,
      project: projects[Math.floor(Math.random() * projects.length)],
      language: languages[Math.floor(Math.random() * languages.length)],
      editor: "VS Code",
      isWrite: Math.random() > 0.5,
      activityAt: time,
    });
  }

  await prisma.heartbeat.createMany({ data: heartbeats });
  console.log("Seeded 100 heartbeats.");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
