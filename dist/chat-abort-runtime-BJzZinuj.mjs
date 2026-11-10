import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { p as normalizeTrimmedStringList, y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { n as getPluginRegistryState } from "./runtime-state-Cd-Ga9cg.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { d as getAgentEventLifecycleGeneration, f as isAgentEventLifecycleGenerationCurrent, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-Bf3Js0D3.mjs";
import { o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { a as capturePluginLifecycleAuthority } from "./registry-lifecycle-CjTFYNkp.mjs";
import { t as getPluginRuntimeGenerationRegistry } from "./generation-state-BWMrcMOM.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import "./generation-scope-CwTBwQp1.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import "./method-scopes-Bcx3NDQr.mjs";
import { a as createAgentRunDirectAbortError } from "./run-termination-Dwf1ksjA.mjs";
import { a as captureExecRequestCustodySelection } from "./exec-request-context-CWnK9ayt.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { I as prepareSessionCapabilityRead } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { i as captureSessionWorkRunInterruptions } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { o as resolveSessionStoreKey } from "./session-store-key-DKpto8R6.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import { h as subagentRuns, i as getCurrentSubagentRunOwner } from "./subagent-registry-memory-DE7WJHOr.mjs";
import { o as isSubagentRunQueued } from "./subagent-run-liveness-DPrFEcUI.mjs";
import { i as getLatestLiveSubagentRunByChildSessionKey } from "./subagent-registry-read-DY0g8fGW.mjs";
import { i as withReadySessionRows } from "./session-row-prepared-read-CSzLs_ad.mjs";
import { r as persistGatewaySessionLifecycleEvent } from "./session-event-payload-jfNs8sPy.mjs";
import { r as resolveChatRunOwnerAgentId, t as chatRunBelongsToAgent } from "./chat-run-owner-BB6L4tWc.mjs";
import { n as isEmbeddedAgentRunActive } from "./active-run-projections-Crpg2l0z.mjs";
import { n as abortEmbeddedAgentRun, w as resolveActiveEmbeddedRunOwner } from "./runs-Czr-I6_B.mjs";
import { n as emitSessionsChanged } from "./session-change-event-0LxChmzi.mjs";
import { n as createChatAbortMarker } from "./server-chat-state-BW_LW3dq.mjs";
import { t as errorShapeFromError } from "./error-shape--ChVezuW.mjs";
import { a as isCurrentChatAbortExecution, i as isChatAbortTerminalPersistenceSettled } from "./chat-abort-lifecycle-internal-EU815r6Q.mjs";
import { r as isChatAbortControllerEntryAbortable, t as abortChatRunById } from "./chat-abort-CKC_-urc.mjs";
import { a as listQueuedChatTurnsForSession, t as abortQueuedChatTurnById } from "./chat-queued-turns-CBHBVpa_.mjs";
import "./subagent-registry-CfK3_UcO.mjs";
import { n as captureExecRequestCancellation } from "./bash-process-control-D15pjJye.mjs";
import { d as resolveSubagentControllerIdentity, i as ensureSubagentControllerOwnsRun, r as captureExecRequestSubagentSelection, u as resolveSubagentController } from "./subagent-control-scope-DL-koOaU.mjs";
import { r as killSubagentRunAdmin, t as killAllControlledSubagentRuns } from "./subagent-control-kill-ByoDJlho.mjs";
import "./subagent-control-WFcqo9OA.mjs";
import { i as setGatewayDedupeEntry } from "./agent-job-CU2r4FPt.mjs";
import { n as buildAbortedAgentPayload } from "./agent-dedupe-1ZfUSRQd.mjs";
import "./session-utils-CGx9I2of.mjs";
import { i as persistAbortedPartials } from "./chat-transcript-persistence-ClpuE6I1.mjs";
import { i as deferAbortedPartialPersistence, l as withQueuedCollectorWarning, n as abortedPartialPersistenceError, r as captureAbortedPartial, s as settleChatAbortPersistence } from "./chat-aborted-partial-BuPGs0tJ.mjs";
import { n as createChatAbortOps, t as captureWorkerInferenceForSession } from "./chat-abort-ops-cs9Qjbw9.mjs";
import { n as pendingChatSendDedupeKey, t as PENDING_CHAT_SEND_DEDUPE_PREFIX } from "./server-shared-C-7Ahu3n.mjs";
//#region src/gateway/server-methods/chat-abort-authorization.ts
function captureAbortTargetIdentity(entries, runId, entry) {
	const { sessionKey, sessionId, agentId } = entry;
	return () => entries.get(runId) === entry && entry.sessionKey === sessionKey && entry.sessionId === sessionId && entry.agentId === agentId;
}
function captureSessionAbortRequestOrigin(params, acceptsRequest) {
	const session = params.session?.ok ? params.session.value : void 0;
	return session?.entry && (params.requiredSessionId === void 0 || session.entry.sessionId === params.requiredSessionId) && (params.sessionId === void 0 || session.entry.sessionId === params.sessionId) ? {
		target: {
			agentId: session.agentId,
			storePath: session.storePath,
			sessionKey: session.canonicalKey,
			sessionId: session.entry.sessionId,
			lifecycleRevision: session.entry.lifecycleRevision ?? null
		},
		acceptsRequest
	} : void 0;
}
function buildAbortedChatSendPayload(params) {
	return {
		runId: params.runId,
		status: "timeout",
		summary: "aborted",
		...params.stopReason ? { stopReason: params.stopReason } : {},
		endedAt: params.endedAt
	};
}
function resolveChatAbortRequester(client, authorization) {
	const scopes = Array.isArray(client?.connect?.scopes) ? client.connect.scopes : [];
	const assertCallerCurrent = (client?.internal?.syntheticClient ? client.internal.agentToolCaller : void 0)?.assertCurrent;
	const sessionTarget = authorization?.admittedTarget;
	const assertCurrent = assertCallerCurrent && authorization && sessionTarget ? composeSessionSourceAssertion([assertCallerCurrent, authorization.assertCurrent]) : void 0;
	assertCurrent?.();
	return {
		connId: normalizeOptionalString(client?.connId),
		deviceId: normalizeOptionalString(client?.connect?.device?.id),
		isAdmin: scopes.includes(ADMIN_SCOPE),
		...assertCurrent && sessionTarget ? { sessionAuthority: {
			target: sessionTarget,
			assertCurrent
		} } : {}
	};
}
function canRequesterAbortChatRun(entry, requester, options = {}) {
	if (requester.sessionAuthority) {
		requester.sessionAuthority.assertCurrent();
		const { target } = requester.sessionAuthority;
		return entry.sessionKey === target.sessionKey && entry.sessionId === target.sessionId && resolveChatRunOwnerAgentId(entry) === target.agentId;
	}
	if (requester.isAdmin) return true;
	const ownerDeviceId = normalizeOptionalString(entry.ownerDeviceId);
	const ownerConnId = normalizeOptionalString(entry.ownerConnId);
	return Boolean(!options.requireOwnerMatch && !ownerDeviceId && !ownerConnId || ownerDeviceId && requester.deviceId && ownerDeviceId === requester.deviceId || ownerConnId && requester.connId && ownerConnId === requester.connId);
}
function readPreRegisteredAgentDedupePayloadForSession(params) {
	if (!params.entry?.ok) return;
	const payload = params.entry.payload;
	if (payload?.status !== "accepted") return;
	const payloadRunId = normalizeOptionalString(payload.runId);
	if (payloadRunId && payloadRunId !== params.runId) return;
	const payloadSessionKeys = /* @__PURE__ */ new Set([normalizeOptionalString(payload.sessionKey), ...Array.isArray(payload.sessionKeyAliases) ? payload.sessionKeyAliases.map(normalizeOptionalString) : []]);
	const hasPayloadSessionKey = [...payloadSessionKeys].some(Boolean);
	if (params.requiredSessionId !== void 0 && (!payloadSessionKeys.has(params.sessionKey) || normalizeOptionalString(payload.sessionId) !== params.requiredSessionId)) return;
	if (hasPayloadSessionKey && !payloadSessionKeys.has(params.sessionKey) || !hasPayloadSessionKey && payloadRunId !== params.runId) return;
	const agentId = normalizeOptionalString(params.agentId)?.toLowerCase();
	if (agentId) {
		if (resolveChatRunOwnerAgentId({
			agentId: normalizeOptionalString(payload.agentId),
			sessionKey: params.sessionKey,
			defaultAgentId: params.defaultAgentId
		}) !== agentId) return;
	}
	return payload;
}
function readPreRegisteredRun(params) {
	if (!params.key.startsWith(params.keyPrefix) || !params.entry?.ok) return;
	const payload = params.entry.payload;
	if (payload?.status !== "accepted") return;
	if (!params.includeHidden && payload.controlUiVisible === false) return;
	const runId = normalizeOptionalString(payload.runId) ?? normalizeOptionalString(params.key.slice(params.keyPrefix.length));
	const sessionKey = normalizeOptionalString(payload.sessionKey);
	if (!runId || !sessionKey) return;
	return {
		runId,
		sessionKey,
		payload
	};
}
function canRequesterAbortPreRegisteredRun(payload, requester) {
	return canRequesterAbortChatRun({
		ownerConnId: normalizeOptionalString(payload.ownerConnId),
		ownerDeviceId: normalizeOptionalString(payload.ownerDeviceId),
		agentId: normalizeOptionalString(payload.agentId),
		sessionKey: normalizeOptionalString(payload.sessionKey),
		sessionId: normalizeOptionalString(payload.sessionId)
	}, requester);
}
function resolvePreRegisteredAgentDedupeKeys(payload, runId) {
	const keys = [`agent:${runId}`];
	const payloadKeys = Array.isArray(payload.dedupeKeys) ? payload.dedupeKeys : [];
	for (const key of payloadKeys) {
		const normalized = normalizeOptionalString(key);
		if (normalized?.startsWith("agent:")) keys.push(normalized);
	}
	return uniqueStrings(keys);
}
function writePreRegisteredAgentAbort(params) {
	if (params.context.dedupe.get(`agent:${params.runId}`)?.payload !== params.expectedPayload) return false;
	const endedAt = params.endedAt ?? Date.now();
	const payloadAgentId = normalizeOptionalString(params.payload.agentId);
	const aborted = normalizeOptionalString(params.payload.reservationId) ? buildAbortedAgentPayload(params.runId, params.stopReason) : {
		runId: params.runId,
		status: "timeout",
		summary: "aborted",
		stopReason: params.stopReason
	};
	for (const key of resolvePreRegisteredAgentDedupeKeys(params.payload, params.runId)) {
		if (params.context.dedupe.get(key)?.payload !== params.expectedPayload) continue;
		setGatewayDedupeEntry({
			dedupe: params.context.dedupe,
			key,
			entry: {
				ts: endedAt,
				ok: true,
				payload: {
					...aborted,
					...params.sessionKey ? { sessionKey: params.sessionKey } : {},
					...payloadAgentId ? { agentId: payloadAgentId } : {},
					...params.payload.controlUiVisible === false ? { controlUiVisible: false } : {},
					endedAt
				}
			}
		});
	}
	return true;
}
function writePreRegisteredChatAbort(params) {
	if (params.expectedPayload && params.context.dedupe.get(pendingChatSendDedupeKey(params.runId))?.payload !== params.expectedPayload) return false;
	const endedAt = params.endedAt ?? Date.now();
	const payload = buildAbortedChatSendPayload({
		runId: params.runId,
		stopReason: params.stopReason,
		endedAt
	});
	params.context.chatRunState.getOrCreate(params.runId).abortMarker = createChatAbortMarker(endedAt);
	const pendingKey = pendingChatSendDedupeKey(params.runId);
	const pendingEntry = params.context.dedupe.get(pendingKey);
	const pendingAttemptId = normalizeOptionalString((pendingEntry?.payload)?.attemptId);
	const ownsPendingAttempt = !params.attemptId || pendingAttemptId === params.attemptId;
	const requestIdentity = pendingEntry ? ownsPendingAttempt ? pendingEntry.requestIdentity : void 0 : params.requestIdentity;
	if (ownsPendingAttempt) params.context.dedupe.delete(pendingKey);
	setGatewayDedupeEntry({
		dedupe: params.context.dedupe,
		key: `chat:${params.runId}`,
		entry: {
			ts: endedAt,
			ok: true,
			payload,
			...requestIdentity ? { requestIdentity } : {}
		}
	});
	return true;
}
function createChatAbortRunSelection() {
	const authorizedByRunId = /* @__PURE__ */ new Map();
	const matchedRunIds = /* @__PURE__ */ new Set();
	const authorization = {
		hasUnauthorizedRuns: false,
		hasUnauthorizedProtectedRuns: false,
		hasProtectedRuns: false
	};
	return {
		add(run, requesterCanAbort, isProtected) {
			matchedRunIds.add(run.runId);
			if (isProtected) {
				authorization.hasProtectedRuns = true;
				authorization.hasUnauthorizedProtectedRuns ||= !requesterCanAbort;
			} else if (requesterCanAbort) authorizedByRunId.set(run.runId, run);
			else authorization.hasUnauthorizedRuns = true;
		},
		result: () => ({
			authorizedRuns: [...authorizedByRunId.values()],
			matchedRunIds: [...matchedRunIds],
			...authorization
		})
	};
}
function resolveAuthorizedPreRegisteredRunsForSessionKeys(params) {
	const sessionKeys = new Set(normalizeTrimmedStringList([...params.sessionKeys]));
	const selection = createChatAbortRunSelection();
	for (const [key, entry] of params.context.dedupe) {
		const run = readPreRegisteredRun({
			key,
			entry,
			keyPrefix: params.keyPrefix,
			includeHidden: true
		});
		if (!run) continue;
		if (params.requiredSessionId !== void 0 && normalizeOptionalString(run.payload.sessionId) !== params.requiredSessionId) continue;
		if (![run.sessionKey, ...Array.isArray(run.payload.sessionKeyAliases) ? run.payload.sessionKeyAliases.map(normalizeOptionalString) : []].some((sessionKey) => Boolean(sessionKey && sessionKeys.has(sessionKey)))) continue;
		if (params.context.chatAbortControllers.has(run.runId)) continue;
		const agentId = normalizeOptionalString(params.agentId)?.toLowerCase();
		if (agentId && !chatRunBelongsToAgent({
			agentId: normalizeOptionalString(run.payload.agentId),
			sessionKey: run.sessionKey,
			defaultAgentId: params.defaultAgentId
		}, agentId)) continue;
		const requesterCanAbort = canRequesterAbortPreRegisteredRun(run.payload, params.requester);
		const isProtected = params.includeProtectedRuns !== true && (run.payload.controlUiVisible === false || params.preserveSideRuns && normalizeOptionalString(run.payload.turnKind) === "btw");
		selection.add(run, requesterCanAbort, isProtected);
	}
	return selection.result();
}
function resolveAuthorizedRunsForSessionKeys(params) {
	const sessionKeys = new Set(normalizeTrimmedStringList([...params.sessionKeys]));
	const sessionIds = new Set(normalizeTrimmedStringList([...params.sessionIds ?? []]));
	const agentId = normalizeOptionalString(params.agentId)?.toLowerCase();
	const selection = createChatAbortRunSelection();
	for (const [runId, active] of params.chatAbortControllers) {
		if (!sessionKeys.has(active.sessionKey) && !sessionIds.has(active.sessionId)) continue;
		if (params.requiredSessionId !== void 0 && (!sessionKeys.has(active.sessionKey) || active.sessionId !== params.requiredSessionId)) continue;
		if (agentId && !chatRunBelongsToAgent({
			agentId: active.agentId,
			sessionKey: active.sessionKey,
			defaultAgentId: params.defaultAgentId
		}, agentId)) continue;
		const requesterCanAbort = canRequesterAbortChatRun(active, params.requester);
		const isProtected = params.includeProtectedRuns !== true && (active.controlUiVisible === false || params.preserveSideRuns && active.turnKind === "btw");
		selection.add({
			runId,
			sessionKey: active.sessionKey,
			sessionId: active.sessionId,
			agentId: active.agentId,
			entry: active
		}, requesterCanAbort, isProtected);
	}
	return selection.result();
}
const SESSION_LIFECYCLE_ABORT_REQUESTER = { isAdmin: true };
function resolveAuthorizedQueuedTurnsForSession(params) {
	const matches = listQueuedChatTurnsForSession({
		chatQueuedTurns: params.context.chatQueuedTurns,
		sessionKeys: params.sessionKeys,
		sessionIds: [params.sessionId],
		requiredSessionId: params.requiredSessionId,
		agentId: params.agentId,
		defaultAgentId: params.defaultAgentId
	});
	const authorized = matches.filter((match) => canRequesterAbortChatRun(match.entry, params.requester)).map((match) => ({
		runId: match.runId,
		entry: match.entry,
		sessionKey: match.entry.sessionKey,
		sessionId: match.entry.sessionId,
		agentId: match.entry.agentId
	}));
	return {
		authorized,
		matchedRunIds: matches.map((match) => match.runId),
		hasUnauthorizedRuns: authorized.length < matches.length
	};
}
/** Authoritative active, pending, or queued Gateway owner for an exact session. */
function hasGatewaySessionAbortOwner(params) {
	const ownerScope = {
		sessionKeys: params.sessionKeys,
		agentId: params.agentId,
		defaultAgentId: params.defaultAgentId,
		requester: SESSION_LIFECYCLE_ABORT_REQUESTER
	};
	return resolveAuthorizedRunsForSessionKeys({
		chatAbortControllers: params.context.chatAbortControllers,
		sessionIds: [params.sessionId],
		...ownerScope,
		includeProtectedRuns: true
	}).authorizedRuns.some(({ entry }) => !isCurrentChatAbortExecution(entry) || !isChatAbortTerminalPersistenceSettled(entry)) || resolveAuthorizedQueuedTurnsForSession({
		context: params.context,
		sessionId: params.sessionId,
		...ownerScope
	}).authorized.length > 0 || ["agent:", "pending-chat:"].some((keyPrefix) => resolveAuthorizedPreRegisteredRunsForSessionKeys({
		context: params.context,
		...ownerScope,
		keyPrefix,
		includeProtectedRuns: true
	}).authorizedRuns.length > 0);
}
//#endregion
//#region src/agents/harness/descendant-cancellation.ts
/** Capture the registered owners before parent cancellation can release its runtime scope. */
async function withAgentHarnessDescendantCancellation(params, run) {
	const scopedRegistry = () => getPluginRuntimeGenerationRegistry() ?? getPluginRuntimeGatewayRequestScope()?.pluginRegistry;
	const scoped = scopedRegistry();
	const registry = scoped ?? getPluginRegistryState()?.activeRegistry;
	const owners = registry?.agentHarnesses.flatMap((registration) => {
		const prepare = registration.harness.withDescendantCancellation;
		if (!prepare) return [];
		const record = registry.plugins.find((plugin) => plugin.id === registration.pluginId);
		return [{
			registration,
			prepare,
			current: record || registration.pluginId === "core" ? capturePluginLifecycleAuthority(registry, record, { scopedRuntime: scoped === registry }) : void 0
		}];
	}) ?? [];
	const cancellations = [];
	const prepareNext = async (index) => {
		const owner = owners[index];
		if (!owner) {
			let called = false;
			return run(async () => {
				if (called) throw new Error("Descendant cancellation was already consumed");
				called = true;
				const results = await Promise.allSettled(cancellations.map((cancel) => cancel()));
				const errors = results.flatMap((result) => result.status === "rejected" ? [result.reason] : [...result.value.errors ?? []]);
				try {
					params.assertCurrent();
				} catch (error) {
					errors.push(error);
				}
				return results.reduce((total, result) => {
					if (result.status === "fulfilled") {
						total.killed += result.value.killed;
						total.cancelledRequesters.push(...result.value.cancelledRequesters);
					}
					return total;
				}, {
					killed: 0,
					cancelledRequesters: [],
					...errors.length ? { errors } : {}
				});
			});
		}
		let active = true;
		const assertCurrent = () => {
			params.assertCurrent();
			if (!active || !owner.current?.() || scoped && scopedRegistry() !== scoped || !registry?.agentHarnesses.includes(owner.registration) || owner.registration.harness.withDescendantCancellation !== owner.prepare) throw new Error("Descendant cancellation harness owner changed");
		};
		try {
			assertCurrent();
			const result = await owner.prepare({
				...params,
				assertCurrent
			}, async (cancel) => {
				assertCurrent();
				cancellations.push(async () => {
					assertCurrent();
					const count = await cancel();
					try {
						assertCurrent();
					} catch (error) {
						return {
							...count,
							errors: [...count.errors ?? [], error]
						};
					}
					return count;
				});
				return prepareNext(index + 1);
			});
			assertCurrent();
			return result;
		} finally {
			active = false;
		}
	};
	return prepareNext(0);
}
//#endregion
//#region src/gateway/server-methods/chat-abort-descendants.ts
async function abortControlledSubagents(params) {
	try {
		var _usingCtx$1 = _usingCtx();
		const controllerParams = {
			cfg: params.cfg,
			agentSessionKey: params.sessionKey,
			agentId: params.agentId
		};
		const identity = resolveSubagentControllerIdentity(controllerParams);
		const preparedController = identity.callerIsSubagent ? await prepareSessionCapabilityRead(() => resolveSubagentController(controllerParams)) : void 0;
		_usingCtx$1.u(preparedController ? { [Symbol.dispose]: preparedController.release } : void 0);
		const controller = preparedController?.read() ?? {
			...identity,
			controlScope: "children"
		};
		const assertCurrent = () => {
			params.assertCurrent?.();
			preparedController?.read();
		};
		let commands = params.execCancellation ?? captureExecRequestCancellation({
			runId: params.requesterTurnRunId,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			sessionId: params.sessionId
		});
		let selected = captureExecRequestSubagentSelection({
			...params,
			controller,
			owners: commands.owners,
			candidateOrigin: params.prepareSelection ? {
				target: {
					sessionKey: controller.controllerSessionKey,
					agentId: controller.controllerAgentId
				},
				acceptsRequest: params.prepareSelection.acceptsRequest
			} : void 0
		});
		let sessionOrigin = params.sessionOrigin;
		const preparation = params.prepareSelection;
		const prepare = preparation ? async () => {
			const prepared = await preparation.prepare();
			commands = prepared.execCancellation;
			sessionOrigin = prepared.sessionOrigin;
			selected = captureExecRequestSubagentSelection({
				...params,
				controller,
				owners: commands.owners,
				sessionOrigin: prepared.sessionOrigin
			});
		} : void 0;
		const requestSelection = {
			runs: selected.runs,
			ownsRoot: (entry) => selected.ownsRoot(entry),
			selectPublishedRoot: preparation || selected.selectPublishedRoot ? (entry) => selected.selectPublishedRoot?.(entry) === true : void 0,
			get sessionGeneration() {
				return selected.sessionGeneration;
			},
			prepare
		};
		let execAborted = false;
		let native;
		const commandErrors = [];
		const beforeKill = async (sealRootSelection = () => {}) => {
			sealRootSelection();
			let entered = false;
			let accepted = false;
			const stop = async (cancelNative) => {
				entered = true;
				if (await params.beforeKill?.(sealRootSelection) === false) return false;
				try {
					assertCurrent();
				} catch (error) {
					if (requestSelection.runs.length === 0) throw error;
					commandErrors.push(error);
					return false;
				}
				accepted = true;
				native = Promise.allSettled([cancelNative()]).then(([result]) => result);
				try {
					execAborted = commands.cancel();
				} finally {
					await native;
				}
				return true;
			};
			const sessionId = params.sessionId ?? sessionOrigin?.target.sessionId;
			if (!sessionId) return stop(async () => ({
				killed: 0,
				cancelledRequesters: []
			}));
			try {
				return await withAgentHarnessDescendantCancellation({
					agentId: controller.controllerAgentId,
					sessionKey: controller.controllerSessionKey,
					sessionId,
					lifecycleRevision: params.lifecycleRevision ?? sessionOrigin?.target.lifecycleRevision ?? void 0,
					requesterTurnRunId: params.requesterTurnRunId,
					acceptsRequest: captureExecRequestCustodySelection(commands.owners, params.requesterTurnRunId === void 0 ? sessionOrigin : void 0),
					assertCurrent
				}, stop);
			} catch (error) {
				if (entered) {
					if (!accepted) throw error;
					commandErrors.push(error);
					return true;
				}
				assertCurrent();
				return stop(async () => {
					throw error;
				});
			}
		};
		let descendants;
		let failure;
		try {
			if (requestSelection.runs.length === 0 && !prepare) await beforeKill();
			else descendants = await killAllControlledSubagentRuns({
				cfg: params.cfg,
				controller,
				runs: requestSelection.runs,
				requestSelection,
				suppressTaskDelivery: true,
				assertCurrent,
				beforeKill
			});
		} catch (error) {
			failure = { error };
		}
		try {
			await commands.settle();
		} catch (error) {
			commandErrors.push(error);
		}
		const settledNative = await native;
		if (settledNative?.status === "fulfilled") commandErrors.push(...settledNative.value.errors ?? []);
		if (settledNative?.status === "rejected") commandErrors.push(settledNative.reason);
		const killed = (descendants?.killed ?? 0) + (settledNative?.status === "fulfilled" ? settledNative.value.killed : 0);
		const cancelledRequesters = settledNative?.status === "fulfilled" ? settledNative.value.cancelledRequesters : [];
		if (failure && !settledNative && !descendants && !execAborted) throw commandErrors.length > 0 ? new AggregateError([failure.error, ...commandErrors], "Request cancellation was incomplete") : failure.error;
		if (failure) commandErrors.push(failure.error);
		if (commandErrors.length > 0) return {
			...descendants ?? {
				killed: 0,
				labels: []
			},
			killed,
			cancelledRequesters,
			status: "error",
			error: [...descendants && descendants.status !== "ok" ? [descendants.error] : [], ...commandErrors.map(formatErrorMessage)].join("; "),
			execAborted: execAborted || descendants?.execAborted === true
		};
		return descendants || execAborted || killed ? {
			...descendants ?? {
				status: "ok",
				killed: 0,
				labels: []
			},
			killed,
			cancelledRequesters,
			execAborted: execAborted || descendants?.execAborted === true
		} : void 0;
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
function descendantAbortError(result, subject) {
	return result && result.status !== "ok" ? errorShape(ErrorCodes.UNAVAILABLE, `${subject} stopped, but descendant cancellation was incomplete: ${result.error}`) : void 0;
}
//#endregion
//#region src/gateway/server-methods/chat-abort-queued-collector-publication.ts
function getQueuedCollectorCancellationRunId(result) {
	return result.found && result.killed && result.targetState?.state === "terminal" && result.targetState.task.status === "cancelled" && result.targetState.task.error === "Subagent run killed." ? result.runId : void 0;
}
/** Retains the initial session incarnation while the kill owner prepares each notice. */
function createQueuedCollectorPublication(params) {
	const { projection } = params;
	const agentId = resolveChatRunOwnerAgentId({
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		defaultAgentId: params.defaultAgentId
	});
	const captured = agentId ? projection?.capture({
		agentId,
		key: params.sessionKey
	}) : void 0;
	let publicationRows;
	let publishedLastRunId;
	return {
		publishSnapshot: (result, settled = false) => {
			if (!params.canPublish()) return;
			const runId = getQueuedCollectorCancellationRunId(result);
			if (runId === void 0) return;
			const row = agentId ? publicationRows?.describe({
				agentId,
				key: params.sessionKey
			}, captured) : void 0;
			const lastRunId = row ? publicationRows?.present(row).lastRunId : void 0;
			if (settled && projection && (lastRunId !== runId || publishedLastRunId === runId)) return;
			emitSessionsChanged(params.context, {
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				sessionId: params.sessionId,
				reason: "abort"
			}, {
				preparedPublication: true,
				sessionRows: publicationRows
			});
			publishedLastRunId = lastRunId;
		},
		prepare: (publish) => publish(async (publishResult) => {
			const publishPrepared = (read) => {
				if (captured && !projection?.isCurrent(captured)) throw new Error("Queued collector session changed before cancellation publication; retry Stop.");
				publicationRows = read;
				try {
					return publishResult();
				} finally {
					publicationRows = void 0;
				}
			};
			if (projection && agentId) return await withReadySessionRows(projection, () => [{
				agentId,
				key: params.sessionKey
			}], publishPrepared, { includeAncestors: true });
			return publishPrepared();
		})
	};
}
//#endregion
//#region src/gateway/server-methods/session-abort-persistence.ts
/** Capture the session writer and lifecycle generation before cancellation can yield. */
function createSessionAbortPersistence(params) {
	return (owner, requireYielded) => persistGatewaySessionLifecycleEvent({
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		assertCommitAllowed: () => {
			params.assertCurrent?.();
			assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
		},
		expectedWriter: {
			...requireYielded ? { requireYielded } : {},
			runId: owner.runId,
			sessionId: owner.sessionId,
			lifecycleRevision: params.lifecycleRevision
		},
		event: {
			runId: owner.runId,
			sessionId: owner.sessionId,
			lifecycleGeneration: params.lifecycleGeneration,
			ts: Date.now(),
			data: {
				phase: "end",
				status: "cancelled",
				aborted: true,
				stopReason: params.stopReason ?? "rpc",
				startedAt: owner.startedAtMs ?? params.startedAt,
				endedAt: Date.now()
			}
		}
	});
}
//#endregion
//#region src/gateway/server-methods/chat-abort-session-plan.ts
/** Resolve once at the cancellation boundary; persist captured partials only after Stop. */
function prepareChatSessionAbort(params, workerCancellation, selectedRunId) {
	const sessionKeys = [params.sessionKey, ...params.sessionKeyAliases ?? []];
	const ownerScope = {
		sessionKeys,
		requiredSessionId: params.requiredSessionId,
		agentId: params.agentId,
		defaultAgentId: params.defaultAgentId,
		requester: params.requester
	};
	const acceptsRequest = (identity) => canRequesterAbortChatRun(identity, params.requester) && (params.includeProtectedRuns === true || identity.controlUiVisible !== false && !(params.preserveSideRuns && identity.turnKind === "btw"));
	const commands = captureExecRequestCancellation({
		sessionKey: params.sessionKey,
		sessionId: params.requiredSessionId ?? params.sessionId,
		agentId: params.agentId
	}, acceptsRequest);
	const session = params.session?.ok ? params.session.value : void 0;
	const persistedSessionId = session?.entry?.sessionId ?? params.sessionId;
	const capturedEmbeddedRun = !params.runId && persistedSessionId ? resolveActiveEmbeddedRunOwner(persistedSessionId) : void 0;
	const sessionEmbeddedRun = params.requiredSessionId === void 0 || capturedEmbeddedRun?.sessionId === params.requiredSessionId && capturedEmbeddedRun.sessionKey !== void 0 && sessionKeys.includes(capturedEmbeddedRun.sessionKey) ? capturedEmbeddedRun : void 0;
	const embeddedController = sessionEmbeddedRun ? params.context.chatAbortControllers.get(sessionEmbeddedRun.runId) : void 0;
	const admittedRuns = params.stopEmbeddedRun && !params.runId && params.sessionKey !== "global" && persistedSessionId && session?.storePath ? captureSessionWorkRunInterruptions({
		scope: session.storePath,
		identities: [...sessionKeys, persistedSessionId],
		accept: (run) => run.sessionKey !== void 0 && sessionKeys.includes(run.sessionKey) && (!run.agentId || !params.agentId || run.agentId === params.agentId) && run.sessionId === (params.requiredSessionId ?? persistedSessionId) && run.runId !== sessionEmbeddedRun?.runId && !params.context.chatAbortControllers.has(run.runId) && acceptsRequest(run)
	}) : [];
	const persistSessionAbort = createSessionAbortPersistence({
		sessionKey: session?.canonicalKey ?? params.sessionKey,
		agentId: session?.agentId ?? params.agentId,
		lifecycleRevision: session?.entry?.lifecycleRevision,
		startedAt: session?.entry?.startedAt,
		lifecycleGeneration: getAgentEventLifecycleGeneration(),
		stopReason: params.stopReason,
		assertCurrent: params.assertCurrent
	});
	const sessionOrigin = captureSessionAbortRequestOrigin(params, acceptsRequest);
	const queuedPlan = resolveAuthorizedQueuedTurnsForSession({
		...ownerScope,
		context: params.context,
		sessionId: params.sessionId
	});
	const activePlan = resolveAuthorizedRunsForSessionKeys({
		...ownerScope,
		chatAbortControllers: params.context.chatAbortControllers,
		sessionIds: [params.sessionId],
		preserveSideRuns: params.preserveSideRuns,
		includeProtectedRuns: params.includeProtectedRuns
	});
	const resolvePendingRuns = (keyPrefix) => resolveAuthorizedPreRegisteredRunsForSessionKeys({
		...ownerScope,
		context: params.context,
		keyPrefix,
		preserveSideRuns: params.preserveSideRuns,
		includeProtectedRuns: params.includeProtectedRuns
	});
	const pendingAgent = resolvePendingRuns("agent:");
	const pendingChat = resolvePendingRuns(PENDING_CHAT_SEND_DEDUPE_PREFIX);
	const runPlans = [
		activePlan,
		pendingAgent,
		pendingChat
	];
	const { authorizedRuns, matchedRunIds: matchedActiveRunIds } = activePlan;
	const hasAuthorizedGatewayRuns = queuedPlan.authorized.length > 0 || runPlans.some((plan) => plan.authorizedRuns.length > 0);
	const isLifecycleAbort = Boolean(params.cascadeDescendants || params.onAuthorizedAfterQueuedAbort || params.onAuthorizedBeforeEmbeddedAbort);
	const hasWorkerRun = Boolean((!hasAuthorizedGatewayRuns || isLifecycleAbort) && workerCancellation?.runIds.length);
	const hasControllerRepresentedWorkerRun = hasWorkerRun && matchedActiveRunIds.some((runId) => workerCancellation?.runIds.includes(runId));
	const hasUnauthorizedOwner = queuedPlan.hasUnauthorizedRuns || runPlans.some((plan) => plan.hasUnauthorizedRuns) || hasWorkerRun && !hasControllerRepresentedWorkerRun && !params.requester.isAdmin;
	const hasProtectedLifecycleRuns = runPlans.some((plan) => plan.hasProtectedRuns);
	const hasUnauthorizedProtectedOwner = runPlans.some((plan) => plan.hasUnauthorizedProtectedRuns);
	const hasUnauthorizedLifecycleOwner = isLifecycleAbort && hasUnauthorizedProtectedOwner;
	const canRunLifecycleCleanup = !hasUnauthorizedOwner && !hasProtectedLifecycleRuns;
	const canCancelWorkerSession = !isLifecycleAbort || !hasProtectedLifecycleRuns;
	let snapshots = [];
	let partialSnapshotUnavailable = false;
	let workerCancellationPersistence;
	let embeddedAbortPersistence;
	const admittedAbortPersistence = [];
	const result = {
		aborted: false,
		runIds: [],
		unauthorized: false
	};
	const recordRun = (runId) => {
		result.aborted = true;
		if (!result.runIds.includes(runId)) result.runIds.push(runId);
	};
	const cancelWorker = () => {
		workerCancellationPersistence = workerCancellation?.cancel({
			assertCurrent: params.assertCurrent,
			onCancelled: recordRun
		});
		workerCancellationPersistence?.catch(() => void 0);
	};
	const abortAdditional = () => {
		if (!canRunLifecycleCleanup) return;
		const wasActive = Boolean(persistedSessionId && isEmbeddedAgentRunActive(persistedSessionId));
		params.assertCurrent?.();
		const embeddedAborted = Boolean(params.stopEmbeddedRun && !params.runId && persistedSessionId && params.sessionKey !== "global" && !embeddedController && (sessionEmbeddedRun ? sessionEmbeddedRun.abort() : params.requiredSessionId === void 0 && abortEmbeddedAgentRun(persistedSessionId)));
		if (embeddedAborted) {
			result.aborted = true;
			if (sessionEmbeddedRun) {
				recordRun(sessionEmbeddedRun.runId);
				embeddedAbortPersistence = persistSessionAbort(sessionEmbeddedRun);
				embeddedAbortPersistence.catch(() => void 0);
			}
		}
		for (const admitted of admittedRuns) {
			params.assertCurrent?.();
			const { runId, sessionId } = admitted.run;
			if (!sessionId || params.context.chatAbortControllers.has(runId) || runId === sessionEmbeddedRun?.runId) continue;
			if (admitted.interrupt(createAgentRunDirectAbortError())) {
				recordRun(runId);
				const persistence = persistSessionAbort({
					runId,
					sessionId,
					startedAtMs: void 0
				});
				persistence.catch(() => void 0);
				admittedAbortPersistence.push(persistence);
			}
		}
		params.assertCurrent?.();
		result.aborted = params.onAuthorizedAfterQueuedAbort?.({
			capturedRunId: sessionEmbeddedRun?.runId,
			controller: embeddedController,
			wasActive,
			aborted: embeddedAborted
		}) || result.aborted;
	};
	const abortAuthorizedRuns = () => {
		params.assertCurrent?.();
		params.onControllerTargets?.(authorizedRuns);
		if (!hasAuthorizedGatewayRuns && (hasUnauthorizedOwner || hasUnauthorizedLifecycleOwner)) {
			result.unauthorized = true;
			return;
		}
		snapshots = authorizedRuns.flatMap(({ runId, entry }) => {
			const text = params.context.chatRunState.resolveBuffer(runId, { final: true }).text;
			if (!text?.trim()) return [];
			if (!params.session) {
				partialSnapshotUnavailable = true;
				params.context.logGateway.warn("chat.abort transcript metadata unavailable; buffered reply was not saved");
				return [];
			}
			return [captureAbortedPartial({
				runId,
				sessionKey: params.sessionKey,
				sessionId: entry.sessionId,
				text,
				abortOrigin: params.abortOrigin,
				resolveTerminalProducer: entry.resolveTerminalProducer,
				session: params.session
			})];
		});
		for (const { runId, sessionKey, sessionId, agentId, entry } of queuedPlan.authorized) {
			params.assertCurrent?.();
			if (params.context.chatQueuedTurns.get(runId) !== entry || entry.sessionKey !== sessionKey || entry.sessionId !== sessionId || entry.agentId !== agentId) continue;
			if (abortQueuedChatTurnById(params.context.chatQueuedTurns, {
				runId,
				sessionKey,
				stopReason: params.stopReason
			}).aborted) recordRun(runId);
		}
		if (canRunLifecycleCleanup) {
			params.assertCurrent?.();
			result.aborted = params.onAuthorizedBeforeEmbeddedAbort?.() || result.aborted;
		}
		for (const { runId, sessionKey, sessionId, agentId, entry } of authorizedRuns) {
			params.assertCurrent?.();
			if (params.context.chatAbortControllers.get(runId) !== entry || entry.sessionKey !== sessionKey || entry.sessionId !== sessionId || entry.agentId !== agentId) continue;
			if (abortChatRunById(params.ops, {
				runId,
				sessionKey,
				stopReason: params.stopReason,
				onAbortCommitted: () => {
					recordRun(runId);
					deferAbortedPartialPersistence(snapshots.find((snapshot) => snapshot.runId === runId), params.context);
				}
			}).aborted) recordRun(runId);
		}
		params.assertCurrent?.();
		if (commands.cancel()) result.aborted = true;
		abortAdditional();
		const endedAt = Date.now();
		const stopReason = params.stopReason ?? "rpc";
		for (const [kind, plan] of [["agent", pendingAgent], ["chat", pendingChat]]) for (const run of plan.authorizedRuns) {
			const { runId, sessionKey, payload } = run;
			params.assertCurrent?.();
			const abort = {
				context: params.context,
				runId,
				stopReason,
				endedAt,
				expectedPayload: payload
			};
			if (kind === "agent" ? writePreRegisteredAgentAbort({
				...abort,
				sessionKey,
				payload
			}) : writePreRegisteredChatAbort({
				...abort,
				attemptId: normalizeOptionalString(payload.attemptId)
			})) recordRun(runId);
		}
		if ((hasAuthorizedGatewayRuns || hasWorkerRun) && params.requester.isAdmin && canCancelWorkerSession) {
			params.assertCurrent?.();
			cancelWorker();
		}
	};
	const hasOtherWork = [
		activePlan,
		queuedPlan,
		pendingAgent,
		pendingChat
	].some((plan) => plan.matchedRunIds.some((runId) => runId !== selectedRunId)) || hasWorkerRun && (!selectedRunId || !workerCancellation?.runIds.includes(selectedRunId));
	return {
		canCascade: canRunLifecycleCleanup && !hasUnauthorizedLifecycleOwner,
		acceptsRequest,
		commands,
		sessionOrigin,
		hasOtherWork,
		result,
		abort: abortAuthorizedRuns,
		async finish() {
			const abortedRunIds = new Set(result.runIds);
			const [worker, partial, exec, embedded, ...admitted] = await Promise.allSettled([
				workerCancellationPersistence,
				result.aborted && snapshots.length > 0 ? persistAbortedPartials({
					context: params.context,
					snapshots: snapshots.filter((snapshot) => abortedRunIds.has(snapshot.runId))
				}) : void 0,
				commands.settle(),
				embeddedAbortPersistence,
				...admittedAbortPersistence
			]);
			const failures = /* @__PURE__ */ new Set();
			for (const settled of [
				worker,
				partial,
				exec,
				embedded,
				...admitted
			]) if (settled.status === "rejected") failures.add(settled.reason);
			if (params.session && !params.session.ok) failures.add(params.session.error);
			const warning = (partial.status === "fulfilled" ? partial.value : void 0) ?? (partialSnapshotUnavailable ? "Stopped, but a reply could not be saved to history. Copy any visible text before leaving this chat." : void 0);
			if (failures.size > 0) {
				const errors = [...failures];
				throw abortedPartialPersistenceError(errors.length === 1 ? errors[0] : new AggregateError(errors, "Chat cancellation persistence failed"), warning);
			}
			return warning;
		}
	};
}
//#endregion
//#region src/gateway/server-methods/chat-abort-runtime.ts
/** Queued collectors retain scheduler ownership while Gateway admission is still pending. */
function abortQueuedCollectorSession(initialParams, prepareSession) {
	let params = initialParams;
	const entry = getLatestLiveSubagentRunByChildSessionKey(params.sessionKey, void 0, params.agentId);
	if (!entry || !isSubagentRunQueued(entry) || params.runId && entry.runId !== params.runId) return;
	let workerCancellation = captureWorkerInferenceForSession({
		context: params.context,
		sessionId: params.sessionId
	});
	const cfg = params.session?.ok ? params.session.value.cfg : params.context.getRuntimeConfig();
	const parentRunId = entry.requesterTurnRunId;
	const parentRun = parentRunId ? params.context.chatAbortControllers.get(parentRunId) : void 0;
	const parentKey = entry.controllerSessionKey?.trim() || entry.requesterSessionKey;
	const controller = {
		controllerSessionKey: parentKey,
		controllerAgentId: resolveChatRunOwnerAgentId({
			sessionKey: parentKey,
			defaultAgentId: entry.requesterAgentId
		})
	};
	const assertCurrent = () => {
		params.assertCurrent?.();
		const current = getCurrentSubagentRunOwner(subagentRuns, entry);
		if (!current || current.execution.status === "queued" && !isSubagentRunQueued(current)) throw new Error("Queued collector reservation changed; retry Stop.");
		const ownershipError = ensureSubagentControllerOwnsRun({
			cfg,
			controller,
			entry: current
		});
		if (ownershipError) throw new Error(ownershipError);
		if (params.requester.isAdmin) return;
		if (!parentRunId || !parentRun || params.context.chatAbortControllers.get(parentRunId) !== parentRun || !isChatAbortControllerEntryAbortable(parentRun) || !parentRun.lifecycleGeneration || !isAgentEventLifecycleGenerationCurrent(parentRun.lifecycleGeneration) || parentRun.projectSessionActive === false || resolveSessionStoreKey({
			cfg,
			sessionKey: parentRun.sessionKey,
			storeAgentId: controller.controllerAgentId
		}) !== parentKey || resolveChatRunOwnerAgentId({
			agentId: parentRun.agentId,
			sessionKey: parentRun.sessionKey
		}) !== controller.controllerAgentId || !canRequesterAbortChatRun(parentRun, params.requester, { requireOwnerMatch: true })) throw new Error("Unauthorized queued collector Stop; use its active parent requester connection or an administrator.");
	};
	return (async () => {
		let sessionAbort;
		let outcome = {
			ok: false,
			error: errorShape(ErrorCodes.UNAVAILABLE, "Queued collector cancellation was not published; retry Stop.")
		};
		let failure;
		try {
			assertCurrent();
			const projection = getSessionRowProjection(params.context);
			if (projection) do
				await projection.ensureMaterialized();
			while (projection.needsMaterialization);
			assertCurrent();
			const publication = createQueuedCollectorPublication({
				context: params.context,
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				get sessionId() {
					return params.sessionId;
				},
				defaultAgentId: params.defaultAgentId,
				projection,
				canPublish: () => !sessionAbort || sessionAbort.ok && !sessionAbort.value.result.unauthorized && sessionAbort.value.canCascade
			});
			let prepared = prepareSession === void 0;
			let preparation;
			await killSubagentRunAdmin({
				cfg,
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				expectedRunId: entry.runId,
				expectedGeneration: entry.generation,
				expectedOwnerKey: entry.requesterSessionKey,
				onResult: (result) => {
					publication.publishSnapshot(result, true);
					if (sessionAbort && !sessionAbort.ok) {
						outcome = sessionAbort;
						return;
					}
					const selected = sessionAbort?.value;
					if (selected?.result.unauthorized) {
						outcome = {
							ok: false,
							error: errorShape(ErrorCodes.INVALID_REQUEST, "unauthorized")
						};
						return;
					}
					if (result.found && result.error) {
						outcome = {
							ok: false,
							error: errorShape(ErrorCodes.UNAVAILABLE, result.error)
						};
						return;
					}
					if (selected && !selected.canCascade) {
						outcome = {
							ok: false,
							error: errorShape(ErrorCodes.UNAVAILABLE, "Queued collector was not stopped; other session work was preserved. Wait for it to finish or cancel it through its owner, then retry.")
						};
						return;
					}
					const cancelledRunId = getQueuedCollectorCancellationRunId(result);
					const aborted = cancelledRunId !== void 0;
					outcome = {
						ok: true,
						value: {
							aborted: aborted || selected?.result.aborted === true,
							runIds: uniqueStrings([...aborted ? [cancelledRunId] : [], ...selected?.result.runIds ?? []])
						}
					};
				}
			}, {
				assertCurrent,
				prepareRead: () => {
					if (prepared || !prepareSession) return;
					return preparation ??= prepareSession().then((session) => {
						params = {
							...params,
							session,
							sessionId: session.ok ? session.value.entry?.sessionId : params.sessionId
						};
						workerCancellation = captureWorkerInferenceForSession(params);
						prepared = true;
					});
				},
				preparePublication: publication,
				beforeSessionKill: async () => {
					await params.beforeAbort?.();
					assertCurrent();
					const plan = prepareChatSessionAbort({
						...params,
						ops: createChatAbortOps(params.context),
						cascadeDescendants: true,
						includeProtectedRuns: params.runId ? true : params.includeProtectedRuns
					}, workerCancellation, entry.runId);
					if (params.runId && plan.hasOtherWork) {
						sessionAbort = {
							ok: false,
							error: errorShape(ErrorCodes.UNAVAILABLE, "Other work is active in this child session; use a full-session Stop without runId.")
						};
						return false;
					}
					sessionAbort = {
						ok: true,
						value: plan
					};
					plan.abort();
					return plan.canCascade;
				}
			});
		} catch (error) {
			failure = { error };
			outcome = {
				ok: false,
				error: errorShapeFromError(ErrorCodes.INVALID_REQUEST, error)
			};
		}
		if (sessionAbort?.ok) try {
			const warning = await sessionAbort.value.finish();
			if (warning) outcome = withQueuedCollectorWarning(outcome, warning);
		} catch (error) {
			if (outcome.ok) throw error;
			throw new AggregateError([failure?.error ?? outcome.error, error], "Queued collector cancellation and persistence failed", { cause: error });
		}
		return outcome;
	})();
}
async function abortChatRunsForSessionKeyWithPartials(initialParams, prepareSession) {
	let params = initialParams;
	if (params.cascadeDescendants) {
		const queuedAbort = abortQueuedCollectorSession(params, prepareSession);
		if (queuedAbort) {
			const result = await queuedAbort;
			return result.ok ? {
				...result.value,
				unauthorized: false
			} : {
				aborted: false,
				runIds: [],
				unauthorized: false,
				error: result.error
			};
		}
	}
	let plan = prepareChatSessionAbort(params, captureWorkerInferenceForSession(params));
	let result = plan.result;
	const prepare = prepareSession ? async () => {
		const session = await prepareSession();
		params = {
			...params,
			session,
			sessionId: session.ok ? session.value.entry?.sessionId : params.sessionId
		};
		plan = prepareChatSessionAbort(params, captureWorkerInferenceForSession(params));
		result = plan.result;
		return {
			execCancellation: plan.commands,
			sessionOrigin: plan.sessionOrigin
		};
	} : void 0;
	let descendants;
	let failure;
	try {
		if (params.cascadeDescendants && plan.canCascade) descendants = await abortControlledSubagents({
			cfg: params.session?.ok ? params.session.value.cfg : params.context.getRuntimeConfig(),
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			sessionId: params.sessionId,
			lifecycleRevision: params.session?.ok ? params.session.value.entry?.lifecycleRevision : void 0,
			execCancellation: plan.commands,
			sessionOrigin: plan.sessionOrigin,
			prepareSelection: prepare ? {
				acceptsRequest: plan.acceptsRequest,
				prepare
			} : void 0,
			assertCurrent: params.assertCurrent,
			beforeKill: async () => {
				await params.beforeAbort?.();
				plan.abort();
				return plan.canCascade;
			}
		});
		else {
			if (prepare) await prepare();
			await params.beforeAbort?.();
			plan.abort();
		}
		if (!result.unauthorized && !result.error) {
			params.assertCurrent?.();
			params.onCancellationStarted?.();
		}
	} catch (error) {
		failure = { error };
	}
	const warning = await settleChatAbortPersistence(() => plan.finish(), failure);
	return {
		...result,
		aborted: result.aborted || Boolean(descendants?.killed || descendants?.continuationRetired || descendants?.execAborted),
		descendants,
		...warning ? { warning } : {}
	};
}
//#endregion
export { descendantAbortError as a, canRequesterAbortPreRegisteredRun as c, hasGatewaySessionAbortOwner as d, readPreRegisteredAgentDedupePayloadForSession as f, writePreRegisteredChatAbort as g, writePreRegisteredAgentAbort as h, abortControlledSubagents as i, captureAbortTargetIdentity as l, resolveChatAbortRequester as m, abortQueuedCollectorSession as n, buildAbortedChatSendPayload as o, readPreRegisteredRun as p, createSessionAbortPersistence as r, canRequesterAbortChatRun as s, abortChatRunsForSessionKeyWithPartials as t, captureSessionAbortRequestOrigin as u };
