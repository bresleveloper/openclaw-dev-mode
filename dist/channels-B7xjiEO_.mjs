import { s as raceWithTimeout } from "./src-Bzfi3cQM.mjs";
import "./session-key-CSDERtm3.mjs";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-ifCOO7_9.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-DKVgg-js.mjs";
import { G as validateChannelsStopParams, Ng as errorShape, U as validateChannelsStartParams, W as validateChannelsStatusParams, z as validateChannelsLogoutParams } from "./src-pLJQA6J5.mjs";
import { s as readConfigFileSnapshot } from "./io.runtime-Ds5uC0Bf.mjs";
import { t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import "./plugins-CCVkYF8m.mjs";
import "./config-B3oiWDlr.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { r as resolveChannelAccount } from "./account-resolution-akTcFkRf.mjs";
import { t as formatForLog } from "./ws-log-BIFX57Bv.mjs";
import { a as resolveChannelHealthState, n as DEFAULT_CHANNEL_STALE_EVENT_THRESHOLD_MS, t as DEFAULT_CHANNEL_CONNECT_GRACE_MS } from "./channel-health-policy-cv1tBUoD.mjs";
import { n as respondUnavailableOnThrow } from "./response-ajmyFl3V.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { t as buildChannelUiCatalog } from "./catalog-CUtkjPo2.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-CYrCYT-h.mjs";
import { n as listReadOnlyChannelPluginsForConfigAsync } from "./read-only-BTHRPuD9.mjs";
import { t as getChannelActivity } from "./channel-activity-Bn5LeXyE.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-ClTdEKsf.mjs";
import { t as isAccountEnabled } from "./account-enabled-ClTLgAXM.mjs";
import { s as redactChannelStatusSummaryBaseUrl } from "./account-snapshot-fields-BIlgyhxH.mjs";
import { a as resolveUnavailableChannelAccountSnapshot } from "./account-state-0YA3UWGA.mjs";
import { n as buildChannelAccountSnapshotFromRuntime, t as buildChannelAccountSnapshotFromInspection } from "./account-summary-DHgRbD3b.mjs";
import { t as buildChannelAccountSnapshotFromAccount } from "./status-Dlx2ocaa.mjs";
import { t as collectChannelStatusIssues } from "./channels-status-issues-DRa6QOeK.mjs";
import { n as resolveChannelGatewayAccountId, r as resolveRuntimeAccountSnapshot, t as logoutChannelAccount } from "./channels-account-B-zGVpin.mjs";
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
	const channelId = normalizeAnyChannelId(rawChannel);
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
	const timeoutMs = params.timeoutMs;
	const warningPrefix = `${params.channelId}${params.accountId === void 0 ? "" : `:${params.accountId}`} ${params.step}`;
	try {
		const pending = Promise.resolve().then(params.run).then((value) => ({
			ok: true,
			value
		}));
		const result = timeoutMs === void 0 ? await pending : await raceWithTimeout(pending, timeoutMs, () => ({
			ok: false,
			timedOut: true,
			error: `${params.step} timed out after ${timeoutMs}ms`
		}), { ref: false });
		if (!result.ok) params.warnings.push(`${warningPrefix} timed out after ${timeoutMs}ms`);
		return result;
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
async function changeChannelAccount(params, action) {
	if (action === "start" && !params.plugin.gateway?.startAccount) throw new Error(`Channel ${params.channelId} does not support runtime start`);
	const accountId = resolveChannelGatewayAccountId(params, () => params.context.getRuntimeSnapshot({
		channelId: params.channelId,
		inspectAccounts: false
	}));
	const outcomes = action === "start" ? await params.context.startChannel(params.channelId, accountId, { manual: true }) : await params.context.stopChannel(params.channelId, accountId);
	const outcome = action === "start" && outcomes ? outcomes.get(accountId) : void 0;
	if (action === "start" && !outcome) throw new Error(`Channel ${params.channelId} did not report a start outcome for ${accountId}`);
	const runtime = params.context.getRuntimeSnapshot({
		channelId: params.channelId,
		inspectAccounts: false
	});
	const running = resolveRuntimeAccountSnapshot({
		runtime,
		channelId: params.channelId,
		accountId
	})?.running === true;
	const result = {
		channel: params.channelId,
		accountId
	};
	if (action === "stop") return {
		...result,
		stopped: !running
	};
	const deferredIssue = resolveDeferredChannelReloadIssue(params.context, params.channelId, accountId);
	return {
		...result,
		started: running,
		outcome,
		...deferredIssue ? { statusIssues: [deferredIssue] } : {}
	};
}
const channelsHandlers = {
	"channels.status": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateChannelsStatusParams, "channels.status", respond)) return;
		const probe = params.probe === true;
		const timeoutMs = Math.min(Math.max(1e3, params.timeoutMs ?? (probe ? CHANNEL_STATUS_MAX_TIMEOUT_MS : 1e4)), CHANNEL_STATUS_MAX_TIMEOUT_MS);
		const rawChannel = params.channel;
		const cfg = context.getRuntimeConfig();
		const plugins = await listReadOnlyChannelPluginsForConfigAsync(cfg);
		const requestedChannel = rawChannel !== void 0 ? normalizeAnyChannelId(rawChannel) ?? plugins.find((plugin) => plugin.id === rawChannel.trim().toLowerCase())?.id : void 0;
		const selectedPlugins = requestedChannel ? plugins.filter((plugin) => plugin.id === requestedChannel) : plugins;
		const statusPlugins = selectedPlugins.toSorted((left, right) => left.id < right.id ? -1 : left.id > right.id ? 1 : 0);
		if (rawChannel !== void 0 && !requestedChannel) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown channel: ${formatForLog(rawChannel)}`));
			return;
		}
		const runtime = context.getRuntimeSnapshot({
			channelId: requestedChannel,
			inspectAccounts: false
		});
		const statusWarnings = [];
		const buildAccountSnapshot = async (channelId, plugin, accountId, listed, remainingBudget) => {
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
			if (!remainingBudget) return {
				accountId,
				snapshot: buildChannelAccountSnapshotFromInspection({
					account: plugin.config.inspectAccount?.(cfg, accountId),
					accountId,
					runtime: runtimeSnapshot
				})
			};
			remainingBudget();
			const account = await resolveChannelAccount({
				plugin,
				cfg,
				accountId
			});
			remainingBudget();
			const enabled = plugin.config.isEnabled?.(account, cfg) ?? isAccountEnabled(account);
			let probeResult;
			let auditResult;
			let lastProbeAt = null;
			for (const step of ["probe", "audit"]) {
				if (!enabled || !plugin.status?.[`${step}Account`]) continue;
				remainingBudget();
				if (plugin.config.isConfigured && !await plugin.config.isConfigured(account, cfg)) continue;
				remainingBudget();
				const result = await runChannelStatusHook({
					channelId,
					accountId,
					step,
					warnings: statusWarnings,
					run: () => {
						return plugin.status[`${step}Account`]({
							account,
							timeoutMs: remainingBudget(),
							cfg,
							...step === "audit" ? { probe: probeResult } : {}
						});
					}
				});
				if (step === "probe") {
					probeResult = result.ok ? result.value : result;
					lastProbeAt = Date.now();
				} else auditResult = result.ok ? result.value : result;
			}
			remainingBudget();
			const snapshot = await buildChannelAccountSnapshotFromAccount({
				plugin,
				cfg,
				accountId,
				account,
				runtime: runtimeSnapshot,
				probe: probeResult,
				audit: auditResult,
				assertActive: remainingBudget
			});
			const hookError = channelStatusFailureMessage(auditResult) ?? channelStatusFailureMessage(probeResult);
			if (hookError && !snapshot.lastError) snapshot.lastError = hookError;
			if (lastProbeAt) snapshot.lastProbeAt = lastProbeAt;
			return {
				accountId,
				account,
				snapshot
			};
		};
		const buildChannelAccounts = async (plugin, remainingBudget) => {
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
				tasks: accountIds.map((accountId) => async () => await buildAccountSnapshot(channelId, plugin, accountId, configuredAccountIdSet.has(accountId), remainingBudget)),
				limit: remainingBudget ? CHANNEL_STATUS_PROBE_CONCURRENCY : accountIds.length || 1,
				onTaskError: (error, index) => {
					const accountId = accountIds[index] ?? `account ${index + 1}`;
					statusWarnings.push(`${channelId}:${accountId} status failed: ${formatForLog(error)}`);
				}
			});
			const accounts = [];
			for (const result of results) if (result) {
				const { snapshot, accountId } = result;
				const activity = getChannelActivity({
					channel: channelId,
					accountId
				});
				snapshot.lastInboundAt ??= activity.inboundAt;
				snapshot.lastOutboundAt ??= activity.outboundAt;
				snapshot.healthState = resolveChannelHealthState(snapshot, {
					channelId,
					now: Date.now(),
					staleEventThresholdMs: DEFAULT_CHANNEL_STALE_EVENT_THRESHOLD_MS,
					channelConnectGraceMs: DEFAULT_CHANNEL_CONNECT_GRACE_MS
				});
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
				const deadline = Date.now() + timeoutMs;
				const abort = probe ? new AbortController() : void 0;
				const remainingBudget = () => {
					abort?.signal.throwIfAborted();
					const remaining = deadline - Date.now();
					if (remaining <= 0) throw new Error(`status timed out after ${timeoutMs}ms`);
					return remaining;
				};
				const build = async (live, error) => {
					const { accounts, defaultAccountId, defaultAccount, resolvedAccounts } = await buildChannelAccounts(plugin, live ? remainingBudget : void 0);
					if (error) for (const account of accounts) account.lastError ||= error;
					const fallbackSummary = (lastError = defaultAccount?.lastError) => ({
						...!live ? defaultAccount : void 0,
						configured: defaultAccount?.configured ?? (live ? false : void 0),
						...lastError ? { lastError } : {}
					});
					let summary = fallbackSummary();
					if (Date.now() < deadline && plugin.status?.buildChannelSummary && Object.hasOwn(resolvedAccounts, defaultAccountId)) {
						const summaryResult = await runChannelStatusHook({
							step: "summary",
							channelId: plugin.id,
							warnings: statusWarnings,
							run: () => {
								remainingBudget();
								return plugin.status.buildChannelSummary({
									account: resolvedAccounts[defaultAccountId],
									cfg,
									defaultAccountId,
									snapshot: defaultAccount ?? { accountId: defaultAccountId }
								});
							}
						});
						summary = summaryResult.ok ? redactChannelStatusSummaryBaseUrl(summaryResult.value) : fallbackSummary(summaryResult.error);
					}
					return {
						pluginId: plugin.id,
						summary,
						accounts,
						defaultAccountId
					};
				};
				if (!probe) return await build(false);
				const result = await runChannelStatusHook({
					step: "status",
					channelId: plugin.id,
					timeoutMs,
					warnings: statusWarnings,
					run: () => build(true)
				});
				if (result.ok && Date.now() < deadline) return result.value;
				abort?.abort();
				const error = result.ok ? `status timed out after ${timeoutMs}ms` : result.error;
				if (result.ok) statusWarnings.push(`${plugin.id} ${error}`);
				return await build(false, error);
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
	"channels.start": channelAccountOperationHandler("channels.start", validateChannelsStartParams, (params) => changeChannelAccount(params, "start")),
	"channels.stop": channelAccountOperationHandler("channels.stop", validateChannelsStopParams, (params) => changeChannelAccount(params, "stop")),
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
