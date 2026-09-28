//#region src/decisions/types.d.ts
/** Typed decision contract, version 1. */
type JsonValue = null | boolean | number | string | readonly JsonValue[] | {
  readonly [key: string]: JsonValue;
};
type DecisionEntry = string | null | readonly JsonValue[] | {
  readonly [key: string]: JsonValue;
};
type DecisionQuestion = {
  readonly type: "choice";
  readonly instructions?: DecisionEntry;
  readonly criteria: Readonly<Record<string, DecisionEntry>>;
} | {
  readonly type: "score";
  readonly instructions?: DecisionEntry;
  readonly criteria: readonly DecisionEntry[];
} | {
  readonly type: "boolean";
  readonly instructions?: DecisionEntry;
  readonly criteria?: {
    readonly true?: DecisionEntry;
    readonly false?: DecisionEntry;
  } | null;
};
type DecisionBatch = {
  readonly state: DecisionEntry;
  readonly questions: Readonly<Record<string, DecisionQuestion>>;
};
type DecisionAnswer = {
  readonly type: "choice";
  /** Provider-reported label; not required to be the rounded distribution's argmax. */
  readonly choice: string;
  /** Provider-reported estimates in [0, 1]; rounding may make their sum differ from one. */
  readonly probabilities: Readonly<Record<string, number>>;
  /** Provider-specific distribution metric, not correctness probability. */
  readonly confidence?: number;
} | {
  readonly type: "score";
  /** Provider's fractional zero-based rubric estimate, bounded by its first and last positions. */
  readonly score: number;
  /** Index-aligned estimates in [0, 1]; may be rounded independently of the score. */
  readonly probabilities: readonly number[];
  readonly confidence?: number;
} | {
  readonly type: "boolean";
  readonly probabilityTrue: number;
};
type DecisionBatchResult = {
  /** Resolved vendor model identity, not a host conversational-model record. */
  readonly model: string;
  readonly answers: Readonly<Record<string, DecisionAnswer>>;
  readonly usage?: {
    readonly inputTokens?: number;
    readonly outputTokens?: number;
  };
};
type ProviderFailureReason = "credentials-unavailable" | "authentication" | "rate-limited" | "transport" | "unsupported-input" | "invalid-response";
type UnavailableReason = ProviderFailureReason | "disabled" | "not-configured" | "retiring" | "overloaded" | "circuit-open" | "deadline";
type ProviderDecisionOutcome = {
  readonly status: "ok";
  readonly result: DecisionBatchResult;
} | {
  readonly status: "unavailable";
  readonly reason: ProviderFailureReason;
  /** Validated and bounded by host; does not cause an automatic retry. */
  readonly retryAfterMs?: number;
};
type DecisionOutcome = {
  readonly status: "ok";
  readonly result: DecisionBatchResult;
  readonly provenance: {
    readonly providerId: string;
    readonly rubricVersion: string;
    /** Host-owned opaque identity; no secret values or SecretRef IDs. */
    readonly runtimeGeneration: string;
  };
} | {
  readonly status: "unavailable";
  readonly reason: UnavailableReason;
};
interface DecisionProviderV1 {
  readonly id: string;
  readonly contractVersion: 1;
  /** Prepared local credential availability only; must not perform I/O. */
  isReady?(): boolean;
  evaluate(batch: DecisionBatch, context: {
    /** Explicit model selected by the host's decisionModel role. */
    readonly model: string;
    readonly agentId?: string;
    /** Composed by host from caller, per-call deadline, and retirement. */
    readonly signal: AbortSignal;
    /** Deadline on the same process-local performance.now() time base. */
    readonly deadlineMonotonicMs: number;
  }): Promise<ProviderDecisionOutcome>;
}
/**
 * Supplied by the host, bound to its consumer's live authority/lifecycle.
 * Not a constructible global service or an unbound registry lookup.
 */
interface DecisionRuntimeV1 {
  evaluate(batch: DecisionBatch, options: {
    /** Omit for the default role; agent-owned work supplies its owner agent. */
    readonly agentId?: string;
    readonly purpose: string;
    readonly rubricVersion: string;
    readonly timeoutMs: number;
    readonly signal: AbortSignal;
  }): Promise<DecisionOutcome>;
}
//#endregion
export { DecisionOutcome as a, DecisionRuntimeV1 as c, ProviderFailureReason as d, UnavailableReason as f, DecisionEntry as i, JsonValue as l, DecisionBatch as n, DecisionProviderV1 as o, DecisionBatchResult as r, DecisionQuestion as s, DecisionAnswer as t, ProviderDecisionOutcome as u };