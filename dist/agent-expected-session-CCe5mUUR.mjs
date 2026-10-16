import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { b as consumeSessionWorkAdmissionHandoff } from "./session-lifecycle-admission-GoxISURZ.mjs";
//#region src/gateway/server-methods/agent-expected-session.ts
var ExpectedExistingSessionChangedError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "ExpectedExistingSessionChangedError";
	}
};
function resolveExpectedExistingSessionConstraint(params) {
	const sessionId = normalizeOptionalString(params.expectedExistingSessionId);
	if (!sessionId) {
		if (params.expectedExistingSessionLifecycleRevision !== void 0) return {
			ok: false,
			error: "expectedExistingSessionLifecycleRevision requires expectedExistingSessionId."
		};
		return { ok: true };
	}
	if (!params.canUseInternalRuntimeHandoff) return {
		ok: false,
		error: "expectedExistingSessionId is reserved for backend callers."
	};
	const handoffId = normalizeOptionalString(params.internalRuntimeHandoffId);
	return {
		ok: true,
		constraint: {
			sessionId,
			lifecycleRevision: params.expectedExistingSessionLifecycleRevision,
			...handoffId ? { handoffId } : {}
		}
	};
}
function validateExpectedExistingSessionTarget(params) {
	if (!params.constraint) return;
	if (!params.requestedSessionKey) return "expectedExistingSessionId requires an explicit session key.";
	if (params.requestedSessionId && params.requestedSessionId !== params.constraint.sessionId) return "conflicting session identity constraints.";
}
function assertExpectedExistingSession(params) {
	if (params.constraint && (params.entry?.sessionId !== params.constraint.sessionId || params.constraint.lifecycleRevision !== void 0 && (params.entry?.lifecycleRevision ?? null) !== params.constraint.lifecycleRevision)) throw new ExpectedExistingSessionChangedError(params.message);
}
function consumeExpectedSessionWorkAdmission(params) {
	const handoffId = params.constraint?.handoffId;
	if (!handoffId) return;
	const lease = consumeSessionWorkAdmissionHandoff({
		handoffId,
		scope: params.scope,
		identities: params.identities,
		onInterrupt: params.onInterrupt
	});
	if (!lease) throw new Error("session work admission handoff is unavailable");
	return lease;
}
//#endregion
export { validateExpectedExistingSessionTarget as a, resolveExpectedExistingSessionConstraint as i, assertExpectedExistingSession as n, consumeExpectedSessionWorkAdmission as r, ExpectedExistingSessionChangedError as t };
