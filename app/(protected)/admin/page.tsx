import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import InfoCard from "@/components/dashboard/info-card";
import RecentUsersList from "@/components/dashboard/recent-users-list";
import { prisma } from "@/lib/db";

export const metadata = constructMetadata({
  title: "Admin – Oxy Auth",
  description: "Admin page for only admin management.",
});

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

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

  const recentUsers = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const usersLastMonth = await prisma.user.count({
    where: {
      createdAt: {
        gte: lastMonth,
      },
    },
  });

  const userGrowthPercentage = ((totalUsers - usersLastMonth) / usersLastMonth) * 100;

  return (
    <>
      <DashboardHeader
        heading="Admin Panel"
        text="Access only for users with ADMIN role."
      />
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InfoCard title="Total Users" value={totalUsers} />
          <InfoCard title="Admin Users" value={adminUsers} />
          <InfoCard title="Regular Users" value={regularUsers} />
          <InfoCard title="User Growth" value={userGrowthPercentage.toFixed(1) + "%"} />
        </div>
        <RecentUsersList users={recentUsers} />
      </div>
    </>
  );
}
