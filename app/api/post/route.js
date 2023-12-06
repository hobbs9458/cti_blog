// TODOS
// 1. MAKE SURE TO DELETE PREVIEW IMG FILE FROM FILE SYSTEM WHEN DELETING BLOG POSTS

import { NextResponse } from 'next/server';

import fs from 'fs/promises';
import path from 'path';

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
    if (name !== 'blogPreviewImg') {
      dbData[name] = value;
    }
  }

  const uniqueFilename = `${Date.now()}_${imgFile.name}`;
  const filePath = path.join(
    process.cwd(),
    'public',
    'uploads',
    uniqueFilename
  );

  const buffer = Buffer.from(await imgFile.arrayBuffer());

  await fs.writeFile(filePath, buffer);

  dbData['blogPreviewImg'] = `/uploads/${uniqueFilename}`;

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
