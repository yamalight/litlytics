import type { MetaFunction } from '@remix-run/node';
import { UI } from '~/components/ui/UI';

export const meta: MetaFunction = () => {
  return [
    { title: '🔥 LitLytics' },
    { name: 'description', content: 'Welcome to 🔥 LitLytics!' },
  ];
};

export default function Index() {
  return <UI />;
}
