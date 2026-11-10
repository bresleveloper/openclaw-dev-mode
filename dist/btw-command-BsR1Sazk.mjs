import { r as matchSlashCommandToken } from "./commands-registry.data-CPKKYobJ.mjs";
import { n as normalizeCommandBody } from "./commands-registry-normalize-BI2t-DKf.mjs";
import "./commands-registry-CFDGAPH8.mjs";
//#region src/auto-reply/reply/btw-command.ts
const BTW_COMMAND_RE = /^\/btw(?::|\s|$)/i;
function isBtwRequestText(text, options) {
	if (!text) return false;
	const normalized = normalizeCommandBody(text, options).trim();
	return BTW_COMMAND_RE.test(normalized);
}
function extractBtwQuestion(text, options) {
	if (!text) return null;
	return matchSlashCommandToken(normalizeCommandBody(text, options), "/btw");
}
//#endregion
export { isBtwRequestText as n, extractBtwQuestion as t };
