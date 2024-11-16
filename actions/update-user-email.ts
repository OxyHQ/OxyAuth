"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { userEmailSchema } from "@/lib/validations/user";
import { revalidatePath } from "next/cache";

export type FormData = {
  email: string;
};

export async function updateUserEmail(userId: string, data: FormData) {
  try {
    const session = await auth();

    if (!session?.user || session?.user.id !== userId) {
      throw new Error("Unauthorized");
    }

    const { email } = userEmailSchema.parse(data);

    // Update the user email.
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        email: email,
      },
    });

    revalidatePath("/dashboard/settings");
    return { status: "success" };
  } catch (error) {
    // console.log(error)
    return { status: "error" };
  }
}
