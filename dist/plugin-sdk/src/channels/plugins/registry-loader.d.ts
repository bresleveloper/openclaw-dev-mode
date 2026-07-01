/**
 * Lazy channel registry value loader.
 *
 * Resolves plugin sub-surfaces from active channel or full plugin registry state.
 */
import type { PluginChannelRegistration } from "../../plugins/registry-types.js";
import type { ChannelId } from "./channel-id.types.js";
type ChannelRegistryValueResolver<TValue> = (entry: PluginChannelRegistration) => TValue | undefined;
/**
 * Creates a lazy loader that resolves one value from the active channel registry.
 */
export declare function createChannelRegistryLoader<TValue>(resolveValue: ChannelRegistryValueResolver<TValue>): (id: ChannelId) => Promise<TValue | undefined>;
export {};
