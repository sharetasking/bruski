"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useProModal } from "@/hooks/use-pro-modal";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { BsDot } from "react-icons/bs";
import { menu_items } from "@/components/menu-items";

interface BottomBarProps {
  user: any
  alert?: boolean
}

const BottomBar: React.FC<BottomBarProps> = (alert, user) => {
  
  // const menu_items = [
  //   {
  //     icon: Home,
  //     href: '/home',
  //     label: "Home",
  //     pro: false,
  //     notification: false
  //   },
  //   {
  //     icon: User,
  //     href: '/browse',
  //     label: "Browse",
  //     pro: false,
  //   },
  //   // {
  //   //   icon: User,
  //   //   href: '/companion',
  //   //   label: "Companion",
  //   //   pro: false,
  //   //   notification: "12.6k",
  //   // },
  //   {
  //     icon: Bell,
  //     href: '/notifications',
  //     label: "Notifications",
  //     alert: user?.hasNotification,
  //   },
  //   // {
  //   //   icon: Navigation,
  //   //   href: '/explore',
  //   //   label: "Explore",
  //   //   pro: false,
  //   // },
  //   {
  //     icon: Plus,
  //     href: '/companion/new',
  //     label: "Create",
  //     pro: false,
  //   },
  //   {
  //     icon: Settings,
  //     href: '/settings',
  //     label: "Settings",
  //     pro: false,
  //   },
  // ]

  const proModal = useProModal();
  const router = useRouter();
  const pathname = usePathname();

  const checkIfPro = (url: string, pro: boolean) => {
    if (pro) {
      return proModal.onOpen();
    }

    return router.push(url);
  }


  return (
    <div className="fixed z-[500] justify-around bg-gradient-to-t from-white
      dark:from-primary-foreground via-white/80 dark:via-primary-foreground/80 to-white/5
      dark:to-primary-foreground/5 inset-x-0 p-8 bottom-0 h-24 items-center flex ">
        
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
                  " text-muted-foreground text-sm group flex p-3 justify-center relative font-medium cursor-pointer hover:text-primary hover:bg-primary/10 active:bg-primary/30 rounded-full transition-colors duration-100",
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


          <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary">
            <UserButton afterSignOutUrl="/" />
          </div>
      
      </div>



      </div>
    </div>
   );
}
 
export default BottomBar;