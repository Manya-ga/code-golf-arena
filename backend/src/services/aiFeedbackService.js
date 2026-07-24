// Integration boundary for concise Claude-powered feedback generation.
import { env } from '../config/env.js';

const API_URL = 'https://api.anthropic.com/v1/messages';

export const aiFeedbackService = {
  isConfigured: () => Boolean(env.anthropicApiKey && env.anthropicApiKey !== 'replace_me'),

  generate: async ({ sourceCode, language, judgeStatus, compilerOutput }) => {
    if (!aiFeedbackService.isConfigured()) {
      throw new Error('AI feedback is not configured.');
    }

    const prompt = [
      'You are a concise code-golf coach. Give up to three practical improvement suggestions.',
      `Language: ${language}`,
      `Judge result: ${judgeStatus}`,
      compilerOutput ? `Compiler output: ${compilerOutput}` : null,
      'Code:',
      sourceCode,
    ]
      .filter(Boolean)
      .join('\n\n');

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': env.anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: AbortSignal.timeout(20_000),
    });
    const body = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(body?.error?.message ?? `Claude returned HTTP ${response.status}.`);
    }

    const text = body?.content?.find((item) => item.type === 'text')?.text?.trim();
    if (!text) throw new Error('Claude returned no feedback text.');
    return text;
  },
};
