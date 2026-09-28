import { m as normalizeSecretInputString } from "./setup-core-CCMLSh4Q.mjs";
import { a as getMe, n as resolveZaloProxyFetch, r as ZaloApiError, t as sendMessageZalo } from "./send-Div0xZFE.mjs";
import { createAccountStatusSink } from "openclaw/plugin-sdk/channel-outbound";
import { runChannelProbe } from "openclaw/plugin-sdk/text-utility-runtime";
//#region extensions/zalo/src/probe.ts
function formatZaloProbeError(error, timeoutMs) {
	if (error instanceof ZaloApiError) return error.description ?? error.message;
	if (error instanceof Error) return error.name === "AbortError" ? `Request timed out after ${timeoutMs}ms` : error.message;
	return String(error);
}
async function probeZalo(token, timeoutMs = 5e3, fetcher) {
	if (!token?.trim()) return {
		ok: false,
		error: "No token provided",
		elapsedMs: 0
	};
	return await runChannelProbe(void 0, async ({ elapsedMs }) => {
		const response = await getMe(token.trim(), timeoutMs, fetcher);
		if (response.ok && response.result) return {
			ok: true,
			bot: response.result,
			elapsedMs: elapsedMs()
		};
		return {
			ok: false,
			error: "Invalid response from Zalo API",
			elapsedMs: elapsedMs()
		};
	}, (error) => ({
		ok: false,
		error: formatZaloProbeError(error, timeoutMs)
	}));
}
//#endregion
//#region extensions/zalo/src/channel.runtime.ts
async function sendZaloText(params) {
	return await sendMessageZalo(params.to, params.text, params);
}
async function probeZaloAccount(params) {
	return await probeZalo(params.account.token, params.timeoutMs, resolveZaloProxyFetch(params.account.config.proxy));
}
async function startZaloGatewayAccount(ctx) {
	const account = ctx.account;
	const token = account.token.trim();
	const mode = account.config.webhookUrl ? "webhook" : "polling";
	let zaloBotLabel = "";
	const fetcher = resolveZaloProxyFetch(account.config.proxy);
	try {
		const probe = await probeZalo(token, 2500, fetcher);
		const name = probe.ok ? probe.bot?.account_name?.trim() : null;
		if (name) zaloBotLabel = ` (${name})`;
		if (!probe.ok) ctx.log?.warn?.(`[${account.accountId}] Zalo probe failed before provider start (${String(probe.elapsedMs)}ms): ${probe.error}`);
		ctx.setStatus({
			accountId: account.accountId,
			bot: probe.bot
		});
	} catch (err) {
		ctx.log?.warn?.(`[${account.accountId}] Zalo probe threw before provider start: ${err instanceof Error ? err.stack ?? err.message : String(err)}`);
	}
	const statusSink = createAccountStatusSink({
		accountId: ctx.accountId,
		setStatus: ctx.setStatus
	});
	ctx.log?.info(`[${account.accountId}] starting provider${zaloBotLabel} mode=${mode}`);
	const { monitorZaloProvider } = await import("./monitor-BXzlUPAd.mjs");
	return monitorZaloProvider({
		token,
		account,
		config: ctx.cfg,
		runtime: ctx.runtime,
		abortSignal: ctx.abortSignal,
		useWebhook: Boolean(account.config.webhookUrl),
		webhookUrl: account.config.webhookUrl,
		webhookSecret: normalizeSecretInputString(account.config.webhookSecret),
		webhookPath: account.config.webhookPath,
		fetcher,
		statusSink
	});
}
//#endregion
export { probeZaloAccount, sendZaloText, startZaloGatewayAccount };
