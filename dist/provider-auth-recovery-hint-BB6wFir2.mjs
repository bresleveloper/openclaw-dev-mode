import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { r as resolveProviderAuthAliasMap } from "./provider-auth-aliases-15nvbxqy.mjs";
import { i as resolveManifestProviderAuthChoices } from "./provider-auth-choices-BWz3K_lG.mjs";
//#region src/agents/provider-auth-recovery-hint.ts
/**
* Provider authentication recovery hint builder.
*
* Prefers plugin manifest login commands, then falls back to configure/env-var guidance.
*/
function normalizeProviderIdForAuth(providerId, aliases) {
	const normalized = normalizeProviderId(providerId);
	return normalized ? aliases[normalized] ?? normalized : normalized;
}
/** Build a concise user-facing hint for recovering provider authentication. */
function buildProviderAuthRecoveryHint(params) {
	const aliases = resolveProviderAuthAliasMap(params);
	const normalized = normalizeProviderIdForAuth(params.provider, aliases);
	const loginCommand = resolveManifestProviderAuthChoices(params).find((candidate) => normalized && normalizeProviderIdForAuth(candidate.providerId, aliases) === normalized) ? formatCliCommand(`openclaw models auth login --provider ${normalized}`) : void 0;
	const parts = [];
	if (loginCommand) parts.push(`Run \`${loginCommand}\``);
	if (params.includeConfigure !== false) parts.push(`\`${formatCliCommand("openclaw configure")}\``);
	if (params.includeEnvVar) parts.push("set an API key env var");
	if (parts.length === 0) return `Run \`${formatCliCommand("openclaw configure")}\`.`;
	if (parts.length === 1) return `${parts[0]}.`;
	if (parts.length === 2) return `${parts[0]} or ${parts[1]}.`;
	return `${parts[0]}, ${parts[1]}, or ${parts[2]}.`;
}
//#endregion
export { buildProviderAuthRecoveryHint as t };
