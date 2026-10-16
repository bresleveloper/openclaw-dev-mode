import { t as coerceErrorMessage } from "./error-coercion-CvJK4lmH.mjs";
import "./src-CdRlGRnW.mjs";
import { a as getNodeSqliteKysely, r as executeSqliteQuerySync, t as compileSqliteQueryBindings } from "./kysely-sync-K7ftY-g4.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { l as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { n as executeOpenClawStateWorker } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { t as canonicalizeConfiguredMcpServer } from "./mcp-config-normalize-DQmvZkAl.mjs";
import { t as assertClawPackageLifecycleWriteArtifact } from "./claw-package-lifecycle-lease-v-fevrKC.mjs";
import { u as digestClawValue } from "./schema-portability-DPQGHUzw.mjs";
import { n as runWithOpenClawStateLeaseWorker } from "./openclaw-state-lease-worker-operation-zXIF5JPg.mjs";
import { t as listConfiguredMcpServers } from "./mcp-config-Cv7bEPf1.mjs";
import { a as withClawMcpLifecycleLease, t as setConfiguredMcpServer } from "./mcp-config-mutation-CtCOP707.mjs";
import { i as selectMcpRefs, n as refToRow, r as rowToRef, t as CLAW_MCP_REF_SCHEMA_VERSION } from "./mcp-records-F-n78kde.mjs";
//#region src/claws/types.ts
const CLAW_ADD_PLAN_SCHEMA_VERSION = "openclaw.clawAddPlan.v1";
const CLAW_INSPECT_RESULT_SCHEMA_VERSION = "openclaw.clawInspect.v1";
const CLAW_OUTPUT_STABILITY = "experimental";
//#endregion
//#region src/claws/provenance-write.ts
async function claimClawPackageRefStatus(ref, status, options) {
	if (options.readOnly) throw new Error("Claw provenance writes require writable state.");
	const capturedRef = structuredClone(ref);
	const nowMs = options.nowMs;
	assertClawPackageLifecycleWriteArtifact(options.lease, capturedRef);
	const assertCaller = options.assertCurrent?.bind(options);
	const context = captureOpenClawStateWorkerContext({
		...options,
		path: options.database?.path ?? options.path
	});
	const assertCurrent = () => {
		context.admission.assertCurrent();
		assertCaller?.();
	};
	const result = await runWithOpenClawStateLeaseWorker(options.lease, context, (scope, identity) => scope.execute({
		type: "clawProvenance.packageStatus",
		input: {
			ref: capturedRef,
			status,
			nowMs,
			lease: identity
		}
	}), { assertCurrent });
	assertCurrent();
	return result;
}
function reconcileClawMcpServerRefsInWorker(agentId, digests, options) {
	if (options.readOnly) throw new Error("Claw provenance writes require writable state.");
	const context = captureOpenClawStateWorkerContext({
		...options,
		path: options.database?.path ?? options.path
	});
	return executeOpenClawStateWorker(context, {
		type: "clawProvenance.reconcileMcp",
		input: {
			agentId,
			digests,
			nowMs: options.nowMs
		}
	});
}
//#endregion
//#region src/claws/mcp.ts
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
function digestClawMcpServer(server) {
	return digestClawValue(canonicalizeConfiguredMcpServer(server));
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
		return ref;
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
	return ref;
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
		let pending = persistPendingRef(plan, action.id, server, ownership, options);
		refs.push(pending);
		if (pending.status === "complete") {
			if (configured) return;
			const hasSiblingOwner = readClawMcpServerRefsByName(action.id, options).some((candidate) => candidate.agentId !== plan.agent.finalId);
			if (pending.relationship !== "managed" || pending.origin !== "claw-introduced" || pending.independentOwner || hasSiblingOwner) throw new ClawMcpInstallError("mcp_reconcile_conflict", `MCP server ${JSON.stringify(action.id)} was removed while shared or independently owned and will not be recreated.`, refs);
			pending = updateRef(pending, { status: "pending" }, options);
			refs[refs.length - 1] = pending;
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
	return reconcileClawMcpServerRefsInWorker(agentId, Object.fromEntries(Object.entries(configuredServers).map(([name, server]) => [name, digestClawMcpServer(server)])), options);
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
export { installClawMcpServers as a, readClawMcpServerRefsByName as c, claimClawPackageRefStatus as d, CLAW_ADD_PLAN_SCHEMA_VERSION as f, digestClawMcpServer as i, reconcileClawMcpServerRefs as l, CLAW_OUTPUT_STABILITY as m, clawMcpRemovalSelector as n, planClawMcpServerRemoval as o, CLAW_INSPECT_RESULT_SCHEMA_VERSION as p, deleteClawMcpServerRef as r, readClawMcpServerRefs as s, ClawMcpInstallError as t, upsertClawMcpServerRef as u };
