// "use client";

// import * as z from "zod";
// import axios from "axios";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import { Wand2 } from "lucide-react";
// import { Category, Companion, Profile } from "@prisma/client";
// import useFollow from "@/hooks/useFollow";

// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { ImageUpload } from "@/components/image-upload";
// import { useToast } from "@/components/ui/use-toast";
// import { Separator } from "@/components/ui/separator";
// import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "@/components/ui/select";
// import { JsonObject } from "@prisma/client/runtime/library";
// import Avatar from "@/components/Avatar";
// import FollowButton from "@/components/FollowButton";



// interface ProfilePageProps {
//   profile: Profile;
//   user: JsonObject;
// };

// export const ProfilePage = ({
//   profile,
//   user
// }: ProfilePageProps) => {

//   const { toast } = useToast();
//   const router = useRouter();


//   // const {isFollowing, toggleFollow} = useFollow(params.profileId)



//   // const onSubmit = async (values: z.infer<typeof formSchema>) => {
//   //   try {
      
//   //   } catch (error) {
//   //     toast({
//   //       variant: "destructive",
//   //       description: "Something went wrong ",
//   //       duration: 3000,
//   //     });
//   //   }
//   // };

//   // console.log(profile, "profile")
//   return ( 
//       <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
//         <div className="relative w-24 h-24 border-4 rounded-full">
//         {/* AVATAR IMAGE */}
//         {JSON.stringify(profile)}
//         <Avatar img={profile?.img ?? ""} url="" size={12} hasBorder={false} />
//         </div>
//         <div className="flex items-start justify-between">
//           <div>

//           <h2 className="font-semibold text-red-400">{profile?.display_name}</h2>
//           <p>{profile?.bio}</p>
//           <p>{profile?.createdAt?.toString()}</p>
//           <div className="flex gap-2 text-sm text-primary/70 mt-4">
//             <p><span className="font-semibold">{profile?.postsMade}</span> posts</p>
//             <p><span className="font-semibold">{profile?.num_followers}</span> followers</p>
//             <p><span className="font-semibold">{profile?.num_following}</span> following</p>
//           </div>

//           </div>
    
//           <div>
//             {/* |{JSON.stringify(profile)}| */}
//           <FollowButton settings={{profileId: profile?.id, follows:!!profile?.listOfProfilesFollowingViewedProfile?.length, followersCount:profile?.numFollowers}} /> 
//             {/* {
//               false ? (<button className="btn">Follow</button>) : (<button className="btn">Unfollow</button>)
//             } */}
            


//           </div>
//         </div>
//         <div>
//         <div>
//           <h2 className="mt-8 mb-2">
//             Pinned
//           </h2>
//           <div className="flex gap-2">
//             <div className="bg-primary/5 rounded-md w-48 h-60"></div>
//             <div className="bg-primary/5 rounded-md w-48 h-60"></div>
//             <div className="bg-primary/5 rounded-md w-48 h-60"></div>
//             <div className="bg-primary/5 rounded-md w-48 h-60"></div>
//           </div>
//         </div>

//         <div>
//           <h2 className="mt-8 mb-2">
//             Posts
//           </h2>
//           <div className="flex flex-col gap-2">
//             <div className="bg-primary/5 rounded-md h-60"></div>
//             <div className="bg-primary/5 rounded-md h-60"></div>
//             <div className="bg-primary/5 rounded-md h-60"></div>
//             <div className="bg-primary/5 rounded-md h-60"></div>
//           </div>
//         </div>
//         {/* |{JSON.stringify(profile)}| */}
//       </div>

//     </div>
//    );
// };
