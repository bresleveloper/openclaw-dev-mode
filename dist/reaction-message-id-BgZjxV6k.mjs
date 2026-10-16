import { p as readStringOrNumberParam } from "./common-Dyxcwsy8.mjs";
//#region src/channels/plugins/actions/reaction-message-id.ts
/**
* Resolves the message id for reaction tools from explicit args or current tool context.
*/
function resolveReactionMessageId(params) {
	return readStringOrNumberParam(params.args, "messageId") ?? params.toolContext?.currentMessageId;
}
//#endregion
export { resolveReactionMessageId as t };
