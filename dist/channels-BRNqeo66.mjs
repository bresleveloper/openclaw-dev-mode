import { s as raceWithTimeout } from "./src-D1BHGNTj.mjs";
import "./session-key-C09ow4h0.mjs";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-DbRsdayc.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-BvpWSO2L.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { B as validateChannelsStartParams, H as validateChannelsStopParams, I as validateChannelsLogoutParams, V as validateChannelsStatusParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { t as getChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { t as buildChannelUiCatalog } from "./catalog-DnVrnnud.mjs";
import { t as listReadOnlyChannelPluginsForConfig } from "./read-only-DLjFn1TE.mjs";
import { t as getChannelActivity } from "./channel-activity-Bn5LeXyE.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-BrASrBY_.mjs";
import { n as resolveChannelAccount } from "./account-resolution-DCHDXWZ0.mjs";
import { t as isAccountEnabled } from "./account-enabled-ClTLgAXM.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-Bm4RKejp.mjs";
import { s as redactChannelStatusSummaryBaseUrl } from "./account-snapshot-fields-e1ulxwox.mjs";
import { a as resolveUnavailableChannelAccountSnapshot } from "./account-state-4G5zay13.mjs";
import { n as buildChannelAccountSnapshotFromRuntime } from "./account-summary-CegAey_r.mjs";
import { t as buildChannelAccountSnapshotFromAccount } from "./status-ChiSBqg1.mjs";
import { i as resolveChannelHealthState, n as DEFAULT_CHANNEL_STALE_EVENT_THRESHOLD_MS, t as DEFAULT_CHANNEL_CONNECT_GRACE_MS } from "./channel-health-policy-CQLQKpCe.mjs";
import { t as collectChannelStatusIssues } from "./channels-status-issues-C5VCY0fx.mjs";
import { t as formatForLog } from "./ws-log-Cxv8Uaao.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { n as respondUnavailableOnThrow } from "./response-BKwLtoRW.mjs";
import { n as resolveChannelGatewayAccountId, r as resolveRuntimeAccountSnapshot, t as logoutChannelAccount } from "./channels-account-D3qRmb8E.mjs";
//#region src/gateway/server-methods/channels-status-issues.ts
function resolveDeferredChannelReloadIssue(context, channel, accountId) {
	const deferred = context.getDeferredChannelReloads?.().find((entry) => entry.channel === channel);
	if (!deferred) return;
	return {
		channel,
		accountId,
		kind: "config",
		message: deferred.publicationPending ? "Channel configuration reload is deferred while active work finishes. The previous configuration is still in use." : "Channel reload is deferred while active work finishes.",
		fix: "Wait for active work to finish, then refresh channel status. Stopping and starting the channel does not apply unpublished configuration."
	};
}
function collectGatewayChannelStatusIssues(params) {
	const issues = [];
	for (const plugin of params.plugins) {
		try {
			issues.push(...collectChannelStatusIssues(params.payload, [params.reloadingChannels?.has(plugin.id) ? { id: plugin.id } : plugin]));
		} catch (error) {
			params.warnings.push(`${plugin.id} status diagnostics failed: ${formatForLog(error)}`);
		}
		const defaultAccountId = params.defaultAccountIds[plugin.id];
		const deferredIssue = resolveDeferredChannelReloadIssue(params.context, plugin.id, typeof defaultAccountId === "string" ? defaultAccountId : DEFAULT_ACCOUNT_ID);
		if (deferredIssue) issues.push(deferredIssue);
	}
	return issues.slice(0, 50);
}
//#endregion
//#region src/gateway/server-methods/channels.ts
function resolveChannelOperationParams(params) {
	const rawParams = params.rawParams;
	if (!assertValidParams(rawParams, params.validate, params.method, params.respond)) return null;
	const rawChannel = rawParams.channel;
	const channelId = typeof rawChannel === "string" ? normalizeAnyChannelId(rawChannel) : null;
	if (!channelId) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid ${params.method} channel`));
		return null;
	}
	const plugin = getChannelPlugin(channelId);
	if (!plugin) {
		const message = params.method === "channels.start" ? `unknown channel: ${formatForLog(rawChannel)}` : params.method === "channels.stop" ? `unknown channel ${channelId}` : `channel ${channelId} does not support logout`;
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, message));
		return null;
	}
	const unsupported = params.method === "channels.start" && !plugin.gateway?.startAccount ? "start" : params.method === "channels.logout" && !plugin.gateway?.logoutAccount ? "logout" : void 0;
	if (unsupported) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `channel ${channelId} does not support ${unsupported}`));
		return null;
	}
	return {
		params: rawParams,
		channelId,
		plugin
	};
}
function channelAccountOperationHandler(method, validate, run) {
	return async ({ params, respond, context }) => {
		const resolved = resolveChannelOperationParams({
			method,
			rawParams: params,
			respond,
			validate
		});
		if (!resolved) return;
		await respondUnavailableOnThrow(respond, async () => {
			respond(true, await run({
				channelId: resolved.channelId,
				accountId: resolved.params.accountId,
				cfg: context.getRuntimeConfig(),
				context,
				plugin: resolved.plugin
			}), void 0);
		});
	};
}
const CHANNEL_STATUS_MAX_TIMEOUT_MS = 3e4;
const CHANNEL_STATUS_PROBE_CONCURRENCY = 5;
async function runChannelStatusHook(params) {
	const timeoutMs = Math.max(1, params.timeoutMs);
	const warningPrefix = `${params.channelId}${params.accountId === void 0 ? "" : `:${params.accountId}`} ${params.step}`;
	const timedOut = Symbol("channel-status-timeout");
	try {
		const value = await raceWithTimeout(Promise.resolve().then(params.run), timeoutMs, () => timedOut, { ref: false });
		if (value === timedOut) {
			params.warnings.push(`${warningPrefix} timed out after ${timeoutMs}ms`);
			return {
				ok: false,
				timedOut: true,
				error: `${params.step} timed out after ${timeoutMs}ms`
			};
		}
		return {
			ok: true,
			value
		};
	} catch (error) {
		const message = formatForLog(error);
		params.warnings.push(`${warningPrefix} failed: ${message}`);
		return {
			ok: false,
			error: message
		};
	}
}
function channelStatusFailureMessage(value) {
	if (!value || typeof value !== "object") return null;
	const record = value;
	if (record.ok !== false || typeof record.error !== "string" || record.error.length === 0) return null;
	return record.error;
}
function resolveChannelsStatusTimeoutMs(params) {
	const fallback = params.probe ? CHANNEL_STATUS_MAX_TIMEOUT_MS : 1e4;
	if (typeof params.timeoutMsRaw !== "number" || !Number.isFinite(params.timeoutMsRaw)) return fallback;
	return Math.min(Math.max(1e3, params.timeoutMsRaw), CHANNEL_STATUS_MAX_TIMEOUT_MS);
}
async function startChannelAccount(params) {
	if (!params.plugin.gateway?.startAccount) throw new Error(`Channel ${params.channelId} does not support runtime start`);
	const resolvedAccountId = resolveChannelGatewayAccountId(params, () => params.context.getRuntimeSnapshot({
		channelId: params.channelId,
		inspectAccounts: false
	}));
	const outcome = (await params.context.startChannel(params.channelId, resolvedAccountId, { manual: true })).get(resolvedAccountId);
	if (!outcome) throw new Error(`Channel ${params.channelId} did not report a start outcome for ${resolvedAccountId}`);
	const runtime = params.context.getRuntimeSnapshot({
		channelId: params.channelId,
		inspectAccounts: false
	});
	const started = resolveRuntimeAccountSnapshot({
		runtime,
		channelId: params.channelId,
		accountId: resolvedAccountId
	})?.running === true;
	const deferredIssue = resolveDeferredChannelReloadIssue(params.context, params.channelId, resolvedAccountId);
	return {
		channel: params.channelId,
		accountId: resolvedAccountId,
		started,
		outcome,
		...deferredIssue ? { statusIssues: [deferredIssue] } : {}
	};
}
async function stopChannelAccount(params) {
	const resolvedAccountId = resolveChannelGatewayAccountId(params, () => params.context.getRuntimeSnapshot({
		channelId: params.channelId,
		inspectAccounts: false
	}));
	await params.context.stopChannel(params.channelId, resolvedAccountId);
	const runtime = params.context.getRuntimeSnapshot({
		channelId: params.channelId,
		inspectAccounts: false
	});
	const stopped = resolveRuntimeAccountSnapshot({
		runtime,
		channelId: params.channelId,
		accountId: resolvedAccountId
	})?.running !== true;
	return {
		channel: params.channelId,
		accountId: resolvedAccountId,
		stopped
	};
}
const channelsHandlers = {
	"channels.status": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateChannelsStatusParams, "channels.status", respond)) return;
		const probe = params.probe === true;
		const timeoutMs = resolveChannelsStatusTimeoutMs({
			probe,
			timeoutMsRaw: params.timeoutMs
		});
		const rawChannel = params.channel;
		const cfg = context.getRuntimeConfig();
		const plugins = listReadOnlyChannelPluginsForConfig(cfg);
		const requestedChannel = typeof rawChannel === "string" ? normalizeAnyChannelId(rawChannel) ?? plugins.find((plugin) => plugin.id === rawChannel.trim().toLowerCase())?.id : void 0;
		const selectedPlugins = requestedChannel ? plugins.filter((plugin) => plugin.id === requestedChannel) : plugins;
		const statusPlugins = selectedPlugins.toSorted((left, right) => left.id < right.id ? -1 : left.id > right.id ? 1 : 0);
		if (rawChannel !== void 0 && !requestedChannel) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown channel: ${formatForLog(rawChannel)}`));
			return;
		}
		const runtime = context.getRuntimeSnapshot({ channelId: requestedChannel });
		const statusWarnings = [];
		const buildAccountSnapshot = async (channelId, plugin, accountId, listed) => {
			const runtimeSnapshot = resolveRuntimeAccountSnapshot({
				runtime,
				channelId,
				accountId
			});
			if (!listed && runtimeSnapshot) {
				const snapshot = buildChannelAccountSnapshotFromRuntime(runtimeSnapshot);
				return {
					accountId,
					snapshot: resolveUnavailableChannelAccountSnapshot(cfg, {
						channelId,
						accountId,
						runtime: snapshot
					}) ?? snapshot
				};
			}
			const diagnosticSnapshot = resolveUnavailableChannelAccountSnapshot(cfg, {
				channelId,
				accountId,
				runtime: runtimeSnapshot
			}) ?? (runtimeSnapshot?.enabled === false ? runtimeSnapshot : void 0);
			if (diagnosticSnapshot) return {
				accountId,
				snapshot: diagnosticSnapshot
			};
			const account = await resolveChannelAccount({
				plugin,
				cfg,
				accountId
			});
			const enabled = plugin.config.isEnabled?.(account, cfg) ?? isAccountEnabled(account);
			let probeResult;
			let auditResult;
			let lastProbeAt = null;
			for (const step of ["probe", "audit"]) {
				if (!probe || !enabled || !plugin.status?.[`${step}Account`]) continue;
				if (plugin.config.isConfigured && !await plugin.config.isConfigured(account, cfg)) continue;
				const result = await runChannelStatusHook({
					channelId,
					accountId,
					step,
					timeoutMs,
					warnings: statusWarnings,
					run: () => plugin.status[`${step}Account`]({
						account,
						timeoutMs,
						cfg,
						...step === "audit" ? { probe: probeResult } : {}
					})
				});
				if (step === "probe") {
					probeResult = result.ok ? result.value : result;
					lastProbeAt = Date.now();
				} else auditResult = result.ok ? result.value : result;
			}
			const snapshot = await buildChannelAccountSnapshotFromAccount({
				plugin,
				cfg,
				accountId,
				account,
				runtime: runtimeSnapshot,
				probe: probeResult,
				audit: auditResult
			});
			const hookError = channelStatusFailureMessage(auditResult) ?? channelStatusFailureMessage(probeResult);
			if (hookError && !snapshot.lastError) snapshot.lastError = hookError;
			if (lastProbeAt) snapshot.lastProbeAt = lastProbeAt;
			const activity = getChannelActivity({
				channel: channelId,
				accountId
			});
			if (snapshot.lastInboundAt == null) snapshot.lastInboundAt = activity.inboundAt;
			if (snapshot.lastOutboundAt == null) snapshot.lastOutboundAt = activity.outboundAt;
			const healthState = resolveChannelHealthState(snapshot, {
				channelId,
				now: Date.now(),
				staleEventThresholdMs: DEFAULT_CHANNEL_STALE_EVENT_THRESHOLD_MS,
				channelConnectGraceMs: DEFAULT_CHANNEL_CONNECT_GRACE_MS
			});
			if (healthState !== void 0) snapshot.healthState = healthState;
			return {
				accountId,
				account,
				snapshot
			};
		};
		const buildChannelAccounts = async (plugin) => {
			const channelId = plugin.id;
			if (runtime.reloadingChannels?.has(channelId)) {
				const defaultAccount = runtime.channels[channelId];
				statusWarnings.push(`${channelId}: plugin runtime is paused for reload; reporting recorded account state`);
				return {
					accounts: Object.values(runtime.channelAccounts[channelId] ?? {}),
					defaultAccountId: runtime.reloadingChannels.get(channelId) ?? "default",
					defaultAccount,
					resolvedAccounts: {}
				};
			}
			const configuredAccountIds = plugin.config.listAccountIds(cfg);
			const configuredAccountIdSet = new Set(configuredAccountIds);
			const accountIds = [.../* @__PURE__ */ new Set([...configuredAccountIds, ...Object.keys(runtime.channelAccounts[channelId] ?? {})])];
			const defaultAccountId = resolveChannelDefaultAccountId({
				plugin,
				cfg,
				accountIds: configuredAccountIds
			});
			const resolvedAccounts = {};
			const { results } = await runTasksWithConcurrency({
				tasks: accountIds.map((accountId) => async () => await buildAccountSnapshot(channelId, plugin, accountId, configuredAccountIdSet.has(accountId))),
				limit: probe ? CHANNEL_STATUS_PROBE_CONCURRENCY : accountIds.length || 1,
				onTaskError: (error, index) => {
					const accountId = accountIds[index] ?? `account ${index + 1}`;
					statusWarnings.push(`${channelId}:${accountId} status failed: ${formatForLog(error)}`);
				}
			});
			const accounts = [];
			for (const result of results) if (result) {
				if ("account" in result) resolvedAccounts[result.accountId] = result.account;
				accounts.push(result.snapshot);
			}
			return {
				accounts,
				defaultAccountId,
				defaultAccount: accounts.find((entry) => entry.accountId === defaultAccountId) ?? accounts.find((entry) => configuredAccountIdSet.has(entry.accountId)),
				resolvedAccounts
			};
		};
		const uiCatalog = buildChannelUiCatalog(selectedPlugins);
		const channelsMap = {};
		const accountsMap = {};
		const defaultAccountIdMap = {};
		const payload = {
			ts: Date.now(),
			channelOrder: uiCatalog.order,
			channelLabels: uiCatalog.labels,
			channelDetailLabels: uiCatalog.detailLabels,
			channelSystemImages: uiCatalog.systemImages,
			channelMeta: uiCatalog.entries,
			...context.getEventLoopHealth ? { eventLoop: context.getEventLoopHealth() } : {},
			channels: channelsMap,
			channelAccounts: accountsMap,
			channelDefaultAccountId: defaultAccountIdMap
		};
		const { results: channelResults } = await runTasksWithConcurrency({
			tasks: statusPlugins.map((plugin) => async () => {
				const { accounts, defaultAccountId, defaultAccount, resolvedAccounts } = await buildChannelAccounts(plugin);
				const fallbackSummary = (lastError = defaultAccount?.lastError) => ({
					configured: defaultAccount?.configured ?? false,
					...lastError ? { lastError } : {}
				});
				let summary = fallbackSummary();
				if (plugin.status?.buildChannelSummary && Object.hasOwn(resolvedAccounts, defaultAccountId)) {
					const summaryResult = await runChannelStatusHook({
						step: "summary",
						channelId: plugin.id,
						timeoutMs,
						warnings: statusWarnings,
						run: () => plugin.status.buildChannelSummary({
							account: resolvedAccounts[defaultAccountId],
							cfg,
							defaultAccountId,
							snapshot: defaultAccount ?? { accountId: defaultAccountId }
						})
					});
					summary = summaryResult.ok ? redactChannelStatusSummaryBaseUrl(summaryResult.value) : fallbackSummary(summaryResult.error);
				}
				return {
					pluginId: plugin.id,
					summary,
					accounts,
					defaultAccountId
				};
			}),
			limit: probe ? CHANNEL_STATUS_PROBE_CONCURRENCY : selectedPlugins.length || 1,
			onTaskError: (error, index) => {
				const channelId = statusPlugins[index]?.id ?? `channel ${index + 1}`;
				statusWarnings.push(`${channelId} channel status failed: ${formatForLog(error)}`);
			}
		});
		for (const result of channelResults) if (result) {
			channelsMap[result.pluginId] = result.summary;
			accountsMap[result.pluginId] = result.accounts;
			defaultAccountIdMap[result.pluginId] = result.defaultAccountId;
		}
		payload.statusIssues = collectGatewayChannelStatusIssues({
			payload,
			plugins: statusPlugins,
			reloadingChannels: runtime.reloadingChannels,
			defaultAccountIds: defaultAccountIdMap,
			context,
			warnings: statusWarnings
		});
		if (statusWarnings.length > 0) {
			payload.partial = true;
			payload.warnings = statusWarnings.toSorted().slice(0, 50);
		}
		respond(true, payload, void 0);
	},
	"channels.start": channelAccountOperationHandler("channels.start", validateChannelsStartParams, startChannelAccount),
	"channels.stop": channelAccountOperationHandler("channels.stop", validateChannelsStopParams, stopChannelAccount),
	"channels.logout": async (invocation) => {
		const { params, respond, context } = invocation;
		const resolved = resolveChannelOperationParams({
			method: "channels.logout",
			rawParams: params,
			respond,
			validate: validateChannelsLogoutParams
		});
		if (!resolved) return;
		const { params: parsedParams, channelId, plugin } = resolved;
		const accountId = parsedParams.accountId;
		const methodRegistry = context.getGatewayMethodRegistry?.();
		const requestAuthority = readGatewayRequestMutationAuthority(invocation);
		if (!(await readConfigFileSnapshot()).valid) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "config invalid; fix it before logging out"));
			return;
		}
		await respondUnavailableOnThrow(respond, async () => {
			respond(true, await logoutChannelAccount({
				channelId,
				accountId,
				cfg: context.getRuntimeConfig(),
				context,
				plugin,
				methodRegistry,
				assertRequestCurrent: requestAuthority.assertCurrent
			}), void 0);
		});
	}
};
//#endregion
export { channelsHandlers };
