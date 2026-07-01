import type { CompactEmbeddedAgentSessionParams } from "../embedded-agent-runner/compact.types.js";
import type { EmbeddedAgentCompactResult } from "../embedded-agent-runner/types.js";
type NativeCompactionRequest = "after_context_engine";
type InternalAgentHarnessCompactionOptions = {
    nativeCompactionRequest?: NativeCompactionRequest;
};
/** Runs harness-provided compaction when the selected runtime supports it. */
export declare function maybeCompactAgentHarnessSession(params: CompactEmbeddedAgentSessionParams, options?: InternalAgentHarnessCompactionOptions): Promise<EmbeddedAgentCompactResult | undefined>;
export {};
