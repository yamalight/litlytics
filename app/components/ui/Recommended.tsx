import { LLMProviders } from '@/src/litlytics';
import { LLMModel } from '@/src/llm/types';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import { Badge } from '../catalyst/badge';

export const recommendedForProvider: Record<LLMProviders, LLMModel> = {
  anthropic: 'claude-3-5-sonnet-20240620',
  // cohere: 'command-r-plus',
  gemini: 'gemini-1.5-flash-latest',
  // groq: 'llama-3.1-8b-instant',
  local: 'gemma-2-9b-it-q4f16_1-MLC',
  // mistral: 'mistral-medium-latest',
  openai: 'gpt-4o-mini',
  // perplexity: 'llama-3.1-8b-instruct',
};

export function Recommended() {
  return (
    <Popover className="flex items-center relative">
      <PopoverButton>
        <QuestionMarkCircleIcon className="size-5" />
      </PopoverButton>
      <PopoverPanel
        anchor="left"
        className="flex flex-col z-50 bg-zinc-100 dark:bg-zinc-800 rounded-xl shadow-md"
      >
        <div className="prose dark:prose-invert py-2 px-6">
          <h4>Recommended providers and models</h4>
          <ul>
            <li>
              <span className="text-sm opacity-60">
                Best price/performance:
              </span>
              <br /> <Badge>OpenAI</Badge> gpt-4o-mini
            </li>
            <li>
              <span className="text-sm opacity-60">Best quality:</span>
              <br /> <Badge>Anthropic</Badge> claude-3-5-sonnet
            </li>
            <li>
              <span className="text-sm opacity-60">Best free tier:</span>
              <br /> <Badge>Gemini</Badge> gemini-1.5-flash
            </li>
            <li>
              <span className="text-sm opacity-60">Best for privacy:</span>
              <br /> <Badge>Local</Badge> gemma-2-9b-it
            </li>
          </ul>
        </div>
      </PopoverPanel>
    </Popover>
  );
}
