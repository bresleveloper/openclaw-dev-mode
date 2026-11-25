import { l as AgentToolResult, s as AgentTool, u as AgentToolUpdateCallback } from "./types-Bjy6vVru.js";
import { TSchema } from "typebox";
declare function textResult<TDetails>(text: string, details: TDetails): AgentToolResult<TDetails>;
declare function jsonResult<TDetails>(payload: TDetails): AgentToolResult<TDetails>;
type AgentToolWithMeta<TParameters extends TSchema, TResult> = AgentTool<TParameters, TResult> & {
  displaySummary?: string;
  /** Keep this tool model-visible; hidden catalog bridges cannot preserve its result contract. */
  catalogMode?: "direct-only";
  /** Gateway client capabilities required before this tool can be assembled. */
  requiredClientCaps?: string[];
  /**
   * Allow a result's `details.sourceReply` to be delivered to the current source as the
   * user-visible reply, without another model turn. Only the tool author can declare this;
   * tool results alone never grant it.
   */
  canDeliverSourceReply?: boolean;
  /**
   * Tool-owned execution and transport wait budget, before any harness completion grace.
   * Embedded execution publishes this as a liveness allowance without adding a timer.
   * Its optional context supplies the remaining parent budget (the default agent
   * budget for an unlimited parent); other harnesses may resolve their own lifetime.
   */
  getExecutionTimeoutMs?: (args: unknown, context?: {
    parentTimeoutMs: number;
  }) => number | undefined;
  prepareBeforeToolCallParams?: (params: unknown, ctx: {
    toolCallId?: string;
    hookContext?: unknown;
    signal?: AbortSignal;
  }) => unknown;
  finalizeBeforeToolCallParams?: (params: unknown, preparedParams: unknown) => unknown;
};
type ErasedAgentToolExecute<TDetails> = {
  execute(this: void, toolCallId: string, params: unknown, signal?: AbortSignal, onUpdate?: AgentToolUpdateCallback<TDetails>): Promise<AgentToolResult<TDetails>>;
};
type AnyAgentTool<TDetails = unknown> = Omit<AgentToolWithMeta<TSchema, TDetails>, "execute"> & ErasedAgentToolExecute<TDetails>;
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
type AvailableTag = {
  id?: string;
  name: string;
  moderated?: boolean;
  emoji_id?: string | null;
  emoji_name?: string | null;
};
declare function parseAvailableTags(raw: unknown): AvailableTag[] | undefined;
export { readFiniteNumberParam as a, readPositiveIntegerParam as c, readStringOrNumberParam as d, readToolStringParam as f, parseAvailableTags as i, readReactionParams as l, textResult as m, AnyAgentTool as n, readNonNegativeIntegerParam as o, jsonResult as p, createActionGate as r, readNumberParam as s, ActionGate as t, readStringArrayParam as u };