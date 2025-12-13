import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, getUserDataSelect, SearchResult } from "@/lib/types";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    let q = req.nextUrl.searchParams.get("q") || "";
    // Strip @ symbol from the beginning of the query for username searches
    if (q.startsWith('@')) {
      q = q.substring(1);
    }
    
    console.log('Search query:', { original: req.nextUrl.searchParams.get("q"), processed: q });
    
    const filter = req.nextUrl.searchParams.get("filter") || "all";
    const postsCursor = req.nextUrl.searchParams.get("postsCursor") || undefined;
    const usersCursor = req.nextUrl.searchParams.get("usersCursor") || undefined;

    const pageSize = 10;

    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let posts = [] as any[];
    let users = [] as any[];
    let postsNextCursor = null as string | null;
    let usersNextCursor = null as string | null;

    // Search for posts if filter allows
    if (filter === "all" || filter === "posts") {
      posts = await prisma.post.findMany({
        where: {
          OR: [
            {
              content: {
                contains: q,
                mode: 'insensitive' as Prisma.QueryMode,
              },
            },
            {
              user: {
                displayName: {
                  contains: q,
                  mode: 'insensitive' as Prisma.QueryMode,
                },
              },
            },
            {
              user: {
                username: {
                  contains: q,
                  mode: 'insensitive' as Prisma.QueryMode,
                },
              },
            },
          ],
        },
        include: getPostDataInclude(user.id),
        orderBy: { createdAt: "desc" },
        take: pageSize + 1,
        cursor: postsCursor ? { id: postsCursor } : undefined,
      });

      postsNextCursor = posts.length > pageSize ? posts[pageSize].id : null;
      posts = posts.slice(0, pageSize);
    }

    // Search for users if filter allows
    if (filter === "all" || filter === "users") {
      // Search for users with pagination workaround
      let usersWhereClause: Prisma.UserWhereInput = {
        OR: [
          {
            username: {
              contains: q,
              mode: 'insensitive' as Prisma.QueryMode,
            },
          },
          {
            displayName: {
              contains: q,
              mode: 'insensitive' as Prisma.QueryMode,
            },
          },
        ],
      };

      // If we have a usersCursor, we need to handle pagination manually
      let usersOrderBy: Prisma.UserOrderByWithRelationInput = { createdAt: "desc" };
      let usersTake = pageSize + 1;

      if (usersCursor) {
        // Get the cursor user to determine the createdAt value for pagination
        const cursorUser = await prisma.user.findUnique({
          where: { id: usersCursor },
          select: { createdAt: true }
        });

        if (cursorUser) {
          // Find users created before the cursor user
          usersWhereClause = {
            ...usersWhereClause,
            AND: [
              {
                OR: [
                  { createdAt: { lt: cursorUser.createdAt } },
                  { 
                    createdAt: cursorUser.createdAt,
                    id: { lt: usersCursor }
                  }
                ]
              }
            ]
          };
        }
      }

      users = await prisma.user.findMany({
        where: usersWhereClause,
        select: getUserDataSelect(user.id),
        orderBy: usersOrderBy,
        take: usersTake,
      });

      usersNextCursor = users.length > pageSize ? users[pageSize].id : null;
      users = users.slice(0, pageSize);
    }

    const data: SearchResult = {
      posts,
      users,
      postsNextCursor,
      usersNextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}