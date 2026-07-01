import type { OpenClawConfig } from "../config/types.openclaw.js";
/**
 * Strip any leading `provider/` or `provider:` prefix from a model id so the
 * bare-name regex matching below works against `openai/gpt-5.4` and
 * `openai:gpt-5.4` the same way it does against `gpt-5.4`. Returns the bare
 * model id lowercased for comparison.
 *
 * Without this, auto-activation silently failed on prefixed model ids — a
 * user who configured `model: "openai/gpt-5.4"` in their agent config would
 * get the pre-PR-H looser default behavior because the regex only matched
 * bare names. The adversarial review in #64227 flagged this as a quality
 * gap on completion-gate criterion 1.
 */
export declare function stripProviderPrefix(modelId: string): string;
/**
 * Supported provider + model combinations where strict-agentic is the intended
 * runtime contract. Kept as a narrow helper so both the execution-contract
 * resolver and the `update_plan` auto-enable gate converge on the same
 * definition of "GPT-5-family OpenAI run". The embedded
 * `mock-openai` QA lane intentionally piggybacks on that contract so repo QA
 * can exercise the same incomplete-turn recovery rules end to end.
 */
export declare function isStrictAgenticSupportedProviderModel(params: {
    provider?: string | null;
    modelId?: string | null;
}): boolean;
export declare function isStrictAgenticExecutionContractActive(params: {
    config?: OpenClawConfig;
    sessionKey?: string;
    agentId?: string | null;
    provider?: string | null;
    modelId?: string | null;
}): boolean;
