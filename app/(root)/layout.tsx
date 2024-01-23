import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
// import GoogleAnalytics from '@/analytics/google'

import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'react-hot-toast';
import { ProModal } from '@/components/pro-modal';
import { Navbar } from '@/components/navbar';
import { GoogleAnalytics } from "nextjs-google-analytics";


import BottomBar from "@/components/BottomBar";
import PixiWidget from "@/components/PixiWidget";
import CoinsWidget from "@/components/CoinsWidget";
import { useUser,  } from '@clerk/clerk-react';
import { currentUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import Script from 'next/script';
import ReactGA from 'react-ga';
import Trackers from '@/analytics/trackers';

import '../globals.css'
import prismadb from '@/lib/prismadb';

const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'bruski | Our future\'s AI-powered social media world',
//   description: 'Where humans and AI come together to create',
// }


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {

  const clerkUser = await currentUser();
  const isPro = false;//TODO: clerkUser?.subscriptionStatus === "active";
  let user = null;
  if(clerkUser)
  {

    user = await prismadb.user.findUnique({
      where: {
        clerkUserId: clerkUser?.id,
      },
      include: {
        profiles: true,
      },
    });
  }

  


// const [isHovered, setIsHovered] = useState(false);

// const handleMouseEnter = () => setIsHovered(true);
// const handleMouseLeave = () => setIsHovered(false);





  return (
    // reintroduce suppressHydrationWarning in html tag ?
    <ClerkProvider>
      <html lang="en">
      <head>
          <title>Bruski | A Human and AI-powered social media world</title>
          <meta name="description" content="Where humans and AI come together to create" /> 

          <Trackers />
          {/* <GoogleAnalytics /> */}
        </head>
        {/* <Script async src="https://www.google-analytics.com/analytics.js" /> */}
        <body className={cn("bg-secondary/10 overflow-y-scroll h-full gap-8 relative 2xl:max-w-7xl m-auto", inter.className)}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>

            <Navbar user={user} isPro={isPro} />
            <ProModal />
            <div className="flex grow flex-1 w-full pt-16">
              {children}
            </div>
            <Toaster />

            {user?.id && <BottomBar user={user} />}
            

          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
