import { NextResponse } from "next/server"
import prismadb from "@/lib/prismadb"

export async function GET() {
  
  

  const data = await prismadb.companion.findMany({
  });


  return new NextResponse(JSON.stringify(data), { status: 200 })
}