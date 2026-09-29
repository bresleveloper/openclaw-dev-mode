import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as getAsyncWorkSignal } from "./async-work-scope-CWk2dk1h.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { r as racePromiseWithAbortSignal } from "./abort-signal-Z3A36sLL.mjs";
import { t as createSqliteAuditRecordStore } from "./sqlite-audit-record-store-CJXR3a08.mjs";
import { n as CONFIG_AUDIT_SCOPE, t as CONFIG_AUDIT_MAX_ENTRIES } from "./io.audit-CcH6Zt2-.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Ag as buildSystemAgentSessionInvalidatedErrorDetails, Fa as validateSystemAgentSetupActivateStartParams, Ia as validateSystemAgentSetupAuthStartParams, La as validateSystemAgentSetupDetectParams, Ma as validateSystemAgentChatHistoryParams, Mu as normalizeSystemAgentPluginReference, Na as validateSystemAgentChatParams, Pa as validateSystemAgentSetupActivateParams, Ra as validateSystemAgentSetupVerifyParams, kg as buildSystemAgentInferenceUnavailableErrorDetails } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { C as runWithGatewayIndependentRootWorkContinuation } from "./gateway-work-admission-CHv_0noy.mjs";
import { O as validateAgentRunDelegatedAuthority, s as getActiveAgentRunDelegatedAuthority } from "./agent-run-registry-DO6Dg2r0.mjs";
import { i as getGatewayToolCallerIdentity } from "./gateway-caller-context-DvDb9xl2.mjs";
import { v as sameWorkerSessionTurnClaim } from "./placement-record-CB6gcJKw.mjs";
import { Z as authenticatedProfileUnavailableError, tt as isGatewayClientProfilePending } from "./session-sharing-C4w_but1.mjs";
import { r as describeSystemAgentPersistentOperation } from "./operations-parse-B6VcQhEV.mjs";
import { n as loadAgentRole, t as listAgentRoles } from "./agent-roles-DYbzEdi7.mjs";
import "./operations-BIpdn-VT.mjs";
import { n as isSystemAgentInferenceUnavailableError } from "./inference-error-C-Vf2B5Y.mjs";
import { r as formatSystemAgentStartupMessage } from "./overview-DJH3LymW.mjs";
import { n as SYSTEM_AGENT_APPROVAL_TIMEOUT_MS, t as SYSTEM_AGENT_APPROVAL_DECISIONS } from "./system-agent-approvals-r0J6k0r_.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { r as listVisiblePendingApprovalRequests } from "./approval-record-lookup-CABTquV3.mjs";
import { t as ApprovalObserverClosedError } from "./exec-approval-lifecycle-CTgxWCaJ.mjs";
import { i as buildRequestedApprovalEvent, r as broadcastApprovalResolvedEvent, s as handlePendingApprovalRequest } from "./approval-shared-Dq8WeEIr.mjs";
import { t as getUpdateAvailable } from "./update-status-state-CWEy2E9S.mjs";
import { n as getHealthCache } from "./health-state-D3F_eTYn.mjs";
import { t as WizardSession } from "./session-DiJJJpjA.mjs";
import { i as runExclusiveSystemAgentSetupActivation, n as createAdmittedWizardSession, r as respondSetupAdmissionBusy, t as SetupAdmissionBusyError } from "./setup-admission-Cpzo4omC.mjs";
import { a as verifyGatewaySetupInference, i as runSystemAgentGatewayTask, n as startSetupActivationWizard, r as activateGatewaySetupInference, t as rejectExistingSetupWizardSession } from "./system-agent-setup-wizard-BrfITc81.mjs";
import { n as SystemAgentChatEngine, r as SystemAgentWizardAnswerError, t as buildOnboardingWelcome } from "./onboarding-welcome-CI0t5lQp.mjs";
import { createHash, randomUUID } from "node:crypto";
//#region src/system-agent/greeting.ts
const SYSTEM_AGENT_GREETING_SCOPE = "system-agent-greeting";
const SYSTEM_AGENT_GREETING_KEY = "latest";
const SYSTEM_AGENT_GREETING_TIMEOUT_MS = 2e4;
const SYSTEM_AGENT_GREETING_FAILURE_RETRY_MS = 6e4;
const SYSTEM_AGENT_GREETING_MAX_CHARS = 700;
const SYSTEM_AGENT_GREETING_MAX_LINES = 5;
const CONFIG_AUDIT_PAGE_SIZE = 5;
const GREETING_STATE_CAS_ATTEMPTS = 4;
const greetingFlights = /* @__PURE__ */ new WeakMap();
const greetingFailures = /* @__PURE__ */ new WeakMap();
let defaultGreetingCache;
function openGreetingCache(env) {
	return createSqliteAuditRecordStore({
		scope: SYSTEM_AGENT_GREETING_SCOPE,
		maxEntries: 1,
		...env ? { env } : {}
	});
}
function getDefaultGreetingCache() {
	defaultGreetingCache ??= openGreetingCache();
	return defaultGreetingCache;
}
function openConfigAuditStore(env) {
	return createSqliteAuditRecordStore({
		scope: CONFIG_AUDIT_SCOPE,
		maxEntries: CONFIG_AUDIT_MAX_ENTRIES,
		...env ? { env } : {}
	});
}
function tryOr(fallback, read) {
	try {
		return read();
	} catch {
		return fallback;
	}
}
function readGreetingCache(store) {
	return store.latest({ limit: 1 })[0]?.value ?? null;
}
function mutateGreetingState(store, mutate, createdAt = Date.now()) {
	for (let attempt = 0; attempt < GREETING_STATE_CAS_ATTEMPTS; attempt += 1) {
		const current = readGreetingCache(store);
		const next = mutate(current);
		if (next === current || store.compareAndSet(SYSTEM_AGENT_GREETING_KEY, current, next, createdAt)) return;
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
function readConfigAuditFacts(store, lastSeenAuditSequence) {
	let auditSequence = 0;
	let beforeSequence;
	let recentExternalEdit = false;
	while (true) {
		const page = store.latest({
			limit: CONFIG_AUDIT_PAGE_SIZE,
			...beforeSequence === void 0 ? {} : { beforeSequence }
		});
		if (beforeSequence === void 0) auditSequence = page[0]?.sequence ?? 0;
		if (page.length === 0) break;
		let reachedWatermark = false;
		for (const entry of page) {
			if (entry.sequence <= lastSeenAuditSequence) {
				reachedWatermark = true;
				break;
			}
			if (entry.value.event === "config.external") recentExternalEdit = true;
		}
		if (reachedWatermark || page.length < CONFIG_AUDIT_PAGE_SIZE) break;
		const nextBeforeSequence = page.at(-1)?.sequence;
		if (nextBeforeSequence === void 0 || nextBeforeSequence === beforeSequence) break;
		beforeSequence = nextBeforeSequence;
	}
	return {
		auditSequence,
		recentExternalEdit
	};
}
/** Read free facts from process/SQLite snapshots; this function never starts a probe. */
function loadSystemAgentGreetingFacts(opts = {}) {
	const cache = tryOr(null, () => readGreetingCache(opts.cacheStore ?? opts.openCache?.() ?? openGreetingCache(opts.env)));
	const auditFacts = tryOr({
		auditSequence: 0,
		recentExternalEdit: false
	}, () => readConfigAuditFacts(opts.configAuditStore ?? openConfigAuditStore(opts.env), cache?.lastSeenAuditSequence ?? 0));
	const update = tryOr(null, () => (opts.getUpdateAvailable ?? getUpdateAvailable)());
	const health = tryOr(null, () => (opts.getHealthCache ?? getHealthCache)());
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
function formatSystemAgentGreetingFallback(overview, facts) {
	const alerts = [];
	if (facts.updateAvailable) alerts.push(`Update ${facts.updateAvailable} is available.`);
	if (facts.channelHealth.degraded.length > 0) alerts.push(`Channels needing attention: ${facts.channelHealth.degraded.join(", ")}.`);
	else if (!facts.channelHealth.available) alerts.push("Channel health is not available yet.");
	return [formatSystemAgentStartupMessage(overview), alerts.join(" ") || void 0].filter((line) => line !== void 0).join("\n");
}
async function withGreetingTimeout(promise, timeoutMs) {
	let timer;
	try {
		return await Promise.race([promise, new Promise((_resolve, reject) => {
			timer = setTimeout(() => reject(/* @__PURE__ */ new Error("system-agent greeting timed out")), timeoutMs);
			if (typeof timer === "object" && "unref" in timer) timer.unref();
		})]);
	} finally {
		if (timer) clearTimeout(timer);
	}
}
async function resolveUncachedSystemAgentGreeting(params) {
	const timeoutMs = params.timeoutMs ?? SYSTEM_AGENT_GREETING_TIMEOUT_MS;
	let plan = null;
	try {
		plan = await withGreetingTimeout(params.planner({
			overview: params.overview,
			facts: params.facts,
			timeoutMs
		}), timeoutMs);
	} catch {
		plan = null;
	}
	const text = plan ? normalizeGreetingText(plan.text) : null;
	const groundedText = text && modelGreetingCoversFacts(text, params.facts) ? text : null;
	if (!groundedText || !plan?.modelRef.trim()) {
		greetingFailures.set(params.cacheStore, {
			factsHash: params.factsHash,
			retryAfter: params.at + SYSTEM_AGENT_GREETING_FAILURE_RETRY_MS
		});
		return {
			text: formatSystemAgentGreetingFallback(params.overview, params.facts),
			source: "template"
		};
	}
	greetingFailures.delete(params.cacheStore);
	try {
		mutateGreetingState(params.cacheStore, (current) => {
			if (current?.factsHash && current.factsHash !== params.factsHash && (current.at ?? Number.NEGATIVE_INFINITY) >= params.at) return current;
			return {
				...current,
				lastSeenAuditSequence: current?.lastSeenAuditSequence ?? 0,
				factsHash: params.factsHash,
				text: groundedText,
				modelRef: plan.modelRef.trim(),
				at: params.at
			};
		}, params.at);
	} catch {}
	return {
		text: groundedText,
		source: "model"
	};
}
async function resolveSystemAgentGreeting(params) {
	const resolution = await resolveSystemAgentGreetingText(params);
	return {
		...resolution,
		text: withHostOwnedAlerts(resolution.text, params.facts)
	};
}
async function resolveSystemAgentGreetingText(params) {
	if (requiresDeterministicGreeting(params.overview)) return {
		text: formatSystemAgentGreetingFallback(params.overview, params.facts),
		source: "template"
	};
	let cacheStore;
	try {
		cacheStore = params.cacheStore ?? params.openCache?.() ?? getDefaultGreetingCache();
	} catch {
		return {
			text: formatSystemAgentGreetingFallback(params.overview, params.facts),
			source: "template"
		};
	}
	const factsHash = systemAgentGreetingFactsHash(params.overview, params.facts);
	let cached;
	try {
		cached = readGreetingCache(cacheStore);
	} catch {
		return {
			text: formatSystemAgentGreetingFallback(params.overview, params.facts),
			source: "template"
		};
	}
	if (typeof cached?.text === "string" && cached.text.trim() && cached.factsHash === factsHash && typeof cached.modelRef === "string" && typeof cached.at === "number") return {
		text: cached.text,
		source: "cache"
	};
	if (params.allowInference === false) return {
		text: formatSystemAgentGreetingFallback(params.overview, params.facts),
		source: "template"
	};
	const at = (params.now ?? Date.now)();
	const failure = greetingFailures.get(cacheStore);
	if (failure?.factsHash === factsHash && failure.retryAfter > at) return {
		text: formatSystemAgentGreetingFallback(params.overview, params.facts),
		source: "template"
	};
	if (failure && failure.retryAfter <= at) greetingFailures.delete(cacheStore);
	let flights = greetingFlights.get(cacheStore);
	if (!flights) {
		flights = /* @__PURE__ */ new Map();
		greetingFlights.set(cacheStore, flights);
	}
	const existingFlight = flights.get(factsHash);
	if (existingFlight) return existingFlight;
	const flight = resolveUncachedSystemAgentGreeting({
		...params,
		cacheStore,
		factsHash,
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
function acknowledgeSystemAgentGreetingDelivery(params) {
	if (!Number.isSafeInteger(params.auditSequence) || params.auditSequence < 0) return;
	try {
		mutateGreetingState(params.cacheStore ?? params.openCache?.() ?? getDefaultGreetingCache(), (current) => {
			const lastSeenAuditSequence = Math.max(current?.lastSeenAuditSequence ?? 0, params.auditSequence);
			if (current?.lastSeenAuditSequence === lastSeenAuditSequence) return current;
			return {
				...current,
				lastSeenAuditSequence
			};
		}, (params.now ?? Date.now)());
	} catch {}
}
function addQuickAction(options, option) {
	if (options.length >= 4 || options.some((candidate) => candidate.reply === option.reply)) return;
	options.push(option);
}
/** Quick actions are host-derived so model wording can never invent executable replies. */
function buildSystemAgentGreetingQuestion(overview, facts) {
	const exceptional = [];
	if (!overview.config.exists) addQuickAction(exceptional, {
		label: "Set up OpenClaw",
		reply: "setup"
	});
	else if (!overview.config.valid) addQuickAction(exceptional, {
		label: "Inspect config",
		reply: "doctor"
	});
	else if (!overview.defaultModel) addQuickAction(exceptional, overview.setupModel ? {
		label: "Choose agent model",
		reply: "model setup"
	} : {
		label: "Set up inference",
		reply: "setup"
	});
	if (!overview.gateway.reachable) {
		addQuickAction(exceptional, {
			label: "Run gateway status",
			reply: "gateway status"
		});
		addQuickAction(exceptional, {
			label: "Restart gateway",
			reply: "restart gateway"
		});
	}
	if (!facts.channelHealth.available || facts.channelHealth.degraded.length > 0) addQuickAction(exceptional, {
		label: "Check channel health",
		reply: "health"
	});
	if (facts.updateAvailable) addQuickAction(exceptional, {
		label: "Show update",
		reply: "status"
	});
	const options = exceptional.slice(0, 2);
	if (overview.defaultModel) addQuickAction(options, {
		label: "Talk to my agent",
		reply: "talk to agent",
		recommended: exceptional.length === 0 && !facts.recentExternalEdit && facts.channelHealth.available && overview.config.exists && overview.config.valid && overview.gateway.reachable
	});
	addQuickAction(options, {
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
function openTranscriptStore(env) {
	return createSqliteAuditRecordStore({
		scope: SYSTEM_AGENT_TRANSCRIPT_SCOPE,
		maxEntries: SYSTEM_AGENT_TRANSCRIPT_MAX_ENTRIES,
		...env ? { env } : {}
	});
}
/** Append one already-sanitized engine history turn to the rolling logbook. */
function appendTranscriptTurn(turn, opts = {}) {
	openTranscriptStore(opts.env).register(`${turn.at}:${randomUUID()}`, turn, turn.at);
}
/** Mark a durable context boundary without deleting earlier logbook rows. */
function appendTranscriptReset(opts = {}) {
	appendTranscriptTurn({
		role: "reset",
		text: "",
		at: Date.now()
	}, opts);
}
/**
* Read the newest window in conversational (oldest-first) order. Markers are
* never exposed; seeding may additionally start after the newest marker.
*/
function readTranscriptTail(limit, opts = {}) {
	const entries = openTranscriptStore(opts.env).latest({ limit }).toReversed().map((entry) => entry.value);
	const resetIndex = opts.afterLastReset ? entries.findLastIndex((turn) => turn.role === "reset") : -1;
	return (opts.afterLastReset ? entries.slice(resetIndex + 1) : entries).filter((turn) => turn.role !== "reset");
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
function persistSystemAgentEngineHistory(engine, startIndex) {
	const at = Date.now();
	for (const turn of engine.historySince(startIndex)) appendTranscriptTurn({
		...turn,
		at
	});
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
		if (!isAuthorityActive() || params.sessions.get(params.sessionId) !== params.session) throw new Error("OpenClaw change cancelled: system-agent approval authority is no longer active. Retry the request if it is still needed.");
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
				if (proposal.operation.kind !== "config-set" && proposal.operation.kind !== "config-set-ref") return;
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
				text: "OpenClaw change cancelled. No change. Retry the request if it is still needed.",
				action: "none",
				applied: false
			};
			const failedReply = {
				text: "OpenClaw change failed to complete. Check the current settings and OpenClaw status before retrying.",
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
				deliverRequest: () => false,
				keepPendingWithoutRoute: true,
				requireDeliveryRoute: false,
				afterDecision: async (decision) => {
					try {
						const { reply, correction } = await runWithGatewayIndependentRootWorkContinuation(() => runSystemAgentGatewayTask(async () => {
							if (params.sessions.get(params.sessionId) !== params.session || params.session.pendingApproval !== pendingApproval) return {
								reply: cancelledReply,
								correction: void 0
							};
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
								persistSystemAgentEngineHistory(params.session.engine, historyStart);
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
	if (record.delegation !== void 0 || !context || typeof context !== "object" || Array.isArray(context)) {
		const { context: _droppedContext, ...rest } = record;
		return rest;
	}
	const contextRecord = context;
	const page = typeof contextRecord.page === "string" ? contextRecord.page.trim() : "";
	if (!SYSTEM_AGENT_UI_CONTEXT_PAGE_PATTERN.test(page)) {
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
//#region src/system-agent/delegation-session.ts
function resolveSystemAgentDelegationKey(delegation) {
	return delegation ? JSON.stringify([delegation.agentId ?? null, delegation.sessionKey ?? null]) : void 0;
}
//#endregion
//#region src/gateway/server-methods/system-agent-session-owner.ts
function resolveSystemAgentSessionOwnerKey(params) {
	const delegationKey = resolveSystemAgentDelegationKey(params.delegation);
	if (delegationKey !== void 0) return delegationKey;
	const profileId = params.client?.authenticatedUserProfile?.profileId.trim();
	if (profileId) return `user:${profileId}`;
	if (isGatewayClientProfilePending(params.client)) return;
	const userId = params.client?.authenticatedUserId?.trim();
	if (userId) return `user:${userId}`;
	const deviceId = params.client?.connect.device?.id.trim();
	if (deviceId) return `device:${deviceId}`;
	const connId = params.client?.connId?.trim();
	return connId ? `connection:${connId}` : void 0;
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
const ACTIVATION_SESSION_TIMEOUT_MS = 48e4;
const PROVIDER_AUTH_SESSION_TIMEOUT_MS = 15e5;
const PROVIDER_PREPARE_SESSION_TIMEOUT_MS = 72e5;
function acknowledgeDeliveredSystemAgentWelcome(session) {
	const auditSequence = session.welcomeAuditSequence;
	if (auditSequence === void 0) return;
	acknowledgeSystemAgentGreetingDelivery({ auditSequence });
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
	"openclaw.approval.list": async ({ respond, client, context }) => {
		const manager = context.systemAgentApprovalManager;
		respond(true, manager ? await listVisiblePendingApprovalRequests({
			manager,
			client,
			...client?.authenticatedUserProfile ? { getCfg: context.getRuntimeConfig } : {}
		}) : [], void 0);
	},
	"openclaw.chat.history": ({ params, respond }) => {
		if (!assertValidParams(params, validateSystemAgentChatHistoryParams, "openclaw.chat.history", respond)) return;
		respond(true, { turns: readTranscriptTail(params.limit ?? DEFAULT_SYSTEM_AGENT_HISTORY_LIMIT) }, void 0);
	},
	/** Structured onboarding: list reusable AI access on this host. */
	"openclaw.setup.detect": async ({ params, respond }) => {
		if (!assertValidParams(params, validateSystemAgentSetupDetectParams, "openclaw.setup.detect", respond)) return;
		const { detectSetupInference } = await import("./system-agent/setup-inference.js");
		respond(true, await detectSetupInference({}, params.agentId), void 0);
	},
	/** Re-run the exact current default-agent inference route without mutating setup. */
	"openclaw.setup.verify": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSystemAgentSetupVerifyParams, "openclaw.setup.verify", respond)) return;
		await runSystemAgentGatewayTask(async () => {
			respond(true, await verifyGatewaySetupInference({
				runtime: defaultRuntime,
				context,
				...params
			}), void 0);
		});
	},
	/** Start one provider-owned OAuth/device-code login over the shared wizard transport. */
	"openclaw.setup.auth.start": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateSystemAgentSetupAuthStartParams, "openclaw.setup.auth.start", respond)) return;
		const { sessionId, ...activation } = params;
		await startSetupActivationWizard({
			sessionId,
			activation: {
				...activation,
				kind: "provider-auth"
			},
			timeoutMs: PROVIDER_AUTH_SESSION_TIMEOUT_MS,
			context,
			respond,
			isLocalClient: client?.internal?.isLocalClient === true
		});
	},
	/** Activate a detected or manual route with server-owned capability review. */
	"openclaw.setup.activate.start": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSystemAgentSetupActivateStartParams, "openclaw.setup.activate.start", respond)) return;
		const { sessionId, ...activation } = params;
		await startSetupActivationWizard({
			sessionId,
			activation,
			timeoutMs: ACTIVATION_SESSION_TIMEOUT_MS,
			context,
			respond
		});
	},
	/** Run one provider-owned prepare flow over the shared wizard transport. */
	"openclaw.setup.prepare.start": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSystemAgentSetupAuthStartParams, "openclaw.setup.prepare.start", respond)) return;
		const sessionId = params.sessionId;
		if (rejectExistingSetupWizardSession({
			sessionId,
			context,
			respond
		})) return;
		const session = await createAdmittedWizardSession(() => new WizardSession(async (prompter, signal, runnerSession) => {
			await runSystemAgentGatewayTask(async () => {
				const [{ prepareAuthChoiceLoadedPluginProvider }, setupShared, authConfig] = await Promise.all([
					import("./provider-auth-choice-ZVbwTUyV.mjs"),
					import("./setup.shared-iQVFZJd6.mjs"),
					import("./provider-auth-config-CW0vG8Ri.mjs")
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
					runtime: {
						...defaultRuntime,
						exit: (code) => {
							throw new Error(`setup step exited with code ${String(code)}`);
						}
					},
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
	},
	/**
	* Structured onboarding: live-test one candidate and persist it on success.
	* Single-flight per gateway process because testing and persistence span
	* multiple config/plugin mutations. Concurrent callers fail fast instead of
	* queueing work that could outlive their RPC timeout. Verification failures never
	* commit a broken model; post-commit application failures explain the saved state.
	*/
	"openclaw.setup.activate": async ({ params, respond }) => {
		if (!assertValidParams(params, validateSystemAgentSetupActivateParams, "openclaw.setup.activate", respond)) return;
		try {
			respond(true, await runExclusiveSystemAgentSetupActivation(async () => {
				const runtime = {
					...defaultRuntime,
					exit: (code) => {
						throw new Error(`setup step exited with code ${String(code)}`);
					}
				};
				return await activateGatewaySetupInference({
					kind: params.kind,
					...params.agentId ? { agentId: params.agentId } : {},
					...params.modelRef !== void 0 ? { modelRef: params.modelRef } : {},
					...params.authChoice !== void 0 ? { authChoice: params.authChoice } : {},
					...params.apiKey !== void 0 ? { apiKey: params.apiKey } : {},
					...params.workspace !== void 0 ? { workspace: params.workspace } : {},
					...params.nativeSessionCatalogsEnabled !== void 0 ? { nativeSessionCatalogsEnabled: params.nativeSessionCatalogsEnabled } : {},
					surface: "gateway",
					runtime
				});
			}), void 0);
		} catch (error) {
			if (!(error instanceof SetupAdmissionBusyError)) throw error;
			respondSetupAdmissionBusy(respond);
		}
	},
	"openclaw.chat": async ({ params: rawParams, respond, client, context }) => {
		const params = sanitizeSystemAgentChatParams(rawParams);
		if (!assertValidParams(params, validateSystemAgentChatParams, "openclaw.chat", respond)) return;
		const inputError = getSystemAgentChatInputError(params);
		if (inputError) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, inputError));
			return;
		}
		const pending = await runSystemAgentGatewayTask(async () => {
			const sessions = context.systemAgentSessions;
			const sessionId = params.sessionId;
			const ownerKey = resolveSystemAgentSessionOwnerKey({
				delegation: params.delegation,
				client
			});
			if (!ownerKey) {
				if (isGatewayClientProfilePending(client)) {
					respond(false, void 0, authenticatedProfileUnavailableError());
					return;
				}
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "OpenClaw caller identity unavailable."));
				return;
			}
			const boundSession = sessions.get(sessionId);
			if (boundSession && boundSession.ownerKey !== ownerKey) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "OpenClaw session belongs to another caller.", { details: buildSystemAgentSessionInvalidatedErrorDetails() }));
				return;
			}
			if (params.reset) {
				const existing = sessions.get(sessionId);
				appendTranscriptReset();
				sessions.delete(sessionId);
				if (existing?.pendingApproval) await context.systemAgentApprovalManager?.expire(existing.pendingApproval.id, "session-reset");
				await existing?.engine.dispose();
			}
			let session = sessions.get(sessionId);
			if ((params.wizardAnswer !== void 0 || params.wizardCancel !== void 0) && !session) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, params.wizardCancel !== void 0 ? "No active OpenClaw chat session is awaiting that wizard cancel." : "No active OpenClaw chat session is awaiting that wizard answer.", { details: buildSystemAgentSessionInvalidatedErrorDetails() }));
				return;
			}
			let greetingAuditSequence;
			const welcomeOnly = params.wizardAnswer === void 0 && params.wizardCancel === void 0 && (params.message === void 0 || !params.message.trim());
			if (!session) {
				const { verifySystemAgentInferenceWithFallback } = await import("./inference-fallback-W1Ur-nrA.mjs");
				const inference = await verifySystemAgentInferenceWithFallback({
					...params.delegation ? { requestingAgentId: params.delegation.agentId } : {},
					runtime: defaultRuntime
				});
				if (!inference.ok) {
					respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `OpenClaw requires working inference: ${inference.error}`, { details: buildSystemAgentInferenceUnavailableErrorDetails() }));
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
				if (!params.reset) engine.seedHistory(readTranscriptTail(SYSTEM_AGENT_SEED_HISTORY_LIMIT, { afterLastReset: true }).map(({ role, text }) => ({
					role,
					text
				})));
				const welcomeHistoryStart = engine.historyLength();
				let persistWelcome = !welcomeOnly;
				let welcome;
				let welcomeQuestion;
				try {
					if (params.welcomeVariant === "onboarding") {
						const onboardingWelcome = await buildOnboardingWelcome({ engine });
						welcome = onboardingWelcome.text;
						welcomeQuestion = onboardingWelcome.question;
					} else if (params.welcomeVariant === "new-agent") welcome = await buildNewAgentWelcome({ engine });
					else {
						const overview = await engine.loadOverview();
						const facts = loadSystemAgentGreetingFacts();
						greetingAuditSequence = facts.auditSequence;
						persistWelcome ||= facts.recentExternalEdit;
						welcome = (await resolveSystemAgentGreeting({
							overview,
							facts,
							planner: (plannerParams) => engine.planGreeting(plannerParams),
							allowInference: welcomeOnly
						})).text;
						welcomeQuestion = buildSystemAgentGreetingQuestion(overview, facts);
						engine.noteAssistantMessage(welcome);
					}
				} catch (error) {
					await engine.dispose().catch(() => void 0);
					if (!isSystemAgentInferenceUnavailableError(error)) throw error;
					respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error.message));
					return;
				}
				if (persistWelcome) persistSystemAgentEngineHistory(engine, welcomeHistoryStart);
				await evictOldestSession(sessions, context);
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
				if (welcomeOnly) {
					respond(true, {
						sessionId,
						reply: session.welcome,
						optionalWelcome: session.optionalWelcome,
						action: "none",
						...session.welcomeQuestion ? { question: session.welcomeQuestion } : {}
					}, void 0);
					acknowledgeDeliveredSystemAgentWelcome(session);
					return;
				}
			}
			session.lastUsedAt = Date.now();
			if (params.wizardAnswer === void 0 && params.wizardCancel === void 0 && (params.message === void 0 || !params.message.trim())) {
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
				acknowledgeDeliveredSystemAgentWelcome(session);
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
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "OpenClaw chat input is missing."));
					return;
				}
				reply = turnReply;
			} catch (error) {
				persistSystemAgentEngineHistory(session.engine, historyStart);
				if (error instanceof SystemAgentWizardAnswerError) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
					return;
				}
				if (!isSystemAgentInferenceUnavailableError(error)) throw error;
				if (sessions.get(sessionId)?.engine === session.engine) sessions.delete(sessionId);
				try {
					await session.engine.dispose();
				} catch {}
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error.message, { details: buildSystemAgentSessionInvalidatedErrorDetails() }));
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
			persistSystemAgentEngineHistory(session.engine, historyStart);
			if (pendingApproval) return pendingApproval;
			respond(true, buildSystemAgentChatResult({
				sessionId,
				reply
			}), void 0);
		});
		if (pending) {
			const reply = await racePromiseWithAbortSignal(pending.completion, getAsyncWorkSignal());
			respond(true, buildSystemAgentChatResult({
				sessionId: params.sessionId,
				reply
			}), void 0);
		}
	}
};
//#endregion
export { systemAgentHandlers };
