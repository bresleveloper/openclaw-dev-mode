import type { SandboxToolPolicy } from "./sandbox/types.js";
/** Provenance marker for wildcard allowlists created from `alsoAllow`. */
export declare const IMPLICIT_ALLOW_ALL_FROM_ALSO_ALLOW: unique symbol;
type SandboxToolPolicyConfig = {
    allow?: string[];
    alsoAllow?: string[];
    deny?: string[];
};
/** Picks the effective sandbox tool policy from allow/alsoAllow/deny config. */
export declare function pickSandboxToolPolicy(config?: SandboxToolPolicyConfig): SandboxToolPolicy | undefined;
export {};
