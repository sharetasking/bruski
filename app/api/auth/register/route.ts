// pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NextResponse, NextRequest } from 'next/server';
import { generateUniqueUsername } from '../../companion/route';

const prisma = new PrismaClient();
export function GET()
{
  return new NextResponse('Method allowed');
}
export async function POST(req: NextRequest, res: NextResponse) {

  const { firstName, lastName, email, password } = await req.json();

  //if not set
  if(!firstName || !lastName){
    return new NextResponse('First name and Last name are required', {status: 422});
  }
  if(!email){
    return new NextResponse('Email is required', {status: 422});
  }
  if(!password){
    return new NextResponse('Password is required', {status: 422});
  }
  // Validate the input
  if (!email || !email.includes('@') || !password || password.trim().length < 7) {
    return new NextResponse('Invalid input', {status: 422});
  }


  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse('User already exists', {status: 422});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
const username = await generateUniqueUsername(firstName+lastName);
let user;
  try{
    // Create User
    user = await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        username,
        accountType: 'INDIVIDUAL_USER',
        loginProvider: 'EMAIL_AND_PASSWORD',
        email,
        password: hashedPassword, // or just password, if you named it so in Prisma schema
        // other fields, if needed
      },
    });
  }catch(e){
    console.log('e', e)
  }


    //confirm user created
    if(!user){
      return new NextResponse('User not created', {status: 422});
    }
    // Create Profile
    await prisma.profile.create({
      data: {
        userId: user.id,
        display_name: firstName + ' ' + lastName,
        username: username ?? "",
        url: username ?? "",
        // other fields, set defaults or based on user input
      },
    });





    return new NextResponse('User and Profile created' , {status: 201});
  } catch (error) {
    console.error('Registration error:', error);
    return new NextResponse('Internal server error' , {status: 500});
  } finally {

    await prisma.$disconnect();
  }
}
