import { r as OPENCLAW_RUNTIME_CONTEXT_CUSTOM_TYPE } from "./internal-runtime-context-DLJtDQoI.mjs";
//#region src/config/sessions/session-history-visibility.ts
function isVisibleHistoryNonMessageEvent(event) {
	return event.type === "reset" || event.type === "compaction" || event.type === "custom_message" && event.display === true && event.customType !== OPENCLAW_RUNTIME_CONTEXT_CUSTOM_TYPE;
}
//#endregion
export { isVisibleHistoryNonMessageEvent as t };
