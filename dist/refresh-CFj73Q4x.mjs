import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { a as markSkillsSupportingFilesChanged, c as resetSkillsRefreshStateForTest, o as notifySkillsWatchAvailable, t as bumpSkillsSnapshotVersion } from "./refresh-state-DoFid57J.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-CvMrvFI1.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-D6ogd941.mjs";
import { l as getGatewayRestartDrainSignal } from "./gateway-work-admission-FWbk4b3p.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-sFz3TNTx.mjs";
import { t as isAcpRuntimeSpawnAvailable } from "./availability-DM73_v1a.mjs";
import { t as capturePluginSkillContributions } from "./plugin-skills-Du3r4DEy.mjs";
import { a as resolveSkillDiscoveryLimits } from "./skill-root-discovery-FGRFW_77.mjs";
import { r as splitSkillSourcePlan } from "./workspace-skill-sources-BzN5yi4g.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/skills/runtime/discovery-worker-contract.ts
function captureSkillsDiscoveryEnvironment() {
	return {
		HOME: process.env.HOME,
		USERPROFILE: process.env.USERPROFILE,
		OPENCLAW_HOME: process.env.OPENCLAW_HOME,
		OPENCLAW_STATE_DIR: process.env.OPENCLAW_STATE_DIR,
		OPENCLAW_CONFIG_PATH: process.env.OPENCLAW_CONFIG_PATH,
		OPENCLAW_BUNDLED_SKILLS_DIR: process.env.OPENCLAW_BUNDLED_SKILLS_DIR,
		OPENCLAW_BUNDLED_PLUGINS_DIR: process.env.OPENCLAW_BUNDLED_PLUGINS_DIR,
		OPENCLAW_DISABLE_BUNDLED_PLUGINS: process.env.OPENCLAW_DISABLE_BUNDLED_PLUGINS,
		PREFIX: process.env.PREFIX,
		ANDROID_DATA: process.env.ANDROID_DATA
	};
}
//#endregion
//#region src/skills/runtime/discovery-worker-input.ts
/** Capture policy once; selecting and reading filesystem roots stays on the worker. */
function captureSkillsSourcePlanInput(workspaceDir, options) {
	const { pluginMetadataSnapshot } = options;
	const acpRuntimeAvailable = isAcpRuntimeSpawnAvailable({ config: options.config });
	return {
		workspaceDir,
		environment: captureSkillsDiscoveryEnvironment(),
		options: {
			config: options.config,
			agentId: options.agentId,
			workspaceOnly: options.workspaceOnly,
			managedSkillsDir: options.managedSkillsDir,
			bundledSkillsDir: options.bundledSkillsDir,
			pluginSkillsDir: options.pluginSkillsDir
		},
		acpRuntimeAvailable,
		...pluginMetadataSnapshot ? { pluginContributions: capturePluginSkillContributions({
			metadataSnapshot: pluginMetadataSnapshot,
			config: options.config,
			acpRuntimeAvailable
		}) } : {}
	};
}
//#endregion
//#region src/skills/runtime/refresh-remote.ts
const log$1 = createSubsystemLogger("gateway/skills");
const runInSkillsWatcherContext = AsyncLocalStorage.snapshot();
const MAX_REMOTE_WATCHERS = 128;
const remoteWatchers = /* @__PURE__ */ new Map();
let registryUpdate = Promise.resolve();
function updateRegistry(update) {
	registryUpdate = registryUpdate.then(update, update);
	return registryUpdate;
}
async function retireWatcher(watcherKey) {
	const state = remoteWatchers.get(watcherKey);
	remoteWatchers.delete(watcherKey);
	state?.controller.abort();
	await state?.task;
}
function ensureRemoteSkillsWatcher(params) {
	return updateRegistry(async () => {
		const { watcherKey, workspaceDir, access } = params;
		const drainSignal = getGatewayRestartDrainSignal();
		if (drainSignal.aborted) return;
		const request = {
			sourcePlan: params.sourcePlan,
			executionWorkspaceDir: params.executionWorkspaceDir
		};
		const signature = JSON.stringify(request);
		const previous = remoteWatchers.get(watcherKey);
		if (previous?.access === access && previous.signature === signature) {
			remoteWatchers.delete(watcherKey);
			remoteWatchers.set(watcherKey, previous);
			if (previous.unavailable) bumpSkillsSnapshotVersion({
				workspaceDir,
				reason: "remote-node"
			});
			return;
		}
		await retireWatcher(watcherKey);
		if (remoteWatchers.size >= MAX_REMOTE_WATCHERS) await retireWatcher(remoteWatchers.keys().next().value);
		if (drainSignal.aborted) return;
		const state = {
			access,
			signature,
			controller: new AbortController(),
			unavailable: !access.watchSkills
		};
		remoteWatchers.set(watcherKey, state);
		bumpSkillsSnapshotVersion({
			workspaceDir,
			reason: "remote-node"
		});
		const watch = access.watchSkills;
		if (!watch) return;
		const signal = AbortSignal.any([state.controller.signal, drainSignal]);
		const isCurrent = () => remoteWatchers.get(watcherKey) === state && !signal.aborted;
		state.task = runInSkillsWatcherContext(async () => {
			try {
				await watch(request, (event) => {
					if (!isCurrent()) return;
					if (event === "unavailable") state.unavailable = true;
					else if (event === "available") {
						state.unavailable = false;
						return;
					}
					bumpSkillsSnapshotVersion({
						workspaceDir,
						reason: "remote-node"
					});
				}, signal);
			} catch (error) {
				if (isCurrent()) log$1.warn(`remote skills watcher stopped (${workspaceDir}): ${String(error)}`);
			} finally {
				if (remoteWatchers.get(watcherKey) === state) {
					remoteWatchers.delete(watcherKey);
					if (!signal.aborted) bumpSkillsSnapshotVersion({
						workspaceDir,
						reason: "remote-node"
					});
				}
			}
		});
	});
}
function disposeRemoteSkillsWatcher(watcherKey) {
	return updateRegistry(() => retireWatcher(watcherKey));
}
function closeRemoteSkillsWatchers() {
	return updateRegistry(async () => {
		const failures = (await Promise.allSettled([...remoteWatchers.keys()].map(retireWatcher))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (failures.length) throw new AggregateError(failures, "Remote skills watcher shutdown failed");
	});
}
//#endregion
//#region src/skills/runtime/refresh.ts
const log = createSubsystemLogger("gateway/skills");
const runInDiscoveryContext = AsyncLocalStorage.snapshot();
const PASSIVE_REFRESH_MS = 6e4;
const MAX_SOURCES = 128;
const state = resolveGlobalSingleton(Symbol.for("openclaw.skillsDiscovery"), () => ({
	sources: /* @__PURE__ */ new Map(),
	plans: /* @__PURE__ */ new Map()
}), () => closeSkillsWatchers());
function pool() {
	return state.pool ??= runInDiscoveryContext(() => new WorkerTaskPool({
		workerUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.skillsDiscovery),
		workerClass: "singleton",
		idleTimeoutMs: 0
	}));
}
function startPassiveRefresh() {
	if (state.timer || ![...state.sources.values()].some((source) => source.watch)) return;
	state.timer = runInDiscoveryContext(() => setInterval(() => {
		for (const source of state.sources.values()) if (source.watch) source.dirty = true;
		scanDirtySources().catch((error) => log.warn(`passive skills refresh failed: ${String(error)}`));
	}, PASSIVE_REFRESH_MS));
	state.timer.unref();
}
function scanDirtySources() {
	if (state.closing) return Promise.reject(/* @__PURE__ */ new Error("Skills discovery is closing"));
	state.pending ??= runInDiscoveryContext(async () => {
		while (!state.closing) {
			const selected = [...state.sources].filter(([, source]) => source.dirty);
			if (!selected.length) return;
			for (const [, source] of selected) source.dirty = false;
			let results;
			try {
				const response = await pool().run({
					kind: "scan",
					requests: selected.map(([key, source]) => ({
						key,
						environment: source.environment,
						selection: source.selection
					})),
					path: process.env.PATH
				}, { timeoutMs: 12e4 });
				if (response.kind !== "scan") throw new Error("Unexpected Skills discovery response");
				results = response.results;
			} catch (error) {
				for (const [key, source] of selected) {
					if (state.sources.get(key) !== source) continue;
					source.dirty = true;
					if (!state.closing && !source.unavailable) {
						source.unavailable = true;
						bumpSkillsSnapshotVersion({
							workspaceDir: source.workspaceDir,
							reason: "watch-unavailable"
						});
					}
				}
				throw error;
			}
			if (state.closing) return;
			const changed = /* @__PURE__ */ new Set();
			const refreshed = /* @__PURE__ */ new Set();
			const recovered = [];
			for (const result of results) {
				const source = state.sources.get(result.key);
				if (!source || source !== selected.find(([key]) => key === result.key)?.[1] || source.dirty) continue;
				if (source.fingerprint !== void 0 && source.fingerprint !== result.fingerprint) changed.add(source.workspaceDir);
				if (source.unavailable) {
					source.unavailable = false;
					recovered.push(source);
				}
				if (result.plan && source.selection.plan) {
					const input = source.selection.plan.input;
					state.plans.set(JSON.stringify(input), Promise.resolve({
						plan: result.plan,
						input
					}));
				}
				source.sources = result.sources;
				source.fingerprint = result.fingerprint;
				refreshed.add(source.workspaceDir);
			}
			while (state.plans.size > MAX_SOURCES) state.plans.delete(state.plans.keys().next().value);
			for (const workspaceDir of refreshed) markSkillsSupportingFilesChanged({ workspaceDir });
			for (const workspaceDir of changed) bumpSkillsSnapshotVersion({
				workspaceDir,
				reason: "watch"
			});
			for (const source of recovered) notifySkillsWatchAvailable({
				workspaceDir: source.workspaceDir,
				sourceScope: { executionWorkspaceDir: source.selection.request.executionWorkspaceDir }
			});
		}
	}).finally(() => {
		state.pending = void 0;
	});
	return state.pending;
}
async function registerSource(selection, watch) {
	if (state.closing) await state.closing;
	const environment = selection.plan?.input.environment ?? captureSkillsDiscoveryEnvironment();
	const { request } = selection;
	const key = JSON.stringify(selection.plan ? {
		...request,
		sourcePlan: void 0,
		plan: selection.plan
	} : {
		...request,
		environment
	});
	let source = state.sources.get(key);
	if (!source) {
		if (state.sources.size >= MAX_SOURCES) {
			const oldestKey = state.sources.keys().next().value;
			const oldest = state.sources.get(oldestKey);
			state.sources.delete(oldestKey);
			bumpSkillsSnapshotVersion({
				workspaceDir: oldest.workspaceDir,
				reason: "watch"
			});
		}
		source = {
			selection,
			workspaceDir: selection.kind === "planned" ? selection.plan.input.workspaceDir : selection.request.sourcePlan.workspaceDir,
			environment,
			watch: watch !== false,
			dirty: true
		};
		state.sources.set(key, source);
	} else {
		source.watch ||= watch !== false;
		state.sources.delete(key);
		state.sources.set(key, source);
	}
	startPassiveRefresh();
	return {
		key,
		source
	};
}
function readRegisteredSource({ key, source }) {
	if (state.sources.get(key) !== source || !source.sources) throw new Error("Skills discovery was retired before publication");
	return source.sources;
}
async function publishRegisteredSource(registration) {
	const { source } = registration;
	if (source.dirty || !source.sources) await scanDirtySources();
	return readRegisteredSource(registration);
}
/** The only asynchronous local discovery boundary, shared by all Gateway consumers. */
async function prepareLocalSkillSources(request, options = {}) {
	return publishRegisteredSource(await registerSource({
		kind: "selected",
		request,
		plan: options.plan
	}, options.watch));
}
/** Compose roots on the same worker, reusing facts until its next completed scan. */
async function prepareSkillSourcePlan(workspaceDir, options = {}) {
	if (state.closing) await state.closing;
	const input = captureSkillsSourcePlanInput(workspaceDir, options);
	const key = JSON.stringify(input);
	let pending = state.plans.get(key);
	if (!pending) {
		if (state.plans.size >= MAX_SOURCES) state.plans.delete(state.plans.keys().next().value);
		pending = pool().run({
			kind: "plan",
			input
		}, { timeoutMs: 12e4 }).then((result) => {
			if (result.kind !== "plan") throw new Error("Unexpected Skills source plan response");
			return {
				plan: result.plan,
				input
			};
		});
		state.plans.set(key, pending);
		pending.catch(() => {
			if (state.plans.get(key) === pending) state.plans.delete(key);
		});
	}
	return pending;
}
async function projectSkillSnapshot(input) {
	if (state.closing) await state.closing;
	const result = await pool().run({
		kind: "project",
		input,
		environment: captureSkillsDiscoveryEnvironment()
	}, { timeoutMs: 12e4 });
	if (result.kind !== "project") throw new Error("Unexpected Skills projection response");
	return result.snapshot;
}
async function prepareSkillStatusFacts(input) {
	if (state.closing) await state.closing;
	const result = await pool().run({
		kind: "status",
		input,
		environment: captureSkillsDiscoveryEnvironment()
	}, { timeoutMs: 12e4 });
	if (result.kind !== "status") throw new Error("Unexpected Skills status response");
	return result.facts;
}
async function registerSkillsWatcher(params) {
	if (state.closing) await state.closing;
	const access = getAgentWorkspaceAccess(params.workspaceDir, "loadSkills");
	const watcherKey = JSON.stringify([
		params.workspaceDir,
		params.executionWorkspaceDir,
		params.executionWorkspaceFileHost
	]);
	if (!access?.loadSkills && !params.sourcePlan) {
		await disposeRemoteSkillsWatcher(watcherKey);
		return registerSource({
			kind: "planned",
			request: {
				executionWorkspaceDir: params.executionWorkspaceDir,
				limits: resolveSkillDiscoveryLimits(params.config),
				additionalBins: []
			},
			plan: { input: captureSkillsSourcePlanInput(params.workspaceDir, params) }
		}, params.config?.skills?.load?.watch);
	}
	const prepared = params.sourcePlan ? void 0 : await prepareSkillSourcePlan(params.workspaceDir, params);
	const plan = params.sourcePlan ?? prepared.plan;
	const split = access?.loadSkills ? splitSkillSourcePlan(plan, params) : void 0;
	if (split && params.config?.skills?.load?.watch !== false) await ensureRemoteSkillsWatcher({
		watcherKey,
		workspaceDir: params.workspaceDir,
		executionWorkspaceDir: split.workspaceExecutionWorkspaceDir,
		access,
		sourcePlan: split.workspacePlan
	});
	else await disposeRemoteSkillsWatcher(watcherKey);
	return registerSource({
		kind: "selected",
		request: {
			sourcePlan: split?.gatewayPlan ?? plan,
			executionWorkspaceDir: split ? split.gatewayExecutionWorkspaceDir : params.executionWorkspaceDir,
			limits: resolveSkillDiscoveryLimits(params.config),
			additionalBins: []
		},
		plan: prepared ? {
			input: prepared.input,
			...split ? { scope: "gateway" } : {}
		} : void 0
	}, params.config?.skills?.load?.watch);
}
/** Keep remote observation on its owning host; await the local source publication. */
async function ensureSkillsWatcher(params) {
	await publishRegisteredSource(await registerSkillsWatcher(params));
}
/** Explicit actions bypass the passive interval and await a completed worker publication. */
async function refreshSkillsDiscovery(params = {}) {
	if (params.reason === "config-change") await resetSkillsDiscoverySources(false);
	for (const source of state.sources.values()) source.dirty = true;
	if (params.config) {
		const { listAgentIds, resolveAgentWorkspaceDir } = await import("./agent-scope-config-DdPit6I3.mjs");
		const agentIds = listAgentIds(params.config);
		for (let offset = 0; offset < agentIds.length; offset += MAX_SOURCES) {
			const registrations = await Promise.all(agentIds.slice(offset, offset + MAX_SOURCES).map((agentId) => registerSkillsWatcher({
				workspaceDir: resolveAgentWorkspaceDir(params.config, agentId),
				config: params.config,
				agentId,
				pluginMetadataSnapshot: params.pluginMetadataSnapshot
			})));
			await scanDirtySources();
			registrations.forEach(readRegisteredSource);
		}
	} else {
		if (!state.sources.size && params.workspaceDir) await registerSkillsWatcher({
			workspaceDir: params.workspaceDir,
			pluginMetadataSnapshot: params.pluginMetadataSnapshot
		});
		await scanDirtySources();
	}
	bumpSkillsSnapshotVersion({
		workspaceDir: params.workspaceDir,
		reason: params.reason ?? "manual"
	});
}
async function resetSkillsDiscoverySources(retireWorker, resetState = false) {
	if (state.closing) {
		await state.closing;
		if (!retireWorker || !state.pool) return;
	}
	clearInterval(state.timer);
	state.timer = void 0;
	const activePool = retireWorker ? state.pool : void 0;
	if (retireWorker) state.pool = void 0;
	state.sources.clear();
	state.plans.clear();
	state.closing = Promise.allSettled([
		state.pending?.catch(() => {}),
		activePool?.close(),
		closeRemoteSkillsWatchers()
	]).then((results) => {
		const failures = results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (resetState) resetSkillsRefreshStateForTest();
		if (failures.length) throw new AggregateError(failures, "Skills discovery shutdown failed");
	}).finally(() => {
		state.closing = void 0;
	});
	return state.closing;
}
function closeSkillsWatchers(resetState = false) {
	return resetSkillsDiscoverySources(true, resetState);
}
const detachSkillsWatchers = closeSkillsWatchers;
//#endregion
export { prepareSkillSourcePlan as a, refreshSkillsDiscovery as c, prepareLocalSkillSources as i, detachSkillsWatchers as n, prepareSkillStatusFacts as o, ensureSkillsWatcher as r, projectSkillSnapshot as s, closeSkillsWatchers as t };
