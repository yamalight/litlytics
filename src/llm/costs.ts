export const modelCosts: Record<string, { input: number; output: number }> = {
  'gpt-4o-mini-2024-07-18': {
    input: 15 / 1000000, // $0.150 / 1M input tokens
    output: 60 / 1000000, // $0.600 / 1M output tokens
  },
};
