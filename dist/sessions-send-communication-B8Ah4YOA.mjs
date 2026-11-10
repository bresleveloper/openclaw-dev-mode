import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as createRuntimeConfigReader } from "./runtime-snapshot-BBYDJbw9.mjs";
import { a as sessionChanges, i as sessionChangeScopeAffectsStoredRows } from "./session-row-changes-vFaNnKNM.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { Yr as validateQuestionRequestParams } from "./src-pLJQA6J5.mjs";
import { n as operatorScopeSatisfied } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { t as authorizeCurrentOperatorRoleScopes } from "./operator-role-policy-Coro3qc5.mjs";
import { o as getGatewayToolCallerIdentity, t as captureGatewayToolCallerAssertion } from "./gateway-caller-context-Be176_GV.mjs";
import { h as registerActiveEmbeddedRunHumanInputWait } from "./run-state-DZ4Vfz1J.mjs";
import { f as communicationEndpointBinding, m as planSessionCommunication, p as communicationEntryBinding } from "./session-accessor.sqlite-entry-cache-publication-BpzZnZxY.mjs";
import { a as readCapturedSessionActorEntry, n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { i as resolveSessionThreadInfo } from "./session-conversation-DnUQmZJM.mjs";
import { c as canManageSessionSharing, h as resolveSessionSharingRole } from "./session-sharing-policy-vx7GWqzs.mjs";
import { i as resolveSubagentChildAuthority } from "./subagent-child-owner-match-Dwr-9sla.mjs";
import { i as getLatestLiveSubagentRunByChildSessionKey } from "./subagent-registry-read-DY0g8fGW.mjs";
import { r as resolveGatewaySessionStoreTargetInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
import { r as resolveSandboxRuntimeStatus } from "./runtime-status-DWm-5zUj.mjs";
import { t as questionShapeError } from "./question-validation-BMCcPET9.mjs";
import { a as resolveEffectiveSessionToolsVisibility, t as createAgentToAgentPolicy } from "./session-visibility-CMzmBVR3.mjs";
import { a as bindInProcessSubagentResume, o as readInProcessSubagentResume } from "./server-plugin-runtime-client-DChyaoc_.mjs";
import { a as getInProcessGatewayToolContext, p as withSessionSendDelivery } from "./in-process-gateway-DaAxH7mK.mjs";
import { c as resolveSandboxedSessionToolContext, l as resolveSessionToolAccess, o as formatSessionToolAccessDenial } from "./sessions-helpers-DCz0gP72.mjs";
import { i as ensureSubagentControllerOwnsRun, u as resolveSubagentController } from "./subagent-control-scope-DL-koOaU.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/session-subagent-resume.ts
/** Exact parent-owned paused-task binding for explicit model-tool resume admission. */
/** Select task continuation from recorded ownership; admission still binds and revalidates it. */
function shouldResumeParentSubagent(params) {
	const entry = getLatestLiveSubagentRunByChildSessionKey(params.childSessionKey, (candidate) => candidate.pauseReason === "sessions_yield");
	if (!entry || entry.expectsCompletionMessage !== true) return false;
	if ((entry.controllerSessionKey?.trim() ? entry.controllerStorePath : entry.requesterStorePath) === void 0) return false;
	const controller = resolveSubagentController({
		cfg: params.cfg,
		agentId: params.caller.agentId,
		agentSessionKey: params.caller.sessionKey
	});
	return controller.controlScope === "children" && ensureSubagentControllerOwnsRun({
		cfg: params.cfg,
		controller,
		entry
	}) === void 0;
}
function requirePausedChild(cfg, caller, key) {
	if (!caller.assertCurrent) throw new Error("Task resume requires an admitted parent tool caller.");
	caller.assertCurrent();
	const controller = resolveSubagentController({
		cfg,
		agentId: caller.agentId,
		agentSessionKey: caller.sessionKey
	});
	const entry = getLatestLiveSubagentRunByChildSessionKey(key, (candidate) => candidate.pauseReason === "sessions_yield");
	const authority = entry && resolveSubagentChildAuthority(entry);
	if (!entry || authority?.status === "mismatch" || typeof entry.execution.endedAt !== "number" || entry.killIntent || entry.killReconciliation || entry.terminalOwner || entry.suppressAnnounceReason || entry.cleanupCompletedAt !== void 0 || entry.execution.suppressSessionEffects && authority?.status !== "legacy-unverified") throw new Error("Task resume requires a currently paused native child; inspect subagents first.");
	if (controller.controlScope !== "children" || ensureSubagentControllerOwnsRun({
		cfg,
		controller,
		entry
	})) throw new Error("Task resume is limited to children controlled by the calling session.");
	if (entry.expectsCompletionMessage === false) throw new Error("Task resume requires a child with task-owned completion.");
	return entry;
}
/** Captures the exact paused generation after ordinary session visibility checks. */
function bindParentSubagentResume(params) {
	if (!params.childSessionId) throw new Error("Task resume requires an existing child session.");
	const entry = requirePausedChild(params.cfg, params.caller, params.childSessionKey);
	if (resolveSubagentChildAuthority(entry, {
		sessionId: params.childSessionId,
		lifecycleRevision: params.childLifecycleRevision
	}).status === "mismatch") throw new Error("Paused child session incarnation changed or is unresolved; inspect subagents again.");
	return Object.freeze({
		caller: params.caller,
		childSessionKey: params.childSessionKey,
		childSessionId: params.childSessionId,
		childLifecycleRevision: params.childLifecycleRevision,
		previousRunId: entry.runId,
		taskRunId: entry.taskRunId ?? entry.runId,
		generation: entry.generation,
		createdAt: entry.createdAt
	});
}
/** Revalidates caller ownership and the exact paused generation at admission. */
function assertParentSubagentResumeCurrent(params) {
	const { resume } = params;
	const entry = requirePausedChild(params.cfg, resume.caller, resume.childSessionKey);
	if (params.sessionKey !== resume.childSessionKey || params.sessionId !== resume.childSessionId || params.sessionLifecycleRevision !== resume.childLifecycleRevision || resolveSubagentChildAuthority(entry, {
		sessionId: resume.childSessionId,
		lifecycleRevision: resume.childLifecycleRevision
	}).status === "mismatch" || entry.runId !== resume.previousRunId || (entry.taskRunId ?? entry.runId) !== resume.taskRunId || entry.generation !== resume.generation || entry.createdAt !== resume.createdAt || entry.execution.transcriptTarget?.sessionId !== void 0 && entry.execution.transcriptTarget.sessionId !== resume.childSessionId) throw new Error("Paused task or child session changed before resume; inspect subagents again.");
	return entry;
}
/** Fences queued execution after the paused task transfers away from its parent caller. */
function assertParentSubagentResumeSuccessorCurrent(resume, runId) {
	const current = getLatestLiveSubagentRunByChildSessionKey(resume.childSessionKey);
	if (!current || current.runId !== runId || current.taskRunId !== resume.taskRunId || current.pauseReason || current.killIntent || current.killReconciliation || typeof current.execution.endedAt === "number") throw new Error("Resumed task no longer owns this execution.");
}
/** Loads the replacement owner; final admission awaits its durable ownership transfer. */
async function prepareParentSubagentResume(params) {
	const runtime = await import("./subagent-registry-BSZR34Tv.mjs");
	return async () => {
		const sessionEntry = params.assertAdmissionCurrent();
		const expected = assertParentSubagentResumeCurrent({
			...params,
			sessionId: params.getSessionId(),
			sessionLifecycleRevision: sessionEntry?.lifecycleRevision
		});
		if (!await runtime.adoptPausedSubagentRunForFollowUp({
			childSessionKey: params.resume.childSessionKey,
			runId: params.runId,
			task: params.task,
			expected,
			onPublished: params.onAdopted,
			gatewayContextResolver: params.gatewayContextResolver,
			assertCurrent: () => {
				const currentSessionEntry = params.assertAdmissionCurrent();
				assertParentSubagentResumeCurrent({
					...params,
					sessionId: params.getSessionId(),
					sessionLifecycleRevision: currentSessionEntry?.lifecycleRevision
				});
			}
		})) throw new Error("Paused task replacement was rejected; no continuation was started.");
		assertParentSubagentResumeSuccessorCurrent(params.resume, params.runId);
		return params.resume.taskRunId;
	};
}
//#endregion
//#region src/gateway/session-communication-approval.ts
/** An agent's inherited admin/run authority is never a human's decision. */
function canApproveSessionCommunication(params) {
	const { client, endpoint } = params;
	if (!client || (client.connect.role ?? "operator") !== "operator" || client.invalidated || client.internal?.syntheticClient || client.internal?.agentRuntimeIdentity || client.internal?.agentToolCaller || client.internal?.operatorRunAuthority || client.internal?.approvalRuntime) return false;
	try {
		client.internal?.operatorAccessAuthority?.assertCurrent();
		if (authorizeCurrentOperatorRoleScopes(client, params.context.getRuntimeConfig())) return false;
		const scopes = client.connect.scopes ?? [];
		if (!operatorScopeSatisfied("operator.sessions.write", scopes)) return false;
		if (params.target && (params.target.agentId !== endpoint.agentId || params.target.canonicalKey !== endpoint.sessionKey)) return false;
		const entry = params.target === void 0 ? endpoint.entry : params.target?.entry;
		if (entry?.sessionId !== endpoint.entry?.sessionId || entry?.lifecycleRevision !== endpoint.entry?.lifecycleRevision) return false;
		if (!entry) return scopes.includes("operator.admin");
		return canManageSessionSharing(resolveSessionSharingRole({
			cfg: params.context.getRuntimeConfig(),
			client,
			isMember: false,
			target: {
				agentId: endpoint.agentId,
				canonicalKey: endpoint.sessionKey,
				storePath: endpoint.storePath,
				storeKey: endpoint.sessionKey,
				storeKeys: [endpoint.sessionKey],
				entry
			}
		}));
	} catch {
		return false;
	}
}
/** Reuses transient questions; the manager owns expiry, cancellation, and one winning answer. */
async function requestSessionCommunicationApproval(params) {
	const manager = params.context.questionManager;
	if (!manager) throw new Error("Human communication approval requires the admitted Gateway question owner.");
	params.assertCurrent();
	params.signal?.throwIfAborted();
	let decisionPending = true;
	const authorizeClient = (client, target) => {
		try {
			if (decisionPending) params.assertCurrent();
			return canApproveSessionCommunication({
				client,
				target,
				endpoint: params.approval.endpoint,
				context: params.context
			});
		} catch {
			return false;
		}
	};
	const isRequesterActive = () => {
		try {
			params.assertCurrent();
			params.signal?.throwIfAborted();
			return true;
		} catch {
			return false;
		}
	};
	const questions = [{
		questionId: "communication",
		header: params.approval.direction === "send" ? "Send message" : "Receive peer",
		question: "Allow this one peer message?\nFrom: " + params.source.sessionKey + "\nTo: " + params.target.sessionKey + "\n\n" + params.message,
		options: [{ label: "Allow once" }, { label: "Deny" }],
		multiSelect: false,
		isOther: false,
		isSecret: false
	}];
	const request = {
		questions,
		sessionKey: params.approval.endpoint.sessionKey,
		agentId: params.approval.endpoint.agentId
	};
	if (!validateQuestionRequestParams(request) || questionShapeError(questions, {
		allowPlainSecretQuestions: false,
		validateUrls: true
	})) throw new Error("The exact communication approval cannot be displayed as a valid question; no message was sent.");
	const question = manager.request({
		agentId: params.approval.endpoint.agentId,
		sessionKey: params.approval.endpoint.sessionKey,
		timeoutMs: 9e5,
		requesterRun: params.requesterRun,
		registerHumanInputWait: params.registerHumanInputWait,
		authorizeClient,
		isRequesterActive,
		questions,
		onResolved: (event) => {
			decisionPending = false;
			params.context.broadcast("question.resolved", event, { questionRecipient: authorizeClient });
		}
	});
	const cancel = () => {
		if (manager.get(question.id)?.status === "pending") manager.cancel(question.id, "communication-cancelled");
	};
	params.signal?.addEventListener("abort", cancel, { once: true });
	try {
		params.context.broadcast("question.requested", question, { questionRecipient: authorizeClient });
		const answer = await manager.waitAnswer(question.id);
		params.assertCurrent();
		params.signal?.throwIfAborted();
		if (answer.status !== "answered" || answer.answers.answers.communication?.length !== 1 || answer.answers.answers.communication[0] !== "Allow once") throw new Error("Peer message was not authorized; no message was delivered.");
	} finally {
		params.signal?.removeEventListener("abort", cancel);
		cancel();
	}
}
//#endregion
//#region src/agents/tools/sessions-send-communication.ts
/** A current permission decision rejected delivery, rather than an unavailable dependency. */
var SessionCommunicationDeniedError = class extends Error {};
/** One prepared peer operation; identity bounds never choose its completion route. */
async function prepareSessionsSendCommunication(params) {
	const message = params.message;
	const dispatchMessage = params.dispatchMessage ?? message;
	const inputProvenance = params.inputProvenance ? structuredClone(params.inputProvenance) : void 0;
	const targetAgentId = params.target.agentId;
	const targetSessionKey = params.target.sessionKey;
	const targetsThread = Boolean(resolveSessionThreadInfo(targetSessionKey).threadId);
	const caller = getGatewayToolCallerIdentity();
	const assertCaller = captureGatewayToolCallerAssertion();
	const context = getInProcessGatewayToolContext();
	const config = params.config;
	const readConfig = createRuntimeConfigReader(config);
	const currentPolicyConfig = () => context?.getRuntimeConfig() ?? readConfig();
	const currentConfig = currentPolicyConfig();
	const policyConfigs = config === currentConfig ? [config] : [config, currentConfig];
	const sandboxed = params.access?.sandboxed === true || policyConfigs.some((policyConfig) => resolveSandboxRuntimeStatus({
		cfg: policyConfig,
		agentId: params.source.agentId,
		sessionKey: params.source.sessionKey,
		preparedSessionEntry: params.source.entry ?? null
	}).sandboxed);
	const accessPolicies = policyConfigs.map((policyConfig) => ({
		scope: resolveSandboxedSessionToolContext({
			cfg: policyConfig,
			agentSessionKey: params.source.sessionKey,
			requesterAgentId: params.source.agentId,
			sandboxed
		}),
		visibility: resolveEffectiveSessionToolsVisibility({
			cfg: policyConfig,
			sandboxed
		}),
		a2aPolicy: createAgentToAgentPolicy(policyConfig, { sandboxed })
	}));
	let closed = false;
	let dirty = false;
	let creatingTarget = false;
	let endpoints = [params.source, params.target];
	const assertSource = () => {
		if (closed) throw new Error("Session communication admission closed.");
		params.signal?.throwIfAborted();
		assertCaller?.();
		params.assertSourceCurrent?.();
		params.assertAccessCurrent?.();
		if (currentPolicyConfig() !== currentConfig) throw new Error("Communication policy changed; send the message again for a new decision.");
		if (targetsThread && policyConfigs.some((policyConfig) => policyConfig.tools?.sessions?.allowThreadTargets !== true)) throw new Error("sessions_send cannot target a thread session for inter-agent coordination. Use the parent channel session key instead, or enable tools.sessions.allowThreadTargets.");
	};
	const unsubscribe = sessionChanges.subscribeFacts((change) => {
		if (!sessionChangeScopeAffectsStoredRows(change) && !("all" in change && change.scope === "config")) return;
		if ("all" in change) {
			if (creatingTarget && typeof change.scope === "object" && change.scope.topology === true && change.scope.agentId === targetAgentId) return;
			dirty = true;
			return;
		}
		const selected = endpoints.filter((endpoint) => endpoint.sessionKey === change.sessionKey && (!change.agentId || endpoint.agentId === change.agentId) && !(creatingTarget && !endpoint.entry && endpoint.agentId === targetAgentId && endpoint.sessionKey === targetSessionKey));
		if (!selected.length || !change.facts && !change.factsInvalidated || change.facts?.kind === "unchanged" || change.facts?.kind === "participants" || change.facts?.kind === "category") return;
		const facts = change.facts;
		if ((facts?.kind === "entry" || facts?.kind === "replacement") && facts.communicationBinding !== void 0) dirty ||= selected.some((endpoint) => communicationEntryBinding(endpoint.entry) !== facts.communicationBinding);
		else dirty = true;
	});
	const read = async (endpoint) => {
		const source = captureSessionActorStorageOwner(endpoint, {
			assertCurrent: assertSource,
			authorize() {}
		});
		if (source) return {
			agentId: source.agentId,
			sessionKey: endpoint.sessionKey,
			storePath: source.path,
			entry: readCapturedSessionActorEntry(source, endpoint.sessionKey)
		};
		const loaded = await resolveGatewaySessionStoreTargetInWorker({
			cfg: currentConfig,
			key: endpoint.sessionKey,
			agentId: endpoint.agentId,
			assertActive: assertSource,
			projection: "full"
		});
		return {
			agentId: loaded.agentId,
			sessionKey: loaded.canonicalKey,
			storePath: loaded.readSource?.path ?? loaded.storePath,
			entry: loaded.store[loaded.canonicalKey]
		};
	};
	const lineage = async (endpoint) => {
		const chain = [endpoint];
		while (chain.at(-1)?.entry?.spawnedBy) {
			const child = chain.at(-1);
			const key = child.entry.spawnedBy;
			if (chain.length >= 32 || chain.some((entry) => entry.sessionKey === key)) throw new Error("Session communication ancestry is invalid.");
			const parent = await read({
				agentId: parseAgentSessionKey(key)?.agentId ?? child.agentId,
				sessionKey: key,
				storePath: "",
				entry: void 0
			});
			if (!parent.entry || child.entry?.parentSessionId && child.entry.parentSessionId !== parent.entry.sessionId) throw new Error("The communication policy's parent session is no longer current.");
			chain.push(parent);
		}
		return chain;
	};
	const task = getLatestLiveSubagentRunByChildSessionKey(params.target.sessionKey, void 0, params.target.agentId);
	const ownedTask = Boolean(caller && caller.agentId === params.source.agentId && caller.sessionKey === params.source.sessionKey && task && task.requesterSessionKey === params.source.sessionKey && task.requesterAgentId === params.source.agentId && (!task.controllerSessionKey || task.controllerSessionKey === params.source.sessionKey) && (!task.execution?.transcriptTarget || task.execution.transcriptTarget.sessionId === params.target.entry?.sessionId) && params.target.entry?.spawnedBy === params.source.sessionKey && params.target.entry.parentSessionId === params.source.entry?.sessionId && !task.killIntent && !task.killReconciliation && !task.terminalOwner && task.cleanupCompletedAt === void 0);
	const taskRunId = task?.runId;
	const taskGeneration = task?.generation;
	let resumedTask;
	const assertTask = () => {
		if (ownedTask && (getLatestLiveSubagentRunByChildSessionKey(params.target.sessionKey, void 0, params.target.agentId) !== task || task?.runId !== taskRunId || task?.generation !== taskGeneration || task?.controllerSessionKey && task.controllerSessionKey !== params.source.sessionKey || task?.killIntent || task?.killReconciliation || task?.terminalOwner || task?.cleanupCompletedAt !== void 0)) {
			if (resumedTask) {
				assertParentSubagentResumeSuccessorCurrent(resumedTask.resume, resumedTask.runId);
				return;
			}
			throw new Error("Owned task communication authority changed.");
		}
	};
	const close = () => {
		if (!closed) {
			closed = true;
			unsubscribe();
		}
	};
	try {
		assertSource();
		let source = await lineage(params.source);
		let target = await lineage(params.target);
		endpoints = [...source, ...target];
		let bindings = endpoints.map(communicationEndpointBinding);
		const assertAccess = async () => {
			assertSource();
			for (const { scope, visibility, a2aPolicy } of accessPolicies) {
				const decision = await resolveSessionToolAccess({
					action: "send",
					watch: params.access?.watch,
					requesterAgentId: params.source.agentId,
					requesterSessionKey: params.source.sessionKey,
					mainSessionKey: scope.mainSessionKey,
					targetAgentId: target[0].agentId,
					targetSessionKey: target[0].sessionKey,
					authorizationTargetSessionKey: params.access?.authorizationTargetSessionKey ?? (parseAgentSessionKey(target[0].sessionKey) ? target[0].sessionKey : "agent:" + target[0].agentId + ":" + target[0].sessionKey),
					requesterOwned: params.access?.requesterOwned === true || target[0].entry?.spawnedBy === params.source.sessionKey,
					visibility,
					a2aPolicy,
					callGateway: params.callGateway
				});
				assertSource();
				if (!decision.allowed) throw new SessionCommunicationDeniedError(formatSessionToolAccessDenial(decision, {
					action: "send",
					targetSessionKey: target[0].sessionKey
				}));
				const expected = decision.expectedSessionId ?? params.access?.expectedSessionId;
				if (expected && target[0].entry?.sessionId !== expected) throw new Error("Session communication access grant no longer names the prepared target.");
			}
		};
		const refresh = async () => {
			assertSource();
			assertTask();
			if (dirty) throw new Error("Session communication changed before delivery; send again for a new decision.");
			const current = await Promise.all(endpoints.map(read));
			await assertAccess();
			if (dirty || current.some((endpoint, index) => communicationEndpointBinding(endpoint) !== bindings[index])) throw new Error("Session communication changed before delivery; no message was authorized for the new state.");
		};
		const plan = () => {
			const approvals = /* @__PURE__ */ new Map();
			for (const policyConfig of policyConfigs) {
				const result = planSessionCommunication({
					config: policyConfig,
					source,
					target,
					ownedTask
				});
				if (!result.allowed) throw new SessionCommunicationDeniedError(result.error);
				for (const approval of result.approvals) approvals.set(JSON.stringify([
					approval.direction,
					approval.endpoint.agentId,
					approval.endpoint.sessionKey
				]), approval);
			}
			return { approvals: [...approvals.values()] };
		};
		const initialPlan = plan();
		await refresh();
		const approve = async (approval) => {
			if (params.allowApproval === false) throw new SessionCommunicationDeniedError("Session delivery requires fresh human communication approval.");
			await refresh();
			if (!context || !assertCaller && !params.assertSourceCurrent) throw new Error("Human communication approval requires a live admitted Gateway caller.");
			await requestSessionCommunicationApproval({
				context,
				approval,
				source: params.source,
				target: target[0],
				message,
				assertCurrent: () => {
					assertSource();
					assertTask();
					if (dirty) throw new Error("Session communication state changed before approval.");
				},
				signal: params.signal,
				requesterRun: caller?.operationalRunInstance,
				registerHumanInputWait: caller?.approvalAuthority ? (pending) => registerActiveEmbeddedRunHumanInputWait(caller.approvalAuthority, pending) : void 0
			});
			await refresh();
		};
		for (const approval of initialPlan.approvals.filter((item) => item.direction === "send")) await approve(approval);
		if (!target[0].entry) {
			if (!params.ensureTarget) throw new Error("Communication requires an existing target session.");
			await refresh();
			creatingTarget = true;
			let created;
			try {
				created = await params.ensureTarget(() => {
					assertSource();
					if (dirty) throw new Error("Session communication state changed before creation.");
				});
			} finally {
				creatingTarget = false;
			}
			assertSource();
			if (!created.entry || created.agentId !== params.target.agentId || created.sessionKey !== params.target.sessionKey) throw new Error("Created target differs from the approved communication operation.");
			target = await lineage(created);
			if (!source[0].entry && source[0].agentId === created.agentId && source[0].sessionKey === created.sessionKey && source[0].storePath === created.storePath) source = target;
			endpoints = [...source, ...target];
			bindings = endpoints.map(communicationEndpointBinding);
			plan();
			await refresh();
		}
		for (const approval of plan().approvals.filter((item) => item.direction === "receive")) await approve(approval);
		const assertCurrent = () => {
			assertSource();
			assertTask();
			if (dirty) throw new Error("Session communication state changed before admission.");
		};
		await refresh();
		const callGateway = async (request) => {
			if (request.method !== "agent") return params.callGateway(request);
			await refresh();
			if (!isRecord(request.params) || request.params.sessionKey !== targetSessionKey || request.params.agentId !== targetAgentId || request.params.message !== dispatchMessage || !isDeepStrictEqual(request.params.inputProvenance, inputProvenance)) throw new Error("Communication approval cannot be redirected to another session.");
			const resume = readInProcessSubagentResume(request);
			if (ownedTask && resume && typeof request.params.idempotencyKey === "string") {
				if (resume.childSessionKey !== targetSessionKey || resume.childSessionId !== target[0].entry?.sessionId || resume.previousRunId !== taskRunId || resume.generation !== taskGeneration) throw new Error("Task resume differs from the captured communication owner.");
				resumedTask = {
					resume,
					runId: request.params.idempotencyKey
				};
			}
			const endpoint = target[0];
			if (!endpoint.entry || request.params.expectedExistingSessionId !== void 0 && request.params.expectedExistingSessionId !== endpoint.entry.sessionId) throw new Error("Communication target incarnation changed before admission.");
			const input = {
				...request.params,
				expectedExistingSessionId: endpoint.entry.sessionId,
				expectedExistingSessionLifecycleRevision: endpoint.entry.lifecycleRevision ?? null
			};
			const expectedInput = structuredClone(input);
			const assertAdmission = () => {
				request.sessionMutationCommitGuard?.();
				assertCurrent();
				if (!isDeepStrictEqual(input, expectedInput)) throw new Error("Approved communication input changed before admission.");
			};
			const dispatch = () => params.callGateway(bindInProcessSubagentResume({
				...request,
				params: input,
				...context ? { sessionMutationCommitGuard: assertAdmission } : { assertDispatchCurrent: () => {
					request.assertDispatchCurrent?.();
					assertAdmission();
				} }
			}, resume));
			const sender = source[0];
			if (context && !ownedTask && !resume && sender.entry && typeof request.params.idempotencyKey === "string" && inputProvenance?.sourceTool === "sessions_send") return withSessionSendDelivery({ delivery: {
				version: 1,
				runId: request.params.idempotencyKey,
				source: {
					agentId: sender.agentId,
					sessionKey: sender.sessionKey,
					sessionId: sender.entry.sessionId,
					lifecycleRevision: sender.entry.lifecycleRevision
				},
				target: {
					agentId: endpoint.agentId,
					sessionKey: endpoint.sessionKey,
					sessionId: endpoint.entry.sessionId,
					lifecycleRevision: endpoint.entry.lifecycleRevision
				},
				sandboxed,
				message: dispatchMessage
			} }, dispatch);
			return dispatch();
		};
		return {
			assertCurrent,
			refresh,
			callGateway,
			ownedTask,
			sourceSandboxed: sandboxed,
			close
		};
	} catch (error) {
		close();
		throw error;
	}
}
//#endregion
export { bindParentSubagentResume as a, assertParentSubagentResumeSuccessorCurrent as i, prepareSessionsSendCommunication as n, prepareParentSubagentResume as o, assertParentSubagentResumeCurrent as r, shouldResumeParentSubagent as s, SessionCommunicationDeniedError as t };
