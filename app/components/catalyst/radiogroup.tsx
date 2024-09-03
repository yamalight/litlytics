import { Radio, RadioGroup } from '@headlessui/react';
import clsx from 'clsx';

export function RadioHLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center">
      <div
        className={clsx(
          'w-10',
          'text-sm font-medium leading-6',
          'text-zinc-950 dark:text-white'
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function RadioHGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (newVal: string) => void;
}) {
  return (
    <RadioGroup
      value={value}
      onChange={onChange}
      className="grid grid-cols-2 gap-1"
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          value={option.value}
          className={clsx(
            'flex sm:flex-1 items-center justify-center',
            'min-w-fit cursor-default capitalize',
            'rounded-md bg-white hover:bg-gray-50 dark:bg-transparent hover:dark:bg-zinc-700',
            'px-1 py-1',
            'text-sm font-semibold uppercase text-zinc-950 dark:text-white',
            'border-zinc-950/10 dark:border-white/15',
            'data-[checked]:bg-zinc-600 dark:data-[checked]:bg-zinc-600 data-[checked]:text-white data-[checked]:ring-0',
            'data-[checked]:hover:bg-zinc-500 dark:data-[checked]:hover:bg-zinc-700',
            '[&:not([data-focus],[data-checked])]:ring-inset',
            'data-[focus]:data-[checked]:ring-2 data-[focus]:ring-2 data-[focus]:ring-zinc-600 data-[focus]:ring-offset-2'
          )}
        >
          {option.label}
        </Radio>
      ))}
    </RadioGroup>
  );
}

export function RadioH({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <fieldset
      className={clsx(
        className,
        'flex min-w-fit items-center justify-start gap-1'
      )}
    >
      {children}
    </fieldset>
  );
}
