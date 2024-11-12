import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { litlyticsAtom, pipelineAtom } from '~/store/store';
import { Button } from '../catalyst/button';
import { Input } from '../catalyst/input';
import { CustomMarkdown } from '../markdown/Markdown';
import { Spinner } from '../Spinner';
import { askAgent } from './logic/askAgent';
import { type Message } from './logic/types';

function MessageRender({ message }: { message: Message }) {
  if (message.from === 'user') {
    return (
      <div className="bg-neutral-100 dark:bg-neutral-900 p-2 rounded-xl w-fit self-end">
        {message.text}
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="w-fit">
        <span className="rounded-full border p-1 border-neutral-300 dark:border-neutral-700">
          🔥
        </span>
      </div>
      <div className="flex flex-1">
        <div className="prose dark:prose-invert">
          <CustomMarkdown>{message.text}</CustomMarkdown>
        </div>
      </div>
    </div>
  );
}

export function Chat() {
  const messageBoxRef = useRef<HTMLDivElement>(null);
  const litlytics = useAtomValue(litlyticsAtom);
  const setPipeline = useSetAtom(pipelineAtom);
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      from: 'assistant',
      text: `Hi! I'm Lit. Ask me to do anything for you.`,
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    // scroll to bottom
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTo({
        top: messageBoxRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const sendMessage = async () => {
    const inputMessage = input.trim();
    // do nothing if there's no user message
    if (!inputMessage.length) {
      return;
    }
    // reset input
    setInput('');
    // reset error
    setError(undefined);
    // append user message to messages
    const messagesWithUser: Message[] = [
      ...messages,
      {
        id: String(messages.length),
        from: 'user',
        text: inputMessage,
      },
    ];
    setMessages(messagesWithUser);

    // show loading state
    setLoading(true);
    // run new messages through agent
    try {
      const newMessages = await askAgent({
        messages: messagesWithUser,
        litlytics,
        setPipeline,
      });
      setMessages(newMessages);
    } catch (err) {
      // catch and display error
      setError(err as Error);
    }
    // disable loading state
    setLoading(false);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div
        ref={messageBoxRef}
        className="flex flex-1 flex-col gap-4 p-3 pt-20 max-h-screen overflow-auto"
      >
        {messages.map((m) => (
          <MessageRender key={m.id} message={m} />
        ))}
        {loading && (
          <div className="flex items-center justify-end gap-2">
            <Spinner className="h-5 w-5" /> Thinking...
          </div>
        )}
        {error && (
          <div className="flex items-center justify-between bg-red-400 dark:bg-red-700 rounded-xl py-1 px-2 my-2">
            Error while thinking: {error.message}
          </div>
        )}
      </div>
      <div className="flex items-center min-h-16 p-2">
        <Input
          wrapperClassName="h-fit after:hidden sm:after:focus-within:ring-2 sm:after:focus-within:ring-blue-500"
          className="rounded-r-none"
          placeholder="Ask Lit to do things for you"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
        />
        <Button
          className="h-9 rounded-l-none"
          title="Send"
          onClick={sendMessage}
        >
          <PaperAirplaneIcon />
        </Button>
      </div>
    </div>
  );
}
