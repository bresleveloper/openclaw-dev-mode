import { E as listAgentEntries, M as tryResolveSoleAgentId, O as listAgentIds, a as resolveAgentDir, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { a as visitModelSelectorRefs, r as collectConfiguredModelRefs } from "./configured-model-refs-ngXQhRsV.mjs";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-BbU4k6fu.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { h as resolveConfiguredModelRef, i as buildModelAliasIndex, v as resolveModelRefFromString } from "./model-selection-shared-0uvJbX1M.mjs";
import { C as resolveSubagentSpawnModelFallbacksOverride, o as resolveAgentEffectiveModelPrimary, u as resolveAgentModelFallbacksOverride, x as resolveSubagentModelConfigSelectionResult } from "./agent-scope-CTuYDtny.mjs";
import { c as loadAuthProfileStoreForSecretsRuntime } from "./store-runtime-CzCVI_rv.mjs";
import { n as sanitizeDoctorNote } from "./emit-notes-BF8NdCNQ.mjs";
import { r as resolveHeartbeatAgents } from "./heartbeat-config-BvP-hlUW.mjs";
import { t as createModelAuthAvailabilityResolver } from "./model-auth-availability-DgxB_kPc.mjs";
//#region src/commands/doctor/shared/model-billing-route-migration.ts
function collectModelConsumers(cfg) {
	const agents = listAgentEntries(cfg);
	const consumers = collectConfiguredModelRefs(cfg).filter(({ path, value }) => !path.startsWith("agents.") && !path.endsWith(`.models.${value}`));
	const heartbeatAgents = new Map(resolveHeartbeatAgents(cfg).map((entry) => [entry.agentId, entry.heartbeat]));
	for (const agentId of listAgentIds(cfg)) {
		const entry = agents.find((agent) => agent.id === agentId);
		const primary = resolveAgentEffectiveModelPrimary(cfg, agentId);
		const prefix = `agents.entries.${agentId}`;
		const add = (path, value, sourcePath = path) => consumers.push({
			path,
			value,
			agentId,
			consumer: `${sourcePath} (agent ${agentId})`
		});
		visitModelSelectorRefs({
			primary,
			fallbacks: resolveAgentModelFallbacksOverride(cfg, agentId) ?? (typeof cfg.agents?.defaults?.model === "object" ? cfg.agents.defaults.model.fallbacks : void 0)
		}, `${prefix}.model`, (path, value) => add(path, value));
		if (heartbeatAgents.has(agentId)) {
			const heartbeatModel = heartbeatAgents.get(agentId)?.model ?? primary;
			if (heartbeatModel) add(`${prefix}.heartbeat.model`, heartbeatModel, entry?.heartbeat?.model ? `${prefix}.heartbeat.model` : "agents.defaults.heartbeat.model");
		}
		const subagent = resolveSubagentModelConfigSelectionResult({
			cfg,
			agentId
		});
		visitModelSelectorRefs(subagent?.raw ?? cfg.agents?.defaults?.model, `${prefix}.subagents.model`, (path, value, role) => {
			if (role === "primary") add(path, value, subagent?.source === "default-subagent" ? path.replace(prefix, "agents.defaults") : path);
		});
		for (const [index, value] of (resolveSubagentSpawnModelFallbacksOverride(cfg, agentId) ?? []).entries()) add(`${prefix}.subagents.model.fallbacks.${index}`, value);
		if (entry) {
			for (const ref of collectConfiguredModelRefs({ agents: { entries: { [agentId]: entry } } })) if (!ref.path.endsWith(`.models.${ref.value}`) && !ref.path.startsWith(`${prefix}.model`) && ref.path !== `${prefix}.heartbeat.model` && !ref.path.startsWith(`${prefix}.subagents.model`)) add(ref.path, ref.value);
		}
	}
	return consumers;
}
function collectBillingRoutes(params) {
	const { cfg, env, metadataSnapshot } = params;
	const owners = /* @__PURE__ */ new Map();
	const prepareOwner = (agentId) => {
		const agentDir = agentId ? resolveAgentDir(cfg, agentId, env) : void 0;
		const workspaceDir = agentId ? resolveAgentWorkspaceDir(cfg, agentId, env) : void 0;
		let authStore = params.authStores.get(agentDir);
		if (!authStore) {
			authStore = loadAuthProfileStoreForSecretsRuntime(agentDir, {
				config: cfg,
				externalCli: { mode: "none" }
			});
			params.authStores.set(agentDir, authStore);
		}
		const options = {
			cfg,
			agentId,
			manifestPlugins: metadataSnapshot?.plugins,
			allowManifestNormalization: false,
			allowPluginNormalization: false
		};
		const defaultProvider = resolveConfiguredModelRef({
			...options,
			defaultProvider: DEFAULT_PROVIDER,
			defaultModel: DEFAULT_MODEL
		}).provider;
		const aliasIndex = buildModelAliasIndex({
			...options,
			defaultProvider
		});
		return {
			resolve: (raw) => resolveModelRefFromString({
				...options,
				raw,
				defaultProvider,
				aliasIndex
			})?.ref,
			auth: createModelAuthAvailabilityResolver({
				cfg,
				agentId,
				agentDir,
				workspaceDir,
				env,
				metadataSnapshot,
				externalCliProviderIds: [],
				authStore
			})
		};
	};
	const routes = /* @__PURE__ */ new Map();
	for (const { path, value, consumer, agentId: consumerAgentId } of collectModelConsumers(cfg)) {
		const agentId = consumerAgentId ?? tryResolveSoleAgentId(cfg);
		let owner = owners.get(agentId);
		if (!owner) {
			owner = prepareOwner(agentId);
			owners.set(agentId, owner);
		}
		const parsed = splitTrailingAuthProfile(value);
		const model = owner.resolve(parsed.model);
		if (!model) continue;
		const auth = owner.auth.evaluateRuntimeModelAuth(model.provider, {
			modelId: model.model,
			pinnedProfileId: parsed.profile
		});
		if (auth.availability !== true || !auth.selectedRoute) continue;
		routes.set(path, {
			consumer: consumer ?? path,
			modelRef: `${model.provider}/${model.model}`,
			requirement: auth.selectedRoute.authRequirement,
			profileId: auth.selectedProfileId
		});
	}
	return routes;
}
/** Compare resolved billing facts; missing credentials are not evidence of a route change. */
function collectModelBillingRouteMigrationWarnings(params) {
	const options = {
		env: params.env ?? process.env,
		metadataSnapshot: params.metadataSnapshot,
		authStores: /* @__PURE__ */ new Map()
	};
	const before = collectBillingRoutes({
		...options,
		cfg: params.before
	});
	const after = collectBillingRoutes({
		...options,
		cfg: params.after
	});
	const describe = (route) => `${route.modelRef} via ${route.requirement === "api-key" ? "metered API-key" : "subscription/OAuth"}${route.profileId ? ` profile ${route.profileId}` : ""}`;
	const warnings = [];
	for (const [consumer, previous] of before) {
		const current = after.get(consumer);
		if (current && current.requirement !== previous.requirement) warnings.push(sanitizeDoctorNote(`Billing route changed for ${previous.consumer}: ${describe(previous)} -> ${describe(current)}. Review its model and authentication settings.`));
	}
	return warnings;
}
//#endregion
export { collectModelBillingRouteMigrationWarnings };
