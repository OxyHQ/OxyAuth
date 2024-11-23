import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request, { params }: { params: { clientKey: string } }) {
  const { clientKey } = params;

  try {
    const session = await prisma.session.findUnique({
      where: {
        clientKey: clientKey,
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const user = session.user;

    const sessionData = {
      id: session.id,
      username: user.username,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      verified: user.verified,
      avatar: user.image,
      created_at: user.createdAt,
      role: user.role,
      isOAuth: user.isOAuth,
      isTwoFactorEnabled: user.isTwoFactorEnabled,
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
