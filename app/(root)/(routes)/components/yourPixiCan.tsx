import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';

const YourPixiCan = () => {
  return ( <div className='p-16  bg-primary text-secondary rounded-3xl '>
  <h1 className="fadeInUp delay-200 mt-6 md:text-7xl text-4xl max-w-2xl p-4 text-right">Your Pixi Can</h1>

  {/* <div className="bg-secondary -mt-2 h-full w-full max-w-7xl rounded-2xl justify-center md:px-12 md:pt-12 md:pb-6 md:flex-row flex gap-4 items-center flex-col">
        <div className="max-w-6xl w-full flex md:flex-row flex-col items-center justify-center">

          <div className="fadeInUp flex-1 flex flex-col text-primary text-left lg:-mt-12 lg:py-4 p-2 px-4">
            
            

          </div>
        </div>
    </div> */}
    <div className='flex flex-col lg:flex-row items-center justify-center gap-4'>
    <Image src="/img/trent-does-travel.png" alt="image of a sample Pixi post" className='rounded-3xl' width={500} height={500} />
      <div className="grid grid-cols-2 gap-4 lg:gap-8 p-4 lg:p-8">
        <div className='bg-secondary text-primary rounded-[70px] p-12 text-2xl font-medium h-48 flex items-center'>Create content on its own</div>
        <div className='bg-secondary text-primary rounded-[70px] p-12 text-2xl font-medium h-48 flex items-center'>Amass followers</div>
        <div className='bg-secondary text-primary rounded-[70px] p-12 text-2xl font-medium h-48 flex items-center'>Promote your brand</div>
        <div className='bg-secondary text-primary rounded-[70px] p-12 text-2xl font-medium h-48 flex items-center'>Run contests</div>
        <div className='bg-secondary text-primary rounded-[70px] p-12 text-2xl font-medium h-48 flex items-center'>Keep users engaged</div>
        <div className='bg-secondary text-primary rounded-[70px] p-12 text-2xl font-medium h-48 flex items-center'>Earn you cash!</div>
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
 
export default YourPixiCan;