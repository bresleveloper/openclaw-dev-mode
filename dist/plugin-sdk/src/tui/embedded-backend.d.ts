import type { SessionsPatchResult } from "../../packages/gateway-protocol/src/index.js";
import type { ChatSendOptions, TuiAgentsList, TuiBackend, TuiChatSendResult, TuiEvent, TuiModelChoice, TuiSessionList } from "./tui-backend.js";
export declare class EmbeddedTuiBackend implements TuiBackend {
    readonly connection: {
        url: string;
    };
    onEvent?: (evt: TuiEvent) => void;
    onConnected?: () => void;
    onDisconnected?: (reason: string) => void;
    onGap?: (info: {
        expected: number;
        received: number;
    }) => void;
    private readonly deps;
    private readonly runs;
    private readonly runPromises;
    private unsubscribe?;
    private previousRuntimeLog?;
    private previousRuntimeError?;
    private seq;
    private readonly pendingLifecycleErrors;
    private ready;
    start(): void;
    stop(): Promise<void>;
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
    }): Promise<{
        sessionKey: string;
        sessionId: string | undefined;
        messages: unknown[];
        defaults: import("../gateway/session-utils.types.ts").GatewaySessionsDefaults;
        sessionInfo: import("../gateway/session-utils.types.ts").GatewaySessionRow;
        thinkingLevel: string;
        fastMode: import("@openclaw/normalization-core").FastMode | undefined;
        verboseLevel: string | undefined;
        runtimePluginsPrewarm: {
            status: "warmed";
        } | {
            status: "failed";
            error: string;
        };
    }>;
    listSessions(opts?: Parameters<TuiBackend["listSessions"]>[0]): Promise<TuiSessionList>;
    listAgents(): Promise<TuiAgentsList>;
    patchSession(opts: Parameters<TuiBackend["patchSession"]>[0]): Promise<SessionsPatchResult>;
    resetSession(key: string, reason?: "new" | "reset", opts?: {
        agentId?: string;
    }): Promise<{
        ok: true;
        key: string;
        entry: import("../config/sessions.js").SessionEntry;
    }>;
    private runBtwTurn;
    getGatewayStatus(): Promise<string>;
    listModels(): Promise<TuiModelChoice[]>;
    runGoalCommand(opts: Parameters<NonNullable<TuiBackend["runGoalCommand"]>>[0]): Promise<{
        text: string;
    }>;
    private findQueuedSessionRunPromise;
    private abortSessionRuns;
    private hasAbortableSessionRun;
    private isSameRunScope;
    private isAbortableRun;
    private nextSeq;
    private emit;
    private clearPendingLifecycleError;
    private clearPendingLifecycleErrors;
    private scheduleChatError;
    private emitChatDelta;
    private emitChatFinal;
    private emitChatAborted;
    private emitChatError;
    private ensureRunRegistered;
    private handleAgentEvent;
    private runTurn;
}
