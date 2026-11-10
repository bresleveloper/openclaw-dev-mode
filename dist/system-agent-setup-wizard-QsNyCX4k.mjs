import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { t as WizardSession } from "./session-BK80iJWA.mjs";
import { t as bindWizardLoginOwner } from "./server-wizard-sessions-CH5iw7Uu.mjs";
import { a as whenAdmittedWizardSessionSettled, n as createAdmittedWizardSession, r as respondSetupAdmissionBusy } from "./setup-admission-Cra7-OqR.mjs";
import { n as createSystemAgentGatewayRuntime, t as activateGatewaySetupInference } from "./system-agent-execution-DAJfPE1K.mjs";
//#region src/gateway/server-methods/wizard-login.ts
async function startWizardLogin(params) {
	const { respond } = params;
	const session = await createAdmittedWizardSession(() => {
		params.assertCurrent();
		return params.createSession();
	});
	if (!session) {
		respondSetupAdmissionBusy(respond);
		return;
	}
	await publishWizardLoginSession({
		...params,
		session
	});
}
async function publishWizardLoginSession(params) {
	const { client, context, sessionId, respond, session } = params;
	try {
		params.assertCurrent();
	} catch {
		session.close(/* @__PURE__ */ new Error("Login is no longer available on this connection."));
		await whenAdmittedWizardSessionSettled(session);
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Login is no longer available on this connection."));
		return;
	}
	bindWizardLoginOwner(session, client);
	context.wizardSessions.set(sessionId, session);
	const cancel = () => session.close(/* @__PURE__ */ new Error("Login connection closed."));
	client.connectionSignal?.addEventListener("abort", cancel, { once: true });
	const settled = () => {
		client.connectionSignal?.removeEventListener("abort", cancel);
		if (client.connectionSignal?.aborted || client.invalidated) context.purgeWizardSession(sessionId);
	};
	whenAdmittedWizardSessionSettled(session).then(settled, settled);
	respond(true, {
		sessionId,
		done: false,
		status: "running"
	}, void 0);
}
//#endregion
//#region src/gateway/server-methods/system-agent-setup-wizard.ts
const authWizardRequests = /* @__PURE__ */ new WeakMap();
async function createSetupActivationSession(params, createSession) {
	const { ownerKey, activation } = params;
	if (!ownerKey || activation.kind !== "provider-auth") return createAdmittedWizardSession(createSession);
	const sessions = params.context.wizardSessions;
	const previous = authWizardRequests.get(sessions);
	if (previous && (previous.pending || previous.ownerKey !== ownerKey || previous.activation.authChoice !== activation.authChoice || previous.activation.agentId !== activation.agentId || previous.activation.workspace !== activation.workspace || previous.activation.modelTarget !== activation.modelTarget || previous.activation.selectModel !== activation.selectModel || previous.activation.nativeSessionCatalogsEnabled !== activation.nativeSessionCatalogsEnabled)) return;
	if (previous) {
		previous.pending = true;
		try {
			const predecessor = await previous.session;
			params.assertCurrent?.();
			if (predecessor) {
				if (predecessor.getStatus() === "running" && !predecessor.cancel()) return;
				await whenAdmittedWizardSessionSettled(predecessor);
				params.context.purgeWizardSession(previous.sessionId);
			}
		} finally {
			previous.pending = false;
		}
	}
	const request = {
		ownerKey,
		activation,
		sessionId: params.sessionId,
		pending: true,
		session: createAdmittedWizardSession(() => {
			params.assertCurrent?.();
			return createSession();
		})
	};
	authWizardRequests.set(sessions, request);
	const release = () => {
		if (authWizardRequests.get(sessions) === request) authWizardRequests.delete(sessions);
	};
	try {
		const session = await request.session;
		if (session) whenAdmittedWizardSessionSettled(session).then(release, release);
		else release();
		return session;
	} catch (error) {
		release();
		throw error;
	} finally {
		request.pending = false;
	}
}
function rejectExistingSetupWizardSession(params) {
	const sessions = params.context.wizardSessions;
	if (!sessions.has(params.sessionId) && authWizardRequests.get(sessions)?.sessionId !== params.sessionId) return false;
	params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "wizard session already exists"));
	return true;
}
async function startSetupActivationWizard(params) {
	if (rejectExistingSetupWizardSession(params)) return;
	const session = await createSetupActivationSession(params, () => new WizardSession(async (prompter, signal, runnerSession) => {
		const result = await activateGatewaySetupInference({
			...params.activation,
			surface: "gateway",
			isRemoteProviderAuth: params.isLocalClient !== true,
			runtime: createSystemAgentGatewayRuntime(),
			prompter,
			signal,
			isCancelled: () => signal.aborted,
			assertCurrent: params.assertCurrent,
			beforePersistentEffect: () => {
				params.assertCurrent?.();
				runnerSession.lockCancellationForPreparation();
			},
			onPreparationComplete: () => {
				params.assertCurrent?.();
				runnerSession.finishPreparation();
			},
			onCommitStarted: () => {
				params.assertCurrent?.();
				runnerSession.lockCancellation();
			}
		});
		params.assertCurrent?.();
		signal.throwIfAborted();
		if (!result.ok) {
			if (result.disposition === "rejected-before-promotion") runnerSession.setActivationRejection({
				disposition: result.disposition,
				status: result.status
			});
			throw new Error(result.error);
		}
		runnerSession.setModelActivation({
			modelRef: result.modelRef,
			...result.modelTarget ? { modelTarget: result.modelTarget } : {},
			...result.gatewayRestartRequired ? { gatewayRestartRequired: true } : {}
		});
	}, { timeoutMs: params.timeoutMs }));
	if (!session) {
		respondSetupAdmissionBusy(params.respond);
		return;
	}
	if (params.client) {
		await publishWizardLoginSession({
			client: params.client,
			context: params.context,
			sessionId: params.sessionId,
			respond: params.respond,
			assertCurrent: () => params.assertCurrent?.(),
			session
		});
		return;
	}
	params.context.wizardSessions.set(params.sessionId, session);
	params.respond(true, {
		sessionId: params.sessionId,
		done: false,
		status: "running"
	}, void 0);
}
//#endregion
export { startSetupActivationWizard as n, startWizardLogin as r, rejectExistingSetupWizardSession as t };
