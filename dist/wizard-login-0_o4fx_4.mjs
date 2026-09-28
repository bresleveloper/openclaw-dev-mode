import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { a as whenAdmittedWizardSessionSettled, n as createAdmittedWizardSession, r as respondSetupAdmissionBusy } from "./setup-admission-Cpzo4omC.mjs";
import { t as bindWizardLoginOwner } from "./server-wizard-sessions-Bjw33MRW.mjs";
//#region src/gateway/server-methods/wizard-login.ts
async function startWizardLogin(params) {
	const { client, context, sessionId, respond } = params;
	const session = await createAdmittedWizardSession(() => {
		params.assertCurrent();
		return params.createSession();
	});
	if (!session) {
		respondSetupAdmissionBusy(respond);
		return;
	}
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
export { startWizardLogin as t };
