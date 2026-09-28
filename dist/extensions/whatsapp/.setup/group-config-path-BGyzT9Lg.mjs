import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-core";
//#region extensions/whatsapp/src/group-config-path.ts
const WHATSAPP_GROUP_SCOPE_FIELDS = [
	"groupPolicy",
	"groupAllowFrom",
	"groups"
];
function resolveWhatsAppAccountKey(accounts, accountId) {
	if (!accounts) return;
	if (Object.hasOwn(accounts, accountId)) return accountId;
	const normalizedAccountId = accountId.trim().toLowerCase();
	return Object.keys(accounts).find((key) => key.trim().toLowerCase() === normalizedAccountId);
}
function normalizePathAccountId(accountId) {
	return typeof accountId === "string" ? accountId.trim() || DEFAULT_ACCOUNT_ID : DEFAULT_ACCOUNT_ID;
}
function hasConfiguredField(config, field) {
	return Boolean(config && typeof config === "object" && Object.hasOwn(config, field) && config[field] !== void 0);
}
function resolveSpecificFieldBasePath(params) {
	const accountId = normalizePathAccountId(params.accountId);
	const whatsapp = params.cfg.channels?.whatsapp;
	const accounts = whatsapp?.accounts;
	const accountKey = resolveWhatsAppAccountKey(accounts, accountId);
	const defaultAccountKey = resolveWhatsAppAccountKey(accounts, DEFAULT_ACCOUNT_ID);
	const accountConfig = accountKey ? accounts?.[accountKey] : void 0;
	const defaultAccountConfig = defaultAccountKey ? accounts?.[defaultAccountKey] : void 0;
	if (hasConfiguredField(accountConfig, params.field)) return `channels.whatsapp.accounts.${accountKey}`;
	if (accountId !== DEFAULT_ACCOUNT_ID && hasConfiguredField(defaultAccountConfig, params.field)) return `channels.whatsapp.accounts.${defaultAccountKey}`;
	if (hasConfiguredField(whatsapp, params.field)) return "channels.whatsapp";
}
function resolveWhatsAppGroupScopeBasePath(params) {
	const accountId = normalizePathAccountId(params.accountId);
	const accounts = (params.cfg.channels?.whatsapp)?.accounts;
	const accountKey = resolveWhatsAppAccountKey(accounts, accountId);
	const defaultAccountKey = resolveWhatsAppAccountKey(accounts, DEFAULT_ACCOUNT_ID);
	const accountConfig = accountKey ? accounts?.[accountKey] : void 0;
	const defaultAccountConfig = defaultAccountKey ? accounts?.[defaultAccountKey] : void 0;
	const matchesAnyGroupScopeField = (config) => WHATSAPP_GROUP_SCOPE_FIELDS.some((field) => hasConfiguredField(config, field));
	if (matchesAnyGroupScopeField(accountConfig)) return `channels.whatsapp.accounts.${accountKey}`;
	if (accountId !== DEFAULT_ACCOUNT_ID && matchesAnyGroupScopeField(defaultAccountConfig)) return `channels.whatsapp.accounts.${defaultAccountKey}`;
	return "channels.whatsapp";
}
function resolveWhatsAppConfigPath(params) {
	return `${resolveWhatsAppGroupScopeBasePath(params)}.${params.field}`;
}
function resolveWhatsAppGroupsConfigPath(params) {
	return `${resolveSpecificFieldBasePath({
		...params,
		field: "groups"
	}) ?? resolveWhatsAppGroupScopeBasePath(params)}.groups`;
}
//#endregion
export { resolveWhatsAppGroupsConfigPath as n, resolveWhatsAppConfigPath as t };
