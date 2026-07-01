import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Asserts the generated Gateway auth token is both returned and persisted. */
export declare function expectGeneratedTokenPersistedToGatewayAuth(params: {
    generatedToken?: string;
    authToken?: string;
    persistedConfig?: OpenClawConfig;
}): void;
