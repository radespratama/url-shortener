const { PrismaClient } = require("@prisma/client");

const dbPrisma = new PrismaClient();

module.exports = { dbPrisma };
