// Communicates only with the public Judge0 CE HTTP API; no gameplay logic belongs here.
import { env } from '../config/env.js';

const REQUEST_TIMEOUT_MS = 10_000;
const EXECUTION_TIMEOUT_MS = 30_000;
const POLL_INTERVAL_MS = 750;
const PROCESSING_STATUS_IDS = new Set([1, 2]);

export class Judge0ApiError extends Error {
  constructor(message, statusCode = 502) {
    super(message);
    this.name = 'Judge0ApiError';
    this.statusCode = statusCode;
  }
}

const buildUrl = (path, query = {}) => {
  const url = new URL(`${env.judge0BaseUrl}/${path.replace(/^\//, '')}`);

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  return url;
};

const requestJudge0 = async (path, { method = 'GET', body, query } = {}) => {
  let response;

  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    throw new Judge0ApiError(`Judge0 request failed: ${error.message}`);
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.error ?? payload?.message ?? `Judge0 returned HTTP ${response.status}.`;
    throw new Judge0ApiError(message, response.status);
  }

  return payload;
};

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

// Retrieves the available Judge0 language IDs and runtime names.
export const getLanguages = async () => requestJudge0('/languages');

// Sends source code to Judge0 and returns the queued submission token.
export const submitCode = async ({ sourceCode, languageId, stdin = '', expectedOutput }) => {
  const body = {
    source_code: sourceCode,
    language_id: languageId,
    stdin,
  };

  if (expectedOutput !== undefined) {
    body.expected_output = expectedOutput;
  }

  const submission = await requestJudge0('/submissions', {
    method: 'POST',
    body,
    query: { base64_encoded: false, wait: false },
  });

  if (!submission?.token) {
    throw new Judge0ApiError('Judge0 did not return a submission token.');
  }

  return submission.token;
};

// Retrieves the latest execution state for a Judge0 submission token.
export const getSubmission = async (token) =>
  requestJudge0(`/submissions/${encodeURIComponent(token)}`, {
    query: { base64_encoded: false },
  });

// Submits code and polls Judge0 until execution completes or the timeout expires.
export const executeCode = async ({ sourceCode, languageId, stdin = '', expectedOutput }) => {
  const token = await submitCode({ sourceCode, languageId, stdin, expectedOutput });
  const deadline = Date.now() + EXECUTION_TIMEOUT_MS;

  while (Date.now() < deadline) {
    const submission = await getSubmission(token);

    if (!PROCESSING_STATUS_IDS.has(submission.status?.id)) {
      return {
        token,
        stdout: submission.stdout,
        stderr: submission.stderr,
        compile_output: submission.compile_output,
        status: submission.status,
        time: submission.time,
        memory: submission.memory,
      };
    }

    await delay(POLL_INTERVAL_MS);
  }

  throw new Judge0ApiError('Judge0 execution timed out.', 504);
};
