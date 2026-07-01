import type { SessionEntry } from "../config/sessions/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Direct child session entry returned for parent session lookups. */
export type DirectChildSessionEntry = {
    sessionKey: string;
    entry: SessionEntry;
};
/** Returns true when a session store row is a direct child of the parent key. */
export declare function isDirectChildSessionEntry(params: {
    sessionKey: string;
    entry: SessionEntry | undefined;
    parentKey: string;
}): boolean;
/** Finds direct child sessions for a parent session across the combined gateway store. */
export declare function findDirectChildSessionsForParent(params: {
    cfg: OpenClawConfig;
    parentKey: string;
}): DirectChildSessionEntry[];
