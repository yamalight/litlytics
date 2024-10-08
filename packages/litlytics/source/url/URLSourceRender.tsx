import type { UIComponents } from '@/components/types';
import type { Doc } from '@/doc/Document';
import type { SourceStep } from '@/step/Step';
import { Field } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import TurndownService from 'turndown';
import type { URLSourceConfig } from './types';

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
  source,
  setSource,
  components,
}: {
  source: SourceStep;
  setSource: (newSource: SourceStep) => void;
  components: UIComponents;
}) {
  const fetchRef = useRef<Timer>();
  const corsProxyRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const config = useMemo(() => source.config as URLSourceConfig, [source]);

  const updateConfig = useCallback(
    (config: URLSourceConfig) => {
      const newSource = structuredClone(source);
      newSource.config = config;
      setSource(newSource);
    },
    [source, setSource]
  );

  const updateDocFromUrl = (e: ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;

    // update url
    const newConfig = structuredClone(config) as URLSourceConfig;
    newConfig.url = newUrl;
    updateConfig(newConfig);

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
        if (!newConfig.document) {
          const doc: Doc = {
            id: 'urldoc',
            name: 'Default document',
            content: '',
            test: true,
            processingResults: [],
          };
          newConfig.document = doc;
        }
        newConfig.url = '';
        newConfig.document.name = newUrl;
        newConfig.document.content = content;
        updateConfig(newConfig);
      } catch (err) {
        console.error('error fetching doc:', err);
      }

      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (config.document) {
      return;
    }

    const doc: Doc = {
      id: 'urldoc',
      name: 'Default document',
      content: '',
      test: true,
      processingResults: [],
    };
    const newConfig = structuredClone(config) as URLSourceConfig;
    newConfig.document = doc;
    updateConfig(newConfig);
  }, [updateConfig, config, source]);

  return (
    <div className="flex flex-col w-full h-full overflow-auto">
      <div className="flex flex-col gap-1.5">
        <Field
          className={clsx([
            'grid grid-cols-[40px_minmax(0,_1fr)]',
            'items-center justify-center gap-6',
          ])}
        >
          <components.Label>URL:</components.Label>
          <components.Input
            name="url"
            placeholder="Document URL"
            value={config.url ?? ''}
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
          <components.Label>CORS:</components.Label>
          <components.Input
            name="corsproxy"
            placeholder="CORS proxy URL (optional)"
            defaultValue="https://corsproxy.io/?"
            ref={corsProxyRef}
            disabled={loading}
          />
        </Field>
        {!loading && Boolean(config.document?.content?.length) && (
          <div
            className={clsx([
              'flex items-center justify-between',
              'bg-zinc-100 dark:bg-zinc-900',
              'p-2 rounded-lg shadow-sm',
            ])}
          >
            {config.document?.name}
            <div className="flex items-center gap-2 min-w-fit">
              <components.Button
                icon
                title="Preview"
                onClick={() => setPreviewOpen(true)}
              >
                <MagnifyingGlassIcon />
              </components.Button>
            </div>
          </div>
        )}
        {loading && (
          <div className="flex items-center justify-center p-2 gap-2">
            <components.Spinner className="h-5 w-5" /> Fetching content..
          </div>
        )}
      </div>

      <components.Dialog
        open={isPreviewOpen}
        onClose={() => setPreviewOpen(false)}
        size="3xl"
        topClassName="z-20"
      >
        <components.DialogTitle>
          Preview: {config.document?.name}
        </components.DialogTitle>
        <components.DialogBody className="prose dark:prose-invert max-w-full">
          <components.CustomMarkdown>
            {config.document?.content}
          </components.CustomMarkdown>
        </components.DialogBody>
      </components.Dialog>
    </div>
  );
}
