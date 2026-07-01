import type { SessionEntry } from "./types.js";
/** Detects model overrides created by automatic fallback provenance. */
export declare function hasSessionAutoModelFallbackProvenance(entry: Pick<SessionEntry, "providerOverride" | "modelOverride" | "modelOverrideFallbackOriginProvider" | "modelOverrideFallbackOriginModel"> | undefined): boolean;
