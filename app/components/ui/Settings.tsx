import { LLMProviders } from '@/src/litlytics';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { litlyticsConfigStore } from '~/store/store';
import { Field, FieldGroup, Label } from '../catalyst/fieldset';
import { Input } from '../catalyst/input';
import { Select } from '../catalyst/select';

const providers = [
  'openai',
  'ai21',
  'anthropic',
  'gemini',
  'cohere',
  'bedrock',
  'mistral',
  'groq',
  'perplexity',
  'openrouter',
];

export declare const TableDisplayNames: {
  models: string;
  supportsCompletion: string;
  supportsStreaming: string;
  supportsJSON: string;
  supportsImages: string;
  supportsToolCalls: string;
  supportsN: string;
};
const models = {
  openai: [
    'gpt-4o',
    'gpt-4o-mini',
    // 'gpt-4o-mini-2024-07-18',
    'gpt-4o-2024-05-13',
    'gpt-4-turbo',
    'gpt-4-turbo-2024-04-09',
    'gpt-4-0125-preview',
    'gpt-4-turbo-preview',
    'gpt-4-1106-preview',
    'gpt-4-vision-preview',
    'gpt-4',
    'gpt-4-0314',
    'gpt-4-0613',
    'gpt-4-32k',
    'gpt-4-32k-0314',
    'gpt-4-32k-0613',
    'gpt-3.5-turbo',
    'gpt-3.5-turbo-16k',
    'gpt-3.5-turbo-0301',
    'gpt-3.5-turbo-0613',
    'gpt-3.5-turbo-1106',
    'gpt-3.5-turbo-0125',
    'gpt-3.5-turbo-16k-0613',
  ],
  ai21: ['jamba-instruct'],
  anthropic: [
    'claude-3-5-sonnet-20240620',
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307',
    'claude-2.1',
    'claude-2.0',
    'claude-instant-1.2',
  ],
  gemini: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.0-pro'],
  cohere: [
    'command-r-plus',
    'command-r',
    'command',
    'command-nightly',
    'command-light',
    'command-light-nightly',
  ],
  bedrock: [
    'amazon.titan-text-lite-v1',
    'amazon.titan-text-express-v1',
    'anthropic.claude-3-opus-20240229-v1:0',
    'anthropic.claude-3-sonnet-20240229-v1:0',
    'anthropic.claude-3-haiku-20240307-v1:0',
    'anthropic.claude-v2:1',
    'anthropic.claude-v2',
    'anthropic.claude-instant-v1',
    'cohere.command-r-plus-v1:0',
    'cohere.command-r-v1:0',
    'cohere.command-text-v14',
    'cohere.command-light-text-v14',
    'meta.llama3-8b-instruct-v1:0',
    'meta.llama3-70b-instruct-v1:0',
    'meta.llama2-13b-chat-v1',
    'meta.llama2-70b-chat-v1',
    'mistral.mistral-7b-instruct-v0:2',
    'mistral.mixtral-8x7b-instruct-v0:1',
    'mistral.mistral-large-2402-v1:0',
  ],
  mistral: [
    'open-mistral-7b',
    'mistral-tiny-2312',
    'open-mixtral-8x7b',
    'mistral-small-2312',
    'open-mixtral-8x22b',
    'open-mixtral-8x22b-2404',
    'mistral-small-latest',
    'mistral-small-2402',
    'mistral-medium-latest',
    'mistral-medium-2312',
    'mistral-large-latest',
    'mistral-large-2402',
    'codestral-latest',
    'codestral-2405',
    'codestral-mamba-2407',
  ],
  groq: [
    'llama3-8b-8192',
    'llama3-70b-8192',
    'mixtral-8x7b-32768',
    'gemma-7b-it',
    'gemma2-9b-it',
  ],
  perplexity: [
    'llama-3-sonar-small-32k-chat',
    'llama-3-sonar-small-32k-online',
    'llama-3-sonar-large-32k-chat',
    'llama-3-sonar-large-32k-online',
    'llama-3-8b-instruct',
    'llama-3-70b-instruct',
    'mixtral-8x7b-instruct',
  ],
  openrouter: ['llama3-8b-8192'],
  local: ['llama3-8b-8192'],
};

export function Settings() {
  const [config, setConfig] = useAtom(litlyticsConfigStore);

  const modelsList = useMemo(() => models[config.provider], [config]);

  return (
    <div className="prose prose-sm dark:prose-invert max-w-full">
      <FieldGroup>
        <Field>
          <Label>Provider</Label>
          <Select
            value={config.provider}
            onChange={(e) =>
              setConfig((c) => ({
                ...c,
                provider: e.target.value as LLMProviders,
                model: models[e.target.value as LLMProviders][0],
              }))
            }
          >
            {providers.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </Select>
        </Field>

        <Field>
          <Label>Model</Label>
          <Select
            value={config.model}
            onChange={(e) =>
              setConfig((c) => ({
                ...c,
                model: e.target.value,
              }))
            }
          >
            {modelsList.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </Select>
        </Field>

        <Field>
          <Label>API Key</Label>
          <Input
            type="password"
            value={config.llmKey}
            onChange={(e) =>
              setConfig((c) => ({
                ...c,
                llmKey: e.target.value,
              }))
            }
          />
        </Field>
      </FieldGroup>
    </div>
  );
}
