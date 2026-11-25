import { t as EmbeddingUsage } from "./usage-cost-B-pDV9kv.js";
/**
 * Per-call channel for phases with their own budget, such as managed local-service
 * readiness. Symbol keys never serialize into provider requests or tool payloads.
 */
declare const EMBEDDING_DEADLINE_CONTROL: unique symbol;
type EmbeddingDeadlineControlAction = "pause" | "resume";
/**
 * Owned phases report; deadline owners subscribe. The control owner balances
 * concurrent phases: pause on 0→1 and resume on the final 1→0 transition.
 * Caller cancellation stays on the AbortSignal, outside this channel.
 */
type EmbeddingDeadlineControl = {
  report: (action: EmbeddingDeadlineControlAction) => void;
  subscribe: (listener: (action: EmbeddingDeadlineControlAction) => void) => () => void;
};
type EmbeddingDeadlineControlOptions = {
  [EMBEDDING_DEADLINE_CONTROL]?: EmbeddingDeadlineControl;
};
/** Input accepted by embedding providers, including multimodal inline-data parts. */
type EmbeddingInput = string | {
  text: string;
  parts?: Array<{
    type: "text";
    text: string;
  } | {
    type: "inline-data";
    mimeType: string;
    data: string;
  }>;
};
/** Per-call options passed to embedding provider calls. */
type EmbeddingProviderCallOptions = {
  signal?: AbortSignal;
  inputType?: "query" | "document" | "semantic" | "classification" | "clustering";
  /** The host applied an explicit query instruction; skip provider query templates. */
  queryInstructionApplied?: boolean;
  /** The host applied an explicit document format; skip provider document templates. */
  documentFormatApplied?: boolean;
  /** Report each successful upstream request before resolving; undefined means usage unavailable. */
  onUsage?: (usage: EmbeddingUsage | undefined) => void;
} & EmbeddingDeadlineControlOptions;
/** Runtime metadata returned with a created embedding provider. */
type EmbeddingProviderRuntime = {
  id: string;
  cacheKeyData?: Record<string, unknown>;
  /** Equivalent prior identities; alias cache reads require matching published index metadata. */
  indexIdentityAliases?: Array<{
    model: string;
    cacheKeyData: Record<string, unknown>;
  }>;
  inlineQueryTimeoutMs?: number;
  inlineBatchTimeoutMs?: number;
  /** Positive safe integer cap on simultaneous non-batch indexing jobs; omit for the host default. */
  inlineIndexConcurrency?: number;
} & Partial<EmbeddingProviderBatchRuntime>;
/** Provider-owned canonical identity and exact aliases for persisted indexes. */
type EmbeddingProviderIndexIdentity = {
  model: string;
  cacheKeyData: Record<string, unknown>;
  aliases?: Array<{
    model: string;
    cacheKeyData: Record<string, unknown>;
  }>;
};
/** Created embedding provider instance used by memory/search callers. */
type EmbeddingProvider = {
  id: string;
  model: string;
  dimensions?: number;
  maxInputTokens?: number;
  /** Positive safe integer cap for memory embedding requests; omit when the endpoint limit is unknown. */
  maxInputsPerRequest?: number;
  embed: (input: EmbeddingInput, options?: EmbeddingProviderCallOptions) => Promise<number[]>;
  embedBatch: (inputs: EmbeddingInput[], options?: EmbeddingProviderCallOptions) => Promise<number[][]>;
  close?: () => Promise<void> | void;
};
/** One text chunk submitted through a provider-owned asynchronous embedding batch. */
type EmbeddingBatchChunk = {
  text: string;
};
/** Host-controlled execution parameters for an asynchronous embedding batch. */
type EmbeddingBatchOptions = {
  agentId: string;
  chunks: EmbeddingBatchChunk[];
  /** The host applied an explicit document format; skip provider document templates. */
  documentFormatApplied?: boolean;
  wait: boolean;
  concurrency: number;
  pollIntervalMs: number;
  timeoutMs: number;
  debug: (message: string, data?: Record<string, unknown>) => void;
};
/** Provider-owned asynchronous batching capability, independent of host runtime metadata. */
type EmbeddingProviderBatchRuntime = {
  /** Returns one vector per chunk in input order, or null to use host fallback. */
  batchEmbed: (options: EmbeddingBatchOptions) => Promise<number[][] | null>;
  /** Only true enables batching across dirty files; false or omission retains per-file batches. */
  sourceWideBatchEmbed?: boolean;
};
export { EmbeddingProviderBatchRuntime as a, EmbeddingProvider as i, EmbeddingBatchOptions as n, EmbeddingProviderIndexIdentity as o, EmbeddingDeadlineControlOptions as r, EmbeddingProviderRuntime as s, EmbeddingBatchChunk as t };