/**
 * Applies runtime-plan or provider fallback tool schema policy. The helpers
 * normalize tool schemas, preserve owner metadata across cloned definitions,
 * and emit provider diagnostics.
 */
import type { TSchema } from "typebox";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ProviderRuntimePluginHandle } from "../../plugins/provider-hook-runtime.js";
import type { ProviderRuntimeModel } from "../../plugins/provider-runtime-model.types.js";
import type { AgentTool } from "../runtime/index.js";
import { type RuntimeToolSchemaDiagnostic } from "../tool-schema-projection.js";
import type { AgentRuntimePlan } from "./types.js";
type AgentRuntimeToolPolicyParams<TSchemaType extends TSchema = TSchema, TResult = unknown> = {
    runtimePlan?: AgentRuntimePlan;
    tools: AgentTool<TSchemaType, TResult>[];
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    modelId?: string;
    modelApi?: string | null;
    model?: ProviderRuntimeModel;
    runtimeHandle?: ProviderRuntimePluginHandle;
    allowProviderRuntimePluginLoad?: boolean;
    /**
     * Invoked on every normalization, including with an empty list, so
     * consumers can observe the all-clear and retire stale quarantine state.
     */
    onPreNormalizationSchemaDiagnostics?: (diagnostics: readonly RuntimeToolSchemaDiagnostic[], tools: readonly AgentTool<TSchemaType, TResult>[]) => void;
};
/** Normalizes tool schemas through a runtime plan or provider fallback policy. */
export declare function normalizeAgentRuntimeTools<TSchemaType extends TSchema = TSchema, TResult = unknown>(params: AgentRuntimeToolPolicyParams<TSchemaType, TResult>): AgentTool<TSchemaType, TResult>[];
/** Emits runtime-plan or provider fallback diagnostics for normalized tools. */
export declare function logAgentRuntimeToolDiagnostics(params: AgentRuntimeToolPolicyParams): void;
export {};
