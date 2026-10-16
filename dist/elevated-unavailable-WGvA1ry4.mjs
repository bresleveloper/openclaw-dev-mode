import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { g as replyRunRegistry } from "./reply-run-registry.registry-CVpYrkbm.mjs";
import "./reply-run-registry-CHTPEb3-.mjs";
import { i as resolveActiveEmbeddedRunSessionId } from "./active-run-projections-B86tDIo_.mjs";
import { a as isNativeCommandTurn, c as resolveCommandTurnContext, r as isAuthorizedTextSlashCommandTurn } from "./command-turn-context-B-DtktkV.mjs";
import { a as resolveInternalSessionKey, o as resolveMainSessionAlias } from "./sessions-resolution-ZZ7dnwCs.mjs";
import "./sessions-helpers-BhYHEF2P.mjs";
//#region src/auto-reply/reply/explicit-steer-routing.ts
function parseSteerMessage(raw) {
	const match = raw.trim().match(/^\/(?:steer|tell)(?:\s+([\s\S]*))?$/i);
	if (!match) return null;
	return (match[1] ?? "").trim();
}
function listSteerCandidateSessionKeys(targetSessionKey) {
	const candidates = [targetSessionKey];
	if (targetSessionKey.includes(":slash:")) candidates.push(targetSessionKey.replace(":slash:", ":direct:"), targetSessionKey.replace(":slash:", ":dm:"));
	return candidates;
}
function resolveSteerSourceSessionKey(params) {
	const commandTarget = normalizeOptionalString(params.ctx.CommandTargetSessionKey);
	const commandSession = normalizeOptionalString(params.sessionKey ?? params.ctx.SessionKey);
	const raw = isNativeCommandTurn(resolveCommandTurnContext(params.ctx)) ? commandTarget || commandSession : commandSession || commandTarget;
	if (!raw) return;
	const { alias } = resolveMainSessionAlias(params.cfg);
	return resolveInternalSessionKey({
		key: raw,
		alias
	});
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
	const sourceSessionKey = resolveSteerSourceSessionKey(params);
	if (!sourceSessionKey) return;
	for (const candidateKey of listSteerCandidateSessionKeys(sourceSessionKey)) if (replyRunRegistry.get(candidateKey) ? replyRunRegistry.resolveCurrentMessageInjectionTarget(candidateKey) !== void 0 : resolveActiveEmbeddedRunSessionId(candidateKey) !== void 0) return candidateKey;
}
//#endregion
//#region src/auto-reply/reply/elevated-unavailable.ts
function formatElevatedUnavailableMessage(params) {
	const lines = [];
	lines.push(`elevated is not available right now (runtime=${params.runtimeSandboxed ? "sandboxed" : "direct"}).`);
	if (params.failures.length > 0) lines.push(`Failing gates: ${params.failures.map((f) => `${f.gate} (${f.key})`).join(", ")}`);
	else lines.push("Failing gates: enabled (tools.elevated.enabled / agents.entries.*.tools.elevated.enabled), allowFrom (tools.elevated.allowFrom.<provider>).");
	lines.push("Fix-it keys:");
	lines.push("- tools.elevated.enabled");
	lines.push("- tools.elevated.allowFrom.<provider>");
	lines.push("- agents.entries.*.tools.elevated.enabled");
	lines.push("- agents.entries.*.tools.elevated.allowFrom.<provider>");
	if (params.sessionKey) lines.push(`See: ${formatCliCommand(`openclaw sandbox explain --session ${params.sessionKey}`)}`);
	return lines.join("\n");
}
//#endregion
export { parseSteerMessage as n, resolveActiveExplicitSteerSessionKey as r, formatElevatedUnavailableMessage as t };
