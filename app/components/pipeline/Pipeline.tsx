import { useStore } from '@/app/store/store';
import { XMarkIcon } from '@heroicons/react/16/solid';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { useState } from 'react';
import Markdown from 'react-markdown';
import { Button } from '../catalyst/button';
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
} from '../catalyst/sidebar';
import { Textarea } from '../catalyst/textarea';
import { Spinner } from '../Spinner';
import { runPromptFromMessages } from '../util';
import system from './pipeline.txt';

export function Pipeline({ hide }: { hide: () => void }) {
  const [loading, setLoading] = useState(false);
  const [refine, setRefine] = useState(
    `Let's remove frequency count step and add a new code step after Step 1 to filter out positive reviews.`
  );
  const state = useStore((state) => state);

  const doRefine = async () => {
    if (!refine?.length) {
      return;
    }

    setLoading(true);

    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: system.trim() },
      { role: 'user', content: state.pipelineDescription!.trim() },
      { role: 'assistant', content: state.pipelinePlan!.trim() },
      { role: 'user', content: refine.trim() },
    ];

    // generate plan from LLM
    const plan = await runPromptFromMessages({ messages });

    // save
    state.setPipelinePlan(plan.result ?? '');
    setLoading(false);
  };

  return (
    <Sidebar className="w-5/12 h-full min-h-screen max-h-screen overflow-auto p-4 prose prose-sm dark:prose-invert lg:bg-zinc-200 dark:bg-zinc-800 dark:lg:bg-zinc-800">
      <SidebarHeader>
        <div className="flex w-full items-center justify-between">
          <h1 className="m-0">Suggested pipeline:</h1>
          <Button plain onClick={hide}>
            <XMarkIcon />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarBody>
        <Markdown>{state.pipelinePlan}</Markdown>
      </SidebarBody>
      <SidebarFooter>
        <div className="flex gap-1">
          <Textarea
            rows={2}
            placeholder="Your request..."
            disabled={loading}
            value={refine}
            onChange={(e) => setRefine(e.target.value)}
          />
          <Button onClick={doRefine} disabled={loading}>
            {loading && <Spinner className="h-5 w-5" />}
            Refine
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
