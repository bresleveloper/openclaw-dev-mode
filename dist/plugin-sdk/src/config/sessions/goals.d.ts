import type { SessionEntry, SessionGoal, SessionGoalStatus } from "./types.js";
export type SessionGoalSnapshot = {
    status: "missing" | "found";
    goal?: SessionGoal;
};
type SessionGoalStoreOptions = {
    sessionKey: string;
    storePath?: string;
    now?: number;
    fallbackEntry?: SessionEntry;
    persist?: boolean;
};
type CreateSessionGoalOptions = SessionGoalStoreOptions & {
    objective: string;
    tokenBudget?: number;
};
type UpdateSessionGoalStatusOptions = SessionGoalStoreOptions & {
    status: Extract<SessionGoalStatus, "active" | "paused" | "blocked" | "complete">;
    note?: string;
};
export declare const MODEL_UPDATABLE_SESSION_GOAL_STATUSES: readonly ["complete", "blocked"];
export declare function resolveSessionGoalDisplayState(entry: Pick<SessionEntry, "goal" | "totalTokens" | "totalTokensFresh">, now?: number, options?: {
    adoptFreshBaseline?: boolean;
}): SessionGoal | undefined;
export declare function formatSessionGoalStatus(goal: SessionGoal | undefined): string;
export declare function getSessionGoal(options: SessionGoalStoreOptions): Promise<SessionGoalSnapshot>;
export declare function createSessionGoal(options: CreateSessionGoalOptions): Promise<SessionGoal>;
export declare function updateSessionGoalStatus(options: UpdateSessionGoalStatusOptions): Promise<SessionGoal>;
export declare function clearSessionGoal(options: SessionGoalStoreOptions): Promise<boolean>;
export {};
