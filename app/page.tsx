export const dynamic = "force-dynamic";

import Link from "next/link";
import { ChevronRightIcon, HomeIcon, SearchIcon, ShieldCheckIcon } from "lucide-react";
import { createServerClient } from "@/lib/supabase/server";
import type { AreaWithSubAreas } from "@/types";

async function getAreas(): Promise<AreaWithSubAreas[]> {
  const supabase = createServerClient();
  const { data } = await supabase.from("areas").select("*, sub_areas(id,name)").order("name");
  return (data ?? []) as AreaWithSubAreas[];
}

export default async function HomePage() {
  const areas = await getAreas();

  return (
    <div className="min-h-dvh bg-bg-primary">
      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-[rgba(255,255,255,0.85)] backdrop-blur-md border-b border-[var(--separator)]">
        <div className="max-w-content mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-headline font-bold tracking-[-0.02em]">Zaylo</span>
          <Link
            href="/browse"
            className="text-subhead text-apple-blue hover:opacity-70 transition-opacity flex items-center gap-1"
          >
            Browse
            <ChevronRightIcon size={14} aria-hidden />
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="page-enter max-w-content mx-auto px-4 pt-16 pb-14 md:pt-24 md:pb-20">
          <div className="md:grid md:grid-cols-2 md:gap-16 md:items-start">
            <div>
              <h1 className="text-largetitle mb-4 text-balance">
                Buy and rent directly from owners.
              </h1>
              <p className="text-subhead text-text-secondary mb-2">Dubai villa communities.</p>
              <p className="text-subhead text-text-secondary mb-8">No agents. No commission.</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/list"
                  className="inline-flex items-center justify-center h-[50px] px-7 rounded-pill bg-apple-blue text-white text-[17px] font-semibold tracking-[-0.02em] transition-all duration-fast ease-apple hover:brightness-90 active:scale-97"
                >
                  List Your Property
                </Link>
                <Link
                  href="/looking"
                  className="inline-flex items-center justify-center h-[50px] px-7 rounded-pill bg-[#F5F5F7] border border-black/10 text-text-primary text-[17px] font-semibold tracking-[-0.02em] transition-all duration-fast ease-apple hover:bg-[#E8E8ED] active:scale-97"
                >
                  I&apos;m Looking
                </Link>
              </div>
            </div>

            {/* Communities — desktop right column */}
            <div className="hidden md:block mt-2">
              <CommunityGrid areas={areas} />
            </div>
          </div>
        </section>

        {/* Communities — mobile */}
        <section className="md:hidden max-w-content mx-auto px-4 pb-12">
          <p className="text-caption1 text-text-secondary uppercase tracking-widest mb-3">Communities</p>
          <CommunityGrid areas={areas} />
        </section>

        {/* How it works */}
        <section className="bg-bg-secondary border-t border-[var(--separator)]">
          <div className="max-w-content mx-auto px-4 py-14">
            <p className="text-caption1 text-text-secondary uppercase tracking-widest mb-8">How it works</p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { Icon: HomeIcon, title: "List your property", body: "Owners submit their property with a title deed. We verify and publish within 24 hours." },
                { Icon: SearchIcon, title: "Submit a request", body: "Buyers and tenants post what they're looking for. Owners browse and reach out directly." },
                { Icon: ShieldCheckIcon, title: "Owners contact you", body: "No middleman. Connect directly on WhatsApp with verified property owners." },
              ].map(({ Icon, title, body }) => (
                <div key={title} className="flex flex-col gap-4">
                  <div className="w-11 h-11 rounded-full bg-[var(--fill-tertiary)] flex items-center justify-center flex-shrink-0" aria-hidden>
                    <Icon size={20} className="text-text-secondary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-headline mb-1">{title}</p>
                    <p className="text-subhead text-text-secondary">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-bg-secondary border-t border-[var(--separator)]">
        <div className="max-w-content mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-3">
          <span className="text-caption1 text-text-secondary">© 2026 Zaylo. All rights reserved.</span>
          <div className="flex gap-5">
            <Link href="/browse" className="text-caption1 text-text-secondary hover:text-text-primary transition-colors">Browse</Link>
            <Link href="/list" className="text-caption1 text-text-secondary hover:text-text-primary transition-colors">List Property</Link>
            <Link href="/looking" className="text-caption1 text-text-secondary hover:text-text-primary transition-colors">I&apos;m Looking</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CommunityGrid({ areas }: { areas: AreaWithSubAreas[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 stagger-children">
      {areas.map((area) => (
        <Link
          key={area.id}
          href={`/browse?area=${area.id}`}
          className="group flex items-center justify-between p-4 bg-white border border-[var(--separator)] rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-normal ease-apple"
        >
          <div>
            <p className="text-subhead font-semibold text-text-primary">{area.name}</p>
            <p className="text-caption1 text-text-tertiary mt-0.5">
              {area.sub_areas.length} sub-area{area.sub_areas.length !== 1 ? "s" : ""}
            </p>
          </div>
          <ChevronRightIcon size={16} className="text-text-tertiary group-hover:text-text-secondary transition-colors" aria-hidden />
        </Link>
      ))}
    </div>
  );
}
