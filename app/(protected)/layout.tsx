"use client";
import { Navbar } from "./_components/navbar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserButton } from "@/components/auth/user-button";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  const user = useCurrentUser();
  return (
    <div className="h-full w-full flex flex-col gap-y-10 justify-center">
      <nav className="w-full p-2">
        <div className="w-full flex justify-between items-center flex gap-x-2 bg-secondary p-2 rounded-full ">
          <div className="w-[45px]"></div>
          <h1>Oxy Account</h1>
          <UserButton />
        </div>
      </nav>
      <div className="w-full flex flex-col gap-5 align-middle text-center items-center">
        <Avatar className="m-auto w-20 h-20">
          <AvatarImage src={user?.avatar || ""} />
          <AvatarFallback className="bg-sky-500">
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
        <p className="text-2xl font-semibold text-center">{user?.name}</p>
      </div>
      <Navbar />
      <div className="flex justify-center items-center h-full">{children}</div>
    </div>
  );
};

export default ProtectedLayout;
