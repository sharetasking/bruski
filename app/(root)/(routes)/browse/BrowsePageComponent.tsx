"use client"

import FollowButton from '@/components/FollowButton';
import Avatar from "@/components/Avatar";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExtendedProfile } from '@/hooks/useProfiles';

import { User } from '@prisma/client';


const BrowsePageComponent = ({profiles, user}:{profiles:ExtendedProfile[]|null, user:User|null}) => {

  const router = useRouter();

  const goToUser = (url:string) => {
    router.push('/'+url)
  }

  if(!profiles && profiles?.length)
    return <></>

  else
    return (<>

<div>
    <h1 className='px-8 mt-8 text-5xl'>Profiles</h1>
    <div className="p-8 pb-48">
      {/* <h2>Search</h2>
      <input type="text" placeholder="Search"/> */}
  
      <div className="flex md:grid cursor-pointer flex-col md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 subpixel-antialiased ">
        {profiles?.map((profile) => (
          <div
            onClick={()=>goToUser(profile.url ?? profile.id)}
            key={profile.id} className='min-h-60 pb-14 relative bg-primary/5 hover:bg-primary/10 active:bg-primary/20 rounded-2xl p-8'>
            <Avatar img={profile.img ?? ""}/>
            <h2 className="text-xl font-semibold mt-2 truncate">{profile.display_name}</h2>
            <p className="text-primary/60 text-sm truncate">{profile.url}</p>
            <hr className="mt-4"/>
            <p className="py-4 line-clamp-3">{profile.bio}</p>
            <div className="mt-10 bottom-5 absolute">
            
            {(profile.id != user.profiles?.[0]?.id) && <FollowButton settings={{profileId:profile.id, follows:profile.isFollowedByUser}} /> }
            </div>
          </div>
        
        ))}
      </div>
      
    </div>
  </div>

  </> );
}
 
export default BrowsePageComponent;