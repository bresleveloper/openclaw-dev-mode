import type { note } from "../../packages/terminal-core/src/note.js";
import { type resolveSessionFilePathOptions } from "../config/sessions/paths.js";
import type { SessionEntry } from "../config/sessions/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
type DoctorPrompterLike = {
    confirmRuntimeRepair: (params: {
        message: string;
        initialValue?: boolean;
        requiresInteractiveConfirmation?: boolean;
    }) => Promise<boolean>;
    note?: typeof note;
};
type TranscriptHeartbeatSummary = {
    inspectedMessages: number;
    userMessages: number;
    heartbeatUserMessages: number;
    nonHeartbeatUserMessages: number;
    assistantMessages: number;
    heartbeatOkAssistantMessages: number;
};
type HeartbeatMainSessionRepairCandidate = {
    reason: "metadata" | "transcript";
    summary?: TranscriptHeartbeatSummary;
};
/**
 * Detects main-session entries that are safe to archive because they only contain heartbeat turns.
 *
 * Metadata ownership is preferred, but transcript inspection catches older stores that lack the
 * heartbeat isolation marker while still containing no human user messages.
 */
export declare function resolveHeartbeatMainSessionRepairCandidate(params: {
    entry: SessionEntry | undefined;
    transcriptPath?: string;
}): HeartbeatMainSessionRepairCandidate | null;
/** Moves a poisoned main-session entry to a recovery key without overwriting existing entries. */
export declare function moveHeartbeatMainSessionEntry(params: {
    store: Record<string, SessionEntry>;
    mainKey: string;
    recoveredKey: string;
}): boolean;
/** Removes TUI restore pointers that would reopen an archived heartbeat-owned main session. */
export declare function clearTuiLastSessionPointers(params: {
    filePath: string;
    sessionKeys: ReadonlySet<string>;
}): number;
/**
 * Prompts to archive a heartbeat-owned main session and clears stale TUI restore state.
 *
 * The session store is rechecked inside the update transaction so concurrent session activity
 * prevents moving a newly-human main session.
 */
export declare function repairHeartbeatPoisonedMainSession(params: {
    cfg: OpenClawConfig;
    store: Record<string, SessionEntry>;
    absoluteStorePath: string;
    stateDir: string;
    sessionPathOpts: ReturnType<typeof resolveSessionFilePathOptions>;
    prompter: DoctorPrompterLike;
    warnings: string[];
    changes: string[];
}): Promise<void>;
export {};
