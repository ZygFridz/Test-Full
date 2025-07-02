const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllUsers = () => {
  return prisma.user.findMany({
    include: {
       role: true  // ดึง relation role มาด้วย
    }
  });
};

const createUser = (data) => {
  return prisma.user.create({ data });
};

const updateUser = (id, data) => {
  return prisma.user.update({
    where: { id },
    data
  });
};

const deleteUser = (id) => {
  return prisma.user.delete({
    where: { id }
  });
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
};
