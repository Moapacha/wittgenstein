import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export async function ensureMinimaxApiKeyInteractive(): Promise<void> {
  if (process.env.WITTGENSTEIN_MINIMAX_API_KEY?.trim() || process.env.MINIMAX_API_KEY?.trim()) {
    return;
  }
  const rl = createInterface({ input, output });
  try {
    const key = (await rl.question("Minimax API key (text-only chat model): ")).trim();
    if (!key) {
      throw new Error("Minimax API key is required for --source minimax.");
    }
    process.env.WITTGENSTEIN_MINIMAX_API_KEY = key;
  } finally {
    rl.close();
  }
}
