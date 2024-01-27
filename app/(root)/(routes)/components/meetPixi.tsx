"use client"

import React, { useState } from 'react';
import Lottie from 'react-lottie';
import * as chefData from '@/components/lotties/chef.json'
import * as martianData from '@/components/lotties/martian-bot.json'
import * as strandedFisherData from '@/components/lotties/stranded-fisher.json'
import * as surferData from '@/components/lotties/surfer.json'
// import * as chefData from '@/components/lotties/chef.json'
import toast from 'react-hot-toast';
import Link from 'next/link';

const MeetPixi = () => {

  const chef = {
    loop: true,
    autoplay: true, 
    animationData: chefData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const martian = {
    loop: true,
    autoplay: true, 
    animationData: martianData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const strandedFisher = {
    loop: true,
    autoplay: true, 
    animationData: strandedFisherData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  

  const surfer = {
    loop: true,
    autoplay: true, 
    animationData: surferData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return ( <div className='grid grid-cols-1 md:grid-cols-1 py-48 px-4 '>
  
  <div className="bg-secondary -mt-2 w-full max-w-7xl rounded-2xl justify-center md:px-12 md:pt-12 md:pb-6 md:flex-row flex gap-4 items-center flex-col">
        <div className="max-w-6xl w-full flex md:flex-row flex-col items-center justify-center">

          <div className="fadeInUp flex-1 flex flex-col text-primary text-left lg:-mt-12 lg:py-4 p-2 px-4">
            <h1 className="fadeInUp delay-200 mt-6 md:text-7xl text-4xl max-w-2xl">Introducing<br/>Pixis</h1>
            <p className="fadeInUp delay-1000 text-2xl font-medium text-primary/60 italic">Your <br className="hidden md:block mx-4"/>P - Personal <br className="hidden md:block mx-8"/> I - Interactive <br className="hidden md:block mx-8"/>X - Xperience <br className="hidden md:block mx-8"/>I - Interface</p>

          </div>
        </div>
        <div className="max-w-6xl w-full flex md:flex-row flex-col items-center justify-center">

          <div className="relative fadeInUp flex-1 md:flex md:flex-col justify-center items-center text-primary text-center lg:-mt-12 lg:py-4 p-2 px-4 gap-4">
            
            

          <div className="fadeInUp delay-300 md:absolute md:-top-10 lg:-left-40 block">
              <Lottie options={chef}
              height={400}
              width={400}
              isStopped={false}
              isPaused={false} /></div>


          <div className="fadeInUp delay-300 md:absolute md:-top-40 md:-left-10 lg:-left-20 block z-40">
              <Lottie options={martian}
              height={100}
              width={100}
              isStopped={false}
              isPaused={false} /></div>


          <div className="fadeInUp delay-300 md:absolute md:-top-96 lg:left-40 block z-10">
              <Lottie options={strandedFisher}
              height={300}
              width={300}
              isStopped={false}
              isPaused={false} /></div>



          <div className="fadeInUp delay-300 md:absolute md:top-40 lg:right-0 md:-left-40 lg:left-0 block z-20">
              <Lottie options={surfer}
              height={200}
              width={200}
              isStopped={false}
              isPaused={false} /></div>


          </div>
        </div>
    </div>
  
  </div> );
}
 
export default MeetPixi;