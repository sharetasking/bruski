// import { NextApiRequest, NextApiResponse } from 'next';

// import prisma from '@/lib/prismadb';

// // import { authOptions } from '@/pages/api/auth/[...nextauth]';
// // import { getServerSession } from 'next-auth';

// const serverAuth = async () => {
//   const session = await getServerSession(req, res, authOptions);

//   if (!session?.user?.email) {
//     throw new Error('Not signed in');
//   } 

//   const currentUser = await prisma.user.findUnique({
//     where: {
//       email: session.user.email,
//     }
//   });

//   if (!currentUser) {
//     throw new Error('Not signed in');
//   }

//   return { currentUser };
// };

// export default serverAuth;