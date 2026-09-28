import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
import { asObjectRecord, hasLegacyAccountStreamingAliases, normalizeChannelConfigEntries } from "openclaw/plugin-sdk/runtime-doctor-migrations";
//#region extensions/zalouser/src/runtime.ts
const { setRuntime: setZalouserRuntime, getRuntime: getZalouserRuntime } = createPluginRuntimeStore({
	pluginId: "zalouser",
	errorMessage: "Zalouser runtime not initialized"
});
//#endregion
//#region extensions/zalouser/src/doctor-contract.ts
function hasLegacyZalouserGroupAllowAlias(value) {
	const group = asObjectRecord(value);
	return Boolean(group && typeof group.allow === "boolean");
}
function hasLegacyZalouserGroupAllowAliases(value) {
	const groups = asObjectRecord(value);
	return Boolean(groups && Object.values(groups).some((group) => hasLegacyZalouserGroupAllowAlias(group)));
}
function normalizeZalouserGroupAllowAliases(params) {
	let changed = false;
	const nextGroups = { ...params.groups };
	for (const [groupId, groupValue] of Object.entries(params.groups)) {
		const group = asObjectRecord(groupValue);
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
	const groups = asObjectRecord(params.entry.groups);
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
	match: (value) => hasLegacyAccountStreamingAliases(value, (account) => hasLegacyZalouserGroupAllowAliases(asObjectRecord(account)?.groups))
}];
function normalizeCompatibilityConfig(params) {
	return normalizeChannelConfigEntries({
		cfg: params.cfg,
		channelId: "zalouser",
		normalizeEntry: normalizeZalouserEntry
	});
}
//#endregion
export { setZalouserRuntime as i, normalizeCompatibilityConfig as n, getZalouserRuntime as r, legacyConfigRules as t };
