import { getProviders, signIn, getSession, getCsrfToken } from "next-auth/react";
// import { Button } from "shadcn-ui-react";
import Button from "@/components/Button";
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
    <div className="flex flex-col gap-4 py-8 my-8 max-w-sm bg-secondary rounded-xl px-4">
      <h1 className="text-3xl font-bold text-center">Log In /Sign Up</h1>
      <div> </div>
      {Object.values(providers).map((provider, index) => {
        return (
          // <div key={index}>{JSON.stringify(provider)}</div>
          <Button
          onClick={() => signIn(provider.id)}
          key={index}
          secondary={secondary[index % 2 === 0 ? 0 : 1]}
          outline={outline[index % 2 === 0 ? 0 : 1]}
          label={"Sign in with " + (provider.name == "Credentials" ? "Email" : provider.name)}
        />
        );
      })}
    </div>
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