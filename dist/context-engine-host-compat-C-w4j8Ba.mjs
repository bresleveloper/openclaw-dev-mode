import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import "./utils-gjJ-tD2q.mjs";
import { d as withPluginRuntimeRegistryScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { F as listModelRefsFromConfigValue } from "./runtime-snapshot-BBYDJbw9.mjs";
import { i as parseModelCatalogRef } from "./model-catalog-refs-D3xvQZh0.mjs";
import { C as defaultSlotIdForKey } from "./config-state-DkDfCu7E.mjs";
import { a as resolveAgentDir, m as resolveAmbientOwnerAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { r as listAgentEntriesWithSource } from "./agent-roster-gkYP38su.mjs";
import { i as DEFAULT_PROVIDER, n as DEFAULT_MODEL } from "./defaults-Bg930vxE.mjs";
import { i as normalizeEmbeddedAgentRuntime } from "./agent-runtime-id-BZLMe-UU.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-BESW9cGp.mjs";
import { n as getRegisteredAgentHarness } from "./registry-BDZ8eM01.mjs";
import { a as resolveCliBackendConfig } from "./cli-backends-BzVT3JSM.mjs";
import { t as acquirePluginRegistryForInspection } from "./loader-runtime-load-DzFljQbT.mjs";
import { n as getContextEngineRegistration, o as resolveContextEngine } from "./registry-BNFZRyO5.mjs";
import "./loader-B8PRFJEU.mjs";
import { a as evaluateContextEngineHostSupport, i as buildGenericCliContextEngineHostSupport, n as OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST, t as CODEX_APP_SERVER_CONTEXT_ENGINE_HOST } from "./host-compat-DWLjZN89.mjs";
import { t as registerLegacyContextEngine } from "./init-g-4TXKd7.mjs";
//#region src/commands/doctor/shared/context-engine-host-compat.ts
function normalizeRuntimeId(value) {
	if (typeof value !== "string") return;
	return normalizeEmbeddedAgentRuntime(value.trim().toLowerCase()) || void 0;
}
function collectExplicitRuntimeRefs(cfg) {
	const refs = [];
	const push = (runtime, path) => {
		const runtimeId = normalizeRuntimeId(runtime);
		if (runtimeId && runtimeId !== "default") refs.push({
			runtimeId,
			path
		});
	};
	for (const [providerId, providerConfig] of Object.entries(cfg.models?.providers ?? {})) {
		push(providerConfig?.agentRuntime?.id, `models.providers.${providerId}.agentRuntime.id`);
		providerConfig?.models?.forEach((modelConfig, index) => {
			push(modelConfig?.agentRuntime?.id, `models.providers.${providerId}.models[${index}].agentRuntime.id`);
		});
	}
	for (const [modelRef, modelConfig] of Object.entries(cfg.agents?.defaults?.models ?? {})) push(modelConfig?.agentRuntime?.id, `agents.defaults.models.${modelRef}.agentRuntime.id`);
	for (const { entry: agent, source } of listAgentEntriesWithSource(cfg)) {
		const path = source.kind === "entries" ? `agents.entries.${source.key}` : `agents.list.${source.index}`;
		for (const [modelRef, modelConfig] of Object.entries(agent.models ?? {})) push(modelConfig?.agentRuntime?.id, `${path}.models.${modelRef}.agentRuntime.id`);
	}
	return refs;
}
function collectSelectedModelRefs(cfg) {
	const refs = [];
	const pushModel = (value, path, agentId) => {
		for (const ref of listModelRefsFromConfigValue(value)) {
			const modelRef = ref.trim();
			if (modelRef) refs.push({
				modelRef,
				path,
				...agentId ? { agentId } : {}
			});
		}
	};
	const pushModelMap = (models, path, agentId) => {
		if (!isRecord(models)) return;
		for (const modelRef of Object.keys(models)) refs.push({
			modelRef,
			path: `${path}.${modelRef}`,
			...agentId ? { agentId } : {}
		});
	};
	if (cfg.agents?.defaults?.model !== void 0) pushModel(cfg.agents.defaults.model, "agents.defaults.model");
	else refs.push({
		modelRef: `${DEFAULT_PROVIDER}/${DEFAULT_MODEL}`,
		path: "agents.defaults.model (default)"
	});
	pushModelMap(cfg.agents?.defaults?.models, "agents.defaults.models");
	for (const { entry: agent, source } of listAgentEntriesWithSource(cfg)) {
		const agentId = agent.id;
		const path = source.kind === "entries" ? `agents.entries.${source.key}` : `agents.list.${source.index}`;
		pushModel(agent.model ?? cfg.agents?.defaults?.model, `${path}.model`, agentId);
		pushModelMap(agent.models, `${path}.models`, agentId);
	}
	return refs;
}
function resolveRuntimeHost(cfg, runtimeId) {
	if (runtimeId === "openclaw" || runtimeId === "auto") return OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST;
	if (runtimeId === "codex") return CODEX_APP_SERVER_CONTEXT_ENGINE_HOST;
	const harness = getRegisteredAgentHarness(runtimeId)?.harness;
	if (harness) return {
		id: `harness:${harness.id}`,
		label: `${harness.label} harness`,
		capabilities: harness.contextEngineHostCapabilities ?? []
	};
	const cliBackend = resolveCliBackendConfig(runtimeId, cfg);
	return buildGenericCliContextEngineHostSupport({
		backendId: cliBackend?.id ?? runtimeId,
		capabilities: cliBackend?.contextEngineHostCapabilities
	});
}
/** Collect effective agent-run host candidates from provider/model runtime policy. */
function collectConfiguredContextEngineAgentRunHosts(cfg) {
	const runtimePaths = /* @__PURE__ */ new Map();
	const push = (runtimeId, path) => {
		if (!runtimeId) return;
		const normalized = normalizeRuntimeId(runtimeId) ?? runtimeId;
		const paths = runtimePaths.get(normalized) ?? [];
		paths.push(path);
		runtimePaths.set(normalized, paths);
	};
	for (const ref of collectExplicitRuntimeRefs(cfg)) push(ref.runtimeId, ref.path);
	for (const model of collectSelectedModelRefs(cfg)) {
		const parsed = parseModelCatalogRef(model.modelRef);
		if (!parsed) continue;
		push(resolveAgentHarnessPolicy({
			config: cfg,
			provider: parsed.provider,
			modelId: parsed.modelId,
			agentId: model.agentId
		}).runtime, model.path);
	}
	return [...runtimePaths.entries()].map(([runtimeId, paths]) => ({
		host: resolveRuntimeHost(cfg, runtimeId),
		paths
	}));
}
function selectedContextEngineSlotId(cfg) {
	const slotValue = cfg.plugins?.slots?.contextEngine;
	return typeof slotValue === "string" && slotValue.trim() ? slotValue.trim() : defaultSlotIdForKey("contextEngine");
}
async function resolveSelectedContextEngineInfo(params) {
	const engineId = selectedContextEngineSlotId(params.cfg);
	if (engineId === defaultSlotIdForKey("contextEngine") || engineId === "none") return {
		info: {
			id: engineId,
			name: engineId
		},
		warnings: []
	};
	const initializeDuringResolution = getContextEngineRegistration(engineId)?.lifecycle === "runtime";
	if (!initializeDuringResolution) await registerLegacyContextEngine();
	let pluginRegistry;
	let inspection;
	let engine;
	let outcome;
	try {
		let inspectionWarning;
		if (getContextEngineRegistration(engineId)?.lifecycle !== "runtime") {
			try {
				inspection = await acquirePluginRegistryForInspection({
					config: params.cfg,
					env: params.env,
					onlyPluginIds: [engineId]
				});
				pluginRegistry = inspection.registry;
			} catch (error) {
				inspectionWarning = `- plugins.slots.contextEngine: could not inspect context engine "${engineId}" host requirements because its plugin failed to load: ${error instanceof Error ? error.message : String(error)}`;
			}
			if (pluginRegistry) {
				const registration = pluginRegistry.contextEngines.get(engineId);
				if (registration?.lifecycle === "readOnlyDiscovery") inspectionWarning = `- plugins.slots.contextEngine: context engine "${engineId}" is registered for read-only discovery; offline host compatibility inspection is unavailable. This does not indicate a missing runtime registration in the Gateway.`;
				else if (registration?.lifecycle !== "runtime") inspectionWarning = `- plugins.slots.contextEngine: could not inspect context engine "${engineId}" host requirements because it is not registered.`;
			}
		}
		if (inspectionWarning) outcome = {
			ok: true,
			result: { warnings: [inspectionWarning] }
		};
		else {
			const agentId = resolveAmbientOwnerAgentId(params.cfg, void 0, {
				surface: "context-engine Doctor checks",
				hint: "Set agents.defaults.systemAgent.agentId before running Doctor."
			});
			const resolve = () => resolveContextEngine(params.cfg, {
				initialize: initializeDuringResolution ? registerLegacyContextEngine : void 0,
				agentDir: resolveAgentDir(params.cfg, agentId, params.env),
				workspaceDir: params.cfg.agents?.defaults?.workspace ? resolveUserPath(params.cfg.agents.defaults.workspace, params.env) : void 0
			});
			engine = await withPluginRuntimeRegistryScope(pluginRegistry, resolve);
			const info = engine.info;
			const requirements = info.hostRequirements?.["agent-run"];
			outcome = {
				ok: true,
				result: {
					info: {
						id: info.id,
						name: info.name,
						hostRequirements: requirements ? { "agent-run": {
							requiredCapabilities: [...requirements.requiredCapabilities],
							unsupportedMessage: requirements.unsupportedMessage
						} } : void 0
					},
					warnings: []
				}
			};
		}
	} catch (error) {
		outcome = {
			ok: false,
			error
		};
	}
	for (const cleanup of [() => engine?.dispose?.(), () => inspection?.release()]) try {
		await cleanup();
	} catch (error) {
		if (outcome.ok) outcome = {
			ok: false,
			error
		};
	}
	if (!outcome.ok) {
		const { error } = outcome;
		return { warnings: [`- plugins.slots.contextEngine: could not inspect context engine "${engineId}" host requirements: ${error instanceof Error ? error.message : String(error)}`] };
	}
	return outcome.result;
}
function collectHostCompatibilityWarnings(info, hosts) {
	return hosts.flatMap((candidate) => {
		const evaluation = evaluateContextEngineHostSupport({
			contextEngineInfo: info,
			operation: "agent-run",
			host: candidate.host
		});
		return evaluation.ok ? [] : [`- plugins.slots.contextEngine: context engine "${info.id}" is incompatible with ${candidate.host.label} (${formatPaths(candidate.paths)}). Missing host capabilities: ${evaluation.missingCapabilities.join(", ")}. Required capabilities: ${evaluation.requirements.requiredCapabilities.join(", ")}. Host capabilities: ${formatHostCapabilities(candidate.host.capabilities)}.`];
	});
}
function formatPaths(paths) {
	const unique = uniqueStrings(paths);
	if (unique.length <= 2) return unique.join(", ");
	return `${unique.slice(0, 2).join(", ")}, and ${unique.length - 2} more`;
}
function formatHostCapabilities(capabilities) {
	return capabilities.length > 0 ? capabilities.join(", ") : "(none)";
}
async function inspectContextEngineHostCompatibility(params) {
	const resolved = await resolveSelectedContextEngineInfo(params);
	if (!resolved.info) return {
		...resolved,
		compatibilityWarnings: [],
		incompatibleAllHosts: false
	};
	const hosts = collectConfiguredContextEngineAgentRunHosts(params.cfg);
	const issues = collectHostCompatibilityWarnings(resolved.info, hosts);
	const incompatibleAllHosts = issues.length > 0 && issues.length === hosts.length;
	if (issues.length > 0) issues.push(incompatibleAllHosts ? `- Run "${params.doctorFixCommand}" to remove the plugins.slots.contextEngine override and restore the default "legacy", or configure a compatible runtime/harness for agent runs.` : `- Some configured runtimes support context engine "${resolved.info.id}" and others do not; doctor will not rewrite the global contextEngine slot automatically. Configure unsupported models to use a compatible runtime/harness or set plugins.slots.contextEngine to "legacy".`);
	return {
		...resolved,
		compatibilityWarnings: issues.length ? [issues.join("\n")] : [],
		incompatibleAllHosts
	};
}
/** Collect doctor warnings for context engines that cannot run under configured hosts. */
async function collectContextEngineHostCompatibilityWarnings(params) {
	const resolved = await inspectContextEngineHostCompatibility(params);
	return [...resolved.warnings, ...resolved.compatibilityWarnings];
}
/** Repair a globally incompatible context engine by falling back to legacy. */
async function maybeRepairContextEngineHostCompatibility(params) {
	const resolved = await inspectContextEngineHostCompatibility(params);
	if (!resolved.info || !resolved.incompatibleAllHosts) return {
		config: params.cfg,
		changes: [],
		warnings: [...resolved.warnings, ...resolved.compatibilityWarnings]
	};
	const next = structuredClone(params.cfg);
	const slots = next.plugins?.slots;
	if (slots) {
		delete slots.contextEngine;
		if (Object.keys(slots).length === 0) delete next.plugins?.slots;
	}
	return {
		config: next,
		changes: [`Reset plugins.slots.contextEngine to the default "legacy" because context engine "${resolved.info.id}" is incompatible with every configured agent-run host.`],
		warnings: resolved.warnings
	};
}
//#endregion
export { maybeRepairContextEngineHostCompatibility as n, collectContextEngineHostCompatibilityWarnings as t };
