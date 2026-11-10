import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as getAsyncWorkSignal } from "./async-work-scope-BH2yUdBz.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import "./utils-gjJ-tD2q.mjs";
import { o as racePromiseWithAbortSignal, s as raceWithTimeout } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { j as validateAgentRunDelegatedAuthority, l as getActiveAgentRunDelegatedAuthority } from "./agent-run-registry-gmaPgO-n.mjs";
import { Ig as buildSystemAgentInferenceUnavailableErrorDetails, Lg as buildSystemAgentSessionInvalidatedErrorDetails, Ng as errorShape, co as validateSystemAgentChatParams, do as validateSystemAgentSetupAuthStartParams, fo as validateSystemAgentSetupAutoParams, hd as normalizeSystemAgentPluginReference, lo as validateSystemAgentSetupActivateParams, mo as validateSystemAgentSetupVerifyParams, po as validateSystemAgentSetupDetectParams, so as validateSystemAgentChatHistoryParams, uo as validateSystemAgentSetupActivateStartParams } from "./src-pLJQA6J5.mjs";
import { E as runWithGatewayIndependentRootWorkContinuation } from "./gateway-work-admission-FWbk4b3p.mjs";
import { n as createSqliteAuditRecordWriter, t as createSqliteAuditRecordReader } from "./sqlite-audit-record-store.async-D68ttW0Y.mjs";
import "./io.audit-CCHda99t.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { o as getGatewayToolCallerIdentity } from "./gateway-caller-context-Be176_GV.mjs";
import { t as getUpdateAvailable } from "./update-status-state-BvKx4Ptf.mjs";
import { a as isGatewayClientProfilePending, t as authenticatedProfileUnavailableError } from "./gateway-client-identity-DXWhtQve.mjs";
import { n as getHealthCache } from "./health-state-DhfLHtHh.mjs";
import { t as WizardSession } from "./session-BK80iJWA.mjs";
import { n as defineValidatedGatewayHandler, t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { a as readGatewayRequestMutationAuthority, s as retainGatewayRequestMutationAuthority } from "./session-mutation-guards-ClTdEKsf.mjs";
import { r as describeSystemAgentPersistentOperation } from "./operations-parse-B9TfqALv.mjs";
import { n as loadAgentRole, t as listAgentRoles } from "./agent-roles-RdqEgKem.mjs";
import "./operations-6fJefeqF.mjs";
import { n as SYSTEM_AGENT_APPROVAL_TERMINAL_MESSAGES } from "./operator-approval-BjhYZ1TF.mjs";
import { i as isSystemAgentInferenceUnavailableError } from "./inference-guard-dpnxA1_N.mjs";
import { r as formatSystemAgentStartupMessage } from "./overview-DFEP0f2_.mjs";
import { n as SYSTEM_AGENT_APPROVAL_TIMEOUT_MS, t as SYSTEM_AGENT_APPROVAL_DECISIONS } from "./system-agent-approvals-r0J6k0r_.mjs";
import { v as sameWorkerSessionTurnClaim } from "./placement-record-CBaaHws5.mjs";
import { i as buildRequestedApprovalEvent, r as broadcastApprovalResolvedEvent, s as handlePendingApprovalRequest } from "./approval-shared-QJKmB54s.mjs";
import { t as ApprovalObserverClosedError } from "./exec-approval-lifecycle-BEqOgI73.mjs";
import { i as runExclusiveSystemAgentSetupActivation, n as createAdmittedWizardSession, r as respondSetupAdmissionBusy, t as SetupAdmissionBusyError } from "./setup-admission-Cra7-OqR.mjs";
import { i as verifyGatewaySetupInference, n as createSystemAgentGatewayRuntime, r as runSystemAgentGatewayTask, t as activateGatewaySetupInference } from "./system-agent-execution-DAJfPE1K.mjs";
import { n as startSetupActivationWizard, t as rejectExistingSetupWizardSession } from "./system-agent-setup-wizard-QsNyCX4k.mjs";
import { t as resolveSystemAgentSessionOwnerKey } from "./system-agent-session-owner-khtNzUq8.mjs";
import { n as SystemAgentChatEngine, r as SystemAgentWizardAnswerError, t as buildOnboardingWelcome } from "./onboarding-welcome-DAXUUbTP.mjs";
import { createHash, randomUUID } from "node:crypto";
//#region src/system-agent/greeting.ts
const SYSTEM_AGENT_GREETING_SCOPE = "system-agent-greeting";
const SYSTEM_AGENT_GREETING_KEY = "latest";
const SYSTEM_AGENT_GREETING_TIMEOUT_MS = 2e4;
const SYSTEM_AGENT_GREETING_FAILURE_RETRY_MS = 6e4;
const SYSTEM_AGENT_GREETING_MAX_CHARS = 700;
const SYSTEM_AGENT_GREETING_MAX_LINES = 5;
const GREETING_STATE_CAS_ATTEMPTS = 4;
const greetingFlights = /* @__PURE__ */ new WeakMap();
const greetingFailures = /* @__PURE__ */ new WeakMap();
const defaultGreetingCacheKey = {};
function createSystemAgentGreetingCache(opts = {}) {
	const options = {
		...opts,
		scope: SYSTEM_AGENT_GREETING_SCOPE,
		maxEntries: 1
	};
	const reader = createSqliteAuditRecordReader(options);
	const writer = createSqliteAuditRecordWriter(options);
	return {
		...reader,
		compareAndSet: writer.compareAndSet
	};
}
async function tryOr(fallback, read) {
	try {
		return await read();
	} catch {
		return fallback;
	}
}
async function readGreetingCache(store) {
	const records = await store.latest({ limit: 1 });
	store.assertCurrent();
	return records[0]?.value ?? null;
}
async function mutateGreetingState(store, mutate, createdAt = Date.now()) {
	for (let attempt = 0; attempt < GREETING_STATE_CAS_ATTEMPTS; attempt += 1) {
		const current = await readGreetingCache(store);
		store.assertCurrent();
		const next = mutate(current);
		if (next === current || await store.compareAndSet(SYSTEM_AGENT_GREETING_KEY, current, next, createdAt)) return;
	}
	throw new Error("system-agent greeting state changed too often");
}
function accountLooksDegraded(account) {
	if (account.configured === false || account.enabled === false) return false;
	const healthState = typeof account.healthState === "string" ? account.healthState.trim().toLowerCase() : "";
	const probe = account.probe && typeof account.probe === "object" ? account.probe : null;
	return healthState !== "" && healthState !== "healthy" || probe?.ok === false || account.linked === false || account.running === false || account.running === true && account.connected === false || account.connected !== true && typeof account.lastError === "string" && account.lastError.trim().length > 0;
}
/** Extract only degraded channel labels from the gateway's existing cached health aggregate. */
function systemAgentGreetingChannelHealth(health) {
	if (!health) return {
		available: false,
		degraded: []
	};
	const degraded = /* @__PURE__ */ new Set();
	for (const [channelId, channel] of Object.entries(health.channels)) if ((channel.accounts ? Object.values(channel.accounts) : [channel]).some((account) => accountLooksDegraded(account))) degraded.add(health.channelLabels[channelId] ?? channelId);
	return {
		available: true,
		degraded: [...degraded].toSorted((a, b) => a.localeCompare(b))
	};
}
/** Read free facts from process/SQLite snapshots; this function never starts a probe. */
async function loadSystemAgentGreetingFacts(opts = {}) {
	let cacheStore;
	let auditStore;
	try {
		cacheStore = opts.cacheStore ?? opts.openCache?.() ?? createSystemAgentGreetingCache({ env: opts.env });
	} catch {}
	try {
		auditStore = opts.configAuditStore ?? createSqliteAuditRecordReader({
			scope: "config-audit",
			env: opts.env
		});
	} catch {}
	const cache = await tryOr(null, () => cacheStore ? readGreetingCache(cacheStore) : null);
	const auditFacts = await tryOr({
		auditSequence: 0,
		recentExternalEdit: false
	}, () => auditStore ? auditStore.configAuditFacts(cache?.lastSeenAuditSequence ?? 0) : {
		auditSequence: 0,
		recentExternalEdit: false
	});
	const update = await tryOr(null, () => (opts.getUpdateAvailable ?? getUpdateAvailable)());
	const health = await tryOr(null, () => (opts.getHealthCache ?? getHealthCache)());
	cacheStore?.assertCurrent();
	auditStore?.assertCurrent();
	return {
		updateAvailable: update?.latestVersion ?? null,
		channelHealth: systemAgentGreetingChannelHealth(health),
		...auditFacts
	};
}
/** SHA-256 over greeting decisions only; paths, errors, timestamps, and tool probes stay out. */
function systemAgentGreetingFactsHash(overview, facts) {
	const decisionFacts = {
		config: {
			exists: overview.config.exists,
			valid: overview.config.valid
		},
		defaultAgentId: overview.defaultAgentId,
		defaultModel: overview.defaultModel ?? null,
		setupModel: overview.setupModel ?? null,
		utilityModel: overview.utilityModel ?? null,
		gateway: {
			reachable: overview.gateway.reachable,
			url: overview.gateway.url
		},
		agents: overview.agents.map((agent) => ({
			id: agent.id,
			name: agent.name ?? null,
			isDefault: agent.isDefault,
			model: agent.model ?? null
		})).toSorted((a, b) => a.id.localeCompare(b.id)),
		updateAvailable: facts.updateAvailable,
		channelHealthAvailable: facts.channelHealth.available,
		degradedChannels: [...facts.channelHealth.degraded].toSorted((a, b) => a.localeCompare(b))
	};
	return createHash("sha256").update(JSON.stringify(decisionFacts)).digest("hex");
}
function normalizeGreetingText(text) {
	const lines = text.trim().split(/\r?\n/).map((line) => line.trim()).filter(Boolean).slice(0, SYSTEM_AGENT_GREETING_MAX_LINES);
	if (lines.length === 0 || lines.some((line) => /^#{1,6}\s/.test(line))) return null;
	if (lines.some((line) => /^[[{]/.test(line) || line.startsWith("```"))) return null;
	return truncateUtf16Safe(lines.join("\n"), SYSTEM_AGENT_GREETING_MAX_CHARS).trim() || null;
}
/**
* The external-edit alert is host-owned: delivery acknowledges the audit
* cursor, so a model phrasing miss would silently lose the notification.
* Appending deterministically removes that class instead of validating it.
*/
const SYSTEM_AGENT_EXTERNAL_EDIT_ALERT = "Heads up: the config was edited outside OpenClaw while I was away — open History to review it.";
function withHostOwnedAlerts(text, facts) {
	if (!facts.recentExternalEdit) return text;
	return `${text}\n${SYSTEM_AGENT_EXTERNAL_EDIT_ALERT}`;
}
/**
* Positive-presence grounding only: exceptional facts the model was given must
* appear in its text. Deliberately no negative-claim screening — keyword
* blacklists false-reject phrasing like "no channels are degraded", and the
* greeting is advisory chat text; chips, History, and health stay host-owned.
* A hallucinated outage is bounded by the prompt, the 5-line cap, and template
* fallback on the next facts change. Accepted tradeoff, not an oversight.
*/
function modelGreetingCoversFacts(text, facts) {
	const normalized = text.toLocaleLowerCase();
	if (facts.updateAvailable && !normalized.includes(facts.updateAvailable.toLocaleLowerCase())) return false;
	if (facts.channelHealth.degraded.some((label) => !normalized.includes(label.toLocaleLowerCase()))) return false;
	if (!facts.channelHealth.available && !(normalized.includes("channel health") && normalized.includes("unavailable"))) return false;
	return true;
}
function requiresDeterministicGreeting(overview) {
	return !overview.config.exists || !overview.config.valid || !overview.defaultModel || !overview.gateway.reachable;
}
function resolveSystemAgentGreetingFallback(overview, facts) {
	const alerts = [];
	if (facts.updateAvailable) alerts.push(`Update ${facts.updateAvailable} is available.`);
	if (facts.channelHealth.degraded.length > 0) alerts.push(`Channels needing attention: ${facts.channelHealth.degraded.join(", ")}.`);
	else if (!facts.channelHealth.available) alerts.push("Channel health is not available yet.");
	return {
		text: [formatSystemAgentStartupMessage(overview), alerts.join(" ") || void 0].filter((line) => line !== void 0).join("\n"),
		source: "template"
	};
}
async function resolveUncachedSystemAgentGreeting(params) {
	const timeoutMs = params.timeoutMs ?? SYSTEM_AGENT_GREETING_TIMEOUT_MS;
	let plan;
	try {
		plan = await raceWithTimeout(params.planner({
			overview: params.overview,
			facts: params.facts,
			timeoutMs
		}), timeoutMs, () => null, { ref: false });
	} catch {
		plan = null;
	}
	const text = plan ? normalizeGreetingText(plan.text) : null;
	const groundedText = text && modelGreetingCoversFacts(text, params.facts) ? text : null;
	const modelRef = groundedText ? plan?.modelRef.trim() : void 0;
	if (!groundedText || !modelRef) {
		greetingFailures.set(params.cacheKey, {
			factsHash: params.factsHash,
			retryAfter: params.at + SYSTEM_AGENT_GREETING_FAILURE_RETRY_MS
		});
		return resolveSystemAgentGreetingFallback(params.overview, params.facts);
	}
	greetingFailures.delete(params.cacheKey);
	try {
		await mutateGreetingState(params.cacheStore, (current) => {
			if (current?.factsHash && current.factsHash !== params.factsHash && (current.at ?? Number.NEGATIVE_INFINITY) >= params.at) return current;
			return {
				...current,
				lastSeenAuditSequence: current?.lastSeenAuditSequence ?? 0,
				factsHash: params.factsHash,
				text: groundedText,
				modelRef,
				at: params.at
			};
		}, params.at);
	} catch {}
	params.cacheStore.assertCurrent();
	return {
		text: groundedText,
		source: "model"
	};
}
async function resolveSystemAgentGreeting(params) {
	const resolution = await resolveSystemAgentGreetingText(params);
	params.cacheStore?.assertCurrent();
	return {
		...resolution,
		text: withHostOwnedAlerts(resolution.text, params.facts)
	};
}
async function resolveSystemAgentGreetingText(params) {
	if (requiresDeterministicGreeting(params.overview)) return resolveSystemAgentGreetingFallback(params.overview, params.facts);
	let cacheStore;
	try {
		cacheStore = params.cacheStore ?? params.openCache?.() ?? createSystemAgentGreetingCache();
	} catch {
		return resolveSystemAgentGreetingFallback(params.overview, params.facts);
	}
	const factsHash = systemAgentGreetingFactsHash(params.overview, params.facts);
	let cached;
	try {
		cached = await readGreetingCache(cacheStore);
	} catch {
		return resolveSystemAgentGreetingFallback(params.overview, params.facts);
	}
	if (typeof cached?.text === "string" && cached.text.trim() && cached.factsHash === factsHash && typeof cached.modelRef === "string" && typeof cached.at === "number") return {
		text: cached.text,
		source: "cache"
	};
	if (params.allowInference === false) return resolveSystemAgentGreetingFallback(params.overview, params.facts);
	cacheStore.assertCurrent();
	const cacheKey = params.cacheOwner ?? (params.cacheStore || params.openCache ? cacheStore : defaultGreetingCacheKey);
	const at = (params.now ?? Date.now)();
	const failure = greetingFailures.get(cacheKey);
	if (failure?.factsHash === factsHash && failure.retryAfter > at) return resolveSystemAgentGreetingFallback(params.overview, params.facts);
	if (failure && failure.retryAfter <= at) greetingFailures.delete(cacheKey);
	let flights = greetingFlights.get(cacheKey);
	if (!flights) {
		flights = /* @__PURE__ */ new Map();
		greetingFlights.set(cacheKey, flights);
	}
	const existingFlight = flights.get(factsHash);
	if (existingFlight) {
		const result = await existingFlight;
		cacheStore.assertCurrent();
		return result;
	}
	const flight = resolveUncachedSystemAgentGreeting({
		...params,
		cacheStore,
		factsHash,
		cacheKey,
		at
	});
	flights.set(factsHash, flight);
	try {
		return await flight;
	} finally {
		if (flights.get(factsHash) === flight) flights.delete(factsHash);
	}
}
/** Persist the config-audit cursor only after the host has delivered the greeting. */
async function acknowledgeSystemAgentGreetingDelivery(params) {
	if (!Number.isSafeInteger(params.auditSequence) || params.auditSequence < 0) return;
	try {
		await mutateGreetingState(params.cacheStore ?? params.openCache?.() ?? createSystemAgentGreetingCache(), (current) => {
			const lastSeenAuditSequence = Math.max(current?.lastSeenAuditSequence ?? 0, params.auditSequence);
			if (current?.lastSeenAuditSequence === lastSeenAuditSequence) return current;
			return {
				...current,
				lastSeenAuditSequence
			};
		}, (params.now ?? Date.now)());
	} catch {}
}
/** Quick actions are host-derived so model wording can never invent executable replies. */
function buildSystemAgentGreetingQuestion(overview, facts) {
	const exceptional = [];
	if (!overview.config.exists) exceptional.push({
		label: "Set up OpenClaw",
		reply: "setup"
	});
	else if (!overview.config.valid) exceptional.push({
		label: "Inspect config",
		reply: "doctor"
	});
	else if (!overview.defaultModel) exceptional.push(overview.setupModel ? {
		label: "Choose agent model",
		reply: "model setup"
	} : {
		label: "Set up inference",
		reply: "setup"
	});
	if (!overview.gateway.reachable) {
		exceptional.push({
			label: "Run gateway status",
			reply: "gateway status"
		});
		exceptional.push({
			label: "Restart gateway",
			reply: "restart gateway"
		});
	}
	if (!facts.channelHealth.available || facts.channelHealth.degraded.length > 0) exceptional.push({
		label: "Check channel health",
		reply: "health"
	});
	if (facts.updateAvailable) exceptional.push({
		label: "Show update",
		reply: "status"
	});
	const options = exceptional.slice(0, 2);
	if (overview.defaultModel) options.push({
		label: "Talk to my agent",
		reply: "talk to agent",
		recommended: exceptional.length === 0 && !facts.recentExternalEdit && facts.channelHealth.available && overview.config.exists && overview.config.valid && overview.gateway.reachable
	});
	options.push({
		label: facts.recentExternalEdit ? "Review recent changes" : "Show recent changes",
		reply: "audit"
	});
	return {
		id: "system-agent-quick-actions",
		header: "Quick actions",
		question: "What would you like me to do?",
		options
	};
}
//#endregion
//#region src/system-agent/new-agent-welcome.ts
async function buildNewAgentWelcome(params) {
	const choices = (await Promise.all(listAgentRoles().map(loadAgentRole))).map(({ manifest: { agent } }, index) => {
		if (!agent.name || !agent.description) throw new Error(`Agent role "${agent.id}" requires a name and description.`);
		return {
			title: agent.name,
			text: `${index + 1}. ${agent.name} — ${agent.description}`
		};
	});
	const welcome = [
		"Let's create an agent. Pick a role or describe your own; I'll propose creation for your approval.",
		...choices.map(({ text }) => text),
		`5. A small team (${choices[0].title.toLowerCase()} plus the three specialists).`,
		"6. Something custom (tell me the name and the kind of work)."
	].join("\n");
	params.engine.noteAssistantMessage(welcome);
	return welcome;
}
//#endregion
//#region src/system-agent/transcript-store.ts
const SYSTEM_AGENT_TRANSCRIPT_SCOPE = "system-agent-transcript";
const SYSTEM_AGENT_TRANSCRIPT_MAX_ENTRIES = 1e3;
/** Retain the turn's original store across inference, persistence, and publication. */
function createSystemAgentTranscriptStore(opts = {}) {
	const options = {
		...opts,
		scope: SYSTEM_AGENT_TRANSCRIPT_SCOPE,
		maxEntries: SYSTEM_AGENT_TRANSCRIPT_MAX_ENTRIES
	};
	const reader = createSqliteAuditRecordReader(options);
	const writer = createSqliteAuditRecordWriter(options);
	const appendTurn = (turn) => writer.register(`${turn.at}:${randomUUID()}`, turn, turn.at);
	return {
		assertCurrent: reader.assertCurrent,
		appendTurn,
		appendReset: () => appendTurn({
			role: "reset",
			text: "",
			at: Date.now()
		}),
		async readTail(limit, afterLastReset = false) {
			const records = await reader.latest({ limit });
			reader.assertCurrent();
			const entries = records.toReversed().map((entry) => entry.value);
			const resetIndex = afterLastReset ? entries.findLastIndex((turn) => turn.role === "reset") : -1;
			return (afterLastReset ? entries.slice(resetIndex + 1) : entries).filter((turn) => turn.role !== "reset");
		}
	};
}
/** Read the newest window in conversational order without exposing reset markers. */
async function readTranscriptTailAsync(limit, opts = {}) {
	return await createSystemAgentTranscriptStore(opts).readTail(limit, opts.afterLastReset);
}
//#endregion
//#region src/gateway/server-methods/system-agent-approval.ts
function sameApprovalAuthority(left, right) {
	if (left.kind !== right.kind || left.claimId !== right.claimId || left.lifecycleGeneration !== right.lifecycleGeneration || left.operationalRunInstance.instanceId !== right.operationalRunInstance.instanceId || left.operationalRunInstance.runId !== right.operationalRunInstance.runId) return false;
	return left.kind === "worker" && right.kind === "worker" ? sameWorkerSessionTurnClaim(left.turnClaim, right.turnClaim) : true;
}
async function retireSystemAgentProposal(session, manager, proposalHash) {
	try {
		const pending = session.pendingApproval;
		if (pending?.proposalHash === proposalHash) {
			session.pendingApproval = void 0;
			await manager?.forceDenyIfRuntimeAuthorityClosed(pending.id);
		}
	} finally {
		await session.engine.resolveOperatorApproval(null, proposalHash, void 0, "cancelled");
	}
}
async function reconcileSystemAgentApproval(session, manager, authority) {
	const pending = session.pendingApproval;
	if (!pending) return;
	const closed = await manager?.forceDenyIfRuntimeAuthorityClosed(pending.id);
	const snapshot = await manager?.getSnapshot(pending.id);
	if (!closed && snapshot && (snapshot.resolvedAtMs === void 0 || snapshot.decision === "allow-once") && snapshot.agentRuntimeDelegatedAuthority && sameApprovalAuthority(snapshot.agentRuntimeDelegatedAuthority, authority) && session.engine.getPendingOperatorProposal()?.hash === pending.proposalHash) return pending;
	await retireSystemAgentProposal(session, closed ? void 0 : manager, pending.proposalHash);
}
async function prepareDelegatedSystemAgentApproval(params) {
	const callerIdentity = getGatewayToolCallerIdentity();
	const approvalAuthority = callerIdentity?.approvalAuthority ?? (callerIdentity?.operationalRunInstance ? getActiveAgentRunDelegatedAuthority(callerIdentity.operationalRunInstance) : void 0);
	if (!approvalAuthority) throw new Error("delegated OpenClaw approval requires an active run authority");
	const runtimeApprovalAuthority = callerIdentity?.workerTurnClaim ? {
		kind: "worker",
		...approvalAuthority,
		turnClaim: callerIdentity.workerTurnClaim
	} : {
		kind: "local",
		...approvalAuthority
	};
	const isAuthorityActive = () => {
		if (!validateAgentRunDelegatedAuthority(approvalAuthority) || callerIdentity?.approvalAuthorityCheck?.() === false || callerIdentity?.receiptAuthority?.() === false || callerIdentity?.approvalSignals?.some((signal) => signal.aborted) || callerIdentity?.gatewayContextResolver && !callerIdentity.gatewayContextResolver()) return false;
		return runtimeApprovalAuthority.kind === "local" || callerIdentity !== void 0 && params.context.validateAgentRuntimeApprovalAuthority?.({
			kind: "agentRuntime",
			agentId: callerIdentity.agentId,
			sessionKey: callerIdentity.sessionKey,
			operationalRunInstance: runtimeApprovalAuthority.operationalRunInstance,
			delegatedAuthority: runtimeApprovalAuthority
		}) === true;
	};
	const assertLiveApprovalAuthority = () => {
		if (!isAuthorityActive() || params.sessions.get(params.sessionId) !== params.session) throw new Error(`${SYSTEM_AGENT_APPROVAL_TERMINAL_MESSAGES.cancelled} The system-agent approval authority is no longer active.`);
	};
	const manager = params.context.systemAgentApprovalManager;
	assertLiveApprovalAuthority();
	await reconcileSystemAgentApproval(params.session, manager, runtimeApprovalAuthority);
	assertLiveApprovalAuthority();
	return async function resolveProposal(proposal, corrective = false) {
		const withProposalFailureCleanup = async (resolve) => {
			try {
				return await resolve();
			} catch (error) {
				if (params.sessions.get(params.sessionId) === params.session) await retireSystemAgentProposal(params.session, manager, proposal.hash);
				throw error;
			}
		};
		return await withProposalFailureCleanup(async () => {
			assertLiveApprovalAuthority();
			if (params.session.pendingApproval) {
				const pending = await reconcileSystemAgentApproval(params.session, manager, runtimeApprovalAuthority);
				if (pending?.proposalHash === proposal.hash) return {
					kind: "approval",
					...pending
				};
				throw new Error("OpenClaw change is no longer pending. Retry the request.");
			}
			const applyDecision = async (decision, terminalStatus) => {
				if (decision && decision !== "deny") assertLiveApprovalAuthority();
				return await params.session.engine.resolveOperatorApproval(decision, proposal.hash, assertLiveApprovalAuthority, terminalStatus);
			};
			const resolveCorrection = async (reply) => {
				if (proposal.operation.kind !== "config-set" && proposal.operation.kind !== "config-unset" && proposal.operation.kind !== "config-set-ref") return;
				const correction = params.session.engine.getPendingOperatorProposal();
				if (reply.applied === true || !correction) return;
				const active = isAuthorityActive() && params.sessions.get(params.sessionId) === params.session;
				if (corrective || !active) {
					await retireSystemAgentProposal(params.session, manager, correction.hash);
					const notice = active ? "OpenClaw repair stopped after one corrective attempt. Check the current settings before making a new request." : "OpenClaw correction cancelled because its approval authority ended. Check the current settings before making a new request.";
					params.session.engine.noteAssistantMessage(notice);
					return {
						kind: "completed",
						reply: {
							...reply,
							text: `${reply.text}\n\n${notice}`
						}
					};
				}
				const resolution = await resolveProposal(correction, true);
				const retainWriteReport = (result) => ({
					...result,
					text: `${reply.text}\n\n${result.text}`
				});
				return resolution.kind === "completed" ? {
					kind: "completed",
					reply: retainWriteReport(resolution.reply)
				} : {
					...resolution,
					completion: resolution.completion.then(retainWriteReport)
				};
			};
			if (callerIdentity?.fullPermission === true) {
				const reply = await applyDecision("allow-once");
				if (!reply) throw new Error("OpenClaw change is no longer pending. Retry the request.");
				return await resolveCorrection(reply) ?? {
					kind: "completed",
					reply
				};
			}
			if (!manager) throw new Error("OpenClaw approval registry unavailable");
			const description = describeSystemAgentPersistentOperation(proposal.operation);
			const request = {
				title: "OpenClaw change",
				description,
				command: description,
				proposalHash: proposal.hash,
				allowedDecisions: SYSTEM_AGENT_APPROVAL_DECISIONS,
				agentId: params.delegation.agentId ?? null,
				sessionKey: params.delegation.sessionKey ?? null,
				sessionId: params.sessionId,
				turnSourceChannel: params.delegation.turnSourceChannel ?? null,
				turnSourceTo: params.delegation.turnSourceTo ?? null,
				turnSourceAccountId: params.delegation.turnSourceAccountId ?? null,
				turnSourceThreadId: params.delegation.turnSourceThreadId ?? null,
				runId: callerIdentity?.operationalRunInstance?.runId ?? null
			};
			const record = manager.create(request, SYSTEM_AGENT_APPROVAL_TIMEOUT_MS, `system-agent:${randomUUID()}`);
			const completion = createDeferredCore();
			const pendingApproval = {
				id: record.id,
				proposalHash: proposal.hash,
				completion: completion.promise
			};
			const cancelledReply = {
				text: SYSTEM_AGENT_APPROVAL_TERMINAL_MESSAGES.cancelled,
				action: "none",
				applied: false
			};
			const failedReply = {
				text: SYSTEM_AGENT_APPROVAL_TERMINAL_MESSAGES.failed,
				action: "none",
				applied: false
			};
			params.session.pendingApproval = pendingApproval;
			record.agentRuntimeDelegatedAuthority = runtimeApprovalAuthority;
			record.approvalAuthority = () => isAuthorityActive() && params.sessions.get(params.sessionId) === params.session && params.session.pendingApproval === pendingApproval;
			if (callerIdentity?.approvalSignals?.length) record.approvalSignals = callerIdentity.approvalSignals;
			await manager.register(record, SYSTEM_AGENT_APPROVAL_TIMEOUT_MS);
			const requestEvent = buildRequestedApprovalEvent(record, "system-agent");
			const publishApplicationResult = (decision, applicationStatus) => {
				const resolvedEvent = {
					id: record.id,
					decision,
					resolvedBy: record.resolvedBy ?? null,
					ts: Date.now(),
					request,
					applicationStatus
				};
				broadcastApprovalResolvedEvent({
					approvalKind: "system-agent",
					context: params.context,
					record,
					event: resolvedEvent
				});
				params.context.approvalEvents?.publishResolved("system-agent", resolvedEvent);
				params.context.forwardSystemAgentApprovalResolved?.(resolvedEvent).catch((error) => {
					params.context.logGateway?.error?.(`OpenClaw approval chat resolution failed: ${String(error)}`);
				});
			};
			handlePendingApprovalRequest({
				manager,
				record,
				respond: () => void 0,
				context: params.context,
				requestEventName: "openclaw.approval.requested",
				requestEvent,
				twoPhase: true,
				approvalKind: "system-agent",
				deliverRequest: async () => {
					try {
						return await params.context.forwardSystemAgentApprovalRequest?.(requestEvent) ?? false;
					} catch (error) {
						params.context.logGateway?.error?.(`OpenClaw approval chat delivery failed: ${String(error)}`);
						return false;
					}
				},
				keepPendingWithoutRoute: true,
				requireDeliveryRoute: false,
				afterDecision: async (decision) => {
					try {
						const { reply, correction } = await runWithGatewayIndependentRootWorkContinuation(() => runSystemAgentGatewayTask(async () => {
							if (params.sessions.get(params.sessionId) !== params.session || params.session.pendingApproval !== pendingApproval) return {
								reply: cancelledReply,
								correction: void 0
							};
							const transcript = createSystemAgentTranscriptStore({ assertCurrent: () => {
								if (params.sessions.get(params.sessionId) !== params.session) throw new Error("OpenClaw approval session changed during audit persistence");
							} });
							let historyStart = params.session.engine.historyLength();
							const terminalStatus = record.status === "expired" ? "expired" : !isAuthorityActive() || record.status === "cancelled" ? "cancelled" : void 0;
							params.session.pendingApproval = void 0;
							try {
								const appliedReply = await withProposalFailureCleanup(() => applyDecision(terminalStatus ? null : decision, terminalStatus)) ?? cancelledReply;
								return {
									reply: appliedReply,
									correction: await resolveCorrection(appliedReply)
								};
							} catch {
								historyStart = params.session.engine.historyLength();
								params.session.engine.noteAssistantMessage(failedReply.text);
								return {
									reply: failedReply,
									correction: void 0
								};
							} finally {
								const at = Date.now();
								for (const turn of params.session.engine.historySince(historyStart)) await transcript.appendTurn({
									...turn,
									at
								});
							}
						}), "system-agent:task");
						completion.resolve(correction?.kind === "approval" ? correction.completion : correction?.reply ?? reply);
						if (decision) {
							const applicationStatus = reply?.applied === true ? "applied" : "not-applied";
							publishApplicationResult(decision, applicationStatus);
						}
					} catch (error) {
						completion.resolve(failedReply);
						if (decision) publishApplicationResult(decision, "not-applied");
						throw error;
					}
				},
				afterDecisionErrorLabel: "OpenClaw approval apply failed"
			}).catch((error) => {
				if (!(error instanceof ApprovalObserverClosedError)) completion.resolve(failedReply);
			});
			return {
				kind: "approval",
				...pendingApproval
			};
		});
	};
}
//#endregion
//#region src/gateway/server-methods/system-agent-chat-params.ts
const SYSTEM_AGENT_UI_CONTEXT_PAGE_PATTERN = /^[A-Za-z0-9/_-]{1,64}$/u;
function sanitizeSystemAgentChatParams(params) {
	if (!params || typeof params !== "object" || Array.isArray(params)) return params;
	const record = params;
	const context = record.context;
	if (context === void 0) return params;
	const contextRecord = record.delegation === void 0 && context && typeof context === "object" && !Array.isArray(context) ? context : void 0;
	const page = typeof contextRecord?.page === "string" ? contextRecord.page.trim() : "";
	if (!contextRecord || !SYSTEM_AGENT_UI_CONTEXT_PAGE_PATTERN.test(page)) {
		const { context: _droppedContext, ...rest } = record;
		return rest;
	}
	const plugin = normalizeSystemAgentPluginReference(contextRecord.plugin);
	return {
		...record,
		context: {
			page,
			...plugin ? { plugin } : {}
		}
	};
}
//#endregion
//#region src/gateway/server-methods/system-agent-chat-turn.ts
/**
* Build the welcome-only result for rejoining an existing session. A
* reconnecting client must re-render the live wizard/question controls the
* session still awaits; the stale welcome question only fills in when no live
* interaction exists.
*/
function buildSystemAgentRejoinResult(params) {
	const rejoin = params.engine.decorateRejoinReply({
		text: params.welcome,
		action: "none"
	});
	return {
		sessionId: params.sessionId,
		reply: rejoin.text || params.welcome,
		optionalWelcome: params.optionalWelcome === true && !rejoin.sensitive && !rejoin.wizardInputPending && !rejoin.step && !rejoin.question,
		action: "none",
		...rejoin.sensitive === true ? { sensitive: true } : {},
		...rejoin.wizardInputPending === true ? { wizardInputPending: true } : {},
		...rejoin.step ? { step: rejoin.step } : {},
		...rejoin.question ? { question: rejoin.question } : params.welcomeQuestion ? { question: params.welcomeQuestion } : {}
	};
}
function getSystemAgentChatInputError(params) {
	if (params.message !== void 0 && params.wizardAnswer !== void 0) return "Send either message or wizardAnswer, not both.";
	if (params.wizardAnswer !== void 0 && params.delegation !== void 0) return "Delegated OpenClaw sessions cannot submit structured wizard answers.";
	if (params.wizardAnswer !== void 0 && params.reset === true) return "A wizard answer cannot reset its OpenClaw chat session.";
	if (params.wizardCancel !== void 0 && (params.message !== void 0 || params.wizardAnswer !== void 0)) return "Send wizardCancel without a message or wizardAnswer.";
	if (params.wizardCancel !== void 0 && params.delegation !== void 0) return "Delegated OpenClaw sessions cannot cancel hosted wizards.";
	if (params.wizardCancel !== void 0 && params.reset === true) return "A wizard cancel cannot reset its OpenClaw chat session.";
}
async function runSystemAgentChatInput(params) {
	if (params.input.wizardAnswer !== void 0) return await params.engine.answerWizard(params.input.wizardAnswer);
	if (params.input.wizardCancel !== void 0) return await params.engine.cancelWizard(params.input.wizardCancel);
	if (params.input.message === void 0) return;
	return params.input.delegation === void 0 && params.input.context ? await params.engine.handle(params.input.message, { uiContext: params.input.context }) : await params.engine.handle(params.input.message);
}
function buildSystemAgentChatResult(params) {
	const action = params.reply.action === "open-tui" ? "open-agent" : params.reply.action === "open-setup" ? "none" : params.reply.action;
	return {
		sessionId: params.sessionId,
		reply: params.reply.text || (action === "open-agent" ? "Setup here is done — continue with your agent." : "Nothing to change."),
		action,
		...params.reply.handoff?.kind === "model-accounts" ? { handoff: { kind: "model-accounts" } } : {},
		...action === "open-agent" && params.reply.agentDraft ? { agentDraft: params.reply.agentDraft } : {},
		...action === "open-agent" && params.reply.handoff?.kind === "open-tui" && params.reply.handoff.agentId ? { agentId: params.reply.handoff.agentId } : {},
		...params.reply.sensitive === true ? { sensitive: true } : {},
		...params.reply.wizardInputPending === true ? { wizardInputPending: true } : {},
		...params.reply.question ? { question: params.reply.question } : {},
		...params.reply.step ? { step: params.reply.step } : {}
	};
}
async function persistSystemAgentEngineHistory(engine, startIndex, transcript) {
	const at = Date.now();
	for (const turn of engine.historySince(startIndex)) await transcript.appendTurn({
		...turn,
		at
	});
}
//#endregion
//#region src/gateway/server-methods/system-agent.ts
/**
* `openclaw.chat` lets clients (macOS app onboarding, future UIs) run the
* same conversational setup as `openclaw setup`. Structured setup owns
* the pre-inference phase; a new chat session starts only after a live model
* turn succeeds.
*
* The bounded session map owns only in-flight wizard and approval state. The
* sanitized conversation is a durable machine-wide logbook; `reset: true`
* replaces the in-memory session without deleting that transcript.
*/
const MAX_SYSTEM_AGENT_SESSIONS = 8;
const SYSTEM_AGENT_SEED_HISTORY_LIMIT = 30;
const DEFAULT_SYSTEM_AGENT_HISTORY_LIMIT = 100;
const PROVIDER_AUTH_SESSION_TIMEOUT_MS = 15e5;
const PROVIDER_PREPARE_SESSION_TIMEOUT_MS = 72e5;
async function acknowledgeDeliveredSystemAgentWelcome(session, cacheStore) {
	const auditSequence = session.welcomeAuditSequence;
	if (auditSequence === void 0) return;
	await acknowledgeSystemAgentGreetingDelivery({
		auditSequence,
		cacheStore
	});
	delete session.welcomeAuditSequence;
}
async function evictOldestSession(sessions, context) {
	if (sessions.size < MAX_SYSTEM_AGENT_SESSIONS) return;
	let oldestKey;
	let oldestAt = Number.POSITIVE_INFINITY;
	for (const [key, session] of sessions) if (session.lastUsedAt < oldestAt) {
		oldestAt = session.lastUsedAt;
		oldestKey = key;
	}
	if (oldestKey !== void 0) {
		const oldest = sessions.get(oldestKey);
		if (oldest?.pendingApproval) await context.systemAgentApprovalManager?.expire(oldest.pendingApproval.id, "session-evicted");
		await oldest?.engine.dispose();
		sessions.delete(oldestKey);
	}
}
const systemAgentHandlers = {
	"openclaw.chat.history": defineValidatedGatewayHandler("openclaw.chat.history", validateSystemAgentChatHistoryParams, async (options) => {
		const { params, respond } = options;
		const authority = readGatewayRequestMutationAuthority(options);
		authority.assertCurrent();
		const turns = await readTranscriptTailAsync(params.limit ?? DEFAULT_SYSTEM_AGENT_HISTORY_LIMIT);
		authority.assertCurrent();
		respond(true, { turns }, void 0);
	}),
	"openclaw.setup.detect": defineValidatedGatewayHandler("openclaw.setup.detect", validateSystemAgentSetupDetectParams, async ({ params, respond }) => {
		const { detectSetupInference } = await import("./system-agent/setup-inference.js");
		respond(true, await detectSetupInference({}, params.agentId), void 0);
	}),
	"openclaw.setup.auto": defineValidatedGatewayHandler("openclaw.setup.auto", validateSystemAgentSetupAutoParams, async (options) => {
		const { context, respond } = options;
		const authority = retainGatewayRequestMutationAuthority(options);
		try {
			const { runGatewayAutomaticSetup } = await import("./system-agent-setup-auto-DzuVoPcJ.mjs");
			respond(true, await runGatewayAutomaticSetup(context, authority.assertCurrent), void 0);
		} catch (error) {
			if (!(error instanceof SetupAdmissionBusyError)) throw error;
			respondSetupAdmissionBusy(respond);
		} finally {
			authority.release();
		}
	}),
	"openclaw.setup.verify": defineValidatedGatewayHandler("openclaw.setup.verify", validateSystemAgentSetupVerifyParams, async ({ params, respond, context }) => {
		await runSystemAgentGatewayTask(async () => {
			respond(true, await verifyGatewaySetupInference({
				runtime: defaultRuntime,
				context,
				...params
			}), void 0);
		});
	}),
	"openclaw.setup.auth.start": defineValidatedGatewayHandler("openclaw.setup.auth.start", validateSystemAgentSetupAuthStartParams, async (options) => {
		const { params, respond, context, client } = options;
		const { sessionId, ...activation } = params;
		await startSetupActivationWizard({
			sessionId,
			ownerKey: resolveSystemAgentSessionOwnerKey({ client }),
			assertCurrent: readGatewayRequestMutationAuthority(options).assertCurrent,
			activation: {
				...activation,
				kind: "provider-auth"
			},
			timeoutMs: PROVIDER_AUTH_SESSION_TIMEOUT_MS,
			context,
			respond,
			isLocalClient: client?.internal?.isLocalClient === true
		});
	}),
	"openclaw.setup.activate.start": defineValidatedGatewayHandler("openclaw.setup.activate.start", validateSystemAgentSetupActivateStartParams, async ({ params, respond, context }) => {
		const { sessionId, ...activation } = params;
		await startSetupActivationWizard({
			sessionId,
			activation,
			timeoutMs: PROVIDER_AUTH_SESSION_TIMEOUT_MS,
			context,
			respond
		});
	}),
	"openclaw.setup.prepare.start": defineValidatedGatewayHandler("openclaw.setup.prepare.start", validateSystemAgentSetupAuthStartParams, async ({ params, respond, context }) => {
		const sessionId = params.sessionId;
		if (rejectExistingSetupWizardSession({
			sessionId,
			context,
			respond
		})) return;
		const session = await createAdmittedWizardSession(() => new WizardSession(async (prompter, signal, runnerSession) => {
			await runSystemAgentGatewayTask(async () => {
				const [{ prepareAuthChoiceLoadedPluginProvider }, setupShared, authConfig] = await Promise.all([
					import("./provider-auth-choice-BYBo90Wv.mjs"),
					import("./setup.shared-Bl-6JTm4.mjs"),
					import("./provider-auth-config-RXRlGsLB.mjs")
				]);
				const snapshot = await setupShared.readSetupConfigFileSnapshot();
				if (!snapshot.valid) throw new Error("Config is invalid. Run `openclaw doctor` before preparing a model.");
				const baseConfig = snapshot.exists ? snapshot.sourceConfig : {};
				const workspaceDir = params.workspace?.trim() ? resolveUserPath(params.workspace.trim()) : void 0;
				const prepared = await prepareAuthChoiceLoadedPluginProvider({
					authChoice: params.authChoice,
					...params.agentId ? { agentId: params.agentId } : {},
					config: baseConfig,
					prompter,
					runtime: createSystemAgentGatewayRuntime(),
					setDefaultModel: false,
					preserveExistingDefaultModel: true,
					...workspaceDir ? { workspaceDir } : {},
					signal,
					isRemote: true,
					beforePersistentEffect: () => {
						signal.throwIfAborted();
						runnerSession.lockCancellationForPreparation();
					}
				}, (result) => result);
				if (!prepared || prepared.retrySelection) throw new Error(`Provider setup resolution failed for "${params.authChoice}". Run \`openclaw doctor --fix\`, restart the Gateway, and try again.`);
				signal.throwIfAborted();
				runnerSession.lockCancellation();
				await prepared.persistAuthProfiles();
				await authConfig.writeProviderAuthConfig({
					config: baseConfig,
					configSnapshot: snapshot,
					configPatch: authConfig.createProviderAuthConfigPatch(baseConfig, prepared.config),
					credentialsSaved: prepared.authProfiles.length > 0,
					writeOptions: { allowConfigSizeDrop: false }
				});
				if (prepared.agentModelOverride) runnerSession.setPreparedModelRef(prepared.agentModelOverride);
			});
		}, { timeoutMs: PROVIDER_PREPARE_SESSION_TIMEOUT_MS }));
		if (!session) {
			respondSetupAdmissionBusy(respond);
			return;
		}
		context.wizardSessions.set(sessionId, session);
		respond(true, {
			sessionId,
			done: false,
			status: "running"
		}, void 0);
	}),
	/**
	* Structured onboarding: live-test one candidate and persist it on success.
	* Single-flight per gateway process because testing and persistence span
	* multiple config/plugin mutations. Concurrent callers fail fast instead of
	* queueing work that could outlive their RPC timeout. Verification failures never
	* commit a broken model; post-commit application failures explain the saved state.
	*/
	"openclaw.setup.activate": defineValidatedGatewayHandler("openclaw.setup.activate", validateSystemAgentSetupActivateParams, async ({ params, respond }) => {
		try {
			respond(true, await runExclusiveSystemAgentSetupActivation(() => activateGatewaySetupInference({
				...params,
				surface: "gateway",
				runtime: createSystemAgentGatewayRuntime()
			})), void 0);
		} catch (error) {
			if (!(error instanceof SetupAdmissionBusyError)) throw error;
			respondSetupAdmissionBusy(respond);
		}
	}),
	"openclaw.chat": async (options) => {
		const { params: rawParams, respond, client, context } = options;
		const reject = (error) => respond(false, void 0, error);
		const authority = readGatewayRequestMutationAuthority(options);
		const params = sanitizeSystemAgentChatParams(rawParams);
		if (!assertValidParams(params, validateSystemAgentChatParams, "openclaw.chat", respond)) return;
		const inputError = getSystemAgentChatInputError(params);
		if (inputError) {
			reject(errorShape(ErrorCodes.INVALID_REQUEST, inputError));
			return;
		}
		authority.assertCurrent();
		const env = { ...process.env };
		let ownedSession;
		const assertSessionCurrent = () => {
			if (context.systemAgentSessions.get(params.sessionId) !== ownedSession) throw new Error("OpenClaw session changed during audit persistence");
		};
		const transcript = createSystemAgentTranscriptStore({
			env,
			assertCurrent: assertSessionCurrent
		});
		const greetingCache = createSystemAgentGreetingCache({
			env,
			assertCurrent: assertSessionCurrent
		});
		const assertCurrent = () => {
			authority.assertCurrent();
			transcript.assertCurrent();
			greetingCache.assertCurrent();
		};
		const pending = await runSystemAgentGatewayTask(async () => {
			ownedSession = context.systemAgentSessions.get(params.sessionId);
			assertCurrent();
			const sessions = context.systemAgentSessions;
			const sessionId = params.sessionId;
			const ownerKey = resolveSystemAgentSessionOwnerKey({
				delegation: params.delegation,
				client
			});
			if (!ownerKey) {
				if (isGatewayClientProfilePending(client)) {
					reject(authenticatedProfileUnavailableError());
					return;
				}
				reject(errorShape(ErrorCodes.INVALID_REQUEST, "OpenClaw caller identity unavailable."));
				return;
			}
			const boundSession = sessions.get(sessionId);
			if (boundSession && boundSession.ownerKey !== ownerKey) {
				reject(errorShape(ErrorCodes.INVALID_REQUEST, "OpenClaw session belongs to another caller.", { details: buildSystemAgentSessionInvalidatedErrorDetails() }));
				return;
			}
			if (params.reset) {
				const existing = sessions.get(sessionId);
				await transcript.appendReset();
				sessions.delete(sessionId);
				ownedSession = void 0;
				if (existing?.pendingApproval) await context.systemAgentApprovalManager?.expire(existing.pendingApproval.id, "session-reset");
				await existing?.engine.dispose();
			}
			let session = sessions.get(sessionId);
			if ((params.wizardAnswer !== void 0 || params.wizardCancel !== void 0) && !session) {
				reject(errorShape(ErrorCodes.INVALID_REQUEST, params.wizardCancel !== void 0 ? "No active OpenClaw chat session is awaiting that wizard cancel." : "No active OpenClaw chat session is awaiting that wizard answer.", { details: buildSystemAgentSessionInvalidatedErrorDetails() }));
				return;
			}
			let greetingAuditSequence;
			const welcomeOnly = params.wizardAnswer === void 0 && params.wizardCancel === void 0 && (params.message === void 0 || !params.message.trim());
			if (!session) {
				const { verifySystemAgentInferenceWithFallback } = await import("./inference-fallback-CdfWJhtr.mjs");
				const inference = await verifySystemAgentInferenceWithFallback({
					...params.delegation ? { requestingAgentId: params.delegation.agentId } : {},
					runtime: defaultRuntime
				});
				if (!inference.ok) {
					reject(errorShape(ErrorCodes.UNAVAILABLE, `OpenClaw requires working inference: ${inference.error}`, { details: buildSystemAgentInferenceUnavailableErrorDetails() }));
					return;
				}
				const engine = new SystemAgentChatEngine({
					surface: "gateway",
					deps: {
						gatewayHostLifecycle: context.hostLifecycle,
						applyPluginRuntime: context.applyPluginLifecycleChange
					},
					verifiedInference: inference.binding,
					operatorApprovalOnly: params.delegation !== void 0,
					...params.delegation?.agentId ? { requesterAgentId: params.delegation.agentId } : {}
				});
				let persistWelcome = !welcomeOnly;
				let welcome;
				let welcomeQuestion;
				try {
					if (!params.reset) {
						const turns = await transcript.readTail(SYSTEM_AGENT_SEED_HISTORY_LIMIT, true);
						assertCurrent();
						engine.seedHistory(turns.map(({ role, text }) => ({
							role,
							text
						})));
					}
					const welcomeHistoryStart = engine.historyLength();
					if (params.welcomeVariant === "onboarding") {
						const onboardingWelcome = await buildOnboardingWelcome({
							engine,
							locale: client?.connect.locale
						});
						welcome = onboardingWelcome.text;
						welcomeQuestion = onboardingWelcome.question;
					} else if (params.welcomeVariant === "new-agent") welcome = await buildNewAgentWelcome({ engine });
					else {
						const overview = await engine.loadOverview();
						const facts = await loadSystemAgentGreetingFacts({
							env,
							cacheStore: greetingCache
						});
						assertCurrent();
						greetingAuditSequence = facts.auditSequence;
						persistWelcome ||= facts.recentExternalEdit;
						welcome = (await resolveSystemAgentGreeting({
							overview,
							facts,
							planner: (plannerParams) => engine.planGreeting(plannerParams),
							allowInference: welcomeOnly,
							cacheStore: greetingCache,
							cacheOwner: sessions
						})).text;
						assertCurrent();
						welcomeQuestion = buildSystemAgentGreetingQuestion(overview, facts);
						engine.noteAssistantMessage(welcome);
					}
					if (persistWelcome) await persistSystemAgentEngineHistory(engine, welcomeHistoryStart, transcript);
					await evictOldestSession(sessions, context);
					assertCurrent();
				} catch (error) {
					await engine.dispose().catch(() => void 0);
					if (!isSystemAgentInferenceUnavailableError(error)) throw error;
					reject(errorShape(ErrorCodes.UNAVAILABLE, error.message));
					return;
				}
				session = {
					engine,
					welcome,
					optionalWelcome: params.welcomeVariant === void 0 && !persistWelcome,
					...params.welcomeVariant === "new-agent" ? { newAgentWelcome: welcome } : {},
					...welcomeQuestion ? { welcomeQuestion } : {},
					...greetingAuditSequence !== void 0 ? { welcomeAuditSequence: greetingAuditSequence } : {},
					lastUsedAt: Date.now(),
					ownerKey
				};
				sessions.set(sessionId, session);
				ownedSession = session;
				if (welcomeOnly) {
					respond(true, {
						sessionId,
						reply: session.welcome,
						optionalWelcome: session.optionalWelcome,
						action: "none",
						...session.welcomeQuestion ? { question: session.welcomeQuestion } : {}
					}, void 0);
					await acknowledgeDeliveredSystemAgentWelcome(session, greetingCache);
					return;
				}
			}
			session.lastUsedAt = Date.now();
			if (welcomeOnly) {
				if (params.welcomeVariant === "new-agent") {
					const interaction = session.engine.decorateRejoinReply({
						text: "",
						action: "none"
					});
					if (!interaction.wizardInputPending && !interaction.sensitive && !interaction.step && !interaction.question && !session.pendingApproval && !session.engine.getPendingOperatorProposal()) {
						session.newAgentWelcome ??= await buildNewAgentWelcome({ engine: session.engine });
						respond(true, {
							sessionId,
							reply: session.newAgentWelcome,
							optionalWelcome: false,
							action: "none"
						}, void 0);
						return;
					}
				}
				respond(true, buildSystemAgentRejoinResult({
					sessionId,
					welcome: session.welcome,
					optionalWelcome: session.optionalWelcome,
					...session.welcomeQuestion ? { welcomeQuestion: session.welcomeQuestion } : {},
					engine: session.engine
				}), void 0);
				await acknowledgeDeliveredSystemAgentWelcome(session, greetingCache);
				return;
			}
			const historyStart = session.engine.historyLength();
			let reply;
			let resolveProposal;
			try {
				if (params.delegation) resolveProposal = await prepareDelegatedSystemAgentApproval({
					context,
					sessions,
					session,
					sessionId,
					delegation: params.delegation
				});
				const turnReply = await runSystemAgentChatInput({
					engine: session.engine,
					input: params
				});
				if (!turnReply) {
					reject(errorShape(ErrorCodes.INVALID_REQUEST, "OpenClaw chat input is missing."));
					return;
				}
				reply = turnReply;
			} catch (error) {
				await persistSystemAgentEngineHistory(session.engine, historyStart, transcript);
				if (error instanceof SystemAgentWizardAnswerError) {
					reject(errorShape(ErrorCodes.INVALID_REQUEST, error.message));
					return;
				}
				if (!isSystemAgentInferenceUnavailableError(error)) throw error;
				if (sessions.get(sessionId)?.engine === session.engine) sessions.delete(sessionId);
				try {
					await session.engine.dispose();
				} catch {}
				reject(errorShape(ErrorCodes.UNAVAILABLE, error.message, { details: buildSystemAgentSessionInvalidatedErrorDetails() }));
				return;
			}
			let pendingApproval;
			if (resolveProposal) {
				const proposal = session.engine.getPendingOperatorProposal();
				if (proposal) {
					const resolution = await resolveProposal(proposal);
					if (resolution.kind === "completed") reply = resolution.reply;
					else pendingApproval = resolution;
				}
			}
			await persistSystemAgentEngineHistory(session.engine, historyStart, transcript);
			if (pendingApproval) return pendingApproval;
			assertCurrent();
			respond(true, buildSystemAgentChatResult({
				sessionId,
				reply
			}), void 0);
		});
		if (pending) {
			const reply = await racePromiseWithAbortSignal(pending.completion, getAsyncWorkSignal());
			assertCurrent();
			respond(true, buildSystemAgentChatResult({
				sessionId: params.sessionId,
				reply
			}), void 0);
		}
	}
};
//#endregion
export { systemAgentHandlers };
