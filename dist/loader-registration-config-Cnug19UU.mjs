import { createHash } from "node:crypto";
//#region src/plugins/loader-registration-config.ts
/** Configuration consumed during registration, independent of activation and load scope. */
function resolvePluginRegistrationConfigKey(params) {
	const { runtimeEntries, sourceEntries } = params;
	const inputs = [.../* @__PURE__ */ new Set([...Object.keys(runtimeEntries), ...Object.keys(sourceEntries)])].toSorted().flatMap((pluginId) => {
		const { enabled: _enabled, ...runtime } = runtimeEntries[pluginId] ?? {};
		const sourceConfig = sourceEntries[pluginId]?.config;
		const registration = {
			...runtime,
			sourceConfig
		};
		return Object.values(registration).some((value) => value !== void 0) ? [[pluginId, registration]] : [];
	});
	return createHash("sha256").update(JSON.stringify(inputs)).digest("hex");
}
//#endregion
export { resolvePluginRegistrationConfigKey as t };
