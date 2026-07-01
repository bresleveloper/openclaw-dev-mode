import { y as resolveStateDir } from "../../paths-DyelItkH.js";
import { n as VERSION } from "../../version-CeFj_iGk.js";
import { r as getChildLogger, x as normalizeLogLevel } from "../../logger-ByU25eYB.js";
import "../../agent-scope-CDZXADgT.js";
import { a as resolveAgentDir, o as resolveAgentWorkspaceDir } from "../../agent-scope-config-C3ijpoNo.js";
import { o as shouldLogVerbose } from "../../globals-BWmHKFNH.js";
import { a as logWarn } from "../../logger-p_Dm5cGu.js";
import { r as runCommandWithTimeout } from "../../exec-CIJxrT1J.js";
import { i as getRuntimeConfig } from "../../io-BJfjPmGW.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "../../defaults-mDjiWzE5.js";
import { c as resolveThinkingProfile, p as normalizeThinkLevel } from "../../thinking-DxaN427I.js";
import { r as replaceConfigFile, t as mutateConfigFile } from "../../config-A41fTHlt.js";
import { p as onAgentEvent } from "../../agent-events-7y1r8HOP.js";
import { o as mediaKindFromMime } from "../../constants-Mf57IYS0.js";
import { n as detectMime } from "../../mime-C8mVE2Bw.js";
import { _ as updateSessionStore, b as loadSessionStore, h as saveSessionStore } from "../../store-DJ7wx5_V.js";
import { o as normalizeDeliveryContext } from "../../delivery-context.shared-D36KNc_D.js";
import { a as resolveSessionFilePath, d as resolveStorePath } from "../../paths-CHZBIGhF.js";
import { r as onSessionTranscriptUpdate } from "../../transcript-events-BFG5Kqze.js";
import { P as updateSessionEntry, T as replaceSessionEntry, f as listSessionEntries$1, g as patchSessionEntry$1, m as loadSessionEntry } from "../../session-accessor-Dx6KDG0K.js";
import { t as getPluginRuntimeGatewayRequestScope } from "../../gateway-request-scope-BAEdAUQ6.js";
import "../../logging-C9-gXjtb.js";
import { r as buildConfiguredModelCatalog } from "../../model-selection-shared-CKMggJal.js";
import { t as resolveThinkingDefault } from "../../model-thinking-default-GwbGGXiw.js";
import "../../model-selection-i8V2iTdL.js";
import { m as resizeToJpeg, s as getImageMetadata } from "../../image-ops-DdUL3po0.js";
import { d as ensureAgentWorkspace } from "../../workspace-DP5mE--D.js";
import { o as requestHeartbeat } from "../../heartbeat-wake-Vi0-QIbj.js";
import { a as enqueueSystemEvent } from "../../system-events-DNR0hK3x.js";
import { B as resumeFlow, N as finishFlow, O as createManagedTaskFlow, R as requestFlowCancel, V as setFlowWaiting, j as failFlow, m as listTasksForFlowId } from "../../task-registry-UC1XNEPo.js";
import "../../runtime-internal-BgpYM7w3.js";
import { _ as resolveTaskFlowForLookupTokenForOwner, d as runTaskInFlowForOwner, g as listTaskFlowsForOwner, h as getTaskFlowByIdForOwner, l as getFlowTaskSummary, m as findLatestTaskFlowForOwner, r as cancelFlowByIdForOwner, t as cancelDetachedTaskRunById } from "../../task-executor-qgvZrjoE.js";
import { n as summarizeTaskRecords } from "../../task-registry.summary-BwpoHlXv.js";
import { t as resolveAgentTimeoutMs } from "../../timeout-Drw0_zOv.js";
import { a as createLazyRuntimeSurface, n as createLazyRuntimeMethodBinder, r as createLazyRuntimeModule, t as createLazyRuntimeMethod } from "../../lazy-runtime-D-7_JraP.js";
import "../../media-services-CvavqnxN.js";
import { a as generateMusic, o as listRuntimeMusicGenerationProviders } from "../../openclaw-tools-VdzehAgr.js";
import { n as listRuntimeImageGenerationProviders, t as generateImage } from "../../runtime-DAd7d7RH.js";
import { n as loadWebMedia } from "../../web-media-DnX3imnL.js";
import { n as resolveAgentIdentity } from "../../identity-Bc-uwZ_Y.js";
import { a as getTaskByIdForOwner, o as listTasksForRelatedSessionKeyForOwner, r as findLatestTaskForRelatedSessionKeyForOwner, s as resolveTaskForLookupTokenForOwner } from "../../task-owner-access-HQtTuEya.js";
import { t as RequestScopedSubagentRuntimeError } from "../../error-runtime-Ck1CsJM-.js";
import { g as isVoiceCompatibleAudio } from "../../media-runtime-BGWQwoXi.js";
import { n as listRuntimeVideoGenerationProviders, t as generateVideo } from "../../runtime-D0QjEjym.js";
import { a as runWebSearch, r as listWebSearchProviders } from "../../runtime-C5yTEi2_.js";
import { i as setGatewaySubagentRuntime, n as gatewaySubagentState, r as setGatewayNodesRuntime, t as clearGatewaySubagentRuntime } from "../../gateway-bindings-6VdB9O0r.js";
import { t as createRuntimeChannel } from "../../runtime-channel-DS06kH5O.js";
//#region src/plugins/runtime/runtime-cache.ts
/** Defines a lazily computed enumerable property on a runtime facade. */
function defineCachedValue(target, key, create) {
	let cached;
	let ready = false;
	Object.defineProperty(target, key, {
		configurable: true,
		enumerable: true,
		get() {
			if (!ready) {
				cached = create();
				ready = true;
			}
			return cached;
		}
	});
}
//#endregion
//#region src/plugins/runtime/runtime-agent.ts
const loadEmbeddedAgentRuntime = createLazyRuntimeModule(() => import("../../runtime-embedded-agent.runtime-D2FAaSSe.js"));
function resolveRuntimeThinkingCatalog(params) {
	if (params.catalog) return params.catalog;
	const configuredCatalog = buildConfiguredModelCatalog({ cfg: getRuntimeConfig() });
	return configuredCatalog.length > 0 ? configuredCatalog : void 0;
}
function toSessionAccessScope(params) {
	return {
		sessionKey: params.sessionKey,
		...params.agentId !== void 0 ? { agentId: params.agentId } : {},
		...params.env !== void 0 ? { env: params.env } : {},
		...params.hydrateSkillPromptRefs !== void 0 ? { hydrateSkillPromptRefs: params.hydrateSkillPromptRefs } : {},
		...params.storePath !== void 0 ? { storePath: params.storePath } : {}
	};
}
function getSessionEntry(params) {
	return loadSessionEntry(toSessionAccessScope(params));
}
function listSessionEntries(params = {}) {
	return listSessionEntries$1({
		...params.agentId !== void 0 ? { agentId: params.agentId } : {},
		...params.env !== void 0 ? { env: params.env } : {},
		...params.hydrateSkillPromptRefs !== void 0 ? { hydrateSkillPromptRefs: params.hydrateSkillPromptRefs } : {},
		...params.storePath !== void 0 ? { storePath: params.storePath } : {}
	});
}
async function patchSessionEntry(params) {
	return await patchSessionEntry$1(toSessionAccessScope(params), params.update, {
		fallbackEntry: params.fallbackEntry,
		maintenanceConfig: params.maintenanceConfig,
		preserveActivity: params.preserveActivity,
		replaceEntry: params.replaceEntry
	});
}
async function updateSessionStoreEntry(params) {
	return await updateSessionEntry({
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, params.update, {
		skipMaintenance: params.skipMaintenance,
		takeCacheOwnership: params.takeCacheOwnership,
		requireWriteSuccess: params.requireWriteSuccess
	});
}
async function upsertSessionEntry(params) {
	await replaceSessionEntry(toSessionAccessScope(params), params.entry);
}
/** Creates the plugin runtime agent facade with lazy embedded-agent/session helpers. */
function createRuntimeAgent() {
	const agentRuntime = {
		defaults: {
			model: DEFAULT_MODEL,
			provider: DEFAULT_PROVIDER
		},
		resolveAgentDir,
		resolveAgentWorkspaceDir,
		resolveAgentIdentity,
		resolveThinkingDefault,
		normalizeThinkingLevel: normalizeThinkLevel,
		resolveThinkingPolicy: (params) => {
			const profile = resolveThinkingProfile({
				...params,
				catalog: resolveRuntimeThinkingCatalog(params)
			});
			const policy = { levels: profile.levels.map(({ id, label }) => ({
				id,
				label
			})) };
			return profile.defaultLevel ? {
				...policy,
				defaultLevel: profile.defaultLevel
			} : policy;
		},
		resolveAgentTimeoutMs,
		ensureAgentWorkspace
	};
	defineCachedValue(agentRuntime, "runEmbeddedAgent", () => createLazyRuntimeMethod(loadEmbeddedAgentRuntime, (runtime) => runtime.runEmbeddedAgent));
	defineCachedValue(agentRuntime, "runEmbeddedPiAgent", () => agentRuntime.runEmbeddedAgent);
	defineCachedValue(agentRuntime, "session", () => ({
		resolveStorePath,
		getSessionEntry,
		listSessionEntries,
		patchSessionEntry,
		upsertSessionEntry,
		loadSessionStore,
		saveSessionStore,
		updateSessionStore,
		updateSessionStoreEntry,
		resolveSessionFilePath
	}));
	return agentRuntime;
}
//#endregion
//#region src/plugins/runtime/runtime-config.ts
const RUNTIME_CONFIG_LOAD_WRITE_COMPAT_CODE = "runtime-config-load-write";
const warnedDeprecatedConfigApis = /* @__PURE__ */ new Set();
function formatDeprecatedConfigApiSubject(name) {
	const scope = getPluginRuntimeGatewayRequestScope();
	if (!scope?.pluginId) return `plugin runtime config.${name}()`;
	return `plugin "${scope.pluginId}" runtime config.${name}()`;
}
function formatDeprecatedConfigApiSource() {
	const scope = getPluginRuntimeGatewayRequestScope();
	return scope?.pluginSource ? ` Source: ${scope.pluginSource}` : "";
}
function formatDeprecatedConfigApiWarningKey(name) {
	return `${name}:${getPluginRuntimeGatewayRequestScope()?.pluginId ?? "anonymous"}`;
}
function warnDeprecatedConfigApiOnce(name, replacement) {
	const warningKey = formatDeprecatedConfigApiWarningKey(name);
	if (warnedDeprecatedConfigApis.has(warningKey)) return;
	warnedDeprecatedConfigApis.add(warningKey);
	logWarn(`${formatDeprecatedConfigApiSubject(name)} is deprecated (${RUNTIME_CONFIG_LOAD_WRITE_COMPAT_CODE}); use ${replacement}.${formatDeprecatedConfigApiSource()}`);
}
function createRuntimeConfig() {
	return {
		current: getRuntimeConfig,
		mutateConfigFile: async (params) => await mutateConfigFile({
			...params,
			writeOptions: params.writeOptions
		}),
		replaceConfigFile: async (params) => await replaceConfigFile({
			...params,
			writeOptions: params.writeOptions
		}),
		loadConfig: () => {
			warnDeprecatedConfigApiOnce("loadConfig", "config.current()");
			return getRuntimeConfig();
		},
		writeConfigFile: async (cfg, options) => {
			warnDeprecatedConfigApiOnce("writeConfigFile", "config.mutateConfigFile(...) or config.replaceConfigFile(...)");
			await replaceConfigFile({
				nextConfig: cfg,
				afterWrite: options?.afterWrite ?? { mode: "auto" },
				writeOptions: options
			});
		}
	};
}
//#endregion
//#region src/plugins/runtime/runtime-events.ts
/** Creates the plugin runtime event subscription facade. */
function createRuntimeEvents() {
	return {
		onAgentEvent,
		onSessionTranscriptUpdate
	};
}
//#endregion
//#region src/plugins/runtime/runtime-logging.ts
function writeRuntimeLog(log, message, meta) {
	if (meta && Object.keys(meta).length > 0) {
		log(meta, message);
		return;
	}
	log(message);
}
/** Creates the plugin runtime logging facade. */
function createRuntimeLogging() {
	return {
		shouldLogVerbose,
		getChildLogger: (bindings, opts) => {
			const logger = getChildLogger(bindings, { level: opts?.level ? normalizeLogLevel(opts.level) : void 0 });
			return {
				debug: (message, meta) => {
					if (logger.debug) writeRuntimeLog(logger.debug.bind(logger), message, meta);
				},
				info: (message, meta) => writeRuntimeLog(logger.info.bind(logger), message, meta),
				warn: (message, meta) => writeRuntimeLog(logger.warn.bind(logger), message, meta),
				error: (message, meta) => writeRuntimeLog(logger.error.bind(logger), message, meta)
			};
		}
	};
}
//#endregion
//#region src/plugins/runtime/runtime-media.ts
/** Creates the plugin runtime media facade. */
function createRuntimeMedia() {
	return {
		loadWebMedia,
		detectMime,
		mediaKindFromMime,
		isVoiceCompatibleAudio,
		getImageMetadata,
		resizeToJpeg
	};
}
//#endregion
//#region src/plugins/runtime/native-deps.ts
/** Formats concise guidance for installing and rebuilding a native dependency. */
function formatNativeDependencyHint(params) {
	const manager = params.manager ?? "pnpm";
	const rebuildCommand = params.rebuildCommand ?? (manager === "npm" ? `npm rebuild ${params.packageName}` : manager === "yarn" ? `yarn rebuild ${params.packageName}` : `pnpm rebuild ${params.packageName}`);
	const steps = [
		params.approveBuildsCommand ?? (manager === "pnpm" ? `pnpm approve-builds (select ${params.packageName})` : void 0),
		rebuildCommand,
		params.downloadCommand
	].filter((step) => Boolean(step));
	if (steps.length === 0) return `Install ${params.packageName} and rebuild its native module.`;
	return `Install ${params.packageName} and rebuild its native module (${steps.join("; ")}).`;
}
//#endregion
//#region src/plugins/runtime/runtime-system.ts
const runHeartbeatOnceInternal = createLazyRuntimeMethod(createLazyRuntimeModule(() => import("../../heartbeat-runner-DEJUP_8U.js")), (runtime) => runtime.runHeartbeatOnce);
/** Creates the plugin runtime system facade with heartbeat/event/process helpers. */
function createRuntimeSystem() {
	const requestHeartbeatNow = (opts) => requestHeartbeat({
		source: opts?.source ?? "other",
		intent: opts?.intent ?? "immediate",
		reason: opts?.reason,
		coalesceMs: opts?.coalesceMs,
		agentId: opts?.agentId,
		sessionKey: opts?.sessionKey,
		heartbeat: opts?.heartbeat
	});
	return {
		enqueueSystemEvent,
		requestHeartbeat,
		requestHeartbeatNow,
		runHeartbeatOnce: (opts) => {
			const { reason, agentId, sessionKey, heartbeat } = opts ?? {};
			return runHeartbeatOnceInternal({
				reason,
				agentId,
				sessionKey,
				heartbeat: heartbeat ? { target: heartbeat.target } : void 0
			});
		},
		runCommandWithTimeout,
		formatNativeDependencyHint
	};
}
//#endregion
//#region src/plugins/runtime/runtime-taskflow.ts
function assertSessionKey$1(sessionKey, errorMessage) {
	const normalized = sessionKey?.trim();
	if (!normalized) throw new Error(errorMessage);
	return normalized;
}
function asManagedTaskFlowRecord(flow) {
	if (!flow || flow.syncMode !== "managed" || !flow.controllerId) return;
	return flow;
}
function resolveManagedFlowForOwner(params) {
	const flow = getTaskFlowByIdForOwner({
		flowId: params.flowId,
		callerOwnerKey: params.ownerKey
	});
	if (!flow) return {
		ok: false,
		code: "not_found"
	};
	const managed = asManagedTaskFlowRecord(flow);
	if (!managed) return {
		ok: false,
		code: "not_managed",
		current: flow
	};
	return {
		ok: true,
		flow: managed
	};
}
function mapFlowUpdateResult(result) {
	if (result.applied) {
		const managed = asManagedTaskFlowRecord(result.flow);
		if (!managed) return {
			applied: false,
			code: "not_managed",
			current: result.flow
		};
		return {
			applied: true,
			flow: managed
		};
	}
	return {
		applied: false,
		code: result.reason,
		...result.current ? { current: result.current } : {}
	};
}
function createBoundTaskFlowRuntime(params) {
	const ownerKey = assertSessionKey$1(params.sessionKey, "TaskFlow runtime requires a bound sessionKey.");
	const requesterOrigin = params.requesterOrigin ? normalizeDeliveryContext(params.requesterOrigin) : void 0;
	const tryCreateManaged = (input) => {
		return asManagedTaskFlowRecord(createManagedTaskFlow({
			ownerKey,
			controllerId: input.controllerId,
			requesterOrigin,
			status: input.status,
			notifyPolicy: input.notifyPolicy,
			goal: input.goal,
			currentStep: input.currentStep,
			stateJson: input.stateJson,
			waitJson: input.waitJson,
			cancelRequestedAt: input.cancelRequestedAt,
			createdAt: input.createdAt,
			updatedAt: input.updatedAt,
			endedAt: input.endedAt
		}) ?? void 0) ?? null;
	};
	return {
		sessionKey: ownerKey,
		...requesterOrigin ? { requesterOrigin } : {},
		createManaged: (input) => {
			const flow = tryCreateManaged(input);
			if (!flow) throw new Error("TaskFlow persistence failed.");
			return flow;
		},
		tryCreateManaged,
		get: (flowId) => getTaskFlowByIdForOwner({
			flowId,
			callerOwnerKey: ownerKey
		}),
		list: () => listTaskFlowsForOwner({ callerOwnerKey: ownerKey }),
		findLatest: () => findLatestTaskFlowForOwner({ callerOwnerKey: ownerKey }),
		resolve: (token) => resolveTaskFlowForLookupTokenForOwner({
			token,
			callerOwnerKey: ownerKey
		}),
		getTaskSummary: (flowId) => {
			const flow = getTaskFlowByIdForOwner({
				flowId,
				callerOwnerKey: ownerKey
			});
			return flow ? getFlowTaskSummary(flow.flowId) : void 0;
		},
		setWaiting: (input) => {
			const flow = resolveManagedFlowForOwner({
				flowId: input.flowId,
				ownerKey
			});
			if (!flow.ok) return {
				applied: false,
				code: flow.code,
				...flow.current ? { current: flow.current } : {}
			};
			return mapFlowUpdateResult(setFlowWaiting({
				flowId: flow.flow.flowId,
				expectedRevision: input.expectedRevision,
				currentStep: input.currentStep,
				stateJson: input.stateJson,
				waitJson: input.waitJson,
				blockedTaskId: input.blockedTaskId,
				blockedSummary: input.blockedSummary,
				updatedAt: input.updatedAt
			}));
		},
		resume: (input) => {
			const flow = resolveManagedFlowForOwner({
				flowId: input.flowId,
				ownerKey
			});
			if (!flow.ok) return {
				applied: false,
				code: flow.code,
				...flow.current ? { current: flow.current } : {}
			};
			return mapFlowUpdateResult(resumeFlow({
				flowId: flow.flow.flowId,
				expectedRevision: input.expectedRevision,
				status: input.status,
				currentStep: input.currentStep,
				stateJson: input.stateJson,
				updatedAt: input.updatedAt
			}));
		},
		finish: (input) => {
			const flow = resolveManagedFlowForOwner({
				flowId: input.flowId,
				ownerKey
			});
			if (!flow.ok) return {
				applied: false,
				code: flow.code,
				...flow.current ? { current: flow.current } : {}
			};
			return mapFlowUpdateResult(finishFlow({
				flowId: flow.flow.flowId,
				expectedRevision: input.expectedRevision,
				stateJson: input.stateJson,
				updatedAt: input.updatedAt,
				endedAt: input.endedAt
			}));
		},
		fail: (input) => {
			const flow = resolveManagedFlowForOwner({
				flowId: input.flowId,
				ownerKey
			});
			if (!flow.ok) return {
				applied: false,
				code: flow.code,
				...flow.current ? { current: flow.current } : {}
			};
			return mapFlowUpdateResult(failFlow({
				flowId: flow.flow.flowId,
				expectedRevision: input.expectedRevision,
				stateJson: input.stateJson,
				blockedTaskId: input.blockedTaskId,
				blockedSummary: input.blockedSummary,
				updatedAt: input.updatedAt,
				endedAt: input.endedAt
			}));
		},
		requestCancel: (input) => {
			const flow = resolveManagedFlowForOwner({
				flowId: input.flowId,
				ownerKey
			});
			if (!flow.ok) return {
				applied: false,
				code: flow.code,
				...flow.current ? { current: flow.current } : {}
			};
			return mapFlowUpdateResult(requestFlowCancel({
				flowId: flow.flow.flowId,
				expectedRevision: input.expectedRevision,
				cancelRequestedAt: input.cancelRequestedAt
			}));
		},
		cancel: ({ flowId, cfg }) => cancelFlowByIdForOwner({
			cfg,
			flowId,
			callerOwnerKey: ownerKey
		}),
		runTask: (input) => {
			const created = runTaskInFlowForOwner({
				flowId: input.flowId,
				callerOwnerKey: ownerKey,
				runtime: input.runtime,
				sourceId: input.sourceId,
				childSessionKey: input.childSessionKey,
				parentTaskId: input.parentTaskId,
				agentId: input.agentId,
				runId: input.runId,
				label: input.label,
				task: input.task,
				preferMetadata: input.preferMetadata,
				notifyPolicy: input.notifyPolicy,
				deliveryStatus: input.deliveryStatus,
				status: input.status,
				startedAt: input.startedAt,
				lastEventAt: input.lastEventAt,
				progressSummary: input.progressSummary
			});
			if (!created.created) return {
				created: false,
				found: created.found,
				reason: created.reason ?? "Task was not created.",
				...created.flow ? { flow: created.flow } : {}
			};
			const managed = asManagedTaskFlowRecord(created.flow);
			if (!managed) return {
				created: false,
				found: true,
				reason: "TaskFlow does not accept managed child tasks.",
				flow: created.flow
			};
			if (!created.task) return {
				created: false,
				found: true,
				reason: "Task was not created.",
				flow: created.flow
			};
			return {
				created: true,
				flow: managed,
				task: created.task
			};
		}
	};
}
function createRuntimeTaskFlow() {
	return {
		bindSession: (params) => createBoundTaskFlowRuntime({
			sessionKey: params.sessionKey,
			requesterOrigin: params.requesterOrigin
		}),
		fromToolContext: (ctx) => createBoundTaskFlowRuntime({
			sessionKey: assertSessionKey$1(ctx.sessionKey, "TaskFlow runtime requires tool context with a sessionKey."),
			requesterOrigin: ctx.deliveryContext
		})
	};
}
//#endregion
//#region src/tasks/task-domain-views.ts
/** Maps internal task summary counts to the plugin task-domain view contract. */
function mapTaskRunAggregateSummary(summary) {
	return {
		total: summary.total,
		active: summary.active,
		terminal: summary.terminal,
		failures: summary.failures,
		byStatus: { ...summary.byStatus },
		byRuntime: { ...summary.byRuntime }
	};
}
function mapTaskRunView(task) {
	return {
		id: task.taskId,
		runtime: task.runtime,
		...task.sourceId ? { sourceId: task.sourceId } : {},
		sessionKey: task.requesterSessionKey,
		ownerKey: task.ownerKey,
		scope: task.scopeKind,
		...task.childSessionKey ? { childSessionKey: task.childSessionKey } : {},
		...task.parentFlowId ? { flowId: task.parentFlowId } : {},
		...task.parentTaskId ? { parentTaskId: task.parentTaskId } : {},
		...task.agentId ? { agentId: task.agentId } : {},
		...task.runId ? { runId: task.runId } : {},
		...task.label ? { label: task.label } : {},
		title: task.task,
		status: task.status,
		deliveryStatus: task.deliveryStatus,
		notifyPolicy: task.notifyPolicy,
		createdAt: task.createdAt,
		...task.startedAt !== void 0 ? { startedAt: task.startedAt } : {},
		...task.endedAt !== void 0 ? { endedAt: task.endedAt } : {},
		...task.lastEventAt !== void 0 ? { lastEventAt: task.lastEventAt } : {},
		...task.cleanupAfter !== void 0 ? { cleanupAfter: task.cleanupAfter } : {},
		...task.error ? { error: task.error } : {},
		...task.progressSummary ? { progressSummary: task.progressSummary } : {},
		...task.terminalSummary ? { terminalSummary: task.terminalSummary } : {},
		...task.terminalOutcome ? { terminalOutcome: task.terminalOutcome } : {}
	};
}
function mapTaskRunDetail(task) {
	return mapTaskRunView(task);
}
function mapTaskFlowView(flow) {
	return {
		id: flow.flowId,
		ownerKey: flow.ownerKey,
		...flow.requesterOrigin ? { requesterOrigin: { ...flow.requesterOrigin } } : {},
		status: flow.status,
		notifyPolicy: flow.notifyPolicy,
		goal: flow.goal,
		...flow.currentStep ? { currentStep: flow.currentStep } : {},
		...flow.cancelRequestedAt !== void 0 ? { cancelRequestedAt: flow.cancelRequestedAt } : {},
		createdAt: flow.createdAt,
		updatedAt: flow.updatedAt,
		...flow.endedAt !== void 0 ? { endedAt: flow.endedAt } : {}
	};
}
function mapTaskFlowDetail(params) {
	const summary = params.summary ?? summarizeTaskRecords(params.tasks);
	return {
		...mapTaskFlowView(params.flow),
		...params.flow.stateJson !== void 0 ? { state: params.flow.stateJson } : {},
		...params.flow.waitJson !== void 0 ? { wait: params.flow.waitJson } : {},
		...params.flow.blockedTaskId || params.flow.blockedSummary ? { blocked: {
			...params.flow.blockedTaskId ? { taskId: params.flow.blockedTaskId } : {},
			...params.flow.blockedSummary ? { summary: params.flow.blockedSummary } : {}
		} } : {},
		tasks: params.tasks.map((task) => mapTaskRunView(task)),
		taskSummary: mapTaskRunAggregateSummary(summary)
	};
}
//#endregion
//#region src/plugins/runtime/runtime-tasks.ts
function assertSessionKey(sessionKey, errorMessage) {
	const normalized = sessionKey?.trim();
	if (!normalized) throw new Error(errorMessage);
	return normalized;
}
function mapCancelledTaskResult(result) {
	return {
		found: result.found,
		cancelled: result.cancelled,
		...result.reason ? { reason: result.reason } : {},
		...result.task ? { task: mapTaskRunDetail(result.task) } : {}
	};
}
function createBoundTaskRunsRuntime(params) {
	const ownerKey = assertSessionKey(params.sessionKey, "Tasks runtime requires a bound sessionKey.");
	const requesterOrigin = params.requesterOrigin ? normalizeDeliveryContext(params.requesterOrigin) : void 0;
	return {
		sessionKey: ownerKey,
		...requesterOrigin ? { requesterOrigin } : {},
		get: (taskId) => {
			const task = getTaskByIdForOwner({
				taskId,
				callerOwnerKey: ownerKey
			});
			return task ? mapTaskRunDetail(task) : void 0;
		},
		list: () => listTasksForRelatedSessionKeyForOwner({
			relatedSessionKey: ownerKey,
			callerOwnerKey: ownerKey
		}).map((task) => mapTaskRunView(task)),
		findLatest: () => {
			const task = findLatestTaskForRelatedSessionKeyForOwner({
				relatedSessionKey: ownerKey,
				callerOwnerKey: ownerKey
			});
			return task ? mapTaskRunDetail(task) : void 0;
		},
		resolve: (token) => {
			const task = resolveTaskForLookupTokenForOwner({
				token,
				callerOwnerKey: ownerKey
			});
			return task ? mapTaskRunDetail(task) : void 0;
		},
		cancel: async ({ taskId, cfg }) => {
			const task = getTaskByIdForOwner({
				taskId,
				callerOwnerKey: ownerKey
			});
			if (!task) return {
				found: false,
				cancelled: false,
				reason: "Task not found."
			};
			return mapCancelledTaskResult(await cancelDetachedTaskRunById({
				cfg,
				taskId: task.taskId
			}));
		}
	};
}
function createBoundTaskFlowsRuntime(params) {
	const ownerKey = assertSessionKey(params.sessionKey, "TaskFlow runtime requires a bound sessionKey.");
	const requesterOrigin = params.requesterOrigin ? normalizeDeliveryContext(params.requesterOrigin) : void 0;
	const getDetail = (flowId) => {
		const flow = getTaskFlowByIdForOwner({
			flowId,
			callerOwnerKey: ownerKey
		});
		if (!flow) return;
		return mapTaskFlowDetail({
			flow,
			tasks: listTasksForFlowId(flow.flowId),
			summary: getFlowTaskSummary(flow.flowId)
		});
	};
	return {
		sessionKey: ownerKey,
		...requesterOrigin ? { requesterOrigin } : {},
		get: (flowId) => getDetail(flowId),
		list: () => listTaskFlowsForOwner({ callerOwnerKey: ownerKey }).map((flow) => mapTaskFlowView(flow)),
		findLatest: () => {
			const flow = findLatestTaskFlowForOwner({ callerOwnerKey: ownerKey });
			return flow ? getDetail(flow.flowId) : void 0;
		},
		resolve: (token) => {
			const flow = resolveTaskFlowForLookupTokenForOwner({
				token,
				callerOwnerKey: ownerKey
			});
			return flow ? getDetail(flow.flowId) : void 0;
		},
		getTaskSummary: (flowId) => {
			const flow = getTaskFlowByIdForOwner({
				flowId,
				callerOwnerKey: ownerKey
			});
			return flow ? mapTaskRunAggregateSummary(getFlowTaskSummary(flow.flowId)) : void 0;
		}
	};
}
function createRuntimeTaskRuns() {
	return {
		bindSession: (params) => createBoundTaskRunsRuntime({
			sessionKey: params.sessionKey,
			requesterOrigin: params.requesterOrigin
		}),
		fromToolContext: (ctx) => createBoundTaskRunsRuntime({
			sessionKey: assertSessionKey(ctx.sessionKey, "Tasks runtime requires tool context with a sessionKey."),
			requesterOrigin: ctx.deliveryContext
		})
	};
}
function createRuntimeTaskFlows() {
	return {
		bindSession: (params) => createBoundTaskFlowsRuntime({
			sessionKey: params.sessionKey,
			requesterOrigin: params.requesterOrigin
		}),
		fromToolContext: (ctx) => createBoundTaskFlowsRuntime({
			sessionKey: assertSessionKey(ctx.sessionKey, "TaskFlow runtime requires tool context with a sessionKey."),
			requesterOrigin: ctx.deliveryContext
		})
	};
}
function createRuntimeTasks(params) {
	return {
		runs: createRuntimeTaskRuns(),
		flows: createRuntimeTaskFlows(),
		managedFlows: params.legacyTaskFlow,
		flow: params.legacyTaskFlow
	};
}
//#endregion
//#region src/plugins/runtime/index.ts
const loadTtsRuntime = createLazyRuntimeModule(() => import("../../tts-BFqPjlSm.js"));
const loadMediaUnderstandingRuntime = createLazyRuntimeModule(() => import("../../runtime-Bs8ewvb7.js"));
const loadModelAuthRuntime = createLazyRuntimeModule(() => import("../../runtime-model-auth.runtime-Db8G6cCa.js"));
function createRuntimeTts() {
	const bindTtsRuntime = createLazyRuntimeMethodBinder(loadTtsRuntime);
	return {
		textToSpeech: bindTtsRuntime((runtime) => runtime.textToSpeech),
		textToSpeechStream: bindTtsRuntime((runtime) => runtime.textToSpeechStream),
		textToSpeechTelephony: bindTtsRuntime((runtime) => runtime.textToSpeechTelephony),
		listVoices: bindTtsRuntime((runtime) => runtime.listSpeechVoices)
	};
}
function createRuntimeMediaUnderstandingFacade() {
	const bindMediaUnderstandingRuntime = createLazyRuntimeMethodBinder(loadMediaUnderstandingRuntime);
	return {
		runFile: bindMediaUnderstandingRuntime((runtime) => runtime.runMediaUnderstandingFile),
		describeImageFile: bindMediaUnderstandingRuntime((runtime) => runtime.describeImageFile),
		describeImageFileWithModel: bindMediaUnderstandingRuntime((runtime) => runtime.describeImageFileWithModel),
		extractStructuredWithModel: bindMediaUnderstandingRuntime((runtime) => runtime.extractStructuredWithModel),
		describeVideoFile: bindMediaUnderstandingRuntime((runtime) => runtime.describeVideoFile),
		transcribeAudioFile: bindMediaUnderstandingRuntime((runtime) => runtime.transcribeAudioFile)
	};
}
function createRuntimeImageGeneration() {
	return {
		generate: (params) => generateImage(params),
		listProviders: (params) => listRuntimeImageGenerationProviders(params)
	};
}
function createRuntimeVideoGeneration() {
	return {
		generate: (params) => generateVideo(params),
		listProviders: (params) => listRuntimeVideoGenerationProviders(params)
	};
}
function createRuntimeMusicGeneration() {
	return {
		generate: (params) => generateMusic(params),
		listProviders: (params) => listRuntimeMusicGenerationProviders(params)
	};
}
function createRuntimeLlmFacade() {
	const loadLlm = createLazyRuntimeSurface(() => import("../../runtime-llm.runtime-CT_cglvo.js"), (m) => m.createRuntimeLlm({
		getConfig: getRuntimeConfig,
		authority: { allowComplete: true }
	}));
	return { complete: async (params) => {
		return (await loadLlm()).complete(params);
	} };
}
function createRuntimeModelAuth() {
	const getApiKeyForModel = createLazyRuntimeMethod(loadModelAuthRuntime, (runtime) => runtime.getApiKeyForModel);
	const getRuntimeAuthForModel = createLazyRuntimeMethod(loadModelAuthRuntime, (runtime) => runtime.getRuntimeAuthForModel);
	const resolveApiKeyForProvider = createLazyRuntimeMethod(loadModelAuthRuntime, (runtime) => runtime.resolveApiKeyForProvider);
	return {
		getApiKeyForModel: (params) => getApiKeyForModel({
			model: params.model,
			cfg: params.cfg,
			workspaceDir: params.workspaceDir
		}),
		getRuntimeAuthForModel: (params) => getRuntimeAuthForModel({
			model: params.model,
			cfg: params.cfg,
			workspaceDir: params.workspaceDir
		}),
		resolveApiKeyForProvider: (params) => resolveApiKeyForProvider({
			provider: params.provider,
			cfg: params.cfg,
			workspaceDir: params.workspaceDir
		})
	};
}
function createUnavailableSubagentRuntime() {
	const unavailable = () => {
		throw new RequestScopedSubagentRuntimeError();
	};
	return {
		run: unavailable,
		waitForRun: unavailable,
		getSessionMessages: unavailable,
		getSession: unavailable,
		deleteSession: unavailable
	};
}
/**
* Create a late-binding subagent that resolves to:
* 1. An explicitly provided subagent (from runtimeOptions), OR
* 2. The process-global gateway subagent when the caller explicitly opts in, OR
* 3. The unavailable fallback (throws with a clear error message).
*/
function createLateBindingSubagent(explicit, allowGatewaySubagentBinding = false) {
	if (explicit) return explicit;
	const unavailable = createUnavailableSubagentRuntime();
	if (!allowGatewaySubagentBinding) return unavailable;
	return new Proxy(unavailable, { get(_target, prop, _receiver) {
		const resolved = gatewaySubagentState.subagent ?? unavailable;
		return Reflect.get(resolved, prop, resolved);
	} });
}
function createUnavailableNodesRuntime() {
	const unavailable = () => {
		throw new Error("Plugin node runtime is only available inside the Gateway.");
	};
	return {
		list: unavailable,
		invoke: unavailable
	};
}
function createLateBindingNodes(allowGatewayBinding = false) {
	const unavailable = createUnavailableNodesRuntime();
	if (!allowGatewayBinding) return unavailable;
	return new Proxy(unavailable, { get(_target, prop, _receiver) {
		const resolved = gatewaySubagentState.nodes ?? unavailable;
		return Reflect.get(resolved, prop, resolved);
	} });
}
function createPluginRuntime(_options = {}) {
	const mediaUnderstanding = createRuntimeMediaUnderstandingFacade();
	const taskFlow = createRuntimeTaskFlow();
	const tasks = createRuntimeTasks({ legacyTaskFlow: taskFlow });
	const runtime = {
		version: VERSION,
		config: createRuntimeConfig(),
		agent: createRuntimeAgent(),
		subagent: createLateBindingSubagent(_options.subagent, _options.allowGatewaySubagentBinding === true),
		nodes: _options.nodes ?? createLateBindingNodes(_options.allowGatewaySubagentBinding === true),
		system: createRuntimeSystem(),
		media: createRuntimeMedia(),
		webSearch: {
			listProviders: listWebSearchProviders,
			search: runWebSearch
		},
		channel: createRuntimeChannel(),
		events: createRuntimeEvents(),
		logging: createRuntimeLogging(),
		state: {
			resolveStateDir,
			openKeyedStore: () => {
				throw new Error("openKeyedStore is only available through the plugin runtime proxy.");
			},
			openSyncKeyedStore: () => {
				throw new Error("openSyncKeyedStore is only available through the plugin runtime proxy.");
			},
			openChannelIngressQueue: () => {
				throw new Error("openChannelIngressQueue is only available through the plugin runtime proxy.");
			}
		},
		tasks,
		taskFlow
	};
	defineCachedValue(runtime, "tts", createRuntimeTts);
	defineCachedValue(runtime, "mediaUnderstanding", () => mediaUnderstanding);
	defineCachedValue(runtime, "stt", () => ({ transcribeAudioFile: mediaUnderstanding.transcribeAudioFile }));
	defineCachedValue(runtime, "modelAuth", createRuntimeModelAuth);
	defineCachedValue(runtime, "imageGeneration", createRuntimeImageGeneration);
	defineCachedValue(runtime, "videoGeneration", createRuntimeVideoGeneration);
	defineCachedValue(runtime, "musicGeneration", createRuntimeMusicGeneration);
	defineCachedValue(runtime, "llm", createRuntimeLlmFacade);
	return runtime;
}
//#endregion
export { clearGatewaySubagentRuntime, createPluginRuntime, setGatewayNodesRuntime, setGatewaySubagentRuntime };
