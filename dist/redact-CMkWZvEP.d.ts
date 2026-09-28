import "./types.openclaw-LzSbb55e.js";
//#region src/logging/redact-pattern-runtime.d.ts
declare function readRedactMatch(args: unknown[]): {
  match: string;
  groups: string[];
  input: string;
  offset: number;
};
type RedactMatch = ReturnType<typeof readRedactMatch> & {
  replacement?: string;
};
/**
 * Programmatic synchronous rule; never serialized into logging.redactPatterns.
 * Each call uses its current input and fresh local state. Yield nonempty exact
 * matches in order without overlap, with UTF-16 offsets and that same input.
 * groups uses "" for unmatched captures; the last nonempty capture selects the
 * secret's last occurrence in match, or an empty array selects the whole match.
 * replacement carries a fixed policy mask; absent values use the caller's token hints.
 */
type RedactMatcher = {
  readonly source: string;
  readonly exec: (text: string) => Iterable<RedactMatch>;
  readonly createContext?: () => {
    pattern: ResolvedRedactPattern;
    /** Prepend one complete, newline-bounded source block; true means older input cannot matter. */
    prepend: () => {
      consume: (text: string) => void;
      finish: () => boolean;
    };
  };
};
type ResolvedRedactPattern = RegExp | RedactMatcher;
type RedactPattern = string | ResolvedRedactPattern;
//#endregion
//#region src/logging/redact.d.ts
type RedactSensitiveMode = "off" | "tools";
type RedactOptions = {
  mode?: RedactSensitiveMode;
  patterns?: readonly RedactPattern[];
  sensitiveFieldPatterns?: readonly RedactPattern[];
};
declare function redactSensitiveText(text: string, options?: RedactOptions): string;
declare function redactToolPayloadText(text: string): string;
declare function redactSensitiveFieldValue(key: string, value: string, options?: RedactOptions): string;
//#endregion
export { redactSensitiveText as n, redactToolPayloadText as r, redactSensitiveFieldValue as t };