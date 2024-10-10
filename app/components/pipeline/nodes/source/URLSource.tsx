import { Field } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { Doc } from 'litlytics';
import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import TurndownService from 'turndown';
import { Button } from '~/components/catalyst/button';
import { Dialog, DialogBody, DialogTitle } from '~/components/catalyst/dialog';
import { Label } from '~/components/catalyst/fieldset';
import { Input } from '~/components/catalyst/input';
import { CustomMarkdown } from '~/components/markdown/Markdown';
import { Spinner } from '~/components/Spinner';

// init turndown service
const turndownService = new TurndownService();

/**
 * Fetches the HTML content of a page and converts it to markdown.
 * @param url - The URL of the page to fetch.
 * @returns The markdown representation of the page's content.
 */
async function fetchPageAsMarkdown(url: string): Promise<string> {
  try {
    // Fetch the page's HTML content
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.statusText}`);
    }
    const htmlText = await response.text();

    // Convert HTML to markdown using Turndown
    const markdown = turndownService
      .remove('script')
      .remove('link')
      .turndown(htmlText);

    return markdown;
  } catch (error) {
    console.error('Error fetching or converting page:', error);
    throw error;
  }
}

export function URLSourceRender({
  docs,
  setDocs,
}: {
  docs: Doc[];
  setDocs: (newDocs: Doc[]) => void;
}) {
  const fetchRef = useRef<Timer>();
  const corsProxyRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [url, setUrl] = useState('');

  const updateDocFromUrl = (e: ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;

    // update url
    setUrl(newUrl);

    // reset timeout
    if (fetchRef.current) {
      clearTimeout(fetchRef.current);
    }
    // start new timeout to fetch content
    fetchRef.current = setTimeout(async () => {
      try {
        if (!newUrl.length) {
          return;
        }

        setLoading(true);
        // fetch content from url
        const corsProxy = corsProxyRef.current?.value ?? '';
        const url = `${corsProxy}${newUrl}`;
        const content = await fetchPageAsMarkdown(url);

        // update doc content
        const doc: Doc = docs?.at(0) ?? {
          id: 'urldoc',
          name: 'Default document',
          content: '',
          test: true,
          processingResults: [],
        };
        doc.name = newUrl;
        doc.content = content;
        setDocs([doc]);
      } catch (err) {
        console.error('error fetching doc:', err);
      }

      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (docs) {
      return;
    }

    const doc: Doc = {
      id: 'urldoc',
      name: 'Default document',
      content: '',
      test: true,
      processingResults: [],
    };
    setDocs([doc]);
  }, [docs, setDocs]);

  return (
    <div className="flex flex-col w-full h-full overflow-auto">
      <div className="flex flex-col gap-1.5">
        <Field
          className={clsx([
            'grid grid-cols-[40px_minmax(0,_1fr)]',
            'items-center justify-center gap-6',
          ])}
        >
          <Label>URL:</Label>
          <Input
            name="url"
            placeholder="Document URL"
            value={url}
            onChange={updateDocFromUrl}
            disabled={loading}
          />
        </Field>
        <Field
          className={clsx([
            'grid grid-cols-[40px_minmax(0,_1fr)]',
            'items-center justify-center gap-6',
          ])}
        >
          <Label>CORS:</Label>
          <Input
            name="corsproxy"
            placeholder="CORS proxy URL (optional)"
            defaultValue="https://corsproxy.io/?"
            ref={corsProxyRef}
            disabled={loading}
          />
        </Field>
        {!loading && Boolean(docs?.at(0)?.content?.length) && (
          <div
            className={clsx([
              'flex items-center justify-between',
              'bg-zinc-100 dark:bg-zinc-900',
              'p-2 rounded-lg shadow-sm',
            ])}
          >
            {docs?.at(0)?.name}
            <div className="flex items-center gap-2 min-w-fit">
              <Button icon title="Preview" onClick={() => setPreviewOpen(true)}>
                <MagnifyingGlassIcon />
              </Button>
            </div>
          </div>
        )}
        {loading && (
          <div className="flex items-center justify-center p-2 gap-2">
            <Spinner className="h-5 w-5" /> Fetching content..
          </div>
        )}
      </div>

      <Dialog
        open={isPreviewOpen}
        onClose={() => setPreviewOpen(false)}
        size="3xl"
        topClassName="z-20"
      >
        <DialogTitle>Preview: {docs?.at(0)?.name}</DialogTitle>
        <DialogBody className="prose dark:prose-invert max-w-full">
          <CustomMarkdown>{docs?.at(0)?.content}</CustomMarkdown>
        </DialogBody>
      </Dialog>
    </div>
  );
}
