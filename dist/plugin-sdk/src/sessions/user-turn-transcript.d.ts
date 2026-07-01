import type { AgentMessage } from "../../packages/agent-core/src/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PersistedUserTurnMediaInput, PersistedUserTurnMessage, UserTurnBeforeMessageWrite, UserTurnInput, UserTurnSessionEntry, UserTurnTranscriptPersistResult, UserTurnTranscriptRecorder, UserTurnTranscriptTargetResolver, UserTurnTranscriptUpdateMode } from "./user-turn-transcript.types.js";
export type { PersistedUserTurnMessage, UserTurnInput, UserTurnTranscriptRecorder, } from "./user-turn-transcript.types.js";
type AppendUserTurnTranscriptMessageParams = {
    transcriptPath: string;
    input?: UserTurnInput;
    message?: PersistedUserTurnMessage;
    sessionId?: string;
    agentId?: string;
    sessionKey?: string;
    cwd?: string;
    config?: OpenClawConfig;
    updateMode?: UserTurnTranscriptUpdateMode;
    beforeMessageWrite?: UserTurnBeforeMessageWrite;
};
type PersistUserTurnTranscriptParams = {
    input?: UserTurnInput;
    message?: PersistedUserTurnMessage;
    sessionId: string;
    sessionKey: string;
    sessionEntry: UserTurnSessionEntry | undefined;
    sessionStore?: Record<string, UserTurnSessionEntry>;
    storePath?: string;
    agentId: string;
    threadId?: string | number;
    cwd?: string;
    config?: unknown;
    updateMode?: UserTurnTranscriptUpdateMode;
    beforeMessageWrite?: UserTurnBeforeMessageWrite;
};
type UserTurnInputResolver = () => UserTurnInput | undefined | Promise<UserTurnInput | undefined>;
type CreateUserTurnTranscriptRecorderParams = {
    input?: UserTurnInput;
    message?: PersistedUserTurnMessage;
    resolveInput?: UserTurnInputResolver;
    target: UserTurnTranscriptTargetResolver;
    updateMode?: UserTurnTranscriptUpdateMode;
    beforeMessageWrite?: UserTurnBeforeMessageWrite;
    errorContext?: string;
    onPersistenceError?: (error: unknown) => void;
};
type ResolvePersistedUserTurnTextOptions = {
    hasMedia?: boolean;
};
type PersistedUserTurnMediaFieldSource = {
    MediaPath?: string | null;
    MediaPaths?: readonly (string | null | undefined)[] | null;
    MediaUrl?: string | null;
    MediaUrls?: readonly (string | null | undefined)[] | null;
    MediaType?: string | null;
    MediaTypes?: readonly (string | null | undefined)[] | null;
    MediaWorkspaceDir?: string | null;
};
export declare function resolvePersistedUserTurnText(value: string | null | undefined, options?: ResolvePersistedUserTurnTextOptions): string | undefined;
export declare function buildPersistedUserTurnMediaInputsFromFields(fields: PersistedUserTurnMediaFieldSource | null | undefined): PersistedUserTurnMediaInput[];
export declare function mergePreparedUserTurnMessageForRuntime(params: {
    runtimeMessage: AgentMessage;
    preparedMessage?: PersistedUserTurnMessage;
}): AgentMessage;
/** Applies before-message hooks while preserving user-turn transcript metadata. */
export declare function preparePersistedUserTurnMessageForTranscriptWrite(message: PersistedUserTurnMessage, params: Pick<AppendUserTurnTranscriptMessageParams, "agentId" | "sessionKey" | "beforeMessageWrite">): PersistedUserTurnMessage | undefined;
export declare function appendUserTurnTranscriptMessage(params: AppendUserTurnTranscriptMessageParams): Promise<{
    sessionFile: string;
    messageId: string;
    message: PersistedUserTurnMessage;
} | undefined>;
export declare function persistUserTurnTranscript(params: PersistUserTurnTranscriptParams): Promise<UserTurnTranscriptPersistResult | undefined>;
export declare function createUserTurnTranscriptRecorder(params: CreateUserTurnTranscriptRecorderParams): UserTurnTranscriptRecorder;
