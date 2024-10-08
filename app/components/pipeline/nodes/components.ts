import { UIComponents } from 'litlytics';
import { Button } from '~/components/catalyst/button';
import { Checkbox } from '~/components/catalyst/checkbox';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '~/components/catalyst/dialog';
import { Field, FieldGroup, Label } from '~/components/catalyst/fieldset';
import { Input } from '~/components/catalyst/input';
import { Textarea } from '~/components/catalyst/textarea';
import { CustomMarkdown } from '~/components/markdown/Markdown';
import { Spinner } from '~/components/Spinner';

export const components: UIComponents = {
  // manually cast to required type
  // required because actual component have pre-defined lists of values they can use
  // while our custom types only have generic types for said fields
  Button: Button as unknown as UIComponents['Button'],
  Checkbox: Checkbox as unknown as UIComponents['Checkbox'],
  CustomMarkdown: CustomMarkdown,
  Dialog: Dialog as unknown as UIComponents['Dialog'],
  DialogActions: DialogActions,
  DialogBody: DialogBody,
  DialogDescription: DialogDescription,
  DialogTitle: DialogTitle,
  Field: Field,
  FieldGroup: FieldGroup,
  Input: Input as unknown as UIComponents['Input'],
  Label: Label,
  Spinner: Spinner,
  Textarea: Textarea as unknown as UIComponents['Textarea'],
};
