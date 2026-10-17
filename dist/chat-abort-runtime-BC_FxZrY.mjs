import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { p as normalizeTrimmedStringList, y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { u as isAgentEventLifecycleGenerationCurrent } from "./agent-events-GvNTkbe3.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-DsrPoRc4.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import "./method-scopes-BrMPjfvW.mjs";
import { a as resolveSessionStoreKey } from "./session-store-key-Ci099tm9.mjs";
import { r as resolveChatRunOwnerAgentId, t as chatRunBelongsToAgent } from "./chat-run-owner-Ci8Mz1ow.mjs";
import { i as isCurrentChatAbortExecution, r as isChatAbortTerminalPersistenceSettled } from "./chat-abort-lifecycle-internal-t_mR3jTJ.mjs";
import { n as createChatAbortMarker } from "./server-chat-state-BP63MB41.mjs";
import { r as isChatAbortControllerEntryAbortable, t as abortChatRunById } from "./chat-abort-DsJ_Zmkt.mjs";
import { a as listQueuedChatTurnsForSession, t as abortQueuedChatTurnById } from "./chat-queued-turns-Dn_FgmH5.mjs";
import { r as getCurrentSubagentRunOwner, u as subagentRuns } from "./subagent-registry-memory-guooOkCK.mjs";
import "./subagent-registry-CbljYI1R.mjs";
import { o as isSubagentRunQueued } from "./subagent-run-liveness-C7bJPLJU.mjs";
import { i as getLatestLiveSubagentRunByChildSessionKey } from "./subagent-registry-read-BE_xWkJl.mjs";
import { i as withReadySessionRows } from "./session-row-prepared-read-BwiDGjfX.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-C2RDnj28.mjs";
import { i as ensureSubagentControllerOwnsRun, l as listControlledSubagentRunsForTurn, u as resolveSubagentController } from "./subagent-control-scope-BUbMQYni.mjs";
import { r as killSubagentRunAdmin, t as killAllControlledSubagentRuns } from "./subagent-control-kill-BZhM9KRs.mjs";
import "./subagent-control-BQtcfH-V.mjs";
import "./session-utils-N4Q5NAko.mjs";
import { i as setGatewayDedupeEntry } from "./agent-job-BgXCyRm3.mjs";
import { t as errorShapeFromError } from "./error-shape-Bqp-ECwX.mjs";
import { r as emitSessionsChanged } from "./session-change-event-CooG4AKR.mjs";
import { n as createChatAbortOps, t as captureWorkerInferenceForSession } from "./chat-abort-ops-BfEknC6Y.mjs";
import { i as deferAbortedPartialPersistence, n as abortedPartialPersistenceError, o as withQueuedCollectorWarning, r as captureAbortedPartial } from "./chat-aborted-partial-CGL7cMIA.mjs";
import { n as pendingChatSendDedupeKey, t as PENDING_CHAT_SEND_DEDUPE_PREFIX } from "./server-shared-C-7Ahu3n.mjs";
import { i as persistAbortedPartials } from "./chat-transcript-persistence-glkdI6Fz.mjs";
//#region src/gateway/server-methods/chat-abort-authorization.ts
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
	const assertCurrent = assertCallerCurrent && authorization && sessionTarget ? () => {
		assertCallerCurrent();
		authorization.assertCurrent();
	} : void 0;
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
	for (const key of resolvePreRegisteredAgentDedupeKeys(params.payload, params.runId)) {
		if (params.context.dedupe.get(key)?.payload !== params.expectedPayload) continue;
		setGatewayDedupeEntry({
			dedupe: params.context.dedupe,
			key,
			entry: {
				ts: endedAt,
				ok: true,
				payload: {
					runId: params.runId,
					...params.sessionKey ? { sessionKey: params.sessionKey } : {},
					...payloadAgentId ? { agentId: payloadAgentId } : {},
					...params.payload.controlUiVisible === false ? { controlUiVisible: false } : {},
					status: "timeout",
					summary: "aborted",
					stopReason: params.stopReason,
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
//#region src/gateway/server-methods/chat-abort-runtime.ts
async function abortControlledSubagents(params) {
	const controller = resolveSubagentController({
		cfg: params.cfg,
		agentSessionKey: params.sessionKey,
		agentId: params.agentId
	});
	const runs = listControlledSubagentRunsForTurn(controller, params.requesterTurnRunId);
	if (runs.length === 0) {
		await params.beforeKill?.();
		return;
	}
	return killAllControlledSubagentRuns({
		cfg: params.cfg,
		controller,
		runs,
		suppressTaskDelivery: true,
		assertCurrent: params.assertCurrent,
		beforeKill: params.beforeKill
	});
}
function descendantAbortError(result, subject) {
	return result && result.status !== "ok" ? errorShape(ErrorCodes.UNAVAILABLE, `${subject} stopped, but descendant cancellation was incomplete: ${result.error}`) : void 0;
}
/** Queued collectors retain scheduler ownership while Gateway admission is still pending. */
function abortQueuedCollectorSession(params) {
	const entry = getLatestLiveSubagentRunByChildSessionKey(params.sessionKey, void 0, params.agentId);
	if (!entry || !isSubagentRunQueued(entry) || params.runId && entry.runId !== params.runId) return;
	const workerCancellation = captureWorkerInferenceForSession({
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
				sessionId: params.sessionId,
				defaultAgentId: params.defaultAgentId,
				projection,
				canPublish: () => !sessionAbort || sessionAbort.ok && !sessionAbort.value.result.unauthorized && sessionAbort.value.canCascade
			});
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
				preparePublication: publication,
				beforeSessionKill: () => {
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
/** Resolve once at the cancellation boundary; persist captured partials only after Stop. */
function prepareChatSessionAbort(params, workerCancellation, selectedRunId) {
	const ownerScope = {
		sessionKeys: [params.sessionKey, ...params.sessionKeyAliases ?? []],
		requiredSessionId: params.requiredSessionId,
		agentId: params.agentId,
		defaultAgentId: params.defaultAgentId,
		requester: params.requester
	};
	const queuedPlan = resolveAuthorizedQueuedTurnsForSession({
		...ownerScope,
		context: params.context,
		sessionId: params.sessionId
	});
	const { authorizedRuns, matchedRunIds: matchedActiveRunIds, hasUnauthorizedRuns: hasUnauthorizedActiveRuns, hasUnauthorizedProtectedRuns: hasUnauthorizedProtectedActiveRuns, hasProtectedRuns: hasProtectedActiveRuns } = resolveAuthorizedRunsForSessionKeys({
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
	const pendingPlans = [pendingAgent, pendingChat];
	const hasAuthorizedGatewayRuns = authorizedRuns.length > 0 || queuedPlan.authorized.length > 0 || pendingPlans.some((plan) => plan.authorizedRuns.length > 0);
	const isLifecycleAbort = Boolean(params.cascadeDescendants || params.onAuthorizedAfterQueuedAbort);
	const hasWorkerRun = Boolean((!hasAuthorizedGatewayRuns || isLifecycleAbort) && workerCancellation?.runIds.length);
	const hasControllerRepresentedWorkerRun = hasWorkerRun && matchedActiveRunIds.some((runId) => workerCancellation?.runIds.includes(runId));
	const hasUnauthorizedOwner = hasUnauthorizedActiveRuns || queuedPlan.hasUnauthorizedRuns || pendingPlans.some((plan) => plan.hasUnauthorizedRuns) || hasWorkerRun && !hasControllerRepresentedWorkerRun && !params.requester.isAdmin;
	const hasProtectedLifecycleRuns = hasProtectedActiveRuns || pendingPlans.some((plan) => plan.hasProtectedRuns);
	const hasUnauthorizedProtectedOwner = hasUnauthorizedProtectedActiveRuns || pendingPlans.some((plan) => plan.hasUnauthorizedProtectedRuns);
	const hasUnauthorizedLifecycleOwner = isLifecycleAbort && hasUnauthorizedProtectedOwner;
	const canRunLifecycleCleanup = !hasUnauthorizedOwner && !hasProtectedLifecycleRuns;
	const canCancelWorkerSession = !isLifecycleAbort || !hasProtectedLifecycleRuns;
	let snapshots = [];
	let workerCancellationPersistence;
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
		if (canRunLifecycleCleanup && params.onAuthorizedAfterQueuedAbort) {
			params.assertCurrent?.();
			result.aborted = params.onAuthorizedAfterQueuedAbort() || result.aborted;
		}
	};
	const abortAuthorizedRuns = () => {
		params.assertCurrent?.();
		params.onControllerTargets?.(authorizedRuns);
		if (!hasAuthorizedGatewayRuns) {
			if (hasUnauthorizedOwner || hasUnauthorizedLifecycleOwner) {
				result.unauthorized = true;
				return;
			}
			abortAdditional();
			if (!hasWorkerRun || !params.requester.isAdmin || !canCancelWorkerSession) return;
			params.assertCurrent?.();
			cancelWorker();
			return;
		}
		snapshots = authorizedRuns.flatMap(({ runId, entry }) => {
			const text = params.context.chatRunState.resolveBuffer(runId, { final: true }).text;
			return text?.trim() ? [captureAbortedPartial({
				runId,
				sessionKey: params.sessionKey,
				sessionId: entry.sessionId,
				agentId: entry.agentId ?? params.agentId,
				text,
				abortOrigin: params.abortOrigin,
				resolveTerminalProducer: entry.resolveTerminalProducer,
				session: params.session
			})] : [];
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
		abortAdditional();
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
		const endedAt = Date.now();
		const stopReason = params.stopReason ?? "rpc";
		for (const { runId, sessionKey, payload } of pendingAgent.authorizedRuns) {
			params.assertCurrent?.();
			if (writePreRegisteredAgentAbort({
				context: params.context,
				runId,
				sessionKey,
				payload,
				expectedPayload: payload,
				stopReason,
				endedAt
			})) recordRun(runId);
		}
		for (const { runId, payload } of pendingChat.authorizedRuns) {
			params.assertCurrent?.();
			if (writePreRegisteredChatAbort({
				context: params.context,
				runId,
				stopReason,
				endedAt,
				attemptId: normalizeOptionalString(payload.attemptId),
				expectedPayload: payload
			})) recordRun(runId);
		}
		if (params.requester.isAdmin && canCancelWorkerSession) {
			params.assertCurrent?.();
			cancelWorker();
		}
	};
	const hasOtherWork = matchedActiveRunIds.some((runId) => runId !== selectedRunId) || queuedPlan.matchedRunIds.some((runId) => runId !== selectedRunId) || pendingPlans.some((plan) => plan.matchedRunIds.some((runId) => runId !== selectedRunId)) || hasWorkerRun && (!selectedRunId || !workerCancellation?.runIds.includes(selectedRunId));
	return {
		canCascade: canRunLifecycleCleanup && !hasUnauthorizedLifecycleOwner,
		hasOtherWork,
		result,
		abort: abortAuthorizedRuns,
		async finish() {
			const abortedRunIds = new Set(result.runIds);
			const [worker, partial] = await Promise.allSettled([workerCancellationPersistence, result.aborted && snapshots.length > 0 ? persistAbortedPartials({
				context: params.context,
				snapshots: snapshots.filter((snapshot) => abortedRunIds.has(snapshot.runId))
			}) : void 0]);
			const failures = /* @__PURE__ */ new Set();
			for (const settled of [worker, partial]) if (settled.status === "rejected") failures.add(settled.reason);
			if (params.session && !params.session.ok) failures.add(params.session.error);
			const warning = partial.status === "fulfilled" ? partial.value : void 0;
			if (failures.size > 0) {
				const errors = [...failures];
				throw abortedPartialPersistenceError(errors.length === 1 ? errors[0] : new AggregateError(errors, "Chat cancellation persistence failed"), warning);
			}
			return warning;
		}
	};
}
async function abortChatRunsForSessionKeyWithPartials(params) {
	if (params.cascadeDescendants) {
		const queuedAbort = abortQueuedCollectorSession(params);
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
	const plan = prepareChatSessionAbort(params, captureWorkerInferenceForSession(params));
	const result = plan.result;
	let descendants;
	let failure;
	try {
		if (params.cascadeDescendants && plan.canCascade) descendants = await abortControlledSubagents({
			cfg: params.session?.ok ? params.session.value.cfg : params.context.getRuntimeConfig(),
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			assertCurrent: params.assertCurrent,
			beforeKill: () => {
				plan.abort();
				return true;
			}
		});
		else plan.abort();
		if (!result.unauthorized && !result.error) {
			params.assertCurrent?.();
			params.onCancellationStarted?.();
		}
	} catch (error) {
		failure = { error };
	}
	let warning;
	try {
		warning = await plan.finish();
	} catch (error) {
		if (!failure) throw error;
		throw new AggregateError([failure.error, error], "Chat cancellation and persistence failed", { cause: error });
	}
	if (failure) throw abortedPartialPersistenceError(failure.error, warning);
	return {
		...result,
		aborted: result.aborted || Boolean(descendants?.killed),
		descendants,
		...warning ? { warning } : {}
	};
}
//#endregion
export { buildAbortedChatSendPayload as a, hasGatewaySessionAbortOwner as c, resolveChatAbortRequester as d, writePreRegisteredAgentAbort as f, descendantAbortError as i, readPreRegisteredAgentDedupePayloadForSession as l, abortControlledSubagents as n, canRequesterAbortChatRun as o, writePreRegisteredChatAbort as p, abortQueuedCollectorSession as r, canRequesterAbortPreRegisteredRun as s, abortChatRunsForSessionKeyWithPartials as t, readPreRegisteredRun as u };
