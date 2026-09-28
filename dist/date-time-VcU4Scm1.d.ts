import { Type } from "typebox";
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
}): Type.TString;
/** Builds a schema for multiple outbound channel targets. */
declare function channelTargetsSchema(options?: {
  description?: string;
}): Type.TArray<Type.TString>;
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
declare function optionalFiniteNumberSchema(options?: NumberSchemaOptions): Type.TOptional<Type.TNumber>;
/** Builds an optional positive integer schema. */
declare function optionalPositiveIntegerSchema(options?: IntegerSchemaOptions): Type.TOptional<Type.TInteger>;
/** Builds an optional non-negative integer schema. */
declare function optionalNonNegativeIntegerSchema(options?: IntegerSchemaOptions): Type.TOptional<Type.TInteger>;
//#endregion
//#region src/agents/date-time.d.ts
/** Build current prompt text using the configured timezone or the canonical host fallback. */
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
export { optionalFiniteNumberSchema as a, optionalStringEnum as c, channelTargetsSchema as i, stringEnum as l, withNormalizedTimestamp as n, optionalNonNegativeIntegerSchema as o, channelTargetSchema as r, optionalPositiveIntegerSchema as s, buildTemporalContextText as t };