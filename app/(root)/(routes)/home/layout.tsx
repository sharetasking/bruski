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
      <Navbar isPro={isPro} />
      {/* <Sidebar isPro={isPro} /> */}
      <main className="md:px-8 pt-16 h-full w-full grow">
        {children}
      </main>
 
            {/* <CoinsWidget /> */}
            <PixiWidget/>
            <BottomBar user={user} />
      <Toaster />


    </div>
   );
}

 
export default RootLayout;