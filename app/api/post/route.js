import { NextResponse } from 'next/server';

import dbConnect from '@/lib/db';
import { Blog } from '@/app/models/blogPost';

// request handlers are static and cached by default. can force them to be a dynamic which is never cached to always fetch fresh data
export const dynamic = 'force-dynamic';

export async function POST(request) {
  await dbConnect();

  const formData = await request.formData();
  let imgFile = formData.get('blogPreviewImg');
  const dbData = {};

  for (const [name, value] of formData.entries()) {
    if (name === 'blogPreviewImg') {
      dbData[name] = value.name;
    } else {
      dbData[name] = value;
    }
  }

  console.log(dbData);

  const post = await Blog.create(dbData);

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
