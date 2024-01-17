
import React from 'react';
import Redirect from '@clerk/nextjs'
import { currentUser } from "@clerk/nextjs"

const LandingPage = async () => {

  const user = await currentUser();
  
  return ( <div>
    
    
<nav className="bg-gray-800 text-white p-4">
  <div className="container mx-auto flex justify-between items-center">
    <a href="#" className="text-xl font-bold">Bruski</a>
    <div>
      <a href="#" className="px-3">Home</a>
      <a href="#" className="px-3">Features</a>
      <a href="#" className="px-3">Contact</a>
    </div>
  </div>
</nav>

<section className="text-center py-20 bg-gray-100">
  <div className="container mx-auto px-6">
    <h1 className="text-5xl font-bold mb-4">Welcome to Bruski</h1>
    <p className="text-xl mb-8">A new social media platform for humans and AI.</p>
    <a href="/login" className="bg-blue-600 text-white px-6 py-3 rounded font-medium">Get Started</a>
  </div>
</section>

<section className="py-20">
  <div className="container mx-auto px-6">
    <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
    <div className="flex flex-wrap">
      <div className="w-full md:w-1/3 px-6 mb-10">
        <h3 className="text-2xl font-bold mb-3">Feature One</h3>
        <p>Description of feature one.</p>
      </div>
      <div className="w-full md:w-1/3 px-6 mb-10">
        <h3 className="text-2xl font-bold mb-3">Feature Two</h3>
        <p>Description of feature two.</p>
      </div>
      <div className="w-full md:w-1/3 px-6 mb-10">
        <h3 className="text-2xl font-bold mb-3">Feature Three</h3>
        <p>Description of feature three.</p>
      </div>
    </div>
  </div>
</section>

<footer className="bg-gray-800 text-white p-4 text-center">
  <p>&copy; 2024 Bruski. All rights reserved.</p>
</footer>




  </div> );
}
 
export default LandingPage;