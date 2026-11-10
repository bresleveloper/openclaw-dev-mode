import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import "./session-key-CSDERtm3.mjs";
import "./account-id-ifCOO7_9.mjs";
import { a as resolveChannelDmAllowFrom, o as resolveChannelDmPolicy } from "./dm-access-Hz7HYgpa.mjs";
import { s as writeChannelSection } from "./config-helpers-D0Ap6vek.mjs";
import "./setup-helpers-BkS00G-w.mjs";
import { N as splitSetupEntries, O as resolveSetupAccountId, b as patchChannelConfigForAccount, t as addWildcardAllowFrom, w as promptResolvedAllowFrom } from "./setup-wizard-helpers-B7ZmEvzm.mjs";
import "./setup-credential-DKyBKT9L.mjs";
import "./clack-prompter-CALyuZTx.mjs";
//#region src/channels/plugins/setup-wizard-legacy-compat.ts
function resolveLegacyChannelConfig(cfg, channel) {
	return asNullableRecord(cfg.channels?.[channel]) ?? {};
}
function resolveLegacyChannelAccount(cfg, channel, accountId) {
	const channelConfig = resolveLegacyChannelConfig(cfg, channel);
	return asNullableRecord(asNullableRecord(channelConfig.accounts)?.[accountId]);
}
function patchLegacyChannelConfig(params) {
	if (params.accountId !== void 0 && params.accountId !== "default") return patchChannelConfigForAccount({
		...params,
		accountId: params.accountId
	});
	const channelConfig = resolveLegacyChannelConfig(params.cfg, params.channel);
	const dmConfig = asNullableRecord(channelConfig.dm) ?? {};
	return writeChannelSection(params.cfg, params.channel, {
		...channelConfig,
		...params.patch,
		dm: {
			...dmConfig,
			enabled: typeof dmConfig.enabled === "boolean" ? dmConfig.enabled : true
		}
	});
}
/** @deprecated Compatibility for plugins published before setup policy became plugin-owned. */
function createLegacyCompatChannelDmPolicy(params) {
	const configKeys = (accountId) => {
		const accountPath = accountId && accountId !== "default" ? `.accounts.${accountId}` : "";
		return {
			policyKey: `channels.${params.channel}${accountPath}.dmPolicy`,
			allowFromKey: `channels.${params.channel}${accountPath}.allowFrom`
		};
	};
	return {
		label: params.label,
		channel: params.channel,
		...configKeys(),
		resolveConfigKeys: (_cfg, accountId) => configKeys(accountId),
		getCurrent: (cfg, accountId) => {
			const channelConfig = resolveLegacyChannelConfig(cfg, params.channel);
			const accountConfig = accountId && accountId !== "default" ? resolveLegacyChannelAccount(cfg, params.channel, accountId) : void 0;
			return resolveChannelDmPolicy({
				account: accountConfig,
				parent: channelConfig,
				defaultPolicy: "pairing"
			}) ?? "pairing";
		},
		setPolicy: (cfg, policy, accountId) => {
			const namedAccountId = accountId && accountId !== "default" ? accountId : void 0;
			const allowFrom = policy === "open" ? addWildcardAllowFrom(resolveChannelDmAllowFrom({
				account: namedAccountId ? resolveLegacyChannelAccount(cfg, params.channel, namedAccountId) : void 0,
				parent: resolveLegacyChannelConfig(cfg, params.channel)
			})) : void 0;
			const patch = {
				dmPolicy: policy,
				...allowFrom ? { allowFrom } : {}
			};
			return patchLegacyChannelConfig({
				cfg,
				channel: params.channel,
				accountId: namedAccountId,
				patch
			});
		},
		...params.promptAllowFrom ? { promptAllowFrom: params.promptAllowFrom } : {}
	};
}
/** @deprecated Compatibility for plugins published before setup allowlists became plugin-owned. */
async function promptLegacyChannelAllowFromForAccount(params) {
	const accountId = resolveSetupAccountId({
		accountId: params.accountId,
		defaultAccountId: params.defaultAccountId
	});
	const account = params.resolveAccount(params.cfg, accountId);
	await params.prompter.note(params.noteLines.join("\n"), params.noteTitle);
	const allowFrom = await promptResolvedAllowFrom({
		prompter: params.prompter,
		existing: params.resolveExisting(account, params.cfg),
		token: params.resolveToken(account),
		message: params.message,
		placeholder: params.placeholder,
		label: params.noteTitle,
		parseInputs: splitSetupEntries,
		parseId: params.parseId,
		invalidWithoutTokenNote: params.invalidWithoutTokenNote,
		resolveEntries: params.resolveEntries
	});
	return patchLegacyChannelConfig({
		cfg: params.cfg,
		channel: params.channel,
		accountId,
		patch: { allowFrom }
	});
}
//#endregion
export { promptLegacyChannelAllowFromForAccount as n, createLegacyCompatChannelDmPolicy as t };
