import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { AuthProfileStore } from "./auth-profiles/types.js";
/**
 * Plans optional media-tool factory registration from config, policy, capabilities, and auth.
 */
type OptionalMediaToolFactoryPlan = {
    imageGenerate: boolean;
    videoGenerate: boolean;
    musicGenerate: boolean;
    pdf: boolean;
};
/** Returns true only when an allowlist explicitly enables the requested tool. */
export declare function isToolExplicitlyAllowedByFactoryPolicy(params: {
    toolName: string;
    allowlist?: string[];
    denylist?: string[];
}): boolean;
/** Merges factory policy lists while preserving stable unique entries. */
export declare function mergeFactoryPolicyList(...lists: Array<string[] | undefined>): string[] | undefined;
/** Returns whether the image understanding tool can be constructed for this agent context. */
export declare function resolveImageToolFactoryAvailable(params: {
    config?: OpenClawConfig;
    agentDir?: string;
    workspaceDir?: string;
    modelHasVision?: boolean;
    authStore?: AuthProfileStore;
}): boolean;
/** Resolves which optional media tools should be created for the current tool factory call. */
export declare function resolveOptionalMediaToolFactoryPlan(params: {
    config?: OpenClawConfig;
    workspaceDir?: string;
    authStore?: AuthProfileStore;
    toolAllowlist?: string[];
    toolDenylist?: string[];
}): OptionalMediaToolFactoryPlan;
export {};
