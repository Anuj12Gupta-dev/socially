"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import UserCard from "@/components/UserCard";
import kyInstance from "@/lib/ky";
import { SearchResult } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface SearchResultsProps {
  query: string;
  filter: string;
}

export default function SearchResults({ query, filter }: SearchResultsProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["search-results", query, filter],
    queryFn: async ({ pageParam }) => {
      try {
        const response = await kyInstance
          .get("/api/search", {
            searchParams: {
              q: query,
              filter: filter,
              ...(pageParam?.postsCursor ? { postsCursor: pageParam.postsCursor } : {}),
              ...(pageParam?.usersCursor ? { usersCursor: pageParam.usersCursor } : {}),
            },
          });

          console.log("Search API response:", response);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json<SearchResult>();
      } catch (err) {
        console.error("Search API error:", err);
        throw err;
      }
    },
    initialPageParam: { postsCursor: null as string | null, usersCursor: null as string | null },
    getNextPageParam: (lastPage) => ({
      postsCursor: lastPage.postsNextCursor,
      usersCursor: lastPage.usersNextCursor,
    }),
    gcTime: 0,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];
  const users = data?.pages.flatMap((page) => page.users) || [];

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "error") {
    console.error("Search error:", error);
    return (
      <p className="text-center text-destructive">
        An error occurred while loading results: {error instanceof Error ? error.message : "Unknown error"}
        <br />
        Query: "{query}" | Filter: "{filter}"
      </p>
    );
  }

  if (status === "success" && !posts.length && !users.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        No results found for "{query}" with filter "{filter}".
      </p>
    );
  }

  // Filter results based on the filter parameter
  const showUsers = filter === "all" || filter === "users";
  const showPosts = filter === "all" || filter === "posts";

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {/* Display users first if filter allows */}
      {showUsers && users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
      
      {/* Then display posts if filter allows */}
      {showPosts && posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}