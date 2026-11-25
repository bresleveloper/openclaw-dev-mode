import "./types.openclaw-D8uW-XQA.js";
import { l as AgentToolResult } from "./types-Bjy6vVru.js";
import "./common-SasPqPvU.js";
import { TOptional, TString, Type } from "typebox";
type PollInput = {
  question: string;
  options: string[];
  maxSelections?: number;
  /**
   * Poll duration in seconds.
   * Channel-specific limits apply in each owning plugin.
   */
  durationSeconds?: number;
  /**
   * Poll duration in hours.
   * Used by channels that model duration in hours.
   */
  durationHours?: number;
};
type NormalizedPollInput = {
  question: string;
  options: string[];
  maxSelections: number;
  durationSeconds?: number;
  durationHours?: number;
};
type NormalizePollOptions = {
  maxOptions?: number;
};
declare function resolvePollMaxSelections(optionCount: number, allowMultiselect: boolean | undefined): number;
declare function normalizePollInput(input: PollInput, options?: NormalizePollOptions): NormalizedPollInput;
declare function normalizePollDurationHours(value: number | undefined, options: {
  defaultHours: number;
  maxHours: number;
}): number;
declare class ToolInputError extends Error {
  readonly status: number;
  constructor(message: string);
}
declare class ToolAuthorizationError extends ToolInputError {
  readonly status = 403;
  constructor(message: string);
}
type ImageSanitizationLimits = {
  maxDimensionPx?: number;
  maxBytes?: number;
};
type StringEnumOptions<T extends readonly string[]> = {
  description?: string;
  title?: string;
  default?: T[number];
  deprecated?: boolean;
};
declare function stringEnum<T extends readonly string[]>(values: T, options?: StringEnumOptions<T>): Type.TEnum<T[number][]> | Type.TUnsafe<T[number]>;
declare function optionalStringEnum<T extends readonly string[]>(values: T, options?: StringEnumOptions<T>): Type.TOptional<Type.TEnum<T[number][]> | Type.TUnsafe<T[number]>>;
/** Builds a schema for one outbound channel target. */
declare function channelTargetSchema(options?: {
  description?: string;
}): TString;
/** Builds a schema for multiple outbound channel targets. */
declare function channelTargetsSchema(options?: {
  description?: string;
}): Type.TArray<TString>;
type IntegerSchemaOptions = {
  description?: string;
  maximum?: number;
};
type NumberSchemaOptions = {
  description?: string;
  deprecated?: boolean;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
};
/** Builds an optional finite number schema with caller-provided metadata. */
declare function optionalFiniteNumberSchema(options?: NumberSchemaOptions): TOptional<Type.TNumber>;
/** Builds an optional positive integer schema. */
declare function optionalPositiveIntegerSchema(options?: IntegerSchemaOptions): TOptional<Type.TInteger>;
/** Builds an optional non-negative integer schema. */
declare function optionalNonNegativeIntegerSchema(options?: IntegerSchemaOptions): TOptional<Type.TInteger>;
declare function imageResultFromFile(params: {
  label: string;
  path: string;
  extraText?: string;
  details?: Record<string, unknown>;
  imageSanitization?: ImageSanitizationLimits;
}): Promise<AgentToolResult<unknown>>;
type OptionalDefaultGate<TKey extends string> = (key: TKey, defaultValue?: boolean) => boolean;
type TokenSourcedAccount = {
  tokenSource?: string | null;
};
declare function listTokenSourcedAccounts<TAccount extends TokenSourcedAccount>(accounts: readonly TAccount[]): TAccount[];
declare function createUnionActionGate<TAccount, TKey extends string>(accounts: readonly TAccount[], createGate: (account: TAccount) => OptionalDefaultGate<TKey>): OptionalDefaultGate<TKey>;
declare function resolveReactionMessageId(params: {
  args: Record<string, unknown>;
  toolContext?: {
    currentMessageId?: string | number;
  };
}): string | number | undefined;
/** Build current turn context using the configured timezone or the canonical host fallback. */
declare function buildTemporalContextText(params: {
  configuredTimezone?: string;
  sessionStatusAvailable: boolean;
}): string;
/** Add normalized timestamp fields without overwriting valid existing values. */
declare function withNormalizedTimestamp<T extends Record<string, unknown>>(value: T, rawTimestamp: unknown): T & {
  timestampMs?: number;
  timestampUtc?: string;
};
declare function assertMediaNotDataUrl(media: string): void;
export { ToolInputError as _, createUnionActionGate as a, normalizePollInput as b, channelTargetSchema as c, optionalNonNegativeIntegerSchema as d, optionalPositiveIntegerSchema as f, ToolAuthorizationError as g, ImageSanitizationLimits as h, resolveReactionMessageId as i, channelTargetsSchema as l, stringEnum as m, buildTemporalContextText as n, listTokenSourcedAccounts as o, optionalStringEnum as p, withNormalizedTimestamp as r, imageResultFromFile as s, assertMediaNotDataUrl as t, optionalFiniteNumberSchema as u, PollInput as v, resolvePollMaxSelections as x, normalizePollDurationHours as y };