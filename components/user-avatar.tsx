"use client";

import { useSession } from "next-auth/react";

import { Avatar, AvatarImage } from "@/components/ui/avatar"

export const UserAvatar = () => {
  const { data: session } = useSession();
  const user = session?.user ?? null;

  return (
    <Avatar className="h-12 w-12">
      <AvatarImage src={user?.img} />
    </Avatar>
  );
};
