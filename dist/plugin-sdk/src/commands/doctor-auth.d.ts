import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { DoctorPrompter } from "./doctor-prompter.js";
/** Emits a warning when legacy Codex transport overrides can shadow configured Codex OAuth. */
export declare function noteLegacyCodexProviderOverride(cfg: OpenClawConfig): void;
/** Returns the short doctor hint for disabled or cooldown auth profiles. */
export declare function resolveUnusableProfileHint(params: {
    kind: "cooldown" | "disabled";
    reason?: string;
}): string;
/** Formats provider OAuth refresh failures as actionable doctor note lines. */
export declare function formatOAuthRefreshFailureDoctorLine(params: {
    profileId: string;
    provider: string;
    message: string;
}): string | null;
/** Checks configured agent auth stores and emits doctor notes for stale or unusable profiles. */
export declare function noteAuthProfileHealth(params: {
    cfg: OpenClawConfig;
    prompter: DoctorPrompter;
    allowKeychainPrompt: boolean;
}): Promise<void>;
