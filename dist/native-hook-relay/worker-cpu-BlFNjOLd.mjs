import { d as resolveGlobalSingleton } from "./redact-0yyk4gHy.mjs";
import path, { basename } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { readRootJsonObjectSync } from "@openclaw/fs-safe/json";
import { Worker } from "node:worker_threads";
//#region src/infra/runtime-process-entrypoints.ts
const currentModuleUrl = import.meta.url;
const SQLITE_READONLY_CHILD_ARG = "--openclaw-sqlite-readonly-child";
const runtimeProcessEntrypoints = {
	codeModeNode: {
		currentModuleUrl,
		sourceWorkerName: "../agents/code-mode-node.worker",
		distWorkerPath: "agents/code-mode-node.worker.js"
	},
	cronReadOnly: {
		currentModuleUrl,
		sourceWorkerName: "../cron/store/read-only.worker",
		distWorkerPath: "cron/store/read-only.worker.js"
	},
	stateRead: {
		currentModuleUrl,
		sourceWorkerName: "../state/openclaw-state-read.worker",
		distWorkerPath: "state/openclaw-state-read.worker.js"
	},
	spawnBroker: {
		currentModuleUrl,
		sourceWorkerName: "../process/spawn-broker/worker",
		distWorkerPath: "process/spawn-broker/worker.js"
	},
	cronStreamMatcher: {
		currentModuleUrl,
		sourceWorkerName: "../gateway/cron-stream-matcher.worker",
		distWorkerPath: "gateway/cron-stream-matcher.worker.js"
	},
	nativeHookRelayClient: {
		currentModuleUrl,
		sourceWorkerName: "../agents/harness/native-hook-relay-client.worker",
		distWorkerPath: "agents/harness/native-hook-relay-client.worker.js"
	},
	computerHost: {
		currentModuleUrl,
		sourceWorkerName: "../gateway/desktop/computer.worker",
		distWorkerPath: "gateway/desktop/computer.worker.js"
	},
	imageProcessor: {
		currentModuleUrl,
		sourceWorkerName: "../media/image-processor.worker",
		distWorkerPath: "media/image-processor.worker.js"
	},
	gitOperations: {
		currentModuleUrl,
		sourceWorkerName: "git-operation.worker",
		distWorkerPath: "infra/git-operation.worker.js"
	},
	fsSafeCopy: {
		currentModuleUrl,
		sourceWorkerName: "fs-safe-copy.worker",
		distWorkerPath: "infra/fs-safe-copy.worker.js"
	},
	sharedStateStore: {
		currentModuleUrl,
		sourceWorkerName: "../state/openclaw-state.worker",
		distWorkerPath: "state/openclaw-state.worker.js"
	},
	authProfileInlineUsage: {
		currentModuleUrl,
		sourceWorkerName: "../agents/auth-profiles/inline-usage.worker",
		distWorkerPath: "agents/auth-profiles/inline-usage.worker.js"
	},
	agentDatabaseExecution: {
		currentModuleUrl,
		sourceWorkerName: "../state/openclaw-agent-execution.worker",
		distWorkerPath: "state/openclaw-agent-execution.worker.js"
	},
	workspaceMemory: {
		currentModuleUrl,
		sourceWorkerName: "../worker/memory-worker-entry",
		distWorkerPath: "worker/memory-worker-entry.js"
	},
	workspaceSkills: {
		currentModuleUrl,
		sourceWorkerName: "../worker/skills-worker-entry",
		distWorkerPath: "worker/skills-worker-entry.js"
	},
	boardStore: {
		currentModuleUrl,
		sourceWorkerName: "../boards/sqlite-board-store.worker",
		distWorkerPath: "boards/sqlite-board-store.worker.js"
	},
	sessionSharingStore: {
		currentModuleUrl,
		sourceWorkerName: "../config/sessions/session-sharing-store.worker",
		distWorkerPath: "config/sessions/session-sharing-store.worker.js"
	},
	heartbeatOutcomeStore: {
		currentModuleUrl,
		sourceWorkerName: "heartbeat-outcome-store.worker",
		distWorkerPath: "infra/heartbeat-outcome-store.worker.js"
	},
	sqliteStore: {
		currentModuleUrl,
		sourceWorkerName: "sqlite-store.worker",
		distWorkerPath: "infra/sqlite-store.worker.js"
	},
	agentSchemaInspection: {
		currentModuleUrl,
		sourceWorkerName: "../state/openclaw-agent-schema-inspection.worker",
		distWorkerPath: "state/openclaw-agent-schema-inspection.worker.js"
	},
	stateMigrationSnapshot: {
		currentModuleUrl,
		sourceWorkerName: "state-migrations.snapshot.worker",
		distWorkerPath: "infra/state-migrations.snapshot.worker.js"
	},
	githubExec: {
		currentModuleUrl,
		sourceWorkerName: "../agents/github-exec-launcher",
		distWorkerPath: "agents/github-exec-launcher.js"
	},
	sqliteReadOnly: {
		currentModuleUrl,
		sourceWorkerName: "sqlite-readonly-location.worker",
		distWorkerPath: "infra/sqlite-readonly-location.worker.js"
	},
	sqliteIntegrity: {
		currentModuleUrl,
		sourceWorkerName: "sqlite-integrity.worker",
		distWorkerPath: "infra/sqlite-integrity.worker.js"
	},
	preparedModelCatalog: {
		currentModuleUrl,
		sourceWorkerName: "../agents/prepared-model-catalog.worker",
		distWorkerPath: "agents/prepared-model-catalog.worker.js"
	},
	updateRepair: {
		currentModuleUrl,
		sourceWorkerName: "update-repair.worker",
		distWorkerPath: "infra/update-repair.worker.js"
	},
	updateMigratedFinalize: {
		currentModuleUrl,
		sourceWorkerName: "update-migrated-finalize.worker",
		distWorkerPath: "infra/update-migrated-finalize.worker.js"
	},
	updateCandidateState: {
		currentModuleUrl,
		sourceWorkerName: "update-candidate-state.worker",
		distWorkerPath: "infra/update-candidate-state.worker.js"
	},
	doctorLint: {
		currentModuleUrl,
		sourceWorkerName: "../commands/doctor-lint.worker",
		distWorkerPath: "commands/doctor-lint.worker.js"
	},
	databaseVerify: {
		currentModuleUrl,
		sourceWorkerName: "../state/openclaw-database-verify.worker",
		distWorkerPath: "state/openclaw-database-verify.worker.js"
	},
	stateLeaseHeartbeat: {
		currentModuleUrl,
		sourceWorkerName: "../state/openclaw-state-lease-heartbeat.worker",
		distWorkerPath: "state/openclaw-state-lease-heartbeat.worker.js"
	},
	sessionTranscriptArchive: {
		currentModuleUrl,
		sourceWorkerName: "../config/sessions/session-accessor.sqlite-archive.worker",
		distWorkerPath: "config/sessions/session-accessor.sqlite-archive.worker.js"
	},
	sessionTranscript: {
		currentModuleUrl,
		sourceWorkerName: "../config/sessions/session-transcript.worker",
		distWorkerPath: "config/sessions/session-transcript.worker.js"
	},
	sessionManagerMetadata: {
		currentModuleUrl,
		sourceWorkerName: "../agents/sessions/session-manager-metadata.worker",
		distWorkerPath: "agents/sessions/session-manager-metadata.worker.js"
	},
	sessionTranscriptReconcile: {
		currentModuleUrl,
		sourceWorkerName: "../config/sessions/session-transcript-reconcile.worker",
		distWorkerPath: "config/sessions/session-transcript-reconcile.worker.js"
	},
	tailscaleRouteOwner: {
		currentModuleUrl,
		sourceWorkerName: "tailscale-route-owner.worker",
		distWorkerPath: "infra/tailscale-route-owner.worker.js"
	},
	serviceChildRelay: {
		currentModuleUrl,
		sourceWorkerName: "../process/supervisor/service-child-relay",
		distWorkerPath: "process/supervisor/service-child-relay.js"
	},
	terminalPty: {
		currentModuleUrl,
		sourceWorkerName: "../process/terminal-pty-worker",
		distWorkerPath: "process/terminal-pty-worker.js"
	},
	serviceChildGroupAnchor: {
		currentModuleUrl,
		sourceWorkerName: "../process/supervisor/service-child-group-anchor",
		distWorkerPath: "process/supervisor/service-child-group-anchor.js"
	},
	serviceChildWindowsJobAnchor: {
		currentModuleUrl,
		sourceWorkerName: "../process/supervisor/service-child-windows-job-anchor",
		distWorkerPath: "process/supervisor/service-child-windows-job-anchor.js"
	},
	bunSqliteLibrary: {
		currentModuleUrl,
		sourceWorkerName: "bun-sqlite-library",
		distWorkerPath: "infra/bun-sqlite-library.js"
	}
};
//#endregion
//#region src/daemon/runtime-binary.ts
function normalizeRuntimeBasename(execPath) {
	const trimmed = execPath.trim().replace(/^["']|["']$/g, "");
	const lastSlash = Math.max(trimmed.lastIndexOf("/"), trimmed.lastIndexOf("\\"));
	return (lastSlash === -1 ? trimmed : trimmed.slice(lastSlash + 1)).trim().toLowerCase();
}
/** Returns whether an executable path names a Bun runtime binary. */
function isBunRuntime(execPath) {
	const base = normalizeRuntimeBasename(execPath);
	return base === "bun" || base === "bun.exe";
}
//#endregion
//#region src/infra/runtime-worker-url.ts
/** Resolve an explicit installed root, source sibling, or stable packaged worker path. */
function resolveRuntimeWorkerUrl(params) {
	if (params.root !== void 0) return pathToFileURL(path.join(params.root, "dist", params.distWorkerPath));
	const currentPath = fileURLToPath(params.currentModuleUrl);
	const distIndex = currentPath.replaceAll(path.sep, "/").lastIndexOf("/dist/");
	if (distIndex >= 0) {
		const distRoot = currentPath.slice(0, distIndex + 6);
		let workerPath = params.distWorkerPath;
		if (params.package) {
			const packageRoot = path.resolve(distRoot, "..");
			const manifest = readRootJsonObjectSync({
				rootDir: packageRoot,
				relativePath: "package.json",
				boundaryLabel: "runtime worker package",
				rejectHardlinks: false
			});
			if (!manifest.ok) throw new Error(`Cannot resolve runtime worker package: ${packageRoot}/package.json`);
			if (manifest.value.name === params.package.name) workerPath = params.package.distWorkerPath;
		}
		return pathToFileURL(path.join(distRoot, workerPath));
	}
	const extension = path.extname(currentPath) || ".js";
	return new URL(`./${params.sourceWorkerName}${extension}`, params.currentModuleUrl);
}
function resolveRuntimeWorkerArgv(url, execPath = process.execPath) {
	const entry = fileURLToPath(url);
	return /\.[cm]?ts$/.test(entry) && !isBunRuntime(execPath) ? [
		"--import",
		import.meta.resolve("tsx"),
		entry
	] : [entry];
}
/** Select the source Worker preload without feeding Node's TypeScript loader to Bun. */
function resolveRuntimeWorkerThreadExecArgv(url, execPath = process.execPath) {
	if (url.protocol !== "file:") return [];
	return /\.[cm]?ts$/.test(fileURLToPath(url)) && !isBunRuntime(execPath) ? ["--import", import.meta.resolve("tsx/esm")] : [];
}
//#endregion
//#region src/infra/runtime-process-url.ts
const sealedEntrypoints = /* @__PURE__ */ new Map();
function resolveRuntimeProcessEntrypointUrl(name) {
	return sealedEntrypoints.get(name) ?? resolveRuntimeWorkerUrl(runtimeProcessEntrypoints[name]);
}
//#endregion
//#region src/infra/worker-cpu.ts
const workerScriptNames = /* @__PURE__ */ new Set([
	...Object.values(runtimeProcessEntrypoints).map((entry) => basename(entry.distWorkerPath)),
	"catalog-page.worker.js",
	"code-mode.worker.js",
	"compaction-planning.worker.js",
	"disk-budget.worker.js",
	"document-extractor.worker.js",
	"manager-index.worker.js",
	"manager-search.worker.js",
	"memory-index.worker.js",
	"memory-search.worker.js",
	"session-history.worker.js"
]);
function workerScriptName(filename, evalSource = false) {
	if (evalSource || filename instanceof URL && filename.protocol !== "file:") return "other";
	const name = basename(filename instanceof URL ? fileURLToPath(filename) : filename).replace(/\.[cm]?ts$/u, ".js");
	return workerScriptNames.has(name) ? name : "other";
}
const trackedWorkers = resolveGlobalSingleton(Symbol.for("openclaw.workerCpuSources"), () => {
	process.on("worker", trackWorker);
	return {
		revision: 0,
		workers: /* @__PURE__ */ new Map()
	};
});
function createCpuTrackedWorker(...args) {
	const worker = new Worker(...args);
	trackWorker(worker);
	trackedWorkers.workers.get(worker).script = workerScriptName(args[0], args[1]?.eval);
	return worker;
}
function forgetWorker(worker) {
	if (trackedWorkers.workers.delete(worker)) trackedWorkers.revision++;
}
function trackWorker(worker) {
	if (trackedWorkers.workers.has(worker)) return;
	let pending = false;
	trackedWorkers.workers.set(worker, {
		script: "other",
		async cpuUsage() {
			if (pending) return;
			pending = true;
			try {
				return await worker.cpuUsage();
			} catch {
				return;
			} finally {
				pending = false;
			}
		}
	});
	trackedWorkers.revision++;
	worker.once("exit", () => forgetWorker(worker));
}
//#endregion
export { resolveRuntimeWorkerUrl as a, resolveRuntimeWorkerThreadExecArgv as i, resolveRuntimeProcessEntrypointUrl as n, SQLITE_READONLY_CHILD_ARG as o, resolveRuntimeWorkerArgv as r, runtimeProcessEntrypoints as s, createCpuTrackedWorker as t };
