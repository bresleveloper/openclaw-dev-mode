import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, p as normalizeStringifiedOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { a as normalizeCsvOrLooseStringList } from "./string-normalization-_gRhJUDw.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { O as listAgentIds, a as resolveAgentDir, m as resolveDefaultAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as parseConfigPathArrayIndex } from "./path-array-index-CvEcUJa-.mjs";
import { f as isValidSecretProviderAlias, h as resolveDefaultSecretProviderAlias, l as isValidEnvSecretRefId, o as formatExecSecretRefIdValidationMessage, u as isValidExecSecretRefId } from "./ref-contract-BVi3ykLT.mjs";
import { a as coerceSecretRef, p as resolveSecretInputRef } from "./types.secrets-B5xWSzLp.mjs";
import { t as loadPluginManifestRegistryCore } from "./manifest-registry-CEG7WMVu.mjs";
import { t as isSafeExecutableValue } from "./exec-safety-DtLGRBJm.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { t as getProviderEnvVarsCore } from "./provider-env-vars-BM4XH1SL.mjs";
import { t as isNonEmptyString } from "./shared-BUXrUFz5.mjs";
import { f as assertExpectedResolvedSecretValue } from "./runtime-shared-Bpp2PLaL.mjs";
import { n as discoverConfigSecretTargets, t as discoverAuthProfileSecretTargets } from "./target-registry-query-DciTXKJy.mjs";
import "./target-registry-BD3AtdiE.mjs";
import { r as listSecretProviderIntegrationPresets } from "./exec-provider-path-validation-7Cc3wazF.mjs";
import { n as resolveSecretRefValue } from "./resolve-C3ItmvEK.mjs";
import { f as readPersistedSharedAuthProfileStoreRaw } from "./sqlite-BIg_k8qE.mjs";
import { a as loadPersistedAuthProfileStore } from "./persisted-B486xwB_.mjs";
import { t as getSkippedExecRefStaticError } from "./exec-resolution-policy-BBKscxZv.mjs";
import { i as iterateAuthProfileCredentials, t as createSecretsConfigIO } from "./config-io-CebzxeCl.mjs";
import { t as runSecretsApply } from "./apply-DZ8hxZNj.mjs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import { confirm, log, select, text } from "@clack/prompts";
//#region src/secrets/configure-plan.ts
/** Builds the interactive `openclaw secrets configure` target list and apply plan. */
function getSecretProviders$1(config) {
	if (!isRecord(config.secrets?.providers)) return {};
	return config.secrets.providers;
}
function configureCandidateSortKey(candidate) {
	if (candidate.configFile === "auth-profile-store") return `auth-profiles:${candidate.agentId ?? ""}:${candidate.path}`;
	return `openclaw:${candidate.path}`;
}
function resolveAuthProfileProvider(store, pathSegments) {
	const profileId = pathSegments[1];
	if (!profileId) return;
	const profile = store.profiles?.[profileId];
	if (!isRecord(profile) || typeof profile.provider !== "string") return;
	const provider = profile.provider.trim();
	return provider.length > 0 ? provider : void 0;
}
/** Builds configure candidates for OpenClaw config plus an optional auth-profile scope. */
function buildConfigureCandidatesForScope(params) {
	const authoredConfig = params.authoredOpenClawConfig ?? params.config;
	const hasPathInAuthoredConfig = (pathSegments) => hasPath(authoredConfig, pathSegments);
	const openclawCandidates = discoverConfigSecretTargets(params.config).filter((entry) => entry.entry.includeInConfigure).map((entry) => {
		const resolved = resolveSecretInputRef({
			value: entry.value,
			refValue: entry.refValue,
			defaults: params.config.secrets?.defaults
		});
		const pathExists = hasPathInAuthoredConfig(entry.pathSegments);
		const refPathExists = entry.refPathSegments ? hasPathInAuthoredConfig(entry.refPathSegments) : false;
		return Object.assign({
			type: entry.entry.targetType,
			path: entry.path,
			pathSegments: [...entry.pathSegments],
			label: entry.path,
			configFile: `openclaw.json`,
			expectedResolvedValue: entry.entry.expectedResolvedValue
		}, resolved.ref ? { existingRef: resolved.ref } : {}, pathExists || refPathExists ? {} : { isDerived: true }, entry.providerId ? { providerId: entry.providerId } : {}, entry.accountId ? { accountId: entry.accountId } : {});
	});
	const authCandidates = params.authProfiles === void 0 ? [] : discoverAuthProfileSecretTargets(params.authProfiles.store).filter((entry) => entry.entry.includeInConfigure).map((entry) => {
		const authProfiles = params.authProfiles;
		if (!authProfiles) throw new Error("Missing auth profile scope for configure candidate discovery.");
		const authProfileProvider = resolveAuthProfileProvider(authProfiles.store, entry.pathSegments);
		const resolved = resolveSecretInputRef({
			value: entry.value,
			refValue: entry.refValue,
			defaults: params.config.secrets?.defaults
		});
		return Object.assign({
			type: entry.entry.targetType,
			path: entry.path,
			pathSegments: [...entry.pathSegments],
			label: `${entry.path} (auth profile, agent ${authProfiles.agentId})`,
			configFile: `auth-profile-store`,
			expectedResolvedValue: entry.entry.expectedResolvedValue
		}, resolved.ref ? { existingRef: resolved.ref } : {}, { agentId: authProfiles.agentId }, authProfileProvider ? { authProfileProvider } : {});
	});
	return [...openclawCandidates, ...authCandidates].toSorted((a, b) => configureCandidateSortKey(a).localeCompare(configureCandidateSortKey(b)));
}
function hasPath(root, segments) {
	if (segments.length === 0) return false;
	let cursor = root;
	for (let index = 0; index < segments.length; index += 1) {
		const segment = segments[index] ?? "";
		if (Array.isArray(cursor)) {
			const parsedIndex = parseConfigPathArrayIndex(segment);
			if (parsedIndex === void 0 || parsedIndex >= cursor.length) return false;
			if (index === segments.length - 1) return true;
			cursor = cursor[parsedIndex];
			continue;
		}
		if (!isRecord(cursor)) return false;
		if (!Object.hasOwn(cursor, segment)) return false;
		if (index === segments.length - 1) return true;
		cursor = cursor[segment];
	}
	return false;
}
/** Computes provider upserts/deletes between original and edited config. */
function collectConfigureProviderChanges(params) {
	const originalProviders = getSecretProviders$1(params.original);
	const nextProviders = getSecretProviders$1(params.next);
	const upserts = {};
	const deletes = [];
	for (const [providerAlias, nextProviderConfig] of Object.entries(nextProviders)) {
		const current = originalProviders[providerAlias];
		if (isDeepStrictEqual(current, nextProviderConfig)) continue;
		upserts[providerAlias] = structuredClone(nextProviderConfig);
	}
	for (const providerAlias of Object.keys(originalProviders)) if (!Object.hasOwn(nextProviders, providerAlias)) deletes.push(providerAlias);
	return {
		upserts,
		deletes: deletes.toSorted()
	};
}
/** Returns true when selected targets or provider mutations would produce a plan. */
function hasConfigurePlanChanges(params) {
	return params.selectedTargets.size > 0 || Object.keys(params.providerChanges.upserts).length > 0 || params.providerChanges.deletes.length > 0;
}
/** Builds the serializable secrets apply plan from configure selections. */
function buildSecretsConfigurePlan(params) {
	return {
		version: 1,
		protocolVersion: 1,
		generatedAt: params.generatedAt ?? (/* @__PURE__ */ new Date()).toISOString(),
		generatedBy: "openclaw secrets configure",
		targets: [...params.selectedTargets.values()].map((entry) => Object.assign({
			type: entry.type,
			path: entry.path,
			pathSegments: [...entry.pathSegments],
			ref: entry.ref
		}, entry.agentId ? { agentId: entry.agentId } : {}, entry.providerId ? { providerId: entry.providerId } : {}, entry.accountId ? { accountId: entry.accountId } : {}, entry.authProfileProvider ? { authProfileProvider: entry.authProfileProvider } : {})),
		...Object.keys(params.providerChanges.upserts).length > 0 ? { providerUpserts: params.providerChanges.upserts } : {},
		...params.providerChanges.deletes.length > 0 ? { providerDeletes: params.providerChanges.deletes } : {},
		options: {
			scrubEnv: true,
			scrubAuthProfilesForProviderTargets: true,
			scrubLegacyAuthJson: false
		}
	};
}
//#endregion
//#region src/secrets/configure.ts
/** Interactive and noninteractive secrets configure workflow. */
const WINDOWS_ABS_PATH_PATTERN = /^[A-Za-z]:[\\/]/;
const WINDOWS_UNC_PATH_PATTERN = /^\\\\[^\\]+\\[^\\]+/;
function isAbsolutePathValue(value) {
	return path.isAbsolute(value) || WINDOWS_ABS_PATH_PATTERN.test(value) || WINDOWS_UNC_PATH_PATTERN.test(value);
}
function parseOptionalPositiveInt(value, max) {
	const trimmed = value.trim();
	if (!trimmed) return;
	if (!/^\d+$/.test(trimmed)) return;
	const parsed = parseStrictPositiveInteger(trimmed);
	if (parsed === void 0 || parsed > max) return;
	return parsed;
}
function getSecretProviders(config) {
	if (!isRecord(config.secrets?.providers)) return {};
	return config.secrets.providers;
}
function setSecretProvider(config, providerAlias, providerConfig) {
	config.secrets ??= {};
	if (!isRecord(config.secrets.providers)) config.secrets.providers = {};
	config.secrets.providers[providerAlias] = providerConfig;
}
function removeSecretProvider(config, providerAlias) {
	if (!isRecord(config.secrets?.providers)) return false;
	const providers = config.secrets.providers;
	if (!Object.hasOwn(providers, providerAlias)) return false;
	delete providers[providerAlias];
	if (Object.keys(providers).length === 0) delete config.secrets?.providers;
	if (isRecord(config.secrets?.defaults)) {
		const defaults = config.secrets.defaults;
		if (defaults?.env === providerAlias) delete defaults.env;
		if (defaults?.file === providerAlias) delete defaults.file;
		if (defaults?.exec === providerAlias) delete defaults.exec;
		if (defaults?.store === providerAlias) delete defaults.store;
		if (defaults && defaults.env === void 0 && defaults.file === void 0 && defaults.exec === void 0 && defaults.store === void 0) delete config.secrets?.defaults;
	}
	return true;
}
function providerHint(provider) {
	if (provider.source === "env") return provider.allowlist?.length ? `env (${provider.allowlist.length} allowlisted)` : "env";
	if (provider.source === "file") return `file (${provider.mode ?? "json"})`;
	if (provider.source === "store") return "store";
	if ("pluginIntegration" in provider) {
		const { pluginId, integrationId } = provider.pluginIntegration;
		return `exec plugin (${pluginId}:${integrationId})`;
	}
	return `exec (${provider.jsonOnly === false ? "json+text" : "json"})`;
}
function providerPresetKey(preset) {
	return `${preset.pluginId}:${preset.id}:${preset.providerAlias}`;
}
function providerPresetHint(preset) {
	return `${preset.providerAlias} | ${preset.pluginId}:${preset.id} | exec plugin`;
}
function loadSecretProviderIntegrationPresets(params) {
	const manifestRegistry = loadPluginManifestRegistryCore({
		config: params.config,
		env: params.env
	});
	return listSecretProviderIntegrationPresets({
		manifestRegistry,
		config: params.config,
		env: params.env
	});
}
function toSourceChoices(config) {
	const hasSource = (source) => Object.values(config.secrets?.providers ?? {}).some((provider) => provider?.source === source);
	const choices = [{
		value: "env",
		label: "env"
	}, {
		value: "store",
		label: "store"
	}];
	if (hasSource("file")) choices.push({
		value: "file",
		label: "file"
	});
	if (hasSource("exec")) choices.push({
		value: "exec",
		label: "exec"
	});
	return choices;
}
function assertNoCancel(value, message) {
	if (typeof value === "symbol") throw new Error(message);
	return value;
}
const AUTH_PROFILE_ID_PATTERN = /^[A-Za-z0-9:_-]{1,128}$/;
function validateEnvNameCsv(value) {
	const entries = normalizeCsvOrLooseStringList(value);
	for (const entry of entries) if (!isValidEnvSecretRefId(entry)) return `Invalid env name: ${entry}`;
}
async function promptEnvNameCsv(params) {
	const raw = assertNoCancel(await text({
		message: params.message,
		initialValue: params.initialValue,
		validate: (value) => validateEnvNameCsv(value ?? "")
	}), "Secrets configure cancelled.");
	return normalizeCsvOrLooseStringList(raw ?? "");
}
async function promptOptionalPositiveInt(params) {
	const raw = assertNoCancel(await text({
		message: params.message,
		initialValue: params.initialValue === void 0 ? "" : String(params.initialValue),
		validate: (value) => {
			const trimmed = normalizeStringifiedOptionalString(value) ?? "";
			if (!trimmed) return;
			if (parseOptionalPositiveInt(trimmed, params.max) === void 0) return `Must be an integer between 1 and ${params.max}`;
		}
	}), "Secrets configure cancelled.");
	return parseOptionalPositiveInt(normalizeStringifiedOptionalString(raw) ?? "", params.max);
}
function configureCandidateKey(candidate) {
	if (candidate.configFile === "auth-profile-store") return `auth-profiles:${normalizeOptionalString(candidate.agentId) ?? ""}:${candidate.path}`;
	return `openclaw:${candidate.path}`;
}
function hasSourceChoice(sourceChoices, source) {
	return sourceChoices.some((entry) => entry.value === source);
}
function resolveCandidateProviderHint(candidate) {
	return normalizeOptionalLowercaseString(candidate.authProfileProvider) ?? normalizeOptionalLowercaseString(candidate.providerId);
}
function resolveSuggestedEnvSecretId(candidate) {
	const hintedProvider = resolveCandidateProviderHint(candidate);
	if (!hintedProvider) return;
	const envCandidates = getProviderEnvVarsCore(hintedProvider);
	if (!Array.isArray(envCandidates) || envCandidates.length === 0) return;
	return envCandidates[0];
}
function resolveConfigureAgentId(config, explicitAgentId) {
	const knownAgentIds = new Set(listAgentIds(config));
	if (!explicitAgentId) return resolveDefaultAgentId(config);
	const normalized = normalizeAgentId(explicitAgentId);
	if (knownAgentIds.has(normalized)) return normalized;
	const known = [...knownAgentIds].toSorted().join(", ");
	throw new Error(`Unknown agent id "${explicitAgentId}". Known agents: ${known || "none configured"}.`);
}
function loadAuthProfileStoreForConfigure(params) {
	const agentDir = resolveAgentDir(params.config, params.agentId);
	return loadPersistedAuthProfileStore(agentDir) ?? {
		version: 1,
		profiles: {}
	};
}
/**
* Counts plaintext (non-SecretRef) credentials in the canonical shared
* auth-profile store. `secrets configure` only edits the selected agent's
* local store; shared profiles are not writable here. Surfacing the count
* lets an operator know a shared plaintext migration is pending so they do
* not mistake "no shared candidate" for "shared store is clean".
*
* Classification mirrors `secrets audit` (audit.ts): the raw shared row is
* read without normalization so a stored `key` survives even when a sibling
* `keyRef` is present (the normalized loader drops `key` in that case), and
* an authored value that is itself a supported SecretRef shorthand
* (`$ENV` / `${ENV}`) is treated as a reference, not plaintext.
*/
function countSharedAuthProfilePlaintext(env) {
	const shared = readPersistedSharedAuthProfileStoreRaw(env);
	if (!isRecord(shared) || !isRecord(shared.profiles)) return 0;
	let plaintext = 0;
	for (const entry of iterateAuthProfileCredentials(shared.profiles)) {
		if (entry.kind !== "api_key" && entry.kind !== "token") continue;
		if (coerceSecretRef(entry.value)) continue;
		if (isNonEmptyString(entry.value)) plaintext += 1;
	}
	return plaintext;
}
async function promptNewAuthProfileCandidate(agentId) {
	const profileId = assertNoCancel(await text({
		message: "Auth profile id",
		validate: (value) => {
			const trimmed = normalizeStringifiedOptionalString(value) ?? "";
			if (!trimmed) return "Required";
			if (!AUTH_PROFILE_ID_PATTERN.test(trimmed)) return "Use letters/numbers/\":\"/\"_\"/\"-\" only.";
		}
	}), "Secrets configure cancelled.");
	const credentialType = assertNoCancel(await select({
		message: "Auth profile credential type",
		options: [{
			value: "api_key",
			label: "api_key (key/keyRef)"
		}, {
			value: "token",
			label: "token (token/tokenRef)"
		}]
	}), "Secrets configure cancelled.");
	const provider = assertNoCancel(await text({
		message: "Provider id",
		validate: (value) => normalizeStringifiedOptionalString(value) ? void 0 : "Required"
	}), "Secrets configure cancelled.");
	const profileIdTrimmed = normalizeStringifiedOptionalString(profileId) ?? "";
	const providerTrimmed = normalizeStringifiedOptionalString(provider) ?? "";
	if (credentialType === "token") return {
		type: "auth-profiles.token.token",
		path: `profiles.${profileIdTrimmed}.token`,
		pathSegments: [
			"profiles",
			profileIdTrimmed,
			"token"
		],
		label: `profiles.${profileIdTrimmed}.token (auth profile, agent ${agentId})`,
		configFile: "auth-profile-store",
		agentId,
		authProfileProvider: providerTrimmed,
		expectedResolvedValue: "string"
	};
	return {
		type: "auth-profiles.api_key.key",
		path: `profiles.${profileIdTrimmed}.key`,
		pathSegments: [
			"profiles",
			profileIdTrimmed,
			"key"
		],
		label: `profiles.${profileIdTrimmed}.key (auth profile, agent ${agentId})`,
		configFile: "auth-profile-store",
		agentId,
		authProfileProvider: providerTrimmed,
		expectedResolvedValue: "string"
	};
}
async function promptProviderAlias(params) {
	const alias = assertNoCancel(await text({
		message: "Provider alias",
		initialValue: "default",
		validate: (value) => {
			const trimmed = normalizeStringifiedOptionalString(value) ?? "";
			if (!trimmed) return "Required";
			if (!isValidSecretProviderAlias(trimmed)) return "Must match /^[a-z][a-z0-9_-]{0,63}$/";
			if (params.existingAliases.has(trimmed)) return "Alias already exists";
		}
	}), "Secrets configure cancelled.");
	return normalizeStringifiedOptionalString(alias) ?? "";
}
async function promptProviderSource(initial) {
	return assertNoCancel(await select({
		message: "Provider source",
		options: [
			{
				value: "env",
				label: "env"
			},
			{
				value: "file",
				label: "file"
			},
			{
				value: "exec",
				label: "exec"
			},
			{
				value: "store",
				label: "store"
			}
		],
		initialValue: initial
	}), "Secrets configure cancelled.");
}
async function promptEnvProvider(base) {
	const allowlist = await promptEnvNameCsv({
		message: "Env allowlist (comma-separated, blank for unrestricted)",
		initialValue: base?.allowlist?.join(",") ?? ""
	});
	return {
		source: "env",
		...allowlist.length > 0 ? { allowlist } : {}
	};
}
async function promptFileProvider(base) {
	const filePath = assertNoCancel(await text({
		message: "File path (absolute)",
		initialValue: base?.path ?? "",
		validate: (value) => {
			const trimmed = normalizeStringifiedOptionalString(value) ?? "";
			if (!trimmed) return "Required";
			if (!isAbsolutePathValue(trimmed)) return "Must be an absolute path";
		}
	}), "Secrets configure cancelled.");
	const mode = assertNoCancel(await select({
		message: "File mode",
		options: [{
			value: "json",
			label: "json"
		}, {
			value: "singleValue",
			label: "singleValue"
		}],
		initialValue: base?.mode ?? "json"
	}), "Secrets configure cancelled.");
	const timeoutMs = await promptOptionalPositiveInt({
		message: "Timeout ms (blank for default)",
		initialValue: base?.timeoutMs,
		max: 12e4
	});
	const maxBytes = await promptOptionalPositiveInt({
		message: "Max bytes (blank for default)",
		initialValue: base?.maxBytes,
		max: 20971520
	});
	return {
		source: "file",
		path: normalizeStringifiedOptionalString(filePath) ?? "",
		mode,
		...timeoutMs ? { timeoutMs } : {},
		...maxBytes ? { maxBytes } : {}
	};
}
async function parseArgsInput(rawValue) {
	const trimmed = rawValue.trim();
	if (!trimmed) return;
	const parsed = JSON.parse(trimmed);
	if (!Array.isArray(parsed) || !parsed.every((entry) => typeof entry === "string")) throw new Error("args must be a JSON array of strings");
	return parsed;
}
async function promptExecProvider(base) {
	const command = assertNoCancel(await text({
		message: "Command path (absolute)",
		initialValue: base?.command ?? "",
		validate: (value) => {
			const trimmed = normalizeStringifiedOptionalString(value) ?? "";
			if (!trimmed) return "Required";
			if (!isAbsolutePathValue(trimmed)) return "Must be an absolute path";
			if (!isSafeExecutableValue(trimmed)) return "Command value is not allowed";
		}
	}), "Secrets configure cancelled.");
	const argsRaw = assertNoCancel(await text({
		message: "Args JSON array (blank for none)",
		initialValue: JSON.stringify(base?.args ?? []),
		validate: (value) => {
			const trimmed = normalizeStringifiedOptionalString(value) ?? "";
			if (!trimmed) return;
			try {
				const parsed = JSON.parse(trimmed);
				if (!Array.isArray(parsed) || !parsed.every((entry) => typeof entry === "string")) return "Must be a JSON array of strings";
				return;
			} catch {
				return "Must be valid JSON";
			}
		}
	}), "Secrets configure cancelled.");
	const timeoutMs = await promptOptionalPositiveInt({
		message: "Timeout ms (blank for default)",
		initialValue: base?.timeoutMs,
		max: 12e4
	});
	const noOutputTimeoutMs = await promptOptionalPositiveInt({
		message: "No-output timeout ms (blank for default)",
		initialValue: base?.noOutputTimeoutMs,
		max: 12e4
	});
	const maxOutputBytes = await promptOptionalPositiveInt({
		message: "Max output bytes (blank for default)",
		initialValue: base?.maxOutputBytes,
		max: 20971520
	});
	const jsonOnly = assertNoCancel(await confirm({
		message: "Require JSON-only response?",
		initialValue: base?.jsonOnly ?? true
	}), "Secrets configure cancelled.");
	const passEnv = await promptEnvNameCsv({
		message: "Pass-through env vars (comma-separated, blank for none)",
		initialValue: base?.passEnv?.join(",") ?? ""
	});
	const trustedDirsRaw = assertNoCancel(await text({
		message: "Trusted dirs (comma-separated absolute paths, blank for none)",
		initialValue: base?.trustedDirs?.join(",") ?? "",
		validate: (value) => {
			const entries = normalizeCsvOrLooseStringList(value ?? "");
			for (const entry of entries) if (!isAbsolutePathValue(entry)) return `Trusted dir must be absolute: ${entry}`;
		}
	}), "Secrets configure cancelled.");
	const args = await parseArgsInput(normalizeStringifiedOptionalString(argsRaw) ?? "");
	const trustedDirs = normalizeCsvOrLooseStringList(trustedDirsRaw ?? "");
	return {
		source: "exec",
		command: normalizeStringifiedOptionalString(command) ?? "",
		...args && args.length > 0 ? { args } : {},
		...timeoutMs ? { timeoutMs } : {},
		...noOutputTimeoutMs ? { noOutputTimeoutMs } : {},
		...maxOutputBytes ? { maxOutputBytes } : {},
		...jsonOnly ? { jsonOnly } : { jsonOnly: false },
		...passEnv.length > 0 ? { passEnv } : {},
		...trustedDirs.length > 0 ? { trustedDirs } : {},
		...isRecord(base?.env) ? { env: base.env } : {}
	};
}
async function promptProviderConfig(source, current) {
	if (source === "env") return await promptEnvProvider(current?.source === "env" ? current : void 0);
	if (source === "file") return await promptFileProvider(current?.source === "file" ? current : void 0);
	if (source === "store") return { source: "store" };
	return await promptExecProvider(current?.source === "exec" && "command" in current ? current : void 0);
}
async function configureProvidersInteractive(config, env) {
	const presets = loadSecretProviderIntegrationPresets({
		config,
		env
	});
	while (true) {
		const providers = getSecretProviders(config);
		const providerEntries = Object.entries(providers).toSorted(([left], [right]) => left.localeCompare(right));
		const presetEntries = presets.filter((preset) => {
			const current = providers[preset.providerAlias];
			return !current || !isDeepStrictEqual(current, preset.providerConfig);
		});
		const actionOptions = [{
			value: "add",
			label: "Add provider",
			hint: "Define a new env/file/exec/store provider"
		}];
		if (presetEntries.length > 0) actionOptions.push({
			value: "preset",
			label: "Use plugin preset",
			hint: "Configure a provider declared by an installed plugin"
		});
		if (providerEntries.length > 0) {
			actionOptions.push({
				value: "edit",
				label: "Edit provider",
				hint: "Update an existing provider"
			});
			actionOptions.push({
				value: "remove",
				label: "Remove provider",
				hint: "Delete a provider alias"
			});
		}
		actionOptions.push({
			value: "continue",
			label: "Continue",
			hint: "Move to credential mapping"
		});
		const action = assertNoCancel(await select({
			message: providerEntries.length > 0 ? "Configure secret providers" : "Configure secret providers (env/store refs are built in; add file/exec providers as needed)",
			options: actionOptions
		}), "Secrets configure cancelled.");
		if (action === "continue") return;
		if (action === "add") {
			const source = await promptProviderSource();
			setSecretProvider(config, await promptProviderAlias({ existingAliases: new Set(providerEntries.map(([providerAlias]) => providerAlias)) }), await promptProviderConfig(source));
			continue;
		}
		if (action === "preset") {
			const selectedPresetKey = assertNoCancel(await select({
				message: "Select plugin preset",
				options: presetEntries.map((preset) => ({
					value: providerPresetKey(preset),
					label: preset.displayName,
					hint: providerPresetHint(preset)
				}))
			}), "Secrets configure cancelled.");
			const preset = presetEntries.find((entry) => providerPresetKey(entry) === selectedPresetKey);
			if (!preset) throw new Error(`Unknown secret provider preset: ${selectedPresetKey}`);
			if (providers[preset.providerAlias]) {
				if (!assertNoCancel(await confirm({
					message: `Replace provider "${preset.providerAlias}" with the ${preset.displayName} preset?`,
					initialValue: false
				}), "Secrets configure cancelled.")) continue;
			}
			setSecretProvider(config, preset.providerAlias, structuredClone(preset.providerConfig));
			continue;
		}
		if (action === "edit") {
			const alias = assertNoCancel(await select({
				message: "Select provider to edit",
				options: providerEntries.map(([providerAlias, providerConfig]) => ({
					value: providerAlias,
					label: providerAlias,
					hint: providerHint(providerConfig)
				}))
			}), "Secrets configure cancelled.");
			const current = providers[alias];
			if (!current) continue;
			const nextProviderConfig = await promptProviderConfig(await promptProviderSource(current.source), current);
			if (!isDeepStrictEqual(current, nextProviderConfig)) setSecretProvider(config, alias, nextProviderConfig);
			continue;
		}
		if (action === "remove") {
			const alias = assertNoCancel(await select({
				message: "Select provider to remove",
				options: providerEntries.map(([providerAlias, providerConfig]) => ({
					value: providerAlias,
					label: providerAlias,
					hint: providerHint(providerConfig)
				}))
			}), "Secrets configure cancelled.");
			if (assertNoCancel(await confirm({
				message: `Remove provider "${alias}"?`,
				initialValue: false
			}), "Secrets configure cancelled.")) removeSecretProvider(config, alias);
		}
	}
}
/** Runs interactive secrets configuration and returns changed config/auth-store state. */
async function runSecretsConfigureInteractive(params = {}) {
	if (!process.stdin.isTTY) throw new Error("secrets configure requires an interactive TTY.");
	if (params.providersOnly && params.skipProviderSetup) throw new Error("Cannot combine --providers-only with --skip-provider-setup.");
	const env = params.env ?? process.env;
	const allowExecInPreflight = Boolean(params.allowExecInPreflight);
	const { snapshot } = await createSecretsConfigIO({ env }).readConfigFileSnapshotForWrite();
	if (!snapshot.valid) throw new Error("Cannot run interactive secrets configure because config is invalid.");
	const stagedConfig = structuredClone(snapshot.config);
	if (!params.skipProviderSetup) await configureProvidersInteractive(stagedConfig, env);
	const providerChanges = collectConfigureProviderChanges({
		original: snapshot.config,
		next: stagedConfig
	});
	const selectedByPath = /* @__PURE__ */ new Map();
	if (!params.providersOnly) {
		const configureAgentId = resolveConfigureAgentId(snapshot.config, params.agentId);
		const authStore = loadAuthProfileStoreForConfigure({
			config: snapshot.config,
			agentId: configureAgentId
		});
		const candidates = buildConfigureCandidatesForScope({
			config: stagedConfig,
			authoredOpenClawConfig: snapshot.resolved,
			authProfiles: {
				agentId: configureAgentId,
				store: authStore
			}
		});
		const sharedPlaintextCount = countSharedAuthProfilePlaintext(env);
		if (sharedPlaintextCount > 0) log.warn(`Shared auth-profile store has ${sharedPlaintextCount} plaintext credential(s). \`secrets configure\` edits the selected agent's local store only and cannot migrate shared credentials. Run \`openclaw secrets audit\` to review them; a shared-store SecretRef migration path is tracked separately.`, { output: process.stderr });
		if (candidates.length === 0) throw new Error("No configurable secret-bearing fields found for this agent scope.");
		const sourceChoices = toSourceChoices(stagedConfig);
		const hasDerivedCandidates = candidates.some((candidate) => candidate.isDerived === true);
		let showDerivedCandidates = false;
		while (true) {
			const visibleCandidates = showDerivedCandidates ? candidates : candidates.filter((candidate) => candidate.isDerived !== true);
			const options = visibleCandidates.map((candidate) => ({
				value: configureCandidateKey(candidate),
				label: candidate.label,
				hint: [candidate.configFile === "auth-profile-store" ? "auth profile store" : "openclaw.json", candidate.isDerived === true ? "derived" : void 0].filter(Boolean).join(" | ")
			}));
			options.push({
				value: "__create_auth_profile__",
				label: "Create auth profile mapping",
				hint: `Add a new auth-profiles target for agent ${configureAgentId}`
			});
			if (hasDerivedCandidates) options.push({
				value: "__toggle_derived__",
				label: showDerivedCandidates ? "Hide derived targets" : "Show derived targets",
				hint: showDerivedCandidates ? "Show only fields authored directly in config" : "Include normalized/derived aliases"
			});
			if (selectedByPath.size > 0) options.unshift({
				value: "__done__",
				label: "Done",
				hint: "Finish and run preflight"
			});
			const selectedPath = assertNoCancel(await select({
				message: "Select credential field",
				options
			}), "Secrets configure cancelled.");
			if (selectedPath === "__done__") break;
			if (selectedPath === "__create_auth_profile__") {
				const createdCandidate = await promptNewAuthProfileCandidate(configureAgentId);
				const key = configureCandidateKey(createdCandidate);
				const existingIndex = candidates.findIndex((entry) => configureCandidateKey(entry) === key);
				if (existingIndex >= 0) candidates[existingIndex] = createdCandidate;
				else candidates.push(createdCandidate);
				continue;
			}
			if (selectedPath === "__toggle_derived__") {
				showDerivedCandidates = !showDerivedCandidates;
				continue;
			}
			const candidate = visibleCandidates.find((entry) => configureCandidateKey(entry) === selectedPath);
			if (!candidate) throw new Error(`Unknown configure target: ${selectedPath}`);
			const candidateKey = configureCandidateKey(candidate);
			const existingRef = selectedByPath.get(candidateKey)?.ref ?? candidate.existingRef;
			const sourceInitialValue = existingRef && hasSourceChoice(sourceChoices, existingRef.source) ? existingRef.source : void 0;
			const source = assertNoCancel(await select({
				message: "Secret source",
				options: sourceChoices,
				initialValue: sourceInitialValue
			}), "Secrets configure cancelled.");
			const defaultAlias = resolveDefaultSecretProviderAlias(stagedConfig, source, { preferFirstProviderForSource: true });
			const providerInitialValue = existingRef?.source === source ? existingRef.provider : defaultAlias;
			const provider = assertNoCancel(await text({
				message: "Provider alias",
				initialValue: providerInitialValue,
				validate: (value) => {
					const trimmed = normalizeStringifiedOptionalString(value) ?? "";
					if (!trimmed) return "Required";
					if (!isValidSecretProviderAlias(trimmed)) return "Must match /^[a-z][a-z0-9_-]{0,63}$/";
				}
			}), "Secrets configure cancelled.");
			const providerAlias = normalizeStringifiedOptionalString(provider) ?? "";
			let suggestedId = existingRef?.source === source ? existingRef.id : void 0;
			if (!suggestedId && (source === "env" || source === "store")) suggestedId = resolveSuggestedEnvSecretId(candidate);
			if (!suggestedId && source === "file") {
				const configuredProvider = stagedConfig.secrets?.providers?.[providerAlias];
				if (configuredProvider?.source === "file" && configuredProvider.mode === "singleValue") suggestedId = "value";
			}
			const id = assertNoCancel(await text({
				message: "Secret id",
				initialValue: suggestedId,
				validate: (value) => {
					const trimmed = normalizeStringifiedOptionalString(value) ?? "";
					if (!trimmed) return "Required";
					if ((source === "env" || source === "store") && !isValidEnvSecretRefId(trimmed)) return `${source} ids must match /^[A-Z][A-Z0-9_]{0,127}$/`;
					if (source === "exec" && !isValidExecSecretRefId(trimmed)) return formatExecSecretRefIdValidationMessage();
				}
			}), "Secrets configure cancelled.");
			const ref = {
				source,
				provider: providerAlias,
				id: normalizeStringifiedOptionalString(id) ?? ""
			};
			if (ref.source === "exec" && !allowExecInPreflight) {
				const staticError = getSkippedExecRefStaticError({
					ref,
					config: stagedConfig
				});
				if (staticError) throw new Error(staticError);
			} else {
				const resolved = await resolveSecretRefValue(ref, {
					config: stagedConfig,
					env
				});
				assertExpectedResolvedSecretValue({
					value: resolved,
					expected: candidate.expectedResolvedValue,
					errorMessage: candidate.expectedResolvedValue === "string" ? `Ref ${ref.source}:${ref.provider}:${ref.id} did not resolve to a non-empty string.` : `Ref ${ref.source}:${ref.provider}:${ref.id} did not resolve to a supported value type.`
				});
			}
			const next = {
				...candidate,
				ref
			};
			selectedByPath.set(candidateKey, next);
			if (!assertNoCancel(await confirm({
				message: "Configure another credential?",
				initialValue: true
			}), "Secrets configure cancelled.")) break;
		}
	}
	if (!hasConfigurePlanChanges({
		selectedTargets: selectedByPath,
		providerChanges
	})) throw new Error("No secrets changes were selected.");
	const plan = buildSecretsConfigurePlan({
		selectedTargets: selectedByPath,
		providerChanges
	});
	return {
		plan,
		preflight: await runSecretsApply({
			plan,
			env,
			write: false,
			allowExec: allowExecInPreflight
		})
	};
}
//#endregion
export { runSecretsConfigureInteractive };
