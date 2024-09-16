import { LLMProvider } from '@/src/llm/types';

const providerNames: Record<LLMProvider, string> = {
  anthropic: 'Anthropic',
  gemini: 'Gemini',
  openai: 'OpenAI',
};

const providerGuides: Record<LLMProvider, string> = {
  anthropic: 'https://docs.anthropic.com/en/api/getting-started',
  gemini: 'https://ai.google.dev/gemini-api/docs/api-key',
  openai: 'https://platform.openai.com/docs/quickstart',
};

export function ProviderKeysHint({ provider }: { provider: LLMProvider }) {
  return (
    <div className="mt-3 py-1 text-sm">
      Don&apos;t have API key?{' '}
      <a
        href={providerGuides[provider]}
        target="_blank"
        rel="noreferrer"
        className="underline"
      >
        Here&apos;s how to get one for {providerNames[provider]}.
      </a>
    </div>
  );
}
