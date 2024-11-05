import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

const plugins = [remarkGfm, remarkBreaks];

export function CustomMarkdown({ children }: { children?: string | null }) {
  return (
    <Markdown rehypePlugins={[rehypeRaw]} remarkPlugins={plugins}>
      {children}
    </Markdown>
  );
}
