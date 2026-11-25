import{u as readStringOrNumberParam}from"./common-r0g1xtWs.mjs";
//!src/channels/plugins/actions/reaction-message-id.ts
function resolveReactionMessageId(e){return readStringOrNumberParam(e.args,`messageId`)??e.toolContext?.currentMessageId}export{resolveReactionMessageId as t};