import { n as isTruthyEnvValue } from "./env-CKmI-C4z.js";
import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { n as loadInstalledPluginIndexInstallRecordsSync, t as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-CZE4dDG4.js";
import { i as getRuntimeConfig } from "./io-BJfjPmGW.js";
import "./installed-plugin-index-records-BiW0BXs2.js";
import { n as formatConfigIssueLines } from "./issue-format-RCKTtsD6.js";
import { h as resolveConfigWriteFollowUp } from "./runtime-snapshot-D93_HOsR.js";
import "./config-A41fTHlt.js";
import { n as isRestartEnabled } from "./commands.flags-BUxITaVI.js";
import { f as resolveGatewayRestartDeferralTimeoutMs, m as setGatewaySigusr1RestartPolicy, o as deferGatewayRestartUntilIdle, s as emitGatewayRestart } from "./restart-D2h2urGo.js";
import { a as resetModelCatalogCache, n as loadModelCatalog } from "./model-catalog-DD_dq4PJ.js";
import { r as clearCurrentProviderAuthState } from "./model-provider-auth-state-DW_JYm-o.js";
import { i as warmCurrentProviderAuthStateOffMainThread } from "./model-provider-auth-BQ-E242H.js";
import { d as listActiveEmbeddedRunSessionKeys, l as getActiveEmbeddedRunCount, u as listActiveEmbeddedRunSessionIds } from "./run-state-rO_N-hh3.js";
import { a as refreshContextWindowCache } from "./context-CDxACcUL.js";
import { u as getTotalQueueSize } from "./command-queue-JAuVCy9E.js";
import { n as getInspectableActiveTaskRestartBlockers } from "./task-registry.maintenance-BHshvxPQ.js";
import { r as disposeAllSessionMcpRuntimes } from "./agent-bundle-mcp-runtime-BkUYqKo5.js";
import "./agent-bundle-mcp-tools-CJT5lUbs.js";
import { n as clearSecretsRuntimeSnapshot, o as getActiveSecretsRuntimeSnapshot } from "./runtime-state-DnfU3-5B.js";
import { r as resetDirectoryCache } from "./target-resolver-BpCIOvtz.js";
import { t as bumpSkillsSnapshotVersion } from "./refresh-state-DHnXO3IV.js";
import { t as getTotalPendingReplies } from "./dispatcher-registry-CaTZukRA.js";
import { v as resolveHooksConfig } from "./hooks-_LPHouP-.js";
import { n as markGatewayModelCatalogStaleForReload } from "./server-model-catalog-9QOMQWSz.js";
import { a as diffConfigPaths, n as listPluginInstallTimestampMetadataPaths, r as listPluginInstallWholeRecordPaths, t as buildGatewayReloadPlan } from "./config-reload-plan-BtHfBeWP.js";
import { t as resolveGatewayReloadSettings } from "./config-reload-settings-BUK2a-7x.js";
import { a as setCurrentSharedGatewaySessionGeneration, n as disconnectStaleSharedGatewayAuthClients } from "./server-shared-auth-generation-kMfFmuwl.js";
import { t as buildGatewayCronService } from "./server-cron-J0Y3VSpy.js";
import { n as applyGatewayLaneConcurrency, t as resolveHookClientIpConfig } from "./hook-client-ip-config-DoQIyDw-.js";
import { t as startGatewayChannelHealthMonitor } from "./server-runtime-startup-services-DolMkW8Z.js";
import { i as startGatewayCronWithLogging } from "./server-runtime-services-Bjru84sy.js";
import chokidar from "chokidar";
//#region src/gateway/config-reload.ts
const MISSING_CONFIG_RETRY_DELAY_MS = 150;
const MISSING_CONFIG_MAX_RETRIES = 2;
const WATCHER_RECREATE_MAX_RETRIES = 3;
const WATCHER_RECREATE_BACKOFF_MS = [
	500,
	2e3,
	5e3
];
function resolveChokidarUsePolling(degradedToPolling) {
	const envPoll = process.env.CHOKIDAR_USEPOLLING;
	if (envPoll !== void 0) {
		const envLower = envPoll.toLowerCase();
		if (envLower === "false" || envLower === "0") return false;
		if (envLower === "true" || envLower === "1") return true;
		return Boolean(envLower);
	}
	return Boolean(process.env.VITEST) || degradedToPolling;
}
/**
* Paths under `skills.*` always change the snapshot that sessions cache in
* sessions.json. Any prefix match here (for example `skills.allowBundled`,
* `skills.entries.X.enabled`, `skills.profile`) forces sessions to rebuild
* their snapshot on the next turn rather than silently advertising stale
* tools to the model.
*/
const SKILLS_INVALIDATION_PREFIXES = ["skills"];
function matchesSkillsInvalidationPrefix(path) {
	return SKILLS_INVALIDATION_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}.`));
}
function firstSkillsChangedPath(changedPaths) {
	return changedPaths.find(matchesSkillsInvalidationPrefix);
}
function isNoopReloadPlan(plan) {
	return !plan.restartGateway && plan.hotReasons.length === 0 && !plan.reloadHooks && !plan.restartGmailWatcher && !plan.restartCron && !plan.restartHeartbeat && !plan.restartHealthMonitor && !plan.reloadPlugins && !plan.disposeMcpRuntimes && plan.restartChannels.size === 0;
}
function asPluginInstallConfig(records) {
	return { plugins: { installs: records } };
}
function startGatewayConfigReloader(opts) {
	let currentConfig = opts.initialConfig;
	let currentCompareConfig = opts.initialCompareConfig ?? opts.initialConfig;
	let settings = resolveGatewayReloadSettings(currentConfig);
	let debounceTimer = null;
	let pending = false;
	let running = false;
	let stopped = false;
	let restartQueued = false;
	let missingConfigRetries = 0;
	let pendingInProcessConfig = null;
	let lastAppliedWriteHash = opts.initialInternalWriteHash ?? null;
	let currentPluginInstallRecords = opts.initialPluginInstallRecords ?? loadInstalledPluginIndexInstallRecordsSync();
	const readPluginInstallRecords = opts.readPluginInstallRecords ?? loadInstalledPluginIndexInstallRecords;
	const scheduleAfter = (wait) => {
		if (stopped) return;
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			runReload();
		}, wait);
	};
	const schedule = () => {
		scheduleAfter(settings.debounceMs);
	};
	const queueRestart = (plan, nextConfig) => {
		if (restartQueued) return;
		restartQueued = true;
		(async () => {
			try {
				await opts.onRestart(plan, nextConfig);
			} catch (err) {
				restartQueued = false;
				opts.log.error(`config restart failed: ${String(err)}`);
			}
		})();
	};
	const handleMissingSnapshot = (snapshot) => {
		if (snapshot.exists) {
			missingConfigRetries = 0;
			return false;
		}
		if (missingConfigRetries < MISSING_CONFIG_MAX_RETRIES) {
			missingConfigRetries += 1;
			opts.log.info(`config reload retry (${missingConfigRetries}/${MISSING_CONFIG_MAX_RETRIES}): config file not found`);
			scheduleAfter(MISSING_CONFIG_RETRY_DELAY_MS);
			return true;
		}
		opts.log.warn("config reload skipped (config file not found)");
		return true;
	};
	const handleInvalidSnapshot = (snapshot) => {
		if (snapshot.valid) return false;
		const issues = formatConfigIssueLines(snapshot.issues, "").join(", ");
		opts.log.warn(`config reload skipped (invalid config): ${issues}`);
		return true;
	};
	const applySnapshot = async (nextConfig, nextCompareConfig, afterWrite) => {
		const configChangedPaths = diffConfigPaths(currentCompareConfig, nextCompareConfig);
		const configPluginInstallTimestampNoopPaths = listPluginInstallTimestampMetadataPaths(currentCompareConfig, nextCompareConfig);
		const configPluginInstallWholeRecordPaths = listPluginInstallWholeRecordPaths(currentCompareConfig, nextCompareConfig);
		let nextPluginInstallRecords = currentPluginInstallRecords;
		try {
			nextPluginInstallRecords = await readPluginInstallRecords();
		} catch (err) {
			opts.log.warn(`config reload plugin install record check failed: ${String(err)}`);
		}
		const previousPluginInstallConfig = asPluginInstallConfig(currentPluginInstallRecords);
		const nextPluginInstallConfig = asPluginInstallConfig(nextPluginInstallRecords);
		const pluginInstallRecordChangedPaths = diffConfigPaths(previousPluginInstallConfig, nextPluginInstallConfig);
		const pluginInstallRecordTimestampNoopPaths = listPluginInstallTimestampMetadataPaths(previousPluginInstallConfig, nextPluginInstallConfig);
		const pluginInstallRecordWholeRecordPaths = listPluginInstallWholeRecordPaths(previousPluginInstallConfig, nextPluginInstallConfig);
		const changedPaths = [...configChangedPaths, ...pluginInstallRecordChangedPaths];
		const pluginInstallTimestampNoopPaths = [...configPluginInstallTimestampNoopPaths, ...pluginInstallRecordTimestampNoopPaths];
		const pluginInstallWholeRecordPaths = [...configPluginInstallWholeRecordPaths, ...pluginInstallRecordWholeRecordPaths];
		currentConfig = nextConfig;
		currentCompareConfig = nextCompareConfig;
		currentPluginInstallRecords = nextPluginInstallRecords;
		settings = resolveGatewayReloadSettings(nextConfig);
		if (changedPaths.length === 0) return;
		const skillsChangedPath = firstSkillsChangedPath(changedPaths);
		if (skillsChangedPath !== void 0) {
			bumpSkillsSnapshotVersion({
				reason: "config-change",
				changedPath: skillsChangedPath
			});
			opts.log.info(`skills snapshot invalidated by config change (${skillsChangedPath})`);
		}
		const followUp = resolveConfigWriteFollowUp(afterWrite);
		opts.log.info(`config change detected; evaluating reload (${changedPaths.join(", ")})`);
		if (followUp.mode === "none") {
			opts.log.info(`config reload skipped by writer intent (${followUp.reason})`);
			return;
		}
		const plan = buildGatewayReloadPlan(changedPaths, {
			noopPaths: pluginInstallTimestampNoopPaths,
			forceChangedPaths: pluginInstallWholeRecordPaths
		});
		if (isNoopReloadPlan(plan) && !followUp.requiresRestart) return;
		if (settings.mode === "off") {
			opts.log.info("config reload disabled (gateway.reload.mode=off)");
			return;
		}
		if (followUp.requiresRestart) {
			queueRestart({
				...plan,
				restartGateway: true,
				restartReasons: [...plan.restartReasons, followUp.reason]
			}, nextConfig);
			return;
		}
		if (settings.mode === "restart") {
			queueRestart(plan, nextConfig);
			return;
		}
		if (plan.restartGateway) {
			if (settings.mode === "hot") {
				opts.log.warn(`config reload requires gateway restart; hot mode ignoring (${plan.restartReasons.join(", ")})`);
				return;
			}
			queueRestart(plan, nextConfig);
			return;
		}
		await opts.onHotReload(plan, nextConfig);
	};
	const promoteAcceptedSnapshot = async (snapshot, reason) => {
		if (!opts.promoteSnapshot || !snapshot.exists || !snapshot.valid) return;
		try {
			await opts.promoteSnapshot(snapshot, reason);
		} catch (err) {
			opts.log.warn(`config reload last-known-good promotion failed: ${String(err)}`);
		}
	};
	const promoteAcceptedInProcessWrite = async (persistedHash) => {
		if (!opts.promoteSnapshot) return;
		try {
			const snapshot = await opts.readSnapshot();
			if (snapshot.hash !== persistedHash || !snapshot.valid) return;
			await promoteAcceptedSnapshot(snapshot, "in-process-write");
		} catch (err) {
			opts.log.warn(`config reload in-process last-known-good promotion failed: ${String(err)}`);
		}
	};
	const runReload = async () => {
		if (stopped) return;
		if (running) {
			pending = true;
			return;
		}
		running = true;
		if (debounceTimer) {
			clearTimeout(debounceTimer);
			debounceTimer = null;
		}
		try {
			if (pendingInProcessConfig) {
				const pendingWrite = pendingInProcessConfig;
				pendingInProcessConfig = null;
				missingConfigRetries = 0;
				await applySnapshot(pendingWrite.config, pendingWrite.compareConfig, pendingWrite.afterWrite);
				await promoteAcceptedInProcessWrite(pendingWrite.persistedHash);
				return;
			}
			const snapshot = await opts.readSnapshot();
			if (lastAppliedWriteHash && typeof snapshot.hash === "string") {
				if (snapshot.hash === lastAppliedWriteHash) return;
				lastAppliedWriteHash = null;
			}
			if (handleMissingSnapshot(snapshot)) return;
			if (!snapshot.valid) {
				handleInvalidSnapshot(snapshot);
				return;
			}
			await applySnapshot(snapshot.config, snapshot.sourceConfig);
			await promoteAcceptedSnapshot(snapshot, "valid-config");
		} catch (err) {
			opts.log.error(`config reload failed: ${String(err)}`);
		} finally {
			running = false;
			if (pending) {
				pending = false;
				schedule();
			}
		}
	};
	const scheduleFromWatcher = () => {
		schedule();
	};
	const unsubscribeFromWrites = opts.subscribeToWrites?.((event) => {
		if (event.configPath !== opts.watchPath) return;
		pendingInProcessConfig = {
			config: event.runtimeConfig,
			compareConfig: event.sourceConfig,
			persistedHash: event.persistedHash,
			afterWrite: event.afterWrite
		};
		lastAppliedWriteHash = event.persistedHash;
		scheduleAfter(0);
	}) ?? (() => {});
	let watcher = null;
	let watcherRecreateRetries = 0;
	let watcherRecreateTimer = null;
	let hotReloadStatus = "active";
	let degradedToPolling = false;
	let watcherUsesPolling = false;
	const createWatcher = () => {
		if (stopped) return;
		const usePolling = resolveChokidarUsePolling(degradedToPolling);
		const next = chokidar.watch(opts.watchPath, {
			ignoreInitial: true,
			awaitWriteFinish: {
				stabilityThreshold: 200,
				pollInterval: 50
			},
			usePolling
		});
		next.on("add", scheduleFromWatcher);
		next.on("change", scheduleFromWatcher);
		next.on("unlink", scheduleFromWatcher);
		next.on("error", (err) => {
			handleWatcherError(next, err);
		});
		watcher = next;
		watcherUsesPolling = next.options.usePolling;
		hotReloadStatus = "active";
	};
	const handleWatcherError = (source, err) => {
		if (stopped || source !== watcher) return;
		const failedWatcherUsedPolling = watcherUsesPolling;
		watcher = null;
		watcherUsesPolling = false;
		source?.close().catch(() => {});
		if (watcherRecreateRetries >= WATCHER_RECREATE_MAX_RETRIES) {
			if (!failedWatcherUsedPolling && resolveChokidarUsePolling(true)) {
				degradedToPolling = true;
				watcherRecreateRetries = 0;
				opts.log.warn(`config watcher native retries exhausted; degrading to polling mode: ${String(err)}`);
				watcherRecreateTimer = setTimeout(() => {
					watcherRecreateTimer = null;
					createWatcher();
				}, WATCHER_RECREATE_BACKOFF_MS[0] ?? 500);
				return;
			}
			const mode = failedWatcherUsedPolling ? "polling mode" : "native mode";
			hotReloadStatus = "disabled";
			opts.log.error(`config hot-reload disabled: watcher failed after ${WATCHER_RECREATE_MAX_RETRIES} re-create attempts in ${mode}: ${String(err)}`);
			return;
		}
		const backoff = WATCHER_RECREATE_BACKOFF_MS[watcherRecreateRetries] ?? WATCHER_RECREATE_BACKOFF_MS[WATCHER_RECREATE_BACKOFF_MS.length - 1] ?? 0;
		watcherRecreateRetries += 1;
		opts.log.warn(`config watcher error; re-creating watcher (attempt ${watcherRecreateRetries}/${WATCHER_RECREATE_MAX_RETRIES} in ${backoff}ms): ${String(err)}`);
		watcherRecreateTimer = setTimeout(() => {
			watcherRecreateTimer = null;
			createWatcher();
		}, backoff);
	};
	createWatcher();
	return {
		stop: async () => {
			stopped = true;
			if (debounceTimer) clearTimeout(debounceTimer);
			debounceTimer = null;
			if (watcherRecreateTimer) {
				clearTimeout(watcherRecreateTimer);
				watcherRecreateTimer = null;
			}
			unsubscribeFromWrites();
			const active = watcher;
			watcher = null;
			await active?.close().catch(() => {});
		},
		hotReloadStatus: () => hotReloadStatus
	};
}
//#endregion
//#region src/gateway/server-reload-handlers.ts
async function activateSecretsRuntimeSnapshot(snapshot) {
	(await import("./runtime-5iHgILE0.js")).activateSecretsRuntimeSnapshot(snapshot);
}
const MCP_RUNTIME_RELOAD_DISPOSE_TIMEOUT_MS = 5e3;
const CHANNEL_RELOAD_DEFERRAL_POLL_MS = 500;
const CHANNEL_RELOAD_STILL_PENDING_WARN_MS = 3e4;
function resetPreparedModelRuntimeStateForHotReload() {
	resetModelCatalogCache();
	clearCurrentProviderAuthState();
	markGatewayModelCatalogStaleForReload();
}
function shouldRefreshContextWindowCache(plan) {
	return plan.reloadPlugins || plan.changedPaths.some((path) => path === "models" || path.startsWith("models.") || path === "agents" || path === "agents.defaults" || path === "agents.list" || path.startsWith("agents.list.") || path === "agents.defaults.workspace" || path.startsWith("agents.defaults.workspace."));
}
async function disposeMcpRuntimesWithTimeout(params) {
	let timer;
	const disposePromise = params.dispose().catch((error) => {
		params.onWarn(`${params.label} failed: ${String(error)}`);
	});
	const timeoutPromise = new Promise((resolve) => {
		timer = setTimeout(() => resolve("timeout"), params.timeoutMs);
		timer.unref?.();
	});
	const result = await Promise.race([disposePromise.then(() => "done"), timeoutPromise]);
	if (timer) clearTimeout(timer);
	if (result === "timeout") params.onWarn(`${params.label} exceeded ${params.timeoutMs}ms; continuing`);
}
async function collectChannelOperationFailures(params) {
	const failures = [];
	for (const channel of params.channels) try {
		await params.run(channel);
	} catch (err) {
		failures.push(channel);
		params.onFailure(channel, err);
	}
	return failures;
}
function createGatewayReloadHandlers(params) {
	const getActiveCounts = () => {
		const queueSize = getTotalQueueSize();
		const pendingReplies = getTotalPendingReplies();
		const embeddedRuns = getActiveEmbeddedRunCount();
		const activeTasks = getInspectableActiveTaskRestartBlockers().length;
		return {
			queueSize,
			pendingReplies,
			embeddedRuns,
			activeTasks,
			totalActive: queueSize + pendingReplies + embeddedRuns + activeTasks
		};
	};
	const formatActiveDetails = (counts) => {
		const details = [];
		if (counts.queueSize > 0) details.push(`${counts.queueSize} operation(s)`);
		if (counts.pendingReplies > 0) details.push(`${counts.pendingReplies} reply(ies)`);
		if (counts.embeddedRuns > 0) details.push(`${counts.embeddedRuns} embedded run(s)`);
		if (counts.activeTasks > 0) details.push(`${counts.activeTasks} background task run(s)`);
		return details;
	};
	const formatTaskBlocker = (task) => {
		return [
			`taskId=${task.taskId}`,
			task.runId ? `runId=${task.runId}` : null,
			`status=${task.status}`,
			`runtime=${task.runtime}`,
			task.label ? `label=${task.label}` : null,
			task.title ? `title=${task.title.slice(0, 80)}` : null
		].filter((value) => Boolean(value)).join(" ");
	};
	const formatTaskBlockers = () => {
		const blockers = getInspectableActiveTaskRestartBlockers();
		if (blockers.length === 0) return null;
		const shown = blockers.slice(0, 8).map(formatTaskBlocker);
		const omitted = blockers.length - shown.length;
		return omitted > 0 ? `${shown.join("; ")}; +${omitted} more` : shown.join("; ");
	};
	const collectActiveRestartSessionKeys = () => {
		return new Set(listActiveEmbeddedRunSessionKeys());
	};
	const collectActiveRestartSessionIds = () => {
		return new Set(listActiveEmbeddedRunSessionIds());
	};
	const markActiveMainSessionsForRestart = async (nextConfig, reason) => {
		const sessionKeys = collectActiveRestartSessionKeys();
		const sessionIds = collectActiveRestartSessionIds();
		if (sessionKeys.size === 0 && sessionIds.size === 0) return;
		const { markRestartAbortedMainSessions } = await import("./main-session-restart-recovery-CIXObXE7.js");
		await markRestartAbortedMainSessions({
			cfg: nextConfig,
			additionalCfgs: [getRuntimeConfig()],
			sessionKeys,
			sessionIds,
			reason
		});
	};
	const waitForActiveWorkBeforeChannelReload = async (channels, nextConfig) => {
		const initial = getActiveCounts();
		if (initial.totalActive <= 0) return;
		const channelNames = [...channels].join(", ");
		const initialDetails = formatActiveDetails(initial);
		params.logReload.warn(`config change requires channel reload (${channelNames}) — deferring until ${initialDetails.join(", ")} complete`);
		const timeoutMs = resolveGatewayRestartDeferralTimeoutMs(nextConfig.gateway?.reload?.deferralTimeoutMs);
		const startedAt = Date.now();
		let nextStillPendingAt = startedAt + CHANNEL_RELOAD_STILL_PENDING_WARN_MS;
		while (true) {
			await new Promise((resolve) => {
				setTimeout(resolve, CHANNEL_RELOAD_DEFERRAL_POLL_MS).unref?.();
			});
			const current = getActiveCounts();
			if (current.totalActive <= 0) {
				params.logReload.info("active operations and replies completed; reloading channels now");
				return;
			}
			const elapsedMs = Date.now() - startedAt;
			if (timeoutMs !== void 0 && elapsedMs >= timeoutMs) {
				const remaining = formatActiveDetails(current);
				params.logReload.warn(`channel reload timeout after ${elapsedMs}ms with ${remaining.join(", ")} still active; reloading channels anyway`);
				return;
			}
			if (Date.now() >= nextStillPendingAt) {
				const remaining = formatActiveDetails(current);
				params.logReload.warn(`channel reload still deferred after ${elapsedMs}ms with ${remaining.join(", ")} active`);
				nextStillPendingAt = Date.now() + CHANNEL_RELOAD_STILL_PENDING_WARN_MS;
			}
		}
	};
	const applyHotReload = async (plan, nextConfig) => {
		setGatewaySigusr1RestartPolicy({ allowExternal: isRestartEnabled(nextConfig) });
		const state = params.getState();
		const nextState = { ...state };
		resetPreparedModelRuntimeStateForHotReload();
		if (plan.reloadHooks) try {
			nextState.hooksConfig = resolveHooksConfig(nextConfig);
		} catch (err) {
			params.logHooks.warn(`hooks config reload failed: ${String(err)}`);
		}
		nextState.hookClientIpConfig = resolveHookClientIpConfig(nextConfig);
		if (plan.restartHeartbeat) nextState.heartbeatRunner.updateConfig(nextConfig);
		resetDirectoryCache();
		const channelsToRestart = new Set(plan.restartChannels);
		const channelsStoppedBeforePluginReload = /* @__PURE__ */ new Set();
		let activePluginChannelsAfterReload = null;
		const shouldSkipChannelRestart = () => isTruthyEnvValue(process.env.OPENCLAW_SKIP_CHANNELS) || isTruthyEnvValue(process.env.OPENCLAW_SKIP_PROVIDERS);
		if (plan.reloadPlugins) {
			const stopChannelsBeforePluginReplace = async (channels) => {
				for (const channel of channels) channelsToRestart.add(channel);
				if (channelsToRestart.size === 0 || shouldSkipChannelRestart()) return;
				await waitForActiveWorkBeforeChannelReload(channelsToRestart, nextConfig);
				const stoppedChannels = [];
				const stopFailures = await collectChannelOperationFailures({
					channels: channelsToRestart,
					run: async (channel) => {
						if (channelsStoppedBeforePluginReload.has(channel)) return;
						params.logChannels.info(`stopping ${channel} channel before plugin reload`);
						stoppedChannels.push(channel);
						await params.stopChannel(channel, void 0, { manual: false });
						channelsStoppedBeforePluginReload.add(channel);
					},
					onFailure: (channel, err) => {
						params.logChannels.error(`failed to stop ${channel} channel before plugin reload: ${formatErrorMessage(err)}`);
					}
				});
				if (stopFailures.length > 0) {
					const rollbackFailures = await collectChannelOperationFailures({
						channels: stoppedChannels,
						run: async (channel) => {
							params.logChannels.info(`restarting ${channel} channel after failed plugin reload pre-stop`);
							await params.startChannel(channel);
							channelsStoppedBeforePluginReload.delete(channel);
						},
						onFailure: (channel, err) => {
							params.logChannels.error(`failed to restart ${channel} channel after failed plugin reload pre-stop: ${formatErrorMessage(err)}`);
						}
					});
					const rollbackSuffix = rollbackFailures.length > 0 ? `; rollback restart failed for: ${rollbackFailures.join(", ")}` : "";
					throw new Error(`failed to stop channels before plugin reload: ${stopFailures.join(", ")}${rollbackSuffix}`);
				}
			};
			const pluginReloadResult = await params.reloadPlugins({
				nextConfig,
				changedPaths: plan.changedPaths,
				beforeReplace: stopChannelsBeforePluginReplace
			});
			for (const channel of pluginReloadResult.restartChannels) channelsToRestart.add(channel);
			activePluginChannelsAfterReload = pluginReloadResult.activeChannels;
			resetPreparedModelRuntimeStateForHotReload();
		}
		if (plan.restartCron) {
			params.onCronRestart?.();
			state.cronState.cron.stop();
			nextState.cronState = buildGatewayCronService({
				cfg: nextConfig,
				deps: params.deps,
				broadcast: params.broadcast
			});
			startGatewayCronWithLogging({
				cron: nextState.cronState.cron,
				logCron: params.logCron
			});
		}
		if (plan.restartHealthMonitor) {
			state.channelHealthMonitor?.stop();
			nextState.channelHealthMonitor = params.createHealthMonitor(nextConfig);
		}
		if (plan.disposeMcpRuntimes) await disposeMcpRuntimesWithTimeout({
			dispose: disposeAllSessionMcpRuntimes,
			timeoutMs: MCP_RUNTIME_RELOAD_DISPOSE_TIMEOUT_MS,
			onWarn: params.logReload.warn,
			label: "bundle-mcp runtime disposal during config reload"
		});
		if (plan.restartGmailWatcher) {
			await params.stopPostReadySidecars?.();
			const restartAbortController = params.createGmailRestartAbortController?.() ?? new AbortController();
			try {
				if (!restartAbortController.signal.aborted) {
					const [{ stopGmailWatcher }, { startGmailWatcherWithLogs }] = await Promise.all([import("./gmail-watcher-DqYs6AIK.js"), import("./gmail-watcher-lifecycle-5SYsJY7F.js")]);
					if (!restartAbortController.signal.aborted) await stopGmailWatcher().catch((err) => {
						params.logHooks.warn(`gmail watcher stop failed during reload: ${String(err)}`);
					});
					if (!restartAbortController.signal.aborted) await startGmailWatcherWithLogs({
						cfg: nextConfig,
						log: params.logHooks,
						isCancelled: () => restartAbortController.signal.aborted,
						signal: restartAbortController.signal,
						onSkipped: () => params.logHooks.info("skipping gmail watcher restart (OPENCLAW_SKIP_GMAIL_WATCHER=1)")
					});
				}
			} finally {
				params.clearGmailRestartAbortController?.(restartAbortController);
			}
		}
		if (channelsToRestart.size > 0) if (shouldSkipChannelRestart()) params.logChannels.info("skipping channel reload (OPENCLAW_SKIP_CHANNELS=1 or OPENCLAW_SKIP_PROVIDERS=1)");
		else {
			if (!plan.reloadPlugins) await waitForActiveWorkBeforeChannelReload(channelsToRestart, nextConfig);
			const restartChannel = async (name) => {
				if (plan.reloadPlugins && activePluginChannelsAfterReload?.has(name) === false) return;
				params.logChannels.info(`restarting ${name} channel`);
				if (!channelsStoppedBeforePluginReload.has(name)) await params.stopChannel(name, void 0, { manual: false });
				await params.startChannel(name);
			};
			const restartFailures = await collectChannelOperationFailures({
				channels: channelsToRestart,
				run: restartChannel,
				onFailure: (channel, err) => {
					params.logChannels.error(`failed to restart ${channel} channel during hot reload: ${formatErrorMessage(err)}`);
				}
			});
			if (restartFailures.length > 0) throw new Error(`failed to restart channels during hot reload: ${restartFailures.join(", ")}`);
		}
		applyGatewayLaneConcurrency(nextConfig);
		if (shouldRefreshContextWindowCache(plan)) {
			await refreshContextWindowCache(nextConfig);
			loadModelCatalog({ config: nextConfig });
		}
		warmCurrentProviderAuthStateOffMainThread(nextConfig).catch((err) => {
			params.logReload.warn(`provider auth state rewarm failed: ${String(err)}`);
		});
		if (plan.hotReasons.length > 0) params.logReload.info(`config hot reload applied (${plan.hotReasons.join(", ")})`);
		else if (plan.noopPaths.length > 0) params.logReload.info(`config change applied (dynamic reads: ${plan.noopPaths.join(", ")})`);
		params.setState(nextState);
	};
	let restartPending = false;
	const requestGatewayRestart = (plan, nextConfig) => {
		setGatewaySigusr1RestartPolicy({ allowExternal: isRestartEnabled(nextConfig) });
		const reasons = plan.restartReasons.length ? plan.restartReasons.join(", ") : plan.changedPaths.join(", ");
		if (process.listenerCount("SIGUSR1") === 0) {
			params.logReload.warn("no SIGUSR1 listener found; restart skipped");
			return false;
		}
		const active = getActiveCounts();
		if (active.totalActive > 0) {
			if (restartPending) {
				params.logReload.info(`config change requires gateway restart (${reasons}) — already waiting for operations to complete`);
				return true;
			}
			restartPending = true;
			const initialDetails = formatActiveDetails(active);
			params.logReload.warn(`config change requires gateway restart (${reasons}) — deferring until ${initialDetails.join(", ")} complete`);
			const taskBlockers = formatTaskBlockers();
			if (taskBlockers) params.logReload.warn(`restart blocked by active background task run(s): ${taskBlockers}`);
			deferGatewayRestartUntilIdle({
				getPendingCount: () => getActiveCounts().totalActive,
				maxWaitMs: resolveGatewayRestartDeferralTimeoutMs(nextConfig.gateway?.reload?.deferralTimeoutMs),
				timeoutIntent: {
					force: true,
					reason: "config reload forced restart"
				},
				emitHooks: { beforeEmit: () => markActiveMainSessionsForRestart(nextConfig, "config reload forced restart") },
				hooks: {
					onReady: () => {
						restartPending = false;
						params.logReload.info("all operations and replies completed; restarting gateway now");
					},
					onStillPending: (_pending, elapsedMs) => {
						const remaining = formatActiveDetails(getActiveCounts());
						const taskBlockersValue = formatTaskBlockers();
						params.logReload.warn(`restart still deferred after ${elapsedMs}ms with ${remaining.join(", ")} active${taskBlockersValue ? ` (${taskBlockersValue})` : ""}`);
					},
					onTimeout: (_pending, elapsedMs) => {
						const remaining = formatActiveDetails(getActiveCounts());
						const taskBlockersLocal = formatTaskBlockers();
						restartPending = false;
						params.logReload.warn(`restart timeout after ${elapsedMs}ms with ${remaining.join(", ")} still active${taskBlockersLocal ? ` (${taskBlockersLocal})` : ""}; forcing restart`);
					},
					onCheckError: (err) => {
						restartPending = false;
						params.logReload.warn(`restart deferral check failed (${String(err)}); restarting gateway now`);
					}
				}
			});
			return true;
		}
		params.logReload.warn(`config change requires gateway restart (${reasons})`);
		if (!emitGatewayRestart()) params.logReload.info("gateway restart already scheduled; skipping duplicate signal");
		return true;
	};
	return {
		applyHotReload,
		requestGatewayRestart
	};
}
function startManagedGatewayConfigReloader(params) {
	if (params.minimalTestGateway) return { stop: async () => {} };
	let stopped = false;
	let activeGmailRestartAbortController = null;
	const abortActiveGmailRestart = () => {
		activeGmailRestartAbortController?.abort();
		activeGmailRestartAbortController = null;
	};
	const createGmailRestartAbortController = () => {
		abortActiveGmailRestart();
		const abortController = new AbortController();
		if (stopped) {
			abortController.abort();
			return abortController;
		}
		activeGmailRestartAbortController = abortController;
		return abortController;
	};
	const { applyHotReload, requestGatewayRestart } = createGatewayReloadHandlers({
		deps: params.deps,
		broadcast: params.broadcast,
		getState: params.getState,
		setState: params.setState,
		startChannel: params.startChannel,
		stopChannel: params.stopChannel,
		stopPostReadySidecars: params.stopPostReadySidecars,
		reloadPlugins: params.reloadPlugins,
		logHooks: params.logHooks,
		logChannels: params.logChannels,
		logCron: params.logCron,
		logReload: params.logReload,
		createGmailRestartAbortController,
		clearGmailRestartAbortController: (abortController) => {
			if (activeGmailRestartAbortController === abortController) activeGmailRestartAbortController = null;
		},
		...params.onCronRestart ? { onCronRestart: params.onCronRestart } : {},
		createHealthMonitor: (config) => startGatewayChannelHealthMonitor({
			cfg: config,
			channelManager: params.channelManager
		})
	});
	const configReloader = startGatewayConfigReloader({
		initialConfig: params.initialConfig,
		initialCompareConfig: params.initialCompareConfig,
		initialInternalWriteHash: params.initialInternalWriteHash,
		readSnapshot: params.readSnapshot,
		promoteSnapshot: async (snapshot, _reason) => await params.promoteSnapshot(snapshot),
		subscribeToWrites: params.subscribeToWrites,
		onHotReload: async (plan, nextConfig) => {
			const previousSharedGatewaySessionGeneration = params.sharedGatewaySessionGenerationState.current;
			const previousSnapshot = getActiveSecretsRuntimeSnapshot();
			const prepared = await params.activateRuntimeSecrets(nextConfig, {
				reason: "reload",
				activate: true
			});
			const nextSharedGatewaySessionGeneration = params.resolveSharedGatewaySessionGenerationForConfig(prepared.config);
			params.sharedGatewaySessionGenerationState.current = nextSharedGatewaySessionGeneration;
			const sharedGatewaySessionGenerationChanged = previousSharedGatewaySessionGeneration !== nextSharedGatewaySessionGeneration;
			if (sharedGatewaySessionGenerationChanged) disconnectStaleSharedGatewayAuthClients({
				clients: params.clients,
				expectedGeneration: nextSharedGatewaySessionGeneration
			});
			try {
				await applyHotReload(plan, prepared.config);
			} catch (err) {
				if (previousSnapshot) await activateSecretsRuntimeSnapshot(previousSnapshot);
				else clearSecretsRuntimeSnapshot();
				if (previousSnapshot && shouldRefreshContextWindowCache(plan)) await refreshContextWindowCache(previousSnapshot.config);
				params.sharedGatewaySessionGenerationState.current = previousSharedGatewaySessionGeneration;
				if (sharedGatewaySessionGenerationChanged) disconnectStaleSharedGatewayAuthClients({
					clients: params.clients,
					expectedGeneration: previousSharedGatewaySessionGeneration
				});
				throw err;
			}
			setCurrentSharedGatewaySessionGeneration(params.sharedGatewaySessionGenerationState, nextSharedGatewaySessionGeneration);
		},
		onRestart: async (plan, nextConfig) => {
			const previousRequiredSharedGatewaySessionGeneration = params.sharedGatewaySessionGenerationState.required;
			const previousSharedGatewaySessionGeneration = params.sharedGatewaySessionGenerationState.current;
			try {
				const prepared = await params.activateRuntimeSecrets(nextConfig, {
					reason: "restart-check",
					activate: false
				});
				const nextSharedGatewaySessionGeneration = params.resolveSharedGatewaySessionGenerationForConfig(prepared.config);
				if (!requestGatewayRestart(plan, nextConfig)) {
					if (previousSharedGatewaySessionGeneration !== nextSharedGatewaySessionGeneration) {
						await activateSecretsRuntimeSnapshot(prepared);
						setCurrentSharedGatewaySessionGeneration(params.sharedGatewaySessionGenerationState, nextSharedGatewaySessionGeneration);
						params.sharedGatewaySessionGenerationState.required = null;
						disconnectStaleSharedGatewayAuthClients({
							clients: params.clients,
							expectedGeneration: nextSharedGatewaySessionGeneration
						});
					} else params.sharedGatewaySessionGenerationState.required = null;
					return;
				}
				if (previousSharedGatewaySessionGeneration !== nextSharedGatewaySessionGeneration) {
					params.sharedGatewaySessionGenerationState.required = nextSharedGatewaySessionGeneration;
					disconnectStaleSharedGatewayAuthClients({
						clients: params.clients,
						expectedGeneration: nextSharedGatewaySessionGeneration
					});
				} else params.sharedGatewaySessionGenerationState.required = null;
			} catch (error) {
				params.sharedGatewaySessionGenerationState.required = previousRequiredSharedGatewaySessionGeneration;
				throw error;
			}
		},
		log: {
			info: (msg) => params.logReload.info(msg),
			warn: (msg) => params.logReload.warn(msg),
			error: (msg) => params.logReload.error(msg)
		},
		watchPath: params.watchPath
	});
	return { stop: async () => {
		stopped = true;
		abortActiveGmailRestart();
		await configReloader.stop();
	} };
}
//#endregion
export { startManagedGatewayConfigReloader };
