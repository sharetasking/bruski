
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";


import { CompanionForm } from "@/components/companion-form";
import { getServerSession } from "next-auth";
import { authConfig } from "@/app/api/auth/[...nextauth]/options";

interface CompanionIdPageProps {
  params: {
    pixiId: string;
  };
};


const PixiEditPage = async ({ params }: CompanionIdPageProps) => {

  const session = await getServerSession(authConfig)
  const sessionUser = session?.user;

  const { pixiId } = params;

  if(!sessionUser || !sessionUser.email)
    return redirect("/")

  const user = await prismadb.user.findUnique({
    where: {
      email: sessionUser.email ?? ""
    }
  })

  const userId = user?.id;
  

  // if (!userId) {
  //   return redirectToSignIn();
  // }

  // const validSubscription = await checkSubscription();

  // if (!validSubscription) {
  //   return redirect("/home");
  // }
  
  let companion = null;
  
  try {
      
      if(params.pixiId != "new")
      companion = await prismadb.companion.findUnique({
      where: {
        id: pixiId,
        ownerId: userId ?? "",
      },
      include: {
        profiles: true,
      }

      }); 


      // update the name
      if(companion)
      {

        companion.username = companion?.profiles?.[0]?.display_name ?? "";

        
  // companion.name = companion?.name ?? companion?.username ?? "";
      }
  } catch (error) {
    console.log(error)
  }


  const categories = await prismadb.category.findMany({take:30});






  return ( <div className="fadeInUp p-4 max-w-7xl mt-8">
    <h1>Create Your Pixi</h1>
    {<CompanionForm initialData={companion} categories={categories} />}
  </div> );
}



 
 
export default PixiEditPage;