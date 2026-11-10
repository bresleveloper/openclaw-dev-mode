import { p as readStringOrNumberParam } from "./common-BofcG96e.mjs";
//#region src/channels/plugins/actions/reaction-message-id.ts
function resolveReactionMessageId(params) {
	return readStringOrNumberParam(params.args, "messageId") ?? params.toolContext?.currentMessageId;
}
//#endregion
export { resolveReactionMessageId as t };
