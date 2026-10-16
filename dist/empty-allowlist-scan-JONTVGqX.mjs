import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as normalizeStringEntries } from "./string-normalization-CECOqf64.mjs";
import { n as resolveDoctorChannelAccountIds, t as getDoctorChannelCapabilities } from "./channel-capabilities-DZx0Xb3a.mjs";
import { c as shouldSkipChannelDoctorDefaultEmptyGroupAllowlistWarning } from "./channel-doctor-DEEFPokm.mjs";
//#region src/commands/doctor/shared/allowlist.ts
/** Return true when an allowFrom-like list has at least one normalized sender entry. */
function hasAllowFromEntries(list) {
	return Array.isArray(list) && normalizeStringEntries(list).length > 0;
}
//#endregion
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
	const { dmPolicy, effectiveAllowFrom } = resolveDoctorAccountDmAccess(params.account, params.parent);
	if (dmPolicy === "allowlist" && !hasAllowFromEntries(effectiveAllowFrom)) warnings.push(`- ${params.prefix}.dmPolicy is "allowlist" but allowFrom is empty — all DMs will be blocked. Add sender IDs to ${params.prefix}.allowFrom, or run "${params.doctorFixCommand}" to auto-migrate from pairing store when entries exist.`);
	if ((params.account.groupPolicy ?? params.parent?.groupPolicy ?? void 0) !== "allowlist" || !getDoctorChannelCapabilities(params.channelName).warnOnEmptyGroupSenderAllowlist) return warnings;
	if (params.channelName && (params.shouldSkipDefaultEmptyGroupAllowlistWarning ?? shouldSkipChannelDoctorDefaultEmptyGroupAllowlistWarning)({
		account: params.account,
		channelName: params.channelName,
		cfg: params.cfg,
		dmPolicy,
		effectiveAllowFrom,
		parent: params.parent,
		prefix: params.prefix
	})) return warnings;
	const rawGroupAllowFrom = params.account.groupAllowFrom ?? params.parent?.groupAllowFrom;
	const groupAllowFrom = hasAllowFromEntries(rawGroupAllowFrom) ? rawGroupAllowFrom : void 0;
	const fallbackToAllowFrom = getDoctorChannelCapabilities(params.channelName).groupAllowFromFallbackToAllowFrom;
	if (hasAllowFromEntries(groupAllowFrom ?? (fallbackToAllowFrom ? effectiveAllowFrom : void 0))) return warnings;
	if (fallbackToAllowFrom) warnings.push(`- ${params.prefix}.groupPolicy is "allowlist" but groupAllowFrom (and allowFrom) is empty — all group messages will be silently dropped. Add sender IDs to ${params.prefix}.groupAllowFrom or ${params.prefix}.allowFrom, or set groupPolicy to "open".`);
	else warnings.push(`- ${params.prefix}.groupPolicy is "allowlist" but groupAllowFrom is empty — this channel does not fall back to allowFrom, so all group messages will be silently dropped. Add sender IDs to ${params.prefix}.groupAllowFrom, or set groupPolicy to "open".`);
	return warnings;
}
//#endregion
//#region src/commands/doctor/shared/empty-allowlist-scan.ts
function isDisabledRecord(value) {
	return asNullableRecord(value)?.enabled === false;
}
/** Scan all configured channels/accounts for empty allowlist policy warnings. */
async function scanEmptyAllowlistPolicyWarnings(cfg, params) {
	const channels = cfg.channels;
	if (!channels || typeof channels !== "object") return [];
	const warnings = [];
	const checkAccount = (account, prefix, channelName, parent, options = {}) => {
		const { dmPolicy, effectiveAllowFrom } = resolveDoctorAccountDmAccess(account, parent);
		warnings.push(...collectEmptyAllowlistPolicyWarningsForAccount({
			account,
			channelName,
			cfg,
			doctorFixCommand: params.doctorFixCommand,
			parent,
			prefix,
			shouldSkipDefaultEmptyGroupAllowlistWarning: (context) => options.suppressGroupAllowlistWarning || Boolean(params.shouldSkipDefaultEmptyGroupAllowlistWarning?.(context))
		}));
		if (params.extraWarningsForAccount) warnings.push(...params.extraWarningsForAccount({
			account,
			channelName,
			dmPolicy,
			effectiveAllowFrom: effectiveAllowFrom ?? void 0,
			parent,
			prefix
		}));
	};
	for (const [channelName, channelConfig] of Object.entries(channels)) {
		if (!channelConfig || typeof channelConfig !== "object") continue;
		if (isDisabledRecord(channelConfig)) continue;
		const accounts = asNullableRecord(channelConfig.accounts);
		const activeAccounts = accounts ? Object.values(accounts).filter((account) => Boolean(account && typeof account === "object" && !isDisabledRecord(account))) : [];
		const accountIds = await resolveDoctorChannelAccountIds(channelName, cfg, Object.keys(accounts ?? {}));
		const configuredAccountIds = new Set(accountIds?.configured);
		const hasImplicitActiveAccount = accountIds === void 0 || accountIds.runtime.some((accountId) => !configuredAccountIds.has(accountId));
		const suppressParentGroupAllowlistWarning = activeAccounts.length > 0 && !hasImplicitActiveAccount && channelConfig.groupPolicy === "allowlist" && activeAccounts.every((account) => {
			if (hasAllowFromEntries(account.groupAllowFrom ?? channelConfig.groupAllowFrom)) return true;
			if (!getDoctorChannelCapabilities(channelName).groupAllowFromFallbackToAllowFrom) return false;
			const { effectiveAllowFrom } = resolveDoctorAccountDmAccess(account, channelConfig);
			return hasAllowFromEntries(effectiveAllowFrom);
		});
		checkAccount(channelConfig, `channels.${channelName}`, channelName, void 0, { suppressGroupAllowlistWarning: suppressParentGroupAllowlistWarning });
		if (!accounts) continue;
		for (const [accountId, account] of Object.entries(accounts)) {
			if (!account || typeof account !== "object") continue;
			if (isDisabledRecord(account)) continue;
			checkAccount(account, `channels.${channelName}.accounts.${accountId}`, channelName, channelConfig);
		}
	}
	return warnings;
}
//#endregion
export { hasAllowFromEntries as n, scanEmptyAllowlistPolicyWarnings as t };
