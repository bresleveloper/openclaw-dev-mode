import { n as filterStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { n as getPluginRegistryForContext } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { u as wrapCurrentPluginInstance } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { d as resolveEffectivePluginActivationState, l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { m as getPluginRegistrationContext, x as resolveDirectPluginRegistrationOwner, y as requireActivePluginRegistry } from "./runtime-BvdPUus5.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/memory-state.ts
const log = createSubsystemLogger("plugins/memory-state");
function resolveMemoryCapabilityRegistration(registrations) {
	let effective;
	for (const registration of registrations) {
		const existing = effective;
		if (!existing) {
			effective = registration;
			continue;
		}
		const existingOwnsSlot = existing.memorySlotSelected === true;
		if (existingOwnsSlot !== (registration.memorySlotSelected === true)) {
			const owner = existingOwnsSlot ? existing : registration;
			const contributor = existingOwnsSlot ? registration : existing;
			effective = {
				pluginId: owner.pluginId,
				capability: {
					...contributor.capability,
					...owner.capability
				},
				memorySlotSelected: true
			};
			continue;
		}
		const preserveExisting = Boolean(registration.capability.publicArtifacts) && !registration.capability.promptBuilder && !registration.capability.flushPlanResolver && !registration.capability.runtime;
		effective = {
			pluginId: registration.pluginId,
			capability: {
				...preserveExisting ? existing.capability : {},
				...registration.capability
			},
			memorySlotSelected: registration.memorySlotSelected
		};
	}
	return effective;
}
const getMemoryCapability = () => resolveMemoryCapabilityRegistration(getPluginRegistryForContext()?.memoryCapabilities ?? []);
const preparedMemoryPromptSections = /* @__PURE__ */ new WeakSet();
const activePreparedMemoryPromptSection = new AsyncLocalStorage();
function registerMemoryCorpusSupplement(requestedPluginId, supplement) {
	const pluginId = resolveDirectPluginRegistrationOwner(requestedPluginId) ?? requestedPluginId;
	const registry = requireActivePluginRegistry();
	registry.memoryCorpusSupplements = registry.memoryCorpusSupplements.filter((registration) => registration.pluginId !== pluginId).concat({
		pluginId,
		supplement: wrapCurrentPluginInstance(supplement)
	});
}
function registerMemoryCapability(requestedPluginId, capability) {
	const registrar = getPluginRegistrationContext()?.registerMemoryCapability;
	if (registrar) {
		registrar(capability);
		return;
	}
	const pluginId = resolveDirectPluginRegistrationOwner(requestedPluginId) ?? requestedPluginId;
	requireActivePluginRegistry().memoryCapabilities.push({
		pluginId,
		capability: wrapCurrentPluginInstance(capability)
	});
}
function getMemoryCapabilityRegistration() {
	const capability = getMemoryCapability();
	return capability ? {
		pluginId: capability.pluginId,
		capability: { ...capability.capability }
	} : void 0;
}
function listMemoryCorpusSupplements() {
	return [...requireActivePluginRegistry().memoryCorpusSupplements];
}
function adoptEligibleRuntimeMemoryRegistrations(target, runtime, canAdopt) {
	const pluginIds = new Set(target.map((registration) => registration.pluginId));
	let adopted;
	for (const registration of runtime) {
		if (pluginIds.has(registration.pluginId) || !canAdopt(registration.pluginId)) continue;
		(adopted ??= [...target]).push(registration);
		pluginIds.add(registration.pluginId);
	}
	return adopted ?? target;
}
/**
* Discovery scopes cannot safely rerun full memory plugin setup.
* Reuse exact root sidecars only while activation and source ownership still match.
*/
function adoptRuntimeMemoryRegistrations(targetRegistry, runtimeRegistry, config) {
	const normalizedConfig = normalizePluginsConfig(config.plugins);
	const canAdopt = (pluginId) => {
		const targetOwner = targetRegistry.plugins.find((plugin) => plugin.id === pluginId);
		const runtimeOwner = runtimeRegistry.plugins.find((plugin) => plugin.id === pluginId);
		if (runtimeOwner?.status !== "loaded" || !resolveEffectivePluginActivationState({
			id: runtimeOwner.id,
			origin: runtimeOwner.origin,
			config: normalizedConfig,
			rootConfig: config,
			enabledByDefault: runtimeOwner.activationSource === "default"
		}).enabled || targetOwner && (targetOwner.status !== "loaded" || targetOwner.source !== runtimeOwner.source)) return false;
		return true;
	};
	const memoryCorpusSupplements = adoptEligibleRuntimeMemoryRegistrations(targetRegistry.memoryCorpusSupplements, runtimeRegistry.memoryCorpusSupplements, canAdopt);
	const memoryPromptPreparations = adoptEligibleRuntimeMemoryRegistrations(targetRegistry.memoryPromptPreparations, runtimeRegistry.memoryPromptPreparations, canAdopt);
	const memoryPromptSupplements = adoptEligibleRuntimeMemoryRegistrations(targetRegistry.memoryPromptSupplements, runtimeRegistry.memoryPromptSupplements, canAdopt);
	return memoryCorpusSupplements === targetRegistry.memoryCorpusSupplements && memoryPromptPreparations === targetRegistry.memoryPromptPreparations && memoryPromptSupplements === targetRegistry.memoryPromptSupplements ? targetRegistry : {
		...targetRegistry,
		memoryCorpusSupplements,
		memoryPromptPreparations,
		memoryPromptSupplements
	};
}
function registerMemoryPromptSupplement(requestedPluginId, builder) {
	const pluginId = resolveDirectPluginRegistrationOwner(requestedPluginId) ?? requestedPluginId;
	const registry = requireActivePluginRegistry();
	registry.memoryPromptSupplements = registry.memoryPromptSupplements.filter((registration) => registration.pluginId !== pluginId).concat({
		pluginId,
		builder: wrapCurrentPluginInstance(builder)
	});
}
function registerMemoryPromptPreparation(requestedPluginId, prepare) {
	const pluginId = resolveDirectPluginRegistrationOwner(requestedPluginId) ?? requestedPluginId;
	const registry = requireActivePluginRegistry();
	registry.memoryPromptPreparations = registry.memoryPromptPreparations.filter((registration) => registration.pluginId !== pluginId).concat({
		pluginId,
		prepare: wrapCurrentPluginInstance(prepare)
	});
}
function buildSynchronousMemoryPromptSection(params) {
	const registry = requireActivePluginRegistry();
	return {
		primary: filterStringEntries(resolveMemoryCapabilityRegistration(registry.memoryCapabilities)?.capability.promptBuilder?.(params) ?? []),
		supplements: registry.memoryPromptSupplements.toSorted((left, right) => left.pluginId.localeCompare(right.pluginId)).map((registration) => ({
			pluginId: registration.pluginId,
			lines: filterStringEntries(registration.builder(params))
		}))
	};
}
function cloneMemoryPromptSectionParams(params) {
	return {
		availableTools: new Set(params.availableTools),
		citationsMode: params.citationsMode,
		agentId: params.agentId,
		agentSessionKey: params.agentSessionKey,
		sandboxed: params.sandboxed
	};
}
function snapshotMemoryPromptContext(params) {
	return Object.freeze({
		availableTools: Object.freeze([...params.availableTools].toSorted()),
		citationsMode: params.citationsMode,
		agentId: params.agentId,
		agentSessionKey: params.agentSessionKey,
		sandboxed: params.sandboxed === true
	});
}
function preparedMemoryPromptContextMatches(prepared, params) {
	return prepared.context.citationsMode === params.citationsMode && prepared.context.agentId === params.agentId && prepared.context.agentSessionKey === params.agentSessionKey && prepared.context.sandboxed === (params.sandboxed === true) && prepared.context.availableTools.length === params.availableTools.size && prepared.context.availableTools.every((tool) => params.availableTools.has(tool));
}
/** Prepare one immutable memory prompt snapshot for a run. */
async function prepareMemoryPromptSection(params) {
	const runParams = cloneMemoryPromptSectionParams(params);
	const context = snapshotMemoryPromptContext(runParams);
	const synchronous = buildSynchronousMemoryPromptSection(cloneMemoryPromptSectionParams(runParams));
	const preparationRegistrations = [...requireActivePluginRegistry().memoryPromptPreparations];
	const preparedSupplements = await Promise.all(preparationRegistrations.map(async (registration) => ({
		pluginId: registration.pluginId,
		lines: filterStringEntries(await registration.prepare(cloneMemoryPromptSectionParams(runParams)))
	})));
	const lines = Object.freeze([...synchronous.primary, ...[...synchronous.supplements, ...preparedSupplements].toSorted((left, right) => left.pluginId.localeCompare(right.pluginId)).flatMap((registration) => registration.lines)]);
	const prepared = Object.freeze({
		context,
		lines
	});
	preparedMemoryPromptSections.add(prepared);
	return prepared;
}
/** Keep async preparation run-scoped while a context engine assembles synchronously. */
async function runWithPreparedMemoryPromptSection(params, run) {
	const prepared = await prepareMemoryPromptSection(params);
	return activePreparedMemoryPromptSection.run(prepared, run);
}
function getActivePreparedMemoryPromptSection() {
	return activePreparedMemoryPromptSection.getStore();
}
function buildMemoryPromptSection(params, prepared) {
	if (prepared) {
		if (!preparedMemoryPromptSections.has(prepared) || !preparedMemoryPromptContextMatches(prepared, params)) throw new Error("prepared memory prompt section does not match the current run");
		return [...prepared.lines];
	}
	const synchronous = buildSynchronousMemoryPromptSection(params);
	return [...synchronous.primary, ...synchronous.supplements.flatMap((entry) => entry.lines)];
}
function listMemoryPromptSupplements() {
	return [...requireActivePluginRegistry().memoryPromptSupplements];
}
function listMemoryPromptPreparations() {
	return [...requireActivePluginRegistry().memoryPromptPreparations];
}
function resolveMemoryFlushPlan(params) {
	return getMemoryCapability()?.capability.flushPlanResolver?.(params) ?? null;
}
function getMemoryRuntime() {
	return getMemoryCapability()?.capability.runtime;
}
let standaloneMemoryManagerActive = false;
function setStandaloneMemoryManagerActive(active) {
	standaloneMemoryManagerActive = active;
}
function hasMemoryRuntime() {
	return standaloneMemoryManagerActive || getMemoryRuntime() !== void 0;
}
function cloneMemoryPublicArtifact(artifact) {
	const agentIds = Array.isArray(artifact.agentIds) ? artifact.agentIds : [];
	return {
		...artifact,
		agentIds: [...agentIds]
	};
}
function isValidMemoryPublicArtifact(artifact) {
	return typeof artifact?.kind === "string" && typeof artifact.workspaceDir === "string" && typeof artifact.relativePath === "string" && typeof artifact.absolutePath === "string" && typeof artifact.contentType === "string";
}
async function listActiveMemoryPublicArtifacts(params) {
	const capability = getMemoryCapability();
	const pluginId = capability?.pluginId;
	const listed = await capability?.capability.publicArtifacts?.listArtifacts(params) ?? [];
	if (!Array.isArray(listed)) {
		log.warn(`ignoring public memory artifacts from plugin "${pluginId}": not an array`);
		return [];
	}
	const artifacts = listed.filter(isValidMemoryPublicArtifact);
	if (artifacts.length < listed.length) log.warn(`ignoring ${listed.length - artifacts.length} malformed public memory artifact(s) from plugin "${pluginId}": artifacts must include string kind, workspaceDir, relativePath, absolutePath, and contentType`);
	return artifacts.map(cloneMemoryPublicArtifact).toSorted((left, right) => {
		const workspaceOrder = left.workspaceDir.localeCompare(right.workspaceDir);
		if (workspaceOrder !== 0) return workspaceOrder;
		const relativePathOrder = left.relativePath.localeCompare(right.relativePath);
		if (relativePathOrder !== 0) return relativePathOrder;
		const kindOrder = left.kind.localeCompare(right.kind);
		if (kindOrder !== 0) return kindOrder;
		const contentTypeOrder = left.contentType.localeCompare(right.contentType);
		if (contentTypeOrder !== 0) return contentTypeOrder;
		const agentOrder = left.agentIds.join("\0").localeCompare(right.agentIds.join("\0"));
		if (agentOrder !== 0) return agentOrder;
		return left.absolutePath.localeCompare(right.absolutePath);
	});
}
function clearMemoryPluginState() {
	const registry = requireActivePluginRegistry();
	registry.memoryCapabilities = [];
	registry.memoryCorpusSupplements = [];
	registry.memoryPromptPreparations = [];
	registry.memoryPromptSupplements = [];
}
//#endregion
export { resolveMemoryCapabilityRegistration as _, getMemoryCapabilityRegistration as a, setStandaloneMemoryManagerActive as b, listActiveMemoryPublicArtifacts as c, listMemoryPromptSupplements as d, prepareMemoryPromptSection as f, registerMemoryPromptSupplement as g, registerMemoryPromptPreparation as h, getActivePreparedMemoryPromptSection as i, listMemoryCorpusSupplements as l, registerMemoryCorpusSupplement as m, buildMemoryPromptSection as n, getMemoryRuntime as o, registerMemoryCapability as p, clearMemoryPluginState as r, hasMemoryRuntime as s, adoptRuntimeMemoryRegistrations as t, listMemoryPromptPreparations as u, resolveMemoryFlushPlan as v, runWithPreparedMemoryPromptSection as y };
