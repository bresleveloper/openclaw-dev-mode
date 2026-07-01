import type { PluginInstallRecord } from "./types.plugins.js";
/**
 * Reads legacy shipped `plugins.installs` records for migration into the plugin index.
 *
 * Invalid install maps are ignored so config loading can keep using the stripped
 * runtime config while doctor/write paths decide how to report or recover.
 */
export declare function extractShippedPluginInstallConfigRecords(config: unknown): Record<string, PluginInstallRecord>;
/** Removes legacy shipped `plugins.installs` without mutating the original config object. */
export declare function stripShippedPluginInstallConfigRecords(config: unknown): unknown;
