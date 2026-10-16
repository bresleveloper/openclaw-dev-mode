import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-BvpWSO2L.mjs";
import { o as listLoadedChannelPluginsForRegistry } from "./registry-loaded-BugfxX6l.mjs";
import { nc as validateWebLoginWaitParams, tc as validateWebLoginStartParams } from "./src-l2dWvEsN.mjs";
import { r as resolveMissingOfficialExternalChannelPluginRepairHints } from "./official-external-plugin-repair-hints-M7Ed27uG.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { r as listChannelPlugins } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { t as respondUnavailable } from "./response-BKwLtoRW.mjs";
import { r as resolveRuntimeAccountSnapshot } from "./channels-account-D3qRmb8E.mjs";
//#region src/gateway/server-methods/web.ts
const WEB_LOGIN_METHODS = /* @__PURE__ */ new Set(["web.login.start", "web.login.wait"]);
function resolveWebLoginChannelId(raw, plugins) {
	const normalized = normalizeOptionalLowercaseString(raw);
	if (!normalized) return null;
	return plugins.find((plugin) => normalizeOptionalLowercaseString(plugin.id) === normalized || plugin.meta?.aliases?.some((alias) => normalizeOptionalLowercaseString(alias) === normalized))?.id ?? null;
}
const resolveWebLoginProvider = (channelId) => {
	const registry = getPluginRuntimeGatewayRequestScope()?.pluginRegistry;
	const plugins = registry ? listLoadedChannelPluginsForRegistry(registry) : listChannelPlugins();
	if (channelId) {
		const normalizedChannelId = registry ? resolveWebLoginChannelId(channelId, plugins) : normalizeAnyChannelId(channelId);
		return normalizedChannelId ? plugins.find((plugin) => plugin.id === normalizedChannelId) ?? null : null;
	}
	return plugins.find((plugin) => [...plugin.gatewayMethods ?? [], ...(plugin.gatewayMethodDescriptors ?? []).map((descriptor) => descriptor.name)].some((method) => WEB_LOGIN_METHODS.has(method))) ?? null;
};
function resolveMissingWebLoginPluginHint(context) {
	const cfg = context.getRuntimeConfig();
	const channels = cfg.channels;
	if (!channels || typeof channels !== "object" || Array.isArray(channels)) return null;
	const hints = resolveMissingOfficialExternalChannelPluginRepairHints({
		config: cfg,
		channelIds: Object.keys(channels)
	});
	if (hints.length === 0) return null;
	if (hints.length === 1) return expectDefined(hints[0], "hints entry at 0").repairHint;
	const labels = [...new Set(hints.map((hint) => hint.label))];
	const installCommands = [...new Set(hints.map((hint) => hint.installCommand))];
	const doctorFixCommand = expectDefined(hints[0], "hints entry at 0").doctorFixCommand;
	return `Configured official external channel plugins are missing for ${labels.join(", ")}. Install them with: ${installCommands.join("; ")}, or run: ${doctorFixCommand}.`;
}
function resolveWebLoginRequest(params) {
	const accountId = params.rawParams.accountId;
	const provider = resolveWebLoginProvider(params.rawParams.channel);
	if (!provider) {
		const repairHint = resolveMissingWebLoginPluginHint(params.context);
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, repairHint ? `web login provider is not available. ${repairHint}` : "web login provider is not available"));
		return null;
	}
	const gateway = provider.gateway;
	const run = gateway?.[params.gatewayMethod];
	if (!run) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `web login is not supported by provider ${provider.id}`));
		return null;
	}
	return {
		accountId,
		provider,
		run: run.bind(gateway)
	};
}
function wasChannelRunning(params) {
	const runtime = params.context.getRuntimeSnapshot();
	return (params.accountId ? resolveRuntimeAccountSnapshot({
		...params,
		runtime,
		accountId: params.accountId
	}) : runtime.channels[params.channelId])?.running === true;
}
const webHandlers = {
	"web.login.start": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateWebLoginStartParams, "web.login.start", respond)) return;
		try {
			const request = resolveWebLoginRequest({
				rawParams: params,
				respond,
				context,
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
				timeoutMs: params.timeoutMs,
				verbose: Boolean(params.verbose),
				accountId
			});
			const stoppedAfterQrTakeover = !stoppedBeforeLogin && Boolean(result.qrDataUrl);
			if (stoppedAfterQrTakeover) await context.stopChannel(provider.id, accountId);
			if ((stoppedBeforeLogin || stoppedAfterQrTakeover) && (result.connected || wasRunning && !result.qrDataUrl)) await context.startChannel(provider.id, accountId);
			respond(true, result, void 0);
		} catch (err) {
			respondUnavailable(respond, err);
		}
	},
	"web.login.wait": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateWebLoginWaitParams, "web.login.wait", respond)) return;
		try {
			const request = resolveWebLoginRequest({
				rawParams: params,
				respond,
				context,
				gatewayMethod: "loginWithQrWait"
			});
			if (!request) return;
			const { accountId, provider, run } = request;
			const result = await run({
				timeoutMs: params.timeoutMs,
				accountId,
				sessionKey: params.sessionKey,
				currentQrDataUrl: params.currentQrDataUrl
			});
			if (result.connected) await context.startChannel(provider.id, accountId);
			respond(true, result, void 0);
		} catch (err) {
			respondUnavailable(respond, err);
		}
	}
};
//#endregion
export { webHandlers };
