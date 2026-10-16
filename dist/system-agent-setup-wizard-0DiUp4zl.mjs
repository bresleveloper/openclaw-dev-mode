import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { a as getRuntimeConfigAppliedHash, d as hashRuntimeConfigValue } from "./runtime-snapshot-DYptB0Cf.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import "./lanes-D7a4ntDu.mjs";
import { h as setCommandLaneConcurrency, i as enqueueCommandInLane } from "./command-queue-CFE60Avj.mjs";
import { t as WizardSession } from "./session-B7kDP8zD.mjs";
import { a as whenAdmittedWizardSessionSettled, n as createAdmittedWizardSession, r as respondSetupAdmissionBusy } from "./setup-admission-CjMw52Uh.mjs";
import { createAsyncLock } from "@openclaw/fs-safe/advanced";
//#region src/gateway/server-methods/system-agent-execution.ts
function createSystemAgentGatewayRuntime() {
	return {
		...defaultRuntime,
		exit: (code) => {
			throw new Error(`setup step exited with code ${String(code)}`);
		}
	};
}
const withSystemAgentExecution = createAsyncLock();
async function runSystemAgentGatewayTask(task) {
	setCommandLaneConcurrency("system-agent", Number.MAX_SAFE_INTEGER);
	return await enqueueCommandInLane("system-agent", () => withSystemAgentExecution(task));
}
async function verifyGatewaySetupInference(params) {
	const [{ readConfigFileSnapshot }, { verifySetupInference }] = await Promise.all([import("./config/config.js"), import("./system-agent/setup-inference.js")]);
	const runtimeConfig = params.context.getRuntimeConfig();
	const appliedHash = getRuntimeConfigAppliedHash();
	const isCurrent = () => appliedHash !== null && params.context.isConfigReloadSettled() && params.context.getRuntimeConfig() === runtimeConfig && getRuntimeConfigAppliedHash() === appliedHash;
	const isApplied = async () => {
		if (!isCurrent()) return false;
		const snapshot = await readConfigFileSnapshot();
		return snapshot.exists && snapshot.valid && hashRuntimeConfigValue(snapshot.sourceConfig) === appliedHash && isCurrent();
	};
	const unavailable = {
		ok: false,
		status: "unavailable",
		error: "Gateway settings are saved but not active yet. Wait for application or restart to finish, then retry verification."
	};
	if (!await isApplied()) return unavailable;
	const verification = await verifySetupInference({
		runtime: params.runtime,
		...params.modelTarget ? { modelTarget: params.modelTarget } : {},
		...params.agentId ? { agentId: params.agentId } : {}
	});
	return await isApplied() ? verification : unavailable;
}
async function activateGatewaySetupInference(params) {
	let complete;
	let restartRequired;
	let result;
	try {
		result = await runSystemAgentGatewayTask(async () => {
			const { activateSetupInference } = await import("./system-agent/setup-inference.js");
			return activateSetupInference({
				...params,
				onActivationCompletion: (completion) => {
					complete = completion;
				}
			});
		});
	} finally {
		restartRequired = await complete?.();
	}
	return result.ok && restartRequired ? {
		...result,
		gatewayRestartRequired: true
	} : result;
}
//#endregion
//#region src/gateway/server-methods/system-agent-setup-wizard.ts
const authWizardRequests = /* @__PURE__ */ new WeakMap();
async function createSetupActivationSession(params, createSession) {
	const { ownerKey, activation } = params;
	if (!ownerKey || activation.kind !== "provider-auth") return createAdmittedWizardSession(createSession);
	const sessions = params.context.wizardSessions;
	const previous = authWizardRequests.get(sessions);
	if (previous && (previous.ownerKey !== ownerKey || previous.activation.authChoice !== activation.authChoice || previous.activation.agentId !== activation.agentId || previous.activation.workspace !== activation.workspace || previous.activation.modelTarget !== activation.modelTarget || previous.activation.nativeSessionCatalogsEnabled !== activation.nativeSessionCatalogsEnabled)) return;
	let authorityFailure;
	const assertCurrent = () => {
		try {
			params.assertCurrent?.();
		} catch (error) {
			authorityFailure = { error };
			throw error;
		}
	};
	const request = {
		ownerKey,
		activation,
		pendingSessionIds: previous?.pendingSessionIds ?? /* @__PURE__ */ new Set(),
		session: Promise.resolve().then(async () => {
			const predecessor = previous ? await previous.session : void 0;
			try {
				assertCurrent();
				if (predecessor && predecessor !== "superseded") {
					if (predecessor.session.getStatus() === "running" && !predecessor.session.cancel()) return predecessor;
					await whenAdmittedWizardSessionSettled(predecessor.session);
					if (sessions.get(predecessor.sessionId) === predecessor.session) params.context.purgeWizardSession(predecessor.sessionId);
				}
				if (authWizardRequests.get(sessions) !== request) return "superseded";
				const session = await createAdmittedWizardSession(() => {
					assertCurrent();
					return createSession();
				});
				return session ? {
					sessionId: params.sessionId,
					session
				} : void 0;
			} catch (error) {
				if (!authorityFailure) throw error;
				return predecessor;
			}
		})
	};
	authWizardRequests.set(sessions, request);
	request.pendingSessionIds.add(params.sessionId);
	const release = () => {
		if (authWizardRequests.get(sessions) === request) authWizardRequests.delete(sessions);
	};
	try {
		const session = await request.session.catch((error) => {
			release();
			throw error;
		});
		let result;
		if (session && session !== "superseded") {
			whenAdmittedWizardSessionSettled(session.session).then(release, release);
			result = session.sessionId === params.sessionId ? session.session : void 0;
		} else {
			release();
			result = session;
		}
		if (authorityFailure) throw authorityFailure.error;
		return result;
	} finally {
		request.pendingSessionIds.delete(params.sessionId);
	}
}
function rejectExistingSetupWizardSession(params) {
	const sessions = params.context.wizardSessions;
	if (!sessions.has(params.sessionId) && !authWizardRequests.get(sessions)?.pendingSessionIds.has(params.sessionId)) return false;
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
			beforePersistentEffect: () => runnerSession.lockCancellationForPreparation(),
			onPreparationComplete: () => runnerSession.finishPreparation(),
			onCommitStarted: () => runnerSession.lockCancellation()
		});
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
	if (session === "superseded") {
		params.respond(true, {
			sessionId: params.sessionId,
			done: true,
			status: "cancelled"
		}, void 0);
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
export { runSystemAgentGatewayTask as a, createSystemAgentGatewayRuntime as i, startSetupActivationWizard as n, verifyGatewaySetupInference as o, activateGatewaySetupInference as r, rejectExistingSetupWizardSession as t };
