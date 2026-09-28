import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import "./session-key-CBvmC8zz.mjs";
import "./account-id-B1bfbA5J.mjs";
import { a as resolveChannelDmAllowFrom, o as resolveChannelDmPolicy } from "./dm-access-BjWg2ea5.mjs";
import "./setup-helpers-gXEiNGC9.mjs";
import { N as splitSetupEntries, O as resolveSetupAccountId, b as patchChannelConfigForAccount, t as addWildcardAllowFrom, w as promptResolvedAllowFrom } from "./setup-wizard-helpers-DT-haSuo.mjs";
import "./setup-credential-C6qxR6mM.mjs";
import "./clack-prompter-D8DhCvTT.mjs";
//#region src/channels/plugins/setup-wizard-legacy-compat.ts
function resolveLegacyChannelConfig(cfg, channel) {
	return asNullableRecord(cfg.channels?.[channel]) ?? {};
}
function resolveLegacyChannelAccount(cfg, channel, accountId) {
	const channelConfig = resolveLegacyChannelConfig(cfg, channel);
	return asNullableRecord(asNullableRecord(channelConfig.accounts)?.[accountId]);
}
function patchLegacyChannelConfig(params) {
	const channelConfig = resolveLegacyChannelConfig(params.cfg, params.channel);
	const dmConfig = asNullableRecord(channelConfig.dm) ?? {};
	return {
		...params.cfg,
		channels: {
			...params.cfg.channels,
			[params.channel]: {
				...channelConfig,
				...params.patch,
				dm: {
					...dmConfig,
					enabled: typeof dmConfig.enabled === "boolean" ? dmConfig.enabled : true
				}
			}
		}
	};
}
function setLegacyChannelDmPolicy(params) {
	const channelConfig = resolveLegacyChannelConfig(params.cfg, params.channel);
	const existingAllowFrom = resolveChannelDmAllowFrom({ account: channelConfig });
	const allowFrom = params.dmPolicy === "open" ? addWildcardAllowFrom(existingAllowFrom) : void 0;
	return patchLegacyChannelConfig({
		cfg: params.cfg,
		channel: params.channel,
		patch: {
			dmPolicy: params.dmPolicy,
			...allowFrom ? { allowFrom } : {}
		}
	});
}
/** @deprecated Compatibility for plugins published before setup policy became plugin-owned. */
function createLegacyCompatChannelDmPolicy(params) {
	return {
		label: params.label,
		channel: params.channel,
		policyKey: `channels.${params.channel}.dmPolicy`,
		allowFromKey: `channels.${params.channel}.allowFrom`,
		resolveConfigKeys: (_cfg, accountId) => accountId && accountId !== "default" ? {
			policyKey: `channels.${params.channel}.accounts.${accountId}.dmPolicy`,
			allowFromKey: `channels.${params.channel}.accounts.${accountId}.allowFrom`
		} : {
			policyKey: `channels.${params.channel}.dmPolicy`,
			allowFromKey: `channels.${params.channel}.allowFrom`
		},
		getCurrent: (cfg, accountId) => {
			const channelConfig = resolveLegacyChannelConfig(cfg, params.channel);
			const accountConfig = accountId && accountId !== "default" ? resolveLegacyChannelAccount(cfg, params.channel, accountId) : void 0;
			return resolveChannelDmPolicy({
				account: accountConfig,
				parent: channelConfig,
				defaultPolicy: "pairing"
			}) ?? "pairing";
		},
		setPolicy: (cfg, policy, accountId) => accountId && accountId !== "default" ? patchChannelConfigForAccount({
			cfg,
			channel: params.channel,
			accountId,
			patch: {
				dmPolicy: policy,
				...policy === "open" ? { allowFrom: addWildcardAllowFrom(resolveChannelDmAllowFrom({
					account: resolveLegacyChannelAccount(cfg, params.channel, accountId),
					parent: resolveLegacyChannelConfig(cfg, params.channel)
				})) } : {}
			}
		}) : setLegacyChannelDmPolicy({
			cfg,
			channel: params.channel,
			dmPolicy: policy
		}),
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
	return accountId !== "default" ? patchChannelConfigForAccount({
		cfg: params.cfg,
		channel: params.channel,
		accountId,
		patch: { allowFrom }
	}) : patchLegacyChannelConfig({
		cfg: params.cfg,
		channel: params.channel,
		patch: { allowFrom }
	});
}
//#endregion
export { promptLegacyChannelAllowFromForAccount as n, createLegacyCompatChannelDmPolicy as t };
