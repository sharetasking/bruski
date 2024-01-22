//clerk user
import { auth, useUser } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";


const CompanionPage = async () => {

  const { userId } = auth();

  const companion = await prismadb.companion.findFirst({
   
  });
  // send to component
  return (
    <div className="w-full">
      <h1>Companion</h1>
      {JSON.stringify(companion)}
      <p>
        This is a companion page. It is not a route, but it is a page that is
        linked to from a route.
      </p>
    </div>
  );
}

export default CompanionPage;