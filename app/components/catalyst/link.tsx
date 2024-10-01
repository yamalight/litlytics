import * as Headless from '@headlessui/react';
import React, { forwardRef } from 'react';
// existing imports
import { Link as RemixLink, type LinkProps } from '@remix-run/react';

export const Link = forwardRef(function Link(
  props: LinkProps & React.ComponentPropsWithoutRef<'a'>,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  if ('href' in props) {
    return (
      <Headless.DataInteractive>
        <a {...props} ref={ref}>
          {props.children}
        </a>
      </Headless.DataInteractive>
    );
  }
  return (
    <Headless.DataInteractive>
      <RemixLink {...props} ref={ref} />
    </Headless.DataInteractive>
  );
});
