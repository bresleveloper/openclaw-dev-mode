/** Cleanup helpers for failed ACP spawn flows. */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
/** Minimal runtime handle needed to close a just-created session during failed spawn cleanup. */
export type AcpSpawnRuntimeCloseHandle = {
    runtime: {
        close: (params: {
            handle: {
                sessionKey: string;
                backend: string;
                runtimeSessionName: string;
            };
            reason: string;
        }) => Promise<void>;
    };
    handle: {
        sessionKey: string;
        backend: string;
        runtimeSessionName: string;
    };
};
/** Best-effort cleanup for partially created ACP sessions, bindings, and transcripts. */
export declare function cleanupFailedAcpSpawn(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    shouldDeleteSession: boolean;
    deleteTranscript: boolean;
    runtimeCloseHandle?: AcpSpawnRuntimeCloseHandle;
}): Promise<void>;
