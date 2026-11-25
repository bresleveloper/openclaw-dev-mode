import { r as ChannelRuntimeSurface, t as ChannelRuntimeContextKey } from "../channel-runtime-surface.types-r5DHkYSy.js";
/** Registers a channel-scoped runtime context, returning null when no runtime registry exists. */
export declare function registerChannelRuntimeContext(params: ChannelRuntimeContextKey & {
  channelRuntime?: ChannelRuntimeSurface;
  context: unknown;
  abortSignal?: AbortSignal;
}): {
  dispose: () => void;
} | null;
/** Reads a channel-scoped runtime context from the current runtime registry. */
export declare function getChannelRuntimeContext(params: ChannelRuntimeContextKey & {
  channelRuntime?: ChannelRuntimeSurface;
}): unknown;
/** Watches context registration changes for one channel/account/capability key. */
export declare function watchChannelRuntimeContexts(params: ChannelRuntimeContextKey & {
  channelRuntime?: ChannelRuntimeSurface;
  onEvent: Parameters<ChannelRuntimeSurface["runtimeContexts"]["watch"]>[0]["onEvent"];
}): (() => void) | null;
export type { ChannelRuntimeContextKey };