import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';

const WantToHelp = () => {
  return ( <div className='px-4 py-60'>
<h1 className="fadeInUp delay-200 mt-6 md:text-7xl text-4xl max-w-2xl px-4 py-12">Want to Help? ;)</h1>



  <div className="fadeInUp delay-700 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 p-4 lg:p-8">
    <div className='bg-secondary rounded-[50px] p-12 text-2xl font-medium h-48 flex items-center'>Join<br/>our waitlist</div>
    <div className='bg-secondary rounded-[50px] p-12 text-2xl font-medium h-48 flex items-center'>Share this<br/>to your friends</div>
    {/* <div className='bg-secondary rounded-[50px] p-12 text-2xl font-medium h-48 flex items-center'>Subscribe for an advanced package ahead (and get 50% off)</div> */}
    <div className='bg-secondary rounded-[50px] p-12 text-2xl font-medium h-48 flex flex-col items-center'>
      <span className='text-2xl font-semibold'>Have a brand?</span>
      <span className='text-2xl'>Partner with us!</span>
      <span className="text-orange-500 text-lg">bruski@sharetasking.com</span>
    </div>
  </div>

  <div>
    

    
  </div>
</div> );
}
 
export default WantToHelp;