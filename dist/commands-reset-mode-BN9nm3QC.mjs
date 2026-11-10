import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
//#region src/auto-reply/reply/commands-reset-mode.ts
function parseSoftResetCommand(commandBodyNormalized) {
	let rest = commandBodyNormalized;
	for (const pattern of [/^\/reset(?:\s|$)/, /^soft(?:\s|$)/]) {
		const match = normalizeLowercaseStringOrEmpty(rest).match(pattern);
		if (!match) return { matched: false };
		rest = rest.slice(match[0].length).trimStart();
	}
	return {
		matched: true,
		tail: rest
	};
}
//#endregion
export { parseSoftResetCommand as t };
