import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || undefined;
  const ids = searchParams.get("ids")?.split(",") || undefined;
  const limit = searchParams.get("limit") || undefined;
  const idSchema = z.string().cuid().optional();

  try {
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          id: id,
        },
        id: ids ? { in: ids } : undefined,
      },

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        description: true,
        color: true,
      },

      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
