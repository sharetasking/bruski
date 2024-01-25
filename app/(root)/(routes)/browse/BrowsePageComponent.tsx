"use client"

import FollowButton from '@/components/FollowButton';
import Avatar from "@/components/Avatar";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ExtendedProfile } from '@/hooks/useProfiles';

import { User } from '@prisma/client';
import { BruskiUser } from '@/hooks/useBruskiUser';
import Link from "next/link"
import mixpanel from '@/utils/mixpanel';


const BrowsePageComponent = ({profiles, user}:{profiles:ExtendedProfile[]|null, user:BruskiUser|null}) => {

  const router = useRouter();

  // const goToUser = (url:string) => {
  //   router.push('/'+url)
  // }


  useEffect(() => {
      // SET MIXPANEL USER
    mixpanel.identify(user?.id);
    mixpanel.people.set({
      $email: user?.email,
    });

    mixpanel.track("page_view", {
      // Optionally include properties about the page
      page_name: "BrowseProfiles",
      url: window.location.pathname
    });

  });

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) =>
  {
    e.stopPropagation();
  }

  if(!profiles)
    return <></>
  else
    return (<>

<div className='max-w-5xl fadeInUp'>
    <h1 className='px-8 mt-8 text-5xl'>Profiles</h1>
    <div className="p-8 pb-48">
      {/* <h2>Search</h2>
      <input type="text" placeholder="Search"/> */}
  
      <div className="flex md:grid cursor-pointer flex-col md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 subpixel-antialiased ">
        {profiles?.map((profile) => (
          <Link href={profile.url} key={profile.id} onClick={handleClick}>
          <div
            style={{
              minHeight:'400px'
            }}
            key={profile.id} className='min-h-60 pb-14 relative bg-secondary hover:bg-primary/5 active:bg-primary/20 rounded-2xl p-8'>
            <Avatar onClick={handleClick} img={profile.img ?? "/img/placeholder.svg"} url={profile.url} />
            <h2 className="text-xl font-semibold mt-2 truncate">{profile.display_name}</h2>
            <p className="text-primary/60 text-sm truncate">{profile.url}</p>
            <hr className="mt-4"/>
            <p className="py-4 line-clamp-5">{profile.bio}</p>
            <div className="mt-10 bottom-5 absolute">
            
            {(profile.id != user?.profiles?.[0]?.id) && <FollowButton settings={{profileId:profile.id, follows:profile.isFollowedByUser ?? false}} /> }
            </div>
          </div>
          </Link>
        ))}
      </div>
      
    </div>
  </div>

  </> );
}
 
export default BrowsePageComponent;