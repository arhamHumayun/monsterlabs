import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

import { Inter as FontSans } from 'next/font/google';
import { Navbar } from '@/components/navbar';
import { createSupabaseAppServerClient } from '@/lib/supabase/server-client';

export const metadata: Metadata = {
  title: 'DnD Content Generator',
  description: 'Generate DnD content with ease using AI. Not affiliated with Wizards of the Coast.',
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
  const session = (await supabase.auth.getSession()).data.session;
  let user = session?.user;

  return (
    <html lang="en">
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
            <Navbar user={user} />
              <div className="mt-12 flex justify-center items-center w-full">
                {children}
              </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
