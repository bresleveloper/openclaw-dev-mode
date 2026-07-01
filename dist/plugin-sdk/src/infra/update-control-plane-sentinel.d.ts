import { type RestartSentinelPayload } from "./restart-sentinel.js";
import { type UpdateRestartSentinelMeta } from "./update-restart-sentinel-payload.js";
import type { UpdateRunResult } from "./update-runner.js";
export declare const CONTROL_PLANE_UPDATE_SENTINEL_META_ENV = "OPENCLAW_CONTROL_PLANE_UPDATE_SENTINEL_META";
export declare const CONTROL_PLANE_UPDATE_HANDOFF_STARTED_REASON = "managed-service-handoff-started";
export declare const CONTROL_PLANE_UPDATE_RESTART_HEALTH_PENDING_REASON = "restart-health-pending";
export type ControlPlaneUpdateSentinelMetaFile = {
    version: 1;
    meta: UpdateRestartSentinelMeta;
};
/** Convert an update result into the restart-health-pending sentinel result. */
export declare function buildControlPlaneUpdateRestartHealthPendingResult(result: UpdateRunResult): UpdateRunResult;
/** Return true when an update sentinel represents an in-progress control-plane restart. */
export declare function isPendingControlPlaneUpdateRestartSentinel(payload: RestartSentinelPayload): boolean;
/** Read update sentinel routing metadata from the configured handoff file. */
export declare function readControlPlaneUpdateSentinelMeta(env?: NodeJS.ProcessEnv): Promise<UpdateRestartSentinelMeta | null>;
/** Write an update restart sentinel with control-plane routing metadata. */
export declare function writeControlPlaneUpdateRestartSentinel(params: {
    result: UpdateRunResult;
    meta: UpdateRestartSentinelMeta;
}): Promise<void>;
/** Mark the pending update restart sentinel as failed. */
export declare function markControlPlaneUpdateRestartSentinelFailure(reason: string): Promise<RestartSentinelPayload | null>;
