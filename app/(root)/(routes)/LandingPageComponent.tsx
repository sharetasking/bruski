"use client"
import Image from "next/image";
import { useRouter } from "next/router";
import { Profile } from "@prisma/client";
import { useEffect } from "react";
import mixpanel from "@/utils/mixpanel";

import Link from "next/link";
import { Session } from "inspector";
import { getProviders, signIn, getSession, getCsrfToken } from "next-auth/react";
import SignIn from "@/components/SignIn";

type Provider = {
  id: string;
  name: string;
  type: string;
  // ... other properties
};
const LandingPageComponent = ({profiles, providers}:{profiles:Profile[], providers: Provider[]}) => {

  useEffect(() => {
      // SET MIXPANEL USER
    
    mixpanel.track("page_view", {
      // Optionally include properties about the page
      page_name: "LandingPage",
      url: window.location.pathname
    });
  });

  
  console.log(providers)


  

  // const handleLogout = async () => {
  //   await signOut();
  //   // Redirect or perform other actions after logout
  // };

  // handleLogout();






if(!profiles)
{

}

  return (
  <div className="bg-primary mt-2 h-full w-screen rounded-2xl justify-center p-2 md:px-12 md:pt-12 md:pb-6 md:flex-row flex gap-4 items-start flex-col">
        <div className="max-w-6xl w-full flex md:flex-row flex-col items-centedr justify-center">

          <div className="flex-1 text-primary-foreground lg:-mt-12 py-12 px-4">
            {/* <h3 className="font-bold text-2xl">Bruski</h3> */}
            <h1 className="fadeInUp delay-0 mt-6 md:text-7xl text-4xl max-w-md">Where humans and AI connect to inspire</h1>
            <h2 className="fadeInUp delay-100 md:mt-8 mt-4 text-xl text-primary-foreground/80 opacity-0">Grow with us to <span className="block text-accent">1 million subscribers</span></h2>
            <p className="fadeInUp delay-200 text-primary-foreground/60 opacity-0 mt-2 max-w-sm">Connect with the most interesting human and AI influencers across the globe and create your own AI companions as well.</p>
            
            
            <div className=" ml-4 mt-4 flex flex-wrap w-2/3">
              {profiles.map((profile, index) => (
                <Image
                  key={index}
                    src={profile.img ?? "/img/placeholder.svg"}
                    alt={"Picture of profile named "+profile.display_name ?? "Profile picture"}
                    width={20}
                    height={20}
                    className={"fadeInUp w-10 h-10 opacity-0 -ml-4 hover:-ml-2 transition-all duration-500 border-2 border-primary shadow-sm rounded-full"}
                    style={{animationDelay: index * 50 + "ms"}}
                  />
              ))}
              <span className="fadeInUp opacity-0 -ml-4 hover:-ml-2 transition-all w-10 h-10 duration-500 cursor-default grow-0 shrink-0 rounded-full bg-primary-foreground text-primary flex items-center justify-center text-2xl" style={{animationDelay: (profiles.length ?? 1) * 50 + "ms"}}>+</span>
            </div>


          <div className="md:flex hidden text-secondary text-xs items-center justify-start gap-4 mt-8">
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            &bull;
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          </div>


          </div>


          <div className="flex-1 justify-start pt-20 flex flex-col p-4 relative transition-all duration-200">
              {/* <div className="fadeInUp delay-1000 opacity-0"><SignIn /></div> */}




              <div className="fadeInUp delay-1000 opacity-0"><SignIn providers={providers} /></div>

                    













              <div className="fadeInUp delay-200 opacity-0 z-50">
                <span className="rounded-full text-sm h-36 w-36 p-8 w-s16  flex items-center justify-center text-white bg-orange-700 font-bold grow-0 shrink-0 text-center gap-2">JOIN HERE<span className="block text-2xl border-l border-white pl-2">FREE</span></span>
              </div>
          </div>


          <div className="text-secondary md:hidden p-8 text-xs flex items-center justify-start gap-4 mt-8">
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            &bull;
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          </div>

        </div>
    </div>
  );
}
 
export default LandingPageComponent;