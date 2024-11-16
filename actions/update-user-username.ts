"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { userUsernameSchema } from "@/lib/validations/user";
import { revalidatePath } from "next/cache";

export type FormData = {
  username: string;
};

export async function updateUserUsername(userId: string, data: FormData) {
  try {
    const session = await auth();

    if (!session?.user || session?.user.id !== userId) {
      throw new Error("Unauthorized");
    }

    const { username } = userUsernameSchema.parse(data);

    // Update the user username.
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        username: username,
      },
    });

    revalidatePath("/dashboard/settings");
    return { status: "success" };
  } catch (error) {
    // console.log(error)
    return { status: "error" };
  }
}
