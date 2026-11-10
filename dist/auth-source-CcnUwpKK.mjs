import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { y as parseDateStringTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import { s as createMigrationManualItem } from "./migration-Cf1WpRKe.mjs";
import { a as readJsonObject } from "./helpers-DpSlwpMA.mjs";
//#region extensions/migrate-hermes/auth-source.ts
const HERMES_OPENAI_CODEX_SOURCE_PROVIDER_ID = "openai-codex";
const HERMES_REAUTH_PROVIDER_MAPPINGS = [
	{
		sourceProvider: "anthropic",
		targetProvider: "anthropic"
	},
	{
		sourceProvider: "nous",
		targetProvider: "nous"
	},
	{
		sourceProvider: "qwen-oauth",
		targetProvider: "qwen"
	},
	{
		sourceProvider: "qwen-cli",
		targetProvider: "qwen"
	},
	{
		sourceProvider: "qwen-portal",
		targetProvider: "qwen"
	},
	{
		sourceProvider: "minimax-oauth",
		targetProvider: "minimax-portal"
	},
	{
		sourceProvider: "xai-oauth",
		targetProvider: "xai"
	}
];
const HERMES_REAUTH_SOURCE_PROVIDERS = new Set(HERMES_REAUTH_PROVIDER_MAPPINGS.map((entry) => entry.sourceProvider));
async function readHermesCodexAuthCandidates(authPath) {
	if (!authPath) return [];
	const auth = await readJsonObject(authPath);
	const providers = isRecord(auth.providers) ? auth.providers : {};
	const provider = isRecord(providers[HERMES_OPENAI_CODEX_SOURCE_PROVIDER_ID]) ? providers[HERMES_OPENAI_CODEX_SOURCE_PROVIDER_ID] : void 0;
	const pool = isRecord(auth.credential_pool) ? auth.credential_pool : {};
	const entries = Array.isArray(pool[HERMES_OPENAI_CODEX_SOURCE_PROVIDER_ID]) ? pool[HERMES_OPENAI_CODEX_SOURCE_PROVIDER_ID] : [];
	const candidates = [];
	for (const [sourceSlot, raw] of [["provider", provider?.tokens], ...entries.map((entry) => ["pool", entry])]) {
		if (!isRecord(raw)) continue;
		const access = normalizeOptionalString(raw.access_token);
		const refresh = normalizeOptionalString(raw.refresh_token);
		if (!access || !refresh) continue;
		candidates.push({
			access,
			refresh,
			sourceKind: "hermes-auth-json",
			sourceSlot,
			sourceLabel: sourceSlot === "provider" ? "Hermes active OpenAI Codex provider" : normalizeOptionalString(raw.label) ?? "Hermes OpenAI Codex credential pool",
			sourcePath: authPath,
			updatedAt: sourceSlot === "provider" ? parseDateStringTimestampMs(provider?.last_refresh) : parseDateStringTimestampMs(raw.last_refresh) ?? parseDateStringTimestampMs(raw.last_status_at)
		});
	}
	candidates.sort((left, right) => (right.updatedAt ?? 0) - (left.updatedAt ?? 0));
	candidates.forEach((candidate, index) => {
		candidate.sourceCredentialIndex = index;
	});
	return candidates;
}
async function readHermesOAuthProviderIds(authPath) {
	const parsed = await readJsonObject(authPath);
	const providers = isRecord(parsed.providers) ? Object.keys(parsed.providers).filter((provider) => HERMES_REAUTH_SOURCE_PROVIDERS.has(provider)) : [];
	const pool = isRecord(parsed.credential_pool) ? Object.entries(parsed.credential_pool).flatMap(([provider, entries]) => Array.isArray(entries) && entries.some((entry) => isRecord(entry) && normalizeOptionalString(entry.auth_type)?.toLowerCase() === "oauth") ? [provider] : []) : [];
	return /* @__PURE__ */ new Set([...providers, ...pool]);
}
async function buildReauthenticationItems(source) {
	const profileProviders = await readHermesOAuthProviderIds(source.authPath);
	const globalProviders = await readHermesOAuthProviderIds(source.globalAuthPath);
	const items = HERMES_REAUTH_PROVIDER_MAPPINGS.flatMap(({ sourceProvider, targetProvider }) => {
		const sourcePath = profileProviders.has(sourceProvider) ? source.authPath : globalProviders.has(sourceProvider) ? source.globalAuthPath : void 0;
		if (!sourcePath) return [];
		return [createMigrationManualItem({
			id: `manual:auth-reauthenticate:${targetProvider}`,
			source: sourcePath,
			message: `Hermes ${sourceProvider} credentials cannot be reused safely by OpenClaw.`,
			recommendation: targetProvider === "qwen" ? "Authenticate qwen with an API key after migration: openclaw onboard --auth-choice qwen-api-key." : `Authenticate ${targetProvider} in OpenClaw after migration.`
		})];
	});
	return [...new Map(items.map((item) => [item.id, item])).values()];
}
//#endregion
export { readHermesCodexAuthCandidates as n, buildReauthenticationItems as t };
