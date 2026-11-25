import { n as collectWhatsAppAuthDirs, r as hasWebCredsSync } from "./.setup/creds-files-CQDqePya.mjs";
import path from "node:path";
import { resolveOAuthDir } from "openclaw/plugin-sdk/state-paths";
import { resolveUserPath } from "openclaw/plugin-sdk/account-resolution";
import { DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$1, normalizeAccountId } from "openclaw/plugin-sdk/account-id";
// extensions/whatsapp/auth-presence.ts
function addAccountAuthDirs(authDirs, accountId, authDir, accountsRoot, env) {
	authDirs.add(path.join(accountsRoot, normalizeAccountId(accountId)));
	const configuredAuthDir = authDir?.trim();
	if (configuredAuthDir) authDirs.add(resolveUserPath(configuredAuthDir, env));
}
function listWhatsAppAuthDirs(cfg, env = process.env) {
	const oauthDir = resolveOAuthDir(env);
	const accountsRoot = path.join(oauthDir, "whatsapp");
	const channel = cfg.channels?.whatsapp;
	const authDirs = /* @__PURE__ */ new Set([path.join(accountsRoot, DEFAULT_ACCOUNT_ID$1)]);
	if (channel?.defaultAccount?.trim()) addAccountAuthDirs(authDirs, channel.defaultAccount, channel.accounts?.[channel.defaultAccount]?.authDir, accountsRoot, env);
	const accounts = channel?.accounts;
	if (accounts) for (const [accountId, account] of Object.entries(accounts)) addAccountAuthDirs(authDirs, accountId, account?.authDir, accountsRoot, env);
	return collectWhatsAppAuthDirs(accountsRoot, authDirs);
}
function hasAnyWhatsAppAuth(params, env = process.env) {
	return listWhatsAppAuthDirs(params && typeof params === "object" && "cfg" in params ? params.cfg : params, params && typeof params === "object" && "cfg" in params ? params.env ?? env : env).some((authDir) => hasWebCredsSync(authDir));
}
export { hasAnyWhatsAppAuth };
