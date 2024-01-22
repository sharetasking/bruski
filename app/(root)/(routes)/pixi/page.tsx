import prisma from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs";
import Avatar from "@/components/Avatar";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SmilePlus } from "lucide-react";
import PixiPageComponent from "./client";


const PixiPage = async () => {
  



  const clerkUser = await currentUser();
  if(!clerkUser){
    // redir to homepage
    redirect("/");
  }

  const localUser = await prisma.user.findFirst({
    where: {
      clerkUserId: clerkUser.id,
    },
  });

  if(!localUser || !localUser.id){
    // redir to homepage
    redirect("/");
  }

  // Get all companions
  const companions = await prisma.companion.findMany({
    include: {
      category: true,
      profiles: true,
    },
    where: {
      ownerId: localUser.id,
    },
    take: 20,
  });


  
  return ( 
    <PixiPageComponent user={localUser} companions={companions} />
   );
}
 
export default PixiPage;