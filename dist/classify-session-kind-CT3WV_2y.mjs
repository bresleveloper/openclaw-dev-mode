import { S as isCronSessionKey } from "./session-key-C09ow4h0.mjs";
//#region src/sessions/classify-session-kind.ts
function classifySessionKind(key, entry) {
	if (key === "global") return "global";
	if (key === "unknown") return "unknown";
	if (isCronSessionKey(key)) return "cron";
	if (entry?.spawnedBy) return "spawn-child";
	if (entry?.chatType === "group" || entry?.chatType === "channel") return "group";
	if (key.includes(":group:") || key.includes(":channel:")) return "group";
	return "direct";
}
//#endregion
export { classifySessionKind as t };
