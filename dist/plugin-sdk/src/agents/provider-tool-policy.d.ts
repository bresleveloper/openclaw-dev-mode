import type { ToolPolicyConfig } from "../config/types.tools.js";
export declare function normalizeToolProviderPolicyKey(value: string): string;
export declare function isCanonicalToolProviderPolicyKey(value: string): boolean;
type ProviderToolPolicyEntry = {
    key: string;
    policy: ToolPolicyConfig;
};
export declare function resolveProviderToolPolicyEntry(params: {
    byProvider?: Record<string, unknown>;
    modelProvider?: string;
    modelId?: string;
}): ProviderToolPolicyEntry | undefined;
export declare function resolveProviderToolPolicy(params: {
    byProvider?: Record<string, unknown>;
    modelProvider?: string;
    modelId?: string;
}): ToolPolicyConfig | undefined;
export {};
