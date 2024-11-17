import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientKey = searchParams.get("clientKey") as string;

  const clientKeySchema = z.string().min(1);
  const zod = clientKeySchema.safeParse(clientKey);

  if (!zod.success) {
    return NextResponse.json(zod.error.formErrors, { status: 400 });
  }

  try {
    const sessions = await prisma.session.findMany({
      where: {
        clientKey: clientKey,
      },
    });

    if (!sessions) {
      return NextResponse.json({ error: "Sessions not found" }, { status: 404 });
    }

    return new Response(JSON.stringify(sessions), {
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
