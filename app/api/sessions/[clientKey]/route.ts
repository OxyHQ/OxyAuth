import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request, { params }: { params: { clientKey: string } }) {
  const { clientKey } = params;

  try {
    const sessions = await prisma.session.findMany({
      where: {
        clientKey: clientKey,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(sessions, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
