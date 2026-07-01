import type { Component, TUI } from "@earendil-works/pi-tui";
import type { SessionsPatchResult } from "../../packages/gateway-protocol/src/index.js";
import type { ChatLog } from "./components/chat-log.js";
import type { TuiBackend, TuiSessionMutationResult } from "./tui-backend.js";
import type { TuiResult, TuiOptions, TuiStateAccess } from "./tui-types.js";
type CommandHandlerContext = {
    client: TuiBackend;
    chatLog: ChatLog;
    tui: TUI;
    opts: TuiOptions;
    state: TuiStateAccess;
    deliverDefault: boolean;
    openOverlay: (component: Component) => void;
    closeOverlay: () => void;
    refreshSessionInfo: () => Promise<void>;
    loadHistory: () => Promise<void>;
    setSession: (key: string) => Promise<void>;
    setEmptySession: (key: string) => Promise<void>;
    refreshAgents: () => Promise<void>;
    abortActive: (params?: {
        preferActive?: boolean;
    }) => Promise<void>;
    setActivityStatus: (text: string) => void;
    formatSessionKey: (key: string) => string;
    applySessionInfoFromPatch: (result: SessionsPatchResult) => void;
    applySessionMutationResult: (result?: TuiSessionMutationResult | null) => boolean;
    noteLocalRunId?: (runId: string) => void;
    noteLocalBtwRunId?: (runId: string) => void;
    forgetLocalRunId?: (runId: string) => void;
    forgetLocalBtwRunId?: (runId: string) => void;
    consumeCompletedRunForPendingSend?: (runId: string) => boolean;
    isRunObserved?: (runId: string) => boolean;
    flushPendingHistoryRefreshIfIdle?: () => void;
    runAuthFlow?: (params: {
        provider?: string;
    }) => Promise<{
        exitCode: number | null;
        signal: NodeJS.Signals | null;
    }>;
    requestExit: (result?: Partial<TuiResult>) => void;
};
export declare function createCommandHandlers(context: CommandHandlerContext): {
    handleCommand: (raw: string) => Promise<void>;
    sendMessage: (text: string) => Promise<void>;
    openModelSelector: () => Promise<void>;
    openAgentSelector: () => Promise<void>;
    openSessionSelector: () => Promise<void>;
    openSettings: () => void;
    setAgent: (id: string) => Promise<void>;
};
export {};
