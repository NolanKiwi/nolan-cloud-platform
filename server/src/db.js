const { PrismaClient } = require('@prisma/client');

// Singleton Prisma Client
let prisma;

if (!global.prisma) {
  global.prisma = new PrismaClient();
}
prisma = global.prisma;

module.exports = prisma;
