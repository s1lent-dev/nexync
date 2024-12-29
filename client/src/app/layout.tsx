import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import ReduxProvider from "@/context/rootProvider";
import { SocketProvider } from "@/context/helper/socket";
import { AxiosProvider } from "@/context/helper/axios";
import { ToastProvider } from "@/context/toast/toast";
import { Toaster} from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Nexync",
  description: "Where connections spark, and conversations flow. Scalable, seamless, and always in sync !",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased bg-bg_main text-font_main w-screen h-screen`}
      >
        <ReduxProvider>
          <AxiosProvider>
            <SocketProvider>
              <ToastProvider>
                <Suspense fallback={<div>Loading...</div>}>
                  <Toaster />
                  {children}
                </Suspense>
              </ToastProvider>
            </SocketProvider>
          </AxiosProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
