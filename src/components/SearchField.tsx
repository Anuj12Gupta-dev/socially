"use client";

import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";

interface SearchFieldProps {
  initialQuery?: string;
}

export default function SearchField({ initialQuery = "" }: SearchFieldProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  // Update query when URL params change
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
  }, [searchParams]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={handleSubmit} method="GET" action="/search">
      <div className="relative">
        <Input
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="pe-10"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          <SearchIcon className="size-5" />
        </button>
      </div>
    </form>
  );
}