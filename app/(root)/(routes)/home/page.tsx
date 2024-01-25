import prismadb from "@/lib/prismadb"
import { Categories } from "@/components/categories"
import { Companions } from "@/components/companions"
import { Homepage } from "@/components/Homepage"
import { SearchInput } from "@/components/search-input"
import toast, { Toaster } from 'react-hot-toast';
import useBruskiUser from "@/hooks/useBruskiUser"
import { use } from "react"
import { useCategories } from "@/hooks/useCategories"
import { getSession } from "next-auth/react"
import { authConfig } from "@/app/api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth"
import { Test } from "@/components/test"
import { redirect } from "next/navigation";

interface RootPageProps {
  searchParams: {
    categoryId: string;
    name: string;
  };
};


const RootPage = async ({
  searchParams
}: RootPageProps) => {


  const session = await getServerSession(authConfig);
  const sessionUser = session?.user;


  if(!sessionUser?.email)
  {
    // redirect to login "/"
    redirect("/")
    return;
  }

  const user = await prismadb.user.findUnique({
    where: {
      email: sessionUser?.email ?? ""
    },
    include: {
      profiles: true
    }
  })

if(user)

  {
  return (
    <>
      {user && <Homepage user={user}  /> }
      <div><Toaster/></div>
    </>
  );

  }
  else
  {
    
    redirect("/")

  }

  // const categories = await prismadb.category.findMany({
  //   include: {
  //     _count: {
  //       select: {
  //         companions: true,
  //       },
  //     },
  //   },
  // take: 100,
  // });

}

export default RootPage
