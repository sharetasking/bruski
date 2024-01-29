"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useProModal } from "@/hooks/use-pro-modal";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { signOut } from 'next-auth/react';

import { BsDot } from "react-icons/bs";
import { menu_items } from "@/components/menu-items";
import Button from "@/components/Button";
import Avatar from "./Avatar";
import { LogOut } from "lucide-react";
import { BruskiUser } from "@/hooks/useBruskiUser";
import { Bell } from "lucide-react";
import { useState } from "react";

interface BottomBarProps {
  user: BruskiUser
  alert?: boolean
  className?: string
}

const BottomBar: React.FC<BottomBarProps> = ({alert, user, className}) => {


  const [num_notifications, setNumNotifications] = useState(user?.num_notifications || 0);
  const proModal = useProModal();
  const router = useRouter();
  const pathname = usePathname();




  function countTo(to: number) {
    let i = num_notifications;
    const interval = setInterval(() => {
      i--;
      setNumNotifications(i);
      if (i === to) clearInterval(interval);
    }, 100);
  }




  const checkIfPro = (url: string, pro: boolean) => {
    if (pro) {
      return proModal.onOpen();
    }

    return router.push(url);
  }


  const handleLogout = async () => {
    await signOut({ redirect: false }); // Set `redirect: true` if you want to redirect to the sign-out page.
    window.location.href = "/"
    // router.push('/')
  };



  return (
    <div className={`fixed z-[500] justify-around bg-gradient-to-t from-white
      dark:from-primary-foreground via-white/80 dark:via-primary-foreground/80 to-white/5
      dark:to-primary-foreground/5 inset-x-0 p-8 bottom-0 h-24 items-center `+className ?? "flex"}>

{(user?.id && !!num_notifications) && <div className="relative">

<Link href="/notifications" onClick={()=>{return countTo(0)}} className="clickable text-gray-800 bg-gradient-to-br from-gray-200 via-grday-300 to-gray-100 rounded-full  left-10 bottom-10 z-[4000] flex items-center justify-center h-[3.24rem] w-[3.24rem] mr-2">
  
  <Bell height={24} width={24} className="z-0"/>
  {
  parseInt(num_notifications) > 0 && <span className="bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs absolute -top-2 right-2 z-10">
        {num_notifications || 0}
    </span>

  }
</Link>



</div> }

        
      <div className=" bg-white dark:bg-primary-foreground rounded-[50px]
        mb-8 dark:shadow-sm dark:shadow-white/40 dark:bg-[#131313] flex items-center
        justify-center left-0 inset-0 gap-4 lg:px-8 px-6 mx-auto shadow-2xl">
        
      <div className="flex lg:gap-8 sm:gap-2 md:gap-8 gap-2 items-center justify-center bg-whitemax-w-xl h-24">
      
      {menu_items.map((route) => (
              <Link
                href={route.href}
                onClick={() => checkIfPro("", route.pro ?? false)}
                key={route.href}
                aria-label={route.label}
                className={cn(
                  "clickable text-muted-foreground text-sm group flex p-3 justify-center relative font-medium cursor-pointer hover:text-primary hover:bg-primary/10 active:bg-primary/30 rounded-full transition-colors duration-100",
                  pathname === route.href && "bg-primary/10 text-primary",
                )}
              >
                {route.alert ? <BsDot className="text-violet-500 absolute -top-4 left-0 z-50" size={70} /> : null }
                <div className={cn("flex flex-col gap-y-2 justify-center items-center flex-1 relative")}>
                    <route.icon className="h-5 w-5" />
                    {route.notification && <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs absolute -bottom-7 z-10">
                        
                        {route.notification}
                    </span>}
                    {/* {route.label == "Companion" && <Image src="/pixi.png" width={40} height={40} sizes={40} alt="Pixi" />} */}
                  {/* {route.label} */}
                  
                </div>
              </Link>
            )
      )}


          <div className="h-11 w-11 rounded-full flex items-center justify-center bg-primary/5
          clickable text-muted-foreground\ group p-3 relative font-medium cursor-pointer hover:text-primary hover:bg-primary/10 active:bg-primary/30 transition-colors duration-100" onClick={handleLogout}>
            <div className={cn("flex flex-col gap-y-2 justify-center items-center flex-1 relative")}>
              <LogOut className="h-5 w-5 rotate-180" />
            </div>
            {/* <Avatar img={user?.img} /> */}
          </div>
      
      </div>



      </div>
    </div>
   );
}
 
export default BottomBar;