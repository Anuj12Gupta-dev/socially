import { Metadata } from "next";
import dynamic from "next/dynamic";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const q = params.q || "";
  return {
    title: `Search results for "${q}"`,
  };
}

// Dynamically import the client component to avoid server-side rendering issues
const SearchPageClient = dynamic(() => import('./SearchPageClient'));

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q || "";
  
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <SearchPageClient initialQuery={q} />
      </div>
    </main>
  );
}