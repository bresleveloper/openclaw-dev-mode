import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { t as resolveLegacyOutboundSendDepKeys } from "./send-deps-DjbvQHZ4.mjs";
//#region src/cli/outbound-send-mapping.ts
function normalizeLegacyChannelStem(raw) {
	return normalizeLowercaseStringOrEmpty(raw.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/_/g, "-").trim()).replace(/-/g, "");
}
function resolveChannelIdFromLegacySourceKey(key) {
	const match = key.match(/^sendMessage(.+)$/);
	if (!match) return;
	return normalizeLegacyChannelStem(match[1] ?? "") || void 0;
}
/**
* Pass CLI send sources through as-is — both CliOutboundSendSource and
* OutboundSendDeps are now channel-ID-keyed records.
*/
function createOutboundSendDepsFromCliSource(deps) {
	const outbound = { ...deps };
	for (const legacySourceKey of Object.keys(deps)) {
		const channelId = resolveChannelIdFromLegacySourceKey(legacySourceKey);
		if (!channelId) continue;
		const sourceValue = deps[legacySourceKey];
		if (sourceValue !== void 0 && outbound[channelId] === void 0) outbound[channelId] = sourceValue;
	}
	for (const channelId of Object.keys(outbound)) {
		const sourceValue = outbound[channelId];
		if (sourceValue === void 0) continue;
		for (const legacyDepKey of resolveLegacyOutboundSendDepKeys(channelId)) if (outbound[legacyDepKey] === void 0) outbound[legacyDepKey] = sourceValue;
	}
	return outbound;
}
//#endregion
//#region src/cli/outbound-send-deps.ts
/** Convert the broad CLI dependency bundle into the narrow outbound-send dependency shape. */
function createOutboundSendDeps(deps) {
	return createOutboundSendDepsFromCliSource(deps);
}
//#endregion
export { createOutboundSendDeps as t };
