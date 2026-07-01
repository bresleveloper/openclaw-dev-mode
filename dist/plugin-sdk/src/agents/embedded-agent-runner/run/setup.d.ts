/**
 * Resolves hook-selected model state and pre-model attachments for a run.
 */
import type { OpenClawConfig } from "../../../config/types.openclaw.js";
import type { ProviderRuntimeModel } from "../../../plugins/provider-runtime-model.types.js";
import type { PluginHookBeforeAgentStartResult, PluginHookBeforeModelResolveAttachment, PluginHookBeforeModelResolveEvent } from "../../../plugins/types.js";
import { type ContextWindowInfo } from "../../context-window-guard.js";
type HookContext = {
    agentId?: string;
    sessionKey?: string;
    sessionId: string;
    workspaceDir: string;
    messageProvider?: string;
    trigger?: string;
    channelId?: string;
};
type HookRunnerLike = {
    hasHooks(hookName: string): boolean;
    runBeforeModelResolve(input: PluginHookBeforeModelResolveEvent, context: HookContext): Promise<{
        providerOverride?: string;
        modelOverride?: string;
    } | undefined>;
    runBeforeAgentStart(input: {
        prompt: string;
    }, context: HookContext): Promise<PluginHookBeforeAgentStartResult | undefined>;
};
/**
 * Runs model-selection hooks before resolving the runtime model. The dedicated
 * `before_model_resolve` hook wins over legacy `before_agent_start` overrides
 * when both provide provider/model changes.
 */
export declare function resolveHookModelSelection(params: {
    prompt: string;
    attachments?: PluginHookBeforeModelResolveAttachment[];
    provider: string;
    modelId: string;
    hookRunner?: HookRunnerLike | null;
    hookContext: HookContext;
}): Promise<{
    provider: string;
    modelId: string;
    beforeAgentStartResult: PluginHookBeforeAgentStartResult | undefined;
}>;
/**
 * Converts prompt image refs into the minimal attachment shape exposed to
 * before-model-resolve hooks. Empty image lists stay undefined so hook payloads
 * do not grow a meaningless attachments field.
 */
export declare function buildBeforeModelResolveAttachments(images: readonly {
    mimeType?: string;
}[] | undefined): PluginHookBeforeModelResolveAttachment[] | undefined;
/**
 * Resolves context-window policy for the selected runtime model and returns the
 * model shape the session runtime should see. Configured context caps are
 * reflected in `effectiveModel.contextWindow` so auto-compaction uses the same
 * limit as the guard.
 */
export declare function resolveEffectiveRuntimeModel(params: {
    cfg: OpenClawConfig | undefined;
    provider: string;
    contextConfigProvider?: string;
    modelId: string;
    runtimeModel: ProviderRuntimeModel;
}): {
    ctxInfo: ContextWindowInfo;
    effectiveModel: ProviderRuntimeModel;
};
export {};
