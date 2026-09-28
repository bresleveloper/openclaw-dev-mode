import { t as coerceErrorMessage } from "./error-coercion-C787aVxk.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, t as compileSqliteQueryBindings } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DM1AypRG.mjs";
import { t as canonicalizeConfiguredMcpServer } from "./mcp-config-normalize-Cl4qyvGH.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { t as listConfiguredMcpServers } from "./mcp-config-DtT0ID4w.mjs";
import { a as withClawMcpLifecycleLease, t as setConfiguredMcpServer } from "./mcp-config-mutation-C-1K0jH3.mjs";
import { createHash } from "node:crypto";
//#region src/claws/mcp.ts
const CLAW_MCP_REF_SCHEMA_VERSION = "openclaw.clawMcpServerRef.v1";
function selectMcpRefs(db) {
	return getNodeSqliteKysely(db).selectFrom("claw_mcp_server_refs").select([
		"schema_version",
		"agent_id",
		"name",
		"config_digest",
		"relationship",
		"origin",
		"independent_owner",
		"status",
		"error",
		"created_at_ms",
		"updated_at_ms"
	]);
}
function refToRow(ref) {
	return {
		agent_id: ref.agentId,
		name: ref.name,
		schema_version: ref.schemaVersion,
		config_digest: ref.configDigest,
		relationship: ref.relationship,
		origin: ref.origin,
		independent_owner: ref.independentOwner ? 1 : 0,
		status: ref.status,
		error: ref.error ?? null,
		created_at_ms: ref.createdAtMs,
		updated_at_ms: ref.updatedAtMs
	};
}
var ClawMcpInstallError = class extends Error {
	constructor(code, message, mcpServers) {
		super(message);
		this.code = code;
		this.mcpServers = mcpServers;
		this.name = "ClawMcpInstallError";
	}
};
function mcpServerFromActionDetails(details) {
	const { expectedState: _expectedState, prerequisites: _prerequisites, ...server } = details;
	return "command" in server || "url" in server ? server : void 0;
}
function rowToRef(row) {
	return {
		schemaVersion: CLAW_MCP_REF_SCHEMA_VERSION,
		agentId: row.agent_id,
		name: row.name,
		configDigest: row.config_digest,
		relationship: row.relationship,
		origin: row.origin,
		independentOwner: coerceRequiredSqliteNumber(row.independent_owner) === 1,
		status: row.status,
		...row.error ? { error: row.error } : {},
		createdAtMs: coerceRequiredSqliteNumber(row.created_at_ms),
		updatedAtMs: coerceRequiredSqliteNumber(row.updated_at_ms)
	};
}
function digestClawMcpServer(server) {
	const canonical = canonicalizeConfiguredMcpServer(server);
	return `sha256:${createHash("sha256").update(stableStringify(canonical)).digest("hex")}`;
}
function persistPendingRef(plan, name, server, ownership, options) {
	const nowMs = options.nowMs ?? Date.now();
	const configDigest = digestClawMcpServer(server);
	const database = openOpenClawStateDatabase(options);
	const { compiled, bind } = compileSqliteQueryBindings((parameter) => selectMcpRefs(database.db).where("agent_id", "=", parameter((value) => value.agentId)).where("name", "=", parameter((value) => value.name)));
	const existing = database.db.prepare(compiled.sql).get(...bind({
		agentId: plan.agent.finalId,
		name
	}));
	if (existing) {
		const ref = rowToRef(existing);
		if (ref.configDigest !== configDigest || ref.status === "failed") throw new ClawMcpInstallError("mcp_provenance_conflict", `MCP server ${JSON.stringify(name)} differs from its ownership record.`, [ref]);
		return {
			ref,
			existing: true
		};
	}
	const ref = {
		schemaVersion: CLAW_MCP_REF_SCHEMA_VERSION,
		agentId: plan.agent.finalId,
		name,
		configDigest,
		...ownership,
		status: "pending",
		createdAtMs: nowMs,
		updatedAtMs: nowMs
	};
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("claw_mcp_server_refs").values(refToRow(ref)));
	}, options);
	return {
		ref,
		existing: false
	};
}
function updateRef(ref, update, options) {
	const updated = {
		...ref,
		...update,
		updatedAtMs: options.nowMs ?? Date.now()
	};
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("claw_mcp_server_refs").set({
			status: update.status,
			error: update.error ?? null,
			updated_at_ms: updated.updatedAtMs
		}).where("agent_id", "=", ref.agentId).where("name", "=", ref.name));
	}, options);
	return updated;
}
async function installClawMcpServers(plan, options = {}) {
	const setMcpServer = options.setMcpServer ?? setConfiguredMcpServer;
	const listMcpServers = options.listMcpServers ?? listConfiguredMcpServers;
	const refs = [];
	for (const action of plan.actions.filter((candidate) => candidate.kind === "mcpServer")) await withClawMcpLifecycleLease(action.id, options, async () => {
		const server = action.details ? mcpServerFromActionDetails(action.details) : void 0;
		if (!server) throw new ClawMcpInstallError("mcp_plan_invalid", `MCP server action ${JSON.stringify(action.id)} is invalid.`, refs);
		const listed = await listMcpServers();
		if (!listed.ok) throw new ClawMcpInstallError("mcp_preflight_failed", listed.error, refs);
		const configured = listed.mcpServers[action.id];
		const configDigest = digestClawMcpServer(server);
		if (configured && digestClawMcpServer(configured) !== configDigest) throw new ClawMcpInstallError("mcp_config_conflict", `MCP server ${JSON.stringify(action.id)} already exists with different configuration.`, refs);
		const existingRefs = readClawMcpServerRefsByName(action.id, options);
		const inheritsClawOrigin = existingRefs.length > 0 && existingRefs.every((candidate) => candidate.origin === "claw-introduced" && !candidate.independentOwner);
		const ownership = configured ? {
			relationship: "referenced",
			origin: inheritsClawOrigin ? "claw-introduced" : "pre-existing",
			independentOwner: !inheritsClawOrigin
		} : {
			relationship: "managed",
			origin: "claw-introduced",
			independentOwner: false
		};
		const pendingResult = persistPendingRef(plan, action.id, server, ownership, options);
		let pending = pendingResult.ref;
		refs.push(pending);
		if (pending.status === "complete") {
			if (configured) return;
			const hasSiblingOwner = readClawMcpServerRefsByName(action.id, options).some((candidate) => candidate.agentId !== plan.agent.finalId);
			if (pending.relationship !== "managed" || pending.origin !== "claw-introduced" || pending.independentOwner || hasSiblingOwner) throw new ClawMcpInstallError("mcp_reconcile_conflict", `MCP server ${JSON.stringify(action.id)} was removed while shared or independently owned and will not be recreated.`, refs);
			pending = updateRef(pending, { status: "pending" }, options);
			refs[refs.length - 1] = pending;
		}
		if (pendingResult.existing && configured) {
			if (digestClawMcpServer(configured) !== pending.configDigest) throw new ClawMcpInstallError("mcp_reconcile_conflict", `MCP server ${JSON.stringify(action.id)} changed after an ambiguous write.`, refs);
			refs[refs.length - 1] = updateRef(pending, { status: "complete" }, options);
			return;
		}
		if (configured) {
			refs[refs.length - 1] = updateRef(pending, { status: "complete" }, options);
			return;
		}
		let result;
		try {
			result = await setMcpServer({
				name: action.id,
				server,
				createOnly: true,
				recordIndependentOwner: false
			});
		} catch (error) {
			throw new ClawMcpInstallError("mcp_install_uncertain", coerceErrorMessage(error), refs);
		}
		if (!result.ok) {
			refs[refs.length - 1] = updateRef(pending, {
				status: "failed",
				error: result.error
			}, options);
			throw new ClawMcpInstallError("mcp_install_failed", result.error, refs);
		}
		try {
			refs[refs.length - 1] = updateRef(pending, { status: "complete" }, options);
		} catch (error) {
			throw new ClawMcpInstallError("mcp_provenance_failed", `MCP server was configured, but ownership could not be persisted: ${coerceErrorMessage(error)}`, refs);
		}
	});
	return refs;
}
function readClawMcpServerRefs(agentId, options = {}) {
	const { db } = openOpenClawStateDatabase(options);
	if (options.readOnly && !tableExists(db, "claw_mcp_server_refs")) return [];
	const { compiled, bind } = compileSqliteQueryBindings((parameter) => selectMcpRefs(db).where("agent_id", "=", parameter((value) => value)).orderBy("name"));
	return db.prepare(compiled.sql).all(...bind(agentId)).map(rowToRef);
}
function readClawMcpServerRefsByName(name, options = {}) {
	const { db } = openOpenClawStateDatabase(options);
	if (options.readOnly && !tableExists(db, "claw_mcp_server_refs")) return [];
	const { compiled, bind } = compileSqliteQueryBindings((parameter) => selectMcpRefs(db).where("name", "=", parameter((value) => value)).orderBy("agent_id"));
	return db.prepare(compiled.sql).all(...bind(name)).map(rowToRef);
}
function clawMcpRemovalSelector(ref) {
	return `mcp:${ref.name}`;
}
function planClawMcpServerRemoval(ref, options = {}) {
	const affectedClawAgentIds = readClawMcpServerRefsByName(ref.name, options).filter((candidate) => candidate.agentId !== ref.agentId).map((candidate) => candidate.agentId).toSorted();
	const cleanup = options.referencedCleanup ?? { mode: "retain" };
	const explicitlySelected = cleanup.mode === "remove-selected" && (cleanup.selected ?? []).includes(clawMcpRemovalSelector(ref));
	const conflicts = affectedClawAgentIds.length > 0 || ref.independentOwner || ref.origin === "pre-existing";
	const release = (reason, blocked = false) => ({
		ref,
		action: "release",
		blocked,
		affectedClawAgentIds,
		reason
	});
	if (ref.relationship === "managed") {
		if (explicitlySelected) return release("--remove-referenced only accepts resources with a referenced relationship.", true);
		if (affectedClawAgentIds.length > 0) return release("Another Claw still references this MCP server.");
		if (ref.independentOwner) return release("MCP server has a current non-Claw owner.");
		return {
			ref,
			action: "remove",
			blocked: false,
			affectedClawAgentIds
		};
	}
	if (!explicitlySelected && cleanup.mode !== "remove-if-unused") return release("Referenced resources are retained unless a cleanup mode selects them.");
	if (!explicitlySelected && conflicts) return release(affectedClawAgentIds.length > 0 ? "Another Claw still references this MCP server." : "MCP server has a current non-Claw owner or pre-existing origin.");
	if (explicitlySelected && conflicts && !cleanup.allowConflicts) return release("Selected MCP server has other Claw dependents, a non-Claw owner, or pre-existing origin; explicit conflict override is required.", true);
	return {
		ref,
		action: "remove",
		blocked: false,
		affectedClawAgentIds
	};
}
function reconcileClawMcpServerRefs(agentId, configuredServers, options = {}) {
	return readClawMcpServerRefs(agentId, options).map((ref) => {
		if (ref.status !== "pending") return ref;
		const configured = configuredServers[ref.name];
		return configured && digestClawMcpServer(configured) === ref.configDigest ? updateRef(ref, { status: "complete" }, options) : ref;
	});
}
function deleteClawMcpServerRef(agentId, name, options = {}) {
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("claw_mcp_server_refs").where("agent_id", "=", agentId).where("name", "=", name));
	}, options);
}
function upsertClawMcpServerRef(ref, options = {}) {
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("claw_mcp_server_refs").values(refToRow(ref)).onConflict((conflict) => conflict.columns(["agent_id", "name"]).doUpdateSet((eb) => ({
			schema_version: eb.ref("excluded.schema_version"),
			config_digest: eb.ref("excluded.config_digest"),
			relationship: eb.ref("excluded.relationship"),
			origin: eb.ref("excluded.origin"),
			independent_owner: eb.ref("excluded.independent_owner"),
			status: eb.ref("excluded.status"),
			error: eb.ref("excluded.error"),
			updated_at_ms: eb.ref("excluded.updated_at_ms")
		}))));
	}, options);
}
//#endregion
export { digestClawMcpServer as a, readClawMcpServerRefs as c, upsertClawMcpServerRef as d, deleteClawMcpServerRef as i, readClawMcpServerRefsByName as l, ClawMcpInstallError as n, installClawMcpServers as o, clawMcpRemovalSelector as r, planClawMcpServerRemoval as s, CLAW_MCP_REF_SCHEMA_VERSION as t, reconcileClawMcpServerRefs as u };
