import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { DoctorPrompter } from "./doctor-prompter.js";
import { type LegacyOAuthRef } from "./doctor/shared/legacy-oauth-sidecar.js";
type LegacyOAuthSidecarRepairResult = {
    detected: string[];
    changes: string[];
    warnings: string[];
};
/**
 * Migrates legacy Codex OAuth sidecar secrets back into inline auth profile credentials.
 *
 * Only sidecar files that were successfully imported and are not referenced by another failed
 * profile are removed; unreferenced sidecars stay because unknown agent directories may use them.
 */
export declare function maybeRepairLegacyOAuthSidecarProfiles(params: {
    cfg: OpenClawConfig;
    prompter: Pick<DoctorPrompter, "confirmAutoFix">;
    now?: () => number;
    emitNotes?: boolean;
    env?: NodeJS.ProcessEnv;
}): Promise<LegacyOAuthSidecarRepairResult>;
export declare const testing: {
    buildLegacyOAuthSecretAad: (params: {
        ref: LegacyOAuthRef;
        profileId: string;
        provider: string;
    }) => Buffer;
    buildLegacyOAuthSecretKey: (seed: string) => Buffer;
};
export {};
