// services/authService.ts

import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function authenticate(email: string, password: string): Promise<{ user: User; token: string } | null> {
  console.log(email, password)
  // Find the user by email
  // const user = await prisma.user.findUnique({
  //   where: {
  //     email: email,
  //   },
  // });

  // TODO: Fix
  let  user
  try {
    //get user with that email
    user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  console.log(user)
  } catch (error) {
    console.log(error)
  }

  console.log("User: ", user)
  // If user is found and the password is correct
  if (user && await bcrypt.compare(password, user.password ?? "")) {
    console.log("User found and password correct")

    if(!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set in environment variables")

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email }, // Payload to be included in the JWT
      process.env.JWT_SECRET ?? "", // The secret key for signing the JWT. Ensure this is set in your environment variables.
      { expiresIn: '24h' }   // Token expiration time
    );

    return { user, token };
  } else {
    // User not found or password incorrect
    return null; // Or throw an authentication error as per your error handling strategy
  }
}

export { authenticate };
