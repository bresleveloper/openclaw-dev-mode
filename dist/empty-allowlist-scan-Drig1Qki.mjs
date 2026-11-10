import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as resolveDoctorChannelAccountIds, r as getDoctorChannelCapabilities, t as hasAllowFromEntries } from "./allowlist-CX9NeGVw.mjs";
//#region src/commands/doctor/shared/empty-allowlist-policy.ts
function resolveDoctorAccountDmAccess(account, parent) {
	const dm = asNullableRecord(account.dm);
	const parentDm = asNullableRecord(parent?.dm);
	return {
		dmPolicy: account.dmPolicy ?? dm?.policy ?? parent?.dmPolicy ?? parentDm?.policy ?? void 0,
		effectiveAllowFrom: account.allowFrom ?? parent?.allowFrom ?? dm?.allowFrom ?? parentDm?.allowFrom
	};
}
/** Collect DM/group allowlist warnings for one channel or account config record. */
function collectEmptyAllowlistPolicyWarningsForAccount(params) {
	const warnings = [];
	const { dmPolicy, effectiveAllowFrom } = params;
	if (dmPolicy === "allowlist" && !hasAllowFromEntries(effectiveAllowFrom)) warnings.push(`- ${params.prefix}.dmPolicy is "allowlist" but allowFrom is empty — all DMs will be blocked. Add sender IDs to ${params.prefix}.allowFrom, or run "${params.doctorFixCommand}" to auto-migrate from pairing store when entries exist.`);
	if ((params.account.groupPolicy ?? params.parent?.groupPolicy ?? void 0) !== "allowlist" || !getDoctorChannelCapabilities(params.channelName).warnOnEmptyGroupSenderAllowlist) return warnings;
	if (params.channelName && params.shouldSkipDefaultEmptyGroupAllowlistWarning({
		account: params.account,
		channelName: params.channelName,
		dmPolicy,
		effectiveAllowFrom,
		parent: params.parent,
		prefix: params.prefix
	})) return warnings;
	const rawGroupAllowFrom = params.account.groupAllowFrom ?? params.parent?.groupAllowFrom;
	const groupAllowFrom = hasAllowFromEntries(rawGroupAllowFrom) ? rawGroupAllowFrom : void 0;
	const fallbackToAllowFrom = getDoctorChannelCapabilities(params.channelName).groupAllowFromFallbackToAllowFrom;
	if (hasAllowFromEntries(groupAllowFrom ?? (fallbackToAllowFrom ? effectiveAllowFrom : void 0))) return warnings;
	warnings.push(fallbackToAllowFrom ? `- ${params.prefix}.groupPolicy is "allowlist" but groupAllowFrom (and allowFrom) is empty — all group messages will be silently dropped. Add sender IDs to ${params.prefix}.groupAllowFrom or ${params.prefix}.allowFrom, or set groupPolicy to "open".` : `- ${params.prefix}.groupPolicy is "allowlist" but groupAllowFrom is empty — this channel does not fall back to allowFrom, so all group messages will be silently dropped. Add sender IDs to ${params.prefix}.groupAllowFrom, or set groupPolicy to "open".`);
	return warnings;
}
//#endregion
//#region src/commands/doctor/shared/empty-allowlist-scan.ts
function isActiveAccount(value) {
	return Boolean(value && typeof value === "object" && asNullableRecord(value)?.enabled !== false);
}
/** Scan all configured channels/accounts for empty allowlist policy warnings. */
async function scanEmptyAllowlistPolicyWarnings(cfg, params) {
	const channels = cfg.channels;
	if (!channels || typeof channels !== "object") return [];
	const warnings = [];
	const checkAccount = (account, prefix, channelName, parent, options = {}) => {
		const { dmPolicy, effectiveAllowFrom } = resolveDoctorAccountDmAccess(account, parent);
		const context = {
			account,
			channelName,
			dmPolicy,
			effectiveAllowFrom: effectiveAllowFrom ?? void 0,
			parent,
			prefix
		};
		warnings.push(...collectEmptyAllowlistPolicyWarningsForAccount({
			...context,
			doctorFixCommand: params.doctorFixCommand,
			shouldSkipDefaultEmptyGroupAllowlistWarning: (accountContext) => options.suppressGroupAllowlistWarning || Boolean(params.shouldSkipDefaultEmptyGroupAllowlistWarning?.(accountContext))
		}));
		warnings.push(...params.extraWarningsForAccount?.(context) ?? []);
	};
	for (const [channelName, channelConfig] of Object.entries(channels)) {
		if (!isActiveAccount(channelConfig)) continue;
		const accounts = asNullableRecord(channelConfig.accounts);
		const activeAccounts = Object.values(accounts ?? {}).filter(isActiveAccount);
		const accountIds = await resolveDoctorChannelAccountIds(channelName, cfg, Object.keys(accounts ?? {}));
		const configuredAccountIds = new Set(accountIds?.configured);
		const hasImplicitActiveAccount = accountIds === void 0 || accountIds.runtime.some((accountId) => !configuredAccountIds.has(accountId));
		const suppressParentGroupAllowlistWarning = activeAccounts.length > 0 && !hasImplicitActiveAccount && channelConfig.groupPolicy === "allowlist" && activeAccounts.every((account) => {
			const rawGroupAllowFrom = account.groupAllowFrom ?? channelConfig.groupAllowFrom;
			if (hasAllowFromEntries(rawGroupAllowFrom)) return true;
			if (!getDoctorChannelCapabilities(channelName).groupAllowFromFallbackToAllowFrom) return false;
			const { effectiveAllowFrom } = resolveDoctorAccountDmAccess(account, channelConfig);
			return hasAllowFromEntries(effectiveAllowFrom);
		});
		checkAccount(channelConfig, `channels.${channelName}`, channelName, void 0, { suppressGroupAllowlistWarning: suppressParentGroupAllowlistWarning });
		if (!accounts) continue;
		for (const [accountId, account] of Object.entries(accounts)) {
			if (!isActiveAccount(account)) continue;
			checkAccount(account, `channels.${channelName}.accounts.${accountId}`, channelName, channelConfig);
		}
	}
	return warnings;
}
//#endregion
export { scanEmptyAllowlistPolicyWarnings as t };
