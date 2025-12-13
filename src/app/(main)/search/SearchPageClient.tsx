"use client";

import { useSearchParams } from "next/navigation";
import SearchResults from "./SearchResults";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

export default function SearchPageClient({ initialQuery }: { initialQuery: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const currentQuery = searchParams.get("q") || initialQuery || "";
  const currentFilter = searchParams.get("filter") || "all";

  function handleFilterChange(newFilter: string) {
    const newParams = new URLSearchParams(searchParams);
    if (newFilter === "all") {
      newParams.delete("filter");
    } else {
      newParams.set("filter", newFilter);
    }
    // Preserve the search query when changing filters
    if (currentQuery) {
      newParams.set("q", currentQuery);
    }
    router.push(`/search?${newParams.toString()}`);
  }

  return (
    <>
      <div className="rounded-2xl bg-card p-5 shadow-sm">
        <h1 className="line-clamp-2 break-all text-center text-2xl font-bold">
          Search results for &quot;{currentQuery}&quot;
        </h1>
      </div>
      
      {/* Filter tabs */}
      <div className="rounded-2xl bg-card p-3 shadow-sm">
        <Tabs value={currentFilter} onValueChange={handleFilterChange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <SearchResults query={currentQuery} filter={currentFilter} />
    </>
  );
}