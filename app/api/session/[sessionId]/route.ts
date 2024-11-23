import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId") as string;

  const sessionIdSchema = z.string().min(1);
  const zod = sessionIdSchema.safeParse(sessionId);

  if (!zod.success) {
    return NextResponse.json(zod.error.formErrors, { status: 400 });
  }

  try {
    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        user: {
          select: {
            username: true,
            name: true,
            lastname: true,
            email: true,
            verified: true,
            image: true,
            createdAt: true,
            role: true,
            isOAuth: true,
            isTwoFactorEnabled: true,
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const sessionData = {
      id: session.id,
      username: session.user.username,
      name: session.user.name,
      lastname: session.user.lastname,
      email: session.user.email,
      verified: session.user.verified,
      avatar: session.user.image,
      created_at: session.user.createdAt,
      role: session.user.role,
      isOAuth: session.user.isOAuth,
      isTwoFactorEnabled: session.user.isTwoFactorEnabled,
    };

    return NextResponse.json(sessionData, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
