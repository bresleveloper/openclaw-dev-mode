import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type PluginToolMcpMeta } from "../plugins/tools.js";
import { type HookContext } from "./agent-tools.before-tool-call.js";
import type { AgentMessage, AgentToolResult, AgentToolUpdateCallback } from "./runtime/index.js";
import type { ToolDefinition } from "./sessions/index.js";
import type { AnyAgentTool } from "./tools/common.js";
export declare const TOOL_SEARCH_CODE_MODE_TOOL_NAME = "tool_search_code";
export declare const TOOL_SEARCH_RAW_TOOL_NAME = "tool_search";
export declare const TOOL_DESCRIBE_RAW_TOOL_NAME = "tool_describe";
export declare const TOOL_CALL_RAW_TOOL_NAME = "tool_call";
type ToolSearchMode = "code" | "tools" | "directory";
type CatalogSource = "openclaw" | "mcp" | "client";
type CatalogTool = AnyAgentTool | ToolDefinition;
type CatalogVisibilityOptions = {
    includeMcp?: boolean;
};
type UnknownToolRecoverySurface = "raw-tools" | "code-mode" | "tools";
type UnknownToolErrorOptions = {
    exactIdOnly?: boolean;
    recoverySurface?: UnknownToolRecoverySurface;
};
type ReusableCatalogSnapshot = {
    entries: ToolSearchCatalogEntry[];
    fingerprint: string;
};
export type ToolSearchCatalogToolExecutor = (params: {
    tool: CatalogTool;
    toolName: string;
    source: CatalogSource;
    sourceName?: string;
    toolCallId: string;
    parentToolCallId?: string;
    input: unknown;
    signal?: AbortSignal;
    onUpdate?: AgentToolUpdateCallback;
}) => Promise<AgentToolResult<unknown>>;
/** Transcript projection for target tool calls made through Tool Search. */
export type ToolSearchTargetTranscriptProjection = {
    parentToolCallId?: string;
    toolCallId: string;
    toolName: string;
    input: unknown;
    result?: unknown;
    isError?: boolean;
    timestamp?: number;
};
/** Resolved Tool Search config after defaults, limits, and runtime support checks. */
export type ToolSearchConfig = {
    enabled: boolean;
    mode: ToolSearchMode;
    codeTimeoutMs: number;
    searchDefaultLimit: number;
    maxSearchLimit: number;
};
/** Per-run/session context used by Tool Search control tools. */
export type ToolSearchToolContext = {
    config?: OpenClawConfig;
    runtimeConfig?: OpenClawConfig;
    agentId?: string;
    sessionKey?: string;
    sessionId?: string;
    runId?: string;
    catalogRef?: ToolSearchCatalogRef;
    abortSignal?: AbortSignal;
    executeTool?: ToolSearchCatalogToolExecutor;
};
/** Catalog entry retained behind compacted Tool Search control tools. */
export type ToolSearchCatalogEntry = {
    id: string;
    source: CatalogSource;
    sourceName?: string;
    mcp?: PluginToolMcpMeta;
    name: string;
    label?: string;
    description: string;
    parameters?: unknown;
    tool: CatalogTool;
};
export type ToolSearchCatalogSession = {
    entries: ToolSearchCatalogEntry[];
    searchCount: number;
    describeCount: number;
    callCount: number;
};
export type ToolSearchCatalogRef = {
    current?: ToolSearchCatalogSession;
};
declare function isToolSearchCodeModeSupported(): boolean;
export declare function resolveToolSearchConfig(config?: OpenClawConfig): ToolSearchConfig;
export declare function collectUniqueCatalogToolNames(tools: readonly AnyAgentTool[]): Set<string>;
export declare function projectToolSearchTargetTranscriptMessages(messages: AgentMessage[], projections: readonly ToolSearchTargetTranscriptProjection[]): AgentMessage[];
/** Create an explicit catalog holder for callers that cannot rely on session keys. */
export declare function createToolSearchCatalogRef(): ToolSearchCatalogRef;
/** Replace visible tools with Tool Search controls and register hidden catalog entries. */
export declare function applyToolSearchCatalog(params: {
    tools: AnyAgentTool[];
    config?: OpenClawConfig;
    sessionId?: string;
    sessionKey?: string;
    agentId?: string;
    runId?: string;
    catalogRef?: ToolSearchCatalogRef;
    toolHookContext?: HookContext;
}): {
    tools: AnyAgentTool[];
    compacted: boolean;
    catalogToolCount: number;
    catalogRegistered: boolean;
    catalogReused: boolean;
};
/** Keep tool names discoverable while deferring heavyweight JSON schemas behind describe/call. */
export declare function applyToolSchemaDirectoryCatalog(params: {
    tools: AnyAgentTool[];
    config?: OpenClawConfig;
    sessionId?: string;
    sessionKey?: string;
    agentId?: string;
    runId?: string;
    catalogRef?: ToolSearchCatalogRef;
    toolHookContext?: HookContext;
    hydrateToolNames?: Iterable<string>;
}): {
    tools: AnyAgentTool[];
    compacted: boolean;
    catalogToolCount: number;
    catalogRegistered: boolean;
    catalogReused: boolean;
};
export declare function buildToolSchemaDirectoryPrompt(ctx: ToolSearchToolContext, options?: CatalogVisibilityOptions): string;
/** Resolve an exact hidden catalog tool name without exposing fuzzy search or catalog ids. */
export declare function resolveToolSearchCatalogTool(ctx: ToolSearchToolContext, name: unknown, options?: CatalogVisibilityOptions): AnyAgentTool | undefined;
/** Move client-provided tools into an existing Tool Search catalog. */
export declare function addClientToolsToToolSearchCatalog(params: {
    tools: ToolDefinition[];
    config?: OpenClawConfig;
    sessionId?: string;
    sessionKey?: string;
    agentId?: string;
    runId?: string;
    catalogRef?: ToolSearchCatalogRef;
}): {
    tools: ToolDefinition[];
    compacted: boolean;
    catalogToolCount: number;
};
/** Register catalog entries under run/session keys and optional direct refs. */
export declare function registerToolSearchCatalog(params: {
    sessionId?: string;
    sessionKey?: string;
    agentId?: string;
    runId?: string;
    catalogRef?: ToolSearchCatalogRef;
    entries: ToolSearchCatalogEntry[];
    append?: boolean;
}): ToolSearchCatalogSession | undefined;
/** Clear Tool Search catalog state for a run/session/ref. */
export declare function clearToolSearchCatalog(params: {
    sessionId?: string;
    sessionKey?: string;
    agentId?: string;
    runId?: string;
    catalogRef?: ToolSearchCatalogRef;
}): void;
export declare function estimateToolSchemaDirectoryToolNames(params: {
    tools: readonly AnyAgentTool[];
    query?: string;
    maxTools?: number;
    requiredToolNames?: Iterable<string>;
}): string[];
export declare class ToolSearchRuntime {
    private readonly ctx;
    private readonly config;
    private callSequence;
    constructor(ctx: ToolSearchToolContext, config: ToolSearchConfig);
    search: (query: string, options?: {
        limit?: number;
    } & CatalogVisibilityOptions) => Promise<{
        id: string;
        source: CatalogSource;
        sourceName: string | undefined;
        mcp?: PluginToolMcpMeta | undefined;
        name: string;
        label: string | undefined;
        description: string;
    }[]>;
    all: (options?: CatalogVisibilityOptions) => {
        id: string;
        source: CatalogSource;
        sourceName: string | undefined;
        mcp?: PluginToolMcpMeta | undefined;
        name: string;
        label: string | undefined;
        description: string;
    }[];
    namespaceEntries: () => ({
        id: string;
        source: CatalogSource;
        sourceName: string | undefined;
        mcp?: PluginToolMcpMeta | undefined;
        name: string;
        label: string | undefined;
        description: string;
    } & {
        parameters: {};
    })[];
    describe: (id: string, options?: CatalogVisibilityOptions & UnknownToolErrorOptions) => Promise<{
        id: string;
        source: CatalogSource;
        sourceName: string | undefined;
        mcp?: PluginToolMcpMeta | undefined;
        name: string;
        label: string | undefined;
        description: string;
        parameters: {};
    }>;
    call: (id: string, input?: unknown, options?: {
        parentToolCallId?: string;
        signal?: AbortSignal;
        onUpdate?: AgentToolUpdateCallback;
        recoverySurface?: UnknownToolRecoverySurface;
    }) => Promise<{
        tool: {
            id: string;
            source: CatalogSource;
            sourceName: string | undefined;
            mcp?: PluginToolMcpMeta | undefined;
            name: string;
            label: string | undefined;
            description: string;
        };
        result: AgentToolResult<unknown>;
    }>;
    callExactId: (id: string, input?: unknown, options?: {
        parentToolCallId?: string;
        signal?: AbortSignal;
        onUpdate?: AgentToolUpdateCallback;
        recoverySurface?: UnknownToolRecoverySurface;
    }) => Promise<{
        tool: {
            id: string;
            source: CatalogSource;
            sourceName: string | undefined;
            mcp?: PluginToolMcpMeta | undefined;
            name: string;
            label: string | undefined;
            description: string;
        };
        result: AgentToolResult<unknown>;
    }>;
    private readonly callEntry;
    telemetry(): {
        catalogSize: number;
        sources: Record<CatalogSource, number>;
        searchCount: number;
        describeCount: number;
        callCount: number;
    };
}
/** Compact a native tool list into visible control tools plus hidden catalog entries. */
export declare function applyToolCatalogCompaction(params: {
    tools: AnyAgentTool[];
    enabled: boolean;
    sessionId?: string;
    sessionKey?: string;
    agentId?: string;
    runId?: string;
    catalogRef?: ToolSearchCatalogRef;
    toolHookContext?: HookContext;
    isVisibleControlTool: (tool: AnyAgentTool) => boolean;
    isVisibleCatalogTool?: (tool: AnyAgentTool) => boolean;
    shouldCatalogTool?: (tool: AnyAgentTool) => boolean;
}): {
    tools: AnyAgentTool[];
    compacted: boolean;
    catalogToolCount: number;
    catalogRegistered: boolean;
    catalogReused: boolean;
};
/** Append client-side tool definitions to an already registered catalog. */
export declare function addClientToolsToToolCatalog(params: {
    tools: ToolDefinition[];
    enabled: boolean;
    sessionId?: string;
    sessionKey?: string;
    agentId?: string;
    runId?: string;
    catalogRef?: ToolSearchCatalogRef;
}): {
    tools: ToolDefinition[];
    compacted: boolean;
    catalogToolCount: number;
};
/** Create Tool Search control tools for the current run/session context. */
export declare function createToolSearchTools(ctx: ToolSearchToolContext): AnyAgentTool[];
export declare const testing: {
    sessionCatalogs: Map<string, ToolSearchCatalogSession>;
    reusableCatalogSnapshots: Map<string, ReusableCatalogSnapshot>;
    maxToolSchemaDirectoryPromptChars: number;
    resolveToolSearchConfig: typeof resolveToolSearchConfig;
    isToolSearchCodeModeSupported: typeof isToolSearchCodeModeSupported;
    setToolSearchCodeModeSupportedForTest: (value: boolean | undefined) => void;
    setToolSearchMinCodeTimeoutMsForTest: (value: number | undefined) => void;
    applyToolSearchCatalog: typeof applyToolSearchCatalog;
    addClientToolsToToolSearchCatalog: typeof addClientToolsToToolSearchCatalog;
};
export { testing as __testing };
