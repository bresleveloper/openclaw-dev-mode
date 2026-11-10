import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { t as assertExecApprovalsHostPolicyUnchanged } from "./exec-approvals-policy-Cd5JaUxb.mjs";
import { i as createFailClosedExecApprovalsFallback, l as parsePersistedExecApprovals, p as tryParsePersistedExecApprovals, s as normalizeExecApprovalsInternal, u as resolveExecApprovalsDisplayPath } from "./exec-approvals-config-JiuCEgOc.mjs";
import { r as resetExecApprovalsMigrationGateForTest, t as ExecApprovalsMigrationRequiredError } from "./exec-approvals-migration-gate-uz_Dsb9e.mjs";
import { t as execApprovalsPublication } from "./exec-approvals-publication-BPITitc6.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/infra/exec-approvals-sqlite.ts
const EXEC_APPROVALS_CONFIG_KEY = "current";
var ExecApprovalsMutationFencedError = class extends Error {
	constructor() {
		super("Exec approvals cannot be changed while agent deletion is in progress; retry.");
		this.name = "ExecApprovalsMutationFencedError";
	}
};
function assertExecApprovalsMutationAllowed(params) {
	const current = normalizeExecApprovalsInternal(params.current);
	const next = normalizeExecApprovalsInternal(params.next);
	const changed = [.../* @__PURE__ */ new Set([...Object.keys(current.agents ?? {}), ...Object.keys(next.agents ?? {})])].filter((agentId) => !isDeepStrictEqual(current.agents?.[agentId], next.agents?.[agentId]));
	const agentIds = new Set(changed.map(normalizeAgentId));
	if (agentIds.size === 0) return;
	if (executeSqliteQueryTakeFirstSync(params.db, getNodeSqliteKysely(params.db).selectFrom("agent_deletion_journal").select("agent_id").where("agent_id", "in", [...agentIds]).limit(1))) throw new ExecApprovalsMutationFencedError();
}
function hashExecApprovalsRaw(raw) {
	return raw === null ? `missing:${sha256Hex("")}` : sha256Hex(raw);
}
function serializeExecApprovals(file) {
	return `${JSON.stringify(file, null, 2)}\n`;
}
function readExecApprovalsConfigRow(db) {
	return executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("exec_approvals_config").select("raw_json").where("config_key", "=", EXEC_APPROVALS_CONFIG_KEY));
}
function snapshotFromExecApprovalsRow(params) {
	const raw = params.row?.raw_json ?? null;
	if (raw === null) return {
		path: params.path,
		exists: false,
		raw: null,
		file: normalizeExecApprovalsInternal({
			version: 1,
			agents: {}
		}),
		hash: hashExecApprovalsRaw(null)
	};
	const result = parsePersistedExecApprovals(raw);
	if (!result.ok && result.error === "Legacy exec approval policy requires Doctor repair") throw new ExecApprovalsMigrationRequiredError(params.path, void 0, result.error);
	const parsed = result.ok ? result.value : null;
	if (!parsed) params.onMalformed?.();
	return {
		path: params.path,
		exists: true,
		raw,
		file: parsed ?? createFailClosedExecApprovalsFallback(),
		hash: hashExecApprovalsRaw(raw)
	};
}
function projectionValues(file) {
	const normalized = normalizeExecApprovalsInternal(file);
	const agents = Object.values(normalized.agents ?? {});
	return {
		socket_path: normalized.socket?.path ?? null,
		has_socket_token: normalized.socket?.token ? 1 : 0,
		default_security: normalized.defaults?.security ?? null,
		default_ask: normalized.defaults?.ask ?? null,
		default_ask_fallback: normalized.defaults?.askFallback ?? null,
		auto_allow_skills: normalized.defaults?.autoAllowSkills === void 0 ? null : normalized.defaults.autoAllowSkills ? 1 : 0,
		agent_count: agents.length,
		allowlist_count: agents.reduce((total, agent) => total + (agent.allowlist?.length ?? 0), 0)
	};
}
function writeExecApprovalsConfigRow(params) {
	const normalized = normalizeExecApprovalsInternal(params.file);
	const authored = params.raw ?? serializeExecApprovals(params.file);
	const parsed = parsePersistedExecApprovals(authored);
	const raw = params.raw ?? (!parsed.ok && parsed.error === "Legacy exec approval policy requires Doctor repair" ? serializeExecApprovals(normalized) : authored);
	const values = {
		raw_json: raw,
		...projectionValues(normalized),
		updated_at_ms: params.now ?? Date.now()
	};
	executeSqliteQuerySync(params.db, getNodeSqliteKysely(params.db).insertInto("exec_approvals_config").values({
		config_key: EXEC_APPROVALS_CONFIG_KEY,
		...values
	}).onConflict((conflict) => conflict.column("config_key").doUpdateSet(values)));
	const persisted = parsePersistedExecApprovals(raw);
	const { socket: _socket, ...policy } = persisted.ok ? persisted.value : createFailClosedExecApprovalsFallback();
	execApprovalsPublication.stagePostimages(params.db, [{
		file: policy,
		change: params.change ?? "policy"
	}]);
	return raw;
}
function deleteExecApprovalsConfigRow(db) {
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("exec_approvals_config").where("config_key", "=", EXEC_APPROVALS_CONFIG_KEY));
	execApprovalsPublication.stageDeletions(db, [EXEC_APPROVALS_CONFIG_KEY]);
}
/** Called only inside the approval owner's winning resolution transaction. */
function mintMcpToolGrantLocked(db, grant, nowMs) {
	const row = readExecApprovalsConfigRow(db);
	const current = row ? tryParsePersistedExecApprovals(row.raw_json) : { version: 1 };
	if (!current) throw new Error("Cannot save MCP tool grant: invalid exec approvals document");
	const agent = current.agents?.[grant.agentId];
	if (agent?.mcpTools?.some((entry) => entry.server === grant.server && entry.tool === grant.tool)) return;
	const next = {
		...current,
		agents: {
			...current.agents,
			[grant.agentId]: {
				...agent,
				mcpTools: [...agent?.mcpTools ?? [], {
					server: grant.server,
					tool: grant.tool,
					source: "allow-always",
					addedAt: nowMs
				}]
			}
		}
	};
	assertExecApprovalsHostPolicyUnchanged(current, next);
	assertExecApprovalsMutationAllowed({
		db,
		current,
		next
	});
	writeExecApprovalsConfigRow({
		db,
		file: next,
		now: nowMs
	});
}
const log = createSubsystemLogger("infra/exec-approvals");
const WARN_INTERVAL_MS = 6e4;
let lastWarnAt;
function warnFailClosed(message, error) {
	const now = Date.now();
	if (lastWarnAt !== void 0 && now - lastWarnAt < WARN_INTERVAL_MS) return;
	lastWarnAt = now;
	log.warn(message, error === void 0 ? void 0 : { error: formatErrorMessage(error) });
}
function snapshotFromExecApprovalsDatabase(db, displayPath = resolveExecApprovalsDisplayPath()) {
	return snapshotFromExecApprovalsRow({
		path: displayPath,
		row: readExecApprovalsConfigRow(db),
		onMalformed: () => warnFailClosed("exec approvals SQLite row is malformed; denying host execution")
	});
}
if (process.env.VITEST || false) Object.assign(globalThis, { [Symbol.for("openclaw.execApprovalsStoreTestApi")]: { reset() {
	resetExecApprovalsMigrationGateForTest();
	lastWarnAt = void 0;
} } });
//#endregion
export { projectionValues as a, snapshotFromExecApprovalsDatabase as c, writeExecApprovalsConfigRow as d, mintMcpToolGrantLocked as i, snapshotFromExecApprovalsRow as l, assertExecApprovalsMutationAllowed as n, readExecApprovalsConfigRow as o, deleteExecApprovalsConfigRow as r, serializeExecApprovals as s, ExecApprovalsMutationFencedError as t, warnFailClosed as u };
