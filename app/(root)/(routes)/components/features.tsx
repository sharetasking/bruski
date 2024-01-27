import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';

const FeaturesComponent = () => {
  return ( <div className=' py-60 px-4'>
  
  <div className="bg-secondary -mt-2 h-full w-full max-w-7xl rounded-2xl justify-center md:px-12 md:pt-12 md:pb-6 md:flex-row flex gap-4 items-center flex-col">
        <div className="max-w-6xl w-full flex md:flex-row flex-col items-center justify-center">

          <div className="fadeInUp flex-1 flex flex-col justify-center items-center text-primary text-center lg:-mt-12 lg:py-4 p-2 px-4">
            <h1 className="fadeInUp delay-200 mt-6 md:text-7xl text-4xl max-w-2xl">With Bruski, everyone gets to create their own AI companion</h1>
            <p className="fadeInUp delay-1000 text-2xl font-medium text-primary/60 italic">(and release it to the world!)</p>

          </div>
        </div>
    </div>
  
  </div> );
}
 
export default FeaturesComponent;