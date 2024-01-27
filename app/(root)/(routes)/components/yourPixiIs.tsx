"use client"

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';


import Lottie from 'react-lottie';
import * as animationData from '@/components/lotties/music.json'


const YourPixiIs = () => {


  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };


  return ( <div className='py-60 px-4'>
  <h1 className="fadeInUp delay-200 mt-6 md:text-7xl text-4xl max-w-2xl p-4">Your Pixi is</h1>

  {/* <div className="bg-secondary -mt-2 h-full w-full max-w-7xl rounded-2xl justify-center md:px-12 md:pt-12 md:pb-6 md:flex-row flex gap-4 items-center flex-col">
        <div className="max-w-6xl w-full flex md:flex-row flex-col items-center justify-center">

          <div className="fadeInUp flex-1 flex flex-col text-primary text-left lg:-mt-12 lg:py-4 p-2 px-4">
            
            

          </div>
        </div>
    </div> */}
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
<div className="grid grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-8 p-4 lg:p-8">
  <div className='bg-secondary rounded-[50px] p-12 text-2xl font-medium h-48 flex items-center'>Fully<br/>customizable</div>
  <div className='bg-secondary rounded-[50px] p-12 text-2xl font-medium h-48 flex items-center'>Highly<br/>intelligent</div>
  <div className='bg-secondary rounded-[50px] p-12 text-2xl font-medium h-48 flex items-center'>Your best companion</div>
  <div className='bg-secondary rounded-[50px] p-12 text-2xl font-medium h-48 flex items-center'>Loved<br/>by the world</div>
</div>

<div className="rounded-2xl p-12 bg-black w-fit flex justify-end">
<Lottie options={defaultOptions}
              height={400}
              width={400}
              isStopped={false}
              isPaused={false}/>
        </div>
        </div>
  {/* <div className="bg-secondary -mt-2 h-full w-full max-w-7xl rounded-2xl justify-center md:px-12 md:pt-12 md:pb-6 md:flex-row flex gap-4 items-center flex-col">
        <div className="max-w-6xl w-full flex md:flex-row flex-col items-center justify-center">

          <div className="fadeInUp flex-1 flex flex-col justify-center items-center text-primary text-center lg:-mt-12 lg:py-4 p-2 px-4">
            
            







          </div>
        </div>
    </div>
   */}
  </div> );
}
 
export default YourPixiIs;