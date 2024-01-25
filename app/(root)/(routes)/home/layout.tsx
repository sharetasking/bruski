import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { checkSubscription } from "@/lib/subscription";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast"
import BottomBar from "@/components/BottomBar";
import PixiWidget from "@/components/PixiWidget";
import ClientProviders from "@/components/ClientProviders";
import { getSession, } from 'next-auth/react';
import { Session, getServerSession } from "next-auth";
import { authConfig } from "@/app/api/auth/[...nextauth]/options";


const RootLayout =  async ({
  children
}: {
  children: React.ReactNode,
}) => {
  // const isPro = await checkSubscription();
  const session = await getServerSession(authConfig)
  

  
  return ( 
    <ClientProviders session={session}>
      <div className="h-full">
        
        {/* {process.env.ADMIN_EMAIL == user?.emailAddresses?.[0].emailAddress && <div className="text-primary-foreground/60 p-2 bg-primary font-semibold text-xs text-center">ADMIN MODE (Log into another account to test user mode)</div>} */}
        
        {/* <Sidebar isPro={isPro} /> */}
        <main className="flex lg:px-8 grow justify-center">
          {children}
        </main>
  
              {/* <CoinsWidget /> */}
              {/* <PixiWidget/> */}
        {/* <Toaster /> */}


      </div>
    </ClientProviders>
   );
}

 
export default RootLayout;