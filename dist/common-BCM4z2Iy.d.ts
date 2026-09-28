import "./types.openclaw-LzSbb55e.js";
import { d as AgentToolUpdateCallback, l as AgentTool, u as AgentToolResult } from "./types-BRvdDyOm.js";
import { TSchema } from "typebox";
//#region src/agents/image-sanitization.d.ts
type ImageSanitizationLimits = {
  maxDimensionPx?: number;
  maxBytes?: number;
};
//#endregion
//#region src/agents/tools/tool-results.d.ts
declare function textResult<TDetails>(text: string, details: TDetails): AgentToolResult<TDetails>;
declare function jsonResult<TDetails>(payload: TDetails): AgentToolResult<TDetails>;
//#endregion
//#region src/agents/tools/common.d.ts
type AgentToolWithMeta<TParameters extends TSchema, TResult> = AgentTool<TParameters, TResult> & {
  displaySummary?: string;
  /** Keep this tool model-visible; hidden catalog bridges cannot preserve its result contract. */
  catalogMode?: "direct-only";
  /** Gateway client capabilities required before this tool can be assembled. */
  requiredClientCaps?: string[];
  /** Tool-owned execution and transport wait budget, before any harness completion grace. */
  getExecutionTimeoutMs?: (args: unknown) => number | undefined;
  prepareBeforeToolCallParams?: (params: unknown, ctx: {
    toolCallId?: string;
    hookContext?: unknown;
    signal?: AbortSignal;
  }) => unknown;
  finalizeBeforeToolCallParams?: (params: unknown, preparedParams: unknown) => unknown;
};
type ErasedAgentToolExecute = {
  execute(this: void, toolCallId: string, params: unknown, signal?: AbortSignal, onUpdate?: AgentToolUpdateCallback): Promise<AgentToolResult<unknown>>;
};
type AnyAgentTool = Omit<AgentTool, "execute"> & ErasedAgentToolExecute & {
  displaySummary?: string;
  /** Keep this tool model-visible; hidden catalog bridges cannot preserve its result contract. */
  catalogMode?: "direct-only";
  /** Gateway client capabilities required before this tool can be assembled. */
  requiredClientCaps?: string[];
  getExecutionTimeoutMs?: AgentToolWithMeta<TSchema, unknown>["getExecutionTimeoutMs"];
  prepareBeforeToolCallParams?: AgentToolWithMeta<TSchema, unknown>["prepareBeforeToolCallParams"];
  finalizeBeforeToolCallParams?: AgentToolWithMeta<TSchema, unknown>["finalizeBeforeToolCallParams"];
};
type StringParamOptions = {
  required?: boolean;
  trim?: boolean;
  label?: string;
  allowEmpty?: boolean;
};
type ActionGate<T extends Record<string, boolean | undefined>> = (key: keyof T, defaultValue?: boolean) => boolean;
declare function createActionGate<T extends Record<string, boolean | undefined>>(actions: T | undefined): ActionGate<T>;
declare function readToolStringParam(params: Record<string, unknown>, key: string, options: StringParamOptions & {
  required: true;
}): string;
declare function readToolStringParam(params: Record<string, unknown>, key: string, options?: StringParamOptions): string | undefined;
declare function readStringOrNumberParam(params: Record<string, unknown>, key: string, options?: {
  required?: boolean;
  label?: string;
}): string | undefined;
declare function readNumberParam(params: Record<string, unknown>, key: string, options?: {
  required?: boolean;
  label?: string;
  integer?: boolean;
  strict?: boolean;
  positiveInteger?: boolean;
  nonNegativeInteger?: boolean;
}): number | undefined;
declare function readPositiveIntegerParam(params: Record<string, unknown>, key: string, options?: {
  message?: string;
  max?: number;
}): number | undefined;
declare function readNonNegativeIntegerParam(params: Record<string, unknown>, key: string, options?: {
  message?: string;
  max?: number;
}): number | undefined;
declare function readFiniteNumberParam(params: Record<string, unknown>, key: string, options?: {
  message?: string;
  min?: number;
  max?: number;
  minExclusive?: boolean;
  maxExclusive?: boolean;
}): number | undefined;
declare function readStringArrayParam(params: Record<string, unknown>, key: string, options: StringParamOptions & {
  required: true;
}): string[];
declare function readStringArrayParam(params: Record<string, unknown>, key: string, options?: StringParamOptions): string[] | undefined;
type ReactionParams = {
  emoji: string;
  remove: boolean;
  isEmpty: boolean;
};
declare function readReactionParams(params: Record<string, unknown>, options: {
  emojiKey?: string;
  removeKey?: string;
  removeErrorMessage: string;
}): ReactionParams;
declare function imageResultFromFile(params: {
  label: string;
  path: string;
  extraText?: string;
  details?: Record<string, unknown>;
  imageSanitization?: ImageSanitizationLimits;
}): Promise<AgentToolResult<unknown>>;
type AvailableTag = {
  id?: string;
  name: string;
  moderated?: boolean;
  emoji_id?: string | null;
  emoji_name?: string | null;
};
/**
 * Validate and parse an `availableTags` parameter from untrusted input.
 * Returns `undefined` when the value is missing or not an array.
 * Entries that lack a string `name` are silently dropped.
 */
declare function parseAvailableTags(raw: unknown): AvailableTag[] | undefined;
//#endregion
export { parseAvailableTags as a, readNumberParam as c, readStringArrayParam as d, readStringOrNumberParam as f, textResult as h, imageResultFromFile as i, readPositiveIntegerParam as l, jsonResult as m, AnyAgentTool as n, readFiniteNumberParam as o, readToolStringParam as p, createActionGate as r, readNonNegativeIntegerParam as s, ActionGate as t, readReactionParams as u };