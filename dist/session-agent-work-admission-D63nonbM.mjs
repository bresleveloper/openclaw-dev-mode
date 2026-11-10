import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { h as getAgentDeletionDatabaseCleanup } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import "./session-key-CSDERtm3.mjs";
//#region src/sessions/session-lifecycle-identity.ts
function normalizeSessionIdentities(scope, identities) {
	const normalizedScope = scope.trim();
	if (!normalizedScope) throw new Error("session lifecycle scope is required");
	return Array.from(new Set(Array.from(identities, (identity) => identity?.trim()).filter((identity) => Boolean(identity)))).map((identity) => JSON.stringify([normalizedScope, identity])).toSorted();
}
/** Group a snapshot of owner-held identity keys without sharing its mutable indexes. */
function collectSessionIdentityTargets(identities) {
	const targets = /* @__PURE__ */ new Map();
	for (const identity of identities) {
		const [scope, sessionIdentity] = JSON.parse(identity);
		const scoped = targets.get(scope) ?? /* @__PURE__ */ new Set();
		scoped.add(sessionIdentity);
		targets.set(scope, scoped);
	}
	return targets;
}
//#endregion
//#region src/sessions/session-agent-work-admission.ts
var AgentDeletionPendingError = class extends Error {};
const sessionWorkAdmissionClosures = resolveGlobalSingleton(Symbol.for("openclaw.sessionWorkAdmissionClosures"), () => /* @__PURE__ */ new Set());
function agentWorkAdmissionIdentity(target) {
	return {
		agentId: normalizeAgentId(target.agentId),
		statePath: readDatabasePathIdentitySync(target.statePath ?? resolveOpenClawStateSqlitePath(target.env ?? process.env)).canonicalPath
	};
}
/** Journal publication, not an individual attempt, owns the pending-deletion fence. */
function publishAgentDeletionWorkAdmission(target, operationId, pending) {
	const agent = agentWorkAdmissionIdentity(target);
	for (const owner of sessionWorkAdmissionClosures) if (owner.deletionOperationId !== void 0 && matchesAgentWorkAdmission(owner.agent, agent) && (pending || owner.deletionOperationId === operationId)) sessionWorkAdmissionClosures.delete(owner);
	if (pending) sessionWorkAdmissionClosures.add({
		agent,
		identities: [],
		deletionOperationId: operationId,
		reason: new AgentDeletionPendingError(`Agent ${agent.agentId} deletion cleanup is still pending; resolve the cleanup failure, then retry agents.delete.`)
	});
}
/** Deletion's existing ingress fence also owns admission of new session writes. */
function assertAgentSessionWriteAdmission(options, logicalAgentId = options.agentId) {
	const cleanup = getAgentDeletionDatabaseCleanup(options);
	if (cleanup) {
		cleanup.assertCurrentHost();
		return;
	}
	if (sessionWorkAdmissionClosures.size === 0) return;
	const agent = agentWorkAdmissionIdentity({
		agentId: logicalAgentId,
		env: options.env
	});
	const closed = [...sessionWorkAdmissionClosures].find((owner) => owner.identities.length === 0 && matchesAgentWorkAdmission(owner.agent, agent));
	if (closed) throw closed.reason;
}
function matchesAgentWorkAdmission(left, right) {
	return Boolean(left && right && left.agentId === right.agentId && left.statePath === right.statePath);
}
/** Agent drains use the lifecycle owner's existing admission index and closures. */
function createAgentWorkAdmissionQueries(admissions, currentAdmissions) {
	const closures = sessionWorkAdmissionClosures;
	/** The deletion owner reserves this fence before publishing its durable journal. */
	function closeAgentWorkAdmissions(params) {
		const agent = agentWorkAdmissionIdentity(params);
		if ([...currentAdmissions() ?? []].some((admission) => matchesAgentWorkAdmission(admission.agent, agent))) throw new Error("Cannot delete an agent from its own active turn.");
		const owner = {
			agent,
			identities: [],
			reason: params.reason
		};
		closures.add(owner);
		try {
			interruptSessionWorkAdmissionOwners(collectAgentWorkAdmissions(params, true), params.reason);
		} catch (error) {
			closures.delete(owner);
			throw error;
		}
		return () => {
			closures.delete(owner);
		};
	}
	function assertSessionWorkAdmissionOpen(admission) {
		let stopReason;
		for (const owner of closures) {
			if (owner.agent && !matchesAgentWorkAdmission(owner.agent, admission.agent)) continue;
			if (owner.agent && owner.identities.length === 0) throw owner.reason;
			if (!stopReason && owner.identities.some((identity) => admission.identities.has(identity))) stopReason = owner.reason;
		}
		if (stopReason) {
			if (!admission.interrupted) admission.interrupt?.(stopReason);
			throw stopReason;
		}
	}
	function collectAgentWorkAdmissions(target, pendingOnly = false) {
		const agent = agentWorkAdmissionIdentity(target);
		const matching = /* @__PURE__ */ new Set();
		for (const owners of admissions.values()) for (const admission of owners) if (matchesAgentWorkAdmission(admission.agent, agent) && (!pendingOnly || admission.phase === "pending")) matching.add(admission);
		return matching;
	}
	function collectActiveAgentSessionWorkAdmissions(target) {
		const identities = [];
		for (const admission of collectAgentWorkAdmissions(target)) identities.push(...admission.identities);
		return collectSessionIdentityTargets(identities);
	}
	function startAgentWorkAdmissionInterruption(params) {
		return interruptSessionWorkAdmissionOwners(collectAgentWorkAdmissions(params), params.reason, params.assertCurrent);
	}
	return {
		closeAgentWorkAdmissions,
		collectActiveAgentSessionWorkAdmissions,
		startAgentWorkAdmissionInterruption,
		assertSessionWorkAdmissionOpen
	};
}
function interruptSessionWorkAdmissionOwners(admissions, reason, assertCurrent) {
	const interruptedRunIds = /* @__PURE__ */ new Set();
	const interrupted = /* @__PURE__ */ new Set();
	let failure;
	try {
		for (const admission of admissions) {
			assertCurrent?.();
			interrupted.add(admission);
			admission.interrupted ??= reason ?? /* @__PURE__ */ new Error("Session work admission interrupted");
			const receipt = admission.interrupt?.(admission.interrupted);
			if (receipt) interruptedRunIds.add(receipt.runId);
		}
	} catch (error) {
		if (![...interrupted].some((admission) => admission.phase === "acquired")) throw error;
		failure = { error };
	}
	return {
		interruptedRunIds,
		released: Promise.all(Array.from(failure ? interrupted : admissions, (admission) => admission.released)).then(() => {
			if (failure) throw failure.error;
		})
	};
}
//#endregion
export { interruptSessionWorkAdmissionOwners as a, sessionWorkAdmissionClosures as c, createAgentWorkAdmissionQueries as i, collectSessionIdentityTargets as l, agentWorkAdmissionIdentity as n, matchesAgentWorkAdmission as o, assertAgentSessionWriteAdmission as r, publishAgentDeletionWorkAdmission as s, AgentDeletionPendingError as t, normalizeSessionIdentities as u };
