import prismadb from "@/lib/prismadb";
import InitializeComponentPage from "@/components/Initialize";
import { NextResponse } from "next/server";
import { useDebounce } from "@/hooks/use-debounce";
import { BruskiUser } from "@/hooks/useBruskiUser";
import { redirect } from "next/navigation";
import axios from "axios";
import prisma from "@/lib/prismadb";
import { AccountType } from "@prisma/client";
import { authConfig } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

const InitPage = async () => {

  const session = await getServerSession(authConfig)
  const sessionUser = session?.user;

  // DEFINE USER TO BE SENT BACK TO COMPONENT
  let bruskiUser;

  // IF NOT LOGGED IN, REDIRECT TO LANDING PAGE
  if (!sessionUser || !sessionUser.email) {
    return redirect("/")
  }
  

  // GET THE NEW USER WITH THE PROFILE
  bruskiUser = await prismadb.user.findUnique({
    where: { email: sessionUser.email ?? ""},
    include: {
      profiles: true,
      companions: true,
    },
  });







  if(!bruskiUser)
    return redirect("/")

  
  return (
    <><InitializeComponentPage user={bruskiUser ?? null} /></>
  );
}

export default InitPage;