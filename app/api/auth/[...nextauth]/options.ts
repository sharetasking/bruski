import { authenticate } from "@/services/authService"
import NextAuth from "next-auth"
import type { AuthOptions, NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import prisma from "@/lib/prismadb"
import { createDecipheriv } from "crypto"
import { PrismaClient, Profile, Companion, UserSubscription } from "@prisma/client"
import { BruskiCompanion } from "@/app/(root)/(routes)/pixi/client"

// Define the shape of your user object
type UserWithRelations = {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  img: string;
  email: string;
  profiles: Profile[]; // replace 'any' with your Profile type
  companions: BruskiCompanion[]; // replace 'any' with your Companion type
  subscriptions: UserSubscription[]; // replace 'any' with your Subscription type
  createdAt: Date;
  updatedAt: Date;
  // ...other fields
};



// Include this type in your session.user object
declare module "next-auth" {
  interface Session {
    user: UserWithRelations;
  }
}


export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'email',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize (credentials, req) {
        try {
          if (typeof credentials !== "undefined") {
            const res = await authenticate(credentials.email, credentials.password)
            if (typeof res !== "undefined" && res !== null) {
              console.log("Res: ", res)
              return { ...res.user, apiToken: res.token }
            } else {
              console.log("Res: ", res)
              return null
            }
          } else {
            console.log("Credentials: ", credentials) 
            return null
          }
        } catch (error) {
          console.log(error)
          return null
        }
        
      }
    }),
    

    GoogleProvider({
      profile(profile) {
        console.log("Profile Google: ", profile);
        let userRole = "Google User";

        if(profile?.email == "ceo@sharetasking.com") 
        {
          userRole = "admin";
        }
        return {
          ...profile,
          id: profile.sub,
          role: userRole
        }
      },

      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: { strategy: "jwt" },


  callbacks: {


  //   argument #0:

  //   'JWT: '
  //  token:
  
  //   {
  //     name: undefined,
  //     email: 'seanmac90@gmail.com',
  //     picture: undefined,
  //     sub: '1'
  //   }
  //  user:
  
  //   {
  //     id: 1,
  //     email: 'seanmac90@gmail.com',
  //     password: '$2b$10$IS0EnA9T1VO2/TBEbkAf1OAp1c8JpnRy6EKx5Loen6Z4F0CQu.Lm6',
  //     apiToken: 
  //       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoic2Vhbm1hYzkwQGdtYWlsLmNvbSIsImlhdCI6MTcwNjEyMTc5NCwiZXhwIjoxNzA2MjA4MTk0fQ.yLcBhpqj35HFEy1TW6EwKKRCvMiteT2AUG0ItQucAt4'
  //   }
  //  account:
  
  //   { providerAccountId: 1, type: 'credentials', provider: 'credentials' }


    async jwt({ token, user, account }) {

      try {
        
      console.log("JWT: ", token, user, account)
      // When signing in for the first time, the user object is not empty
      if (user) {
        token.id = user.id;
        token.email = user.email;
        // token.role = user.role;
        // Add more user properties to the token as needed
      }
      
      // If the user is signing in with an account like Google, you might want to store the provider as well
      if (account) {
        token.provider = account.provider;
      }









        //create a prisma user if not exists
        const dbUser = await prisma?.user.findFirst({
          where: {
            email: token.email,
          },
        });


        // 
        if(!dbUser && account?.provider == "google")
        {
          //CREATE USER
          // Split names if there is a space
          let nameArray = [];
          token.name?.includes(" ")
            nameArray = token.name?.split(" ") ?? [];

            console.log("Name Array: ", nameArray)








            // GENERATE A USERNAME
            let tempUsername = token.name ?? "user"
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



            try {
             
                  let user = await prisma?.user.create({
                    data: {
                      email: token.email,
                      img: token.picture,
                      first_name: nameArray?.[0],
                      last_name: nameArray?.[1],
                      username: username,
                      accountType: "INDIVIDUAL_USER",
                      loginProvider: "GOOGLE"

                    },
                  }); 

                  // if created, create a profile
                  if(user)
                  {
                      
                    // CREATE A NEW PROFILE OBJECT
                    const newProfile = {
                      userId: user.id,
                      img: token.picture,
                      display_name: token.name ?? "",
                      username: username ?? "",
                      url: username ?? "",
                      createdAt: new Date(),
                      updatedAt: new Date(),
                    }

                    // INSERT INTO DB
                    const createdProfile = await prisma.profile.create({
                      data: newProfile,
                    });
                  }
                  else{
                    if(token.picture)
                      await prisma?.user.update({
                        where: {
                          email: token.email ?? "",
                        },
                        data: {
                          img: token.picture,
                        },
                      });
                  }
            }
            catch (error) {
              console.log("Error: ", error)
            }
        }
        else if(dbUser && account?.provider == "google")
        {
          //UPDATE USER
          if(token.picture)
            await prisma?.user.update({
              where: {
                email: token.email ?? "",
              },
              data: {
                img: token.picture,
              },
            });
        }
        else{
          //move on
        }



  
      console.log(token)
      return token;

    } catch (error) {
     console.log("Error: ", error)     
     return token;
    }
  },
  // Modify the session callback
  session: async ({ session, token }) => {
      console.log("Session: ", session, token)
      if (session?.user) {
        // The session callback is invoked whenever the session is checked.
        // Here you should return the session object that will be available on the client side.
        // You can read the token that was previously encoded in the jwt callback
        session.user.id =  "";
        session.user.email = token.email ?? "";
        // session.user.role = token.role;



        //add additional properties to the session
        const user = await prisma?.user.findFirst({
          where: {
            email: token.email,
          },
          include: {
            profiles: true,
            companions: {
              include: {
                profiles: true,
                category: true,
                owner: true,
              }
            },
            subscriptions: true,

          }
        }) as UserWithRelations; 

      session.user = { ...session.user, ...user };

      return session;
      }
      return session;
    },
  },
  pages: { signIn: "/login"}

}

const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }




// import type { NextAuthOptions } from "next-auth";
// import type { NextAuthConfig } from 'next-auth';
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcrypt";


// export const authConfig: NextAuthOptions = {

//   // Can delete to use the default next-auth login pages
//   pages: {
//     signIn: '/login',
//   },
//   // providers: [
//   //   CredentialsProvider({
//   //     name: 'Sign In',
//   //     credentials: {
//   //       // username: { label: "Username", type: "text", placeholder: "jsmith" },
//   //       email: { label: "Email", type: "email", placeholder: "example@example.com" },
//   //       password: {  label: "Password", type: "password", placeholder: "placeholder" }
//   //     },
//   //     async authorize (credentials) {

//   //       try {
          


//   //           if (!credentials || !credentials.email || !credentials.password) {
//   //             return null
//   //           }
    
//   //           const dbUser = await prisma?.user.findFirst({
//   //             where: {
//   //               email: credentials.email,
//   //             },
//   //           });
    
    
//   //           if(dbUser)
//   //           {


//   //             const match = await bcrypt.compare(credentials.password, dbUser?.password as string);

//   //             if(match) {
      
//   //               console.log("Logged in")
//   //               const {password, createdAt, id, ...dbUserWithoutPassword} = dbUser;

                
//   //               const formattedUser = {...dbUserWithoutPassword, role: "Unverified Email"};

//   //               return formattedUser
      
//   //             }

              
//   //           }

            

            
//   //       } catch (error) {
//   //         console.log("Error: ", error);
//   //       }
        
//   //       return null;

      
//   //     }
      
//   //   }),
//   //   GoogleProvider({
//   //     profile(profile) {
//   //       console.log("Profile Google: ", profile);
//   //       let userRole = "Google User";

//   //       if(profile?.email == "ceo@sharetasking.com") 
//   //       {
//   //         userRole = "admin";
//   //       }
//   //       return {
//   //         ...profile,
//   //         id: profile.sub,
//   //         role: userRole
//   //       }
//   //     },

//   //     clientId: process.env.GOOGLE_CLIENT_ID as string,
//   //     clientSecret: process.env.GOOGLE_SECRET as string,
//   //   }),

//   // ],





//   // callbacks: {
//   //   async jwt({ token, user}) {
//   //     if(user) token.role = user.role;
//   //     return token;
//   //   },


//   //   async session({ session, token }) {
//   //     if(session?.user) session.user.role = token.role;
//   //     return session;
      
//   //   }
    
//   //   ,
//     callbacks: {
//       authorized({ auth, request: { nextUrl } }) {
//         const isLoggedIn = !!auth?.user;
//         const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
//         if (isOnDashboard) {
//           if (isLoggedIn) return true;
//           return false; // Redirect unauthenticated users to login page
//         } else if (isLoggedIn) {
//           return Response.redirect(new URL('/dashboard', nextUrl));
//         }
//         return true;
//       },
//     },
//     providers: [], // Add providers with an empty array for now
//   } satisfies NextAuthConfig;