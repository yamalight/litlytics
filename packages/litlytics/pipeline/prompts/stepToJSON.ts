export const stepToJSONPrompt = `You are an expert in converting text to JSON.

Your task is to convert given text description of the JSON representation of the step.
Steps should use following schema:
\`\`\`
interface ProcessingStep extends BaseStep {
  id: string;
  name: string;
  description: string;
  type: 'code' | 'llm';
  connectsTo: string[];
  input?: 'doc' | 'result' | 'aggregate-docs' | 'aggregate-results';
}
\`\`\``;
