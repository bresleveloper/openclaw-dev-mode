import type { TUI } from "@earendil-works/pi-tui";
import type { SessionsPatchResult } from "../../packages/gateway-protocol/src/index.js";
import type { ChatLog } from "./components/chat-log.js";
import type { TuiAgentsList, TuiBackend, TuiSessionMutationResult } from "./tui-backend.js";
import type { SessionInfo, TuiOptions, TuiStateAccess } from "./tui-types.js";
type SessionActionBtwPresenter = {
    clear: () => void;
};
type SessionActionContext = {
    client: TuiBackend;
    chatLog: ChatLog;
    btw: SessionActionBtwPresenter;
    tui: TUI;
    opts: TuiOptions;
    state: TuiStateAccess;
    agentNames: Map<string, string>;
    initialSessionInput: string;
    initialSessionAgentId: string | null;
    resolveSessionKey: (raw?: string) => string;
    updateHeader: () => void;
    updateFooter: () => void;
    updateAutocompleteProvider: () => void;
    setActivityStatus: (text: string) => void;
    clearLocalRunIds?: () => void;
    rememberSessionKey?: (sessionKey: string) => void | Promise<void>;
    emptySessionInfoDefaults?: SessionInfo;
};
export declare function createSessionActions(context: SessionActionContext): {
    applyAgentsResult: (result: TuiAgentsList) => void;
    refreshAgents: () => Promise<void>;
    refreshSessionInfo: () => Promise<void>;
    applySessionInfoFromPatch: (result?: SessionsPatchResult | TuiSessionMutationResult | null) => void;
    applySessionMutationResult: (result?: TuiSessionMutationResult | null) => boolean;
    loadHistory: () => Promise<void>;
    setSession: (rawKey: string) => Promise<void>;
    setEmptySession: (rawKey: string) => Promise<void>;
    abortActive: (params?: {
        preferActive?: boolean;
    }) => Promise<void>;
};
export {};
