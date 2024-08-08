import { NextRequest, NextResponse } from 'next/server';
import { defaultModelArgs } from './config';
import { executeOnLLM } from './llm';

export async function POST(request: NextRequest) {
  // get prompt
  const body = await request.json();
  const { system, user, args } = body;

  const response = await executeOnLLM({
    system,
    user,
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
