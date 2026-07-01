import { readFileSync, appendFileSync } from "node:fs";

/**
 * Read the last N lines from a JSONL log file.
 * Each line is JSON-parsed; unparseable lines are returned as { raw: line }.
 * Returns [] if the file does not exist.
 * @param {string} logPath
 * @param {number} limit
 * @returns {object[]}
 */
export function readLogTail(logPath, limit = 30) {
  let raw;
  try {
    raw = readFileSync(logPath, "utf8");
  } catch {
    return [];
  }
  const lines = raw.split("\n").filter((l) => l.trim() !== "");
  const tail = lines.slice(-limit);
  return tail
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return { raw: line };
      }
    })
    .reverse();
}

/**
 * Append a JSON log entry to the log file.
 * @param {string} logPath
 * @param {string} level
 * @param {string} fn
 * @param {string} message
 * @param {object} [extra]
 */
export function logToFile(logPath, level, fn, message, extra) {
  try {
    const entry = JSON.stringify({
      ts: new Date().toISOString(),
      level,
      fn,
      message,
      ...extra,
    });
    appendFileSync(logPath, entry + "\n");
  } catch {
    // logging must never crash the panel
  }
}
