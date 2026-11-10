import { d as listEnabledFeishuAccounts, g as resolveFeishuRuntimeAccount } from "./doctor-contract-BNXcJcWR.mjs";
import { t as getFeishuRuntime } from "./runtime-C5JxBWZp.mjs";
import { r as registerFeishuAiAgent, t as probeFeishu } from "./probe-s0hiM44D.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-resolution";
import { clampTimerTimeoutMs, parseStrictPositiveInteger } from "openclaw/plugin-sdk/number-runtime";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/feishu/src/bot-identity-cache.ts
const FEISHU_BOT_IDENTITY_CACHE_NAMESPACE = "feishu.bot-identity-cache";
const FEISHU_BOT_IDENTITY_CACHE_MAX_ENTRIES = 128;
function openFeishuBotIdentityCache() {
	return getFeishuRuntime().state.openKeyedStore({
		namespace: FEISHU_BOT_IDENTITY_CACHE_NAMESPACE,
		maxEntries: FEISHU_BOT_IDENTITY_CACHE_MAX_ENTRIES
	});
}
function parseCachedFeishuBotIdentity(value) {
	if (!value || typeof value !== "object") return null;
	const state = value;
	const appId = normalizeOptionalString(state.appId);
	const botOpenId = normalizeOptionalString(state.botOpenId);
	const botName = normalizeOptionalString(state.botName);
	const fetchedAt = normalizeOptionalString(state.fetchedAt);
	if (!appId || !botOpenId || !fetchedAt || Number.isNaN(Date.parse(fetchedAt))) return null;
	return {
		appId,
		botOpenId,
		botName,
		fetchedAt
	};
}
async function readCachedFeishuBotIdentity(params) {
	const appId = normalizeOptionalString(params.appId);
	if (!appId) return null;
	const cached = parseCachedFeishuBotIdentity(await openFeishuBotIdentityCache().lookup(normalizeAccountId(params.accountId)));
	if (!cached || cached.appId !== appId) return null;
	return {
		botOpenId: cached.botOpenId,
		botName: cached.botName,
		fetchedAt: cached.fetchedAt
	};
}
async function writeCachedFeishuBotIdentity(params) {
	const appId = normalizeOptionalString(params.appId);
	const botOpenId = normalizeOptionalString(params.botOpenId);
	if (!appId || !botOpenId) return;
	const botName = normalizeOptionalString(params.botName);
	await openFeishuBotIdentityCache().register(normalizeAccountId(params.accountId), {
		appId,
		botOpenId,
		botName,
		fetchedAt: (/* @__PURE__ */ new Date()).toISOString()
	});
}
//#endregion
//#region extensions/feishu/src/monitor-startup-timeout.ts
const FEISHU_STARTUP_BOT_INFO_TIMEOUT_DEFAULT_MS = 3e4;
const FEISHU_STARTUP_BOT_INFO_TIMEOUT_ENV = "OPENCLAW_FEISHU_STARTUP_PROBE_TIMEOUT_MS";
function resolveStartupProbeTimeoutMs(env = process.env) {
	const raw = env[FEISHU_STARTUP_BOT_INFO_TIMEOUT_ENV];
	if (raw) {
		const parsed = parseStrictPositiveInteger(raw);
		const timeoutMs = parsed === void 0 ? void 0 : clampTimerTimeoutMs(parsed);
		if (timeoutMs !== void 0) return timeoutMs;
		console.warn(`[feishu] ${FEISHU_STARTUP_BOT_INFO_TIMEOUT_ENV}="${raw}" is invalid; using default ${FEISHU_STARTUP_BOT_INFO_TIMEOUT_DEFAULT_MS}ms`);
	}
	return FEISHU_STARTUP_BOT_INFO_TIMEOUT_DEFAULT_MS;
}
//#endregion
//#region extensions/feishu/src/monitor.startup.ts
const FEISHU_STARTUP_BOT_INFO_TIMEOUT_MS = resolveStartupProbeTimeoutMs();
async function fetchBotIdentityForMonitor(account, options = {}) {
	if (options.abortSignal?.aborted) return {};
	const timeoutMs = FEISHU_STARTUP_BOT_INFO_TIMEOUT_MS;
	const result = await probeFeishu(account, {
		timeoutMs,
		abortSignal: options.abortSignal
	});
	const resultAppId = normalizeOptionalString(result.appId);
	if (result.ok && resultAppId === account.appId) {
		registerFeishuAiAgent(account, { abortSignal: options.abortSignal }).then((registration) => {
			if (!registration.ok && registration.reason !== "aborted") (options.runtime?.log ?? console.log)(`feishu[${account.accountId}]: AI-agent registration unavailable (${registration.reason}); continuing with standard bot identity`);
		}).catch(() => {
			(options.runtime?.log ?? console.log)(`feishu[${account.accountId}]: AI-agent registration failed unexpectedly; continuing with standard bot identity`);
		});
		try {
			await writeCachedFeishuBotIdentity({
				accountId: account.accountId,
				appId: account.appId,
				botOpenId: result.botOpenId,
				botName: result.botName
			});
		} catch {
			options.runtime?.log?.(`feishu[${account.accountId}]: bot identity cache write failed; continuing startup`);
		}
		return {
			botOpenId: normalizeOptionalString(result.botOpenId),
			botName: normalizeOptionalString(result.botName),
			source: "provider"
		};
	}
	if (result.ok) (options.runtime?.log ?? console.log)(`feishu[${account.accountId}]: bot info check returned identity for a different app; ignoring stale result`);
	const probeError = normalizeLowercaseStringOrEmpty(result.error);
	if (options.abortSignal?.aborted || probeError.includes("aborted")) return {};
	if (probeError.includes("timeout") || probeError.includes("timed out")) (options.runtime?.error ?? console.error)(`feishu[${account.accountId}]: bot info check timed out after ${timeoutMs}ms; continuing startup`);
	if (options.allowCachedFallback === false) return {};
	try {
		const cached = await readCachedFeishuBotIdentity({
			accountId: account.accountId,
			appId: account.appId
		});
		if (!cached) return {};
		options.runtime?.log?.(`feishu[${account.accountId}]: using cached provider-verified bot identity while the fresh check is unavailable`);
		return {
			botOpenId: cached.botOpenId,
			botName: cached.botName,
			source: "cache"
		};
	} catch {
		options.runtime?.log?.(`feishu[${account.accountId}]: bot identity cache read failed; continuing without cached identity`);
		return {};
	}
}
//#endregion
//#region extensions/feishu/src/monitor.ts
const loadMonitorAccountRuntime = createLazyRuntimeModule(() => import("./monitor.account-C_u1fZ5g.mjs"));
async function monitorFeishuProvider(opts = {}) {
	const cfg = opts.config;
	if (!cfg) throw new Error("Config is required for Feishu monitor");
	const log = opts.runtime?.log ?? console.log;
	if (opts.accountId) {
		const account = resolveFeishuRuntimeAccount({
			cfg,
			accountId: opts.accountId
		}, { requireEventSecrets: true });
		if (!account.enabled || !account.configured) throw new Error(`Feishu account "${opts.accountId}" not configured or disabled`);
		const { monitorSingleAccount } = await loadMonitorAccountRuntime();
		return monitorSingleAccount({
			cfg,
			account,
			channelRuntime: opts.channelRuntime,
			runtime: opts.runtime,
			abortSignal: opts.abortSignal,
			...opts.statusSink ? { statusSink: opts.statusSink } : {}
		});
	}
	const accounts = listEnabledFeishuAccounts(cfg);
	if (accounts.length === 0) throw new Error("No enabled Feishu accounts configured");
	log(`feishu: starting ${accounts.length} account(s): ${accounts.map((a) => a.accountId).join(", ")}`);
	const { monitorSingleAccount } = await loadMonitorAccountRuntime();
	const monitorPromises = [];
	for (const account of accounts) {
		if (opts.abortSignal?.aborted) {
			log("feishu: abort signal received during startup preflight; stopping startup");
			break;
		}
		const { botOpenId, source } = await fetchBotIdentityForMonitor(account, {
			runtime: opts.runtime,
			abortSignal: opts.abortSignal
		});
		if (opts.abortSignal?.aborted) {
			log("feishu: abort signal received during startup preflight; stopping startup");
			break;
		}
		monitorPromises.push(monitorSingleAccount({
			cfg,
			account,
			channelRuntime: opts.channelRuntime,
			runtime: opts.runtime,
			abortSignal: opts.abortSignal,
			botOpenIdSource: {
				kind: "prefetched",
				botOpenId,
				source
			},
			...opts.statusSink ? { statusSink: opts.statusSink } : {}
		}));
	}
	await Promise.all(monitorPromises);
}
//#endregion
export { monitorFeishuProvider, fetchBotIdentityForMonitor as t };
