import { c as normalizeResolvedSecretInputString, d as SecretInput, g as isValidSecretRef, h as isSecretRef, l as normalizeSecretInputString, m as isBuiltInDefaultSecretProviderRef, n as SecretInputStringResolution, o as coerceSecretRef, r as SecretInputStringResolutionMode, s as hasConfiguredSecretInput, u as resolveSecretInputString } from "../types.secrets-BR-Cncxg.js";
import { i as resolveNonEnvSecretRefApiKeyMarker, n as normalizeSecretInput, r as readProviderEnvValue } from "../normalize-secret-input-Dxh5lAWq.js";
import { z } from "zod";
//#region src/plugin-sdk/secret-input-schema.d.ts
/**
 * Returns the shared secret-input schema for plaintext values and env/file/exec/store refs.
 * Reusing this singleton preserves sensitive-path registration for config redaction.
 */
export declare function buildSecretInputSchema(): z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
  source: z.ZodLiteral<"env">;
  provider: z.ZodString;
  id: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
  source: z.ZodLiteral<"store">;
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
}, z.core.$strict>], "source">]>;
/** Register a plugin-owned config schema leaf for redaction in host config projections. */
export declare function registerSensitiveConfigSchema<TSchema extends z.ZodType>(schema: TSchema): TSchema;
//#endregion
//#region src/plugin-sdk/secret-input.d.ts
/**
 * Builds an optional secret-input schema for config fields that may be omitted.
 * The inner schema stays shared so sensitive-path redaction still recognizes it.
 */
export declare function buildOptionalSecretInputSchema(): z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
  source: z.ZodLiteral<"env">;
  provider: z.ZodString;
  id: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
  source: z.ZodLiteral<"store">;
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
  source: z.ZodLiteral<"store">;
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
//#endregion
export { type SecretInput, type SecretInputStringResolution, type SecretInputStringResolutionMode, coerceSecretRef, hasConfiguredSecretInput, isBuiltInDefaultSecretProviderRef, isSecretRef, isValidSecretRef, normalizeResolvedSecretInputString, normalizeSecretInput, normalizeSecretInputString, readProviderEnvValue, resolveNonEnvSecretRefApiKeyMarker, resolveSecretInputString };