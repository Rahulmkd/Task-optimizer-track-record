import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/providers/app.provider";
import { APP_NAME, APP_DESCRIPTION } from "@/constants/constants";

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased bg-[#0a0a0f] text-white min-h-screen font-sans">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
