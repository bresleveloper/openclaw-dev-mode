import { z } from "zod";
import type { ConfigUiHints } from "../shared/config-ui-hints-types.js";
import { isSensitiveConfigPath } from "./sensitive-paths.js";
export type { ConfigUiHint, ConfigUiHints } from "../shared/config-ui-hints-types.js";
/** Return whether a channel hint path belongs to a plugin-owned channel namespace. */
export declare function isPluginOwnedChannelHintPath(path: string): boolean;
export { isSensitiveConfigPath };
/** Build core config UI hints while leaving plugin-owned channel hints to plugin schemas. */
export declare function buildBaseHints(): ConfigUiHints;
/** Mark sensitive config paths in a hint map without overwriting explicit sensitivity metadata. */
export declare function applySensitiveHints(hints: ConfigUiHints, allowedKeys?: ReadonlySet<string>): ConfigUiHints;
/** Add the sensitive-url tag to hint paths that carry URLs with credential risk. */
export declare function applySensitiveUrlHints(hints: ConfigUiHints, allowedKeys?: ReadonlySet<string>): ConfigUiHints;
/** Walk a Zod schema and collect concrete/wildcard paths accepted by `matchesPath`. */
export declare function collectMatchingSchemaPaths(schema: z.ZodType, path: string, matchesPath: (path: string) => boolean, paths?: Set<string>): Set<string>;
/**
 * Traverses the Zod schema tree and returns a copy of `hints` with every
 * sensitive path marked.
 */
export declare function mapSensitivePaths(schema: z.ZodType, path: string, hints: ConfigUiHints): ConfigUiHints;
/** @internal */
export declare const testApi: {
    collectMatchingSchemaPaths: typeof collectMatchingSchemaPaths;
    mapSensitivePaths: typeof mapSensitivePaths;
};
export { testApi as __test__ };
