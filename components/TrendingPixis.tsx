"use client"
import usePixis from "../hooks/usePixis";
import Image from "next/image";
import Link from "next/link";

const TrendingPixis = ({take=4}:{take?:number}) => {

const {data:pixis} = usePixis({type:"trending", take:take});


  return ( <div className="flex gap-2 overflow-x-scroll no-scrollbar ">
    {pixis && pixis.map((pixi:any) => (
      <Link href={pixi.url} key={pixi.id} className="bg-secondary relative shrink-0 rounded-xl w-24 h-36 flex items-end justify-center">
        
        <Image src={pixi.img} alt="pixi" fill sizes="60" className="z-10 rounded-xl"  />
        <h3 className="z-50 bg-gradient-to-b my-0 rounded-xl py-2 from-transparent to-primary text-primary-foreground p-4 text-sm w-full flex grow line-clamp-3 text-ellipsis">{pixi.display_name}</h3>
      </Link>
    )
    )}
  </div> );
}
 
export default TrendingPixis;