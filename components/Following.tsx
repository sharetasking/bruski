import { useFollowers } from "../hooks/useFollowers";
import Link from 'next/link';
import { Profile } from "@prisma/client";

const Following = ({take}:{take:number}) => {

  // get 4 most recent followings
  const {data:followings, isLoading} = useFollowers({mode: 'following', take: take});

  return ( <>
  <h3 className="m-0 mt-16">Following</h3>
  <div>
    {followings && followings.map((target:Profile) => <p key={target.id} className="fadeInUp pl-4 "><Link href={"/"+target.url} className=" flex w-full items-center text-base rounded-md border border-transparent px-2 hover:underline text-muted-foreground">{target.display_name}</Link></p>)}
    {(!followings && !isLoading) && <p className="text-sm text-muted-foreground">Follow some accounts to fill this area</p>}
    {!followings && isLoading && Array.from({length: 4}, (_, i) => <p key={i} className="animate-pulse flex w-full items-center text-base rounded-md border border-transparent px-2 h-8 bg-primary/5"></p>)
    }
  </div>
</> );
}
 
export default Following;