"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import { Bell } from "lucide-react";
import { Sparkles } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useProModal } from "@/hooks/use-pro-modal";
import { PostCreator } from "@/components/post-creator";
import { SearchInput } from "@/components/search-input";
import { useUser } from "@clerk/clerk-react";
import { BruskiUser } from "@/hooks/useBruskiUser";
import { useState } from "react";

const font = Poppins({ weight: "600", subsets: ["latin"] });

interface NavbarProps {
  user: BruskiUser|null;
  isPro: boolean;
}

export const Navbar = ({
  user,
  isPro
}: NavbarProps) => {
  const proModal = useProModal();

  const [num_notifications, setNumNotifications] = useState(user?.num_notifications || 0);

  function countTo(to: number) {
    let i = num_notifications;
    const interval = setInterval(() => {
      i--;
      setNumNotifications(i);
      if (i === to) clearInterval(interval);
    }, 100);
  }

  return ( 
    <div className="fixed inset-x-0 z-50 flex justify-between items-center py-2 px-4 h-16 bg-gradient-to-b from-white dark:from-black via-white/60 dark:via-black/60 to-transparent dark:to-transparent">
      
      
      {/* <div className="bg-primary"></div> */}
      <div className="flex items-center relative">
        {/* <Image src="/pixi.png" width={40} height={40} alt="Pixi" /> */}
        <MobileSidebar isPro={isPro} />
        {/* <div className="text-accent w-48 bg-gradient-to-b from-white dark:from-black via-white/70 dark:via-black/70 to-transparent dark:to-transparent hover:text-orange-500 active:text-orange-600 p-4 rounded-2xl"> */}
        <div className="text-accent w-48  hover:text-orange-500 active:text-orange-600 p-4 rounded-2xl">
        
        <Link href="/home" prefetch className="flex items-center gap-2" aria-label="Home">
          
          <h1 className={cn("hidden md:block text-xl md:text-2xl font-bold tracking-tight text-primary", font.className)}>
            bruski
          </h1>
          {/* <span className="text-primary/50">/ˈbrooːski/</span> */}
        </Link>

        </div>
        


      </div>

      {/* <SearchInput /> */}

      {/* {(!user || !user.isSignedIn) && user.isLoaded && <Link href="/register" className="text-sm text-red-500">Create an account / login</Link>} */}
{/*         
      <Button onClick={proModal.onOpen} size="lg">
            + Create Post
          </Button> */}

      <div className="flex items-center gap-x-3  bg-gradient-to-b from-white dark:from-black via-white/70 dark:via-black/70 to-white/30 dark:to-bg-secondary/10">
          <Link href="/notifications" onClick={()=>{return countTo(0)}} className="clickable mx-4 relative">
            <Bell height={24} width={24} />
            {
            parseInt(num_notifications) > 0 && <span className="bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs absolute -top-2 -right-1 z-10">
                  {num_notifications || 0}
              </span>

            }
          </Link>
        
        {/* TODO: {!isPro && ( */}
          {/* {(
          <Button onClick={proModal.onOpen} size="sm" variant="premium">
            Buy Coins
            <Sparkles className="h-4 w-4 fill-white text-white ml-2" />
          </Button>
        )} */}
        <ModeToggle />
        {/* <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary/10">
          <UserButton afterSignOutUrl="/home" />
        </div> */}
      </div>
    </div>
  );
}
