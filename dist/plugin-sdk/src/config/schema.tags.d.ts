import type { ConfigUiHint, ConfigUiHints } from "../shared/config-ui-hints-types.js";
/** Stable config UI tag vocabulary used for filtering and grouping schema hints. */
export declare const CONFIG_TAGS: readonly ["security", "auth", "network", "access", "privacy", "observability", "performance", "reliability", "storage", "models", "media", "automation", "channels", "tools", "advanced"];
export type ConfigTag = (typeof CONFIG_TAGS)[number];
/** Derive known config UI tags from a schema path and optional hint metadata. */
export declare function deriveTagsForPath(path: string, hint?: ConfigUiHint): ConfigTag[];
/** Return hints with derived known tags merged ahead of any existing custom tags. */
export declare function applyDerivedTags(hints: ConfigUiHints): ConfigUiHints;
