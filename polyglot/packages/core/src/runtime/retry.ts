export interface RetryPolicy {
  maxAttempts: number;
  backoffMs: number;
}

export async function retryWithPolicy<T>(
  task: (attempt: number) => Promise<T>,
  policy: RetryPolicy,
  shouldRetry: (error: unknown) => boolean = () => true,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= policy.maxAttempts; attempt += 1) {
    try {
      return await task(attempt);
    } catch (error) {
      lastError = error;

      if (attempt === policy.maxAttempts || !shouldRetry(error)) {
        throw error;
      }

      await sleep(policy.backoffMs * attempt);
    }
  }

  throw lastError;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
