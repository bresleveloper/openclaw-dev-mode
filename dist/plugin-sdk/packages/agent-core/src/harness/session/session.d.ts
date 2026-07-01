import type { ImageContent, TextContent } from "../../../../llm-core/src/index.js";
import type { AgentMessage } from "../../types.js";
import type { SessionContext, SessionMetadata, SessionStorage, SessionTreeEntry } from "../types.js";
/** Build model context from the active session branch and its latest state markers. */
export declare function buildSessionContext(pathEntries: SessionTreeEntry[]): SessionContext;
/** High-level session API backed by pluggable tree storage. */
export declare class Session<TMetadata extends SessionMetadata = SessionMetadata> {
    private storage;
    constructor(storage: SessionStorage<TMetadata>);
    getMetadata(): Promise<TMetadata>;
    getStorage(): SessionStorage<TMetadata>;
    getLeafId(): Promise<string | null>;
    private getAppendParentId;
    getEntry(id: string): Promise<SessionTreeEntry | undefined>;
    getEntries(): Promise<SessionTreeEntry[]>;
    getBranch(fromId?: string): Promise<SessionTreeEntry[]>;
    buildContext(): Promise<SessionContext>;
    getLabel(id: string): Promise<string | undefined>;
    getSessionName(): Promise<string | undefined>;
    private appendTypedEntry;
    appendMessage(message: AgentMessage): Promise<string>;
    appendThinkingLevelChange(thinkingLevel: string): Promise<string>;
    appendModelChange(provider: string, modelId: string): Promise<string>;
    appendCompaction(summary: string, firstKeptEntryId: string, tokensBefore: number, details?: unknown, fromHook?: boolean): Promise<string>;
    /** Append a non-LLM transcript marker for harness-specific state. */
    appendCustomEntry(customType: string, data?: unknown): Promise<string>;
    /** Append harness-specific content that can also be replayed into model context. */
    appendCustomMessageEntry(customType: string, content: string | (TextContent | ImageContent)[], display: boolean, details?: unknown): Promise<string>;
    /** Record or clear the display label for an existing session entry. */
    appendLabel(targetId: string, label: string | undefined): Promise<string>;
    appendSessionName(name: string): Promise<string>;
    /** Move the visible branch leaf and optionally attach a summary of the abandoned branch. */
    moveTo(entryId: string | null, summary?: {
        summary: string;
        details?: unknown;
        fromHook?: boolean;
    }): Promise<string | undefined>;
}
