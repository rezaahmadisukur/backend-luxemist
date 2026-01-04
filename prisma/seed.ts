// import { PrismaClient } from 'src/generated/prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { PrismaService } from 'src/prisma.service';

dotenv.config();

const prisma = new PrismaService();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@luxemist.com' },
    update: {},
    create: {
      email: 'admin@luxemist.com',
      name: 'Owner LuxeMist',
      password: passwordHash,
    },
  });

  console.log({ admin });
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
