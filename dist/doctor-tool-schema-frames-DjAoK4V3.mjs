import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { a as resolveAgentDir, d as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { u as isUpdateDoctorLintPass } from "./update-phase-BClSJ17n.mjs";
import "./defaults-Jag53zwP.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { n as findModelInCatalog } from "./model-catalog-lookup-BWpJFHtW.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CsO-mXVD.mjs";
import "./model-selection-D3_rVb38.mjs";
import "./model-catalog-CwZMTjpw.mjs";
import { d as readPreparedModelCatalog } from "./prepared-model-catalog-5NeF8DiP.mjs";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-l7Gq7Nji.mjs";
import { n as supportsModelTools } from "./model-tool-support-DIQSEumC.mjs";
import { t as resolveDoctorPrimaryModelRef } from "./primary-model-ref-DvugVG3o.mjs";
//#region src/flows/doctor-tool-schema-frames.ts
function modelContextFinding(agentId, reason, deferred = false) {
	return {
		checkId: "core/doctor/runtime-tool-schemas",
		severity: "warning",
		message: deferred ? `Agent ${agentId} model-specific tool schema inspection was deferred because its provider needs live model discovery.` : `Agent ${agentId} runtime tool schema inspection could not prepare its selected model context.`,
		errorCode: deferred ? "provider-dynamic-model-deferred" : "model-context-unavailable",
		path: `agents.${agentId}.model`,
		requirement: reason,
		fixHint: deferred ? "Use the model in an authenticated agent run to validate its tool schemas." : "Resolve the provider/model loading problem, then rerun doctor to validate model-specific tool schemas."
	};
}
function buildDoctorRuntimeModel(params) {
	const provider = params.provider || "openai";
	const id = params.modelId || "gpt-6-astra";
	const api = params.entry?.api ?? (provider === "openai" ? "openai-responses" : void 0);
	const baseUrl = params.entry?.baseUrl ?? (api === "openai-chatgpt-responses" ? "https://chatgpt.com/backend-api" : provider === "openai" ? "https://api.openai.com/v1" : void 0);
	return {
		...params.entry,
		provider,
		id,
		name: params.entry?.name ?? id,
		...api ? { api } : {},
		...baseUrl ? { baseUrl } : {}
	};
}
/** Prepare each agent's local facts before acquiring the operation's tool registrations. */
async function prepareDoctorToolSchemaFrames(cfg, options = {}) {
	const env = options.env ?? process.env;
	const standalone = options.mode !== void 0 && options.mode !== "lint" && !isUpdateDoctorLintPass(env);
	const frames = [];
	const findings = [];
	for (const agentId of listAgentIds(cfg)) {
		const agent = resolveAgentConfig(cfg, agentId);
		if (agent?.runtime?.type === "acp") continue;
		const agentDir = resolveAgentDir(cfg, agentId, env);
		const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId, env);
		const prepare = async () => {
			const modelRef = standalone ? resolveDoctorPrimaryModelRef(cfg, agent?.model) : resolveDefaultModelForAgent({
				cfg,
				agentId,
				allowPluginNormalization: true
			});
			let model;
			if (standalone) {
				const { resolveModelAsync } = await import("./model-BYRrVkpM.mjs");
				const resolution = await resolveModelAsync(modelRef.provider, modelRef.model, agentDir, cfg, {
					modelIdSource: "selected",
					agentId,
					workspaceDir,
					skipAgentDiscovery: true,
					allowBundledStaticCatalogFallback: true,
					deferProviderDynamicModelPreparation: true
				});
				if (!resolution.model) {
					findings.push(modelContextFinding(agentId, resolution.error, Boolean(resolution.deferred)));
					return;
				}
				model = resolution.model;
			} else {
				const catalog = await readPreparedModelCatalog({
					config: cfg,
					agentId,
					agentDir,
					readOnly: true,
					providerDiscoveryProviderIds: []
				});
				model = buildDoctorRuntimeModel({
					entry: findModelInCatalog(catalog, modelRef.provider, modelRef.model),
					provider: modelRef.provider,
					modelId: modelRef.model
				});
			}
			if (!supportsModelTools(model)) return;
			const capabilityProfile = resolveConversationCapabilityProfile({
				config: cfg,
				agentId,
				workspaceDir,
				modelProvider: modelRef.provider,
				modelId: modelRef.model
			});
			frames.push({
				agentId,
				agentDir,
				workspaceDir,
				modelRef,
				model,
				capabilityProfile
			});
		};
		try {
			if (options.runWithPluginMetadataSnapshot) await options.runWithPluginMetadataSnapshot({
				config: cfg,
				workspaceDir
			}, prepare);
			else await prepare();
		} catch (error) {
			findings.push(modelContextFinding(agentId, formatErrorMessage(error)));
		}
	}
	return {
		frames,
		findings
	};
}
//#endregion
export { prepareDoctorToolSchemaFrames };
