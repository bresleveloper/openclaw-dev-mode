import { note } from "../../packages/terminal-core/src/note.js";
import type { SessionEntry } from "../config/sessions.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { DoctorSessionRouteStateOwner } from "../plugins/doctor-session-route-state-owner-types.js";
type DoctorPrompterLike = {
    confirmRuntimeRepair: (params: {
        message: string;
        initialValue?: boolean;
        requiresInteractiveConfirmation?: boolean;
    }) => Promise<boolean>;
    note?: typeof note;
};
/** Resolves the currently configured provider/model/runtime route for a session key. */
export declare function resolveConfiguredDoctorSessionStateRoute(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    env?: NodeJS.ProcessEnv;
}): DoctorSessionRouteState;
/** Fast prefilter for session stores that might contain plugin-owned routing state. */
export declare function storeMayContainPluginSessionRouteState(store: Record<string, SessionEntry>): boolean;
type DoctorSessionRouteState = {
    defaultProvider: string;
    configuredModelRefs: string[];
    runtime?: string;
};
type DoctorSessionRouteStateRepair = {
    key: string;
    ownerId: string;
    ownerLabel: string;
    reasons: string[];
    pinnedRuntimeKeys: string[];
    cliSessionKeys: string[];
};
type DoctorSessionRouteStateManualReview = {
    key: string;
    ownerLabel: string;
    message: string;
};
type DoctorSessionRouteStateScan = {
    repairs: DoctorSessionRouteStateRepair[];
    manualReview: DoctorSessionRouteStateManualReview[];
};
/** Scans session entries for state owned by plugins that no longer match the configured route. */
export declare function scanSessionRouteStateOwners(params: {
    owners: readonly DoctorSessionRouteStateOwner[];
    store: Record<string, Record<string, unknown>>;
    routes: Record<string, DoctorSessionRouteState>;
}): DoctorSessionRouteStateScan;
/** Clears stale plugin-owned routing fields from a session entry and refreshes updatedAt. */
export declare function applySessionRouteStateRepair(params: {
    entry: Record<string, unknown>;
    repair: DoctorSessionRouteStateRepair;
    now: number;
}): boolean;
/** Prompts for and applies plugin-owned session route state repairs to the session store. */
export declare function runPluginSessionStateDoctorRepairs(params: {
    cfg: OpenClawConfig;
    store: Record<string, SessionEntry>;
    absoluteStorePath: string;
    prompter: DoctorPrompterLike;
    env?: NodeJS.ProcessEnv;
    warnings: string[];
    changes: string[];
}): Promise<void>;
export {};
