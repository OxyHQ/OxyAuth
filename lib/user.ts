import { prisma } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        name: true,
        emailVerified: true,
      },
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });

    return user;
  } catch {
    return null;
  }
};

export const getUserStatistics = async () => {
  try {
    const totalUsers = await prisma.user.count();
    const adminUsers = await prisma.user.count({
      where: {
        role: "ADMIN",
      },
    });
    const regularUsers = await prisma.user.count({
      where: {
        role: "USER",
      },
    });

    return {
      totalUsers,
      adminUsers,
      regularUsers,
    };
  } catch {
    return null;
  }
};

export const getAllActiveSessionsForUser = async (userId: string) => {
  try {
    const sessions = await prisma.session.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        userId: true,
        expires: true,
      },
    });

    return sessions;
  } catch {
    return null;
  }
};
