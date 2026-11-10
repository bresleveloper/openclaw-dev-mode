import "./types-D7I_F5Ux.js";
import "./diagnostic-events-CMrJXSRl.js";
//#region src/infra/gateway-scheduler.d.ts
type GatewaySchedulerClock = {
  now: () => number;
  monotonicNow: () => number;
  arm: (run: () => void | Promise<void>, delayMs: number) => () => void;
};
type GatewayScheduledJob = {
  readonly atMs: number;
  cancel: () => void;
  stop: () => Promise<void>;
};
type ScheduleParams = {
  id: string;
  everyMs?: number;
  /** Best-effort work may run up to 10s early to share a stable maintenance phase. */
  phase?: "maintenance";
  /** Keep both pending clock deadlines when a stale read would postpone the wake. */
  mode?: "replace" | "earliest";
  run: () => void | Promise<unknown>;
} & ({
  atMs: number;
} | {
  delayMs: number;
});
type GatewaySchedulerScope = Pick<GatewayScheduler, "signal" | "now" | "schedule" | "beginClose" | "stop"> & {
  /** Preserve synchronous retirement when this owner has no running work. */
  close: () => Promise<void> | undefined;
};
/** Owns Gateway wakeups; stores and execution owners retain their deadlines and authority. */
declare class GatewayScheduler {
  private readonly clock;
  private readonly jobs;
  private readonly pending;
  private cancelTimer?;
  private dispatching;
  private timerGeneration;
  private readonly controller;
  constructor(options?: {
    clock?: GatewaySchedulerClock;
  });
  get signal(): AbortSignal;
  now(): number;
  get nextWakeAtMs(): number | null;
  /** Closes one owner's timers without retiring siblings or losing in-flight joins. */
  scope(): GatewaySchedulerScope;
  schedule(params: ScheduleParams): GatewayScheduledJob;
  private scheduleOwned;
  private cancel;
  beginClose(): void;
  stop(): Promise<void>;
  private remaining;
  private arm;
  private wake;
  private run;
}
//#endregion
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
type RedactContext = {
  pattern: ResolvedRedactPattern;
  /** Prepend one complete, newline-bounded source block; true means older input cannot matter. */
  prepend: () => {
    consume: (text: string) => void;
    finish: () => boolean;
  };
  /** Resolve the prepended history from its newline-boundary state (false at byte zero). */
  resolve: (active: boolean) => void;
  /** Return the state after a complete, newline-bounded window without changing pattern. */
  advance: (text: string) => boolean;
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
  readonly createContext?: () => RedactContext;
};
type ResolvedRedactPattern = RegExp | RedactMatcher;
type RedactPattern = string | ResolvedRedactPattern;
//#endregion
//#region src/logging/redact.d.ts
type RedactSensitiveMode = "off" | "tools";
type RedactOptions = {
  mode?: RedactSensitiveMode;
  patterns?: readonly RedactPattern[];
};
declare function redactSensitiveText(text: string, options?: RedactOptions): string;
declare function redactToolPayloadText(text: string): string;
declare function redactSensitiveFieldValue(key: string, value: string, options?: RedactOptions): string;
//#endregion
export { GatewayScheduler as a, GatewayScheduledJob as i, redactSensitiveText as n, redactToolPayloadText as r, redactSensitiveFieldValue as t };