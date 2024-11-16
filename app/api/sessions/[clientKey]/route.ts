import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  context: {
    params: {
      clientKey: string;
    };
  },
) {
  const { clientKey } = context.params;

  const idSchema = z.string();
  const zod = idSchema.safeParse(clientKey);

  if (!zod.success) {
    return NextResponse.json(zod.error, { status: 400 });
  }

  const sessions = await prisma.session.findMany({
    where: {
      clientKey: clientKey,
    },
    orderBy: {
      updatedAt: "asc",
    },
  });

  if (sessions.length === 0) {
    return NextResponse.json(
      { error: "There are no sessions with this clientKey" },
      { status: 404 },
    );
  }

  const user = await prisma.session.findMany({
    where: {
      clientKey: clientKey,
    },
    orderBy: {
      updatedAt: "asc",
    },
    select: {
      id: true,
      sessionToken: true,
      userId: true,
      expires: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  return NextResponse.json({ sessions: user });
}
