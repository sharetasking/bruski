import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "../auth/[...nextauth]/options";

export async function GET(req: NextRequest)
{
  // get session user
  const session = await getServerSession(authConfig)
  const sessionUser = session?.user;

  const mode = req.nextUrl.searchParams.get("mode");
  const take = +(req.nextUrl.searchParams.get("take") ?? 7);
  // const targetProfileId = params.targetProfileId;
  // const initiatorProfileId = params.initiatorProfileId;
  // const page = params.page;

  if(mode=="following")
  {

    const following = await prismadb.profile.findMany({
      where: { listOfProfilesFollowingViewedProfile: { some: { followerId: sessionUser?.profiles?.[0]?.id } } },
      take: take,
    });
    return new NextResponse(JSON.stringify(following), { status: 200 })
  }
  else
  {
    return new NextResponse("testing", { status: 200 })
  }
  
}