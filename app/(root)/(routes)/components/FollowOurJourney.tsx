import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';

const FollowOurJourney = () => {
  return ( <div className='py-48 bg-secondary px-4 flex flex-col gap-4 rounded-3xl justify-center items-center'>
  <h1 className="fadeInUp rounded-2xl delay-200 mt-6 md:text-7xl text-4xl max-w-2xl px-16 lg:px-4 text-center m-0">Follow us on our race to a million monthly users</h1>
  <h2 className=" flex flex-col items-center justify-center gap-2 mt-8"><span className='text-lg upperscase text-primary/40'>TARGET</span> 1,000,000+ <span className="font-normal text-primary/50 -mt-2">monthly users</span></h2>
  </div> );
}
 
export default FollowOurJourney;