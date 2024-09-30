import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { Provider } from 'jotai';
import './tailwind.css';

// Load the GA tracking id from the .env
export const loader = async () => {
  return json({
    umamiSrc: process.env.UMAMI_SRC,
    umamiId: process.env.UMAMI_ID,
  });
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { umamiSrc, umamiId } = useLoaderData<typeof loader>();

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
          {process.env.NODE_ENV === 'production' &&
            Boolean(umamiSrc?.length) &&
            Boolean(umamiId?.length) && (
              <script defer src={umamiSrc} data-website-id={umamiId}></script>
            )}
        </body>
      </html>
    </Provider>
  );
}

export default function App() {
  return <Outlet />;
}
