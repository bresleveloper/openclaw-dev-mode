import { d as isConfiguredKeyAuthSource } from "./provider-model-route-auth-C7odu5x8.mjs";
import { o as resolveProviderModelAuthPolicy } from "./model-runtime-policy-DSkspt0X.mjs";
import { c as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-DJRpB3Nd.mjs";
import { i as ensureAuthProfileStoreAsync } from "./store-runtime-CwqGD12G.mjs";
import { r as prepareAgentRuntimeAuth } from "./prepare-auth-B180a1GD.mjs";
import { t as resolveSimpleCompletionSelectionForAgent } from "./simple-completion-selection-pOIS3Loe.mjs";
import { n as resolveCliExecutionAuthProfileId, t as cliBackendAcceptsAuthProfileForwarding } from "./cli-execution-auth-Db8iWS1_.mjs";
import { n as resolveSessionAuthSelection } from "./session-override-CZTCnQMa.mjs";
import { t as captureAuthProfileAuthorization } from "./authorization-B3JnDROQ.mjs";
//#region src/cron/inference-binding.runtime.ts
/** Capture only a selected, current credential owner; never infer a legacy job's history. */
async function captureCronInferenceBinding(params) {
	const { cfg, agentId } = params;
	const model = resolveSimpleCompletionSelectionForAgent({
		cfg,
		agentId,
		modelRef: params.model
	});
	if (!model) throw new Error("Automation model could not be resolved.");
	const cliExecutionProvider = resolveCliRuntimeExecutionProvider({
		cfg,
		agentId,
		provider: model.provider,
		modelId: model.modelId,
		authProfileId: model.profileId
	});
	if (cliExecutionProvider && !cliBackendAcceptsAuthProfileForwarding({
		provider: cliExecutionProvider,
		config: cfg,
		agentId
	})) return;
	const creatorProvider = params.sessionEntry?.providerOverride ?? params.sessionEntry?.modelProvider;
	const creatorSession = creatorProvider && creatorProvider !== model.provider ? void 0 : params.sessionEntry;
	const { agentDir } = model;
	let selection;
	if (cliExecutionProvider) {
		const selectedProfileId = model.profileId ?? creatorSession?.authProfileOverride;
		const profileId = await resolveCliExecutionAuthProfileId({
			cliExecutionProvider,
			authProfileProvider: model.provider,
			config: cfg,
			agentDir,
			selected: selectedProfileId ? {
				authProfileId: selectedProfileId,
				authProfileIdSource: model.profileId || creatorSession?.authProfileOverrideSource === "user" || creatorSession?.authProfileOverrideSource === "user-link" ? "user" : "auto"
			} : void 0
		});
		if (!profileId) return;
		selection = {
			profileId,
			source: model.profileId ? "user" : "auto",
			routeRequirement: void 0
		};
	} else selection = await resolveSessionAuthSelection({
		cfg,
		agentId,
		agentDir,
		provider: model.provider,
		modelId: model.modelId,
		configuredProfileId: model.profileId ?? creatorSession?.authProfileOverride,
		sessionEntry: model.profileId ? void 0 : creatorSession,
		isNewSession: false
	});
	const store = await ensureAuthProfileStoreAsync(agentDir, {
		profileId: selection?.profileId,
		allowKeychainPrompt: false,
		config: cfg
	});
	if (!selection) {
		const [attempt] = prepareAgentRuntimeAuth({
			provider: model.provider,
			modelId: model.modelId,
			config: cfg,
			agentId,
			agentDir,
			authProfileStore: store
		}).attempts;
		if (attempt?.kind !== "profile") {
			const source = attempt?.plan.credentialSource;
			if (source?.kind === "direct" && !isConfiguredKeyAuthSource(source)) throw new Error("Automation requires a stored inference account or a key in provider config. Select an account with model@profile.");
			return;
		}
		selection = {
			profileId: attempt.profileId,
			source: attempt.plan.forwardedAuthProfileSource ?? "auto",
			routeRequirement: attempt.plan.modelRoute?.authRequirement
		};
	}
	const assertSelectionCurrent = await params.authorizeProfile?.(selection.profileId, !model.profileId && selection.profileId === creatorSession?.authProfileOverride);
	const credential = store.profiles[selection.profileId];
	if (!credential) throw new Error("Automation requires an available stored inference account.");
	const authRequirement = selection.routeRequirement ?? resolveProviderModelAuthPolicy({
		provider: model.provider,
		mode: credential.type,
		authFlow: credential.type === "oauth" ? credential.authFlow : void 0
	}).authRequirement;
	if (!authRequirement) throw new Error("Automation requires a supported stored inference authentication route.");
	const authority = await captureAuthProfileAuthorization({
		profileId: selection.profileId,
		agentDir,
		cfg,
		assertCurrent: assertSelectionCurrent ?? (() => {})
	});
	let retained = false;
	try {
		authority.assertCurrent();
		params.retainAuthorization?.(authority);
		retained = params.retainAuthorization !== void 0;
		return {
			version: 1,
			provider: model.provider,
			profileId: selection.profileId,
			authorizationId: authority.authorizationId,
			authRequirement,
			source: model.profileId || creatorSession?.authProfileOverrideSource === "user" || creatorSession?.authProfileOverrideSource === "user-link" || !creatorSession?.authProfileOverride && selection.source === "user" ? "user" : "auto"
		};
	} finally {
		if (!retained) authority.dispose();
	}
}
/** Reacquire the same owner, including its live revocation and replacement checks. */
async function acquireCronInferenceAuthorization(params) {
	const authority = await captureAuthProfileAuthorization({
		profileId: params.binding.profileId,
		agentDir: params.agentDir,
		cfg: params.cfg,
		assertCurrent() {}
	});
	if (authority.authorizationId !== params.binding.authorizationId) {
		authority.dispose();
		throw new Error("Automation inference account was replaced. Explicitly select an authorized account again.");
	}
	try {
		authority.assertCurrent();
		return authority;
	} catch (error) {
		authority.dispose();
		throw error;
	}
}
//#endregion
export { captureCronInferenceBinding as n, acquireCronInferenceAuthorization as t };
