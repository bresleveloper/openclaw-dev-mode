//#region src/gateway/server-wizard-sessions.ts
const loginOwners = /* @__PURE__ */ new WeakMap();
/** Only credential-login sessions are connection-bound; setup keeps its recovery contract. */
function bindWizardLoginOwner(session, client) {
	loginOwners.set(session, client);
}
function canAccessWizardSession(session, client) {
	const owner = loginOwners.get(session);
	return !owner || owner === client && !owner.invalidated && !owner.connectionSignal?.aborted;
}
const UNCOLLECTED_TERMINAL_RETENTION_MS = 3e5;
/** Creates the in-memory tracker used for active Gateway wizard sessions. */
function createWizardSessionTracker(options) {
	const wizardSessions = /* @__PURE__ */ new Map();
	const terminalSince = /* @__PURE__ */ new Map();
	const now = options?.now ?? Date.now;
	const findRunningWizard = () => {
		for (const [id, session] of wizardSessions) {
			if (!session.isSettled()) {
				terminalSince.delete(id);
				return id;
			}
			const observedAt = terminalSince.get(id);
			if (observedAt === void 0) terminalSince.set(id, now());
			else if (now() - observedAt >= UNCOLLECTED_TERMINAL_RETENTION_MS) {
				wizardSessions.delete(id);
				terminalSince.delete(id);
			}
		}
		return null;
	};
	const purgeWizardSession = (id) => {
		const session = wizardSessions.get(id);
		if (!session) return;
		if (!session.isSettled()) return;
		wizardSessions.delete(id);
		terminalSince.delete(id);
	};
	return {
		wizardSessions,
		findRunningWizard,
		purgeWizardSession
	};
}
//#endregion
export { canAccessWizardSession as n, createWizardSessionTracker as r, bindWizardLoginOwner as t };
