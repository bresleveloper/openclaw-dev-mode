import { z } from "zod";
import { hasConfiguredSecretInput, isSecretRef, coerceSecretRef, resolveSecretInputString, normalizeResolvedSecretInputString, normalizeSecretInputString } from "../config/types.secrets.js";
import { normalizeSecretInput } from "../utils/normalize-secret-input.js";
import { buildSecretInputSchema } from "./secret-input-schema.js";
export type { SecretInput, SecretInputStringResolution, SecretInputStringResolutionMode, } from "../config/types.secrets.js";
export { buildSecretInputSchema, coerceSecretRef, hasConfiguredSecretInput, isSecretRef, resolveSecretInputString, normalizeResolvedSecretInputString, normalizeSecretInput, normalizeSecretInputString, };
/**
 * Builds an optional secret-input schema for config fields that may be omitted.
 * The inner schema stays shared so sensitive-path redaction still recognizes it.
 */
export declare function buildOptionalSecretInputSchema(): z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
    source: z.ZodLiteral<"env">;
    provider: z.ZodString;
    id: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    source: z.ZodLiteral<"file">;
    provider: z.ZodString;
    id: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    source: z.ZodLiteral<"exec">;
    provider: z.ZodString;
    id: z.ZodString;
}, z.core.$strict>], "source">]>>;
/**
 * Builds an array schema for provider/channel config that accepts multiple secret inputs.
 * Each element uses the shared schema so plaintext and ref validation stay identical.
 */
export declare function buildSecretInputArraySchema(): z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
    source: z.ZodLiteral<"env">;
    provider: z.ZodString;
    id: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    source: z.ZodLiteral<"file">;
    provider: z.ZodString;
    id: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    source: z.ZodLiteral<"exec">;
    provider: z.ZodString;
    id: z.ZodString;
}, z.core.$strict>], "source">]>>;
