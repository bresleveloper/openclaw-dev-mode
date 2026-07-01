import { i as listChannelPlugins } from "./registry-Ba1KQQW12.js";
import "./plugins-DnKj2WmH.js";
import { mn as errorShape, pn as ErrorCodes } from "./schema-Ctppm7Dp.js";
import { cr as validateWebLoginWaitParams, sr as validateWebLoginStartParams } from "./src-CSp7rUPX.js";
import { t as formatForLog } from "./ws-log-UD7Od6QM.js";
import { t as assertValidParams } from "./validation-CGUihuqY.js";
//#region src/gateway/server-methods/web.ts
const WEB_LOGIN_METHODS = new Set(["web.login.start", "web.login.wait"]);
/** Resolves the channel plugin that currently owns web QR-login methods. */
const resolveWebLoginProvider = () => listChannelPlugins().find((plugin) => [...plugin.gatewayMethods ?? [], ...(plugin.gatewayMethodDescriptors ?? []).map((descriptor) => descriptor.name)].some((method) => WEB_LOGIN_METHODS.has(method))) ?? null;
function resolveAccountId(params) {
	return typeof params.accountId === "string" ? params.accountId : void 0;
}
function respondProviderUnavailable(respond) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "web login provider is not available"));
}
function respondProviderUnsupported(respond, providerId) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `web login is not supported by provider ${providerId}`));
}
function respondWebLoginUnavailable(respond, err) {
	respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
}
/** Resolves a concrete provider gateway login method or sends the public error. */
function resolveWebLoginRequest(params) {
	const accountId = resolveAccountId(params.rawParams);
	const provider = resolveWebLoginProvider();
	if (!provider) {
		respondProviderUnavailable(params.respond);
		return null;
	}
	const gateway = provider.gateway;
	const run = gateway?.[params.gatewayMethod];
	if (!run) {
		respondProviderUnsupported(params.respond, provider.id);
		return null;
	}
	return {
		accountId,
		provider,
		run: run.bind(gateway)
	};
}
/** Checks whether the matching channel/account should be restored after login start. */
function wasChannelRunning(params) {
	const runtime = params.context.getRuntimeSnapshot();
	if (params.accountId) {
		const accountRuntime = runtime.channelAccounts[params.channelId]?.[params.accountId];
		if (accountRuntime) return accountRuntime.running === true;
	}
	if (!params.accountId) return runtime.channels[params.channelId]?.running === true;
	const defaultRuntime = runtime.channels[params.channelId];
	return defaultRuntime?.accountId === params.accountId && defaultRuntime.running === true;
}
/** Gateway handlers for plugin-owned web QR-login flows. */
const webHandlers = {
	"web.login.start": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateWebLoginStartParams, "web.login.start", respond)) return;
		try {
			const request = resolveWebLoginRequest({
				rawParams: params,
				respond,
				gatewayMethod: "loginWithQrStart"
			});
			if (!request) return;
			const { accountId, provider, run } = request;
			const wasRunning = wasChannelRunning({
				context,
				channelId: provider.id,
				accountId
			});
			const forceLogin = Boolean(params.force);
			const stoppedBeforeLogin = forceLogin || !wasRunning;
			if (stoppedBeforeLogin) await context.stopChannel(provider.id, accountId);
			const result = await run({
				force: forceLogin,
				timeoutMs: typeof params.timeoutMs === "number" ? params.timeoutMs : void 0,
				verbose: Boolean(params.verbose),
				accountId
			});
			const stoppedAfterQrTakeover = !stoppedBeforeLogin && Boolean(result.qrDataUrl);
			if (stoppedAfterQrTakeover) await context.stopChannel(provider.id, accountId);
			const stoppedForLogin = stoppedBeforeLogin || stoppedAfterQrTakeover;
			if (result.connected && stoppedForLogin) await context.startChannel(provider.id, accountId);
			else if (wasRunning && stoppedForLogin && !result.qrDataUrl) await context.startChannel(provider.id, accountId);
			respond(true, result, void 0);
		} catch (err) {
			respondWebLoginUnavailable(respond, err);
		}
	},
	"web.login.wait": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateWebLoginWaitParams, "web.login.wait", respond)) return;
		try {
			const request = resolveWebLoginRequest({
				rawParams: params,
				respond,
				gatewayMethod: "loginWithQrWait"
			});
			if (!request) return;
			const { accountId, provider, run } = request;
			const result = await run({
				timeoutMs: typeof params.timeoutMs === "number" ? params.timeoutMs : void 0,
				accountId,
				currentQrDataUrl: typeof params.currentQrDataUrl === "string" ? params.currentQrDataUrl : void 0
			});
			if (result.connected) await context.startChannel(provider.id, accountId);
			respond(true, result, void 0);
		} catch (err) {
			respondWebLoginUnavailable(respond, err);
		}
	}
};
//#endregion
export { webHandlers };
