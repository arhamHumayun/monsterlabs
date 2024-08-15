import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

import { Inter as FontSans } from 'next/font/google';
import { Navbar } from '@/components/navbar';
import { createSupabaseAppServerClient } from '@/lib/supabase/server-client';
import { Toaster } from '@/components/ui/sonner';
import { CSPostHogProvider } from './providers';

export const metadata: Metadata = {
  title: 'Monster Labs',
  description: 'Generate a DnD creature with ease using AI.',
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
  const supabase = await createSupabaseAppServerClient();
  let user = await supabase.auth.getUser();

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
              <Navbar user={user.data.user} />
              <div className="mt-12 flex justify-center items-center">
                {children}
              </div>
            </div>
            <Toaster />
          </ThemeProvider>
        </body>
      </CSPostHogProvider>
    </html>
  );
}
