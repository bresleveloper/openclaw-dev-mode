import { a as asNullableRecord } from "./string-coerce-Dyy0qgLy.js";
import { l as normalizeChannelConfigEntries, x as hasLegacyAccountStreamingAliases } from "./runtime-doctor-migrations-8XPPImoy.js";
//#region extensions/zalouser/src/doctor-contract.ts
function hasLegacyZalouserGroupAllowAlias(value) {
	const group = asNullableRecord(value);
	return Boolean(group && typeof group.allow === "boolean");
}
function hasLegacyZalouserGroupAllowAliases(value) {
	const groups = asNullableRecord(value);
	return Boolean(groups && Object.values(groups).some((group) => hasLegacyZalouserGroupAllowAlias(group)));
}
function normalizeZalouserGroupAllowAliases(params) {
	let changed = false;
	const nextGroups = { ...params.groups };
	for (const [groupId, groupValue] of Object.entries(params.groups)) {
		const group = asNullableRecord(groupValue);
		if (!group || typeof group.allow !== "boolean") continue;
		const nextGroup = { ...group };
		if (typeof nextGroup.enabled !== "boolean") nextGroup.enabled = group.allow;
		delete nextGroup.allow;
		nextGroups[groupId] = nextGroup;
		changed = true;
		params.changes.push(`Moved ${params.pathPrefix}.${groupId}.allow → ${params.pathPrefix}.${groupId}.enabled (${String(nextGroup.enabled)}).`);
	}
	return {
		groups: nextGroups,
		changed
	};
}
function normalizeZalouserEntry(params) {
	const groups = asNullableRecord(params.entry.groups);
	if (!groups) return {
		entry: params.entry,
		changed: false
	};
	const normalized = normalizeZalouserGroupAllowAliases({
		groups,
		pathPrefix: `${params.pathPrefix}.groups`,
		changes: params.changes
	});
	return normalized.changed ? {
		entry: {
			...params.entry,
			groups: normalized.groups
		},
		changed: true
	} : {
		entry: params.entry,
		changed: false
	};
}
const legacyConfigRules = [{
	path: [
		"channels",
		"zalouser",
		"groups"
	],
	message: "channels.zalouser.groups.<id>.allow is legacy; use channels.zalouser.groups.<id>.enabled instead. Run \"openclaw doctor --fix\".",
	match: hasLegacyZalouserGroupAllowAliases
}, {
	path: [
		"channels",
		"zalouser",
		"accounts"
	],
	message: "channels.zalouser.accounts.<id>.groups.<id>.allow is legacy; use channels.zalouser.accounts.<id>.groups.<id>.enabled instead. Run \"openclaw doctor --fix\".",
	match: (value) => hasLegacyAccountStreamingAliases(value, (account) => hasLegacyZalouserGroupAllowAliases(asNullableRecord(account)?.groups))
}];
function normalizeCompatibilityConfig(params) {
	return normalizeChannelConfigEntries({
		cfg: params.cfg,
		channelId: "zalouser",
		normalizeEntry: normalizeZalouserEntry
	});
}
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };
