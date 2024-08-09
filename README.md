- Insert 2 example docs
- Ask LLM to plan pipeline:
  I need to analyze a set of product reviews to get a list of common complaints.
- Preview results
- Ask LLM to generate a step 1: run sentiment analysis:
  Analyze sentiments of the product review.
- Preview results
- Ask LLM to generate mapping function that filters out negative docs
- Preview results
- Ask LLM to generate step 2: extract features from reviews
- Preview results
- Save pipeline

ToDo:

- Improve starting flow (create -> docs -> steps)
- Allow viewing steps data
- Allow iterating on pipeline and steps

Future ideas:

- Show cost estimate
