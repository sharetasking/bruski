import { getProviders, signIn, getSession, getCsrfToken } from "next-auth/react";
import { BsGoogle } from "react-icons/bs";
import { Button } from "./ui/button";
// import Button from "@/components/Button";
type Provider = {
  id: string;
  name: string;
  type: string;
  // ... other properties
};

function signin({ providers }: { providers: Provider[]}) {
  const secondary = [ true, false]
  const outline = [ false, false,]
  return (
    <>
      {Object.values(providers).map((provider, index) => {
        return (
          <>
         { provider.name == "Google" && 
          <Button key={index}
              onClick={() => signIn(provider.id)}
              className="bg-red-500 gap-4 hover:bg-red-600 text-white font-bold py-8 px-8 rounded inline-flex items-center mb-4">
            { provider.name == "Google" && <BsGoogle /> }
            Continue with Google
          </Button>
          }
           </>
        );
      })}
      </>
  );
}

export default signin;

export async function getServerSideProps(context:any) {
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: "/" },
    };
  }

  return {
    props: {
      providers: await getProviders(),
      csrfToken: await getCsrfToken(context),
    },
  };
}