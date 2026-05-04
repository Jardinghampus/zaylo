import Link from "next/link";
import { RequestForm } from "@/components/request/RequestForm";

export const metadata = { title: "I'm Looking — Zaylo" };

export default function LookingPage() {
  return (
    <div className="min-h-dvh bg-bg-secondary">
      <header className="sticky top-0 z-30 bg-[rgba(255,255,255,0.85)] backdrop-blur-md border-b border-[var(--separator)]">
        <div className="max-w-content mx-auto px-4 h-14 flex items-center justify-center relative">
          <span className="text-headline font-semibold">I&apos;m Looking</span>
          <Link href="/" className="absolute left-4 text-apple-blue text-subhead hover:opacity-70 transition-opacity">Cancel</Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 pb-[calc(2rem+env(safe-area-inset-bottom))]">
        <div className="bg-white border border-[var(--separator)] rounded-xl shadow-card p-6">
          <RequestForm />
        </div>
      </main>
    </div>
  );
}
