import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Convolitics',
  description: 'Convolitics',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="text-zinc-950 antialiased lg:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:lg:bg-zinc-950"
    >
      <body>{children}</body>
    </html>
  );
}
