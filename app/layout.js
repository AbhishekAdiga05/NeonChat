import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/providers/theme-provider";
import { QueryProvider } from "@/components/ui/providers/query-provider";

export const metadata = {
  title: "Neon Chat",
  description: "AI-powered chat application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased relative min-h-screen">
        {/* Ambient Neon Background Glows */}
        <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/15 blur-[120px] pointer-events-none -z-10 animate-pulse duration-10000" />
        <div className="fixed bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[150px] pointer-events-none -z-10" />

        <QueryProvider>
          <TooltipProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </TooltipProvider>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
