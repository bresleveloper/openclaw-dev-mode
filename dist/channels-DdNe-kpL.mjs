import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-B1bfbA5J.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { B as validateChannelsStatusParams, F as validateChannelsLogoutParams, V as validateChannelsStopParams, z as validateChannelsStartParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { i as normalizeChannelId, t as getChannelPlugin } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { t as buildChannelUiCatalog } from "./catalog-soE9Hrg0.mjs";
import { t as listReadOnlyChannelPluginsForConfig } from "./read-only-BvrVstXM.mjs";
import { t as getChannelActivity } from "./channel-activity-KGHrbxIK.mjs";
import { t as isAccountEnabled } from "./account-enabled-ClTLgAXM.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-t_ym8v5h.mjs";
import { s as redactChannelStatusSummaryBaseUrl } from "./account-snapshot-fields-DpvG7B4L.mjs";
import { a as resolveUnavailableChannelAccountSnapshot } from "./account-state-Bap6_YQI.mjs";
import { n as buildChannelAccountSnapshotFromRuntime } from "./account-summary-DhBHrWxT.mjs";
import { t as formatForLog } from "./ws-log-DGu5Y--9.mjs";
import { t as buildChannelAccountSnapshotFromAccount } from "./status-CNILp5Aq.mjs";
import { i as resolveChannelHealthState, n as DEFAULT_CHANNEL_STALE_EVENT_THRESHOLD_MS, t as DEFAULT_CHANNEL_CONNECT_GRACE_MS } from "./channel-health-policy-DnqLKLPL.mjs";
import { t as collectChannelStatusIssues } from "./channels-status-issues-YkUebnBD.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { n as respondUnavailableOnThrow } from "./response-Chzawb7u.mjs";
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
//#endregion
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
	const channelId = typeof rawChannel === "string" ? normalizeChannelId(rawChannel) : null;
	if (!channelId) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid ${params.method} channel`));
		return null;
	}
	return {
		params: rawParams,
		rawChannel,
		channelId
	};
}
async function respondWithChannelOperationPayload(params) {
	await respondUnavailableOnThrow(params.respond, async () => {
		params.respond(true, await params.run(), void 0);
	});
}
const CHANNEL_STATUS_MAX_TIMEOUT_MS = 3e4;
const CHANNEL_STATUS_PROBE_CONCURRENCY = 5;
function channelStatusTimeoutPayload(step, timeoutMs) {
	return {
		ok: false,
		timedOut: true,
		error: `${step} timed out after ${timeoutMs}ms`
	};
}
async function raceWithTimeout(params) {
	const timeoutMs = params.timeoutMs;
	let timer = null;
	const timeout = new Promise((resolve) => {
		timer = setTimeout(() => resolve({ kind: "timeout" }), timeoutMs);
		if (typeof timer === "object" && "unref" in timer) timer.unref();
	});
	const result = await Promise.race([Promise.resolve().then(params.run).then((value) => ({
		kind: "value",
		value
	}), (error) => ({
		kind: "error",
		error
	})), timeout]);
	if (timer) clearTimeout(timer);
	return result;
}
async function runChannelStatusHook(params) {
	const timeoutMs = Math.max(1, params.timeoutMs);
	const result = await raceWithTimeout({
		timeoutMs,
		run: params.run
	});
	if (result.kind === "value") return result.value;
	const warningPrefix = `${params.channelId}:${params.accountId} ${params.step}`;
	if (result.kind === "timeout") {
		params.warnings.push(`${warningPrefix} timed out after ${timeoutMs}ms`);
		return channelStatusTimeoutPayload(params.step, timeoutMs);
	}
	const message = formatForLog(result.error);
	params.warnings.push(`${warningPrefix} failed: ${message}`);
	return {
		ok: false,
		error: message
	};
}
async function runChannelStatusSummary(params) {
	const timeoutMs = Math.max(1, params.timeoutMs);
	const result = await raceWithTimeout({
		timeoutMs,
		run: params.run
	});
	const warningPrefix = `${params.channelId} summary`;
	if (result.kind === "value") return {
		ok: true,
		value: redactChannelStatusSummaryBaseUrl(result.value)
	};
	if (result.kind === "timeout") {
		const error = `summary timed out after ${timeoutMs}ms`;
		params.warnings.push(`${warningPrefix} timed out after ${timeoutMs}ms`);
		return {
			ok: false,
			timedOut: true,
			error
		};
	}
	const message = formatForLog(result.error);
	params.warnings.push(`${warningPrefix} failed: ${message}`);
	return {
		ok: false,
		error: message
	};
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
/** Log out one channel account through its owning channel plugin. */
async function logoutChannelAccount(params) {
	const resolvedAccountId = resolveChannelGatewayAccountId(params);
	const account = params.plugin.config.resolveAccount(params.cfg, resolvedAccountId);
	await params.context.stopChannel(params.channelId, resolvedAccountId);
	const result = await params.plugin.gateway?.logoutAccount?.({
		cfg: params.cfg,
		accountId: resolvedAccountId,
		account,
		runtime: defaultRuntime
	});
	if (!result) throw new Error(`Channel ${params.channelId} does not support logout`);
	const cleared = result.cleared;
	if (typeof result.loggedOut === "boolean" ? result.loggedOut : cleared) params.context.markChannelLoggedOut(params.channelId, true, resolvedAccountId);
	return {
		channel: params.channelId,
		accountId: resolvedAccountId,
		...result,
		cleared
	};
}
/** Start one channel account through its owning channel plugin. */
async function startChannelAccount(params) {
	if (!params.plugin.gateway?.startAccount) throw new Error(`Channel ${params.channelId} does not support runtime start`);
	const resolvedAccountId = resolveChannelGatewayAccountId(params, () => params.context.getRuntimeSnapshot({
		channelId: params.channelId,
		inspectAccounts: false
	}));
	const outcome = (await params.context.startChannel(params.channelId, resolvedAccountId, { manual: true })).get(resolvedAccountId);
	if (!outcome) throw new Error(`Channel ${params.channelId} did not report a start outcome for ${resolvedAccountId}`);
	const started = resolveRuntimeAccountSnapshot({
		runtime: params.context.getRuntimeSnapshot({
			channelId: params.channelId,
			inspectAccounts: false
		}),
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
/** Stop one channel account through its owning channel plugin. */
async function stopChannelAccount(params) {
	const resolvedAccountId = resolveChannelGatewayAccountId(params, () => params.context.getRuntimeSnapshot({
		channelId: params.channelId,
		inspectAccounts: false
	}));
	await params.context.stopChannel(params.channelId, resolvedAccountId);
	const stopped = resolveRuntimeAccountSnapshot({
		runtime: params.context.getRuntimeSnapshot({
			channelId: params.channelId,
			inspectAccounts: false
		}),
		channelId: params.channelId,
		accountId: resolvedAccountId
	})?.running !== true;
	return {
		channel: params.channelId,
		accountId: resolvedAccountId,
		stopped
	};
}
/** Gateway request handlers for channel list, status, start, stop, and logout. */
const channelsHandlers = {
	"channels.status": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateChannelsStatusParams, "channels.status", respond)) return;
		const probe = params.probe === true;
		const timeoutMsRaw = params.timeoutMs;
		const timeoutMs = resolveChannelsStatusTimeoutMs({
			probe,
			timeoutMsRaw
		});
		const rawChannel = params.channel;
		const cfg = context.getRuntimeConfig();
		const plugins = listReadOnlyChannelPluginsForConfig(cfg);
		const requestedChannel = typeof rawChannel === "string" ? normalizeChannelId(rawChannel) ?? plugins.find((plugin) => plugin.id === rawChannel.trim().toLowerCase())?.id : void 0;
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
			const account = plugin.config.resolveAccount(cfg, accountId);
			const enabled = plugin.config.isEnabled?.(account, cfg) ?? isAccountEnabled(account);
			let probeResult;
			let lastProbeAt = null;
			if (probe && enabled && plugin.status?.probeAccount) {
				let configured = true;
				if (plugin.config.isConfigured) configured = await plugin.config.isConfigured(account, cfg);
				if (configured) {
					probeResult = await runChannelStatusHook({
						channelId,
						accountId,
						step: "probe",
						timeoutMs,
						warnings: statusWarnings,
						run: () => plugin.status.probeAccount({
							account,
							timeoutMs,
							cfg
						})
					});
					lastProbeAt = Date.now();
				}
			}
			let auditResult;
			if (probe && enabled && plugin.status?.auditAccount) {
				let configured = true;
				if (plugin.config.isConfigured) configured = await plugin.config.isConfigured(account, cfg);
				if (configured) auditResult = await runChannelStatusHook({
					channelId,
					accountId,
					step: "audit",
					timeoutMs,
					warnings: statusWarnings,
					run: () => plugin.status.auditAccount({
						account,
						timeoutMs,
						cfg,
						probe: probeResult
					})
				});
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
		const payload = {
			ts: Date.now(),
			channelOrder: uiCatalog.order,
			channelLabels: uiCatalog.labels,
			channelDetailLabels: uiCatalog.detailLabels,
			channelSystemImages: uiCatalog.systemImages,
			channelMeta: uiCatalog.entries,
			...context.getEventLoopHealth ? { eventLoop: context.getEventLoopHealth() } : {},
			channels: {},
			channelAccounts: {},
			channelDefaultAccountId: {}
		};
		const channelsMap = payload.channels;
		const accountsMap = payload.channelAccounts;
		const defaultAccountIdMap = payload.channelDefaultAccountId;
		const { results: channelResults } = await runTasksWithConcurrency({
			tasks: statusPlugins.map((plugin) => async () => {
				const { accounts, defaultAccountId, defaultAccount, resolvedAccounts } = await buildChannelAccounts(plugin);
				const fallbackSummary = (lastError = defaultAccount?.lastError) => ({
					configured: defaultAccount?.configured ?? false,
					...lastError ? { lastError } : {}
				});
				let summary = fallbackSummary();
				if (plugin.status?.buildChannelSummary && Object.hasOwn(resolvedAccounts, defaultAccountId)) {
					const summaryResult = await runChannelStatusSummary({
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
					summary = summaryResult.ok ? summaryResult.value : fallbackSummary(summaryResult.error);
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
	"channels.start": async ({ params, respond, context }) => {
		const resolved = resolveChannelOperationParams({
			method: "channels.start",
			rawParams: params,
			respond,
			validate: validateChannelsStartParams
		});
		if (!resolved) return;
		const { params: parsedParams, rawChannel, channelId } = resolved;
		const plugin = getChannelPlugin(channelId);
		if (!plugin) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown channel: ${formatForLog(rawChannel)}`));
			return;
		}
		if (!plugin.gateway?.startAccount) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `channel ${channelId} does not support start`));
			return;
		}
		await respondWithChannelOperationPayload({
			respond,
			run: () => startChannelAccount({
				channelId,
				accountId: parsedParams.accountId,
				cfg: context.getRuntimeConfig(),
				context,
				plugin
			})
		});
	},
	"channels.stop": async ({ params, respond, context }) => {
		const resolved = resolveChannelOperationParams({
			method: "channels.stop",
			rawParams: params,
			respond,
			validate: validateChannelsStopParams
		});
		if (!resolved) return;
		const { params: parsedParams, channelId } = resolved;
		const plugin = getChannelPlugin(channelId);
		if (!plugin) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown channel ${channelId}`));
			return;
		}
		await respondWithChannelOperationPayload({
			respond,
			run: () => stopChannelAccount({
				channelId,
				accountId: parsedParams.accountId,
				cfg: context.getRuntimeConfig(),
				context,
				plugin
			})
		});
	},
	"channels.logout": async ({ params, respond, context }) => {
		const resolved = resolveChannelOperationParams({
			method: "channels.logout",
			rawParams: params,
			respond,
			validate: validateChannelsLogoutParams
		});
		if (!resolved) return;
		const { params: parsedParams, channelId } = resolved;
		const plugin = getChannelPlugin(channelId);
		if (!plugin?.gateway?.logoutAccount) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `channel ${channelId} does not support logout`));
			return;
		}
		const accountId = parsedParams.accountId;
		if (!(await readConfigFileSnapshot()).valid) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "config invalid; fix it before logging out"));
			return;
		}
		await respondWithChannelOperationPayload({
			respond,
			run: () => logoutChannelAccount({
				channelId,
				accountId,
				cfg: context.getRuntimeConfig(),
				context,
				plugin
			})
		});
	}
};
//#endregion
export { channelsHandlers };
