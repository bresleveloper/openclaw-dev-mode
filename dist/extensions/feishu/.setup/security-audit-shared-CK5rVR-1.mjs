import { asOptionalRecord, hasNonEmptyString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { hasConfiguredSecretInput } from "openclaw/plugin-sdk/secret-input";
//#region extensions/feishu/src/security-audit-shared.ts
function isFeishuDocToolEnabled(cfg) {
	const channels = asOptionalRecord(cfg.channels);
	const feishu = asOptionalRecord(channels?.feishu);
	if (!feishu || feishu.enabled === false) return false;
	const baseTools = asOptionalRecord(feishu.tools);
	const baseDocEnabled = baseTools?.doc !== false;
	const baseAppId = hasNonEmptyString(feishu.appId);
	const baseAppSecret = hasConfiguredSecretInput(feishu.appSecret, cfg.secrets?.defaults);
	const baseConfigured = baseAppId && baseAppSecret;
	const accounts = asOptionalRecord(feishu.accounts);
	if (!accounts || Object.keys(accounts).length === 0) return baseDocEnabled && baseConfigured;
	for (const accountValue of Object.values(accounts)) {
		const account = asOptionalRecord(accountValue) ?? {};
		if (account.enabled === false) continue;
		if (!((asOptionalRecord(account.tools) ?? baseTools)?.doc !== false)) continue;
		if ((hasNonEmptyString(account.appId) || baseAppId) && (hasConfiguredSecretInput(account.appSecret, cfg.secrets?.defaults) || baseAppSecret)) return true;
	}
	return false;
}
function collectFeishuSecurityAuditFindings(params) {
	if (!isFeishuDocToolEnabled(params.cfg)) return [];
	return [{
		checkId: "channels.feishu.doc_owner_open_id",
		severity: "warn",
		title: "Feishu doc create can grant requester permissions",
		detail: "channels.feishu tools include \"doc\"; feishu_doc action \"create\" can grant document access to the trusted requesting Feishu user.",
		remediation: "Disable channels.feishu.tools.doc when not needed, and restrict tool access for untrusted prompts."
	}];
}
//#endregion
export { collectFeishuSecurityAuditFindings as t };
