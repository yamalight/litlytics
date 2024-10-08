import type { ComponentProps } from 'react';

export type UIComponents = {
  Button: React.FC<
    ComponentProps<'button'> & {
      plain?: boolean;
      icon?: boolean;
      onClick?: () => void;
      className?: string;
    }
  >;
  Checkbox: React.FC<ComponentProps<'input'>>;
  CustomMarkdown: React.FC<ComponentProps<'div'>>;
  Dialog: React.FC<
    ComponentProps<'button'> & {
      open?: boolean;
      onClose: (value: boolean) => void;
      topClassName?: string;
      size?: string;
    }
  >;
  DialogActions: React.FC<ComponentProps<'div'>>;
  DialogBody: React.FC<ComponentProps<'div'>>;
  DialogDescription: React.FC<ComponentProps<'p'>>;
  DialogTitle: React.FC<ComponentProps<'h2'>>;
  Field: React.FC<ComponentProps<'div'>>;
  FieldGroup: React.FC<ComponentProps<'div'>>;
  Input: React.FC<ComponentProps<'input'>>;
  Label: React.FC<ComponentProps<'label'>>;
  Spinner: React.FC<
    ComponentProps<'div'> & {
      className?: string;
    }
  >;
  Textarea: React.FC<ComponentProps<'textarea'>>;
};
