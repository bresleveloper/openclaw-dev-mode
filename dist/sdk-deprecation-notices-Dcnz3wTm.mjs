import { t as getPluginSdkDeprecationUsage } from "./sdk-deprecation-usage-9yUlXToS.mjs";
//#region src/plugins/sdk-deprecation-notices.ts
function buildPluginSdkDeprecationNotices(pluginId) {
	const apis = getPluginSdkDeprecationUsage(pluginId);
	if (apis.length === 0) return [];
	const removalDate = apis.flatMap((api) => api.removeAfter ? [api.removeAfter] : []).toSorted()[0];
	const formattedDate = removalDate ? (/* @__PURE__ */ new Date(`${removalDate}T00:00:00Z`)).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		timeZone: "UTC"
	}) : void 0;
	return [{
		code: "deprecated-sdk-api",
		severity: "info",
		message: formattedDate ? `Uses OpenClaw APIs that retire on ${formattedDate}. It keeps working until then; check for a plugin update.` : "Uses older OpenClaw APIs. It keeps working for now; check for a plugin update.",
		...removalDate ? { removalDate } : {},
		migrationGuideUrl: "https://docs.openclaw.ai/plugins/sdk-migration/how-to-migrate",
		apis: apis.toSorted((left, right) => left.displayName.localeCompare(right.displayName))
	}];
}
//#endregion
export { buildPluginSdkDeprecationNotices as t };
