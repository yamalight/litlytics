import { type CoreTool, type LitLytics, type Pipeline } from 'litlytics';
import { RunPromptFromMessagesArgs } from 'litlytics/engine/runPrompt';

export interface Message {
  id: string;
  from: 'user' | 'assistant';
  text: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  create: ({
    litlytics,
    setPipeline,
    agentMessages,
    messages,
    resolve,
    reject,
  }: {
    litlytics: LitLytics;
    setPipeline: (p: Pipeline) => void;
    agentMessages: RunPromptFromMessagesArgs['messages'];
    messages: Message[];
    resolve: (m: Message[] | undefined) => void;
    reject: (reason: Error | string) => void;
  }) => CoreTool;
}
