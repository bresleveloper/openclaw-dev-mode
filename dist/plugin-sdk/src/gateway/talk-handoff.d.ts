import { type TalkBrain, type TalkEvent, type TalkMode, type TalkSessionController, type TalkTransport } from "../talk/talk-session-controller.js";
/** Inputs captured when a gateway caller creates a managed Talk room. */
export type TalkHandoffCreateParams = {
    sessionKey: string;
    sessionId?: string;
    channel?: string;
    target?: string;
    provider?: string;
    model?: string;
    voice?: string;
    mode?: TalkMode;
    transport?: TalkTransport;
    brain?: TalkBrain;
    ttlMs?: number;
};
/** Private handoff state, including the hashed room token and event controller. */
export type TalkHandoffRecord = {
    id: string;
    roomId: string;
    roomUrl: string;
    tokenHash: string;
    sessionKey: string;
    sessionId?: string;
    channel?: string;
    target?: string;
    provider?: string;
    model?: string;
    voice?: string;
    mode: TalkMode;
    transport: TalkTransport;
    brain: TalkBrain;
    createdAt: number;
    expiresAt: number;
    room: TalkHandoffRoomState;
};
/** Public handoff shape returned to clients; never includes token material. */
export type TalkHandoffPublicRecord = Omit<TalkHandoffRecord, "tokenHash" | "room"> & {
    room: {
        activeClientId?: string;
        activeTurnId?: string;
        recentTalkEvents: TalkEvent[];
    };
};
export type TalkHandoffCreateResult = TalkHandoffPublicRecord & {
    token: string;
};
export type TalkHandoffJoinResult = {
    ok: true;
    record: TalkHandoffPublicRecord;
    events: TalkEvent[];
    replacedClientId?: string;
    replacementEvents: TalkEvent[];
    activeClientEvents: TalkEvent[];
} | {
    ok: false;
    reason: "not_found" | "expired" | "invalid_token";
};
export type TalkHandoffRevokeResult = {
    revoked: boolean;
    roomId?: string;
    activeClientId?: string;
    events: TalkEvent[];
};
export type TalkHandoffTurnResult = {
    ok: true;
    record: TalkHandoffPublicRecord;
    turnId: string;
    events: TalkEvent[];
} | {
    ok: false;
    reason: "not_found" | "expired" | "invalid_token" | "no_active_turn" | "stale_turn";
};
type TalkHandoffRoomState = {
    activeClientId?: string;
    talk: TalkSessionController;
};
/** Creates a short-lived Talk room and returns the only plaintext join token. */
export declare function createTalkHandoff(params: TalkHandoffCreateParams): TalkHandoffCreateResult;
/** Returns a non-expired handoff record for gateway-internal callers. */
export declare function getTalkHandoff(id: string): TalkHandoffRecord | undefined;
/** Joins a managed room, replacing any previous active client for that room. */
export declare function joinTalkHandoff(id: string, token: string, opts?: {
    clientId?: string;
}): TalkHandoffJoinResult;
/** Starts a client turn in a joined managed room. */
export declare function startTalkHandoffTurn(id: string, token: string, opts?: {
    turnId?: string;
    clientId?: string;
}): TalkHandoffTurnResult;
/** Ends the active managed-room turn and returns the emitted Talk event. */
export declare function endTalkHandoffTurn(id: string, token: string, opts?: {
    turnId?: string;
}): TalkHandoffTurnResult;
/** Cancels the active managed-room turn with a client-visible reason. */
export declare function cancelTalkHandoffTurn(id: string, token: string, opts?: {
    reason?: string;
    turnId?: string;
}): TalkHandoffTurnResult;
/** Revokes a handoff and emits the final room-close event if it existed. */
export declare function revokeTalkHandoff(id: string): TalkHandoffRevokeResult;
/** Verifies the caller token without exposing the stored token hash. */
export declare function verifyTalkHandoffToken(record: TalkHandoffRecord, token: string): boolean;
/** Clears process-local handoffs between tests. */
export declare function clearTalkHandoffsForTest(): void;
export {};
