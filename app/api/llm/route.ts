import { defaultModelArgs } from '@/src/llm/config';
import { executeOnLLM, executeOnLLMWithJSON } from '@/src/llm/llm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // get prompt
  const body = await request.json();
  const { messages, args, response_format } = body;

  if (response_format) {
    const response = await executeOnLLMWithJSON({
      messages,
      modelArgs: {
        ...defaultModelArgs,
        ...(args ?? {}),
      },
      response_format,
    });

    return NextResponse.json(response);
  }

  const response = await executeOnLLM({
    messages,
    modelArgs: {
      ...defaultModelArgs,
      ...(args ?? {}),
    },
  });
  return NextResponse.json(response);
}

export const dynamic = 'force-dynamic';
