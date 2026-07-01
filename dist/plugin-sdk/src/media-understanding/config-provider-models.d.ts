import type { OpenClawConfig } from "../config/types.js";
/** Finds configured model providers that can be auto-registered for image understanding. */
export declare function resolveImageCapableConfigProviderIds(cfg?: OpenClawConfig): string[];
