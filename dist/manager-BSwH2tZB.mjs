import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { t as AgentSelectionRequiredError } from "./agent-scope-config-IQKOEtZ4.mjs";
import { A as parseAgentSessionKey, y as isAcpSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { a as toAcpRuntimeError, n as AcpRuntimeError, o as withAcpRuntimeErrorBoundary, r as formatAcpErrorChain } from "./errors-Ks5ZnY05.mjs";
import { a as identityHasStableSessionId, c as resolveRuntimeHandleIdentifiersFromIdentity, i as identityEquals, l as resolveRuntimeResumeSessionId, n as createIdentityFromHandleEvent, o as isSessionIdentityPending, r as createIdentityFromStatus, s as mergeSessionIdentity, t as createIdentityFromEnsure, u as resolveSessionIdentityFromMeta } from "./session-identity-BX68pph-.mjs";
import "./errors-BeQQKpA8.mjs";
import { a as requireReadySessionMeta, c as resolveAcpSessionTarget, i as normalizeAcpErrorCode, l as resolveMissingMetaError, n as createUnsupportedControlError, o as resolveAcpAgentFromSessionKey, r as hasLegacyAcpIdentityProjection, s as resolveAcpSessionResolutionError, t as acpSessionActorKey } from "./manager.utils-BcgCrYZC.mjs";
import { f as resolveAdmittedRunActiveAssertion } from "./admitted-run-context-BNasoszr.mjs";
import { i as isRetainedExecutionOwnerBinding } from "./execution-owner-binding-C2u1SaeA.mjs";
import { d as recordSessionHumanDirectMessage, m as recordSubagentTerminalState } from "./session-state-events-M0m1rzDq.mjs";
import { E as readTaskBackingInstance } from "./task-registry.store.kernel-BuNI8UuR.mjs";
import { t as bindTaskFlowExecution } from "./task-flow-registry.store.sqlite-DM-mfTLX.mjs";
import { t as bindTaskRunExecution } from "./task-registry.store.sqlite-nRmuK0pg.mjs";
import { t as createNextAcpTaskBackingDetail } from "./task-backing-authority-CIHk-jEg.mjs";
import { p as listTasksForRelatedSessionKey } from "./task-registry-query-Bd-H3o4L.mjs";
import { m as captureTaskCancellationControl } from "./task-registry-D10gtSrV.mjs";
import { d as startTaskRunByRunId, i as failTaskRunByRunId, r as createRunningTaskRun, t as completeTaskRunByRunId } from "./detached-task-runtime-Cl5iIO5L.mjs";
import { n as resolveRequiredCompletionTerminalResult } from "./task-completion-contract-bB2v-uXg.mjs";
import { a as buildRuntimeConfigOptionPairs, b as validateRuntimeOptionPatch, c as isThinkingConfigKey, f as reconcileAcceptedRuntimeOptions, g as validateRuntimeConfigOptionInput, h as runtimeOptionsEqual, i as resolveTurnTimeoutMs, l as mergeRuntimeOptions, m as resolveRuntimeOptionsFromMeta, n as awaitTurnWithTimeout, o as buildRuntimeControlSignature, p as resolveRuntimeConfigOptionKey, r as cleanupTimedOutTurn, s as inferRuntimeOptionPatchFromConfigOption, u as normalizeRuntimeOptions, v as validateRuntimeModeInput } from "./manager.turn-timeout-DthYDbbm.mjs";
import { t as resolveAcpSessionControlOwner } from "./session-control-owner-BYS-lXXA.mjs";
import { n as markAcpTurnActive } from "./active-turns-p1nLl7Yy.mjs";
import { r as requireAcpRuntimeBackend, t as getAcpRuntimeBackend } from "./registry-4Q9QHmjA.mjs";
import { a as upsertAcpSessionMeta, n as readAcpSessionEntry, t as listAcpSessionEntries } from "./session-meta-DHUOlEoy.mjs";
//#region src/acp/control-plane/manager.accepted-turns.ts
/** Owns each admitted turn from actor admission through final settlement. */
async function runAcceptedManagerTurn(params) {
	const { input } = params;
	const instance = input.admittedRunContext.operationalRunInstance;
	if (instance.runId !== input.requestId) throw new Error("ACP operational run instance disagrees with the admitted request");
	const completion = createDeferredCore();
	completion.promise.catch(() => {});
	const turn = {
		requestId: input.requestId,
		instanceId: instance.instanceId,
		abortController: new AbortController(),
		settled: completion.promise
	};
	const actorKey = acpSessionActorKey(params);
	const turns = params.turns.get(actorKey) ?? /* @__PURE__ */ new Set();
	turns.add(turn);
	params.turns.set(actorKey, turns);
	if (params.stopping) turn.abortController.abort();
	const signal = input.signal ? AbortSignal.any([input.signal, turn.abortController.signal]) : turn.abortController.signal;
	let started = false;
	try {
		try {
			await params.withSessionActor(params, async (isCurrentActor) => {
				started = true;
				await params.run({
					...input,
					signal
				}, turn, isCurrentActor);
			}, signal);
		} catch (error) {
			if (started || !signal.aborted) throw error;
			turn.revalidateCancel?.();
			await params.onQueuedCancellation();
		}
		completion.resolve();
	} catch (error) {
		completion.reject(error);
		throw error;
	} finally {
		turns.delete(turn);
		if (turns.size === 0 && params.turns.get(actorKey) === turns) params.turns.delete(actorKey);
	}
}
//#endregion
//#region src/acp/control-plane/manager.background-task.ts
/** Mirrors child ACP turns into detached-task status for requester-facing progress. */
const ACP_BACKGROUND_TASK_TEXT_MAX_LENGTH = 160;
const ACP_BACKGROUND_TASK_PROGRESS_MAX_LENGTH = 240;
/** Produces the bounded task label shown for a child ACP background run. */
function summarizeBackgroundTaskText(text) {
	const normalized = normalizeOptionalString(text) ?? "ACP background task";
	if (normalized.length <= ACP_BACKGROUND_TASK_TEXT_MAX_LENGTH) return normalized;
	return `${truncateUtf16Safe(normalized, 159)}…`;
}
/** Appends bounded progress text while preserving a single-line task summary. */
function appendBackgroundTaskProgressSummary(current, chunk) {
	const normalizedChunk = chunk.replace(/\s+/g, " ");
	if (!normalizedChunk) return current;
	const chunkToAppend = current ? normalizedChunk : normalizedChunk.trimStart();
	if (!chunkToAppend) return current;
	const combined = `${current}${chunkToAppend}`.replace(/\s+/g, " ");
	if (combined.length <= ACP_BACKGROUND_TASK_PROGRESS_MAX_LENGTH) return combined;
	return `${truncateUtf16Safe(combined, 239)}…`;
}
/** Maps ACP runtime failures to detached-task terminal states. */
function resolveBackgroundTaskFailureStatus(error) {
	return error.detailCode === "TURN_TIMEOUT" ? "timed_out" : "failed";
}
/** Infers blocked terminal outcomes from final completion text when the child turn reports one. */
function resolveBackgroundTaskTerminalResult(completionText) {
	const requiredCompletionResult = resolveRequiredCompletionTerminalResult(completionText);
	if (requiredCompletionResult.terminalOutcome) return requiredCompletionResult;
	const normalized = normalizeOptionalString(completionText)?.replace(/\s+/g, " ").trim();
	if (!normalized) return {};
	const permissionDeniedMatch = normalized.match(/\b(?:write failed:\s*)?permission denied(?: for (?<path>\S+))?\.?/i);
	if (permissionDeniedMatch) {
		const path = normalizeOptionalString(permissionDeniedMatch.groups?.path)?.replace(/[.,;:!?]+$/, "");
		return {
			terminalOutcome: "blocked",
			terminalSummary: path ? `Permission denied for ${path}.` : "Permission denied."
		};
	}
	if (/\bneed a writable session\b/i.test(normalized) || /\bfilesystem authorization\b/i.test(normalized) || /`?apply_patch`?/i.test(normalized)) return {
		terminalOutcome: "blocked",
		terminalSummary: "Writable session or apply_patch authorization required."
	};
	return {};
}
/** Resolves the requester task context for a spawned child ACP session. */
function resolveBackgroundTaskContext(params) {
	const childEntry = params.deps.loadSessionEntry({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId
	})?.entry;
	const requesterSessionKey = normalizeOptionalString(childEntry?.spawnedBy) ?? normalizeOptionalString(childEntry?.parentSessionKey);
	if (!requesterSessionKey) return null;
	const requesterOwners = new Set(listTasksForRelatedSessionKey(params.sessionKey).filter((task) => task.runtime === "acp" && task.childSessionKey === params.sessionKey && task.agentId === params.agentId && (task.requesterSessionKey === requesterSessionKey || task.ownerKey === requesterSessionKey)).flatMap((task) => task.requesterAgentId ? [task.requesterAgentId] : []));
	if (childEntry?.createdVia === "spawn" && childEntry.createdActor?.type === "agent" && childEntry.createdActor.id) requesterOwners.add(childEntry.createdActor.id);
	if (requesterOwners.size > 1) throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "ACP requester ownership is ambiguous; repair the child task relationship before retrying.");
	const parentTarget = resolveAcpSessionTarget({
		cfg: params.cfg,
		sessionKey: requesterSessionKey,
		agentId: requesterOwners.values().next().value
	});
	const parentEntry = params.deps.loadSessionEntry({
		cfg: params.cfg,
		...parentTarget
	})?.entry;
	return {
		agentId: params.agentId,
		requesterAgentId: parentTarget.agentId,
		requesterSessionKey,
		requesterOrigin: deliveryContextFromSession(parentEntry) ?? deliveryContextFromSession(childEntry),
		childSessionKey: params.sessionKey,
		runId: params.requestId,
		label: normalizeOptionalString(childEntry?.label),
		task: summarizeBackgroundTaskText(params.text)
	};
}
function createBackgroundTaskRecord(context, startedAt, instanceId) {
	try {
		const task = createRunningTaskRun({
			runtime: "acp",
			sourceId: context.runId,
			ownerKey: context.requesterSessionKey,
			agentId: context.agentId,
			requesterAgentId: context.requesterAgentId,
			scopeKind: "session",
			requesterOrigin: context.requesterOrigin,
			childSessionKey: context.childSessionKey,
			runId: context.runId,
			label: context.label,
			task: context.task,
			startedAt,
			detail: createNextAcpTaskBackingDetail({
				childSessionKey: context.childSessionKey,
				instanceId
			})
		});
		if (!task) {
			logVerbose(`acp-manager: failed creating background task for ${context.runId}: persist_failed`);
			return;
		}
		return {
			taskId: task.taskId,
			runId: context.runId,
			childSessionKey: context.childSessionKey,
			...task.parentFlowId ? { parentFlowId: task.parentFlowId } : {}
		};
	} catch (error) {
		logVerbose(`acp-manager: failed creating background task for ${context.runId}: ${String(error)}`);
		return;
	}
}
/** Mirrors a cancelled actor wait without replacing a same-id predecessor's task. */
function recordQueuedBackgroundTaskCancellation(params) {
	if (params.input.mode !== "prompt") return;
	const { input, sessionKey, agentId } = params;
	const instanceId = input.admittedRunContext.operationalRunInstance.instanceId;
	const existing = listTasksForRelatedSessionKey(sessionKey, agentId).filter((task) => task.runtime === "acp" && task.childSessionKey === sessionKey && task.runId === input.requestId);
	if (existing.length > 0 && !existing.some((task) => {
		const backing = readTaskBackingInstance(task.detail);
		return backing?.runtime === "acp" && backing.instanceId === instanceId;
	})) return;
	const context = resolveBackgroundTaskContext({
		...params,
		cfg: input.cfg,
		requestId: input.requestId,
		text: input.text
	});
	const record = context ? createBackgroundTaskRecord(context, params.startedAt, instanceId) : void 0;
	if (!context || !record) return;
	markBackgroundTaskTerminal(record, {
		status: "cancelled",
		endedAt: Date.now(),
		lastEventAt: Date.now(),
		progressSummary: null,
		terminalSummary: null
	});
	recordSubagentTerminalState({
		childSessionKey: sessionKey,
		runId: context.runId,
		requesterSessionKey: context.requesterSessionKey,
		outcomeStatus: "cancelled"
	});
}
/** Links ACP owner rows only when the runtime reaches its prompt-submitted boundary. */
async function bindBackgroundTaskExecution(record, admitted, assertCurrent) {
	const { taskId, parentFlowId } = record;
	try {
		if (!admitted.executionIdentityToken) return;
		const context = captureOpenClawStateWorkerContext();
		const taskResult = await bindTaskRunExecution({
			admitted,
			taskId,
			context,
			assertCurrent
		});
		if ([taskResult, parentFlowId ? isRetainedExecutionOwnerBinding(taskResult) ? await bindTaskFlowExecution({
			admitted,
			flowId: parentFlowId,
			context,
			assertCurrent
		}) : taskResult : void 0].some((result) => result === "mismatch" || result === "missing")) logVerbose("acp-manager: exact task execution binding was not retained");
	} catch (error) {
		logVerbose(`acp-manager: failed binding background task execution: ${String(error)}`);
	}
}
function markBackgroundTaskRunning(record, params) {
	try {
		startTaskRunByRunId({
			runId: record.runId,
			taskId: record.taskId,
			runtime: "acp",
			sessionKey: record.childSessionKey,
			lastEventAt: params.lastEventAt,
			progressSummary: params.progressSummary
		});
	} catch (error) {
		logVerbose(`acp-manager: failed updating background task for ${record.runId}: ${String(error)}`);
	}
}
function markBackgroundTaskTerminal(record, params) {
	try {
		if (params.status === "succeeded") {
			completeTaskRunByRunId({
				runId: record.runId,
				taskId: record.taskId,
				runtime: "acp",
				sessionKey: record.childSessionKey,
				endedAt: params.endedAt,
				lastEventAt: params.lastEventAt,
				progressSummary: params.progressSummary,
				terminalSummary: params.terminalSummary,
				terminalOutcome: params.terminalOutcome
			});
			return;
		}
		failTaskRunByRunId({
			runId: record.runId,
			taskId: record.taskId,
			runtime: "acp",
			sessionKey: record.childSessionKey,
			status: params.status,
			endedAt: params.endedAt,
			lastEventAt: params.lastEventAt,
			error: params.error,
			progressSummary: params.progressSummary,
			terminalSummary: params.terminalSummary
		});
	} catch (error) {
		logVerbose(`acp-manager: failed updating background task for ${record.runId}: ${String(error)}`);
	}
}
//#endregion
//#region src/acp/control-plane/manager.cancel-session.ts
/** Cancels either the active ACP turn or the idle runtime handle for a session. */
async function runManagerCancelSession(params) {
	params.assertActive?.();
	const cancellationControl = captureTaskCancellationControl();
	const actorKey = acpSessionActorKey(params);
	const expectedRunId = params.expectedRunId?.trim();
	const expectedInstanceId = params.expectedInstanceId?.trim();
	const expectedOwnerKey = params.expectedOwnerKey?.trim();
	const requireExpectedTurn = (current) => {
		if (expectedRunId && current?.requestId !== expectedRunId || expectedInstanceId && current?.instanceId !== expectedInstanceId) throw new AcpRuntimeError("ACP_TURN_FAILED", "ACP task is no longer the active run.");
	};
	const requireExpectedOwner = () => {
		if (!expectedOwnerKey) return;
		const resolution = params.resolveSession(params);
		const entry = resolution.kind === "ready" ? resolution.entry : void 0;
		if (resolveAcpSessionControlOwner(entry) !== expectedOwnerKey) throw new AcpRuntimeError("ACP_TURN_FAILED", "ACP task owner could not be verified.");
	};
	const accepted = [...params.acceptedTurns.get(actorKey) ?? []].filter((turn) => (!expectedRunId || turn.requestId === expectedRunId) && (!expectedInstanceId || turn.instanceId === expectedInstanceId));
	if (accepted.length > 0) {
		requireExpectedOwner();
		await Promise.all(accepted.map((acceptedTurn) => cancelManagerAcceptedTurn({
			acceptedTurn,
			reason: params.reason,
			revalidate: requireExpectedOwner,
			assertCancellationAllowed: () => {
				params.assertActive?.();
				cancellationControl?.assertCurrent();
			}
		})));
		return;
	}
	requireExpectedTurn(void 0);
	await params.withSessionActor(params, async (isCurrentActor) => {
		params.assertActive?.();
		requireExpectedTurn(params.activeTurnBySession.get(actorKey));
		requireExpectedOwner();
		const resolution = params.resolveSession({
			cfg: params.cfg,
			sessionKey: params.sessionKey,
			agentId: params.agentId
		});
		const resolvedMeta = requireReadySessionMeta(resolution);
		const { runtime, handle } = await params.ensureRuntimeHandle({
			assertActive: params.assertActive,
			cfg: params.cfg,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			meta: resolvedMeta,
			isCurrentActor
		});
		params.assertActive?.();
		try {
			requireExpectedOwner();
			await runtime.cancel({
				handle,
				reason: params.reason
			});
			if (!isCurrentActor()) return;
			await params.setSessionState({
				cfg: params.cfg,
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				state: "idle",
				clearLastError: true,
				isCurrentActor
			});
		} catch (error) {
			const acpError = toAcpRuntimeError({
				error,
				fallbackCode: "ACP_TURN_FAILED",
				fallbackMessage: "ACP cancel failed before completion."
			});
			if (!isCurrentActor()) throw acpError;
			await params.setSessionState({
				cfg: params.cfg,
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				state: "error",
				lastError: acpError.message,
				isCurrentActor
			});
			throw acpError;
		}
	});
}
/** Aborts and deduplicates runtime cancellation for one active manager turn. */
async function cancelManagerActiveTurn(params) {
	params.revalidate?.();
	params.activeTurn.abortController.abort();
	if (!params.activeTurn.cancelPromise) params.activeTurn.cancelPromise = params.activeTurn.runtime.cancel({
		handle: params.activeTurn.handle,
		reason: params.reason
	});
	await withAcpRuntimeErrorBoundary({
		run: async () => await params.activeTurn.cancelPromise,
		fallbackCode: "ACP_TURN_FAILED",
		fallbackMessage: "ACP cancel failed before completion."
	});
}
/** Cancellation retains setup custody until a late handle and its turn settle. */
async function cancelManagerAcceptedTurn(params) {
	params.revalidate?.();
	params.assertCancellationAllowed?.();
	const turn = params.acceptedTurn;
	turn.cancelReason ??= params.reason;
	turn.revalidateCancel ??= params.revalidate;
	turn.abortController.abort();
	if (turn.activeTurn) await cancelManagerActiveTurn({
		activeTurn: turn.activeTurn,
		reason: turn.cancelReason,
		revalidate: turn.revalidateCancel
	});
	else await turn.settled;
}
//#endregion
//#region src/acp/control-plane/manager.runtime-owner.ts
/** Old backends can isolate qualified keys, but silently ignore an added owner field. */
function assertAcpRuntimeOwnerSupport(runtime, target) {
	if (!parseAgentSessionKey(target.sessionKey) && runtime.ownerAwareSessions !== 1) throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "This ACP backend cannot isolate bare session keys by owner. Upgrade the backend to support ownerAwareSessions version 1.", { detailCode: "SESSION_OWNER_UNSUPPORTED" });
}
/** These operator repairs must never become resume recovery, failover, or a successful reset. */
function isAcpOwnerRepairRequired(error) {
	let current = error;
	for (let depth = 0; current instanceof Error && depth < 8; depth++) {
		const detail = "detailCode" in current ? current.detailCode : void 0;
		if (detail === "SESSION_OWNER_MIGRATION_REQUIRED" || detail === "SESSION_OWNER_UNSUPPORTED") return true;
		current = current.cause;
	}
	return false;
}
function persistedAcpRuntimeHandle(target, meta) {
	const identity = resolveSessionIdentityFromMeta(meta);
	return {
		sessionKey: target.sessionKey,
		agentId: target.agentId,
		backend: meta.backend,
		runtimeSessionName: meta.runtimeSessionName,
		cwd: meta.cwd,
		acpxRecordId: identity?.acpxRecordId,
		...resolveRuntimeHandleIdentifiersFromIdentity(identity)
	};
}
//#endregion
//#region src/acp/control-plane/manager.runtime-handle-ensure.ts
/** Ensures or recreates a live ACP runtime handle for persisted session metadata. */
/** Returns a reusable cached handle or initializes a fresh runtime session for the metadata. */
async function ensureManagerRuntimeHandle(params) {
	const isCurrentActor = params.isCurrentActor ?? (() => true);
	if (!isCurrentActor()) throw createSupersededActorError(params.sessionKey);
	params.assertActive?.();
	const agent = normalizeOptionalString(params.meta.agent) || resolveAcpAgentFromSessionKey(params.sessionKey, "main");
	const mode = params.meta.mode;
	const runtimeOptions = resolveRuntimeOptionsFromMeta(params.meta);
	const cwd = runtimeOptions.cwd ?? normalizeOptionalString(params.meta.cwd);
	const model = normalizeOptionalString(runtimeOptions.model);
	const thinking = normalizeOptionalString(runtimeOptions.thinking);
	const configuredBackend = (params.selectedBackend || params.meta.backend || params.cfg.acp?.backend || "").trim();
	const backend = params.deps.requireRuntimeBackend(configuredBackend || void 0);
	const runtime = backend.runtime;
	assertAcpRuntimeOwnerSupport(runtime, params);
	const cached = params.runtimeHandles.get(params);
	if (cached) {
		const backendMatches = !configuredBackend || cached.backend === configuredBackend;
		const agentMatches = cached.agent === agent;
		const modeMatches = cached.mode === mode;
		const cwdMatches = (cached.cwd ?? "") === (cwd ?? "");
		const handleMatchesMeta = params.runtimeHandles.handleMatchesMeta({
			handle: cached.handle,
			meta: params.meta
		});
		const reusable = backendMatches && agentMatches && modeMatches && cwdMatches && cached.runtime === runtime && handleMatchesMeta && await params.runtimeHandles.isReusable({
			sessionKey: params.sessionKey,
			runtime: cached.runtime,
			handle: cached.handle,
			isCurrentActor
		});
		if (!isCurrentActor()) throw createSupersededActorError(params.sessionKey);
		params.assertActive?.();
		if (reusable) {
			if (!isCurrentActor()) throw createSupersededActorError(params.sessionKey);
			return {
				runtime: cached.runtime,
				handle: cached.handle,
				meta: params.meta
			};
		}
		await params.runtimeHandles.close({
			assertActive: params.assertActive,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			reason: "runtime-handle-replaced",
			expectedHandle: cached.handle
		});
		if (!isCurrentActor()) throw createSupersededActorError(params.sessionKey);
	}
	const previousMeta = params.meta;
	const persistedIdentity = resolveSessionIdentityFromMeta(previousMeta);
	const backendOwnsPreviousIdentity = previousMeta.backend === backend.id;
	const previousIdentity = backendOwnsPreviousIdentity ? persistedIdentity : void 0;
	const persistedHandle = backendOwnsPreviousIdentity ? persistedAcpRuntimeHandle(params, previousMeta) : void 0;
	let identityForEnsure = previousIdentity;
	const persistedResumeSessionId = mode === "persistent" ? resolveRuntimeResumeSessionId(previousIdentity) : void 0;
	const shouldPrepareFreshPersistentSession = mode === "persistent" && previousIdentity != null && !identityHasStableSessionId(previousIdentity);
	const ensureSession = async (resumeSessionId) => {
		params.assertActive?.();
		const ensured = await withAcpRuntimeErrorBoundary({
			run: async () => await runtime.ensureSession({
				persistedHandle,
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				agent,
				mode,
				...resumeSessionId ? { resumeSessionId } : {},
				...model ? { model } : {},
				...thinking ? { thinking } : {},
				cwd
			}),
			fallbackCode: "ACP_SESSION_INIT_FAILED",
			fallbackMessage: "Could not initialize ACP session runtime."
		});
		if (!isCurrentActor()) {
			await closeSupersededRuntimeHandle({
				runtime,
				handle: ensured,
				sessionKey: params.sessionKey
			});
			throw createSupersededActorError(params.sessionKey);
		}
		return ensured;
	};
	let ensured;
	if (shouldPrepareFreshPersistentSession) {
		if (!isCurrentActor()) throw createSupersededActorError(params.sessionKey);
		params.assertActive?.();
		await runtime.prepareFreshSession?.({
			persistedHandle,
			sessionKey: params.sessionKey,
			agentId: params.agentId
		});
		if (!isCurrentActor()) throw createSupersededActorError(params.sessionKey);
	}
	if (persistedResumeSessionId) try {
		ensured = await ensureSession(persistedResumeSessionId);
	} catch (error) {
		const acpError = toAcpRuntimeError({
			error,
			fallbackCode: "ACP_SESSION_INIT_FAILED",
			fallbackMessage: "Could not initialize ACP session runtime."
		});
		if (!isCurrentActor()) throw acpError;
		params.assertActive?.();
		if (isAcpOwnerRepairRequired(acpError) || acpError.code !== "ACP_SESSION_INIT_FAILED") throw acpError;
		logVerbose(`acp-manager: resume init failed for ${params.sessionKey}; retrying without persisted ACP session id: ${acpError.message}`);
		if (identityForEnsure) {
			const { acpxSessionId: _staleAcpxSessionId, agentSessionId: _staleAgentSessionId, ...retryIdentity } = identityForEnsure;
			identityForEnsure = {
				...retryIdentity,
				state: "pending"
			};
		}
		ensured = await ensureSession();
	}
	else ensured = await ensureSession();
	const now = Date.now();
	const effectiveCwd = normalizeOptionalString(ensured.cwd) ?? cwd;
	const nextRuntimeOptions = normalizeRuntimeOptions({
		...runtimeOptions,
		...effectiveCwd ? { cwd: effectiveCwd } : {}
	});
	const ensuredIdentity = createIdentityFromEnsure({
		handle: ensured,
		now
	});
	if (identityForEnsure?.acpxRecordId && ensuredIdentity?.acpxRecordId && identityForEnsure.acpxRecordId !== ensuredIdentity.acpxRecordId) identityForEnsure = void 0;
	const nextIdentity = mergeSessionIdentity({
		current: identityForEnsure,
		incoming: ensuredIdentity,
		now
	}) ?? identityForEnsure;
	const nextHandleIdentifiers = resolveRuntimeHandleIdentifiersFromIdentity(nextIdentity);
	const nextHandle = {
		...ensured,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		...nextHandleIdentifiers.backendSessionId ? { backendSessionId: nextHandleIdentifiers.backendSessionId } : {},
		...nextHandleIdentifiers.agentSessionId ? { agentSessionId: nextHandleIdentifiers.agentSessionId } : {}
	};
	const nextMeta = {
		backend: ensured.backend || backend.id,
		agent,
		runtimeSessionName: ensured.runtimeSessionName,
		...nextIdentity ? { identity: nextIdentity } : {},
		mode: params.meta.mode,
		...Object.keys(nextRuntimeOptions).length > 0 ? { runtimeOptions: nextRuntimeOptions } : {},
		...effectiveCwd ? { cwd: effectiveCwd } : {},
		state: previousMeta.state,
		lastActivityAt: now,
		...previousMeta.lastError ? { lastError: previousMeta.lastError } : {}
	};
	if (previousMeta.backend !== nextMeta.backend || previousMeta.runtimeSessionName !== nextMeta.runtimeSessionName || !identityEquals(persistedIdentity, nextIdentity) || previousMeta.agent !== nextMeta.agent || previousMeta.cwd !== nextMeta.cwd || !runtimeOptionsEqual(previousMeta.runtimeOptions, nextMeta.runtimeOptions) || hasLegacyAcpIdentityProjection(previousMeta)) try {
		await params.writeSessionMeta({
			cfg: params.cfg,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			isCurrentActor,
			mutate: (_current, entry) => {
				if (!isCurrentActor()) return;
				if (!entry) return null;
				return nextMeta;
			}
		});
	} catch (error) {
		if (!isCurrentActor()) await closeSupersededRuntimeHandle({
			runtime,
			handle: nextHandle,
			sessionKey: params.sessionKey
		});
		throw error;
	}
	if (!isCurrentActor()) {
		await closeSupersededRuntimeHandle({
			runtime,
			handle: nextHandle,
			sessionKey: params.sessionKey
		});
		throw createSupersededActorError(params.sessionKey);
	}
	params.runtimeHandles.set(params, {
		runtime,
		handle: nextHandle,
		backend: ensured.backend || backend.id,
		agent,
		mode,
		cwd: effectiveCwd,
		appliedControlSignature: void 0
	});
	return {
		runtime,
		handle: nextHandle,
		meta: nextMeta
	};
}
const SESSION_ACTOR_SUPERSEDED_DETAIL_CODE = "SESSION_ACTOR_SUPERSEDED";
function createSupersededActorError(sessionKey) {
	return new AcpRuntimeError("ACP_SESSION_INIT_FAILED", `ACP session actor was superseded during runtime initialization for ${sessionKey}.`, { detailCode: SESSION_ACTOR_SUPERSEDED_DETAIL_CODE });
}
async function closeSupersededRuntimeHandle(params) {
	await params.runtime.close({
		handle: params.handle,
		reason: "session-actor-superseded",
		discardPersistentState: true
	}).catch((error) => {
		logVerbose(`acp-manager: failed discarding superseded runtime for ${params.sessionKey}: ${String(error)}`);
	});
}
//#endregion
//#region src/acp/control-plane/manager.runtime-resume-state.ts
/** Recovery helpers for stale ACP persistent session ids and early runtime exits. */
/** Detects acpx exits that are safe to retry with a fresh runtime handle. */
function isRecoverableManagerAcpxExitError(message) {
	return /^acpx exited with (code \d+|signal [a-z0-9]+)/i.test(message.trim());
}
/** acpx detail code for a persistent session that can no longer be resumed and must be re-created. */
const SESSION_RESUME_REQUIRED_DETAIL_CODE = "SESSION_RESUME_REQUIRED";
/**
* Detects a "persistent session can no longer be resumed" failure by acpx's
* structured detail code, on the error itself or anywhere in its cause chain.
* Keying on the structured code rather than the human reason text is what makes
* recovery independent of the backend's wording — Claude reports "Resource not
* found", Kiro reports "Internal error" (RequestError -32603), but both wrap a
* SessionResumeRequiredError; matching the reason text missed Kiro and left the
* thread permanently stuck (#87830).
*/
function isRecoverableMissingManagerPersistentSessionError(error) {
	let current = error;
	for (let depth = 0; current && depth < 8; depth += 1) {
		if (current.detailCode === SESSION_RESUME_REQUIRED_DETAIL_CODE) return true;
		current = current.cause;
	}
	return false;
}
/** Prepares a one-time fresh-handle retry only before authoritative prompt submission. */
async function prepareFreshManagerRuntimeHandleRetry(params) {
	if (!params.isCurrentActor() || isAcpOwnerRepairRequired(params.error) || params.attempt > 0 || params.promptStarted || params.sawTurnOutput) return false;
	if (isRecoverableManagerAcpxExitError(params.error.message)) {
		params.runtimeHandles.clear(params);
		logVerbose(`acp-manager: retrying ${params.sessionKey} with a fresh runtime handle after early turn failure: ${params.error.message}`);
		return true;
	}
	if (!params.runtime || !params.meta || params.meta.mode !== "persistent" || !isRecoverableMissingManagerPersistentSessionError(params.error)) return false;
	if (params.runtime.prepareFreshSession) {
		if (!params.isCurrentActor()) return false;
		try {
			await params.runtime.prepareFreshSession({
				persistedHandle: persistedAcpRuntimeHandle(params, params.meta),
				sessionKey: params.sessionKey,
				agentId: params.agentId
			});
			if (!params.isCurrentActor()) return false;
		} catch (error) {
			if (isAcpOwnerRepairRequired(error)) throw error;
			logVerbose(`acp-manager: failed preparing a fresh persistent session for ${params.sessionKey}: ${formatErrorMessage(error)}`);
			return false;
		}
	}
	if (!await clearPersistedRuntimeResumeState({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		writeSessionMeta: params.writeSessionMeta,
		isCurrentActor: params.isCurrentActor
	}) || !params.isCurrentActor()) return false;
	params.runtimeHandles.clear(params);
	logVerbose(`acp-manager: retrying ${params.sessionKey} with a fresh persistent session after missing backend resume target: ${params.error.message}`);
	return true;
}
async function clearPersistedRuntimeResumeState(params) {
	const now = Date.now();
	if (!await params.writeSessionMeta({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		isCurrentActor: params.isCurrentActor,
		mutate: (current, entry) => {
			if (!params.isCurrentActor()) return;
			if (!entry) return null;
			const base = current;
			if (!base) return null;
			const currentIdentity = resolveSessionIdentityFromMeta(base);
			if (!currentIdentity?.acpxSessionId && !currentIdentity?.agentSessionId) return base;
			const nextIdentity = {
				state: "pending",
				...currentIdentity.acpxRecordId ? { acpxRecordId: currentIdentity.acpxRecordId } : {},
				source: currentIdentity.source,
				lastUpdatedAt: now
			};
			return {
				backend: base.backend,
				agent: base.agent,
				runtimeSessionName: base.runtimeSessionName,
				identity: nextIdentity,
				mode: base.mode,
				...base.runtimeOptions ? { runtimeOptions: base.runtimeOptions } : {},
				...base.cwd ? { cwd: base.cwd } : {},
				state: base.state,
				lastActivityAt: now,
				...base.lastError ? { lastError: base.lastError } : {}
			};
		}
	})) {
		logVerbose(`acp-manager: unable to clear persisted runtime resume state for ${params.sessionKey}`);
		return false;
	}
	return true;
}
/** Clears persisted runtime resume identifiers while preserving the manager session shell. */
async function discardPersistedManagerRuntimeState(params) {
	const now = Date.now();
	await params.writeSessionMeta({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		isCurrentActor: params.isCurrentActor,
		mutate: (current, entry) => {
			if (!params.isCurrentActor()) return;
			if (!entry) return null;
			const base = current;
			if (!base) return null;
			const currentIdentity = resolveSessionIdentityFromMeta(base);
			const nextIdentity = currentIdentity ? {
				state: "pending",
				...currentIdentity.acpxRecordId ? { acpxRecordId: currentIdentity.acpxRecordId } : {},
				source: currentIdentity.source,
				lastUpdatedAt: now
			} : void 0;
			return {
				backend: base.backend,
				agent: base.agent,
				runtimeSessionName: base.runtimeSessionName,
				...nextIdentity ? { identity: nextIdentity } : {},
				mode: base.mode,
				...base.runtimeOptions ? { runtimeOptions: base.runtimeOptions } : {},
				...base.cwd ? { cwd: base.cwd } : {},
				state: "idle",
				lastActivityAt: now
			};
		},
		failOnError: true
	});
}
/**
* Best-effort fresh-session preparation against a maybe-missing backend.
* Every non-applied path records why it was skipped: a reset that silently
* skips this step looks successful while the backend keeps resuming the old
* conversation, which is the worst failure mode for session resets.
*/
async function tryPrepareFreshManagerRuntimeSession(params) {
	const configuredBackend = (params.meta.backend || params.cfg.acp?.backend || "").trim();
	try {
		const backend = params.deps.getRuntimeBackend(configuredBackend || void 0);
		if (!backend) {
			if (params.missingBackendError) throw toErrorObject(params.missingBackendError, "Non-Error thrown");
			logVerbose(`${params.logPrefix}: fresh-session preparation skipped for ${params.sessionKey}: ACP backend "${configuredBackend || "(default)"}" is not registered`);
			return;
		}
		assertAcpRuntimeOwnerSupport(backend.runtime, params);
		if (!backend.runtime.prepareFreshSession) {
			logVerbose(`${params.logPrefix}: fresh-session preparation skipped for ${params.sessionKey}: ACP backend "${backend.id}" does not support prepareFreshSession`);
			return;
		}
		await backend.runtime.prepareFreshSession({
			persistedHandle: persistedAcpRuntimeHandle(params, params.meta),
			sessionKey: params.sessionKey,
			agentId: params.agentId
		});
	} catch (error) {
		if (isAcpOwnerRepairRequired(error)) throw error;
		logVerbose(`${params.logPrefix}: unable to prepare fresh session for ${params.sessionKey}: ${formatErrorMessage(error)}`);
	}
}
//#endregion
//#region src/acp/control-plane/manager.close-session.ts
/** Close/reset path for ACP runtime sessions and persisted manager metadata. */
/** Closes an ACP session runtime handle and optionally discards persistent state/meta. */
async function runManagerCloseSession(params) {
	const { input, sessionKey, agentId } = params;
	if (!params.isCurrentActor()) throw createSupersededActorError(sessionKey);
	input.assertActive?.();
	const resolution = params.resolveSession({
		cfg: input.cfg,
		sessionKey,
		agentId
	});
	const resolutionError = resolveAcpSessionResolutionError(resolution);
	if (resolutionError) {
		if (input.requireAcpSession ?? true) throw resolutionError;
		return {
			runtimeClosed: false,
			metaCleared: false
		};
	}
	const meta = requireReadySessionMeta(resolution);
	const currentIdentity = resolveSessionIdentityFromMeta(meta);
	const shouldSkipRuntimeClose = input.discardPersistentState && currentIdentity != null && !identityHasStableSessionId(currentIdentity);
	let runtimeClosed = false;
	let runtimeNotice;
	if (shouldSkipRuntimeClose) {
		input.assertActive?.();
		await tryPrepareFreshManagerRuntimeSession({
			deps: params.deps,
			cfg: input.cfg,
			meta,
			sessionKey,
			agentId,
			logPrefix: "acp close fast-reset"
		});
		if (!params.isCurrentActor()) throw createSupersededActorError(sessionKey);
		params.runtimeHandles.clear(params);
	} else try {
		const { runtime: ensuredRuntime, handle } = await params.ensureRuntimeHandle({
			assertActive: input.assertActive,
			cfg: input.cfg,
			sessionKey,
			agentId,
			meta,
			isCurrentActor: params.isCurrentActor
		});
		if (!params.isCurrentActor()) throw createSupersededActorError(sessionKey);
		input.assertActive?.();
		await ensuredRuntime.close({
			handle,
			reason: input.reason,
			discardPersistentState: input.discardPersistentState
		});
		runtimeClosed = true;
		if (!params.isCurrentActor()) throw createSupersededActorError(sessionKey);
		params.runtimeHandles.clear(params);
	} catch (error) {
		const acpError = toAcpRuntimeError({
			error,
			fallbackCode: "ACP_TURN_FAILED",
			fallbackMessage: "ACP close failed before completion."
		});
		if (!params.isCurrentActor()) throw acpError;
		input.assertActive?.();
		if (!isAcpOwnerRepairRequired(acpError) && input.allowBackendUnavailable && (acpError.code === "ACP_BACKEND_MISSING" || acpError.code === "ACP_BACKEND_UNAVAILABLE" || input.discardPersistentState && acpError.code === "ACP_SESSION_INIT_FAILED" || input.discardPersistentState && acpError.code === "ACP_BACKEND_UNSUPPORTED_CONTROL" || isRecoverableManagerAcpxExitError(acpError.message))) {
			if (input.discardPersistentState) {
				input.assertActive?.();
				await tryPrepareFreshManagerRuntimeSession({
					deps: params.deps,
					cfg: input.cfg,
					meta,
					sessionKey,
					agentId,
					logPrefix: "acp close recovery",
					missingBackendError: acpError
				});
				if (!params.isCurrentActor()) throw acpError;
			}
			if (!params.isCurrentActor()) throw createSupersededActorError(sessionKey);
			params.runtimeHandles.clear(params);
			runtimeNotice = acpError.message;
		} else throw acpError;
	}
	if (input.discardPersistentState && !input.clearMeta) await discardPersistedManagerRuntimeState({
		cfg: input.cfg,
		sessionKey,
		agentId,
		writeSessionMeta: params.writeSessionMeta,
		isCurrentActor: params.isCurrentActor
	});
	if (!params.isCurrentActor()) throw createSupersededActorError(sessionKey);
	const metaCleared = Boolean(input.clearMeta);
	if (metaCleared) await params.writeSessionMeta({
		cfg: input.cfg,
		sessionKey,
		agentId,
		isCurrentActor: params.isCurrentActor,
		mutate: () => null,
		failOnError: true
	});
	return {
		runtimeClosed,
		runtimeNotice,
		metaCleared
	};
}
//#endregion
//#region src/acp/control-plane/manager.identity-reconcile.ts
/** Reconciles ACP runtime identity observations back into persisted session metadata. */
/** Reconciles runtime-reported session identifiers into persisted ACP session metadata. */
async function reconcileManagerRuntimeSessionIdentifiers(params) {
	const isCurrentActor = params.isCurrentActor ?? (() => true);
	if (!isCurrentActor()) throw createSupersededActorError(params.sessionKey);
	let runtimeStatus = params.runtimeStatus;
	if (!runtimeStatus && params.runtime.getStatus) {
		try {
			runtimeStatus = await withAcpRuntimeErrorBoundary({
				run: async () => await params.runtime.getStatus({ handle: params.handle }),
				fallbackCode: "ACP_TURN_FAILED",
				fallbackMessage: "Could not read ACP runtime status."
			});
		} catch (error) {
			if (params.failOnStatusError || isAcpOwnerRepairRequired(error)) throw error;
			if (!isCurrentActor()) throw createSupersededActorError(params.sessionKey);
			logVerbose(`acp-manager: failed to refresh ACP runtime status for ${params.sessionKey}: ${String(error)}`);
			return {
				handle: params.handle,
				meta: params.meta,
				runtimeStatus
			};
		}
		if (!isCurrentActor()) throw createSupersededActorError(params.sessionKey);
	}
	const now = Date.now();
	const currentIdentity = resolveSessionIdentityFromMeta(params.meta);
	const eventIdentity = createIdentityFromHandleEvent({
		handle: params.handle,
		now
	});
	const identityAfterEvent = mergeSessionIdentity({
		current: currentIdentity,
		incoming: eventIdentity,
		now
	}) ?? currentIdentity;
	const nextIdentity = mergeSessionIdentity({
		current: identityAfterEvent,
		incoming: createIdentityFromStatus({
			status: runtimeStatus,
			now
		}),
		now
	}) ?? identityAfterEvent;
	const handleIdentifiers = resolveRuntimeHandleIdentifiersFromIdentity(nextIdentity);
	const handleChanged = handleIdentifiers.backendSessionId !== params.handle.backendSessionId || handleIdentifiers.agentSessionId !== params.handle.agentSessionId;
	const nextHandle = handleChanged ? {
		...params.handle,
		...handleIdentifiers.backendSessionId ? { backendSessionId: handleIdentifiers.backendSessionId } : {},
		...handleIdentifiers.agentSessionId ? { agentSessionId: handleIdentifiers.agentSessionId } : {}
	} : params.handle;
	if (handleChanged) params.setCachedHandle(params, nextHandle);
	if (!(!identityEquals(currentIdentity, nextIdentity) || hasLegacyAcpIdentityProjection(params.meta))) {
		if (!isCurrentActor()) throw createSupersededActorError(params.sessionKey);
		return {
			handle: nextHandle,
			meta: params.meta,
			runtimeStatus
		};
	}
	const nextMeta = {
		backend: params.meta.backend,
		agent: params.meta.agent,
		runtimeSessionName: params.meta.runtimeSessionName,
		...nextIdentity ? { identity: nextIdentity } : {},
		mode: params.meta.mode,
		...params.meta.runtimeOptions ? { runtimeOptions: params.meta.runtimeOptions } : {},
		...params.meta.cwd ? { cwd: params.meta.cwd } : {},
		lastActivityAt: now,
		state: params.meta.state,
		...params.meta.lastError ? { lastError: params.meta.lastError } : {}
	};
	if (!isCurrentActor()) throw createSupersededActorError(params.sessionKey);
	if (!identityEquals(currentIdentity, nextIdentity)) {
		const currentAgentSessionId = currentIdentity?.agentSessionId ?? "<none>";
		const nextAgentSessionId = nextIdentity?.agentSessionId ?? "<none>";
		const currentAcpxSessionId = currentIdentity?.acpxSessionId ?? "<none>";
		const nextAcpxSessionId = nextIdentity?.acpxSessionId ?? "<none>";
		const currentAcpxRecordId = currentIdentity?.acpxRecordId ?? "<none>";
		const nextAcpxRecordId = nextIdentity?.acpxRecordId ?? "<none>";
		logVerbose(`acp-manager: session identity updated for ${params.sessionKey} (agentSessionId ${currentAgentSessionId} -> ${nextAgentSessionId}, acpxSessionId ${currentAcpxSessionId} -> ${nextAcpxSessionId}, acpxRecordId ${currentAcpxRecordId} -> ${nextAcpxRecordId})`);
	}
	await params.writeSessionMeta({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		isCurrentActor,
		mutate: (current, entry) => {
			if (!isCurrentActor()) return;
			if (!entry) return null;
			const base = current;
			if (!base) return null;
			return {
				backend: base.backend,
				agent: base.agent,
				runtimeSessionName: base.runtimeSessionName,
				...nextIdentity ? { identity: nextIdentity } : {},
				mode: base.mode,
				...base.runtimeOptions ? { runtimeOptions: base.runtimeOptions } : {},
				...base.cwd ? { cwd: base.cwd } : {},
				state: base.state,
				lastActivityAt: now,
				...base.lastError ? { lastError: base.lastError } : {}
			};
		}
	});
	if (!isCurrentActor()) throw createSupersededActorError(params.sessionKey);
	return {
		handle: nextHandle,
		meta: nextMeta,
		runtimeStatus
	};
}
//#endregion
//#region src/acp/control-plane/manager.initialize-session.ts
/** Session initialization path for ACP runtime handles and persisted manager metadata. */
/** Initializes an ACP runtime session and persists its metadata before caching the handle. */
async function runManagerInitializeSession(params) {
	const { input, sessionKey, agentId } = params;
	const isCurrentActor = params.isCurrentActor ?? (() => true);
	if (!isCurrentActor()) throw createSupersededActorError(sessionKey);
	const backend = params.deps.requireRuntimeBackend(input.backendId || input.cfg.acp?.backend);
	const runtime = backend.runtime;
	assertAcpRuntimeOwnerSupport(runtime, params);
	const agent = normalizeAgentId(input.agent);
	const initialRuntimeOptions = validateRuntimeOptionPatch({
		...input.runtimeOptions,
		...input.cwd !== void 0 ? { cwd: input.cwd } : {}
	});
	const requestedCwd = initialRuntimeOptions.cwd;
	const requestedModel = initialRuntimeOptions.model;
	const requestedThinking = initialRuntimeOptions.thinking;
	const previousMeta = params.deps.loadSessionEntry({
		cfg: input.cfg,
		sessionKey,
		agentId
	})?.acp;
	input.assertActive?.();
	const handle = {
		...await withAcpRuntimeErrorBoundary({
			run: async () => await runtime.ensureSession({
				sessionKey,
				agentId,
				persistedHandle: previousMeta?.backend === backend.id ? persistedAcpRuntimeHandle(params, previousMeta) : void 0,
				agent,
				mode: input.mode,
				resumeSessionId: input.resumeSessionId,
				...requestedModel ? { model: requestedModel } : {},
				...requestedModel && input.modelExplicit ? { modelExplicit: true } : {},
				...requestedThinking ? { thinking: requestedThinking } : {},
				...requestedThinking && input.thinkingExplicit !== void 0 ? { thinkingExplicit: input.thinkingExplicit } : {},
				cwd: requestedCwd
			}),
			fallbackCode: "ACP_SESSION_INIT_FAILED",
			fallbackMessage: "Could not initialize ACP session runtime."
		}),
		agentId,
		sessionKey
	};
	if (!isCurrentActor()) {
		await closeSupersededRuntimeHandle({
			runtime,
			handle,
			sessionKey
		});
		throw createSupersededActorError(sessionKey);
	}
	const effectiveCwd = normalizeOptionalString(handle.cwd) ?? requestedCwd;
	const effectiveRuntimeOptions = normalizeRuntimeOptions({
		...initialRuntimeOptions,
		model: handle.appliedModel ? handle.appliedModel.kind === "applied" ? handle.appliedModel.model : void 0 : requestedModel,
		thinking: handle.appliedThinking ? handle.appliedThinking.kind === "applied" ? handle.appliedThinking.thinking : void 0 : requestedThinking,
		...effectiveCwd ? { cwd: effectiveCwd } : {}
	});
	const identityNow = Date.now();
	const initializedIdentity = mergeSessionIdentity({
		current: void 0,
		incoming: createIdentityFromEnsure({
			handle,
			now: identityNow
		}),
		now: identityNow
	}) ?? {
		state: "pending",
		source: "ensure",
		lastUpdatedAt: identityNow
	};
	const meta = {
		backend: handle.backend || backend.id,
		agent,
		runtimeSessionName: handle.runtimeSessionName,
		identity: initializedIdentity,
		mode: input.mode,
		...Object.keys(effectiveRuntimeOptions).length > 0 ? { runtimeOptions: effectiveRuntimeOptions } : {},
		cwd: effectiveCwd,
		state: "idle",
		lastActivityAt: Date.now()
	};
	const persisted = await persistInitializedSessionMeta({
		cfg: input.cfg,
		sessionKey,
		agentId,
		meta,
		runtime,
		handle,
		writeSessionMeta: params.writeSessionMeta,
		assertCommitAllowed: input.assertActive,
		isCurrentActor
	});
	if (!persisted?.acp) throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", `Could not persist ACP metadata for ${sessionKey}.`);
	if (!isCurrentActor()) {
		await closeSupersededRuntimeHandle({
			runtime,
			handle,
			sessionKey
		});
		throw createSupersededActorError(sessionKey);
	}
	params.runtimeHandles.set(params, {
		runtime,
		handle,
		backend: handle.backend || backend.id,
		agent,
		mode: input.mode,
		cwd: effectiveCwd
	});
	return {
		runtime,
		handle,
		meta,
		sessionEntry: persisted
	};
}
async function persistInitializedSessionMeta(params) {
	try {
		const persisted = await params.writeSessionMeta({
			cfg: params.cfg,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			mutate: () => params.meta,
			isCurrentActor: params.isCurrentActor,
			failOnError: true,
			assertCommitAllowed: params.assertCommitAllowed
		});
		if (persisted?.acp) return persisted;
	} catch (error) {
		await closeRuntimeAfterInitMetaFailure(params);
		throw error;
	}
	await closeRuntimeAfterInitMetaFailure(params);
	return null;
}
async function closeRuntimeAfterInitMetaFailure(params) {
	await params.runtime.close({
		handle: params.handle,
		reason: "init-meta-failed"
	}).catch((closeError) => {
		logVerbose(`acp-manager: cleanup close failed after metadata write error for ${params.sessionKey}: ${String(closeError)}`);
	});
}
//#endregion
//#region src/acp/control-plane/manager.lifecycle.ts
const ACP_SESSION_MANAGER_DISPOSERS = /* @__PURE__ */ new WeakMap();
function registerAcpSessionManagerDisposer(manager, dispose) {
	ACP_SESSION_MANAGER_DISPOSERS.set(manager, dispose);
}
/** Stops active turns and closes process-local handles without widening the public manager API. */
async function disposeAcpSessionManagerInstance(manager, reason) {
	const dispose = ACP_SESSION_MANAGER_DISPOSERS.get(manager);
	if (!dispose) throw new Error("ACP session manager disposer unavailable");
	await dispose(reason);
}
//#endregion
//#region src/acp/control-plane/manager.reset-controls.ts
const RESET_CONTROLS = /* @__PURE__ */ new WeakMap();
function registerAcpSessionResetControls(manager, controls) {
	RESET_CONTROLS.set(manager, controls);
}
function getAcpSessionResetControls(manager) {
	const controls = RESET_CONTROLS.get(manager);
	if (!controls) throw new Error("ACP session manager reset controls unavailable");
	return controls;
}
//#endregion
//#region src/acp/control-plane/manager.runtime-handle-cache.ts
/** Process-local ACP runtime handle cache with lifecycle cleanup and reuse checks. */
/** Process-local cache of live ACP runtime handles keyed by canonical session actor. */
var ManagerRuntimeHandleCache = class {
	constructor() {
		this.runtimeCache = /* @__PURE__ */ new Map();
	}
	get(target) {
		return this.runtimeCache.get(acpSessionActorKey(target)) ?? null;
	}
	set(target, state) {
		this.runtimeCache.set(acpSessionActorKey(target), state);
	}
	clear(target) {
		this.runtimeCache.delete(acpSessionActorKey(target));
	}
	/** Returns cache counters used by ACP manager observability snapshots. */
	getObservabilitySnapshot() {
		return {
			activeSessions: this.runtimeCache.size,
			idleTtlMs: 0,
			evictedTotal: 0
		};
	}
	/** Closes and removes one cached runtime handle when present. */
	async close(params) {
		const cached = this.get(params);
		if (!cached || params.expectedHandle && cached.handle !== params.expectedHandle) return;
		params.assertActive?.();
		try {
			await cached.runtime.close({
				handle: cached.handle,
				reason: params.reason
			});
		} catch (error) {
			if (params.expectedHandle && isAcpOwnerRepairRequired(error)) throw error;
			logVerbose(`acp-manager: cached runtime close failed for ${params.sessionKey}: ${String(error)}`);
		} finally {
			if (this.get(params) === cached) this.clear(params);
		}
	}
	/** Drains every cached handle behind its session actor before process shutdown. */
	async closeAll(params) {
		await Promise.all([...this.runtimeCache.keys()].map((actorKey) => params.actorQueue.run(actorKey, async () => {
			const cached = this.runtimeCache.get(actorKey);
			if (!cached) return;
			try {
				await cached.runtime.close({
					handle: cached.handle,
					reason: params.reason
				});
			} catch (error) {
				logVerbose(`acp-manager: cached runtime close failed for ${cached.handle.sessionKey}: ${String(error)}`);
			} finally {
				if (this.runtimeCache.get(actorKey) === cached) this.runtimeCache.delete(actorKey);
			}
		})));
	}
	/** Clears a cached handle only when the caller still owns the same runtime identifiers. */
	clearIfHandleMatches(params) {
		const cached = this.get(params);
		if (!cached || !this.handlesMatch(cached.handle, params.handle)) return;
		this.clear(params);
	}
	/** Removes the captured cache entry synchronously before backend cleanup. */
	take(target) {
		const cached = this.get(target);
		if (cached) this.clear(target);
		return cached;
	}
	/** Checks whether a cached runtime handle is still healthy enough to reuse. */
	async isReusable(params) {
		if (!params.runtime.getStatus) return true;
		try {
			const status = await params.runtime.getStatus({ handle: params.handle });
			if (isRuntimeStatusUnavailable(status)) {
				logVerbose(`acp-manager: evicting cached runtime handle for ${params.sessionKey} after unhealthy status probe: ${status.summary ?? "status unavailable"}`);
				return false;
			}
			return true;
		} catch (error) {
			if (isAcpOwnerRepairRequired(error)) throw error;
			logVerbose(`acp-manager: evicting cached runtime handle for ${params.sessionKey} after status probe failed: ${String(error)}`);
			return false;
		}
	}
	handleMatchesMeta(params) {
		const identity = resolveSessionIdentityFromMeta(params.meta);
		const expectedHandleIds = resolveRuntimeHandleIdentifiersFromIdentity(identity);
		if ((params.handle.backendSessionId ?? "") !== (expectedHandleIds.backendSessionId ?? "")) return false;
		if ((params.handle.agentSessionId ?? "") !== (expectedHandleIds.agentSessionId ?? "")) return false;
		const expectedAcpxRecordId = identity?.acpxRecordId ?? "";
		return (normalizeOptionalString(params.handle.acpxRecordId) ?? "") === expectedAcpxRecordId;
	}
	handlesMatch(a, b) {
		return a.sessionKey === b.sessionKey && a.agentId === b.agentId && a.backend === b.backend && a.runtimeSessionName === b.runtimeSessionName && (a.cwd ?? "") === (b.cwd ?? "") && (a.acpxRecordId ?? "") === (b.acpxRecordId ?? "") && (a.backendSessionId ?? "") === (b.backendSessionId ?? "") && (a.agentSessionId ?? "") === (b.agentSessionId ?? "");
	}
};
function isRuntimeStatusUnavailable(status) {
	if (!status) return false;
	const detailsStatus = normalizeLowercaseStringOrEmpty(status.details?.status);
	if (detailsStatus === "dead" || detailsStatus === "no-session") return true;
	const summaryMatch = status.summary?.match(/\bstatus=([^\s]+)/i);
	const summaryStatus = normalizeLowercaseStringOrEmpty(summaryMatch?.[1]);
	return summaryStatus === "dead" || summaryStatus === "no-session";
}
//#endregion
//#region src/acp/control-plane/manager.runtime-controls.ts
const OPTIONAL_TIMEOUT_CONFIG_KEYS = /* @__PURE__ */ new Set(["timeout", "timeout_seconds"]);
const ACP_CONFIG_REJECTION_CODE_RE = /-3260[23]/;
const CONFIG_OPTION_REJECTION_RE = /invalid params|unsupported|not supported|not implement|invalid value|unknown config option|unknown value|not a valid value|must be one of/;
function extractConfigOptionKeys(value) {
	if (!Array.isArray(value)) return [];
	return value.map((entry) => {
		if (typeof entry === "string") return normalizeOptionalString(entry);
		const record = asNullableRecord(entry);
		return normalizeOptionalString(record?.id ?? record?.key);
	}).filter(Boolean);
}
function extractRuntimeStatusConfigOptionKeys(status) {
	const details = asNullableRecord(status?.details);
	return [...extractConfigOptionKeys(details?.configOptions), ...extractConfigOptionKeys(details?.config_options)];
}
function isOptionalTimeoutConfigKey(key) {
	return OPTIONAL_TIMEOUT_CONFIG_KEYS.has(normalizeLowercaseStringOrEmpty(key));
}
function isUnsupportedControlRejection(error) {
	return (error && typeof error === "object" ? error.code : null) === "ACP_BACKEND_UNSUPPORTED_CONTROL";
}
function describeConfigOptionRejection(error) {
	const described = toAcpRuntimeError({
		error,
		fallbackCode: "ACP_TURN_FAILED",
		fallbackMessage: ""
	});
	return normalizeLowercaseStringOrEmpty(`${formatAcpErrorChain(error)} ${described.message}`);
}
function isUnsupportedOptionalTimeoutConfigRejection(key, error) {
	if (!isOptionalTimeoutConfigKey(key)) return false;
	if (isUnsupportedControlRejection(error)) return true;
	const message = error instanceof Error ? error.message : typeof error === "string" ? error : String(error);
	const normalized = normalizeLowercaseStringOrEmpty(message);
	return normalized.includes("session/set_config_option") && (normalized.includes("-32602") || normalized.includes("invalid params") || normalized.includes("unsupported") || normalized.includes("not supported") || normalized.includes("not implement"));
}
function isRejectedThinkingConfigOption(key, error) {
	if (!isThinkingConfigKey(key)) return false;
	if (isUnsupportedControlRejection(error)) return true;
	const description = describeConfigOptionRejection(error);
	return (description.includes("session/set_config_option") || description.includes("config option") && description.includes(normalizeLowercaseStringOrEmpty(key))) && ACP_CONFIG_REJECTION_CODE_RE.test(description) && CONFIG_OPTION_REJECTION_RE.test(description);
}
/** Resolves backend-advertised controls plus locally inferred runtime control support. */
async function resolveManagerRuntimeCapabilities(params) {
	let reported;
	if (params.runtime.getCapabilities) reported = await withAcpRuntimeErrorBoundary({
		run: async () => await params.runtime.getCapabilities({ handle: params.handle }),
		fallbackCode: "ACP_TURN_FAILED",
		fallbackMessage: "Could not read ACP runtime capabilities."
	});
	const controls = new Set(reported?.controls ?? []);
	if (params.runtime.setMode) controls.add("session/set_mode");
	if (params.runtime.setConfigOption) controls.add("session/set_config_option");
	if (params.runtime.getStatus) controls.add("session/status");
	const normalizedKeys = new Set((reported?.configOptionKeys ?? []).map((entry) => normalizeOptionalString(entry)).filter(Boolean));
	if (normalizedKeys.size === 0 && params.includeStatusConfigOptionKeys && params.runtime.getStatus) try {
		const status = await params.runtime.getStatus({ handle: params.handle });
		for (const key of extractRuntimeStatusConfigOptionKeys(status)) normalizedKeys.add(key);
	} catch (error) {
		if (isAcpOwnerRepairRequired(error)) throw error;
	}
	return {
		controls: [...controls].toSorted(),
		...normalizedKeys.size > 0 ? { configOptionKeys: [...normalizedKeys] } : {}
	};
}
/** Applies persisted runtime options to a live handle once per unique option signature. */
async function applyManagerRuntimeControls(params) {
	const isCurrentActor = params.isCurrentActor ?? (() => true);
	if (!isCurrentActor()) throw createSupersededActorError(params.sessionKey);
	let options = resolveRuntimeOptionsFromMeta(params.meta);
	const signature = buildRuntimeControlSignature(options);
	const cached = params.getCachedRuntimeState(params.sessionKey);
	if (cached?.appliedControlSignature === signature) return;
	const needsConfigOptionKeys = buildRuntimeConfigOptionPairs(options).length > 0;
	const capabilities = await resolveManagerRuntimeCapabilities({
		runtime: params.runtime,
		handle: params.handle,
		includeStatusConfigOptionKeys: needsConfigOptionKeys
	});
	if (!isCurrentActor()) throw createSupersededActorError(params.sessionKey);
	const backend = params.handle.backend || params.meta.backend;
	const runtimeMode = normalizeOptionalString(options.runtimeMode);
	const configOptions = buildRuntimeConfigOptionPairs(options, capabilities.configOptionKeys);
	const thinkingConfigKey = options.thinking ? resolveRuntimeConfigOptionKey("thinking", capabilities.configOptionKeys) : void 0;
	const advertisedKeys = new Set((capabilities.configOptionKeys ?? []).map((entry) => normalizeLowercaseStringOrEmpty(entry)).filter(Boolean));
	await withAcpRuntimeErrorBoundary({
		run: async () => {
			if (!isCurrentActor()) throw createSupersededActorError(params.sessionKey);
			if (runtimeMode) {
				if (!capabilities.controls.includes("session/set_mode") || !params.runtime.setMode) throw createUnsupportedControlError({
					backend,
					control: "session/set_mode"
				});
				await params.runtime.setMode({
					handle: params.handle,
					mode: runtimeMode
				});
			}
			if (configOptions.length > 0) {
				if (!capabilities.controls.includes("session/set_config_option") || !params.runtime.setConfigOption) throw createUnsupportedControlError({
					backend,
					control: "session/set_config_option"
				});
				for (const [key, requestedValue] of configOptions) {
					if (!isCurrentActor()) throw createSupersededActorError(params.sessionKey);
					const value = key === thinkingConfigKey ? options.thinking : requestedValue;
					if (value === void 0) continue;
					if (advertisedKeys.size > 0 && !advertisedKeys.has(normalizeLowercaseStringOrEmpty(key))) throw new AcpRuntimeError("ACP_BACKEND_UNSUPPORTED_CONTROL", `ACP backend "${backend}" does not accept config key "${key}".`);
					try {
						const result = await params.runtime.setConfigOption({
							handle: params.handle,
							key,
							value
						});
						if (!isCurrentActor()) throw createSupersededActorError(params.sessionKey);
						const accepted = reconcileAcceptedRuntimeOptions(options, result, normalizeLowercaseStringOrEmpty(key) === "model" ? options.thinking : void 0);
						if (!runtimeOptionsEqual(options, accepted)) {
							await params.onOptionsChanged(accepted);
							if (!isCurrentActor()) throw createSupersededActorError(params.sessionKey);
							options = accepted;
						}
					} catch (error) {
						if (!isCurrentActor()) throw createSupersededActorError(params.sessionKey);
						if (isUnsupportedOptionalTimeoutConfigRejection(key, error) || isRejectedThinkingConfigOption(key, error)) continue;
						throw error;
					}
				}
			}
		},
		fallbackCode: "ACP_TURN_FAILED",
		fallbackMessage: "Could not apply ACP runtime options before turn execution."
	});
	if (!isCurrentActor()) throw createSupersededActorError(params.sessionKey);
	if (cached) cached.appliedControlSignature = buildRuntimeControlSignature(options);
}
//#endregion
//#region src/acp/control-plane/manager.runtime-options-commands.ts
/** Command handlers for changing ACP runtime mode and config options on live sessions. */
/** Applies a backend runtime mode control and persists the selected mode. */
async function runSetManagerSessionRuntimeMode(params) {
	if (!params.isCurrentActor()) throw createSupersededActorError(params.sessionKey);
	params.assertActive?.();
	const resolution = params.resolveSession({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId
	});
	const resolvedMeta = requireReadySessionMeta(resolution);
	const { runtime, handle, meta } = await params.ensureRuntimeHandle({
		assertActive: params.assertActive,
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		meta: resolvedMeta,
		isCurrentActor: params.isCurrentActor
	});
	params.assertActive?.();
	const capabilities = await resolveManagerRuntimeCapabilities({
		runtime,
		handle
	});
	if (!params.isCurrentActor()) throw createSupersededActorError(params.sessionKey);
	if (!capabilities.controls.includes("session/set_mode") || !runtime.setMode) throw createUnsupportedControlError({
		backend: handle.backend || meta.backend,
		control: "session/set_mode"
	});
	await withAcpRuntimeErrorBoundary({
		run: async () => {
			if (!params.isCurrentActor()) throw createSupersededActorError(params.sessionKey);
			params.assertActive?.();
			await runtime.setMode({
				handle,
				mode: params.runtimeMode
			});
		},
		fallbackCode: "ACP_TURN_FAILED",
		fallbackMessage: "Could not update ACP runtime mode."
	});
	if (!params.isCurrentActor()) throw createSupersededActorError(params.sessionKey);
	const nextOptions = mergeRuntimeOptions({
		current: resolveRuntimeOptionsFromMeta(meta),
		patch: { runtimeMode: params.runtimeMode }
	});
	await persistManagerRuntimeOptions({
		...params,
		options: nextOptions
	});
	return nextOptions;
}
/** Applies a backend config-option control and persists the inferred runtime option patch. */
async function runSetManagerSessionConfigOption(params) {
	if (!params.isCurrentActor()) throw createSupersededActorError(params.sessionKey);
	params.assertActive?.();
	const resolution = params.resolveSession({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId
	});
	const resolvedMeta = requireReadySessionMeta(resolution);
	const { runtime, handle, meta } = await params.ensureRuntimeHandle({
		assertActive: params.assertActive,
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		meta: resolvedMeta,
		isCurrentActor: params.isCurrentActor
	});
	params.assertActive?.();
	const inferredPatch = inferRuntimeOptionPatchFromConfigOption(params.key, params.value);
	const capabilities = await resolveManagerRuntimeCapabilities({
		runtime,
		handle,
		includeStatusConfigOptionKeys: true
	});
	if (!params.isCurrentActor()) throw createSupersededActorError(params.sessionKey);
	if (!capabilities.controls.includes("session/set_config_option") || !runtime.setConfigOption) throw createUnsupportedControlError({
		backend: handle.backend || meta.backend,
		control: "session/set_config_option"
	});
	const advertisedKeys = new Set((capabilities.configOptionKeys ?? []).map((entry) => normalizeLowercaseStringOrEmpty(entry)).filter(Boolean));
	const wireKey = resolveRuntimeConfigOptionKey(params.key, capabilities.configOptionKeys);
	if (advertisedKeys.size > 0 && !advertisedKeys.has(normalizeLowercaseStringOrEmpty(wireKey))) throw new AcpRuntimeError("ACP_BACKEND_UNSUPPORTED_CONTROL", `ACP backend "${handle.backend || meta.backend}" does not accept config key "${wireKey}".`);
	params.assertActive?.();
	const result = await withAcpRuntimeErrorBoundary({
		run: async () => await runtime.setConfigOption({
			handle,
			key: wireKey,
			value: params.value
		}),
		fallbackCode: "ACP_TURN_FAILED",
		fallbackMessage: "Could not update ACP runtime config option."
	});
	if (!params.isCurrentActor()) throw createSupersededActorError(params.sessionKey);
	const nextOptions = reconcileAcceptedRuntimeOptions(mergeRuntimeOptions({
		current: resolveRuntimeOptionsFromMeta(meta),
		patch: inferredPatch
	}), result);
	await persistManagerRuntimeOptions({
		...params,
		options: nextOptions
	});
	return nextOptions;
}
/** Persists runtime option changes that do not need an immediate backend control call. */
async function runUpdateManagerSessionRuntimeOptions(params) {
	if (!params.isCurrentActor()) throw createSupersededActorError(params.sessionKey);
	params.assertActive?.();
	const resolution = params.resolveSession({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId
	});
	const resolvedMeta = requireReadySessionMeta(resolution);
	const nextOptions = mergeRuntimeOptions({
		current: resolveRuntimeOptionsFromMeta(resolvedMeta),
		patch: params.patch
	});
	await persistManagerRuntimeOptions({
		...params,
		assertCommitAllowed: params.assertActive,
		options: nextOptions
	});
	return nextOptions;
}
/** Closes the current runtime handle and clears persisted runtime options. */
async function runResetManagerSessionRuntimeOptions(params) {
	if (!params.isCurrentActor()) throw createSupersededActorError(params.sessionKey);
	params.assertActive?.();
	const resolution = params.resolveSession({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId
	});
	requireReadySessionMeta(resolution);
	const cached = params.runtimeHandles.get(params);
	if (cached) {
		await withAcpRuntimeErrorBoundary({
			run: async () => await cached.runtime.close({
				handle: cached.handle,
				reason: "reset-runtime-options"
			}),
			fallbackCode: "ACP_TURN_FAILED",
			fallbackMessage: "Could not reset ACP runtime options."
		});
		if (!params.isCurrentActor()) throw createSupersededActorError(params.sessionKey);
		params.runtimeHandles.clearIfHandleMatches({
			...params,
			handle: cached.handle
		});
	}
	await persistManagerRuntimeOptions({
		...params,
		assertCommitAllowed: cached ? void 0 : params.assertActive,
		options: {}
	});
	return {};
}
async function persistManagerRuntimeOptions(params) {
	const normalized = normalizeRuntimeOptions(params.options);
	const hasOptions = Object.keys(normalized).length > 0;
	if (!params.isCurrentActor()) throw createSupersededActorError(params.sessionKey);
	await params.writeSessionMeta({
		assertCommitAllowed: params.assertCommitAllowed,
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		isCurrentActor: params.isCurrentActor,
		mutate: (current, entry) => {
			if (!entry || !current) return null;
			return {
				backend: current.backend,
				agent: current.agent,
				runtimeSessionName: current.runtimeSessionName,
				...current.identity ? { identity: current.identity } : {},
				mode: current.mode,
				runtimeOptions: hasOptions ? normalized : void 0,
				cwd: normalized.cwd,
				state: current.state,
				lastActivityAt: Date.now(),
				...current.lastError ? { lastError: current.lastError } : {}
			};
		},
		failOnError: true
	});
	if (!params.isCurrentActor()) throw createSupersededActorError(params.sessionKey);
	const cached = params.runtimeHandles.get(params);
	if (!cached) return;
	cached.appliedControlSignature = void 0;
}
//#endregion
//#region src/acp/control-plane/manager.startup-identity-reconcile.ts
/** Startup scan that resolves pending ACP session identities when backends can report status. */
/** Resolves pending ACP session identities opportunistically during manager startup. */
async function runManagerStartupIdentityReconcile(params) {
	let checked = 0;
	let resolved = 0;
	let failed = 0;
	let acpSessions;
	try {
		acpSessions = await params.deps.listAcpSessions({ cfg: params.cfg });
	} catch (error) {
		logVerbose(`acp-manager: startup identity scan failed: ${String(error)}`);
		return {
			checked,
			resolved,
			failed: failed + 1
		};
	}
	for (const session of acpSessions) {
		if (!session.acp || !session.sessionKey) continue;
		if (session.acp.mode === "oneshot") continue;
		const currentIdentity = resolveSessionIdentityFromMeta(session.acp);
		if (!isSessionIdentityPending(currentIdentity) || !identityHasStableSessionId(currentIdentity)) continue;
		checked += 1;
		try {
			const target = resolveAcpSessionTarget({
				cfg: params.cfg,
				sessionKey: session.sessionKey,
				agentId: session.agentId
			});
			if (await params.withSessionActor(target, async (isCurrentActor) => {
				const resolution = params.resolveSession({
					cfg: params.cfg,
					...target
				});
				if (resolution.kind !== "ready") return false;
				const { runtime, handle, meta } = await params.ensureRuntimeHandle({
					cfg: params.cfg,
					...target,
					meta: resolution.meta,
					isCurrentActor
				});
				const reconciled = await params.reconcileRuntimeSessionIdentifiers({
					cfg: params.cfg,
					...target,
					runtime,
					handle,
					meta,
					failOnStatusError: false,
					isCurrentActor
				});
				return !isSessionIdentityPending(resolveSessionIdentityFromMeta(reconciled.meta));
			})) resolved += 1;
		} catch (error) {
			failed += 1;
			logVerbose(`acp-manager: startup identity reconcile failed for ${session.sessionKey}: ${String(error)}`);
		}
	}
	return {
		checked,
		resolved,
		failed
	};
}
//#endregion
//#region src/acp/control-plane/manager.status.ts
/** Reads ACP session status from the runtime and reconciles persisted identity metadata. */
/** Reads a fresh ACP session status and reconciles runtime identifiers from the status response. */
async function runManagerGetSessionStatus(params) {
	const isCurrentActor = params.isCurrentActor ?? (() => true);
	if (!isCurrentActor()) throw createSupersededActorError(params.sessionKey);
	params.assertActive?.();
	params.throwIfAborted(params.signal);
	const resolution = params.resolveSession({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId
	});
	const resolvedMeta = requireReadySessionMeta(resolution);
	const { runtime, handle: ensuredHandle, meta: initialMeta } = await params.ensureRuntimeHandle({
		assertActive: params.assertActive,
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		meta: resolvedMeta,
		isCurrentActor
	});
	let handle = ensuredHandle;
	params.assertActive?.();
	const capabilities = await resolveManagerRuntimeCapabilities({
		runtime,
		handle
	});
	if (!isCurrentActor()) throw createSupersededActorError(params.sessionKey);
	let runtimeStatus;
	if (runtime.getStatus) runtimeStatus = await withAcpRuntimeErrorBoundary({
		run: async () => {
			params.throwIfAborted(params.signal);
			params.assertActive?.();
			const status = await runtime.getStatus({
				handle,
				...params.signal ? { signal: params.signal } : {}
			});
			params.throwIfAborted(params.signal);
			return status;
		},
		fallbackCode: "ACP_TURN_FAILED",
		fallbackMessage: "Could not read ACP runtime status."
	});
	if (!isCurrentActor()) throw createSupersededActorError(params.sessionKey);
	const reconciledSession = await params.reconcileRuntimeSessionIdentifiers({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		runtime,
		handle,
		meta: initialMeta,
		runtimeStatus,
		failOnStatusError: true,
		isCurrentActor
	});
	handle = reconciledSession.handle;
	const meta = reconciledSession.meta;
	runtimeStatus = reconciledSession.runtimeStatus;
	const identity = resolveSessionIdentityFromMeta(meta);
	return {
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		backend: handle.backend || meta.backend,
		agent: meta.agent,
		...identity ? { identity } : {},
		state: meta.state,
		mode: meta.mode,
		runtimeOptions: resolveRuntimeOptionsFromMeta(meta),
		capabilities,
		runtimeStatus,
		lastActivityAt: meta.lastActivityAt,
		lastError: meta.lastError
	};
}
//#endregion
//#region src/acp/control-plane/manager.backend-failover.ts
/** Builds the deduped backend order from configured primary, resolved primary, and fallbacks. */
function resolveBackendCandidatePlan(params) {
	const configuredPrimaryBackend = normalizeOptionalString(params.configuredPrimaryBackend);
	const resolvedPrimaryBackend = normalizeOptionalString(params.resolvedPrimaryBackend);
	const fallbackBackends = Array.isArray(params.fallbackBackends) ? params.fallbackBackends.map((backend) => normalizeOptionalString(backend)).filter((backend) => backend != null) : [];
	return {
		candidateBackends: Array.from(/* @__PURE__ */ new Set([configuredPrimaryBackend ?? resolvedPrimaryBackend ?? "", ...fallbackBackends])),
		describeBackendCandidate: (backend) => backend || resolvedPrimaryBackend || configuredPrimaryBackend || "<auto>"
	};
}
/** Returns true for early transient backend errors where trying another backend is safe. */
function isFailoverWorthyBackendError(attempt) {
	return !attempt.promptStarted && !attempt.sawOutput && (attempt.code === "ACP_TURN_FAILED" || attempt.code === "ACP_SESSION_INIT_FAILED" || attempt.code === "ACP_BACKEND_UNAVAILABLE") && /\b(?:unavailable|rate[-\s]?limit(?:ed|ing)?|quota|exhausted|temporar(?:y|ily)|overloaded)\b/i.test(attempt.error);
}
/** Returns whether another backend candidate remains after the current index. */
function shouldAttemptBackendFailover(params) {
	return params.backendIndex < params.candidateBackends.length - 1;
}
//#endregion
//#region src/acp/control-plane/manager.turn-stream.ts
function isCancellationStopReason(stopReason) {
	return stopReason === "cancel" || stopReason === "cancelled" || stopReason === "manual-cancel";
}
/** Resolves legacy and current done events to the manager's canonical terminal status. */
function resolveAcpTurnTerminalStatus(event) {
	return event.status ?? (isCancellationStopReason(event.stopReason) ? "cancelled" : "completed");
}
async function consumeAcpTurnEvents(params) {
	let streamError = null;
	let sawOutput = false;
	let terminalStatus;
	for await (const event of params.events) {
		if (!params.eventGate.open) continue;
		let forwardedEvent = event;
		if (event.type === "done") {
			terminalStatus = resolveAcpTurnTerminalStatus(event);
			forwardedEvent = {
				...event,
				status: terminalStatus
			};
		} else if (event.type === "error") streamError = new AcpRuntimeError(normalizeAcpErrorCode(event.code), normalizeOptionalString(event.message) || "ACP turn failed before completion.", event.detailCode ? { detailCode: event.detailCode } : void 0);
		const outputEvent = event.type === "text_delta" || event.type === "tool_call" ? event : void 0;
		if (outputEvent) sawOutput = true;
		params.eventGate.pendingDelivery = Promise.resolve(outputEvent ? params.onOutputEvent?.(outputEvent) : void 0).then(() => params.onEvent?.(forwardedEvent));
		try {
			await params.eventGate.pendingDelivery;
		} finally {
			params.eventGate.pendingDelivery = void 0;
		}
	}
	if (params.eventGate.open && streamError) throw streamError;
	return {
		sawOutput,
		terminalStatus
	};
}
function errorFromTurnResult(result) {
	return new AcpRuntimeError(normalizeAcpErrorCode(result.error.code), normalizeOptionalString(result.error.message) || "ACP turn failed before completion.", result.error.detailCode ? { detailCode: result.error.detailCode } : void 0);
}
function waitForQueuedEvents() {
	return new Promise((resolve) => {
		setTimeout(() => resolve("pending"), 0);
	});
}
async function notifyTerminalResult(params) {
	if (!params.eventGate.open) return;
	if (params.result.status === "completed" || params.result.status === "cancelled") {
		await params.onEvent?.({
			type: "done",
			status: params.result.status,
			...params.result.stopReason ? { stopReason: params.result.stopReason } : {}
		});
		return;
	}
	await params.onEvent?.({
		type: "error",
		code: normalizeAcpErrorCode(params.result.error.code),
		...params.result.error.detailCode ? { detailCode: params.result.error.detailCode } : {},
		message: normalizeOptionalString(params.result.error.message) || "ACP turn failed before completion.",
		...params.result.error.retryable === void 0 ? {} : { retryable: params.result.error.retryable }
	});
}
/** A pre-submission cancellation has a normal terminal event, not a failed prompt. */
async function emitCancelledAcpTurn(onEvent) {
	await onEvent?.({
		type: "done",
		status: "cancelled",
		stopReason: "cancel"
	});
	return {
		sawOutput: false,
		terminalStatus: "cancelled"
	};
}
/** Consumes runtime turn APIs and emits normalized events while tracking output/terminal state. */
async function consumeAcpTurnStream(params) {
	if (params.turn.signal?.aborted) {
		await params.onCancellation?.();
		return await emitCancelledAcpTurn(params.onEvent);
	}
	if (params.onBeforePrompt) await params.onBeforePrompt();
	if (params.turn.signal?.aborted) {
		await params.onCancellation?.();
		return await emitCancelledAcpTurn(params.onEvent);
	}
	if (params.runtime.startTurn) {
		const turn = params.runtime.startTurn(params.turn);
		let promptReadinessOpen = true;
		let promptNotificationStarted = false;
		const readinessPromise = turn.promptStarted?.then(async () => {
			if (!promptReadinessOpen || !params.eventGate.open) return { kind: "prompt-start-closed" };
			promptNotificationStarted = true;
			try {
				await params.onPromptStarted?.({ authoritative: true });
			} catch (error) {
				return {
					kind: "prompt-start-error",
					error
				};
			}
			return { kind: "prompt-started" };
		}, (error) => ({
			kind: "prompt-start-error",
			error
		}));
		const resultPromise = turn.result.then(async (result) => {
			promptReadinessOpen = false;
			if (promptNotificationStarted) await readinessPromise;
			return {
				kind: "result",
				result
			};
		}, async (error) => {
			promptReadinessOpen = false;
			if (promptNotificationStarted) await readinessPromise;
			return {
				kind: "result-error",
				error
			};
		});
		const eventsPromise = consumeAcpTurnEvents({
			events: turn.events,
			eventGate: params.eventGate,
			onEvent: params.onEvent,
			onOutputEvent: params.onOutputEvent
		}).then((outcome) => ({
			kind: "events",
			outcome
		}), async (error) => {
			await turn.cancel({ reason: "turn-events-error" }).catch(() => {});
			await turn.closeStream({ reason: "turn-events-error" }).catch(() => {});
			await resultPromise;
			return {
				kind: "event-error",
				error
			};
		});
		if (readinessPromise) {
			const readiness = await Promise.race([readinessPromise, resultPromise]);
			if (readiness.kind === "prompt-start-error") {
				await turn.closeStream({ reason: "turn-prompt-start-error" }).catch(() => {});
				const terminalOutcome = await resultPromise;
				if (terminalOutcome.kind === "result" && terminalOutcome.result.status === "completed") throw readiness.error;
			}
		} else await params.onPromptStarted?.({ authoritative: false });
		let eventOutcome = null;
		let result = null;
		const firstOutcome = await Promise.race([eventsPromise, resultPromise]);
		if (firstOutcome.kind === "event-error") throw firstOutcome.error;
		if (firstOutcome.kind === "events") eventOutcome = firstOutcome.outcome;
		else if (firstOutcome.kind === "result-error") {
			await turn.closeStream({ reason: "turn-result-error" }).catch(() => {});
			throw firstOutcome.error;
		} else result = firstOutcome.result;
		if (!result) {
			const terminalOutcome = await resultPromise;
			if (terminalOutcome.kind === "result-error") {
				await turn.closeStream({ reason: "turn-result-error" }).catch(() => {});
				throw terminalOutcome.error;
			}
			result = terminalOutcome.result;
		}
		let closedTerminalStream = false;
		while (!eventOutcome) {
			await params.eventGate.pendingDelivery?.catch(() => {});
			let eventsOutcome = await Promise.race([eventsPromise, waitForQueuedEvents()]);
			if (eventsOutcome === "pending") {
				if (params.eventGate.pendingDelivery) continue;
				await turn.closeStream({ reason: `turn-result-${result.status}` }).catch(() => {});
				closedTerminalStream = true;
				eventsOutcome = await eventsPromise;
			}
			if (eventsOutcome.kind === "event-error") throw eventsOutcome.error;
			eventOutcome = eventsOutcome.outcome;
		}
		if (result.status !== "completed" && !closedTerminalStream) await turn.closeStream({ reason: `turn-result-${result.status}` }).catch(() => {});
		await notifyTerminalResult({
			result,
			eventGate: params.eventGate,
			onEvent: params.onEvent
		});
		if (result.status === "failed") throw errorFromTurnResult(result);
		return {
			sawOutput: eventOutcome.sawOutput,
			terminalStatus: result.status
		};
	}
	const events = params.runtime.runTurn(params.turn);
	await params.onPromptStarted?.({ authoritative: false });
	return await consumeAcpTurnEvents({
		events,
		eventGate: params.eventGate,
		onEvent: params.onEvent,
		onOutputEvent: params.onOutputEvent
	});
}
//#endregion
//#region src/acp/control-plane/manager.turn-runner.ts
const ACP_TURN_TIMEOUT_GRACE_MS = 1e3;
const ACP_COMPLETION_EVIDENCE_MAX_BYTES = 102400;
/** Executes one ACP prompt turn against the selected backend and records terminal state. */
async function runManagerTurn(params) {
	const { input, sessionKey, agentId } = params;
	if (input.admittedRunContext.operationalRunInstance.runId !== input.requestId) throw new Error("ACP operational run instance disagrees with the admitted request");
	const turnStartedAt = Date.now();
	const actorKey = acpSessionActorKey(params);
	const taskContext = input.mode === "prompt" ? resolveBackgroundTaskContext({
		deps: params.deps,
		cfg: input.cfg,
		sessionKey,
		agentId,
		requestId: input.requestId,
		text: input.text
	}) : null;
	const taskRecord = taskContext ? createBackgroundTaskRecord(taskContext, turnStartedAt, input.admittedRunContext.operationalRunInstance.instanceId) : void 0;
	let taskExecutionBinding;
	let taskProgressSummary = "";
	const initialResolution = params.resolveSession({
		cfg: input.cfg,
		sessionKey,
		agentId
	});
	const initialMeta = requireReadySessionMeta(initialResolution);
	recordSessionHumanDirectMessage({
		sessionKey,
		entry: initialResolution.kind === "ready" ? initialResolution.entry : void 0,
		actor: { actorType: input.provenance },
		channel: "acp",
		runId: input.requestId
	});
	const spawnedByWatcher = initialResolution.kind === "ready" ? initialResolution.entry?.spawnedBy ?? initialResolution.entry?.parentSessionKey : void 0;
	const { candidateBackends, describeBackendCandidate } = resolveBackendCandidatePlan({
		configuredPrimaryBackend: input.cfg.acp?.backend,
		resolvedPrimaryBackend: initialMeta.backend,
		fallbackBackends: input.cfg.acp?.fallbacks
	});
	const backendAttempts = [];
	const recordBackendFailure = async (error) => {
		await taskExecutionBinding;
		if (!params.isCurrentActor()) throw createSupersededActorError(sessionKey);
		const failedBackends = backendAttempts.map((attempt) => `${attempt.backend}: ${attempt.error}`).join(" | ");
		const errorToRecord = backendAttempts.length > 1 ? new AcpRuntimeError(error.code, `All ACP backends failed (${backendAttempts.length}): ${failedBackends}`, { detailCode: error.detailCode }) : error;
		params.recordTurnCompletion({
			startedAt: turnStartedAt,
			errorCode: errorToRecord.code
		});
		if (taskContext) {
			const failureStatus = resolveBackgroundTaskFailureStatus(errorToRecord);
			if (taskRecord) markBackgroundTaskTerminal(taskRecord, {
				status: failureStatus,
				endedAt: Date.now(),
				lastEventAt: Date.now(),
				error: formatAcpErrorChain(errorToRecord),
				progressSummary: taskProgressSummary || null,
				terminalSummary: failureStatus === "timed_out" ? taskProgressSummary || null : null
			});
			if (spawnedByWatcher) recordSubagentTerminalState({
				childSessionKey: sessionKey,
				runId: taskContext.runId,
				requesterSessionKey: spawnedByWatcher,
				outcomeStatus: failureStatus === "timed_out" ? "timeout" : "error"
			});
		}
		await params.setSessionState({
			cfg: input.cfg,
			sessionKey,
			agentId,
			isCurrentActor: params.isCurrentActor,
			state: "error",
			lastError: formatAcpErrorChain(errorToRecord)
		});
		throw errorToRecord;
	};
	const releaseActiveTurn = taskContext ? markAcpTurnActive(params) : void 0;
	try {
		for (const [backendIdx, currentBackend] of candidateBackends.entries()) {
			if (backendIdx > 0) {
				await params.runtimeHandles.close({
					sessionKey,
					agentId,
					reason: "backend-failover"
				});
				logVerbose(`acp-manager: switching backend for ${sessionKey} from ${describeBackendCandidate(expectDefined(candidateBackends[backendIdx - 1], "candidate backends entry at backend idx 1"))} to ${describeBackendCandidate(currentBackend)}`);
			}
			for (let attempt = 0; attempt < 2; attempt += 1) {
				const resolution = backendIdx === 0 && attempt === 0 ? initialResolution : params.resolveSession({
					cfg: input.cfg,
					sessionKey,
					agentId
				});
				const resolvedMeta = requireReadySessionMeta(resolution);
				let runtime;
				let handle;
				let meta;
				let activeTurn;
				let activeTurnStarted = false;
				let promptStarted = false;
				let sawTurnOutput = false;
				let retryFreshHandle = false;
				let skipPostTurnCleanup = false;
				let completionEvidenceText = "";
				let completionEvidenceBytes = 0;
				let completionEvidenceOverflowed = false;
				try {
					const ensured = await params.ensureRuntimeHandle({
						cfg: input.cfg,
						sessionKey,
						agentId,
						meta: resolvedMeta,
						selectedBackend: currentBackend,
						isCurrentActor: params.isCurrentActor
					});
					if (!params.isCurrentActor()) throw createSupersededActorError(sessionKey);
					runtime = ensured.runtime;
					handle = ensured.handle;
					meta = ensured.meta;
					activeTurn = {
						requestId: input.requestId,
						instanceId: input.admittedRunContext.operationalRunInstance.instanceId,
						runtime,
						handle,
						abortController: params.acceptedTurn.abortController
					};
					params.acceptedTurn.activeTurn = activeTurn;
					params.activeTurnBySession.set(actorKey, activeTurn);
					if (!input.signal?.aborted) await applyManagerRuntimeControls({
						sessionKey,
						runtime,
						handle,
						meta,
						isCurrentActor: params.isCurrentActor,
						getCachedRuntimeState: () => params.runtimeHandles.get(params),
						onOptionsChanged: async (runtimeOptions) => {
							await params.writeSessionMeta({
								cfg: input.cfg,
								sessionKey,
								agentId,
								isCurrentActor: params.isCurrentActor,
								mutate: (current) => current ? {
									...current,
									runtimeOptions
								} : null,
								failOnError: true
							});
							meta = {
								...ensured.meta,
								runtimeOptions
							};
						}
					});
					if (!input.signal?.aborted) await params.setSessionState({
						cfg: input.cfg,
						sessionKey,
						agentId,
						isCurrentActor: params.isCurrentActor,
						state: "running",
						clearLastError: true
					});
					if (!params.isCurrentActor()) throw createSupersededActorError(sessionKey);
					activeTurnStarted = true;
					const turnToCancel = activeTurn;
					const eventGate = { open: true };
					const turnPromise = consumeAcpTurnStream({
						runtime,
						turn: {
							handle,
							text: input.text,
							attachments: input.attachments,
							mode: input.mode,
							requestId: input.requestId,
							signal: input.signal,
							onElicitation: input.onElicitation
						},
						eventGate,
						onBeforePrompt: input.onBeforePrompt,
						onCancellation: () => cancelManagerActiveTurn({
							activeTurn: turnToCancel,
							reason: params.acceptedTurn.cancelReason,
							revalidate: params.acceptedTurn.revalidateCancel
						}),
						onPromptStarted: async ({ authoritative }) => {
							if (!params.isCurrentActor()) return;
							promptStarted = authoritative;
							if (authoritative && taskRecord) {
								const assertAdmitted = resolveAdmittedRunActiveAssertion(input.admittedRunContext);
								taskExecutionBinding ??= bindBackgroundTaskExecution(taskRecord, input.admittedRunContext, () => {
									if (!params.isCurrentActor()) throw createSupersededActorError(sessionKey);
									if (!assertAdmitted) throw new Error("ACP execution authority closed before owner binding");
									assertAdmitted();
								});
								await taskExecutionBinding;
								if (!params.isCurrentActor()) return;
								if (!assertAdmitted) throw new Error("ACP execution authority closed before owner binding");
								assertAdmitted();
							}
							try {
								await input.onLifecycle?.({
									type: "prompt_submitted",
									at: Date.now()
								});
							} catch (error) {
								logVerbose(`acp-manager: prompt submission observer failed for ${sessionKey}: ${String(error)}`);
							}
						},
						onOutputEvent: (event) => {
							if (!params.isCurrentActor()) return;
							sawTurnOutput = true;
							if (event.type === "text_delta" && event.stream !== "thought" && event.text) {
								taskProgressSummary = appendBackgroundTaskProgressSummary(taskProgressSummary, event.text);
								if (taskContext && !completionEvidenceOverflowed) {
									completionEvidenceText += event.text;
									completionEvidenceBytes = Buffer.byteLength(completionEvidenceText, "utf8");
									if (completionEvidenceBytes > ACP_COMPLETION_EVIDENCE_MAX_BYTES) {
										completionEvidenceOverflowed = true;
										completionEvidenceText = "";
									}
								}
							}
							if (taskRecord) markBackgroundTaskRunning(taskRecord, {
								lastEventAt: Date.now(),
								progressSummary: taskProgressSummary || null
							});
						},
						onEvent: async (event) => {
							if (params.isCurrentActor()) await input.onEvent?.(event);
						}
					});
					const turnTimeoutMs = resolveTurnTimeoutMs({
						cfg: input.cfg,
						meta
					});
					const sessionMode = meta.mode;
					const turnOutcome = await awaitTurnWithTimeout({
						sessionKey,
						turnPromise,
						timeoutMs: turnTimeoutMs + ACP_TURN_TIMEOUT_GRACE_MS,
						timeoutLabelMs: turnTimeoutMs,
						onTimeout: async () => {
							eventGate.open = false;
							skipPostTurnCleanup = true;
							if (!activeTurn) return;
							await cleanupTimedOutTurn({
								sessionKey,
								activeTurn,
								mode: sessionMode,
								clearCachedRuntimeStateIfHandleMatches: (turn) => {
									if (!params.isCurrentActor()) return;
									params.runtimeHandles.clearIfHandleMatches({
										sessionKey,
										agentId,
										handle: turn.handle
									});
								}
							});
						}
					});
					if (!params.isCurrentActor()) throw createSupersededActorError(sessionKey);
					if (!turnOutcome.terminalStatus) throw new AcpRuntimeError("ACP_TURN_FAILED", "ACP turn ended without a terminal done event.");
					params.recordTurnCompletion({ startedAt: turnStartedAt });
					if (taskContext) {
						const terminalResult = turnOutcome.terminalStatus === "cancelled" ? {} : completionEvidenceOverflowed ? {
							terminalOutcome: "blocked",
							terminalSummary: "Required completion output exceeded the 100 KB verification limit; inspect the child session for the final deliverable."
						} : resolveBackgroundTaskTerminalResult(completionEvidenceText);
						if (taskRecord) markBackgroundTaskTerminal(taskRecord, {
							status: turnOutcome.terminalStatus === "cancelled" ? "cancelled" : "succeeded",
							endedAt: Date.now(),
							lastEventAt: Date.now(),
							error: void 0,
							progressSummary: taskProgressSummary || null,
							terminalSummary: terminalResult.terminalSummary ?? null,
							terminalOutcome: terminalResult.terminalOutcome
						});
						if (spawnedByWatcher) recordSubagentTerminalState({
							childSessionKey: sessionKey,
							runId: taskContext.runId,
							requesterSessionKey: spawnedByWatcher,
							outcomeStatus: turnOutcome.terminalStatus === "cancelled" ? "cancelled" : "ok"
						});
					}
					await params.setSessionState({
						cfg: input.cfg,
						sessionKey,
						agentId,
						isCurrentActor: params.isCurrentActor,
						state: "idle",
						clearLastError: true
					});
					return;
				} catch (error) {
					const acpError = toAcpRuntimeError({
						error,
						fallbackCode: activeTurnStarted ? "ACP_TURN_FAILED" : "ACP_SESSION_INIT_FAILED",
						fallbackMessage: activeTurnStarted ? "ACP turn failed before completion." : "Could not initialize ACP session runtime."
					});
					if (!params.isCurrentActor()) throw createSupersededActorError(sessionKey);
					retryFreshHandle = await prepareFreshManagerRuntimeHandleRetry({
						attempt,
						cfg: input.cfg,
						sessionKey,
						agentId,
						error: acpError,
						promptStarted,
						sawTurnOutput,
						runtime,
						meta,
						runtimeHandles: params.runtimeHandles,
						writeSessionMeta: params.writeSessionMeta,
						isCurrentActor: params.isCurrentActor
					});
					if (!params.isCurrentActor()) throw createSupersededActorError(sessionKey);
					if (retryFreshHandle) continue;
					const backendAttempt = {
						backend: describeBackendCandidate(currentBackend),
						error: acpError.message,
						code: acpError.code,
						promptStarted,
						sawOutput: sawTurnOutput
					};
					backendAttempts.push(backendAttempt);
					if (isAcpOwnerRepairRequired(acpError) || !isFailoverWorthyBackendError(backendAttempt) || !shouldAttemptBackendFailover({
						backendIndex: backendIdx,
						candidateBackends
					})) await recordBackendFailure(acpError);
					break;
				} finally {
					if (params.acceptedTurn.activeTurn === activeTurn) params.acceptedTurn.activeTurn = void 0;
					if (activeTurn && params.activeTurnBySession.get(actorKey) === activeTurn) params.activeTurnBySession.delete(actorKey);
					if (!retryFreshHandle && !skipPostTurnCleanup && runtime && handle && meta && params.isCurrentActor()) ({handle, meta} = await params.reconcileRuntimeSessionIdentifiers({
						cfg: input.cfg,
						sessionKey,
						agentId,
						runtime,
						handle,
						meta,
						failOnStatusError: false,
						isCurrentActor: params.isCurrentActor
					}));
					if (!retryFreshHandle && !skipPostTurnCleanup && runtime && handle && meta && params.isCurrentActor() && meta.mode === "oneshot") try {
						await runtime.close({
							handle,
							reason: "oneshot-complete"
						});
					} catch (error) {
						logVerbose(`acp-manager: ACP oneshot close failed for ${sessionKey}: ${String(error)}`);
					} finally {
						if (params.isCurrentActor()) params.runtimeHandles.clearIfHandleMatches({
							...params,
							handle
						});
					}
				}
			}
		}
	} finally {
		try {
			await taskExecutionBinding;
		} finally {
			releaseActiveTurn?.();
		}
	}
}
//#endregion
//#region src/acp/control-plane/manager.types.ts
const DEFAULT_DEPS = {
	listAcpSessions: listAcpSessionEntries,
	loadSessionEntry: readAcpSessionEntry,
	upsertSessionMeta: upsertAcpSessionMeta,
	getRuntimeBackend: getAcpRuntimeBackend,
	requireRuntimeBackend: requireAcpRuntimeBackend
};
//#endregion
//#region src/acp/control-plane/session-actor-queue.ts
/** Serializes each current actor lane without retaining a history of retired lanes. */
var SessionActorQueue = class {
	constructor() {
		this.lanes = /* @__PURE__ */ new Map();
		this.nextLaneId = 0;
		this.pendingCount = 0;
	}
	getTotalPendingCount() {
		return this.pendingCount;
	}
	/** Holds a generation until the caller releases its cleanup/operation custody. */
	capture(actorKey) {
		let lane = this.lanes.get(actorKey);
		if (!lane) {
			lane = {
				id: ++this.nextLaneId,
				queue: new KeyedAsyncQueue(),
				users: 0,
				retired: false
			};
			this.lanes.set(actorKey, lane);
		}
		const captured = lane;
		captured.users += 1;
		let released = false;
		return {
			id: captured.id,
			queue: captured.queue,
			isCurrent: () => !released && !captured.retired,
			release: () => {
				if (released) return;
				released = true;
				captured.users -= 1;
				if (captured.users === 0 && this.lanes.get(actorKey) === captured) this.lanes.delete(actorKey);
			}
		};
	}
	async run(actorKey, op) {
		const captured = this.capture(actorKey);
		try {
			return await captured.queue.enqueue(`${actorKey}\u0000${captured.id}`, async () => {
				if (!captured.isCurrent()) throw new Error(`ACP session actor was superseded for ${actorKey}.`);
				return await op(captured.isCurrent);
			}, {
				onEnqueue: () => {
					this.pendingCount += 1;
				},
				onSettle: () => {
					this.pendingCount -= 1;
				}
			});
		} finally {
			captured.release();
		}
	}
	/** Fresh work bypasses a stuck lane; only outstanding operations retain the retired token. */
	rotate(actorKey) {
		const lane = this.lanes.get(actorKey);
		if (lane) {
			lane.retired = true;
			this.lanes.delete(actorKey);
		}
	}
};
//#endregion
//#region src/acp/control-plane/manager.core.ts
/** Coordinates ACP session metadata, runtime handles, per-session queues, and turn execution. */
var AcpSessionManager = class {
	constructor(deps = DEFAULT_DEPS) {
		this.actorQueue = new SessionActorQueue();
		this.runtimeHandles = new ManagerRuntimeHandleCache();
		this.activeTurnBySession = /* @__PURE__ */ new Map();
		this.acceptedTurns = /* @__PURE__ */ new Map();
		this.stopping = false;
		this.turnLatencyStats = {
			completed: 0,
			failed: 0,
			totalMs: 0,
			maxMs: 0
		};
		this.errorCountsByCode = /* @__PURE__ */ new Map();
		this.deps = deps;
		registerAcpSessionResetControls(this, {
			captureSessionRuntimeOwnership: (params) => {
				const ownership = this.actorQueue.capture(acpSessionActorKey(resolveAcpSessionTarget(params)));
				return {
					isCurrent: ownership.isCurrent,
					release: ownership.release
				};
			},
			forceDiscardSessionRuntime: (params) => this.#forceDiscardSessionRuntime(params)
		});
		registerAcpSessionManagerDisposer(this, async (reason) => {
			this.stopping = true;
			const acceptedTurns = [];
			for (const turns of this.acceptedTurns.values()) for (const turn of turns) acceptedTurns.push(turn);
			await Promise.all(acceptedTurns.map(async (acceptedTurn) => {
				try {
					await cancelManagerAcceptedTurn({
						acceptedTurn,
						reason
					});
				} catch (error) {
					logVerbose(`acp-manager: active runtime cancel failed for ${acceptedTurn.requestId}: ${String(error)}`);
				}
			}));
			await this.runtimeHandles.closeAll({
				actorQueue: this.actorQueue,
				reason
			});
			this.activeTurnBySession.clear();
		});
	}
	resolveSession(params) {
		if (!params.sessionKey.trim()) return {
			kind: "none",
			sessionKey: ""
		};
		const target = resolveAcpSessionTarget(params);
		const { sessionKey } = target;
		const stored = this.deps.loadSessionEntry({
			cfg: params.cfg,
			...target,
			clone: false
		});
		const acp = stored?.acp;
		if (acp) return {
			kind: "ready",
			...target,
			meta: acp,
			entry: stored.entry
		};
		if (isAcpSessionKey(sessionKey)) return {
			kind: "stale",
			...target,
			error: resolveMissingMetaError(sessionKey)
		};
		return {
			kind: "none",
			...target
		};
	}
	getObservabilitySnapshot() {
		const completedTurns = this.turnLatencyStats.completed + this.turnLatencyStats.failed;
		const averageLatencyMs = completedTurns > 0 ? Math.round(this.turnLatencyStats.totalMs / completedTurns) : 0;
		return {
			runtimeCache: this.runtimeHandles.getObservabilitySnapshot(),
			turns: {
				active: this.activeTurnBySession.size,
				queueDepth: this.actorQueue.getTotalPendingCount(),
				completed: this.turnLatencyStats.completed,
				failed: this.turnLatencyStats.failed,
				averageLatencyMs,
				maxLatencyMs: this.turnLatencyStats.maxMs
			},
			errorsByCode: Object.fromEntries([...this.errorCountsByCode.entries()].toSorted(([a], [b]) => a.localeCompare(b)))
		};
	}
	async reconcilePendingSessionIdentities(params) {
		return await runManagerStartupIdentityReconcile({
			cfg: params.cfg,
			deps: this.deps,
			withSessionActor: this.withSessionActor.bind(this),
			resolveSession: this.resolveSession.bind(this),
			ensureRuntimeHandle: this.ensureRuntimeHandle.bind(this),
			reconcileRuntimeSessionIdentifiers: this.reconcileRuntimeSessionIdentifiers.bind(this)
		});
	}
	async initializeSession(input) {
		const target = resolveAcpSessionTarget(input);
		return await this.withSessionActor(target, async (isCurrentActor) => {
			const initialized = await runManagerInitializeSession({
				input,
				...target,
				deps: this.deps,
				runtimeHandles: this.runtimeHandles,
				writeSessionMeta: this.writeSessionMeta.bind(this),
				isCurrentActor
			});
			return {
				...initialized,
				closeRuntimeOnFailure: () => this.withSessionActor(target, () => this.runtimeHandles.close({
					...target,
					reason: "spawn-failed",
					expectedHandle: initialized.handle
				}))
			};
		});
	}
	async getSessionStatus(params) {
		const target = resolveAcpSessionTarget(params);
		this.throwIfAborted(params.signal);
		return await this.withSessionActor(target, async (isCurrentActor) => await runManagerGetSessionStatus({
			assertActive: params.assertActive,
			cfg: params.cfg,
			...target,
			signal: params.signal,
			throwIfAborted: this.throwIfAborted.bind(this),
			resolveSession: this.resolveSession.bind(this),
			ensureRuntimeHandle: this.ensureRuntimeHandle.bind(this),
			reconcileRuntimeSessionIdentifiers: this.reconcileRuntimeSessionIdentifiers.bind(this),
			isCurrentActor
		}), params.signal);
	}
	async setSessionRuntimeMode(params) {
		const target = resolveAcpSessionTarget(params);
		const runtimeMode = validateRuntimeModeInput(params.runtimeMode);
		return await this.withSessionActor(target, async (isCurrentActor) => {
			return await runSetManagerSessionRuntimeMode({
				assertActive: params.assertActive,
				cfg: params.cfg,
				...target,
				runtimeMode,
				...this.runtimeOptionCommandServices(isCurrentActor)
			});
		});
	}
	async setSessionConfigOption(params) {
		const target = resolveAcpSessionTarget(params);
		const normalizedOption = validateRuntimeConfigOptionInput(params.key, params.value);
		const key = normalizedOption.key;
		const value = normalizedOption.value;
		return await this.withSessionActor(target, async (isCurrentActor) => {
			return await runSetManagerSessionConfigOption({
				assertActive: params.assertActive,
				cfg: params.cfg,
				...target,
				key,
				value,
				...this.runtimeOptionCommandServices(isCurrentActor)
			});
		});
	}
	async updateSessionRuntimeOptions(params) {
		const target = resolveAcpSessionTarget(params);
		const validatedPatch = validateRuntimeOptionPatch(params.patch);
		return await this.withSessionActor(target, async (isCurrentActor) => {
			return await runUpdateManagerSessionRuntimeOptions({
				assertActive: params.assertActive,
				cfg: params.cfg,
				...target,
				patch: validatedPatch,
				...this.runtimeOptionCommandServices(isCurrentActor)
			});
		});
	}
	async resetSessionRuntimeOptions(params) {
		const target = resolveAcpSessionTarget(params);
		return await this.withSessionActor(target, async (isCurrentActor) => {
			return await runResetManagerSessionRuntimeOptions({
				assertActive: params.assertActive,
				cfg: params.cfg,
				...target,
				...this.runtimeOptionCommandServices(isCurrentActor)
			});
		});
	}
	async runTurn(input) {
		const target = resolveAcpSessionTarget(input);
		const startedAt = Date.now();
		await runAcceptedManagerTurn({
			input,
			...target,
			stopping: this.stopping,
			turns: this.acceptedTurns,
			withSessionActor: this.withSessionActor.bind(this),
			onQueuedCancellation: async () => {
				recordQueuedBackgroundTaskCancellation({
					input,
					...target,
					deps: this.deps,
					startedAt
				});
				await emitCancelledAcpTurn(input.onEvent);
				this.recordTurnCompletion({ startedAt });
			},
			run: async (acceptedInput, acceptedTurn, isCurrentActor) => await runManagerTurn({
				input: acceptedInput,
				acceptedTurn,
				...target,
				deps: this.deps,
				runtimeHandles: this.runtimeHandles,
				activeTurnBySession: this.activeTurnBySession,
				resolveSession: this.resolveSession.bind(this),
				ensureRuntimeHandle: this.ensureRuntimeHandle.bind(this),
				setSessionState: this.setSessionState.bind(this),
				recordTurnCompletion: this.recordTurnCompletion.bind(this),
				reconcileRuntimeSessionIdentifiers: this.reconcileRuntimeSessionIdentifiers.bind(this),
				writeSessionMeta: this.writeSessionMeta.bind(this),
				isCurrentActor
			})
		});
	}
	async cancelSession(params) {
		const target = resolveAcpSessionTarget(params);
		await runManagerCancelSession({
			assertActive: params.assertActive,
			cfg: params.cfg,
			...target,
			reason: params.reason,
			expectedRunId: params.expectedRunId,
			expectedInstanceId: params.expectedInstanceId,
			expectedOwnerKey: params.expectedOwnerKey,
			acceptedTurns: this.acceptedTurns,
			activeTurnBySession: this.activeTurnBySession,
			withSessionActor: this.withSessionActor.bind(this),
			resolveSession: this.resolveSession.bind(this),
			ensureRuntimeHandle: this.ensureRuntimeHandle.bind(this),
			setSessionState: this.setSessionState.bind(this)
		});
	}
	/** Evicts only the captured runtime generation; old handles close in the background. */
	async #forceDiscardSessionRuntime(params) {
		params.assertCurrent?.();
		if (params.isCurrent && !params.isCurrent()) throw createSupersededActorError(params.sessionKey);
		const target = resolveAcpSessionTarget(params);
		const { sessionKey } = target;
		const actorKey = acpSessionActorKey(target);
		this.actorQueue.rotate(actorKey);
		const accepted = this.acceptedTurns.get(actorKey);
		this.acceptedTurns.delete(actorKey);
		for (const turn of accepted ?? []) turn.abortController.abort();
		const activeTurn = this.activeTurnBySession.get(actorKey);
		if (activeTurn) {
			activeTurn.abortController.abort();
			if (this.activeTurnBySession.get(actorKey) === activeTurn) this.activeTurnBySession.delete(actorKey);
		}
		const cached = this.runtimeHandles.take(target);
		const closeTargets = [...activeTurn ? [{
			runtime: activeTurn.runtime,
			handle: activeTurn.handle
		}] : [], ...cached && (!activeTurn || !this.runtimeHandles.handlesMatch(cached.handle, activeTurn.handle)) ? [{
			runtime: cached.runtime,
			handle: cached.handle
		}] : []];
		Promise.allSettled(closeTargets.map(async ({ runtime, handle }) => {
			await runtime.close({
				handle,
				reason: params.reason,
				discardPersistentState: true
			});
		})).then((outcomes) => {
			const failed = outcomes.find((outcome) => outcome.status === "rejected");
			if (failed) logVerbose(`acp-manager: force-discard runtime close failed for ${sessionKey}: ${String(failed.reason)}`);
		});
	}
	async closeSession(input) {
		const target = resolveAcpSessionTarget(input);
		return await this.withSessionActor(target, async (isCurrentActor) => await runManagerCloseSession({
			input,
			...target,
			deps: this.deps,
			runtimeHandles: this.runtimeHandles,
			resolveSession: this.resolveSession.bind(this),
			ensureRuntimeHandle: this.ensureRuntimeHandle.bind(this),
			writeSessionMeta: this.writeSessionMeta.bind(this),
			isCurrentActor
		}));
	}
	async ensureRuntimeHandle(params) {
		return await ensureManagerRuntimeHandle({
			...params,
			deps: this.deps,
			runtimeHandles: this.runtimeHandles,
			writeSessionMeta: async (writeParams) => await this.writeSessionMeta(writeParams),
			isCurrentActor: params.isCurrentActor
		});
	}
	runtimeOptionCommandServices(isCurrentActor) {
		return {
			runtimeHandles: this.runtimeHandles,
			resolveSession: this.resolveSession.bind(this),
			ensureRuntimeHandle: this.ensureRuntimeHandle.bind(this),
			writeSessionMeta: this.writeSessionMeta.bind(this),
			isCurrentActor
		};
	}
	recordTurnCompletion(params) {
		const durationMs = Math.max(0, Date.now() - params.startedAt);
		this.turnLatencyStats.totalMs += durationMs;
		this.turnLatencyStats.maxMs = Math.max(this.turnLatencyStats.maxMs, durationMs);
		if (params.errorCode) {
			this.turnLatencyStats.failed += 1;
			this.recordErrorCode(params.errorCode);
			return;
		}
		this.turnLatencyStats.completed += 1;
	}
	recordErrorCode(code) {
		const normalized = normalizeAcpErrorCode(code);
		this.errorCountsByCode.set(normalized, (this.errorCountsByCode.get(normalized) ?? 0) + 1);
	}
	async setSessionState(params) {
		await this.writeSessionMeta({
			cfg: params.cfg,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			skipMaintenance: true,
			takeCacheOwnership: true,
			isCurrentActor: params.isCurrentActor,
			mutate: (current, entry) => {
				if (!entry) return null;
				const base = current;
				if (!base) return null;
				const next = {
					backend: base.backend,
					agent: base.agent,
					runtimeSessionName: base.runtimeSessionName,
					...base.identity ? { identity: base.identity } : {},
					mode: base.mode,
					...base.runtimeOptions ? { runtimeOptions: base.runtimeOptions } : {},
					...base.cwd ? { cwd: base.cwd } : {},
					state: params.state,
					lastActivityAt: Date.now(),
					...base.lastError ? { lastError: base.lastError } : {}
				};
				const lastError = normalizeOptionalString(params.lastError);
				if (lastError) next.lastError = lastError;
				else if (params.clearLastError) delete next.lastError;
				return next;
			}
		});
	}
	async reconcileRuntimeSessionIdentifiers(params) {
		return await reconcileManagerRuntimeSessionIdentifiers({
			...params,
			setCachedHandle: (target, handle) => {
				const cached = this.runtimeHandles.get(target);
				if (cached) cached.handle = handle;
			},
			writeSessionMeta: async (writeParams) => await this.writeSessionMeta(writeParams)
		});
	}
	async writeSessionMeta(params) {
		try {
			return await this.deps.upsertSessionMeta({
				cfg: params.cfg,
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				mutate: params.mutate,
				assertCommitAllowed: () => {
					params.assertCommitAllowed?.();
					if (params.isCurrentActor && !params.isCurrentActor()) throw createSupersededActorError(params.sessionKey);
				},
				...params.skipMaintenance === true ? { skipMaintenance: true } : {},
				...params.takeCacheOwnership === true ? { takeCacheOwnership: true } : {}
			});
		} catch (error) {
			if (params.isCurrentActor && !params.isCurrentActor()) throw createSupersededActorError(params.sessionKey);
			if (params.failOnError || error instanceof AgentSelectionRequiredError) throw error;
			logVerbose(`acp-manager: failed persisting ACP metadata for ${params.sessionKey}: ${String(error)}`);
			return null;
		}
	}
	async withSessionActor(target, op, signal) {
		const actorKey = acpSessionActorKey(target);
		this.throwIfAborted(signal);
		let actorStarted = false;
		const queued = this.actorQueue.run(actorKey, async (isCurrentActor) => {
			actorStarted = true;
			this.throwIfAborted(signal);
			return await op(isCurrentActor);
		});
		if (!signal) return await queued;
		return await new Promise((resolve, reject) => {
			let settled = false;
			const cleanup = () => {
				signal.removeEventListener("abort", onAbort);
			};
			const settleValue = (value) => {
				if (settled) return;
				settled = true;
				cleanup();
				resolve(value);
			};
			const settleError = (error) => {
				if (settled) return;
				settled = true;
				cleanup();
				reject(toErrorObject(error, "Non-Error rejection"));
			};
			const onAbort = () => {
				if (actorStarted) return;
				try {
					this.throwIfAborted(signal);
				} catch (error) {
					settleError(error);
				}
			};
			signal.addEventListener("abort", onAbort, { once: true });
			queued.then(settleValue, settleError);
			if (signal.aborted) onAbort();
		});
	}
	throwIfAborted(signal) {
		if (!signal?.aborted) return;
		throw new AcpRuntimeError("ACP_TURN_FAILED", "ACP operation aborted.");
	}
};
//#endregion
//#region src/acp/control-plane/manager.ts
/** Public singleton facade for the ACP session manager control plane. */
let ACP_SESSION_MANAGER_SINGLETON = null;
/** Returns the process-wide ACP session manager singleton. */
function getAcpSessionManager() {
	if (!ACP_SESSION_MANAGER_SINGLETON) ACP_SESSION_MANAGER_SINGLETON = new AcpSessionManager();
	return ACP_SESSION_MANAGER_SINGLETON;
}
const testing = {
	resetAcpSessionManagerForTests() {
		ACP_SESSION_MANAGER_SINGLETON = null;
	},
	setAcpSessionManagerForTests(manager) {
		ACP_SESSION_MANAGER_SINGLETON = manager;
	}
};
//#endregion
export { getAcpSessionResetControls as a, isAcpOwnerRepairRequired as c, consumeAcpTurnStream as i, testing as n, disposeAcpSessionManagerInstance as o, AcpSessionManager as r, tryPrepareFreshManagerRuntimeSession as s, getAcpSessionManager as t };
