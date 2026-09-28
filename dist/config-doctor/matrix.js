import { c as isRecord } from "./string-coerce-Dyy0qgLy.js";
import { a as hasLegacyFlatAllowPrivateNetworkAlias, l as normalizeChannelConfigEntries, n as defineKeyMoveMigration, o as migrateLegacyFlatAllowPrivateNetworkAlias, s as defineChannelAliasMigration, u as stripRetiredChannelKeys, x as hasLegacyAccountStreamingAliases } from "./runtime-doctor-migrations-8XPPImoy.js";
import "./string-coerce-runtime-BSQ-eR6f.js";
//#region extensions/matrix/src/doctor-contract.ts
function parseMatrixStreamingMode(value) {
	if (typeof value !== "string") return null;
	const normalized = value.trim().toLowerCase();
	return normalized === "partial" || normalized === "quiet" || normalized === "progress" || normalized === "off" ? normalized : null;
}
const streamingAliasMigration = defineChannelAliasMigration({
	channelId: "matrix",
	streaming: {
		defaultMode: "off",
		resolveMode: (entry) => {
			const streaming = isRecord(entry.streaming) ? entry.streaming : null;
			const parsed = parseMatrixStreamingMode(streaming ? streaming.mode : entry.streaming);
			if (parsed) return parsed;
			return entry.streaming === true ? "partial" : "off";
		}
	},
	accountStreamingReplacesRoot: true
});
const roomAllowMigration = defineKeyMoveMigration({
	scope: ["*"],
	from: ["allow"],
	to: ["enabled"],
	sourceOwn: false,
	match: (value) => typeof value === "boolean",
	targetIsSet: (value) => typeof value === "boolean",
	movedMessage: ({ sourcePath, targetPath, mappedValue }) => `Moved ${sourcePath} → ${targetPath} (${String(mappedValue)}).`,
	existingMessage: ({ sourcePath, targetPath, targetValue }) => `Moved ${sourcePath} → ${targetPath} (${String(targetValue)}).`
});
function hasLegacyTrustedDmPolicy(value) {
	const root = isRecord(value) ? value : null;
	if (!root) return false;
	return (isRecord(root.dm) ? root.dm : null)?.policy === "trusted";
}
function migrateLegacyTrustedDmPolicy(params) {
	const dm = isRecord(params.entry.dm) ? params.entry.dm : null;
	if (!dm || dm.policy !== "trusted") return {
		entry: params.entry,
		changed: false
	};
	const allowFromRaw = dm.allowFrom;
	const allowFromEntries = Array.isArray(allowFromRaw) ? allowFromRaw.filter((entry) => typeof entry === "string" && entry.trim().length > 0).length : 0;
	const nextPolicy = allowFromEntries > 0 ? "allowlist" : "pairing";
	const nextDm = {
		...dm,
		policy: nextPolicy
	};
	params.changes.push(`Migrated ${params.pathPrefix}.dm.policy "trusted" → "${nextPolicy}" (legacy alias removed; ${allowFromEntries > 0 ? `preserved ${allowFromEntries} ${params.pathPrefix}.dm.allowFrom ${allowFromEntries === 1 ? "entry" : "entries"}` : "no allowFrom entries present, defaulting to pairing for safety"}).`);
	return {
		entry: {
			...params.entry,
			dm: nextDm
		},
		changed: true
	};
}
const legacyConfigRules = [
	...streamingAliasMigration.legacyConfigRules,
	{
		path: ["channels", "matrix"],
		message: "channels.matrix.allowPrivateNetwork is legacy; use channels.matrix.network.dangerouslyAllowPrivateNetwork instead. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyFlatAllowPrivateNetworkAlias(isRecord(value) ? value : {})
	},
	{
		path: [
			"channels",
			"matrix",
			"accounts"
		],
		message: "channels.matrix.accounts.<id>.allowPrivateNetwork is legacy; use channels.matrix.accounts.<id>.network.dangerouslyAllowPrivateNetwork instead. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyAccountStreamingAliases(value, (account) => hasLegacyFlatAllowPrivateNetworkAlias(isRecord(account) ? account : {}))
	},
	{
		path: [
			"channels",
			"matrix",
			"groups"
		],
		message: "channels.matrix.groups.<room>.allow is legacy; use channels.matrix.groups.<room>.enabled instead. Run \"openclaw doctor --fix\".",
		match: roomAllowMigration.hasLegacy
	},
	{
		path: [
			"channels",
			"matrix",
			"rooms"
		],
		message: "channels.matrix.rooms.<room>.allow is legacy; use channels.matrix.rooms.<room>.enabled instead. Run \"openclaw doctor --fix\".",
		match: roomAllowMigration.hasLegacy
	},
	{
		path: [
			"channels",
			"matrix",
			"accounts"
		],
		message: "channels.matrix.accounts.<id>.{groups,rooms}.<room>.allow is legacy; use channels.matrix.accounts.<id>.{groups,rooms}.<room>.enabled instead. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyAccountStreamingAliases(value, (account) => {
			if (!isRecord(account)) return false;
			return roomAllowMigration.hasLegacy(account.groups) || roomAllowMigration.hasLegacy(account.rooms);
		})
	},
	{
		path: ["channels", "matrix"],
		message: "channels.matrix.dm.policy \"trusted\" is legacy; use \"allowlist\" (with allowFrom entries) or \"pairing\" instead. Run \"openclaw doctor --fix\".",
		match: hasLegacyTrustedDmPolicy
	},
	{
		path: [
			"channels",
			"matrix",
			"accounts"
		],
		message: "channels.matrix.accounts.<id>.dm.policy \"trusted\" is legacy; use \"allowlist\" (with allowFrom entries) or \"pairing\" instead. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyAccountStreamingAliases(value, hasLegacyTrustedDmPolicy)
	}
];
function normalizeMatrixEntry(params) {
	const network = migrateLegacyFlatAllowPrivateNetworkAlias(params);
	const dmPolicy = migrateLegacyTrustedDmPolicy({
		...params,
		entry: network.entry
	});
	let entry = dmPolicy.entry;
	let changed = network.changed || dmPolicy.changed;
	for (const section of ["groups", "rooms"]) {
		const roomMap = isRecord(entry[section]) ? entry[section] : null;
		if (!roomMap) continue;
		const normalized = roomAllowMigration.normalize({
			entry: roomMap,
			pathPrefix: `${params.pathPrefix}.${section}`,
			changes: params.changes
		});
		if (normalized.changed) {
			entry = Object.assign({}, entry, { [section]: normalized.entry });
			changed = true;
		}
	}
	return {
		entry,
		changed
	};
}
function normalizeCompatibilityConfig({ cfg }) {
	const changes = [];
	const withoutJunkStreamMode = stripRetiredChannelKeys({
		cfg,
		channelId: "matrix",
		keys: /* @__PURE__ */ new Set(["streamMode"]),
		scope: "root-and-accounts",
		onRemove: ({ key, pathPrefix }) => changes.push(`Removed ${pathPrefix}.${key} (never read by the Matrix runtime).`)
	}).config;
	const aliases = streamingAliasMigration.normalizeChannelConfig({
		cfg: withoutJunkStreamMode,
		changes
	});
	return normalizeChannelConfigEntries({
		cfg: aliases.config,
		channelId: "matrix",
		changes,
		normalizeEntry: normalizeMatrixEntry
	});
}
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };
