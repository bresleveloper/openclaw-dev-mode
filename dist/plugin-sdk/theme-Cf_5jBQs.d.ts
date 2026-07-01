import { Command } from "commander";

//#region src/cli/cli-utils.d.ts
type ManagerLookupResult<T> = {
  manager: T | null;
  error?: string;
};
declare function withManager<T>(params: {
  getManager: () => Promise<ManagerLookupResult<T>>;
  onMissing: (error?: string) => void;
  run: (manager: T) => Promise<void>;
  close: (manager: T) => Promise<void>;
  onCloseError?: (err: unknown) => void;
}): Promise<void>;
declare function runCommandWithRuntime(runtime: {
  error: (message: string) => void;
  exit: (code: number) => void;
}, action: () => Promise<void>, onError?: (error: unknown) => void): Promise<void>;
//#endregion
//#region src/cli/help-format.d.ts
/** Command plus short description tuple used in help epilogues. */
type HelpExample = readonly [command: string, description: string];
/** Render help examples in stacked or inline comment style. */
declare function formatHelpExamples(examples: ReadonlyArray<HelpExample>, inline?: boolean): string;
//#endregion
//#region src/cli/parse-duration.d.ts
/** Options for choosing the unit used by bare numeric duration values. */
type DurationMsParseOptions = {
  defaultUnit?: "ms" | "s" | "m" | "h" | "d";
};
/** Parse a non-negative duration into milliseconds, supporting single and composite units. */
declare function parseDurationMs(raw: string, opts?: DurationMsParseOptions): number;
//#endregion
//#region packages/terminal-core/src/theme.d.ts
/** Shared terminal theme color functions. */
declare const theme: {
  readonly accent: import("chalk").ChalkInstance;
  readonly accentBright: import("chalk").ChalkInstance;
  readonly accentDim: import("chalk").ChalkInstance;
  readonly info: import("chalk").ChalkInstance;
  readonly success: import("chalk").ChalkInstance;
  readonly warn: import("chalk").ChalkInstance;
  readonly error: import("chalk").ChalkInstance;
  readonly muted: import("chalk").ChalkInstance;
  readonly heading: import("chalk").ChalkInstance;
  readonly command: import("chalk").ChalkInstance;
  readonly option: import("chalk").ChalkInstance;
};
/** Return true when color styling is active. */
declare const isRich: () => boolean;
/** Conditionally apply a color function based on caller rich-output state. */
declare const colorize: (rich: boolean, color: (value: string) => string, value: string) => string;
//#endregion
export { parseDurationMs as a, withManager as c, DurationMsParseOptions as i, isRich as n, formatHelpExamples as o, theme as r, runCommandWithRuntime as s, colorize as t };