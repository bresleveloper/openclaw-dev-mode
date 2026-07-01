/**
 * Google/Gemini-specific embedded-agent runtime helpers.
 */
import { sanitizeGoogleTurnOrdering } from "./bootstrap.js";
/** Detects Google-owned embedded runtime APIs. */
export declare function isGoogleModelApi(api?: string | null): boolean;
export { sanitizeGoogleTurnOrdering };
