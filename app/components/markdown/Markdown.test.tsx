import { render, screen } from '@testing-library/react';
import { expect, test } from 'bun:test';
import { CustomMarkdown } from './Markdown';

test('Renders basic markdown', () => {
  render(
    <CustomMarkdown>{`# Test title

Test text`}</CustomMarkdown>
  );
  const header = screen.getByText('Test title');
  expect(header).toBeInTheDocument();
  const paragraph = screen.getByText('Test text');
  expect(paragraph).toBeInTheDocument();
});
