import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginOrigin } from "../plugins/plugin-origin.types.js";
import { type ResolverContext, type SecretDefaults } from "./runtime-shared.js";
/**
 * Walk manifest-declared plugin config SecretRef surfaces and collect
 * assignments for runtime materialization. Plugin-owned metadata controls which
 * config paths support SecretRefs and whether bundled plugins stay inactive on
 * that surface until explicitly enabled.
 *
 * When `loadablePluginOrigins` is provided, entries whose ID is not in the map
 * are treated as inactive (stale config entries for plugins that are no longer
 * installed). This prevents resolution failures for SecretRefs belonging to
 * non-loadable plugins from blocking startup or preflight validation.
 */
/** Collects SecretRef assignments from plugin-owned config contract paths. */
export declare function collectPluginConfigAssignments(params: {
    /** Mutable config snapshot whose plugin config values will receive resolved secrets. */
    config: OpenClawConfig;
    /** Defaults from the source config, used while matching manifest-declared SecretInput paths. */
    defaults: SecretDefaults | undefined;
    /** Resolver context that receives assignments and inactive-surface warnings. */
    context: ResolverContext;
    /** Optional installed plugin roots; missing IDs are treated as stale inactive config. */
    loadablePluginOrigins?: ReadonlyMap<string, PluginOrigin>;
}): void;
