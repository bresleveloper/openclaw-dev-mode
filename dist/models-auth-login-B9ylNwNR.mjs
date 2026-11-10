import { n as createNonExitingRuntime } from "./runtime-BazLsT0s.mjs";
import { Ng as errorShape, do as validateSystemAgentSetupAuthStartParams } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { t as resolveManifestDeclaredProviderAuthChoices } from "./provider-auth-choices-D2ZKE-Sc.mjs";
import { t as WizardSession } from "./session-BK80iJWA.mjs";
import { r as createProviderBrowserAuthSession } from "./provider-browser-auth-Dq6ILb54.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { n as ProviderCredentialsSavedError, t as ProviderAuthConfigApplyError } from "./provider-auth-result-B4UlBTW7.mjs";
import { n as localStateOwnerChangedError, t as captureLocalStateMutationGuard } from "./local-state-owner-Ces8bTrZ.mjs";
import { i as isProviderLoginChoiceStartable, r as isProviderCliLoginChoiceStartable, t as formatProviderLoginChoiceRef } from "./provider-login-options-C1Hm1UhP.mjs";
import { r as completeProviderModelAccess } from "./auth-model-policy-B9KdPrcB.mjs";
import { c as runModelsAuthLoginFlowForGateway } from "./auth-B55lIL8N.mjs";
import { t as refreshModelAuthStateAfterMutation } from "./model-auth-refresh-DCZ8NSwG.mjs";
import { n as startSetupActivationWizard, r as startWizardLogin, t as rejectExistingSetupWizardSession } from "./system-agent-setup-wizard-QsNyCX4k.mjs";
import { t as resolveSystemAgentSessionOwnerKey } from "./system-agent-session-owner-khtNzUq8.mjs";
//#region src/gateway/server-methods/models-auth-login.ts
const modelsAuthLoginHandlers = { "models.authLogin": async (options) => {
	const { params, respond, context, client } = options;
	if (!assertValidParams(params, validateSystemAgentSetupAuthStartParams, "models.authLogin", respond)) return;
	if (!client || !client.connect.scopes?.includes("operator.admin")) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Provider login requires an administrator connection."));
		return;
	}
	let assertOwner;
	if (params.expectedOwnerId) try {
		const expectedOwnerId = params.expectedOwnerId;
		assertOwner = () => captureLocalStateMutationGuard(expectedOwnerId, options)();
		assertOwner();
	} catch (error) {
		respond(false, void 0, localStateOwnerChangedError(error));
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
	const isStartable = params.expectedOwnerId ? isProviderCliLoginChoiceStartable : isProviderLoginChoiceStartable;
	const choice = resolveChoice();
	if (!choice || !isStartable(choice)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "That provider login is no longer available. Refresh Models and choose an available sign-in option."));
		return;
	}
	const assertCurrent = () => {
		assertOwner?.();
		client.connectionSignal?.throwIfAborted();
		if (client.invalidated || !client.connect.scopes?.includes("operator.admin")) throw new Error("Provider login authority is no longer active.");
		const current = resolveChoice();
		if (!current || !isStartable(current) || current.pluginId !== choice.pluginId || current.providerId !== choice.providerId || current.methodId !== choice.methodId) throw new Error("That provider login is no longer available.");
	};
	if (choice.appGuidedAuth && choice.credentialOnly !== true) {
		await startSetupActivationWizard({
			sessionId: params.sessionId,
			client,
			ownerKey: resolveSystemAgentSessionOwnerKey({ client }),
			assertCurrent,
			activation: {
				kind: "provider-auth",
				authChoice: choice.choiceId,
				agentId: params.agentId,
				selectModel: params.selectModel === true
			},
			timeoutMs: 15e5,
			context,
			respond,
			isLocalClient: client.internal?.isLocalClient === true
		});
		return;
	}
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
					isRemote: !params.expectedOwnerId,
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
