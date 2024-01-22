
import { redirect } from "next/navigation";
import { auth, currentUser, redirectToSignIn } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";


import { CompanionForm } from "@/components/companion-form";

interface CompanionIdPageProps {
  params: {
    companionId: string;
  };
};


const PixiEditPage = async ({ params }: CompanionIdPageProps) => {

  const { pixiId: companionId } = params;

  const clerkUser = await currentUser();

  if(!clerkUser)
    return redirect("/")

  const user = await prismadb.user.findUnique({
    where: {
      clerkUserId: clerkUser?.id ?? "",
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
      
      if(params.companionId != "new")
      companion = await prismadb.companion.findUnique({
      where: {
        id: companionId,
        ownerId: userId ?? "",
      },
      include: {
        profiles: true,
      }

      }); 


      // update the name
      if(companion)
        companion.name = companion?.profiles?.[0]?.display_name ?? "";

        
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