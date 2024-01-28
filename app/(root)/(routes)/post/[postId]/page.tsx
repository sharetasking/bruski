import prismadb from "@/lib/prismadb";

import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import PostPage from "@/components/pages/PostPage";
import { redirect } from "next/navigation";
import { BruskiPost } from "@/hooks/usePost";

import { getServerSession } from "next-auth";
import { authConfig } from "@/app/api/auth/[...nextauth]/options";

interface PostPageProps {
  params: {
    postId: string;
  };
}

const postPage = async ({params}:PostPageProps ) => {
  

const session = await getServerSession(authConfig);
const sessionUser = session?.user;

if(!sessionUser) {
  redirect("/")

}
const user = await prismadb.user.findFirst({
  include: {
    profiles: true
  },
  where: {
    email: sessionUser?.email ?? ""
  }

});

let post:BruskiPost|null = null;

try {
  
// get post
 post = await prismadb.post.findFirst({
  include: {
    poster: true,
    originalPost: {
      include: {
        poster: true,
      },
      where: {
        OR: [
          { date_deleted: { equals: null } }, // Checks if date_deleted is explicitly set to null
          { date_deleted: { isSet: false } }  // Checks if date_deleted is not set at all
        ],
      }
    },
  },
  where: {
    id: params.postId,
    OR: [
      { date_deleted: { equals: null } }, // Checks if date_deleted is explicitly set to null
      { date_deleted: { isSet: false } }  // Checks if date_deleted is not set at all
    ],
}});

} catch (error) {
  console.log(error)
  return (<div className="flex items-center justify-center h-full w-full grow inset-0 flex-1 text-xl text-primary/50 p-40">
    Post not found
  </div>);
}

if(!post) {
  console.log('post not found')
  return <div className="p-12">Post not found</div>
}

// mark isliked as true if the user has liked the post
if (user && user.id) {
  if (user) {
    const like = await prismadb.postLike.findFirst({
      where: {
        targetPostId: post?.id ?? "",
        likerId: user.profiles[0].id,
      }
    });

    
    if (like && post) {
        post.id = post.id ?? ""
        post = {...post,isLiked: true};
    }

    
  }
}



if(!post) {
  console.log('post not found')
  return <div>Post not found</div>
}
else
{
  return <PostPage user={user} post={post}/>

}

};

export default postPage;