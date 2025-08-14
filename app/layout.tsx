import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

import { Inter as FontSans } from 'next/font/google';
import { Navbar } from '@/components/navbar';
import { Toaster } from '@/components/ui/sonner';
import { CSPostHogProvider } from './providers';

export const metadata: Metadata = {
  title: 'Monster Labs',
  description: 'Instantly create D&D creatures and items from your ideas!',
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  }
};

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <CSPostHogProvider>
        <body
          className={cn(
            'min-h-screen bg-background font-sans antialiased',
            fontSans.variable
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="container mx-auto px-4">
              <Navbar />
              <div className="flex justify-center items-center">{children}</div>
            </div>
            <Toaster />
          </ThemeProvider>
        </body>
      </CSPostHogProvider>
    </html>
  );
}
