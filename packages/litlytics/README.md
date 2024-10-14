# LitLytics

**LitLytics** is an affordable, simple analytics platform that leverages LLMs to automate data analysis.
It was designed to help teams without dedicated data scientists gain insights from their data.

This is a library that allows running pipelines in browser or server environments.

## Installing

Make sure you have npm-compatible package manager installed (e.g. [Bun](https://bun.sh/)).

Then, install LitLytics from [npm](https://npm.com/packages/litlytics) by running following command:

```bash
bun add litlytics
```

## Using litlytics package to run pipelines

Once you have library installed, you can run your pipeline configs like shown in [example](./example/run.ts) below:

```javascript
import { LitLytics, type Pipeline } from '../litlytics';
import pipeline from './pipeline.json';

// create new instance with provider/model of your choice
const litlytics = new LitLytics({
  provider: 'openai',
  model: 'gpt-4o-mini',
  key: process.env.OPENAI_API_KEY,
});
// set pipeline config
litlytics.setPipeline(pipeline);
// execute pipeline
const result = await litlytics.runPipeline();
// read results
console.log(result?.results);
```

## License

This project is [licensed](/LICENSE.md) under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.
This license ensures that the software remains free and open, even when used as part of a network service. If you modify or distribute the project (including deploying it as a service), you must also make your changes available under the same license.

### Commercial/Enterprise Licensing

If your use case requires a proprietary license (for example, you do not wish to open-source your modifications or need a more flexible licensing arrangement), we offer **commercial and enterprise licenses**. Please [contact us](mailto:tim@codezen.dev?subject=LitLytics%20License) to discuss licensing options tailored to your needs.
