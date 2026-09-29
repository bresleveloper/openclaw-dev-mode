import { D as withPluginCache, a as createPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { g as readStringValue } from "./string-coerce-CIXf7egm.mjs";
import { n as createNonExitingRuntime, t as ExitError } from "./runtime-BC29JSZp.mjs";
import { t as runOutsidePluginRuntimeGenerationScope } from "./generation-scope-DkeaMJw8.mjs";
import { t as _usingCtx } from "./usingCtx-CoYZqMqE.mjs";
import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { $s as validateWizardStatusParams, Qs as validateWizardStartParams, Xs as validateWizardCancelParams, Zs as validateWizardNextParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { t as formatForLog } from "./ws-log-DGu5Y--9.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { n as sanitizeWizardStepForClient, t as WizardSession } from "./session-DiJJJpjA.mjs";
import { a as whenAdmittedWizardSessionSettled, n as createAdmittedWizardSession, r as respondSetupAdmissionBusy } from "./setup-admission-Cpzo4omC.mjs";
import { n as canAccessWizardSession } from "./server-wizard-sessions-Bjw33MRW.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/server-methods/wizard.ts
const runDefaultSetupWizard = async (...args) => {
	const { runSetupWizard } = await import("./setup-C83lv14p.mjs");
	return runSetupWizard(...args);
};
const runDefaultChannelSetupWizard = async (...args) => {
	const { runChannelsSetupWizard } = await import("./add-wizard-BPaiP8UC.mjs");
	return runChannelsSetupWizard(...args);
};
async function runHostedWizard(run) {
	try {
		var _usingCtx$1 = _usingCtx();
		const cache = _usingCtx$1.a(createPluginCache());
		try {
			await runOutsidePluginRuntimeGenerationScope(() => withPluginCache(cache, () => run(createNonExitingRuntime())));
		} catch (error) {
			if (error instanceof ExitError && error.code === 0) return;
			throw error;
		}
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
function readWizardStatus(session) {
	return {
		status: session.getStatus(),
		error: session.getError()
	};
}
function sanitizeWizardResultForClient(result) {
	return result.step ? {
		...result,
		step: sanitizeWizardStepForClient(result.step)
	} : result;
}
/** Resolves a live wizard session or sends the public not-found error. */
function findWizardSessionOrRespond(params) {
	const session = params.context.wizardSessions.get(params.sessionId);
	if (!session || !canAccessWizardSession(session, params.client)) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "wizard not found", { details: { code: GatewayErrorDetailCodes.WIZARD_NOT_FOUND } }));
		return null;
	}
	return session;
}
/** Gateway handlers for the interactive setup wizard session lifecycle. */
const wizardHandlers = {
	"wizard.start": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateWizardStartParams, "wizard.start", respond)) return;
		const sessionId = randomUUID();
		const flow = params.flow ?? "setup";
		const createSession = () => flow === "channels" ? new WizardSession((prompter, _signal, wizardSession) => runHostedWizard((runtime) => context.channelWizardRunner({
			channel: readStringValue(params.channel),
			onConfigured: (accounts) => wizardSession.setConfiguredAccounts(accounts),
			beforePersistentEffect: async () => wizardSession.lockCancellation()
		}, runtime, prompter))) : new WizardSession((prompter) => runHostedWizard((runtime) => context.wizardRunner({
			mode: params.mode,
			workspace: readStringValue(params.workspace),
			installDaemon: params.installDaemon
		}, runtime, prompter)));
		const session = await createAdmittedWizardSession(createSession, flow === "setup");
		if (!session) {
			respondSetupAdmissionBusy(respond);
			return;
		}
		context.wizardSessions.set(sessionId, session);
		const result = await session.next();
		if (result.done) {
			await whenAdmittedWizardSessionSettled(session);
			context.purgeWizardSession(sessionId);
		}
		respond(true, {
			sessionId,
			...sanitizeWizardResultForClient(result)
		}, void 0);
	},
	"wizard.next": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateWizardNextParams, "wizard.next", respond)) return;
		const sessionId = params.sessionId;
		const session = findWizardSessionOrRespond({
			context,
			respond,
			sessionId,
			client
		});
		if (!session) return;
		const answer = params.answer;
		if (answer) {
			if (session.getStatus() !== "running") {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "wizard not running"));
				return;
			}
			try {
				const validationError = await session.answer(answer.stepId ?? "", answer.value);
				if (validationError) {
					respond(true, {
						...sanitizeWizardResultForClient(await session.next()),
						error: validationError
					}, void 0);
					return;
				}
			} catch (err) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatForLog(err)));
				return;
			}
		}
		const result = await session.next();
		if (result.done) {
			await whenAdmittedWizardSessionSettled(session);
			context.purgeWizardSession(sessionId);
		}
		respond(true, sanitizeWizardResultForClient(result), void 0);
	},
	"wizard.cancel": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateWizardCancelParams, "wizard.cancel", respond)) return;
		const sessionId = params.sessionId;
		const session = findWizardSessionOrRespond({
			context,
			respond,
			sessionId,
			client
		});
		if (!session) return;
		if (params.closeInput) {
			session.close(/* @__PURE__ */ new Error("The setup window was closed."));
			await whenAdmittedWizardSessionSettled(session);
			const status = readWizardStatus(session);
			context.purgeWizardSession(sessionId);
			respond(true, status, void 0);
			return;
		}
		const cancelled = session.cancel();
		const status = readWizardStatus(session);
		if (cancelled || status.status !== "running") {
			const purge = () => context.purgeWizardSession(sessionId);
			whenAdmittedWizardSessionSettled(session).then(purge, purge);
		}
		respond(true, status, void 0);
	},
	"wizard.status": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateWizardStatusParams, "wizard.status", respond)) return;
		const sessionId = params.sessionId;
		const session = findWizardSessionOrRespond({
			context,
			respond,
			sessionId,
			client
		});
		if (!session) return;
		const status = readWizardStatus(session);
		if (status.status !== "running") await whenAdmittedWizardSessionSettled(session);
		context.purgeWizardSession(sessionId);
		respond(true, status, void 0);
	}
};
//#endregion
export { runDefaultChannelSetupWizard, runDefaultSetupWizard, wizardHandlers };
