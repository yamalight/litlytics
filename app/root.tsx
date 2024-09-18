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

export async function loader() {
  return json({
    ENV: {
      DEPLOY_URL: process.env.DEPLOY_URL,
    },
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
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
          <script
            dangerouslySetInnerHTML={{
              __html: `window.process = {
                env: ${JSON.stringify(data.ENV)}
              };`,
            }}
          />
          <Scripts />
        </body>
      </html>
    </Provider>
  );
}

export default function App() {
  return <Outlet />;
}
