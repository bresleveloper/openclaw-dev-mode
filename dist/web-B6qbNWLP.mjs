import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Hs as validateWebLoginStartParams, Us as validateWebLoginWaitParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { a as listLoadedChannelPluginsForRegistry } from "./registry-loaded-CYq2sa_C.mjs";
import { r as resolveMissingOfficialExternalChannelPluginRepairHints } from "./official-external-plugin-repair-hints-QFuGb490.mjs";
import { i as normalizeChannelId, r as listChannelPlugins } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { t as respondUnavailable } from "./response-Chzawb7u.mjs";
//#region src/gateway/server-methods/web.ts
const WEB_LOGIN_METHODS = /* @__PURE__ */ new Set(["web.login.start", "web.login.wait"]);
function resolveWebLoginChannelId(raw, plugins) {
	const normalized = normalizeOptionalLowercaseString(raw);
	if (!normalized) return null;
	return plugins.find((plugin) => normalizeOptionalLowercaseString(plugin.id) === normalized || plugin.meta?.aliases?.some((alias) => normalizeOptionalLowercaseString(alias) === normalized))?.id ?? null;
}
/** Resolves the channel plugin that currently owns web QR-login methods. */
const resolveWebLoginProvider = (channelId) => {
	const registry = getPluginRuntimeGatewayRequestScope()?.pluginRegistry;
	const plugins = registry ? listLoadedChannelPluginsForRegistry(registry) : listChannelPlugins();
	if (channelId) {
		const normalizedChannelId = registry ? resolveWebLoginChannelId(channelId, plugins) : normalizeChannelId(channelId);
		return normalizedChannelId ? plugins.find((plugin) => plugin.id === normalizedChannelId) ?? null : null;
	}
	return plugins.find((plugin) => [...plugin.gatewayMethods ?? [], ...(plugin.gatewayMethodDescriptors ?? []).map((descriptor) => descriptor.name)].some((method) => WEB_LOGIN_METHODS.has(method))) ?? null;
};
function resolveAccountId(params) {
	return typeof params.accountId === "string" ? params.accountId : void 0;
}
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
function respondProviderUnavailable(params) {
	const repairHint = resolveMissingWebLoginPluginHint(params.context);
	const message = repairHint ? `web login provider is not available. ${repairHint}` : "web login provider is not available";
	params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, message));
}
function respondProviderUnsupported(respond, providerId) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `web login is not supported by provider ${providerId}`));
}
/** Resolves a concrete provider gateway login method or sends the public error. */
function resolveWebLoginRequest(params) {
	const accountId = resolveAccountId(params.rawParams);
	const provider = resolveWebLoginProvider(typeof params.rawParams.channel === "string" ? params.rawParams.channel : void 0);
	if (!provider) {
		respondProviderUnavailable({
			respond: params.respond,
			context: params.context
		});
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
				timeoutMs: typeof params.timeoutMs === "number" ? params.timeoutMs : void 0,
				accountId,
				sessionKey: typeof params.sessionKey === "string" ? params.sessionKey : void 0,
				currentQrDataUrl: typeof params.currentQrDataUrl === "string" ? params.currentQrDataUrl : void 0
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
