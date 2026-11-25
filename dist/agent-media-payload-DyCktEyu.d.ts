import { i as MediaFactLegacyProjection } from "./media-facts-CgEpeeNR.js";
import "./local-roots-D8-jSmbR.js";
/**
 * Legacy agent media payload layout consumed by older agent adapters.
 * @deprecated Pass ordered facts as `MsgContext.media`; use
 * `toInboundMediaFacts` from `openclaw/plugin-sdk/channel-inbound`.
 */
type AgentMediaPayload = Omit<MediaFactLegacyProjection, "MediaTranscribedIndexes">;
/**
 * @deprecated Pass ordered facts as `MsgContext.media`; use
 * `toInboundMediaFacts` from `openclaw/plugin-sdk/channel-inbound`.
 */
declare function buildAgentMediaPayload(mediaList: Array<{
  path: string;
  contentType?: string | null;
}>): AgentMediaPayload;
export { buildAgentMediaPayload as n, AgentMediaPayload as t };