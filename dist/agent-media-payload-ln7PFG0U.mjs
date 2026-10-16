import { u as projectMediaFacts } from "./media-facts-CJdQ4R61.mjs";
import "./local-roots-D6JiS64U.mjs";
//#region src/plugin-sdk/agent-media-payload.ts
/**
* @deprecated Pass ordered facts as `MsgContext.media`; use
* `toInboundMediaFacts` from `openclaw/plugin-sdk/channel-inbound`.
*/
function buildAgentMediaPayload(mediaList) {
	return projectMediaFacts(mediaList, "compact");
}
//#endregion
export { buildAgentMediaPayload as t };
