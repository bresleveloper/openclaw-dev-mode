import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { c as SqliteWorkerError } from "./sqlite-worker-contract-DhDutMia.mjs";
import { i as createSqliteWorkerOperationAdmission, o as observeSqliteWorkerCommittedFacts } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { r as logInfo } from "./logger-DHVmYOKs.mjs";
import { i as normalizeStoredNodeHostConfig, n as normalizeGatewayConfig, r as normalizeNodeHostCommands, t as nodePreparedWorkspacePublication } from "./node-worker-prepared-workspace-publication-BVABEP6T.mjs";
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
//#region src/node-host/node-worker-journal-worker.ts
/** Host custody lasts through delivery and native transaction settlement. */
var NodeWorkerJournalWorker = class {
	constructor(options) {
		this.options = options;
		this.pending = /* @__PURE__ */ new Set();
		this.settlements = /* @__PURE__ */ new Set();
		this.accepting = true;
	}
	operation(type) {
		return (...input) => this.execute({
			type,
			input
		});
	}
	execute(command, authority) {
		const prepared = structuredClone(command);
		if (prepared.type === "nodeWorker.prepared.register" || prepared.type === "nodeWorker.prepared.bind" || prepared.type === "nodeWorker.prepared.retire" || prepared.type === "nodeWorker.prepared.completeMutation") {
			if (!this.accepting) return Promise.reject(this.uncertain ?? /* @__PURE__ */ new Error("Node worker journal admission is closed"));
			return this.runAdmitted((scope) => scope.execute(prepared), authority, void 0, true);
		}
		if (prepared.type === "nodeWorker.turn.get" || prepared.type === "nodeWorker.launch.nonterminalCount") return this.runAdmitted((scope) => scope.execute(prepared), authority);
		return this.run((scope) => scope.execute(prepared), authority);
	}
	run(operation, authority, options) {
		if (!this.accepting) return Promise.reject(this.uncertain ?? /* @__PURE__ */ new Error("Node worker journal admission is closed"));
		return options?.existingOnly ? this.runAdmitted(operation, authority, options) : this.runAdmitted(operation, authority);
	}
	runAdmitted(operation, authority, options, preparedMutation) {
		if (this.uncertain) return Promise.reject(this.uncertain);
		const context = captureOpenClawStateWorkerContext(this.options);
		const assertCurrent = () => {
			if (this.uncertain) throw this.uncertain;
			authority?.assertCurrent();
		};
		const createAdmission = (retained) => {
			assertCurrent();
			this.settlements.add(retained.settled);
			retained.settled.then((settlement) => {
				if (settlement.kind === "unknown") {
					this.uncertain ??= Object.assign(new SqliteWorkerError("Node worker journal transaction outcome is unknown", "outcome-unknown"), { cause: settlement.error });
					this.accepting = false;
				}
				this.settlements.delete(retained.settled);
			});
			const admission = createSqliteWorkerOperationAdmission((_request, grant) => {
				assertCurrent();
				grant();
			});
			const publication = preparedMutation ? nodePreparedWorkspacePublication.begin({
				get identity() {
					return context.admission.identity.key;
				},
				assertCurrent: context.assertPublicationCurrent ?? context.admission.assertCurrent
			}) : void 0;
			observeSqliteWorkerCommittedFacts(admission, ({ facts }) => {
				if (publication) {
					if (!isRecord(facts) || facts.kind !== "node-prepared-workspace") throw new Error("Prepared workspace has no committed receipt");
					publication.committed(facts.receipt);
				}
			});
			retained.settled.then((settlement) => publication?.finish(settlement.kind === "completed"));
			return {
				nativeLocations: [context.admission.databasePath],
				admission
			};
		};
		const admitted = options?.existingOnly ? runOpenClawStateWorkerOperation(context, operation, {
			assertCurrent,
			createAdmission,
			existingOnly: true
		}) : runOpenClawStateWorkerOperation(context, operation, {
			assertCurrent,
			createAdmission
		});
		this.pending.add(admitted);
		admitted.then(() => this.pending.delete(admitted), () => this.pending.delete(admitted));
		return admitted;
	}
	async drain(options = {}) {
		if (options.close !== false) this.accepting = false;
		do {
			await Promise.allSettled(this.pending);
			await Promise.allSettled(this.settlements);
		} while (this.pending.size > 0 || this.settlements.size > 0);
		if (this.uncertain) throw this.uncertain;
	}
};
//#endregion
//#region src/node-host/config.ts
/** Canonical shared-SQLite configuration for the node-host runner. */
const NODE_HOST_CONFIG_KEY = "nodeHost.config";
const LEGACY_NODE_HOST_CONFIG_FILE = "node.json";
const LEGACY_NODE_HOST_CONFIG_CLAIM_SUFFIX = ".doctor-importing";
function legacyPathMayExist(filePath) {
	try {
		fs.lstatSync(filePath);
		return true;
	} catch (error) {
		if (error.code === "ENOENT") return false;
		throw new Error(`unable to verify retired node-host state path ${filePath}`, { cause: error });
	}
}
/** Runtime must not choose between canonical SQLite state and a retired file store. */
function assertNodeHostLegacyStateMigrated(env = process.env) {
	const sourcePath = path.join(resolveStateDir(env), LEGACY_NODE_HOST_CONFIG_FILE);
	const claimPath = `${sourcePath}${LEGACY_NODE_HOST_CONFIG_CLAIM_SUFFIX}`;
	if (!legacyPathMayExist(sourcePath) && !legacyPathMayExist(claimPath)) return;
	throw new Error(`retired node-host state remains at ${sourcePath}; stop the node host and run \`openclaw doctor --fix\``);
}
/** Read canonical node-host state without creating a store or joining its writable lifecycle. */
async function loadNodeHostConfig(env = process.env) {
	const selectedEnv = {
		...env,
		OPENCLAW_STATE_DIR: resolveStateDir(env)
	};
	assertNodeHostLegacyStateMigrated(selectedEnv);
	const reply = await executeExistingOpenClawStateRead({ env: selectedEnv }, { type: NODE_HOST_CONFIG_KEY });
	if (!reply) return null;
	if (!reply.ok || reply.type !== "nodeHost.config") throw new Error("Unexpected node-host configuration read result");
	const stored = reply.row;
	if (!stored) return null;
	const value = JSON.parse(stored.value_json);
	if (!Number.isSafeInteger(stored.updated_at_ms) || stored.updated_at_ms < 0) throw new Error("invalid node-host SQLite row: updated_at_ms must be a non-negative integer");
	return normalizeStoredNodeHostConfig(value);
}
/**
* Atomically create or replace the complete node-host snapshot.
* Candidate facts are prepared before BEGIN; the transaction rereads the authoritative row.
*/
async function configureNodeHost(params) {
	const env = params.env ?? process.env;
	assertNodeHostLegacyStateMigrated(env);
	const explicitNodeId = normalizeOptionalString(params.nodeId);
	const explicitDisplayName = normalizeOptionalString(params.displayName);
	const fallbackDisplayName = normalizeOptionalString(params.fallbackDisplayName);
	const candidateNodeId = params.candidateNodeId?.trim() || crypto.randomUUID();
	const gateway = normalizeGatewayConfig(params.gateway);
	const commands = params.commands === void 0 ? void 0 : normalizeNodeHostCommands(params.commands);
	const updatedAtMs = params.nowMs ?? Date.now();
	if (!Number.isSafeInteger(updatedAtMs) || updatedAtMs < 0) throw new Error("invalid node-host updatedAtMs: expected a non-negative integer");
	const { config, clearedCommands } = await new NodeWorkerJournalWorker({ env }).execute({
		type: "nodeWorker.configure",
		input: [{
			explicitNodeId,
			explicitDisplayName,
			fallbackDisplayName,
			candidateNodeId,
			gateway,
			installedAppsSharing: params.installedAppsSharing,
			commands,
			allCommands: params.allCommands,
			updatedAtMs
		}]
	});
	if (clearedCommands) logInfo("node-host: cleared saved command allowlist; advertising the full default command surface");
	return config;
}
//#endregion
export { loadNodeHostConfig as a, configureNodeHost as i, LEGACY_NODE_HOST_CONFIG_FILE as n, NodeWorkerJournalWorker as o, NODE_HOST_CONFIG_KEY as r, LEGACY_NODE_HOST_CONFIG_CLAIM_SUFFIX as t };
