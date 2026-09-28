import { b as ChannelMessagingAdapter } from "./types.core-D1MQo5ra.js";
//#region src/channels/native-command-session-targets.d.ts
/**
 * Inputs for resolving where a native channel command should attach session state.
 */
type ResolveNativeCommandSessionTargetsParams = {
  agentId: string;
  sessionPrefix: string;
  userId: string;
  targetSessionKey: string;
  boundSessionKey?: string;
  sessionKeyCase?: NonNullable<ChannelMessagingAdapter["targetIdComparison"]>;
};
/**
 * Resolves the storage session key and command target key for native command events.
 */
declare function resolveNativeCommandSessionTargets(params: ResolveNativeCommandSessionTargetsParams): {
  sessionKey: string;
  commandTargetSessionKey: string;
};
//#endregion
export { resolveNativeCommandSessionTargets as n, ResolveNativeCommandSessionTargetsParams as t };