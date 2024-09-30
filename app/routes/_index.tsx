import type { MetaFunction } from '@remix-run/node';
import { UI } from '~/components/ui/UI';

export const meta: MetaFunction = () => {
  return [
    { title: 'LitLytics' },
    {
      name: 'description',
      content: `LitLytics is an affordable, simple analytics platform for everyone designed to streamline the process of working with complex datasets.
By combining LLMs with javascript, LitLytics allows you to generate complete data processing pipelines based on natural language descriptions.`,
    },
  ];
};

export default function Index() {
  return <UI />;
}
