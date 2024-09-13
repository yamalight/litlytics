import { LLMProviders } from '@/src/litlytics';
import { LLMModelsList, LLMProvidersList } from '@/src/llm/types';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { litlyticsConfigStore } from '~/store/store';
import { Field, FieldGroup, Label } from '../catalyst/fieldset';
import { Input } from '../catalyst/input';
import { Select } from '../catalyst/select';

export function Settings() {
  const [config, setConfig] = useAtom(litlyticsConfigStore);
  const models = useMemo(() => LLMModelsList[config.provider], [config]);

  return (
    <div className="max-w-full">
      <FieldGroup>
        <Field>
          <Label>Provider</Label>
          <Select
            value={config.provider}
            onChange={(e) =>
              setConfig((c) => ({
                ...c,
                provider: e.target.value as LLMProviders,
                model: models[0],
                llmKey: '',
              }))
            }
          >
            {LLMProvidersList.map((prov) => (
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
            {models.map((model) => (
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

      {!config.llmKey?.length && (
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
                Choose a provider, model and set a key for the provider of your
                choice to get started!
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
