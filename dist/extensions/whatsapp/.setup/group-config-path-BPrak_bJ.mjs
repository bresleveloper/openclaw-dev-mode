import { DEFAULT_ACCOUNT_ID, resolveAccountKey } from "openclaw/plugin-sdk/account-resolution";
//#region extensions/whatsapp/src/group-config-path.ts
const WHATSAPP_GROUP_SCOPE_FIELDS = [
	"groupPolicy",
	"groupAllowFrom",
	"groups"
];
function normalizePathAccountId(accountId) {
	return typeof accountId === "string" ? accountId.trim() || DEFAULT_ACCOUNT_ID : DEFAULT_ACCOUNT_ID;
}
function hasConfiguredField(config, field) {
	return Boolean(config && typeof config === "object" && Object.hasOwn(config, field) && config[field] !== void 0);
}
function resolveWhatsAppGroupScopeBasePath(params, fields = WHATSAPP_GROUP_SCOPE_FIELDS) {
	const accountId = normalizePathAccountId(params.accountId);
	const whatsapp = params.cfg.channels?.whatsapp;
	const accounts = whatsapp?.accounts;
	const accountKey = resolveAccountKey(accounts, accountId);
	const defaultAccountKey = resolveAccountKey(accounts, DEFAULT_ACCOUNT_ID);
	const accountConfig = accountKey ? accounts?.[accountKey] : void 0;
	const defaultAccountConfig = defaultAccountKey ? accounts?.[defaultAccountKey] : void 0;
	const hasField = (config) => fields.some((field) => hasConfiguredField(config, field));
	if (hasField(accountConfig)) return `channels.whatsapp.accounts.${accountKey}`;
	if (accountId !== DEFAULT_ACCOUNT_ID && hasField(defaultAccountConfig)) return `channels.whatsapp.accounts.${defaultAccountKey}`;
	if (hasField(whatsapp)) return "channels.whatsapp";
}
function resolveWhatsAppConfigPath(params) {
	return `${resolveWhatsAppGroupScopeBasePath(params) ?? "channels.whatsapp"}.${params.field}`;
}
function resolveWhatsAppGroupsConfigPath(params) {
	return `${resolveWhatsAppGroupScopeBasePath(params, ["groups"]) ?? resolveWhatsAppGroupScopeBasePath(params) ?? "channels.whatsapp"}.groups`;
}
//#endregion
export { resolveWhatsAppGroupsConfigPath as n, resolveWhatsAppConfigPath as t };
