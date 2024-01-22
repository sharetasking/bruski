"use client"

import React, { useEffect } from 'react';
import mixpanel from '@/utils/mixpanel';
import { BruskiUser } from '@/hooks/useBruskiUser';
import { Companion } from '@prisma/client';
import Avatar from '@/components/Avatar';
import Link from 'next/link';
import { SmilePlus } from 'lucide-react';


interface BruskiCompanion extends Companion {
  profiles: {
    url: string;
    display_name: string;
  }[];
  category: {
    name: string;
  };

}

const PixiPageComponent = ({user, companions}: {user:BruskiUser, companions: BruskiCompanion[]}) => {


  useEffect(() => {

    
    // SET MIXPANEL USER
  mixpanel.identify(user?.id);
  mixpanel.people.set({
    $email: user?.email,
    // ... other user properties
  });

  mixpanel.track("page_view", {
    // Optionally include properties about the page
    page_name: "PixiList",
    url: window.location.pathname
  });

});

  return ( <>
  
  <div className="fadeInUp max-w-7xl mt-4 px-5 pt-5 pb-48">
    <h1>Pixi</h1>
    <p className="mt-4 text-primary/70">
      Your friendly pixi companions
    </p>
    <div className="mt-4">
      <Link href="/pixi/new" className="btn btn-beautified">Create a Pixi</Link>
    </div>
    <div className="py-8 rounded-lg mt-4 grid gap-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
      {(companions && companions.length != 0) && companions.map((companion) => (
        <div key={companion.id} className="fadeInUp bg-secondary p-8 rounded-lg">
          <Avatar img={companion.img} url={companion.profiles?.[0]?.url ?? ""} />
          <Link href={companion.profiles?.[0]?.url ?? ""} className="hover:underline"><h2>{companion?.profiles?.[0]?.display_name}</h2></Link>
          <p>{companion.description}</p>
          <p className="my-2 bg-primary/10 rounded-lg w-fit px-2 py-0.5 text-sm font-medium">{companion.category.name}</p>
          <div className="mt-8">
            <Link href={"/pixi/"+companion.id} className="btn">Edit Pixi</Link>
          </div>
        </div>
      ))}

      {/* Add more */}
      {(companions && companions.length != 0) &&
        <div className="fadeInUp p-8 rounded-lg border-2 border-dashed hover:border-primary cursor-pointer flex flex-col items-center justify-center text-center group">
            <div className="opacity-40 flex flex-col items-center justify-center group-hover:opacity-100">
              <h1><SmilePlus /></h1>
              <h3>Add a Pixi</h3>
              <p className="text-primary/50">Coming Soon</p>
            </div>
        </div>
      } 
      
      {/* If no Pixi */}
      {(!companions || (companions && companions.length == 0)) && (
      <div className="fadeInUp flex flex-col bg-secondary rounded-2xl p-12 items-center justify-center h-60 w-full text-center grow text-lg text-primary/50 ">
        <h2>You don&apos;t have any pixis yet.</h2>
        <p className="ml-2">Create one above now!</p>
      </div>)}
    </div>
  </div>

  </> );
}
 
export default PixiPageComponent;