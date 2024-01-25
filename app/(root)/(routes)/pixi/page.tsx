import prisma from "@/lib/prismadb";
import Avatar from "@/components/Avatar";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SmilePlus } from "lucide-react";
import PixiPageComponent from "./client";
import { getServerSession } from "next-auth";
import { authConfig } from "@/app/api/auth/[...nextauth]/options";


const PixiPage = async () => {
  


  const session = await getServerSession(authConfig)
  const sessionUser = session?.user;

  if(!session)  
    redirect("/");

  


  if(!sessionUser || !sessionUser.email){
    // redir to homepage
    redirect("/");
  }



  
  return ( 
    <PixiPageComponent user={sessionUser} companions={sessionUser?.companions} />
   );
}
 
export default PixiPage;