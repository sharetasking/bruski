import { redirect } from "next/navigation";
import { auth, redirectToSignIn } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";

import { CompanionForm } from "@/components/companion-form";

interface CompanionIdPageProps {
  params: {
    companionId: string;
  };
};

const CompanionIdPage = async ({
  params
}: CompanionIdPageProps) => {
  const { userId } = auth();

  // if (!userId) {
  //   return redirectToSignIn();
  // }

  // const validSubscription = await checkSubscription();

  // if (!validSubscription) {
  //   return redirect("/home");
  // }

  let companion = null;
  
  if(params.companionId != "new")
    companion = await prismadb.companion.findUnique({
    where: {
      id: params.companionId,
      ownerId: userId ?? "",
    },
    include: {
      profiles: true,
    }
  });

  // update the name
  if(companion)
    companion.name = companion?.profiles?.[0]?.display_name ?? "";

  const categories = await prismadb.category.findMany({
    take: 30,
  });

  return ( 
    <CompanionForm initialData={companion} categories={categories} />
  );
}
 
export default CompanionIdPage;
