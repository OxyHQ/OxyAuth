"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { userColorSchema } from "@/lib/validations/user";
import { revalidatePath } from "next/cache";

export type FormData = {
  color: string;
};

export async function updateUserColor(userId: string, data: FormData) {
  try {
    const session = await auth();

    if (!session?.user || session?.user.id !== userId) {
      throw new Error("Unauthorized");
    }

    const { color } = userColorSchema.parse(data);

    // Update the user color.
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        color: color,
      },
    });

    revalidatePath("/dashboard/settings");
    return { status: "success" };
  } catch (error) {
    // console.log(error)
    return { status: "error" };
  }
}
