import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prismadb"

export async function GET(req: NextRequest)
{

  const take = +(req.nextUrl.searchParams.get("take") ?? 4);

  //get all pixis

  const pixis = await prisma.profile.findMany({
    take,
    include: {
      companion: true
    },
    where: {
      img: {
        isSet: true
      },
      companionId: {
        isSet: true
      },
    },
  });
  return new NextResponse(JSON.stringify(pixis), {status: 200});
  
}