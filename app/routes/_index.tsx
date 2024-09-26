import type { MetaFunction } from '@remix-run/node';
import { UI } from '~/components/ui/UI';

export const meta: MetaFunction = () => {
  return [
    { title: 'LitLytics' },
    {
      name: 'description',
      content:
        'LitLytics is an affordable, simple analytics platform for everyone',
    },
  ];
};

export default function Index() {
  return <UI />;
}
