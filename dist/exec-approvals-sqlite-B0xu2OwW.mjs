import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import "./session-key-CBvmC8zz.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { f as tryParsePersistedExecApprovals, o as normalizeExecApprovalsInternal } from "./exec-approvals-config-C7iYNiP7.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/infra/exec-approvals-sqlite.ts
const EXEC_APPROVALS_CONFIG_KEY = "current";
var ExecApprovalsMutationFencedError = class extends Error {
	constructor() {
		super("Exec approvals cannot be changed while agent deletion is in progress; retry.");
		this.name = "ExecApprovalsMutationFencedError";
	}
};
function assertExecApprovalsMutationAuthority(db, authority) {
	if (executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("agent_deletion_journal").select("operation_id").where("agent_id", "=", normalizeAgentId(authority.agentId)))?.operation_id !== authority.operationId) throw new ExecApprovalsMutationFencedError();
}
function assertExecApprovalsMutationAllowed(params) {
	const current = normalizeExecApprovalsInternal(params.current);
	const next = normalizeExecApprovalsInternal(params.next);
	const agentIds = /* @__PURE__ */ new Set([...Object.keys(current.agents ?? {}), ...Object.keys(next.agents ?? {})]);
	const state = getNodeSqliteKysely(params.db);
	for (const agentId of agentIds) {
		const currentPolicy = current.agents?.[agentId];
		const nextPolicy = next.agents?.[agentId];
		if (isDeepStrictEqual(currentPolicy, nextPolicy)) continue;
		const normalizedAgentId = normalizeAgentId(agentId);
		const journal = executeSqliteQueryTakeFirstSync(params.db, state.selectFrom("agent_deletion_journal").select("operation_id").where("agent_id", "=", normalizedAgentId));
		if (!journal) continue;
		const authority = params.authority;
		const authorizedRemoval = currentPolicy !== void 0 && nextPolicy === void 0;
		const authorizedRestore = currentPolicy === void 0 && nextPolicy !== void 0;
		if (authority?.agentId === normalizedAgentId && authority.operationId === journal.operation_id && (authority.action === "remove" && authorizedRemoval || authority.action === "restore" && authorizedRestore)) continue;
		throw new ExecApprovalsMutationFencedError();
	}
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
	const parsed = tryParsePersistedExecApprovals(raw);
	if (!parsed) params.onMalformed?.();
	return {
		path: params.path,
		exists: true,
		raw,
		file: parsed ?? normalizeExecApprovalsInternal({
			version: 1,
			defaults: {
				security: "deny",
				ask: "off",
				askFallback: "deny",
				autoAllowSkills: false
			},
			agents: {}
		}),
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
	const raw = params.raw ?? serializeExecApprovals(params.file);
	const values = {
		config_key: EXEC_APPROVALS_CONFIG_KEY,
		raw_json: raw,
		...projectionValues(params.file),
		updated_at_ms: params.now ?? Date.now()
	};
	executeSqliteQuerySync(params.db, getNodeSqliteKysely(params.db).insertInto("exec_approvals_config").values(values).onConflict((conflict) => conflict.column("config_key").doUpdateSet({
		raw_json: values.raw_json,
		socket_path: values.socket_path,
		has_socket_token: values.has_socket_token,
		default_security: values.default_security,
		default_ask: values.default_ask,
		default_ask_fallback: values.default_ask_fallback,
		auto_allow_skills: values.auto_allow_skills,
		agent_count: values.agent_count,
		allowlist_count: values.allowlist_count,
		updated_at_ms: values.updated_at_ms
	})));
}
function deleteExecApprovalsConfigRow(db) {
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("exec_approvals_config").where("config_key", "=", EXEC_APPROVALS_CONFIG_KEY));
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
//#endregion
export { mintMcpToolGrantLocked as a, serializeExecApprovals as c, deleteExecApprovalsConfigRow as i, snapshotFromExecApprovalsRow as l, assertExecApprovalsMutationAllowed as n, projectionValues as o, assertExecApprovalsMutationAuthority as r, readExecApprovalsConfigRow as s, ExecApprovalsMutationFencedError as t, writeExecApprovalsConfigRow as u };
