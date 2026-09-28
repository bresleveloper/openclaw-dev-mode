import { y as parseDateStringTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./number-runtime-CGwowceO.mjs";
import { s as createMigrationManualItem } from "./migration-DepQtnwV.mjs";
import { c as readText } from "./helpers-CRQ7DHOz.mjs";
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
function readHermesProviderCandidate(auth, sourcePath) {
	const providers = isRecord(auth.providers) ? auth.providers : {};
	const provider = isRecord(providers[HERMES_OPENAI_CODEX_SOURCE_PROVIDER_ID]) ? providers[HERMES_OPENAI_CODEX_SOURCE_PROVIDER_ID] : void 0;
	const tokens = isRecord(provider?.tokens) ? provider.tokens : void 0;
	const access = normalizeOptionalString(tokens?.access_token);
	const refresh = normalizeOptionalString(tokens?.refresh_token);
	if (!access || !refresh) return;
	return {
		access,
		refresh,
		sourceKind: "hermes-auth-json",
		sourceSlot: "provider",
		sourceLabel: "Hermes active OpenAI Codex provider",
		sourcePath,
		updatedAt: parseDateStringTimestampMs(provider?.last_refresh)
	};
}
function readHermesPoolCandidates(auth, sourcePath) {
	const pool = isRecord(auth.credential_pool) ? auth.credential_pool : {};
	return (Array.isArray(pool[HERMES_OPENAI_CODEX_SOURCE_PROVIDER_ID]) ? pool[HERMES_OPENAI_CODEX_SOURCE_PROVIDER_ID] : []).flatMap((entry) => {
		if (!isRecord(entry)) return [];
		const access = normalizeOptionalString(entry.access_token);
		const refresh = normalizeOptionalString(entry.refresh_token);
		if (!access || !refresh) return [];
		return [{
			access,
			refresh,
			sourceKind: "hermes-auth-json",
			sourceSlot: "pool",
			sourceLabel: normalizeOptionalString(entry.label) ?? "Hermes OpenAI Codex credential pool",
			sourcePath,
			updatedAt: parseDateStringTimestampMs(entry.last_refresh) ?? parseDateStringTimestampMs(entry.last_status_at)
		}];
	});
}
async function readHermesCodexAuthCandidates(authPath) {
	const raw = await readText(authPath);
	if (!raw || !authPath) return [];
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return [];
	}
	if (!isRecord(parsed)) return [];
	const candidates = [readHermesProviderCandidate(parsed, authPath), ...readHermesPoolCandidates(parsed, authPath)].filter((candidate) => candidate !== void 0).toSorted((left, right) => (right.updatedAt ?? 0) - (left.updatedAt ?? 0));
	candidates.forEach((candidate, index) => {
		candidate.sourceCredentialIndex = index;
	});
	return candidates;
}
async function readHermesOAuthProviderIds(authPath) {
	const raw = await readText(authPath);
	if (!raw) return /* @__PURE__ */ new Set();
	try {
		const parsed = JSON.parse(raw);
		if (!isRecord(parsed)) return /* @__PURE__ */ new Set();
		const providers = isRecord(parsed.providers) ? Object.keys(parsed.providers).filter((provider) => HERMES_REAUTH_SOURCE_PROVIDERS.has(provider)) : [];
		const pool = isRecord(parsed.credential_pool) ? Object.entries(parsed.credential_pool).flatMap(([provider, entries]) => Array.isArray(entries) && entries.some((entry) => isRecord(entry) && normalizeOptionalString(entry.auth_type)?.toLowerCase() === "oauth") ? [provider] : []) : [];
		return /* @__PURE__ */ new Set([...providers, ...pool]);
	} catch {
		return /* @__PURE__ */ new Set();
	}
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
