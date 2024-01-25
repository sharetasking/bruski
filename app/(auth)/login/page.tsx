import SignIn from "@/components/SignIn";
import { SessionProvider, getProviders } from "next-auth/react";
import Link from "next/link";

import { redirect } from "next/navigation";

export type Provider = {
  id: string;
  name: string;
  type: string;
  // ... other properties
};


const LoginPage = async () => {

  // GET PROVIDERS FOR USE IN THE LOGIN COMPONENT
  const providersData = await getProviders();
  const providersArray: Provider[] | null = providersData
    ? Object.values(providersData).map((provider) => ({
        ...provider,
        // Cast each value to your custom Provider type, if necessary
        // Add any extra properties or transformations here
      }))
    : null;




  return ( <>
  
    { <div className="fadeInUp flex flex-col w-screen h-full items-center justify-center grow p-8 text-primary pt-8">
        <div className="max-w-sm flex flex-col grow w-full">
          <Link href="/" className="mb-8 hover:underline">&larr; Back to homepage</Link>
          <h2 className="text-4xl font-bold mb-4 mt-4">Sign in to Bruski</h2>
          <SignIn providers={providersArray ?? null} />

          <div className="md:flex hidden text-secondary text-xs items-center justify-start gap-4 mt-8">
            <Link href="/terms" className="hover:underline text-primary">Terms of Service</Link>
            &bull;
            <Link href="/privacy" className="hover:underline text-primary">Privacy Policy</Link>
          </div>
        </div>
      </div>
      }
  
  
  
  </> );
}
 
export default LoginPage;