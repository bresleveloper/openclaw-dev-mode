import "./session-key-CBvmC8zz.mjs";
import "./account-id-B1bfbA5J.mjs";
import { b as patchChannelConfigForAccount, t as addWildcardAllowFrom } from "./setup-wizard-helpers-DT-haSuo.mjs";
//#region src/plugin-sdk/channel-dm-policy.ts
/** Build an account-aware DM policy descriptor for channel setup flows. */
function createChannelDmPolicy(params) {
	const policyPath = params.policyPath ?? "dmPolicy";
	const allowFromPath = params.allowFromPath ?? "allowFrom";
	const rootPath = `channels.${params.channel}`;
	const resolveContext = (cfg, requestedAccountId) => ({
		cfg,
		requestedAccountId,
		account: params.resolveAccount(cfg, requestedAccountId)
	});
	const resolveDefaultConfigKeys = (context) => {
		const prefix = context.account.accountId === "default" ? rootPath : `${rootPath}.accounts.${context.account.accountId}`;
		return {
			policyKey: `${prefix}.${policyPath}`,
			allowFromKey: `${prefix}.${allowFromPath}`
		};
	};
	return {
		label: params.label,
		channel: params.channel,
		policyKey: params.policyKey ?? `${rootPath}.${policyPath}`,
		allowFromKey: params.allowFromKey ?? `${rootPath}.${allowFromPath}`,
		resolveConfigKeys: (cfg, accountId) => {
			const context = resolveContext(cfg, accountId);
			return (params.resolveConfigKeys ?? resolveDefaultConfigKeys)(context);
		},
		getCurrent: (cfg, accountId) => resolveContext(cfg, accountId).account.config.dmPolicy ?? "pairing",
		setPolicy: (cfg, policy, accountId) => {
			const context = resolveContext(cfg, accountId);
			const patchContext = {
				...context,
				policy,
				allowFrom: params.resolveAllowFrom ? params.resolveAllowFrom({
					...context,
					policy
				}) : policy === "open" ? addWildcardAllowFrom(context.account.config.allowFrom) : void 0
			};
			const patch = params.buildPatch?.(patchContext) ?? {
				dmPolicy: policy,
				...patchContext.allowFrom === void 0 ? {} : { allowFrom: patchContext.allowFrom }
			};
			return params.applyPatch ? params.applyPatch({
				...context,
				patch
			}) : patchChannelConfigForAccount({
				cfg,
				channel: params.channel,
				accountId: context.account.accountId,
				patch,
				setupSurface: typeof params.setupSurface === "function" ? params.setupSurface() : params.setupSurface
			});
		},
		promptAllowFrom: params.promptAllowFrom
	};
}
//#endregion
export { createChannelDmPolicy as t };
