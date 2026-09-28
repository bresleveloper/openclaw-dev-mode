import { n as createNonExitingRuntime } from "./runtime-BC29JSZp.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Ia as validateSystemAgentSetupAuthStartParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { t as resolveManifestDeclaredProviderAuthChoices } from "./provider-auth-choices-CBoGKnJX.mjs";
import { n as ProviderCredentialsSavedError, t as ProviderAuthConfigApplyError } from "./provider-auth-result-B4UlBTW7.mjs";
import { r as isProviderLoginChoiceStartable, t as formatProviderLoginChoiceRef } from "./provider-login-options-DbA7M9R5.mjs";
import { r as createProviderBrowserAuthSession } from "./provider-browser-auth-pWTijt25.mjs";
import { r as completeProviderModelAccess } from "./auth-model-policy-CisYb0MB.mjs";
import { c as runModelsAuthLoginFlowForGateway } from "./auth-Dgee4D48.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { t as refreshModelAuthStateAfterMutation } from "./model-auth-refresh-CxrZyDks.mjs";
import { t as WizardSession } from "./session-DiJJJpjA.mjs";
import { t as rejectExistingSetupWizardSession } from "./system-agent-setup-wizard-BrfITc81.mjs";
import { t as startWizardLogin } from "./wizard-login-0_o4fx_4.mjs";
//#region src/gateway/server-methods/models-auth-login.ts
const modelsAuthLoginHandlers = { "models.authLogin": async ({ params, respond, context, client }) => {
	if (!assertValidParams(params, validateSystemAgentSetupAuthStartParams, "models.authLogin", respond)) return;
	if (!client || !client.connect.scopes?.includes("operator.admin")) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Provider login requires an administrator connection."));
		return;
	}
	if (rejectExistingSetupWizardSession({
		sessionId: params.sessionId,
		context,
		respond
	})) return;
	const resolveChoice = () => {
		const matches = resolveManifestDeclaredProviderAuthChoices({
			config: context.getRuntimeConfig(),
			includeUntrustedWorkspacePlugins: false,
			includeWorkspacePlugins: false
		}).filter((entry) => formatProviderLoginChoiceRef(entry) === params.authChoice);
		return matches.length === 1 ? matches[0] : void 0;
	};
	const choice = resolveChoice();
	if (!choice || !isProviderLoginChoiceStartable(choice)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "That provider login is no longer available. Refresh Models and choose an available sign-in option."));
		return;
	}
	const assertCurrent = () => {
		client.connectionSignal?.throwIfAborted();
		if (client.invalidated || !client.connect.scopes?.includes("operator.admin")) throw new Error("Provider login authority is no longer active.");
		const current = resolveChoice();
		if (!current || !isProviderLoginChoiceStartable(current) || current.pluginId !== choice.pluginId || current.providerId !== choice.providerId || current.methodId !== choice.methodId) throw new Error("That provider login is no longer available.");
	};
	await startWizardLogin({
		client,
		context,
		sessionId: params.sessionId,
		respond,
		assertCurrent,
		createSession: () => new WizardSession(async (prompter, signal, runner) => {
			const runtime = createNonExitingRuntime();
			let modelAccess;
			const openUrl = async (url) => {
				assertFlowCurrent();
				await prompter.openUrl?.(url);
				assertFlowCurrent();
			};
			const browser = client.browserOrigin ? createProviderBrowserAuthSession({
				signal,
				openUrl,
				browserOrigin: client.browserOrigin
			}) : void 0;
			const assertFlowCurrent = () => {
				signal.throwIfAborted();
				assertCurrent();
				browser?.assertCurrent();
			};
			let result;
			try {
				result = await runModelsAuthLoginFlowForGateway({
					provider: choice.providerId,
					method: choice.methodId,
					ownerPluginId: choice.pluginId,
					credentialOnly: true,
					onModelAccessRequested: (request) => {
						modelAccess = request;
					},
					agent: params.agentId,
					config: context.getRuntimeConfig(),
					runtime,
					prompter,
					signal: browser?.signal ?? signal,
					isRemote: true,
					openUrl,
					browserAuthorization: browser?.available ? browser.authorize : void 0,
					assertCurrent: assertFlowCurrent,
					beforePersistentEffect: () => {
						assertFlowCurrent();
						runner.lockCancellationForPreparation();
					},
					refreshAfterLogin: (agentId) => refreshModelAuthStateAfterMutation(context.getRuntimeConfig, agentId)
				});
				if (result.profiles.length === 0) throw new Error(`${choice.choiceLabel} did not return a credential profile.`);
			} finally {
				browser?.close();
			}
			const assertModelAccessCurrent = () => {
				signal.throwIfAborted();
				assertCurrent();
			};
			let modelAccessOutcome;
			try {
				modelAccessOutcome = await completeProviderModelAccess({
					prepared: modelAccess,
					prompter,
					runtime,
					assertCurrent: assertModelAccessCurrent,
					beforeCommit: () => {
						assertModelAccessCurrent();
						runner.lockCancellation();
					}
				});
			} catch (error) {
				throw new ProviderAuthConfigApplyError(error);
			}
			if (modelAccessOutcome.kind === "saved" && modelAccessOutcome.application !== "applied") throw new ProviderCredentialsSavedError("Your sign-in and model access were saved, but OpenClaw has not confirmed that model access is active. Close this dialog. Open Settings and select Apply changes, then send /models.");
			if (result.authRefresh !== "refreshed") throw new ProviderCredentialsSavedError("Your sign-in was saved, but the connection update could not be confirmed. Send /login refresh in chat to try again.");
		}, { timeoutMs: 15e5 })
	});
} };
//#endregion
export { modelsAuthLoginHandlers };
