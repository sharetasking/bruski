

import prismadb from "@/lib/prismadb"
import { Categories } from "@/components/categories"
import { Companions } from "@/components/companions"
import { Homepage } from "@/components/Homepage"
import { SearchInput } from "@/components/search-input"
import toast, { Toaster } from 'react-hot-toast';
import { currentUser } from "@clerk/nextjs"

interface RootPageProps {
  searchParams: {
    categoryId: string;
    name: string;
  };
};


const RootPage = async ({
  searchParams
}: RootPageProps) => {

  let localUser = null;

  //get the user and the profile
  const user = await currentUser();
  if(user)
  {

    localUser = await prismadb.user.findUnique({
      where: {
        clerkUserId: user?.id,
      },
      include: {
        profiles: true,
      },
    });
    
  }

  //get the profile id
  // const companions = await prismadb.companion.findMany({
  //   where: {
  //     categoryId: searchParams.categoryId,
  //     name: {
  //       search: searchParams.name ?? "",
  //     },
  //   },
  //   orderBy: {
  //     createdAt: "desc"
  //   },
    // include: {
    //   _count: {
    //     select: {
    //       posts: true,
    //     },

    //   }
    // },
  // });

  const categories = await prismadb.category.findMany({
    include: {
      _count: {
        select: {
          companions: true,
        },
      },
    },
  });
  // const posts = await prismadb.post.findMany({
  //   include: {
  //     user: {
  //       select: {
  //         id: true,
  //         first_name: true,
  //         last_name: true,
  //         username: true,
  //         email: true,
  //       },
  //     },
  //   },
  // });

  //get the corresponding Clerk user name and email address for each post
  // for (let i = 0; i < posts.length; i++) {
  //   posts[i].user = await prismadb.user.findUnique({
  //     where: {
  //       id: posts[i].userId,
  //     },
  //   });
  // }
  
  return (
    <>
      
      {localUser && <Homepage user={localUser}  /> }
      <div><Toaster/></div>
    </>
  );
}

export default RootPage
