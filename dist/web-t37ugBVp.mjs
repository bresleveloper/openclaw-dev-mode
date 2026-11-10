import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-DKVgg-js.mjs";
import { o as listLoadedChannelPluginsForRegistry } from "./registry-loaded-B-WQB-l0.mjs";
import { Ng as errorShape, Sc as validateWebLoginWaitParams, xc as validateWebLoginStartParams } from "./src-pLJQA6J5.mjs";
import { r as listChannelPlugins } from "./registry-B91r5qN6.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import "./plugins-CCVkYF8m.mjs";
import { r as resolveMissingOfficialExternalChannelPluginRepairHints } from "./official-external-plugin-repair-hints-Ue6gYZgR.mjs";
import { t as respondUnavailable } from "./response-ajmyFl3V.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { r as resolveRuntimeAccountSnapshot } from "./channels-account-B-zGVpin.mjs";
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
	const first = hints[0];
	if (!first) return null;
	if (hints.length === 1) return first.repairHint;
	const labels = [...new Set(hints.map((hint) => hint.label))];
	const installCommands = [...new Set(hints.map((hint) => hint.installCommand))];
	return `Configured official external channel plugins are missing for ${labels.join(", ")}. Install them with: ${installCommands.join("; ")}, or run: ${first.doctorFixCommand}.`;
}
function webLoginHandler(method, validate, gatewayMethod, handle) {
	return async ({ params, respond, context }) => {
		if (!assertValidParams(params, validate, method, respond)) return;
		try {
			const accountId = params.accountId;
			const provider = resolveWebLoginProvider(params.channel);
			if (!provider) {
				const repairHint = resolveMissingWebLoginPluginHint(context);
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, repairHint ? `web login provider is not available. ${repairHint}` : "web login provider is not available"));
				return;
			}
			const gateway = provider.gateway;
			const run = gateway?.[gatewayMethod];
			if (!run) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `web login is not supported by provider ${provider.id}`));
				return;
			}
			await handle(params, context, {
				accountId,
				provider,
				run: run.bind(gateway)
			}, respond);
		} catch (err) {
			respondUnavailable(respond, err);
		}
	};
}
const webHandlers = {
	"web.login.start": webLoginHandler("web.login.start", validateWebLoginStartParams, "loginWithQrStart", async (params, context, { accountId, provider, run }, respond) => {
		const runtime = context.getRuntimeSnapshot();
		const wasRunning = (accountId ? resolveRuntimeAccountSnapshot({
			runtime,
			channelId: provider.id,
			accountId
		}) : runtime.channels[provider.id])?.running === true;
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
	}),
	"web.login.wait": webLoginHandler("web.login.wait", validateWebLoginWaitParams, "loginWithQrWait", async (params, context, { accountId, provider, run }, respond) => {
		const result = await run({
			timeoutMs: params.timeoutMs,
			accountId,
			sessionKey: params.sessionKey,
			currentQrDataUrl: params.currentQrDataUrl
		});
		if (result.connected) await context.startChannel(provider.id, accountId);
		respond(true, result, void 0);
	})
};
//#endregion
export { webHandlers };
