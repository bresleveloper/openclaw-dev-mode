declare const CODE_MODE_NAMESPACE_TOOL_CALL: unique symbol;
/** Runtime context passed to plugin code-mode namespace scope factories. */
export type CodeModeNamespaceContext = {
    config?: unknown;
    runtimeConfig?: unknown;
    agentId?: string;
    sessionKey?: string;
    sessionId?: string;
    runId?: string;
    catalogRef?: unknown;
    abortSignal?: AbortSignal;
    executeTool?: unknown;
};
/** Object installed into a code-mode namespace global. */
export type CodeModeNamespaceScope = Record<string, unknown>;
/** Maps JavaScript namespace function arguments into a tool input payload. */
export type CodeModeNamespaceToolInputMapper = (args: unknown[]) => unknown;
/** Marker object used inside namespace scopes to represent a tool invocation. */
export type CodeModeNamespaceToolCall = {
    readonly [CODE_MODE_NAMESPACE_TOOL_CALL]: true;
    readonly toolName: string;
    readonly catalogId?: string;
    readonly local?: boolean;
    readonly input?: CodeModeNamespaceToolInputMapper;
};
/** Plugin registration contract for one code-mode namespace. */
export type CodeModeNamespaceRegistration = {
    id: string;
    globalName: string;
    description?: string;
    prompt?: string | ((ctx: CodeModeNamespaceContext) => string | undefined);
    requiredToolNames: string[];
    createScope(ctx: CodeModeNamespaceContext): CodeModeNamespaceScope | Promise<CodeModeNamespaceScope>;
};
/** Registration with the owning plugin id attached. */
export type RegisteredCodeModeNamespace = CodeModeNamespaceRegistration & {
    pluginId: string;
};
/** JSON-serializable descriptor value emitted to the code-mode runtime. */
export type SerializedCodeModeNamespaceValue = {
    kind: "array";
    items: SerializedCodeModeNamespaceValue[];
} | {
    kind: "function";
    path: string[];
} | {
    kind: "object";
    entries: Array<[string, SerializedCodeModeNamespaceValue]>;
} | {
    kind: "value";
    value: unknown;
};
/** Descriptor sent to code mode for one visible namespace. */
export type CodeModeNamespaceDescriptor = {
    id: string;
    globalName: string;
    description?: string;
    scope: SerializedCodeModeNamespaceValue;
};
type CodeModeNamespaceCatalogEntry = {
    id?: string;
    source?: string;
    name: string;
    sourceName?: string;
    description?: string;
    parameters?: unknown;
    mcp?: {
        serverName: string;
        safeServerName: string;
        toolName: string;
        operation: "tool" | "resources_list" | "resources_read" | "prompts_list" | "prompts_get";
    };
};
/** Runtime dispatcher for invoking callable namespace paths. */
export type CodeModeNamespaceRuntime = {
    descriptors: CodeModeNamespaceDescriptor[];
    invoke(namespaceId: string, path: string[], args: unknown[], executeTool: (params: {
        pluginId: string;
        toolName: string;
        catalogId?: string;
        input: unknown;
        namespaceId: string;
        path: string[];
    }) => Promise<unknown>): Promise<unknown>;
};
/** Creates a namespace function marker for a plugin-owned tool. */
export declare function createCodeModeNamespaceTool(toolName: string, input?: CodeModeNamespaceToolInputMapper): CodeModeNamespaceToolCall;
/** Registers a plugin namespace after validating id/global/tool contracts. */
export declare function registerCodeModeNamespaceForPlugin(pluginId: string, registration: CodeModeNamespaceRegistration): void;
/** Lists registered namespaces in deterministic id order. */
export declare function listCodeModeNamespaces(): RegisteredCodeModeNamespace[];
/** Clears all namespace registrations for isolated tests. */
export declare function clearCodeModeNamespacesForTest(): void;
/** Clears namespace registrations owned by one plugin. */
export declare function clearCodeModeNamespacesForPlugin(pluginId: string): void;
/** Virtual TypeScript-style API file exposed to code mode. */
export type CodeModeApiVirtualFile = {
    path: string;
    description?: string;
    content: string;
};
/** Builds virtual API declaration files for visible MCP namespace tools. */
export declare function createCodeModeApiVirtualFiles(catalog?: readonly CodeModeNamespaceCatalogEntry[]): CodeModeApiVirtualFile[];
/** Builds system-prompt text describing visible code-mode namespace globals. */
export declare function describeCodeModeNamespacesForPrompt(ctx: CodeModeNamespaceContext, catalog?: readonly CodeModeNamespaceCatalogEntry[]): string;
/** Creates the runtime descriptor/invocation layer for visible namespaces. */
export declare function createCodeModeNamespaceRuntime(ctx: CodeModeNamespaceContext, catalog?: readonly CodeModeNamespaceCatalogEntry[]): Promise<CodeModeNamespaceRuntime>;
export {};
