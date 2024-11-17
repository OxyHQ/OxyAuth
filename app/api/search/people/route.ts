import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") as string;

  const querySchema = z.string().min(1);
  const zod = querySchema.safeParse(query);

  if (!zod.success) {
    return NextResponse.json(zod.error.formErrors, { status: 400 });
  }

  try {
    const people = await prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: query,
              mode: "insensitive",
            },
          },

          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },

      take: 3,
    });

    const response = NextResponse.json(people, { status: 200 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
