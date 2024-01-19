import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { checkSubscription } from "@/lib/subscription";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react"
import { currentUser } from "@clerk/nextjs"
import { Toaster } from "react-hot-toast"
import BottomBar from "@/components/BottomBar";
import PixiWidget from "@/components/PixiWidget";

const RootLayout =  async ({
  children
}: {
  children: React.ReactNode;
}) => {
  const isPro = await checkSubscription();
  

  const user = await currentUser();
  
  return ( 
    <div className="h-full">
      {process.env.ADMIN_EMAIL == user?.emailAddresses?.[0].emailAddress && <div className="text-primary-foreground/60 p-2 bg-primary font-semibold text-xs text-center">ADMIN MODE (Log into another account to test user mode)</div>}
      
      {/* <Sidebar isPro={isPro} /> */}
      <main className="flex lg:px-8 grow justify-center">
        {children}
      </main>
 
            {/* <CoinsWidget /> */}
            {/* TODO: <PixiWidget/> */}
      {/* <Toaster /> */}


    </div>
   );
}

 
export default RootLayout;