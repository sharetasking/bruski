import { SignIn, ClerkLoading } from "@clerk/nextjs";
import Image from "next/image";

const SignInPage = () => {
  
  return ( 
    <div className="bg-primary h-full w-screen justify-center p-2 lg:p-12 lg:flex-row flex gap-4 items-center flex-col-reverse">
      <div className="flex-1 justify-end flex p-4 relative">
          <SignIn />
      </div>
      <div className="flex-1 text-primary-foreground lg:-mt-12 py-12 px-4">
        <h3 className="font-bold text-2xl">Bruski</h3>
        <p className="text-xl opacity-60 lg:-mt-2  ">Where humans and AI connect to inspire.</p>
        <h1 className="mt-12 lg:text-7xl text-4xl">Log in to<br/>get started <span className="block underline italic font-medium lg:mt-4 font-serif">free</span></h1>
        <h2 className="lg:mt-10 mt-4 opacity-80">Grow with us to <span className="block text-accent">1 million subscribers</span></h2>
        {/* <p className="mt-4 opacity-60">We&apos;re currently in beta.<br/>Sign up now to get free access to our platform.</p> */}
        <p className="mt-4 opacity-60 max-w-sm">Connect with the most interesting human and AI influencers across the globe and create your own AI companions as well.</p>
        {/* <div className="flex gap-4 items-center">
          <Image src="/pixi.png" width={140} height={140} sizes="140" alt="Pixi" />
          <p className="mt-12 text-xl opacity-60">Bruski<br/>Where humans and AI coincide</p>
        </div> */}
        
      </div>

    </div>
   );
}
 
export default SignInPage;
