import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeOptionalAccountId } from "./account-id-B1bfbA5J.mjs";
import { r as assertSecretOwnerAvailable } from "./runtime-degraded-state-DVMYGogL.mjs";
import { t as getChannelPlugin } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { r as listRuntimeVisibleChannelPlugins } from "./runtime-visible-channels-CiwNdke1.mjs";
import { t as MessageActionDeniedError } from "./message-action-denial-DOmE5Ll7.mjs";
import { r as resolveOutboundChannelPlugin } from "./channel-resolution-CsLQpkZM.mjs";
import { t as isAccountEnabled } from "./account-enabled-ClTLgAXM.mjs";
import { t as isConfiguredChannel } from "./channel-selection-DF4EarV9.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-t_ym8v5h.mjs";
import { o as isChannelAccountExplicitlyDisabled } from "./account-state-CFbF5_dt.mjs";
import { o as resolveChannelAccountEnabled } from "./account-summary-BR6yNdkT.mjs";
//#region src/infra/outbound/message-account-selection.ts
function resolveListedAccountId(params) {
	const listedAccountId = params.plugin.config.listAccountIds(params.cfg).find((candidate) => normalizeOptionalAccountId(candidate) === params.accountId);
	if (listedAccountId) return listedAccountId;
	const defaultAccountId = resolveChannelDefaultAccountId({
		plugin: params.plugin,
		cfg: params.cfg
	});
	return normalizeOptionalAccountId(defaultAccountId) === params.accountId ? defaultAccountId : void 0;
}
/**
* Binds a caller-supplied message account to one listed channel account.
* Host-derived defaults and binding accounts bypass this helper by design.
*/
function validateExplicitMessageAccountSelection(params) {
	const rawAccountId = normalizeOptionalString(params.accountId);
	if (!rawAccountId) return;
	const accountId = normalizeOptionalAccountId(rawAccountId);
	if (!accountId) throw new MessageActionDeniedError(`Invalid account ID "${rawAccountId}".`, "message_account_invalid", "message-account:valid");
	const channel = normalizeOptionalString(params.channel);
	if (!channel) return accountId;
	const plugin = params.plugin ?? resolveOutboundChannelPlugin({
		channel,
		cfg: params.cfg
	}) ?? getChannelPlugin(channel);
	if (!plugin) return accountId;
	const listedAccountId = resolveListedAccountId({
		plugin,
		cfg: params.cfg,
		accountId
	});
	if (!listedAccountId) throw new MessageActionDeniedError(`Unknown account "${rawAccountId}" for channel ${channel}.`, "message_account_unknown", "message-account:known");
	if (isChannelAccountExplicitlyDisabled({
		cfg: params.cfg,
		channel: plugin.id,
		accountId: listedAccountId
	})) throw new MessageActionDeniedError(`Account "${listedAccountId}" for channel ${channel} is disabled.`, "message_account_disabled", "message-account:enabled");
	if (params.checkResolvedAccount !== false) {
		assertSecretOwnerAvailable("account", `${plugin.id}:${accountId}`);
		const account = plugin.config.resolveAccount(params.cfg, accountId);
		if (!resolveChannelAccountEnabled({
			plugin,
			account,
			cfg: params.cfg
		})) throw new MessageActionDeniedError(`Account "${listedAccountId}" for channel ${channel} is disabled.`, "message_account_disabled", "message-account:enabled");
	}
	return accountId;
}
/** Checks configured and enabled state after channel availability is resolved. */
function isPotentialConfiguredMessageChannel(params) {
	const channelConfig = params.cfg.channels?.[params.plugin.id];
	if (channelConfig && typeof channelConfig === "object" && !Array.isArray(channelConfig) && channelConfig.enabled === false) return false;
	if (isConfiguredChannel(params.cfg, params.plugin.id)) return true;
	try {
		return params.plugin.config.hasConfiguredState?.({
			cfg: params.cfg,
			env: process.env
		}) === true;
	} catch {
		return false;
	}
}
/**
* Plans an unscoped broadcast before SecretRefs are resolved. Rejected routes
* stay in candidateChannels for per-channel errors but cannot expose secrets.
* Host-derived binding/default accounts do not use this explicit-account plan.
*/
function resolveMessageBroadcastAccountPlan(params) {
	const accountId = validateExplicitMessageAccountSelection({
		cfg: params.cfg,
		accountId: params.accountId,
		checkResolvedAccount: false
	});
	if (!accountId) return;
	const candidatePlugins = listRuntimeVisibleChannelPlugins().filter((plugin) => Boolean(resolveOutboundChannelPlugin({
		channel: plugin.id,
		cfg: params.cfg
	})) && isPotentialConfiguredMessageChannel({
		cfg: params.cfg,
		plugin
	}));
	const secretChannels = candidatePlugins.flatMap((plugin) => {
		try {
			validateExplicitMessageAccountSelection({
				cfg: params.cfg,
				channel: plugin.id,
				accountId,
				plugin,
				checkResolvedAccount: false
			});
			const inspection = plugin.config.inspectAccount?.(params.cfg, accountId);
			const account = inspection ?? plugin.config.resolveAccount(params.cfg, accountId);
			return account !== void 0 && (inspection != null ? isAccountEnabled(inspection) : resolveChannelAccountEnabled({
				plugin,
				account,
				cfg: params.cfg
			})) ? [plugin.id] : [];
		} catch {
			return [];
		}
	});
	return {
		accountId,
		candidateChannels: candidatePlugins.map((plugin) => plugin.id),
		secretChannels
	};
}
//#endregion
export { resolveMessageBroadcastAccountPlan as n, validateExplicitMessageAccountSelection as r, isPotentialConfiguredMessageChannel as t };
