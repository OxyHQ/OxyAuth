import { UserRole } from "@prisma/client";
import * as z from "zod";

export const userNameSchema = z.object({
  name: z.string().min(3).max(32),
});

export const userRoleSchema = z.object({
  role: z.nativeEnum(UserRole),
});

export const userEmailSchema = z.object({
  email: z.string().email(),
});

export const userColorSchema = z.object({
  color: z.string().min(3).max(32),
});

export const userUsernameSchema = z.object({
  username: z.string().min(3).max(32),
});
