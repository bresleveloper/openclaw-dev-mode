/**
 * Shared media generation list/status actions.
 *
 * Builds provider list output, active-task status, and duplicate-guard responses for image/video/music tools.
 */
import { type MediaGenerationCatalogKind } from "../../../packages/media-generation-core/src/catalog.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { AuthProfileStore } from "../auth-profiles/types.js";
type MediaGenerateActionResult = {
    content: Array<{
        type: "text";
        text: string;
    }>;
    details: Record<string, unknown>;
};
type TaskStatusTextBuilder<Task> = (task: Task, params?: {
    duplicateGuard?: boolean;
}) => string;
type MediaGenerateProvider = {
    id: string;
    aliases?: string[];
    label?: string;
    defaultModel?: string;
    models?: readonly string[];
    capabilities: unknown;
    isConfigured?: (ctx: {
        cfg?: OpenClawConfig;
        agentDir?: string;
    }) => boolean;
};
/** Common tool result shape for media generation list/status actions. */
export type { MediaGenerateActionResult };
/** Builds a provider list result with config/auth status and synthetic catalog entries. */
export declare function createMediaGenerateProviderListActionResult<TProvider extends MediaGenerateProvider>(params: {
    kind: MediaGenerationCatalogKind;
    providers: TProvider[];
    emptyText: string;
    cfg?: OpenClawConfig;
    workspaceDir?: string;
    agentDir?: string;
    authStore?: AuthProfileStore;
    listModes: (provider: TProvider) => string[];
    summarizeCapabilities: (provider: TProvider) => string;
    formatAuthHint?: (provider: {
        id: string;
        authEnvVars: readonly string[];
    }) => string | undefined;
}): MediaGenerateActionResult;
/** Creates status action helpers for a media generation task type. */
export declare function createMediaGenerateTaskStatusActions<Task>(params: {
    inactiveText: string;
    findActiveTask: (sessionKey?: string) => Task | undefined;
    buildStatusText: TaskStatusTextBuilder<Task>;
    buildStatusDetails: (task: Task) => Record<string, unknown>;
}): {
    createStatusActionResult(sessionKey?: string): MediaGenerateActionResult;
};
/** Builds duplicate-guard status output for a media generation task type. */
export declare function createMediaGenerateDuplicateGuardResult<Task>(params: {
    sessionKey?: string;
    prompt?: string;
    requestKey?: string;
    findDuplicateTask: (sessionKey?: string, params?: {
        prompt?: string;
        requestKey?: string;
    }) => Task | undefined;
    buildStatusText: TaskStatusTextBuilder<Task>;
    buildStatusDetails: (task: Task) => Record<string, unknown>;
}): MediaGenerateActionResult | undefined;
