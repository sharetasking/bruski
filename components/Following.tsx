import { useFollowers } from "../hooks/useFollowers";
import Link from 'next/link';
import { Profile } from "@prisma/client";

const Following = ({take}:{take:number}) => {

  // get 4 most recent followings
  const {data:followings, isLoading} = useFollowers({mode: 'following', take: take});

  return ( <>
  <h2>Following</h2>
  <div>
    {followings && followings.map((target:Profile) => <p key={target.id} className="pl-4"><Link href={"/"+target.url} className="hover:underline">{target.display_name}</Link></p>)}
  </div>
</> );
}
 
export default Following;