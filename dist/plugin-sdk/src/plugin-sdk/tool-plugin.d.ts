import { type Static, type TSchema } from "typebox";
import type { AgentToolUpdateCallback } from "../agents/runtime/index.js";
import type { PluginManifestActivation } from "../plugins/manifest.js";
import type { JsonSchemaObject } from "../shared/json-schema.types.js";
import { definePluginEntry, type AnyAgentTool, type OpenClawPluginApi, type OpenClawPluginToolContext } from "./plugin-entry.js";
/** Non-enumerable metadata symbol attached to entries created by `defineToolPlugin`. */
export declare const toolPluginMetadataSymbol: unique symbol;
/** Runtime context supplied to a concrete tool plugin execution handler. */
export type ToolPluginExecutionContext = {
    /** Plugin runtime API for tool implementations that need OpenClaw services. */
    api: OpenClawPluginApi;
    /** Abort signal for the current tool call. */
    signal?: AbortSignal;
    /** Stable id of the current model tool call. */
    toolCallId: string;
    /** Optional progress callback for streaming tool status updates. */
    onUpdate?: AgentToolUpdateCallback;
};
type ToolPluginConfig<TConfigSchema extends TSchema | undefined> = TConfigSchema extends TSchema ? Static<TConfigSchema> : Record<string, never>;
type ToolPluginToolFactory<TConfig> = <TParamsSchema extends TSchema>(definition: ToolPluginToolDefinition<TConfig, TParamsSchema>) => DefinedToolPluginTool;
/** Context passed to a tool factory that builds runtime-specific tool definitions. */
export type ToolPluginFactoryContext<TConfig> = {
    /** Plugin runtime API passed to context-sensitive tool factories. */
    api: OpenClawPluginApi;
    /** Resolved plugin config typed from the declared config schema. */
    config: TConfig;
    /** Runtime tool context, including sandbox/capability information. */
    toolContext: OpenClawPluginToolContext;
};
type ToolPluginToolDefinitionBase<TParamsSchema extends TSchema> = {
    /** Model-facing tool name. */
    name: string;
    /** Human-facing label; defaults to `name`. */
    label?: string;
    /** Model-facing tool description. */
    description: string;
    /** TypeBox parameter schema used for runtime validation and metadata. */
    parameters: TParamsSchema;
    /** Register as optional so runtimes may omit it when unsupported. */
    optional?: boolean;
};
/** Static tool declaration accepted by the tool-plugin factory callback. */
export type ToolPluginToolDefinition<TConfig, TParamsSchema extends TSchema> = ToolPluginToolDefinitionBase<TParamsSchema> & ({
    /** Execute one concrete tool call and return either plain text or JSON-serializable data. */
    execute: (params: Static<TParamsSchema>, config: TConfig, context: ToolPluginExecutionContext) => unknown;
    factory?: never;
} | {
    /** Build runtime-specific tool definitions without losing static manifest metadata. */
    factory: (context: ToolPluginFactoryContext<TConfig>) => AnyAgentTool | AnyAgentTool[] | null | undefined;
    execute?: never;
});
type DefinedToolPluginTool = {
    name: string;
    label: string;
    description: string;
    parameters: TSchema;
    optional: boolean;
    execute?: (params: unknown, config: unknown, context: ToolPluginExecutionContext) => unknown;
    factory?: (context: ToolPluginFactoryContext<unknown>) => AnyAgentTool | AnyAgentTool[] | null | undefined;
};
/** Model-facing metadata extracted from each statically declared tool. */
export type ToolPluginStaticToolMetadata = {
    name: string;
    label: string;
    description: string;
    parameters: JsonSchemaObject;
    optional?: boolean;
};
/** Metadata attached to a defined tool plugin for manifest/catalog generation. */
export type ToolPluginMetadata = {
    id: string;
    name: string;
    description: string;
    activation: PluginManifestActivation;
    configSchema: JsonSchemaObject;
    tools: ToolPluginStaticToolMetadata[];
};
/** Options for declaring a plugin whose primary surface is one or more tools. */
export type DefineToolPluginOptions<TConfigSchema extends TSchema | undefined = undefined> = {
    /** Stable plugin id used in config, manifests, and generated metadata. */
    id: string;
    /** Human-facing plugin name. */
    name: string;
    /** Human/model-facing plugin description. */
    description: string;
    /** Manifest activation rule; defaults to startup activation. */
    activation?: PluginManifestActivation;
    /** Optional TypeBox config schema; omitted means a strict empty object config. */
    configSchema?: TConfigSchema;
    /** Declares static tool metadata and either execute handlers or runtime factories. */
    tools: (tool: ToolPluginToolFactory<ToolPluginConfig<TConfigSchema>>) => readonly DefinedToolPluginTool[];
};
/** Plugin entry returned by `defineToolPlugin`, including hidden metadata. */
export type DefinedToolPluginEntry = ReturnType<typeof definePluginEntry> & {
    [toolPluginMetadataSymbol]: ToolPluginMetadata;
};
/** Define a tool-focused plugin entry and register its tools at plugin startup. */
export declare function defineToolPlugin<TConfigSchema extends TSchema | undefined = undefined>(definition: DefineToolPluginOptions<TConfigSchema>): DefinedToolPluginEntry;
/** Read tool-plugin metadata from an entry without exposing the symbol to callers. */
export declare function getToolPluginMetadata(entry: unknown): ToolPluginMetadata | undefined;
export {};
