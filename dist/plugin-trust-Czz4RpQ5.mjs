import { i as extractErrorCode, n as collectErrorGraphCandidates } from "./error-coercion-C787aVxk.mjs";
import "./errors-DnjwnOju.mjs";
//#region src/plugins/plugin-trust.ts
/** The same recorded explanation is rendered by CLI inspection and the runtime refusal. */
function formatPluginTrustDiagnostic(trust) {
	return [
		`reason=${trust.reason}`,
		`registryPath=${JSON.stringify(trust.registryPath)}`,
		`origin=${JSON.stringify(trust.origin)}`,
		`installSource=${JSON.stringify(trust.installSource ?? null)}`,
		`installSpec=${JSON.stringify(trust.installSpec ?? null)}`
	].join("; ");
}
const PLUGIN_TRUST_REFUSED_CODE = "PLUGIN_TRUST_REFUSED";
var PluginTrustRefusalError = class extends Error {
	constructor(params) {
		const trust = params.trust ?? {
			reason: "record-missing",
			registryPath: null,
			origin: params.origin ?? "unknown"
		};
		const remedy = trust.reason === "provenance-missing" ? "Run openclaw doctor --fix to repair proven legacy official provenance; if it cannot be verified, reinstall from the official npm package or ClawHub listing." : trust.reason === "record-missing" ? "Compare this registryPath with openclaw plugins inspect <plugin-id> --json. If the CLI and Gateway state paths differ, align the service environment; otherwise reinstall from the official npm package or ClawHub listing." : trust.reason === "origin-path" ? "Install the official npm package or ClawHub listing and remove the local override from plugins.load.paths; --link and --force do not grant trusted plugin state." : "Reinstall from the official npm package or ClawHub listing; local paths, archives, ambiguous ownership, and inconsistent install records do not grant trusted plugin state.";
		super(`${params.methodName} is only available for trusted plugins in this release. Plugin ${JSON.stringify(params.pluginId)} loaded from ${JSON.stringify(params.source)} with origin ${JSON.stringify(params.origin ?? "unknown")}; ${formatPluginTrustDiagnostic(trust)}. ${remedy}`);
		this.code = PLUGIN_TRUST_REFUSED_CODE;
		this.name = "PluginTrustRefusalError";
	}
};
/** Ingress monitors and plugins can wrap the refusal before channel startup sees it. */
function isPluginTrustRefusalError(error) {
	return collectErrorGraphCandidates(error, (current) => [current.cause]).some((candidate) => extractErrorCode(candidate) === PLUGIN_TRUST_REFUSED_CODE);
}
//#endregion
export { formatPluginTrustDiagnostic as n, isPluginTrustRefusalError as r, PluginTrustRefusalError as t };
