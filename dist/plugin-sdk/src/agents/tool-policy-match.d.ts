import type { SandboxToolPolicy } from "./sandbox/types.js";
/** Return whether one tool name is allowed by a single sandbox policy. */
export declare function isToolAllowedByPolicyName(name: string, policy?: SandboxToolPolicy): boolean;
/** Return whether one tool name is allowed by every active sandbox policy. */
export declare function isToolAllowedByPolicies(name: string, policies: Array<SandboxToolPolicy | undefined>): boolean;
