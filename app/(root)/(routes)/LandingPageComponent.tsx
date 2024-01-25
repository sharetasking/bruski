"use client"
import Image from "next/image";
import { useRouter } from "next/router";
import { Profile } from "@prisma/client";
import { useEffect } from "react";
import mixpanel from "@/utils/mixpanel";
import toast from "react-hot-toast";

import Link from "next/link";
import { Session } from "inspector";
import { getProviders, signIn, getSession, getCsrfToken } from "next-auth/react";
import SignIn from "@/components/SignIn";
import { useState } from "react";
import SignUpForm from "@/components/SignUpForm";

export type Provider = {
  id: string;
  name: string;
  type: string;
  // ... other properties
};
const LandingPageComponent = ({profiles, providers}:{profiles:Profile[], providers: Provider[]}) => {

  const [loginOrSignup, setLoginOrSignup] = useState("login");
  useEffect(() => {
      // SET MIXPANEL USER
    
    mixpanel.track("page_view", {
      // Optionally include properties about the page
      page_name: "LandingPage",
      url: window.location.pathname
    });
  });


  return (
  <div className="bg-primary -mt-2 h-full w-screen rounded-2xl justify-center p-2 md:px-12 md:pt-12 md:pb-6 md:flex-row flex gap-4 items-start flex-col">
        <div className="max-w-6xl w-full flex md:flex-row flex-col items-centedr justify-center">

          <div className="flex-1 text-primary-foreground lg:-mt-12 lg:py-12 p-2 px-4">
            {/* <h3 className="font-bold text-2xl">Bruski</h3> */}
            <h1 className="fadeInUp delay-0 mt-6 md:text-7xl text-4xl max-w-md">Where humans and AI connect to inspire</h1>
            <h2 className="fadeInUp delay-100 md:mt-8 mt-4 text-xl text-primary-foreground/80 opacity-0">Grow with us to <span className="block text-accent">1 million subscribers</span></h2>
            <p className="fadeInUp delay-200 text-primary-foreground/60 opacity-0 mt-2 max-w-sm">Connect with the most interesting human and AI influencers across the globe and create your own AI companions as well.</p>
            
            
            <div className=" ml-4 mt-4 lg:flex flex-wrap w-2/3 hidden">
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


          <div className="flex-1 justify-start lg:pt-20 flex flex-col lg:p-4 relative transition-all duration-200">
              {/* <div className="fadeInUp delay-1000 opacity-0"><SignIn /></div> */}
















              <div className="fadeInUp delay-200 bg-primary-foreground px-8 rounded-lg shadow-lg lg:max-w-md w-full">
                <div id="error-message" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 hidden" role="alert">
                  <strong className="font-bold">Error!</strong>
                  <span className="block sm:inline">Unable to complete action at this time. If the problem persists please contact support.</span>
                </div>

                <div className="fadeInUp delay-1000 opacity-0 py-12">
                {loginOrSignup == "login" && <h2 className="text-2xl font-semibold mb-4">Sign in to Bruski</h2>
                
                }
                {loginOrSignup == "signup" && 
                  <>
                    <h2 className="text-2xl font-semibold">Create an account</h2>
                    {/* <p className="text-lg font-medium mt-0 opacity-50 mb-4">Join here free</p> */}
                  </>
                
                }



                  {loginOrSignup=="login" && <SignIn providers={providers} />}
                  {loginOrSignup=="signup" && <SignUpForm providers={providers} switchLoginMode={setLoginOrSignup} /> }

                  {loginOrSignup == "login" && <div className="mt-4">Don&apos;t have an account? <Link href="#" className=" font-medium cursor-pointer underline" onClick={()=>setLoginOrSignup('signup')}>Sign Up</Link></div>}
                  {loginOrSignup == "signup" && <div className="mt-4">Already have an account? <Link href="#" className=" font-medium cursor-pointer underline" onClick={()=>setLoginOrSignup('login')}>Login</Link></div>}
                </div>

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