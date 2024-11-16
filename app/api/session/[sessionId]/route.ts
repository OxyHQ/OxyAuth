import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  context: {
    params: {
      sessionId: string;
    };
  },
) {
  const { sessionId } = context.params;

  const idSchema = z.string();
  const zod = idSchema.safeParse(sessionId);

  if (!zod.success) {
    return NextResponse.json(zod.error, { status: 400 });
  }

  const session = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
  });

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  return NextResponse.json({ user: user });
}
