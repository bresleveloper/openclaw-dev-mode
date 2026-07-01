import { z } from "zod";
/**
 * Returns the shared secret-input schema for plaintext values and env/file/exec refs.
 * Reusing this singleton preserves sensitive-path registration for config redaction.
 */
export declare function buildSecretInputSchema(): z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
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
}, z.core.$strict>], "source">]>;
