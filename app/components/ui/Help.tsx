import { Pipeline } from '@/src/pipeline/Pipeline';
import { useSetAtom } from 'jotai';
import { pipelineAtom } from '~/store/store';
import { Button } from '../catalyst/button';
import { CustomMarkdown } from '../markdown/Markdown';
import compare from './examples/compare.json';
import complaints from './examples/complaints.json';
import jsonld from './examples/jsonld.json';
import writing from './examples/writing.json';

export function Help({ close }: { close: () => void }) {
  const setPipeline = useSetAtom(pipelineAtom);

  const setExample = (ex: object) => {
    setPipeline(ex as Pipeline);
    close();
  };

  return (
    <div className="prose prose-sm dark:prose-invert max-w-full">
      <CustomMarkdown>
        {`LitLytics is an affordable, simple analytics platform for everyone designed to streamline the process of working with complex datasets.
By combining LLMs with javascript, LitLytics allows you to generate complete data processing pipelines based on natural language descriptions.

With LitLytics, you can transform data, extract insights, and automate routine tasks without having to write any code.
Just describe the task in plain language, and LitLytics will handle the rest – from parsing and cleaning data to generating output in structured formats.`}
      </CustomMarkdown>

      <h3 className="mt-0">Try some examples:</h3>

      <ul>
        <li>
          <Button plain onClick={() => setExample(complaints)}>
            Extracting complaints from negative reviews
          </Button>
        </li>
        <li>
          <Button plain onClick={() => setExample(compare)}>
            Comparing multiple products based on user input
          </Button>
        </li>
        <li>
          <Button plain onClick={() => setExample(jsonld)}>
            Converting text into structured formats like JSON-LD
          </Button>
        </li>
        <li>
          <Button plain onClick={() => setExample(writing)}>
            Writing Instagram posts with proof-reading for clarity and tone
          </Button>
        </li>
      </ul>
    </div>
  );
}
