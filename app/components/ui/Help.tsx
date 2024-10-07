import { CustomMarkdown } from '../markdown/Markdown';

export function Help() {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-full">
      <CustomMarkdown>
        {`LitLytics is an affordable, simple analytics platform for everyone designed to streamline the process of working with complex datasets.
By combining LLMs with javascript, LitLytics allows you to generate complete data processing pipelines based on natural language descriptions.

With LitLytics, you can transform data, extract insights, and automate routine tasks without having to write any code.
Just describe the task in plain language, and LitLytics will handle the rest – from parsing and cleaning data to generating output in structured formats.

You can find examples in the repository in the [examples folder](https://github.com/yamalight/litlytics/tree/main/examples).`}
      </CustomMarkdown>
    </div>
  );
}
