import type { GlobalHookRunnerRegistry } from "./hook-registry.types.js";
import type { HookRunner } from "./hooks.js";
import type { PluginTrustedToolPolicyRegistryRegistration } from "./registry-types.js";
type TrustedPolicyHookRunnerRegistry = GlobalHookRunnerRegistry & {
    trustedToolPolicies?: PluginTrustedToolPolicyRegistryRegistration[];
};
export type HookRunnerGlobalState = {
    hookRunner: HookRunner | null;
    registry: TrustedPolicyHookRunnerRegistry | null;
};
export declare function getHookRunnerGlobalState(): HookRunnerGlobalState;
export declare function createComposedHookRegistryFacade(state: HookRunnerGlobalState): TrustedPolicyHookRunnerRegistry;
/** Get the composed registry that backs global hook dispatch. */
export declare function getGlobalHookRunnerRegistry(): TrustedPolicyHookRunnerRegistry | null;
export {};
