import { currentUser } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import InitializeComponentPage from "@/components/Initialize";
import { NextResponse } from "next/server";
import { useDebounce } from "@/hooks/use-debounce";
import { BruskiUser } from "@/hooks/useBruskiUser";

const InitPage = async () => {

  const user = await currentUser();
  const profiles = await prismadb.profile.findMany({});
  
  // collect these id, imageUrl, firstName, lastName, emailAddresses[0].emailAddress, phoneNumbers[0].phoneNumber from user object
  if(!user)
    return;

  const { id, imageUrl, firstName, lastName, emailAddresses, phoneNumbers } = user;

  // create a new user object to be sent to the backend
  const newUser = { // Update the type of newUser
    clerkUserId:id,
    img:imageUrl,
    first_name: firstName,
    last_name: lastName,
    username:id,
    email: emailAddresses[0].emailAddress,
    phone: phoneNumbers[0].phoneNumber,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // Check if the user exists and update or create accordingly
  let updatedUser;
  try
  {

    updatedUser = await prismadb.user.upsert({
      where: { clerkUserId: id },
      update: newUser,
      create: newUser,
    });

    if(!updatedUser) 
      return;





      let display_name = ""
      display_name += updatedUser ? updatedUser.first_name + " " + updatedUser.last_name : '';

      //find the corresponding profile
      const profile = await prismadb.profile.findFirst({
        where: { userId: updatedUser.id },
      });

      let updatedProfile;
      if(profile && profile.id){
        //update the profile
        updatedProfile = await prismadb.profile.update({
          where: { id: profile.id },
          data: { userId: updatedUser.id, img: updatedUser.img, display_name, url: updatedUser.username ?? '' },
        });
      }
      else{
        //create a profile
        updatedProfile = await prismadb.profile.create({
          data: { userId: updatedUser.id, img: updatedUser.img, display_name, url: updatedUser.username ?? '' },
          
        });
      }



      //fetch user again, but now with profile
      updatedUser = await prismadb.user.findUnique({
        where: { clerkUserId: id },
        include: {
          profiles: true,
        },
      });
      
  }
  catch(err)
  {
    console.log(err, user);
  }


  if(!updatedUser)
    return;
  
  return (
    <><InitializeComponentPage user={updatedUser} /></>
  );
}

export default InitPage;