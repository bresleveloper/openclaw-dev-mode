import { resolveContextTokensForModelFromCache as resolveContextTokensForModel } from "../agents/context-resolution.js";
import type { SessionEntry } from "../config/sessions/types.js";
import type { OpenClawConfig } from "../config/types.js";
import { classifySessionKind } from "../sessions/classify-session-kind.js";
declare function resolveConfiguredStatusModelRef(params: {
    cfg: OpenClawConfig;
    defaultProvider: string;
    defaultModel: string;
    agentId?: string;
}): {
    provider: string;
    model: string;
};
declare function resolveSessionModelRef(cfg: OpenClawConfig, entry?: SessionEntry | Pick<SessionEntry, "model" | "modelProvider" | "modelOverride" | "providerOverride">, agentId?: string): {
    provider: string;
    model: string;
};
declare function resolveSessionRuntimeLabel(params: {
    cfg: OpenClawConfig;
    entry?: SessionEntry;
    provider: string;
    model: string;
    agentId?: string;
    sessionKey: string;
}): string;
export declare const statusSummaryRuntime: {
    resolveContextTokensForModel: typeof resolveContextTokensForModel;
    classifySessionKey: typeof classifySessionKind;
    resolveSessionModelRef: typeof resolveSessionModelRef;
    resolveSessionRuntimeLabel: typeof resolveSessionRuntimeLabel;
    resolveConfiguredStatusModelRef: typeof resolveConfiguredStatusModelRef;
};
export {};
