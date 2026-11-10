import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
//#region src/agents/sessions/session-persistence-deprecation.ts
function warnSessionPersistenceDeprecation(method, replacement, options) {
	warnPluginSdkDeprecation({
		family: options?.family ?? "session-persistence",
		method,
		replacement,
		pluginId: options?.pluginId,
		compatibility: options?.compatibility ?? "Synchronous calls retain their return values and commit before returning.",
		code: "DEP_SESSION_PERSISTENCE"
	});
}
//#endregion
export { warnSessionPersistenceDeprecation as t };
