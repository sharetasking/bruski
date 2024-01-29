"use client"
import { getProviders, signIn, getSession, getCsrfToken } from "next-auth/react";
import { BsGoogle } from "react-icons/bs";
import { Button } from "./ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// import Button from "@/components/Button";
type Provider = {
  id: string;
  name: string;
  type: string;
  // ... other properties
};

export default function SignIn({ providers }: { providers: Provider[]|null}) {
  
  

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const router = useRouter();
  if(!providers) return null 


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Attempt to sign in using the credentials provider
      const result = await signIn('credentials', {
        redirect: false, // Do not redirect after sign-in, handle it here
        email,
        password,
      });

      if (result?.error) {
        // Handle errors here (e.g., user not found, wrong password)
        toast.error("Unsuccessful");
      } else {
        // On successful sign-in
        toast.success('Successfully logged in');
        // You can redirect or update the UI as needed
        window.location.href = '/home';
      }
    } catch (error) {
      // Handle errors in case the sign-in attempt failed
      toast.error('Login attempt failed');
      console.error('Login failed:', error);
    }
  };



  return (
    <>
      {Object.values(providers).map((provider, index) => (
        provider.name === "Google" && (
          <Button key={index}
          onClick={() => signIn(provider.id)}
          className=" gap-4 w-full bg-secondary hover:bg-primary/10 active:bg-primary/20 font-bold py-8 px-8 rounded inline-flex items-center"
          variant='secondary'>
        <div className="bg-white p-2 rounded-full">
                            <svg className="w-4" viewBox="0 0 533.5 544.3">
                                <path
                                    d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                                    fill="#4285f4" />
                                <path
                                    d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                                    fill="#34a853" />
                                <path
                                    d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                                    fill="#fbbc04" />
                                <path
                                    d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                                    fill="#ea4335" />
                            </svg>
                        </div>
        Continue with Google
      </Button>
        )
      ))}

      <div className="mb-4 border-b text-center">
        <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-primary-foreground transform translate-y-1/2">
          Or sign in with e-mail
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 my-4 text-primary">
      <div className="mx-auto w-full">
        <div className="flex flex-col gap-4 my-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-8 py-4 rounded-lg text-black/80 font-medium bg-white/9 e border border-gray-200 placeholder-gray-500 text-base focus:outline-none focus:border-gray-400 focus:bg-white"
            type="email"
            placeholder="Email"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-8 py-4 rounded-lg text-black/80 font-medium bg-white/9 e border border-gray-200 placeholder-gray-500 text-base focus:outline-none focus:border-gray-400 focus:bg-white"
            type="password"
            placeholder="Password"
          />
        </div>

        <button
          type="submit"
          className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
        >
          {/* SVG for button icon */}
          Log in
        </button>
      </div>
      </form>
    </>
  );
}
