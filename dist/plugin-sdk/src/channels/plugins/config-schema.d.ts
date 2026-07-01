/**
 * Channel config schema helpers.
 *
 * Builds common zod/JSON schema shapes and parses runtime config issues for channel plugins.
 */
import { z, type ZodRawShape, type ZodTypeAny } from "zod";
import type { JsonSchemaObject } from "../../shared/json-schema.types.js";
import type { ChannelConfigSchema, ChannelConfigUiHint } from "./types.config.js";
type ExtendableZodObject = ZodTypeAny & {
    extend: (shape: Record<string, ZodTypeAny>) => ZodTypeAny;
};
/** Shared allowlist entry shape for channel sender/user ids. */
export declare const AllowFromEntrySchema: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
/** Optional allowlist array used by channel config schema builders. */
export declare const AllowFromListSchema: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
/** Build the common nested DM config block used by channel account schemas. */
export declare function buildNestedDmConfigSchema(extraShape?: ZodRawShape): z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    policy: z.ZodOptional<z.ZodEnum<{
        allowlist: "allowlist";
        disabled: "disabled";
        open: "open";
        pairing: "pairing";
    }>>;
    allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
}, z.core.$strip>>;
/** Add `accounts` catchall and `defaultAccount` fields to a channel account schema. */
export declare function buildCatchallMultiAccountChannelSchema<T extends ExtendableZodObject>(accountSchema: T): T;
type BuildChannelConfigSchemaOptions = {
    uiHints?: Record<string, ChannelConfigUiHint>;
};
type BuildJsonChannelConfigSchemaOptions = {
    cacheKey?: string;
    uiHints?: Record<string, ChannelConfigUiHint>;
    runtime?: ChannelConfigSchema["runtime"];
};
/** Build a channel config schema from JSON Schema with runtime validation/default support. */
export declare function buildJsonChannelConfigSchema(schema: JsonSchemaObject, options?: BuildJsonChannelConfigSchemaOptions): ChannelConfigSchema;
/** Build a channel config schema from Zod, exporting JSON Schema when available. */
export declare function buildChannelConfigSchema(schema: ZodTypeAny, options?: BuildChannelConfigSchemaOptions): ChannelConfigSchema;
/** Return a channel config schema for channels that intentionally accept no config keys. */
export declare function emptyChannelConfigSchema(): ChannelConfigSchema;
export {};
