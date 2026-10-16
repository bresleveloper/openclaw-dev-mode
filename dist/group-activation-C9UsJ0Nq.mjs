import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
//#region src/auto-reply/group-activation.ts
/** Normalize a raw group activation mode string. */
function normalizeGroupActivation(raw) {
	const value = normalizeOptionalLowercaseString(raw);
	return value === "mention" || value === "always" ? value : void 0;
}
/** Parse `/activation` commands from inbound message text. */
function parseActivationCommand(raw) {
	if (!raw) return { hasCommand: false };
	const trimmed = raw.trim();
	if (!trimmed) return { hasCommand: false };
	const match = trimmed.replace(/^\/([^\s:]+)\s*:(.*)$/, (_, cmd, rest) => {
		const trimmedRest = rest.trimStart();
		return trimmedRest ? `/${cmd} ${trimmedRest}` : `/${cmd}`;
	}).match(/^\/activation(?:\s+([a-zA-Z]+))?\s*$/i);
	if (!match) return { hasCommand: false };
	return {
		hasCommand: true,
		mode: normalizeGroupActivation(match[1])
	};
}
//#endregion
export { parseActivationCommand as n, normalizeGroupActivation as t };
