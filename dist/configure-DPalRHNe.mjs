import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, p as normalizeStringifiedOptionalString, t as hasNonEmptyString } from "./string-coerce-1VuiLaaR.mjs";
import { w as parseStrictPositiveInteger } from "./number-coercion-CkhMiRw8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as normalizeCsvOrLooseStringList } from "./string-normalization-D6DKCpwE.mjs";
import { t as parseConfigPathArrayIndex } from "./path-array-index-CvEcUJa-.mjs";
import { f as isValidSecretProviderAlias, h as resolveDefaultSecretProviderAlias, l as isValidEnvSecretRefId, o as formatExecSecretRefIdValidationMessage, u as isValidExecSecretRefId } from "./ref-contract-Bfd9_-Lp.mjs";
import { a as coerceSecretRef, g as resolveSecretInputRef } from "./types.secrets-Dgbd2kyP.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { _ as resolveDefaultAgentId, a as resolveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { t as loadPluginManifestRegistryCore } from "./manifest-registry-BqtrPPLI.mjs";
import "./user-model-account-authority-DFFjC5J5.mjs";
import { n as loadPersistedAuthProfileStore } from "./persisted-DbIYEoQ3.mjs";
import { h as readPersistedSharedAuthProfileStoreRaw } from "./sqlite-BlFpr2YD.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as getProviderEnvVarsCore } from "./provider-env-vars-D43Pu6eG.mjs";
import { t as isSafeExecutableValue } from "./exec-safety-2Pps-JeG.mjs";
import "./shared-BVDjoVcf.mjs";
import { p as assertExpectedResolvedSecretValue } from "./runtime-shared-DqMZ_k3n.mjs";
import { n as discoverConfigSecretTargets, t as discoverAuthProfileSecretTargets } from "./target-registry-query-DOYceNvb.mjs";
import "./target-registry-CSb4wosA.mjs";
import { n as listSecretProviderIntegrationPresets } from "./provider-integrations-D7OjF0YH.mjs";
import { n as resolveSecretRefValue } from "./resolve-D1-YVpS6.mjs";
import { t as getSkippedExecRefStaticError } from "./exec-resolution-policy-DxaB7Xe4.mjs";
import { i as iterateAuthProfileCredentials, t as createSecretsConfigIO } from "./config-io-CIWrveRv.mjs";
import { t as runSecretsApply } from "./apply-B4RdRrRr.mjs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { confirm, log, select, text } from "@clack/prompts";
//#region src/secrets/configure-plan.ts
/** Builds the interactive `openclaw secrets configure` target list and apply plan. */
function configureCandidateSortKey(candidate) {
	if (candidate.configFile === "auth-profile-store") return `auth-profiles:${candidate.agentId ?? ""}:${candidate.path}`;
	return `openclaw:${candidate.path}`;
}
function resolveAuthProfileProvider(store, pathSegments) {
	const profileId = pathSegments[1];
	if (!profileId) return;
	return store.profiles[profileId]?.provider.trim() || void 0;
}
/** Builds configure candidates for OpenClaw config plus an optional auth-profile scope. */
function buildConfigureCandidatesForScope(params) {
	const authoredConfig = params.authoredOpenClawConfig ?? params.config;
	const candidates = [];
	for (const configFile of ["openclaw.json", "auth-profile-store"]) {
		const authProfiles = configFile === "auth-profile-store" ? params.authProfiles : void 0;
		if (configFile === "auth-profile-store" && authProfiles === void 0) continue;
		const targets = authProfiles === void 0 ? discoverConfigSecretTargets(params.config) : discoverAuthProfileSecretTargets(authProfiles.store);
		for (const entry of targets.filter((candidate) => candidate.entry.includeInConfigure)) {
			const authProfileProvider = authProfiles === void 0 ? void 0 : resolveAuthProfileProvider(authProfiles.store, entry.pathSegments);
			const resolved = resolveSecretInputRef({
				value: entry.value,
				refValue: entry.refValue,
				defaults: params.config.secrets?.defaults
			});
			const candidate = {
				type: entry.entry.targetType,
				path: entry.path,
				pathSegments: [...entry.pathSegments],
				label: authProfiles === void 0 ? entry.path : `${entry.path} (auth profile, agent ${authProfiles.agentId})`,
				configFile,
				expectedResolvedValue: entry.entry.expectedResolvedValue,
				...resolved.ref ? { existingRef: resolved.ref } : {}
			};
			if (authProfiles === void 0) {
				const pathExists = hasPath(authoredConfig, entry.pathSegments);
				const refPathExists = entry.refPathSegments ? hasPath(authoredConfig, entry.refPathSegments) : false;
				Object.assign(candidate, pathExists || refPathExists ? {} : { isDerived: true }, entry.providerId ? { providerId: entry.providerId } : {}, entry.accountId ? { accountId: entry.accountId } : {});
			} else Object.assign(candidate, { agentId: authProfiles.agentId }, authProfileProvider ? { authProfileProvider } : {});
			candidates.push(candidate);
		}
	}
	return candidates.toSorted((a, b) => configureCandidateSortKey(a).localeCompare(configureCandidateSortKey(b)));
}
function hasPath(root, segments) {
	if (segments.length === 0) return false;
	let cursor = root;
	for (let index = 0; index < segments.length; index += 1) {
		const segment = segments[index] ?? "";
		if (Array.isArray(cursor)) {
			const parsedIndex = parseConfigPathArrayIndex(segment);
			if (parsedIndex === void 0 || parsedIndex >= cursor.length) return false;
			if (index < segments.length - 1) cursor = cursor[parsedIndex];
		} else {
			if (!isRecord(cursor) || !Object.hasOwn(cursor, segment)) return false;
			if (index < segments.length - 1) cursor = cursor[segment];
		}
	}
	return true;
}
/** Computes provider upserts/deletes between original and edited config. */
function collectConfigureProviderChanges(params) {
	const originalProviders = params.original.secrets?.providers ?? {};
	const nextProviders = params.next.secrets?.providers ?? {};
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
function setSecretProvider(config, providerAlias, providerConfig) {
	config.secrets ??= {};
	config.secrets.providers ??= {};
	config.secrets.providers[providerAlias] = providerConfig;
}
function removeSecretProvider(config, providerAlias) {
	if (!config.secrets?.providers) return false;
	const providers = config.secrets.providers;
	if (!Object.hasOwn(providers, providerAlias)) return false;
	delete providers[providerAlias];
	if (Object.keys(providers).length === 0) delete config.secrets.providers;
	if (config.secrets.defaults) {
		const defaults = config.secrets.defaults;
		const sources = [
			"env",
			"file",
			"exec",
			"store"
		];
		for (const source of sources) if (defaults[source] === providerAlias) delete defaults[source];
		if (sources.every((source) => defaults[source] === void 0)) delete config.secrets.defaults;
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
function toSourceChoices(config) {
	return [
		"env",
		"store",
		"file",
		"exec"
	].filter((source) => source === "env" || source === "store" || Object.values(config.secrets?.providers ?? {}).some((provider) => provider.source === source)).map((value) => ({
		value,
		label: value
	}));
}
function assertNoCancel(value) {
	if (typeof value === "symbol") throw new Error("Secrets configure cancelled.");
	return value;
}
async function promptRequiredText(params) {
	return assertNoCancel(await text({
		...params,
		validate: (value) => {
			const trimmed = value?.trim() ?? "";
			return trimmed ? params.validate?.(trimmed) : "Required";
		}
	})).trim();
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
	}));
	return normalizeCsvOrLooseStringList(raw);
}
const PROVIDER_LIMITS = {
	timeoutMs: {
		label: "Timeout ms",
		max: 12e4
	},
	noOutputTimeoutMs: {
		label: "No-output timeout ms",
		max: 12e4
	},
	maxBytes: {
		label: "Max bytes",
		max: 20971520
	},
	maxOutputBytes: {
		label: "Max output bytes",
		max: 20971520
	}
};
async function promptOptionalPositiveInt(key, base) {
	const { label, max } = PROVIDER_LIMITS[key];
	const initialValue = base?.[key];
	return parseOptionalPositiveInt(assertNoCancel(await text({
		message: `${label} (blank for default)`,
		initialValue: initialValue === void 0 ? "" : String(initialValue),
		validate: (value) => {
			const trimmed = normalizeStringifiedOptionalString(value) ?? "";
			if (!trimmed) return;
			if (parseOptionalPositiveInt(trimmed, max) === void 0) return `Must be an integer between 1 and ${max}`;
		}
	})), max);
}
function configureCandidateKey(candidate) {
	if (candidate.configFile === "auth-profile-store") return `auth-profiles:${normalizeOptionalString(candidate.agentId) ?? ""}:${candidate.path}`;
	return `openclaw:${candidate.path}`;
}
function resolveSuggestedEnvSecretId(candidate) {
	const hintedProvider = normalizeOptionalLowercaseString(candidate.authProfileProvider) ?? normalizeOptionalLowercaseString(candidate.providerId);
	if (!hintedProvider) return;
	return getProviderEnvVarsCore(hintedProvider)[0];
}
function resolveConfigureAgentId(config, explicitAgentId) {
	const knownAgentIds = new Set(listAgentIds(config));
	if (!explicitAgentId) return resolveDefaultAgentId(config);
	const normalized = normalizeAgentId(explicitAgentId);
	if (knownAgentIds.has(normalized)) return normalized;
	const known = [...knownAgentIds].toSorted().join(", ");
	throw new Error(`Unknown agent id "${explicitAgentId}". Known agents: ${known || "none configured"}.`);
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
		if (hasNonEmptyString(entry.value)) plaintext += 1;
	}
	return plaintext;
}
async function promptNewAuthProfileCandidate(agentId) {
	const profileId = await promptRequiredText({
		message: "Auth profile id",
		validate: (value) => AUTH_PROFILE_ID_PATTERN.test(value) ? void 0 : "Use letters/numbers/\":\"/\"_\"/\"-\" only."
	});
	const credentialType = assertNoCancel(await select({
		message: "Auth profile credential type",
		options: [{
			value: "api_key",
			label: "api_key (key/keyRef)"
		}, {
			value: "token",
			label: "token (token/tokenRef)"
		}]
	}));
	const provider = await promptRequiredText({ message: "Provider id" });
	const field = credentialType === "token" ? "token" : "key";
	return {
		type: credentialType === "token" ? "auth-profiles.token.token" : "auth-profiles.api_key.key",
		path: `profiles.${profileId}.${field}`,
		pathSegments: [
			"profiles",
			profileId,
			field
		],
		label: `profiles.${profileId}.${field} (auth profile, agent ${agentId})`,
		configFile: "auth-profile-store",
		agentId,
		authProfileProvider: provider,
		expectedResolvedValue: "string"
	};
}
async function promptProviderAlias(params) {
	return await promptRequiredText({
		message: "Provider alias",
		initialValue: "default",
		validate: (value) => {
			if (!isValidSecretProviderAlias(value)) return "Must match /^[a-z][a-z0-9_-]{0,63}$/";
			return params.existingAliases.has(value) ? "Alias already exists" : void 0;
		}
	});
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
	}));
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
	const filePath = await promptRequiredText({
		message: "File path (absolute)",
		initialValue: base?.path ?? "",
		validate: (value) => isAbsolutePathValue(value) ? void 0 : "Must be an absolute path"
	});
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
	}));
	const timeoutMs = await promptOptionalPositiveInt("timeoutMs", base);
	const maxBytes = await promptOptionalPositiveInt("maxBytes", base);
	return {
		source: "file",
		path: filePath,
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
	const command = await promptRequiredText({
		message: "Command path (absolute)",
		initialValue: base?.command ?? "",
		validate: (value) => {
			if (!isAbsolutePathValue(value)) return "Must be an absolute path";
			return isSafeExecutableValue(value) ? void 0 : "Command value is not allowed";
		}
	});
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
	}));
	const timeoutMs = await promptOptionalPositiveInt("timeoutMs", base);
	const noOutputTimeoutMs = await promptOptionalPositiveInt("noOutputTimeoutMs", base);
	const maxOutputBytes = await promptOptionalPositiveInt("maxOutputBytes", base);
	const jsonOnly = assertNoCancel(await confirm({
		message: "Require JSON-only response?",
		initialValue: base?.jsonOnly ?? true
	}));
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
	}));
	const args = await parseArgsInput(argsRaw);
	const trustedDirs = normalizeCsvOrLooseStringList(trustedDirsRaw);
	return {
		source: "exec",
		command,
		...args && args.length > 0 ? { args } : {},
		...timeoutMs ? { timeoutMs } : {},
		...noOutputTimeoutMs ? { noOutputTimeoutMs } : {},
		...maxOutputBytes ? { maxOutputBytes } : {},
		jsonOnly,
		...passEnv.length > 0 ? { passEnv } : {},
		...trustedDirs.length > 0 ? { trustedDirs } : {},
		...base?.env ? { env: base.env } : {}
	};
}
async function promptProviderConfig(source, current) {
	if (source === "env") return await promptEnvProvider(current?.source === "env" ? current : void 0);
	if (source === "file") return await promptFileProvider(current?.source === "file" ? current : void 0);
	if (source === "store") return { source: "store" };
	return await promptExecProvider(current?.source === "exec" && "command" in current ? current : void 0);
}
async function configureProvidersInteractive(config, env) {
	const manifestRegistry = loadPluginManifestRegistryCore({
		config,
		env
	});
	const presets = listSecretProviderIntegrationPresets({
		manifestRegistry,
		config,
		env
	});
	while (true) {
		const providers = config.secrets?.providers ?? {};
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
		}));
		if (action === "continue") return;
		if (action === "add") {
			const source = await promptProviderSource();
			setSecretProvider(config, await promptProviderAlias({ existingAliases: new Set(providerEntries.map(([providerAlias]) => providerAlias)) }), await promptProviderConfig(source));
			continue;
		}
		if (action === "preset") {
			const preset = assertNoCancel(await select({
				message: "Select plugin preset",
				options: presetEntries.map((entry) => ({
					value: entry,
					label: entry.displayName,
					hint: `${entry.providerAlias} | ${entry.pluginId}:${entry.id} | exec plugin`
				}))
			}));
			if (providers[preset.providerAlias]) {
				if (!assertNoCancel(await confirm({
					message: `Replace provider "${preset.providerAlias}" with the ${preset.displayName} preset?`,
					initialValue: false
				}))) continue;
			}
			setSecretProvider(config, preset.providerAlias, structuredClone(preset.providerConfig));
			continue;
		}
		if (action === "edit" || action === "remove") {
			const { alias, provider: current } = assertNoCancel(await select({
				message: action === "edit" ? "Select provider to edit" : "Select provider to remove",
				options: providerEntries.map(([providerAlias, providerConfig]) => ({
					value: {
						alias: providerAlias,
						provider: providerConfig
					},
					label: providerAlias,
					hint: providerHint(providerConfig)
				}))
			}));
			if (action === "edit") {
				const nextProviderConfig = await promptProviderConfig(await promptProviderSource(current.source), current);
				if (!isDeepStrictEqual(current, nextProviderConfig)) setSecretProvider(config, alias, nextProviderConfig);
				continue;
			}
			if (assertNoCancel(await confirm({
				message: `Remove provider "${alias}"?`,
				initialValue: false
			}))) removeSecretProvider(config, alias);
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
		const agentDir = resolveAgentDir(snapshot.config, configureAgentId);
		const authStore = loadPersistedAuthProfileStore(agentDir) ?? {
			version: 1,
			profiles: {}
		};
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
			const options = (showDerivedCandidates ? candidates : candidates.filter((candidate) => candidate.isDerived !== true)).map((candidate) => ({
				value: candidate,
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
			const candidate = assertNoCancel(await select({
				message: "Select credential field",
				options
			}));
			if (candidate === "__done__") break;
			if (candidate === "__create_auth_profile__") {
				const createdCandidate = await promptNewAuthProfileCandidate(configureAgentId);
				const key = configureCandidateKey(createdCandidate);
				const existingIndex = candidates.findIndex((entry) => configureCandidateKey(entry) === key);
				if (existingIndex >= 0) candidates[existingIndex] = createdCandidate;
				else candidates.push(createdCandidate);
				continue;
			}
			if (candidate === "__toggle_derived__") {
				showDerivedCandidates = !showDerivedCandidates;
				continue;
			}
			const candidateKey = configureCandidateKey(candidate);
			const existingRef = selectedByPath.get(candidateKey)?.ref ?? candidate.existingRef;
			const sourceInitialValue = existingRef && sourceChoices.some((entry) => entry.value === existingRef.source) ? existingRef.source : void 0;
			const source = assertNoCancel(await select({
				message: "Secret source",
				options: sourceChoices,
				initialValue: sourceInitialValue
			}));
			const defaultAlias = resolveDefaultSecretProviderAlias(stagedConfig, source, { preferFirstProviderForSource: true });
			const providerAlias = await promptRequiredText({
				message: "Provider alias",
				initialValue: existingRef?.source === source ? existingRef.provider : defaultAlias,
				validate: (value) => isValidSecretProviderAlias(value) ? void 0 : "Must match /^[a-z][a-z0-9_-]{0,63}$/"
			});
			let suggestedId = existingRef?.source === source ? existingRef.id : void 0;
			if (!suggestedId && (source === "env" || source === "store")) suggestedId = resolveSuggestedEnvSecretId(candidate);
			if (!suggestedId && source === "file") {
				const configuredProvider = stagedConfig.secrets?.providers?.[providerAlias];
				if (configuredProvider?.source === "file" && configuredProvider.mode === "singleValue") suggestedId = "value";
			}
			const ref = {
				source,
				provider: providerAlias,
				id: await promptRequiredText({
					message: "Secret id",
					initialValue: suggestedId,
					validate: (value) => {
						if ((source === "env" || source === "store") && !isValidEnvSecretRefId(value)) return `${source} ids must match /^[A-Z][A-Z0-9_]{0,127}$/`;
						return source === "exec" && !isValidExecSecretRefId(value) ? formatExecSecretRefIdValidationMessage() : void 0;
					}
				})
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
			}))) break;
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
