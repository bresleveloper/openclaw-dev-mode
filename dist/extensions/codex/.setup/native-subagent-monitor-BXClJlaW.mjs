import { c as codexNativeSubagentRunId, d as readNativeSubagentThreadIds, f as readThreadParentThreadId, l as normalizeIdentifier, m as assertHistoryOwnerMatchesRegistration, p as readThreadSpawnSource, t as matchesNativeAssignmentLifecycle, u as readCodexNativeSubagentRunId } from "./native-subagent-pending-assignments-BDqhOdJp.mjs";
import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import { n as defineCodexBuildState } from "./build-state-BgEYwu09.mjs";
import { a as readHookOutputEntries, o as readItem, s as readNullableString } from "./event-projector-values-DTqZHizf.mjs";
import { t as attachCodexMirrorIdentity } from "./upstream-prompt-provenance-fXkKbPVC.mjs";
import { t as readCodexMirroredSessionHistoryMessages } from "./session-history-BogBHKLk.mjs";
import { P as claimCodexAppServerLiveThread, R as hasCodexAppServerLiveThread, q as retainCodexAppServerLiveThread } from "./shared-client-r9NcV_GJ.mjs";
import { L as readCodexAppServerWarningMessage } from "./client-BM1XpAkE.mjs";
import { _ as itemStatus, c as auditNativeToolName, d as isMutatingNativeToolItem, f as isNonSuccessItemStatus, g as itemName, h as itemKind, l as auditNativeToolTerminalStatus, m as isSideEffectingNativeToolItem, p as isProjectedNativeToolItem, v as itemTitle, x as unknownItemStatus, y as matchesCodexSnapshotTurn } from "./turn-router-DLqce1id.mjs";
import { s as interruptCodexTurnAndWaitBestEffort } from "./attempt-client-cleanup-DNfVb5SC.mjs";
import { n as codexApprovalTimeoutText } from "./plugin-approval-roundtrip-CP6xoxpH.mjs";
import { t as __exportAll } from "./session-binding-sidecars-BrdV95Fg.mjs";
import { asFiniteNumber, asNonArrayRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalString, normalizeTrimmedStringList, readStringField } from "openclaw/plugin-sdk/string-coerce-runtime";
import { randomUUID } from "node:crypto";
import { asDateTimestampMs } from "openclaw/plugin-sdk/number-runtime";
import path from "node:path";
import { toErrorObject } from "openclaw/plugin-sdk/error-runtime";
import { KeyedAsyncQueue } from "openclaw/plugin-sdk/keyed-async-queue";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { TOOL_PROGRESS_OUTPUT_MAX_CHARS, embeddedAgentLog, emitAgentEvent, formatErrorMessage as formatErrorMessage$1, inferToolMetaFromArgs, projectAgentActivityItem, projectAgentToolActivity, runAgentHarnessAfterToolCallHook, sanitizeToolArgs } from "openclaw/plugin-sdk/agent-harness-runtime";
import { MAX_TOOL_OUTPUT_DELTA_MESSAGES_PER_ITEM, NativeToolOutputAccumulator, TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS, createAgentHarnessToolCallMessage, createAgentHarnessToolResultMessage, formatNativeToolOutput, formatNativeToolSummary, truncateNativeToolTranscriptText } from "openclaw/plugin-sdk/agent-harness-attempt-runtime";
import { captureAgentHarnessCompletionCustody, createAgentHarnessCompletionEventSink, deliverAgentHarnessCompletion, isDurableAgentHarnessCompletionDelivery } from "openclaw/plugin-sdk/agent-harness-completion";
import { compileFunction } from "node:vm";
//#region extensions/codex/src/app-server/native-subagent-model-lookup.ts
function waitForNativeModelSourceChange(state, signal) {
	signal?.throwIfAborted();
	return new Promise((resolve, reject) => {
		const remove = () => {
			state.modelSourceWaiters?.delete(changed);
			signal?.removeEventListener("abort", aborted);
		};
		const changed = () => {
			remove();
			resolve();
		};
		const aborted = () => {
			remove();
			reject(toErrorObject(signal?.reason, "Codex model source capture was aborted"));
		};
		(state.modelSourceWaiters ??= /* @__PURE__ */ new Set()).add(changed);
		signal?.addEventListener("abort", aborted, { once: true });
	});
}
function matchingNativeModelCause(owner, request) {
	return Boolean(owner.turnId && (owner.turnId === request.parentTurnId || owner.turnId === request.rootTurnId));
}
function matchingNativeModelAdmissions(request, admissions, parentThreadId) {
	return [...admissions.values()].flat().filter((entry) => entry.kind === "interaction" && (parentThreadId === void 0 || entry.parentThreadId === parentThreadId) && entry.childThreadId === request.threadId && (entry.modelSourceRequiresInference || !(entry.modelSourceTurnId ?? entry.nativeTurnId) || (entry.modelSourceTurnId ?? entry.nativeTurnId) === request.turnId) && entry.modelSource !== void 0 && matchingNativeModelCause(entry.modelSource.owner, request));
}
function findUnqualifiedNativeModelParent(request, parents, admissions) {
	const candidates = new Set(matchingNativeModelAdmissions(request, admissions).flatMap((entry) => {
		const state = parents.get(entry.parentThreadId);
		return state && entry.modelSource?.owner.unqualifiedModelExecution ? [state] : [];
	}));
	for (const state of parents.values()) if ([...state.owners.values()].some((owner) => owner.unqualifiedModelExecution && !owner.modelExecutionCancelled && !owner.modelExecutionSettled && matchingNativeModelCause(owner, request))) candidates.add(state);
	return candidates.size === 1 ? candidates.values().next().value : void 0;
}
function currentNativeModelExecution(threadId, parents, knownChildren, children) {
	const state = parents.get(threadId);
	if (state) {
		if ([...state.owners.values()].some((owner) => !owner.turnId)) throw new Error("Codex active input requires the receiver turn to be bound");
		const owners = [...state.owners.values()].filter((owner) => owner.turnId && !owner.modelExecutionSettled);
		if (owners.length > 1) throw new Error("Codex active input requires an unambiguous receiver turn");
		return owners[0];
	}
	const known = knownChildren.get(threadId);
	const child = known ? children.get(known.assignment.runId) : void 0;
	const owners = /* @__PURE__ */ new Set();
	if (child && !child.terminal && !child.settledWithoutCompletion && child.modelExecution) owners.add(child.modelExecution.executionOwner);
	for (const pending of known?.pendingTurns ?? []) if (pending.modelSource && (!pending.state || pending.state === "active")) owners.add(pending.modelSource.executionOwner);
	if (owners.size > 1) throw new Error("Codex active input requires an unambiguous receiver turn");
	return owners.values().next().value;
}
/** A native image header names only a turn; it cannot choose its source thread. */
function resolveNativeModelThreadId(turnId, parents, knownChildren, children, isCurrent) {
	const candidates = /* @__PURE__ */ new Map();
	const add = (threadId, owner) => {
		if (owner?.turnId === turnId && !owner.modelExecutionSettled && !owner.modelExecutionCancelled) candidates.set(owner, threadId);
	};
	for (const state of parents.values()) if (isCurrent(state)) for (const owner of state.owners.values()) add(state.parentThreadId, owner);
	for (const [threadId, known] of knownChildren) {
		if (!isCurrent(known.parent)) continue;
		const child = children.get(known.assignment.runId);
		if (child && !child.terminal && !child.settledWithoutCompletion && (!child.nativeTurnState || child.nativeTurnState === "active")) add(threadId, child.modelExecution?.executionOwner);
		for (const pending of known.pendingTurns) if (!pending.state || pending.state === "active") add(threadId, pending.modelSource?.executionOwner);
	}
	if (candidates.size !== 1) return;
	const candidate = candidates.entries().next().value;
	let capture;
	try {
		capture = candidate?.[0].modelSource?.capture();
		if (!capture) return;
		capture.assertCurrent();
		return candidate?.[1];
	} catch {
		return;
	} finally {
		capture?.release();
	}
}
function resolveNativeModelParentOwner(state, turnIdInput, nativeParentThreadId, children, knownChildren) {
	const turnId = turnIdInput?.trim();
	if (!turnId) return;
	if (nativeParentThreadId !== state.parentThreadId) {
		const assignment = knownChildren.get(nativeParentThreadId)?.assignment;
		const child = assignment ? children.get(assignment.runId) : void 0;
		return child?.nativeTurnId === turnId && !child.terminal ? child.modelExecution?.executionOwner : void 0;
	}
	const owners = [...state.owners.values()].filter((owner) => owner.turnId === turnId);
	if (!owners.length) {
		for (const child of children.values()) if (child.parentThreadId === state.parentThreadId && child.nativeTurnId === turnId && !child.terminal && child.modelExecution) owners.push(child.modelExecution.executionOwner);
	}
	return owners.length === 1 ? owners[0] : void 0;
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-model-source.ts
function notifyNativeModelSourceWaiters(state) {
	const waiters = [...state.modelSourceWaiters ?? []];
	state.modelSourceWaiters?.clear();
	for (const resolve of waiters) resolve();
}
function notifyNativeModelSourceChange(method, states) {
	if (method === "item/agentMessage/delta" || method === "item/reasoning/summaryTextDelta") return;
	for (const state of states) notifyNativeModelSourceWaiters(state);
}
/** One issued source is shared only by its extant parent, accepted work, and dispatches. */
function createNativeModelSourceOwner(source, state, assertCurrent, onReleased) {
	let references = 1;
	let foregroundReleased = false;
	state.modelSourceReferences = (state.modelSourceReferences ?? 0) + 1;
	const assertSource = () => {
		if (references === 0) throw new Error("Codex native model source is released");
		assertCurrent();
		source?.assertCurrent();
	};
	const release = () => {
		references -= 1;
		state.modelSourceReferences = (state.modelSourceReferences ?? 1) - 1;
		try {
			if (references === 0) source?.release();
		} finally {
			onReleased();
		}
	};
	return {
		hasOperatorSource: source !== void 0,
		capture: () => {
			assertSource();
			references += 1;
			state.modelSourceReferences = (state.modelSourceReferences ?? 0) + 1;
			let released = false;
			return {
				source,
				assertCurrent: () => {
					if (released) throw new Error("Codex native model source capture is released");
					assertSource();
				},
				release: () => {
					if (!released) {
						released = true;
						release();
					}
				}
			};
		},
		release: () => {
			if (!foregroundReleased) {
				foregroundReleased = true;
				release();
			}
		}
	};
}
function retainNativeModelSource(owner) {
	const capture = owner?.modelSource?.capture();
	return capture && owner ? {
		owner,
		assertCurrent: capture.assertCurrent,
		release: capture.release
	} : void 0;
}
function retainNativeModelExecution(owner, turnId, threadId, completionCustody = owner?.completionCustody) {
	const capture = owner?.modelSource?.capture();
	if (!owner || !capture) return;
	const nativeOwner = {
		modelSource: owner.modelSource,
		modelMapping: owner.modelMapping,
		configurationQualification: owner.configurationQualification,
		unqualifiedModelExecution: owner.unqualifiedModelExecution,
		interruptModelExecution: owner.interruptModelExecution
	};
	try {
		nativeOwner.completionCustody = completionCustody?.retain();
	} catch (error) {
		capture.release();
		throw error;
	}
	if (owner.unqualifiedModelExecution && owner.modelExecutionCancelled) nativeOwner.modelExecutionCancelled = true;
	let binding;
	try {
		binding = owner.claimUnqualifiedModelBinding?.() ?? (owner.unqualifiedModelExecution ? capture.source?.bindModelExecution?.(void 0) : void 0);
	} catch {
		nativeOwner.modelExecutionCancelled = true;
	}
	if (owner.unqualifiedModelExecution && !binding) nativeOwner.modelExecutionCancelled = true;
	const signal = binding?.signal;
	let interrupted = false;
	let released = false;
	const cancel = () => {
		nativeOwner.modelExecutionCancelled = true;
		if (!released && !interrupted && nativeOwner.turnId) {
			interrupted = true;
			owner.interruptModelExecution?.(threadId, nativeOwner.turnId);
		}
	};
	const bindTurn = (id) => {
		nativeOwner.turnId = id;
		if (signal?.aborted || nativeOwner.modelExecutionCancelled) cancel();
	};
	signal?.addEventListener("abort", cancel, { once: true });
	if (signal?.aborted || nativeOwner.modelExecutionCancelled) cancel();
	if (turnId) bindTurn(turnId);
	return {
		owner,
		executionOwner: nativeOwner,
		bindTurn,
		assertCurrent: () => {
			capture.assertCurrent();
			if (nativeOwner.modelExecutionCancelled) throw new Error("Codex native model execution was cancelled");
			binding?.assertCurrent();
		},
		release: () => {
			if (!released) {
				released = true;
				signal?.removeEventListener("abort", cancel);
				try {
					binding?.release();
				} finally {
					try {
						nativeOwner.completionCustody?.release();
					} finally {
						nativeOwner.completionCustody = void 0;
						capture.release();
					}
				}
			}
		}
	};
}
function releaseNativeModelExecution(child) {
	const execution = child.modelExecution;
	child.modelExecution = void 0;
	if (execution) {
		if (execution.executionOwner.modelExecutionCancelled) child.cancelledModelTurnId = execution.executionOwner.turnId;
		execution.executionOwner.modelExecutionSettled = true;
		execution.executionOwner.nativeReviewRequirement = void 0;
	}
	execution?.release();
}
function releaseNativeDirectChild(child) {
	const release = child.releaseDirectChild;
	child.releaseDirectChild = void 0;
	child.directOwner = void 0;
	release?.();
}
function admitNativeChildModelExecution(child, owner, known) {
	if (known) known.configurationQualification = owner.configurationQualification;
	child.modelExecution ??= retainNativeModelExecution(owner, child.nativeTurnId, child.childThreadId, child.completionCustody);
	owner.onDirectChildAccepted?.();
}
function consumeNativeChildModelAdmission(evidence) {
	const source = evidence.modelSource;
	evidence.modelSource = void 0;
	evidence.modelSourceConsumed = true;
	source?.release();
}
function releasePendingNativeModelInputs(threadId, admissions) {
	for (const entries of admissions.values()) for (const evidence of entries) if (evidence.kind === "interaction" && evidence.childThreadId === threadId) consumeNativeChildModelAdmission(evidence);
}
/** Transfers only a receipt's exact model turn; tool pairing has its own turn ID. */
function bindNativeChildModelAdmission(evidence, known, child) {
	const source = evidence.modelSource;
	if (!source) return false;
	if (evidence.modelSourceRequiresInference) return true;
	source.assertCurrent();
	const turnId = evidence.modelSourceTurnId ?? evidence.nativeTurnId;
	if (!turnId) return true;
	const pending = known.pendingTurns.find((entry) => entry.turnId === turnId);
	if (pending) {
		if (!pending.state || pending.state === "active") {
			pending.completionCustody ??= evidence.completionCustody?.retain();
			pending.modelSource ??= retainNativeModelExecution(source.owner, turnId, evidence.childThreadId, evidence.completionCustody);
		}
	} else if (child?.nativeTurnId === turnId) {
		if (!child.terminal && !child.settledWithoutCompletion) {
			child.completionCustody ??= evidence.completionCustody?.retain();
			child.modelExecution ??= retainNativeModelExecution(source.owner, turnId, evidence.childThreadId, evidence.completionCustody);
		}
	} else return true;
	consumeNativeChildModelAdmission(evidence);
	return false;
}
function closeNativeModelChild(threadId, knownChildren, children, prune) {
	const known = threadId ? knownChildren.get(threadId) : void 0;
	if (!known) return;
	const child = children.get(known.assignment.runId);
	if (child) releaseNativeModelExecution(child);
	for (const pending of known.pendingTurns) {
		pending.modelSource?.release();
		pending.modelSource = void 0;
	}
	prune(known.parent);
}
function releaseNativeParentModelSources(state, children) {
	for (const owner of state.owners.values()) owner.modelSource?.release();
	for (const known of children) if (known.parent === state) for (const pending of known.pendingTurns) {
		pending.modelSource?.release();
		pending.modelSource = void 0;
	}
}
function associateNativeChildInteraction(known, threadId, nativeTurnId, admissions, drain) {
	for (const [parentTurnId, pending] of admissions) {
		const interaction = pending.find((evidence) => evidence.kind === "interaction" && evidence.parentThreadId === known.parent.parentThreadId && evidence.childThreadId === threadId && !evidence.nativeTurnId);
		if (interaction?.kind !== "interaction") continue;
		interaction.nativeTurnId = nativeTurnId;
		const observed = known.observedTurns.get(nativeTurnId);
		if (observed) observed.awaitingInteraction = void 0;
		const owner = interaction.owner ?? interaction.modelSource?.owner;
		if (owner) drain(owner, parentTurnId);
		return;
	}
}
function captureExecutionOwner(owner, assertInputCurrent) {
	if (owner.modelExecutionCancelled) throw new Error("Codex native model execution was cancelled");
	const capture = owner.modelSource?.capture();
	if (!capture) return;
	let released = false;
	const reviewRequirement = owner.nativeReviewRequirement ??= { required: false };
	const assertCurrent = () => {
		capture.assertCurrent();
		if (owner.modelExecutionCancelled) throw new Error("Codex native model execution was cancelled");
		assertInputCurrent();
	};
	return {
		...capture,
		modelMapping: owner.modelMapping,
		get nativeReviewRequired() {
			return reviewRequirement.required;
		},
		recordNativeReviewRequirement: (required) => {
			assertCurrent();
			if (required) reviewRequirement.required = true;
		},
		assertCurrent,
		cancel: () => {
			if (!released) owner.modelExecutionCancelled = true;
		},
		release: () => {
			released = true;
			capture.release();
		}
	};
}
function executionOwner(request, state, dependencies) {
	if (state.parentThreadId === request.threadId) return [...state.owners.values()].find((owner) => owner.turnId === request.turnId && !owner.modelExecutionSettled);
	const admitted = matchingNativeModelAdmissions(request, dependencies.admissions, state.parentThreadId);
	const owners = new Set(admitted.flatMap((entry) => entry.modelSource ? [entry.modelSource.owner] : []));
	const admittedOwner = owners.size === 1 ? owners.values().next().value : void 0;
	if (!dependencies.knownChildren.has(request.threadId) && admittedOwner?.unqualifiedModelExecution && request.parentThreadId) {
		for (const entry of admitted) entry.modelSource?.assertCurrent();
		dependencies.registerChildExecution(state, request, admitted[0]?.agentPath, admitted[0]?.completionCustody);
	}
	const known = dependencies.knownChildren.get(request.threadId);
	if (known?.parent !== state || request.parentThreadId && request.parentThreadId !== known.nativeParentThreadId) return;
	const child = dependencies.children.get(known.assignment.runId);
	const execution = child?.modelExecution;
	if (child && !child.terminal && !child.settledWithoutCompletion && execution && (!child.nativeTurnId || child.nativeTurnId === request.turnId)) {
		if (!execution.executionOwner.turnId && matchingNativeModelCause(execution.owner, request)) execution.bindTurn(request.turnId);
		if (execution.executionOwner.turnId === request.turnId) {
			if (!child.nativeTurnId && !known.assignment.unanchored) {
				child.nativeTurnId = request.turnId;
				known.assignment.nativeTurnId = request.turnId;
			}
			return execution.executionOwner;
		}
	}
	const pending = known.pendingTurns.find((turn) => turn.turnId === request.turnId);
	if (pending?.state && pending.state !== "active") return;
	if (pending?.modelSource && (!request.parentTurnId && !request.rootTurnId || matchingNativeModelCause(pending.modelSource.owner, request))) return pending.modelSource.executionOwner;
	const owner = admittedOwner;
	if (!owner || child?.nativeTurnId === request.turnId && child.modelExecution) return;
	for (const entry of admitted) entry.modelSource?.assertCurrent();
	const completionCustody = admitted[0]?.completionCustody;
	const modelSource = retainNativeModelExecution(owner, request.turnId, request.threadId, completionCustody);
	if (!modelSource) return;
	if (child && (!child.nativeTurnId || child.nativeTurnId === request.turnId) && !child.terminal && !child.settledWithoutCompletion && !known.assignment.unanchored) {
		child.nativeTurnId = request.turnId;
		known.assignment.nativeTurnId = request.turnId;
		child.modelExecution = modelSource;
		child.completionCustody ??= completionCustody?.retain();
	} else if (pending) {
		pending.modelSource = modelSource;
		pending.completionCustody ??= completionCustody?.retain();
	} else known.pendingTurns.push({
		turnId: request.turnId,
		state: void 0,
		modelSource,
		completionCustody: completionCustody?.retain()
	});
	for (const entry of admitted) if (entry.kind === "interaction" && entry.modelSource?.owner === owner) consumeNativeChildModelAdmission(entry);
	if (pending?.state === "active" || child?.nativeTurnId === request.turnId) dependencies.onExecutionAdmitted(known, request.threadId);
	return modelSource.executionOwner;
}
async function captureNativeModelSource(request, dependencies) {
	for (;;) {
		request.signal?.throwIfAborted();
		const parent = request.parentThreadId ? dependencies.knownChildren.get(request.parentThreadId) : void 0;
		const state = dependencies.parents.get(request.threadId) ?? dependencies.knownChildren.get(request.threadId)?.parent ?? (request.parentThreadId ? dependencies.parents.get(request.parentThreadId) : void 0) ?? parent?.parent ?? findUnqualifiedNativeModelParent(request, dependencies.parents, dependencies.admissions);
		if (!state || !dependencies.isCurrent(state)) return;
		if (state.parentThreadId === request.threadId && [...state.owners.values()].some((owner) => owner.turnId === request.turnId && owner.modelExecutionSettled)) return;
		const owner = executionOwner(request, state, dependencies);
		if (owner) {
			dependencies.assertInputCurrent(request.threadId, owner);
			return captureExecutionOwner(owner, () => dependencies.assertInputCurrent(request.threadId, owner));
		}
		const parentExecution = parent ? dependencies.children.get(parent.assignment.runId)?.modelExecution?.executionOwner : void 0;
		const known = dependencies.knownChildren.get(request.threadId);
		const child = known ? dependencies.children.get(known.assignment.runId) : void 0;
		const observedChildTurn = known?.observedTurns.has(request.turnId) || child?.nativeTurnId === request.turnId;
		const pending = [...state.owners.values()].some((candidate) => candidate.modelSource && (state.parentThreadId === request.threadId ? !candidate.turnId : observedChildTurn && (!candidate.turnId || matchingNativeModelCause(candidate, request))));
		const unqualified = [...state.owners.values(), ...parentExecution ? [parentExecution] : []].filter((candidate) => candidate.unqualifiedModelExecution && !candidate.modelExecutionCancelled && !candidate.modelExecutionSettled && matchingNativeModelCause(candidate, request));
		const immediate = unqualified.filter((candidate) => candidate.turnId === request.parentTurnId);
		const waitingOwners = immediate.length > 0 ? immediate : unqualified;
		const waitingOwner = waitingOwners.length === 1 ? waitingOwners[0] : void 0;
		if (waitingOwner) {
			const capture = waitingOwner.modelSource?.capture();
			let binding;
			try {
				binding = capture?.source?.bindModelExecution?.(void 0);
				if (!binding) return;
				binding.assertCurrent();
				await waitForNativeModelSourceChange(state, request.signal ? AbortSignal.any([request.signal, binding.signal]) : binding.signal);
			} finally {
				binding?.release();
				capture?.release();
			}
			continue;
		}
		if (!pending && !dependencies.hasPendingInput(request) && !(observedChildTurn && parentExecution && matchingNativeModelCause(parentExecution, request))) return;
		await waitForNativeModelSourceChange(state, request.signal);
	}
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-admission-custody.ts
function releaseCompletionCustody(holder) {
	holder.completionCustody?.release();
	holder.completionCustody = void 0;
}
/** Own retained assignment authority while native evidence waits for its exact parent turn. */
var CodexNativeSubagentAdmissionCustody = class {
	constructor(dependencies) {
		this.dependencies = dependencies;
		this.pending = /* @__PURE__ */ new Map();
	}
	get entries() {
		return this.pending;
	}
	buffer(turnIdInput, evidence) {
		const turnId = turnIdInput?.trim();
		const requiresUnboundOwner = evidence.kind !== "interaction" || !evidence.owner && !evidence.modelOwner;
		if (!turnId || requiresUnboundOwner && !this.hasUnboundParentOwner(evidence.parentThreadId)) return;
		const pending = this.pending.get(turnId) ?? [];
		if (evidence.kind === "interaction" && !evidence.nativeTurnId) {
			const nativeTurn = [...this.dependencies.knownChild(evidence.childThreadId)?.observedTurns ?? []].find(([nativeTurnId, observed]) => observed.awaitingInteraction && ![...this.pending.values()].flat().some((candidate) => candidate.kind === "interaction" && candidate.parentThreadId === evidence.parentThreadId && candidate.childThreadId === evidence.childThreadId && candidate.nativeTurnId === nativeTurnId));
			if (nativeTurn) evidence.nativeTurnId = nativeTurn[0];
		}
		if (pending.some((candidate) => candidate.parentThreadId === evidence.parentThreadId && candidate.kind === evidence.kind && candidate.childThreadId === evidence.childThreadId && candidate.agentPath === evidence.agentPath && (candidate.kind === "spawn" || evidence.kind === "spawn" || candidate.modelSourceTurnId === evidence.modelSourceTurnId && (candidate.nativeTurnId !== void 0 && candidate.nativeTurnId === evidence.nativeTurnId || evidence.itemId !== void 0 && candidate.itemId === evidence.itemId))) || requiresUnboundOwner && [...this.pending.values()].reduce((count, entries) => count + entries.length, 0) >= 32) return;
		try {
			if (evidence.kind === "interaction") evidence.completionCustody ??= (evidence.owner ?? evidence.modelOwner)?.completionCustody?.retain();
			if (evidence.kind === "interaction" && !evidence.modelSourceConsumed) {
				const owner = evidence.modelOwner ?? evidence.owner;
				if (owner?.unqualifiedModelExecution && !owner.nativeInputConfiguration) {
					evidence.modelSourceRequiresInference = evidence.modelSourceTurnId ? void 0 : true;
					evidence.modelSource = retainNativeModelExecution(owner, void 0, evidence.childThreadId, evidence.completionCustody);
				} else evidence.modelSource = retainNativeModelSource(owner);
			}
		} catch (error) {
			if (evidence.kind === "interaction") {
				releaseCompletionCustody(evidence);
				consumeNativeChildModelAdmission(evidence);
			}
			throw error;
		}
		pending.push(evidence);
		this.pending.set(turnId, pending);
	}
	hasUnboundParentOwner(parentThreadId) {
		return [...this.dependencies.parentState(parentThreadId)?.owners.values() ?? []].some((owner) => owner.turnId === void 0);
	}
	replace(turnId, remaining) {
		const previous = this.pending.get(turnId) ?? [];
		for (const evidence of previous) if (evidence.kind === "interaction" && !remaining.includes(evidence)) releaseCompletionCustody(evidence);
		if (remaining.length) this.pending.set(turnId, remaining);
		else this.pending.delete(turnId);
		for (const evidence of previous) if (evidence.kind === "interaction" && !remaining.includes(evidence)) consumeNativeChildModelAdmission(evidence);
	}
	retainOnly(keep) {
		for (const [turnId, pending] of this.pending) this.replace(turnId, pending.filter(keep));
	}
	prune(isRetired) {
		this.retainOnly((evidence) => {
			const known = this.dependencies.knownChild(evidence.childThreadId);
			if (known && known.parent.parentThreadId !== evidence.parentThreadId) return false;
			const state = this.dependencies.parentState(evidence.parentThreadId);
			if (evidence.kind === "interaction" && (evidence.owner || evidence.modelSource)) {
				if (evidence.modelSource && state && !isRetired(state)) return true;
				if (state && evidence.owner && [...state.owners.values()].includes(evidence.owner)) return true;
				return false;
			}
			return this.hasUnboundParentOwner(evidence.parentThreadId);
		});
	}
	registerDirectSpawnChild(turnIdInput, evidence, owner, registerChild) {
		const childState = registerChild({
			...evidence.agentPath === void 0 ? {} : { agentPath: evidence.agentPath },
			nativeParentThreadId: evidence.nativeParentThreadId,
			...owner ? { directOwner: owner } : {}
		});
		if (!owner) this.buffer(turnIdInput, {
			...evidence,
			kind: "spawn"
		});
		else if (childState) admitNativeChildModelExecution(childState, owner, this.dependencies.knownChild(childState.childThreadId));
		return childState;
	}
	bindEventSink(child) {
		const parent = this.dependencies.parentState(child.parentThreadId);
		if (!child.completionCustody || !parent?.completionScope || child.emitEvent) return;
		child.emitEvent = this.dependencies.runtime.createAgentHarnessCompletionEventSink({
			scope: parent.completionScope,
			completionCustody: child.completionCustody,
			runId: child.runId,
			isSourceCurrent: () => this.dependencies.childState(child.runId) === child && this.dependencies.parentState(child.parentThreadId) === parent
		});
	}
	emitEvent(child, event) {
		if (this.dependencies.childState(child.runId) !== child) return;
		if (child.emitEvent) {
			child.emitEvent(event);
			return;
		}
		if (child.completionCustody) throw new Error("Native event assignment has not been bound");
		emitAgentEvent({
			...event,
			runId: child.runId,
			agentId: child.agentId
		});
	}
};
//#endregion
//#region extensions/codex/src/app-server/native-subagent-assignment-inventory.ts
/** Pending locators live with the existing binding, not in a parallel task ledger. */
var CodexNativeSubagentAssignmentInventory = class {
	constructor(dependencies) {
		this.dependencies = dependencies;
		this.writes = /* @__PURE__ */ new Map();
		this.snapshots = /* @__PURE__ */ new WeakMap();
	}
	hasWrites(state) {
		return this.writes.has(state);
	}
	async drain(state) {
		while (this.writes.has(state)) await this.writes.get(state);
	}
	/** New inference authority may escape only after its exact locator commits. */
	recordExecution(state, assignment, assertCurrent) {
		const store = state.assignmentStore;
		if (!store) throw new Error("Native model execution has no assignment persistence owner.");
		return this.enqueue(state, async () => {
			const assertAdmission = () => {
				this.dependencies.assertCurrent(state);
				assertCurrent();
			};
			assertAdmission();
			if (!await store.record(assignment, assertAdmission)) throw new Error("Native model execution assignment was not persisted.");
			assertAdmission();
		});
	}
	recordSubmission(state, submission, nativeParentThreadId) {
		if (!state.historyOwner || !state.assignmentStore) return;
		const assignment = {
			runId: codexNativeSubagentRunId(submission.childThreadId, submission.submissionId),
			childThreadId: submission.childThreadId,
			nativeTurnId: submission.submissionId,
			nativeParentThreadId,
			owner: state.historyOwner,
			submission
		};
		this.enqueue(state, async () => {
			if (!await state.assignmentStore?.record(assignment, () => this.dependencies.assertCurrent(state))) throw new Error("Native submission inventory binding changed before persistence.");
		});
	}
	record(state, child) {
		const assignment = this.fact(child);
		if (!assignment || !state.assignmentStore || child.nativeCompletionDelivered || child.subscriptionClosed) return;
		const snapshot = JSON.stringify(assignment);
		if (this.snapshots.get(child) === snapshot) return;
		this.snapshots.set(child, snapshot);
		this.enqueue(state, async () => {
			try {
				if (!await state.assignmentStore?.record(assignment, () => this.dependencies.assertCurrent(state))) throw new Error("Native assignment binding changed before persistence.");
			} catch (error) {
				this.snapshots.delete(child);
				throw error;
			}
		});
	}
	settle(state, child) {
		const assignment = this.fact(child);
		if (!assignment || !state.assignmentStore || !child.nativeCompletionDelivered && (!child.subscriptionClosed || child.pendingCompletion)) return;
		this.enqueue(state, async () => {
			await state.assignmentStore?.consume(assignment, () => this.dependencies.assertCurrent(state));
		});
	}
	async restore(state, owner) {
		const store = state.assignmentStore;
		const current = state.historyOwner;
		if (!store || !current || !owner.completionCustody?.isCurrent()) return;
		const custody = owner.completionCustody.retain();
		try {
			store.assertCurrent();
			for (const assignment of store.read()) {
				if (!matchesNativeAssignmentLifecycle(assignment.owner, current)) continue;
				const recovery = await this.dependencies.readHistory(assignment);
				if (!this.dependencies.isCurrent(state) || !custody.isCurrent()) return;
				store.assertCurrent();
				if (!recovery || recovery.parentThreadId !== assignment.nativeParentThreadId) continue;
				await this.dependencies.restore(state, assignment, recovery, custody);
			}
		} catch (error) {
			embeddedAgentLog.warn("Native pending assignments remain for reconciliation", { error: formatErrorMessage$1(error) });
		} finally {
			custody.release();
		}
	}
	fact(child) {
		return child.historyOwner ? {
			runId: child.runId,
			childThreadId: child.childThreadId,
			...child.nativeTurnId ? { nativeTurnId: child.nativeTurnId } : {},
			nativeParentThreadId: child.nativeParentThreadId,
			owner: child.historyOwner
		} : void 0;
	}
	enqueue(state, operation) {
		const recorded = (this.writes.get(state) ?? Promise.resolve()).then(operation);
		const pending = recorded.catch((error) => {
			embeddedAgentLog.warn("Native assignment durability could not be updated", { error: formatErrorMessage$1(error) });
		});
		this.writes.set(state, pending);
		pending.then(() => {
			if (this.writes.get(state) === pending) this.writes.delete(state);
			this.dependencies.onSettled(state);
		});
		return recorded;
	}
};
//#endregion
//#region extensions/codex/src/app-server/native-subagent-retry.ts
function delayForAttempt(delays, attempt) {
	return Math.max(1, delays[Math.min(attempt, delays.length - 1)] ?? 1);
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-recovery-coordinator.ts
const DEFAULT_RECOVERY_POLL_DELAYS_MS = [
	2e3,
	5e3,
	1e4,
	15e3,
	3e4,
	6e4,
	12e4,
	3e5
];
var CodexNativeSubagentRecoveryCoordinator = class {
	constructor(dependencies) {
		this.dependencies = dependencies;
		this.threadStatusRevisions = /* @__PURE__ */ new Map();
		this.recoveryPollDelaysMs = dependencies.recoveryPollDelaysMs ?? DEFAULT_RECOVERY_POLL_DELAYS_MS;
	}
	hasRevision(threadId) {
		return this.threadStatusRevisions.has(threadId);
	}
	observeRevision(threadId) {
		const revision = this.threadStatusRevisions.get(threadId);
		if (revision) revision.value += 1;
	}
	isTerminalRevision(threadId) {
		return this.threadStatusRevisions.get(threadId)?.terminal === true;
	}
	markTerminalRevision(threadId) {
		const revision = this.threadStatusRevisions.get(threadId);
		if (revision) revision.terminal = true;
	}
	seedRevision(threadId, parentThreadId) {
		this.threadStatusRevisions.set(threadId, this.threadStatusRevisions.get(threadId) ?? {
			value: 0,
			readers: 0,
			parentThreadId
		});
	}
	async reconcileRegisteredChild(childState) {
		if (childState.terminal || this.dependencies.isDisposed() || !this.dependencies.isRegisteredChild(childState)) return false;
		if (childState.recoveryInFlight) return await childState.recoveryInFlight;
		const recovery = this.dependencies.reconcileChildState(childState);
		childState.recoveryInFlight = recovery;
		try {
			return await recovery;
		} finally {
			if (childState.recoveryInFlight === recovery) childState.recoveryInFlight = void 0;
		}
	}
	clearTerminalRevisionsForParent(parentThreadId) {
		for (const [threadId, revision] of this.threadStatusRevisions) if (revision.parentThreadId === parentThreadId) this.collectThreadStatusRevision(threadId, revision);
	}
	collectThreadStatusRevision(threadId, revision = this.threadStatusRevisions.get(threadId)) {
		if (!revision || revision.readers > 0 || Boolean(this.dependencies.currentChild(threadId))) return;
		if ((revision.parentThreadId ? this.dependencies.parentState(revision.parentThreadId) : void 0)?.owners.size) return;
		if (this.threadStatusRevisions.get(threadId) === revision) this.threadStatusRevisions.delete(threadId);
	}
	scheduleRecoveryPoll(childState) {
		if (childState.terminal || childState.settledWithoutCompletion || childState.recoveryTimer || this.dependencies.isDisposed() || this.recoveryPollDelaysMs.length === 0) return;
		const delayMs = delayForAttempt(this.recoveryPollDelaysMs, childState.recoveryAttempt++);
		childState.recoveryTimer = setTimeout(() => {
			childState.recoveryTimer = void 0;
			this.reconcileRegisteredChild(childState).catch((error) => {
				logRecoveryFailure(childState.childThreadId, error);
				return false;
			}).then(async (reconciled) => {
				if (reconciled || !this.dependencies.isRegisteredChild(childState)) return;
				const fallback = childState.fallbackCompletion;
				const state = this.dependencies.parentState(childState.parentThreadId);
				if (fallback && state && childState.recoveryAttempt >= 2) {
					await this.dependencies.processCompletion(state, childState, fallback, fallback.completedAt ?? Date.now());
					return;
				}
				this.scheduleRecoveryPoll(childState);
			});
		}, delayMs);
		childState.recoveryTimer.unref();
	}
	setRecoveryFallback(childState, completion, eventAt) {
		if (childState.terminal) return;
		const current = childState.fallbackCompletion;
		if (current?.status === completion.status && current.statusLabel === completion.statusLabel && current.result === completion.result) return;
		this.clearRecoveryTimers(childState);
		childState.recoveryAttempt = 0;
		childState.fallbackCompletion = {
			...completion,
			completedAt: eventAt
		};
		this.scheduleRecoveryPoll(childState);
	}
	clearSystemErrorFallback(childState) {
		if (childState.fallbackCompletion?.statusLabel !== "system_error") return;
		childState.fallbackCompletion = void 0;
	}
	retainThreadStatusRevision(threadId) {
		const revision = this.threadStatusRevisions.get(threadId) ?? {
			value: 0,
			readers: 0
		};
		this.threadStatusRevisions.set(threadId, revision);
		revision.readers += 1;
		const capturedValue = revision.value;
		let retained = true;
		return {
			isCurrent: () => this.threadStatusRevisions.get(threadId) === revision && revision.value === capturedValue,
			release: () => {
				if (!retained) return;
				retained = false;
				revision.readers -= 1;
				this.collectThreadStatusRevision(threadId, revision);
			}
		};
	}
	clearRecoveryTimers(childState) {
		if (childState.recoveryTimer) {
			clearTimeout(childState.recoveryTimer);
			childState.recoveryTimer = void 0;
		}
	}
};
function logRecoveryFailure(childThreadId, error) {
	embeddedAgentLog.debug("Codex native subagent history is not ready", {
		childThreadId,
		error: formatErrorMessage$1(error)
	});
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-close-owner.ts
var CodexNativeSubagentCloseOwner = class {
	constructor(client, callbacks) {
		this.client = client;
		this.callbacks = callbacks;
		this.calls = /* @__PURE__ */ new WeakMap();
	}
	bind(state, turnId) {
		this.prune(state);
		for (const [key, call] of this.calls.get(state) ?? []) if (call.completionObserved && call.turnId === turnId) this.completeChildClose(state, key, call).catch((error) => logRecoveryFailure(state.parentThreadId, error));
	}
	clear(state) {
		this.calls.delete(state);
	}
	hasPending(state) {
		return [...this.calls.get(state)?.values() ?? []].some((call) => call.completing && !call.settled);
	}
	settlements(state) {
		return [...this.calls.get(state)?.values() ?? []].flatMap((call) => call.settlement ? [call.settlement] : []);
	}
	async observe(notification, state) {
		const params = isJsonObject(notification.params) ? notification.params : void 0;
		const item = isJsonObject(params?.item) ? params.item : void 0;
		const turnId = readStringField(params, "turnId");
		const itemId = readStringField(item, "id");
		const senderThreadId = readStringField(item, "senderThreadId");
		if (!turnId || !itemId || readStringField(params, "threadId") !== state.parentThreadId || senderThreadId !== void 0 && senderThreadId !== state.parentThreadId || this.callbacks.isParentRetired(state)) return;
		let calls = this.calls.get(state);
		if (!calls) {
			calls = /* @__PURE__ */ new Map();
			this.calls.set(state, calls);
		}
		const key = `${turnId}\0${itemId}`;
		const childThreadIds = new Set(readNativeSubagentThreadIds(item?.receiverThreadIds));
		if (notification.method === "item/started") {
			if (calls.has(key)) return;
			const owners = new Set([...state.owners.values()].filter((owner) => !owner.turnId || owner.turnId === turnId));
			if (owners.size === 0) return;
			const targets = [];
			for (const childThreadId of childThreadIds) {
				const known = this.callbacks.knownChild(childThreadId);
				if (known?.parent !== state || known.pendingTurns.length > 0) continue;
				targets.push({
					childThreadId,
					runId: known.assignment.runId,
					nativeTurnId: known.turnId,
					childState: this.callbacks.currentChild(childThreadId),
					forget: this.callbacks.captureForget?.(childThreadId).catch((error) => {
						logRecoveryFailure(childThreadId, error);
					})
				});
			}
			calls.set(key, {
				turnId,
				owners,
				targets
			});
			return;
		}
		const call = calls.get(key);
		if (!call || call.targets.some((target) => !childThreadIds.has(target.childThreadId)) || childThreadIds.size !== call.targets.length) return;
		call.completionObserved = true;
		await this.completeChildClose(state, key, call);
	}
	prune(state) {
		const calls = this.calls.get(state);
		if (!calls) return;
		for (const [key, call] of calls) {
			if (call.completing && !call.settled) continue;
			if (![...state.owners.values()].some((owner) => call.owners.has(owner) && (!owner.turnId || owner.turnId === call.turnId))) calls.delete(key);
		}
	}
	async retireChild(state, childState, releaseSubscription) {
		const known = this.callbacks.knownChild(childState.childThreadId);
		if (!this.callbacks.isRegisteredChild(childState) || childState.parentThreadId !== state.parentThreadId || !this.callbacks.isParentRetired(state) && (!this.callbacks.isParentCurrent(state) || this.callbacks.currentChild(childState.childThreadId) !== childState || known?.parent !== state || known.assignment.runId !== childState.runId)) return;
		if (childState.pendingCompletion && !this.callbacks.isParentRetired(state)) {
			childState.subscriptionClosed = true;
			this.callbacks.releaseDirectChild(childState);
			this.callbacks.clearRecoveryTimers(childState);
			releaseSubscription?.();
			this.callbacks.releaseClientRetentionIfIdle();
			return;
		}
		if (!childState.terminal) {
			childState.terminal = true;
			if (known?.parent === state && known.assignment.runId === childState.runId) {
				known.assignment.terminal = true;
				known.assignment.nativeTurnId = childState.nativeTurnId;
			}
			this.callbacks.markTerminalRevision(childState.childThreadId);
		}
		if (childState.pendingCompletion) childState.pendingCompletion = void 0;
		childState.subscriptionClosed = true;
		this.callbacks.unregisterChild(childState);
		releaseSubscription?.();
	}
	retireReceiver(receiver, releaseSubscription) {
		const threadId = receiver.assignment.childThreadId;
		if (this.callbacks.isParentRetired(receiver.parent) && this.callbacks.knownChild(threadId) === receiver && !this.callbacks.currentChild(threadId)) releaseSubscription();
	}
	completeChildClose(state, key, call) {
		if (call.settlement) return call.settlement;
		const settlement = this.confirmChildClose(state, key, call);
		if (call.completing) call.settlement = settlement;
		return settlement;
	}
	async confirmChildClose(state, key, call) {
		const isCurrent = () => this.callbacks.isParentCurrent(state) && this.calls.get(state)?.get(key) === call;
		const isTargetCurrent = (target) => {
			const known = this.callbacks.knownChild(target.childThreadId);
			const childState = this.callbacks.currentChild(target.childThreadId);
			return known?.parent === state && known.assignment.runId === target.runId && known.turnId === target.nativeTurnId && known.pendingTurns.length === 0 && (childState === void 0 || childState === target.childState);
		};
		if (call.completing || !isCurrent() || ![...state.owners.values()].some((owner) => call.owners.has(owner) && owner.turnId === call.turnId)) return;
		call.completing = true;
		let settled = false;
		let retiring = false;
		try {
			const forgetters = await Promise.all(call.targets.map((target) => Promise.resolve(target.forget)));
			if (!isCurrent()) return;
			const loaded = await this.client.request("thread/loaded/list", {}, { timeoutMs: 1e4 });
			if (!isCurrent()) return;
			if (!isJsonObject(loaded) || loaded.nextCursor !== null || !Array.isArray(loaded.data) || !loaded.data.every((id) => typeof id === "string" && id.trim() !== "")) {
				settled = true;
				return;
			}
			for (const [index, target] of call.targets.entries()) {
				const childState = this.callbacks.currentChild(target.childThreadId);
				if (loaded.data.includes(target.childThreadId) || !isTargetCurrent(target)) continue;
				const forget = forgetters[index];
				if (childState) {
					retiring = true;
					await this.retireChild(state, childState, forget);
					if (!isCurrent()) return;
				} else forget?.();
			}
			settled = true;
		} catch (error) {
			embeddedAgentLog.warn("Failed to confirm Codex native subagent close", {
				parentThreadId: state.parentThreadId,
				error: formatErrorMessage$1(error)
			});
			if (retiring) throw error;
			settled = true;
		} finally {
			if (settled || !isCurrent()) call.settled = true;
			else {
				call.completing = void 0;
				call.settlement = void 0;
			}
			if (call.settled && this.calls.get(state)?.get(key) === call) call.targets = [];
			this.prune(state);
			this.callbacks.pruneParent(state);
		}
	}
};
function isCodexNativeSubagentCloseNotification(notification) {
	if (notification.method !== "item/started" && notification.method !== "item/completed") return false;
	const params = isJsonObject(notification.params) ? notification.params : void 0;
	const item = isJsonObject(params?.item) ? params.item : void 0;
	return readStringField(item, "type") === "collabAgentToolCall" && normalizeIdentifier(readStringField(item, "tool")) === "closeagent";
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-completion-delivery.ts
const DEFAULT_COMPLETION_DELIVERY_RETRY_DELAYS_MS = [
	5e3,
	15e3,
	3e4,
	6e4,
	12e4,
	3e5
];
const completionDeliveryOwners = /* @__PURE__ */ new Map();
var CodexNativeSubagentCompletionDelivery = class {
	constructor(dependencies) {
		this.dependencies = dependencies;
		this.attempts = /* @__PURE__ */ new Map();
		this.retryDelaysMs = dependencies.retryDelaysMs ?? DEFAULT_COMPLETION_DELIVERY_RETRY_DELAYS_MS;
		this.maxRetries = dependencies.maxRetries ?? this.retryDelaysMs.length;
	}
	deliverPending(state, childState) {
		const existing = this.attempts.get(childState);
		if (existing) return existing;
		const attempt = this.deliverAttempt(state, childState);
		this.attempts.set(childState, attempt);
		const release = () => {
			if (this.attempts.get(childState) === attempt) this.attempts.delete(childState);
		};
		attempt.then(release, release);
		return attempt;
	}
	async deliverAttempt(state, childState) {
		const completion = childState.pendingCompletion;
		if (!completion || !this.isCurrent(state, childState)) return;
		if (childState.deliveringCompletion || childState.completionDeliveryTimer) return;
		childState.deliveringCompletion = true;
		let deferredToForeground = false;
		try {
			if (!this.prepareDelivery(state, childState)) return;
			if (state.owners.size > 0 || !state.completionScope) {
				deferredToForeground = state.owners.size > 0;
				return;
			}
			const historyOwner = childState.historyOwner;
			const delivery = await this.dependencies.deliver({
				scope: state.completionScope,
				completionCustody: childState.completionCustody,
				...historyOwner ? { expectedRequester: {
					sessionId: historyOwner.sessionId,
					lifecycleRevision: historyOwner.lifecycleRevision
				} } : {},
				isSourceSessionAdmissionAllowed: () => this.isCurrent(state, childState) && this.claim(state, childState),
				childSessionKey: childState.runId,
				childSessionId: completion.childThreadId,
				announceId: `codex-native:${childState.nativeParentThreadId}:${readCodexNativeSubagentRunId(childState.runId)?.turnId ? childState.runId : completion.childThreadId}:${completion.status}`,
				announceType: "Subagent",
				taskLabel: "Subagent",
				status: completion.status,
				statusLabel: completion.statusLabel,
				result: completion.result,
				replyInstruction: "Use the Codex native subagent result to continue or wrap up the parent task. If this is a Discord/channel session, send the visible response with the message tool instead of only writing a transcript final answer. Reply in your normal assistant voice and do not expose internal notification markup."
			});
			if (!this.isCurrent(state, childState)) return;
			if (isDurableAgentHarnessCompletionDelivery(delivery)) childState.nativeCompletionDelivered = true;
			if (childState.nativeCompletionDelivered) {
				this.prepareDelivery(state, childState);
				return;
			}
			if (!this.claim(state, childState) || delivery.recoveryBlocked) {
				this.dependencies.unregisterChild(childState);
				return;
			}
			if (delivery.recoveryPending) {
				this.scheduleRetry(childState, delivery.error ?? "requester recovery owns completion", false);
				return;
			}
			const error = delivery.error ?? "completion delivery did not produce a parent response";
			this.scheduleRetry(childState, error);
		} catch (error) {
			if (!this.isCurrent(state, childState)) return;
			if (!this.claim(state, childState)) {
				this.dependencies.unregisterChild(childState);
				return;
			}
			const message = formatErrorMessage$1(error);
			this.scheduleRetry(childState, message);
			embeddedAgentLog.warn("Failed to deliver Codex native subagent completion", {
				parentThreadId: state.parentThreadId,
				childThreadId: completion.childThreadId,
				error: message
			});
		} finally {
			if (!deferredToForeground) childState.completionCustody?.settleExecution();
			childState.deliveringCompletion = false;
		}
	}
	finish(state, child) {
		if (child.completionDeliveryTimer) {
			clearTimeout(child.completionDeliveryTimer);
			child.completionDeliveryTimer = void 0;
		}
		this.deliverPending(state, child);
	}
	applyReceipts(state, runIds, children) {
		for (const runId of runIds) {
			const child = children.get(runId);
			const deliveryParent = child && this.dependencies.getParent(child.parentThreadId);
			if (!child || !deliveryParent || !this.isCurrent(state, child) || !this.dependencies.isCurrentParent(deliveryParent) || this.dependencies.isRetiredParent(deliveryParent)) continue;
			if (deliveryParent !== state) {
				if (!state.requesterSessionKey?.trim() || state.requesterSessionKey !== deliveryParent.requesterSessionKey) continue;
				try {
					assertHistoryOwnerMatchesRegistration(child.historyOwner, state.historyOwner, child.nativeParentThreadId, true);
				} catch {
					continue;
				}
				if (!this.claim(deliveryParent, child)) continue;
			}
			child.nativeCompletionDelivered = true;
			if (child.pendingCompletion && !child.deliveringCompletion) this.finish(deliveryParent, child);
		}
	}
	deliverDetached(state, children) {
		for (const child of children) if (child.parentThreadId === state.parentThreadId && child.pendingCompletion) this.deliverPending(state, child);
	}
	release(childState) {
		childState.completionCustody?.release();
		if (childState.completionDeliveryTimer) clearTimeout(childState.completionDeliveryTimer);
		const deliveryOwnerKey = childState.deliveryOwnerKey;
		if (deliveryOwnerKey && completionDeliveryOwners.get(deliveryOwnerKey) === childState) completionDeliveryOwners.delete(deliveryOwnerKey);
		childState.deliveryOwnerKey = void 0;
	}
	isCurrent(state, child) {
		return this.dependencies.isCurrentChild(child) && this.dependencies.isCurrentParent(state) && !this.dependencies.isRetiredParent(state);
	}
	prepareDelivery(state, child) {
		if (!child.pendingCompletion) return false;
		if (!this.claim(state, child) || !state.requesterSessionKey || !state.completionScope) {
			this.dependencies.unregisterChild(child);
			return false;
		}
		if (child.nativeCompletionDelivered) {
			child.pendingCompletion = void 0;
			this.dependencies.unregisterChild(child);
			return false;
		}
		this.dependencies.releaseClientRetentionIfIdle();
		return true;
	}
	scheduleRetry(childState, error, chargeAttempt = true) {
		if (!childState.pendingCompletion || childState.completionDeliveryTimer || !this.dependencies.isCurrentChild(childState)) return;
		if (chargeAttempt && childState.completionDeliveryAttempt >= this.maxRetries) {
			embeddedAgentLog.warn("Native subagent completion retries exhausted", {
				childThreadId: childState.childThreadId,
				error
			});
			this.dependencies.unregisterChild(childState);
			return;
		}
		const delayMs = delayForAttempt(this.retryDelaysMs, chargeAttempt ? childState.completionDeliveryAttempt++ : childState.completionDeliveryAttempt);
		childState.completionDeliveryTimer = setTimeout(() => {
			childState.completionDeliveryTimer = void 0;
			if (!this.dependencies.isCurrentChild(childState)) return;
			const state = this.dependencies.getParent(childState.parentThreadId);
			if (state) this.deliverPending(state, childState);
		}, delayMs);
		childState.completionDeliveryTimer.unref();
	}
	claim(state, childState) {
		if (childState.completionCustody && !childState.completionCustody.isCurrent()) return false;
		const requesterSessionKey = state.requesterSessionKey?.trim();
		if (!requesterSessionKey) return true;
		const key = `${requesterSessionKey}\0${childState.runId}`;
		try {
			state.assignmentStore?.assertCurrent();
			assertHistoryOwnerMatchesRegistration(childState.historyOwner, state.historyOwner, childState.nativeParentThreadId, state.historyOwner !== void 0);
		} catch (error) {
			embeddedAgentLog.warn("Holding native completion with unresolved history owner", {
				childThreadId: childState.childThreadId,
				error: formatErrorMessage$1(error)
			});
			return false;
		}
		const owner = completionDeliveryOwners.get(key);
		if (owner) return owner === childState;
		completionDeliveryOwners.set(key, childState);
		childState.deliveryOwnerKey = key;
		return true;
	}
};
//#endregion
//#region extensions/codex/src/app-server/native-subagent-notification.ts
const NATIVE_SUBAGENT_NOTIFICATION_METHODS = /* @__PURE__ */ new Set([
	"thread/started",
	"thread/closed",
	"thread/status/changed",
	"turn/started",
	"turn/completed",
	"item/agentMessage/delta",
	"item/reasoning/summaryTextDelta",
	"item/started",
	"item/completed",
	"rawResponseItem/completed"
]);
const RECOVERY_REVISION_NOTIFICATION_METHODS = /* @__PURE__ */ new Set([
	"thread/started",
	"thread/status/changed",
	"turn/started",
	"turn/completed"
]);
const CODEX_SUBAGENT_NOTIFICATION_START = "<subagent_notification>";
const CODEX_SUBAGENT_NOTIFICATION_END = "</subagent_notification>";
function extractCodexNativeSubagentCompletions(notification) {
	const params = isJsonObject(notification.params) ? notification.params : void 0;
	const item = isJsonObject(params?.item) ? params.item : void 0;
	if (!item || notification.method !== "rawResponseItem/completed" || item.role !== "user") return [];
	const content = item.content;
	const metadata = item.internal_chat_message_metadata_passthrough;
	const kinds = isJsonObject(metadata) ? metadata.content_item_kinds : void 0;
	if (item.type !== "message" || !Array.isArray(content) || !Array.isArray(kinds) || content.length !== kinds.length) return [];
	return content.flatMap((entry, index) => {
		if (kinds[index] !== "multi_agent.subagent_notification" || !isJsonObject(entry) || entry.type !== "input_text") return [];
		const text = readStringField(entry, "text")?.trim();
		if (!text?.startsWith(CODEX_SUBAGENT_NOTIFICATION_START) || !text.endsWith(CODEX_SUBAGENT_NOTIFICATION_END)) return [];
		const completion = parseCodexNativeSubagentNotificationBody(text.slice(23, -24));
		return completion ? [completion] : [];
	});
}
const codexNativeSubagentNotifications = {
	fromNotification: extractCodexNativeSubagentCompletions,
	deliveredAgentPaths: readDeliveredNativeCompletionPaths
};
/** Reads native delivery receipts, leaving status and result ownership with the child lifecycle. */
function readDeliveredNativeCompletionPaths(notification) {
	const params = isJsonObject(notification.params) ? notification.params : void 0;
	const item = isJsonObject(params?.item) ? params.item : void 0;
	if (notification.method === "item/completed" && item?.type === "collabAgentToolCall" && item.tool === "wait" && (item.status === "completed" || item.status === "failed") && item.senderThreadId === params?.threadId && Array.isArray(item.receiverThreadIds) && isJsonObject(item.agentsStates)) {
		const receivers = new Set(item.receiverThreadIds);
		return Object.entries(item.agentsStates).flatMap(([threadId, state]) => receivers.has(threadId) && isJsonObject(state) && [
			"completed",
			"errored",
			"shutdown",
			"notFound"
		].includes(readStringField(state, "status") ?? "") ? [threadId] : []);
	}
	if (notification.method !== "rawResponseItem/completed") return [];
	if (!item || readStringField(item, "type") !== "agent_message") return extractCodexNativeSubagentCompletions(notification).map((completion) => completion.agentPath);
	const author = readStringField(item, "author");
	const recipient = readStringField(item, "recipient");
	const content = item.content;
	if (!author || !recipient || !Array.isArray(content) || content.length !== 1) return [];
	const part = content[0];
	if (!isJsonObject(part) || readStringField(part, "type") !== "input_text") return [];
	return readStringField(part, "text")?.startsWith(`Message Type: FINAL_ANSWER\nTask name: ${recipient}\nSender: ${author}\nPayload:\n`) ? [author] : [];
}
function parseCodexNativeSubagentNotificationBody(body) {
	let payload;
	try {
		payload = JSON.parse(body.trim());
	} catch {
		return;
	}
	if (!isJsonObject(payload)) return;
	const agentPath = readStringField(payload, "agent_path")?.trim();
	const completion = readCompletionStatus(payload.status);
	return agentPath && completion ? {
		agentPath,
		...completion
	} : void 0;
}
function readCompletionStatus(status) {
	if (status === "shutdown" || status === "not_found") return {
		status: status === "shutdown" ? "cancelled" : "failed",
		statusLabel: status,
		result: "(no output)"
	};
	if (!isJsonObject(status)) return;
	const completed = status.completed;
	if (completed === null || typeof completed === "string") {
		const result = completed?.trim();
		return {
			status: "succeeded",
			statusLabel: result ? "completed" : "completed_without_final_message",
			result: result || "Subagent completed without a final assistant message."
		};
	}
	const error = readStringField(status, "errored");
	return error === void 0 ? void 0 : {
		status: "failed",
		statusLabel: "errored",
		result: error.trim() || "(no output)"
	};
}
function isNoFinalCompletion(completion) {
	return completion.status === "succeeded" && completion.statusLabel === "completed_without_final_message";
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-delivery-receipts.ts
function buildCodexNativeSubagentAgentPathKey(parentThreadId, agentPath) {
	return `${parentThreadId}\0${agentPath}`;
}
function registerCodexNativeSubagentReceiptAlias(params) {
	const { state, childThreadId, agentPath, known, aliases } = params;
	if (known?.parent !== state) return [];
	const key = buildCodexNativeSubagentAgentPathKey(state.parentThreadId, agentPath);
	const existingChild = aliases.get(key);
	if (existingChild && existingChild !== childThreadId) {
		embeddedAgentLog.warn("Ignoring conflicting Codex native subagent agent path", {
			parentThreadId: state.parentThreadId,
			agentPath,
			existingChildThreadId: existingChild,
			attemptedChildThreadId: childThreadId
		});
		return [];
	}
	aliases.set(key, childThreadId);
	known.agentPaths.add(agentPath);
	return known.deliveryReceipts.addAlias(childThreadId, agentPath);
}
/** Correlates native receipts with immutable assignments while a parent is registered. */
var CodexNativeSubagentDeliveryReceipts = class {
	constructor() {
		this.seen = /* @__PURE__ */ new Set();
		this.pending = [];
		this.outcomes = /* @__PURE__ */ new Map();
	}
	observe(notification) {
		const params = isJsonObject(notification.params) ? notification.params : void 0;
		const item = isJsonObject(params?.item) ? params.item : void 0;
		if (!item) return [];
		const nativeResults = codexNativeSubagentNotifications.fromNotification(notification);
		for (const agentPath of codexNativeSubagentNotifications.deliveredAgentPaths(notification)) {
			const id = `${notification.method}:${readStringField(item, "id") ?? JSON.stringify(item)}:${agentPath}`;
			if (this.seen.has(id)) continue;
			this.seen.add(id);
			let result = nativeResults.find((value) => value.agentPath === agentPath)?.result;
			if (item.type === "agent_message" && Array.isArray(item.content)) {
				const part = item.content[0];
				result = (isJsonObject(part) ? readStringField(part, "text") : void 0)?.split("\nPayload:\n").slice(1).join("\nPayload:\n");
			} else if (isJsonObject(item.agentsStates)) {
				const child = item.agentsStates[agentPath];
				result = isJsonObject(child) ? readStringField(child, "message") : result;
			}
			this.pending.push({
				agentPath,
				result: receiptResultKey(result)
			});
		}
		return this.match();
	}
	record(runId, paths, result) {
		const outcome = this.getOutcome(runId, paths);
		outcome.result = receiptResultKey(result);
		this.outcomes.set(runId, outcome);
		return this.track(runId, []);
	}
	track(runId, paths) {
		const outcome = this.getOutcome(runId);
		for (const path of paths) outcome.paths.add(path);
		this.outcomes.set(runId, outcome);
		const matched = this.match();
		return outcome.received ? [.../* @__PURE__ */ new Set([...matched, runId])] : matched;
	}
	resumeAssignment(runId, pendingRunIds) {
		for (const pendingRunId of pendingRunIds) this.outcomes.delete(pendingRunId);
		return this.track(runId, []);
	}
	addAlias(threadId, agentPath) {
		for (const outcome of this.outcomes.values()) if (outcome.paths.has(threadId)) outcome.paths.add(agentPath);
		return this.match();
	}
	getOutcome(runId, paths = []) {
		return this.outcomes.get(runId) ?? {
			paths: new Set(paths),
			received: false,
			receiptResults: /* @__PURE__ */ new Set()
		};
	}
	match() {
		const received = [];
		for (let index = 0; index < this.pending.length;) {
			const receipt = this.pending[index];
			const matches = [...this.outcomes].filter(([, outcome]) => outcome.paths.has(receipt.agentPath));
			let match;
			for (const candidate of matches) {
				const outcome = candidate[1];
				if (outcome.result !== void 0 && outcome.result === receipt.result || outcome.receiptResults.has(receipt.result)) {
					match = candidate;
					break;
				}
				if (outcome.result === void 0) {
					match = matches.length === 1 ? candidate : void 0;
					break;
				}
			}
			if (!match) {
				index += 1;
				continue;
			}
			match[1].receiptResults.add(receipt.result);
			if (!match[1].received) {
				match[1].received = true;
				received.push(match[0]);
			}
			this.pending.splice(index, 1);
		}
		return received;
	}
};
function observeCodexNativeSubagentDeliveryReceipts(params) {
	const { state, notification, knownChildren, applyReceipts } = params;
	const trackers = /* @__PURE__ */ new Set([state.deliveryReceipts]);
	for (const known of knownChildren) if (known.parent === state) trackers.add(known.deliveryReceipts);
	for (const tracker of trackers) applyReceipts(tracker.observe(notification));
}
function receiptResultKey(result) {
	return result?.replace(/\s+/g, " ").trim();
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-history-recovery.ts
const THREAD_READ_TIMEOUT_MS = 3e4;
var CodexNativeSubagentHistoryRecovery = class {
	constructor(client, queries) {
		this.client = client;
		this.queries = queries;
	}
	requestThreadRead(childThreadId, includeTurns) {
		return this.client.request("thread/read", {
			threadId: childThreadId,
			includeTurns
		}, { timeoutMs: THREAD_READ_TIMEOUT_MS });
	}
	requestLatestThreadTurn(childThreadId) {
		return this.client.request("thread/turns/list", {
			threadId: childThreadId,
			limit: 1,
			sortDirection: "desc",
			itemsView: "full"
		}, { timeoutMs: THREAD_READ_TIMEOUT_MS });
	}
	async read(assignment, options) {
		const { childThreadId } = assignment;
		const { recordedCompletion } = options;
		const response = await this.requestThreadRead(childThreadId, true).catch(() => this.requestThreadRead(childThreadId, false));
		const thread = isJsonObject(response.thread) ? response.thread : void 0;
		if (!thread || readStringField(thread, "id")?.trim() !== childThreadId) return {
			resumable: false,
			threadState: "unavailable",
			observedPendingTurns: []
		};
		const rawTurns = Array.isArray(thread.turns) ? thread.turns : [];
		if (options.predecessorNativeTurnId) {
			const turns = rawTurns.filter(isJsonObject);
			const predecessor = turns.findIndex((turn) => readStringField(turn, "id") === options.predecessorNativeTurnId);
			const target = turns.findIndex((turn) => readStringField(turn, "id") === assignment.nativeTurnId);
			if (predecessor < 0 || target <= predecessor || !["completed", "failed"].includes(readStringField(turns[predecessor], "status") ?? "")) return {
				resumable: false,
				threadState: "unavailable",
				observedPendingTurns: []
			};
		}
		let initialTurnId;
		if (options.initialAssignment && !assignment.nativeTurnId && !recordedCompletion) {
			initialTurnId = readStringField(thread, "forkedFromId") ? void 0 : readStringField(rawTurns.find((turn) => readStringField(turn, "id")), "id");
			if (!initialTurnId) return {
				parentThreadId: readThreadParentThreadId(thread),
				resumable: false,
				threadState: "unavailable",
				observedPendingTurns: []
			};
		}
		const turnId = assignment.nativeTurnId ?? initialTurnId;
		const pendingTurnIds = new Set(this.queries.getPendingTurnIds(childThreadId));
		const unresolvedAssignment = options.resumeInterrupted && !turnId && pendingTurnIds.size > 0;
		const observedPendingTurns = [];
		for (const turn of rawTurns) {
			const pendingTurnId = readStringField(turn, "id");
			if (pendingTurnId && pendingTurnIds.has(pendingTurnId)) observedPendingTurns.push({
				turnId: pendingTurnId,
				state: readNativeTurnState(turn)
			});
		}
		const threadStatus = isJsonObject(thread.status) ? normalizeIdentifier(readStringField(thread.status, "type")) : void 0;
		let completion;
		let fallbackCompletion;
		let nativeTurnId;
		let nativeTurnState;
		let resumable = false;
		let threadState = threadStatus === "active" ? "active" : threadStatus === "systemerror" ? "system_error" : threadStatus ? "other" : "unavailable";
		if (unresolvedAssignment) threadState = "unavailable";
		else if (turnId) {
			const turns = rawTurns.filter(isJsonObject);
			let index = turns.findIndex((turn) => readStringField(turn, "id") === turnId);
			while (options.resumeInterrupted && index >= 0 && index + 1 < turns.length && normalizeIdentifier(readStringField(turns[index], "status")) === "interrupted") index += 1;
			const turn = turns[index];
			const turnStatus = normalizeIdentifier(readStringField(turn, "status"));
			nativeTurnId = readStringField(turn, "id");
			nativeTurnState = readNativeTurnState(turn);
			completion = isJsonObject(turn) ? readTurnCompletion(turn, childThreadId) : void 0;
			resumable = turnStatus === "interrupted";
			threadState = turnStatus === "inprogress" ? "active" : turnStatus ? "other" : "unavailable";
		} else if (threadStatus === "active") {
			const turn = rawTurns.at(-1);
			if (normalizeIdentifier(readStringField(turn, "status")) === "inprogress") {
				nativeTurnId = readStringField(turn, "id");
				nativeTurnState = "active";
			}
		} else if (threadStatus !== "systemerror") {
			const turnRecovery = readThreadTurnRecovery(thread, childThreadId);
			nativeTurnId = turnRecovery.nativeTurnId;
			nativeTurnState = turnRecovery.nativeTurnState;
			completion = turnRecovery.completion;
			resumable = turnRecovery.resumable;
		}
		if (!unresolvedAssignment && threadStatus === "systemerror" && (!turnId || threadState === "unavailable" && !completion)) {
			const turnsResponse = await this.requestLatestThreadTurn(childThreadId).catch(() => void 0);
			const data = isJsonObject(turnsResponse) && Array.isArray(turnsResponse.data) ? turnsResponse.data : [];
			const latestTurn = isJsonObject(data[0]) ? data[0] : void 0;
			const latestTurnId = readStringField(latestTurn, "id");
			if (latestTurnId && pendingTurnIds.has(latestTurnId)) observedPendingTurns.push({
				turnId: latestTurnId,
				state: readNativeTurnState(latestTurn)
			});
			const latestTurnStatus = normalizeIdentifier(readStringField(latestTurn, "status"));
			const matchesAssignment = !turnId || readStringField(latestTurn, "id") === turnId;
			if (latestTurn && matchesAssignment) {
				if (turnId) {
					const turnRecovery = readThreadTurnRecovery({ turns: [latestTurn] }, childThreadId);
					nativeTurnId = turnRecovery.nativeTurnId;
					nativeTurnState = turnRecovery.nativeTurnState;
					completion = turnRecovery.completion;
					resumable = turnRecovery.resumable;
				} else if (latestTurnStatus === "failed") completion = readTurnCompletion(latestTurn, childThreadId);
			}
			const current = !latestTurn ? this.queries.getCurrentAssignmentState(childThreadId) : void 0;
			const unresolvedCurrentAssignment = current?.runId === assignment.runId && current?.nativeTurnState !== "completed";
			if (latestTurnStatus === "inprogress" && matchesAssignment) {
				nativeTurnId = readStringField(latestTurn, "id");
				nativeTurnState = "active";
				threadState = "active";
			} else if (!completion && !resumable && latestTurnStatus !== "inprogress" && (!turnId || !latestTurn && unresolvedCurrentAssignment)) fallbackCompletion = systemErrorFallbackCompletion(childThreadId);
		}
		if (recordedCompletion && (!turnId || !completion || completion.status !== recordedCompletion.status)) {
			completion = recordedCompletion;
			if (!turnId) {
				nativeTurnId = void 0;
				nativeTurnState = void 0;
			}
			fallbackCompletion = void 0;
			resumable = false;
			threadState = "other";
		}
		return {
			parentThreadId: readThreadParentThreadId(thread),
			agentPath: normalizeOptionalString(readStringField(readThreadSpawnSource(thread), "agent_path")),
			nativeTurnId,
			nativeTurnState,
			observedPendingTurns,
			completion,
			fallbackCompletion,
			resumable,
			threadState
		};
	}
};
function readThreadTurnRecovery(thread, childThreadId) {
	const turn = (Array.isArray(thread.turns) ? thread.turns : []).findLast(isJsonObject);
	return turn ? {
		nativeTurnId: readStringField(turn, "id"),
		nativeTurnState: readNativeTurnState(turn),
		completion: readTurnCompletion(turn, childThreadId),
		resumable: normalizeIdentifier(readStringField(turn, "status")) === "interrupted"
	} : { resumable: false };
}
function readNativeTurnEnd(turn) {
	const status = normalizeIdentifier(readStringField(turn, "status"));
	return status === "completed" || status === "failed" || status === "interrupted" ? status : void 0;
}
function readNativeTurnState(turn) {
	return normalizeIdentifier(readStringField(turn, "status")) === "inprogress" ? "active" : readNativeTurnEnd(turn);
}
function readTurnErrorMessage(turn) {
	const error = isJsonObject(turn.error) ? turn.error : void 0;
	return normalizeOptionalString(readStringField(error, "message")) ?? normalizeOptionalString(isJsonObject(error?.codexErrorInfo) ? readStringField(error.codexErrorInfo, "message") : void 0);
}
function systemErrorFallbackCompletion(childThreadId) {
	return {
		childThreadId,
		status: "failed",
		statusLabel: "system_error",
		result: "Subagent runtime reported a system error."
	};
}
function readTurnCompletion(turn, childThreadId, source = "history") {
	const status = normalizeIdentifier(readStringField(turn, "status"));
	if (status === "inprogress" || !status) return;
	const result = readLastAgentMessage(turn);
	const completedAtSeconds = asFiniteNumber(turn.completedAt);
	const timestamp = source === "history" ? { completedAt: completedAtSeconds === void 0 ? void 0 : Math.round(completedAtSeconds * 1e3) } : {};
	if (status === "completed") return {
		childThreadId,
		status: "succeeded",
		statusLabel: result ? source === "history" ? "task_complete" : "turn_completed" : "completed_without_final_message",
		result: result ?? "Subagent completed without a final assistant message.",
		...timestamp
	};
	if (status === "interrupted") return;
	if (status === "failed") return {
		childThreadId,
		status: "failed",
		statusLabel: source === "history" ? "task_failed" : "turn_failed",
		result: readTurnErrorMessage(turn) ?? (source === "history" ? result : void 0) ?? "Subagent failed.",
		...timestamp
	};
}
function readLastAgentMessage(turn) {
	const items = Array.isArray(turn.items) ? turn.items : [];
	let legacyResult;
	for (let index = items.length - 1; index >= 0; index -= 1) {
		const item = items[index];
		if (!isJsonObject(item)) continue;
		if (normalizeIdentifier(readStringField(item, "type")) !== "agentmessage") continue;
		const text = readStringField(item, "text")?.trim();
		if (!text) continue;
		const phase = normalizeIdentifier(readStringField(item, "phase"));
		if (phase === "finalanswer") return text;
		if (!phase) legacyResult ??= text;
	}
	return legacyResult;
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-model-input.ts
/** Equality joins input to one live source; it never grants another source's models. */
function assertNativeModelInputCompatible(sender, receiver) {
	const input = sender.modelSource?.capture();
	let target;
	try {
		target = receiver.modelSource?.capture();
		if (!input || !target || sender.modelExecutionCancelled || receiver.modelExecutionCancelled) throw new Error("Codex active input requires an admitted model source");
		input.assertCurrent();
		target.assertCurrent();
		if (!input.source && !target.source) return;
		const identity = input.source?.sourceIdentity;
		if (!identity || identity !== target.source?.sourceIdentity) throw new Error("Codex active input requires the same admitted model source");
		input.assertCurrent();
		target.assertCurrent();
	} finally {
		target?.release();
		input?.release();
	}
}
function nativeAgentPath(known) {
	const paths = [...known?.agentPaths ?? []].filter((path) => /^\/root(?:\/[a-z0-9_]+)*$/.test(path));
	return paths.length === 1 ? paths[0] : void 0;
}
function nativeRootThreadId(threadId, knownChildren) {
	const visited = /* @__PURE__ */ new Set();
	let current = threadId;
	let expectedPath;
	while (!visited.has(current)) {
		visited.add(current);
		const known = knownChildren.get(current);
		const path = nativeAgentPath(known);
		if (!known || !path || expectedPath && path !== expectedPath) return;
		if (path === "/root") return current;
		expectedPath = path.slice(0, path.lastIndexOf("/"));
		if (expectedPath === "/root") return known.nativeParentThreadId;
		current = known.nativeParentThreadId;
	}
}
function resolveInputTarget(request, dependencies) {
	const target = request.target.trim();
	if (dependencies.parents.has(target) || dependencies.knownChildren.has(target) || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(target)) return target;
	const childParentPaths = new Set([...dependencies.knownChildren.values()].filter((known) => known.nativeParentThreadId === request.threadId).flatMap((known) => {
		const path = nativeAgentPath(known);
		return path ? [path.slice(0, path.lastIndexOf("/"))] : [];
	}));
	const senderPath = nativeAgentPath(dependencies.knownChildren.get(request.threadId)) ?? (childParentPaths.size === 1 ? childParentPaths.values().next().value : void 0);
	const nativeRoot = nativeRootThreadId(request.threadId, dependencies.knownChildren) ?? (senderPath === "/root" ? request.threadId : void 0);
	if (!senderPath || !nativeRoot) throw new Error("Codex native target lineage is not currently identified; use its exact thread ID");
	const path = target.startsWith("/") ? target : `${senderPath}/${target}`;
	if (path === "/root") return nativeRoot;
	const matches = [...dependencies.knownChildren].filter(([threadId, known]) => known.agentPaths.has(path) && nativeRootThreadId(threadId, dependencies.knownChildren) === nativeRoot);
	if (matches.length !== 1) throw new Error("Codex native target is not currently identified; use its exact thread ID");
	return matches[0][0];
}
/** Qualification is read before the native handler; source custody remains with its existing call. */
async function prepareNativeModelToolInput(request, dependencies) {
	const state = dependencies.parents.get(request.threadId) ?? dependencies.knownChildren.get(request.threadId)?.parent;
	const owner = state && resolveNativeModelParentOwner(state, request.turnId, request.threadId, dependencies.children, dependencies.knownChildren);
	const capture = owner?.modelSource?.capture();
	if (!state || !owner || !capture || owner.modelExecutionSettled || owner.modelExecutionCancelled) {
		capture?.release();
		throw new Error("Codex native input requires its exact admitted sender turn");
	}
	let preparedSource;
	let captureTransferred = false;
	let pendingBinding;
	let targetRevision;
	let assertTargetCurrent;
	const assertCurrent = () => {
		request.signal?.throwIfAborted();
		request.assertCurrent();
		capture.assertCurrent();
		pendingBinding?.assertCurrent();
		assertTargetCurrent?.();
		if (!dependencies.isCurrent(state) || owner.modelExecutionSettled || owner.modelExecutionCancelled) throw new Error("Codex native input sender is no longer current");
	};
	try {
		assertCurrent();
		const targetThreadId = resolveInputTarget(request, dependencies);
		targetRevision = dependencies.retainTargetRevision(targetThreadId);
		const targetParent = dependencies.parents.get(targetThreadId);
		const targetChild = dependencies.knownChildren.get(targetThreadId);
		const targetConfiguration = targetChild?.configurationQualification;
		const targetRouting = request.readQualification(targetThreadId);
		assertTargetCurrent = () => {
			if (!targetRevision?.isCurrent() || dependencies.parents.get(targetThreadId) !== targetParent || dependencies.knownChildren.get(targetThreadId) !== targetChild || targetChild?.configurationQualification !== targetConfiguration || request.readQualification(targetThreadId) !== targetRouting) throw new Error("Codex native receiver changed during input preparation; retry with its current thread");
			targetConfiguration?.assertCurrent();
			targetRouting?.assertCurrent();
		};
		assertCurrent();
		const { thread } = await dependencies.client.request("thread/read", {
			threadId: targetThreadId,
			includeTurns: false
		}, {
			signal: request.signal && capture.source?.signal ? AbortSignal.any([request.signal, capture.source.signal]) : request.signal ?? capture.source?.signal,
			timeoutMs: 3e4,
			assertCurrent
		});
		assertCurrent();
		if (thread.id !== targetThreadId || !thread.modelProvider || resolveInputTarget(request, dependencies) !== targetThreadId) throw new Error("Codex native target returned a different thread or no provider");
		if (thread.status?.type !== "idle" && thread.status?.type !== "notLoaded" && !dependencies.currentModelExecution(targetThreadId)) throw new Error("Codex active input requires the receiver's exact admitted execution");
		const known = dependencies.knownChildren.get(targetThreadId);
		const configurationQualification = thread.status?.type === "notLoaded" ? owner.configurationQualification : !thread.status ? void 0 : dependencies.parents.has(targetThreadId) ? request.readQualification(targetThreadId) : known?.configurationQualification;
		configurationQualification?.assertCurrent();
		const qualified = configurationQualification?.hasProvider(thread.modelProvider) === true;
		const preparedOwner = {
			...owner,
			configurationQualification,
			nativeInputConfiguration: true,
			unqualifiedModelExecution: void 0,
			claimUnqualifiedModelBinding: void 0
		};
		if (!qualified && capture.source) {
			const source = capture.source;
			const binding = source.bindModelExecution?.(void 0);
			if (!binding) throw new Error("Codex native provider cannot be qualified for this model source");
			pendingBinding = binding;
			preparedOwner.unqualifiedModelExecution = true;
			preparedOwner.claimUnqualifiedModelBinding = () => {
				const admitted = pendingBinding;
				pendingBinding = void 0;
				return admitted;
			};
			preparedOwner.interruptModelExecution = dependencies.interruptModelExecution;
			preparedSource = createNativeModelSourceOwner({
				get signal() {
					return source.signal;
				},
				get sourceIdentity() {
					return source.sourceIdentity;
				},
				get modelPolicyRequired() {
					return source.modelPolicyRequired;
				},
				assertCurrent: capture.assertCurrent,
				bindModelExecution: (model) => source.bindModelExecution?.(model),
				release: () => {
					try {
						pendingBinding?.release();
						pendingBinding = void 0;
					} finally {
						capture.release();
					}
				}
			}, state, () => {
				if (!dependencies.isCurrent(state)) throw new Error("Codex native input source owner is no longer current");
			}, () => {});
			captureTransferred = true;
			preparedOwner.modelSource = preparedSource;
		}
		assertCurrent();
		const nativeParentThreadId = readThreadParentThreadId(thread);
		if (!dependencies.prepareReceiver(state, thread.id, nativeParentThreadId)) throw new Error("Codex native input receiver cannot retain this sender's admitted source");
		if (!dependencies.knownChildren.has(thread.id) && !dependencies.parents.has(thread.id)) dependencies.registerChildThread(state, thread.id, {
			nativeParentThreadId,
			agentPath: readStringField(readThreadSpawnSource(thread), "agent_path")
		});
		const currentState = dependencies.parents.get(request.threadId) ?? dependencies.knownChildren.get(request.threadId)?.parent;
		const currentOwner = currentState && resolveNativeModelParentOwner(currentState, request.turnId, request.threadId, dependencies.children, dependencies.knownChildren);
		if (!currentOwner || currentOwner.modelExecutionSettled || currentOwner.modelExecutionCancelled) throw new Error("Codex native input requires its exact admitted sender turn");
		if (currentState !== state || currentOwner !== owner) throw new Error("Codex native input sender changed during preparation");
		const pendingModelSources = [...dependencies.admissions.values()].flat().filter((entry) => entry.kind === "interaction" && entry.modelSource?.owner.modelSource?.hasOperatorSource).length;
		dependencies.admit(state, owner, {
			...request,
			targetThreadId
		}, pendingModelSources, preparedOwner);
	} finally {
		targetRevision?.release();
		preparedSource?.release();
		if (!captureTransferred) capture.release();
	}
}
function drainNativeChildModelAdmissions(state, owner, turnId, observeActivity, dependencies) {
	const pending = dependencies.admissions.get(turnId);
	const ownerIsCurrent = [...state.owners.values()].includes(owner);
	if (!pending || !dependencies.isCurrent(state) || !ownerIsCurrent && !pending.some((entry) => entry.kind === "interaction" && (entry.admittedOwner === owner || entry.modelSource?.owner === owner || entry.owner === owner && entry.modelSource))) return;
	const remaining = [];
	const affectedChildren = /* @__PURE__ */ new Set();
	for (const evidence of pending) {
		if (evidence.parentThreadId !== state.parentThreadId) {
			remaining.push(evidence);
			continue;
		}
		if (evidence.kind === "interaction") {
			if (!ownerIsCurrent && evidence.admittedOwner !== owner && evidence.modelSource?.owner !== owner && !(evidence.owner === owner && evidence.modelSource)) {
				remaining.push(evidence);
				continue;
			}
			if (ownerIsCurrent) {
				evidence.owner = owner;
				evidence.completionCustody ??= owner.completionCustody?.retain();
				if (!evidence.modelSourceConsumed) evidence.modelSource ??= retainNativeModelSource(evidence.modelOwner ?? owner);
			}
			const known = dependencies.knownChildren.get(evidence.childThreadId);
			if (known && known.parent !== state) continue;
			if (!known) {
				remaining.push(evidence);
				continue;
			}
			if (evidence.agentPath && !known.agentPaths.has(evidence.agentPath)) dependencies.registerAgentPath(state, evidence.childThreadId, evidence.agentPath);
			const waitingForModel = bindNativeChildModelAdmission(evidence, known, dependencies.currentChild(evidence.childThreadId));
			if (waitingForModel) remaining.push(evidence);
			if (evidence.nativeTurnId) {
				const observed = known.observedTurns.get(evidence.nativeTurnId);
				if (observed) observed.awaitingInteraction = void 0;
				const nativeTurn = known.pendingTurns.find((turn) => turn.turnId === evidence.nativeTurnId);
				if (nativeTurn) {
					if (!nativeTurn.admittedOwner) {
						nativeTurn.admittedOwner = ownerIsCurrent ? owner : evidence.admittedOwner;
						nativeTurn.completionCustody ??= evidence.completionCustody?.retain();
						if (ownerIsCurrent) owner.onDirectChildAccepted?.();
					}
				} else if (dependencies.currentChild(evidence.childThreadId)?.nativeTurnId !== evidence.nativeTurnId) continue;
			} else if (ownerIsCurrent || waitingForModel) {
				if (!waitingForModel) remaining.push(evidence);
			} else continue;
			affectedChildren.add(evidence.childThreadId);
			continue;
		}
		if (!ownerIsCurrent) continue;
		const childState = dependencies.registerChildThread(state, evidence.childThreadId, {
			...evidence.agentPath === void 0 ? {} : { agentPath: evidence.agentPath },
			directOwner: owner,
			nativeParentThreadId: evidence.nativeParentThreadId
		});
		if (childState) admitNativeChildModelExecution(childState, owner, dependencies.knownChildren.get(childState.childThreadId));
	}
	dependencies.replaceAdmissions(turnId, remaining);
	for (const threadId of affectedChildren) {
		const known = dependencies.knownChildren.get(threadId);
		if (known?.parent !== state) continue;
		const previous = dependencies.currentChild(threadId);
		const child = dependencies.admitFollowupChild(known, threadId, ownerIsCurrent ? owner : void 0);
		if (observeActivity && child && child !== previous && child.nativeTurnState === "active") dependencies.observeActivity(child);
	}
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-monitor-runtime.ts
const defaultNativeSubagentMonitorRuntime = {
	deliverAgentHarnessCompletion,
	captureAgentHarnessCompletionCustody,
	createAgentHarnessCompletionEventSink
};
function createCodexNativeSubagentMonitorRuntime(Monitor) {
	const monitors = defineCodexBuildState("openclaw.codexNativeSubagentMonitors", () => /* @__PURE__ */ new WeakMap())();
	async function registerMonitor({ client, runtime, retainClient, retainParentThread, ...registration }) {
		let monitor = monitors.get(client);
		if (!monitor) {
			const childThreadOwnership = /* @__PURE__ */ new Map();
			const childThreadTransitions = new KeyedAsyncQueue();
			const releaseOwnership = async (threadId, ownership) => {
				if (!ownership) return;
				await ownership.release(threadId);
				if (childThreadOwnership.get(threadId) === ownership) childThreadOwnership.delete(threadId);
			};
			monitor = new Monitor(client, runtime ?? defaultNativeSubagentMonitorRuntime, {
				retainClient,
				interruptModelExecution: (threadId, turnId) => {
					interruptCodexTurnAndWaitBestEffort(client, {
						threadId,
						turnId
					});
				},
				retainParentThread,
				hasObservationBacking: (parentThreadId, childThreadId) => hasCodexAppServerLiveThread(client, parentThreadId) || hasCodexAppServerLiveThread(client, childThreadId),
				claimChildThread: (threadId) => childThreadTransitions.enqueue(threadId, async () => {
					let ownership;
					let invalidated = false;
					ownership = await claimCodexAppServerLiveThread(client, threadId, () => {
						invalidated = true;
						if (childThreadOwnership.get(threadId) === ownership) childThreadOwnership.delete(threadId);
						ownership = void 0;
						childThreadTransitions.enqueue(threadId, async () => {
							if (!hasCodexAppServerLiveThread(client, threadId)) monitor?.releasePendingModelInputs(threadId);
						}).catch((error) => {
							embeddedAgentLog.warn("Failed to release Codex native input custody", {
								threadId,
								error: formatErrorMessage$1(error)
							});
						});
					});
					if (ownership && !invalidated) childThreadOwnership.set(threadId, ownership);
					return invalidated ? void 0 : ownership;
				}),
				retainChildThread: (threadId) => childThreadTransitions.enqueue(threadId, async () => {
					const ownership = childThreadOwnership.get(threadId);
					if (!ownership) return false;
					let retained = false;
					try {
						retained = await retainCodexAppServerLiveThread(client, threadId, ownership.release);
						return retained;
					} finally {
						if (!retained) await releaseOwnership(threadId, ownership);
					}
				}),
				releaseChildThread: (threadId) => childThreadTransitions.enqueue(threadId, () => releaseOwnership(threadId, childThreadOwnership.get(threadId))),
				captureChildThreadForget: (threadId) => childThreadTransitions.enqueue(threadId, async () => {
					return childThreadOwnership.get(threadId)?.forget;
				})
			});
			monitors.set(client, monitor);
		}
		return monitor.registerParent(registration);
	}
	return {
		Monitor,
		register: registerMonitor,
		captureModelSource: ({ client, ...request }) => monitors.get(client)?.captureModelSource(request) ?? Promise.resolve(void 0),
		resolveModelThreadId: ({ client, turnId }) => monitors.get(client)?.resolveModelThreadId(turnId),
		prepareModelInput: ({ client, ...request }) => {
			const monitor = monitors.get(client);
			if (!monitor) return Promise.reject(/* @__PURE__ */ new Error("Codex native input has no admitted model source"));
			return monitor.prepareModelInput(request);
		},
		retireParent: (client, parentThreadId) => monitors.get(client)?.retireParent(parentThreadId) ?? Promise.resolve()
	};
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-notification-routing.ts
function createCodexNativeSubagentNotificationRouter(deps) {
	return (notification) => {
		const params = isJsonObject(notification.params) ? notification.params : void 0;
		if (!params) return;
		if (notification.method === "thread/started") {
			const thread = isJsonObject(params.thread) ? params.thread : void 0;
			const parentThreadId = readThreadParentThreadId(thread);
			const childThreadId = thread ? readStringField(thread, "id")?.trim() : void 0;
			const agentPath = readStringField(readThreadSpawnSource(thread), "agent_path")?.trim();
			const state = parentThreadId ? deps.resolveNativeParentState(parentThreadId) : void 0;
			if (state?.preparing) return;
			if (state && childThreadId && parentThreadId) return deps.registerChildThread(state, childThreadId, {
				...agentPath === void 0 ? {} : { agentPath },
				nativeParentThreadId: parentThreadId
			}) ? state : void 0;
			return state;
		}
		if (notification.method === "thread/status/changed" || notification.method === "turn/started" || notification.method === "turn/completed" || notification.method === "item/agentMessage/delta") {
			const childThreadId = readStringField(params, "threadId")?.trim();
			const parentThreadId = childThreadId ? deps.currentChild(childThreadId)?.parentThreadId : void 0;
			return parentThreadId ? deps.parentState(parentThreadId) : void 0;
		}
		if (notification.method === "item/started" || notification.method === "item/completed") {
			const item = isJsonObject(params.item) ? params.item : void 0;
			const parentThreadId = item ? (readStringField(item, "senderThreadId") ?? readStringField(params, "threadId"))?.trim() : void 0;
			const state = parentThreadId ? deps.resolveNativeParentState(parentThreadId) : void 0;
			if (state?.preparing) return;
			if (state && parentThreadId) {
				const turnId = readStringField(params, "turnId");
				const owner = deps.resolveParentOwner(state, turnId, parentThreadId);
				if (notification.method === "item/completed") {
					if (readStringField(item, "type") === "subAgentActivity" && readStringField(item, "kind") === "interacted") {
						const childThreadId = readStringField(item, "agentThreadId");
						if (childThreadId) {
							const accept = (admittedOwner) => deps.observeParentInteraction(state, owner, childThreadId, readStringField(item, "agentPath"), {
								parentTurnId: turnId,
								itemId: readStringField(item, "id"),
								modelOwner: admittedOwner
							});
							if (!deps.acceptInteraction(state, turnId, readStringField(item, "id"), childThreadId, accept)) accept(owner);
						}
						return state;
					}
					if (readStringField(item, "type") === "collabAgentToolCall" && readStringField(item, "tool") === "sendInput" && readStringField(item, "status") === "completed") {
						deps.observeCall(state, turnId, item);
						return;
					}
				}
				if (notification.method === "item/completed" && readStringField(item, "type") === "subAgentActivity" && normalizeIdentifier(readStringField(item, "kind")) === "started") {
					const childThreadId = readStringField(item, "agentThreadId")?.trim();
					const agentPath = readStringField(item, "agentPath");
					if (childThreadId) deps.registerDirectSpawnChild(state, turnId, {
						parentThreadId: state.parentThreadId,
						nativeParentThreadId: parentThreadId,
						childThreadId,
						...agentPath === void 0 ? {} : { agentPath }
					}, owner);
					return state;
				}
				const isCompletedSpawnAgentTool = notification.method === "item/completed" && readStringField(item, "type") === "collabAgentToolCall" && normalizeIdentifier(readStringField(item, "tool")) === "spawnagent" && normalizeIdentifier(readStringField(item, "status")) === "completed";
				if (normalizeIdentifier(readStringField(item, "tool")) === "closeagent") return state;
				if (parentThreadId !== state.parentThreadId && !isCompletedSpawnAgentTool) return state;
				const childThreadIds = new Set(readNativeSubagentThreadIds(item?.receiverThreadIds));
				let accepted = true;
				for (const childThreadId of childThreadIds) accepted = Boolean(isCompletedSpawnAgentTool ? deps.registerDirectSpawnChild(state, turnId, {
					parentThreadId: state.parentThreadId,
					nativeParentThreadId: parentThreadId,
					childThreadId
				}, owner) : deps.registerChildThread(state, childThreadId)) && accepted;
				if (!accepted) return;
			}
			return state;
		}
	};
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-parent-owner.ts
function canNativeParentConsumeCompletion(state, turnId) {
	if (!turnId || !state.turnIds.has(turnId) || state.completedModelTurnsBeforeBinding?.has(turnId)) return false;
	const owners = [...state.owners.values()];
	const bound = owners.find((owner) => owner.turnId === turnId);
	const candidates = bound ? [bound] : owners.filter((owner) => !owner.turnId);
	const owner = candidates.length === 1 ? candidates[0] : void 0;
	return Boolean(owner && !owner.modelExecutionSettled && !owner.modelExecutionCancelled && !owner.isTurnYielded?.());
}
function observeNativeParentTurn(state, notification) {
	const params = isJsonObject(notification.params) ? notification.params : void 0;
	const turnId = isJsonObject(params?.turn) ? readStringField(params.turn, "id") : void 0;
	if (!turnId || !state.owners.size) return;
	if (notification.method === "turn/started") state.turnIds.add(turnId);
	else if (notification.method === "turn/completed") {
		for (const owner of state.owners.values()) if (owner.turnId === turnId) {
			owner.modelExecutionSettled = true;
			owner.nativeReviewRequirement = void 0;
		}
		if ([...state.owners.values()].some((owner) => !owner.turnId)) (state.completedModelTurnsBeforeBinding ??= /* @__PURE__ */ new Set()).add(turnId);
	}
}
/** Registers one foreground admission without owning later admissions to the same thread. */
async function registerNativeSubagentParent(input, dependencies) {
	const params = { ...input };
	const parentThreadId = params.parentThreadId.trim();
	if (!parentThreadId) throw new Error("Codex native subagent monitor requires a parent thread id");
	if (dependencies.isClosed()) throw new Error("Codex native subagent monitor is closed");
	let state = dependencies.states.get(parentThreadId);
	if (state?.requesterSessionKey && params.requesterSessionKey && state.requesterSessionKey !== params.requesterSessionKey) throw new Error(`Codex thread ${parentThreadId} is already bound to another session`);
	if (!state) {
		state = {
			parentThreadId,
			preparing: true,
			owners: /* @__PURE__ */ new Map(),
			turnIds: /* @__PURE__ */ new Set(),
			deliveryReceipts: new CodexNativeSubagentDeliveryReceipts()
		};
		dependencies.states.set(parentThreadId, state);
	}
	state.requesterSessionKey ??= params.requesterSessionKey;
	const requesterSessionKey = state.requesterSessionKey;
	state.pendingRegistrations = (state.pendingRegistrations ?? 0) + 1;
	const registeredState = state;
	const ownerKey = Symbol("codex-native-subagent-owner");
	let owner = {
		configurationQualification: params.configurationQualification,
		unqualifiedModelExecution: params.modelSource ? params.unqualifiedModelExecution : void 0,
		interruptModelExecution: dependencies.interruptModelExecution,
		claimDirectChild: params.claimDirectChild,
		rejectPendingDirectChild: params.rejectPendingDirectChild,
		onDirectChildAccepted: params.onDirectChildAccepted,
		isTurnYielded: params.isTurnYielded
	};
	let rootModelBinding;
	let cancellationReported = false;
	let interruptedTurnId;
	const cancelUnqualifiedRoot = () => {
		owner.modelExecutionCancelled = true;
		if (dependencies.isClosed()) return;
		if (!cancellationReported) {
			cancellationReported = true;
			params.onUnqualifiedModelCancelled?.(rootModelBinding?.signal.reason ?? /* @__PURE__ */ new Error("Codex unqualified model execution authority was revoked"));
		}
		if (owner.turnId && interruptedTurnId !== owner.turnId) {
			interruptedTurnId = owner.turnId;
			dependencies.interruptModelExecution?.(parentThreadId, owner.turnId);
		}
	};
	const releaseRootModelBinding = () => {
		rootModelBinding?.signal.removeEventListener("abort", cancelUnqualifiedRoot);
		rootModelBinding?.release();
		rootModelBinding = void 0;
	};
	try {
		owner.completionCustody = params.completionScope ? await dependencies.runtime.captureAgentHarnessCompletionCustody(params.completionScope) : void 0;
		if (dependencies.isClosed() || dependencies.isRetired(state) || dependencies.states.get(parentThreadId) !== state || state.requesterSessionKey !== requesterSessionKey || owner.completionCustody && !owner.completionCustody.isCurrent()) throw new Error("Codex native subagent parent registration is no longer current");
		params.assertCurrent?.();
		params.modelSource?.assertCurrent();
		if (Object.hasOwn(params, "modelSource")) owner.modelSource = createNativeModelSourceOwner(params.modelSource, state, () => {
			if (dependencies.isClosed() || dependencies.isRetired(registeredState) || dependencies.states.get(parentThreadId) !== registeredState) throw new Error("Codex native model source owner is no longer current");
		}, () => dependencies.prune(registeredState));
		if (owner.unqualifiedModelExecution && params.modelSource) {
			rootModelBinding = params.modelSource.bindModelExecution?.(void 0);
			if (!rootModelBinding) throw new Error("Codex unqualified parent requires an operator model execution guard");
			rootModelBinding.signal.addEventListener("abort", cancelUnqualifiedRoot, { once: true });
			if (rootModelBinding.signal.aborted) cancelUnqualifiedRoot();
		}
		params.assertCurrent?.();
		state.completionScope ??= params.completionScope;
		state.historyOwner ??= params.historyOwner;
		state.submissionStore ??= params.submissionStore;
		state.agentId ??= params.agentId;
		state.assignmentStore ??= params.assignmentStore;
		state.owners.set(ownerKey, owner);
		state.preparing = void 0;
		dependencies.deliverDetached(state);
		dependencies.submissions.restore(state, owner);
	} catch (error) {
		releaseRootModelBinding();
		state.owners.delete(ownerKey);
		releaseCompletionCustody(owner);
		if (owner.modelSource) owner.modelSource.release();
		else params.modelSource?.release();
		throw error;
	} finally {
		state.pendingRegistrations -= 1;
		dependencies.prune(registeredState);
	}
	const ready = dependencies.assignments.restore(state, owner);
	let registered = true;
	let settlement;
	return {
		ready,
		bindTurn: (turnIdInput, mapping) => {
			const turnId = turnIdInput.trim();
			if (!turnId || dependencies.states.get(parentThreadId) !== registeredState) return;
			let current = registeredState.owners.get(ownerKey);
			if (!current || [...registeredState.owners.values()].some((other) => other !== current && other.turnId === turnId)) return;
			if (current.turnId && current.turnId !== turnId) {
				current = {
					...current,
					modelMapping: void 0,
					modelExecutionCancelled: void 0,
					modelExecutionSettled: registeredState.completedModelTurnsBeforeBinding?.has(turnId) ? true : void 0,
					nativeReviewRequirement: void 0
				};
				owner = current;
				registeredState.owners.set(ownerKey, current);
			}
			if (!current.turnId && registeredState.completedModelTurnsBeforeBinding?.has(turnId)) current.modelExecutionSettled = true;
			current.turnId = turnId;
			if (![...registeredState.owners.values()].some((candidate) => !candidate.turnId)) registeredState.completedModelTurnsBeforeBinding = void 0;
			if (mapping && !current.modelMapping) current.modelMapping = Object.freeze({
				nativeModel: Object.freeze({ ...mapping.nativeModel }),
				authorizedModel: Object.freeze({ ...mapping.authorizedModel })
			});
			else if (mapping && current.modelMapping && (mapping.nativeModel.provider !== current.modelMapping.nativeModel.provider || mapping.nativeModel.model !== current.modelMapping.nativeModel.model || mapping.authorizedModel.provider !== current.modelMapping.authorizedModel.provider || mapping.authorizedModel.model !== current.modelMapping.authorizedModel.model)) throw new Error("Codex native turn already has a different admitted model mapping");
			if (cancellationReported || rootModelBinding?.signal.aborted) cancelUnqualifiedRoot();
			dependencies.submissions.bind(registeredState, turnId);
			registeredState.turnIds.add(turnId);
			dependencies.closes.bind(registeredState, turnId);
			dependencies.drainAdmissions(registeredState, current, turnId);
			dependencies.clearAdmissions();
			notifyNativeModelSourceWaiters(registeredState);
		},
		unregister: () => {
			if (!registered) return settlement ?? Promise.resolve();
			registered = false;
			releaseRootModelBinding();
			releaseCompletionCustody(owner);
			owner.nativeReviewRequirement = void 0;
			const current = dependencies.states.get(parentThreadId);
			if (current === registeredState) {
				current.owners.delete(ownerKey);
				dependencies.closes.prune(current);
				if (owner.turnId) current.turnIds.delete(owner.turnId);
				if (current.owners.size === 0) {
					current.turnIds.clear();
					current.deliveryReceipts = new CodexNativeSubagentDeliveryReceipts();
				}
				if (![...current.owners.values()].some((candidate) => !candidate.turnId)) current.completedModelTurnsBeforeBinding = void 0;
				dependencies.clearAdmissions();
				dependencies.deliverDetached(current);
			}
			owner.modelSource?.release();
			notifyNativeModelSourceWaiters(registeredState);
			dependencies.prune(registeredState);
			settlement = (async () => {
				await Promise.allSettled([ready, ...dependencies.closes.settlements(registeredState)]);
				await Promise.allSettled([dependencies.submissions.drain(registeredState)]);
				await Promise.allSettled([dependencies.assignments.drain(registeredState)]);
				dependencies.prune(registeredState);
			})();
			return settlement;
		}
	};
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-submission-call.ts
function admitSubmissionModelInput(params) {
	const { state, owner, request, calls, dependencies, isCurrent } = params;
	if (!owner.modelSource || !isCurrent()) throw new Error("Codex native input has no admitted model source");
	assertNativeModelInputCompatible(owner, dependencies.currentModelExecution(request.targetThreadId) ?? owner);
	for (const entries of calls.values()) for (const pending of entries.values()) if (pending.modelInput?.threadId === request.targetThreadId) assertNativeModelInputCompatible(owner, pending.modelInput.source.owner);
	const key = `${request.turnId}\0${request.itemId}`;
	if (owner.modelSource.hasOperatorSource && !calls.get(state)?.has(key)) {
		if ([...calls.values()].reduce((count, entries) => count + [...entries.values()].filter((call) => call.modelInput?.source.owner.modelSource?.hasOperatorSource).length, 0) + params.pendingModelSources >= 32) throw new Error("Codex pending native input admission capacity reached");
	}
	observeSubmissionCall(state, request.turnId, {
		id: request.itemId,
		receiverThreadIds: [request.targetThreadId]
	}, calls, dependencies, isCurrent);
	const call = calls.get(state)?.get(key);
	if (!call || call.closed || call.owner !== owner || call.modelInput?.threadId !== request.targetThreadId) throw new Error("Codex native input reused an unsettled call identity");
	if (params.preparedOwner && call.modelInput.source.owner === owner) {
		const prepared = retainNativeModelSource(params.preparedOwner);
		if (!prepared) throw new Error("Codex native input lost its prepared model source");
		call.modelInput.source.release();
		call.modelInput.source = prepared;
	}
}
function hasPendingSubmissionModelInput(calls, request) {
	for (const entries of calls.values()) for (const call of entries.values()) if (!call.closed && call.modelInput?.threadId === request.threadId && (call.parentTurnId === request.parentTurnId || call.parentTurnId === request.rootTurnId)) {
		const capture = call.modelInput.source.owner.modelSource?.capture();
		capture?.release();
		return Boolean(capture);
	}
	return false;
}
function retireReceiverModelInputs(calls, threadId, dependencies) {
	for (const entries of calls.values()) for (const call of entries.values()) if (call.modelInput?.threadId === threadId) {
		settleSubmissionModelInput(call, false, dependencies);
		call.closed = true;
	}
}
function readObservedSubmissionTurn(state, threadId, turnId, dependencies) {
	const known = dependencies.knownChildren.get(threadId);
	if (known?.parent !== state) return;
	const pending = known.pendingTurns.find((turn) => turn.turnId === turnId);
	const child = dependencies.currentChild(threadId);
	const status = pending?.state ?? (child?.nativeTurnId === turnId ? child.nativeTurnState : void 0);
	return status ? {
		id: turnId,
		status: status === "active" ? "inProgress" : status
	} : void 0;
}
function observeSubmissionCall(state, turnId, item, allCalls, dependencies, isCurrent) {
	const callId = readStringField(item, "id");
	if (!turnId || !callId || !isCurrent()) return;
	const owner = dependencies.parentOwner(state, turnId);
	if (!owner && ![...state.owners.values()].some((candidate) => !candidate.turnId)) return;
	const calls = allCalls.get(state) ?? /* @__PURE__ */ new Map();
	const key = `${turnId}\0${callId}`;
	if (calls.has(key) || !owner && calls.size >= 32) return;
	const receivers = Array.isArray(item.receiverThreadIds) ? item.receiverThreadIds : [];
	const targets = receivers.flatMap((id) => {
		if (typeof id !== "string") return [];
		dependencies.prepareReceiver(state, id);
		const predecessor = captureSubmissionPredecessor({
			state,
			known: dependencies.knownChildren.get(id),
			child: dependencies.currentChild(id)
		});
		return predecessor ? [{
			childThreadId: id,
			predecessor
		}] : [];
	});
	const receiver = receivers.length === 1 ? receivers[0] : void 0;
	const source = typeof receiver === "string" ? retainNativeModelSource(owner) : void 0;
	if (!targets.length && !source) return;
	calls.set(key, {
		parentTurnId: turnId,
		callId,
		targets,
		owner,
		...source && typeof receiver === "string" ? { modelInput: {
			threadId: receiver,
			source
		} } : {}
	});
	allCalls.set(state, calls);
}
function assertSubmissionModelInputsCurrent(calls, threadId, owner) {
	for (const pending of calls) for (const call of pending.values()) if (call.modelInput?.threadId === threadId) try {
		assertNativeModelInputCompatible(call.modelInput.source.owner, owner);
	} catch (error) {
		if (call.accepted) owner.modelExecutionCancelled = true;
		throw error;
	}
}
function settleSubmissionModelInput(call, accepted, dependencies) {
	const input = call.modelInput;
	if (!input) return;
	const receiver = accepted ? dependencies.currentModelExecution(input.threadId) : void 0;
	call.modelInput = void 0;
	try {
		const known = dependencies.knownChildren.get(input.threadId);
		const isOtherTurn = call.submissionId && known?.observedTurns.has(call.submissionId) && receiver?.turnId !== call.submissionId;
		if (accepted && receiver && !isOtherTurn) try {
			assertNativeModelInputCompatible(input.source.owner, receiver);
		} catch {
			receiver.modelExecutionCancelled = true;
		}
	} finally {
		input.source.release();
	}
}
function hasSubmissionCallCustody(state, call, hasObservationBacking) {
	return Boolean(call.accepted && call.targets.some(({ childThreadId }) => state.owners.size > 0 || hasObservationBacking?.(state.parentThreadId, childThreadId)));
}
function captureSubmissionPredecessor(params) {
	const { state, known, child } = params;
	if (known?.parent !== state) return;
	if (!known.assignment.nativeTurnId) return child && child.runId === known.assignment.runId && !child.terminal && !known.assignment.terminal && !known.assignment.unanchored ? { child } : void 0;
	return {
		runId: known.assignment.runId,
		nativeTurnId: known.assignment.nativeTurnId,
		terminal: known.assignment.terminal || child?.nativeTurnState === "completed" || child?.nativeTurnState === "failed"
	};
}
function observeSubmissionPredecessor(params) {
	const { state, call, threadId, turn, known } = params;
	const submissionId = call.submissionId;
	if (!call.accepted || !submissionId) return;
	call.targets = call.targets.filter(({ childThreadId, predecessor }) => {
		if (childThreadId !== threadId || !("child" in predecessor)) return true;
		const child = predecessor.child;
		if (known?.parent !== state || known.assignment.runId !== child.runId || state.owners.size === 0 && !params.hasObservationBacking?.(state.parentThreadId, threadId)) return false;
		const nativeTurnId = child.nativeTurnId;
		if (!nativeTurnId || nativeTurnId === submissionId || known.assignment.nativeTurnId !== nativeTurnId) return true;
		const nativeState = (readStringField(turn, "id") === nativeTurnId ? readNativeTurnEnd(turn) : void 0) ?? child.nativeTurnState;
		const owner = call.owner && [...state.owners.values()].includes(call.owner) ? call.owner : void 0;
		if (nativeState === "interrupted") {
			if (owner) params.acceptContinuation(owner);
			return false;
		}
		if (!known.assignment.terminal && nativeState !== "completed" && nativeState !== "failed") return true;
		params.capture({
			parentTurnId: call.parentTurnId,
			callId: call.callId,
			childThreadId,
			submissionId,
			predecessorRunId: child.runId,
			predecessorNativeTurnId: nativeTurnId
		}, owner);
		return false;
	});
	if (call.targets.length === 0) {
		call.owner = void 0;
		call.completionCustody?.release();
		call.completionCustody = void 0;
	}
}
function pruneSubmissionCalls(state, calls, dependencies) {
	const hasUnboundOwner = [...state.owners.values()].some((owner) => !owner.turnId);
	for (const [key, call] of calls ?? []) {
		if (hasSubmissionCallCustody(state, call, dependencies.hasObservationBacking)) {
			if (!call.owner || ![...state.owners.values()].includes(call.owner)) call.owner = void 0;
			continue;
		}
		if (call.owner && ![...state.owners.values()].includes(call.owner) || !dependencies.parentOwner(state, call.parentTurnId) && !hasUnboundOwner) {
			settleSubmissionModelInput(call, false, dependencies);
			calls.delete(key);
			call.completionCustody?.release();
		}
	}
}
function acceptSubmissionModelInteraction(calls, turnId, itemId, threadId, accept, dependencies) {
	const call = calls?.get(`${turnId ?? ""}\0${itemId ?? ""}`);
	if (!call) return false;
	if (call.closed || !call.modelInput) return true;
	if (call.modelInput.threadId !== threadId) throw new Error("Codex native interaction changed its admitted target");
	call.accepted = true;
	accept(call.modelInput.source.owner);
	call.closed = true;
	settleSubmissionModelInput(call, true, dependencies);
	return true;
}
function acceptNativeSubmission(state, call, dependencies) {
	const owner = dependencies.parentOwner(state, call.parentTurnId);
	if (call.closed || !owner || call.owner && owner !== call.owner || !call.submissionId || !dependencies.isCurrent(state)) return;
	call.closed = true;
	call.accepted = true;
	call.owner = owner;
	call.completionCustody ??= owner.completionCustody?.retain();
	const modelSource = retainNativeModelSource(call.modelInput?.source.owner);
	try {
		settleSubmissionModelInput(call, true, dependencies);
		const targets = call.targets;
		call.targets = [];
		for (const target of targets) {
			const { childThreadId, predecessor } = target;
			const modelOwner = modelSource?.owner ?? owner;
			if (modelOwner.modelSource && ("child" in predecessor || predecessor.terminal)) dependencies.acceptContinuation(state, {
				...owner,
				claimDirectChild: void 0,
				rejectPendingDirectChild: void 0,
				onDirectChildAccepted: void 0
			}, childThreadId, call, modelOwner);
			if ("child" in predecessor) {
				call.targets.push(target);
				continue;
			}
			if (!predecessor.terminal) {
				dependencies.acceptContinuation(state, owner, childThreadId, call, modelOwner);
				continue;
			}
			dependencies.capture(state, {
				parentTurnId: call.parentTurnId,
				callId: call.callId,
				childThreadId,
				submissionId: call.submissionId,
				predecessorRunId: predecessor.runId,
				predecessorNativeTurnId: predecessor.nativeTurnId
			}, owner, true);
		}
		for (const { childThreadId } of call.targets) dependencies.observeKnownChild(childThreadId);
		if (!call.targets.length) {
			call.completionCustody?.release();
			call.completionCustody = void 0;
		}
	} finally {
		modelSource?.release();
	}
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-submission-history.ts
async function readCodexNativeSubmissionTurn(receipt, dependencies) {
	if (!dependencies.prepareReceiver()) return;
	const revision = dependencies.recovery.retainThreadStatusRevision(receipt.childThreadId);
	try {
		const response = await dependencies.client.request("thread/read", {
			threadId: receipt.childThreadId,
			includeTurns: true
		}, { timeoutMs: 3e4 });
		if (!revision.isCurrent() || !dependencies.isCurrent()) return;
		const thread = isJsonObject(response.thread) ? response.thread : void 0;
		if (readStringField(thread, "id") !== receipt.childThreadId || readThreadParentThreadId(thread) !== dependencies.parentThreadId()) return;
		const turns = [];
		for (const turn of Array.isArray(thread?.turns) ? thread.turns : []) if (isJsonObject(turn)) turns.push(turn);
		const predecessorIndex = turns.findIndex((turn) => readStringField(turn, "id") === receipt.predecessorNativeTurnId);
		const turnIndex = turns.findIndex((turn) => readStringField(turn, "id") === receipt.submissionId);
		if (predecessorIndex < 0 || turnIndex <= predecessorIndex || !["completed", "failed"].includes(readStringField(turns[predecessorIndex], "status") ?? "")) return;
		const previous = dependencies.currentChild();
		if (previous && !previous.terminal && previous.nativeTurnId !== receipt.submissionId) await dependencies.recovery.reconcileRegisteredChild(previous);
		return dependencies.isCurrent() ? turns[turnIndex] : void 0;
	} finally {
		revision.release();
	}
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-submission-owner.ts
/** Captures successful native submissions before their turn notifications arrive. */
var CodexNativeSubagentSubmissionOwner = class {
	constructor(dependencies) {
		this.dependencies = dependencies;
		this.calls = /* @__PURE__ */ new Map();
		this.pending = /* @__PURE__ */ new Map();
		this.writes = /* @__PURE__ */ new Map();
		this.disposed = false;
		this.pollDelays = dependencies.recoveryPollDelaysMs ?? DEFAULT_RECOVERY_POLL_DELAYS_MS;
	}
	isCurrent(state) {
		if (this.dependencies.isCurrent(state)) return true;
		this.retire(state);
		this.dependencies.onSettled(state);
		return false;
	}
	nativeParentThreadId(state, childThreadId) {
		const known = this.dependencies.knownChildren.get(childThreadId);
		return known?.parent === state ? known.nativeParentThreadId : state.parentThreadId;
	}
	isObserving(state, custody) {
		if (this.disposed || custody.phase === "promoting" || custody.phase === "settled" || !this.isCurrent(state)) return false;
		if (custody.phase === "detached" && !this.dependencies.hasObservationBacking?.(state.parentThreadId, custody.receipt.childThreadId)) {
			this.finishCustody(state, custody);
			return false;
		}
		return true;
	}
	observeCall(state, turnId, item) {
		observeSubmissionCall(state, turnId, item, this.calls, this.dependencies, () => this.isCurrent(state));
	}
	admitModelInput(state, owner, request, pendingModelSources, preparedOwner) {
		admitSubmissionModelInput({
			state,
			owner,
			request,
			pendingModelSources,
			preparedOwner,
			calls: this.calls,
			dependencies: this.dependencies,
			isCurrent: () => this.isCurrent(state)
		});
	}
	acceptInteraction(state, turnId, itemId, threadId, accept) {
		return acceptSubmissionModelInteraction(this.calls.get(state), turnId, itemId, threadId, accept, this.dependencies);
	}
	hasPendingModelInput(request) {
		return hasPendingSubmissionModelInput(this.calls, request);
	}
	retireReceiverModelInputs(threadId) {
		retireReceiverModelInputs(this.calls, threadId, this.dependencies);
	}
	assertModelInputCurrent(threadId, owner) {
		assertSubmissionModelInputsCurrent(this.calls.values(), threadId, owner);
	}
	observeOutput(state, turnId, item) {
		if (item.type !== "function_call_output" || !turnId) return;
		const key = `${turnId}\0${readStringField(item, "call_id") ?? ""}`;
		const call = this.calls.get(state)?.get(key);
		if (!call || call.closed) return;
		let output;
		try {
			output = JSON.parse(readStringField(item, "output") ?? "");
		} catch {}
		const submissionId = isJsonObject(output) ? readStringField(output, "submission_id")?.trim() : void 0;
		if (!submissionId) {
			call.closed = true;
			settleSubmissionModelInput(call, false, this.dependencies);
			return;
		}
		call.submissionId = submissionId;
		this.accept(state, call);
	}
	bind(state, turnId) {
		for (const call of this.calls.get(state)?.values() ?? []) if (call.parentTurnId === turnId && call.submissionId) this.accept(state, call);
	}
	restore(state, owner) {
		try {
			for (const receipt of state.submissionStore?.read() ?? []) this.capture(state, receipt, void 0, false, owner.completionCustody);
		} catch (error) {
			embeddedAgentLog.warn("Cannot recover native follow-up submission receipts", { error: formatErrorMessage$1(error) });
		}
	}
	observeTurn(threadId, turn) {
		const turnId = readStringField(turn, "id");
		if (!turnId) return;
		this.observeKnownChild(threadId, turn);
		for (const [state, entries] of this.pending) for (const custody of entries.values()) if (custody.receipt.childThreadId === threadId && custody.receipt.submissionId === turnId) this.promote(state, custody, turn);
	}
	hasCustody(state) {
		return Boolean(this.pending.get(state)?.size || this.writes.get(state)?.size) || [...this.calls.get(state)?.values() ?? []].some((call) => hasSubmissionCallCustody(state, call, this.dependencies.hasObservationBacking));
	}
	hasChildCustody(state, childThreadId) {
		return [...this.pending.get(state)?.values() ?? []].some((entry) => entry.receipt.childThreadId === childThreadId) || [...this.calls.get(state)?.values() ?? []].some((call) => call.targets.some((target) => target.childThreadId === childThreadId) && hasSubmissionCallCustody(state, call, this.dependencies.hasObservationBacking));
	}
	async settleWrites(state) {
		while (this.writes.get(state)?.size) await Promise.allSettled(this.writes.get(state));
	}
	async drain(state) {
		const calls = this.calls.get(state);
		pruneSubmissionCalls(state, calls, this.dependencies);
		if (!calls?.size) this.calls.delete(state);
		await this.settleWrites(state);
		if (state.owners.size === 0) for (const custody of this.pending.get(state)?.values() ?? []) {
			if (custody.phase === "captured") {
				custody.phase = "detached";
				custody.owner = void 0;
				custody.release();
			}
			this.isObserving(state, custody);
		}
	}
	retire(state) {
		for (const call of this.calls.get(state)?.values() ?? []) {
			settleSubmissionModelInput(call, false, this.dependencies);
			call.completionCustody?.release();
		}
		this.calls.delete(state);
		for (const custody of this.pending.get(state)?.values() ?? []) {
			custody.phase = "settled";
			if (custody.timer) clearTimeout(custody.timer);
			custody.release();
			custody.completionCustody?.release();
		}
		this.pending.delete(state);
	}
	dispose() {
		this.disposed = true;
		for (const state of /* @__PURE__ */ new Set([...this.pending.keys(), ...this.calls.keys()])) this.retire(state);
	}
	accept(state, call) {
		acceptNativeSubmission(state, call, {
			...this.dependencies,
			isCurrent: (parent) => this.isCurrent(parent),
			capture: (parent, receipt, owner, persist) => this.capture(parent, receipt, owner, persist),
			observeKnownChild: (threadId) => this.observeKnownChild(threadId)
		});
	}
	observeKnownChild(threadId, turn) {
		for (const [state, calls] of this.calls) {
			if (!this.isCurrent(state)) continue;
			for (const call of calls.values()) observeSubmissionPredecessor({
				state,
				call,
				threadId,
				turn,
				known: this.dependencies.knownChildren.get(threadId),
				hasObservationBacking: this.dependencies.hasObservationBacking,
				acceptContinuation: (owner) => this.dependencies.acceptContinuation(state, owner, threadId, call),
				capture: (receipt, owner) => this.capture(state, receipt, owner, true, call.completionCustody)
			});
			this.dependencies.onSettled(state);
		}
	}
	capture(state, receipt, owner, persist = false, completionCustody = owner?.completionCustody) {
		if (this.disposed || !this.isCurrent(state)) return;
		const entries = this.pending.get(state) ?? /* @__PURE__ */ new Map();
		const key = `${receipt.parentTurnId}\0${receipt.callId}\0${receipt.childThreadId}`;
		if (entries.has(key)) return;
		const foreground = state.owners.size > 0;
		const custody = {
			completionCustody: completionCustody?.retain(),
			receipt: Object.freeze({ ...receipt }),
			owner,
			release: foreground ? this.dependencies.retain(state, receipt.childThreadId) : () => {},
			recorded: Promise.resolve(),
			phase: foreground ? "captured" : "detached",
			attempt: 0
		};
		entries.set(key, custody);
		this.pending.set(state, entries);
		if (persist) this.dependencies.recordPendingAssignment(state, receipt, this.nativeParentThreadId(state, receipt.childThreadId));
		if (persist && state.submissionStore) custody.recorded = this.track(state, (async () => {
			try {
				if (!await state.submissionStore.record(receipt, () => this.dependencies.assertPersistenceCurrent(state))) throw new Error("Native submission binding changed before receipt persistence.");
			} catch (error) {
				embeddedAgentLog.warn("Accepted native follow-up lost restart protection; retaining local observation", { error: formatErrorMessage$1(error) });
			}
		})());
		const observed = readObservedSubmissionTurn(state, receipt.childThreadId, receipt.submissionId, this.dependencies);
		if (observed) this.promote(state, custody, observed);
		if (custody.phase !== "promoting") this.reconcile(state, custody);
	}
	promote(state, custody, turn, historyValidated = false) {
		if (!this.isObserving(state, custody) || !this.admitTurn(state, custody.receipt, turn, custody.owner, historyValidated, custody.completionCustody)) return;
		custody.phase = "promoting";
		if (custody.timer) clearTimeout(custody.timer);
	}
	settleChild(state, child) {
		for (const custody of this.pending.get(state)?.values() ?? []) {
			if (custody.phase === "settled" || codexNativeSubagentRunId(custody.receipt.childThreadId, custody.receipt.submissionId) !== child.runId) continue;
			custody.phase = "settled";
			const settlement = (async () => {
				await custody.recorded;
				try {
					if ((child.nativeCompletionDelivered || child.subscriptionClosed && !child.pendingCompletion) && state.submissionStore) await state.submissionStore.consume(custody.receipt, () => this.dependencies.assertPersistenceCurrent(state));
				} catch (error) {
					embeddedAgentLog.warn("Native follow-up receipt remains for reconciliation", { error: formatErrorMessage$1(error) });
				} finally {
					if ([...this.pending.get(state)?.values() ?? []].includes(custody)) this.finishCustody(state, custody);
				}
			})();
			this.track(state, settlement);
		}
	}
	async reconcile(state, custody) {
		if (!this.isObserving(state, custody)) return;
		try {
			const turn = await this.readTurn(state, custody);
			if (turn) this.promote(state, custody, turn, true);
		} catch (error) {
			embeddedAgentLog.warn("Failed to reconcile an accepted native follow-up receipt", { error: formatErrorMessage$1(error) });
		}
		if (!this.isObserving(state, custody) || !this.pollDelays.length) return;
		custody.timer = setTimeout(() => {
			custody.timer = void 0;
			this.reconcile(state, custody);
		}, delayForAttempt(this.pollDelays, custody.attempt++));
		custody.timer.unref();
	}
	readTurn(state, custody) {
		const childThreadId = custody.receipt.childThreadId;
		return readCodexNativeSubmissionTurn(custody.receipt, {
			client: this.dependencies.client,
			recovery: this.dependencies.recovery,
			prepareReceiver: () => this.dependencies.prepareReceiver(state, childThreadId),
			isCurrent: () => this.isObserving(state, custody),
			parentThreadId: () => this.nativeParentThreadId(state, childThreadId),
			currentChild: () => this.dependencies.currentChild(childThreadId)
		});
	}
	finishCustody(state, custody) {
		custody.phase = "settled";
		if (custody.timer) clearTimeout(custody.timer);
		const entries = this.pending.get(state);
		for (const [key, entry] of entries ?? []) if (entry === custody) entries.delete(key);
		if (!entries?.size) this.pending.delete(state);
		custody.release();
		custody.completionCustody?.release();
		this.dependencies.onSettled(state);
	}
	admitTurn(state, receipt, turn, owner, historyValidated, completionCustody) {
		if (readStringField(turn, "id") !== receipt.submissionId || this.disposed || !this.isCurrent(state)) return false;
		const runId = codexNativeSubagentRunId(receipt.childThreadId, receipt.submissionId);
		let known = this.dependencies.knownChildren.get(receipt.childThreadId);
		if (!known) {
			if (!historyValidated) return false;
			this.dependencies.restoreKnownChild(state, {
				runId: receipt.predecessorRunId,
				childThreadId: receipt.childThreadId,
				nativeTurnId: receipt.predecessorNativeTurnId
			});
			known = this.dependencies.knownChildren.get(receipt.childThreadId);
			if (known && known.assignment.runId === receipt.predecessorRunId) known.assignment.terminal = true;
		}
		if (known?.parent !== state) return false;
		if (known.assignment.runId !== receipt.predecessorRunId && known.assignment.runId !== runId && !known.pendingTurns.some((pending) => pending.turnId === receipt.submissionId)) return false;
		if (known.assignment.runId === receipt.predecessorRunId && known.assignment.nativeTurnId !== receipt.predecessorNativeTurnId) return false;
		const nativeState = readStringField(turn, "status") === "inProgress" ? "active" : readNativeTurnEnd(turn);
		if (!nativeState) return false;
		if (known.assignment.runId === runId) {
			const child = this.dependencies.currentChild(receipt.childThreadId) ?? this.dependencies.registerChild(state, {
				runId,
				childThreadId: receipt.childThreadId,
				nativeTurnId: receipt.submissionId
			}, {
				admitAssignment: true,
				completionCustody
			});
			if (!child) return false;
			child.nativeTurnState = nativeState;
			child.completionCustody ??= completionCustody?.retain();
		} else {
			let pending = known.pendingTurns.find((candidate) => candidate.turnId === receipt.submissionId);
			if (!pending) {
				pending = {
					turnId: receipt.submissionId,
					state: nativeState
				};
				known.pendingTurns.push(pending);
				known.observedTurns.set(receipt.submissionId, {});
			}
			pending.state = nativeState;
			pending.admittedSubmission = receipt;
			pending.completionCustody ??= completionCustody?.retain();
			if (owner && pending.admittedOwner !== owner && [...state.owners.values()].includes(owner)) {
				pending.admittedOwner = owner;
				owner.onDirectChildAccepted?.();
			}
			this.dependencies.admitFollowup(known, receipt.childThreadId);
		}
		const child = this.dependencies.currentChild(receipt.childThreadId);
		if (child?.runId !== runId) return false;
		if (nativeState === "active") this.dependencies.resumeChild(child);
		else if (Array.isArray(turn.items)) this.dependencies.completeChild({
			method: "turn/completed",
			params: {
				threadId: receipt.childThreadId,
				turn
			}
		}, child).catch((error) => logRecoveryFailure(receipt.childThreadId, error));
		return true;
	}
	track(state, operation) {
		const writes = this.writes.get(state) ?? /* @__PURE__ */ new Set();
		writes.add(operation);
		this.writes.set(state, writes);
		const remove = () => {
			writes.delete(operation);
			if (!writes.size) this.writes.delete(state);
			this.dependencies.onSettled(state);
		};
		operation.then(remove, remove);
		return operation;
	}
};
//#endregion
//#region extensions/codex/src/app-server/event-projector-tool-output.ts
function collectDynamicToolContentText(contentItems) {
	if (!Array.isArray(contentItems)) return "";
	return contentItems.flatMap((entry) => {
		if (!isJsonObject(entry)) return [];
		const text = readStringField(entry, "text");
		return text ? [text] : [];
	}).join("\n");
}
function readCodexResponseOutput(item) {
	if (typeof item.output === "string") return item.output;
	if (!Array.isArray(item.output)) return;
	return JSON.stringify(item.output.map((part) => isJsonObject(part) && part.type === "input_text" && typeof part.text === "string" ? {
		type: part.type,
		text: part.text
	} : {
		type: isJsonObject(part) ? part.type : "unknown",
		omitted: true
	}), null, 2);
}
const TOOL_PROGRESS_ECHO_SIGNATURE_CAP = MAX_TOOL_OUTPUT_DELTA_MESSAGES_PER_ITEM + 4;
function toolOutputRawEchoSignature(text) {
	const trimmed = text.trim();
	if (!trimmed) return;
	return {
		rawLength: trimmed.length,
		rawPrefix: trimmed.slice(0, TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS)
	};
}
//#endregion
//#region extensions/codex/src/app-server/tool-progress-normalization.ts
function resolveCodexToolProgressDetailMode(value) {
	return value === "raw" ? "raw" : "explain";
}
function isCodexCommandBearingToolCall(name, args) {
	const normalizedName = name?.trim().toLowerCase();
	return normalizedName === "exec" || normalizedName === "bash" || normalizedName === "shell" || typeof args?.command === "string" && args.command.trim().length > 0;
}
function sanitizeCodexAgentEventRecord(value) {
	return sanitizeToolArgs(value);
}
function sanitizeCodexToolArguments(value) {
	if (!isJsonObject(value)) return;
	return sanitizeCodexAgentEventRecord(value);
}
//#endregion
//#region extensions/codex/src/app-server/web-search-item.ts
function projectCodexWebSearchItem(item) {
	const action = isJsonObject(item.action) ? item.action : void 0;
	const actionType = normalizeOptionalString(action?.type);
	const queries = actionType === "search" ? normalizeTrimmedStringList(action?.queries) : [];
	const query = normalizeOptionalString(item.query) ?? (actionType === "search" ? normalizeOptionalString(action?.query) : void 0) ?? queries[0];
	const url = normalizeOptionalString(action?.url);
	const pattern = normalizeOptionalString(action?.pattern);
	return {
		...query ? { query } : {},
		...queries.length > 0 ? { queries } : {},
		...actionType && actionType !== "search" ? { action: actionType } : {},
		...url ? { url } : {},
		...pattern ? { pattern } : {}
	};
}
//#endregion
//#region extensions/codex/src/app-server/event-projector-tool-items.ts
function readInterceptedNativePatchInput(command) {
	if (typeof command !== "string") return;
	const lines = command.replace(/\r\n?/gu, "\n").split("\n");
	const patchStart = lines.indexOf("*** Begin Patch");
	const invocation = /^[\t ]*(?:cd[\t ]+(?:'([^'\n]+)'|([A-Za-z0-9_./-]+))[\t ]+&&[\t ]+)?apply_patch[\t ]*<<-?[\t ]*'([^'\n]+)'[\t ]*$/u.exec(lines[0] ?? "");
	if (!invocation || patchStart !== 1) return;
	const patchEnd = lines.indexOf("*** End Patch", patchStart + 1);
	const cwd = invocation[1] ?? invocation[2];
	const delimiter = invocation[3];
	if (patchEnd < 0 || lines[patchEnd + 1] !== delimiter || lines.slice(patchEnd + 2).some((line) => line.trim().length > 0)) return;
	return {
		input: `${lines.slice(patchStart, patchEnd + 1).join("\n")}\n`,
		...cwd ? { cwd } : {}
	};
}
function projectCodexToolActivity(item, phase, meta) {
	const name = itemName(item) ?? auditNativeToolName(item);
	return name ? projectAgentToolActivity({
		toolCallId: item.id,
		name,
		phase,
		args: item.type === "dynamicToolCall" ? void 0 : itemToolArgs(item),
		meta,
		status: item.type === "collabAgentToolCall" && item.status === "interrupted" ? "failed" : unknownItemStatus(item) ? "unknown" : itemStatus(item),
		result: { details: itemToolResult(item) },
		...item.type === "collabAgentToolCall" && item.tool === "wait" ? { nativeOperation: "wait" } : {}
	}) : void 0;
}
function isNativePostToolUseRelayItem(item) {
	switch (item.type) {
		case "commandExecution":
		case "fileChange":
		case "mcpToolCall": return true;
		default: return false;
	}
}
function shouldSuppressChannelProgressForItem(item) {
	if (isProjectedNativeToolItem(item)) return true;
	return item.type === "dynamicToolCall";
}
function itemToolArgs(item) {
	if (item.type === "commandExecution") return sanitizeCodexAgentEventRecord({
		command: item.command,
		...typeof item.cwd === "string" ? { cwd: item.cwd } : {}
	});
	if (item.type === "fileChange") return sanitizeCodexAgentEventRecord({ changes: itemFileChangesForTranscript(item) });
	if (item.type === "webSearch") return webSearchToolArgs(item);
	if (item.type === "dynamicToolCall" || item.type === "mcpToolCall") return sanitizeCodexToolArguments(item.arguments);
}
function isCommandBearingToolItem(item, args) {
	if (item.type === "commandExecution") return true;
	return typeof args?.command === "string" && args.command.trim().length > 0;
}
function webSearchToolArgs(item) {
	const args = projectCodexWebSearchItem(item);
	if (!args.query && !args.url && !args.pattern) args.queryUnavailable = true;
	return sanitizeCodexAgentEventRecord(args);
}
function itemToolResult(item) {
	if (item.type === "commandExecution") return sanitizeCodexAgentEventRecord({
		status: item.status,
		exitCode: item.exitCode,
		durationMs: item.durationMs
	});
	if (item.type === "fileChange") return sanitizeCodexAgentEventRecord({
		status: item.status,
		changes: itemFileChanges(item)
	});
	if (item.type === "mcpToolCall") return sanitizeCodexAgentEventRecord({
		status: item.status,
		durationMs: item.durationMs,
		...item.error ? { error: item.error } : {},
		...item.result ? { result: item.result } : {}
	});
	if (item.type === "webSearch") return webSearchToolResult(item);
}
function webSearchToolResult(item) {
	return sanitizeCodexAgentEventRecord({
		status: itemStatus(item),
		...typeof item.durationMs === "number" ? { durationMs: item.durationMs } : {},
		...webSearchToolArgs(item)
	});
}
function itemFileChangeRecords(item) {
	const changes = item.changes;
	return Array.isArray(changes) ? changes.filter(isJsonObject) : [];
}
function itemFileChanges(item) {
	return itemFileChangeRecords(item).flatMap((change) => {
		const path = normalizeOptionalString(change.path);
		if (!path || change.kind === void 0) return [];
		return [{
			path,
			kind: change.kind
		}];
	});
}
function fileChangeKindType(kind) {
	if (typeof kind === "string") return kind;
	return isJsonObject(kind) ? normalizeOptionalString(kind.type) : void 0;
}
function countFileContentLines(content) {
	if (!content) return 0;
	const lines = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
	if (lines.length > 1 && lines.at(-1) === "") lines.pop();
	return lines.length;
}
function fileChangeDiffStat(diff, kind) {
	const kindType = fileChangeKindType(kind);
	if (kindType === "add") return {
		added: countFileContentLines(diff),
		removed: 0
	};
	if (kindType === "delete") return {
		added: 0,
		removed: countFileContentLines(diff)
	};
	let added = 0;
	let removed = 0;
	let inHunk = false;
	for (const line of diff.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n")) {
		if (line.startsWith("@@")) {
			inHunk = true;
			continue;
		}
		if (!inHunk) continue;
		if (line.startsWith("+")) added += 1;
		else if (line.startsWith("-")) removed += 1;
	}
	return {
		added,
		removed
	};
}
function truncateFileChangeDiffAtLineBoundary(diff, maxChars) {
	if (diff.length <= maxChars) return { diff };
	if (maxChars <= 0) return { diffTruncated: true };
	const boundary = diff.lastIndexOf("\n", maxChars - 1);
	return boundary >= 0 ? {
		diff: diff.slice(0, boundary + 1),
		diffTruncated: true
	} : { diffTruncated: true };
}
function itemFileChangesForTranscript(item) {
	let remainingDiffChars = 1e4;
	return itemFileChangeRecords(item).flatMap((change) => {
		const path = normalizeOptionalString(change.path);
		if (!path || change.kind === void 0) return [];
		const result = {
			path,
			kind: change.kind
		};
		if (typeof change.diff !== "string") return [result];
		result.stat = fileChangeDiffStat(change.diff, change.kind);
		const bounded = truncateFileChangeDiffAtLineBoundary(change.diff, remainingDiffChars);
		if (bounded.diff !== void 0) {
			result.diff = bounded.diff;
			remainingDiffChars -= bounded.diff.length;
		}
		if (bounded.diffTruncated) result.diffTruncated = true;
		return [result];
	});
}
function itemToolError(item, status, outputTextByItem) {
	if (status === "blocked") return "codex native tool blocked";
	if (status !== "failed") return;
	return itemOutputText(item, outputTextByItem) ?? "codex native tool failed";
}
function itemMeta(item, detailMode = "explain") {
	if (item.type === "commandExecution" && typeof item.command === "string") return inferToolMetaFromArgs("exec", {
		command: item.command,
		cwd: typeof item.cwd === "string" ? item.cwd : void 0
	}, { detailMode });
	if (item.type === "webSearch") return inferToolMetaFromArgs("web_search", webSearchToolArgs(item), { detailMode });
	const toolName = itemName(item);
	if ((item.type === "dynamicToolCall" || item.type === "mcpToolCall") && toolName) return inferToolMetaFromArgs(toolName, item.arguments, { detailMode });
}
function itemOutputText(item, outputTextByItem) {
	const output = itemObservedOutputText(item, outputTextByItem)?.trim();
	return output ? truncateNativeToolTranscriptText(output, "Codex") : void 0;
}
function itemObservedOutputText(item, outputTextByItem) {
	if (item.type === "commandExecution") return item.aggregatedOutput ?? outputTextByItem?.get(item.id);
	if (item.type === "dynamicToolCall") return collectDynamicToolContentText(item.contentItems);
	if (item.type === "mcpToolCall") return item.error ? stringifyJsonValue(item.error) : item.result ? stringifyJsonValue(item.result) : void 0;
}
function itemTranscriptResultText(item, outputTextByItem) {
	const output = itemObservedOutputText(item, outputTextByItem);
	if (output !== void 0) return output;
	const result = itemToolResult(item);
	return (result ? stringifyJsonValue(result) : void 0) ?? itemStatus(item);
}
function stringifyJsonValue(value) {
	try {
		return JSON.stringify(value, null, 2);
	} catch {
		return;
	}
}
//#endregion
//#region extensions/codex/src/app-server/event-projector-tool-progress.ts
const TRANSCRIPT_PROGRESS_SUPPRESSED_TOOL_NAMES = /* @__PURE__ */ new Set([
	"message",
	"messages",
	"reply",
	"send",
	"reaction",
	"react",
	"typing"
]);
function shouldEmitTranscriptToolProgress(toolName) {
	const normalized = typeof toolName === "string" ? toolName.trim().toLowerCase() : "";
	return Boolean(normalized && !TRANSCRIPT_PROGRESS_SUPPRESSED_TOOL_NAMES.has(normalized));
}
var CodexToolProgressProjection = class {
	constructor(params) {
		this.params = params;
		this.echoesByItem = /* @__PURE__ */ new Map();
		this.resultSummaryItemIds = /* @__PURE__ */ new Set();
		this.resultOutputItemIds = /* @__PURE__ */ new Set();
		this.transcriptProgressSuppressedIds = /* @__PURE__ */ new Set();
		this.resultOutputDeltaState = /* @__PURE__ */ new Map();
		this.output = new NativeToolOutputAccumulator("Codex");
		this.metas = /* @__PURE__ */ new Map();
		this.sideEffectingNativeIds = /* @__PURE__ */ new Set();
		this.sideEffectingDynamicIds = /* @__PURE__ */ new Set();
		this.transcriptProgressCallIds = /* @__PURE__ */ new Set();
		this.approvalTimeoutKinds = /* @__PURE__ */ new Map();
	}
	get outputTextByItem() {
		return this.output.textByItem;
	}
	isOutputTruncated(itemId) {
		return this.output.isTruncated(itemId);
	}
	get toolMetas() {
		return [...this.metas.values()];
	}
	getToolMeta(itemId) {
		return this.metas.get(itemId);
	}
	get lastToolError() {
		return this.lastNativeToolError;
	}
	get hasPotentialSideEffects() {
		return this.sideEffectingNativeIds.size > 0 || this.sideEffectingDynamicIds.size > 0;
	}
	approvalTimeoutExplanation(itemId, status) {
		const kind = isNonSuccessItemStatus(status) && this.approvalTimeoutKinds.get(itemId);
		return kind ? codexApprovalTimeoutText(kind) : void 0;
	}
	setLastToolError(error) {
		if (!error) {
			this.lastNativeToolError = void 0;
			return;
		}
		const terminalResolution = this.params.observeToolTerminal?.({
			toolName: error.toolName,
			...error.meta ? { meta: error.meta } : {},
			outcome: "failure",
			failure: {
				...error.errorCode ? { errorCode: error.errorCode } : {},
				...error.error ? { error: error.error } : {},
				...error.validationErrorSummary ? { validationErrorSummary: error.validationErrorSummary } : {},
				...error.timedOut ? { timedOut: true } : {},
				...error.middlewareError ? { middlewareError: true } : {}
			},
			nativeMutation: {
				mutatingAction: error.mutatingAction === true,
				replaySafe: error.mutatingAction !== true
			}
		});
		this.lastNativeToolError = terminalResolution?.lastToolError ?? (this.lastNativeToolError?.mutatingAction && error.mutatingAction !== true ? this.lastNativeToolError : error);
	}
	recordDynamicToolResult(params) {
		const resultText = collectDynamicToolContentText(params.contentItems);
		const existing = this.metas.get(params.callId);
		this.metas.set(params.callId, {
			toolName: existing?.toolName ?? params.tool,
			...existing?.meta ? { meta: existing.meta } : {},
			...params.asyncStarted === true ? { asyncStarted: true } : {},
			isError: !params.success
		});
		if (params.terminalResolution) this.lastNativeToolError = params.terminalResolution.lastToolError;
		else if (!params.success) this.lastNativeToolError = {
			toolName: params.tool,
			error: resultText || (params.terminalType === "blocked" ? "codex dynamic tool blocked" : "codex dynamic tool failed")
		};
		else if (this.lastNativeToolError?.mutatingAction !== true) this.lastNativeToolError = void 0;
		if (params.sideEffectEvidence === true) this.sideEffectingDynamicIds.add(params.callId);
	}
	handleOutputDelta(params, toolName) {
		const itemId = readStringField(params, "itemId");
		const delta = readStringField(params, "delta");
		if (!itemId || !delta) return;
		const storedOutput = this.output.append(itemId, delta);
		this.rememberEcho(itemId, {
			displayText: storedOutput.text,
			rawLength: storedOutput.normalizedLength,
			rawPrefix: storedOutput.rawPrefix,
			streamedDisplay: true
		});
		if (!this.shouldEmitToolOutput()) return;
		if (this.transcriptProgressSuppressedIds.has(itemId) || !shouldEmitTranscriptToolProgress(toolName)) return;
		const state = this.resultOutputDeltaState.get(itemId) ?? {
			chars: 0,
			messages: 0,
			truncated: false
		};
		if (state.truncated) return;
		const remainingChars = Math.max(0, TOOL_PROGRESS_OUTPUT_MAX_CHARS - state.chars);
		const chunk = delta.length > remainingChars ? truncateUtf16Safe(delta, remainingChars) : delta;
		state.chars += chunk.length;
		state.messages += 1;
		const reachedLimit = delta.length > remainingChars || state.chars >= TOOL_PROGRESS_OUTPUT_MAX_CHARS || state.messages >= MAX_TOOL_OUTPUT_DELTA_MESSAGES_PER_ITEM;
		if (reachedLimit) state.truncated = true;
		this.resultOutputDeltaState.set(itemId, state);
		this.emitToolResultMessage({
			itemId,
			text: formatNativeToolOutput(toolName, void 0, reachedLimit ? `${chunk}\n...(truncated)...` : chunk)
		});
	}
	recordNativeToolError(params) {
		const executionStarted = params.status !== "blocked";
		const mutatingAction = executionStarted && isMutatingNativeToolItem(params.item);
		const isFailure = isNonSuccessItemStatus(params.status);
		const approvalTimeoutExplanation = this.approvalTimeoutExplanation(params.item.id, params.status);
		const error = isFailure ? approvalTimeoutExplanation ?? itemToolError(params.item, params.status, this.output.textByItem) : void 0;
		const failure = error ? {
			...approvalTimeoutExplanation ? { errorCode: "approval_timeout" } : {},
			error,
			...approvalTimeoutExplanation ? { timedOut: true } : {}
		} : {};
		const terminalResolution = this.params.observeToolTerminal?.({
			toolCallId: params.item.id,
			toolName: params.name,
			arguments: itemToolArgs(params.item),
			...params.meta ? { meta: params.meta } : {},
			executionStarted,
			outcome: isFailure ? "failure" : "success",
			...isFailure ? { failure } : {},
			nativeMutation: {
				mutatingAction,
				replaySafe: !mutatingAction
			}
		});
		if (terminalResolution) {
			this.lastNativeToolError = terminalResolution.lastToolError;
			return;
		}
		if (isFailure) this.lastNativeToolError = {
			toolName: params.name,
			...params.meta ? { meta: params.meta } : {},
			...failure,
			...mutatingAction ? { mutatingAction: true } : {}
		};
		else if (this.lastNativeToolError?.mutatingAction !== true) this.lastNativeToolError = void 0;
	}
	emitToolResultSummary(item) {
		if (!item || item.type === "dynamicToolCall") return;
		if (!this.params.onToolResult || !this.shouldEmitToolResult()) return;
		if (this.resultSummaryItemIds.has(item.id)) return;
		const toolName = itemName(item);
		const args = itemToolArgs(item);
		if (!toolName || !shouldEmitTranscriptToolProgress(toolName)) return;
		this.resultSummaryItemIds.add(item.id);
		const meta = this.shouldIncludeFormattedMeta(isCommandBearingToolItem(item, args)) ? itemMeta(item, this.toolProgressDetailMode()) : void 0;
		this.emitToolResultMessage({
			itemId: item.id,
			text: formatNativeToolSummary(toolName, meta)
		});
	}
	emitToolResultOutput(item) {
		if (!item || item.type === "dynamicToolCall") return;
		if (!this.params.onToolResult || !this.shouldEmitToolOutput()) return;
		if (this.resultOutputItemIds.has(item.id) || this.resultOutputDeltaState.has(item.id)) return;
		const toolName = itemName(item);
		const output = itemOutputText(item, this.output.textByItem);
		if (!toolName || !output || !shouldEmitTranscriptToolProgress(toolName)) return;
		const meta = this.shouldIncludeFormattedMeta(isCommandBearingToolItem(item, itemToolArgs(item))) ? itemMeta(item, this.toolProgressDetailMode()) : void 0;
		this.emitToolResultMessage({
			itemId: item.id,
			text: formatNativeToolOutput(toolName, meta, output),
			finalOutput: true,
			isError: isNonSuccessItemStatus(itemStatus(item))
		});
	}
	recordToolMeta(item) {
		if (!item) return;
		if (isSideEffectingNativeToolItem(item)) this.sideEffectingNativeIds.add(item.id);
		else this.sideEffectingNativeIds.delete(item.id);
		const toolName = itemName(item);
		if (!toolName) return;
		const meta = itemMeta(item, this.toolProgressDetailMode());
		const existing = this.metas.get(item.id);
		const terminalStatus = auditNativeToolTerminalStatus(item);
		const isError = typeof existing?.isError === "boolean" ? existing.isError : terminalStatus === "completed" ? false : terminalStatus === "failed" || terminalStatus === "blocked" ? true : void 0;
		this.metas.set(item.id, {
			toolName,
			...meta ? { meta } : {},
			...existing?.asyncStarted ? { asyncStarted: true } : {},
			...isError === void 0 ? {} : { isError }
		});
	}
	recordTranscriptCall(params) {
		if (!shouldEmitTranscriptToolProgress(params.name)) this.transcriptProgressSuppressedIds.add(params.id);
		else this.transcriptProgressSuppressedIds.delete(params.id);
		this.emitTranscriptToolCallProgress(params);
	}
	matchesEcho(text) {
		for (const state of this.echoesByItem.values()) {
			if (state.streamedDisplayText === text || state.displayTexts.includes(text)) return true;
			if (state.streamedRawSignature && text.length === state.streamedRawSignature.length && text.startsWith(state.streamedRawSignature.prefix)) return true;
			for (const signature of state.rawSignatures) if (text.length === signature.length && text.startsWith(signature.prefix)) return true;
		}
		return false;
	}
	rememberCommandAggregateOutputEcho(item) {
		if (item?.type !== "commandExecution" || typeof item.aggregatedOutput !== "string") return;
		const signature = toolOutputRawEchoSignature(item.aggregatedOutput);
		if (signature) this.rememberEcho(item.id, signature);
	}
	toolProgressDetailMode() {
		return resolveCodexToolProgressDetailMode(this.params.toolProgressDetail);
	}
	emitToolResultMessage(params) {
		const rawText = params.text.trim();
		const text = truncateNativeToolTranscriptText(rawText, "Codex");
		if (!text) return;
		this.rememberEcho(params.itemId, {
			displayText: text,
			rawText
		});
		if (params.finalOutput) this.resultOutputItemIds.add(params.itemId);
		try {
			Promise.resolve(this.params.onToolResult?.({
				text,
				...(this.params.messageChannel || this.params.messageProvider) && { channelData: { openclawToolProgressId: `tool:${params.itemId}` } },
				...params.isError === true ? { isError: true } : {}
			})).catch(() => {});
		} catch {}
	}
	shouldEmitToolResult() {
		return typeof this.params.shouldEmitToolResult === "function" ? this.params.shouldEmitToolResult() : this.params.verboseLevel === "on" || this.params.verboseLevel === "full";
	}
	shouldEmitToolOutput() {
		return typeof this.params.shouldEmitToolOutput === "function" ? this.params.shouldEmitToolOutput() : this.params.verboseLevel === "full";
	}
	shouldIncludeFormattedMeta(commandBearing) {
		const channel = this.params.messageChannel ?? this.params.messageProvider;
		return !commandBearing || !channel && this.shouldEmitToolOutput();
	}
	emitTranscriptToolCallProgress(params) {
		if (params.name === "progress_card" || !shouldEmitTranscriptToolProgress(params.name)) return;
		this.transcriptProgressCallIds.add(params.id);
		const args = asNonArrayRecord(params.arguments);
		const meta = this.shouldIncludeFormattedMeta(isCodexCommandBearingToolCall(params.name, args)) ? inferToolMetaFromArgs(params.name, args, { detailMode: this.toolProgressDetailMode() }) : void 0;
		if (!this.params.onToolResult || !this.shouldEmitToolResult() || this.resultSummaryItemIds.has(params.id) || this.resultOutputDeltaState.has(params.id)) return;
		this.resultSummaryItemIds.add(params.id);
		this.emitToolResultMessage({
			itemId: params.id,
			text: formatNativeToolSummary(params.name, meta)
		});
	}
	recordTranscriptResult(params) {
		if (params.name === "progress_card" && !params.isError || this.transcriptProgressSuppressedIds.has(params.id) || !shouldEmitTranscriptToolProgress(params.name)) return;
		if (params.name === "progress_card" && this.shouldEmitToolResult()) this.emitToolResultMessage({
			itemId: params.id,
			text: formatNativeToolSummary(params.name),
			isError: true
		});
		if (!this.transcriptProgressCallIds.has(params.id)) this.emitTranscriptToolCallProgress({
			id: params.id,
			name: params.name,
			arguments: {}
		});
		if (!this.params.onToolResult || !this.shouldEmitToolOutput() || this.resultOutputItemIds.has(params.id) || this.resultOutputDeltaState.has(params.id)) return;
		const text = params.text?.trim();
		if (text) this.emitToolResultMessage({
			itemId: params.id,
			text: formatNativeToolOutput(params.name, void 0, text),
			finalOutput: true,
			isError: params.isError
		});
	}
	rememberEcho(itemId, signature) {
		if (!itemId) return;
		const existing = this.echoesByItem.get(itemId) ?? {
			displayTexts: [],
			rawSignatures: []
		};
		const displayText = signature.displayText?.trim();
		if (displayText) {
			if (signature.streamedDisplay) existing.streamedDisplayText = displayText;
			else if (!existing.displayTexts.includes(displayText)) {
				if (existing.displayTexts.length >= TOOL_PROGRESS_ECHO_SIGNATURE_CAP) existing.displayTexts.shift();
				existing.displayTexts.push(displayText);
			}
		}
		const rawText = signature.rawText?.trim();
		const rawLength = signature.rawLength ?? rawText?.length;
		const rawPrefix = signature.rawPrefix?.trim() ?? rawText;
		if (rawLength !== void 0 && rawPrefix && rawPrefix.length >= 1024) {
			const next = {
				length: rawLength,
				prefix: rawPrefix.slice(0, TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS)
			};
			if (signature.streamedDisplay) existing.streamedRawSignature = next;
			else {
				const matchIndex = existing.rawSignatures.findIndex((entry) => entry.prefix === next.prefix);
				if (matchIndex >= 0) existing.rawSignatures[matchIndex] = next;
				else {
					if (existing.rawSignatures.length >= TOOL_PROGRESS_ECHO_SIGNATURE_CAP) existing.rawSignatures.shift();
					existing.rawSignatures.push(next);
				}
			}
		}
		this.echoesByItem.set(itemId, existing);
	}
};
//#endregion
//#region extensions/codex/src/app-server/event-projector-code-mode.ts
const IDENTIFIER = /[A-Za-z_$][\w$]*/u.source;
const STRING = /"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|`(?:\\[\s\S]|[^`\\])*`/u.source;
const SCALAR = `(?:${STRING}|-?(?:0|[1-9]\\d*)(?:\\.\\d+)?(?:[eE][+-]?\\d+)?|true|false|null)`;
const PROPERTY = `(?:${IDENTIFIER}|${STRING})\\s*:\\s*${SCALAR}`;
const INPUT = `(?:${STRING}|\\{\\s*(?:${PROPERTY}(?:\\s*,\\s*${PROPERTY})*\\s*,?)?\\s*\\})`;
const NATIVE_CALL = `await\\s+tools\\.(?<tool>apply_patch|exec_command)\\(\\s*(?<input>${INPUT}|${IDENTIFIER})\\s*\\)`;
const SEPARATOR = `\\s*(?:;|[\\r\\n])\\s*`;
const WRAPPER = new RegExp(`^\\s*(?://[^\\r\\n]*\\r?\\n\\s*)*(?:(?:const|let)\\s+(?<inputName>${IDENTIFIER})\\s*=\\s*(?<literal>${INPUT})${SEPARATOR})?(?:text\\(\\s*${NATIVE_CALL}\\s*\\)|(?:const|let)\\s+(?<resultName>${IDENTIFIER})\\s*=\\s*await\\s+tools\\.(?<boundTool>apply_patch|exec_command)\\(\\s*(?<boundInput>${INPUT}|${IDENTIFIER})\\s*\\)${SEPARATOR}text\\(\\s*\\k<resultName>\\s*\\))\\s*;?\\s*$`, "u");
function readStringLiteral(literal) {
	const quote = literal[0];
	let body = literal.slice(1, -1);
	if (quote !== "`" && /[\r\n]/u.test(body) || quote === "`" && body.includes("${")) throw new Error("not a static string");
	if (quote === "`") body = body.replace(/\r\n?/gu, "\n");
	return JSON.parse(`"${body.replace(/\\[\s\S]|["\r\n\t]/gu, (token) => token === "\\'" || token === "\\`" ? token.slice(1) : token.startsWith("\\") ? token : JSON.stringify(token).slice(1, -1))}"`);
}
function readLiteral(input) {
	if (!input.startsWith("{")) return readStringLiteral(input);
	const properties = new RegExp(`(${IDENTIFIER}|${STRING})\\s*:\\s*(${SCALAR})`, "gu");
	const entries = [];
	for (const match of input.matchAll(properties)) {
		const key = /^["'`]/u.test(match[1]) ? readStringLiteral(match[1]) : match[1];
		if (key === "__proto__") return;
		const value = match[2];
		entries.push([key, /^["'`]/u.test(value) ? readStringLiteral(value) : JSON.parse(value)]);
	}
	return Object.fromEntries(entries);
}
/** A literal input binding, one awaited native call, and its unmodified text output. */
function readCodeModeNativeCall(source) {
	if (typeof source !== "string") return;
	const match = WRAPPER.exec(source)?.groups;
	if (!match || [match.inputName, match.resultName].some((name) => name === "tools" || name === "text") || match.inputName && match.inputName === match.resultName) return;
	const operand = match.input ?? match.boundInput;
	if (!operand || match.inputName && operand !== match.inputName) return;
	try {
		compileFunction(`"use strict"; return async () => {\n${source}\n};`);
		const input = readLiteral(match.literal ?? operand);
		const tool = match.tool ?? match.boundTool;
		if (tool === "apply_patch" && typeof input === "string" && /^\*\*\* Begin Patch\r?\n[\s\S]*\r?\n\*\*\* End Patch(?:\r?\n)?$/u.test(input)) return {
			name: "apply_patch",
			arguments: { input }
		};
		if (tool === "exec_command" && isJsonObject(input) && typeof input.cmd === "string" && (input.workdir === void 0 || typeof input.workdir === "string")) return {
			name: "bash",
			arguments: {
				command: input.cmd,
				...typeof input.workdir === "string" ? { cwd: input.workdir } : {}
			}
		};
	} catch {}
}
function codeModeCommandFailed(output) {
	try {
		const result = JSON.parse(output);
		return isJsonObject(result) && typeof result.output === "string" && typeof result.wall_time_seconds === "number" && typeof result.exit_code === "number" && Number.isInteger(result.exit_code) && result.exit_code !== 0 && result.session_id === void 0;
	} catch {
		return false;
	}
}
//#endregion
//#region extensions/codex/src/app-server/local-runtime-attribution.ts
const OPENAI_PROVIDER_ID = "openai";
const OPENAI_RESPONSES_API = "openai-responses";
const OPENAI_CODEX_RESPONSES_API = "openai-chatgpt-responses";
function resolveCodexLocalRuntimeAttribution(params) {
	const authProfileProvider = normalizeLowercaseStringOrEmpty(params.runtimePlan?.auth?.authProfileProviderForAuth);
	if (normalizeLowercaseStringOrEmpty(params.runtimePlan?.observability.harnessId) === "codex" && authProfileProvider !== OPENAI_PROVIDER_ID && normalizeLowercaseStringOrEmpty(params.model.provider) === OPENAI_PROVIDER_ID && normalizeLowercaseStringOrEmpty(params.model.api) === OPENAI_RESPONSES_API) return {
		provider: OPENAI_PROVIDER_ID,
		api: OPENAI_CODEX_RESPONSES_API
	};
	return {
		provider: params.provider,
		api: params.model.api
	};
}
//#endregion
//#region extensions/codex/src/app-server/event-projector-tool-transcript.ts
const MISSING_TOOL_RESULT_ERROR = "OpenClaw recorded a native Codex tool.call without a matching tool.result before the turn completed.";
const NATIVE_PATCH_REJECTION_RE = /^\s*patch rejected:\s*writing outside of the project;\s*rejected by user approval settings\s*$/iu;
const NATIVE_COMMAND_WORKSPACE_REJECTION_RE = /^\s*command rejected:\s*writing outside of the project;\s*rejected by user approval settings\s*$/iu;
const CODE_MODE_RESULT_RE = /^\s*Script (completed|failed)\s*\r?\nWall time\s+\d+(?:\.\d+)?\s+seconds\s*\r?\nOutput:\s*([\s\S]*?)\s*$/iu;
const MAX_TOOL_APPROVAL_REVIEWS = 16;
function toolApprovalReviewOutcome(state) {
	return state.denied ? "denied" : state.unresolvedReviewIds === null || state.unresolvedReviewIds.size > 0 ? "reviewing" : "approved";
}
var CodexToolTranscriptProjection = class {
	constructor(params, threadId, turnId, progress, nextTranscriptTimestamp, options = {}) {
		this.params = params;
		this.threadId = threadId;
		this.turnId = turnId;
		this.progress = progress;
		this.nextTranscriptTimestamp = nextTranscriptTimestamp;
		this.options = options;
		this.messages = [];
		this.resultIds = /* @__PURE__ */ new Set();
		this.namesById = /* @__PURE__ */ new Map();
		this.trajectoryResultIds = /* @__PURE__ */ new Set();
		this.trajectoryNamesById = /* @__PURE__ */ new Map();
		this.trajectoryItemsById = /* @__PURE__ */ new Map();
		this.afterToolCallObservedItemIds = /* @__PURE__ */ new Set();
		this.nativeMcpAppResultDetails = /* @__PURE__ */ new Map();
		this.approvalReviewsByCallId = /* @__PURE__ */ new Map();
		this.rawNativeToolOutputByCallId = /* @__PURE__ */ new Map();
		this.pendingRawOutputIds = /* @__PURE__ */ new Set();
		this.rawCallsById = /* @__PURE__ */ new Map();
		this.codeModeNativeCallsByCallId = /* @__PURE__ */ new Map();
	}
	get transcriptMessages() {
		return this.messages;
	}
	recordToolApprovalReview(toolCallId, reviewId, status, review) {
		const state = this.approvalReviewsByCallId.get(toolCallId) ?? {
			reviews: [],
			denied: false,
			unresolvedReviewIds: /* @__PURE__ */ new Set()
		};
		state.reviews = [...state.reviews.filter((candidate) => candidate.id !== reviewId), review].slice(-16);
		state.denied ||= [
			"denied",
			"timed_out",
			"aborted"
		].includes(status);
		const unresolved = state.unresolvedReviewIds;
		if (status === "in_progress") state.unresolvedReviewIds = unresolved && (unresolved.size < MAX_TOOL_APPROVAL_REVIEWS || unresolved.has(reviewId)) ? unresolved.add(reviewId) : null;
		else unresolved?.delete(reviewId);
		this.approvalReviewsByCallId.set(toolCallId, state);
		return toolApprovalReviewOutcome(state);
	}
	finalizeToolApprovalReviews(toolCallId) {
		const state = this.approvalReviewsByCallId.get(toolCallId);
		if (!state) return;
		state.unresolvedReviewIds = /* @__PURE__ */ new Set();
		return toolApprovalReviewOutcome(state);
	}
	recordDynamicToolCall(params) {
		this.recordToolCall({
			id: params.callId,
			name: params.tool,
			arguments: sanitizeCodexToolArguments(params.arguments)
		});
	}
	recordDynamicToolResult(params, resultContentSource) {
		this.recordToolResult({
			id: params.callId,
			name: params.tool,
			text: collectDynamicToolContentText(params.contentItems),
			isError: !params.success,
			details: params.details,
			...resultContentSource ? { resultContentSource } : {}
		});
	}
	recordNativeToolCall(item) {
		if (item) {
			const call = this.nativeTranscriptCall(item);
			if (!call) return;
			const name = call.name;
			for (const pending of this.codeModeNativeCallsByCallId.values()) if (pending.call.name === name) pending.nativeItemObserved = true;
			this.recordToolCall(call);
		}
	}
	recordNativeToolResult(item, details) {
		if (!item || this.resultIds.has(item.id)) return;
		const call = this.nativeTranscriptCall(item);
		if (!call) return;
		const status = itemStatus(item);
		const approvalTimeoutExplanation = this.progress.approvalTimeoutExplanation(item.id, status);
		this.recordToolResult({
			id: item.id,
			name: call.name,
			text: approvalTimeoutExplanation ?? this.rawNativeToolOutputByCallId.get(item.id) ?? itemTranscriptResultText(item, this.progress.outputTextByItem),
			isError: isNonSuccessItemStatus(status),
			...item.type === "commandExecution" && item.aggregatedOutput == null && this.progress.isOutputTruncated(item.id) ? { captureTruncated: true } : {},
			details,
			...item.type === "webSearch" ? { resultContentSource: "network" } : {}
		});
		this.progress.approvalTimeoutKinds.delete(item.id);
	}
	nativeTranscriptCall(item) {
		if (item.type === "collabAgentToolCall" || item.type === "subAgentActivity") return this.rawCallsById.get(item.id);
		const name = itemName(item);
		return isProjectedNativeToolItem(item) && name ? {
			id: item.id,
			name,
			arguments: itemToolArgs(item)
		} : void 0;
	}
	recordRawNativeToolItem(item) {
		const type = readStringField(item, "type");
		const callId = readStringField(item, "call_id") ?? readStringField(item, "callId");
		if (!callId) return;
		if ((type === "custom_tool_call" || type === "function_call") && typeof item.name === "string") {
			this.rawCallsById.set(callId, {
				id: callId,
				name: item.name,
				arguments: type === "custom_tool_call" ? { input: item.input } : { arguments: item.arguments }
			});
			this.pendingRawOutputIds.add(callId);
		}
		if ((type === "custom_tool_call" || type === "function_call") && (item.name === "apply_patch" || item.name === "exec_command" || item.name === "exec")) {
			let args;
			if (type === "custom_tool_call" && item.name === "apply_patch" && typeof item.input === "string") args = { input: item.input };
			else if (type === "custom_tool_call" && item.name === "exec") {
				const call = readCodeModeNativeCall(item.input);
				if (call) this.codeModeNativeCallsByCallId.set(callId, {
					call,
					nativeItemObserved: false
				});
				return;
			} else if (type === "function_call" && typeof item.arguments === "string") try {
				const parsed = JSON.parse(item.arguments);
				if (isJsonObject(parsed)) {
					if (item.name === "apply_patch") args = parsed;
					else {
						const patch = readInterceptedNativePatchInput(readStringField(parsed, "cmd") ?? readStringField(parsed, "command"));
						if (patch) {
							const workdir = readStringField(parsed, "workdir") ?? readStringField(parsed, "cwd");
							const cwd = patch.cwd ? workdir && !path.isAbsolute(patch.cwd) ? path.join(workdir, patch.cwd) : patch.cwd : workdir;
							args = {
								input: patch.input,
								...cwd ? { cwd } : {}
							};
						}
					}
				}
			} catch {
				return;
			}
			if (args) {
				this.pendingRawOutputIds.add(callId);
				this.recordToolCall({
					id: callId,
					name: "apply_patch",
					arguments: args
				});
			}
			return;
		}
		if (type !== "custom_tool_call_output" && type !== "function_call_output") return;
		this.pendingRawOutputIds.delete(callId);
		const text = readCodexResponseOutput(item);
		if (text === void 0) return;
		this.rawNativeToolOutputByCallId.set(callId, text);
		const rawCall = this.rawCallsById.get(callId);
		const responseText = typeof item.output === "string" ? item.output : collectDynamicToolContentText(item.output);
		const execution = rawCall?.name === "exec" || rawCall?.name === "wait" ? CODE_MODE_RESULT_RE.exec(responseText) : null;
		const codeModeCall = this.codeModeNativeCallsByCallId.get(callId);
		this.codeModeNativeCallsByCallId.delete(callId);
		if (codeModeCall && !codeModeCall.nativeItemObserved) {
			if (execution?.[1]?.toLowerCase() === "failed" || execution?.[1]?.toLowerCase() === "completed" && codeModeCall.call.name === "bash" && codeModeCommandFailed(execution[2] ?? "")) {
				const failure = execution?.[2]?.replace(/^Script error:\s*/iu, "").trim() || text;
				this.recordToolCall({
					id: callId,
					...codeModeCall.call
				});
				this.recordToolResult({
					id: callId,
					name: codeModeCall.call.name,
					text: failure,
					isError: true
				});
				return;
			}
		}
		const result = this.messages.find((message) => message.role === "toolResult" && message.toolCallId === callId);
		if (!result) {
			if (!this.namesById.has(callId) && rawCall) {
				const isCommandFallback = type === "function_call_output" && rawCall.name === "exec_command";
				const name = isCommandFallback ? "bash" : rawCall.name;
				let args = rawCall.arguments;
				if (isCommandFallback && isJsonObject(args) && typeof args.arguments === "string") try {
					const parsed = JSON.parse(args.arguments);
					if (isJsonObject(parsed)) {
						const cwd = readStringField(parsed, "workdir") ?? readStringField(parsed, "cwd");
						args = {
							command: readStringField(parsed, "cmd") ?? readStringField(parsed, "command"),
							...cwd !== void 0 ? { cwd } : {}
						};
					}
				} catch {}
				const commandWorkspaceRejected = isCommandFallback && NATIVE_COMMAND_WORKSPACE_REJECTION_RE.test(text);
				this.recordToolCall({
					...rawCall,
					name,
					arguments: args
				});
				this.recordToolResult({
					id: callId,
					name,
					text,
					isError: commandWorkspaceRejected || execution?.[1]?.toLowerCase() === "failed",
					...!execution && !commandWorkspaceRejected ? { outcomeUnknown: true } : {}
				});
			} else if (this.namesById.get(callId) === "apply_patch" && NATIVE_PATCH_REJECTION_RE.test(text)) this.recordToolResult({
				id: callId,
				name: "apply_patch",
				text,
				isError: true
			});
			return;
		}
		result.content = this.createToolResultMessage({
			id: callId,
			name: result.toolName,
			text,
			isError: result.isError
		}).content;
		const metadata = Reflect.get(result, "__openclaw");
		Reflect.set(result, "__openclaw", {
			...isJsonObject(metadata) ? metadata : {},
			toolOutput: {
				source: "provider-response",
				modelInput: "unverified"
			}
		});
	}
	async prepareNativeToolResultDetails(item) {
		const preparedDetails = await this.prepareNativeMcpAppResultDetails(item);
		const approvalReviewState = item ? this.approvalReviewsByCallId.get(item.id) : void 0;
		const reviewDetails = approvalReviewState ? {
			approvalReviews: approvalReviewState.reviews,
			approvalReviewOutcome: toolApprovalReviewOutcome(approvalReviewState)
		} : void 0;
		return reviewDetails ? isJsonObject(preparedDetails) ? {
			...preparedDetails,
			...reviewDetails
		} : {
			...preparedDetails !== void 0 ? { toolDetails: preparedDetails } : {},
			...reviewDetails
		} : preparedDetails;
	}
	async prepareNativeMcpAppResultDetails(item) {
		if (!item || item.type !== "mcpToolCall" || itemStatus(item) === "running") return;
		if (this.nativeMcpAppResultDetails.has(item.id)) return this.nativeMcpAppResultDetails.get(item.id);
		if (!this.options.prepareNativeMcpAppResultDetails) return;
		this.nativeMcpAppResultDetails.set(item.id, void 0);
		try {
			const details = await this.options.prepareNativeMcpAppResultDetails(item);
			if (details !== void 0) this.nativeMcpAppResultDetails.set(item.id, details);
			return details;
		} catch (error) {
			embeddedAgentLog.debug("codex native MCP App preview preparation failed", {
				itemId: item.id,
				error
			});
			return;
		}
	}
	recordTrajectoryEvent(params) {
		if (params.phase === "start") {
			this.trajectoryNamesById.set(params.item.id, params.name);
			this.trajectoryItemsById.set(params.item.id, params.item);
			this.options.trajectoryRecorder?.recordEvent("tool.call", {
				threadId: this.threadId,
				turnId: this.turnId,
				itemId: params.item.id,
				toolCallId: params.item.id,
				name: params.name,
				arguments: params.args
			});
			return;
		}
		this.trajectoryResultIds.add(params.item.id);
		const toolResult = itemToolResult(params.item);
		const output = this.progress.approvalTimeoutExplanation(params.item.id, params.status) ?? itemOutputText(params.item, this.progress.outputTextByItem);
		this.options.trajectoryRecorder?.recordEvent("tool.result", {
			threadId: this.threadId,
			turnId: this.turnId,
			itemId: params.item.id,
			toolCallId: params.item.id,
			name: params.name,
			status: params.status,
			isError: isNonSuccessItemStatus(params.status),
			...toolResult ? { result: toolResult } : {},
			...output ? { output } : {}
		});
	}
	emitAfterToolCallObservation(item) {
		if (!this.shouldEmitAfterToolCallObservation(item)) return;
		const name = itemName(item);
		const status = itemStatus(item);
		if (!name || status === "running") return;
		this.afterToolCallObservedItemIds.add(item.id);
		const result = itemToolResult(item);
		const error = this.progress.approvalTimeoutExplanation(item.id, status) ?? itemToolError(item, status, this.progress.outputTextByItem);
		const startedAt = resolveStartedAtFromDurationMs(item.durationMs);
		const hookParams = {
			toolName: name,
			toolCallId: item.id,
			runId: this.params.runId,
			agentId: this.params.agentId,
			sessionId: this.params.sessionId,
			sessionKey: this.params.sessionKey,
			startArgs: itemToolArgs(item) ?? {},
			...result !== void 0 ? { result } : {},
			...error ? { error } : {},
			...startedAt !== void 0 ? { startedAt } : {}
		};
		setImmediate(() => {
			runAgentHarnessAfterToolCallHook(hookParams);
		});
	}
	synthesizeMissingToolResults(params) {
		if (!params.synthesize) return;
		const missingTranscript = [...this.namesById].filter(([id]) => !this.resultIds.has(id));
		const missingTrajectory = [...this.trajectoryNamesById].filter(([id]) => !this.trajectoryResultIds.has(id));
		if (missingTranscript.length === 0 && missingTrajectory.length === 0) return;
		for (const [id, name] of missingTranscript) {
			const processId = params.retainedCommands?.get(id);
			this.recordToolResult({
				id,
				name,
				text: processId ? formatRetainedCommandResult(processId) : formatMissingToolResultError({
					id,
					name
				}),
				isError: !processId,
				...processId ? { outcomeUnknown: true } : {},
				details: processId ? {
					status: "running",
					processId
				} : { reason: "missing_tool_result" }
			});
		}
		for (const [id, name] of missingTrajectory) {
			this.trajectoryResultIds.add(id);
			const processId = params.retainedCommands?.get(id);
			const text = processId ? formatRetainedCommandResult(processId) : formatMissingToolResultError({
				id,
				name
			});
			this.options.trajectoryRecorder?.recordEvent("tool.result", {
				threadId: this.threadId,
				turnId: this.turnId,
				itemId: id,
				toolCallId: id,
				name,
				status: processId ? "running" : "failed",
				isError: !processId,
				result: processId ? {
					status: "running",
					processId
				} : {
					status: "failed",
					reason: "missing_tool_result"
				},
				output: text
			});
		}
		if (params.terminalDisposition === "tool_error") {
			this.recordMissingToolError([...missingTranscript, ...missingTrajectory]);
			return;
		}
		if (params.terminalDisposition === "diagnostic_only") return;
		const missingCount = new Set([...missingTranscript, ...missingTrajectory].map(([id]) => id)).size;
		return missingCount === 1 ? MISSING_TOOL_RESULT_ERROR : `${MISSING_TOOL_RESULT_ERROR} missingToolResultCount=${missingCount}`;
	}
	async readMirroredSessionMessages(signal) {
		return await readCodexMirroredSessionHistoryMessages({
			agentId: this.params.agentId,
			sessionFile: this.params.sessionFile,
			sessionId: this.params.sessionId,
			sessionKey: this.params.sessionKey,
			sessionTarget: this.params.sessionTarget
		}, void 0, signal, this.params.contextTokenBudget) ?? [];
	}
	recordToolCall(params) {
		if (!params.id || !params.name || this.namesById.has(params.id)) return;
		this.namesById.set(params.id, params.name);
		this.progress.recordTranscriptCall(params);
		const message = attachCodexMirrorIdentity(this.createToolCallMessage(params), `${this.turnId}:tool:${params.id}:call`);
		this.messages.push(message);
		this.options.checkpointMessage?.({ read: () => message });
	}
	recordToolResult(params) {
		if (!params.id || !params.name || this.resultIds.has(params.id)) return;
		this.resultIds.add(params.id);
		this.progress.recordTranscriptResult(params);
		const message = attachCodexMirrorIdentity(this.createToolResultMessage(params), `${this.turnId}:tool:${params.id}:result`);
		this.messages.push(message);
		this.options.checkpointMessage?.({
			read: () => message,
			ready: () => !this.pendingRawOutputIds.has(params.id)
		});
	}
	recordMissingToolError(missing) {
		const first = missing.find(([, name]) => Boolean(name));
		if (!first || !first[0]) return;
		const [firstMissingId, recordedName] = first;
		const name = this.namesById.get(firstMissingId) ?? recordedName;
		const item = this.trajectoryItemsById.get(firstMissingId);
		const meta = item ? itemMeta(item, this.progress.toolProgressDetailMode()) : this.progress.getToolMeta(firstMissingId)?.meta;
		this.progress.setLastToolError({
			toolName: name,
			...meta ? { meta } : {},
			error: formatMissingToolResultError({
				id: firstMissingId,
				name
			}),
			...item && isMutatingNativeToolItem(item) ? { mutatingAction: true } : {}
		});
	}
	shouldEmitAfterToolCallObservation(item) {
		if (!isProjectedNativeToolItem(item) || this.afterToolCallObservedItemIds.has(item.id)) return false;
		return !(this.options.nativePostToolUseRelayEnabled && isNativePostToolUseRelayItem(item));
	}
	createToolCallMessage(params) {
		const attribution = resolveCodexLocalRuntimeAttribution(this.params);
		return createAgentHarnessToolCallMessage({
			...attribution,
			api: attribution.api ?? "openai-chatgpt-responses",
			modelId: this.params.modelId
		}, params, this.nextTranscriptTimestamp());
	}
	createToolResultMessage(params) {
		const response = this.rawNativeToolOutputByCallId.get(params.id);
		return {
			...createAgentHarnessToolResultMessage({
				...params,
				text: response ?? params.text
			}, this.nextTranscriptTimestamp()),
			__openclaw: {
				...params.resultContentSource ? { resultContentSource: params.resultContentSource } : {},
				toolOutput: {
					source: response === void 0 ? "execution" : "provider-response",
					modelInput: "unverified",
					...params.outcomeUnknown ? { outcome: "unknown" } : {},
					...response === void 0 && params.captureTruncated ? { captureTruncated: true } : {}
				}
			}
		};
	}
};
function formatRetainedCommandResult(processId) {
	return `Native command is still running with session handle ${processId}. Its final outcome is not yet available; use the native process-wait tool to collect it.`;
}
function formatMissingToolResultError(params) {
	return `${MISSING_TOOL_RESULT_ERROR} toolCallId=${params.id}; toolName=${params.name}`;
}
function resolveStartedAtFromDurationMs(durationMs) {
	if (typeof durationMs !== "number" || !Number.isFinite(durationMs)) return;
	return asDateTimestampMs(Date.now() - Math.max(0, durationMs));
}
//#endregion
//#region extensions/codex/src/app-server/event-projector-events.ts
/** Downstream event consumers must never corrupt the canonical Codex turn projection. */
function emitCodexAgentEvent(params, event) {
	try {
		emitAgentEvent({
			runId: params.runId,
			stream: event.stream,
			data: event.data,
			...params.sessionKey ? { sessionKey: params.sessionKey } : {}
		});
	} catch (error) {
		embeddedAgentLog.debug("codex app-server global agent event emit failed", { error });
	}
	try {
		const maybePromise = params.onAgentEvent?.(event);
		Promise.resolve(maybePromise).catch((error) => {
			embeddedAgentLog.debug("codex app-server agent event handler rejected", { error });
		});
	} catch (error) {
		embeddedAgentLog.debug("codex app-server agent event handler threw", { error });
	}
}
function guardianActionCommand(action) {
	if (!action) return;
	const directLabel = readStringField(action, "command") ?? readStringField(action, "target") ?? readStringField(action, "toolTitle") ?? readStringField(action, "reason");
	if (directLabel) return directLabel;
	const server = readStringField(action, "connectorName") ?? readStringField(action, "server");
	const tool = readStringField(action, "toolName");
	if (server && tool) return `${server}/${tool}`;
	const argv = Array.isArray(action.argv) ? action.argv.filter((value) => typeof value === "string") : [];
	return argv.length > 0 ? argv.join(" ") : readStringField(action, "program");
}
function normalizeApprovalReviewStatus(status) {
	return status === "inProgress" ? "in_progress" : status === "timedOut" ? "timed_out" : status;
}
const GUARDIAN_TIMEOUT_WARNING = "Automatic approval review timed out while evaluating the requested approval.";
function projectNormalizedToolItem(params) {
	const { item } = params;
	if (!item || !isProjectedNativeToolItem(item)) return;
	const name = itemName(item);
	if (!name) return;
	const status = params.phase === "result" ? itemStatus(item) : "running";
	const args = itemToolArgs(item);
	const commandBearing = isCommandBearingToolItem(item, args);
	const meta = itemMeta(item, params.detailMode);
	const emit = shouldEmitTranscriptToolProgress(name);
	const result = emit && params.phase === "result" ? itemToolResult(item) : void 0;
	return {
		name,
		status,
		args,
		meta,
		event: emit ? {
			stream: "tool",
			data: {
				phase: params.phase,
				name,
				itemId: item.id,
				toolCallId: item.id,
				...meta ? { meta } : {},
				...commandBearing ? { commandBearing: true } : {},
				...params.phase === "start" && args ? { args } : {},
				...params.phase === "result" ? {
					status,
					isError: isNonSuccessItemStatus(status),
					...result ? { result } : {}
				} : {}
			}
		} : void 0
	};
}
var CodexEventProjection = class {
	constructor(provider, threadId, turnId, emitAgentEvent, toolProgress, toolTranscript, onNativeToolResultRecorded) {
		this.provider = provider;
		this.threadId = threadId;
		this.turnId = turnId;
		this.emitAgentEvent = emitAgentEvent;
		this.toolProgress = toolProgress;
		this.toolTranscript = toolTranscript;
		this.onNativeToolResultRecorded = onNativeToolResultRecorded;
		this.reviewCount = 0;
		this.safetyBufferingEnded = false;
	}
	get guardianReviewCount() {
		return this.reviewCount;
	}
	emitCompactionEnd(itemId, completed) {
		this.emitAgentEvent({
			stream: "compaction",
			data: {
				phase: "end",
				backend: "codex-app-server",
				completed,
				threadId: this.threadId,
				turnId: this.turnId,
				itemId
			}
		});
	}
	handleGuardianReview(method, params) {
		this.reviewCount += 1;
		const review = isJsonObject(params.review) ? params.review : void 0;
		const action = isJsonObject(params.action) ? params.action : void 0;
		const reviewId = readStringField(params, "reviewId");
		const targetItemId = readNullableString(params, "targetItemId");
		const command = guardianActionCommand(action);
		const reviewStatus = review ? readStringField(review, "status") : void 0;
		const status = normalizeApprovalReviewStatus(reviewStatus);
		const riskLevel = review ? readStringField(review, "riskLevel") : void 0;
		const userAuthorization = review ? readStringField(review, "userAuthorization") : void 0;
		const rationale = review ? readNullableString(review, "rationale") : void 0;
		const expectedWarning = status === "timed_out" ? GUARDIAN_TIMEOUT_WARNING : rationale && riskLevel && userAuthorization && (status === "approved" || status === "denied") ? `Automatic approval review ${status} (risk: ${riskLevel}, authorization: ${userAuthorization}): ${rationale}` : void 0;
		if (Boolean(targetItemId) && Boolean(reviewId) && this.pendingGuardianWarning === expectedWarning) this.pendingGuardianWarning = void 0;
		else this.flushPendingGuardianWarning();
		const threadId = readStringField(params, "threadId") ?? this.threadId;
		const turnId = readStringField(params, "turnId") ?? this.turnId;
		if (method.endsWith("/started")) this.activeGuardianReview = {
			reviewId,
			targetItemId,
			command,
			threadId,
			turnId
		};
		this.emitAgentEvent({
			stream: "codex_app_server.guardian",
			data: {
				method,
				phase: method.endsWith("/started") ? "started" : "completed",
				threadId,
				turnId,
				reviewId,
				targetItemId,
				decisionSource: readStringField(params, "decisionSource"),
				status: reviewStatus,
				riskLevel,
				userAuthorization,
				rationale,
				actionType: action ? readStringField(action, "type") : void 0,
				command
			}
		});
		if (reviewId && targetItemId && status) {
			const approvalReview = {
				id: reviewId,
				label: "Guardian",
				status,
				...riskLevel ? { riskLevel } : {},
				...userAuthorization ? { userAuthorization } : {},
				...rationale ? { rationale } : {}
			};
			const approvalReviewOutcome = this.toolTranscript.recordToolApprovalReview(targetItemId, reviewId, status, approvalReview);
			this.emitAgentEvent({
				stream: "tool",
				data: {
					phase: "review",
					toolCallId: targetItemId,
					hideFromChannelProgress: true,
					approvalReviewOutcome,
					review: approvalReview
				}
			});
		}
		if (method.endsWith("/completed") && this.activeGuardianReview?.reviewId === reviewId) this.activeGuardianReview = void 0;
	}
	handleGuardianWarning(params) {
		this.flushPendingGuardianWarning();
		const message = readStringField(params, "message");
		if (message) {
			this.pendingGuardianWarning = message;
			return;
		}
		this.emitAgentEvent({
			stream: "codex_app_server.guardian",
			data: {
				phase: "warning",
				message
			}
		});
	}
	handleWarning(params) {
		const message = readCodexAppServerWarningMessage(params);
		if (message) this.emitAgentEvent({
			stream: "notice",
			data: {
				phase: "warning",
				message
			}
		});
	}
	handleModelRerouted(params) {
		const fromModel = readStringField(params, "fromModel");
		const toModel = readStringField(params, "toModel");
		const reason = readStringField(params, "reason");
		this.responseModel = toModel ?? this.responseModel;
		if (fromModel && toModel && fromModel !== toModel) {
			this.emitAgentEvent({
				stream: "lifecycle",
				data: {
					phase: "model",
					provider: this.provider,
					model: toModel
				}
			});
			this.emitAgentEvent({
				stream: "fallback",
				data: {
					fromModel,
					toModel,
					...reason ? { reason } : {}
				}
			});
			if (reason === "highRiskCyberActivity") {
				this.cyberNoticeState = "fallback";
				this.emitCyberNotice("fallback", {
					model: fromModel,
					fallbackModel: toModel
				});
			}
		}
	}
	handleSafetyBuffering(params) {
		if (params.showBufferingUi === false) {
			this.clearSafetyBuffering();
			return;
		}
		if (this.safetyBufferingEnded || this.cyberNoticeState === "blocked" || this.cyberNoticeState === "fallback" || params.showBufferingUi !== true || !Array.isArray(params.useCases) || !params.useCases.includes("cyber")) return;
		this.cyberNoticeState = "buffering";
		const model = readStringField(params, "model");
		const fallbackModel = readStringField(params, "fasterModel");
		this.emitCyberNotice("buffering", {
			...model ? { model } : {},
			...fallbackModel ? { fallbackModel } : {}
		});
	}
	handleCyberPolicyError(codexErrorInfo, model) {
		if (codexErrorInfo !== "cyberPolicy" || this.cyberNoticeState === "blocked") return;
		this.cyberNoticeState = "blocked";
		this.emitCyberNotice("blocked", { model: this.responseModel ?? model });
	}
	endSafetyBuffering() {
		this.safetyBufferingEnded = true;
		this.clearSafetyBuffering();
	}
	markSafetyBufferingAssistantStarted() {
		if (this.cyberNoticeState === "buffering") this.endSafetyBuffering();
	}
	clearSafetyBuffering() {
		if (this.cyberNoticeState !== "buffering") return;
		this.cyberNoticeState = void 0;
		this.emitCyberNotice("cleared");
	}
	emitCyberNotice(state, models = {}) {
		if (this.provider !== "openai") return;
		this.emitAgentEvent({
			stream: "notice",
			data: {
				phase: "provider_policy",
				category: "cyber",
				state,
				provider: "openai",
				...models
			}
		});
	}
	handleRetry(params) {
		const rateLimited = isJsonObject(params.error) && params.error.codexErrorInfo === "rateLimitExceeded";
		this.emitAgentEvent({
			stream: "run_status",
			data: {
				phase: "retrying",
				message: rateLimited ? "Rate limited. The provider is retrying." : "Connection interrupted. The provider is retrying."
			}
		});
	}
	flushPendingGuardianWarning() {
		const pending = this.pendingGuardianWarning;
		if (!pending) return;
		this.pendingGuardianWarning = void 0;
		this.emitAgentEvent({
			stream: "codex_app_server.guardian",
			data: {
				phase: "warning",
				message: pending
			}
		});
	}
	handleStrictReviewRequired(params) {
		this.emitAgentEvent({
			stream: "codex_app_server.guardian",
			data: {
				method: "autoApprovalReview/strictReviewRequired",
				phase: "strict_review_required",
				threadId: readStringField(params, "threadId") ?? this.activeGuardianReview?.threadId ?? this.threadId,
				turnId: readStringField(params, "turnId") ?? this.activeGuardianReview?.turnId ?? this.turnId,
				reviewId: this.activeGuardianReview?.reviewId,
				targetItemId: this.activeGuardianReview?.targetItemId,
				command: this.activeGuardianReview?.command,
				startedAtMs: asFiniteNumber(params.startedAtMs)
			}
		});
	}
	handleHook(method, params) {
		const run = isJsonObject(params.run) ? params.run : void 0;
		if (!run) return;
		const durationMs = asFiniteNumber(run.durationMs);
		const entries = readHookOutputEntries(run.entries);
		const hookTurnId = readNullableString(params, "turnId");
		this.emitAgentEvent({
			stream: "codex_app_server.hook",
			data: {
				phase: method === "hook/started" ? "started" : "completed",
				threadId: this.threadId,
				turnId: hookTurnId === void 0 ? this.turnId : hookTurnId,
				hookRunId: readStringField(run, "id"),
				eventName: readStringField(run, "eventName"),
				handlerType: readStringField(run, "handlerType"),
				executionMode: readStringField(run, "executionMode"),
				scope: readStringField(run, "scope"),
				source: readStringField(run, "source"),
				sourcePath: readStringField(run, "sourcePath"),
				status: readStringField(run, "status"),
				statusMessage: readNullableString(run, "statusMessage"),
				...durationMs !== void 0 ? { durationMs } : {},
				...entries.length > 0 ? { entries } : {}
			}
		});
	}
	emitStandardItemEvent(params) {
		const { item } = params;
		if (!item) return;
		const activity = item.type === "subAgentActivity";
		if (activity && params.phase === "start") return;
		const subagent = activity || item.type === "collabAgentToolCall";
		const kind = subagent ? "tool" : itemKind(item);
		if (!kind) return;
		const name = subagent ? "subagents" : itemName(item);
		const args = itemToolArgs(item);
		const commandBearing = isCommandBearingToolItem(item, args);
		const subagentStatus = readStringField(item, activity ? "kind" : "status");
		const interaction = activity && subagentStatus === "interacted";
		const status = subagent && subagentStatus === "interrupted" ? "failed" : activity ? subagentStatus === "completed" || interaction ? "completed" : "running" : params.phase === "start" ? "running" : kind === "analysis" ? "completed" : unknownItemStatus(item) ? void 0 : itemStatus(item);
		const meta = subagent ? [interaction ? "message sent" : activity ? subagentStatus : status, readStringField(item, activity ? "agentPath" : "tool")].filter(Boolean).join(": ") : itemMeta(item, this.toolProgress.toolProgressDetailMode());
		const suppressChannelProgress = shouldSuppressChannelProgressForItem(item);
		this.emitAgentEvent({
			stream: "item",
			data: projectAgentActivityItem({
				itemId: activity && !interaction ? `subagent:${readStringField(item, "agentThreadId") ?? item.id}` : item.id,
				phase: params.phase,
				kind,
				title: itemTitle(item),
				...status ? { status } : {},
				...status === void 0 ? {
					summary: "Outcome unknown",
					title: `${itemTitle(item)} — outcome unknown`
				} : {},
				toolCallId: item.id,
				...name ? { name } : {},
				...meta ? { meta } : {},
				...commandBearing ? { commandBearing: true } : {},
				...suppressChannelProgress ? { suppressChannelProgress: true } : {}
			}, {
				args,
				...item.type === "collabAgentToolCall" && item.tool === "wait" ? { nativeOperation: "wait" } : {}
			})
		});
	}
	async emitSnapshotOnlyNativeToolProgress(params) {
		const { item, activeItemIds, completedItemIds, isActive } = params;
		if (!isProjectedNativeToolItem(item) || !matchesCodexSnapshotTurn(item, this.turnId) || completedItemIds.has(item.id) || itemStatus(item) === "running") return;
		if (!activeItemIds.has(item.id)) {
			this.emitStandardItemEvent({
				phase: "start",
				item
			});
			await this.emitNormalizedToolItemEvent({
				phase: "start",
				item
			});
		}
		if (!isActive()) return;
		activeItemIds.delete(item.id);
		this.emitStandardItemEvent({
			phase: "end",
			item
		});
		await this.emitNormalizedToolItemEvent({
			phase: "result",
			item
		});
		completedItemIds.add(item.id);
	}
	async emitNormalizedToolItemEvent(params) {
		const projection = projectNormalizedToolItem({
			...params,
			detailMode: this.toolProgress.toolProgressDetailMode()
		});
		if (!projection || !params.item) return;
		const { item } = params;
		const { name, status, args, meta, event } = projection;
		const approvalReviewOutcome = params.phase === "result" ? this.toolTranscript.finalizeToolApprovalReviews(item.id) : void 0;
		if (event && approvalReviewOutcome) event.data.approvalReviewOutcome = approvalReviewOutcome;
		this.toolTranscript.recordTrajectoryEvent({
			phase: params.phase,
			item,
			name,
			args,
			status
		});
		if (params.phase === "result") this.toolProgress.recordNativeToolError({
			item,
			name,
			meta,
			status
		});
		if (event) {
			const activity = projectCodexToolActivity(item, params.phase, meta);
			if (activity && params.phase === "start") this.emitAgentEvent({
				stream: "item",
				data: activity
			});
			this.emitAgentEvent(event);
			if (activity && params.phase !== "start") this.emitAgentEvent({
				stream: "item",
				data: activity
			});
		}
		if (params.phase === "result") {
			this.toolTranscript.emitAfterToolCallObservation(item);
			await this.onNativeToolResultRecorded?.();
		}
	}
};
//#endregion
//#region extensions/codex/src/app-server/native-subagent-turn-observation.ts
var CodexNativeSubagentTurnObservation = class {
	constructor(callbacks) {
		this.callbacks = callbacks;
		this.observationSourceId = randomUUID();
		this.projectedActivityWaits = /* @__PURE__ */ new WeakSet();
	}
	invalidate(childState) {
		this.projectedActivityWaits.delete(childState);
		if (!childState.terminal && childState.activityObserved) this.callbacks.emitTaskEvent(childState, {
			stream: "execution",
			data: {
				state: "unknown",
				sourceId: this.observationSourceId,
				invalidate: true
			}
		});
	}
	markActivityUnknown(childState) {
		this.projectedActivityWaits.delete(childState);
		childState.activityObserved = true;
		this.callbacks.emitTaskEvent(childState, {
			stream: "execution",
			data: {
				state: "unknown",
				sourceId: this.observationSourceId,
				executionId: childState.nativeTurnId
			}
		});
	}
	refreshWaitDependency(childState, receiverThreadId) {
		const activityWait = childState.activityWait;
		if (childState.terminal || childState.nativeTurnState && childState.nativeTurnState !== "active" || this.callbacks.currentChild(childState.childThreadId) !== childState || activityWait?.wait.kind !== "children") return;
		const runId = this.callbacks.dependencyRunId(childState.parentThreadId, receiverThreadId);
		if (!runId) return;
		let changed = false;
		const dependencies = activityWait.wait.dependencies?.map((dependency) => {
			if (dependency.runId === runId || readCodexNativeSubagentRunId(dependency.runId)?.threadId !== receiverThreadId) return dependency;
			changed = true;
			return { runId };
		});
		if (!changed) return;
		const wait = {
			...activityWait.wait,
			dependencies
		};
		childState.activityWait = {
			...activityWait,
			wait
		};
		if (this.projectedActivityWaits.has(childState)) this.observeActivity(childState, "waiting", wait);
	}
	observeActivity(childState, state, wait) {
		if (wait && wait === childState.activityWait?.wait) this.projectedActivityWaits.add(childState);
		else this.projectedActivityWaits.delete(childState);
		childState.activityObserved = true;
		this.callbacks.emitTaskEvent(childState, {
			stream: "execution",
			data: {
				state,
				sourceId: this.observationSourceId,
				...childState.nativeTurnId ? { executionId: childState.nativeTurnId } : {},
				...wait ? { wait } : {}
			}
		});
	}
	emitActivityEvent(child, event) {
		if (!child.activityObserved) this.observeActivity(child, "running");
		this.callbacks.emitTaskEvent(child, event);
	}
	emitChildTaskActivity(notification, childState) {
		const params = isJsonObject(notification.params) ? notification.params : void 0;
		if (!params) return;
		const turn = isJsonObject(params.turn) ? params.turn : void 0;
		const turnId = readStringField(params, "turnId") ?? readStringField(turn, "id");
		if (notification.method === "turn/started") {
			childState.nativeTurnId = turnId;
			childState.nativeTurnState = "active";
			childState.activityWait = void 0;
		} else if (turnId && childState.nativeTurnId && turnId !== childState.nativeTurnId) return;
		else if (turnId && childState.nativeTurnState && childState.nativeTurnState !== "active") return;
		else if (turnId) childState.nativeTurnId ??= turnId;
		const observe = (state, wait) => this.observeActivity(childState, state, wait);
		if (notification.method === "turn/started") {
			observe("running");
			return;
		}
		if (notification.method === "turn/completed") {
			childState.nativeTurnState = readNativeTurnEnd(turn);
			childState.activityWait = void 0;
			observe("unknown");
			const current = this.callbacks.onTurnEnded(childState);
			if (current?.nativeTurnId !== turnId && current?.nativeTurnState === "active") this.emitChildTaskActivity({
				method: "turn/started",
				params: {
					threadId: current.childThreadId,
					turn: { id: current.nativeTurnId }
				}
			}, current);
			return;
		}
		if (notification.method === "thread/status/changed") {
			const status = isJsonObject(params.status) ? params.status : void 0;
			if (status?.type === "active") {
				const flags = Array.isArray(status.activeFlags) ? status.activeFlags : [];
				const wait = flags.includes("waitingOnApproval") ? { kind: "approval" } : flags.includes("waitingOnUserInput") ? { kind: "user_input" } : childState.activityWait?.wait;
				observe(wait ? "waiting" : "running", wait);
			} else if (status?.type === "idle" || status?.type === "notLoaded" || status?.type === "systemError") {
				childState.activityWait = void 0;
				observe("unknown");
			}
			return;
		}
		if (notification.method === "item/agentMessage/delta" || notification.method === "item/reasoning/summaryTextDelta") {
			const delta = readStringField(params, "delta");
			if (delta) this.emitActivityEvent(childState, {
				stream: notification.method === "item/agentMessage/delta" ? "assistant" : "thinking",
				data: { delta }
			});
			return;
		}
		if (notification.method !== "item/started" && notification.method !== "item/completed") return;
		const item = readItem(params.item);
		if (item?.type === "collabAgentToolCall" && normalizeIdentifier(item.tool ?? void 0) === "wait" && Array.isArray(item.receiverThreadIds)) {
			if (notification.method === "item/started") {
				const receivers = [...new Set(readNativeSubagentThreadIds(item.receiverThreadIds).map((id) => id.trim()))];
				const wait = receivers.length > 0 ? {
					kind: "children",
					dependencies: receivers.slice(0, 32).map((id) => ({ runId: this.callbacks.dependencyRunId(childState.parentThreadId, id) ?? codexNativeSubagentRunId(id) })),
					pendingCount: receivers.length
				} : { kind: "agent_messages" };
				childState.activityWait = {
					itemId: item.id,
					wait
				};
				observe("waiting", wait);
			} else if (childState.activityWait?.itemId === item.id) {
				childState.activityWait = void 0;
				observe("running");
			}
			return;
		}
		if (item?.type === "agentMessage" && notification.method === "item/completed" && item.text) this.emitActivityEvent(childState, {
			stream: "assistant",
			data: { text: item.text }
		});
		const projection = projectNormalizedToolItem({
			phase: notification.method === "item/started" ? "start" : "result",
			item
		});
		if (projection?.event) this.emitActivityEvent(childState, projection.event);
	}
};
//#endregion
//#region extensions/codex/src/app-server/native-subagent-monitor.ts
var native_subagent_monitor_exports = /* @__PURE__ */ __exportAll({ codexNativeSubagentMonitorRuntime: () => codexNativeSubagentMonitorRuntime });
var Monitor = class {
	constructor(client, runtime = defaultNativeSubagentMonitorRuntime, options = {}) {
		this.client = client;
		this.runtime = runtime;
		this.parentStates = /* @__PURE__ */ new Map();
		this.retiredParentStates = /* @__PURE__ */ new WeakSet();
		this.childStates = /* @__PURE__ */ new Map();
		this.knownChildren = /* @__PURE__ */ new Map();
		this.childThreadIdsByAgentPath = /* @__PURE__ */ new Map();
		this.parentThreadRetentions = /* @__PURE__ */ new Map();
		this.disposed = false;
		this.interruptModelExecution = options.interruptModelExecution;
		this.admissionCustody = new CodexNativeSubagentAdmissionCustody({
			parentState: (id) => this.parentStates.get(id),
			knownChild: (id) => this.knownChildren.get(id),
			childState: (runId) => this.childStates.get(runId),
			runtime
		});
		this.retainClient = options.retainClient;
		this.retainParentThread = options.retainParentThread;
		this.claimChildThread = options.claimChildThread;
		this.retainChildThread = options.retainChildThread;
		this.releaseChildThread = options.releaseChildThread;
		this.childCloses = new CodexNativeSubagentCloseOwner(client, {
			isParentCurrent: (state) => this.isCurrentParent(state),
			isParentRetired: (state) => this.retiredParentStates.has(state),
			knownChild: (id) => this.knownChildren.get(id),
			currentChild: (id) => this.currentChild(id),
			isRegisteredChild: (child) => this.childStates.get(child.runId) === child,
			captureForget: options.captureChildThreadForget,
			releaseDirectChild: releaseNativeDirectChild,
			clearRecoveryTimers: (child) => this.recovery.clearRecoveryTimers(child),
			markTerminalRevision: (id) => this.recovery.markTerminalRevision(id),
			unregisterChild: (child) => this.unregisterChild(child, { retainSubscription: false }),
			releaseClientRetentionIfIdle: () => this.releaseClientRetentionIfIdle(),
			pruneParent: (state) => this.pruneParentIfUnused(state)
		});
		this.historyRecovery = new CodexNativeSubagentHistoryRecovery(client, {
			getPendingTurnIds: (id) => this.knownChildren.get(id)?.pendingTurns.map((turn) => turn.turnId) ?? [],
			getCurrentAssignmentState: (id) => {
				return {
					runId: this.knownChildren.get(id)?.assignment.runId,
					nativeTurnState: this.currentChild(id)?.nativeTurnState
				};
			}
		});
		this.completionDelivery = new CodexNativeSubagentCompletionDelivery({
			deliver: (params) => runtime.deliverAgentHarnessCompletion(params),
			retryDelaysMs: options.completionDeliveryRetryDelaysMs,
			maxRetries: options.completionDeliveryMaxRetries,
			isCurrentChild: (child) => this.childStates.get(child.runId) === child,
			isCurrentParent: (state) => this.parentStates.get(state.parentThreadId) === state,
			isRetiredParent: (state) => this.retiredParentStates.has(state),
			getParent: (id) => this.parentStates.get(id),
			unregisterChild: (child) => this.unregisterChild(child),
			releaseClientRetentionIfIdle: () => this.releaseClientRetentionIfIdle()
		});
		this.turnObservation = new CodexNativeSubagentTurnObservation({
			emitTaskEvent: (child, event) => this.admissionCustody.emitEvent(child, event),
			currentChild: (id) => this.currentChild(id),
			dependencyRunId: (parentThreadId, childThreadId) => {
				const receiver = this.knownChildren.get(childThreadId);
				return receiver?.parent.parentThreadId === parentThreadId ? receiver.assignment.runId : void 0;
			},
			onTurnEnded: (child) => {
				if (child.nativeTurnState) {
					releaseNativeDirectChild(child);
					releaseNativeModelExecution(child);
				}
				const state = this.parentStates.get(child.parentThreadId);
				return state ? this.recordObservedChildTurn(state, child) : void 0;
			}
		});
		this.recovery = new CodexNativeSubagentRecoveryCoordinator({
			isDisposed: () => this.disposed,
			isRegisteredChild: (child) => this.childStates.get(child.runId) === child,
			currentChild: (id) => this.currentChild(id),
			parentState: (id) => this.parentStates.get(id),
			reconcileChildState: (child) => this.reconcileChildState(child),
			processCompletion: (state, child, completion, eventAt) => this.processCompletion(state, child, completion, eventAt),
			recoveryPollDelaysMs: options.recoveryPollDelaysMs
		});
		this.removeNotificationHandler = client.addNotificationHandler(async (notification) => {
			if (!NATIVE_SUBAGENT_NOTIFICATION_METHODS.has(notification.method)) return;
			const handled = this.handleNotification(notification);
			notifyNativeModelSourceChange(notification.method, this.parentStates.values());
			try {
				await handled;
			} finally {
				notifyNativeModelSourceChange(notification.method, this.parentStates.values());
			}
		});
		this.submissions = new CodexNativeSubagentSubmissionOwner({
			isCurrent: (state) => {
				if (!this.isCurrentParent(state)) return false;
				try {
					state.submissionStore?.assertCurrent();
					return true;
				} catch {
					return false;
				}
			},
			assertPersistenceCurrent: (state) => {
				if (this.retiredParentStates.has(state) || !this.disposed && this.parentStates.get(state.parentThreadId) !== state) throw new Error("Native submission parent generation is no longer current.");
				state.submissionStore?.assertCurrent();
			},
			parentOwner: (state, turnId) => this.resolveParentOwner(state, turnId),
			client: this.client,
			recovery: this.recovery,
			knownChildren: this.knownChildren,
			currentChild: (id) => this.currentChild(id),
			currentModelExecution: (id) => currentNativeModelExecution(id, this.parentStates, this.knownChildren, this.childStates),
			restoreKnownChild: (state, assignment) => this.restoreKnownChild(state, assignment),
			prepareReceiver: (state, threadId) => this.prepareReceiverChild(state, threadId),
			registerChild: (state, assignment, childOptions) => this.registerChildThread(state, assignment, childOptions),
			admitFollowup: (known, id) => this.admitFollowupChild(known, id),
			resumeChild: (child) => this.resumeChild(child),
			completeChild: (notification, child) => this.handleChildTurnCompletion(notification, child),
			retain: (state, threadId) => {
				const releases = [
					this.retainClient?.(),
					this.retainParentThread?.(state.parentThreadId),
					this.retainParentThread?.(threadId)
				];
				let retained = true;
				return () => {
					if (!retained) return;
					retained = false;
					for (const release of releases) release?.();
				};
			},
			hasObservationBacking: options.hasObservationBacking,
			acceptContinuation: (state, owner, threadId, call, modelOwner) => {
				if (!call.submissionId) throw new Error("Codex model input admission requires its accepted submission ID");
				this.observeParentInteraction(state, owner, threadId, void 0, {
					parentTurnId: call.parentTurnId,
					itemId: call.callId,
					modelSourceTurnId: call.submissionId,
					modelOwner
				});
			},
			recordPendingAssignment: (state, receipt, nativeParentThreadId) => this.assignments.recordSubmission(state, receipt, nativeParentThreadId),
			onSettled: (state) => this.pruneParentIfUnused(state),
			recoveryPollDelaysMs: options.recoveryPollDelaysMs
		});
		this.assignments = new CodexNativeSubagentAssignmentInventory({
			assertCurrent: (state) => {
				if (this.retiredParentStates.has(state) || !this.disposed && this.parentStates.get(state.parentThreadId) !== state) throw new Error("Native assignment parent is no longer current.");
				state.assignmentStore?.assertCurrent();
			},
			isCurrent: (state) => this.isCurrentParent(state),
			readHistory: async (assignment) => {
				const revision = this.recovery.retainThreadStatusRevision(assignment.childThreadId);
				try {
					const history = await this.historyRecovery.read({
						...assignment,
						nativeTurnId: assignment.nativeTurnId
					}, {
						resumeInterrupted: assignment.recordedCompletion === void 0,
						predecessorNativeTurnId: assignment.submission?.predecessorNativeTurnId,
						recordedCompletion: assignment.recordedCompletion,
						initialAssignment: !readCodexNativeSubagentRunId(assignment.runId)?.turnId
					});
					return revision.isCurrent() ? history : void 0;
				} finally {
					revision.release();
				}
			},
			restore: async (state, assignment, recovery, custody) => {
				const existing = this.childStates.get(assignment.runId);
				if (existing) {
					const original = this.parentStates.get(existing.parentThreadId);
					if (original && original.requesterSessionKey === state.requesterSessionKey && original.historyOwner && state.historyOwner && matchesNativeAssignmentLifecycle(original.historyOwner, state.historyOwner)) original.assignmentStore = state.assignmentStore;
					return;
				}
				const child = this.registerChildThread(state, {
					runId: assignment.runId,
					childThreadId: assignment.childThreadId,
					nativeTurnId: assignment.nativeTurnId
				}, {
					admitAssignment: true,
					completionCustody: custody,
					historyOwner: assignment.owner,
					nativeParentThreadId: assignment.nativeParentThreadId,
					...recovery.agentPath ? { agentPath: recovery.agentPath } : {}
				});
				if (!child) return;
				child.recoverInitialAssignment = !readCodexNativeSubagentRunId(assignment.runId)?.turnId ? true : void 0;
				this.recordRecoveredChildTurn(state, child, recovery);
				if (recovery.resumable) this.settleResumableChild(child);
				else if (recovery.threadState === "active") this.observeActiveChild(child);
				else await this.processRecoveredCompletion(state, child, recovery);
			},
			onSettled: (state) => this.pruneParentIfUnused(state)
		});
		this.resolveNotificationState = createCodexNativeSubagentNotificationRouter({
			resolveNativeParentState: this.resolveNativeParentState.bind(this),
			parentState: (id) => this.parentStates.get(id),
			currentChild: this.currentChild.bind(this),
			resolveParentOwner: this.resolveParentOwner.bind(this),
			registerChildThread: this.registerChildThread.bind(this),
			registerDirectSpawnChild: this.registerDirectSpawnChild.bind(this),
			observeParentInteraction: this.observeParentInteraction.bind(this),
			acceptInteraction: this.submissions.acceptInteraction.bind(this.submissions),
			observeCall: this.submissions.observeCall.bind(this.submissions)
		});
		this.removeCloseHandler = client.addCloseHandler(() => {
			this.dispose().catch((error) => {
				embeddedAgentLog.warn("Failed to settle Codex native assignments after client closure", { error: formatErrorMessage$1(error) });
			});
		});
	}
	dispose() {
		if (this.disposal) return this.disposal;
		if (this.disposed) return Promise.resolve();
		this.disposed = true;
		this.removeNotificationHandler();
		this.removeCloseHandler();
		for (const childState of this.childStates.values()) {
			try {
				this.turnObservation.invalidate(childState);
			} catch (error) {
				embeddedAgentLog.debug("Native activity invalidation lost its owner", { error: formatErrorMessage$1(error) });
			}
			this.recovery.clearRecoveryTimers(childState);
		}
		const parents = [...this.parentStates.values()];
		for (const state of parents) notifyNativeModelSourceWaiters(state);
		if (!parents.some((state) => this.assignments.hasWrites(state) || this.submissions.hasCustody(state))) {
			this.finishDisposal();
			return this.disposal = Promise.resolve();
		}
		this.disposal = (async () => {
			await Promise.allSettled(parents.flatMap((state) => [this.submissions.drain(state), this.assignments.drain(state)]));
			this.finishDisposal();
			await Promise.allSettled(parents.flatMap((state) => [this.submissions.drain(state), this.assignments.drain(state)]));
		})();
		return this.disposal;
	}
	finishDisposal() {
		this.submissions.dispose();
		for (const childState of this.childStates.values()) {
			releaseNativeDirectChild(childState);
			releaseNativeModelExecution(childState);
			if (childState.terminal && childState.pendingCompletion) {
				this.recovery.clearRecoveryTimers(childState);
				continue;
			}
			this.unregisterChild(childState);
		}
		this.releaseRetainedClient();
		for (const release of this.parentThreadRetentions.values()) release();
		this.parentThreadRetentions.clear();
		for (const state of this.parentStates.values()) {
			for (const owner of state.owners.values()) releaseCompletionCustody(owner);
			releaseNativeParentModelSources(state, this.knownChildren.values());
			state.owners.clear();
			state.turnIds.clear();
			notifyNativeModelSourceWaiters(state);
			this.childCloses.clear(state);
			this.completionDelivery.deliverDetached(state, this.childStates.values());
		}
		this.admissionCustody.retainOnly(() => false);
		for (const [parentThreadId] of this.parentStates) if (![...this.childStates.values()].some((childState) => childState.parentThreadId === parentThreadId)) this.parentStates.delete(parentThreadId);
		for (const known of this.knownChildren.values()) known.pendingTurns.forEach(releaseCompletionCustody);
		this.knownChildren.clear();
		this.childThreadIdsByAgentPath.clear();
	}
	registerParent(params) {
		return registerNativeSubagentParent(params, {
			states: this.parentStates,
			isClosed: () => this.disposed,
			isRetired: (state) => this.retiredParentStates.has(state),
			runtime: this.runtime,
			submissions: this.submissions,
			assignments: this.assignments,
			closes: this.childCloses,
			deliverDetached: (state) => this.completionDelivery.deliverDetached(state, this.childStates.values()),
			drainAdmissions: (state, owner, turnId) => this.drainPendingChildAdmissionEvidence(state, owner, turnId, true),
			clearAdmissions: () => this.clearUnconsumablePendingChildAdmissionEvidence(),
			prune: (state) => this.pruneParentIfUnused(state),
			interruptModelExecution: this.interruptModelExecution
		});
	}
	async captureModelSource(request) {
		const capture = await captureNativeModelSource(request, {
			parents: this.parentStates,
			children: this.childStates,
			knownChildren: this.knownChildren,
			admissions: this.admissionCustody.entries,
			assertInputCurrent: (threadId, owner) => this.submissions.assertModelInputCurrent(threadId, owner),
			hasPendingInput: (input) => this.submissions.hasPendingModelInput(input),
			onExecutionAdmitted: (known, threadId) => {
				this.admitFollowupChild(known, threadId);
			},
			registerChildExecution: (state, modelRequest, agentPath, completionCustody) => {
				this.registerChildThread(state, {
					runId: codexNativeSubagentRunId(modelRequest.threadId, modelRequest.turnId),
					childThreadId: modelRequest.threadId,
					nativeTurnId: modelRequest.turnId
				}, {
					agentPath,
					completionCustody,
					nativeParentThreadId: modelRequest.parentThreadId,
					observedTurns: [{
						turnId: modelRequest.turnId,
						state: "active"
					}]
				});
			},
			isCurrent: (state) => this.isCurrentParent(state)
		});
		if (!capture) return;
		try {
			await this.persistModelAssignment(request, capture);
			request.signal?.throwIfAborted();
			capture.assertCurrent();
			return capture;
		} catch (error) {
			capture.release();
			throw error;
		}
	}
	async persistModelAssignment(request, capture) {
		const known = this.knownChildren.get(request.threadId);
		if (!known?.parent.assignmentStore) return;
		const state = known.parent;
		const child = this.currentChild(request.threadId);
		const current = child?.nativeTurnId === request.turnId ? child : void 0;
		const pending = known.pendingTurns.find((turn) => turn.turnId === request.turnId);
		const owner = current?.historyOwner ?? state.historyOwner;
		if (!owner || !current && !pending?.modelSource) throw new Error("Native model execution has no exact assignment owner.");
		const assertCurrent = () => {
			request.signal?.throwIfAborted();
			capture.assertCurrent();
			if (this.disposed || this.retiredParentStates.has(state) || this.parentStates.get(state.parentThreadId) !== state || this.knownChildren.get(request.threadId) !== known || (current ? this.currentChild(request.threadId) !== current || current.terminal || current.settledWithoutCompletion || current.nativeTurnId !== request.turnId : !pending || !known.pendingTurns.includes(pending) || !pending.modelSource)) throw new Error("Native model execution assignment changed before admission.");
		};
		assertCurrent();
		await this.assignments.recordExecution(state, {
			runId: current?.runId ?? codexNativeSubagentRunId(request.threadId, request.turnId),
			childThreadId: request.threadId,
			nativeTurnId: request.turnId,
			nativeParentThreadId: known.nativeParentThreadId,
			owner
		}, assertCurrent);
		assertCurrent();
	}
	resolveModelThreadId(turnId) {
		return resolveNativeModelThreadId(turnId, this.parentStates, this.knownChildren, this.childStates, (state) => !this.disposed && !this.retiredParentStates.has(state));
	}
	prepareModelInput(request) {
		return prepareNativeModelToolInput(request, {
			client: this.client,
			parents: this.parentStates,
			children: this.childStates,
			knownChildren: this.knownChildren,
			isCurrent: (state) => this.isCurrentParent(state),
			interruptModelExecution: this.interruptModelExecution,
			retainTargetRevision: (threadId) => this.recovery.retainThreadStatusRevision(threadId),
			currentModelExecution: (threadId) => currentNativeModelExecution(threadId, this.parentStates, this.knownChildren, this.childStates),
			admissions: this.admissionCustody.entries,
			prepareReceiver: (state, threadId, nativeParentThreadId) => this.prepareReceiverChild(state, threadId, nativeParentThreadId),
			registerChildThread: (state, threadId, options) => this.registerChildThread(state, threadId, options),
			admit: (state, owner, input, count, preparedOwner) => this.submissions.admitModelInput(state, owner, input, count, preparedOwner)
		});
	}
	releasePendingModelInputs(threadId) {
		this.submissions.retireReceiverModelInputs(threadId);
		releasePendingNativeModelInputs(threadId, this.admissionCustody.entries);
		this.clearUnconsumablePendingChildAdmissionEvidence();
		notifyNativeModelSourceChange("thread/closed", this.parentStates.values());
	}
	retireParent(parentThreadIdInput) {
		const current = this.parentStates.get(parentThreadIdInput.trim());
		const states = current ? this.requesterParents(current) : [];
		for (const state of states) this.retiredParentStates.add(state);
		const settlements = [];
		for (const state of states) {
			const parentThreadId = state.parentThreadId;
			this.submissions.retire(state);
			for (const owner of state.owners.values()) releaseCompletionCustody(owner);
			releaseNativeParentModelSources(state, this.knownChildren.values());
			state.owners.clear();
			this.childCloses.clear(state);
			this.admissionCustody.retainOnly((evidence) => evidence.parentThreadId !== parentThreadId);
			settlements.push((async () => {
				await Promise.allSettled([this.submissions.drain(state), this.assignments.drain(state)]);
				await Promise.all([...this.childStates.values()].filter((child) => child.parentThreadId === parentThreadId).map((child) => this.childCloses.retireChild(state, child)));
				await this.assignments.drain(state);
				this.pruneParentIfUnused(state);
			})());
			this.pruneParentIfUnused(state);
			notifyNativeModelSourceWaiters(state);
		}
		return Promise.allSettled(settlements).then((results) => {
			const errors = results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
			if (errors.length === 1) throw errors[0];
			if (errors.length > 1) throw new AggregateError(errors, "Codex native parent retirement did not settle.", { cause: errors[0] });
		});
	}
	async handleNotification(notification) {
		if (this.disposed) return;
		const params = isJsonObject(notification.params) ? notification.params : void 0;
		const revisedThreadId = readStringField(params, "threadId") ?? (isJsonObject(params?.thread) ? readStringField(params.thread, "id") : void 0);
		if (revisedThreadId && (RECOVERY_REVISION_NOTIFICATION_METHODS.has(notification.method) || notification.method === "thread/closed")) this.recovery.observeRevision(revisedThreadId);
		if (notification.method === "thread/closed") {
			const closedThreadId = readStringField(params, "threadId");
			if (closedThreadId) this.releasePendingModelInputs(closedThreadId);
			closeNativeModelChild(readStringField(params, "threadId"), this.knownChildren, this.childStates, (state) => this.pruneParentIfUnused(state));
			return;
		}
		if (notification.method === "turn/started" && params && !this.observeNativeChildTurnStart(params)) return;
		if (notification.method === "turn/completed" && params) {
			const known = this.knownChildren.get(readStringField(params, "threadId") ?? "");
			const turn = isJsonObject(params.turn) ? params.turn : void 0;
			const turnId = readStringField(turn, "id");
			const pending = known?.pendingTurns.find((candidate) => candidate.turnId === turnId);
			if (pending) pending.state = readNativeTurnEnd(turn);
		}
		if (params && (notification.method === "turn/started" || notification.method === "turn/completed") && isJsonObject(params.turn)) this.submissions.observeTurn(readStringField(params, "threadId") ?? "", params.turn);
		if (notification.method === "rawResponseItem/completed" && params && isJsonObject(params.item)) {
			const parent = this.resolveNativeParentState(readStringField(params, "threadId") ?? "");
			if (parent) {
				this.submissions.observeOutput(parent, readStringField(params, "turnId"), params.item);
				await this.submissions.settleWrites(parent);
				if (!this.isCurrentParent(parent)) return;
			}
		}
		const notificationState = this.resolveNotificationState(notification);
		const startedThread = isJsonObject(params?.thread) ? params.thread : void 0;
		const threadId = readStringField(params, "threadId")?.trim() ?? readStringField(startedThread, "id")?.trim();
		const threadStatus = isJsonObject(params?.status) ? normalizeIdentifier(readStringField(params.status, "type")) : void 0;
		const parent = threadId ? this.parentStates.get(threadId) : void 0;
		if (parent) observeNativeParentTurn(parent, notification);
		const tracksRecoveryRevision = Boolean(threadId && this.recovery.hasRevision(threadId));
		if (!notificationState && (!threadId || !this.parentStates.has(threadId) && !this.currentChild(threadId) && !tracksRecoveryRevision)) return;
		const notificationTurnId = readStringField(params, "turnId") ?? (isJsonObject(params?.turn) ? readStringField(params.turn, "id") : void 0);
		const pendingTurns = threadId ? this.knownChildren.get(threadId)?.pendingTurns : void 0;
		const pendingNativeTurn = pendingTurns?.some((pending) => !notificationTurnId || pending.turnId === notificationTurnId);
		if (pendingNativeTurn && threadId) {
			const previous = this.currentChild(threadId);
			if (previous) this.recovery.reconcileRegisteredChild(previous).catch((error) => {
				logRecoveryFailure(threadId, error);
				this.recovery.scheduleRecoveryPoll(previous);
			});
		}
		const isChildClose = isCodexNativeSubagentCloseNotification(notification);
		if (notificationState && isChildClose) await this.childCloses.observe(notification, notificationState);
		if (this.disposed || notificationState && !this.isCurrentParent(notificationState)) return;
		const childState = threadId && !pendingNativeTurn ? this.currentChild(threadId) : void 0;
		if (parent && canNativeParentConsumeCompletion(parent, readStringField(params, "turnId"))) observeCodexNativeSubagentDeliveryReceipts({
			state: parent,
			notification,
			knownChildren: this.knownChildren.values(),
			applyReceipts: (runIds) => this.applyNativeReceipts(parent, runIds)
		});
		if (childState && !childState.terminal && (!pendingTurns?.length || notification.method === "turn/completed")) this.turnObservation.emitChildTaskActivity(notification, childState);
		if (!pendingNativeTurn) await this.handleChildTurnCompletion(notification, childState);
		if (!pendingNativeTurn && notification.method === "thread/status/changed" && threadId && threadStatus) {
			if (threadStatus !== "systemerror") {
				if (childState) this.recovery.clearSystemErrorFallback(childState);
			} else {
				if (childState) {
					this.resumeChild(childState, { scheduleRecovery: false });
					this.recovery.setRecoveryFallback(childState, systemErrorFallbackCompletion(childState.childThreadId), Date.now());
				}
				this.reconcileChildThread(threadId).catch((error) => {
					logRecoveryFailure(threadId, error);
					return false;
				}).then((reconciled) => {
					if (!reconciled && childState && this.currentChild(threadId) === childState) this.recovery.scheduleRecoveryPoll(childState);
				});
			}
		}
		await this.handleCompletionNotification(notification);
	}
	resumeChild(childState, options = {}) {
		if (childState.terminal) return;
		this.observeActiveChild(childState);
		this.recovery.clearRecoveryTimers(childState);
		childState.recoveryAttempt = 0;
		if (options.scheduleRecovery !== false) this.recovery.scheduleRecoveryPoll(childState);
	}
	observeActiveChild(childState) {
		childState.settledWithoutCompletion = false;
		childState.fallbackCompletion = void 0;
		this.releaseClientRetention ??= this.retainClient?.();
	}
	settleResumableChild(childState) {
		if (childState.terminal) return;
		childState.settledWithoutCompletion = true;
		releaseCompletionCustody(childState);
		childState.emitEvent = void 0;
		childState.fallbackCompletion = void 0;
		releaseNativeDirectChild(childState);
		releaseNativeModelExecution(childState);
		this.recovery.clearRecoveryTimers(childState);
		this.releaseClientRetentionIfIdle();
	}
	async handleChildTurnCompletion(notification, childState) {
		if (notification.method !== "turn/completed") return;
		const params = isJsonObject(notification.params) ? notification.params : void 0;
		const childThreadId = readStringField(params, "threadId")?.trim();
		const state = childState ? this.parentStates.get(childState.parentThreadId) : void 0;
		const turn = isJsonObject(params?.turn) ? params.turn : void 0;
		if (!state || !childState || childState.childThreadId !== childThreadId || !turn || childState.terminal) return;
		const turnId = readStringField(turn, "id");
		if (childState.nativeTurnId && turnId !== childState.nativeTurnId) return;
		const status = normalizeIdentifier(readStringField(turn, "status"));
		if (status === "interrupted") {
			this.removePendingSpawnAdmissionEvidenceForChild(childState.childThreadId);
			this.rejectPendingDirectChild(state, childState.childThreadId, "Codex child turn interrupted");
			this.settleResumableChild(childState);
			return;
		}
		if (status === "completed" || status === "failed") {
			const latestTurnId = this.knownChildren.get(childState.childThreadId)?.turnId;
			if (!latestTurnId || latestTurnId === turnId) {
				this.recovery.markTerminalRevision(childState.childThreadId);
				this.rejectPendingDirectChild(state, childState.childThreadId, "Codex child turn completed");
				this.removePendingSpawnAdmissionEvidenceForChild(childState.childThreadId);
			}
			releaseNativeDirectChild(childState);
			releaseNativeModelExecution(childState);
		}
		const completion = readTurnCompletion(turn, childState.childThreadId, "notification");
		if (!completion) return;
		await this.processObservedCompletion(state, childState, completion);
	}
	async reconcileChildThread(childThreadIdInput) {
		const childState = this.currentChild(childThreadIdInput.trim());
		return childState ? this.recovery.reconcileRegisteredChild(childState) : false;
	}
	async handleCompletionNotification(notification) {
		const params = isJsonObject(notification.params) ? notification.params : void 0;
		const parentThreadId = params ? readStringField(params, "threadId")?.trim() : void 0;
		const state = parentThreadId ? this.parentStates.get(parentThreadId) : void 0;
		if (!state) return;
		for (const nativeCompletion of codexNativeSubagentNotifications.fromNotification(notification)) {
			const childThreadId = this.childThreadIdsByAgentPath.get(buildCodexNativeSubagentAgentPathKey(state.parentThreadId, nativeCompletion.agentPath));
			const childState = childThreadId ? this.currentChild(childThreadId) : void 0;
			if (!childState || childState.parentThreadId !== state.parentThreadId || childState.terminal || this.knownChildren.get(childState.childThreadId)?.pendingTurns.length || readCodexNativeSubagentRunId(childState.runId)?.turnId) {
				embeddedAgentLog.warn("Ignoring Codex native subagent completion for unknown child thread", {
					parentThreadId: state.parentThreadId,
					agentPath: nativeCompletion.agentPath
				});
				continue;
			}
			const completion = {
				childThreadId: childState.childThreadId,
				status: nativeCompletion.status,
				statusLabel: nativeCompletion.statusLabel,
				result: nativeCompletion.result
			};
			await this.processObservedCompletion(state, childState, completion);
		}
	}
	async processObservedCompletion(state, childState, completion) {
		if (!isNoFinalCompletion(completion)) {
			await this.processCompletion(state, childState, completion);
			return;
		}
		this.resumeChild(childState, { scheduleRecovery: false });
		this.recovery.setRecoveryFallback(childState, completion, Date.now());
		await this.recovery.reconcileRegisteredChild(childState).catch((error) => {
			logRecoveryFailure(childState.childThreadId, error);
			return false;
		});
	}
	async reconcileChildState(childState) {
		const state = this.parentStates.get(childState.parentThreadId);
		if (!state) return false;
		const statusRead = this.recovery.retainThreadStatusRevision(childState.childThreadId);
		try {
			const recovery = await this.historyRecovery.read(childState, {
				resumeInterrupted: !childState.terminal,
				initialAssignment: childState.recoverInitialAssignment,
				recordedCompletion: childState.pendingCompletion
			});
			if (!statusRead.isCurrent() || this.childStates.get(childState.runId) !== childState || !this.isCurrentParent(state)) return false;
			if (childState.completionCustody && !childState.completionCustody.isCurrent()) {
				this.unregisterChild(childState);
				return false;
			}
			if (recovery.parentThreadId && recovery.parentThreadId !== childState.nativeParentThreadId) {
				embeddedAgentLog.warn("Codex native subagent parent did not match monitor state", {
					childThreadId: childState.childThreadId,
					expectedParentThreadId: childState.nativeParentThreadId,
					actualParentThreadId: recovery.parentThreadId
				});
				this.unregisterChild(childState);
				return false;
			}
			if (recovery.agentPath) this.registerAgentPath(state, childState.childThreadId, recovery.agentPath);
			this.recordRecoveredChildTurn(state, childState, recovery);
			if (recovery.threadState === "active") {
				this.observeActiveChild(childState);
				return false;
			}
			if (recovery.threadState === "other") this.recovery.clearSystemErrorFallback(childState);
			if (recovery.resumable) {
				this.settleResumableChild(childState);
				return false;
			}
			const completion = this.processRecoveredCompletion(state, childState, recovery);
			if (!completion) return false;
			await completion;
			return true;
		} finally {
			statusRead.release();
		}
	}
	processRecoveredCompletion(state, child, recovery) {
		const completion = recovery.completion;
		if (completion && !isNoFinalCompletion(completion)) return this.processCompletion(state, child, completion, completion.completedAt);
		const fallback = completion ?? recovery.fallbackCompletion;
		if (fallback) this.recovery.setRecoveryFallback(child, fallback, fallback.completedAt ?? Date.now());
	}
	recordRecoveredChildTurn(state, child, recovery) {
		const known = this.knownChildren.get(child.childThreadId);
		if (known?.parent === state) for (const observed of recovery.observedPendingTurns) {
			const pending = known.pendingTurns.find((candidate) => candidate.turnId === observed.turnId);
			if (pending && observed.state) pending.state = observed.state === "active" && pending !== known.pendingTurns.at(-1) ? void 0 : observed.state;
		}
		const turnId = recovery.nativeTurnId;
		if (!turnId) return;
		const observedTurn = Boolean(child.nativeTurnId && child.nativeTurnId !== turnId);
		if (child.nativeTurnId !== turnId) {
			child.nativeTurnId = turnId;
			child.nativeTurnState = void 0;
			child.activityWait = void 0;
		}
		child.nativeTurnState = recovery.nativeTurnState;
		if (child.nativeTurnState && child.nativeTurnState !== "active") releaseNativeDirectChild(child);
		this.recordObservedChildTurn(state, child, observedTurn);
	}
	recordObservedChildTurn(state, child, observedTurn = false) {
		const known = this.knownChildren.get(child.childThreadId);
		if (!child.nativeTurnId || known?.parent !== state || known.assignment.runId !== child.runId) return child;
		this.assignments.record(state, child);
		known.assignment.nativeTurnId = child.nativeTurnId;
		known.assignment.unanchored = void 0;
		if (!known.observedTurns.has(child.nativeTurnId)) known.observedTurns.set(child.nativeTurnId, observedTurn ? { awaitingInteraction: true } : {});
		if (observedTurn && known.pendingTurns.length === 0) this.associatePendingChildInteraction(known, child.childThreadId, child.nativeTurnId);
		this.submissions.observeKnownChild(child.childThreadId);
		return this.admitFollowupChild(known, child.childThreadId);
	}
	async processCompletion(state, childState, completion, eventAt = Date.now()) {
		if (childState.terminal) return;
		const acceptedCompletion = childState.modelExecution?.executionOwner.modelExecutionCancelled || childState.nativeTurnId && childState.cancelledModelTurnId === childState.nativeTurnId ? {
			childThreadId: childState.childThreadId,
			status: "cancelled",
			statusLabel: "model_authority_revoked",
			result: "Native model execution authority was revoked."
		} : completion;
		releaseNativeModelExecution(childState);
		childState.terminal = true;
		const known = this.knownChildren.get(childState.childThreadId);
		if (known?.assignment.runId === childState.runId) {
			known.assignment.terminal = true;
			known.assignment.unanchored = void 0;
			known.assignment.nativeTurnId = childState.nativeTurnId;
		}
		childState.pendingCompletion = {
			...acceptedCompletion,
			completedAt: eventAt
		};
		this.recovery.markTerminalRevision(childState.childThreadId);
		releaseNativeDirectChild(childState);
		this.recovery.clearRecoveryTimers(childState);
		this.applyNativeReceipts(state, childState.deliveryReceipts.record(childState.runId, this.knownChildren.get(childState.childThreadId)?.agentPaths ?? [childState.childThreadId], acceptedCompletion.result));
		await this.completionDelivery.deliverPending(state, childState);
	}
	applyNativeReceipts(state, runIds) {
		this.completionDelivery.applyReceipts(state, runIds, this.childStates);
	}
	resolveChildReceiptOwner(state, childThreadId) {
		const known = this.knownChildren.get(childThreadId);
		return known?.parent === state ? known.deliveryReceipts : state.deliveryReceipts;
	}
	prepareReceiverChild(state, threadId, nativeParentThreadId) {
		const known = this.knownChildren.get(threadId);
		if (known?.parent === state) return true;
		if (!this.isCurrentParent(state) || known && (!known.assignment.terminal || known.pendingTurns.length > 0 || this.submissions.hasChildCustody(known.parent, threadId))) return false;
		if (!known) return true;
		const previous = known.parent;
		if (nativeParentThreadId !== known.nativeParentThreadId || this.retiredParentStates.has(previous) || !state.requesterSessionKey || previous.requesterSessionKey !== state.requesterSessionKey || !previous.historyOwner || !state.historyOwner || !matchesNativeAssignmentLifecycle(previous.historyOwner, state.historyOwner) || ![...state.owners.values()].some((owner) => owner.completionCustody?.isCurrent())) return false;
		try {
			state.assignmentStore?.assertCurrent();
		} catch {
			return false;
		}
		known.parent = state;
		for (const agentPath of known.agentPaths) this.registerAgentPath(state, threadId, agentPath);
		return true;
	}
	registerChildThread(state, childInput, options = {}) {
		const parentThreadId = state.parentThreadId;
		const preparedAssignment = typeof childInput === "string" ? void 0 : childInput;
		const childThreadId = typeof childInput === "string" ? childInput.trim() : childInput.childThreadId;
		if (!parentThreadId || !childThreadId || this.disposed || state.preparing) return;
		const claimDirectChild = options.directOwner?.claimDirectChild;
		if (claimDirectChild && this.recovery.isTerminalRevision(childThreadId)) return;
		if (!preparedAssignment && !this.prepareReceiverChild(state, childThreadId)) return;
		const known = this.knownChildren.get(childThreadId);
		const observedTurns = options.observedTurns ?? [];
		if (known && known.parent !== state) {
			embeddedAgentLog.warn("Ignoring Codex native subagent child reparenting", {
				childThreadId,
				existingParentThreadId: known.parent.parentThreadId,
				attemptedParentThreadId: parentThreadId
			});
			return;
		}
		const assignment = preparedAssignment ?? {
			runId: known?.assignment.runId ?? codexNativeSubagentRunId(childThreadId),
			childThreadId,
			nativeTurnId: void 0
		};
		const { runId } = assignment;
		let childState = this.childStates.get(runId);
		if (childState && childState.parentThreadId !== parentThreadId) return;
		if (!childState && known && !preparedAssignment) return;
		if (!childState) {
			this.updateChildThreadOwnership("claim", childThreadId, this.claimChildThread);
			this.releaseClientRetention ??= this.retainClient?.();
			if (!this.parentThreadRetentions.has(parentThreadId)) {
				const releaseParentThread = this.retainParentThread?.(parentThreadId);
				if (releaseParentThread) this.parentThreadRetentions.set(parentThreadId, releaseParentThread);
			}
			childState = {
				runId,
				nativeTurnId: assignment.nativeTurnId,
				nativeTurnState: observedTurns.find((turn) => turn.turnId === assignment.nativeTurnId)?.state,
				deliveryReceipts: this.resolveChildReceiptOwner(state, childThreadId),
				childThreadId,
				parentThreadId,
				nativeParentThreadId: known?.nativeParentThreadId ?? options.nativeParentThreadId ?? parentThreadId,
				agentId: state.agentId,
				historyOwner: options.historyOwner ?? state.historyOwner,
				recoveryAttempt: 0,
				terminal: false,
				nativeCompletionDelivered: false,
				settledWithoutCompletion: false,
				completionDeliveryAttempt: 0,
				deliveringCompletion: false
			};
			this.childStates.set(runId, childState);
			if (!known || !known.assignment.nativeTurnId && assignment.nativeTurnId && observedTurns.length > 0) this.restoreKnownChild(state, assignment, observedTurns);
			this.recovery.seedRevision(childThreadId, parentThreadId);
		}
		if (known && options.admitAssignment) {
			const previousRunId = known.assignment.runId;
			known.assignment = {
				...assignment,
				terminal: childState.terminal || known.assignment.runId === runId && known.assignment.terminal
			};
			if (previousRunId !== runId) this.refreshWaitDependency(state, childThreadId);
		}
		if (claimDirectChild && !childState.terminal && !childState.settledWithoutCompletion && !childState.releaseDirectChild) {
			childState.directOwner = options.directOwner;
			childState.releaseDirectChild = claimDirectChild(childThreadId);
		}
		childState.completionCustody ??= (options.completionCustody ?? options.directOwner?.completionCustody)?.retain();
		this.admissionCustody.bindEventSink(childState);
		this.registerAgentPath(state, childThreadId, childThreadId);
		const agentPath = normalizeOptionalString(options.agentPath);
		if (agentPath) this.registerAgentPath(state, childThreadId, agentPath);
		for (const path of this.knownChildren.get(childThreadId)?.agentPaths ?? []) this.registerAgentPath(state, childThreadId, path);
		this.applyNativeReceipts(state, childState.deliveryReceipts.track(runId, this.knownChildren.get(childThreadId)?.agentPaths ?? [childThreadId]));
		const restored = this.knownChildren.get(childThreadId);
		if (restored && !known && options.nativeParentThreadId) restored.nativeParentThreadId = options.nativeParentThreadId;
		if (observedTurns.length > 0 && restored?.parent === state) {
			if (!restored.assignment.terminal && !this.currentChild(childThreadId)) this.registerChildThread(state, restored.assignment, { observedTurns });
			const pendingAdmissions = [...this.admissionCustody.entries];
			for (const [parentTurnId, pending] of pendingAdmissions) {
				const owners = /* @__PURE__ */ new Set();
				for (const entry of pending) {
					if (entry.kind !== "interaction" || entry.parentThreadId !== state.parentThreadId || entry.childThreadId !== childThreadId) continue;
					const owner = entry.admittedOwner ?? entry.owner;
					if (owner) owners.add(owner);
				}
				for (const owner of owners) this.drainPendingChildAdmissionEvidence(state, owner, parentTurnId, true);
			}
		}
		this.assignments.record(state, childState);
		this.recovery.scheduleRecoveryPoll(childState);
		return childState;
	}
	currentChild(threadId) {
		const runId = this.knownChildren.get(threadId)?.assignment.runId;
		return runId ? this.childStates.get(runId) : void 0;
	}
	isCurrentParent(state) {
		return !this.disposed && !this.retiredParentStates.has(state) && this.parentStates.get(state.parentThreadId) === state;
	}
	refreshWaitDependency(state, receiverThreadId) {
		if (!this.isCurrentParent(state)) return;
		for (const child of this.childStates.values()) if (child.parentThreadId === state.parentThreadId) this.turnObservation.refreshWaitDependency(child, receiverThreadId);
	}
	observeNativeChildTurnStart(params) {
		const threadId = readStringField(params, "threadId");
		const turn = isJsonObject(params.turn) ? params.turn : void 0;
		const turnId = readStringField(turn, "id");
		const known = threadId ? this.knownChildren.get(threadId) : void 0;
		if (!threadId || !turnId || !known || this.parentStates.get(known.parent.parentThreadId) !== known.parent) return true;
		let previous = this.currentChild(threadId);
		if (!previous && !known.assignment.terminal) previous = this.registerChildThread(known.parent, known.assignment);
		const pending = known.pendingTurns.find((candidate) => candidate.turnId === turnId);
		if (pending) pending.state = "active";
		if (known.observedTurns.has(turnId) && (known.turnId !== turnId || known.assignment.terminal || pending || previous?.nativeTurnState !== void 0)) return false;
		const observedTurn = !known.observedTurns.has(turnId);
		const startsPendingTurn = !pending && (known.pendingTurns.length > 0 || known.assignment.unanchored || !previous || known.assignment.terminal || previous.terminal || previous.nativeTurnState === "completed" || previous.nativeTurnState === "failed" || previous.nativeTurnId && previous.nativeTurnId !== turnId);
		if (observedTurn) known.observedTurns.set(turnId, startsPendingTurn ? { awaitingInteraction: true } : {});
		if (startsPendingTurn) {
			const previousPending = known.pendingTurns.at(-1);
			if (previousPending?.state === "active") previousPending.state = void 0;
			known.pendingTurns.push({
				turnId,
				state: "active"
			});
			if (!previousPending && previous && !known.assignment.terminal && !previous.terminal && (!previous.nativeTurnState || previous.nativeTurnState === "active")) {
				previous.nativeTurnState = void 0;
				previous.activityWait = void 0;
				releaseNativeDirectChild(previous);
				this.turnObservation.markActivityUnknown(previous);
			}
			this.applyNativeReceipts(known.parent, known.deliveryReceipts.track(codexNativeSubagentRunId(threadId, turnId), known.agentPaths));
		}
		known.turnId = turnId;
		if (previous && !previous.terminal && known.pendingTurns.length === 0) {
			previous.nativeTurnId = turnId;
			known.assignment.nativeTurnId = turnId;
			known.assignment.unanchored = void 0;
			previous.nativeTurnState = "active";
			this.assignments.record(known.parent, previous);
			if (previous.modelExecution && !previous.modelExecution.executionOwner.turnId) previous.modelExecution.bindTurn(turnId);
		}
		if (observedTurn) this.associatePendingChildInteraction(known, threadId, turnId);
		this.admitFollowupChild(known, threadId);
		const startedChild = this.currentChild(threadId);
		if (startedChild && !known.pendingTurns.some((candidate) => candidate.turnId === turnId)) {
			startedChild.nativeCompletionDelivered = false;
			this.resumeChild(startedChild);
		}
		return true;
	}
	associatePendingChildInteraction(known, threadId, nativeTurnId) {
		associateNativeChildInteraction(known, threadId, nativeTurnId, this.admissionCustody.entries, (owner, turnId) => this.drainPendingChildAdmissionEvidence(known.parent, owner, turnId));
	}
	observeParentInteraction(state, owner, threadId, agentPath, interaction = {}) {
		this.prepareReceiverChild(state, threadId);
		const known = this.knownChildren.get(threadId);
		const admissionOwner = owner ?? interaction.modelOwner;
		const unqualified = admissionOwner?.unqualifiedModelExecution && !admissionOwner.modelExecutionSettled && !admissionOwner.modelExecutionCancelled;
		if (known && known.parent !== state || !known && !unqualified) return;
		if (known && interaction.modelOwner?.nativeInputConfiguration) known.configurationQualification = interaction.modelOwner.configurationQualification;
		if (known && agentPath) this.registerAgentPath(state, threadId, agentPath);
		const parentTurnId = interaction.parentTurnId ?? admissionOwner?.turnId;
		this.admissionCustody.buffer(parentTurnId, {
			kind: "interaction",
			parentThreadId: state.parentThreadId,
			childThreadId: threadId,
			...agentPath ? { agentPath } : {},
			...interaction.itemId ? { itemId: interaction.itemId } : {},
			...interaction.modelSourceTurnId ? { modelSourceTurnId: interaction.modelSourceTurnId } : {},
			...owner ? { owner } : {},
			...interaction.modelOwner ? { modelOwner: interaction.modelOwner } : {}
		});
		if (!known && unqualified) admissionOwner.onDirectChildAccepted?.();
		if (admissionOwner && parentTurnId) this.drainPendingChildAdmissionEvidence(state, admissionOwner, parentTurnId, true);
	}
	admitFollowupChild(known, threadId, owner) {
		if (this.parentStates.get(known.parent.parentThreadId) !== known.parent || this.retiredParentStates.has(known.parent)) return;
		let child = this.currentChild(threadId);
		if (!child && !known.assignment.terminal) return;
		let claimOwner = owner;
		let transitioned = false;
		while (known.pendingTurns.length > 0) {
			const pending = known.pendingTurns[0];
			const currentTurnId = child?.nativeTurnId;
			const recoveredIndex = currentTurnId ? known.pendingTurns.findIndex((candidate) => candidate.turnId === currentTurnId) : -1;
			if (child && !child.terminal && !known.assignment.terminal && (recoveredIndex >= 0 || child.nativeTurnState === "interrupted")) {
				let continuationCount = Math.max(1, recoveredIndex + 1);
				if (recoveredIndex < 0) while (continuationCount < known.pendingTurns.length && known.pendingTurns[continuationCount - 1]?.state === "interrupted") continuationCount += 1;
				const continuations = known.pendingTurns.splice(0, continuationCount);
				const resumed = continuations.at(-1);
				child.completionCustody ??= resumed.completionCustody?.retain();
				continuations.forEach(releaseCompletionCustody);
				if (recoveredIndex < 0) {
					child.nativeTurnId = resumed.turnId;
					child.nativeTurnState = resumed.state;
					child.activityWait = void 0;
				}
				claimOwner = resumed.admittedOwner;
				if (resumed.modelSource) {
					releaseNativeModelExecution(child);
					child.modelExecution = resumed.modelSource;
					resumed.modelSource = void 0;
				}
				for (const continuation of continuations) continuation.modelSource?.release();
				transitioned = true;
				this.applyNativeReceipts(known.parent, known.deliveryReceipts.resumeAssignment(child.runId, continuations.map((turn) => codexNativeSubagentRunId(threadId, turn.turnId))));
				continue;
			}
			if (child && !child.terminal && !known.assignment.terminal && child.nativeTurnState !== "completed" && child.nativeTurnState !== "failed") {
				child.nativeTurnState = void 0;
				return;
			}
			if (!pending.admittedOwner && !pending.admittedSubmission && !pending.modelSource) return;
			const runId = codexNativeSubagentRunId(threadId, pending.turnId);
			child = this.registerChildThread(known.parent, {
				runId,
				childThreadId: threadId,
				nativeTurnId: pending.turnId
			}, {
				admitAssignment: true,
				completionCustody: pending.completionCustody
			});
			if (!child) return;
			child.nativeTurnId = pending.turnId;
			child.nativeTurnState = pending.state;
			if (pending.modelSource) {
				releaseNativeModelExecution(child);
				child.modelExecution = pending.modelSource;
				pending.modelSource = void 0;
			}
			claimOwner = pending.admittedOwner;
			transitioned = true;
			known.pendingTurns.shift();
			releaseCompletionCustody(pending);
		}
		if (!child || child.terminal || known.assignment.terminal || !child.nativeTurnId) return;
		this.assignments.record(known.parent, child);
		known.assignment.nativeTurnId = child.nativeTurnId;
		known.turnId = child.nativeTurnId;
		if (child.nativeTurnState !== "active") return child;
		const currentInteraction = [...this.admissionCustody.entries.values()].flat().findLast((evidence) => evidence.kind === "interaction" && evidence.parentThreadId === known.parent.parentThreadId && evidence.childThreadId === threadId && !evidence.nativeTurnId && evidence.owner && [...known.parent.owners.values()].includes(evidence.owner));
		if (currentInteraction?.kind === "interaction" && currentInteraction.owner) claimOwner = currentInteraction.owner;
		if (claimOwner && [...known.parent.owners.values()].includes(claimOwner)) {
			child.completionCustody ??= claimOwner.completionCustody?.retain();
			if (child.directOwner !== claimOwner) {
				releaseNativeDirectChild(child);
				child.directOwner = claimOwner;
				child.releaseDirectChild = claimOwner.claimDirectChild?.(child.childThreadId);
			}
			if (!transitioned) claimOwner.onDirectChildAccepted?.();
		}
		this.admissionCustody.bindEventSink(child);
		return child;
	}
	resolveParentOwner(state, turnIdInput, nativeParentThreadId = state.parentThreadId) {
		return resolveNativeModelParentOwner(state, turnIdInput, nativeParentThreadId, this.childStates, this.knownChildren);
	}
	resolveNativeParentState(threadId) {
		return this.parentStates.get(threadId) ?? this.knownChildren.get(threadId)?.parent;
	}
	registerDirectSpawnChild(state, turnIdInput, evidence, owner) {
		return this.admissionCustody.registerDirectSpawnChild(turnIdInput, evidence, owner, (options) => this.registerChildThread(state, evidence.childThreadId, options));
	}
	drainPendingChildAdmissionEvidence(state, owner, turnId, observeActivity = false) {
		drainNativeChildModelAdmissions(state, owner, turnId, observeActivity, {
			admissions: this.admissionCustody.entries,
			replaceAdmissions: (parentTurnId, remaining) => this.admissionCustody.replace(parentTurnId, remaining),
			knownChildren: this.knownChildren,
			isCurrent: (parent) => this.parentStates.get(parent.parentThreadId) === parent && !this.retiredParentStates.has(parent),
			currentChild: (threadId) => this.currentChild(threadId),
			registerAgentPath: (parent, threadId, path) => this.registerAgentPath(parent, threadId, path),
			registerChildThread: (parent, threadId, options) => this.registerChildThread(parent, threadId, options),
			admitFollowupChild: (known, threadId, admittedOwner) => this.admitFollowupChild(known, threadId, admittedOwner),
			observeActivity: (child) => this.turnObservation.emitChildTaskActivity({
				method: "turn/started",
				params: {
					threadId: child.childThreadId,
					turn: { id: child.nativeTurnId }
				}
			}, child)
		});
	}
	clearUnconsumablePendingChildAdmissionEvidence() {
		this.admissionCustody.prune((state) => this.retiredParentStates.has(state));
	}
	removePendingSpawnAdmissionEvidenceForChild(childThreadId) {
		this.admissionCustody.retainOnly((evidence) => evidence.childThreadId !== childThreadId || evidence.kind === "interaction");
	}
	registerAgentPath(state, childThreadId, agentPath) {
		this.applyNativeReceipts(state, registerCodexNativeSubagentReceiptAlias({
			state,
			childThreadId,
			agentPath,
			known: this.knownChildren.get(childThreadId),
			aliases: this.childThreadIdsByAgentPath
		}));
	}
	unregisterChild(childState, options = {}) {
		releaseNativeDirectChild(childState);
		releaseNativeModelExecution(childState);
		const known = this.knownChildren.get(childState.childThreadId);
		if (childState.terminal && !childState.subscriptionClosed && options.retainSubscription !== false && !this.disposed && known?.parent.parentThreadId === childState.parentThreadId && known.assignment.runId === childState.runId) this.updateChildThreadOwnership("retain", childState.childThreadId, this.retainChildThread);
		this.recovery.clearRecoveryTimers(childState);
		this.completionDelivery.release(childState);
		if (this.childStates.get(childState.runId) === childState) this.childStates.delete(childState.runId);
		if (![...this.childStates.values()].some((remainingChild) => remainingChild.parentThreadId === childState.parentThreadId)) {
			const releaseParentThread = this.parentThreadRetentions.get(childState.parentThreadId);
			this.parentThreadRetentions.delete(childState.parentThreadId);
			releaseParentThread?.();
		}
		this.recovery.collectThreadStatusRevision(childState.childThreadId);
		this.releaseClientRetentionIfIdle();
		const state = this.parentStates.get(childState.parentThreadId);
		if (state) {
			this.submissions.settleChild(state, childState);
			this.assignments.settle(state, childState);
			this.pruneParentIfUnused(state);
		}
		if (known && known.parent !== state) this.pruneParentIfUnused(known.parent);
	}
	rejectPendingDirectChild(state, childThreadId, reason) {
		if ([...this.admissionCustody.entries.values()].flat().some((evidence) => evidence.kind === "interaction" && evidence.parentThreadId === state.parentThreadId && evidence.childThreadId === childThreadId)) return;
		for (const owner of state.owners.values()) owner.rejectPendingDirectChild?.(childThreadId, reason);
	}
	updateChildThreadOwnership(operation, childThreadId, update) {
		if (!update) return;
		update(childThreadId).catch((error) => {
			embeddedAgentLog.warn("Failed to update Codex native subagent thread ownership", {
				operation,
				childThreadId,
				error: formatErrorMessage$1(error)
			});
		});
	}
	releaseClientRetentionIfIdle() {
		if ([...this.childStates.values()].some((childState) => !childState.terminal && !childState.settledWithoutCompletion)) return;
		this.releaseRetainedClient();
	}
	releaseRetainedClient() {
		const release = this.releaseClientRetention;
		this.releaseClientRetention = void 0;
		release?.();
	}
	requesterParents(source) {
		return [...this.parentStates.values()].filter((state) => state === source || Boolean(source.requesterSessionKey && state.requesterSessionKey === source.requesterSessionKey && state.agentId === source.agentId && source.historyOwner && state.historyOwner && matchesNativeAssignmentLifecycle(source.historyOwner, state.historyOwner)));
	}
	hasParentWork(state) {
		if (state.modelSourceReferences || state.pendingRegistrations && !this.disposed && !this.retiredParentStates.has(state)) return true;
		if (this.assignments.hasWrites(state) || this.submissions.hasCustody(state)) return true;
		if (state.owners.size > 0) return true;
		if (this.childCloses.hasPending(state)) return true;
		for (const childState of this.childStates.values()) if (childState.parentThreadId === state.parentThreadId) return true;
		for (const known of this.knownChildren.values()) if (known.parent === state && this.currentChild(known.assignment.childThreadId)) return true;
		return false;
	}
	pruneParentIfUnused(source) {
		if (this.parentStates.get(source.parentThreadId) !== source) return;
		const states = this.requesterParents(source);
		if (states.some((state) => this.hasParentWork(state))) return;
		for (const state of states) {
			this.submissions.retire(state);
			this.childCloses.clear(state);
			this.recovery.clearTerminalRevisionsForParent(state.parentThreadId);
			this.parentStates.delete(state.parentThreadId);
			for (const [threadId, known] of this.knownChildren) if (known.parent === state) {
				this.childCloses.retireReceiver(known, () => this.updateChildThreadOwnership("release", threadId, this.releaseChildThread));
				for (const path of known.agentPaths) this.childThreadIdsByAgentPath.delete(buildCodexNativeSubagentAgentPathKey(state.parentThreadId, path));
				this.knownChildren.delete(threadId);
				known.pendingTurns.forEach(releaseCompletionCustody);
			}
		}
	}
	restoreKnownChild(state, assignment, observedTurns = []) {
		const currentIndex = observedTurns.findIndex((turn) => turn.turnId === assignment.nativeTurnId);
		const pendingTurns = observedTurns.filter((turn, index) => index > currentIndex && turn.turnId !== assignment.nativeTurnId).map((turn, index, turns) => ({
			turnId: turn.turnId,
			state: turn.state === "active" && index < turns.length - 1 ? void 0 : turn.state
		}));
		const previous = this.knownChildren.get(assignment.childThreadId);
		const previousRunId = previous?.assignment.runId;
		const retainedPending = previous?.pendingTurns.filter((pending) => pending.modelSource) ?? [];
		for (const retained of retainedPending) {
			const recovered = pendingTurns.find((pending) => pending.turnId === retained.turnId);
			if (recovered) {
				recovered.modelSource = retained.modelSource;
				recovered.completionCustody = retained.completionCustody;
				retained.completionCustody = void 0;
			} else pendingTurns.push(retained);
		}
		for (const pending of previous?.pendingTurns ?? []) if (!pendingTurns.includes(pending)) releaseCompletionCustody(pending);
		this.knownChildren.set(assignment.childThreadId, {
			configurationQualification: previous?.configurationQualification,
			parent: state,
			nativeParentThreadId: this.childStates.get(assignment.runId)?.nativeParentThreadId ?? state.parentThreadId,
			deliveryReceipts: this.resolveChildReceiptOwner(state, assignment.childThreadId),
			assignment: {
				...assignment,
				terminal: false
			},
			turnId: pendingTurns.at(-1)?.turnId ?? assignment.nativeTurnId,
			observedTurns: new Map([...new Set([assignment.nativeTurnId, ...observedTurns.map((turn) => turn.turnId)].filter((id) => Boolean(id)))].map((turnId) => [turnId, pendingTurns.some((turn) => turn.turnId === turnId) ? { awaitingInteraction: true } : {}])),
			pendingTurns,
			agentPaths: this.knownChildren.get(assignment.childThreadId)?.agentPaths ?? /* @__PURE__ */ new Set([assignment.childThreadId])
		});
		if (previousRunId !== assignment.runId) this.refreshWaitDependency(state, assignment.childThreadId);
	}
};
const codexNativeSubagentMonitorRuntime = createCodexNativeSubagentMonitorRuntime(Monitor);
//#endregion
export { CodexToolTranscriptProjection as a, shouldEmitTranscriptToolProgress as c, resolveCodexToolProgressDetailMode as d, sanitizeCodexAgentEventRecord as f, emitCodexAgentEvent as i, projectCodexWebSearchItem as l, native_subagent_monitor_exports as n, resolveCodexLocalRuntimeAttribution as o, sanitizeCodexToolArguments as p, CodexEventProjection as r, CodexToolProgressProjection as s, codexNativeSubagentMonitorRuntime as t, isCodexCommandBearingToolCall as u };
