import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { Et as _enum, Jn as string, Pn as number, qn as strictObject } from "./schemas-BOYIvvln.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { b as redactToolPayloadText } from "./redact-B5EGyLvV.mjs";
import { _t as normalizeAgentRunTerminalReplySnapshot } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import { t as SESSION_OBSERVER_HEALTH_VALUES } from "./sessions-KsldKmtI.mjs";
import { d as patchSessionEntryCore, l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { o as resolveSessionSubscriptionKey } from "./session-request-agent-DN7PUqhR.mjs";
import { i as terminalHealthFor } from "./session-activity-notes-D0dQuCKU.mjs";
//#region src/gateway/session-observer-model.ts
const HEADLINE_MAX_CHARS = 120;
const ASSESSMENT_MAX_CHARS = 320;
const MAX_REVISION_FLOORS = 256;
const MAX_SUPERSEDED_RUNS = 256;
const MAX_DORMANT_RUNS = 256;
const MAX_DISABLED_RUNS = 512;
function sessionObserverScopeKey(sessionKey, agentId) {
	return parseAgentSessionKey(sessionKey) ? sessionKey : `agent:${normalizeAgentId(agentId)}:${sessionKey}`;
}
function isSameSessionObserverLifecycle(left, right) {
	return left !== void 0 && right !== void 0 && left.sessionId === right.sessionId && left.lifecycleRevision === right.lifecycleRevision;
}
function resolveSessionObserverDigestForLifecycle(digest, lifecycle) {
	if (!digest || !lifecycle || digest.sessionId !== void 0 && digest.sessionId !== lifecycle.sessionId || (digest.sessionId !== void 0 || digest.lifecycleRevision !== void 0) && digest.lifecycleRevision !== lifecycle.lifecycleRevision) return;
	return {
		...digest,
		...lifecycle.sessionId ? { sessionId: lifecycle.sessionId } : {},
		...lifecycle.lifecycleRevision ? { lifecycleRevision: lifecycle.lifecycleRevision } : {}
	};
}
function rememberSessionObserverRevisionFloor(floors, sessionKey, candidate) {
	const current = floors.get(sessionKey);
	if (!current || !isSameSessionObserverLifecycle(current, candidate) || candidate.revision > current.revision) {
		floors.delete(sessionKey);
		floors.set(sessionKey, candidate);
	}
	pruneMapToMaxSize(floors, MAX_REVISION_FLOORS);
}
function rememberSessionObserverDormantRun(runs, floors, run) {
	runs.delete(run.runId);
	runs.set(run.runId, run);
	while (runs.size > MAX_DORMANT_RUNS) {
		const oldest = runs.keys().next().value;
		if (oldest === void 0) break;
		const evicted = runs.get(oldest);
		runs.delete(oldest);
		if (evicted) rememberSessionObserverRevisionFloor(floors, resolveSessionSubscriptionKey(evicted.sessionKey, evicted.agentId), {
			sessionId: evicted.sessionId,
			lifecycleRevision: evicted.lifecycleRevision,
			revision: evicted.revision,
			previousDigest: evicted.previousDigest
		});
	}
}
function rememberSessionObserverDisabledRun(runs, runId) {
	runs.delete(runId);
	runs.add(runId);
	while (runs.size > MAX_DISABLED_RUNS) {
		const oldest = runs.values().next().value;
		if (oldest === void 0) break;
		runs.delete(oldest);
	}
}
function markSessionObserverRunSuperseded(runs, runId, observedAt) {
	runs.delete(runId);
	runs.set(runId, observedAt);
	pruneMapToMaxSize(runs, MAX_SUPERSEDED_RUNS);
}
function createDormantSessionObserverRun(state) {
	return {
		sessionKey: state.sessionKey,
		sessionId: state.sessionId,
		lifecycleRevision: state.lifecycleRevision,
		runId: state.runId,
		agentId: state.agentId,
		...state.utilityModelRef ? { utilityModelRef: state.utilityModelRef } : {},
		startedAt: state.startedAt,
		lastPersistedAt: state.lastPersistedAt,
		revision: state.revision,
		digestCount: state.digestCount,
		consecutiveFailures: state.consecutiveFailures,
		...state.lastPublishedPreambleHeadline ? { lastPreambleHeadline: state.lastPublishedPreambleHeadline } : {},
		planProgress: state.planProgress,
		previousDigest: state.previousDigest
	};
}
async function defaultPrepareModel(params) {
	const { prepareUtilityCompletionForAgent } = await import("./utility-completion-DsFwAQ17.mjs");
	return await prepareUtilityCompletionForAgent(params);
}
async function defaultCompleteModel(params) {
	const { runIsolatedCompletion } = await import("./isolated-completion-DlkkhAMy.mjs");
	return await runIsolatedCompletion(params);
}
const SESSION_OBSERVER_SYSTEM_PROMPT = [
	"You judge the trajectory of a running AI agent session for an operator status surface.",
	"Judge whether the agent is progressing, grinding through necessary work, stuck in a repeated failing loop, waiting on the user, wrapping up, done, or failed.",
	"Do not transcribe the activity log. Summarize what it is doing and how it is going.",
	"Use American English and present tense. Do not use markdown in string values.",
	"Set health to exactly one of \"on-track\", \"grinding\", \"stuck\", \"waiting-on-user\", \"wrapping-up\", \"done\", or \"failed\".",
	"Return one raw JSON object only, without Markdown fences or surrounding text, for example: {\"headline\":\"Checking the fix\",\"assessment\":\"Tests are passing.\",\"health\":\"on-track\",\"planProgress\":{\"completed\":2,\"total\":3}}. Omit optional fields instead of setting them to null."
].join(" ");
const ModelDigestSchema = strictObject({
	headline: string().min(1),
	assessment: string().min(1).optional(),
	health: _enum(SESSION_OBSERVER_HEALTH_VALUES),
	planProgress: strictObject({
		completed: number().int().nonnegative(),
		total: number().int().nonnegative()
	}).refine((value) => value.completed <= value.total).optional()
}).strict();
function sanitizeSessionObserverModelText(value, maxChars) {
	const normalized = redactToolPayloadText(value).replace(/\s+/gu, " ").trim();
	return truncateUtf16Safe(normalized, maxChars);
}
function defaultReadSession(sessionKey, agentId, storePath) {
	return loadSessionEntryReadOnly({
		sessionKey,
		agentId,
		...storePath ? { storePath } : {}
	});
}
async function defaultPersistDigest(params) {
	let applied = false;
	return await patchSessionEntryCore({
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		...params.storePath ? { storePath: params.storePath } : {}
	}, (entry) => {
		if (params.stillCurrent?.() === false) return null;
		if (params.sessionId !== void 0 && entry.sessionId !== params.sessionId) return null;
		const hasSessionIdentity = params.sessionId !== void 0 || params.digest.sessionId !== void 0;
		if (params.digest.sessionId !== void 0 && entry.sessionId !== params.digest.sessionId || (hasSessionIdentity || params.digest.lifecycleRevision !== void 0) && entry.lifecycleRevision !== params.digest.lifecycleRevision) return null;
		if ((resolveSessionObserverDigestForLifecycle(entry.observerDigest, entry)?.revision ?? 0) >= params.digest.revision) return null;
		applied = true;
		return { observerDigest: params.digest };
	}, {
		preserveActivity: true,
		onCommitted: () => sessionChanges.emit({
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			storePath: params.storePath
		})
	}) === null ? null : applied;
}
async function synthesizeSessionObserverTerminalDigest(params) {
	const runId = params.source.event?.runId ?? params.source.state?.runId;
	if (!runId) return;
	const sessionKey = params.source.event?.sessionKey ?? params.source.state?.sessionKey ?? params.dormant?.sessionKey;
	const agentId = params.source.event?.agentId ?? params.source.state?.agentId ?? params.dormant?.agentId;
	const health = params.source.event ? terminalHealthFor(params.source.event) : params.source.state?.terminalHealth;
	if (!sessionKey || !agentId || !health) return;
	const session = params.readSession(sessionKey, agentId);
	const lifecycle = params.source.state ?? params.dormant ?? session;
	if (!isSameSessionObserverLifecycle(lifecycle, session) || params.source.event?.sessionId !== void 0 && params.source.event.sessionId !== lifecycle?.sessionId) return;
	const previous = [
		params.source.state?.previousDigest,
		params.dormant?.previousDigest,
		session?.observerDigest
	].map((digest) => resolveSessionObserverDigestForLifecycle(digest, lifecycle)).find((digest) => digest?.runId === runId);
	if (!previous) return;
	const sessionId = lifecycle?.sessionId;
	const terminalReply = params.source.event ? normalizeAgentRunTerminalReplySnapshot(params.source.event.data.terminalReply) : params.source.state?.terminalReply;
	const terminalHeadline = terminalReply?.disposition === "visible" ? sanitizeSessionObserverModelText(terminalReply.text, HEADLINE_MAX_CHARS) : void 0;
	const persistBounded = async (candidate) => {
		let lastError;
		for (let attempt = 0; attempt < 2; attempt += 1) {
			if (params.stillCurrent?.() === false) return false;
			try {
				return await params.persistDigest({
					sessionKey,
					sessionId,
					agentId,
					digest: candidate,
					stillCurrent: params.stillCurrent
				}) === true;
			} catch (error) {
				lastError = error;
			}
		}
		throw lastError;
	};
	if (previous.health === health) {
		if (previous.revision > (session?.observerDigest?.revision ?? 0)) await persistBounded(previous);
		return;
	}
	const digest = {
		...previous,
		sessionKey,
		agentId,
		runId,
		health,
		...terminalHeadline ? { headline: terminalHeadline } : {},
		revision: previous.revision + 1,
		updatedAt: params.now()
	};
	return await persistBounded(digest) ? digest : void 0;
}
function buildSessionObserverPrompt(state, notes) {
	const { sessionId: _sessionId, lifecycleRevision: _lifecycleRevision, ...previousDigest } = state.previousDigest ?? {};
	return JSON.stringify({
		previousDigest: state.previousDigest ? previousDigest : null,
		newNotes: notes,
		planProgress: state.planProgress ?? null
	});
}
/** Validates strict model JSON and applies the protocol's hard string caps. */
function normalizeSessionObserverModelOutput(text) {
	let parsed;
	try {
		parsed = JSON.parse(text.trim());
	} catch {
		return null;
	}
	const result = ModelDigestSchema.safeParse(parsed);
	if (!result.success) return null;
	const headline = sanitizeSessionObserverModelText(result.data.headline, HEADLINE_MAX_CHARS);
	const assessment = result.data.assessment ? sanitizeSessionObserverModelText(result.data.assessment, ASSESSMENT_MAX_CHARS) : void 0;
	if (!headline || result.data.assessment && !assessment) return null;
	return {
		headline,
		...assessment ? { assessment } : {},
		health: result.data.health,
		...result.data.planProgress ? { planProgress: result.data.planProgress } : {}
	};
}
//#endregion
export { defaultPersistDigest as a, isSameSessionObserverLifecycle as c, rememberSessionObserverDisabledRun as d, rememberSessionObserverDormantRun as f, synthesizeSessionObserverTerminalDigest as g, sessionObserverScopeKey as h, defaultCompleteModel as i, markSessionObserverRunSuperseded as l, resolveSessionObserverDigestForLifecycle as m, buildSessionObserverPrompt as n, defaultPrepareModel as o, rememberSessionObserverRevisionFloor as p, createDormantSessionObserverRun as r, defaultReadSession as s, SESSION_OBSERVER_SYSTEM_PROMPT as t, normalizeSessionObserverModelOutput as u };
