import { d as ChannelDirectoryAdapter } from "./types.adapters-dxHXA2rq.js";
import { n as ChannelOutboundAdapter } from "./outbound.types-HYq1MKG1.js";
//#region src/channels/plugins/runtime-forwarders.d.ts
type MaybePromise<T> = T | Promise<T>;
type DirectoryMethod = "self" | "listPeersLive" | "listGroupsLive" | "listGroupMembers";
type OutboundMethod = "renderPresentation" | "sendPayload" | "sendText" | "sendMedia" | "sendPoll";
/**
 * Creates a directory adapter whose methods forward to a lazily resolved runtime.
 */
declare function createRuntimeDirectoryLiveAdapter<Runtime>(params: {
  getRuntime: () => MaybePromise<Runtime>;
} & { [Method in DirectoryMethod]?: (runtime: Runtime) => ChannelDirectoryAdapter[Method] | null | undefined; }): Pick<ChannelDirectoryAdapter, DirectoryMethod>;
/**
 * Creates outbound delegates whose methods forward to a lazily resolved runtime.
 */
declare function createRuntimeOutboundDelegates<Runtime>(params: {
  getRuntime: () => MaybePromise<Runtime>;
} & { [Method in OutboundMethod]?: {
  resolve: (runtime: Runtime) => ChannelOutboundAdapter[Method] | null | undefined;
  unavailableMessage?: string;
}; }): Pick<ChannelOutboundAdapter, OutboundMethod>;
//#endregion
export { createRuntimeOutboundDelegates as n, createRuntimeDirectoryLiveAdapter as t };