import type { ChannelRuntimeContextKey, ChannelRuntimeSurface } from "../channels/plugins/channel-runtime-surface.types.js";
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
/** Wraps a channel runtime so contexts registered during a task are disposed together. */
export declare function createTaskScopedChannelRuntime<T extends ChannelRuntimeSurface>(params: {
    channelRuntime?: T;
}): {
    channelRuntime?: T;
    dispose: () => void;
};
