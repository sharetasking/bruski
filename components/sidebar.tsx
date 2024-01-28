"use client";

import { Home, Plus, User, Navigation, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { useProModal } from "@/hooks/use-pro-modal";
import { menu_items } from "@/components/menu-items";
import { ModeToggle } from "./mode-toggle";

interface SidebarProps {
  isPro: boolean;
}

export const Sidebar = ({
  isPro
}: SidebarProps) => {
  const proModal = useProModal();
  const router = useRouter();
  const pathname = usePathname();
  // onClick={() => onNavigate(route.href, route.pro)}
  const checkIfPro = (url: string, pro: boolean) => {
    if (pro && !isPro) {
      return proModal.onOpen();
    }

    return router.push(url);
  }

  // const routes = [
  //   {
  //     icon: Home,
  //     href: '/home',
  //     label: "Home",
  //     pro: false,
  //   },
  //   {
  //     icon: User,
  //     href: '/companion',
  //     label: "Companion",
  //     pro: false,
  //   },
  //   {
  //     icon: Navigation,
  //     href: '/explore',
  //     label: "Explore",
  //     pro: false,
  //   },
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
  // ];

  return (

    <aside className=" md:flex padding mt-16 h-full flex-col fixed inset-y-0">
      <div className="space-y-4 flex flex-col h-full text-primary">
        <div className="p-3 flex-1 flex justify-center">
          <div className="gap-2 flex flex-col ">
            <div className="flex-col flex">
              {menu_items.map((route) => (
                
                <Link
                  href={route.href}
                  onClick={() => checkIfPro("", route.pro)}
                  key={route.href}
                  className={cn(
                    " text-muted-foreground text-sm group flex p-3 w-full justify-center font-medium cursor-pointer hover:text-primary hover:bg-primary/10 active:bg-primary/30 rounded-lg transition-colors duration-100",
                    pathname === route.href && "bg-primary/10 text-primary",
                  )}
                >
                  <div className={cn("flex flex-col gap-y-2 justify-center items-center flex-1")}>
                      <route.icon className="h-5 w-5" />
                      {/* {route.label == "Companion" && <Image src="/pixi.png" width={40} height={40} alt="Pixi" />} */}
                    {route.label}
                  </div>
                </Link>
              ))}
            </div>
            <div className="rounded-full px-4 py-2 mt-24 flex items-center justify-center bg-primary/10"><ModeToggle  /></div>
          </div>
        </div>
      </div>
    </aside>
  );
};
