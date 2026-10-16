import { g as readStringValue } from "./string-coerce-1VuiLaaR.mjs";
import { D as withPluginCache, a as createPluginCache } from "./plugin-cache-BABafcXD.mjs";
import { n as createNonExitingRuntime, t as ExitError } from "./runtime-DlO3PTAd.mjs";
import { t as _usingCtx } from "./usingCtx-DwOBYOJf.mjs";
import { t as runOutsidePluginRuntimeGenerationScope } from "./generation-scope-BNE7YdYW.mjs";
import { dc as validateWizardStartParams, fc as validateWizardStatusParams, lc as validateWizardCancelParams, uc as validateWizardNextParams } from "./src-l2dWvEsN.mjs";
import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { t as formatForLog } from "./ws-log-Cxv8Uaao.mjs";
import { n as defineValidatedGatewayHandler, t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { n as sanitizeWizardStepForClient, t as WizardSession } from "./session-B7kDP8zD.mjs";
import { a as whenAdmittedWizardSessionSettled, n as createAdmittedWizardSession, r as respondSetupAdmissionBusy } from "./setup-admission-CjMw52Uh.mjs";
import { n as canAccessWizardSession } from "./server-wizard-sessions-Bjw33MRW.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/server-methods/wizard.ts
const runDefaultSetupWizard = async (...args) => {
	const { runSetupWizard } = await import("./setup-CjsvWAuZ.mjs");
	return runSetupWizard(...args);
};
const runDefaultChannelSetupWizard = async (...args) => {
	const { runChannelsSetupWizard } = await import("./add-wizard-zzLANe47.mjs");
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
function wizardSessionHandler(method, validate, run) {
	return defineValidatedGatewayHandler(method, validate, async (options) => {
		const session = options.context.wizardSessions.get(options.params.sessionId);
		if (!session || !canAccessWizardSession(session, options.client)) {
			options.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "wizard not found", { details: { code: GatewayErrorDetailCodes.WIZARD_NOT_FOUND } }));
			return;
		}
		await run(options, session);
	});
}
const wizardHandlers = {
	"wizard.start": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateWizardStartParams, "wizard.start", respond)) return;
		const sessionId = randomUUID();
		const flow = params.flow ?? "setup";
		const createSession = () => flow === "channels" ? new WizardSession((prompter, _signal, wizardSession) => runHostedWizard((runtime) => context.channelWizardRunner({
			channel: readStringValue(params.channel),
			onConfigured: (accounts) => wizardSession.setConfiguredAccounts(accounts),
			beforePersistentEffect: async () => wizardSession.lockCancellation(),
			assertPersistentEffectCurrent: () => wizardSession.assertPersistentEffectCurrent()
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
	"wizard.next": wizardSessionHandler("wizard.next", validateWizardNextParams, async ({ params, respond, context }, session) => {
		const { sessionId } = params;
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
	}),
	"wizard.cancel": wizardSessionHandler("wizard.cancel", validateWizardCancelParams, async ({ params, respond, context }, session) => {
		const { sessionId } = params;
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
	}),
	"wizard.status": wizardSessionHandler("wizard.status", validateWizardStatusParams, async ({ params, respond, context }, session) => {
		const { sessionId } = params;
		const status = readWizardStatus(session);
		if (status.status !== "running") await whenAdmittedWizardSessionSettled(session);
		context.purgeWizardSession(sessionId);
		respond(true, status, void 0);
	})
};
//#endregion
export { runDefaultChannelSetupWizard, runDefaultSetupWizard, wizardHandlers };
