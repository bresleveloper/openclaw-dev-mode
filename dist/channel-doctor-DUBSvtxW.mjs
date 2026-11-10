import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { u as isUnresolvedSecretInputError } from "./types.secrets-Dgbd2kyP.mjs";
import { n as findUninspectedPluginDiagnostic } from "./discovery-availability-CEoTdFoo.mjs";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-BO9Yzg8f.mjs";
import { i as getBundledChannelSetupPlugin, n as getBundledChannelPlugin } from "./bundled-CEh6W_x7.mjs";
import { n as getLoadedChannelPlugin } from "./registry-B91r5qN6.mjs";
import { t as applyPluginDoctorCompatibilitySequence } from "./doctor-compatibility-migration-B2hBndkx.mjs";
import { t as listDoctorConfiguredChannelIds } from "./configured-channel-ids-C-CNDuxu.mjs";
import { r as resolveReadOnlyChannelPluginsForConfig } from "./read-only-BTHRPuD9.mjs";
//#region src/commands/doctor/shared/channel-doctor.ts
const channelDoctorFunctionKeys = /* @__PURE__ */ new Set([
	"normalizeCompatibilityConfig",
	"collectPreviewWarnings",
	"collectMutableAllowlistWarnings",
	"repairConfig",
	"runConfigSequence",
	"cleanStaleConfig",
	"collectEmptyAllowlistExtraWarnings",
	"shouldSkipDefaultEmptyGroupAllowlistWarning"
]);
const channelDoctorBooleanKeys = /* @__PURE__ */ new Set(["groupAllowFromFallbackToAllowFrom", "warnOnEmptyGroupSenderAllowlist"]);
const channelDoctorEnumValues = {
	dmAllowFromMode: /* @__PURE__ */ new Set([
		"topOnly",
		"topOrNested",
		"nestedOnly"
	]),
	groupModel: /* @__PURE__ */ new Set([
		"sender",
		"route",
		"hybrid"
	])
};
function collectConfiguredChannelIds(cfg) {
	return listDoctorConfiguredChannelIds(cfg, {
		configEntryPolicy: "enabled",
		skipWhenPluginsDisabled: true,
		excludeExplicitlyDisabled: true,
		sort: "codepoint"
	}).filter((channelId) => !isChannelDoctorBlockedByConfig(channelId, cfg));
}
function isChannelDoctorBlockedByConfig(channelId, cfg) {
	if (cfg.plugins?.enabled === false) return true;
	const normalizedChannelId = normalizeOptionalLowercaseString(channelId) ?? channelId;
	if (cfg.plugins?.entries?.[normalizedChannelId]?.enabled === false) return true;
	return asOptionalRecord(cfg.channels?.[normalizedChannelId])?.enabled === false;
}
function safelyResolveChannelPlugin(id, resolve) {
	try {
		return resolve(id);
	} catch {
		return;
	}
}
function listReadOnlyChannelDoctorsById(context) {
	try {
		return new Map(resolveReadOnlyChannelPluginsForConfig(context.cfg, {
			...context.env ? { env: context.env } : {},
			includePersistedAuthState: false,
			includeSetupFallbackPlugins: true
		}).plugins.map(({ id, doctor }) => [id, doctor]));
	} catch {
		return /* @__PURE__ */ new Map();
	}
}
function mergeDoctorAdapters(adapters) {
	const merged = {};
	for (const adapter of adapters) {
		if (!adapter) continue;
		for (const [key, value] of Object.entries(adapter)) if (merged[key] === void 0 && isValidChannelDoctorAdapterValue(key, value)) merged[key] = value;
	}
	return Object.keys(merged).length > 0 ? merged : void 0;
}
function isValidChannelDoctorAdapterValue(key, value) {
	if (channelDoctorFunctionKeys.has(key)) return typeof value === "function";
	if (channelDoctorBooleanKeys.has(key)) return typeof value === "boolean";
	const enumValues = channelDoctorEnumValues[key];
	if (enumValues) return typeof value === "string" && enumValues.has(value);
	if (key === "legacyConfigRules") return Array.isArray(value);
	return false;
}
function listChannelDoctorEntries(context, channelIds = collectConfiguredChannelIds(context.cfg), readOnlyDoctorsById) {
	const selectedIds = new Set(channelIds.filter((id) => !isChannelDoctorBlockedByConfig(id, context.cfg)));
	if (selectedIds.size === 0) return [];
	const doctors = readOnlyDoctorsById ?? listReadOnlyChannelDoctorsById(context);
	const entries = [];
	for (const id of selectedIds) {
		const doctor = mergeDoctorAdapters([
			doctors.get(id),
			safelyResolveChannelPlugin(id, getLoadedChannelPlugin)?.doctor,
			safelyResolveChannelPlugin(id, getBundledChannelSetupPlugin)?.doctor,
			safelyResolveChannelPlugin(id, getBundledChannelPlugin)?.doctor
		]);
		if (!doctor) continue;
		entries.push({
			id,
			doctor
		});
	}
	return entries;
}
function preserveUnavailableChannelConfig(context) {
	if (!context.cfg.plugins?.load?.paths?.length) return;
	const warning = findUninspectedPluginDiagnostic(loadManifestMetadataSnapshot({
		config: context.cfg,
		env: context.env
	}).diagnostics);
	return warning ? {
		config: context.cfg,
		changes: [],
		warnings: [warning.message]
	} : void 0;
}
async function collectChannelDoctorMutations(context, mutate, channelIds) {
	const preserved = preserveUnavailableChannelConfig(context);
	if (preserved) return [preserved];
	const mutations = [];
	let nextCfg = context.cfg;
	for (const { doctor } of listChannelDoctorEntries(context, channelIds)) {
		const mutation = await mutate(doctor, nextCfg);
		if (mutation?.changes.length) {
			mutations.push(mutation);
			nextCfg = mutation.config;
		} else if (mutation?.warnings?.length) mutations.push({
			config: nextCfg,
			changes: [],
			warnings: mutation.warnings
		});
	}
	return mutations;
}
/** Build cached empty-allowlist hooks backed by channel doctor adapters. */
function createChannelDoctorEmptyAllowlistPolicyHooks(context) {
	const readOnlyDoctorsById = listReadOnlyChannelDoctorsById(context);
	const entriesByChannel = /* @__PURE__ */ new Map();
	const entriesForChannel = (channelName) => {
		const existing = entriesByChannel.get(channelName);
		if (existing) return existing;
		const entries = listChannelDoctorEntries(context, [channelName], readOnlyDoctorsById);
		entriesByChannel.set(channelName, entries);
		return entries;
	};
	return {
		extraWarningsForAccount: (params) => entriesForChannel(params.channelName).flatMap((entry) => entry.doctor.collectEmptyAllowlistExtraWarnings?.(params) ?? []),
		shouldSkipDefaultEmptyGroupAllowlistWarning: (params) => entriesForChannel(params.channelName).some((entry) => entry.doctor.shouldSkipDefaultEmptyGroupAllowlistWarning?.(params) === true)
	};
}
/** Run interactive/non-interactive channel setup repair sequences and collect notes. */
async function runChannelDoctorConfigSequences(params) {
	const preserved = preserveUnavailableChannelConfig(params);
	if (preserved) return {
		changeNotes: [],
		warningNotes: preserved.warnings ?? []
	};
	const changeNotes = [];
	const infoNotes = [];
	const warningNotes = [];
	for (const entry of listChannelDoctorEntries(params)) {
		const result = await entry.doctor.runConfigSequence?.(params);
		if (!result) continue;
		changeNotes.push(...result.changeNotes);
		infoNotes.push(...result.infoNotes ?? []);
		warningNotes.push(...result.warningNotes);
	}
	return {
		changeNotes,
		warningNotes,
		...infoNotes.length > 0 ? { infoNotes } : {}
	};
}
/** Collect compatibility migrations from configured channel doctor adapters in order. */
function collectChannelDoctorCompatibilityMutations(cfg, options = {}) {
	const preserved = preserveUnavailableChannelConfig({
		cfg,
		env: options.env
	});
	if (preserved) return [preserved];
	const mutation = applyPluginDoctorCompatibilitySequence(cfg, listChannelDoctorEntries({
		cfg,
		env: options.env
	}).map(({ id, doctor }) => ({
		pluginId: id,
		normalizeCompatibilityConfig: doctor.normalizeCompatibilityConfig?.bind(doctor)
	})));
	return mutation.changes.length || mutation.warnings?.length ? [mutation] : [];
}
/** Collect stale channel config cleanup mutations from configured channel doctor adapters. */
async function collectChannelDoctorStaleConfigMutations(cfg, options = {}) {
	return collectChannelDoctorMutations({
		cfg,
		env: options.env
	}, (doctor, nextCfg) => doctor.cleanStaleConfig?.({ cfg: nextCfg }), options.channelIds);
}
/** Collect channel-specific doctor preview warnings for configured channels. */
async function collectChannelDoctorPreviewWarnings(params) {
	const warnings = [];
	for (const entry of listChannelDoctorEntries(params)) {
		let lines;
		try {
			lines = await entry.doctor.collectPreviewWarnings?.(params);
		} catch (error) {
			if (!isUnresolvedSecretInputError(error)) throw error;
			warnings.push(`- channels.${entry.id}: configured SecretRef at ${error.path} is unavailable in doctor preview; skipping secret-backed channel preview checks.`);
			continue;
		}
		if (lines?.length) warnings.push(...lines);
	}
	return warnings;
}
/** Collect warnings for mutable channel allowlists that doctor cannot safely edit. */
async function collectChannelDoctorMutableAllowlistWarnings(params) {
	const warnings = [];
	for (const entry of listChannelDoctorEntries(params)) {
		const lines = await entry.doctor.collectMutableAllowlistWarnings?.(params);
		if (lines?.length) warnings.push(...lines);
	}
	return warnings;
}
/** Collect channel repair mutations and warning-only repair results from doctor adapters. */
async function collectChannelDoctorRepairMutations(params) {
	return collectChannelDoctorMutations(params, (doctor, nextCfg) => doctor.repairConfig?.({
		cfg: nextCfg,
		doctorFixCommand: params.doctorFixCommand,
		...params.env ? { env: params.env } : {}
	}));
}
//#endregion
export { collectChannelDoctorStaleConfigMutations as a, collectChannelDoctorRepairMutations as i, collectChannelDoctorMutableAllowlistWarnings as n, createChannelDoctorEmptyAllowlistPolicyHooks as o, collectChannelDoctorPreviewWarnings as r, runChannelDoctorConfigSequences as s, collectChannelDoctorCompatibilityMutations as t };
