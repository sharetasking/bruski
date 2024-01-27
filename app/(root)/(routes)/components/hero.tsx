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
import prisma from "@/lib/prismadb";
import axios from "axios";



export type Provider = {
  id: string;
  name: string;
  type: string;
  // ... other properties
};
const HeroComponent = ({profiles}:{profiles:Profile[]}) => {

  const [loginOrSignup, setLoginOrSignup] = useState("login");
  useEffect(() => {
      // SET MIXPANEL USER
    
    mixpanel.track("page_view", {
      // Optionally include properties about the page
      page_name: "LandingPage",
      url: window.location.pathname
    });
  });


  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');


  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e:React.FormEvent) => {
    toast.success("Submitting");
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    // Reset error and submitted state
    setError('');
    setSubmitted(false);

    try {
      // Assuming you have an API endpoint to handle the subscription
      const response = await axios.post('/api/subscribe', { email });
      if (response.status === 200) {
        // Email to CEO and success message to user
        // await axios.post('/api/notifyCEO', { email });
        setSubmitted(true);
        toast.success("Thank you for subscribing!");
      } else {
        setError('Unsuccessful. Please try another email');
        // toast.error("Unsuccessful. Please try another email");
      }
    } catch (error) {
      setError('Unsuccessful. Please try another email');
      // toast.error("Unsuccessful. Please try another email");
    }
  };

  useEffect(() => {
    // ... existing useEffect code ...
  }, []);



  return (
  <div className="bg-primary mt-2 h-full w-full max-w-7xl rounded-2xl justify-center p-2 md:px-12 md:pt-12 md:pb-6 md:flex-row flex gap-4 items-start flex-col">
        <div className="max-w-6xl w-full flex md:flex-row flex-col items-centedr justify-center">

          <div className="flex-1 text-primary-foreground lg:-mt-12 lg:py-12 p-2 px-4">
            {/* <h3 className="font-bold text-2xl">Bruski</h3> */}
            <h1 className="fadeInUp delay-0 mt-6 md:text-7xl text-4xl max-w-md">Where humans and AI connect to inspire</h1>
            <h2 className="fadeInUp delay-100 md:mt-8 mt-4 text-xl text-primary-foreground/80 opacity-0">Grow with us to <span className="block text-accent">1 million subscribers</span></h2>
            <p className="fadeInUp delay-200 text-primary-foreground/60 opacity-0 mt-2 max-w-sm">Connect with the most interesting human and AI influencers across the globe and create your own AI companions as well.</p>
            
            
            <div className=" ml-4 mt-4 lg:flex flex-wrap w-2/3 hidden">
              {profiles && profiles.map((profile, index) => (
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
              {profiles && <span className="fadeInUp opacity-0 -ml-4 hover:-ml-2 transition-all w-10 h-10 duration-500 cursor-default grow-0 shrink-0 rounded-full bg-primary-foreground text-primary flex items-center justify-center text-2xl" style={{animationDelay: (profiles.length ?? 1) * 50 + "ms"}}>+</span>}
            </div>


          </div>


          <div className="flex-1 justify-start lg:pt-20 flex flex-col lg:p-4 relative transition-all duration-200">
             










          <form onSubmit={handleSubmit} className="flex flex-col gap-4 my-4 bg-primary-foreground p-16 rounded-3xl">


                <h2>Get notified when we launch!</h2>
          <div className="mb-4 border-b text-center">
            <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-primary-foreground transform translate-y-1/2">
              Or get updated via email
            </div>
          </div>



      <div className="mx-auto w-full">
        <div className="flex flex-col">
          {/* <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
            type="email"
            placeholder="Email"
          /> */}


                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter your email"className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      // ... additional styling ...
                    />
                    {/* <button type="submit">Subscribe</button> */}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {submitted && <p style={{color: 'green'}}>Thank you for subscribing!</p>}
                  

                  
          {/* <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
            type="password"
            placeholder="Password"
          /> */}
        </div>

        <button
          type="submit"
          className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
        >
          {/* SVG for button icon */}
          Join waitlist
        </button>
      </div>
      </form>










                    











          </div>

          {/* <div className="text-secondary md:hidden p-8 text-xs flex items-center justify-start gap-4 mt-8">
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            &bull;
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          </div> */}

        </div>
    </div>
  );
}
 
export default HeroComponent;