"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useSession } from "next-auth/react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type AccountType = {
  name: string;
  email: string;
  image: string;
};

export default function AccountSwitcher({
  large = false,
}: {
  large?: boolean;
}) {
  const { data: session, status } = useSession();
  const [openPopover, setOpenPopover] = useState(false);
  const [accounts, setAccounts] = useState<AccountType[]>([]);

  useEffect(() => {
    if (session?.user) {
      const fetchAccounts = async () => {
        const response = await fetch(`/api/users?id=${session.user.id}`);
        const data = await response.json();
        setAccounts(data);
      };

      fetchAccounts();
    }
  }, [session]);

  if (!session || status !== "authenticated") {
    return <AccountSwitcherPlaceholder />;
  }

  const selected: AccountType = accounts[0];

  return (
    <div>
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger>
          <Button
            className="h-8 px-2"
            variant={openPopover ? "secondary" : "ghost"}
            onClick={() => setOpenPopover(!openPopover)}
          >
            <div className="flex items-center space-x-3 pr-2">
              {selected && (
                <>
                  <img
                    src={selected.image}
                    alt={selected.name}
                    className="size-3 shrink-0 rounded-full"
                  />
                  <div className="flex items-center space-x-3">
                    <span
                      className={cn(
                        "inline-block truncate text-sm font-medium xl:max-w-[120px]",
                        large ? "w-full" : "max-w-[80px]",
                      )}
                    >
                      {selected.name}
                    </span>
                  </div>
                </>
              )}
            </div>
            <ChevronsUpDown
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="max-w-60 p-2">
          <AccountList
            selected={selected}
            accounts={accounts}
            setOpenPopover={setOpenPopover}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function AccountList({
  selected,
  accounts,
  setOpenPopover,
}: {
  selected: AccountType;
  accounts: AccountType[];
  setOpenPopover: (open: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      {accounts.map(({ name, email, image }) => (
        <Link
          key={email}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "relative flex h-9 items-center gap-3 p-3 text-muted-foreground hover:text-foreground",
          )}
          href="#"
          onClick={() => setOpenPopover(false)}
        >
          <img
            src={image}
            alt={name}
            className="size-3 shrink-0 rounded-full"
          />
          <span
            className={`flex-1 truncate text-sm ${
              selected.email === email
                ? "font-medium text-foreground"
                : "font-normal"
            }`}
          >
            {name}
          </span>
          {selected.email === email && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-foreground">
              <Check size={18} aria-hidden="true" />
            </span>
          )}
        </Link>
      ))}
      <Button
        variant="outline"
        className="relative flex h-9 items-center justify-center gap-2 p-2"
        onClick={() => {
          setOpenPopover(false);
        }}
      >
        <Plus size={18} className="absolute left-2.5 top-2" />
        <span className="flex-1 truncate text-center">New Account</span>
      </Button>
    </div>
  );
}

function AccountSwitcherPlaceholder() {
  return (
    <div className="flex animate-pulse items-center space-x-1.5 rounded-lg px-1.5 py-2 sm:w-60">
      <div className="h-8 w-36 animate-pulse rounded-md bg-muted xl:w-[180px]" />
    </div>
  );
}
