import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import "./utils-DgZn2dLu.mjs";
import { i as parseModelCatalogRef } from "./model-catalog-refs-D3xvQZh0.mjs";
import { a as resolveAgentDir, p as resolveAmbientOwnerAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import { r as listAgentEntriesWithSource } from "./agent-roster-BXD1uMJD.mjs";
import { n as defaultSlotIdForKey } from "./slots-DarSawuQ.mjs";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-Jag53zwP.mjs";
import { u as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { i as normalizeEmbeddedAgentRuntime } from "./agent-runtime-id-BZLMe-UU.mjs";
import { N as listModelRefsFromConfigValue } from "./runtime-snapshot-DYptB0Cf.mjs";
import { t as acquirePluginRegistryForInspection } from "./loader-runtime-load-BQO3MsEg.mjs";
import { n as getContextEngineRegistration, o as resolveContextEngine } from "./registry-BIuAP_WM.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-Rdb47msF.mjs";
import { n as getRegisteredAgentHarness } from "./registry-BrXrewXj.mjs";
import { a as resolveCliBackendConfig } from "./cli-backends-CRE_cwP5.mjs";
import "./loader-D4eOiGg6.mjs";
import { a as evaluateContextEngineHostSupport, i as buildGenericCliContextEngineHostSupport, n as OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST, t as CODEX_APP_SERVER_CONTEXT_ENGINE_HOST } from "./host-compat-xESS3bi6.mjs";
import { t as ensureContextEnginesInitialized } from "./init-CLvlMRF6.mjs";
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
	if (!initializeDuringResolution) await ensureContextEnginesInitialized();
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
				initialize: initializeDuringResolution ? ensureContextEnginesInitialized : void 0,
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
function formatCompatibilityWarnings(params) {
	if (params.issues.length === 0) return [];
	const lines = [...params.issues];
	const incompatibleAllHosts = params.issues.length === params.hostCount;
	lines.push(incompatibleAllHosts ? `- Run "${params.doctorFixCommand}" to remove the plugins.slots.contextEngine override and restore the default "legacy", or configure a compatible runtime/harness for agent runs.` : `- Some configured runtimes support context engine "${params.info.id}" and others do not; doctor will not rewrite the global contextEngine slot automatically. Configure unsupported models to use a compatible runtime/harness or set plugins.slots.contextEngine to "legacy".`);
	return [lines.join("\n")];
}
/** Collect doctor warnings for context engines that cannot run under configured hosts. */
async function collectContextEngineHostCompatibilityWarnings(params) {
	const resolved = await resolveSelectedContextEngineInfo(params);
	if (!resolved.info) return resolved.warnings;
	const hosts = collectConfiguredContextEngineAgentRunHosts(params.cfg);
	const issues = collectHostCompatibilityWarnings(resolved.info, hosts);
	return [...resolved.warnings, ...formatCompatibilityWarnings({
		info: resolved.info,
		issues,
		hostCount: hosts.length,
		doctorFixCommand: params.doctorFixCommand
	})];
}
/** Repair a globally incompatible context engine by falling back to legacy. */
async function maybeRepairContextEngineHostCompatibility(params) {
	const resolved = await resolveSelectedContextEngineInfo(params);
	if (!resolved.info) return {
		config: params.cfg,
		changes: [],
		warnings: resolved.warnings
	};
	const hosts = collectConfiguredContextEngineAgentRunHosts(params.cfg);
	const issues = collectHostCompatibilityWarnings(resolved.info, hosts);
	if (issues.length === 0) return {
		config: params.cfg,
		changes: [],
		warnings: resolved.warnings
	};
	const warnings = formatCompatibilityWarnings({
		info: resolved.info,
		issues,
		hostCount: hosts.length,
		doctorFixCommand: params.doctorFixCommand
	});
	if (issues.length !== hosts.length) return {
		config: params.cfg,
		changes: [],
		warnings: [...resolved.warnings, ...warnings]
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
