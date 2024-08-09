import { NextRequest, NextResponse } from 'next/server';
import { defaultModelArgs } from './config';
import { executeOnLLM } from './llm';

export async function POST(request: NextRequest) {
  // get prompt
  const body = await request.json();
  const { messages, args } = body;

  const response = await executeOnLLM({
    messages,
    modelArgs: {
      ...defaultModelArgs,
      ...(args ?? {}),
    },
  });

  return NextResponse.json(response, {
    status: 200,
  });
}

export const dynamic = 'force-dynamic';
