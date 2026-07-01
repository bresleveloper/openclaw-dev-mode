import type { OpenClawConfig } from "./types.js";
/** Default maximum concurrent top-level agent runs. */
export declare const DEFAULT_AGENT_MAX_CONCURRENT = 4;
/** Default maximum concurrent child-agent runs across subagent execution. */
export declare const DEFAULT_SUBAGENT_MAX_CONCURRENT = 8;
/** Default maximum direct children a single agent run may spawn. */
export declare const DEFAULT_SUBAGENT_MAX_CHILDREN_PER_AGENT = 5;
/** Default age before completed subagent state is archived. */
export declare const DEFAULT_SUBAGENT_ARCHIVE_AFTER_MINUTES = 60;
export declare const DEFAULT_SUBAGENT_MAX_SPAWN_DEPTH = 1;
/** Resolves top-level agent concurrency, flooring finite values and clamping to at least one. */
export declare function resolveAgentMaxConcurrent(cfg?: OpenClawConfig): number;
/** Resolves subagent concurrency, flooring finite values and clamping to at least one. */
export declare function resolveSubagentMaxConcurrent(cfg?: OpenClawConfig): number;
