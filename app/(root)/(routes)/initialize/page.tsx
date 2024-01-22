import { currentUser } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import InitializeComponentPage from "@/components/Initialize";
import { NextResponse } from "next/server";
import { useDebounce } from "@/hooks/use-debounce";
import { BruskiUser } from "@/hooks/useBruskiUser";
import { redirect } from "next/navigation";
import axios from "axios";
import prisma from "@/lib/prismadb";
import { AccountType } from "@prisma/client";

const InitPage = async () => {

  // GET CLERK USER
  const user = await currentUser();

  // DEFINE USER TO BE SENT BACK TO COMPONENT
  let bruskiUser;

  // IF NOT LOGGED IN, REDIRECT TO LANDING PAGE
  if (!user || !user.id) {
    return redirect("/")
  }
  
  // EXTRACT VALUES FROM CLERK USER
  const { id, imageUrl, firstName, lastName, emailAddresses, phoneNumbers } = user;

  //check if user exists in db
  const localUser = await prisma.user.findFirst({
    where: {
      clerkUserId: id
    }
  });

  // IF USER EXISTS, UPDATE ANY NEW VALUES FROM CLERK
  if(localUser)
  {
    

    try
    {
                  // GET THE LOCAL USER
                  // const localUser = await prismadb.user.findUnique({
                  //   where: { clerkUserId: id },
                  // });

      // UPDATE NAME AND IMAGE
      const newUser = {
        img: imageUrl,
        first_name: firstName,
        last_name: lastName,
        updatedAt: new Date(),
      };

      console.log(newUser)

      // UPSERT THE USER
      bruskiUser = await prismadb.user.update({
        where: { clerkUserId: id },
        data: newUser,
      });
  

      // IF INSERT FAILED, RETURN TO LOGIN
      if(!bruskiUser) 
        return redirect("/");

        console.log('updated user')



      // DOUBLE CHECK THAT PROFILE IS CREATED
      const profile = await prisma.profile.findFirst({
        where: {
          userId: bruskiUser.id
        }
      });

      // IF PROFILE DOES NOT EXIST, CREATE A NEW PROFILE
      if(!profile)
      {
        // CREATE A NEW PROFILE OBJECT
        const newProfile = {
          userId: bruskiUser.id,
          img: imageUrl,
          display_name: firstName + " " + lastName,
          username: bruskiUser.username ?? "",
          url: bruskiUser.username ?? "",
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        // INSERT INTO DB
        const createdProfile = await prisma.profile.create({
          data: newProfile,
        });

        // IF INSERT FAILED, RETURN TO LOGIN
        if(!createdProfile)
          return redirect("/")
      }

      console.log(bruskiUser)
  
  
  
    }
    catch(err)
    {
      console.log(err, user);
    }
  
  
    // if(!updatedUser)
    //   return;





  








  }

  // IF USER DOES NOT EXIST, CREATE A NEW USER
  else {


console.log('creating new user')








  // GENERATE A USERNAME
  let tempUsername = (firstName ?? "") + (lastName ?? "");
  const initial_username = tempUsername.replace(/\s/g, '').toLowerCase();

  // CHECK IF AVAILABLE
  let usernameAvailable = false;
  let usernameAvailableCount = 0;
  let username;

  // LOOP UNTIL A USERNAME ATTEMPT IS AVAILABLE
  while(!usernameAvailable)
  {
    const profile = await prisma.profile.findFirst({
      where: {
        username
      }
    });

    if(!profile)
      usernameAvailable = true;
    else
    {
      usernameAvailableCount++;
      username = initial_username + usernameAvailableCount;
    }
  }


  // CREATE A NEW USER OBJECT
  const newUser = { // Update the type of newUser
    clerkUserId:id,
    img:imageUrl,
    first_name: firstName,
    last_name: lastName,
    username,
    accountType: AccountType.INDIVIDUAL_USER,
    email: emailAddresses[0].emailAddress,
    phone: phoneNumbers[0].phoneNumber,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  let updatedUser;
  try{

  //IF NOT THE SAAS ADMIN, create user
  if(emailAddresses[0].emailAddress !== process.env.ADMIN_EMAIL)
  {


    // INSERT INTO DB
    updatedUser = await prisma.user.create({
      data: newUser,
    });

    // IF INSERT FAILED, RETURN TO LOGIN
    if(!updatedUser)
      return redirect("/")

  }

  //IF THE SAAS ADMIN (user already created), update user
  else{
      
      // UPDATE THE USER
      updatedUser = await prisma.user.update({
        where: { email: emailAddresses[0].emailAddress },
        data: newUser,
      });
  
      // IF INSERT FAILED, RETURN TO LOGIN
      if(!updatedUser)
        return redirect("/")


  }

}catch(e){console.log(e)}
  




if(updatedUser?.id)
{
  

  // CREATE A NEW PROFILE OBJECT
  const newProfile = {
    userId: updatedUser.id,
    img: imageUrl,
    display_name: firstName + " " + lastName,
    url: username!,
    username: username!,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // INSERT INTO DB
  const createdProfile = await prisma.profile.create({
    data: newProfile,
  });

  // IF INSERT FAILED, RETURN TO LOGIN
  if(!createdProfile)
    return redirect("/")


}








  }


  // GET THE NEW USER WITH THE PROFILE
  bruskiUser = await prismadb.user.findUnique({
    where: { clerkUserId: id },
    include: {
      profiles: true,
      companions: true,
    },
  });







  if(!bruskiUser)
    return redirect("/")

  
  return (
    <><InitializeComponentPage user={bruskiUser ?? null} /></>
  );
}

export default InitPage;