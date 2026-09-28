import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { o as safeRealpathSync } from "./boundary-path-BzetEUdq.mjs";
import { p as resolveDefaultAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { p as isValidSecretRef, t as DEFAULT_SECRET_PROVIDER_ALIAS } from "./ref-contract-BVi3ykLT.mjs";
import { a as coerceSecretRef, d as parseEnvTemplateSecretRef } from "./types.secrets-B5xWSzLp.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DKt99_dy.mjs";
import { t as getProviderEnvVarsCore } from "./provider-env-vars-BM4XH1SL.mjs";
import { n as normalizeSecretInput } from "./normalize-secret-input-Df_qhWv_.mjs";
import { l as upsertAuthProfileWithLock, s as upsertAuthProfile, u as upsertAuthProfileWithLockOrThrow } from "./profiles-B-MkhBI8.mjs";
import { t as buildAuthProfileId } from "./identity-C0n2rHTU.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/plugins/provider-auth-helpers.ts
const resolveAuthAgentDir = (agentDir, config) => agentDir ?? resolveDefaultAgentDir(config ?? {});
function buildEnvSecretRef(id) {
	return {
		source: "env",
		provider: DEFAULT_SECRET_PROVIDER_ALIAS,
		id
	};
}
function resolveProviderDefaultEnvSecretRef(provider, config) {
	const envVar = getProviderEnvVarsCore(provider, {
		...config ? { config } : {},
		includeUntrustedWorkspacePlugins: false
	})?.find((candidate) => candidate.trim().length > 0);
	if (!envVar) throw new Error(`Provider "${provider}" does not have a default env var mapping for secret-input-mode=ref.`);
	return buildEnvSecretRef(envVar);
}
function resolveApiKeySecretInput(provider, input, options) {
	if (input !== null && typeof input === "object") {
		const coercedRef = coerceSecretRef(input);
		if (!coercedRef || !isValidSecretRef(coercedRef)) throw new Error("API key SecretRef is invalid.");
		return coercedRef;
	}
	if (options?.secretInputMode === "plaintext") return normalizeSecretInput(input);
	const coercedRef = coerceSecretRef(input);
	if (coercedRef) {
		if (!isValidSecretRef(coercedRef)) throw new Error("API key SecretRef is invalid.");
		return coercedRef;
	}
	const normalized = normalizeSecretInput(input);
	const inlineEnvRef = parseEnvTemplateSecretRef(normalized, DEFAULT_SECRET_PROVIDER_ALIAS);
	if (inlineEnvRef) return inlineEnvRef;
	if (options?.secretInputMode === "ref") return resolveProviderDefaultEnvSecretRef(provider, options.config);
	return normalized;
}
function buildApiKeyCredential(provider, input, metadata, options) {
	const secretInput = resolveApiKeySecretInput(provider, input, options);
	if (typeof secretInput === "string") return {
		type: "api_key",
		provider,
		key: secretInput,
		...metadata ? { metadata } : {}
	};
	return {
		type: "api_key",
		provider,
		keyRef: secretInput,
		...metadata ? { metadata } : {}
	};
}
function upsertApiKeyProfile(params) {
	const profileId = params.profileId ?? buildAuthProfileId({ providerId: params.provider });
	upsertAuthProfile({
		profileId,
		credential: buildApiKeyCredential(params.provider, params.input, params.metadata, params.options),
		agentDir: resolveAuthAgentDir(params.agentDir, params.options?.config)
	});
	return profileId;
}
function applyAuthProfileConfig(cfg, params) {
	const profiles = {
		...cfg.auth?.profiles,
		[params.profileId]: {
			provider: params.provider,
			mode: params.mode,
			...params.email ? { email: params.email } : {},
			...params.displayName ? { displayName: params.displayName } : {}
		}
	};
	const next = {
		...cfg,
		auth: {
			...cfg.auth,
			profiles
		}
	};
	const configuredProfiles = Object.entries(cfg.auth?.profiles ?? {});
	const orderEntries = Object.entries(cfg.auth?.order ?? {});
	const preferProfileFirst = params.preferProfileFirst ?? true;
	if (orderEntries.length === 0 && (!preferProfileFirst || !configuredProfiles.some(([profileId, profile]) => profileId !== params.profileId && profile.mode !== params.mode))) return next;
	const normalizedProvider = resolveProviderIdForAuth(params.provider, {
		config: cfg,
		storedCredential: true
	});
	const matchesProvider = (provider, storedCredential = false) => resolveProviderIdForAuth(provider, {
		config: cfg,
		storedCredential
	}) === normalizedProvider;
	const matchingOrderEntries = orderEntries.filter(([provider]) => matchesProvider(provider));
	let providerOrder;
	if (matchingOrderEntries.length > 0) {
		const existingOrder = uniqueStrings(matchingOrderEntries.flatMap(([, order]) => order));
		providerOrder = preferProfileFirst ? [params.profileId, ...existingOrder.filter((profileId) => profileId !== params.profileId)] : existingOrder.includes(params.profileId) ? existingOrder : [...existingOrder, params.profileId];
	} else if (preferProfileFirst) {
		const peers = configuredProfiles.filter(([, profile]) => matchesProvider(profile.provider, true));
		if (peers.some(([profileId, profile]) => profileId !== params.profileId && profile.mode !== params.mode)) providerOrder = [params.profileId, ...peers.map(([profileId]) => profileId).filter((profileId) => profileId !== params.profileId)];
	}
	if (providerOrder) next.auth.order = {
		...Object.fromEntries(orderEntries.filter(([provider]) => !matchesProvider(provider))),
		[normalizedProvider]: providerOrder
	};
	return next;
}
/** Returns true when config still names a removed auth profile. */
function configReferencesAuthProfile(cfg, profileId) {
	return Boolean(cfg.auth?.profiles?.[profileId]) || Object.values(cfg.auth?.order ?? {}).some((order) => order.includes(profileId)) || Object.values(cfg.models?.providers ?? {}).some((provider) => provider.apiKey === profileId);
}
/**
* Drops a profile from `auth.profiles`, every `auth.order` list, and provider-entry
* `apiKey` references. An emptied provider order is deleted rather than left as
* `[]`, because an authored empty order is a hard "select no profiles" instruction.
*/
function removeAuthProfileConfig(cfg, profileId) {
	if (!configReferencesAuthProfile(cfg, profileId)) return cfg;
	const authReferencesProfile = Boolean(cfg.auth?.profiles?.[profileId]) || Object.values(cfg.auth?.order ?? {}).some((providerOrder) => providerOrder.includes(profileId));
	const profiles = Object.fromEntries(Object.entries(cfg.auth?.profiles ?? {}).filter(([id]) => id !== profileId));
	const order = Object.entries(cfg.auth?.order ?? {}).reduce((acc, [providerId, providerOrder]) => {
		const next = providerOrder.filter((id) => id !== profileId);
		if (next.length > 0 || next.length === providerOrder.length) acc[providerId] = next;
		return acc;
	}, {});
	const { order: _droppedOrder, ...auth } = cfg.auth ?? {};
	const providers = Object.fromEntries(Object.entries(cfg.models?.providers ?? {}).map(([providerId, provider]) => {
		if (provider.apiKey !== profileId) return [providerId, provider];
		const { apiKey: _droppedApiKey, ...nextProvider } = provider;
		return [providerId, nextProvider];
	}));
	return {
		...cfg,
		...authReferencesProfile ? { auth: {
			...auth,
			profiles,
			...Object.keys(order).length > 0 ? { order } : {}
		} } : {},
		...cfg.models?.providers ? { models: {
			...cfg.models,
			providers
		} } : {}
	};
}
function resolveSiblingAgentDirs(primaryAgentDir) {
	const normalized = path.resolve(primaryAgentDir);
	const parentOfAgent = path.dirname(normalized);
	const candidateAgentsRoot = path.dirname(parentOfAgent);
	const agentsRoot = path.basename(normalized) === "agent" && path.basename(candidateAgentsRoot) === "agents" ? candidateAgentsRoot : path.join(resolveStateDir(), "agents");
	const discovered = (() => {
		try {
			return fs.readdirSync(agentsRoot, { withFileTypes: true });
		} catch {
			return [];
		}
	})().filter((entry) => entry.isDirectory() || entry.isSymbolicLink()).map((entry) => path.join(agentsRoot, entry.name, "agent"));
	const seen = /* @__PURE__ */ new Set();
	const result = [];
	for (const dir of [normalized, ...discovered]) {
		const real = safeRealpathSync(path.resolve(dir));
		if (real && !seen.has(real)) {
			seen.add(real);
			result.push(real);
		}
	}
	return result;
}
async function writeOAuthCredentials(provider, creds, agentDir, options) {
	const email = typeof creds.email === "string" && creds.email.trim() ? creds.email.trim() : "default";
	const profileId = buildAuthProfileId({
		providerId: provider,
		profileName: options?.profileName ?? email
	});
	const resolvedAgentDir = path.resolve(resolveAuthAgentDir(agentDir));
	const targetAgentDirs = options?.syncSiblingAgents ? resolveSiblingAgentDirs(resolvedAgentDir) : [resolvedAgentDir];
	const credential = {
		type: "oauth",
		provider,
		...creds,
		...options?.displayName ? { displayName: options.displayName } : {}
	};
	await upsertAuthProfileWithLockOrThrow({
		profileId,
		credential,
		agentDir: resolvedAgentDir
	});
	if (options?.syncSiblingAgents) {
		const primaryReal = safeRealpathSync(path.resolve(resolvedAgentDir));
		for (const targetAgentDir of targetAgentDirs) {
			const targetReal = safeRealpathSync(path.resolve(targetAgentDir));
			if (targetReal && primaryReal && targetReal === primaryReal) continue;
			try {
				await upsertAuthProfileWithLock({
					profileId,
					credential,
					agentDir: targetAgentDir
				});
			} catch {}
		}
	}
	return profileId;
}
//#endregion
export { upsertApiKeyProfile as a, removeAuthProfileConfig as i, buildApiKeyCredential as n, writeOAuthCredentials as o, configReferencesAuthProfile as r, applyAuthProfileConfig as t };
