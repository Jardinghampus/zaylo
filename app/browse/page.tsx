"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppleSegmented } from "@/components/ui/AppleSegmented";
import { AreaChip } from "@/components/ui/AreaChip";
import { ListingCard } from "@/components/listing/ListingCard";
import { RequestCard } from "@/components/request/RequestCard";
import { useListings } from "@/hooks/useListings";
import { useRequests } from "@/hooks/useRequests";
import { useAreas } from "@/hooks/useAreas";
import { HomeIcon } from "lucide-react";

function BrowseContent() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"listings" | "requests">("listings");
  const [areaFilter, setAreaFilter] = useState<string>(searchParams.get("area") ?? "");

  const { data: areas = [] } = useAreas();
  const { data: listings = [], isLoading: loadingListings } = useListings({ area_id: areaFilter || undefined });
  const { data: requests = [], isLoading: loadingRequests } = useRequests();

  const filteredRequests = areaFilter
    ? requests.filter((r) => r.areas.some((a) => a.id === areaFilter))
    : requests;

  return (
    <div className="min-h-dvh bg-bg-secondary">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[rgba(255,255,255,0.85)] backdrop-blur-md border-b border-[var(--separator)]">
        <div className="max-w-content mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-headline font-bold tracking-[-0.02em]">Zaylo</Link>
          <div className="flex gap-3">
            <Link href="/looking" className="text-subhead text-apple-blue hover:opacity-70 transition-opacity hidden sm:block">I&apos;m Looking</Link>
            <Link href="/list" className="inline-flex items-center justify-center h-9 px-4 rounded-pill bg-apple-blue text-white text-subhead font-semibold transition-all duration-fast hover:brightness-90">
              List Property
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-content mx-auto px-4 py-6">
        {/* Tabs */}
        <AppleSegmented
          options={[{ value: "listings", label: "Listings" }, { value: "requests", label: "Requests" }]}
          value={tab}
          onChange={setTab}
          className="mb-5 max-w-[260px]"
        />

        {/* Area filter chips */}
        <div className="chips-scroll flex gap-2 pb-1 mb-6 -mx-4 px-4">
          <AreaChip label="All" selected={!areaFilter} onClick={() => setAreaFilter("")} />
          {areas.map((a) => (
            <AreaChip key={a.id} label={a.name} selected={areaFilter === a.id} onClick={() => setAreaFilter(a.id)} />
          ))}
        </div>

        {tab === "listings" && (
          <>
            {loadingListings ? (
              <ListingsSkeleton />
            ) : listings.length === 0 ? (
              <EmptyState
                icon={<HomeIcon size={40} strokeWidth={1.2} className="text-text-tertiary" />}
                title="No listings yet"
                subtitle="Be the first to list a property in this community."
                cta={<Link href="/list" className="inline-flex items-center justify-center h-10 px-5 rounded-pill bg-apple-blue text-white text-subhead font-semibold mt-2">List Your Property</Link>}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
                {listings.map((l) => <ListingCard key={l.id} listing={l as Parameters<typeof ListingCard>[0]["listing"]} />)}
              </div>
            )}
          </>
        )}

        {tab === "requests" && (
          <>
            {loadingRequests ? (
              <RequestsSkeleton />
            ) : filteredRequests.length === 0 ? (
              <EmptyState
                icon={<HomeIcon size={40} strokeWidth={1.2} className="text-text-tertiary" />}
                title="No requests yet"
                subtitle="Buyers and renters who post here are looking in this community."
                cta={<Link href="/looking" className="inline-flex items-center justify-center h-10 px-5 rounded-pill bg-apple-blue text-white text-subhead font-semibold mt-2">Post a Request</Link>}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
                {filteredRequests.map((r) => <RequestCard key={r.id} request={r} />)}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense>
      <BrowseContent />
    </Suspense>
  );
}

function EmptyState({ icon, title, subtitle, cta }: { icon: React.ReactNode; title: string; subtitle: string; cta?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      {icon}
      <p className="text-headline">{title}</p>
      <p className="text-subhead text-text-secondary max-w-xs">{subtitle}</p>
      {cta}
    </div>
  );
}

function ListingsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white border border-[var(--separator)] rounded-xl p-4 space-y-3">
          <div className="flex gap-2"><div className="skeleton h-5 w-16" /><div className="skeleton h-5 w-14" /></div>
          <div className="skeleton h-5 w-3/4" />
          <div className="skeleton h-4 w-1/2" />
          <div className="skeleton h-7 w-2/3" />
          <div className="skeleton h-11 w-full rounded-pill" />
        </div>
      ))}
    </div>
  );
}

function RequestsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white border border-[var(--separator)] rounded-xl p-4 space-y-3">
          <div className="flex gap-2"><div className="skeleton h-5 w-14" /><div className="skeleton h-5 w-24" /></div>
          <div className="skeleton h-4 w-1/2" />
          <div className="skeleton h-4 w-2/3" />
          <div className="skeleton h-11 w-full rounded-pill" />
        </div>
      ))}
    </div>
  );
}
