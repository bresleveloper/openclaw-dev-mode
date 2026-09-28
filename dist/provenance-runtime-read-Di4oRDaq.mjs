import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { v as registerOpenClawStateDatabaseLifecycleListener } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { D as assertOpenClawStateDatabaseOwner, M as resolveDatabasePath } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { r as isArtifactPreservingStateRead, s as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import "./openclaw-state-db-BFK9cMiV.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-YAl4mP45.mjs";
import { t as readClawInstallSchemaVersionRows } from "./provenance-runtime-read.kernel-BXAmUn6p.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/claws/provenance-schema-version.ts
const LEGACY_CLAW_INSTALL_RECORD_SCHEMA_VERSION = "openclaw.clawInstallRecord.v1";
const CLAW_INSTALL_RECORD_SCHEMA_VERSION = "openclaw.clawInstallRecord.v2";
function parseClawInstallRecordSchemaVersion(value) {
	if (value === LEGACY_CLAW_INSTALL_RECORD_SCHEMA_VERSION || value === "openclaw.clawInstallRecord.v2") return value;
	throw new Error(`Unsupported Claw install record schema ${JSON.stringify(value)}.`);
}
function upgradeClawInstallSchema(db, agentId, record, expectedRecord, replacement) {
	if (!expectedRecord || stableStringify(record) !== stableStringify(expectedRecord)) throw new Error(`Legacy Claw install record for agent ${JSON.stringify(agentId)} is not an exact resumable attempt.`);
	db.prepare(`UPDATE claw_installs
          SET schema_version = ?, plan_integrity = ?, agent_config_digest = ?
        WHERE agent_id = ?`).run(CLAW_INSTALL_RECORD_SCHEMA_VERSION, replacement?.planIntegrity ?? record.planIntegrity, replacement?.agentConfigDigest ?? record.agentConfigDigest, agentId);
	return {
		...record,
		...replacement,
		schemaVersion: CLAW_INSTALL_RECORD_SCHEMA_VERSION
	};
}
//#endregion
//#region src/claws/provenance-runtime-read.ts
const snapshotsByPath = /* @__PURE__ */ new Map();
const snapshotListeners = /* @__PURE__ */ new Set();
const handedOffFacts = resolveGlobalSingleton(Symbol.for("openclaw.clawInstallSchemaVersionFacts"), () => new AsyncLocalStorage());
function notifySnapshotListeners() {
	for (const listener of snapshotListeners) listener();
}
function decodeSchemaVersions(rows) {
	const schemaVersions = /* @__PURE__ */ new Map();
	for (const row of rows) try {
		schemaVersions.set(row.agentId, {
			kind: "ok",
			schemaVersion: parseClawInstallRecordSchemaVersion(row.schemaVersion),
			agentConfigDigest: row.agentConfigDigest
		});
	} catch (error) {
		schemaVersions.set(row.agentId, {
			kind: "error",
			error
		});
	}
	return {
		kind: "ready",
		schemaVersions
	};
}
function readSchemaVersions(db) {
	try {
		return decodeSchemaVersions(readClawInstallSchemaVersionRows(db));
	} catch (error) {
		return {
			kind: "state-error",
			error,
			knownAgentIds: /* @__PURE__ */ new Set(),
			ownershipUnknown: true
		};
	}
}
function knownAgentIds(snapshot) {
	if (snapshot?.kind === "ready") return new Set(snapshot.schemaVersions.keys());
	return snapshot?.kind === "state-error" ? snapshot.knownAgentIds : /* @__PURE__ */ new Set();
}
function isOwnershipUnknown(snapshot) {
	return !snapshot || snapshot.kind === "uninitialized" || snapshot.kind === "state-error" && snapshot.ownershipUnknown;
}
registerOpenClawStateDatabaseLifecycleListener((event) => {
	if (event.kind === "failure-cleared") return;
	const previous = snapshotsByPath.get(event.kind === "opened" ? event.database.path : event.path);
	if (event.kind === "opened") {
		const snapshot = readSchemaVersions(event.database.db);
		snapshotsByPath.set(event.database.path, snapshot.kind === "state-error" ? {
			...snapshot,
			knownAgentIds: knownAgentIds(previous),
			ownershipUnknown: isOwnershipUnknown(previous)
		} : snapshot);
	} else if (event.kind === "open-error" || event.kind === "terminal-failure") snapshotsByPath.set(event.path, {
		kind: "state-error",
		error: event.error,
		knownAgentIds: knownAgentIds(previous),
		ownershipUnknown: isOwnershipUnknown(previous)
	});
	else snapshotsByPath.set(event.path, {
		kind: "state-error",
		error: /* @__PURE__ */ new Error("OpenClaw state database closed before consent provenance verification."),
		knownAgentIds: knownAgentIds(previous),
		ownershipUnknown: isOwnershipUnknown(previous)
	});
	notifySnapshotListeners();
});
function resolveSnapshotPath(options) {
	return options.database?.path ?? resolveDatabasePath(options);
}
/** Discovery workers consume the host's prepared facts, including failed or missing preparation. */
function captureClawInstallSchemaVersionFacts(options = {}) {
	const path = resolveSnapshotPath(options);
	const snapshot = readCachedClawInstallSchemaVersions(options);
	if (snapshot.kind === "ready") return {
		path,
		snapshot: {
			kind: snapshot.kind,
			schemaVersions: [...snapshot.schemaVersions].map(([agentId, read]) => [agentId, read.kind === "error" ? {
				...read,
				error: formatErrorMessage(read.error)
			} : read])
		}
	};
	return {
		path,
		snapshot: snapshot.kind === "state-error" ? {
			...snapshot,
			error: formatErrorMessage(snapshot.error),
			knownAgentIds: [...snapshot.knownAgentIds]
		} : snapshot
	};
}
/** Includes late plugin imports, whose config preparers run immediately on registration. */
function withClawInstallSchemaVersionFacts(facts, operation) {
	const snapshot = facts.snapshot.kind === "ready" ? {
		...facts.snapshot,
		schemaVersions: new Map(facts.snapshot.schemaVersions)
	} : facts.snapshot.kind === "state-error" ? {
		...facts.snapshot,
		knownAgentIds: new Set(facts.snapshot.knownAgentIds)
	} : facts.snapshot;
	const scope = {
		path: facts.path,
		snapshot,
		active: true
	};
	return handedOffFacts.run(scope, async () => {
		try {
			return await operation();
		} finally {
			scope.active = false;
		}
	});
}
function readHandedOffFacts(options) {
	const scope = handedOffFacts.getStore();
	if (!scope) return;
	if (!scope.active || scope.path !== resolveSnapshotPath(options)) throw new Error("Claw provenance facts are outside their captured state scope.");
	return scope.snapshot;
}
function readCachedClawInstallSchemaVersions(options = {}) {
	return readHandedOffFacts(options) ?? snapshotsByPath.get(resolveSnapshotPath(options)) ?? { kind: "uninitialized" };
}
function initializeCachedClawInstallSchemaVersions(options = {}) {
	if (readHandedOffFacts(options)) {
		notifySnapshotListeners();
		return;
	}
	const path = resolveSnapshotPath(options);
	const previous = snapshotsByPath.get(path);
	try {
		const snapshot = (options.artifactPreservingReadOnly === false ? withExistingOpenClawStateDatabaseReadOnly : withExistingOpenClawStateDatabaseArtifactPreservingReadOnly)(({ db, path: pathname }) => {
			assertOpenClawStateDatabaseOwner(db, { pathname });
			return readSchemaVersions(db);
		}, options);
		snapshotsByPath.set(path, resolveSchemaVersionSnapshot(snapshot, previous));
	} catch (error) {
		snapshotsByPath.set(path, {
			kind: "state-error",
			error,
			knownAgentIds: knownAgentIds(previous),
			ownershipUnknown: true
		});
	}
	notifySnapshotListeners();
}
function resolveSchemaVersionSnapshot(snapshot, previous) {
	if (snapshot) return snapshot;
	const previousAgentIds = knownAgentIds(previous);
	return previousAgentIds.size > 0 || previous !== void 0 && isOwnershipUnknown(previous) ? {
		kind: "state-error",
		error: /* @__PURE__ */ new Error("OpenClaw state database disappeared after Claw ownership was observed."),
		knownAgentIds: previousAgentIds,
		ownershipUnknown: true
	} : {
		kind: "ready",
		schemaVersions: /* @__PURE__ */ new Map()
	};
}
async function prepareClawInstallSchemaVersions(options = {}) {
	const path = resolveSnapshotPath(options);
	const previous = snapshotsByPath.get(path);
	let snapshot;
	let assertCurrent;
	try {
		const context = captureOpenClawStateWorkerContext({
			path,
			env: options.env
		});
		assertCurrent = context.admission.assertCurrent;
		const rows = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
			type: "claws.install-schema-versions",
			input: { artifactPreservingReadOnly: options.artifactPreservingReadOnly !== false || isArtifactPreservingStateRead() }
		}), { existingOnly: true });
		snapshot = resolveSchemaVersionSnapshot(rows === void 0 ? void 0 : decodeSchemaVersions(rows), previous);
	} catch (error) {
		snapshot = {
			kind: "state-error",
			error,
			knownAgentIds: knownAgentIds(previous),
			ownershipUnknown: true
		};
	}
	return {
		path,
		publish: () => {
			const current = snapshotsByPath.get(path);
			if (current !== previous) return;
			try {
				if (resolveSnapshotPath(options) !== path) throw new Error("OpenClaw state location changed before consent provenance publication.");
				assertCurrent?.();
			} catch (error) {
				snapshot = {
					kind: "state-error",
					error,
					knownAgentIds: knownAgentIds(current),
					ownershipUnknown: true
				};
			}
			snapshotsByPath.set(path, snapshot);
			notifySnapshotListeners();
		}
	};
}
function registerClawInstallSchemaVersionSnapshotListener(listener) {
	snapshotListeners.add(listener);
	return () => snapshotListeners.delete(listener);
}
function cacheClawInstallSchemaVersion(agentId, schemaVersion, agentConfigDigest, options = {}) {
	const snapshot = snapshotsByPath.get(resolveSnapshotPath(options));
	if (snapshot?.kind !== "ready") return;
	snapshot.schemaVersions.set(agentId, {
		kind: "ok",
		schemaVersion,
		agentConfigDigest
	});
	snapshotsByPath.set(resolveSnapshotPath(options), { ...snapshot });
	notifySnapshotListeners();
}
function deleteCachedClawInstallSchemaVersion(agentId, options = {}) {
	const snapshot = snapshotsByPath.get(resolveSnapshotPath(options));
	if (snapshot?.kind !== "ready" || !snapshot.schemaVersions.delete(agentId)) return;
	snapshotsByPath.set(resolveSnapshotPath(options), { ...snapshot });
	notifySnapshotListeners();
}
//#endregion
export { prepareClawInstallSchemaVersions as a, withClawInstallSchemaVersionFacts as c, upgradeClawInstallSchema as d, initializeCachedClawInstallSchemaVersions as i, CLAW_INSTALL_RECORD_SCHEMA_VERSION as l, captureClawInstallSchemaVersionFacts as n, readCachedClawInstallSchemaVersions as o, deleteCachedClawInstallSchemaVersion as r, registerClawInstallSchemaVersionSnapshotListener as s, cacheClawInstallSchemaVersion as t, parseClawInstallRecordSchemaVersion as u };
