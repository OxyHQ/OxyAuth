import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  context: {
    params: {
      username: string;
    };
  },
) {
  const { username } = context.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
