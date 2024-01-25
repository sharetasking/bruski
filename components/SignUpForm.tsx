import { getProviders, signIn, getSession, getCsrfToken } from "next-auth/react";
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from "./ui/button";
import { Provider } from '@/app/(root)/(routes)/LandingPageComponent';

const SignUpForm = ({providers, switchLoginMode}:{providers:Provider[], switchLoginMode:(mode:string)=>void}) => {


  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      toast.success("Submitting")
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });
      
      console.log(response)

      if (!response.ok) {
        // if 422 error, show toast
        if(response.status == 422)
        {
          toast.error("Unsuccessful")
          return;
        }
        
        console.log(response)
        throw new Error('Error in registration');
      }

      // Handle success - maybe redirect or show a success message
      toast.success("Successfully created! Login below to continue")

      // //redirect to dashboard
      switchLoginMode("login")
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error("Error")
      // Handle errors - maybe show an error message to the user
    }
  };


  return ( <>
  


  <div className="w-full flex-1 mt-4">

<form onSubmit={handleSubmit} className="flex flex-col gap-4">


  {providers.map((provider, index) => {
        return (
          <>
         { provider.name == "Google" &&<> 
          <Button key={index}
              onClick={() => signIn(provider.id)}
              className=" gap-4 w-full bg-primary/10 hover:bg-primary/5 active:bg-primary/20 font-bold py-8 px-8 rounded inline-flex items-center"
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




{/* 
<button
                            className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline">
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
                            <span className="ml-4">
                                Sign Up with Google
                            </span>
                        </button> */}

                        </>
          }





           </>
        );
      })}



          

                  {/* <div className="fadeInUp delay-1000 opacity-0 mt-4 mx-auto self-center"><SignIn providers={providers} /></div> */}
                    <div className="mb-4 border-b text-center">
                        <div
                            className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                            Or sign up with e-mail
                        </div>
                    </div>

                    <div className="mx-auto">
                      <div className="flex gap-4 my-4">
                        <input
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                            type="text" placeholder="First Name" />
                            <input

              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
                                className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                type="text" placeholder="Last Name" />
                      </div>
                        
                        <input

            value={email}
            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                            type="email" placeholder="Email" />
                        <input

            value={password}
            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                            type="password" placeholder="Password" />
                        <button
                          type="submit"
         
                            className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                            <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                <circle cx="8.5" cy="7" r="4" />
                                <path d="M20 8v6M23 11h-6" />
                            </svg>
                            <span className="ml-3">
                                Get started free
                            </span>
                        </button>
                        {/* <p className="mt-6 text-xs text-gray-600 text-center">
                            I agree to abide by Bruski&apos;s<br/>
                            <a href="/terms" className="border-b border-gray-500 border-dotted">
                                Terms of Service
                            </a>
                            and its
                            <a href="/privacy" className="border-b border-gray-500 border-dotted">
                                Privacy Policy
                            </a>
                        </p> */}
                    </div>
</form>
                </div>



  </> );
}
 
export default SignUpForm;