import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { i as readConfigMachineStateWithMetadata } from "./config-machine-state-BfMkd608.mjs";
import { a as writeConfigMachineState, r as updateConfigMachineState } from "./config-machine-state-write-CSLKAek3.mjs";
import { createHash } from "node:crypto";
//#region src/tui/tui-last-session.ts
const TUI_LAST_SESSION_STATE_KEY_PREFIX = "tui.lastSession.";
function stateDatabaseOptions(stateDir) {
	return stateDir ? { env: {
		...process.env,
		OPENCLAW_STATE_DIR: stateDir
	} } : { env: process.env };
}
/** Builds a stable private-store key for the current TUI connection, agent, and session scope. */
function buildTuiLastSessionScopeKey(params) {
	const agentId = normalizeAgentId(params.agentId);
	const connectionUrl = params.connectionUrl.trim() || "local";
	return createHash("sha256").update(`${params.sessionScope}\n${agentId}\n${connectionUrl}`).digest("hex").slice(0, 32);
}
function isHeartbeatSessionKey(sessionKey) {
	return normalizeLowercaseStringOrEmpty(sessionKey).endsWith(":heartbeat");
}
/** Detects heartbeat/system sessions that should not become the remembered human session. */
function isHeartbeatLikeTuiSession(session) {
	if (isHeartbeatSessionKey(session.key)) return true;
	return [
		session.provider,
		session.lastProvider,
		session.lastChannel,
		session.lastTo,
		session.origin?.provider,
		session.origin?.surface,
		session.origin?.label
	].some((marker) => normalizeLowercaseStringOrEmpty(marker) === "heartbeat");
}
/** Reads the remembered session key for a scope from canonical shared state. */
async function readTuiLastSessionKey(params) {
	const rememberedKey = readConfigMachineStateWithMetadata(`${TUI_LAST_SESSION_STATE_KEY_PREFIX}${params.scopeKey}`, stateDatabaseOptions(params.stateDir))?.value.trim() ?? "";
	return rememberedKey && !isHeartbeatSessionKey(rememberedKey) ? rememberedKey : null;
}
/** Writes the remembered session key unless it is empty, unknown, or heartbeat-owned. */
async function writeTuiLastSessionKey(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey || sessionKey === "unknown" || isHeartbeatSessionKey(sessionKey)) return;
	writeConfigMachineState(`${TUI_LAST_SESSION_STATE_KEY_PREFIX}${params.scopeKey}`, sessionKey, stateDatabaseOptions(params.stateDir));
}
/**
* Wraps writeTuiLastSessionKey for fire-and-forget callers: a failing state DB
* means the next launch silently loses session restore, so the first failure
* is reported once instead of spamming every session switch.
*/
function createRememberSessionKeyWriter(params) {
	const write = params.write;
	let failureReported = false;
	return (sessionKey) => {
		const trimmed = sessionKey.trim();
		if (!trimmed || trimmed === "unknown") return;
		write({
			scopeKey: params.buildScopeKey(trimmed),
			sessionKey: trimmed
		}).catch((err) => {
			if (failureReported) return;
			failureReported = true;
			params.reportFailure(err instanceof Error ? err.message : String(err));
		});
	};
}
/** Removes restore pointers that target sessions retired by doctor repair. */
function clearTuiLastSessionPointers(params) {
	if (params.sessionKeys.size === 0) return 0;
	const options = stateDatabaseOptions(params.stateDir);
	return (withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("config_machine_state").select(["state_key", "value_json"]).where("state_key", "like", `${TUI_LAST_SESSION_STATE_KEY_PREFIX}%`)).rows.flatMap((row) => {
			const sessionKey = JSON.parse(row.value_json);
			return typeof sessionKey === "string" && params.sessionKeys.has(sessionKey) ? [row.state_key] : [];
		});
	}, options) ?? []).reduce((cleared, stateKey) => cleared + Number(clearTuiPointerIfRetired(stateKey, params.sessionKeys, options)), 0);
}
function clearTuiPointerIfRetired(stateKey, retiredSessionKeys, options) {
	let cleared = false;
	updateConfigMachineState(stateKey, (current) => {
		if (typeof current === "string" && retiredSessionKeys.has(current)) {
			cleared = true;
			return;
		}
		return current;
	}, options);
	return cleared;
}
/** Resolves a remembered key to a currently listed session for the active agent. */
function resolveRememberedTuiSessionKey(params) {
	const rememberedKey = params.rememberedKey?.trim();
	if (!rememberedKey) return null;
	if (isHeartbeatSessionKey(rememberedKey)) return null;
	const currentAgentId = normalizeAgentId(params.currentAgentId);
	const parsed = parseAgentSessionKey(rememberedKey);
	if (parsed && normalizeAgentId(parsed.agentId) !== currentAgentId) return null;
	const rememberedRest = parsed?.rest ?? rememberedKey;
	return params.sessions.find((session) => {
		if (isHeartbeatLikeTuiSession(session)) return false;
		if (session.key === rememberedKey) return true;
		return parseAgentSessionKey(session.key)?.rest === rememberedRest;
	})?.key ?? null;
}
//#endregion
export { resolveRememberedTuiSessionKey as a, readTuiLastSessionKey as i, clearTuiLastSessionPointers as n, writeTuiLastSessionKey as o, createRememberSessionKeyWriter as r, buildTuiLastSessionScopeKey as t };
