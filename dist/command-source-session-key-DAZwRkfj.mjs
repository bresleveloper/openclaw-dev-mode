import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as isNativeCommandTurn, c as resolveCommandTurnContext } from "./command-turn-context-TJGbDzsZ.mjs";
import { o as resolveInternalSessionKey, s as resolveMainSessionAlias } from "./sessions-resolution-CQXReb8R.mjs";
import "./sessions-helpers-DCz0gP72.mjs";
//#region src/auto-reply/reply/command-source-session-key.ts
function resolveCommandSourceSessionKey(params, opts) {
	const commandTarget = normalizeOptionalString(params.ctx.CommandTargetSessionKey);
	const commandSession = normalizeOptionalString(params.sessionKey);
	const raw = opts?.preferCommandTarget ?? isNativeCommandTurn(resolveCommandTurnContext(params.ctx)) ? commandTarget || commandSession : commandSession || commandTarget;
	if (!raw) return;
	const { alias } = resolveMainSessionAlias(params.cfg);
	return resolveInternalSessionKey({
		key: raw,
		alias
	});
}
//#endregion
export { resolveCommandSourceSessionKey as t };
