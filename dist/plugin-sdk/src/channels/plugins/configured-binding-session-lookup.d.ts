/**
 * Configured binding session lookup.
 *
 * Resolves materialized binding records from stateful target session keys.
 */
import type { ConfiguredBindingRecordResolution } from "./binding-types.js";
import type { CompiledConfiguredBindingRegistry } from "./configured-binding-compiler.js";
/**
 * Resolves a configured binding record from a stateful target session key.
 */
export declare function resolveConfiguredBindingRecordBySessionKeyFromRegistry(params: {
    registry: CompiledConfiguredBindingRegistry;
    sessionKey: string;
}): ConfiguredBindingRecordResolution | null;
