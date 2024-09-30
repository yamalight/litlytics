# ToDo

- [ ] Add tests
- [ ] Extract analytics into separate config (to allow deploy-time setup)

## Road to OSS:

- [ ] Add a changelog
- [ ] Add API docs
- [ ] Setup github CI with docker builds
- [ ] Update docker image name
- [ ] Setup github CI for demo deployment (from docker image)
- [ ] Make first release (v0.1)

## Roadmap:

- Evaluate using https://github.com/xenova/transformers.js as local executor or fallback for when webgpu is not available
- Keybindings for undo-redo
- Add new url source
- Allow custom sources
- Parallel execution (allow merging nodes)

---

# LitLytics

**LitLytics** is an affordable, simple analytics platform that leverages LLMs to automate data analysis.
It was designed to help small and medium-sized businesses without dedicated data science teams gain insights from their data.

[Try LitLtyics](https://litlytics.codezen.dev)

## Key Features

- **No Data Science Expertise Required:** LitLytics simplifies the entire analytics process, making it accessible to anyone.
- **Automatic Pipeline Generation:** Describe your analytics task in plain language, and LitLytics will generate a custom pipeline for you.
- **Customizable Pipelines:** You can review, update, or modify each step in the analytics pipeline to suit your specific needs.
- **Cost-Efficient:** Leveraging modern LLMs allows LitLytics to keep the cost of processing data incredibly low — typically fractions of a cent per document.z
- **Scalable & Flexible:** Works with various data formats including CSV, PDF, and plain text.

Watch [the demo video](https://youtu.be/GHXn0l5qcr0) for more detailed intro.

## Running as a Docker container

Make sure you have [Docker](https://www.docker.com/) installed.

Then, start LitLytics from image by running following command:

```bash
docker run -d -p 5173:5173 litlytics/litlytics
```

This will launch the platform inside the docker container, and you will be able to interact with it on [http://localhost:5173](http://localhost:5173).

## Running locally in development mode

Make sure you have [Bun](https://bun.sh/) (>=1.1.0) installed.

Then, clone this repository:

```bash
git clone https://github.com/yamalight/litlytics.git
cd litlytics
```

Install dependencies:

```bash
bun install
```

And finally start the LitLytics platform:

```bash
bun run dev
```

This will launch the platform, and you will be able to interact with it on [http://localhost:5173](http://localhost:5173).

## Contributing

Contributions are welcome! If you’d like to contribute to LitLytics, please fork the repository and submit a pull request with your changes.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## License

This project is [licensed](/LICENSE.md) under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.
This license ensures that the software remains free and open, even when used as part of a network service. If you modify or distribute the project (including deploying it as a service), you must also make your changes available under the same license.

### Commercial/Enterprise Licensing

If your use case requires a proprietary license (for example, you do not wish to open-source your modifications or need a more flexible licensing arrangement), we offer **commercial and enterprise licenses**. Please [contact us](mailto:tim@codezen.dev) to discuss licensing options tailored to your needs.
