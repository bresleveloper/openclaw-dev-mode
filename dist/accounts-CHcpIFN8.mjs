import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { n as normalizeAccountId, r as normalizeOptionalAccountId } from "./account-id-ifCOO7_9.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./runtime-env-BMLaJD4Z.mjs";
import { t as createAccountActionGate } from "./account-action-gate-Dn1I-Ez4.mjs";
import { t as resolveAccountWithDefaultFallback } from "./account-core-DB3MSA02.mjs";
import { n as formatSetExplicitDefaultInstruction } from "./default-account-warnings-CK3UKJwX.mjs";
import "./routing-Dl7FngGa.mjs";
import { a as mergeTelegramAccountConfig, i as resolveDefaultTelegramAccountSelection, n as listTelegramAccountIds, o as resolveTelegramAccountConfig } from "./account-selection-CQ3hKgoh.mjs";
import { n as resolveTelegramToken } from "./token-CWjkP5nY.mjs";
//#region extensions/telegram/src/accounts.ts
const log = createSubsystemLogger("telegram/accounts");
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
	const accountId = params.accountId ?? resolveDefaultTelegramAccountId(params.cfg);
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
function resolveTelegramAccountFallback(params, resolvePrimary) {
	return resolveAccountWithDefaultFallback({
		accountId: params.accountId ?? resolveDefaultTelegramAccountId(params.cfg),
		normalizeAccountId,
		resolvePrimary,
		hasCredential: (account) => account.tokenSource !== "none",
		resolveDefaultAccountId: () => resolveDefaultTelegramAccountId(params.cfg)
	});
}
function resolveTelegramAccount(params) {
	const baseEnabled = params.cfg.channels?.telegram?.enabled !== false;
	const resolve = (accountId) => {
		const merged = mergeTelegramAccountConfig(params.cfg, accountId);
		const accountEnabled = merged.enabled !== false;
		const enabled = baseEnabled && accountEnabled;
		const tokenResolution = resolveTelegramToken(params.cfg, { accountId });
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
	return resolveTelegramAccountFallback(params, resolve);
}
function listEnabledTelegramAccounts(cfg) {
	if (!(cfg.channels?.telegram?.enabled !== false)) return [];
	return listTelegramAccountIds(cfg).filter((accountId) => mergeTelegramAccountConfig(cfg, accountId).enabled !== false).map((accountId) => resolveTelegramAccount({
		cfg,
		accountId
	}));
}
//#endregion
export { resolveTelegramAccountFallback as a, resolveTelegramAccount as i, listEnabledTelegramAccounts as n, resolveTelegramMediaRuntimeOptions as o, resolveDefaultTelegramAccountId as r, resolveTelegramPollActionGateState as s, createTelegramActionGate as t };
