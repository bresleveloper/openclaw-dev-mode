import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
//#region src/auto-reply/reply/commands-reset-mode.ts
function parseSoftResetCommand(commandBodyNormalized) {
	const resetMatch = normalizeLowercaseStringOrEmpty(commandBodyNormalized).match(/^\/reset(?:\s|$)/);
	if (!resetMatch) return { matched: false };
	const rest = commandBodyNormalized.slice(resetMatch[0].length).trimStart();
	const softMatch = normalizeLowercaseStringOrEmpty(rest).match(/^soft(?:\s|$)/);
	if (!softMatch) return { matched: false };
	return {
		matched: true,
		tail: rest.slice(softMatch[0].length).trimStart()
	};
}
//#endregion
export { parseSoftResetCommand as t };
