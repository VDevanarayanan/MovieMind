import prisma from '../src/prisma/client';
import bcrypt from 'bcrypt';

async function main() {
  const passwordHash = await bcrypt.hash('Password123', 10);

  await prisma.user.upsert({
    where: { email: 'demo@moviemind.ai' },
    update: {},
    create: {
      username: 'demo_user',
      email: 'demo@moviemind.ai',
      password: passwordHash,
    },
  });

  console.log('Seed complete');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
