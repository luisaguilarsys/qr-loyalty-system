import { PrismaClient, Role } from '../src/generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const defaultCredentials = {
  email: process.env.ADMIN_EMAIL ?? 'admin@admin.com',
  password: process.env.ADMIN_PASSWORD ?? 'admin',
};

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

async function main() {
  const adminPassword = await bcrypt.hash(defaultCredentials.password, 10);

  const admin = await prisma.user.upsert({
    where: { email: defaultCredentials.email },
    update: {
      email: defaultCredentials.email,
      passwordHash: adminPassword,
    },
    create: {
      email: defaultCredentials.email,
      passwordHash: adminPassword,
      name: 'Administrator',
      role: Role.ADMIN,
    },
  });

  const customer = await prisma.customer.upsert({
    where: { id: 'a1b2c3d4-0000-0000-0000-000000000001' },
    update: {
      name: 'Client',
      lastName: 'Demo',
      email: 'client@example.com',
      phone: '5512345678',
    },
    create: {
      name: 'Client',
      lastName: 'Demo',
      email: 'client@example.com',
      phone: '5512345678',
    },
  });

  await prisma.pointTransaction.createMany({
    data: [
      {
        customerId: customer.id,
        points: 100,
        type: 'EARN',
        description: 'Initial transaction demo',
        cashierId: admin.id,
      },
      {
        customerId: customer.id,
        points: 50,
        type: 'EARN',
        description: 'Second transaction demo',
        cashierId: admin.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Seed completed');
  console.log(
    `Email: ${defaultCredentials.email}, Password: ${defaultCredentials.password}`,
  );
  console.log(`   Demo client created: ${customer.id}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (err) => {
    console.log(err);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
