import { BadRequestException, Logger } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';
import * as bcrypt from 'bcrypt';
import { parseAdviceCsv } from '../shared/utils/csv.utils';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function main() {
  try {
    Logger.log('Starting seeding...');

    Logger.log(`Seeding Advice data...`);

    const adviceData = parseAdviceCsv();

    for (const advice of adviceData) {
      Logger.log(`Seeding advice: ${JSON.stringify(advice)}`);

      await prisma.advice.upsert({
        where: {
          garbageType_garbageSubtype_garbageState: {
            garbageType: advice.type,
            garbageSubtype: advice.subtype,
            garbageState: advice.state,
          },
        },
        create: {
          garbageType: advice.type,
          garbageSubtype: advice.subtype,
          garbageState: advice.state,
          accepted: advice.accepted,
          text: advice.text,
        },
        update: {
          accepted: advice.accepted,
          text: advice.text,
        },
      });
    }

    const adminLogin = 'admin';
    const adminPassword = 'admin';

    const adminExists = await prisma.user.findUnique({
      where: { login: adminLogin },
    });

    if (adminExists) {
      Logger.log(`Admin user "${adminLogin}" already exists`);
      return;
    }

    const hashedPassword = await hashPassword(adminPassword);

    const admin = await prisma.user.create({
      data: {
        name: 'Administrator',
        login: adminLogin,
        hashedPassword: hashedPassword,
        balance: 0,
        isAdmin: true,
      },
    });

    Logger.log(`✅ Admin user created successfully:`);
    Logger.log(`   ID: ${admin.id}`);
    Logger.log(`   Name: ${admin.name}`);
    Logger.log(`   Login: ${admin.login}`);
    Logger.log(`   Is Admin: ${admin.isAdmin}`);
  } catch (error) {
    Logger.error(error);
    throw new BadRequestException('Error while seeding the database');
  } finally {
    Logger.log('Closing the database connection...');
    await prisma.$disconnect();
    Logger.log('Seeding has been successfully completed');

    process.exit(0);
  }
}

main();
