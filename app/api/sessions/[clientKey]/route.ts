import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
  request: Request,
  context: {
    params: {
      clientKey: string;
    };
  }
) {
  const { clientKey } = context.params;

  const idSchema = z.string();
  const zod = idSchema.safeParse(clientKey);

  if (!zod.success) {
    return NextResponse.json(zod.error, { status: 400 });
  }

  const session = await prisma.session.findUnique({
    where: {
      clientKey: clientKey,
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
