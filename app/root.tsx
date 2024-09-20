import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { Provider } from 'jotai';
import './tailwind.css';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <html
        lang="en"
        className="text-zinc-950 antialiased dark:bg-zinc-950 dark:text-white"
      >
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
          <script
            defer
            src="https://analytics.codezen.dev/script.js"
            data-website-id="e9efe893-74e1-421d-bbf4-3096b58033ec"
          ></script>
        </body>
      </html>
    </Provider>
  );
}

export default function App() {
  return <Outlet />;
}
