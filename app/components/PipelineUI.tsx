import { DocumentIcon } from '@heroicons/react/24/outline';
import {
  ArrowRightEndOnRectangleIcon,
  CogIcon,
  SparklesIcon,
} from '@heroicons/react/24/solid';
import { Button } from './catalyst/button';

export function PipelineUI() {
  return (
    <div className="fixed pointer-events-none flex flex-col items-center my-6 z-10 h-screen w-screen bg-transparent">
      <div className="w-fit bg-white dark:bg-neutral-800 p-1.5 gap-1.5 isolate inline-flex rounded-lg shadow-sm pointer-events-auto">
        <Button title="Generate pipeline">
          <SparklesIcon aria-hidden="true" className="h-5 w-5" />
        </Button>
        <Button title="Add source">
          <DocumentIcon aria-hidden="true" className="h-5 w-5" />
        </Button>
        <Button title="Add step">
          <ArrowRightEndOnRectangleIcon
            aria-hidden="true"
            className="h-5 w-5"
          />
        </Button>
        <Button title="Settings">
          <CogIcon aria-hidden="true" className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
