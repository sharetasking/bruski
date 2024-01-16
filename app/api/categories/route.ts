import { NextResponse } from "next/server"
import prismadb from "@/lib/prismadb"

export async function GET() {
  
  

  const data = await prismadb.category.findMany({
    include: {
      _count: {
        select: {
          companions: true,
        },
      },
    },
  });


  return new NextResponse(JSON.stringify(data), { status: 200 })
}