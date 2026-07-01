import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type ResolverContext, type SecretDefaults } from "./runtime-shared.js";
/** Collects SecretRef assignments from core-owned config surfaces. */
/** Collects SecretRef assignments from core non-plugin config surfaces. */
export declare function collectCoreConfigAssignments(params: {
    config: OpenClawConfig;
    defaults: SecretDefaults | undefined;
    context: ResolverContext;
}): void;
