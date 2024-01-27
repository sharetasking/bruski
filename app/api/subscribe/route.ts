import prismadb from "@/lib/prismadb"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
    console.log('POST /api/subscribe')
    const { email } = await req.json();

    if (!email) {
        return new Response('Email is required', { status: 400 })
    }

    console.log(email)
    


    const result = await prismadb.subscriber.create({
        data: {
            email
        }
    })

    //send email

    return new Response('Subscribed', { status: 200 })


}


export async function GET(req: NextRequest) {
    

    const results = await prismadb.subscriber.findMany({
    })

    return new Response(JSON.stringify(results), { status: 200 })
}
