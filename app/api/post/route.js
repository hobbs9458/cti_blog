import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Blog } from '@/app/models/blogPost';

// request handlers are static and cached by default. can force them to be a dynamic which is never cached to always fetch fresh data
export const dynamic = 'force-dynamic';

export async function POST(request) {
  await dbConnect();

  const blogPost = await request.json();
  const post = await Blog.create(blogPost);

  return NextResponse.json(post, {
    status: 201,
  });
}

export async function GET() {
  await dbConnect();

  const posts = await Blog.find();

  return NextResponse.json(posts, {
    status: 200,
  });
}
