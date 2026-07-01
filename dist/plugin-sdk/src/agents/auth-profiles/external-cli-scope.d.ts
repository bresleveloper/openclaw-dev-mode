import type { OpenClawConfig } from "../../config/types.openclaw.js";
/** Provider/profile ids that may need external CLI auth discovery. */
export type ExternalCliAuthScope = {
    providerIds: string[];
    profileIds: string[];
};
/** Resolves external CLI auth discovery scope from configured auth/model surfaces. */
export declare function resolveExternalCliAuthScopeFromConfig(cfg: OpenClawConfig): ExternalCliAuthScope | undefined;
