import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'react-hot-toast';
import { ProModal } from '@/components/pro-modal';
import { Navbar } from '@/components/navbar';


import BottomBar from "@/components/BottomBar";
import PixiWidget from "@/components/PixiWidget";
import CoinsWidget from "@/components/CoinsWidget";
import { useUser,  } from '@clerk/clerk-react';
import { currentUser } from '@clerk/nextjs';

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
  let user;
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
  console.log(user)

  return (
    // reintroduce suppressHydrationWarning in html tag ?
    <ClerkProvider>
      <html lang="en">
        <body className={cn("bg-secondary/10 overflow-y-scroll h-full gap-8 antialiased relative max-w-7xl m-auto", inter.className)}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Navbar isPro={isPro} />
            <ProModal />
            <div className="pt-16">
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
