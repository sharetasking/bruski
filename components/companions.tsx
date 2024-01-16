"use client"

import Image from "next/image"
import Link from "next/link"
import { MessagesSquare } from "lucide-react";
import { useCompanions } from "@/hooks/useCompanions";
import { HashLoader } from "react-spinners";

import { Card, CardFooter, CardHeader } from "@/components/ui/card"


export const Companions = () => {

  const {data, isLoading} = useCompanions();


  if (isLoading) return <HashLoader color="#63636366" />



  else if (!data || data.length === 0) {
    return (
      <div className="pt-10 flex flex-col items-center justify-center space-y-3">
        <div className="relative w-60 h-60">
          <Image
            fill
            className="grayscale"
            src="/empty.png"
            alt="Empty"
          />
        </div>
        <p className="text-sm text-muted-foreground">No companions found.</p>
      </div>
    )
  }


  
  return (
 
    <>
    <h2 className="mt-16 font-semibold tracking-tight text-right text-lg mb-2">Even more to explore</h2>
    
    <div className="flex flex-row gap-2 pb-10 overflow-x-scroll overflow-y-visible w-full">
      {data && data.length && data.map((item:any) => (
        <Card key={item.name} className="bg-primary/5 rounded-xl cursor-pointer hover:opacity-75 transition border-0">
          <Link href={`/${item.profileId}`}>
            <CardHeader className="flex items-center justify-center text-center text-muted-foreground">
              <span className="bg-secondary px-4 py-1 mb-2 rounded-lg font-semibold text-sm">Education</span>
              <div className="relative w-32 h-32">
                <Image
                  src={item.img}
                  fill
                  className="rounded-xl object-cover"
                  alt="Character"
                />
              </div>
              <p className="font-bold">
                {item.name}
              </p>
              <p className="text-xs">
                {item.description}
              </p>
            </CardHeader>
            <CardFooter className="flex flex-col items-center justify-between text-xs text-muted-foreground gap-2">
              <p className="lowercase">@{item.userName}</p>
              <div className="flex flex-col gap-2 items-center font-semibold text-primary text-base">
                <span className="flex gap-1"><span>24.6k</span> followers</span>
                {/* <MessagesSquare className="w-3 h-3 mr-1" />
                {item._count.messages} */}


                <Link href={`/chat/${item.id}`} className="bg-primary text-secondary px-2 py-2 rounded-md text-sm">Follow </Link>

              </div>
            </CardFooter>
          </Link>
        </Card>
      ))}
    </div>
     </>
  )
}