import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as getPluginInstance } from "./plugin-instance-scope-DEzoxqBj.mjs";
import { i as getSharedPluginCodeReloadWarning } from "./plugin-setup-module-Cbs40ZXx.mjs";
import { d as getActivePluginRegistryVersion } from "./runtime-D4MkflNJ.mjs";
import { r as getPluginRuntimeEntrySource } from "./plugin-runtime-artifact-binding-BgpdoCuH.mjs";
//#region src/plugins/lifecycle.ts
const getPluginRuntimeGeneration = getActivePluginRegistryVersion;
/** Carries the install persistence owner’s durable-commit fact, including across RPC. */
var PluginInstallPersistedError = class extends Error {
	constructor(pluginId, cause) {
		super(`${formatErrorMessage(cause)}
Plugin "${pluginId}" installation is saved. Fix the reported issue, then run \`openclaw plugins reload ${pluginId}\`.`, { cause });
		this.pluginId = pluginId;
		this.name = "PluginInstallPersistedError";
	}
};
var PluginRuntimeApplicationError = class extends Error {
	constructor(message, details, options) {
		super(`${message}\nGateway generation ${details.generation}: replacement ${details.committed ? "applied" : "not applied"}.`, options);
		this.details = details;
		this.name = "PluginRuntimeApplicationError";
	}
};
/** Project the published registry's captured-code facts into its application receipt. */
function createPluginRuntimeApplication(params) {
	const sourceDigests = /* @__PURE__ */ new Map();
	const selectedEntries = /* @__PURE__ */ new Map();
	const restartWarnings = /* @__PURE__ */ new Set();
	for (const record of params.registry.plugins) {
		if (!params.pluginIds.has(record.id)) continue;
		const instance = getPluginInstance(record);
		const entry = getPluginRuntimeEntrySource(record);
		if (instance && record.status === "loaded" && entry) selectedEntries.set(record.id, entry);
		if (instance?.sourceDigest) sourceDigests.set(record.id, instance.sourceDigest);
		if (params.reloadPluginIds?.has(record.id) && record.enabled && record.status === "loaded" && instance) {
			const warning = getSharedPluginCodeReloadWarning(instance);
			if (warning) restartWarnings.add(warning);
		}
	}
	const warnings = [...restartWarnings, ...params.warnings];
	return {
		operationId: params.operationId,
		generation: params.generation,
		pluginIds: [...params.pluginIds].toSorted(),
		sourceDigests: Object.fromEntries(sourceDigests),
		selectedEntries: Object.fromEntries(selectedEntries),
		...restartWarnings.size ? { restartRequired: true } : {},
		...warnings.length ? { warnings } : {}
	};
}
/** Capture publications independently of later management or authority failures. */
function capturePluginRuntimeApplications(applyRuntime) {
	let application;
	return {
		get application() {
			return application;
		},
		applyRuntime: async (params) => {
			const next = await applyRuntime(params);
			const warnings = [.../* @__PURE__ */ new Set([...application?.warnings ?? [], ...next.warnings ?? []])];
			application = warnings.length ? {
				...next,
				warnings
			} : next;
			return application;
		}
	};
}
function projectPluginRuntimeFailure(error, application) {
	const persisted = error instanceof PluginInstallPersistedError ? error : void 0;
	const cause = persisted ? persisted.cause : error;
	const attempt = cause instanceof PluginRuntimeApplicationError ? cause.details : void 0;
	const previous = application && !attempt?.committed ? application : void 0;
	return {
		message: formatErrorMessage(cause) + (previous ? `\nAn earlier runtime change from this operation was applied in Gateway generation ${previous.generation}.` : ""),
		runtime: previous ? {
			...previous,
			committed: true
		} : attempt,
		...previous && attempt ? { runtimeAttempt: attempt } : {},
		...persisted ? { persistence: {
			operation: "install",
			pluginId: persisted.pluginId
		} } : {}
	};
}
//#endregion
export { getPluginRuntimeGeneration as a, createPluginRuntimeApplication as i, PluginRuntimeApplicationError as n, projectPluginRuntimeFailure as o, capturePluginRuntimeApplications as r, PluginInstallPersistedError as t };
