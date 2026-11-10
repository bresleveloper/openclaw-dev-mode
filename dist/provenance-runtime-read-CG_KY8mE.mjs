import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { r as resolveDatabasePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { n as isArtifactPreservingStateRead } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { b as registerOpenClawStateDatabaseLifecycleListener } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import "./openclaw-state-db-readonly-DPndG9sn.mjs";
import "./openclaw-state-db-BtDOU_3j.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { n as parseClawInstallRecordSchemaVersion } from "./provenance-schema-version-CA1gqk1A.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
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
function knownAgentIds(snapshot) {
	if (snapshot?.kind === "ready") return new Set(snapshot.schemaVersions.keys());
	return snapshot?.kind === "state-error" ? snapshot.knownAgentIds : /* @__PURE__ */ new Set();
}
function isOwnershipUnknown(snapshot) {
	return !snapshot || snapshot.kind === "uninitialized" || snapshot.kind === "state-error" && snapshot.ownershipUnknown;
}
function failedSchemaVersionSnapshot(error, previous, ownershipUnknown = true) {
	return {
		kind: "state-error",
		error,
		knownAgentIds: knownAgentIds(previous),
		ownershipUnknown
	};
}
registerOpenClawStateDatabaseLifecycleListener((event) => {
	if (event.kind === "failure-cleared" || event.kind === "opened") return;
	const previous = snapshotsByPath.get(event.path);
	const error = event.kind === "open-error" || event.kind === "terminal-failure" ? event.error : /* @__PURE__ */ new Error("OpenClaw state database closed before consent provenance verification.");
	snapshotsByPath.set(event.path, failedSchemaVersionSnapshot(error, previous, isOwnershipUnknown(previous)));
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
		if (previous?.kind === "ready") snapshot = previous;
		else {
			const rows = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
				type: "claws.install-schema-versions",
				input: { artifactPreservingReadOnly: options.artifactPreservingReadOnly !== false || isArtifactPreservingStateRead() }
			}), { existingOnly: true });
			snapshot = resolveSchemaVersionSnapshot(rows === void 0 ? void 0 : decodeSchemaVersions(rows), previous);
		}
	} catch (error) {
		snapshot = failedSchemaVersionSnapshot(error, previous);
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
				snapshot = failedSchemaVersionSnapshot(error, current);
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
export { readCachedClawInstallSchemaVersions as a, prepareClawInstallSchemaVersions as i, captureClawInstallSchemaVersionFacts as n, registerClawInstallSchemaVersionSnapshotListener as o, deleteCachedClawInstallSchemaVersion as r, withClawInstallSchemaVersionFacts as s, cacheClawInstallSchemaVersion as t };
