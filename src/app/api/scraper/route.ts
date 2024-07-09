import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();
import pQueue from "p-queue";

const queue = new pQueue({ concurrency: 1 });

const rateLimit = {
  timestamp: Date.now(),
  count: 0
}

export async function GET(request: Request) {

  const now = Date.now();
  const resetTime = 60000;
  const maxRequests = 5;

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if(now - rateLimit.timestamp > resetTime){
    rateLimit.timestamp = now;
    rateLimit.count = 0;
  }

  rateLimit.count++;

  if(rateLimit.count > maxRequests){
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Rate limit exceeded. Please try again later.')
        Response.json({error: 'Rate limit exceeded. Please try again later.'},{status: 429})
        resolve
      },resetTime - (now - rateLimit.timestamp))
    })
  }

  try {
    const result = await queue.add(async() => {
      const users = await prisma.user.findFirst({
        where: {
          id: Number(id)
        }
      });

      console.log({users});

      await new Promise((resolve) => setTimeout(resolve, 5000)); 
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?userId=1')
      const posts = await response.json();
      console.log({posts});
      return posts;
    })

    return Response.json({ result },{status: 200})
  } catch (error) {
     Response.json({error: 'An error occurred while fetching users.'},{status: 500})
  } finally {
    await prisma.$disconnect()
  }
}