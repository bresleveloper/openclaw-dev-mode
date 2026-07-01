import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Default ordered profile files included in realtime bootstrap context. */
export declare const REALTIME_BOOTSTRAP_CONTEXT_FILE_NAMES: readonly ["IDENTITY.md", "USER.md", "SOUL.md"];
/** Profile file names allowed in realtime bootstrap context. */
export type RealtimeBootstrapContextFileName = (typeof REALTIME_BOOTSTRAP_CONTEXT_FILE_NAMES)[number];
/** Builds bounded realtime instructions from selected profile bootstrap files. */
export declare function resolveRealtimeBootstrapContextInstructions(params: {
    agentId: string;
    config: OpenClawConfig;
    files?: readonly RealtimeBootstrapContextFileName[];
    sessionKey?: string;
    warn?: (message: string) => void;
}): Promise<string | undefined>;
