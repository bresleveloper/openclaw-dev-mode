import "./common-CCG3ut4I.js";
import { TOptional, TString, Type } from "typebox";
//#region src/polls.d.ts
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
//#endregion
//#region src/agents/schema/string-enum.d.ts
type StringEnumOptions<T extends readonly string[]> = {
  description?: string;
  title?: string;
  default?: T[number];
  deprecated?: boolean;
};
declare function stringEnum<T extends readonly string[]>(values: T, options?: StringEnumOptions<T>): Type.TEnum<T[number][]> | Type.TUnsafe<T[number]>;
declare function optionalStringEnum<T extends readonly string[]>(values: T, options?: StringEnumOptions<T>): Type.TOptional<Type.TEnum<T[number][]> | Type.TUnsafe<T[number]>>;
//#endregion
//#region src/agents/schema/typebox.d.ts
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
//#endregion
//#region src/channels/plugins/actions/shared.d.ts
type OptionalDefaultGate<TKey extends string> = (key: TKey, defaultValue?: boolean) => boolean;
type TokenSourcedAccount = {
  tokenSource?: string | null;
};
declare function listTokenSourcedAccounts<TAccount extends TokenSourcedAccount>(accounts: readonly TAccount[]): TAccount[];
declare function createUnionActionGate<TAccount, TKey extends string>(accounts: readonly TAccount[], createGate: (account: TAccount) => OptionalDefaultGate<TKey>): OptionalDefaultGate<TKey>;
//#endregion
//#region src/channels/plugins/actions/reaction-message-id.d.ts
declare function resolveReactionMessageId(params: {
  args: Record<string, unknown>;
  toolContext?: {
    currentMessageId?: string | number;
  };
}): string | number | undefined;
//#endregion
//#region src/agents/date-time.d.ts
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
//#endregion
//#region src/agents/sandbox-paths.d.ts
declare function assertMediaNotDataUrl(media: string): void;
//#endregion
export { resolvePollMaxSelections as _, createUnionActionGate as a, channelTargetsSchema as c, optionalPositiveIntegerSchema as d, optionalStringEnum as f, normalizePollInput as g, normalizePollDurationHours as h, resolveReactionMessageId as i, optionalFiniteNumberSchema as l, PollInput as m, buildTemporalContextText as n, listTokenSourcedAccounts as o, stringEnum as p, withNormalizedTimestamp as r, channelTargetSchema as s, assertMediaNotDataUrl as t, optionalNonNegativeIntegerSchema as u };