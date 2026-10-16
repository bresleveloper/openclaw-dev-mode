import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as isTruthyEnvValue } from "./env-BBJTTIuE.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as normalizeAccountId, r as normalizeOptionalAccountId } from "./account-id-DbRsdayc.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./runtime-env-BjPzo7IN.mjs";
import { t as createAccountActionGate } from "./account-action-gate-Dn1I-Ez4.mjs";
import { t as resolveAccountWithDefaultFallback } from "./account-core-BE1fOhGS.mjs";
import { n as formatSetExplicitDefaultInstruction } from "./default-account-warnings-CK3UKJwX.mjs";
import "./routing-CEr1aXk1.mjs";
import { a as mergeTelegramAccountConfig, i as resolveDefaultTelegramAccountSelection, n as listTelegramAccountIds$1, o as resolveTelegramAccountConfig } from "./account-selection-DV4XVSJR.mjs";
import { t as resolveTelegramToken } from "./token-BRhOkLLB.mjs";
import util from "node:util";
//#region extensions/telegram/src/accounts.ts
const log = createSubsystemLogger("telegram/accounts");
const debugAccounts = (operation, details) => {
	if (isTruthyEnvValue(process.env.OPENCLAW_DEBUG_TELEGRAM_ACCOUNTS)) log.warn(`${operation} ${util.inspect(details, {
		colors: false,
		depth: null,
		compact: true,
		breakLength: Infinity
	})}`);
};
function listTelegramAccountIds(cfg) {
	const ids = listTelegramAccountIds$1(cfg);
	debugAccounts("listTelegramAccountIds", ids);
	return ids;
}
let emittedMissingDefaultWarn = false;
function resolveDefaultTelegramAccountId(cfg) {
	const selection = resolveDefaultTelegramAccountSelection(cfg);
	if (selection.shouldWarnMissingDefault && !emittedMissingDefaultWarn) {
		emittedMissingDefaultWarn = true;
		log.warn(`channels.telegram: accounts.default is missing; falling back to "${selection.accountId}". ${formatSetExplicitDefaultInstruction("telegram")} to avoid routing surprises in multi-account setups.`);
	}
	return selection.accountId;
}
function createTelegramActionGate(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultTelegramAccountId(params.cfg));
	return createAccountActionGate({
		baseActions: params.cfg.channels?.telegram?.actions,
		accountActions: resolveTelegramAccountConfig(params.cfg, accountId)?.actions
	});
}
function resolveTelegramMediaRuntimeOptions(params) {
	const normalizedAccountId = normalizeOptionalAccountId(params.accountId);
	const accountCfg = normalizedAccountId ? mergeTelegramAccountConfig(params.cfg, normalizedAccountId) : params.cfg.channels?.telegram;
	return {
		token: params.token,
		transport: params.transport,
		apiRoot: accountCfg?.apiRoot,
		trustedLocalFileRoots: accountCfg?.trustedLocalFileRoots,
		dangerouslyAllowPrivateNetwork: accountCfg?.network?.dangerouslyAllowPrivateNetwork
	};
}
function resolveTelegramPollActionGateState(isActionEnabled) {
	const sendMessageEnabled = isActionEnabled("sendMessage");
	const pollEnabled = isActionEnabled("poll");
	return {
		sendMessageEnabled,
		pollEnabled,
		enabled: sendMessageEnabled && pollEnabled
	};
}
function resolveTelegramAccount(params) {
	const baseEnabled = params.cfg.channels?.telegram?.enabled !== false;
	const resolve = (accountId) => {
		const merged = mergeTelegramAccountConfig(params.cfg, accountId);
		const accountEnabled = merged.enabled !== false;
		const enabled = baseEnabled && accountEnabled;
		const tokenResolution = resolveTelegramToken(params.cfg, { accountId });
		debugAccounts("resolve", {
			accountId,
			enabled,
			tokenSource: tokenResolution.source
		});
		return {
			accountId,
			enabled,
			name: normalizeOptionalString(merged.name),
			token: tokenResolution.token,
			tokenSource: tokenResolution.source,
			tokenStatus: tokenResolution.credentialDiagnostics?.length ? "configured_unavailable" : tokenResolution.token ? "available" : "missing",
			...tokenResolution.credentialDiagnostics ? { credentialDiagnostics: tokenResolution.credentialDiagnostics } : {},
			config: merged
		};
	};
	const resolvedAccountId = params.accountId ?? resolveDefaultTelegramAccountId(params.cfg);
	return resolveAccountWithDefaultFallback({
		accountId: resolvedAccountId,
		normalizeAccountId,
		resolvePrimary: resolve,
		hasCredential: (account) => account.tokenSource !== "none",
		resolveDefaultAccountId: () => resolveDefaultTelegramAccountId(params.cfg)
	});
}
function listEnabledTelegramAccounts(cfg) {
	if (!(cfg.channels?.telegram?.enabled !== false)) return [];
	return listTelegramAccountIds(cfg).filter((accountId) => mergeTelegramAccountConfig(cfg, accountId).enabled !== false).map((accountId) => resolveTelegramAccount({
		cfg,
		accountId
	}));
}
//#endregion
export { resolveTelegramAccount as a, resolveDefaultTelegramAccountId as i, listEnabledTelegramAccounts as n, resolveTelegramMediaRuntimeOptions as o, listTelegramAccountIds as r, resolveTelegramPollActionGateState as s, createTelegramActionGate as t };
