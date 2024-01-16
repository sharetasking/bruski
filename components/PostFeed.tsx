"use client"
// import { Post as PostType } from "@prisma/client";
// import { useUser } from "@clerk/nextjs";
// import { useState, FormEvent } from "react";
// import DateFormatter from "./date-formatter";
// import Link from "next/link";
// import { AiFillMessage, AiFillDislike, AiFillLike, AiFillSave, AiFillUserAdd } from "react-icons/ai";
// import { AiOutlineMessage, AiOutlineDislike, AiOutlineLike, AiOutlineSave, AiOutlineUserAdd } from "react-icons/ai";
import Image from "next/image"
import { usePosts } from "@/hooks/usePosts";
import { HashLoader } from "react-spinners";
// import { set } from "zod";
import PostItem from "./posts/PostItem";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { BruskiUser } from "@/hooks/useBruskiUser";
import { Post } from "@prisma/client";

interface PostFeedProps {
  user?: BruskiUser|null,
  profileId?: string
}

export const PostFeed:React.FC<PostFeedProps> = ({user, profileId}) => {

 
  


  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  

  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const num_per_page = 10;

  // let isLoading = false;

  useEffect(() => {
    async function getPosts() {
      setLoading(true);
      const url = profileId ? `/api/posts?page=${page}&size=${num_per_page}&profileId=${profileId}` : `/api/posts?page=${page}&size=${num_per_page}`;
      
      
      if(page == 0) return;

      try
      {
        const response = await axios.get(url);
        setPosts((prev) => [...prev, ...response.data ])
        setLoading(false);
      }
      catch (error) {
        setLoading(false);
        console.log(error)
      }
      
    }

    getPosts();
    
  }, [page])


  const handleScroll = () => {
    
    if(window.innerHeight + document.documentElement.scrollTop +1 >= document.documentElement.scrollHeight)
    {
      setLoading(true);
      setPage(prev => {
        return prev + 1
      });
      
    }
  }

  useEffect(()=>{
    window.addEventListener("scroll", handleScroll);
    setPage(1) //do it this way so it doesn't load twice initially
    return () => window.removeEventListener("scroll", handleScroll);
  }, [])




  
  
//   ?.toString() ?? user?.profiles?.[0]?.id?.toString();
//   function timeAgo(date) {
//     const currentDate = new Date();
//     const targetDate = new Date(date);

//     let years = currentDate.getFullYear() - targetDate.getFullYear();
//     let months = currentDate.getMonth() - targetDate.getMonth();

//     // Adjust for year boundary
//     if (currentDate < new Date(targetDate.getFullYear() + years, targetDate.getMonth(), targetDate.getDate())) {
//         years--;
//     }

//     // Adjust for month boundary
//     if (months < 0 && years > 0) {
//         years--;
//         months += 12; // Add 12 months as we moved one year back
//     }

//     if (years > 0) return years === 1 ? '1 year ago' : `${years} years ago`;

//     if (months > 0) return months === 1 ? '1 month ago' : `${months} months ago`;

//     let timeDifference = currentDate - targetDate; // Remaining difference in milliseconds

//     const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
//     if (days > 0) return days === 1 ? '1 day ago' : `${days} days ago`;

//     const hours = Math.floor(timeDifference / (1000 * 60 * 60));
//     if (hours > 0) return hours === 1 ? '1 hr ago' : `${hours} hrs ago`;

//     const minutes = Math.floor(timeDifference / (1000 * 60));
//     if (minutes > 0) return minutes === 1 ? '1 min ago' : `${minutes} mins ago`;

//     const seconds = Math.floor(timeDifference / 1000);
//     return seconds === 1 ? '1 sec ago' : `${seconds} secs ago`;
// }




    return(
      <>
      {/* SHOW POSTS IF AVAILABLE */}
      {posts && posts.map((post: Record<string,any>, index) => (
          
          <div key={post.id} className="gap-2 flex break-words break-all max-w-xl grow w-full 
          subpixel-antialiased text-[16px] ">
            
              <PostItem
                data={post}
                user={user ?? null}
                />


                  {/* Render the <hr> if it's not the last post */}
                  {index < posts.length - 1 && <hr className="mt-4 text-primary bg-primary border-primary"/>}
            </div>   

          )
        )
      }
      <div className="h-24 flex items-center justify-center">{ !loading && <HashLoader color="#63636366" />}</div>
      {/* SHOW EMPTY STATE */}
      {
        (!posts || !posts.length) && !loading &&

        <div className="pt-10 flex flex-col items-center justify-center space-y-3">
          <div className="relative w-60 h-60">
                <Image
                  fill
                  sizes="60"
                  className="grayscale"
                  src="/empty.png"
                  alt="Empty"
                />
              </div>
              <p className="text-sm text-muted-foreground">Let&apos;s brew up some convo!</p>
            </div>


       
      }

      </>
    );


  
    

}




  // if (data.length === 0) {
  //   return (
  //     <div className="pt-10 flex flex-col items-center justify-center space-y-3">
  //       <div className="relative w-60 h-60">
  //         <Image
  //           fill
  //           className="grayscale"
  //           src="/empty.png"
  //           alt="Empty"
  //         />
  //       </div>
  //       <p className="text-sm text-muted-foreground">Let&apos;s brew up some convo!</p>
  //     </div>
  //   )
  // }
  // return (
  //   <>
  //   {
  //   data.map((item, index) => (
  //     <div key={item.id} className="w-[600px]">
  //       <div>




  //         <div className="container mx-auto px-4 py-8 items-center flex justify-center">
  //             <div className="overflow-hidden rounded-md grow">
  //               <div className="py-4">
  //                 <div className="flex items-start">
  //                   <div className="flex flex-col items-center mr-4 gap-4">
  //                       <Link href={item.userId}>
  //                         <div className="w-12 h-12 relative shrink-0 grow-0 rounded-full">
  //                           { item.user.img && <Image fill src={item.user.img} alt="User avatar" className="w-full h-full bg-primary/50 rounded-full flex items-center shrink-0 grow-0 justify-center text-primary/80 text-2xl font-bold"/>}
  //                           { !item.user.img && <div className="w-full h-full bg-primary/50 rounded-full flex items-center shrink-0 grow-0 justify-center text-primary/80 text-2xl font-bold">{item.userId[0].toUpperCase()}</div> }

  //                         </div>
  //                       </Link>
  //                     <button className="text-primary/30 hover:text-primary/50 active:text-primary/50 flex flex-col items-center group">
  //                       <AiOutlineUserAdd size={24} className="group-hover:text-primary group-active:text-primary/50 inline-block" />
  //                         {/* <AiFillUserAdd size={24} className="group-hover:inline-block hidden" /> */}
  //                         {item.likedIds?.length}

                      

  //                         </button>
  //                   </div>
  //                   <div className="subpixel-antialiased">
  //                     <div className="text-xl mb-2 line-clamp-1 flex justify-between items-center">

  //                       <Link href={item.userId}>
  //                         <span className="text-primary text-lg font-semibold hover:underline">{item.user.first_name} {item.user.last_name}</span>
  //                         &nbsp;
  //                         <span className="text-primary/40 text-sm">@{item.userId}</span>
  //                       </Link>
  //                       <div className="text-xs text-primary/40"> {timeAgo(item.createdAt)}</div>
                        
  //                     </div>
  //                     <div className=" break-words">


  //                       {/* TODO: REadd   <div className="text-primary/60">Category: {item.categoryId}</div> */}
                        



  //               <p className="text-primary/90 font-normal  mt-8 my-1">

  //               <div className="whitespace-pre-wrap inset-x-0 break-words text-primary/90 pr-8 w-[500px] subpixel-antialiased">
                  
  //               {item.body}
  //                 </div>

  //               </p>



  //             <div className="flex justify-start gap-4 items-center mt-8">
                
  //               {/* <div className="h-10 bg-black/10 rounded-full">Repost</div> */}
  //               <button className="text-primary/30 hover:text-primary/50 active:text-primary/90 flex gap-1 items-center group">
  //                 <AiOutlineMessage size={24} className="group-hover:hidden inline-block" />
  //                 <AiFillMessage size={24} className="group-hover:inline-block hidden" />
  //                  0</button>
  //               <button className="text-primary/30 hover:text-primary/50 active:text-primary/90 flex gap-1 items-center group">
  //                 <AiOutlineDislike size={24} className="group-hover:hidden inline-block" />
  //                 <AiFillDislike size={24} className="group-hover:inline-block hidden" />0</button>
  //               <button className="text-primary/30 hover:text-primary/50 active:text-primary/90 flex gap-1 items-center group">
  //                 <AiOutlineLike size={24} className="group-hover:hidden inline-block" />
  //                 <AiFillLike size={24} className="group-hover:inline-block hidden" />{item.likedIds?.length}</button>
  //             </div>





  //                     </div>

  //                   </div>
  //                   <div className="dropdown ml-auto group relative">
  //                   {/* <div className="flex gap-2"> */}
                    
  //                   {/* <div className="h-10 bg-black/10 rounded-full">Bookmark</div> */}
                    
  //                     {/* <button className="text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center">
  //                       <span className="rotate-90 font-bold text-xl">...</span>
  //                     </button>
  //                   </div>
  //                   <div className="dropdown-menu absolute bg-gray-300 shadow z-50 -right-20 w-[100px] hidden group-hover:block">
  //                     <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Report</a>
  //                     <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Block</a>
  //                     <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Not interested in this topic</a>
  //                   </div> */}
  //                 </div>
  //               </div>
  //             </div>
  //             {/* <div className="px-6 pt-4 pb-2"> */}
  //               {/* <input disabled className="shadow-none border-none hover:border-4 hover-border-primary/5 active:border-none active:bg-primary/10 cursor-pointer active:ring-offset-0 py-4 bg-transparent hover:bg-primary/5 ring-offset-2  appearance-none border rounded-md w-full px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Comment..." /> */}
  //               {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2">Reply</button> */}
  //             {/* </div> */}
  //             {/* <div className="px-6 pt-4 pb-2 flex justify-between items-center">
  //               <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">Like</span>
  //               <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">Dislike</span>
  //               <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">Repost</span>


  //               <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
  //               Comment
  //               </span>

               
  //               <div className="flex items-center">
  //                 <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">14</span>
  //                 <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">2</span>
  //               </div>
  //             </div> */}


  //             </div>
  //           </div>





            
  //       </div>
  //     </div>
  //   ))
  // }
  //           <div>
              




  //           </div>

  //           </>
  // );
// };


















   
// <div>








// <div className="w-full justify-center items-center flex flex-col gap-2">
//   { data.length}
//   <div className="max-w-2xl grow flex flex-col">
// |{data.length}|
//   {data.map((item, index) => (

// // wrap start
// <div key={item.id}>











// <div>
//       <div className="w-full">
//         <div>{item.body}</div>
//         {/* Render the <hr> if it's not the last post */}
//         {index < data.length - 1 && <hr />}
//       </div>














// // wrap end


//     ))}
//   </div>

// </div>

// </div>
// // end of component









// </div>




// "use client";

// import qs from "query-string";
// import { Category } from "@prisma/client"
// import { useRouter, useSearchParams } from "next/navigation";

// import { cn } from "@/lib/utils";

// interface PostsProps {
//   data: Category[]
// }

// export const Posts = ({
//   data
// }: PostsProps) => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const categoryId = searchParams.get("categoryId");

//   const onClick = (id: string | undefined) => {
//     const query = { categoryId: id };

//     const url = qs.stringifyUrl({
//       url: window.location.href,
//       query
//     }, { skipNull: true });

//     router.push(url);
//   };

//   return (
//     <div className="w-full overflow-x-auto gap-2 flex flex-wrap p-1">
//       <button
//         onClick={() => onClick(undefined)}
//         className={cn(`
//           flex 
//           items-center 
//           text-center 
//           text-xs 
//           md:text-sm 
//           px-12 
//           md:px-4 
//           py-12 
//           md:py-3 
//           rounded-md 
//           bg-primary/10 
//           hover:opacity-75 
//           transition
//         `,
//           !categoryId ? 'bg-primary/25' : 'bg-primary/10'
//         )}
//       >
//         Newest
//       </button>
//       {data.map((item) => (
//         <button
//           onClick={() => onClick(item.id)}
//           className={cn(`
//             flex 
//             items-center 
//             text-center 
//             text-xs 
//             md:text-sm 
//             px-2 
//             md:px-4 
//             py-2 
//             md:py-3 
//             rounded-md 
//             bg-primary/10 
//             hover:opacity-75 
//             transition
//           `,
//             item.id === categoryId ? 'bg-primary/25' : 'bg-primary/10'
//           )}
//           key={item.id}
//         >
//           {item.name}
//         </button>
//       ))}
//     </div>
//   )
// }