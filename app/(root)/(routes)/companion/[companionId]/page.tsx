import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";

import { CompanionForm } from "@/components/companion-form";
import { getServerSession } from "next-auth";
import { authConfig } from "@/app/api/auth/[...nextauth]/options";

interface CompanionIdPageProps {
  params: {
    companionId: string;
  };
};

const CompanionIdPage = async ({
  params
}: CompanionIdPageProps) => {
  const session = await getServerSession(authConfig)
  const sessionUser = session?.user;

  let userId = sessionUser?.id;

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
    companion.username = companion?.profiles?.[0]?.display_name ?? "";

  const categories = await prismadb.category.findMany({
    take: 30,
  });

  return ( 
    <CompanionForm initialData={companion} categories={categories} />
  );
}
 
export default CompanionIdPage;
