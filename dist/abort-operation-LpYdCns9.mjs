import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { l as getActiveAgentRunDelegatedAuthority } from "./agent-run-registry-gmaPgO-n.mjs";
import { M as parseAgentSessionKey, b as isAcpSessionKey, w as isSubagentSessionKey } from "./session-key-CSDERtm3.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import { a as ACTIVE_EMBEDDED_RUNS_BY_RUN_ID, i as ACTIVE_EMBEDDED_RUNS, o as ACTIVE_EMBEDDED_RUN_REGISTRATIONS } from "./run-state-DZ4Vfz1J.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-CUxN9KZj.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { c as resolveSessionAbortTarget, i as markSessionAbortTarget } from "./session-accessor.entry-mutation-DgCGNicZ.mjs";
import "./sessions-CnzPI1yx.mjs";
import { i as logVerbose } from "./globals-XVSoVbNQ.mjs";
import { a as resolveCommandAuthorizationAsync } from "./command-auth-D8Y1MxJm.mjs";
import { h as getAttachedBackend } from "./reply-run-registry.state-Hn_UqZjq.mjs";
import { y as resolveReplyOperationsForSession } from "./reply-run-registry.registry-CmcnzV4X.mjs";
import { o as resolveActiveEmbeddedRunSessionId } from "./active-run-projections-Crpg2l0z.mjs";
import "./reply-run-registry-BFUfTf-U.mjs";
import { n as abortEmbeddedAgentRun } from "./runs-Czr-I6_B.mjs";
import { l as retireSessionMcpRuntime } from "./agent-bundle-mcp-manager-api-BF9Uyz8N.mjs";
import { n as getAcpSessionManager } from "./manager-Cge77N9B.mjs";
import { t as resolveEffectiveResetTargetSessionKey } from "./acp-reset-target-CTfpJQfY.mjs";
import { s as resolveSessionConversationBindingContext } from "./session-conversation-binding-De2KQell.mjs";
import { n as captureExecRequestCancellation } from "./bash-process-control-D15pjJye.mjs";
import { o as resolveInternalSessionKey, s as resolveMainSessionAlias } from "./sessions-resolution-CQXReb8R.mjs";
import "./sessions-helpers-DCz0gP72.mjs";
import { r as captureExecRequestSubagentSelection } from "./subagent-control-scope-DL-koOaU.mjs";
import { r as setAbortMemory } from "./abort-primitives-s9GIpM6V.mjs";
import { t as killAllControlledSubagentRuns } from "./subagent-control-kill-ByoDJlho.mjs";
import { a as prepareSessionLifecycleQueueCleanup } from "./cleanup-CjvcBZOl.mjs";
import "./subagent-control-WFcqo9OA.mjs";
import { a as shouldPersistAbortCutoff, i as resolveAbortCutoffFromContext } from "./abort-cutoff-Cy_3zrWp.mjs";
//#region src/agents/embedded-agent-runner/runs.abort-target.ts
/** Follow admitted retries while keeping legacy compaction bound to its exact handle. */
function prepareEmbeddedAgentRunAbort(sessionId) {
	const handle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
	const registration = handle && ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle);
	const instance = registration?.operationalRunInstance;
	const authority = registration?.delegatedAuthority;
	const agentId = registration?.agentId;
	const sessionKey = registration?.sessionKey;
	const resolveCurrent = () => {
		if (!handle || !registration) return;
		if (!instance || !authority) return ACTIVE_EMBEDDED_RUNS.get(sessionId) === handle && ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle) === registration ? registration : void 0;
		if (getActiveAgentRunDelegatedAuthority(instance) !== authority) return;
		const successor = ACTIVE_EMBEDDED_RUNS_BY_RUN_ID.get(instance.runId);
		const current = successor && ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(successor);
		return current && current.operationalRunInstance?.instanceId === instance.instanceId && current.operationalRunInstance.runId === instance.runId && current.delegatedAuthority === authority && current.agentId === agentId && current.sessionKey === sessionKey && ACTIVE_EMBEDDED_RUNS.get(current.sessionId) === successor ? current : void 0;
	};
	return () => {
		const current = resolveCurrent();
		return current ? {
			active: true,
			aborted: abortEmbeddedAgentRun(current.sessionId),
			sessionId: current.sessionId
		} : {
			active: false,
			aborted: false
		};
	};
}
//#endregion
//#region src/auto-reply/reply/abort-operation.ts
function prepareSessionRunTargetAbort(params) {
	const key = normalizeOptionalString(params.key);
	const operations = resolveReplyOperationsForSession({
		...params,
		sessionKeys: key ? [key] : []
	});
	const sessionIds = new Set(operations.map((operation) => operation.sessionId));
	const explicitSessionId = normalizeOptionalString(params.sessionId);
	const commands = key || explicitSessionId ? captureExecRequestCancellation({
		sessionKey: key,
		sessionId: explicitSessionId,
		agentId: params.agentId
	}) : void 0;
	if (explicitSessionId) sessionIds.add(explicitSessionId);
	if (key) {
		const activeSessionId = resolveActiveEmbeddedRunSessionId(key);
		if (activeSessionId && (sessionIds.has(activeSessionId) || parseAgentSessionKey(key)?.agentId === normalizeAgentId(params.agentId))) sessionIds.add(activeSessionId);
	}
	const runs = [...sessionIds].map((sessionId) => ({
		sessionId,
		abort: prepareEmbeddedAgentRunAbort(sessionId)
	}));
	const requestRunIds = /* @__PURE__ */ new Set([...commands?.requestRunIds ?? [], ...operations.flatMap((operation) => {
		const runId = getAttachedBackend(operation)?.runId;
		return runId ? [runId] : [];
	})]);
	const abort = (selectedSessionId = explicitSessionId) => {
		const selectedOperations = operations.filter((operation) => !selectedSessionId || operation.sessionId === selectedSessionId);
		const selectedSessionIds = new Set([...sessionIds].filter((sessionId) => !selectedSessionId || sessionId === selectedSessionId));
		if (selectedSessionId) selectedSessionIds.add(selectedSessionId);
		let active = selectedOperations.some((operation) => !operation.result);
		const failures = [];
		let aborted = commands?.cancel((identity) => !selectedSessionId || identity.sessionId === selectedSessionId) === true;
		for (const operation of selectedOperations) {
			for (const sessionId of operation.captureOwnedSessionIds()) selectedSessionIds.add(sessionId);
			try {
				aborted = operation.abortByUser() || aborted;
			} catch (error) {
				failures.push(error);
			}
		}
		for (const run of runs) {
			if (selectedSessionId && run.sessionId !== selectedSessionId) continue;
			try {
				const outcome = run.abort();
				active ||= outcome.active;
				aborted ||= outcome.aborted;
				if (outcome.sessionId) selectedSessionIds.add(outcome.sessionId);
			} catch (error) {
				failures.push(error);
			}
		}
		const retirement = !active || aborted || failures.length > 0 ? Promise.allSettled([...[...selectedSessionIds].map((sessionId) => retireSessionMcpRuntime({
			sessionId,
			reason: "session-stop",
			preserveActiveLeases: true
		})), commands?.settle()]).then((results) => {
			for (const result of results) if (result.status === "rejected") failures.push(result.reason);
			if (failures.length === 1) throw failures[0];
			if (failures.length > 1) throw new AggregateError(failures, failures.map(formatErrorMessage).join("; "));
		}) : void 0;
		return {
			active,
			aborted,
			retirement
		};
	};
	return Object.assign(abort, { requestRunIds });
}
async function stopSubagentsForRequester(params) {
	const cleaned = normalizeOptionalString(params.requesterSessionKey);
	if (!cleaned) {
		await params.beforeKill?.(() => {});
		return {
			stopped: 0,
			failed: 0
		};
	}
	const { alias } = resolveMainSessionAlias(params.cfg);
	const requesterKey = resolveInternalSessionKey({
		key: cleaned,
		alias
	});
	const controllerAgentId = resolveSessionAgentId({
		config: params.cfg,
		sessionKey: requesterKey,
		fallbackAgentId: params.requesterAgentId
	});
	const controller = {
		controllerSessionKey: requesterKey,
		controllerAgentId,
		callerSessionKey: requesterKey,
		callerIsSubagent: isSubagentSessionKey(requesterKey),
		controlScope: "children"
	};
	const commands = captureExecRequestCancellation({
		sessionKey: requesterKey,
		agentId: controllerAgentId
	});
	const selectionParams = {
		cfg: params.cfg,
		controller,
		owners: commands.owners,
		acceptsRequest: params.acceptsRequest
	};
	const sessionOrigin = (session) => session ? {
		target: {
			...session,
			sessionKey: requesterKey,
			agentId: controllerAgentId
		},
		acceptsRequest: () => true
	} : void 0;
	const preparation = params.prepareRequesterSession;
	let selected = captureExecRequestSubagentSelection({
		...selectionParams,
		sessionOrigin: sessionOrigin(params.requesterSession),
		candidateOrigin: preparation ? {
			target: {
				sessionKey: requesterKey,
				agentId: controllerAgentId
			},
			acceptsRequest: () => true
		} : void 0
	});
	const requestSelection = {
		runs: selected.runs,
		ownsRoot: (entry) => selected.ownsRoot(entry),
		selectPublishedRoot: preparation || selected.selectPublishedRoot ? (entry) => selected.selectPublishedRoot?.(entry) === true : void 0,
		get sessionGeneration() {
			return selected.sessionGeneration;
		},
		prepare: preparation ? async () => {
			selected = captureExecRequestSubagentSelection({
				...selectionParams,
				sessionOrigin: sessionOrigin(await preparation())
			});
		} : void 0
	};
	const result = await killAllControlledSubagentRuns({
		cfg: params.cfg,
		controller,
		runs: requestSelection.runs,
		requestSelection,
		assertCurrent: params.assertCurrent,
		suppressTaskDelivery: true,
		beforeKill: params.beforeKill
	});
	if (result.status === "error") logVerbose(`abort: failed to stop subagents for ${requesterKey}: ${result.error}`);
	if (result.killed > 0) logVerbose(`abort: stopped ${result.killed} subagent run(s) for ${requesterKey}`);
	return {
		stopped: result.killed,
		failed: result.status === "error" ? result.failed : 0,
		...result.execAborted ? { execAborted: true } : {}
	};
}
async function executeFastAbortRequest(params, request) {
	const { ctx, cfg } = params;
	const { commandSessionKey, targetKey, resolveTargetAgentId } = request;
	const agentId = resolveTargetAgentId();
	if (targetKey) {
		const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
		const abortCutoffForTarget = (target) => shouldPersistAbortCutoff({
			commandSessionKey,
			targetSessionKey: target.sessionKey
		}) ? resolveAbortCutoffFromContext(ctx) : void 0;
		const selection = { target: null };
		const resolvedTargetKey = normalizeStoreSessionKey(targetKey);
		const assertCurrent = () => {
			if (params.isCommandTargetCurrent?.sessionSource?.assertScopeCurrent) {
				params.isCommandTargetCurrent.sessionSource.assertScopeCurrent();
				return;
			}
			if (params.isCommandTargetCurrent?.() === false) throw new Error("The selected session changed before it could be stopped.");
		};
		const prepareTarget = (key) => {
			const targetAgentId = key === resolvedTargetKey ? agentId : resolveSessionAgentId({
				config: cfg,
				sessionKey: key,
				fallbackAgentId: ctx.AgentId ?? agentId
			});
			const sessionId = resolveReplyOperationsForSession({
				sessionKeys: [key],
				agentId: targetAgentId
			})[0]?.sessionId;
			const target = {
				key,
				agentId: targetAgentId,
				sessionId
			};
			return {
				key,
				sessionId,
				abort: prepareSessionRunTargetAbort(target),
				clearQueues: prepareSessionLifecycleQueueCleanup({
					...target,
					keys: [key, sessionId],
					sessionKey: key,
					assertCurrent
				})
			};
		};
		const preparedTargets = new Map([resolvedTargetKey, ...commandSessionKey ? [commandSessionKey] : []].map((key) => [key, prepareTarget(key)]));
		const targetRead = resolveSessionAbortTarget({
			agentId,
			sessionKey: targetKey,
			storePath
		}).catch((error) => {
			logVerbose(`abort: failed to resolve abort metadata for ${targetKey}: ${formatErrorMessage(error)}`);
			return null;
		});
		let authorized = false;
		let aborted = false;
		let activeAbortRejected = false;
		const acpCancellations = [];
		try {
			const { stopped, failed, execAborted } = await stopSubagentsForRequester({
				cfg,
				requesterSessionKey: targetKey,
				requesterAgentId: agentId,
				prepareRequesterSession: async () => {
					selection.target = await targetRead;
					return selection.target?.sessionId ? {
						storePath,
						sessionId: selection.target.sessionId,
						lifecycleRevision: selection.target.entry.lifecycleRevision ?? null
					} : void 0;
				},
				acceptsRequest: (identity) => !selection.target || identity.sessionId === selection.target.sessionId,
				assertCurrent,
				beforeKill: async (sealRootSelection) => {
					authorized = (await resolveCommandAuthorizationAsync({
						ctx,
						cfg,
						commandAuthorized: ctx.CommandAuthorized
					})).isAuthorizedSender;
					if (!authorized) return false;
					const bindingContext = commandSessionKey ? resolveSessionConversationBindingContext(cfg, ctx) : void 0;
					const conversationBoundAcpTargetKey = commandSessionKey ? await (bindingContext ? resolveEffectiveResetTargetSessionKey({
						cfg,
						...bindingContext,
						activeSessionKey: commandSessionKey,
						skipConfiguredFallbackWhenActiveSessionNonAcp: false,
						fallbackToActiveAcpWhenUnbound: false
					}) : void 0) : void 0;
					const boundAcpTargetKey = !isAcpSessionKey(resolvedTargetKey) ? conversationBoundAcpTargetKey : void 0;
					const abortTargetKeys = [resolvedTargetKey];
					if (boundAcpTargetKey && boundAcpTargetKey !== resolvedTargetKey) abortTargetKeys.push(boundAcpTargetKey);
					const sourceAbortKey = commandSessionKey && !abortTargetKeys.includes(commandSessionKey) && conversationBoundAcpTargetKey && abortTargetKeys.includes(conversationBoundAcpTargetKey) ? commandSessionKey : void 0;
					const targets = [...abortTargetKeys, ...sourceAbortKey ? [sourceAbortKey] : []].map((key) => preparedTargets.get(key) ?? prepareTarget(key));
					const current = params.isCommandTargetCurrent?.();
					if ((typeof current === "boolean" || current === void 0 ? current : await current) === false) throw new Error("The selected session changed before it could be stopped.");
					sealRootSelection();
					try {
						for (const target of targets) {
							const selectedSessionId = target.key === resolvedTargetKey ? target.sessionId ?? selection.target?.sessionId : target.sessionId;
							const cleared = target.clearQueues(selectedSessionId);
							if (cleared.followupCleared > 0 || cleared.laneCleared > 0) logVerbose(`abort: cleared followups=${cleared.followupCleared} lane=${cleared.laneCleared} keys=${cleared.keys.join(",")}`);
						}
						for (const target of targets) {
							const outcome = target.abort(target.key === resolvedTargetKey ? target.sessionId ?? selection.target?.sessionId : target.sessionId);
							if (outcome.retirement) {
								outcome.retirement.catch(() => {});
								acpCancellations.push(outcome.retirement);
							}
							activeAbortRejected ||= outcome.active && !outcome.aborted;
							aborted = outcome.aborted || aborted;
						}
					} finally {
						const acpManager = getAcpSessionManager();
						for (const acpTargetKey of abortTargetKeys) {
							const resolution = acpManager.resolveSession({
								cfg,
								sessionKey: acpTargetKey,
								agentId: acpTargetKey === resolvedTargetKey ? agentId : void 0
							});
							if (resolution.kind === "none") continue;
							acpCancellations.push(acpManager.cancelSession({
								cfg,
								sessionKey: resolution.sessionKey,
								agentId: resolution.agentId,
								reason: "fast-abort"
							}).catch((error) => {
								logVerbose(`abort: ACP cancel failed for ${acpTargetKey}: ${formatErrorMessage(error)}`);
							}));
						}
					}
					return true;
				}
			});
			if (!authorized) return {
				handled: false,
				aborted: false
			};
			aborted ||= execAborted === true;
			const rejectionReason = activeAbortRejected && !aborted ? "finalizing" : void 0;
			const activeWriterRunId = selection.target?.entry.activeWriterRunId;
			const capturedTarget = preparedTargets.get(resolvedTargetKey);
			const ownsAbortMetadata = (!capturedTarget?.sessionId || capturedTarget.sessionId === selection.target?.sessionId) && (!activeWriterRunId || capturedTarget?.abort.requestRunIds.has(activeWriterRunId));
			if (!rejectionReason && ownsAbortMetadata) {
				let persistedAbortTarget = null;
				try {
					persistedAbortTarget = await markSessionAbortTarget({
						isCurrent: params.isCommandTargetCurrent,
						expectedTarget: selection.target?.entry ?? null,
						scope: {
							agentId,
							sessionKey: targetKey,
							storePath
						},
						resolveAbortCutoff: abortCutoffForTarget
					});
				} catch (error) {
					logVerbose(`abort: failed to persist abort metadata for ${targetKey}: ${formatErrorMessage(error)}`);
				}
				if (persistedAbortTarget?.persisted === false) logVerbose(`abort: failed to persist abort metadata for ${targetKey}: ${persistedAbortTarget.persistenceError ?? "unknown error"}`);
			} else if (!ownsAbortMetadata) logVerbose(`abort: skipped metadata for a replacement writer on ${targetKey}`);
			return {
				handled: true,
				aborted,
				...rejectionReason ? { rejectionReason } : {},
				stoppedSubagents: stopped,
				failedSubagents: failed
			};
		} finally {
			await Promise.all(acpCancellations);
		}
	}
	const auth = await resolveCommandAuthorizationAsync({
		ctx,
		cfg,
		commandAuthorized: ctx.CommandAuthorized
	});
	if (!auth.isAuthorizedSender) return {
		handled: false,
		aborted: false
	};
	const abortKey = auth.from ?? auth.to;
	const requesterSessionKey = ctx.SessionKey ?? abortKey;
	if (abortKey) setAbortMemory(abortKey, true);
	const { stopped, failed, execAborted } = await stopSubagentsForRequester({
		cfg,
		requesterSessionKey
	});
	return {
		handled: true,
		aborted: execAborted === true,
		stoppedSubagents: stopped,
		failedSubagents: failed
	};
}
//#endregion
export { prepareSessionRunTargetAbort as n, stopSubagentsForRequester as r, executeFastAbortRequest as t };
