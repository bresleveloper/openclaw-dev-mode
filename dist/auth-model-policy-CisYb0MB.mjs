import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { I as materializeModelPolicyAllowlist, g as resolveMutableAgentEntry, z as parseModelPolicyWildcardRef } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./model-ref-shared-BgRrSHjn.mjs";
import { r as normalizeAgentModelRefForConfig } from "./model-input-DKxKaZGG.mjs";
import { m as resolveConfiguredModelPolicyAllow } from "./model-selection-shared-0uvJbX1M.mjs";
import { C as createRuntimeConfigWriteApplication, x as attachRuntimeConfigWriteApplication } from "./io.runtime-CZWcIUDk.mjs";
import { i as captureGatewayRootWorkAdmissionContinuationScope } from "./gateway-work-admission-CHv_0noy.mjs";
import { t as applyDefaultModel } from "./provider-auth-choice-helpers-BggS0fwD.mjs";
import { r as logConfigUpdated } from "./logging-DLCoHZv9.mjs";
import { l as resolveModelsTargetAgent, u as updateConfig } from "./shared-yzzedLUF.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/commands/models/auth-model-policy.ts
var ProviderModelPolicyChangedError = class extends Error {
	constructor(config) {
		super("Model restrictions changed during sign-in. Choose model access again.");
		this.config = config;
	}
};
function applyProviderLoginDefaultModel(config, model) {
	const next = applyDefaultModel(config, model);
	if (resolveConfiguredModelPolicyAllow({ cfg: config }).configPath === "agents.defaults.models") {
		next.agents ??= {};
		next.agents.defaults ??= {};
		next.agents.defaults.models = config.agents?.defaults?.models;
	}
	return next;
}
/** Provider setup defaults cannot supply consent to change model restrictions. */
function withoutProviderModelPolicy(patch, config) {
	const connection = structuredClone(patch);
	if (connection.agents?.defaults) {
		delete connection.agents.defaults.modelPolicy;
		if (resolveConfiguredModelPolicyAllow({ cfg: config }).configPath === "agents.defaults.models") delete connection.agents.defaults.models;
	}
	for (const agent of [...Object.values(connection.agents?.entries ?? {}), ...connection.agents?.list ?? []]) delete agent.modelPolicy;
	return connection;
}
function snapshotPolicy(config, agentId) {
	const policy = resolveConfiguredModelPolicyAllow({
		cfg: config,
		agentId
	});
	return {
		path: policy.configPath ? policy.repairConfigPath : null,
		refs: [...new Set(policy.refs.map((ref) => parseModelPolicyWildcardRef(ref)?.key ?? normalizeAgentModelRefForConfig(ref)))].toSorted()
	};
}
function prepareProviderModelAccess(params) {
	const provider = normalizeProviderId(params.provider);
	const policy = snapshotPolicy(params.config, params.agentId);
	if (policy.refs.length === 0 || policy.refs.includes(`${provider}/*`)) return;
	const prompt = {
		message: `Your current model restrictions may hide ${params.providerLabel} models. Choose which models to show.`,
		initialValue: "keep",
		options: [{
			value: "all",
			label: `Show all ${params.providerLabel} models`
		}, {
			value: "keep",
			label: "Keep current restrictions"
		}]
	};
	return {
		provider,
		providerLabel: params.providerLabel,
		agentId: params.agentId,
		policy,
		prompt
	};
}
async function completeProviderModelAccess(params) {
	const prepared = params.prepared;
	if (!prepared) return {
		kind: "unchanged",
		message: ""
	};
	params.assertCurrent?.();
	if (params.onRequested) {
		params.onRequested(prepared);
		return {
			kind: "deferred",
			message: ""
		};
	}
	const choice = await params.prompter.select(prepared.prompt);
	params.assertCurrent?.();
	if (choice !== "all") {
		params.runtime.log("Current model restrictions kept.");
		return {
			kind: "unchanged",
			message: "Current model restrictions kept."
		};
	}
	const application = createRuntimeConfigWriteApplication(captureGatewayRootWorkAdmissionContinuationScope()?.run);
	await updateConfig((config) => {
		params.assertCurrent?.(config);
		resolveModelsTargetAgent(config, prepared.agentId, { kind: "mutation" });
		if (!isDeepStrictEqual(snapshotPolicy(config, prepared.agentId), prepared.policy)) throw new ProviderModelPolicyChangedError(config);
		const policy = resolveConfiguredModelPolicyAllow({
			cfg: config,
			agentId: prepared.agentId
		});
		const allow = [...policy.refs, `${prepared.provider}/*`];
		if (policy.repairConfigPath === "agents.entries.*.modelPolicy.allow") {
			const agent = resolveMutableAgentEntry(config, prepared.agentId);
			if (!agent) throw new Error(`Agent "${prepared.agentId}" no longer exists.`);
			agent.modelPolicy = {
				...agent.modelPolicy,
				allow
			};
		} else {
			config.agents ??= {};
			config.agents.defaults ??= {};
			const defaults = config.agents.defaults;
			if (policy.configPath === "agents.defaults.models" && materializeModelPolicyAllowlist(config).kind === "deferred") defaults.models = {
				...defaults.models,
				[`${prepared.provider}/*`]: {}
			};
			else defaults.modelPolicy = {
				...defaults.modelPolicy,
				allow
			};
		}
		return config;
	}, void 0, params.beforeCommit, attachRuntimeConfigWriteApplication({ assertCurrent: params.assertCurrent }, application));
	const status = application.claimed ? await application.result : "unclaimed";
	logConfigUpdated(params.runtime);
	const message = status === "applied" ? `All ${prepared.providerLabel} models are now visible.` : application.claimed ? "Model access was saved, but OpenClaw has not confirmed it is active. Open Settings and select Apply changes, then send /models." : "Model access saved. Application by the running Gateway is not confirmed. Run `openclaw gateway restart` to apply it.";
	params.runtime.log(message);
	return {
		kind: "saved",
		application: status,
		message
	};
}
//#endregion
export { withoutProviderModelPolicy as a, prepareProviderModelAccess as i, applyProviderLoginDefaultModel as n, completeProviderModelAccess as r, ProviderModelPolicyChangedError as t };
