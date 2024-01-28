"use client";

import Link from "next/link";
import { Poppins } from "next/font/google";
import { Bell } from "lucide-react";
import { Sparkles } from "lucide-react";
import Image from "next/image";

import { SessionProvider, useSession } from 'next-auth/react';


import { cn } from "@/lib/utils";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { usePostModal } from "@/hooks/use-post-modal";
import { PostCreator } from "@/components/post-creator";
import { SearchInput } from "@/components/search-input";
import { BruskiUser } from "@/hooks/useBruskiUser";
import { useState } from "react";
import { useEffect } from "react";
import ReactGA from "react-ga";
import { GoogleAnalytics } from '@next/third-parties/google'

const font = Poppins({ weight: "600", subsets: ["latin"] });


interface NavbarProps {
  user: BruskiUser|null;
  isPro: boolean;
}

export const Navbar = ({
  user,
  isPro
}: NavbarProps) => {
  const postModal = usePostModal();



  // const { data: session, status } = useSession();


  // // Check if the session exists and the user object is available
  // if (status === 'authenticated' && session?.user) {
  //   const { user } = session;

  //   // Now you can use user properties
  //   console.log(user.id); // Assuming 'id' is a property of your user object
  //   console.log(user.name);
  //   console.log(user.email);
  //   // ...other user properties
  // }
  
  return ( 
      <div className="fixed inset-x-0 z-50 padding flex justify-between items-center h-16 bg-gradient-to-b from-white dark:from-black via-white dark:via-black to-transparent dark:to-transparent">
        
        
        {/* <div className="bg-primary"></div> */}
        <div className="flex items-center justify-between relative">
          {/* <Image src="/pixi.png" width={40} height={40} alt="Pixi" /> */}
          
          {/* <div className="text-accent w-48 bg-gradient-to-b from-white dark:from-black via-white/70 dark:via-black/70 to-transparent dark:to-transparent hover:text-orange-500 active:text-orange-600 p-4 rounded-2xl"> */}
          <div className="text-accent  hover:text-orange-500 active:text-orange-600 py-4 lg:px-4 rounded-2xl">
          
          <Link href={user ? "/home" : "/"} prefetch className="flex items-center gap-2" aria-label="Home">
            
            <h1 className={cn(" text-xl md:text-2xl font-bold tracking-tight text-primary shrink flex items-center", font.className)}>
              <span>bruski</span>
              <span className="text-red-400 bg-gradiednt-to-br from-red-500 via-pink-500 to-orange-600 text-wkhite text-sm rounded-full ml-2">beta</span>
            </h1>
            {/* <span className="text-primary/50">/ˈbrooːski/</span> */}
          </Link>

          </div>
          


        </div>

        {/* <SearchInput /> */}

        {/* {(!user || !user.isSignedIn) && user.isLoaded && <Link href="/register" className="text-sm text-red-500">Create an account / login</Link>} */}
          

        <div className="flex items-center  ">
            {user?.id && <button onClick={postModal.onOpen} className="btn w-fit my-1 h-8 items-center justify-center  flex mr-4 line-clamp-1 whitespace-nowrap ">
              + Post
            </button> }
          
          {/* TODO: {!isPro && ( */}
            {/* {(
            <Button onClick={proModal.onOpen} size="sm" variant="premium">
              Buy Coins
              <Sparkles className="h-4 w-4 fill-white text-white ml-2" />
            </Button>
          )} */}
          <ModeToggle className="hidden lg:block" />
          {/* <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary/10">
            <UserButton afterSignOutUrl="/home" />
          </div> */}

          <MobileSidebar isPro={isPro} />
        </div>
      </div>
  );
}
