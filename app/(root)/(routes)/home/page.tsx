"use client"

import prismadb from "@/lib/prismadb"
import { Categories } from "@/components/categories"
import { Companions } from "@/components/companions"
import { Homepage } from "@/components/Homepage"
import { SearchInput } from "@/components/search-input"
import toast, { Toaster } from 'react-hot-toast';
import { currentUser } from "@clerk/nextjs"
import useBruskiUser from "@/hooks/useBruskiUser"
import { use } from "react"
import { useCategories } from "@/hooks/useCategories"

interface RootPageProps {
  searchParams: {
    categoryId: string;
    name: string;
  };
};


const RootPage = ({
  searchParams
}: RootPageProps) => {


  //get the user and the profile
  const { data: localUser, isLoading } = useBruskiUser();

  if(!localUser && !isLoading)
  {
    // redirect to login "/"
    window.location.href = "/"
  }
  else if(localUser && !isLoading)
  {


  // const {data:categories, isLoading:categoryLoading} = useCategories();
  
  return (
    <>
      
      {localUser && <Homepage user={localUser}  /> }
      <div><Toaster/></div>
    </>
  );

  }
  else //if(!currentUser && isLoading)
  {
    return <>Loading...</>

  }

  // const categories = await prismadb.category.findMany({
  //   include: {
  //     _count: {
  //       select: {
  //         companions: true,
  //       },
  //     },
  //   },
  // });

}

export default RootPage
