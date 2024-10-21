import { CurrencyDollarIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { useAtom } from 'jotai';
import {
  LLMModelsList,
  LLMProvider,
  LLMProviders,
  LLMProvidersList,
  modelCosts,
} from 'litlytics';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { configAtom } from '~/store/store';
import { Badge } from '../catalyst/badge';
import { Description, Field, FieldGroup, Label } from '../catalyst/fieldset';
import { Input } from '../catalyst/input';
import { Select } from '../catalyst/select';
import { ProviderKeysHint, providerNames } from './ProviderKeys';
import { Recommended, recommendedForProvider } from './Recommended';

export function Settings({ close: _close }: { close: () => void }) {
  const [config, setConfig] = useAtom(configAtom);
  const [providers, setProviders] = useState<LLMProviders[]>([]);

  const provider = useMemo(() => config.provider ?? 'openai', [config]);
  const models = useMemo(() => LLMModelsList[provider], [provider]);

  useEffect(() => {
    async function loadProviders() {
      const prov: LLMProviders[] = structuredClone(
        LLMProvidersList
      ) as unknown as LLMProviders[];
      setProviders(prov);
    }
    loadProviders();
  }, []);

  return (
    <div className="max-w-full">
      <FieldGroup>
        <Field>
          <Label>Provider</Label>
          <div className="flex gap-2">
            <Select
              value={config.provider}
              onChange={(e) =>
                setConfig((c) => ({
                  ...c,
                  provider: e.target.value as LLMProviders,
                  model: LLMModelsList[e.target.value as LLMProviders][0],
                  llmKey: '',
                }))
              }
            >
              {providers.map((prov) => (
                <option key={prov} value={prov}>
                  {providerNames[prov]}
                </option>
              ))}
            </Select>
            <Recommended />
          </div>
        </Field>

        <Field>
          <Label>Model</Label>
          {config.provider === 'ollama' && (
            <Input
              value={config.model}
              onChange={(e) =>
                setConfig((c) => ({
                  ...c,
                  model: e.target.value,
                }))
              }
            />
          )}
          {config.provider !== 'ollama' && (
            <Select
              value={config.model}
              onChange={(e) =>
                setConfig((c) => ({
                  ...c,
                  model: e.target.value,
                }))
              }
            >
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}{' '}
                  {recommendedForProvider[provider] === model
                    ? '(recommended)'
                    : ''}
                </option>
              ))}
            </Select>
          )}
          {config.provider !== 'ollama' && (
            <Description className="flex gap-2">
              <Badge title="Input price (USD) per million tokens">
                Input: <CurrencyDollarIcon className="w-3 h-3" />{' '}
                {_.round(modelCosts[config.model!].input * 10000, 2)} / MTok
              </Badge>
              <Badge title="Output price (USD) per million tokens">
                Output: <CurrencyDollarIcon className="w-3 h-3" />{' '}
                {_.round(modelCosts[config.model!].output * 10000, 2)} / MTok
              </Badge>
            </Description>
          )}
        </Field>

        {config.provider === 'ollama' && (
          <Field>
            <Label>Ollama URL</Label>
            <Input
              type="text"
              placeholder="http://localhost:11434"
              value={config.llmKey}
              onChange={(e) =>
                setConfig((c) => ({
                  ...c,
                  llmKey: e.target.value,
                }))
              }
            />
            <Description className="mt-4 mx-1 !text-xs">
              Please note that your Ollama instance must have CORS enabled for
              LitLytics to work correctly in browser environment.
            </Description>
          </Field>
        )}

        {config.provider !== 'ollama' && (
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
            {Boolean(config.llmKey?.length) && (
              <Description>
                Your key is stored only in your browser and passed directly to
                API provider.
              </Description>
            )}
          </Field>
        )}
      </FieldGroup>

      {!config.llmKey?.length && config.provider !== 'ollama' && (
        <>
          <ProviderKeysHint provider={provider as LLMProvider} />
          <div className="rounded-md bg-red-50 dark:bg-red-900 p-4 mt-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon
                  aria-hidden="true"
                  className="h-5 w-5 text-red-400 dark:text-red-200"
                />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Choose a provider, model and set a key for the provider of
                  your choice to get started!
                </h3>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
