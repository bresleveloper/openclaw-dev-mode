/**
 * Detects providers whose model selections are backed by CLI runtimes.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Return true when a provider id resolves to a configured or plugin CLI backend. */
export declare function isCliProvider(provider: string, cfg?: OpenClawConfig): boolean;
