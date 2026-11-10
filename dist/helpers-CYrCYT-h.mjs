import { d as normalizeStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import "./session-key-CSDERtm3.mjs";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-ifCOO7_9.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { i as resolveChannelAccountKey } from "./account-lookup-Dm5zJglt.mjs";
//#region src/channels/plugins/helpers.ts
function resolveChannelDefaultAccountId(params) {
	return params.plugin.config.defaultAccountId?.(params.cfg) ?? (params.accountIds ?? params.plugin.config.listAccountIds(params.cfg))[0] ?? "default";
}
function formatPairingApproveHint(channelId) {
	return `Approve via: ${formatCliCommand(`openclaw pairing list ${channelId}`)} / ${formatCliCommand(`openclaw pairing approve ${channelId} <code>`)}`;
}
function parseOptionalDelimitedEntries(value) {
	if (!value?.trim()) return;
	const parsed = normalizeStringEntries(value.split(/[\n,;]+/g));
	return parsed.length > 0 ? parsed : void 0;
}
function buildAccountScopedDmSecurityPolicy(params) {
	const resolvedAccountId = params.accountId ?? params.fallbackAccountId ?? "default";
	const channelConfig = params.cfg.channels?.[params.channelKey];
	const resolveAccountKey = (accountId) => resolveChannelAccountKey(channelConfig?.accounts, accountId, params.channelKey, (id) => id);
	const accountKey = resolveAccountKey(resolvedAccountId);
	const defaultAccountKey = resolveAccountKey(DEFAULT_ACCOUNT_ID);
	const rootBasePath = `channels.${params.channelKey}.`;
	const accountBasePath = `channels.${params.channelKey}.accounts.${accountKey ?? resolvedAccountId}.`;
	const defaultBasePath = `channels.${params.channelKey}.accounts.${defaultAccountKey ?? "default"}.`;
	const accountConfig = accountKey ? channelConfig?.accounts?.[accountKey] : void 0;
	const defaultAccountConfig = params.inheritSharedDefaultsFromDefaultAccount && resolvedAccountId !== "default" ? defaultAccountKey ? channelConfig?.accounts?.[defaultAccountKey] : void 0 : void 0;
	const resolveFieldName = (suffix, fallbackField) => suffix == null || suffix === "" ? fallbackField : /^[A-Za-z0-9_-]+$/.test(suffix) ? suffix : null;
	const simplePolicyField = resolveFieldName(params.policyPathSuffix, "dmPolicy");
	const simpleAllowFromField = resolveFieldName(params.allowFromPathSuffix, "allowFrom");
	const matchesAnyField = (config) => [simplePolicyField, simpleAllowFromField].some((field) => field != null && config?.[field] !== void 0);
	const basePath = simplePolicyField || simpleAllowFromField ? matchesAnyField(accountConfig) ? accountBasePath : matchesAnyField(defaultAccountConfig) ? defaultBasePath : matchesAnyField(channelConfig) ? rootBasePath : accountConfig ? accountBasePath : rootBasePath : accountConfig ? accountBasePath : rootBasePath;
	const allowFromPath = `${basePath}${params.allowFromPathSuffix ?? ""}`;
	const policyPath = params.policyPathSuffix != null ? `${basePath}${params.policyPathSuffix}` : void 0;
	return {
		policy: params.policy ?? params.defaultPolicy ?? "pairing",
		allowFrom: params.allowFrom ?? [],
		policyPath,
		allowFromPath,
		approveHint: params.approveHint ?? formatPairingApproveHint(params.approveChannelId ?? params.channelKey),
		normalizeEntry: params.normalizeEntry,
		classifyEntryAuthentication: params.classifyEntryAuthentication
	};
}
//#endregion
export { resolveChannelDefaultAccountId as i, formatPairingApproveHint as n, parseOptionalDelimitedEntries as r, buildAccountScopedDmSecurityPolicy as t };
