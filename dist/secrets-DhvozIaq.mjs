import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { b as resolveAuthStorePathForDisplay } from "./profiles-bOpxmzRV.mjs";
import { l as loadAuthProfileStoreWithoutExternalProfiles } from "./store-runtime-CzCCJ_Oe.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./agent-runtime-BhLWDirV.mjs";
import { d as markMigrationItemSkipped, l as markMigrationItemConflict, u as markMigrationItemError } from "./migration-BeM6IrM8.mjs";
import "./provider-auth-C3BBF7yn.mjs";
import { n as updateAuthProfileStoreWithLockCompat } from "./provider-auth-write-compat-B5xygsJD.mjs";
import { n as hasAuthProfileConfigConflict, r as hasCurrentAuthProfileConfigConflict, t as applyAuthProfileConfigWithConflictCheck } from "./auth-config-D5uLFwft.mjs";
import { a as readJsonObject, c as sanitizeName, o as readText, r as parseEnv } from "./helpers-B2SzrrLy.mjs";
import { d as createHermesSecretItem, l as HERMES_REASON_SECRET_NO_LONGER_PRESENT, m as readHermesSecretDetails, n as HERMES_REASON_AUTH_PROFILE_EXISTS, r as HERMES_REASON_AUTH_PROFILE_WRITE_FAILED, s as HERMES_REASON_MISSING_SECRET_METADATA } from "./items-Ow1uFW0E.mjs";
import { r as normalizeHermesProviderId } from "./model-B-1-eaxp.mjs";
import { n as collectHermesProviderSecretBindings } from "./config-providers-C_Vou6O_.mjs";
import { t as SECRET_MAPPINGS } from "./secret-mappings-DmZ2CoEI.mjs";
//#region extensions/migrate-hermes/secrets.ts
function authProfileTarget(agentDir, profileId) {
	return `${resolveAuthStorePathForDisplay(agentDir)}#${profileId}`;
}
function secretAuthProfileConfig(details) {
	return {
		profileId: details.profileId,
		provider: details.provider,
		mode: details.mode ?? "api_key",
		displayName: "Hermes import"
	};
}
function buildEnvSecretCandidates(params) {
	const configuredBindings = collectHermesProviderSecretBindings(params.config, params.env);
	const claimedEnvVars = new Set(configuredBindings.map((binding) => binding.envVar));
	const configured = configuredBindings.flatMap((binding) => {
		if (!params.env[binding.envVar]?.trim()) return [];
		return [{
			id: `secret:${binding.provider}`,
			source: params.envPath,
			envVar: binding.envVar,
			provider: binding.provider,
			profileId: `${binding.provider}:hermes-import`,
			mode: "api_key"
		}];
	});
	const standard = SECRET_MAPPINGS.flatMap((mapping) => {
		if (claimedEnvVars.has(mapping.envVar)) return [];
		const value = params.env[mapping.envVar]?.trim();
		if (!value) return [];
		const provider = mapping.envVar === "KIMI_API_KEY" || mapping.envVar === "KIMI_CODING_API_KEY" ? value.startsWith("sk-kimi-") ? "kimi" : "moonshot" : mapping.provider;
		return [{
			id: `secret:${provider}`,
			source: params.envPath,
			envVar: mapping.envVar,
			provider,
			profileId: provider === mapping.provider ? mapping.profileId : `${provider}:hermes-import`,
			mode: mapping.mode ?? "api_key"
		}];
	});
	return [...configured, ...standard];
}
async function buildOpenCodeSecretCandidates(authPath) {
	if (!authPath) return [];
	const auth = await readJsonObject(authPath);
	const candidates = [];
	for (const [provider, secretField, mode, profileId] of [
		[
			"opencode",
			"key",
			"api_key",
			"opencode:hermes-import"
		],
		[
			"opencode-go",
			"key",
			"api_key",
			"opencode-go:hermes-import"
		],
		[
			"github-copilot",
			"refresh",
			"token",
			"github-copilot:github"
		]
	]) {
		const entry = auth[provider];
		if (!isRecord(entry) || !normalizeOptionalString(entry[secretField])) continue;
		if (provider === "github-copilot" && normalizeOptionalString(entry.enterpriseUrl)) continue;
		candidates.push({
			id: `secret:${provider}:opencode-auth-json`,
			source: authPath,
			provider,
			profileId,
			mode,
			sourceKind: "opencode-auth-json",
			sourceProvider: provider,
			secretField
		});
	}
	return candidates;
}
async function buildHermesPoolSecretCandidates(authPath, globalAuthPath) {
	if (!authPath && !globalAuthPath) return [];
	const auth = await readJsonObject(authPath);
	const globalAuth = await readJsonObject(globalAuthPath);
	const pool = isRecord(auth.credential_pool) ? auth.credential_pool : {};
	const globalPool = isRecord(globalAuth.credential_pool) ? globalAuth.credential_pool : {};
	const candidates = [];
	const sourceProviders = /* @__PURE__ */ new Set([...Object.keys(pool), ...Object.keys(globalPool)]);
	for (const sourceProvider of [...sourceProviders].toSorted()) {
		const profileEntries = Array.isArray(pool[sourceProvider]) ? pool[sourceProvider] : [];
		const globalEntries = Array.isArray(globalPool[sourceProvider]) ? globalPool[sourceProvider] : [];
		const rawEntries = profileEntries.length > 0 ? profileEntries : globalEntries;
		const sourcePath = profileEntries.length > 0 ? authPath : globalAuthPath;
		if (sourceProvider === "openai-codex" || !sourcePath) continue;
		for (const rawEntry of rawEntries) {
			if (!isRecord(rawEntry)) continue;
			const sourceCredentialId = normalizeOptionalString(rawEntry.id);
			const authType = normalizeOptionalString(rawEntry.auth_type);
			const source = normalizeOptionalString(rawEntry.source);
			if (!sourceCredentialId || authType !== "api_key" || source !== "manual" || !normalizeOptionalString(rawEntry.access_token)) continue;
			const provider = normalizeHermesProviderId(sourceProvider);
			const profileSuffix = sanitizeName(sourceCredentialId);
			if (!provider || !profileSuffix) continue;
			candidates.push({
				id: `secret:${provider}:hermes-auth-json:${profileSuffix}`,
				source: sourcePath,
				provider,
				profileId: `${provider}:hermes-${profileSuffix}`,
				mode: "api_key",
				sourceKind: "hermes-auth-json",
				sourceProvider,
				sourceCredentialId,
				secretField: "access_token"
			});
		}
	}
	return candidates;
}
async function readSecretCandidateValue(details, source) {
	if (details.sourceKind === "opencode-auth-json") {
		const auth = await readJsonObject(source);
		const sourceProvider = details.sourceProvider;
		const secretField = details.secretField;
		if (!sourceProvider || !secretField) return;
		const provider = isRecord(auth[sourceProvider]) ? auth[sourceProvider] : {};
		return normalizeOptionalString(provider[secretField]);
	}
	if (details.sourceKind === "hermes-auth-json") {
		const auth = await readJsonObject(source);
		const pool = isRecord(auth.credential_pool) ? auth.credential_pool : {};
		const entries = details.sourceProvider ? pool[details.sourceProvider] : void 0;
		if (!Array.isArray(entries) || !details.sourceCredentialId) return;
		const entry = entries.find((candidate) => isRecord(candidate) && candidate.id === details.sourceCredentialId);
		return isRecord(entry) ? normalizeOptionalString(entry.access_token) : void 0;
	}
	if (!details.envVar) return;
	return parseEnv(await readText(source))[details.envVar]?.trim() || void 0;
}
async function buildSecretItems(params) {
	const env = parseEnv(await readText(params.source.envPath));
	const store = loadAuthProfileStoreWithoutExternalProfiles(params.targets.agentDir);
	const seenProfiles = /* @__PURE__ */ new Set();
	const items = [];
	const candidates = [
		...buildEnvSecretCandidates({
			config: params.config,
			env,
			envPath: params.source.envPath
		}),
		...await buildHermesPoolSecretCandidates(params.source.authPath, params.source.globalAuthPath),
		...await buildOpenCodeSecretCandidates(params.source.opencodeAuthPath)
	];
	for (const candidate of candidates) {
		if (seenProfiles.has(candidate.profileId)) continue;
		seenProfiles.add(candidate.profileId);
		const existsAlready = Boolean(store.profiles[candidate.profileId]);
		const configConflict = hasAuthProfileConfigConflict(params.ctx.config, secretAuthProfileConfig(candidate), Boolean(params.ctx.overwrite));
		items.push(createHermesSecretItem({
			id: candidate.id,
			source: candidate.source,
			target: authProfileTarget(params.targets.agentDir, candidate.profileId),
			includeSecrets: params.ctx.includeSecrets,
			existsAlready: existsAlready && !params.ctx.overwrite || configConflict,
			details: {
				...candidate.envVar ? { envVar: candidate.envVar } : {},
				provider: candidate.provider,
				profileId: candidate.profileId,
				...candidate.mode === "token" ? { mode: candidate.mode } : {},
				...candidate.sourceKind ? { sourceKind: candidate.sourceKind } : {},
				...candidate.sourceProvider ? { sourceProvider: candidate.sourceProvider } : {},
				...candidate.sourceCredentialId ? { sourceCredentialId: candidate.sourceCredentialId } : {},
				...candidate.secretField ? { secretField: candidate.secretField } : {}
			}
		}));
	}
	return items;
}
async function applySecretItem(ctx, item, targets) {
	if (item.status !== "planned") return item;
	const details = readHermesSecretDetails(item);
	const source = item.source;
	if (!details || !source) return markMigrationItemError(item, HERMES_REASON_MISSING_SECRET_METADATA);
	const key = await readSecretCandidateValue(details, source);
	if (!key) return markMigrationItemSkipped(item, HERMES_REASON_SECRET_NO_LONGER_PRESENT);
	const configProfile = secretAuthProfileConfig(details);
	if (hasCurrentAuthProfileConfigConflict(ctx, configProfile)) return markMigrationItemConflict(item, HERMES_REASON_AUTH_PROFILE_EXISTS);
	let conflicted = false;
	let wrote = false;
	const store = await updateAuthProfileStoreWithLockCompat({
		agentDir: targets.agentDir,
		stateDir: ctx.stateDir,
		updater: (freshStore) => {
			if (!ctx.overwrite && freshStore.profiles[details.profileId]) {
				conflicted = true;
				return false;
			}
			freshStore.profiles[details.profileId] = details.mode === "token" ? {
				type: "token",
				provider: details.provider,
				token: key,
				displayName: "Hermes import"
			} : {
				type: "api_key",
				provider: details.provider,
				key,
				displayName: "Hermes import"
			};
			wrote = true;
			return true;
		}
	});
	if (conflicted) return markMigrationItemConflict(item, HERMES_REASON_AUTH_PROFILE_EXISTS);
	if (!store?.profiles[details.profileId]) return markMigrationItemError(item, HERMES_REASON_AUTH_PROFILE_WRITE_FAILED);
	if (!wrote && !ctx.overwrite) return markMigrationItemConflict(item, HERMES_REASON_AUTH_PROFILE_EXISTS);
	const configResult = await applyAuthProfileConfigWithConflictCheck({
		ctx,
		profile: configProfile
	});
	if (configResult === "conflict") return markMigrationItemConflict(item, HERMES_REASON_AUTH_PROFILE_EXISTS);
	return {
		...item,
		status: "migrated",
		details: {
			...item.details,
			configUpdated: configResult === "configured"
		}
	};
}
//#endregion
export { buildSecretItems as n, applySecretItem as t };
