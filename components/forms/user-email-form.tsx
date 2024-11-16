"use client";

import { useState, useTransition } from "react";
import { updateUserEmail, type FormData } from "@/actions/update-user-email";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { userEmailSchema } from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { Icons } from "@/components/shared/icons";

interface UserEmailFormProps {
  user: Pick<User, "id" | "email">;
}

export function UserEmailForm({ user }: UserEmailFormProps) {
  const { update } = useSession();
  const [updated, setUpdated] = useState(false);
  const [isPending, startTransition] = useTransition();
  const updateUserEmailWithId = updateUserEmail.bind(null, user.id);

  const checkUpdate = (value) => {
    setUpdated(user.email !== value);
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userEmailSchema),
    defaultValues: {
      email: user?.email || "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const { status } = await updateUserEmailWithId(data);

      if (status !== "success") {
        toast.error("Something went wrong.", {
          description: "Your email was not updated. Please try again.",
        });
      } else {
        await update();
        setUpdated(false);
        toast.success("Your email has been updated.");
      }
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <SectionColumns
        title="Your Email"
        description="Please enter your email address."
      >
        <div className="flex w-full items-center gap-2">
          <Label className="sr-only" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            className="flex-1"
            size={32}
            {...register("email")}
            onChange={(e) => checkUpdate(e.target.value)}
          />
          <Button
            type="submit"
            variant={updated ? "default" : "disable"}
            disabled={isPending || !updated}
            className="w-[67px] shrink-0 px-0 sm:w-[130px]"
          >
            {isPending ? (
              <Icons.spinner className="size-4 animate-spin" />
            ) : (
              <p>
                Save
                <span className="hidden sm:inline-flex">&nbsp;Changes</span>
              </p>
            )}
          </Button>
        </div>
        <div className="flex flex-col justify-between p-1">
          {errors?.email && (
            <p className="pb-0.5 text-[13px] text-red-600">
              {errors.email.message}
            </p>
          )}
          <p className="text-[13px] text-muted-foreground">Max 32 characters</p>
        </div>
      </SectionColumns>
    </form>
  );
}
