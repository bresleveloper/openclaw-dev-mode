import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { g as replyRunRegistry } from "./reply-run-registry.registry-CmcnzV4X.mjs";
import { o as resolveActiveEmbeddedRunSessionId } from "./active-run-projections-Crpg2l0z.mjs";
import "./reply-run-registry-BFUfTf-U.mjs";
import { a as isNativeCommandTurn, c as resolveCommandTurnContext, r as isAuthorizedTextSlashCommandTurn } from "./command-turn-context-TJGbDzsZ.mjs";
import { t as resolveCommandSourceSessionKey } from "./command-source-session-key-DAZwRkfj.mjs";
//#region src/auto-reply/reply/explicit-steer-routing.ts
function parseSteerMessage(raw) {
	const match = raw.trim().match(/^\/(?:steer|tell)(?:\s+([\s\S]*))?$/i);
	return match ? (match[1] ?? "").trim() : null;
}
function listSteerCandidateSessionKeys(targetSessionKey) {
	return targetSessionKey.includes(":slash:") ? [
		targetSessionKey,
		targetSessionKey.replace(":slash:", ":direct:"),
		targetSessionKey.replace(":slash:", ":dm:")
	] : [targetSessionKey];
}
/**
* Resolve an authorized explicit steer command to the exact session that owns
* an injectable active reply. This is intentionally read-only: callers decide
* whether to retarget session preparation or continue as an ordinary prompt.
*/
function resolveActiveExplicitSteerSessionKey(params) {
	const commandTurn = resolveCommandTurnContext(params.ctx);
	if (!isNativeCommandTurn(commandTurn) && !isAuthorizedTextSlashCommandTurn(commandTurn)) return;
	if (!parseSteerMessage(params.commandBody ?? commandTurn.body ?? normalizeOptionalString(params.ctx.CommandBody) ?? normalizeOptionalString(params.ctx.BodyForCommands) ?? normalizeOptionalString(params.ctx.Body) ?? "")) return;
	const sourceSessionKey = resolveCommandSourceSessionKey({
		...params,
		sessionKey: params.sessionKey ?? params.ctx.SessionKey
	});
	if (!sourceSessionKey) return;
	for (const candidateKey of listSteerCandidateSessionKeys(sourceSessionKey)) if (replyRunRegistry.get(candidateKey) ? replyRunRegistry.resolveCurrentMessageInjectionTarget(candidateKey) !== void 0 : resolveActiveEmbeddedRunSessionId(candidateKey) !== void 0) return candidateKey;
}
//#endregion
export { resolveActiveExplicitSteerSessionKey as n, parseSteerMessage as t };
