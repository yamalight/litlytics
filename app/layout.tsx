import { Provider } from 'jotai';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '🔥 LitLytics',
  description: 'LitLytics',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider>
      <html
        lang="en"
        className="text-zinc-950 antialiased dark:bg-zinc-950 dark:text-white"
      >
        <body>{children}</body>
      </html>
    </Provider>
  );
}
