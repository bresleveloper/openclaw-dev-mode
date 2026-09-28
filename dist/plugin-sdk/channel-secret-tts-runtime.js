import { c as isRecord } from "../record-coerce-DItp3I4t.mjs";
import { t as appendConfigPathSegment } from "../dot-path-BSC76DAI.mjs";
import "../shared-BUXrUFz5.mjs";
import { t as collectTtsApiKeyAssignments } from "../runtime-config-collectors-tts-CSF9pod6.mjs";
//#region src/secrets/channel-secret-tts-runtime.ts
/** Runtime adapter for channel text-to-speech secret contracts. */
/** Collects nested provider SecretRefs from channel root and account blocks. */
function collectNestedChannelTtsAssignments(params) {
	const providerBlockKey = params.providerBlockKey ?? "tts";
	const ownerId = params.ownerId;
	const resolveOwnerId = (accountId) => typeof ownerId === "function" ? (providerId) => ownerId({
		accountId,
		providerId
	}) : ownerId ?? "tts";
	const topLevelNested = params.channel[params.nestedKey];
	const topLevelProviderBlock = isRecord(topLevelNested) && isRecord(topLevelNested[providerBlockKey]) ? topLevelNested[providerBlockKey] : void 0;
	if (topLevelProviderBlock) {
		const collectTopLevel = (accountId, active) => collectTtsApiKeyAssignments({
			tts: topLevelProviderBlock,
			pathPrefix: `channels.${params.channelKey}.${params.nestedKey}.${providerBlockKey}`,
			ownerId: resolveOwnerId(accountId),
			defaults: params.defaults,
			context: params.context,
			active,
			inactiveReason: params.topInactiveReason
		});
		if (typeof params.ownerId !== "function") collectTopLevel("default", params.topLevelActive);
		else {
			const inheritingAccounts = params.surface.hasExplicitAccounts ? params.surface.accounts.filter(({ account, enabled }) => params.topLevelActive && enabled && !Object.hasOwn(account, params.nestedKey)) : params.topLevelActive ? [{ accountId: "default" }] : [];
			if (inheritingAccounts.length === 0) collectTopLevel("default", false);
			else for (const { accountId } of inheritingAccounts) collectTopLevel(accountId, true);
		}
	}
	if (!params.surface.hasExplicitAccounts) return;
	for (const entry of params.surface.accounts) {
		const nested = entry.account[params.nestedKey];
		const providerBlock = isRecord(nested) && isRecord(nested[providerBlockKey]) ? nested[providerBlockKey] : void 0;
		if (!providerBlock) continue;
		collectTtsApiKeyAssignments({
			tts: providerBlock,
			pathPrefix: `${appendConfigPathSegment(`channels.${params.channelKey}.accounts`, entry.accountId)}.${params.nestedKey}.${providerBlockKey}`,
			ownerId: resolveOwnerId(entry.accountId),
			defaults: params.defaults,
			context: params.context,
			active: params.accountActive(entry),
			inactiveReason: typeof params.accountInactiveReason === "function" ? params.accountInactiveReason(entry) : params.accountInactiveReason
		});
	}
}
//#endregion
export { collectNestedChannelTtsAssignments };
