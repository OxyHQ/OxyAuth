"use client";

import { useState, useTransition } from "react";
import { updateUserColor, type FormData } from "@/actions/update-user-color";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { userColorSchema } from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { Icons } from "@/components/shared/icons";

interface UserColorFormProps {
  user: Pick<User, "id" | "color">;
}

export function UserColorForm({ user }: UserColorFormProps) {
  const { update } = useSession();
  const [updated, setUpdated] = useState(false);
  const [isPending, startTransition] = useTransition();
  const updateUserColorWithId = updateUserColor.bind(null, user.id);

  const checkUpdate = (value) => {
    setUpdated(user.color !== value);
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userColorSchema),
    defaultValues: {
      color: user?.color || "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const { status } = await updateUserColorWithId(data);

      if (status !== "success") {
        toast.error("Something went wrong.", {
          description: "Your color was not updated. Please try again.",
        });
      } else {
        await update();
        setUpdated(false);
        toast.success("Your color has been updated.");
      }
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <SectionColumns
        title="Your Color"
        description="Please enter your favorite color."
      >
        <div className="flex w-full items-center gap-2">
          <Label className="sr-only" htmlFor="color">
            Color
          </Label>
          <Input
            id="color"
            className="flex-1"
            size={32}
            {...register("color")}
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
          {errors?.color && (
            <p className="pb-0.5 text-[13px] text-red-600">
              {errors.color.message}
            </p>
          )}
          <p className="text-[13px] text-muted-foreground">Max 32 characters</p>
        </div>
      </SectionColumns>
    </form>
  );
}
