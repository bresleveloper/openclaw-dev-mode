import { c as ChannelStreamingConfig } from "./types.base-BJujKINr.js";
type StreamingCompatEntry = {
  streaming?: unknown;
};
declare function getChannelStreamingConfigObject(entry: StreamingCompatEntry | null | undefined): ChannelStreamingConfig | undefined;
declare function resolveChannelStreamingNativeTransport(entry: StreamingCompatEntry | null | undefined): boolean | undefined;
export { getChannelStreamingConfigObject as n, resolveChannelStreamingNativeTransport as r, StreamingCompatEntry as t };