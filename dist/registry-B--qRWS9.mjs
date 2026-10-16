import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, p as normalizeStringifiedOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { D as resolveExpiresAtMsFromDurationMs, R as timestampMsToIsoString } from "./number-coercion-CuVhdCBs.mjs";
import { k as PluginInstanceUnavailableError, o as getPluginCache, w as retirePluginCacheInstance } from "./plugin-cache-BABafcXD.mjs";
import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { a as createLazyRuntimeSurface, r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { _ as normalizeUniqueTrimmedStringList, b as uniqueValues, d as normalizeStringEntries, h as normalizeUniqueStringEntries } from "./string-normalization-CECOqf64.mjs";
import { A as withTimeout } from "./fs-safe-BUXBSN-4.mjs";
import "./utils-DgZn2dLu.mjs";
import { m as resolveConfigPath } from "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { s as PluginBlobStoreError } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import "./openclaw-state-db-D1jWDzK3.mjs";
import { u as reserveSqliteWorkerInputPreparation } from "./sqlite-worker-store-CsIRv3py.mjs";
import { n as defaultSlotIdForKey, r as hasKind } from "./slots-DarSawuQ.mjs";
import { l as normalizeCommandDescriptorName, u as sanitizeCommandDescriptorDescription } from "./manifest-BXjFCp0F.mjs";
import { s as listOfficialExternalChannelCatalogEntries } from "./official-external-plugin-catalog-DWheKC4x.mjs";
import { o as getOfficialExternalPluginCatalogManifest } from "./official-external-plugin-catalog-source-B7ojvzQW.mjs";
import { d as runPluginCleanup, m as wrapCurrentPluginInstance, n as getPluginInstance, o as getPluginValueInstance } from "./plugin-instance-scope-DEzoxqBj.mjs";
import { d as invalidateProviderRegistryIndex } from "./model-ref-shared-KBg0y299.mjs";
import { a as getGatewayContextResolver, r as getCanonicalGatewayContextResolver, t as bindGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import { a as getPluginRuntimeGatewayRequestScope, c as withPluginRuntimeGatewayRequestScope, l as withPluginRuntimePluginScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { t as GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA } from "./bundled-channel-config-metadata.generated-C81nk32q.mjs";
import { r as createRuntimeConfigReader } from "./runtime-snapshot-DYptB0Cf.mjs";
import { n as PluginInstance } from "./plugin-setup-module-Cbs40ZXx.mjs";
import { S as hasInvalidLifecycleStartTimestamp, i as emitAgentEvent } from "./agent-events-GvNTkbe3.mjs";
import { D as revokePluginRecord, a as capturePluginLifecycleAuthority, b as isPluginRegistryRetired, h as isPluginRecordBorrowed, l as getPluginRecordRegistry, m as isPluginRecordActive, p as getPluginRegistryResourceOwner, y as isPluginRegistryPreparing } from "./registry-lifecycle-Dekhrk9Y.mjs";
import { B as getPluginRunContext, G as setPluginRunContext, J as normalizeHostHookString, N as projectPluginHttpRoutes, P as replacePluginHttpRoutes, R as clearPluginRunContext, U as publishPluginSessionSchedulerJobs, W as registerPluginSessionSchedulerJob, X as normalizeOptionalHostHookString, Y as normalizeHostHookStringList, Z as normalizePluginHostHookId, k as getPluginHttpRouteViews, l as getActivePluginRegistry, z as deletePluginSessionSchedulerJob } from "./runtime-D4MkflNJ.mjs";
import { t as isPluginJsonValue } from "./host-hook-json-CvItNyy3.mjs";
import { n as normalizePluginHttpPath } from "./http-path-utbm8n9N.mjs";
import { s as listChatChannels } from "./registry-B3Y-vjit.mjs";
import { n as pluginArrays, r as pluginMaps, t as createEmptyPluginRegistry } from "./registry-empty-D0pq-oeY.mjs";
import { t as bindPluginRegistryRuntime } from "./registry-runtime-binding-i7RQa2C4.mjs";
import { n as validateJsonSchemaValue } from "./schema-validator-qnYkiHpy.mjs";
import { f as isOperatorScope } from "./operator-scopes-DsrPoRc4.mjs";
import { c as normalizeChannelMeta } from "./bundled-DN3obb3J.mjs";
import { n as unwrapDefaultModuleExport } from "./module-export-BbYMQUy2.mjs";
import { a as readNativeSessionCatalogPreference, n as hasLegacyNativeSessionCatalogDefault } from "./native-session-catalog-config-Cw2NJHbW.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { r as getPluginRuntimeEntrySource } from "./plugin-runtime-artifact-binding-BgpdoCuH.mjs";
import { i as isPromptInjectionHookName, n as isPluginHookName, r as isPluginHookReplyDispatchKind, s as normalizePluginToolMatcher, t as isPluginHookAgentTrigger } from "./hook-types-BYClmq1o.mjs";
import { a as normalizeAgentToolResultMiddlewareRuntimeIds, n as appendAgentToolResultMiddlewareScope, o as normalizeAgentToolResultMiddlewareRuntimes, t as agentToolResultMiddlewareRegistrationCoversTool } from "./agent-tool-result-middleware-DD8TzvvP.mjs";
import { c as createUnavailableRuntime, l as instrumentPluginInstanceApi, s as buildPluginApi } from "./setup-registry-BgUGH45p.mjs";
import { t as PluginTrustRefusalError } from "./plugin-trust-DPp6imOi.mjs";
import { a as registerContextEngineInRegistry } from "./registry-DLLqqQAy.mjs";
import { d as createPluginStoreOptionPolicy, f as serializePluginStoreJson, g as validatePluginStorePositiveInteger, h as validatePluginStoreNamespace, m as validatePluginStoreKey, p as validateOptionalPluginStoreTtlMs } from "./plugin-state-store.validation-BnCg_tof.mjs";
import { i as createPluginStateSyncKeyedStore, r as createPluginStateKeyedStore } from "./plugin-state-store-yKq-W0-T.mjs";
import { n as getPluginRegistryInspectionResources } from "./registry-inspection-resources-DtMKr1b0.mjs";
import { t as createPluginBoardWidgetContentKindRegistrar } from "./board-widget-content-kinds-DNQ145aM.mjs";
import { E as getCoreEmbeddingProvider } from "./gateway-startup-plugin-config-CleWmmi_.mjs";
import { n as resolveDecisionModelSetting, t as getConfiguredDecisionProviderIds } from "./decision-model-setting-HoBvwAS3.mjs";
import { n as resolveCronListPageNextOffset, t as readCanonicalCronListPage } from "./list-page-validation-gRErNGAY.mjs";
import { l as getActiveSecretsRuntimeSnapshotRevisionState } from "./runtime-state-D5wZ6Dom.mjs";
import { a as logDecisionEvaluation, i as decisionDebugEnabled, r as validateDecisionResult, t as DecisionContractError } from "./validation-BcKlnBXl.mjs";
import { r as registerPluginInteractiveHandlerInRegistry } from "./interactive-registry-DJ4VZANI.mjs";
import { i as classifyGatewayProbePath } from "./gateway-http-route-contracts-jBtizxKU.mjs";
import { t as normalizeSessionEntrySlotKey } from "./session-entry-slot-keys-sCRI4mq1.mjs";
import { i as normalizePluginGatewayMethodScope, r as createPluginGatewayMethodDescriptor } from "./descriptor-CsSjfpp-.mjs";
import { t as findPluginHttpRouteRegistrationConflicts } from "./http-route-overlap-BwLyACPn.mjs";
import { C as NODE_WORKER_PRIVATE_COMMANDS, N as isPrivateNodeInvokeCommand, a as NODE_EXEC_APPROVALS_COMMANDS, m as NODE_SYSTEM_RUN_COMMANDS, p as NODE_SYSTEM_NOTIFY_COMMAND } from "./node-commands-BLhGKTZa.mjs";
import { r as registerPluginCommandInRegistry, t as isReservedCommandName } from "./command-registration-COpwTO3C.mjs";
import { n as validateStorageProviderContract } from "./storage-provider-registry-DusKBTCi.mjs";
import { n as validateWorkerProviderContract } from "./worker-provider-registry-BaSctawb.mjs";
import "./with-timeout-BMv4tv7r.mjs";
import { n as resolvePromptInjectionAllowed, t as resolveConversationAccessAllowed } from "./hook-policy-decisions-DL3kOjGW.mjs";
import { t as createHostChannelInboundEventContextBuilder } from "./host-context-builder-7xIt8ezS.mjs";
import { n as createHostChannelIngressRuntime } from "./runtime-DxH1m116.mjs";
import { n as createChannelIngressDrain } from "./ingress-drain--vCVtuIF.mjs";
import { t as createChannelIngressQueue } from "./ingress-queue-BliQMgG8.mjs";
import { d as wrapPluginBlobError, i as MAX_PLUGIN_BLOB_ENTRIES_PER_PLUGIN, n as MAX_PLUGIN_BLOB_BYTES_PER_ENTRY, r as MAX_PLUGIN_BLOB_BYTES_PER_PLUGIN, t as pluginBlobWorkerOperations } from "./plugin-blob-worker-contract-BFrsKWDF.mjs";
import fs from "node:fs";
import { serialize } from "node:v8";
import path from "node:path";
import { isDeepStrictEqual, types } from "node:util";
import { randomUUID } from "node:crypto";
//#region src/plugins/capability-catalog.ts
const capabilityCatalogFamilies = [
	"speechProviders",
	"realtimeTranscriptionProviders",
	"realtimeVoiceProviders"
];
/** Materialize one registration without copying its descriptor or invoking provider operations. */
function resolveCapabilityProviderRegistration(entry, resolveContext) {
	if (typeof entry !== "function") return entry;
	if (!resolveContext) throw new Error("Capability provider factories require host context; supply resolveCapabilityCatalogContext when creating the registry.");
	const provider = entry(wrapCurrentPluginInstance(resolveContext()));
	if (isPromiseLike(provider)) {
		Promise.resolve(provider).catch(() => {});
		throw new Error("capability provider factories must be synchronous");
	}
	return provider;
}
/** Validate the declared public surface without copying provider objects or their hidden methods. */
function resolvePluginCapabilityCatalog(module, context) {
	const entry = unwrapDefaultModuleExport(module);
	if (typeof entry === "function") getPluginValueInstance(entry)?.admitFactory(entry);
	const catalog = typeof entry === "function" ? entry(context) : entry;
	if (isPromiseLike(catalog)) {
		Promise.resolve(catalog).catch(() => {});
		throw new Error("capability catalog factories must be synchronous");
	}
	if (!isRecord(catalog)) throw new Error("default export must synchronously provide a capability descriptor collection");
	const methods = {
		speechProviders: "synthesize",
		realtimeTranscriptionProviders: "createSession",
		realtimeVoiceProviders: "createBridge"
	};
	for (const [family, providers] of Object.entries(catalog)) {
		if (!Object.hasOwn(methods, family)) throw new Error(`unknown capability catalog family: ${family}`);
		const method = methods[family];
		if (!Array.isArray(providers) || providers.some((provider) => !isRecord(provider) || typeof provider.id !== "string" || !provider.id.trim() || typeof provider.label !== "string" || typeof provider.isConfigured !== "function" || typeof provider[method] !== "function")) throw new Error(`${family} must contain complete provider descriptors`);
	}
	return catalog;
}
//#endregion
//#region src/plugins/registry-contributions.ts
function projectArray(source, target, owns) {
	if (target) target.push(...source.filter(owns));
	else for (let index = source.length - 1; index >= 0; index--) if (owns(source[index])) source.splice(index, 1);
}
function projectMap(source, target, owns) {
	for (const [key, entry] of source) {
		if (!owns(entry, key)) continue;
		if (target) target.set(key, entry);
		else source.delete(key);
	}
}
/** Copy exact owned contributions into a candidate, or remove them during failed registration. */
function projectPluginContributions(source, record, target) {
	const pluginId = record.id;
	projectPluginHttpRoutes(source, record, target);
	const owns = (entry) => entry.pluginId === pluginId;
	for (const key of pluginArrays) if (key === "channels" && target && isPluginRecordBorrowed(target, record)) {
		const channels = source.channels.filter(owns);
		if (channels.length > 0) {
			const instance = getPluginInstance(record);
			const isCurrent = capturePluginLifecycleAuthority(target, record, { scopedRuntime: true });
			if (!instance || !isCurrent) throw new Error(`Plugin ${pluginId} channel runtime cannot be borrowed`);
			const wrap = instance.createRegistryView(target, (run) => {
				if (!isCurrent()) throw new Error("Channel runtime borrower is no longer active");
				return run();
			});
			target.channels.push(...channels.map((entry) => wrap(entry)));
		}
	} else projectArray(source[key], target?.[key], owns);
	invalidateProviderRegistryIndex((target ?? source).providers);
	for (const key of pluginMaps) projectMap(source[key], target?.[key], owns);
	projectArray(source.compactionProviders, target?.compactionProviders, (entry) => entry.ownerPluginId === pluginId);
	projectMap(source.contextEngines, target?.contextEngines, (entry) => entry.owner === `plugin:${pluginId}`);
	projectMap(source.pluginRuntimeArtifacts, target?.pluginRuntimeArtifacts, (_entry, key) => JSON.parse(key)[0] === pluginId);
	const ownsMethod = (entry) => entry.owner.kind === "plugin" && entry.owner.pluginId === pluginId;
	for (const entry of source.gatewayMethodDescriptors.filter(ownsMethod)) if (target) target.gatewayHandlers[entry.name] = source.gatewayHandlers[entry.name];
	else delete source.gatewayHandlers[entry.name];
	projectArray(source.gatewayMethodDescriptors, target?.gatewayMethodDescriptors, ownsMethod);
}
//#endregion
//#region src/plugins/agent-event-emission.ts
const HOST_OWNED_AGENT_EVENT_STREAMS = /* @__PURE__ */ new Set([
	"lifecycle",
	"tool",
	"assistant",
	"error",
	"item",
	"plan",
	"approval",
	"command_output",
	"patch",
	"compaction",
	"thinking",
	"model"
]);
function isPluginOwnedAgentEventStream(pluginId, stream) {
	return stream === pluginId || stream.startsWith(`${pluginId}.`);
}
function normalizePluginEventData(params) {
	return {
		...params.data && typeof params.data === "object" && !Array.isArray(params.data) ? params.data : { value: params.data },
		pluginId: params.pluginId,
		...params.pluginName ? { pluginName: params.pluginName } : {}
	};
}
function emitPluginAgentEvent(params) {
	const runId = normalizeOptionalString(params.event.runId);
	const sessionKey = normalizeOptionalString(params.event.sessionKey);
	const stream = normalizeOptionalString(params.event.stream);
	if (!runId || !stream) return {
		emitted: false,
		reason: "runId and stream are required"
	};
	if (!isPluginJsonValue(params.event.data)) return {
		emitted: false,
		reason: "event data must be JSON-compatible"
	};
	if (params.origin !== "bundled" && HOST_OWNED_AGENT_EVENT_STREAMS.has(stream)) return {
		emitted: false,
		reason: `stream ${stream} is reserved for bundled plugins`
	};
	if (params.origin !== "bundled" && !isPluginOwnedAgentEventStream(params.pluginId, stream)) return {
		emitted: false,
		reason: `stream ${stream} must be scoped to plugin ${params.pluginId}`
	};
	if (hasInvalidLifecycleStartTimestamp(stream, params.event.data)) return {
		emitted: false,
		reason: "lifecycle start requires a finite startedAt timestamp"
	};
	emitAgentEvent({
		runId,
		stream,
		...sessionKey ? { sessionKey } : {},
		data: normalizePluginEventData({
			pluginId: params.pluginId,
			pluginName: params.pluginName,
			data: params.event.data
		})
	});
	return {
		emitted: true,
		stream
	};
}
//#endregion
//#region src/plugins/host-hook-scheduled-turns.ts
const log = createSubsystemLogger("plugins/host-scheduled-turns");
const PLUGIN_CRON_NAME_PREFIX = "plugin:";
const PLUGIN_CRON_TAG_MARKER = ":tag:";
const PLUGIN_CRON_CLEANUP_PAGE_SIZE = 200;
const PLUGIN_CRON_CLEANUP_MAX_PAGES = 50;
const PLUGIN_CRON_CLEANUP_MAX_SNAPSHOT_RESTARTS = 3;
function resolveSchedule(params) {
	const cron = normalizeOptionalString(params.cron);
	if (cron) {
		const tz = normalizeOptionalString(params.tz);
		return {
			kind: "cron",
			expr: cron,
			...tz ? { tz } : {}
		};
	}
	if ("delayMs" in params) {
		if (!Number.isFinite(params.delayMs) || params.delayMs < 0) return;
		const timestamp = resolveExpiresAtMsFromDurationMs(Math.max(1, Math.floor(params.delayMs)));
		const at = timestampMsToIsoString(timestamp);
		if (!at) return;
		return {
			kind: "at",
			at
		};
	}
	const rawAt = params.at;
	const at = rawAt instanceof Date ? rawAt : new Date(rawAt);
	if (!Number.isFinite(at.getTime())) return;
	return {
		kind: "at",
		at: at.toISOString()
	};
}
function formatScheduleLogContext(params) {
	return [
		"pluginId",
		"sessionKey",
		"name",
		"jobId"
	].flatMap((key) => key === "pluginId" || params[key] ? [`${key}=${params[key]}`] : []).join(" ");
}
async function removeScheduledSessionTurn(params) {
	try {
		const result = await params.cron.remove(params.jobId);
		return isCronRemoveResult(result) && result.ok;
	} catch (error) {
		log.warn(`plugin session turn cleanup failed (${formatScheduleLogContext(params)}): ${formatErrorMessage(error)}`);
		return false;
	}
}
const PLUGIN_CRON_RESERVED_DELIMITER = ":";
function resolvePluginSessionTurnTag(value) {
	const tag = normalizeOptionalString(value);
	if (!tag) return { invalid: false };
	if (tag.includes(PLUGIN_CRON_RESERVED_DELIMITER)) return { invalid: true };
	return {
		tag,
		invalid: false
	};
}
function buildPluginSchedulerCronName(params) {
	const uniqueId = params.uniqueId ?? randomUUID();
	if (!params.tag) return `${PLUGIN_CRON_NAME_PREFIX}${params.pluginId}:${params.sessionKey}:${uniqueId}`;
	return `${PLUGIN_CRON_NAME_PREFIX}${params.pluginId}${PLUGIN_CRON_TAG_MARKER}${params.tag}:${params.sessionKey}:${uniqueId}`;
}
function buildPluginSchedulerTagPrefix(params) {
	return `${PLUGIN_CRON_NAME_PREFIX}${params.pluginId}${PLUGIN_CRON_TAG_MARKER}${params.tag}:${params.sessionKey}:`;
}
function isCronRemoveResult(value) {
	return isRecord(value) && typeof value.ok === "boolean" && typeof value.removed === "boolean";
}
async function listAllCronJobsForPluginTagCleanup(cron, query) {
	for (let restart = 0; restart <= PLUGIN_CRON_CLEANUP_MAX_SNAPSHOT_RESTARTS; restart += 1) {
		const jobs = [];
		let offset = 0;
		let snapshotRevision;
		let total;
		let snapshotChanged = false;
		for (let pageNumber = 0; pageNumber < PLUGIN_CRON_CLEANUP_MAX_PAGES; pageNumber += 1) {
			const page = readCanonicalCronListPage(await cron.listPage({
				includeDisabled: true,
				limit: PLUGIN_CRON_CLEANUP_PAGE_SIZE,
				offset,
				query,
				sortBy: "name",
				sortDir: "asc"
			}), PLUGIN_CRON_CLEANUP_PAGE_SIZE);
			if (snapshotRevision !== void 0 && page.snapshotRevision !== snapshotRevision || total !== void 0 && page.total !== total) {
				snapshotChanged = true;
				break;
			}
			snapshotRevision ??= page.snapshotRevision;
			total ??= page.total;
			const nextOffset = resolveCronListPageNextOffset(page, offset);
			jobs.push(...page.jobs);
			if (nextOffset === null) return jobs;
			offset = nextOffset;
		}
		if (!snapshotChanged) throw new Error("cron.list pagination exceeded maximum pages");
	}
	throw new Error("cron.list inventory changed repeatedly during cleanup");
}
async function schedulePluginSessionTurn(params) {
	if (params.origin !== "bundled") return;
	const sessionKey = normalizeOptionalString(params.schedule.sessionKey);
	const message = normalizeOptionalString(params.schedule.message);
	if (!sessionKey || !message) return;
	const cronSchedule = resolveSchedule(params.schedule);
	if (!cronSchedule) return;
	const deliveryMode = params.schedule.deliveryMode;
	const scheduleName = normalizeOptionalString(params.schedule.name);
	const logSchedulingFailure = (reason, name = scheduleName) => {
		log.warn(`plugin session turn scheduling failed (${formatScheduleLogContext({
			pluginId: params.pluginId,
			sessionKey,
			...name ? { name } : {}
		})}): ${reason}`);
	};
	if (deliveryMode !== void 0 && deliveryMode !== "none" && deliveryMode !== "announce") {
		logSchedulingFailure("unsupported deliveryMode");
		return;
	}
	if (cronSchedule.kind === "cron" && params.schedule.deleteAfterRun === true) {
		logSchedulingFailure("deleteAfterRun requires a one-shot schedule");
		return;
	}
	const { tag, invalid: invalidTag } = resolvePluginSessionTurnTag(params.schedule.tag);
	if (invalidTag) {
		logSchedulingFailure("tag contains reserved delimiter \":\"");
		return;
	}
	const cronDeliveryMode = deliveryMode ?? "announce";
	if (params.shouldCommit && !params.shouldCommit()) return;
	if (!params.cron) {
		logSchedulingFailure("cron service unavailable");
		return;
	}
	const cron = params.cron;
	const cronJobName = buildPluginSchedulerCronName({
		pluginId: params.pluginId,
		sessionKey,
		...tag !== void 0 ? { tag } : {},
		...scheduleName ? { uniqueId: scheduleName } : {}
	});
	const cronPayload = {
		kind: "agentTurn",
		message
	};
	let result;
	try {
		result = await cron.add({
			name: cronJobName,
			enabled: true,
			schedule: cronSchedule,
			sessionTarget: `session:${sessionKey}`,
			payload: cronPayload,
			...params.schedule.agentId ? { agentId: params.schedule.agentId } : {},
			deleteAfterRun: params.schedule.deleteAfterRun ?? cronSchedule.kind === "at",
			wakeMode: "now",
			delivery: {
				mode: cronDeliveryMode,
				...cronDeliveryMode === "announce" ? { channel: "last" } : {}
			}
		});
	} catch (error) {
		logSchedulingFailure(formatErrorMessage(error), cronJobName);
		return;
	}
	const jobId = result.id;
	if (!jobId) return;
	if (params.shouldCommit && !params.shouldCommit()) {
		if (!await removeScheduledSessionTurn({
			cron,
			jobId,
			pluginId: params.pluginId,
			sessionKey,
			name: cronJobName
		})) log.warn(`plugin session turn scheduling rollback failed (${formatScheduleLogContext({
			pluginId: params.pluginId,
			sessionKey,
			name: cronJobName,
			jobId
		})}): failed to remove stale scheduled session turn`);
		return;
	}
	return registerPluginSessionSchedulerJob({
		pluginId: params.pluginId,
		pluginName: params.pluginName,
		ownerRegistry: params.ownerRegistry,
		job: {
			id: jobId,
			sessionKey,
			kind: "session-turn",
			cleanup: async () => {
				if (!await removeScheduledSessionTurn({
					cron,
					jobId,
					pluginId: params.pluginId,
					sessionKey,
					name: cronJobName
				})) throw new Error(`failed to remove scheduled session turn: ${jobId}`);
			}
		}
	});
}
async function unschedulePluginSessionTurnsByTag(params) {
	if (params.origin !== "bundled") return {
		removed: 0,
		failed: 0
	};
	const sessionKey = normalizeOptionalString(params.request.sessionKey);
	const { tag, invalid: invalidTag } = resolvePluginSessionTurnTag(params.request.tag);
	if (!sessionKey || !tag || invalidTag) return {
		removed: 0,
		failed: 0
	};
	if (!params.cron) {
		log.warn("plugin session turn untag-list failed: cron service unavailable");
		return {
			removed: 0,
			failed: 1
		};
	}
	const cron = params.cron;
	const namePrefix = buildPluginSchedulerTagPrefix({
		pluginId: params.pluginId,
		tag,
		sessionKey
	});
	let jobs;
	try {
		jobs = await listAllCronJobsForPluginTagCleanup(cron, namePrefix);
	} catch (error) {
		log.warn(`plugin session turn untag-list failed: ${formatErrorMessage(error)}`);
		return {
			removed: 0,
			failed: 1
		};
	}
	const candidates = jobs.filter((job) => job.name.startsWith(namePrefix) && job.sessionTarget === `session:${sessionKey}`);
	let removed = 0;
	let failed = 0;
	for (const job of candidates) {
		const id = job.id.trim();
		if (!id) continue;
		try {
			const result = await cron.remove(id);
			if (isCronRemoveResult(result) && result.ok && result.removed) {
				removed += 1;
				deletePluginSessionSchedulerJob({
					pluginId: params.pluginId,
					jobId: id,
					sessionKey
				});
			} else failed += 1;
		} catch (error) {
			log.warn(`plugin session turn untag-remove failed: id=${id} error=${formatErrorMessage(error)}`);
			failed += 1;
		}
	}
	return {
		removed,
		failed
	};
}
//#endregion
//#region src/plugins/model-catalog-registration.ts
function mergeModelCatalogHooks(source, left, right) {
	if (!left) return right;
	if (!right) return left;
	return async (ctx) => {
		const [leftRows, rightRows] = await Promise.all([left(ctx), right(ctx)]);
		const rows = [...leftRows ?? [], ...rightRows ?? []];
		const mergedRows = [];
		for (const row of rows) mergedRows.push({
			...row,
			source
		});
		return mergedRows.length ? mergedRows : null;
	};
}
/** Creates handlers that register plugin model catalog providers into a registry. */
function createModelCatalogRegistrationHandlers(params) {
	const registerModelCatalogProvider = (record, provider) => {
		const providerId = normalizeOptionalString(provider.provider) ?? "";
		if (!providerId) {
			params.pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: "model catalog provider registration missing provider"
			});
			return;
		}
		if (!provider.kinds || provider.kinds.length === 0) {
			params.pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `model catalog provider "${providerId}" registration missing kinds`
			});
			return;
		}
		const existing = params.registry.modelCatalogProviders.find((entry) => entry.provider.provider === providerId && entry.pluginId !== record.id);
		if (existing) {
			params.pushDiagnostic({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message: `model catalog provider already registered: ${providerId} (${existing.pluginId})`
			});
			return;
		}
		const normalizedKinds = uniqueValues(provider.kinds);
		const samePluginOverlapping = params.registry.modelCatalogProviders.find((entry) => entry.provider.provider === providerId && entry.pluginId === record.id && entry.provider.kinds.some((kind) => normalizedKinds.includes(kind)));
		if (samePluginOverlapping) {
			samePluginOverlapping.provider = {
				...samePluginOverlapping.provider,
				...provider,
				provider: providerId,
				kinds: uniqueValues([...samePluginOverlapping.provider.kinds, ...normalizedKinds]),
				staticCatalog: mergeModelCatalogHooks("static", samePluginOverlapping.provider.staticCatalog, provider.staticCatalog),
				liveCatalog: mergeModelCatalogHooks("live", samePluginOverlapping.provider.liveCatalog, provider.liveCatalog)
			};
			return;
		}
		params.registry.modelCatalogProviders.push({
			pluginId: record.id,
			pluginName: record.name,
			provider: {
				...provider,
				provider: providerId,
				kinds: normalizedKinds
			},
			source: record.source,
			rootDir: record.rootDir
		});
	};
	return { registerModelCatalogProvider };
}
//#endregion
//#region src/plugins/native-session-catalog-registration.ts
function hasReadableNativeCatalogConfig() {
	try {
		const configPath = resolveConfigPath();
		const link = fs.lstatSync(configPath);
		if (!(link.isSymbolicLink() ? fs.statSync(configPath) : link).isFile()) return false;
		fs.accessSync(configPath, fs.constants.R_OK);
		return true;
	} catch {
		return false;
	}
}
function guardCatalogListOperation(initialOperation, assertEnabled) {
	let operation = initialOperation;
	let closed = false;
	return {
		async next() {
			if (closed) throw new Error("Session catalog list operation is closed");
			if (!operation) return {
				done: true,
				hosts: []
			};
			assertEnabled();
			const step = await operation.next();
			assertEnabled();
			return step;
		},
		close() {
			if (closed) return;
			closed = true;
			const closing = operation;
			operation = void 0;
			if (closing) runPluginCleanup(closing, () => closing.close());
		}
	};
}
function createNativeSessionCatalogGate(params) {
	const legacyDefaultAllowed = hasLegacyNativeSessionCatalogDefault(params.pluginId) && hasReadableNativeCatalogConfig();
	const enabled = () => readNativeSessionCatalogPreference(params.getConfig(), params.pluginId) ?? legacyDefaultAllowed;
	const assertEnabled = () => {
		if (!enabled()) throw new Error(`Native conversation discovery is disabled for ${params.pluginId}. Enable it in that plugin's settings.`);
	};
	return {
		catalog(provider) {
			const { createListOperation, continueSession, copyToGatewaySession, archive, openTerminal, checkUpstreamActivity } = provider;
			const guard = (operation) => async (...args) => {
				assertEnabled();
				return operation.apply(provider, args);
			};
			return {
				...provider,
				list: async (query) => enabled() ? provider.list(query) : [],
				...createListOperation ? { createListOperation: (query) => guardCatalogListOperation(enabled() ? createListOperation.call(provider, query) : void 0, assertEnabled) } : {},
				read: async (request) => {
					assertEnabled();
					return provider.read(request);
				},
				...continueSession ? { continueSession: guard(continueSession) } : {},
				...copyToGatewaySession ? { copyToGatewaySession: guard(copyToGatewaySession) } : {},
				...archive ? { archive: guard(archive) } : {},
				...openTerminal ? { openTerminal: guard(openTerminal) } : {},
				...checkUpstreamActivity ? { checkUpstreamActivity: async (probes, policy) => enabled() ? checkUpstreamActivity.call(provider, probes, policy) : [] } : {}
			};
		},
		node(command) {
			const { prepare, watchAvailability } = command;
			return {
				...command,
				isAvailable: (context) => enabled() && (command.isAvailable?.(context) ?? true),
				...prepare ? { prepare: (context) => {
					if (enabled()) return prepare.call(command, context);
				} } : {},
				...watchAvailability ? { watchAvailability: (context, onChange) => {
					if (enabled()) return watchAvailability.call(command, context, onChange);
				} } : {},
				handle: async (...args) => {
					assertEnabled();
					return command.handle(...args);
				}
			};
		}
	};
}
//#endregion
//#region src/plugins/registry-state.ts
/** Decode the public mode once so domain registrars do not repeat string checks. */
function resolvePluginRegistrationCapabilities(mode) {
	return {
		capabilityHandlers: mode === "full" || mode === "discovery" || mode === "tool-discovery",
		setupRuntimeHandlers: mode === "setup-runtime",
		runtimeChannel: mode !== "setup-only" && mode !== "tool-discovery"
	};
}
function normalizeHookTimeoutMs(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return;
	return Math.floor(value);
}
function resolveTypedHookTimeoutMs(params) {
	return normalizeHookTimeoutMs(params.policy?.timeouts?.[params.hookName]) ?? normalizeHookTimeoutMs(params.policy?.timeoutMs) ?? normalizeHookTimeoutMs(params.opts?.timeoutMs);
}
function createRegistration(record, contribution, ownership = "wrap") {
	return {
		pluginId: record.id,
		pluginName: record.name,
		...getPluginInstance(record)?.[ownership](contribution) ?? contribution,
		source: record.source,
		rootDir: record.rootDir
	};
}
function createPluginRegistryState(registryParams) {
	const registry = createEmptyPluginRegistry();
	const nativeCatalogGates = /* @__PURE__ */ new WeakMap();
	const getNativeCatalogGate = (record) => {
		if (!record.nativeSessionCatalog) return;
		let gate = nativeCatalogGates.get(record);
		if (!gate) {
			gate = createNativeSessionCatalogGate({
				pluginId: record.id,
				getConfig: () => registryParams.runtime.config.current()
			});
			nativeCatalogGates.set(record, gate);
		}
		return gate;
	};
	bindPluginRegistryRuntime(registry, registryParams.runtime);
	const coreGatewayMethods = new Set(registryParams.coreGatewayMethodNames);
	for (const name of Object.keys(registryParams.coreGatewayHandlers ?? {})) coreGatewayMethods.add(name);
	registry.coreGatewayMethodNames = Array.from(coreGatewayMethods);
	registry.coreGatewayMethodNames.sort();
	const pushDiagnostic = (diagnostic) => {
		registry.diagnostics.push(diagnostic);
	};
	const reportRegistrationError = (record, message) => {
		pushDiagnostic({
			level: "error",
			pluginId: record.id,
			source: record.source,
			message
		});
	};
	const reportRegistrationWarning = (record, message) => {
		pushDiagnostic({
			level: "warn",
			pluginId: record.id,
			source: record.source,
			message
		});
	};
	const modelCatalogRegistrars = createModelCatalogRegistrationHandlers({
		registry,
		pushDiagnostic
	});
	return {
		registry,
		registryParams,
		getNativeCatalogGate,
		allowProcessHomeSessionCatalogs: registryParams.allowProcessHomeSessionCatalogs ?? true,
		coreGatewayMethods,
		getHostCronService: () => registryParams.hostServices?.cron,
		pluginsWithChannelRegistrationConflict: /* @__PURE__ */ new Set(),
		createRegistration,
		createIdentityRegistration: (record, contribution) => createRegistration(record, contribution, "adopt"),
		pushDiagnostic,
		reportRegistrationError,
		reportRegistrationWarning,
		...modelCatalogRegistrars
	};
}
//#endregion
//#region src/plugins/registry-api.ts
const loadAttachments = createLazyRuntimeModule(() => import("./host-hook-attachments-iciKXPzv.mjs"));
const loadHookState = createLazyRuntimeModule(() => import("./host-hook-state-K3oIoCOO.mjs"));
function resolvePluginPath(input, rootDir) {
	const trimmed = input.trim();
	if (!trimmed || path.isAbsolute(trimmed) || trimmed.startsWith("~")) return resolveUserPath(input);
	return rootDir ? path.resolve(rootDir, trimmed) : resolveUserPath(input);
}
function createPluginApiFactory(state, registrars, runtimeResolver) {
	const { registry, registryParams, getHostCronService, pushDiagnostic } = state;
	const { resolvePluginRuntime, resolveRegisteredChannelRuntime } = runtimeResolver;
	return (record, params) => {
		const registrationMode = params.registrationMode ?? "full";
		const registrationCapabilities = resolvePluginRegistrationCapabilities(registrationMode);
		const shouldCommitWorkflowSideEffect = () => capturePluginLifecycleAuthority(getPluginRecordRegistry(registry, record), record, { registration: true })?.() === true;
		const { registerChannel, ...bound } = Object.fromEntries(Object.entries(registrars).map(([name, register]) => [name, (...args) => Reflect.apply(register, void 0, [record, ...args])]));
		const bindCapabilityRegistrar = (register) => (entry) => {
			register(resolveCapabilityProviderRegistration(entry, registryParams.resolveCapabilityCatalogContext));
		};
		return buildPluginApi({
			id: record.id,
			name: record.name,
			version: record.version,
			description: record.description,
			source: record.source,
			runtimeSource: getPluginRuntimeEntrySource(record),
			rootDir: record.rootDir,
			registrationMode,
			config: params.config,
			pluginConfig: params.pluginConfig,
			runtime: registrationMode === "cli-metadata" ? createUnavailableRuntime(registrationMode, record.id) : resolvePluginRuntime(record),
			logger: {
				info: registryParams.logger.info,
				warn: registryParams.logger.warn,
				error: registryParams.logger.error,
				debug: registryParams.logger.debug
			},
			resolvePath: (input) => resolvePluginPath(input, registrationMode === "cli-metadata" ? void 0 : record.rootDir),
			handlers: {
				...registrationCapabilities.capabilityHandlers ? {
					...bound,
					registerHook: (events, handler, opts) => bound.registerHook(events, handler, opts, params.config, params.pluginConfig),
					registerSpeechProvider: bindCapabilityRegistrar(bound.registerSpeechProvider),
					registerRealtimeTranscriptionProvider: bindCapabilityRegistrar(bound.registerRealtimeTranscriptionProvider),
					registerRealtimeVoiceProvider: bindCapabilityRegistrar(bound.registerRealtimeVoiceProvider),
					registerNodeInvokePolicy: (policy) => bound.registerNodeInvokePolicy(policy, params.pluginConfig),
					onConversationBindingResolved: bound.registerConversationBindingResolvedHandler,
					registerContextEngine: (id, factory) => bound.registerContextEngine(id, factory, registrationMode),
					registerAgentToolResultMiddleware: (handler, options) => {
						bound.registerAgentToolResultMiddleware(handler, options, params.hookPolicy);
					},
					enqueueNextTurnInjection: async (injection) => {
						if (params.hookPolicy?.allowPromptInjection === false) {
							pushDiagnostic({
								level: "warn",
								pluginId: record.id,
								source: record.source,
								message: `next-turn injection blocked by plugins.entries.${record.id}.hooks.allowPromptInjection=false`
							});
							return {
								enqueued: false,
								id: "",
								sessionKey: injection.sessionKey
							};
						}
						const { enqueuePluginNextTurnInjection } = await loadHookState();
						if (registryParams.activateGlobalSideEffects === false || !shouldCommitWorkflowSideEffect()) return {
							enqueued: false,
							id: "",
							sessionKey: injection.sessionKey
						};
						return enqueuePluginNextTurnInjection({
							cfg: registryParams.runtime.config.current(),
							pluginId: record.id,
							pluginName: record.name,
							injection
						});
					},
					emitAgentEvent: (event) => {
						if (registryParams.activateGlobalSideEffects === false) return {
							emitted: false,
							reason: "global side effects disabled"
						};
						if (!shouldCommitWorkflowSideEffect()) return {
							emitted: false,
							reason: "plugin is not loaded"
						};
						return emitPluginAgentEvent({
							pluginId: record.id,
							pluginName: record.name,
							origin: record.origin,
							event
						});
					},
					setRunContext: (patch) => registryParams.activateGlobalSideEffects !== false && shouldCommitWorkflowSideEffect() ? setPluginRunContext({
						pluginId: record.id,
						patch
					}) : false,
					getRunContext: (get) => registryParams.activateGlobalSideEffects !== false && shouldCommitWorkflowSideEffect() ? getPluginRunContext({
						pluginId: record.id,
						get
					}) : void 0,
					clearRunContext: (paramsLocal) => {
						if (registryParams.activateGlobalSideEffects === false || !shouldCommitWorkflowSideEffect()) return;
						clearPluginRunContext({
							pluginId: record.id,
							runId: paramsLocal.runId,
							namespace: paramsLocal.namespace
						});
					},
					sendSessionAttachment: async (attachment) => {
						if (registryParams.activateGlobalSideEffects === false) return {
							ok: false,
							error: "global side effects disabled"
						};
						try {
							const { sendPluginSessionAttachment } = await loadAttachments();
							if (!isPluginRecordActive(registry, record)) return {
								ok: false,
								error: "plugin is not loaded"
							};
							const runtimeConfig = registryParams.runtime.config?.current?.() ?? params.config;
							return await sendPluginSessionAttachment({
								...attachment,
								config: runtimeConfig,
								origin: record.origin
							});
						} catch (error) {
							return {
								ok: false,
								error: `attachment delivery setup failed: ${formatErrorMessage(error)}`
							};
						}
					},
					scheduleSessionTurn: async (schedule) => {
						if (registryParams.activateGlobalSideEffects === false) return;
						await Promise.resolve();
						return schedulePluginSessionTurn({
							pluginId: record.id,
							pluginName: record.name,
							origin: record.origin,
							schedule,
							cron: getHostCronService(),
							shouldCommit: shouldCommitWorkflowSideEffect,
							ownerRegistry: getPluginRecordRegistry(registry, record)
						});
					},
					unscheduleSessionTurnsByTag: async (request) => {
						if (registryParams.activateGlobalSideEffects === false) return {
							removed: 0,
							failed: 0
						};
						await Promise.resolve();
						if (!shouldCommitWorkflowSideEffect()) return {
							removed: 0,
							failed: 0
						};
						return unschedulePluginSessionTurnsByTag({
							pluginId: record.id,
							origin: record.origin,
							cron: getHostCronService(),
							request
						});
					},
					on: (hookName, handler, opts) => registrars.registerTypedHook(record, hookName, handler, opts, params.hookPolicy)
				} : {},
				...registrationCapabilities.setupRuntimeHandlers ? {
					registerHttpRoute: bound.registerHttpRoute,
					registerGatewayMethod: bound.registerGatewayMethod,
					registerSessionCatalog: bound.registerSessionCatalog
				} : {},
				registerCli: bound.registerCli,
				...registrationMode === "cli-metadata" ? {} : { registerChannel: (registration) => registerChannel(registration, registrationMode, registrationCapabilities.runtimeChannel ? () => resolveRegisteredChannelRuntime(record) : void 0) }
			}
		});
	};
}
//#endregion
//#region src/decisions/provider-host.ts
const FAILURE_REASONS = /* @__PURE__ */ new Set([
	"credentials-unavailable",
	"authentication",
	"rate-limited",
	"transport",
	"unsupported-input",
	"invalid-response"
]);
const MAX_CONCURRENT = 4;
const COOLDOWN_MS = 1e4;
const MAX_RETRY_AFTER_MS = 6e4;
var DecisionConsumerClosedError = class extends Error {
	constructor() {
		super("Decision consumer authority closed.");
	}
};
/** Provider-owned admission and health. */
var DecisionProviderHost = class {
	constructor(provider, record) {
		this.provider = provider;
		this.record = record;
		this.retired = false;
		this.pending = /* @__PURE__ */ new Map();
		this.reasons = {};
		this.successCount = 0;
		this.totalLatencyMs = 0;
		this.inputTokens = 0;
		this.outputTokens = 0;
	}
	generation(config) {
		const secretRevision = getActiveSecretsRuntimeSnapshotRevisionState();
		const providerConfig = config.plugins?.entries?.[this.record.id];
		if (!this.health || this.health.secretRevision !== secretRevision || !isDeepStrictEqual(this.health.config, providerConfig)) this.health = {
			id: randomUUID(),
			secretRevision,
			config: providerConfig,
			failures: 0,
			openUntil: 0,
			authFailed: false,
			trial: false
		};
		return this.health;
	}
	unavailable(reason) {
		this.reasons[reason] = (this.reasons[reason] ?? 0) + 1;
		return {
			status: "unavailable",
			reason
		};
	}
	/** Close only capability admission before reversible native reload preparation. */
	pauseForReload(changedConsumerIds = /* @__PURE__ */ new Set()) {
		const token = {};
		this.reloadPause = token;
		for (const [controller, request] of this.pending) controller.abort(request.consumerId !== void 0 && changedConsumerIds.has(request.consumerId) ? new DecisionConsumerClosedError() : "decision-provider-retired");
		const assertResumable = () => {
			const instance = getPluginInstance(this.record);
			if (this.reloadPause !== token || this.retired || this.pending.size > 0 || !instance?.acceptingCalls || instance.owner?.revoked || instance.lifecycle.signal.aborted) throw new Error("Decision reload admission cannot safely resume.");
		};
		return {
			settled: Promise.all([...this.pending.values()].map((request) => request.done)),
			assertResumable,
			resume: () => {
				assertResumable();
				if (this.health) this.health = {
					...this.health,
					id: randomUUID(),
					trial: false
				};
				this.reloadPause = void 0;
			}
		};
	}
	/** Native service stop/disposal is irreversible; rollback must not reopen it. */
	retire() {
		this.retired = true;
		for (const controller of this.pending.keys()) controller.abort("decision-provider-retired");
	}
	cancelConsumer(pluginId) {
		for (const [controller, request] of this.pending) if (request.consumerId === pluginId) controller.abort(new DecisionConsumerClosedError());
	}
	async stop() {
		this.retire();
		await Promise.all([...this.pending.values()].map((request) => request.done));
	}
	ready() {
		try {
			const available = this.provider.isReady?.() ?? true;
			if (typeof available !== "boolean") throw new DecisionContractError();
			return available;
		} catch {
			throw new DecisionContractError();
		}
	}
	inspect(config) {
		const health = this.generation(config);
		const instance = getPluginInstance(this.record);
		const configured = getConfiguredDecisionProviderIds(config).includes(this.provider.id);
		const enabled = config.plugins?.enabled !== false && config.plugins?.entries?.[this.record.id]?.enabled !== false;
		const credentialReady = !this.retired && !this.reloadPause && instance?.acceptingCalls === true && instance.run(() => this.ready());
		return {
			providerId: this.provider.id,
			pluginId: this.record.id,
			configured,
			credentialReady,
			callable: configured && enabled && credentialReady && !health.authFailed && !health.trial && health.openUntil <= performance.now() && this.pending.size < MAX_CONCURRENT,
			runtimeGeneration: health.id,
			recentSuccessAt: health.lastSuccessAt,
			activeRequests: this.pending.size,
			successCount: this.successCount,
			totalLatencyMs: this.totalLatencyMs,
			usage: {
				inputTokens: this.inputTokens,
				outputTokens: this.outputTokens
			},
			reasons: { ...this.reasons }
		};
	}
	async evaluate(submitted, options, model, config, registry, consumerId, isAdmissible) {
		const started = performance.now();
		const facts = { dispatched: false };
		let outcome;
		try {
			outcome = await this.evaluateRequest(submitted, options, model, config, registry, facts, consumerId, isAdmissible);
			return outcome;
		} finally {
			logDecisionEvaluation({
				options,
				providerId: this.provider.id,
				model,
				facts,
				started,
				outcome
			});
		}
	}
	async evaluateRequest(submitted, options, model, config, registry, facts, consumerId, isAdmissible) {
		options.signal.throwIfAborted();
		const instance = getPluginInstance(this.record);
		if (this.retired || this.reloadPause || !instance?.acceptingCalls || instance.owner?.revoked) return this.unavailable("retiring");
		if (decisionDebugEnabled()) {
			facts.questionCount = Object.keys(submitted.questions).length;
			facts.jsonInputBytes = Buffer.byteLength(JSON.stringify(submitted));
		}
		const health = this.generation(config);
		const readConfig = createRuntimeConfigReader(config);
		if (!instance.runInRegistry(registry, () => this.ready())) return this.unavailable("credentials-unavailable");
		if (health.authFailed || health.openUntil > performance.now() || health.trial) return this.unavailable("circuit-open");
		if (this.pending.size >= MAX_CONCURRENT) return this.unavailable("overloaded");
		const halfOpen = health.openUntil > 0;
		if (halfOpen) health.trial = true;
		const controller = new AbortController();
		const signal = AbortSignal.any([options.signal, controller.signal]);
		const started = performance.now();
		const budget = Math.min(options.timeoutMs, 3e4);
		const deadlineMonotonicMs = started + budget;
		const timer = setTimeout(() => controller.abort("decision-deadline"), budget);
		let settle;
		const done = new Promise((resolve) => {
			settle = resolve;
		});
		this.pending.set(controller, {
			consumerId,
			done
		});
		let observedInterruption;
		let admissionError;
		const interrupted = () => {
			options.signal.throwIfAborted();
			if (controller.signal.reason instanceof DecisionConsumerClosedError) throw controller.signal.reason;
			if (admissionError) throw admissionError.error;
			if (this.retired || instance.owner?.revoked || controller.signal.reason === "decision-provider-retired") return this.unavailable("retiring");
			if (controller.signal.reason === "decision-deadline" || performance.now() >= deadlineMonotonicMs) return this.unavailable("deadline");
			if (observedInterruption) return observedInterruption;
			try {
				if (isAdmissible && !isAdmissible()) return this.unavailable("disabled");
			} catch (error) {
				admissionError = { error };
				throw error;
			}
			const currentConfig = readConfig();
			const selection = resolveDecisionModelSetting(currentConfig, options.agentId);
			if (getActiveSecretsRuntimeSnapshotRevisionState() !== health.secretRevision || this.health !== health || currentConfig.plugins?.enabled === false || !isDeepStrictEqual(currentConfig.plugins?.entries?.[this.record.id], health.config) || selection?.provider !== this.provider.id || selection.model !== model) return this.unavailable("retiring");
		};
		try {
			let outcome;
			let questions;
			try {
				questions = structuredClone(submitted.questions);
				outcome = await instance.runInRegistry(registry, () => {
					facts.dispatched = true;
					return this.provider.evaluate(submitted, {
						model,
						...options.agentId ? { agentId: options.agentId } : {},
						signal,
						deadlineMonotonicMs,
						...isAdmissible ? { isAdmissible: () => {
							observedInterruption ??= interrupted();
							return observedInterruption === void 0;
						} } : {}
					});
				}, { joinDisposal: false });
			} catch {
				const stopped = interrupted();
				if (stopped) return stopped;
				throw new DecisionContractError();
			}
			const stopped = interrupted();
			if (stopped) return stopped;
			if (outcome?.status === "ok") {
				const result = outcome.result;
				if (!validateDecisionResult({ questions }, result)) {
					this.fail(health, "invalid-response");
					return this.unavailable("invalid-response");
				}
				health.failures = 0;
				health.openUntil = 0;
				health.lastSuccessAt = Date.now();
				this.successCount++;
				this.inputTokens += result.usage?.inputTokens ?? 0;
				this.outputTokens += result.usage?.outputTokens ?? 0;
				return {
					status: "ok",
					result: structuredClone(result),
					provenance: {
						providerId: this.provider.id,
						rubricVersion: options.rubricVersion,
						runtimeGeneration: health.id
					}
				};
			}
			if (outcome?.status !== "unavailable") throw new DecisionContractError();
			const { reason, retryAfterMs } = outcome;
			if (!FAILURE_REASONS.has(reason)) throw new DecisionContractError();
			this.fail(health, reason, retryAfterMs);
			return this.unavailable(reason);
		} catch (error) {
			options.signal.throwIfAborted();
			if (controller.signal.reason instanceof DecisionConsumerClosedError) throw controller.signal.reason;
			if (admissionError) throw admissionError.error;
			if (error instanceof DecisionContractError) throw error;
			throw new DecisionContractError();
		} finally {
			clearTimeout(timer);
			this.pending.delete(controller);
			if (halfOpen) health.trial = false;
			this.totalLatencyMs += performance.now() - started;
			settle();
		}
	}
	fail(health, reason, retryAfterMs) {
		if (this.health !== health || getActiveSecretsRuntimeSnapshotRevisionState() !== health.secretRevision || this.retired || this.reloadPause) return;
		if (reason === "authentication") {
			health.authFailed = true;
			return;
		}
		if (reason === "unsupported-input" || reason === "credentials-unavailable") return;
		health.failures++;
		const retryAfter = typeof retryAfterMs === "number" && Number.isFinite(retryAfterMs) ? Math.max(0, Math.min(retryAfterMs, MAX_RETRY_AFTER_MS)) : 0;
		if (health.failures >= 3 || retryAfter > 0) health.openUntil = performance.now() + Math.max(COOLDOWN_MS, retryAfter);
	}
};
//#endregion
//#region src/plugins/registry-registrars-capabilities.ts
function createCapabilityRegistrars(state) {
	const { registry, reportRegistrationError, reportRegistrationWarning } = state;
	const registerDecisionProvider = (record, provider) => {
		const id = normalizeOptionalString(provider?.id);
		if (!id || id !== provider.id || id.includes("/") || provider.contractVersion !== 1 || typeof provider.evaluate !== "function" || provider.isReady !== void 0 && typeof provider.isReady !== "function") {
			reportRegistrationError(record, "invalid version 1 decision provider contract");
			return;
		}
		if (!record.contracts?.decisionProviders?.includes(id)) {
			reportRegistrationError(record, "decision provider must declare contracts.decisionProviders ownership");
			return;
		}
		if (registry.decisionProviders.some((entry) => entry.host.provider.id === id)) {
			reportRegistrationError(record, `decision provider already registered: ${id}`);
			return;
		}
		const host = new DecisionProviderHost(provider, record);
		registry.decisionProviders.push({
			pluginId: record.id,
			host
		});
		record.services.push(`decisions:${id}`);
		getPluginInstance(record)?.lifecycle.onDispose(() => host.stop());
		registry.services.push({
			pluginId: record.id,
			id: `decisions:${id}`,
			origin: record.origin,
			source: record.source,
			service: {
				id: `decisions:${id}`,
				start() {},
				stop: () => host.stop()
			}
		});
	};
	const registerInteractiveHandler = (record, registration) => {
		const result = registerPluginInteractiveHandlerInRegistry(registry, record.id, registration, {
			pluginName: record.name,
			pluginRoot: record.rootDir
		});
		if (!result.ok) reportRegistrationWarning(record, result.error ?? "interactive handler registration failed");
	};
	const registerContextEngine = (record, id, factory, registrationMode) => {
		const normalizedId = normalizeOptionalString(id) ?? "";
		if (!normalizedId) {
			reportRegistrationError(record, "context engine registration missing id");
			return;
		}
		if (typeof factory !== "function") {
			reportRegistrationError(record, `context engine "${normalizedId}" registration missing factory`);
			return;
		}
		if (normalizedId === defaultSlotIdForKey("contextEngine")) {
			reportRegistrationError(record, `context engine id reserved by core: ${normalizedId}`);
			return;
		}
		getPluginInstance(record)?.admitFactory(factory);
		const result = registerContextEngineInRegistry(registry, normalizedId, factory, `plugin:${record.id}`, {
			allowSameOwnerRefresh: true,
			lifecycle: registrationMode === "full" ? "runtime" : "readOnlyDiscovery"
		});
		if (!result.ok) {
			reportRegistrationError(record, `context engine already registered: ${normalizedId} (${result.existingOwner})`);
			return;
		}
		if (!record.contextEngineIds?.includes(normalizedId)) record.contextEngineIds = [...record.contextEngineIds ?? [], normalizedId];
	};
	const registerCompactionProvider = (record, provider) => {
		const id = normalizeOptionalString(provider?.id);
		if (!id) {
			reportRegistrationError(record, "compaction provider registration missing id");
			return;
		}
		if (typeof provider?.summarize !== "function") {
			reportRegistrationError(record, `compaction provider "${id}" registration missing summarize`);
			return;
		}
		const existing = registry.compactionProviders.find((entry) => entry.provider.id === id);
		if (existing) {
			const ownerDetail = existing.ownerPluginId ? ` (owner: ${existing.ownerPluginId})` : "";
			reportRegistrationError(record, `compaction provider already registered: ${id}${ownerDetail}`);
			return;
		}
		registry.compactionProviders.push({
			provider,
			ownerPluginId: record.id
		});
	};
	return {
		registerDecisionProvider,
		registerInteractiveHandler,
		registerContextEngine,
		registerCompactionProvider
	};
}
//#endregion
//#region src/plugins/registry-control-ui-policy.ts
const reservedTabSlugs = /* @__PURE__ */ new Set([
	"api",
	"plugins",
	"plugin",
	"focus",
	"approve",
	"ask",
	"share",
	"j",
	"v1",
	"ui",
	"mcp-app-sandbox",
	"__openclaw__",
	"__openclaw",
	"sessions",
	"agent",
	"agents"
]);
function isReservedControlUiTabSlug(slug) {
	return reservedTabSlugs.has(slug) || classifyGatewayProbePath(`/${slug}`) !== "outside";
}
function validateControlUiNativeRoutePlacement(params) {
	if (!params.placement?.startsWith("route:")) return true;
	if (params.record.origin === "bundled" && params.placement === `route:${params.record.id}`) return true;
	params.pushDiagnostic({
		level: "error",
		pluginId: params.record.id,
		source: params.record.source,
		message: `native Control UI route placement must be owned by its bundled plugin: ${params.placement}`
	});
	return false;
}
//#endregion
//#region src/plugins/registry-control-ui.ts
/** Copy bounded plugin metadata before it becomes a browser routing contract. */
function normalizeLinkReaderMetadata(value) {
	if (!isRecord(value) || !Array.isArray(value.hosts) || value.hosts.length === 0 || value.hosts.length > 16) return;
	const hostPattern = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/u;
	if (!value.hosts.every((host) => typeof host === "string" && host.length <= 253 && hostPattern.test(host))) return;
	const pathPattern = value.pathPattern;
	if (typeof pathPattern !== "string" || pathPattern.length > 1024 || !pathPattern.startsWith("^") || !pathPattern.endsWith("$")) return;
	try {
		RegExp(pathPattern, "u");
	} catch {
		return;
	}
	const methodPattern = /^[a-zA-Z][a-zA-Z0-9_.-]{0,127}$/u;
	const detailMethod = value.detailMethod;
	const previewMethod = value.previewMethod;
	const imageMethod = value.imageMethod;
	if (typeof detailMethod !== "string" || !methodPattern.test(detailMethod) || previewMethod !== void 0 && (typeof previewMethod !== "string" || !methodPattern.test(previewMethod)) || imageMethod !== void 0 && (typeof imageMethod !== "string" || !methodPattern.test(imageMethod))) return;
	return {
		hosts: [...new Set(value.hosts)],
		pathPattern,
		detailMethod,
		...previewMethod !== void 0 ? { previewMethod } : {},
		...imageMethod !== void 0 ? { imageMethod } : {}
	};
}
const controlUiSurfaces = /* @__PURE__ */ new Set([
	"session",
	"tool",
	"run",
	"settings",
	"tab",
	"widget",
	"link-reader"
]);
function createControlUiRegistrar(state) {
	const { registry, createIdentityRegistration, pushDiagnostic, reportRegistrationError } = state;
	return (record, descriptor) => {
		const legacyDescriptor = descriptor;
		const id = normalizeHostHookString(descriptor.id);
		const label = normalizeHostHookString(descriptor.label ?? legacyDescriptor.name);
		const description = normalizeOptionalHostHookString(descriptor.description);
		const placement = normalizeOptionalHostHookString(descriptor.placement);
		const slug = descriptor.slug;
		const requiredScopes = normalizeHostHookStringList(descriptor.requiredScopes);
		const surface = typeof descriptor.surface === "string" ? descriptor.surface : "session";
		if (!id || !label || !controlUiSurfaces.has(surface) || description === "" || placement === "" || requiredScopes === null) {
			reportRegistrationError(record, "control UI descriptor registration requires id, surface, label, and valid optional fields");
			return;
		}
		if (requiredScopes !== void 0) {
			const unknownScope = requiredScopes.find((scope) => !isOperatorScope(scope));
			if (unknownScope !== void 0) {
				reportRegistrationError(record, `control UI descriptor requiredScopes contains unknown operator scope: ${unknownScope}`);
				return;
			}
		}
		if (!validateControlUiNativeRoutePlacement({
			record,
			placement,
			pushDiagnostic
		})) return;
		if (slug !== void 0) {
			if (typeof slug !== "string" || slug.trim() !== slug || slug.length > 64 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || surface !== "tab" || placement?.startsWith("route:") || isReservedControlUiTabSlug(slug)) {
				reportRegistrationError(record, `control UI descriptor slug requires an unreserved lowercase alphanumeric/hyphen segment of at most 64 characters on a tab without native route placement: ${id}`);
				return;
			}
			const owner = registry.controlUiDescriptors.find((entry) => entry.descriptor.slug === slug);
			if (owner) {
				reportRegistrationError(record, `control UI tab slug already registered by ${owner.pluginId}: ${slug}`);
				return;
			}
		}
		if (descriptor.schema !== void 0 && !isPluginJsonValue(descriptor.schema)) {
			reportRegistrationError(record, `control UI descriptor schema must be JSON-compatible: ${id}`);
			return;
		}
		if (registry.controlUiDescriptors.find((entry) => entry.pluginId === record.id && entry.descriptor.id === id)) {
			reportRegistrationError(record, `control UI descriptor already registered: ${id}`);
			return;
		}
		const linkReader = surface === "link-reader" ? normalizeLinkReaderMetadata(descriptor.linkReader) : void 0;
		if (surface === "link-reader" && !linkReader || surface !== "link-reader" && descriptor.linkReader !== void 0) {
			reportRegistrationError(record, "link-reader descriptors require bounded exact hosts, an anchored pathPattern, and method names");
			return;
		}
		const icon = normalizeOptionalHostHookString(descriptor.icon);
		const tabPath = normalizeOptionalHostHookString(descriptor.path);
		if (!(tabPath === void 0 || tabPath.startsWith("/") && !tabPath.startsWith("//") && !tabPath.startsWith("/\\"))) {
			reportRegistrationError(record, `control UI descriptor path must be a gateway-local absolute path: ${id}`);
			return;
		}
		const group = descriptor.group === "control" || descriptor.group === "agent" ? descriptor.group : void 0;
		const order = typeof descriptor.order === "number" && Number.isFinite(descriptor.order) ? descriptor.order : void 0;
		const capability = surface === "tab" ? "page" : surface === "widget" ? "widget" : surface === "link-reader" ? "link-reader" : void 0;
		if (capability && record.uiCapabilities && !record.uiCapabilities.includes(capability)) state.reportRegistrationWarning(record, `Registered UI capability "${capability}" is missing from uiCapabilities in openclaw.plugin.json.`);
		registry.controlUiDescriptors.push(createIdentityRegistration(record, { descriptor: {
			...descriptor,
			id,
			surface,
			...linkReader ? { linkReader } : {},
			label,
			...description !== void 0 ? { description } : {},
			...placement !== void 0 ? { placement } : {},
			...requiredScopes !== void 0 ? { requiredScopes: requiredScopes.filter(isOperatorScope) } : {},
			icon,
			path: tabPath,
			group,
			order
		} }));
	};
}
//#endregion
//#region src/plugins/tool-contracts.ts
function normalizePluginToolContractNames(contracts) {
	return normalizePluginToolNames(contracts?.tools);
}
function normalizePluginToolNames(names) {
	return [...new Set(Array.from(names ?? [], (name) => name.trim()).filter(Boolean))];
}
function findUndeclaredPluginToolNames(params) {
	const declared = new Set(normalizePluginToolNames(params.declaredNames));
	return normalizePluginToolNames(params.toolNames).filter((name) => !declared.has(name));
}
//#endregion
//#region src/plugins/registry-registrars-host.ts
function createHostRegistrars(state) {
	const { registry, createRegistration, reportRegistrationError } = state;
	const validateSessionActionSchema = (record, id, schema) => {
		if (schema === void 0) return true;
		if (!isPluginJsonValue(schema)) {
			reportRegistrationError(record, `session action schema must be JSON-compatible: ${id}`);
			return false;
		}
		if (typeof schema !== "boolean" && (!schema || typeof schema !== "object" || Array.isArray(schema))) {
			reportRegistrationError(record, `session action schema must be a JSON schema object or boolean: ${id}`);
			return false;
		}
		try {
			validateJsonSchemaValue({
				schema,
				cacheKey: `plugin-session-action-registration:${record.id}:${id}`,
				value: void 0
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			reportRegistrationError(record, `session action schema is not valid JSON Schema: ${id}: ${message}`);
			return false;
		}
		return true;
	};
	const registerSessionExtension = (record, extension) => {
		const namespace = normalizeHostHookString(extension.namespace);
		const description = normalizeHostHookString(extension.description);
		const project = extension.project;
		let normalizedSessionEntrySlotKey;
		let invalidMessage;
		if (!namespace || !description) invalidMessage = "session extension registration requires namespace and description";
		else if (project !== void 0 && typeof project !== "function") invalidMessage = "session extension projector must be a function";
		else if (project?.constructor?.name === "AsyncFunction") invalidMessage = "session extension projector must be synchronous";
		else if (extension.cleanup !== void 0 && typeof extension.cleanup !== "function") invalidMessage = "session extension cleanup must be a function";
		else if (extension.sessionEntrySlotKey !== void 0) {
			const slotKey = normalizeSessionEntrySlotKey(extension.sessionEntrySlotKey);
			if (!slotKey.ok) invalidMessage = slotKey.error;
			else normalizedSessionEntrySlotKey = slotKey.key;
		}
		if (invalidMessage) {
			reportRegistrationError(record, invalidMessage);
			return;
		}
		if (registry.sessionExtensions.find((entry) => entry.pluginId === record.id && entry.extension.namespace === namespace)) {
			reportRegistrationError(record, `session extension already registered: ${namespace}`);
			return;
		}
		if (normalizedSessionEntrySlotKey) {
			if (registry.sessionExtensions.find((entry) => entry.extension.sessionEntrySlotKey === normalizedSessionEntrySlotKey)) {
				reportRegistrationError(record, `sessionEntrySlotKey already registered: ${normalizedSessionEntrySlotKey}`);
				return;
			}
		}
		registry.sessionExtensions.push(createRegistration(record, { extension: {
			...extension,
			namespace,
			description,
			...normalizedSessionEntrySlotKey ? { sessionEntrySlotKey: normalizedSessionEntrySlotKey } : {}
		} }));
	};
	const registerTrustedToolPolicy = (record, policy) => {
		if (!policy || typeof policy !== "object") {
			reportRegistrationError(record, "trusted tool policy registration requires id, description, and evaluate()");
			return;
		}
		const id = normalizeHostHookString(policy.id);
		const description = normalizeHostHookString(policy.description);
		const matcher = normalizePluginToolMatcher(policy.matcher);
		if (!id || !description || typeof policy.evaluate !== "function") {
			reportRegistrationError(record, "trusted tool policy registration requires id, description, and evaluate()");
			return;
		}
		if (record.origin !== "bundled" && !(record.contracts?.trustedToolPolicies ?? []).includes(id)) {
			reportRegistrationError(record, `plugin must declare contracts.trustedToolPolicies for: ${id}`);
			return;
		}
		if (record.origin !== "bundled" && !(record.enabled && record.explicitlyEnabled === true)) {
			reportRegistrationError(record, `plugin must be explicitly enabled to register trusted tool policy: ${id}`);
			return;
		}
		const policies = registry.trustedToolPolicies;
		const existing = policies.find((entry) => entry.pluginId === record.id && entry.policy.id === id);
		if (existing) {
			reportRegistrationError(record, `trusted tool policy already registered: ${id} (${existing.pluginId})`);
			return;
		}
		const registration = createRegistration(record, {
			policy: {
				...policy,
				id,
				description,
				...matcher ? { matcher } : {}
			},
			origin: record.origin
		});
		if (record.origin === "bundled") {
			const firstInstalledPolicyIndex = policies.findIndex((entry) => entry.origin !== "bundled");
			if (firstInstalledPolicyIndex === -1) policies.push(registration);
			else policies.splice(firstInstalledPolicyIndex, 0, registration);
			return;
		}
		policies.push(registration);
	};
	const registerToolMetadata = (record, metadata) => {
		const toolName = normalizeHostHookString(metadata.toolName);
		if (!toolName) {
			reportRegistrationError(record, "tool metadata registration missing toolName");
			return;
		}
		const undeclared = findUndeclaredPluginToolNames({
			declaredNames: normalizePluginToolContractNames(record.contracts),
			toolNames: [toolName]
		});
		if (undeclared.length > 0) {
			reportRegistrationError(record, `plugin must declare contracts.tools for tool metadata: ${undeclared.join(", ")}`);
			return;
		}
		const existing = registry.toolMetadata.find((entry) => entry.pluginId === record.id && entry.metadata.toolName === toolName);
		if (existing) {
			reportRegistrationError(record, `tool metadata already registered: ${toolName} (${existing.pluginId})`);
			return;
		}
		const displayName = normalizeOptionalHostHookString(metadata.displayName);
		const description = normalizeOptionalHostHookString(metadata.description);
		const tags = normalizeHostHookStringList(metadata.tags);
		if (displayName === "" || description === "" || tags === null || metadata.risk !== void 0 && ![
			"low",
			"medium",
			"high"
		].includes(metadata.risk)) {
			reportRegistrationError(record, `tool metadata registration has invalid metadata: ${toolName}`);
			return;
		}
		registry.toolMetadata.push(createRegistration(record, { metadata: {
			...metadata,
			toolName,
			...displayName !== void 0 ? { displayName } : {},
			...description !== void 0 ? { description } : {},
			...tags !== void 0 ? { tags } : {}
		} }));
	};
	const registerControlUiDescriptor = createControlUiRegistrar(state);
	const registerRuntimeLifecycle = (record, lifecycle) => {
		const id = normalizePluginHostHookId(lifecycle.id);
		if (!id) {
			reportRegistrationError(record, "runtime lifecycle registration missing id");
			return;
		}
		if (registry.runtimeLifecycles.find((entry) => entry.pluginId === record.id && entry.lifecycle.id === id)) {
			reportRegistrationError(record, `runtime lifecycle already registered: ${id}`);
			return;
		}
		if (lifecycle.cleanup !== void 0 && typeof lifecycle.cleanup !== "function") {
			reportRegistrationError(record, `runtime lifecycle cleanup must be a function: ${id}`);
			return;
		}
		const inspection = getPluginRegistryInspectionResources(registry);
		const dispose = inspection ? lifecycle.dispose : void 0;
		if (dispose !== void 0 && typeof dispose !== "function") {
			reportRegistrationError(record, `runtime lifecycle dispose must be a function: ${id}`);
			return;
		}
		if (inspection && dispose) {
			const instance = getPluginInstance(record);
			inspection.register(record.id, {
				id,
				dispose: () => instance ? instance.runCleanup(() => dispose.call(lifecycle)) : dispose.call(lifecycle)
			});
		}
		registry.runtimeLifecycles.push(createRegistration(record, { lifecycle: {
			...lifecycle,
			id
		} }));
	};
	const registerAgentEventSubscription = (record, subscription) => {
		const id = normalizePluginHostHookId(subscription.id);
		if (!id || typeof subscription.handle !== "function") {
			reportRegistrationError(record, "agent event subscription registration requires id and handle");
			return;
		}
		const streams = normalizeHostHookStringList(subscription.streams);
		if (streams === null) {
			reportRegistrationError(record, `agent event subscription streams must be an array of strings: ${id}`);
			return;
		}
		if (registry.agentEventSubscriptions.find((entry) => entry.pluginId === record.id && entry.subscription.id === id)) {
			reportRegistrationError(record, `agent event subscription already registered: ${id}`);
			return;
		}
		registry.agentEventSubscriptions.push(createRegistration(record, { subscription: {
			...subscription,
			id,
			...streams !== void 0 ? { streams } : {}
		} }));
	};
	const registerSessionSchedulerJob = (record, job) => {
		const owner = getPluginRecordRegistry(registry, record);
		const active = isPluginRecordActive(registry, record);
		if (!active && isPluginRegistryRetired(registry)) return;
		const jobId = normalizeHostHookString(job.id);
		const sessionKey = normalizeHostHookString(job.sessionKey);
		const kind = normalizeHostHookString(job.kind);
		if (jobId && owner.sessionSchedulerJobs.some((entry) => entry.pluginId === record.id && entry.job.id === jobId)) {
			reportRegistrationError(record, `session scheduler job already registered: ${jobId}`);
			return;
		}
		if (!jobId || !sessionKey || !kind) {
			reportRegistrationError(record, "session scheduler job registration requires unique id, sessionKey, and kind");
			return;
		}
		if (job.cleanup !== void 0 && typeof job.cleanup !== "function") {
			reportRegistrationError(record, `session scheduler job cleanup must be a function: ${jobId}`);
			return;
		}
		owner.sessionSchedulerJobs.push(createRegistration(record, { job: {
			...job,
			id: jobId,
			sessionKey,
			kind
		} }));
		if (active) publishPluginSessionSchedulerJobs(owner);
		return {
			id: jobId,
			pluginId: record.id,
			sessionKey,
			kind
		};
	};
	const registerSessionAction = (record, action) => {
		const id = normalizeHostHookString(action.id);
		const description = normalizeOptionalHostHookString(action.description);
		const requiredScopes = normalizeHostHookStringList(action.requiredScopes);
		if (!id || description === "" || requiredScopes === null || typeof action.handler !== "function") {
			reportRegistrationError(record, "session action registration requires id, handler, and valid optional fields");
			return;
		}
		if (requiredScopes !== void 0) {
			const unknownScope = requiredScopes.find((scope) => !isOperatorScope(scope));
			if (unknownScope !== void 0) {
				reportRegistrationError(record, `session action requiredScopes contains unknown operator scope: ${unknownScope}`);
				return;
			}
		}
		if (!validateSessionActionSchema(record, id, action.schema)) return;
		if (registry.sessionActions.find((entry) => entry.pluginId === record.id && entry.action.id === id)) {
			reportRegistrationError(record, `session action already registered: ${id}`);
			return;
		}
		registry.sessionActions.push(createRegistration(record, { action: {
			...action,
			id,
			...description !== void 0 ? { description } : {},
			...requiredScopes !== void 0 ? { requiredScopes } : {}
		} }));
	};
	const registerConversationBindingResolvedHandler = (record, handler) => {
		registry.conversationBindingResolvedHandlers.push(createRegistration(record, {
			pluginRoot: record.rootDir,
			handler
		}));
	};
	return {
		registerSessionExtension,
		registerTrustedToolPolicy,
		registerToolMetadata,
		registerControlUiDescriptor,
		registerBoardWidgetContentKind: createPluginBoardWidgetContentKindRegistrar(registry),
		registerRuntimeLifecycle,
		registerAgentEventSubscription,
		registerSessionSchedulerJob,
		registerSessionAction,
		registerConversationBindingResolvedHandler
	};
}
//#endregion
//#region src/plugins/registry-registrars-memory.ts
function createMemoryRegistrars(state) {
	const { registry, reportRegistrationError, reportRegistrationWarning } = state;
	const registerMemoryCapability = (record, capability) => {
		if (!hasKind(record.kind, "memory")) throw new Error("only memory plugins can register a memory capability");
		if (Array.isArray(record.kind) && record.kind.length > 1 && !record.memorySlotSelected) {
			reportRegistrationWarning(record, "dual-kind plugin not selected for memory slot; skipping memory capability registration");
			return;
		}
		const memorySlotSelected = record.memorySlotSelected === true;
		if (!memorySlotSelected && (capability.runtime !== void 0 || capability.providerRuntime !== void 0 || capability.recallToolNames !== void 0 || capability.deterministicRecallToolName !== void 0 || capability.supportsPrivateTranscriptRecall !== void 0)) reportRegistrationWarning(record, "memory plugin not selected for the memory slot; skipping its indexing runtime and recall registration (consolidation lifecycle preserved)");
		const { runtime: _droppedRuntime, providerRuntime: _droppedProviderRuntime, recallToolNames: _droppedRecallToolNames, deterministicRecallToolName: _droppedRecallToolName, supportsPrivateTranscriptRecall: _droppedPrivateRecall, ...consolidationCapability } = capability;
		if (memorySlotSelected && capability.runtime) getPluginInstance(record)?.admitFactory(capability.runtime.getMemorySearchManager);
		registry.memoryCapabilities.push({
			pluginId: record.id,
			capability: memorySlotSelected ? capability : consolidationCapability,
			memorySlotSelected
		});
	};
	const registerMemoryPromptSupplement = (record, builder) => {
		if (typeof builder !== "function") {
			reportRegistrationError(record, "memory prompt supplement registration missing builder");
			return;
		}
		registry.memoryPromptSupplements = registry.memoryPromptSupplements.filter((entry) => entry.pluginId !== record.id);
		registry.memoryPromptSupplements.push({
			pluginId: record.id,
			builder
		});
	};
	const registerMemoryPromptPreparation = (record, prepare) => {
		if (typeof prepare !== "function") {
			reportRegistrationError(record, "memory prompt preparation registration missing prepare function");
			return;
		}
		registry.memoryPromptPreparations = registry.memoryPromptPreparations.filter((entry) => entry.pluginId !== record.id);
		registry.memoryPromptPreparations.push({
			pluginId: record.id,
			prepare
		});
	};
	const registerMemoryCorpusSupplement = (record, supplement) => {
		registry.memoryCorpusSupplements = registry.memoryCorpusSupplements.filter((entry) => entry.pluginId !== record.id);
		registry.memoryCorpusSupplements.push({
			pluginId: record.id,
			supplement
		});
	};
	return {
		registerMemoryCapability,
		registerMemoryPromptSupplement,
		registerMemoryPromptPreparation,
		registerMemoryCorpusSupplement
	};
}
//#endregion
//#region src/plugins/channel-validation.ts
function resolveKnownChannelMeta(id) {
	return listChatChannels().find((meta) => meta?.id === id) ?? resolveGeneratedBundledChannelMeta(id) ?? resolveOfficialExternalChannelMeta(id);
}
function resolveOfficialExternalChannelMeta(id) {
	const normalizedId = id.toLowerCase();
	const channel = listOfficialExternalChannelCatalogEntries().map((entry) => getOfficialExternalPluginCatalogManifest(entry)?.channel).find((candidate) => candidate?.id?.trim().toLowerCase() === normalizedId);
	return channel?.aliases?.length ? { aliases: channel.aliases } : void 0;
}
function resolveGeneratedBundledChannelMeta(id) {
	const channel = GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.find((entry) => entry.channelId === id && entry.configurable !== false);
	const label = normalizeOptionalString(channel?.label);
	if (!channel || !label) return;
	return {
		id,
		label,
		selectionLabel: label,
		docsPath: `/channels/${id}`,
		blurb: normalizeOptionalString(channel.description) ?? ""
	};
}
function collectMissingChannelMetaFields(meta) {
	const missing = [
		"label",
		"selectionLabel",
		"docsPath"
	].filter((key) => !normalizeOptionalString(meta?.[key]));
	if (typeof meta?.blurb !== "string") missing.push("blurb");
	return missing;
}
const CHANNEL_CAPABILITY_CHAT_TYPES = /* @__PURE__ */ new Set([
	"direct",
	"group",
	"channel",
	"thread"
]);
/** Validates and normalizes a channel plugin registration before runtime catalog insertion. */
function normalizeRegisteredChannelPlugin(params) {
	const diagnose = (level, message) => params.pushDiagnostic({
		level,
		pluginId: params.pluginId,
		source: params.source,
		message
	});
	const id = normalizeOptionalString(params.plugin?.id) ?? normalizeStringifiedOptionalString(params.plugin?.id) ?? "";
	if (!id) {
		diagnose("error", "channel registration missing id");
		return null;
	}
	const chatTypes = params.plugin.capabilities?.chatTypes;
	if (!Array.isArray(chatTypes) || chatTypes.length === 0 || chatTypes.some((chatType) => !CHANNEL_CAPABILITY_CHAT_TYPES.has(chatType))) {
		diagnose("error", `channel "${id}" registration missing or invalid required capabilities.chatTypes`);
		return null;
	}
	if (typeof params.plugin.config?.listAccountIds !== "function" || typeof params.plugin.config?.resolveAccount !== "function") {
		diagnose("error", `channel "${id}" registration missing required config helpers`);
		return null;
	}
	const rawMeta = params.plugin.meta;
	const rawMetaId = normalizeOptionalString(rawMeta?.id);
	if (rawMetaId && rawMetaId !== id) diagnose("warn", `channel "${id}" meta.id mismatch ("${rawMetaId}"); using registered channel id`);
	const missingFields = collectMissingChannelMetaFields(rawMeta);
	if (missingFields.length > 0) diagnose("warn", `channel "${id}" registered incomplete metadata; filled missing ${missingFields.join(", ")}`);
	return {
		...params.plugin,
		id,
		meta: normalizeChannelMeta({
			id,
			meta: rawMeta,
			existing: resolveKnownChannelMeta(id)
		})
	};
}
//#endregion
//#region src/plugins/registry-registrars-network.ts
const GATEWAY_METHOD_DISPATCH_CONTRACT = "authenticated-request";
function adaptPluginGatewayMethodHandler(handler, mayDispatch) {
	return async (opts) => {
		let responded = false;
		const respond = (ok, payload, error, meta) => {
			responded = true;
			opts.respond(ok, payload, error, meta);
		};
		const scope = getPluginRuntimeGatewayRequestScope();
		const invoke = () => handler({
			...opts,
			respond
		});
		const result = scope ? await withPluginRuntimeGatewayRequestScope({
			...scope,
			gatewayMethodDispatchAllowed: mayDispatch && scope.client != null
		}, invoke) : await invoke();
		if (!responded && result !== void 0) respond(true, result);
	};
}
function createNetworkRegistrars(state) {
	const { registry, createRegistration, coreGatewayMethods, pluginsWithChannelRegistrationConflict, pushDiagnostic, reportRegistrationError, reportRegistrationWarning } = state;
	let reportedLegacyCatalogSkip = false;
	const registerGatewayMethod = (record, method, handler, opts) => {
		const trimmed = method.trim();
		if (!trimmed) return;
		if (coreGatewayMethods.has(trimmed) || registry.gatewayHandlers[trimmed]) {
			reportRegistrationError(record, `gateway method already registered: ${trimmed}`);
			return;
		}
		const wrappedHandler = adaptPluginGatewayMethodHandler(handler, canDispatchGatewayMethods(record));
		registry.gatewayHandlers[trimmed] = wrappedHandler;
		const normalizedScope = normalizePluginGatewayMethodScope(trimmed, opts?.scope);
		if (normalizedScope.coercedToReservedAdmin) reportRegistrationWarning(record, `gateway method scope coerced to operator.admin for reserved core namespace: ${trimmed}`);
		registry.gatewayMethodDescriptors.push(createPluginGatewayMethodDescriptor({
			pluginId: record.id,
			name: trimmed,
			handler: wrappedHandler,
			scope: normalizedScope.scope,
			...opts?.profileAccess ? { profileAccess: opts.profileAccess } : {},
			...opts?.sessionAccess ? { sessionAccess: opts.sessionAccess } : {}
		}));
	};
	const registerSessionCatalog = (record, provider) => {
		const id = provider.id.trim();
		const label = provider.label.trim();
		if (!id || !label) {
			reportRegistrationError(record, "session catalog requires non-empty id and label");
			return;
		}
		if (!state.allowProcessHomeSessionCatalogs && provider.supportsProcessHomeIsolation !== true) {
			if (!reportedLegacyCatalogSkip) {
				reportedLegacyCatalogSkip = true;
				reportRegistrationWarning(record, "external session catalog skipped in isolated state: provider must declare supportsProcessHomeIsolation");
			}
			return;
		}
		const existing = registry.sessionCatalogs.find((entry) => entry.provider.id === id);
		if (existing) {
			reportRegistrationError(record, `session catalog already registered: ${id} (${existing.pluginId})`);
			return;
		}
		if (provider.continueSession) getPluginInstance(record)?.admitFactory(provider.continueSession);
		const normalizedProvider = {
			...provider,
			id,
			label
		};
		registry.sessionCatalogs.push(createRegistration(record, { provider: state.getNativeCatalogGate(record)?.catalog(normalizedProvider) ?? normalizedProvider }));
	};
	const describeHttpRouteOwner = (entry) => {
		return `${normalizeOptionalString(entry.pluginId) || "unknown-plugin"} (${normalizeOptionalString(entry.source) || "unknown-source"})`;
	};
	const canDispatchGatewayMethods = (record) => (record.contracts?.gatewayMethodDispatch ?? []).includes(GATEWAY_METHOD_DISPATCH_CONTRACT);
	const registerHttpRoute = (record, params) => {
		const normalizedPath = normalizePluginHttpPath(params.path);
		if (!normalizedPath) {
			reportRegistrationWarning(record, "http route registration missing path");
			return;
		}
		if (params.auth !== "gateway" && params.auth !== "plugin") {
			reportRegistrationError(record, `http route registration missing or invalid auth: ${normalizedPath}`);
			return;
		}
		const match = params.match ?? "exact";
		const { authOverlap, canonicalMatches } = findPluginHttpRouteRegistrationConflicts([...new Set(getPluginHttpRouteViews(registry, record.id).flatMap((view) => view.httpRoutes))], {
			path: normalizedPath,
			match,
			auth: params.auth
		});
		if (authOverlap) {
			reportRegistrationError(record, `http route overlap rejected: ${normalizedPath} (${match}, ${params.auth}) overlaps ${authOverlap.path} (${authOverlap.match}, ${authOverlap.auth}) owned by ${describeHttpRouteOwner(authOverlap)}`);
			return;
		}
		const registration = {
			pluginId: record.id,
			path: normalizedPath,
			handler: params.handler,
			...params.handleUpgrade ? { handleUpgrade: params.handleUpgrade } : {},
			auth: params.auth,
			match,
			...params.gatewayRuntimeScopeSurface ? { gatewayRuntimeScopeSurface: params.gatewayRuntimeScopeSurface } : {},
			...canDispatchGatewayMethods(record) ? { gatewayMethodDispatchAllowed: true } : {},
			...params.nodeCapability ? { nodeCapability: { ...params.nodeCapability } } : {},
			source: record.source
		};
		const foreignOwner = canonicalMatches.find((route) => route.pluginId !== record.id);
		if (foreignOwner) {
			reportRegistrationError(record, params.replaceExisting ? `http route replacement rejected: ${normalizedPath} (${match}) owned by ${describeHttpRouteOwner(foreignOwner)}` : `http route already registered: ${normalizedPath} (${match}) by ${describeHttpRouteOwner(foreignOwner)}`);
			return;
		}
		if (!canonicalMatches.length) record.httpRoutes += 1;
		replacePluginHttpRoutes(registry, registration, canonicalMatches, true);
	};
	const registerHostedMediaResolver = (record, resolver) => {
		if (typeof resolver !== "function") {
			reportRegistrationError(record, "hosted media resolver registration missing resolver");
			return;
		}
		registry.hostedMediaResolvers.push(createRegistration(record, { resolver }));
	};
	const registerMcpServerConnectionResolver = (record, resolver) => {
		const serverName = normalizeOptionalString(resolver?.serverName);
		if (!serverName || typeof resolver.resolve !== "function") {
			reportRegistrationError(record, "MCP server connection resolver registration missing serverName or resolve");
			return;
		}
		const existingIndex = registry.mcpServerConnectionResolvers.findIndex((entry) => entry.resolver.serverName === serverName);
		const registration = createRegistration(record, { resolver: {
			serverName,
			resolve: resolver.resolve
		} });
		if (existingIndex >= 0) {
			const existing = registry.mcpServerConnectionResolvers[existingIndex];
			if (existing && existing.pluginId !== record.id) {
				reportRegistrationError(record, `MCP server connection resolver for "${serverName}" rejected: already registered by plugin "${existing.pluginId}"`);
				return;
			}
			registry.mcpServerConnectionResolvers[existingIndex] = registration;
			return;
		}
		registry.mcpServerConnectionResolvers.push(registration);
	};
	const registerChannel = (record, registration, mode = "full", resolveChannelRuntime) => {
		if (record.origin === "workspace" && !record.enabled) {
			reportRegistrationWarning(record, `channel registration rejected for disabled workspace plugin: ${record.id}`);
			return;
		}
		const registrationCapabilities = resolvePluginRegistrationCapabilities(mode);
		const pluginRegistration = "plugin" in registration ? registration.plugin : registration;
		const plugin = normalizeRegisteredChannelPlugin({
			pluginId: record.id,
			source: record.source,
			plugin: pluginRegistration,
			pushDiagnostic
		});
		if (!plugin) return;
		const id = plugin.id;
		const existingRuntime = registrationCapabilities.runtimeChannel ? registry.channels.find((entry) => entry.plugin.id === id) : void 0;
		const existingSetup = registry.channelSetups.find((entry) => entry.plugin.id === id);
		const existing = existingRuntime ?? existingSetup;
		if (existing && existing.pluginId !== record.id) {
			reportRegistrationError(record, `${existingRuntime ? "channel" : "channel setup"} already registered: ${id} (${existing.pluginId})`);
			pluginsWithChannelRegistrationConflict.add(record.id);
			return;
		}
		const agentTools = plugin.agentTools;
		if (agentTools) {
			plugin.agentTools = typeof agentTools === "function" ? agentTools : () => agentTools;
			getPluginInstance(record)?.admitFactory(plugin.agentTools);
		}
		const metadata = {
			plugin: wrapCurrentPluginInstance(plugin),
			pluginName: record.name,
			origin: record.origin,
			source: record.source,
			rootDir: record.rootDir
		};
		const captureReadAuthority = () => {
			const currentRegistry = getPluginRecordRegistry(registry, record);
			const entry = currentRegistry.channels.find((candidate) => candidate.plugin.id === id);
			const ownerCurrent = capturePluginLifecycleAuthority(currentRegistry, record, { scopedRuntime: true });
			const isCurrent = () => ownerCurrent?.() === true && (record.origin === "bundled" || record.trustedOfficialInstall === true) && entry !== void 0 && getPluginRecordRegistry(registry, record).channels.includes(entry) && entry.pluginId === record.id && entry.plugin === metadata.plugin && entry.captureReadAuthority === captureReadAuthority;
			return isCurrent() ? isCurrent : void 0;
		};
		if (existing) {
			if (existingRuntime) Object.assign(existingRuntime, metadata, {
				resolveChannelRuntime,
				captureReadAuthority
			});
			if (existingSetup) Object.assign(existingSetup, metadata, { enabled: record.enabled });
			return;
		}
		if (!record.channelIds.includes(id)) record.channelIds.push(id);
		registry.channelSetups.push({
			...metadata,
			pluginId: record.id,
			enabled: record.enabled
		});
		if (registrationCapabilities.runtimeChannel) registry.channels.push({
			...metadata,
			pluginId: record.id,
			resolveChannelRuntime,
			captureReadAuthority
		});
	};
	return {
		registerGatewayMethod,
		registerSessionCatalog,
		registerHttpRoute,
		registerHostedMediaResolver,
		registerMcpServerConnectionResolver,
		registerChannel
	};
}
//#endregion
//#region src/plugins/gateway-access-policy-registration.ts
const signalRelays = /* @__PURE__ */ new WeakMap();
const signalRelayCleanup = new FinalizationRegistry((release) => release());
function observeNativeAbort(source, relay, token) {
	const onAbort = () => {
		try {
			relay.deref()?.();
		} finally {
			release();
		}
	};
	function release() {
		EventTarget.prototype.removeEventListener.call(source, "abort", onAbort);
		signalRelayCleanup.unregister(token);
	}
	EventTarget.prototype.addEventListener.call(source, "abort", onAbort, { once: true });
	return release;
}
function bindAccessSignal(signal, instance) {
	if (types.isProxy(signal) || !(signal instanceof AbortSignal)) throw new TypeError("Gateway access authority requires a native AbortSignal");
	const source = AbortSignal.any([signal, instance.lifecycle.signal]);
	const controller = new AbortController();
	const relay = () => {
		let reason;
		try {
			instance.run(() => {
				reason = instance.wrap(source.reason);
			});
		} catch {
			reason = new PluginInstanceUnavailableError(instance.pluginId);
		}
		controller.abort(reason);
		signalRelays.delete(controller.signal);
	};
	if (source.aborted) {
		relay();
		return controller.signal;
	}
	const token = {};
	const release = observeNativeAbort(source, new WeakRef(relay), token);
	signalRelays.set(controller.signal, relay);
	signalRelayCleanup.register(relay, release, token);
	return controller.signal;
}
function bindAccessAuthority(authority, instance) {
	if (!authority) return;
	const grantId = authority.grantId;
	if (grantId !== void 0 && typeof grantId !== "string") throw new TypeError("Gateway access grant identity must be a string");
	return {
		grantId,
		signal: bindAccessSignal(authority.signal, instance),
		assertCurrent: () => instance.run(() => {
			authority.assertCurrent();
		})
	};
}
/** Preserve native signals while every plugin callback retains its original owner. */
function bindPluginGatewayAccessPolicy(policy, instance) {
	if (!instance) return policy;
	const bound = { authorize(context) {
		return instance.run(() => bindAccessAuthority(policy.authorize(context), instance));
	} };
	const resume = instance.run(() => policy.resume);
	if (resume) bound.resume = (context) => instance.run(() => bindAccessAuthority(resume.call(policy, context), instance));
	return bound;
}
//#endregion
//#region src/plugins/registry-registrars-operations.ts
function isOfficialCodexPluginRecord(record) {
	if (record.id !== "codex" || record.origin !== "global") return false;
	if (record.packageName === "@openclaw/codex") return true;
	return path.normalize(record.rootDir ?? record.source).split(path.sep).join("/").includes("/node_modules/@openclaw/codex");
}
function canClaimReservedCommandOwnership(record) {
	return record.origin === "bundled" || isOfficialCodexPluginRecord(record);
}
function createOperationRegistrars(state) {
	const { registry, createRegistration, createIdentityRegistration, reportRegistrationError, reportRegistrationWarning } = state;
	const registerWidgetPresenter = (record, presenter) => {
		const description = normalizeOptionalString(presenter.description);
		const currentCapabilities = presenter.target === "current_channel" ? presenter.capabilities : void 0;
		const currentChannelValid = presenter.target === "current_channel" && typeof presenter.match === "function" && currentCapabilities !== void 0 && Array.isArray(currentCapabilities.sourceKinds) && currentCapabilities.sourceKinds.length > 0 && currentCapabilities.sourceKinds.every((kind) => typeof kind === "string" && kind.trim().length > 0) && (currentCapabilities.maxSourceBytes === void 0 || Number.isInteger(currentCapabilities.maxSourceBytes) && currentCapabilities.maxSourceBytes > 0);
		if (presenter.target !== "node_panel" && !currentChannelValid || !description || description.length > 160 || typeof presenter.availability !== "function" || typeof presenter.present !== "function") {
			reportRegistrationError(record, "invalid widget presenter registration");
			return;
		}
		const existing = presenter.target === "current_channel" ? void 0 : registry.widgetPresenters.find((registration) => registration.presenter.target === presenter.target);
		if (existing) {
			reportRegistrationError(record, `widget presenter already registered for ${presenter.target} (${existing.pluginId})`);
			return;
		}
		registry.widgetPresenters.push(createRegistration(record, { presenter: {
			...presenter,
			description
		} }));
	};
	const registerCli = (record, registrar, opts) => {
		const normalizeCommandRoot = (raw, source) => {
			const normalized = normalizeCommandDescriptorName(raw);
			if (!normalized) reportRegistrationError(record, `invalid cli ${source} name: ${JSON.stringify(raw.trim())}`);
			return normalized;
		};
		const parentPath = (opts?.parentPath ?? []).map((segment) => normalizeCommandRoot(segment, "command"));
		if (parentPath.some((segment) => segment === null)) return;
		const normalizedParentPath = parentPath;
		const rootRegistration = normalizedParentPath.length === 0;
		const descriptors = (opts?.descriptors ?? []).map((descriptor) => {
			const name = normalizeCommandRoot(descriptor.name, "descriptor");
			const description = sanitizeCommandDescriptorDescription(descriptor.description);
			const machineOutput = rootRegistration ? descriptor.machineOutput : void 0;
			if (!name || !description) return null;
			const normalized = {
				name,
				description,
				hasSubcommands: descriptor.hasSubcommands
			};
			if (machineOutput) normalized.machineOutput = machineOutput;
			return normalized;
		}).filter((descriptor) => descriptor !== null);
		const commands = normalizeUniqueStringEntries([...opts?.commands ?? [], ...descriptors.map((descriptor) => descriptor.name)].map((command) => normalizeCommandRoot(command, "command")).filter((command) => command !== null));
		if (commands.length === 0) {
			reportRegistrationError(record, "cli registration missing explicit commands metadata");
			return;
		}
		const serializeCommandPath = (command) => [...normalizedParentPath, command].join(" ");
		const commandPaths = commands.map(serializeCommandPath);
		const commandPathSet = new Set(commandPaths);
		const existing = registry.cliRegistrars.find((entry) => entry.commands.map((command) => [...entry.parentPath ?? [], command].join(" ")).some((commandPath) => commandPathSet.has(commandPath)));
		if (existing) {
			const existingCommandPaths = new Set(existing.commands.map((command) => [...existing.parentPath ?? [], command].join(" ")));
			const overlap = commandPaths.find((commandPath) => existingCommandPaths.has(commandPath));
			reportRegistrationError(record, `cli command already registered: ${overlap ?? commands[0]} (${existing.pluginId})`);
			return;
		}
		record.cliCommands.push(...commandPaths);
		registry.cliRegistrars.push(createRegistration(record, {
			register: registrar,
			parentPath: normalizedParentPath,
			commands,
			descriptors
		}));
	};
	const registerReload = (record, registration) => {
		const normalized = {
			restartPrefixes: normalizeStringEntries(registration.restartPrefixes),
			hotPrefixes: normalizeStringEntries(registration.hotPrefixes),
			noopPrefixes: normalizeStringEntries(registration.noopPrefixes)
		};
		if ((normalized.restartPrefixes?.length ?? 0) === 0 && (normalized.hotPrefixes?.length ?? 0) === 0 && (normalized.noopPrefixes?.length ?? 0) === 0) {
			reportRegistrationWarning(record, "reload registration missing prefixes");
			return;
		}
		registry.reloads.push(createRegistration(record, { registration: normalized }));
	};
	const reservedNodeHostCommands = /* @__PURE__ */ new Set([
		...NODE_SYSTEM_RUN_COMMANDS,
		...NODE_EXEC_APPROVALS_COMMANDS,
		NODE_SYSTEM_NOTIFY_COMMAND,
		...NODE_WORKER_PRIVATE_COMMANDS
	]);
	const registerNodeHostCommand = (record, nodeCommand) => {
		const command = nodeCommand.command.trim();
		if (!command) {
			reportRegistrationError(record, "node host command registration missing command");
			return;
		}
		const bundledSystemNotify = record.origin === "bundled" && command === "system.notify";
		if (reservedNodeHostCommands.has(command) && !bundledSystemNotify) {
			reportRegistrationError(record, `node host command reserved by core: ${command}`);
			return;
		}
		const existing = registry.nodeHostCommands.find((entry) => entry.command.command === command);
		if (existing) {
			reportRegistrationError(record, `node host command already registered: ${command} (${existing.pluginId})`);
			return;
		}
		const normalizedCommand = {
			...nodeCommand,
			command,
			cap: normalizeOptionalString(nodeCommand.cap)
		};
		registry.nodeHostCommands.push(createRegistration(record, { command: record.nativeSessionCatalog?.nodeCommands?.includes(command) ? state.getNativeCatalogGate(record)?.node(normalizedCommand) ?? normalizedCommand : normalizedCommand }));
	};
	const registerNodeInvokePolicy = (record, policy, pluginConfig) => {
		const commands = normalizeUniqueStringEntries(Array.isArray(policy.commands) ? policy.commands : []);
		if (commands.length === 0) {
			reportRegistrationError(record, "node invoke policy registration missing commands");
			return;
		}
		const reservedCommand = commands.find(isPrivateNodeInvokeCommand);
		if (reservedCommand) {
			reportRegistrationError(record, `node invoke policy command reserved by core: ${reservedCommand}`);
			return;
		}
		if (typeof policy.handle !== "function") {
			reportRegistrationError(record, `node invoke policy registration missing handler: ${commands.join(", ")}`);
			return;
		}
		for (const command of commands) {
			const existing = registry.nodeInvokePolicies.find((entry) => entry.policy.commands.includes(command));
			if (existing) {
				reportRegistrationError(record, `node invoke policy already registered for ${command} (${existing.pluginId})`);
				return;
			}
		}
		registry.nodeInvokePolicies.push(createRegistration(record, {
			policy: {
				...policy,
				commands
			},
			pluginConfig
		}));
	};
	const registerSecurityAuditCollector = (record, collector) => {
		registry.securityAuditCollectors.push(createRegistration(record, { collector }));
	};
	const registerGatewayAccessPolicy = (record, policy) => {
		if (typeof policy.authorize !== "function") {
			reportRegistrationError(record, "Gateway access policy requires an authorize handler");
			return;
		}
		registry.gatewayAccessPolicies.push(createIdentityRegistration(record, { policy: bindPluginGatewayAccessPolicy(policy, getPluginInstance(record)) }));
	};
	const resolveServiceRegistrationId = (record, service, kind) => {
		try {
			const id = service.id.trim();
			const registrations = kind === "service" ? registry.services : registry.gatewayDiscoveryServices;
			const existing = id ? registrations.find((entry) => entry.id === id) : void 0;
			if (id && !existing) return id;
			if (existing?.pluginId !== record.id) reportRegistrationError(record, existing ? `${kind} already registered: ${id} (${existing.pluginId})` : `${kind} registration missing id`);
		} catch {
			reportRegistrationError(record, `${kind} registration id cannot be normalized`);
		}
	};
	const registerService = (record, service) => {
		const id = resolveServiceRegistrationId(record, service, "service");
		if (!id) return;
		record.services.push(id);
		registry.services.push({
			id,
			pluginId: record.id,
			pluginName: record.name,
			service,
			source: record.source,
			origin: record.origin,
			trustedOfficialInstall: record.trustedOfficialInstall,
			rootDir: record.rootDir
		});
	};
	const registerGatewayDiscoveryService = (record, service) => {
		const id = resolveServiceRegistrationId(record, service, "gateway discovery service");
		if (!id) return;
		record.gatewayDiscoveryServiceIds.push(id);
		registry.gatewayDiscoveryServices.push({
			...createRegistration(record, {
				id,
				service
			}),
			instance: getPluginInstance(record)
		});
	};
	const registerCommand = (record, command) => {
		const name = command.name.trim();
		if (!name) {
			reportRegistrationError(record, "command registration missing name");
			return;
		}
		const allowReservedCommandNames = command.ownership === "reserved";
		if (allowReservedCommandNames && !canClaimReservedCommandOwnership(record)) {
			reportRegistrationError(record, `only bundled plugins can claim reserved command ownership: ${name}`);
			return;
		}
		if (allowReservedCommandNames && !isReservedCommandName(name)) {
			reportRegistrationError(record, `reserved command ownership requires a reserved command name: ${name}`);
			return;
		}
		if (allowReservedCommandNames && record.id !== normalizeLowercaseStringOrEmpty(name)) {
			reportRegistrationError(record, `command registration failed: Reserved command ownership requires plugin id "${record.id}" to match reserved command name "${normalizeLowercaseStringOrEmpty(name)}"`);
			return;
		}
		const { ownership: _ownership, ...commandForRegistration } = command;
		const result = registerPluginCommandInRegistry(registry, record.id, allowReservedCommandNames ? commandForRegistration : command, {
			pluginName: record.name,
			pluginRoot: record.rootDir,
			allowReservedCommandNames,
			allowOwnerStatusExposure: canClaimReservedCommandOwnership(record)
		});
		if (!result.ok) {
			reportRegistrationError(record, `command registration failed: ${result.error}`);
			return;
		}
		const registered = registry.commands.at(-1);
		if (registered?.pluginId === record.id) {
			registered.source = record.source;
			if (allowReservedCommandNames) registered.command.ownership = "reserved";
		}
		record.commands.push(name);
	};
	return {
		registerWidgetPresenter,
		registerCli,
		registerReload,
		registerNodeHostCommand,
		registerNodeInvokePolicy,
		registerGatewayAccessPolicy,
		registerSecurityAuditCollector,
		registerService,
		registerGatewayDiscoveryService,
		registerCommand
	};
}
//#endregion
//#region src/plugins/provider-validation.ts
/** Validates and normalizes provider plugin definitions before registry registration. */
function normalizeTextList(values) {
	const normalized = normalizeUniqueTrimmedStringList(values);
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeOnboardingScopes(values) {
	const normalized = Array.from(new Set((values ?? []).filter((value) => value === "text-inference" || value === "image-generation" || value === "music-generation")));
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeProviderOAuthProfileIdRepairs(values) {
	if (!Array.isArray(values)) return;
	const normalized = values.map((value) => {
		const legacyProfileId = normalizeOptionalString(value?.legacyProfileId);
		const promptLabel = normalizeOptionalString(value?.promptLabel);
		if (!legacyProfileId && !promptLabel) return null;
		return {
			...legacyProfileId ? { legacyProfileId } : {},
			...promptLabel ? { promptLabel } : {}
		};
	}).filter((value) => value !== null);
	return normalized.length > 0 ? normalized : void 0;
}
function buildNormalizedModelAllowlist(modelAllowlist) {
	if (!modelAllowlist) return;
	const allowedKeys = normalizeTextList(modelAllowlist.allowedKeys);
	const initialSelections = normalizeTextList(modelAllowlist.initialSelections);
	const loadCatalog = modelAllowlist.loadCatalog === true;
	const message = normalizeOptionalString(modelAllowlist.message);
	if (!allowedKeys && !initialSelections && !loadCatalog && !message) return;
	return {
		...allowedKeys ? { allowedKeys } : {},
		...initialSelections ? { initialSelections } : {},
		...loadCatalog ? { loadCatalog } : {},
		...message ? { message } : {}
	};
}
function buildNormalizedWizardSetup(setup, methodId) {
	const choiceId = normalizeOptionalString(setup.choiceId);
	const choiceLabel = normalizeOptionalString(setup.choiceLabel);
	const choiceHint = normalizeOptionalString(setup.choiceHint);
	const groupId = normalizeOptionalString(setup.groupId);
	const groupLabel = normalizeOptionalString(setup.groupLabel);
	const groupHint = normalizeOptionalString(setup.groupHint);
	const onboardingScopes = normalizeOnboardingScopes(setup.onboardingScopes);
	const modelAllowlist = buildNormalizedModelAllowlist(setup.modelAllowlist);
	const modelSelection = {
		...typeof setup.modelSelection?.promptWhenAuthChoiceProvided === "boolean" ? { promptWhenAuthChoiceProvided: setup.modelSelection.promptWhenAuthChoiceProvided } : {},
		...typeof setup.modelSelection?.allowKeepCurrent === "boolean" ? { allowKeepCurrent: setup.modelSelection.allowKeepCurrent } : {}
	};
	return {
		...choiceId ? { choiceId } : {},
		...setup.modelTarget === "utility" ? { modelTarget: "utility" } : {},
		...choiceLabel ? { choiceLabel } : {},
		...choiceHint ? { choiceHint } : {},
		...typeof setup.assistantPriority === "number" && Number.isFinite(setup.assistantPriority) ? { assistantPriority: setup.assistantPriority } : {},
		...setup.assistantVisibility === "manual-only" || setup.assistantVisibility === "visible" || setup.assistantVisibility === "detected-only" ? { assistantVisibility: setup.assistantVisibility } : {},
		...setup.onboardingFeatured === true ? { onboardingFeatured: true } : {},
		...groupId ? { groupId } : {},
		...groupLabel ? { groupLabel } : {},
		...groupHint ? { groupHint } : {},
		...methodId ? { methodId } : {},
		...onboardingScopes ? { onboardingScopes } : {},
		...modelAllowlist ? { modelAllowlist } : {},
		...Object.keys(modelSelection).length > 0 ? { modelSelection } : {}
	};
}
function buildNormalizedModelPicker(modelPicker, methodId) {
	const label = normalizeOptionalString(modelPicker.label);
	const hint = normalizeOptionalString(modelPicker.hint);
	return {
		...label ? { label } : {},
		...hint ? { hint } : {},
		...methodId ? { methodId } : {}
	};
}
/** Normalizes provider plugin metadata and emits diagnostics for invalid public fields. */
function normalizeRegisteredProvider(params) {
	const diagnose = (level, message) => params.pushDiagnostic({
		level,
		pluginId: params.pluginId,
		source: params.source,
		message
	});
	const id = normalizeOptionalString(params.provider.id);
	if (!id) {
		diagnose("error", "provider registration missing id");
		return null;
	}
	function normalizeWizardSurface(surface, metadataKind, project, methodIds) {
		if (!surface) return;
		if (methodIds.size === 0) {
			diagnose("warn", `provider "${id}" ${metadataKind} metadata ignored because it has no auth methods`);
			return;
		}
		let methodId = normalizeOptionalString(surface.methodId);
		if (methodId && !methodIds.has(methodId)) {
			diagnose("warn", `provider "${id}" ${metadataKind} method "${methodId}" not found; falling back to available methods`);
			methodId = void 0;
		}
		return project(surface, methodId);
	}
	const seenMethodIds = /* @__PURE__ */ new Set();
	const auth = [];
	for (const method of params.provider.auth ?? []) {
		const methodId = normalizeOptionalString(method.id);
		if (!methodId) {
			diagnose("error", `provider "${id}" auth method missing id`);
			continue;
		}
		if (seenMethodIds.has(methodId)) {
			diagnose("error", `provider "${id}" auth method duplicated id "${methodId}"`);
			continue;
		}
		seenMethodIds.add(methodId);
		const wizard = normalizeWizardSurface(method.wizard, "setup", buildNormalizedWizardSetup, /* @__PURE__ */ new Set([methodId]));
		const hint = normalizeOptionalString(method.hint);
		auth.push({
			...method,
			id: methodId,
			label: normalizeOptionalString(method.label) ?? methodId,
			...hint ? { hint } : {},
			...wizard ? { wizard } : {}
		});
	}
	const docsPath = normalizeOptionalString(params.provider.docsPath);
	const aliases = normalizeTextList(params.provider.aliases);
	const deprecatedProfileIds = normalizeTextList(params.provider.deprecatedProfileIds);
	const oauthProfileIdRepairs = normalizeProviderOAuthProfileIdRepairs(params.provider.oauthProfileIdRepairs);
	const envVars = normalizeTextList(params.provider.envVars);
	const setup = normalizeWizardSurface(params.provider.wizard?.setup, "setup", buildNormalizedWizardSetup, seenMethodIds);
	const modelPicker = normalizeWizardSurface(params.provider.wizard?.modelPicker, "model-picker", buildNormalizedModelPicker, seenMethodIds);
	const catalog = params.provider.catalog;
	const { wizard: _ignoredWizard, docsPath: _ignoredDocsPath, aliases: _ignoredAliases, envVars: _ignoredEnvVars, catalog: _ignoredCatalog, ...restProvider } = params.provider;
	return {
		...restProvider,
		id,
		label: normalizeOptionalString(params.provider.label) ?? id,
		...docsPath ? { docsPath } : {},
		...aliases ? { aliases } : {},
		...deprecatedProfileIds ? { deprecatedProfileIds } : {},
		...oauthProfileIdRepairs ? { oauthProfileIdRepairs } : {},
		...envVars ? { envVars } : {},
		auth,
		...catalog ? { catalog } : {},
		...setup || modelPicker ? { wizard: {
			...setup ? { setup } : {},
			...modelPicker ? { modelPicker } : {}
		} } : {}
	};
}
//#endregion
//#region src/plugins/registry-registrars-providers.ts
function createProviderRegistrars(state) {
	const { registry, createIdentityRegistration, createRegistration, pushDiagnostic, reportRegistrationError, reportRegistrationWarning, registerModelCatalogProvider } = state;
	const registerProvider = (record, provider) => {
		const normalizedProvider = normalizeRegisteredProvider({
			pluginId: record.id,
			source: record.source,
			provider,
			pushDiagnostic
		});
		if (!normalizedProvider) return;
		const id = normalizedProvider.id;
		const existing = registry.providers.find((entry) => entry.provider.id === id);
		if (existing) {
			reportRegistrationError(record, `provider already registered: ${id} (${existing.pluginId})`);
			return;
		}
		if (!record.providerIds.includes(id)) record.providerIds.push(id);
		if (normalizedProvider.normalizeToolSchemas) getPluginInstance(record)?.admitFactory(normalizedProvider.normalizeToolSchemas);
		registry.providers.push(createRegistration(record, { provider: {
			...normalizedProvider,
			pluginRoot: record.rootDir
		} }));
		invalidateProviderRegistryIndex(registry.providers);
		if (normalizedProvider.catalog || normalizedProvider.staticCatalog) registerModelCatalogProvider(record, {
			provider: normalizedProvider.id,
			kinds: ["text"]
		});
	};
	const registerAgentHarness = (record, harness, options) => {
		const id = normalizeOptionalString(harness?.id) ?? "";
		if (!id) {
			reportRegistrationError(record, "agent harness registration missing id");
			return;
		}
		if (id === "openclaw") {
			reportRegistrationError(record, "agent harness id \"openclaw\" is reserved for the built-in runtime");
			return;
		}
		if (typeof harness.supports !== "function" || typeof harness.runAttempt !== "function") {
			reportRegistrationError(record, `agent harness "${id}" registration missing required runtime methods`);
			return;
		}
		if (options?.nativeCompaction && (!canClaimReservedCommandOwnership(record) || id !== "codex" || typeof options.nativeCompaction !== "function")) {
			reportRegistrationError(record, "native compaction requires the registry-owned \"codex\" harness");
			return;
		}
		const existing = registry.agentHarnesses.find((entry) => entry.harness.id === id);
		if (existing) {
			const ownerDetail = existing.pluginId ? ` (owner: ${existing.pluginId})` : "";
			reportRegistrationError(record, `agent harness already registered: ${id}${ownerDetail}`);
			return;
		}
		if (harness.acquireMcpAppRuntime) getPluginInstance(record)?.admitFactory(harness.acquireMcpAppRuntime);
		const normalizedHarness = {
			...harness,
			id,
			pluginId: harness.pluginId ?? record.id
		};
		record.agentHarnessIds.push(id);
		registry.agentHarnesses.push(createRegistration(record, {
			harness: normalizedHarness,
			...options?.nativeCompaction ? { nativeCompaction: options.nativeCompaction } : {}
		}));
	};
	const registerCliBackend = (record, backend) => {
		const id = backend.id.trim();
		if (!id) {
			reportRegistrationError(record, "cli backend registration missing id");
			return;
		}
		const existing = registry.cliBackends.find((entry) => entry.backend.id === id);
		if (existing) {
			reportRegistrationError(record, `cli backend already registered: ${id} (${existing.pluginId})`);
			return;
		}
		if (backend.prepareExecution) getPluginInstance(record)?.admitFactory(backend.prepareExecution);
		registry.cliBackends.push(createRegistration(record, {
			builtWithOpenClawVersion: record.builtWithOpenClawVersion,
			backend: {
				...backend,
				id
			}
		}));
		record.cliBackendIds.push(id);
	};
	const registerTextTransforms = (record, transforms) => {
		if ((!transforms.input || transforms.input.length === 0) && (!transforms.output || transforms.output.length === 0)) {
			reportRegistrationWarning(record, "text transform registration has no input or output replacements");
			return;
		}
		registry.textTransforms.push(createRegistration(record, { transforms }));
	};
	const registerEmbeddingProvider = (record, adapter) => {
		const id = adapter.id.trim();
		if (!id) {
			reportRegistrationError(record, "embedding provider registration missing id");
			return;
		}
		if (!(record.contracts?.embeddingProviders ?? []).includes(id)) {
			reportRegistrationError(record, `plugin must declare contracts.embeddingProviders for adapter: ${id}`);
			return;
		}
		const existing = getCoreEmbeddingProvider(id) ?? registry.embeddingProviders.find((entry) => entry.provider.id === id);
		if (existing) {
			const ownerPluginId = "ownerPluginId" in existing ? existing.ownerPluginId : "pluginId" in existing ? existing.pluginId : void 0;
			const ownerDetail = ownerPluginId ? ` (owner: ${ownerPluginId})` : "";
			reportRegistrationError(record, `embedding provider already registered: ${id}${ownerDetail}`);
			return;
		}
		getPluginInstance(record)?.admitFactory(adapter.create);
		registry.embeddingProviders.push(createRegistration(record, { provider: adapter }));
		if (!record.embeddingProviderIds.includes(id)) record.embeddingProviderIds.push(id);
	};
	const createProviderLikeRegistrar = (params) => (record, provider) => {
		const id = provider.id.trim();
		const { kindLabel } = params;
		if (!id) {
			reportRegistrationError(record, `${kindLabel} registration missing id`);
			return params.catalogKinds ? void 0 : false;
		}
		const existing = params.registrations.find((entry) => entry.provider.id === id);
		if (existing) {
			reportRegistrationError(record, `${kindLabel} already registered: ${id} (${existing.pluginId})`);
			return params.catalogKinds ? void 0 : false;
		}
		const ownedIds = params.ownedIds(record);
		if (!ownedIds.includes(id)) ownedIds.push(id);
		const factory = params.factory?.(provider);
		if (factory) (getPluginValueInstance(factory) ?? getPluginInstance(record))?.admitFactory(factory);
		params.registrations.push(createIdentityRegistration(record, { provider }));
		if (params.catalogKinds) {
			registerModelCatalogProvider(record, {
				provider: provider.id,
				kinds: params.catalogKinds
			});
			return;
		}
		return true;
	};
	const registerWorkerProvider = (record, provider) => {
		const validation = validateWorkerProviderContract(provider, record.contracts?.workerProviders ?? []);
		if (!validation.ok) {
			reportRegistrationError(record, validation.message);
			return;
		}
		const { id } = validation;
		const existing = registry.workerProviders.get(id);
		if (existing) {
			reportRegistrationError(record, `worker provider already registered: ${id} (${existing.pluginId})`);
			return;
		}
		registry.workerProviders.set(id, createRegistration(record, { provider }));
	};
	const registerStorageProvider = (record, provider) => {
		const validation = validateStorageProviderContract(provider, record.contracts?.storageProviders ?? []);
		if (!validation.ok) {
			reportRegistrationError(record, validation.message);
			return;
		}
		const { id } = validation;
		const existing = registry.storageProviders.get(id);
		if (existing) {
			reportRegistrationError(record, `storage provider already registered: ${id} (${existing.pluginId})`);
			return;
		}
		getPluginInstance(record)?.admitFactory(provider.open);
		registry.storageProviders.set(id, createRegistration(record, { provider }));
	};
	return {
		registerProvider,
		registerAgentHarness,
		registerCliBackend,
		registerTextTransforms,
		registerEmbeddingProvider,
		registerWorkerProvider,
		registerStorageProvider,
		registerSpeechProvider: createProviderLikeRegistrar({
			kindLabel: "speech provider",
			factory: (provider) => provider.streamSynthesize,
			registrations: registry.speechProviders,
			ownedIds: (record) => record.speechProviderIds,
			catalogKinds: ["voice"]
		}),
		registerRealtimeTranscriptionProvider: createProviderLikeRegistrar({
			kindLabel: "realtime transcription provider",
			factory: (provider) => provider.createSession,
			registrations: registry.realtimeTranscriptionProviders,
			ownedIds: (record) => record.realtimeTranscriptionProviderIds,
			catalogKinds: ["voice"]
		}),
		registerRealtimeVoiceProvider: createProviderLikeRegistrar({
			kindLabel: "realtime voice provider",
			factory: (provider) => provider.createBridge,
			registrations: registry.realtimeVoiceProviders,
			ownedIds: (record) => record.realtimeVoiceProviderIds,
			catalogKinds: ["voice"]
		}),
		registerMediaUnderstandingProvider: createProviderLikeRegistrar({
			kindLabel: "media provider",
			registrations: registry.mediaUnderstandingProviders,
			ownedIds: (record) => record.mediaUnderstandingProviderIds
		}),
		registerTranscriptSourceProvider: createProviderLikeRegistrar({
			kindLabel: "transcripts source provider",
			factory: (provider) => provider.watchOccupancy,
			registrations: registry.transcriptSourceProviders,
			ownedIds: (record) => record.transcriptSourceProviderIds
		}),
		registerImageGenerationProvider: createProviderLikeRegistrar({
			kindLabel: "image-generation provider",
			registrations: registry.imageGenerationProviders,
			ownedIds: (record) => record.imageGenerationProviderIds,
			catalogKinds: ["image_generation"]
		}),
		registerVideoGenerationProvider: createProviderLikeRegistrar({
			kindLabel: "video-generation provider",
			registrations: registry.videoGenerationProviders,
			ownedIds: (record) => record.videoGenerationProviderIds,
			catalogKinds: ["video_generation"]
		}),
		registerMusicGenerationProvider: createProviderLikeRegistrar({
			kindLabel: "music-generation provider",
			registrations: registry.musicGenerationProviders,
			ownedIds: (record) => record.musicGenerationProviderIds,
			catalogKinds: ["music_generation"]
		}),
		registerWebFetchProvider: createProviderLikeRegistrar({
			kindLabel: "web fetch provider",
			factory: (provider) => provider.createTool,
			registrations: registry.webFetchProviders,
			ownedIds: (record) => record.webFetchProviderIds
		}),
		registerWebSearchProvider: createProviderLikeRegistrar({
			kindLabel: "web search provider",
			factory: (provider) => provider.createTool,
			registrations: registry.webSearchProviders,
			ownedIds: (record) => record.webSearchProviderIds
		}),
		registerMigrationProvider: createProviderLikeRegistrar({
			kindLabel: "migration provider",
			factory: (provider) => provider.prepareApply,
			registrations: registry.migrationProviders,
			ownedIds: (record) => record.migrationProviderIds
		})
	};
}
/** Lists active Codex app-server extension factories from the plugin registry. */
function listCodexAppServerExtensionFactories() {
	return getActivePluginRegistry()?.codexAppServerExtensionFactories?.map((entry) => entry.factory) ?? [];
}
//#endregion
//#region src/plugins/registry-registrars-tools-hooks.ts
const conversationHookNames = /* @__PURE__ */ new Set([
	"before_model_resolve",
	"agent_turn_prepare",
	"before_prompt_build",
	"before_agent_reply",
	"llm_input",
	"llm_output",
	"before_agent_finalize",
	"agent_end",
	"before_agent_run"
]);
function isConversationHookName(hookName) {
	return conversationHookNames.has(hookName);
}
function normalizeHookEligibility(value, isEligible) {
	if (!Array.isArray(value)) return;
	const entries = Array.from(value);
	if (entries.length === 0 || !entries.every(isEligible)) return;
	return uniqueValues(entries);
}
function canRegisterInstalledTrustedHook(record) {
	return record.origin === "bundled" || record.enabled && record.explicitlyEnabled === true;
}
function createToolHookRegistrars(state) {
	const { registry, createRegistration, registryParams, pluginsWithChannelRegistrationConflict, reportRegistrationError, reportRegistrationWarning } = state;
	const declaredToolNames = /* @__PURE__ */ new WeakMap();
	const registerCodexAppServerExtensionFactory = (record, factory) => {
		if (record.origin !== "bundled") {
			reportRegistrationError(record, "only bundled plugins can register Codex app-server extension factories");
			return;
		}
		if (!(record.contracts?.embeddedExtensionFactories ?? []).includes("codex-app-server")) {
			reportRegistrationError(record, "plugin must declare contracts.embeddedExtensionFactories: [\"codex-app-server\"] to register Codex app-server extension factories");
			return;
		}
		if (typeof factory !== "function") {
			reportRegistrationError(record, "codex app-server extension factory must be a function");
			return;
		}
		if (registry.codexAppServerExtensionFactories.some((entry) => entry.pluginId === record.id && entry.rawFactory === factory)) return;
		const safeFactory = async (codex) => {
			try {
				await factory(codex);
			} catch (error) {
				const detail = error instanceof Error ? error.message : String(error);
				registryParams.logger.warn(`[plugins] codex app-server extension factory failed for ${record.id}: ${detail}`);
			}
		};
		registry.codexAppServerExtensionFactories.push({
			...createRegistration(record, { factory: safeFactory }),
			rawFactory: factory
		});
	};
	const registerAgentToolResultMiddleware = (record, handler, options, policy) => {
		if (typeof handler !== "function") {
			reportRegistrationError(record, "agent tool result middleware must be a function");
			return;
		}
		const declared = normalizeAgentToolResultMiddlewareRuntimeIds(record.contracts?.agentToolResultMiddleware);
		const runtimes = normalizeAgentToolResultMiddlewareRuntimes(options, declared);
		const matcher = normalizePluginToolMatcher(options?.matcher);
		if (runtimes.length === 0) {
			reportRegistrationError(record, "agent tool result middleware must target at least one supported runtime");
			return;
		}
		const missing = runtimes.filter((runtime) => !declared.includes(runtime));
		if (missing.length > 0) {
			reportRegistrationError(record, `plugin must declare contracts.agentToolResultMiddleware for: ${missing.join(", ")}`);
			return;
		}
		if (!canRegisterInstalledTrustedHook(record)) {
			reportRegistrationError(record, "plugin must be explicitly enabled to register agent tool result middleware");
			return;
		}
		const existing = registry.agentToolResultMiddlewares.find((entry) => entry.pluginId === record.id && entry.rawHandler === handler);
		if (existing) {
			appendAgentToolResultMiddlewareScope(existing, {
				runtimes,
				matcher
			});
			return;
		}
		const timeoutMs = resolveTypedHookTimeoutMs({
			hookName: "after_tool_call",
			policy
		});
		const safeHandler = async (event, ctx) => {
			if (!agentToolResultMiddlewareRegistrationCoversTool(registration, ctx.runtime, event.toolName)) return;
			try {
				return await withTimeout(Promise.resolve(handler(event, ctx)), timeoutMs ?? 0, `agent tool result middleware for ${record.id}`);
			} catch (error) {
				registryParams.logger.warn(`[plugins] agent tool result middleware failed for ${record.id}`);
				throw error;
			}
		};
		const registration = {
			...createRegistration(record, {
				handler: safeHandler,
				runtimes,
				scopes: [{
					runtimes,
					...matcher ? { matcher } : {}
				}]
			}),
			rawHandler: handler
		};
		registry.agentToolResultMiddlewares.push(registration);
	};
	const registerTool = (record, tool, opts) => {
		if (pluginsWithChannelRegistrationConflict.has(record.id)) return;
		let declaredNames = declaredToolNames.get(record);
		if (!declaredNames) {
			declaredNames = new Set(normalizePluginToolContractNames(record.contracts));
			declaredToolNames.set(record, declaredNames);
		}
		if (declaredNames.size === 0) {
			reportRegistrationError(record, "plugin must declare contracts.tools before registering agent tools");
			return;
		}
		const names = [...opts?.names ?? [], ...opts?.name ? [opts.name] : []];
		const optional = opts?.optional === true;
		const versioned = typeof tool !== "function" && "contextVersion" in tool;
		if (versioned && (tool.contextVersion !== 2 || typeof tool.create !== "function")) {
			reportRegistrationError(record, "unsupported plugin tool context version");
			return;
		}
		const factory = typeof tool === "function" ? tool : versioned ? (ctx) => {
			if (!ctx.assertInvocationCurrent) throw new Error("Version 2 tool factories require host invocation authority");
			return tool.create({
				...ctx,
				get senderIsOwner() {
					return ctx.senderIsOwner;
				},
				assertInvocationCurrent: ctx.assertInvocationCurrent
			});
		} : (_ctx) => tool;
		if (typeof tool !== "function" && !versioned) names.push(tool.name);
		const normalized = normalizePluginToolNames(names);
		const undeclared = normalized.filter((name) => !declaredNames.has(name));
		if (undeclared.length > 0) {
			reportRegistrationError(record, `plugin must declare contracts.tools for: ${undeclared.join(", ")}`);
			return;
		}
		if (normalized.length > 0) record.toolNames.push(...normalized);
		getPluginInstance(record)?.admitFactory(factory);
		registry.tools.push({
			...createRegistration(record, {
				factory,
				...versioned ? { contextVersion: 2 } : {},
				names: normalized,
				optional,
				origin: record.origin
			}),
			declaredNames
		});
	};
	const registerHook = (record, events, handler, opts, config, pluginConfig) => {
		const normalizedEvents = normalizeStringEntries(Array.isArray(events) ? events : [events]);
		for (const event of normalizedEvents) if (isPluginHookName(event)) reportRegistrationWarning(record, `hook event "${event}" is dispatched by the typed hook runner only; api.registerHook registrations for it are not invoked. Use api.on("${event}", ...) instead.`);
		const entry = opts?.entry ?? null;
		const hookName = entry?.hook.name ?? opts?.name?.trim();
		if (!hookName) throw new Error("hook registration missing name");
		const existingHook = registry.hooks.find((entryLocal) => entryLocal.entry.hook.name === hookName);
		if (existingHook) {
			reportRegistrationError(record, `hook already registered: ${hookName} (${existingHook.pluginId})`);
			return;
		}
		const description = entry?.hook.description ?? opts?.description ?? "";
		const hookEntry = {
			...entry ?? {
				frontmatter: {},
				invocation: { enabled: true }
			},
			hook: {
				...entry?.hook ?? {
					filePath: record.source,
					baseDir: path.dirname(record.source),
					handlerPath: record.source
				},
				name: hookName,
				description,
				source: "openclaw-plugin",
				pluginId: record.id
			},
			metadata: {
				...entry?.metadata,
				events: normalizedEvents
			}
		};
		record.hookNames.push(hookName);
		registry.hooks.push({
			pluginId: record.id,
			entry: hookEntry,
			events: normalizedEvents,
			source: record.source
		});
		if (!(config?.hooks?.internal?.enabled !== false) || opts?.register === false) return;
		for (const event of normalizedEvents) {
			const wrappedHandler = async (evt) => {
				const context = evt.context;
				const hadPluginConfig = Object.hasOwn(context, "pluginConfig");
				const previousPluginConfig = context.pluginConfig;
				context.pluginConfig = pluginConfig;
				try {
					return await handler({
						...evt,
						context
					});
				} finally {
					if (hadPluginConfig) context.pluginConfig = previousPluginConfig;
					else delete context.pluginConfig;
				}
			};
			registry.legacyInternalHooks.push({
				pluginId: record.id,
				name: hookName,
				event,
				handler: wrappedHandler
			});
		}
	};
	const registerTypedHook = (record, hookName, handler, opts, policy) => {
		if (!isPluginHookName(hookName)) {
			reportRegistrationWarning(record, `unknown typed hook "${String(hookName)}" ignored`);
			return;
		}
		if (!resolvePromptInjectionAllowed(policy) && isPromptInjectionHookName(hookName)) {
			reportRegistrationWarning(record, `typed hook "${hookName}" blocked by plugins.entries.${record.id}.hooks.allowPromptInjection=false`);
			return;
		}
		const conversationAccessAllowed = resolveConversationAccessAllowed(record.origin, policy);
		if (isConversationHookName(hookName) && !conversationAccessAllowed) {
			if (record.origin !== "bundled") {
				reportRegistrationWarning(record, `typed hook "${hookName}" blocked because non-bundled plugins must set plugins.entries.${record.id}.hooks.allowConversationAccess=true`);
				return;
			}
			reportRegistrationWarning(record, `typed hook "${hookName}" blocked by plugins.entries.${record.id}.hooks.allowConversationAccess=false`);
			return;
		}
		const timeoutMs = resolveTypedHookTimeoutMs({
			hookName,
			opts,
			policy
		});
		const eligibleTriggers = hookName === "before_agent_reply" ? normalizeHookEligibility(opts?.eligibleTriggers, isPluginHookAgentTrigger) : void 0;
		const eligibleDispatchKinds = hookName === "reply_dispatch" ? normalizeHookEligibility(opts?.eligibleDispatchKinds, isPluginHookReplyDispatchKind) : void 0;
		const matcher = hookName === "before_tool_call" || hookName === "after_tool_call" ? normalizePluginToolMatcher(opts?.matcher) : void 0;
		if (opts?.matcher && hookName !== "before_tool_call" && hookName !== "after_tool_call") reportRegistrationWarning(record, `typed hook "${hookName}" ignores tool matcher`);
		record.hookCount += 1;
		registry.typedHooks.push({
			pluginId: record.id,
			...opts?.registrationId ? { registrationId: opts.registrationId } : {},
			hookName,
			handler,
			...matcher ? { matcher } : {},
			priority: opts?.priority,
			...timeoutMs !== void 0 ? { timeoutMs } : {},
			...eligibleTriggers ? { eligibleTriggers } : {},
			...eligibleDispatchKinds ? { eligibleDispatchKinds } : {},
			...hookName === "before_prompt_build" && opts?.requiresToolAuthority === true ? { requiresToolAuthority: true } : {},
			...hookName === "session_end" && conversationAccessAllowed ? { conversationAccessAllowed: true } : {},
			source: record.source
		});
	};
	return {
		registerCodexAppServerExtensionFactory,
		registerAgentToolResultMiddleware,
		registerTool,
		registerHook,
		registerTypedHook
	};
}
//#endregion
//#region src/plugins/registry-registrars.ts
/** Compose domain registrars over one explicit mutable registry state. */
function createPluginRegistrars(state) {
	return {
		...createCapabilityRegistrars(state),
		...createToolHookRegistrars(state),
		...createNetworkRegistrars(state),
		...createProviderRegistrars(state),
		...createOperationRegistrars(state),
		...createHostRegistrars(state),
		...createMemoryRegistrars(state),
		registerModelCatalogProvider: state.registerModelCatalogProvider
	};
}
//#endregion
//#region src/plugin-state/plugin-blob-worker-client.ts
async function execute(env, command, prepare) {
	const databasePath = resolveOpenClawStateSqlitePath(env ?? process.env);
	const description = pluginBlobWorkerOperations[command.type];
	let dispatched = false;
	let preparation;
	try {
		preparation = prepare?.();
		const context = captureOpenClawStateWorkerContext({
			path: databasePath,
			env
		});
		const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-RW5P1VzC.mjs");
		return await runOpenClawStateWorkerOperation(context, async (scope) => {
			dispatched = true;
			return await (preparation ? preparation.handoff(() => scope.execute(command)) : scope.execute(command));
		}, { assertCurrent: preparation?.assertCurrent });
	} catch (error) {
		throw wrapPluginBlobError(error, description.operation, dispatched ? "PLUGIN_BLOB_WRITE_FAILED" : "PLUGIN_BLOB_OPEN_FAILED", dispatched ? description.message : "Failed to open plugin blob store.", env, databasePath);
	} finally {
		preparation?.release();
	}
}
function captureRegistrationInput(type, input) {
	const metadataBytes = serialize({
		type,
		input: {
			...input,
			bytes: /* @__PURE__ */ new Uint8Array()
		}
	}).byteLength;
	const preparation = reserveSqliteWorkerInputPreparation(input.bytes.byteLength + metadataBytes);
	try {
		input.bytes = Uint8Array.from(input.bytes);
		return preparation;
	} catch (error) {
		preparation.release();
		throw error;
	}
}
function registerPluginBlobInWorker(params) {
	const { env, ...input } = params;
	return execute(env, {
		type: "pluginBlob.register",
		input
	}, () => captureRegistrationInput("pluginBlob.register", input));
}
function registerPluginBlobIfAbsentInWorker(params) {
	const { env, ...input } = params;
	return execute(env, {
		type: "pluginBlob.registerIfAbsent",
		input
	}, () => captureRegistrationInput("pluginBlob.registerIfAbsent", input));
}
function deletePluginBlobInWorker(params) {
	const { env, ...input } = params;
	return execute(env, {
		type: "pluginBlob.delete",
		input
	});
}
async function deleteExpiredPluginBlobKeyInWorker(params) {
	const { env, ...input } = params;
	return await execute(env, {
		type: "pluginBlob.deleteExpiredKey",
		input
	});
}
async function deleteExpiredPluginBlobsInWorker(params) {
	const { env, ...input } = params;
	return await execute(env, {
		type: "pluginBlob.deleteExpired",
		input
	});
}
function clearPluginBlobsInWorker(params) {
	const { env, ...input } = params;
	return execute(env, {
		type: "pluginBlob.clear",
		input
	});
}
function readPluginBlob(command, env) {
	const databasePath = resolveOpenClawStateSqlitePath(env ?? process.env);
	const operation = command.type === "pluginBlob.lookup" ? "lookup" : "entries";
	return executeExistingOpenClawStateRead({
		path: databasePath,
		env
	}, command, { mapError: (error, phase) => wrapPluginBlobError(error, operation, phase === "before-read" ? "PLUGIN_BLOB_OPEN_FAILED" : "PLUGIN_BLOB_READ_FAILED", phase === "before-read" ? "Failed to open plugin blob store." : operation === "lookup" ? "Failed to read plugin blob entry." : "Failed to list plugin blob entries.", env, databasePath) });
}
async function lookupPluginBlobInWorker(params) {
	const { env, ...input } = params;
	const reply = await readPluginBlob({
		type: "pluginBlob.lookup",
		input
	}, env);
	if (reply === void 0) return;
	if (reply.ok && reply.type === "pluginBlob.lookup") return reply.value;
	throw new Error("Unexpected plugin blob lookup reply");
}
async function listPluginBlobsInWorker(params) {
	const { env, ...input } = params;
	const reply = await readPluginBlob({
		type: "pluginBlob.entries",
		input
	}, env);
	if (reply === void 0) return [];
	if (reply.ok && reply.type === "pluginBlob.entries") return reply.value;
	throw new Error("Unexpected plugin blob entries reply");
}
//#endregion
//#region src/plugin-state/plugin-blob-store.ts
function invalidInput(message, operation = "register") {
	return new PluginBlobStoreError(message, {
		code: "PLUGIN_BLOB_INVALID_INPUT",
		operation
	});
}
function limitError(message) {
	return new PluginBlobStoreError(message, {
		code: "PLUGIN_BLOB_LIMIT_EXCEEDED",
		operation: "register"
	});
}
function validateNamespace(value) {
	return validatePluginStoreNamespace({
		value,
		label: "plugin blob",
		invalid: (message) => invalidInput(message, "open")
	});
}
function validateKey(value, operation) {
	return validatePluginStoreKey({
		value,
		label: "plugin blob",
		invalid: (message) => invalidInput(message, operation)
	});
}
function validatePositiveLimit(value, label, maximum) {
	const normalized = validatePluginStorePositiveInteger({
		value,
		label,
		invalid: (message) => invalidInput(message, "open")
	});
	if (normalized > maximum) throw invalidInput(`${label} must be <= ${maximum}`, "open");
	return normalized;
}
const optionPolicy = createPluginStoreOptionPolicy({
	label: "plugin blob",
	invalid: (message) => invalidInput(message, "open")
});
function validateTtl(value, operation) {
	return validateOptionalPluginStoreTtlMs({
		value,
		label: "plugin blob ttlMs",
		invalid: (message) => invalidInput(message, operation)
	});
}
function createPluginBlobStoreInternal(pluginId, options, env) {
	if (pluginId.startsWith("core:")) throw invalidInput("Plugin ids starting with 'core:' are reserved for core consumers.", "open");
	const namespace = validateNamespace(options.namespace);
	const maxEntries = validatePositiveLimit(options.maxEntries, "plugin blob maxEntries", MAX_PLUGIN_BLOB_ENTRIES_PER_PLUGIN);
	const maxBytesPerEntry = validatePositiveLimit(options.maxBytesPerEntry, "plugin blob maxBytesPerEntry", MAX_PLUGIN_BLOB_BYTES_PER_ENTRY);
	const maxBytesPerNamespace = validatePositiveLimit(options.maxBytesPerNamespace, "plugin blob maxBytesPerNamespace", MAX_PLUGIN_BLOB_BYTES_PER_PLUGIN);
	if (maxBytesPerEntry > maxBytesPerNamespace) throw invalidInput("plugin blob maxBytesPerEntry must not exceed maxBytesPerNamespace", "open");
	const overflowPolicy = optionPolicy.resolveOverflowPolicy(options.overflowPolicy);
	const defaultTtlMs = validateTtl(options.defaultTtlMs, "open");
	optionPolicy.assertConsistent(pluginId, namespace, {
		maxEntries,
		maxBytesPerEntry,
		maxBytesPerNamespace,
		overflowPolicy,
		defaultTtlMs
	});
	const scope = {
		pluginId,
		namespace,
		...env ? { env } : {}
	};
	const prepareWrite = (key, bytes, metadata, opts) => {
		const normalizedKey = validateKey(key, "register");
		if (!(bytes instanceof Uint8Array)) throw invalidInput("plugin blob bytes must be a Uint8Array");
		if (bytes.byteLength > maxBytesPerEntry) throw limitError(`plugin blob entry exceeds the configured ${maxBytesPerEntry} byte limit`);
		const metadataJson = serializePluginStoreJson({
			value: metadata,
			label: "plugin blob metadata",
			errors: {
				invalid: invalidInput,
				limit: limitError
			}
		});
		const ttlMs = validateTtl(opts?.ttlMs, "register") ?? defaultTtlMs;
		return {
			...scope,
			key: normalizedKey,
			bytes,
			metadataJson,
			...ttlMs !== void 0 ? { ttlMs } : {},
			maxEntries,
			maxBytesPerNamespace,
			overflowPolicy
		};
	};
	return {
		async register(key, bytes, metadata, opts) {
			await registerPluginBlobInWorker(prepareWrite(key, bytes, metadata, opts));
		},
		async registerIfAbsent(key, bytes, metadata, opts) {
			return registerPluginBlobIfAbsentInWorker(prepareWrite(key, bytes, metadata, opts));
		},
		async lookup(key) {
			return lookupPluginBlobInWorker({
				...scope,
				key: validateKey(key, "lookup")
			});
		},
		async entries() {
			return listPluginBlobsInWorker(scope);
		},
		async delete(key) {
			return deletePluginBlobInWorker({
				...scope,
				key: validateKey(key, "delete")
			});
		},
		async deleteExpiredKey(key) {
			return deleteExpiredPluginBlobKeyInWorker({
				...scope,
				key: validateKey(key, "sweep")
			});
		},
		async deleteExpired() {
			return deleteExpiredPluginBlobsInWorker(scope);
		},
		async clear() {
			await clearPluginBlobsInWorker(scope);
		}
	};
}
/** Opens an async blob namespace for a non-core plugin id. */
function createPluginBlobStore(pluginId, options) {
	return createPluginBlobStoreInternal(pluginId, options);
}
//#endregion
//#region src/plugins/registry-runtime.ts
function createPluginRuntimeResolver(state) {
	const { registry, registryParams } = state;
	const pluginRuntimes = /* @__PURE__ */ new WeakMap();
	const registeredChannelRuntime = /* @__PURE__ */ new WeakMap();
	const registeredRuntimeRecordById = /* @__PURE__ */ new Map();
	const registeredAdmissionOwnerByRecord = /* @__PURE__ */ new WeakMap();
	const addPluginRuntimeResolutionContext = (params) => {
		const { error, record, prop } = params;
		if (error instanceof Error && error.message.startsWith("Unable to resolve plugin runtime module") && !error.message.includes("pluginRuntimeContext=")) {
			const propName = typeof prop === "symbol" ? prop.description ?? prop.toString() : String(prop);
			error.message = [
				error.message,
				`pluginRuntimeContext=pluginId:${record.id}`,
				`property:${propName}`,
				...record.source ? [`source:${record.source}`] : []
			].join("; ");
		}
		throw error;
	};
	const resolveRecordChannelRuntime = (record) => {
		const cached = registeredChannelRuntime.get(record);
		const cachedOwner = registeredAdmissionOwnerByRecord.get(record);
		if (cached && cachedOwner?.isLive() === true) return cached;
		if (cachedOwner) {
			cachedOwner.dispose();
			registeredAdmissionOwnerByRecord.delete(record);
		}
		const channel = (() => {
			try {
				return Reflect.get(registryParams.runtime, "channel", registryParams.runtime);
			} catch (error) {
				return addPluginRuntimeResolutionContext({
					error,
					record,
					prop: "channel"
				});
			}
		})();
		if (record.origin !== "bundled" && record.trustedOfficialInstall !== true || !registry.channels.some((entry) => entry.pluginId === record.id) || !isPluginRecordActive(registry, record)) return channel;
		let closed = false;
		const ownsLiveRegistrySlot = () => !closed && registeredRuntimeRecordById.get(record.id) === record && isPluginRecordActive(registry, record);
		const previousRecord = registeredRuntimeRecordById.get(record.id);
		if (previousRecord && previousRecord !== record) {
			registeredAdmissionOwnerByRecord.get(previousRecord)?.dispose();
			registeredAdmissionOwnerByRecord.delete(previousRecord);
			revokePluginRecord(registry, previousRecord);
		}
		registeredRuntimeRecordById.set(record.id, record);
		const resolveGatewayContext = getGatewayContextResolver(registryParams.runtime.subagent);
		const scopedGatewayContext = resolveGatewayContext ? () => ownsLiveRegistrySlot() ? resolveGatewayContext() : void 0 : void 0;
		if (scopedGatewayContext && resolveGatewayContext) bindGatewayContextResolver(scopedGatewayContext, getCanonicalGatewayContextResolver(resolveGatewayContext));
		const owner = Object.freeze({
			channelId: record.id,
			resolveGatewayContext: scopedGatewayContext,
			isLive: ownsLiveRegistrySlot
		});
		registeredAdmissionOwnerByRecord.set(record, {
			isLive: owner.isLive,
			dispose: () => {
				closed = true;
			}
		});
		const buildHostContext = createHostChannelInboundEventContextBuilder(channel.inbound.buildContext, owner);
		const buildContext = ((params) => {
			return buildHostContext(params);
		});
		const inbound = {
			...channel.inbound,
			ingress: createHostChannelIngressRuntime(owner),
			buildContext
		};
		const scoped = {
			...channel,
			inbound,
			turn: inbound
		};
		registeredChannelRuntime.set(record, scoped);
		return scoped;
	};
	const resolvePluginRuntime = (record) => {
		const pluginId = record.id;
		const cached = pluginRuntimes.get(record);
		if (cached) return cached;
		const currentRegistry = () => getPluginRecordRegistry(registry, record);
		const currentDecisionRegistry = () => {
			const owner = currentRegistry();
			const invocationView = getPluginRuntimeGatewayRequestScope()?.pluginRegistry;
			return invocationView?.plugins.includes(record) && getPluginRegistryResourceOwner(invocationView) === owner ? invocationView : owner;
		};
		const resolveDelegatedRuntime = (ownerPluginId) => {
			const owner = currentRegistry().plugins.find((entry) => entry.id === ownerPluginId);
			if (!owner) throw new Error(`Plugin "${ownerPluginId}" runtime is no longer active.`);
			return resolvePluginRuntime(owner);
		};
		const assertRuntimeCurrent = () => {
			if (!capturePluginLifecycleAuthority(currentRegistry(), record, {
				scopedRuntime: registryParams.activateGlobalSideEffects === false,
				registration: true,
				admittedRuntime: true
			})?.()) throw new Error(`Plugin "${pluginId}" runtime is no longer active.`);
		};
		const loadSessionOwnership = createLazyRuntimeSurface(() => import("./registry-runtime-session-ownership-BclKUjRx.mjs"), (module) => module.createPluginSessionOwnership(state, pluginId, currentRegistry));
		let scopedAgentRuntime;
		const runtime = new Proxy(registryParams.runtime, { get(target, prop, receiver) {
			const runWithPluginScope = (run, requireActive = true) => {
				if (requireActive) assertRuntimeCurrent();
				const scopedRegistry = currentRegistry();
				return withPluginRuntimePluginScope({
					pluginId,
					pluginSource: record.source,
					pluginOrigin: record.origin,
					pluginTrustedOfficialInstall: record.trustedOfficialInstall
				}, run, scopedRegistry);
			};
			const getRuntimeProperty = () => {
				try {
					return Reflect.get(target, prop, receiver);
				} catch (error) {
					return addPluginRuntimeResolutionContext({
						error,
						record,
						prop
					});
				}
			};
			if (prop === "state") {
				const baseState = getRuntimeProperty();
				return {
					...baseState,
					openBlobStore: (options) => {
						return createPluginBlobStore(pluginId, options);
					},
					openKeyedStore: (options) => {
						if (options.retention === "retained") assertRuntimeCurrent();
						return createPluginStateKeyedStore(pluginId, options, assertRuntimeCurrent);
					},
					openSyncKeyedStore: (options) => {
						return createPluginStateSyncKeyedStore(pluginId, options);
					},
					openChannelIngressQueue: (options) => {
						const stateDir = options?.stateDir ?? baseState.resolveStateDir();
						return createChannelIngressQueue({
							...options,
							channelId: pluginId,
							stateDir
						}, assertRuntimeCurrent);
					},
					openChannelIngressDrain: (options) => {
						const stateDir = options.stateDir ?? baseState.resolveStateDir();
						const queue = options.queue ?? createChannelIngressQueue({
							channelId: pluginId,
							accountId: options.accountId,
							stateDir
						}, assertRuntimeCurrent);
						const { queue: _queue, accountId: _accountId, stateDir: _stateDir, ...drainOptions } = options;
						return createChannelIngressDrain({
							...drainOptions,
							queue
						});
					}
				};
			}
			if (prop === "config") {
				const config = getRuntimeProperty();
				return {
					...config,
					current: () => runWithPluginScope(() => config.current(), false),
					mutateConfigFile: (params) => runWithPluginScope(() => config.mutateConfigFile(params)),
					replaceConfigFile: (params) => runWithPluginScope(() => config.replaceConfigFile(params))
				};
			}
			if (prop === "system") {
				const system = getRuntimeProperty();
				const route = (run) => {
					assertRuntimeCurrent();
					if (isPluginRegistryPreparing(registry) && !isPluginRecordActive(registry, record)) throw new Error(`Plugin "${pluginId}" cannot route system events during replacement preparation.`);
					return runWithPluginScope(run);
				};
				return {
					...system,
					enqueueSystemEvent: (...args) => route(() => system.enqueueSystemEvent(...args)),
					requestHeartbeat: (...args) => route(() => system.requestHeartbeat(...args)),
					requestHeartbeatNow: (...args) => route(() => system.requestHeartbeatNow(...args)),
					runHeartbeatOnce: (...args) => route(() => system.runHeartbeatOnce(...args)),
					runCommandWithTimeout: (...args) => runWithPluginScope(() => system.runCommandWithTimeout(...args))
				};
			}
			if (prop === "channel") return resolveRecordChannelRuntime(record);
			if (prop === "decisions") return { evaluate: async (batch, options) => {
				assertRuntimeCurrent();
				const { evaluateDecisionInRegistry } = await import("./runtime-DW_NDe8x.mjs");
				assertRuntimeCurrent();
				const result = await evaluateDecisionInRegistry(batch, options, currentDecisionRegistry(), getRuntimeConfig(), record.id);
				assertRuntimeCurrent();
				options.signal.throwIfAborted();
				return result;
			} };
			if (prop === "llm") {
				const llm = getRuntimeProperty();
				return {
					acquireLocalService: (...args) => runWithPluginScope(() => llm.acquireLocalService(...args)),
					complete: (params) => runWithPluginScope(() => llm.complete(params))
				};
			}
			if (prop === "gateway") {
				const gateway = getRuntimeProperty();
				const withIdentity = gateway.withUserProfileIdentity;
				return {
					isAvailable: () => runWithPluginScope(() => gateway.isAvailable(), false),
					request: async (method, params, options) => {
						const { assertGatewaySessionRequestOwned } = await loadSessionOwnership();
						return await runWithPluginScope(async () => {
							assertGatewaySessionRequestOwned(method, params);
							return await gateway.request(method, params, options);
						});
					},
					openPluginPanel: (params) => runWithPluginScope(async () => {
						const result = await gateway.openPluginPanel(params);
						assertRuntimeCurrent();
						return result;
					}),
					readSessionFacts: (params) => runWithPluginScope(async () => {
						const result = await gateway.readSessionFacts(params);
						assertRuntimeCurrent();
						return result;
					}),
					subscribeSessionChanges: (listener) => runWithPluginScope(() => gateway.subscribeSessionChanges((event) => runWithPluginScope(() => listener(event)))),
					withUserProfileIdentity: withIdentity ? async (params, run) => await runWithPluginScope(async () => {
						const result = await withIdentity(params, async (assertIdentityCurrent) => {
							const assertCurrent = () => {
								assertRuntimeCurrent();
								assertIdentityCurrent();
							};
							assertCurrent();
							return await run(assertCurrent);
						});
						assertRuntimeCurrent();
						return result;
					}) : void 0
				};
			}
			if (prop === "hooks") {
				const hooks = getRuntimeProperty();
				return { dispatchHookAgentTurn: async (params) => {
					if (record.origin !== "bundled" && record.trustedOfficialInstall !== true) throw new PluginTrustRefusalError({
						pluginId,
						source: record.source,
						origin: record.origin,
						trust: record.trust
					});
					return await runWithPluginScope(() => hooks.dispatchHookAgentTurn(params));
				} };
			}
			if (prop === "nodes") {
				const nodes = getRuntimeProperty();
				return {
					list: (params) => runWithPluginScope(() => nodes.list(params)),
					invoke: (params) => runWithPluginScope(() => nodes.invoke(params)),
					openDuplex: (params) => runWithPluginScope(() => nodes.openDuplex(params))
				};
			}
			if (prop === "agent") {
				if (scopedAgentRuntime) return scopedAgentRuntime;
				const agent = getRuntimeProperty();
				const session = agent.session;
				const scopedSession = {
					resolveStorePath: session.resolveStorePath,
					getSessionEntry: session.getSessionEntry,
					listSessionEntries: session.listSessionEntries,
					createSessionEntry: async (params) => {
						const { assertOwnedHarness, assertReservedSessionKeyOwned } = await loadSessionOwnership();
						return await runWithPluginScope(async () => {
							if ([
								"agentHarnessId" in params.initialEntry,
								"cliBackendId" in params.initialEntry,
								"acpSessionBinding" in params.initialEntry
							].filter(Boolean).length !== 1) throw new Error(`Plugin "${pluginId}" session creation requires exactly one runtime owner.`);
							if ("agentHarnessId" in params.initialEntry) {
								assertOwnedHarness(params.initialEntry.agentHarnessId, "create its sessions");
								assertReservedSessionKeyOwned(params.key, "create");
								return await session.createSessionEntry(params);
							}
							const initialEntry = params.initialEntry;
							if (!("acpSessionBinding" in initialEntry)) {
								const backend = currentRegistry().cliBackends.find((entry) => entry.backend.id === initialEntry.cliBackendId);
								if (!backend || backend.pluginId !== pluginId) throw new Error(`Plugin "${pluginId}" must own CLI backend "${initialEntry.cliBackendId}" to create its sessions.`);
							}
							if (!params.key.startsWith(`plugin:${pluginId}:`)) throw new Error(`Plugin "${pluginId}" session keys must start with "plugin:${pluginId}:".`);
							return await session.createSessionEntry({
								...params,
								initialEntry: {
									...initialEntry,
									pluginOwnerId: pluginId
								}
							});
						});
					},
					patchSessionEntry: async (params) => {
						const { assertStoredSessionEntryOwned, assertStoreEntryOwned } = await loadSessionOwnership();
						return await runWithPluginScope(async () => {
							assertStoredSessionEntryOwned({
								action: "patch",
								sessionKey: params.sessionKey,
								...params.agentId !== void 0 ? { agentId: params.agentId } : {},
								...params.env !== void 0 ? { env: params.env } : {},
								...params.storePath !== void 0 ? { storePath: params.storePath } : {}
							});
							return await session.patchSessionEntry({
								...params,
								update: async (entry, context) => {
									const patch = await params.update(entry, context);
									assertRuntimeCurrent();
									if (!patch) return patch;
									const next = params.replaceEntry ? patch : {
										...entry,
										...patch
									};
									assertStoreEntryOwned({
										action: "patch",
										before: context.existingEntry ?? entry,
										entry: next,
										sessionKey: params.sessionKey
									});
									return patch;
								}
							});
						});
					},
					upsertSessionEntry: async (params) => {
						const { assertStoredSessionEntryOwned, assertStoreEntryOwned } = await loadSessionOwnership();
						return await runWithPluginScope(async () => {
							const before = assertStoredSessionEntryOwned({
								action: "upsert",
								sessionKey: params.sessionKey,
								...params.agentId !== void 0 ? { agentId: params.agentId } : {},
								...params.env !== void 0 ? { env: params.env } : {},
								...params.storePath !== void 0 ? { storePath: params.storePath } : {}
							});
							assertStoreEntryOwned({
								action: "upsert",
								before,
								entry: params.entry,
								sessionKey: params.sessionKey
							});
							await session.upsertSessionEntry(params);
						});
					},
					runWithWorkAdmission: async (params, run) => {
						const { resolveStoredSessionExecutionOwner } = await loadSessionOwnership();
						return await runWithPluginScope(async () => {
							const resolveCurrentExecutionOwner = () => resolveStoredSessionExecutionOwner({
								action: "admit work on",
								sessionKey: params.sessionKey,
								storePath: params.storePath
							});
							const ownerPluginId = resolveCurrentExecutionOwner();
							return await (ownerPluginId ? resolveDelegatedRuntime(ownerPluginId).agent.session : session).runWithWorkAdmission(params, async (signal) => {
								if (resolveCurrentExecutionOwner() !== ownerPluginId) throw new Error(`Session "${params.sessionKey}" changed execution ownership while starting work.`);
								return await runWithPluginScope(() => run(signal));
							});
						});
					},
					updateSessionStoreEntry: async (params) => {
						const { assertStoredSessionEntryOwned, assertStoreEntryOwned } = await loadSessionOwnership();
						return await runWithPluginScope(async () => {
							assertStoredSessionEntryOwned({
								action: "update",
								sessionKey: params.sessionKey,
								storePath: params.storePath
							});
							return await session.updateSessionStoreEntry({
								...params,
								update: async (entry) => {
									const patch = await params.update(entry);
									assertRuntimeCurrent();
									if (!patch) return patch;
									assertStoreEntryOwned({
										action: "update",
										before: entry,
										entry: {
											...entry,
											...patch
										},
										sessionKey: params.sessionKey
									});
									return patch;
								}
							});
						});
					}
				};
				const runEmbeddedAgent = async (params) => {
					const runParams = { ...params };
					const { prepareRunSessionExecution } = await loadSessionOwnership();
					return await runWithPluginScope(async () => {
						const { ownerPluginId, agentHarnessRuntimeOverride } = prepareRunSessionExecution(runParams);
						if (agentHarnessRuntimeOverride !== void 0) runParams.agentHarnessRuntimeOverride = agentHarnessRuntimeOverride;
						if (ownerPluginId) return await resolveDelegatedRuntime(ownerPluginId).agent.runEmbeddedAgent(runParams);
						return await agent.runEmbeddedAgent(runParams);
					});
				};
				const runCommandFromIngress = async (params, commandRuntime) => {
					const { senderIsOwner: claimedOwner, messageChannel, ...remainingParams } = params;
					const senderIsOwner = claimedOwner === true;
					const ingressParams = {
						...remainingParams,
						senderIsOwner,
						messageChannel
					};
					if (senderIsOwner && record.origin !== "bundled" && record.trustedOfficialInstall !== true || currentRegistry().plugins.find((entry) => entry.id === pluginId) !== record || !isPluginRecordActive(registry, record) || !currentRegistry().channels.some((channel) => channel.pluginId === pluginId && channel.plugin.id === messageChannel)) throw new Error(`Plugin "${pluginId}" cannot admit authenticated owner authority for channel "${messageChannel ?? "unknown"}".`);
					return await runWithPluginScope(() => agent.runCommandFromIngress(ingressParams, commandRuntime));
				};
				const scopedAgent = Object.create(Object.getPrototypeOf(agent), Object.getOwnPropertyDescriptors(agent));
				Object.defineProperties(scopedAgent, {
					runCommandFromIngress: {
						configurable: true,
						enumerable: true,
						value: runCommandFromIngress
					},
					runEmbeddedAgent: {
						configurable: true,
						enumerable: true,
						value: runEmbeddedAgent
					},
					session: {
						configurable: true,
						enumerable: true,
						value: scopedSession
					}
				});
				scopedAgentRuntime = scopedAgent;
				return scopedAgentRuntime;
			}
			if (prop !== "subagent") return getRuntimeProperty();
			const subagent = getRuntimeProperty();
			return {
				complete: (params) => runWithPluginScope(() => subagent.complete(params)),
				run: async (params) => {
					const { assertSessionIdentitiesOwned } = await loadSessionOwnership();
					return await runWithPluginScope(async () => {
						assertSessionIdentitiesOwned({
							action: "run",
							sessionKeys: [params.sessionKey]
						});
						return await subagent.run(params);
					});
				},
				waitForRun: (params) => runWithPluginScope(() => subagent.waitForRun(params)),
				getSessionMessages: (params) => runWithPluginScope(() => subagent.getSessionMessages(params)),
				deleteSession: async (params) => {
					const { assertStoredSessionEntryOwned } = await loadSessionOwnership();
					return await runWithPluginScope(async () => {
						assertStoredSessionEntryOwned({
							action: "delete",
							sessionKey: params.sessionKey
						});
						await subagent.deleteSession(params);
					});
				}
			};
		} });
		pluginRuntimes.set(record, runtime);
		return runtime;
	};
	return {
		resolvePluginRuntime,
		resolveRegisteredChannelRuntime: resolveRecordChannelRuntime,
		revokePluginRuntimeRecord: (pluginId, record) => {
			revokePluginRecord(registry, record);
			registeredAdmissionOwnerByRecord.get(record)?.dispose();
			registeredAdmissionOwnerByRecord.delete(record);
			if (registeredRuntimeRecordById.get(pluginId) === record) registeredRuntimeRecordById.delete(pluginId);
		}
	};
}
//#endregion
//#region src/plugins/registry.ts
function clonePluginRecord(record) {
	return Object.fromEntries(Object.entries(record).map(([key, value]) => [key, Array.isArray(value) ? [...value] : value]));
}
/**
* Compose the registry state, domain registrars, scoped runtime, and plugin API.
* Domain modules own validation and mutation; this function owns lifecycle wiring only.
*/
function createPluginRegistry(registryParams) {
	const state = createPluginRegistryState(registryParams);
	const cache = getPluginCache();
	const registrars = createPluginRegistrars(state);
	const runtimeResolver = createPluginRuntimeResolver(state);
	const createPluginApi = createPluginApiFactory(state, registrars, runtimeResolver);
	const registrationRecordSnapshots = /* @__PURE__ */ new WeakMap();
	const createApi = (record, params) => {
		registrationRecordSnapshots.set(record, clonePluginRecord(record));
		const api = createPluginApi(record, params);
		return instrumentPluginInstanceApi(api, getPluginInstance(record) ?? new PluginInstance(record.id, {
			record,
			registry: state.registry
		}));
	};
	const rollbackPluginGlobalSideEffects = (pluginId, record) => {
		runtimeResolver.revokePluginRuntimeRecord(pluginId, record);
		projectPluginContributions(state.registry, record);
		const recordSnapshot = registrationRecordSnapshots.get(record);
		if (recordSnapshot) {
			Object.keys(record).forEach((key) => Reflect.deleteProperty(record, key));
			Object.assign(record, recordSnapshot);
			registrationRecordSnapshots.delete(record);
		}
		const instance = getPluginInstance(record);
		const inspection = getPluginRegistryInspectionResources(state.registry);
		const retire = instance && !instance.disposing ? () => retirePluginCacheInstance(instance, cache) : void 0;
		if (inspection) inspection.rollback(pluginId, retire, instance);
		else if (retire) retire().catch((error) => {
			state.pushDiagnostic({
				level: "warn",
				pluginId,
				source: record.source,
				message: `plugin cleanup failed after registration rollback: ${formatErrorMessage(error)}`
			});
		});
	};
	return {
		...registrars,
		registry: state.registry,
		createApi,
		rollbackPluginGlobalSideEffects,
		pushDiagnostic: state.pushDiagnostic
	};
}
//#endregion
export { resolvePluginCapabilityCatalog as a, capabilityCatalogFamilies as i, listCodexAppServerExtensionFactories as n, projectPluginContributions as r, createPluginRegistry as t };
