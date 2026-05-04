import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Zaylo — Buy and rent directly from owners",
  description: "Dubai villa community property marketplace. No agents, no commission.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const body = (
    <html lang="en">
      <body className="min-h-dvh bg-bg-primary font-apple antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );

  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return body;
  return <ClerkProvider>{body}</ClerkProvider>;
}
