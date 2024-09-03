import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

const plugins = [remarkGfm, remarkBreaks];

export function CustomMarkdown({ children }: { children?: string | null }) {
  return <Markdown remarkPlugins={plugins}>{children}</Markdown>;
}
