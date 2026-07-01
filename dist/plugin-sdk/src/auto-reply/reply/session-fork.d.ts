import { type SessionEntry } from "../../config/sessions/types.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
export type ParentForkDecision = {
    status: "fork";
    maxTokens: number;
    parentTokens?: number;
} | {
    status: "skip";
    reason: "parent-too-large";
    maxTokens: number;
    parentTokens: number;
    message: string;
};
type ParentForkDecisionParams = {
    parentEntry: SessionEntry;
    agentId?: string;
    config?: OpenClawConfig;
    storePath?: string;
};
type ForkSessionFromParentParams = {
    parentEntry: SessionEntry;
    agentId: string;
    config?: OpenClawConfig;
    sessionsDir?: string;
};
export type ForkedParentSessionEntry = {
    sessionId: string;
    sessionFile: string;
};
export type ForkSessionEntryFromParentResult = {
    status: "forked";
    fork: ForkedParentSessionEntry;
    parentEntry: SessionEntry;
    sessionEntry: SessionEntry;
    decision: Extract<ParentForkDecision, {
        status: "fork";
    }>;
} | {
    status: "skipped";
    reason: "existing-entry" | "decision-skip";
    parentEntry?: SessionEntry;
    sessionEntry: SessionEntry;
    decision?: ParentForkDecision;
} | {
    status: "missing-entry";
} | {
    status: "missing-parent";
} | {
    status: "failed";
};
export type ForkSessionEntryFromParentParams = Omit<ForkSessionFromParentParams, "parentEntry"> & {
    parentSessionKey: string;
    parentStoreKeys?: readonly string[];
    sessionKey: string;
    sessionStoreKeys?: readonly string[];
    storePath?: string;
    fallbackEntry?: SessionEntry;
    patch?: (params: {
        entry: SessionEntry;
        parentEntry: SessionEntry;
        fork: ForkedParentSessionEntry;
        decision: Extract<ParentForkDecision, {
            status: "fork";
        }>;
    }) => Partial<SessionEntry>;
    skipForkWhen?: (entry: SessionEntry) => boolean;
    skipPatch?: (entry: SessionEntry) => Partial<SessionEntry> | null;
    decisionSkipPatch?: (params: {
        decision: Extract<ParentForkDecision, {
            status: "skip";
        }>;
        entry: SessionEntry;
        parentEntry: SessionEntry;
    }) => Partial<SessionEntry> | null;
};
export declare function resolveParentForkDecision(params: ParentForkDecisionParams): Promise<ParentForkDecision>;
export declare function forkSessionFromParent(params: ForkSessionFromParentParams): Promise<{
    sessionId: string;
    sessionFile: string;
} | null>;
/**
 * Forks the parent transcript and persists the child session entry through one
 * storage boundary operation.
 */
export declare function forkSessionEntryFromParent(params: ForkSessionEntryFromParentParams): Promise<ForkSessionEntryFromParentResult>;
export {};
