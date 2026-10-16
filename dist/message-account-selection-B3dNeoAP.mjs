import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as normalizeOptionalAccountId } from "./account-id-DbRsdayc.mjs";
import { r as assertSecretOwnerAvailable } from "./runtime-degraded-state-oevwKU3u.mjs";
import { t as getChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { r as listRuntimeVisibleChannelPlugins } from "./runtime-visible-channels-NjzJcucv.mjs";
import { t as MessageActionDeniedError } from "./message-action-denial-DOmE5Ll7.mjs";
import { r as resolveOutboundChannelPlugin } from "./channel-resolution-DMBKJyb_.mjs";
import { n as resolveChannelAccount, t as channelHasConfiguredState } from "./account-resolution-DCHDXWZ0.mjs";
import { t as isAccountEnabled } from "./account-enabled-ClTLgAXM.mjs";
import { t as isConfiguredChannel } from "./channel-selection-CUk3wUGA.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-Bm4RKejp.mjs";
import { o as isChannelAccountExplicitlyDisabled } from "./account-state-BCMKW1kd.mjs";
import { o as resolveChannelAccountEnabled } from "./account-summary-BxKjshxY.mjs";
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
async function validateExplicitMessageAccountSelection(params) {
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
		const account = await resolveChannelAccount({
			plugin,
			cfg: params.cfg,
			accountId
		});
		assertSecretOwnerAvailable("account", `${plugin.id}:${accountId}`);
		if (isChannelAccountExplicitlyDisabled({
			cfg: params.cfg,
			channel: plugin.id,
			accountId: listedAccountId
		}) || !resolveChannelAccountEnabled({
			plugin,
			account,
			cfg: params.cfg
		})) throw new MessageActionDeniedError(`Account "${listedAccountId}" for channel ${channel} is disabled.`, "message_account_disabled", "message-account:enabled");
	}
	return accountId;
}
/** Checks configured and enabled state after channel availability is resolved. */
async function isPotentialConfiguredMessageChannel(params) {
	const channelConfig = params.cfg.channels?.[params.plugin.id];
	if (!Array.isArray(channelConfig) && !isAccountEnabled(channelConfig)) return false;
	if (isConfiguredChannel(params.cfg, params.plugin.id)) return true;
	try {
		return await channelHasConfiguredState({
			plugin: params.plugin,
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
async function resolveMessageBroadcastAccountPlan(params) {
	const accountId = await validateExplicitMessageAccountSelection({
		cfg: params.cfg,
		accountId: params.accountId,
		checkResolvedAccount: false
	});
	if (!accountId) return;
	const candidatePlugins = [];
	for (const plugin of listRuntimeVisibleChannelPlugins()) if (resolveOutboundChannelPlugin({
		channel: plugin.id,
		cfg: params.cfg
	}) && await isPotentialConfiguredMessageChannel({
		cfg: params.cfg,
		plugin
	})) candidatePlugins.push(plugin);
	const secretChannels = [];
	for (const plugin of candidatePlugins) try {
		await validateExplicitMessageAccountSelection({
			cfg: params.cfg,
			channel: plugin.id,
			accountId,
			plugin,
			checkResolvedAccount: false
		});
		const inspection = plugin.config.inspectAccount?.(params.cfg, accountId);
		const account = inspection ?? await resolveChannelAccount({
			plugin,
			cfg: params.cfg,
			accountId
		});
		if (account !== void 0 && (inspection != null ? isAccountEnabled(inspection) : resolveChannelAccountEnabled({
			plugin,
			account,
			cfg: params.cfg
		}))) secretChannels.push(plugin.id);
	} catch {}
	return {
		accountId,
		candidateChannels: candidatePlugins.map((plugin) => plugin.id),
		secretChannels
	};
}
//#endregion
export { resolveMessageBroadcastAccountPlan as n, validateExplicitMessageAccountSelection as r, isPotentialConfiguredMessageChannel as t };
