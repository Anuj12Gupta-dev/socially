"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { createPostSchema } from "@/lib/validation";

export async function submitPost(input: {
  content: string;
  mediaIds: string[];
}) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { content, mediaIds } = createPostSchema.parse(input);

  // Extract hashtags from content
  const hashtagRegex = /#(\w+)/g;
  const tags = [...content.matchAll(hashtagRegex)].map(match => match[1]);

  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
      tags, // Save extracted tags
      attachments: {
        connect: mediaIds.map((id) => ({ id })),
      },
    } as any, // Cast to any to bypass TypeScript errors
    include: getPostDataInclude(user.id),
  });

  return newPost;
}