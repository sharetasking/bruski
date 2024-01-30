// import { Inter } from 'next/font/google';

import { Navbar } from '@/components/navbar';
import { ProModal } from '@/components/pro-modal';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';
import Script from 'next/script';


import Trackers from '@/analytics/trackers';

import prismadb from '@/lib/prismadb';
import '../globals.css';
import ClientProviders from '@/components/ClientProviders';
import { authConfig } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth'

// const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {

  const session = await getServerSession(authConfig)
  const user = session?.user;
  
  let email = "null";
  const isPro = false;



  return (
    <ClientProviders session={session}>
      <html lang="en">
      <head>
          <title>Bruski | A Human and AI-powered social media world</title>
          <meta name="description" content="Where humans and AI come together to create" /> 
          <Trackers />
        </head>
        <body className="bg-secondary/10 overflow-y-scroll h-full gap-8 relative 2xl:max-w-7xl m-auto no-scrollbar">
          <Script async src="https://cdn.promotekit.com/promotekit.js" data-promotekit="6da74517-fad2-47fc-a0fe-7fa7daa0be76"></Script>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>

            {/* <Navbar user={user ?? null} isPro={isPro} /> */}
            <ProModal />
            <div className="flex grow flex-1 w-full pt-16">
              {children}
            </div>
            <Toaster />
            {/* {user?.id && <BottomBar user={user} />} */}
            

          </ThemeProvider>
        </body>
      </html>
      </ClientProviders>
  )
}
