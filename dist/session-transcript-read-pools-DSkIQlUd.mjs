import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-CvMrvFI1.mjs";
import { m as observeOpenClawDatabaseMaintenanceResource } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { a as ensureSqliteLibrarySelected, r as captureSqliteWorkerClosePolicy } from "./bun-sqlite-library-CYR1RYZS.mjs";
import { s as registerOpenClawAgentDatabaseReadCandidateResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { r as WorkerTaskError } from "./src-NEpyeLp1.mjs";
import { o as resolveWorkerPoolSize, t as SESSION_TRANSCRIPT_FOREGROUND_WORKERS } from "./worker-pool-sizing-9MNT4hxr.mjs";
import { n as createOwnedWorkerTaskPool, t as WorkerTaskPool } from "./worker-task-pool-D6ogd941.mjs";
import { n as runWithSqliteDatabaseAdmissionTurn } from "./sqlite-database-admission-turn-BwijprYk.mjs";
import { a as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import { r as captureSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
//#region src/infra/session-cost-usage-worker.types.ts
var UsageCostHostEffectError = class extends Error {
	constructor(origin, message) {
		super(message);
		this.origin = origin;
		this.name = "UsageCostHostEffectError";
	}
};
/** Retain the domain failure while the pool proves native retirement. */
var UsageCostWorkerReplyError = class extends Error {
	constructor(failure) {
		super(failure.message);
		this.failure = failure;
		this.name = "UsageCostWorkerReplyError";
	}
};
//#endregion
//#region src/config/sessions/session-transcript-read-pools.ts
const workerUrl = resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sessionTranscript);
const SESSION_TRANSCRIPT_WORKER_LIMITS = {
	maxOldGenerationSizeMb: 512,
	maxYoungGenerationSizeMb: 32
};
function createSessionTranscriptReadPool(maxWorkers, sharedCompute = false) {
	const pool = new WorkerTaskPool({
		workerUrl,
		prepareWorker: () => {
			ensureSqliteLibrarySelected();
			return { options: {} };
		},
		workerOptions: { resourceLimits: SESSION_TRANSCRIPT_WORKER_LIMITS },
		maxWorkers,
		sharedCompute
	});
	const stores = /* @__PURE__ */ new Map();
	function retainStore(storePath) {
		let retained = stores.get(storePath);
		if (!retained) {
			const target = resolveUnsuffixedSqliteTargetFromSessionStorePath(storePath);
			const candidate = captureSessionStoreReadCandidate(target.path, target.agentId || target.shared ? void 0 : "sibling-family");
			const owned = {
				revoked: false,
				releases: [],
				async close() {
					await pool.rotate();
					for (const release of owned.releases) release();
					if (stores.get(storePath) === owned) stores.delete(storePath);
				}
			};
			try {
				for (const pathname of /* @__PURE__ */ new Set([candidate.path, candidate.physicalPath])) owned.releases.push(registerOpenClawAgentDatabaseReadCandidateResource({
					path: pathname,
					scope: candidate.scope,
					revoke: () => {
						owned.revoked = true;
					},
					close: owned.close
				}));
			} catch (error) {
				for (const release of owned.releases) release();
				throw error;
			}
			stores.set(storePath, owned);
			retained = owned;
		}
		for (const release of retained.releases) observeOpenClawDatabaseMaintenanceResource(release);
		return retained;
	}
	registerOpenClawStateDatabaseAsyncResource({
		phase: "after-resources",
		async close(identity) {
			if (identity) return;
			const closing = [...stores.values()];
			for (const store of closing) store.revoked = true;
			await Promise.all(closing.map((store) => store.close()));
		}
	});
	return { async run(input, options, databases) {
		const retained = databases.storePaths.map(retainStore);
		return runWithSqliteDatabaseAdmissionTurn(databases.admissionPaths, () => pool.run(() => {
			if (retained.some((store) => store.revoked)) throw new WorkerTaskError("Session transcript database read was revoked", "unavailable");
			return input;
		}, options), databases.families);
	} };
}
function createSessionTranscriptHistoryPool(maxWorkers = resolveWorkerPoolSize("singleton")) {
	let canCloseNativeResources;
	const pool = createOwnedWorkerTaskPool({
		workerUrl,
		workerOptions: { resourceLimits: SESSION_TRANSCRIPT_WORKER_LIMITS },
		maxWorkers,
		idleTimeoutMs: 0,
		burstIdleTimeoutMs: 3e4,
		prepareWorker: () => {
			ensureSqliteLibrarySelected();
			canCloseNativeResources = captureSqliteWorkerClosePolicy() && (canCloseNativeResources ?? true);
			return { options: {} };
		}
	}, { databaseAccess: "read-only" });
	return {
		...pool,
		canCloseNativeResources: () => canCloseNativeResources === true,
		async rotate() {
			await pool.rotate();
			canCloseNativeResources = void 0;
		}
	};
}
function createUsageCostPool(kind) {
	return new WorkerTaskPool({
		workerUrl,
		workerOptions: { resourceLimits: SESSION_TRANSCRIPT_WORKER_LIMITS },
		workerClass: kind === "refresh" ? "writer" : "singleton",
		idleTimeoutMs: 0,
		prepareWorker: () => {
			ensureSqliteLibrarySelected();
			return { options: {} };
		},
		validateResult(reply) {
			if (!reply.ok) throw new UsageCostWorkerReplyError(reply.error);
		}
	});
}
function createDatabaseWorkerLane(name, pool) {
	return {
		name,
		pool,
		nativeSequence: 0,
		retiredSequence: 0,
		pending: 0
	};
}
function createSessionTranscriptWorkerLanes() {
	return {
		historyLane: createDatabaseWorkerLane("Session history", createSessionTranscriptHistoryPool(SESSION_TRANSCRIPT_FOREGROUND_WORKERS)),
		transcriptSearchLane: createDatabaseWorkerLane("Session transcript search", createSessionTranscriptHistoryPool(SESSION_TRANSCRIPT_FOREGROUND_WORKERS)),
		projectionLane: createDatabaseWorkerLane("Session projection", createSessionTranscriptHistoryPool()),
		maintenanceLane: createDatabaseWorkerLane("Session maintenance", createSessionTranscriptHistoryPool()),
		targetDiscoveryLane: createDatabaseWorkerLane("Session target discovery", createSessionTranscriptHistoryPool()),
		costReadLane: createDatabaseWorkerLane("Session usage read", createUsageCostPool("read")),
		costRefreshLane: createDatabaseWorkerLane("Session usage refresh", createUsageCostPool("refresh"))
	};
}
//#endregion
export { UsageCostWorkerReplyError as i, createSessionTranscriptWorkerLanes as n, UsageCostHostEffectError as r, createSessionTranscriptReadPool as t };
