import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import "./session-key-C09ow4h0.mjs";
import "./account-id-DbRsdayc.mjs";
import { a as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { n as resolveChannelAccount } from "./account-resolution-DCHDXWZ0.mjs";
//#region src/gateway/server-methods/channels-account.ts
function resolveRuntimeAccountSnapshot(params) {
	const direct = params.runtime.channelAccounts[params.channelId]?.[params.accountId];
	if (direct) return direct;
	const fallback = params.runtime.channels[params.channelId];
	return fallback?.accountId === params.accountId ? fallback : void 0;
}
function resolveChannelGatewayAccountId(params, getRuntimeSnapshot) {
	const explicit = normalizeOptionalString(params.accountId);
	if (explicit) return explicit;
	const channelId = params.plugin.id;
	const runtime = getRuntimeSnapshot?.();
	if (runtime?.reloadingChannels?.has(channelId)) return runtime.reloadingChannels.get(channelId) || Object.keys(runtime.channelAccounts[channelId] ?? {})[0] || "default";
	return params.plugin.config.defaultAccountId?.(params.cfg) || params.plugin.config.listAccountIds(params.cfg)[0] || "default";
}
async function logoutChannelAccount(params) {
	const isRuntimeCurrent = () => params.context.getGatewayMethodRegistry?.() === params.methodRegistry && (!params.methodRegistry || getPluginRuntimeGatewayRequestScope()?.pluginRegistry === params.methodRegistry.pluginRegistry) && params.context.getRuntimeConfig() === params.cfg && params.context.isConfigReloadSettled();
	const assertCurrent = () => {
		params.assertRequestCurrent();
		if (!isRuntimeCurrent()) throw new Error(`Channel ${params.channelId} changed during logout; retry the request.`);
	};
	assertCurrent();
	const resolvedAccountId = resolveChannelGatewayAccountId(params);
	const account = await resolveChannelAccount({
		plugin: params.plugin,
		cfg: params.cfg,
		accountId: resolvedAccountId
	});
	assertCurrent();
	await params.context.stopChannel(params.channelId, resolvedAccountId);
	assertCurrent();
	const result = await params.plugin.gateway?.logoutAccount?.({
		cfg: params.cfg,
		accountId: resolvedAccountId,
		account,
		runtime: defaultRuntime
	});
	params.assertRequestCurrent();
	if (!result) throw new Error(`Channel ${params.channelId} does not support logout`);
	const cleared = result.cleared;
	if ((typeof result.loggedOut === "boolean" ? result.loggedOut : cleared) && isRuntimeCurrent()) params.context.markChannelLoggedOut(params.channelId, true, resolvedAccountId);
	return {
		channel: params.channelId,
		accountId: resolvedAccountId,
		...result,
		cleared
	};
}
//#endregion
export { resolveChannelGatewayAccountId as n, resolveRuntimeAccountSnapshot as r, logoutChannelAccount as t };
