import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord, i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { _ as normalizeUniqueTrimmedStringList, p as normalizeTrimmedStringList, s as normalizeOptionalTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { n as ENV_SECRET_REF_ID_RE } from "./ref-contract-Bfd9_-Lp.mjs";
import "./types.secrets-Dgbd2kyP.mjs";
import { i as matchRootFileOpenFailure } from "./boundary-file-read-CCth2Hwg.mjs";
import "./utils-gjJ-tD2q.mjs";
import { n as sanitizeForLog } from "./ansi-Xy3t0ZdY.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { t as normalizeModelCatalog } from "./model-catalog-normalize-XcxRiFN_.mjs";
import { c as readPluginCacheFile, i as pluginCacheLstatSync, n as parsePluginCacheJson } from "./plugin-cache-files-VxWaav6j.mjs";
import { t as normalizePluginPolicyId } from "./plugin-policy-id-1GfPFu0U.mjs";
import { n as validatePluginUiCapabilities } from "./plugin-ui-capabilities-C5nEC6Su.mjs";
import { t as validatePluginCategories } from "./src-COX2Khl5.mjs";
import { t as dedupeByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { t as PLUGIN_MANIFEST_CONTRACT_KEYS } from "./manifest-contract-keys-sP6seC0I.mjs";
import { t as normalizeManifestPlatforms } from "./manifest-platforms-DmX_Dpop.mjs";
import { t as normalizeManifestCommandAliases } from "./manifest-command-aliases-DnNdJZDN.mjs";
import { r as normalizeModelPricingProvider } from "./model-catalog-pricing-CtZwyNHR.mjs";
import { n as normalizeManifestProviderRequestProvider } from "./plugin-provider-request-policy-LXng-vNB.mjs";
import { E as isThemeId, a as THEME_BRAND_ICON_IDS, c as THEME_CRITTER_IDS, i as THEME_AVATAR_HAT_IDS, r as THEME_ARTWORK_ID_PATTERN, w as THEME_LOCAL_ID_PATTERN } from "./theme-BshtYPJX.mjs";
import { createRequire } from "node:module";
import path from "node:path";
//#region src/plugins/manifest-control-ui.ts
/** Package authoring metadata names source; the runtime manifest names only built assets. */
function controlUiSource(packageManifest) {
	const source = isRecord(packageManifest.openclaw) ? packageManifest.openclaw.controlUi : void 0;
	if (source === void 0) return;
	if (typeof source !== "string" || !source.trim()) throw new Error("package.json openclaw.controlUi must name a browser source entrypoint.");
	return source;
}
function normalizeManifestControlUi(value) {
	if (value === void 0) return ok(void 0);
	if (!isRecord(value) || Object.keys(value).some((key) => key !== "entry" && key !== "styles")) return err("controlUi must contain only entry and optional styles");
	const entry = typeof value.entry === "string" ? value.entry.replace(/^\.\//u, "") : "";
	if (entry.length > 512 || !/^dist\/(?:[\w-][\w.-]*\/)+[\w-][\w.-]*\.m?js$/u.test(entry)) return err("controlUi.entry must be a JavaScript file in a dedicated dist subdirectory");
	if (value.styles !== void 0 && (!Array.isArray(value.styles) || value.styles.length > 16)) return err("controlUi.styles must be an array of at most 16 stylesheets");
	const assetPrefix = entry.slice(0, entry.lastIndexOf("/") + 1);
	const styles = [];
	for (const rawStyle of value.styles ?? []) {
		const style = typeof rawStyle === "string" ? rawStyle.replace(/^\.\//u, "") : "";
		if (style.length > 512 || !style.startsWith(assetPrefix) || !/^(?:[\w-][\w.-]*\/)+[\w-][\w.-]*\.css$/u.test(style)) return err("controlUi.styles must contain CSS files under the entry's asset directory");
		if (!styles.includes(style)) styles.push(style);
	}
	return ok({
		entry,
		...styles.length > 0 ? { styles } : {}
	});
}
//#endregion
//#region src/cli/program/command-descriptor-utils.ts
const SAFE_COMMAND_NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
/** Normalize and validate a command descriptor name for safe Commander registration. */
function normalizeCommandDescriptorName(name) {
	const normalized = name.trim();
	return SAFE_COMMAND_NAME_PATTERN.test(normalized) ? normalized : null;
}
function assertSafeCommandDescriptorName(name) {
	const normalized = normalizeCommandDescriptorName(name);
	if (!normalized) throw new Error(`Invalid CLI command name: ${JSON.stringify(name.trim())}`);
	return normalized;
}
/** Strip unsafe terminal content from descriptor descriptions. */
function sanitizeCommandDescriptorDescription(description) {
	return sanitizeForLog(description).trim();
}
/** Merge descriptor groups while keeping the first descriptor for each command name. */
function collectUniqueCommandDescriptors(descriptorGroups) {
	return dedupeByKey(descriptorGroups.flat(), (descriptor) => descriptor.name);
}
/** Add safe placeholder commands to Commander without duplicating existing command names. */
function addCommandDescriptorsToProgram(program, descriptors, existingCommands = /* @__PURE__ */ new Set()) {
	for (const descriptor of descriptors) {
		const name = assertSafeCommandDescriptorName(descriptor.name);
		if (existingCommands.has(name)) continue;
		program.command(name, { hidden: descriptor.hidden }).description(sanitizeCommandDescriptorDescription(descriptor.description));
		existingCommands.add(name);
	}
	return existingCommands;
}
//#endregion
//#region src/plugins/manifest-capability-normalizers.ts
function normalizeDecisionCapabilities(value) {
	if (!isRecord(value) || !Array.isArray(value.questionTypes) || value.questionTypes.length === 0 || value.questionTypes.length > 3 || !value.questionTypes.every((kind) => kind === "boolean" || kind === "choice" || kind === "score")) return;
	const capabilities = { questionTypes: [...new Set(value.questionTypes)] };
	for (const key of [
		"maxQuestions",
		"maxChoiceAlternatives",
		"maxScoreLevels",
		"maxInputTokens"
	]) {
		const limit = value[key];
		if (typeof limit === "number" && Number.isSafeInteger(limit) && limit > 0) capabilities[key] = limit;
	}
	if (value.inputTokenScope === "encoded-question" || value.inputTokenScope === "state-plus-each-criterion") capabilities.inputTokenScope = value.inputTokenScope;
	if (typeof value.requiresBooleanCriteria === "boolean") capabilities.requiresBooleanCriteria = value.requiresBooleanCriteria;
	if (value.confidence === "provider-specific" || value.confidence === "none") capabilities.confidence = value.confidence;
	return capabilities;
}
/** Normalize provider-owned model descriptors without importing provider code. */
function normalizeManifestDecisionModels(value, providers) {
	const seen = /* @__PURE__ */ new Set();
	return normalizeManifestObjectList(value, (entry) => {
		const provider = normalizeOptionalString(entry.provider);
		const id = normalizeOptionalString(entry.id);
		const name = normalizeOptionalString(entry.name);
		if (!provider || !id || !name || !providers?.includes(provider)) return;
		const ref = `${provider}/${id}`;
		if (seen.has(ref)) return;
		const capabilities = normalizeDecisionCapabilities(entry.capabilities);
		seen.add(ref);
		return {
			provider,
			id,
			name,
			...capabilities ? { capabilities } : {}
		};
	});
}
/** Endpoint restrictions constrain a provider alias without changing stored credential identity. */
function normalizeManifestProviderAuthAliases(value) {
	return normalizeManifestRecord(value, (entry) => {
		if (typeof entry === "string") return normalizeOptionalString(entry);
		if (isRecord(entry)) {
			const provider = normalizeOptionalString(entry.provider);
			const baseUrls = normalizeTrimmedStringList(entry.baseUrls);
			if (provider && baseUrls.length > 0) return {
				provider,
				baseUrls
			};
		}
	});
}
function isPluginToolProfile(profile) {
	return profile === "minimal" || profile === "coding" || profile === "messaging" || profile === "full";
}
function normalizeStringListRecord(value) {
	return normalizeManifestRecord(value, normalizeOptionalTrimmedStringList);
}
function normalizeManifestStringRecord(value) {
	return normalizeManifestRecord(value, normalizeOptionalString);
}
function normalizeManifestMcpServers(value) {
	return normalizeNamedMetadataRecord(value, (server) => ({ ...server }));
}
function normalizeManifestRecord(value, normalizeEntry) {
	if (!isRecord(value)) return;
	const normalized = Object.create(null);
	for (const [rawId, rawEntry] of Object.entries(value)) {
		const id = normalizeOptionalString(rawId) ?? "";
		const entry = !id || isBlockedObjectKey(id) ? void 0 : normalizeEntry(rawEntry, id);
		if (entry) normalized[id] = entry;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeNamedMetadataRecord(value, normalizeEntry) {
	return normalizeManifestRecord(value, (entry, id) => isRecord(entry) ? normalizeEntry(entry, id) : void 0);
}
function normalizeManifestObjectList(value, normalizeEntry) {
	if (!Array.isArray(value)) return;
	const normalized = [];
	for (const entry of value) {
		const result = isRecord(entry) ? normalizeEntry(entry) : void 0;
		if (result !== void 0) normalized.push(result);
	}
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeManifestTranscriptSources(value, ownedProviders = []) {
	const locatorKeys = [
		"accountId",
		"guildId",
		"channelId",
		"meetingUrl"
	];
	return normalizeNamedMetadataRecord(value, (entry, id) => {
		if (!ownedProviders.includes(id)) return;
		const name = normalizeOptionalString(entry.name);
		const raw = entry.autoStart;
		const autoStart = isRecord(raw) && Object.entries(raw).every(([key, mode]) => locatorKeys.some((locator) => locator === key) && (mode === "optional" || mode === "required")) ? Object.fromEntries(Object.entries(raw)) : void 0;
		return name || autoStart ? {
			...name ? { name } : {},
			...autoStart ? { autoStart } : {}
		} : void 0;
	});
}
function isMediaUnderstandingCapability(value) {
	return value === "image" || value === "audio" || value === "video";
}
function normalizeMediaUnderstandingRecord(value, normalizeValue) {
	if (!isRecord(value)) return;
	const normalized = {};
	for (const [rawKey, rawValue] of Object.entries(value)) {
		if (!isMediaUnderstandingCapability(rawKey)) continue;
		const entry = normalizeValue(rawValue);
		if (entry !== void 0) normalized[rawKey] = entry;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeMediaUnderstandingCapabilities(value) {
	const values = normalizeTrimmedStringList(value).filter(isMediaUnderstandingCapability);
	return values.length > 0 ? values : void 0;
}
function normalizeMediaUnderstandingNativeDocumentInputs(value) {
	const values = normalizeTrimmedStringList(value).filter((entry) => entry === "pdf");
	return values.length > 0 ? values : void 0;
}
function normalizeMediaUnderstandingDocumentModels(value) {
	if (!isRecord(value)) return;
	const pdfRaw = value.pdf;
	if (!isRecord(pdfRaw)) return;
	const pdf = optionalManifestFields({
		textExtraction: normalizeOptionalString(pdfRaw.textExtraction),
		image: pdfRaw.image === false ? false : normalizeOptionalString(pdfRaw.image)
	});
	return pdf ? { pdf } : void 0;
}
function normalizeMediaUnderstandingProviderMetadata(value) {
	return normalizeNamedMetadataRecord(value, (rawMetadata) => optionalManifestFields({
		capabilities: normalizeMediaUnderstandingCapabilities(rawMetadata.capabilities),
		defaultModels: normalizeMediaUnderstandingRecord(rawMetadata.defaultModels, normalizeOptionalString),
		autoPriority: normalizeMediaUnderstandingRecord(rawMetadata.autoPriority, (priority) => typeof priority === "number" && Number.isFinite(priority) ? priority : void 0),
		nativeDocumentInputs: normalizeMediaUnderstandingNativeDocumentInputs(rawMetadata.nativeDocumentInputs),
		documentModels: normalizeMediaUnderstandingDocumentModels(rawMetadata.documentModels)
	}));
}
function normalizeProviderBaseUrlGuard(value) {
	if (!isRecord(value)) return;
	const provider = normalizeOptionalString(value.provider);
	const allowedBaseUrls = normalizeTrimmedStringList(value.allowedBaseUrls);
	if (!provider || allowedBaseUrls.length === 0) return;
	const defaultBaseUrl = normalizeOptionalString(value.defaultBaseUrl);
	return {
		provider,
		...defaultBaseUrl ? { defaultBaseUrl } : {},
		allowedBaseUrls
	};
}
function normalizeCapabilityProviderAuthSignals(value) {
	return normalizeManifestObjectList(value, (rawSignal) => {
		const provider = normalizeOptionalString(rawSignal.provider);
		if (!provider) return;
		return omitUndefinedManifestFields({
			provider,
			providerBaseUrl: normalizeProviderBaseUrlGuard(rawSignal.providerBaseUrl)
		});
	});
}
function normalizeCapabilityProviderModeConfigSignal(value) {
	if (!isRecord(value)) return;
	return optionalManifestFields({
		path: normalizeOptionalString(value.path),
		default: normalizeOptionalString(value.default),
		allowed: normalizeOptionalTrimmedStringList(value.allowed),
		disallowed: normalizeOptionalTrimmedStringList(value.disallowed)
	});
}
function normalizeCapabilityProviderConfigSignals(value) {
	return normalizeManifestObjectList(value, (rawSignal) => {
		const rootPath = normalizeOptionalString(rawSignal.rootPath);
		if (!rootPath) return;
		const required = normalizeOptionalTrimmedStringList(rawSignal.required);
		const requiredAny = normalizeOptionalTrimmedStringList(rawSignal.requiredAny);
		const mode = normalizeCapabilityProviderModeConfigSignal(rawSignal.mode);
		return required || requiredAny || mode ? omitUndefinedManifestFields({
			rootPath,
			overlayPath: normalizeOptionalString(rawSignal.overlayPath),
			overlayMapPath: normalizeOptionalString(rawSignal.overlayMapPath),
			required,
			requiredAny,
			mode
		}) : void 0;
	});
}
function normalizeCapabilityProviderMetadataEntry(rawMetadata) {
	return optionalManifestFields({
		aliases: normalizeOptionalTrimmedStringList(rawMetadata.aliases),
		authProviders: normalizeOptionalTrimmedStringList(rawMetadata.authProviders),
		authSignals: normalizeCapabilityProviderAuthSignals(rawMetadata.authSignals),
		configSignals: normalizeCapabilityProviderConfigSignals(rawMetadata.configSignals),
		referenceAudioInputs: rawMetadata.referenceAudioInputs === true ? true : void 0
	});
}
function normalizeCapabilityProviderMetadata(value) {
	return normalizeNamedMetadataRecord(value, normalizeCapabilityProviderMetadataEntry);
}
function normalizePluginToolMetadata(value) {
	return normalizeNamedMetadataRecord(value, (rawMetadata) => {
		const providerMetadata = normalizeCapabilityProviderMetadataEntry(rawMetadata);
		const profiles = normalizeTrimmedStringList(rawMetadata.profiles).filter(isPluginToolProfile);
		const metadata = {
			...providerMetadata,
			...rawMetadata.optional === true ? { optional: true } : {},
			...profiles.length > 0 ? { profiles } : {},
			...rawMetadata.replaySafe === true ? { replaySafe: true } : {},
			...rawMetadata.sideEffecting === true ? { sideEffecting: true } : {}
		};
		return Object.keys(metadata).length > 0 ? metadata : void 0;
	});
}
function normalizeManifestCatalog(value) {
	if (!isRecord(value)) return;
	return optionalManifestFields({
		featured: typeof value.featured === "boolean" ? value.featured : void 0,
		order: typeof value.order === "number" && Number.isFinite(value.order) ? value.order : void 0
	});
}
function normalizeManifestContracts(value) {
	if (!isRecord(value)) return;
	const contracts = {};
	for (const key of PLUGIN_MANIFEST_CONTRACT_KEYS) {
		const entries = normalizeTrimmedStringList(value[key]);
		if (entries.length > 0) contracts[key] = entries;
	}
	return Object.keys(contracts).length > 0 ? contracts : void 0;
}
function isManifestConfigLiteral(value) {
	return value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}
function normalizeManifestDangerousConfigFlags(value) {
	return normalizeManifestObjectList(value, (entry) => {
		const pathValue = normalizeOptionalString(entry.path) ?? "";
		return pathValue && isManifestConfigLiteral(entry.equals) ? {
			path: pathValue,
			equals: entry.equals
		} : void 0;
	});
}
function normalizeManifestSecretInputPaths(value) {
	return normalizeManifestObjectList(value, (entry) => {
		const pathLocal = normalizeOptionalString(entry.path) ?? "";
		if (!pathLocal) return;
		const expected = entry.expected === "string" ? entry.expected : void 0;
		const ownerKind = entry.ownerKind === "capability" || entry.ownerKind === "route" ? entry.ownerKind : void 0;
		return {
			path: pathLocal,
			...expected ? { expected } : {},
			...ownerKind ? { ownerKind } : {}
		};
	});
}
function normalizeManifestConfigContracts(value) {
	if (!isRecord(value)) return;
	const compatibilityMigrationPaths = normalizeTrimmedStringList(value.compatibilityMigrationPaths);
	const compatibilityRuntimePaths = normalizeTrimmedStringList(value.compatibilityRuntimePaths);
	const rawSecretInputs = isRecord(value.secretInputs) ? value.secretInputs : void 0;
	const dangerousFlags = normalizeManifestDangerousConfigFlags(value.dangerousFlags);
	const secretInputPaths = rawSecretInputs ? normalizeManifestSecretInputPaths(rawSecretInputs.paths) : void 0;
	const secretInputs = secretInputPaths ? {
		...typeof rawSecretInputs?.bundledDefaultEnabled === "boolean" ? { bundledDefaultEnabled: rawSecretInputs.bundledDefaultEnabled } : {},
		paths: secretInputPaths
	} : void 0;
	const configContracts = {
		...compatibilityMigrationPaths.length > 0 ? { compatibilityMigrationPaths } : {},
		...compatibilityRuntimePaths.length > 0 ? { compatibilityRuntimePaths } : {},
		...dangerousFlags ? { dangerousFlags } : {},
		...secretInputs ? { secretInputs } : {}
	};
	return Object.keys(configContracts).length > 0 ? configContracts : void 0;
}
/** Only fresh field projections belong here; never mutate the authored manifest. */
function omitUndefinedManifestFields(fields) {
	for (const key in fields) if (fields[key] === void 0) delete fields[key];
	return fields;
}
function optionalManifestFields(fields) {
	omitUndefinedManifestFields(fields);
	return Object.keys(fields).length > 0 ? fields : void 0;
}
//#endregion
//#region src/plugins/setup-presentation-url.ts
function normalizeSetupPresentationHttpsUrl(value) {
	const normalized = normalizeOptionalString(value);
	const url = normalized ? URL.parse(normalized) : null;
	if (!url) return;
	const canonical = url.toString();
	return url.protocol === "https:" && url.hostname && !url.username && !url.password && canonical.length <= 2048 ? canonical : void 0;
}
//#endregion
//#region src/plugins/manifest-setup-normalizers.ts
function normalizeManifestActivation(value) {
	if (!isRecord(value)) return;
	const activation = {};
	if (typeof value.onStartup === "boolean") activation.onStartup = value.onStartup;
	for (const key of [
		"onProviders",
		"onAgentHarnesses",
		"onCommands",
		"onChannels",
		"onRoutes",
		"onConfigPaths"
	]) {
		const entries = normalizeTrimmedStringList(value[key]);
		if (entries.length > 0) activation[key] = entries;
	}
	const onCapabilities = normalizeTrimmedStringList(value.onCapabilities).filter((capability) => capability === "provider" || capability === "channel" || capability === "tool" || capability === "hook");
	if (onCapabilities.length > 0) activation.onCapabilities = onCapabilities;
	return Object.keys(activation).length > 0 ? activation : void 0;
}
function normalizeChannelAccountKeyPolicies(value, channels) {
	if (!isRecord(value)) return;
	const policies = Object.create(null);
	for (const channel of channels) {
		if (isBlockedObjectKey(channel) || !Object.hasOwn(value, channel)) continue;
		const entry = value[channel];
		const field = isRecord(entry) ? normalizeOptionalString(entry.canonicalAliasesRequireOwnField) : void 0;
		if (field && !isBlockedObjectKey(field)) policies[channel] = { canonicalAliasesRequireOwnField: field };
	}
	return Object.keys(policies).length ? policies : void 0;
}
function normalizeManifestCliCommands(value) {
	if (!Array.isArray(value)) return;
	const seen = /* @__PURE__ */ new Set();
	return normalizeManifestObjectList(value, (entry) => {
		if (typeof entry.name !== "string" || typeof entry.description !== "string") return;
		const name = normalizeCommandDescriptorName(entry.name);
		const description = sanitizeCommandDescriptorDescription(entry.description);
		if (!name || !description || typeof entry.hasSubcommands !== "boolean" || seen.has(name)) return;
		seen.add(name);
		return {
			name,
			description,
			hasSubcommands: entry.hasSubcommands
		};
	}) ?? [];
}
function normalizeManifestSetupProviders(value) {
	return normalizeManifestObjectList(value, (entry) => {
		const id = normalizeOptionalString(entry.id) ?? "";
		if (!id) return;
		return omitUndefinedManifestFields({
			id,
			authMethods: normalizeOptionalTrimmedStringList(entry.authMethods),
			envVars: normalizeOptionalTrimmedStringList(entry.envVars),
			authEvidence: normalizeManifestSetupProviderAuthEvidence(entry.authEvidence)
		});
	});
}
function normalizeManifestSetupProviderAuthEvidence(value) {
	return normalizeManifestObjectList(value, (entry) => {
		if (entry.type !== "local-file-with-env") return;
		const credentialMarker = normalizeOptionalString(entry.credentialMarker);
		if (!credentialMarker) return;
		const fileEnvVar = normalizeOptionalString(entry.fileEnvVar);
		const fallbackPaths = normalizeOptionalTrimmedStringList(entry.fallbackPaths);
		if (!fileEnvVar && !fallbackPaths) return;
		return omitUndefinedManifestFields({
			type: "local-file-with-env",
			fileEnvVar,
			fallbackPaths,
			requiresAnyEnv: normalizeOptionalTrimmedStringList(entry.requiresAnyEnv),
			requiresAllEnv: normalizeOptionalTrimmedStringList(entry.requiresAllEnv),
			credentialMarker,
			source: normalizeOptionalString(entry.source)
		});
	});
}
function normalizeManifestSetup(value) {
	if (!isRecord(value)) return;
	const nativeSessionCatalog = isRecord(value.nativeSessionCatalog) ? omitUndefinedManifestFields({
		label: normalizeOptionalString(value.nativeSessionCatalog.label) ?? "",
		legacyDefaultEnabled: value.nativeSessionCatalog.legacyDefaultEnabled === true ? true : void 0,
		nodeCommands: normalizeOptionalTrimmedStringList(value.nativeSessionCatalog.nodeCommands),
		description: normalizeOptionalString(value.nativeSessionCatalog.description)
	}) : void 0;
	return optionalManifestFields({
		providers: normalizeManifestSetupProviders(value.providers),
		cliBackends: normalizeOptionalTrimmedStringList(value.cliBackends),
		configMigrations: normalizeOptionalTrimmedStringList(value.configMigrations),
		nativeSessionCatalog: nativeSessionCatalog?.label ? nativeSessionCatalog : void 0,
		requiresRuntime: typeof value.requiresRuntime === "boolean" ? value.requiresRuntime : void 0
	});
}
function normalizeManifestQaRunners(value) {
	return normalizeManifestObjectList(value, (entry) => {
		const commandName = normalizeOptionalString(entry.commandName) ?? "";
		if (!commandName) return;
		return omitUndefinedManifestFields({
			commandName,
			description: normalizeOptionalString(entry.description)
		});
	});
}
function normalizeDashboardCapabilityBase(value, field, index) {
	if (!isRecord(value)) return `${field}[${index}] must be an object`;
	const id = normalizeOptionalString(value.id);
	const method = normalizeOptionalString(value.method);
	const description = normalizeOptionalString(value.description);
	if (!id || !/^[a-z0-9][a-z0-9._-]*$/u.test(id)) return `${field}[${index}].id must be a lowercase capability id`;
	if (!method) return `${field}[${index}].method must be a non-empty string`;
	if (!description) return `${field}[${index}].description must be a non-empty string`;
	return {
		id,
		method,
		description
	};
}
function normalizeManifestDashboard(value) {
	if (value === void 0) return { ok: true };
	if (!isRecord(value)) return {
		ok: false,
		error: "dashboard must be an object"
	};
	const groups = [];
	for (const field of ["dataBindings", "actionVerbs"]) {
		const entries = value[field];
		if (entries !== void 0 && !Array.isArray(entries)) return {
			ok: false,
			error: `dashboard.${field} must be an array`
		};
		groups.push({
			field,
			entries: entries ?? []
		});
	}
	const dashboard = {};
	for (const group of groups) {
		const { field } = group;
		const entries = [];
		for (const [index, entry] of group.entries.entries()) {
			const normalized = normalizeDashboardCapabilityBase(entry, `dashboard.${field}`, index);
			if (typeof normalized === "string") return {
				ok: false,
				error: normalized
			};
			const rawParamShape = field === "actionVerbs" && isRecord(entry) ? entry.paramShape : void 0;
			if (rawParamShape !== void 0 && !isRecord(rawParamShape)) return {
				ok: false,
				error: `dashboard.actionVerbs[${index}].paramShape must be a JSON Schema object`
			};
			entries.push({
				...normalized,
				...rawParamShape ? { paramShape: rawParamShape } : {}
			});
		}
		if (entries.length > 0) dashboard[field] = entries;
	}
	return Object.keys(dashboard).length > 0 ? {
		ok: true,
		dashboard
	} : { ok: true };
}
function normalizeProviderChannelLogin(value) {
	if (!isRecord(value) || Object.keys(value).some((key) => key !== "aliases")) return;
	if (value.aliases !== void 0 && (!Array.isArray(value.aliases) || value.aliases.some((alias) => typeof alias !== "string" || !alias.trim()))) return;
	const aliases = normalizeUniqueTrimmedStringList(value.aliases);
	return aliases.length > 0 ? { aliases } : {};
}
function normalizeProviderAuthChoices(value) {
	return normalizeManifestObjectList(value, (entry) => {
		const provider = normalizeOptionalString(entry.provider) ?? "";
		const method = normalizeOptionalString(entry.method) ?? "";
		const choiceId = normalizeOptionalString(entry.choiceId) ?? "";
		if (!provider || !method || !choiceId) return;
		const onboardingScopes = normalizeTrimmedStringList(entry.onboardingScopes).filter((scope) => scope === "text-inference" || scope === "image-generation" || scope === "music-generation");
		return omitUndefinedManifestFields({
			provider,
			method,
			choiceId,
			modelTarget: entry.modelTarget === "utility" ? "utility" : void 0,
			platforms: entry.platforms !== void 0 ? normalizeManifestPlatforms(entry.platforms) : void 0,
			choiceLabel: normalizeOptionalString(entry.choiceLabel),
			choiceHint: normalizeOptionalString(entry.choiceHint),
			icon: normalizeSetupPresentationHttpsUrl(entry.icon),
			website: normalizeSetupPresentationHttpsUrl(entry.website),
			docsUrl: normalizeSetupPresentationHttpsUrl(entry.docsUrl),
			assistantPriority: typeof entry.assistantPriority === "number" && Number.isFinite(entry.assistantPriority) ? entry.assistantPriority : void 0,
			assistantVisibility: entry.assistantVisibility === "manual-only" || entry.assistantVisibility === "visible" || entry.assistantVisibility === "detected-only" ? entry.assistantVisibility : void 0,
			deprecatedChoiceIds: normalizeOptionalTrimmedStringList(entry.deprecatedChoiceIds),
			groupId: normalizeOptionalString(entry.groupId),
			groupLabel: normalizeOptionalString(entry.groupLabel),
			groupHint: normalizeOptionalString(entry.groupHint),
			onboardingFeatured: entry.onboardingFeatured === true ? true : void 0,
			appGuidedDiscovery: entry.appGuidedDiscovery === true ? true : void 0,
			optionKey: normalizeOptionalString(entry.optionKey),
			cliFlag: normalizeOptionalString(entry.cliFlag),
			cliOption: normalizeOptionalString(entry.cliOption),
			cliDescription: normalizeOptionalString(entry.cliDescription),
			appGuidedSecret: entry.appGuidedSecret === true ? true : void 0,
			personalAccount: entry.personalAccount === true ? true : void 0,
			appGuidedActionLabel: normalizeOptionalString(entry.appGuidedActionLabel),
			appGuidedAuth: entry.appGuidedAuth === "oauth" || entry.appGuidedAuth === "device-code" ? entry.appGuidedAuth : void 0,
			credentialOnly: entry.credentialOnly === true ? true : void 0,
			channelLogin: normalizeProviderChannelLogin(entry.channelLogin),
			onboardingScopes: onboardingScopes.length > 0 ? onboardingScopes : void 0
		});
	});
}
function normalizeConfigUiHints(value) {
	if (!isRecord(value)) return;
	const normalized = Object.create(null);
	for (const [hintPath, rawHint] of Object.entries(value)) {
		if (!isRecord(rawHint)) continue;
		const hint = { ...rawHint };
		if ("presentation" in hint && hint.presentation !== "phone-number") delete hint.presentation;
		if ("multiline" in hint && typeof hint.multiline !== "boolean") delete hint.multiline;
		normalized[hintPath] = hint;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeChannelConfigs(value) {
	return normalizeNamedMetadataRecord(value, (rawEntry) => {
		const schema = isRecord(rawEntry.schema) ? rawEntry.schema : null;
		if (!schema) return;
		return omitUndefinedManifestFields({
			schema,
			uiHints: normalizeConfigUiHints(rawEntry.uiHints),
			runtime: isRecord(rawEntry.runtime) && typeof rawEntry.runtime.safeParse === "function" ? rawEntry.runtime : void 0,
			label: normalizeOptionalString(rawEntry.label),
			description: normalizeOptionalString(rawEntry.description),
			preferOver: normalizeOptionalTrimmedStringList(rawEntry.preferOver),
			commands: normalizeManifestChannelCommandDefaults(rawEntry.commands)
		});
	});
}
function normalizeManifestChannelCommandDefaults(value) {
	if (!isRecord(value)) return;
	const commands = {};
	for (const key of ["nativeCommandsAutoEnabled", "nativeSkillsAutoEnabled"]) if (typeof value[key] === "boolean") commands[key] = value[key];
	return Object.keys(commands).length > 0 ? commands : void 0;
}
//#endregion
//#region src/plugins/control-ui-build-manifest.ts
/** Browser builds replace only their declaration; authored capabilities remain authoritative. */
function loadPluginControlUiDeclaration(params) {
	const relativePath = "dist/openclaw.plugin.json";
	if (!pluginCacheLstatSync(path.join(params.rootDir, relativePath)) || !pluginCacheLstatSync(path.join(params.rootDir, "package.json"))) return normalizeManifestControlUi(params.controlUi);
	const packageFile = readPluginCacheFile({
		...params,
		relativePath: "package.json"
	});
	if (!packageFile.ok) return err("generated Control UI package metadata could not be safely read");
	const packageManifest = parsePluginCacheJson(packageFile);
	if (!packageManifest.ok || !isRecord(packageManifest.value)) return err("generated Control UI package metadata must be an object");
	try {
		if (!controlUiSource(packageManifest.value)) return normalizeManifestControlUi(params.controlUi);
	} catch (error) {
		return err(String(error));
	}
	const file = readPluginCacheFile({
		rootDir: params.rootDir,
		relativePath,
		rejectHardlinks: params.rejectHardlinks,
		rootRealPath: params.rootRealPath,
		maxBytes: 262144
	});
	if (!file.ok) return err("generated Control UI manifest could not be safely read");
	const parsed = parsePluginCacheJson(file);
	if (!parsed.ok || !isRecord(parsed.value) || parsed.value.controlUi === void 0) return err("generated Control UI manifest must contain controlUi");
	return normalizeManifestControlUi(parsed.value.controlUi);
}
//#endregion
//#region src/plugins/doctor-session-route-state-owner-types.ts
function coerceDoctorSessionRouteStateOwners(value) {
	if (!Array.isArray(value)) return [];
	return value.flatMap((entry) => {
		const candidate = asOptionalObjectRecord(entry);
		if (typeof candidate?.id !== "string" || typeof candidate.label !== "string") return [];
		const id = candidate.id.trim();
		const label = candidate.label.trim();
		if (!id || !label) return [];
		const owner = {
			id,
			label,
			providerIds: normalizeTrimmedStringList(candidate.providerIds),
			runtimeIds: normalizeTrimmedStringList(candidate.runtimeIds),
			cliSessionKeys: normalizeTrimmedStringList(candidate.cliSessionKeys),
			authProfilePrefixes: normalizeTrimmedStringList(candidate.authProfilePrefixes)
		};
		return [
			"providerIds",
			"runtimeIds",
			"cliSessionKeys",
			"authProfilePrefixes"
		].every((key) => candidate[key] === void 0 || owner[key].length > 0) ? [owner] : [];
	});
}
//#endregion
//#region src/plugins/manifest-config-groups.ts
/** Invalid presentation metadata leaves the plugin's complete flat settings form available. */
function normalizeConfigGroups(raw, schema) {
	if (!Array.isArray(raw) || raw.length === 0 || !isRecord(schema.properties)) return;
	const ids = /* @__PURE__ */ new Set();
	const assigned = /* @__PURE__ */ new Set();
	const groups = [];
	for (const entry of raw) {
		if (!isRecord(entry)) return;
		const id = typeof entry.id === "string" ? entry.id.trim() : "";
		const title = typeof entry.title === "string" ? entry.title.trim() : "";
		if (!id || !title || ids.has(id) || entry.order !== void 0 && !Number.isInteger(entry.order) || !Array.isArray(entry.properties) || entry.properties.length === 0) return;
		const properties = [];
		for (const property of entry.properties) {
			if (typeof property !== "string" || !property || !Object.hasOwn(schema.properties, property) || assigned.has(property)) return;
			assigned.add(property);
			properties.push(property);
		}
		ids.add(id);
		groups.push({
			id,
			title,
			...typeof entry.order === "number" ? { order: entry.order } : {},
			properties
		});
	}
	return groups;
}
//#endregion
//#region src/plugins/manifest-model-provider-normalizers.ts
const MAX_SECRET_PROVIDER_EXEC_ARGS = 128;
const MAX_SECRET_PROVIDER_EXEC_ARG_BYTES = 1024;
const MAX_SECRET_PROVIDER_EXEC_TIMEOUT_MS = 12e4;
const MAX_SECRET_PROVIDER_EXEC_OUTPUT_BYTES = 20971520;
const MAX_SECRET_PROVIDER_EXEC_PASS_ENV = 128;
const SECRET_PROVIDER_NODE_COMMAND_PLACEHOLDER = "${node}";
function normalizeManifestModelSupport(value) {
	if (!isRecord(value)) return;
	return optionalManifestFields({
		modelPrefixes: normalizeOptionalTrimmedStringList(value.modelPrefixes),
		modelPatterns: normalizeOptionalTrimmedStringList(value.modelPatterns)
	});
}
function normalizeOwnedProviderMap(value, ownedProvidersRaw, normalizePolicy) {
	if (!isRecord(value) || !isRecord(value.providers)) return;
	const ownedProviders = new Set([...ownedProvidersRaw].map((provider) => normalizeProviderId(provider)).filter(Boolean));
	const providers = {};
	for (const [rawProviderId, rawPolicy] of Object.entries(value.providers)) {
		const providerId = normalizeProviderId(rawProviderId);
		const policy = providerId && ownedProviders.has(providerId) ? normalizePolicy(rawPolicy) : null;
		if (providerId && policy) providers[providerId] = policy;
	}
	return Object.keys(providers).length > 0 ? providers : void 0;
}
function normalizeManifestModelPricing(value, params) {
	const providers = normalizeOwnedProviderMap(value, params.ownedProviders, normalizeModelPricingProvider);
	return providers ? { providers } : void 0;
}
function normalizeManifestModelIdPrefixRules(value) {
	return normalizeManifestObjectList(value, (rawRule) => {
		const modelPrefix = normalizeOptionalString(rawRule.modelPrefix);
		const prefix = normalizeOptionalString(rawRule.prefix);
		return modelPrefix && prefix ? {
			modelPrefix,
			prefix
		} : void 0;
	});
}
function normalizeManifestModelIdNormalizationProvider(value) {
	if (!isRecord(value)) return;
	const aliases = {};
	if (isRecord(value.aliases)) for (const [rawAlias, rawCanonical] of Object.entries(value.aliases)) {
		const alias = normalizeProviderId(rawAlias);
		const canonical = normalizeOptionalString(rawCanonical);
		if (alias && canonical) aliases[alias] = canonical;
	}
	return optionalManifestFields({
		aliases: Object.keys(aliases).length > 0 ? aliases : void 0,
		stripPrefixes: normalizeOptionalTrimmedStringList(value.stripPrefixes),
		prefixWhenBare: normalizeOptionalString(value.prefixWhenBare),
		prefixWhenBareAfterAliasStartsWith: normalizeManifestModelIdPrefixRules(value.prefixWhenBareAfterAliasStartsWith)
	});
}
function normalizeManifestModelIdNormalization(value, params) {
	const providers = normalizeOwnedProviderMap(value, params.ownedProviders, normalizeManifestModelIdNormalizationProvider);
	return providers ? { providers } : void 0;
}
function normalizeManifestProviderEndpoints(value) {
	return normalizeManifestObjectList(value, (rawEndpoint) => {
		const endpointClass = normalizeOptionalString(rawEndpoint.endpointClass);
		if (!endpointClass) return;
		const hosts = normalizeOptionalTrimmedStringList(rawEndpoint.hosts)?.map((host) => host.toLowerCase());
		const hostSuffixes = normalizeOptionalTrimmedStringList(rawEndpoint.hostSuffixes)?.map((host) => host.toLowerCase());
		const baseUrls = normalizeOptionalTrimmedStringList(rawEndpoint.baseUrls);
		if (!hosts && !hostSuffixes && !baseUrls) return;
		return omitUndefinedManifestFields({
			endpointClass,
			hosts,
			hostSuffixes,
			baseUrls,
			googleVertexRegion: normalizeOptionalString(rawEndpoint.googleVertexRegion),
			googleVertexRegionHostSuffix: normalizeOptionalString(rawEndpoint.googleVertexRegionHostSuffix)?.toLowerCase()
		});
	});
}
function normalizeManifestProviderRequest(value, params) {
	const providers = normalizeOwnedProviderMap(value, params.ownedProviders, normalizeManifestProviderRequestProvider);
	return providers ? { providers } : void 0;
}
function normalizeManifestPositiveInteger(value, max) {
	return typeof value === "number" && Number.isInteger(value) && value > 0 && value <= max ? value : void 0;
}
function normalizeManifestSecretProviderIntegrations(value) {
	return normalizeNamedMetadataRecord(value, (rawIntegration) => {
		const command = normalizeOptionalString(rawIntegration.command);
		if (rawIntegration.source !== "exec" || command !== SECRET_PROVIDER_NODE_COMMAND_PLACEHOLDER) return;
		const args = [];
		if (Array.isArray(rawIntegration.args)) for (const entry of rawIntegration.args) {
			if (typeof entry !== "string" || entry.length > MAX_SECRET_PROVIDER_EXEC_ARG_BYTES) continue;
			args.push(entry);
			if (args.length >= MAX_SECRET_PROVIDER_EXEC_ARGS) break;
		}
		const passEnv = normalizeTrimmedStringList(rawIntegration.passEnv).filter((entry) => ENV_SECRET_REF_ID_RE.test(entry)).slice(0, MAX_SECRET_PROVIDER_EXEC_PASS_ENV);
		return omitUndefinedManifestFields({
			providerAlias: normalizeOptionalString(rawIntegration.providerAlias),
			displayName: normalizeOptionalString(rawIntegration.displayName),
			description: normalizeOptionalString(rawIntegration.description),
			source: "exec",
			command,
			args: args.length > 0 ? args : void 0,
			timeoutMs: normalizeManifestPositiveInteger(rawIntegration.timeoutMs, MAX_SECRET_PROVIDER_EXEC_TIMEOUT_MS),
			noOutputTimeoutMs: normalizeManifestPositiveInteger(rawIntegration.noOutputTimeoutMs, MAX_SECRET_PROVIDER_EXEC_TIMEOUT_MS),
			maxOutputBytes: normalizeManifestPositiveInteger(rawIntegration.maxOutputBytes, MAX_SECRET_PROVIDER_EXEC_OUTPUT_BYTES),
			jsonOnly: typeof rawIntegration.jsonOnly === "boolean" ? rawIntegration.jsonOnly : void 0,
			env: normalizeManifestStringRecord(rawIntegration.env),
			passEnv: passEnv.length > 0 ? passEnv : void 0
		});
	});
}
//#endregion
//#region src/plugins/manifest-themes.ts
const MAX_PLUGIN_THEMES = 32;
const MAX_THEME_ARTWORK_ENTRIES = 8;
function objectProperties(value) {
	return value.type === "ObjectExpression" ? value.properties.filter((property) => property.type === "Property") : [];
}
function propertyName(property) {
	return property.key.type === "Identifier" ? property.key.name : property.key.type === "Literal" ? String(property.key.value) : "";
}
function validateArtworkDuplicates(source) {
	const { parseExpressionAt } = createRequire(import.meta.url)("acorn");
	const root = parseExpressionAt(`(${source}\n)`, 0, { ecmaVersion: "latest" });
	for (const property of objectProperties(root)) {
		if (propertyName(property) !== "themes" || property.value.type !== "ArrayExpression") continue;
		for (const theme of property.value.elements) {
			if (!theme || theme.type !== "ObjectExpression") continue;
			for (const artwork of objectProperties(theme)) {
				const kind = propertyName(artwork);
				if (kind !== "icons" && kind !== "hats" && kind !== "critters") continue;
				const ids = /* @__PURE__ */ new Set();
				for (const entry of objectProperties(artwork.value)) {
					const id = propertyName(entry);
					if (ids.has(id)) throw new Error(`themes.${kind} has duplicate artwork ID ${id}`);
					ids.add(id);
				}
			}
		}
	}
}
function normalizeArtworkEntries(value, label, catalogIds, normalize) {
	if (value === void 0) return;
	if (!isRecord(value)) throw new Error(`${label} must be a map with at most ${MAX_THEME_ARTWORK_ENTRIES} entries`);
	const entries = Object.entries(value);
	if (entries.length > MAX_THEME_ARTWORK_ENTRIES) throw new Error(`${label} must be a map with at most ${MAX_THEME_ARTWORK_ENTRIES} entries`);
	for (const [id] of entries) if (!THEME_ARTWORK_ID_PATTERN.test(id) || catalogIds.includes(id)) throw new Error(`${label}.${id} must use a safe local ID outside the built-in catalog`);
	return Object.fromEntries(entries.map(([id, entry]) => [id, normalize(entry, `${label}.${id}`)]));
}
function normalizeArtworkPath(value, label) {
	const relativePath = typeof value === "string" ? value.replace(/^\.\//, "") : "";
	if (!/^(?:[a-z0-9_-][a-z0-9._-]*\/)*[a-z0-9_-][a-z0-9._-]*\.svg$/i.test(relativePath)) throw new Error(`${label} must be an SVG file inside the plugin root`);
	return relativePath;
}
function normalizeCritter(metadata, label) {
	if (!isRecord(metadata)) throw new Error(`${label} must be an object with an SVG source`);
	const { source, title, crossMs } = metadata;
	if (Object.keys(metadata).some((key) => ![
		"source",
		"title",
		"crossMs"
	].includes(key))) throw new Error(`${label} has unsupported fields`);
	if (title !== void 0 && (typeof title !== "string" || title.length > 60 || /[\p{Cc}\p{Cf}\p{Cs}]/u.test(title))) throw new Error(`${label}.title must be at most 60 printable characters`);
	if (crossMs !== void 0 && (typeof crossMs !== "number" || !Number.isInteger(crossMs) || crossMs < 5e3 || crossMs > 9e4)) throw new Error(`${label}.crossMs must be an integer from 5000 to 90000`);
	return omitUndefinedManifestFields({
		source: normalizeArtworkPath(source, `${label}.source`),
		title,
		crossMs
	});
}
function normalizeManifestThemes(value, pluginId, manifestSource) {
	if (value === void 0) return { ok: true };
	if (!Array.isArray(value) || value.length > MAX_PLUGIN_THEMES) return {
		ok: false,
		error: `themes must be an array with at most ${MAX_PLUGIN_THEMES} entries`
	};
	if (value.length && (pluginId === "user" || !isThemeId(`${pluginId}/x`))) return {
		ok: false,
		error: "themes require a portable plugin ID outside the reserved user namespace"
	};
	const themes = [];
	const ids = /* @__PURE__ */ new Set();
	for (const [index, entry] of value.entries()) {
		if (!entry || typeof entry !== "object" || Array.isArray(entry)) return {
			ok: false,
			error: `themes[${index}] must be an object`
		};
		const { id, name, description, source, icons, hats, critters } = entry;
		if (Object.keys(entry).some((key) => ![
			"id",
			"name",
			"description",
			"source",
			"icons",
			"hats",
			"critters"
		].includes(key)) || typeof id !== "string" || !THEME_LOCAL_ID_PATTERN.test(id) || ids.has(id) || typeof name !== "string" || !name.trim() || name.trim().length > 80 || typeof description !== "string" || !description.trim() || description.trim().length > 320 || Array.from(name + description).some((char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127) || typeof source !== "string") return {
			ok: false,
			error: `themes[${index}] requires a unique safe id, name, description, and JSON source`
		};
		const relativePath = source.replace(/^\.\//, "");
		if (!/^(?:[a-z0-9_-][a-z0-9._-]*\/)*[a-z0-9_-][a-z0-9._-]*\.json$/i.test(relativePath)) return {
			ok: false,
			error: `themes[${index}].source must be a JSON file inside the plugin root`
		};
		try {
			themes.push({
				id,
				name: name.trim(),
				description: description.trim(),
				source: relativePath,
				...omitUndefinedManifestFields({
					icons: normalizeArtworkEntries(icons, `themes[${index}].icons`, THEME_BRAND_ICON_IDS, normalizeArtworkPath),
					hats: normalizeArtworkEntries(hats, `themes[${index}].hats`, THEME_AVATAR_HAT_IDS, normalizeArtworkPath),
					critters: normalizeArtworkEntries(critters, `themes[${index}].critters`, THEME_CRITTER_IDS, normalizeCritter)
				})
			});
		} catch (error) {
			return {
				ok: false,
				error: error instanceof Error ? error.message : "invalid theme artwork"
			};
		}
		ids.add(id);
	}
	if (manifestSource && themes.some((theme) => theme.icons || theme.hats || theme.critters)) try {
		validateArtworkDuplicates(manifestSource);
	} catch (error) {
		return {
			ok: false,
			error: error instanceof Error ? error.message : "invalid theme artwork"
		};
	}
	return {
		ok: true,
		themes
	};
}
//#endregion
//#region src/plugins/manifest.ts
/** Loads and normalizes OpenClaw plugin manifests, including contracts and config schemas. */
/** Canonical plugin manifest filename inside plugin roots. */
const PLUGIN_MANIFEST_FILENAME = "openclaw.plugin.json";
const MAX_PLUGIN_MANIFEST_BYTES = 262144;
const CORE_RESERVED_PLUGIN_IDS = /* @__PURE__ */ new Set(["node-mcp"]);
const VALID_PLUGIN_KINDS = /* @__PURE__ */ new Set(["memory", "context-engine"]);
function isCoreReservedPluginId(id) {
	return CORE_RESERVED_PLUGIN_IDS.has(normalizePluginPolicyId(id));
}
function parsePluginKind(raw) {
	const values = typeof raw === "string" ? [raw] : Array.isArray(raw) ? raw : [];
	const kinds = [];
	for (const value of values) {
		if (typeof value !== "string" || !VALID_PLUGIN_KINDS.has(value)) continue;
		const kind = value;
		if (!kinds.includes(kind)) kinds.push(kind);
	}
	return kinds.length === 0 ? void 0 : kinds.length === 1 ? kinds[0] : kinds;
}
function parseDoctorStateMigrationDescriptors(raw) {
	if (typeof raw === "boolean") return raw;
	if (!Array.isArray(raw)) return;
	const seen = /* @__PURE__ */ new Set();
	return raw.flatMap((value) => {
		if (!isRecord(value)) return [];
		const id = normalizeOptionalString(value.id);
		if (!id || seen.has(id)) return [];
		seen.add(id);
		return [{
			id,
			...value.doctorOnly === true ? { doctorOnly: true } : {},
			...value.phase === "after-session-repair" ? { phase: "after-session-repair" } : {}
		}];
	});
}
function parseManifestBackupResources(raw) {
	if (raw === void 0) return { ok: true };
	if (!Array.isArray(raw)) return {
		ok: false,
		error: "backupResources must be an array"
	};
	const resources = /* @__PURE__ */ new Map();
	for (const [index, entry] of raw.entries()) {
		if (!isRecord(entry) || Object.keys(entry).length !== 3 || !("disposition" in entry) || !("scope" in entry) || !("relativePath" in entry)) return {
			ok: false,
			error: `backupResources[${index}] must contain only disposition, scope, and relativePath`
		};
		const { disposition, scope, relativePath } = entry;
		if (disposition !== "include" && disposition !== "regenerable") return {
			ok: false,
			error: `backupResources[${index}].disposition is invalid`
		};
		if (scope !== "state" && scope !== "agent") return {
			ok: false,
			error: `backupResources[${index}].scope is invalid`
		};
		if (typeof relativePath !== "string" || !relativePath || relativePath.includes("\\") || relativePath.includes("\0") || path.posix.isAbsolute(relativePath) || path.win32.isAbsolute(relativePath) || /^[A-Za-z][A-Za-z\d+.-]*:/.test(relativePath) || relativePath.split("/").some((segment) => !segment || segment === "." || segment === "..")) return {
			ok: false,
			error: `backupResources[${index}].relativePath must be a strict relative POSIX path`
		};
		const resource = {
			disposition,
			scope,
			relativePath
		};
		resources.set(`${scope}\0${relativePath}\0${disposition}`, resource);
	}
	return {
		ok: true,
		resources: [...resources.entries()].toSorted(([left], [right]) => left < right ? -1 : left > right ? 1 : 0).map(([, resource]) => resource)
	};
}
function loadPluginManifest(rootDir, rejectHardlinks = true, rootRealPath) {
	const file = readPluginCacheFile({
		rootDir,
		relativePath: PLUGIN_MANIFEST_FILENAME,
		...rootRealPath !== void 0 ? { rootRealPath } : {},
		maxBytes: MAX_PLUGIN_MANIFEST_BYTES,
		rejectHardlinks
	});
	const manifestPath = file.ok ? file.path : path.join(rootDir, PLUGIN_MANIFEST_FILENAME);
	if (!file.ok) return matchRootFileOpenFailure(file.failure, {
		path: () => ({
			ok: false,
			error: `plugin manifest not found: ${manifestPath}`,
			manifestPath
		}),
		fallback: (failure) => ({
			ok: false,
			error: `unsafe plugin manifest path: ${manifestPath} (${failure.reason})`,
			manifestPath
		})
	});
	if (file.manifest) return file.manifest;
	const cacheResult = (result) => {
		return file.manifest = result;
	};
	const fail = (error) => cacheResult({
		ok: false,
		error,
		manifestPath
	});
	const parsed = parsePluginCacheJson(file, { json5: true });
	if (!parsed.ok) return fail(`failed to parse plugin manifest: ${String(parsed.error)}`);
	const raw = parsed.value;
	if (!isRecord(raw)) return fail("plugin manifest must be an object");
	const id = normalizeOptionalString(raw.id) ?? "";
	if (!id) return fail("plugin manifest requires id");
	if (isCoreReservedPluginId(id)) return fail(`plugin manifest id "${id}" is reserved by OpenClaw core`);
	const configSchema = isRecord(raw.configSchema) ? raw.configSchema : null;
	if (!configSchema) return fail("plugin manifest requires configSchema");
	const backupResources = parseManifestBackupResources(raw.backupResources);
	if (!backupResources.ok) return cacheResult({
		ok: false,
		error: `invalid plugin manifest backupResources: ${backupResources.error}`,
		manifestPath,
		diagnosticCode: "backup-resource-declaration-invalid"
	});
	const categories = validatePluginCategories(raw.categories);
	if (!categories.ok) return fail(`invalid plugin manifest categories: ${categories.error}`);
	const requiresPlugins = normalizeTrimmedStringList(raw.requiresPlugins);
	const enabledByDefaultOnPlatforms = normalizeManifestPlatforms(raw.enabledByDefaultOnPlatforms);
	const legacyPluginIds = normalizeTrimmedStringList(raw.legacyPluginIds);
	const autoEnableWhenConfiguredProviders = normalizeTrimmedStringList(raw.autoEnableWhenConfiguredProviders);
	const providers = normalizeTrimmedStringList(raw.providers);
	const channels = normalizeTrimmedStringList(raw.channels);
	const contracts = normalizeManifestContracts(raw.contracts);
	const cliBackends = normalizeTrimmedStringList(raw.cliBackends);
	const rawDoctorContract = isRecord(raw.doctorContract) ? raw.doctorContract : void 0;
	const stateMigrations = parseDoctorStateMigrationDescriptors(rawDoctorContract?.stateMigrations);
	const doctorContract = rawDoctorContract ? {
		...Object.fromEntries([
			"configRepair",
			"resolveSessionStoreAgentIds",
			"sessionRouteStateOwners"
		].flatMap((key) => typeof rawDoctorContract[key] === "boolean" ? [[key, rawDoctorContract[key]]] : [])),
		...stateMigrations !== void 0 ? { stateMigrations } : {}
	} : void 0;
	const manifestBeforeDashboard = {
		id,
		configSchema,
		..."categories" in categories ? { categories: categories.categories } : {},
		...backupResources.resources !== void 0 ? { backupResources: backupResources.resources } : {},
		...requiresPlugins.length > 0 ? { requiresPlugins } : {},
		...raw.enabledByDefault === true ? { enabledByDefault: true } : {},
		...enabledByDefaultOnPlatforms.length > 0 ? { enabledByDefaultOnPlatforms } : {},
		...legacyPluginIds.length > 0 ? { legacyPluginIds } : {},
		...autoEnableWhenConfiguredProviders.length > 0 ? { autoEnableWhenConfiguredProviders } : {},
		kind: parsePluginKind(raw.kind),
		channels,
		channelAccountKeyPolicies: normalizeChannelAccountKeyPolicies(raw.channelAccountKeyPolicies, channels),
		providers,
		...raw.managesOwnAvailability === true ? { managesOwnAvailability: true } : {},
		providerCatalogEntry: normalizeOptionalString(raw.providerCatalogEntry),
		capabilityCatalogEntry: raw.capabilityCatalogEntry === void 0 ? void 0 : normalizeOptionalString(raw.capabilityCatalogEntry) ?? "",
		modelSupport: normalizeManifestModelSupport(raw.modelSupport),
		modelCatalog: normalizeModelCatalog(raw.modelCatalog, { ownedProviders: /* @__PURE__ */ new Set([...providers, ...cliBackends]) }),
		modelPricing: normalizeManifestModelPricing(raw.modelPricing, { ownedProviders: new Set(providers) }),
		modelIdNormalization: normalizeManifestModelIdNormalization(raw.modelIdNormalization, { ownedProviders: new Set(providers) }),
		providerEndpoints: normalizeManifestProviderEndpoints(raw.providerEndpoints),
		providerRequest: normalizeManifestProviderRequest(raw.providerRequest, { ownedProviders: new Set(providers) }),
		secretProviderIntegrations: normalizeManifestSecretProviderIntegrations(raw.secretProviderIntegrations),
		cliBackends,
		syntheticAuthRefs: normalizeTrimmedStringList(raw.syntheticAuthRefs),
		nonSecretAuthMarkers: normalizeTrimmedStringList(raw.nonSecretAuthMarkers),
		commandAliases: normalizeManifestCommandAliases(raw.commandAliases),
		cliCommands: normalizeManifestCliCommands(raw.cliCommands),
		providerUsageAuthEnvVars: normalizeStringListRecord(raw.providerUsageAuthEnvVars),
		providerAuthAliases: normalizeManifestProviderAuthAliases(raw.providerAuthAliases),
		providerAuthChoices: normalizeProviderAuthChoices(raw.providerAuthChoices),
		activation: normalizeManifestActivation(raw.activation),
		setup: normalizeManifestSetup(raw.setup),
		doctorContract,
		doctorHealthChecks: raw.doctorHealthChecks === true ? true : void 0,
		sessionRouteStateOwners: raw.sessionRouteStateOwners === void 0 ? void 0 : coerceDoctorSessionRouteStateOwners(raw.sessionRouteStateOwners),
		qaRunners: normalizeManifestQaRunners(raw.qaRunners)
	};
	const dashboardResult = normalizeManifestDashboard(raw.dashboard);
	if (!dashboardResult.ok) return fail(`invalid plugin manifest dashboard: ${dashboardResult.error}`);
	const uiCapabilities = validatePluginUiCapabilities(raw.uiCapabilities);
	const controlUiResult = loadPluginControlUiDeclaration({
		rootDir,
		controlUi: raw.controlUi,
		rejectHardlinks,
		rootRealPath
	});
	if (!controlUiResult.ok) return fail(`invalid plugin manifest controlUi: ${controlUiResult.error}`);
	const themesResult = normalizeManifestThemes(raw.themes, id, file.contents.toString("utf8"));
	if (!themesResult.ok) return fail(`invalid plugin manifest themes: ${themesResult.error}`);
	return cacheResult({
		ok: true,
		...!uiCapabilities.ok ? { warnings: [`ignoring invalid plugin manifest uiCapabilities: ${uiCapabilities.error}`] } : {},
		manifest: {
			...manifestBeforeDashboard,
			dashboard: dashboardResult.dashboard,
			controlUi: controlUiResult.value,
			...uiCapabilities.ok && uiCapabilities.capabilities !== void 0 ? { uiCapabilities: uiCapabilities.capabilities } : {},
			themes: themesResult.themes,
			mcpServers: normalizeManifestMcpServers(raw.mcpServers),
			skills: normalizeTrimmedStringList(raw.skills),
			name: normalizeOptionalString(raw.name),
			description: normalizeOptionalString(raw.description),
			catalog: normalizeManifestCatalog(raw.catalog),
			version: normalizeOptionalString(raw.version),
			uiHints: normalizeConfigUiHints(raw.uiHints),
			configGroups: normalizeConfigGroups(raw.configGroups, configSchema),
			contracts,
			decisionModels: normalizeManifestDecisionModels(raw.decisionModels, contracts?.decisionProviders),
			transcriptSources: normalizeManifestTranscriptSources(raw.transcriptSources, contracts?.transcriptSourceProviders),
			mediaUnderstandingProviderMetadata: normalizeMediaUnderstandingProviderMetadata(raw.mediaUnderstandingProviderMetadata),
			imageGenerationProviderMetadata: normalizeCapabilityProviderMetadata(raw.imageGenerationProviderMetadata),
			videoGenerationProviderMetadata: normalizeCapabilityProviderMetadata(raw.videoGenerationProviderMetadata),
			musicGenerationProviderMetadata: normalizeCapabilityProviderMetadata(raw.musicGenerationProviderMetadata),
			toolMetadata: normalizePluginToolMetadata(raw.toolMetadata),
			configContracts: normalizeManifestConfigContracts(raw.configContracts),
			channelConfigs: normalizeChannelConfigs(raw.channelConfigs)
		},
		manifestPath
	});
}
//#endregion
export { controlUiSource as _, loadPluginControlUiDeclaration as a, normalizeSetupPresentationHttpsUrl as c, omitUndefinedManifestFields as d, optionalManifestFields as f, sanitizeCommandDescriptorDescription as g, normalizeCommandDescriptorName as h, coerceDoctorSessionRouteStateOwners as i, normalizeManifestCatalog as l, collectUniqueCommandDescriptors as m, isCoreReservedPluginId as n, normalizeManifestActivation as o, addCommandDescriptorsToProgram as p, loadPluginManifest as r, normalizeManifestChannelCommandDefaults as s, PLUGIN_MANIFEST_FILENAME as t, normalizeManifestObjectList as u };
