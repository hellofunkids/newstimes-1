function normalize(word: string): string {
  return word.toLowerCase().replace(/[^a-z0-9']/g, "");
}

function tokenize(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

/**
 * Aligns target words against spoken words using LCS, so out-of-order or
 * extra words in the transcript don't cascade into false mismatches.
 */
function alignMatches(target: string[], spoken: string[]): boolean[] {
  const n = target.length;
  const m = spoken.length;
  const t = target.map(normalize);
  const s = spoken.map(normalize);

  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(m + 1).fill(0),
  );
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (t[i - 1] && t[i - 1] === s[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const matched = new Array(n).fill(false);
  let i = n;
  let j = m;
  while (i > 0 && j > 0) {
    if (t[i - 1] && t[i - 1] === s[j - 1]) {
      matched[i - 1] = true;
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  return matched;
}

export type ScoredWord = { text: string; matched: boolean };
export type ScoreResult = { words: ScoredWord[]; accuracy: number };

export function scoreTranscript(
  targetScript: string,
  transcript: string,
): ScoreResult {
  const targetWords = tokenize(targetScript);
  const spokenWords = tokenize(transcript);
  const matched = alignMatches(targetWords, spokenWords);
  const matchedCount = matched.filter(Boolean).length;

  return {
    words: targetWords.map((text, idx) => ({ text, matched: matched[idx] })),
    accuracy:
      targetWords.length === 0
        ? 0
        : Math.round((matchedCount / targetWords.length) * 100),
  };
}
