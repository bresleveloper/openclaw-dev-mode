import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { d as getActivePluginRegistryVersion } from "./runtime-BvdPUus5.mjs";
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
export { projectPluginRuntimeFailure as a, getPluginRuntimeGeneration as i, PluginRuntimeApplicationError as n, capturePluginRuntimeApplications as r, PluginInstallPersistedError as t };
