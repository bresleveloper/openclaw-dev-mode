import { type HelloOk, type CommandEntry, type CommandsListParams, type SessionsListParams, type SessionsPatchResult, type SessionsPatchParams } from "../../packages/gateway-protocol/src/index.js";
import type { ChatSendOptions, TuiAgentsList, TuiBackend, TuiEvent, TuiModelChoice, TuiSessionList, TuiSessionMutationResult, TuiChatSendResult } from "./tui-backend.js";
export type GatewayConnectionOptions = {
    url?: string;
    token?: string;
    password?: string;
};
export type GatewayEvent = TuiEvent;
type ResolvedGatewayConnection = {
    url: string;
    token?: string;
    password?: string;
    preauthHandshakeTimeoutMs?: number;
    allowInsecureLocalOperatorUi: boolean;
};
export type GatewaySessionList = TuiSessionList;
export type GatewayAgentsList = TuiAgentsList;
export type GatewayModelChoice = TuiModelChoice;
export declare class GatewayChatClient implements TuiBackend {
    private client;
    private readyPromise;
    private resolveReady?;
    readonly connection: ResolvedGatewayConnection;
    hello?: HelloOk;
    onEvent?: (evt: GatewayEvent) => void;
    onConnected?: () => void;
    onDisconnected?: (reason: string) => void;
    onGap?: (info: {
        expected: number;
        received: number;
    }) => void;
    constructor(connection: ResolvedGatewayConnection);
    static connect(opts: GatewayConnectionOptions): Promise<GatewayChatClient>;
    start(): void;
    stop(): void;
    subscribeSessionEvents(): Promise<Record<string, unknown>>;
    waitForReady(): Promise<void>;
    sendChat(opts: ChatSendOptions): Promise<TuiChatSendResult>;
    abortChat(opts: {
        sessionKey: string;
        agentId?: string;
        runId: string;
    }): Promise<{
        ok: boolean;
        aborted: boolean;
    }>;
    loadHistory(opts: {
        sessionKey: string;
        agentId?: string;
        limit?: number;
    }): Promise<Record<string, unknown>>;
    listSessions(opts?: SessionsListParams): Promise<TuiSessionList>;
    listAgents(): Promise<TuiAgentsList>;
    patchSession(opts: SessionsPatchParams): Promise<SessionsPatchResult>;
    resetSession(key: string, reason?: "new" | "reset", opts?: {
        agentId?: string;
    }): Promise<TuiSessionMutationResult>;
    getGatewayStatus(): Promise<Record<string, unknown>>;
    listModels(): Promise<GatewayModelChoice[]>;
    listCommands(opts?: CommandsListParams): Promise<CommandEntry[]>;
}
export declare function resolveGatewayConnection(opts: GatewayConnectionOptions): Promise<ResolvedGatewayConnection>;
export {};
