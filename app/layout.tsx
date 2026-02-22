// Validates all env vars at boot — throws if anything is missing
import "@/lib/env";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { APP_NAME, APP_DESCRIPTION } from "@/constants";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s — ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
