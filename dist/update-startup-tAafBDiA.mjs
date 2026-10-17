import { R as timestampMsToIsoString, o as asDateTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { c as trackAsyncWork } from "./async-work-scope-BYeX3gh6.mjs";
import { n as isTruthyEnvValue } from "./env-BBJTTIuE.mjs";
import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import { o as isGatewayExternallySupervised, t as EXTERNAL_SUPERVISOR_UPDATE_REQUIRED_REASON } from "./gateway-supervision-CUdBruRD.mjs";
import { a as channelToNpmTag, c as normalizeUpdateChannel, u as resolveEffectiveUpdateChannel } from "./update-channels-BquD107I.mjs";
import { m as resolveDevGitCommits, n as compareSemverStrings, o as resolveNpmChannelTag } from "./update-check-CWEQyown.mjs";
import { n as readConfigMachineState } from "./config-machine-state-DR7LQrw2.mjs";
import { a as writeConfigMachineState } from "./config-machine-state-write-pMcF7uIi.mjs";
import { n as devUpdateTargetFromGitTarget } from "./update-dev-target-CE00IgAg.mjs";
import { t as createGatewayActiveWorkSnapshot } from "./gateway-active-work-a7DXCHDA.mjs";
import { r as checkTelemetryUpdate } from "./telemetry-kzr4hWuC.mjs";
import { n as refreshRemoteModelCatalog, t as REMOTE_MODEL_CATALOG_TTL_MS } from "./remote-refresh-CW1zdJgL.mjs";
import { a as withoutUpdateCampaign, i as setUpdateScheduleCache, n as getUpdateSchedule, o as withoutUpdateTarget, r as setUpdateAvailableCache } from "./update-status-state-BvKx4Ptf.mjs";
import { n as currentUpdateCheckLifecycle } from "./update-check-lifecycle-lSyfn78A.mjs";
import { r as withUpdateInstallStatus, t as prepareStartupUpdateInstall } from "./update-install-status-BdlD4Zek.mjs";
import { n as runCampaignUpdate } from "./update-startup-auto-run-CMbjPRCL.mjs";
import { createHash, randomUUID } from "node:crypto";
//#region src/infra/update-campaign.ts
const CAMPAIGN_FORCE_DELAY_MS = 9e5;
const CAMPAIGN_COUNTDOWN_MS = 6e4;
const CAMPAIGN_HOLD_MS = 36e5;
const CAMPAIGN_POLL_MS = 5e3;
function sameTarget(a, b) {
	if (a.kind !== b.kind) return false;
	if (a.kind === "package" && b.kind === "package") return a.version === b.version;
	return a.kind === "git" && b.kind === "git" && a.upstreamRef === b.upstreamRef && a.upstreamSha === b.upstreamSha && a.commitsBehind === b.commitsBehind;
}
/** Owns the single in-memory automatic-update campaign for this process. */
var UpdateCampaignController = class {
	constructor(scheduler) {
		this.scheduler = scheduler;
		this.createId = randomUUID;
		this.held = false;
	}
	getState() {
		return this.campaign;
	}
	reconcileTarget(target) {
		if (this.campaign?.state === "applying") return false;
		if (this.target && !sameTarget(this.target, target)) this.clear();
		return true;
	}
	announce(announcement) {
		if (!this.reconcileTarget(announcement.target)) return;
		if (this.target && this.campaign && sameTarget(this.target, announcement.target)) {
			this.announcement = announcement;
			this.reconcile();
			return;
		}
		this.cancelJob();
		this.held = false;
		this.target = announcement.target;
		this.announcement = announcement;
		const now = this.scheduler.now();
		this.campaign = {
			id: this.createId(),
			state: "waiting-for-idle",
			announcedAtMs: now,
			forceAtMs: now + CAMPAIGN_FORCE_DELAY_MS,
			updatedAtMs: now
		};
		announcement.onChange(this.campaign);
		this.reconcile();
	}
	clear() {
		const onChange = this.announcement?.onChange;
		const hadCampaign = this.campaign !== void 0;
		this.cancelJob();
		this.campaign = void 0;
		this.runId = void 0;
		this.target = void 0;
		this.announcement = void 0;
		this.held = false;
		if (hadCampaign) onChange?.(void 0);
	}
	getRunId() {
		return this.runId;
	}
	bindRun(campaignId, runId) {
		if (this.campaign?.state === "applying" && this.campaign.id === campaignId) this.runId = runId;
	}
	reconcileRun(run) {
		if (this.campaign?.state === "applying" && run?.origin?.campaignId === this.campaign.id && run.status !== "running" && run.phase === "finished") this.clear();
	}
	adopt(expectedTarget) {
		const campaign = this.campaign;
		const target = this.target;
		if (!campaign || !target) return { status: "absent" };
		if (campaign.state === "applying") return { status: "applying" };
		if (expectedTarget && (target.kind !== "git" || target.upstreamRef !== expectedTarget.upstreamRef || target.upstreamSha !== expectedTarget.upstreamSha)) return { status: "mismatch" };
		this.beginApplying(false, false);
		return {
			status: "adopted",
			campaignId: campaign.id,
			target: { ...target }
		};
	}
	hold(durationMs = CAMPAIGN_HOLD_MS) {
		const campaign = this.campaign;
		if (!campaign || campaign.state === "applying" || this.held) return false;
		this.cancelJob();
		this.held = true;
		const now = this.scheduler.now();
		const holdUntilMs = now + durationMs;
		this.transition({
			id: campaign.id,
			state: "waiting-for-idle",
			announcedAtMs: campaign.announcedAtMs,
			holdUntilMs,
			forceAtMs: holdUntilMs + CAMPAIGN_FORCE_DELAY_MS,
			updatedAtMs: now
		});
		this.scheduleNext();
		return true;
	}
	reconcile() {
		const campaign = this.campaign;
		const announcement = this.announcement;
		if (!campaign || !announcement || campaign.state === "applying") return;
		this.cancelJob();
		const now = this.scheduler.now();
		if (campaign.holdUntilMs !== void 0 && now < campaign.holdUntilMs) {
			this.scheduleNext();
			return;
		}
		if (now >= campaign.forceAtMs) {
			this.beginApplying(true, true);
			return;
		}
		if (campaign.state === "waiting-for-idle") {
			let idle = false;
			try {
				idle = createGatewayActiveWorkSnapshot(announcement.inspect, { ignoreTerminalSessions: true }).idle;
			} catch {}
			if (!idle) {
				this.scheduleNext();
				return;
			}
			this.transition({
				id: campaign.id,
				state: "countdown",
				announcedAtMs: campaign.announcedAtMs,
				applyAtMs: now + CAMPAIGN_COUNTDOWN_MS,
				...campaign.holdUntilMs === void 0 ? {} : { holdUntilMs: campaign.holdUntilMs },
				forceAtMs: campaign.forceAtMs,
				updatedAtMs: now
			});
			this.scheduleNext();
			return;
		}
		if (campaign.applyAtMs !== void 0 && now >= campaign.applyAtMs) {
			this.beginApplying(false, true);
			return;
		}
		this.scheduleNext();
	}
	transition(next) {
		const current = this.campaign;
		if (current?.state === next.state && current.applyAtMs === next.applyAtMs && current.holdUntilMs === next.holdUntilMs && current.forceAtMs === next.forceAtMs) return;
		this.campaign = next;
		this.announcement?.onChange(next);
	}
	beginApplying(forced, runApply) {
		const campaign = this.campaign;
		const announcement = this.announcement;
		if (!campaign || !announcement) return;
		this.cancelJob();
		const now = this.scheduler.now();
		this.transition({
			id: campaign.id,
			state: "applying",
			announcedAtMs: campaign.announcedAtMs,
			...campaign.holdUntilMs === void 0 ? {} : { holdUntilMs: campaign.holdUntilMs },
			forceAtMs: campaign.forceAtMs,
			updatedAtMs: now
		});
		if (runApply) trackAsyncWork(() => announcement.apply({ forced })).then((outcome) => {
			if (outcome === "failed" && this.campaign?.id === campaign.id) this.clear();
		}, () => {
			if (this.campaign?.id === campaign.id) this.clear();
		});
	}
	scheduleNext() {
		const campaign = this.campaign;
		if (!campaign || campaign.state === "applying") return;
		const now = this.scheduler.now();
		const holdBoundaryMs = campaign.holdUntilMs !== void 0 && campaign.holdUntilMs > now ? campaign.holdUntilMs : Number.POSITIVE_INFINITY;
		const nextBoundaryMs = Math.min(campaign.forceAtMs, campaign.applyAtMs ?? Number.POSITIVE_INFINITY, holdBoundaryMs);
		this.job = this.scheduler.schedule({
			id: "update.campaign",
			...nextBoundaryMs <= now + CAMPAIGN_POLL_MS ? { atMs: nextBoundaryMs } : { delayMs: CAMPAIGN_POLL_MS },
			run: () => this.reconcile()
		});
	}
	cancelJob() {
		this.job?.cancel();
		this.job = void 0;
	}
};
//#endregion
//#region src/infra/update-startup-catalog.ts
function scheduleGatewayRemoteCatalogChecks(params) {
	const { lifecycle } = params;
	lifecycle.schedule("update.remote-model-catalog", async () => {
		let nextCheckInMs = REMOTE_MODEL_CATALOG_TTL_MS;
		try {
			const result = await refreshRemoteModelCatalog({
				config: params.getConfig(),
				signal: lifecycle.signal
			});
			if (lifecycle.signal.aborted) return REMOTE_MODEL_CATALOG_TTL_MS;
			nextCheckInMs = result.status === "fresh" ? result.nextCheckInMs : REMOTE_MODEL_CATALOG_TTL_MS;
			if (result.status === "error") params.log.info("remote model catalog refresh failed", { error: result.error });
			else if (result.status !== "disabled") {
				const state = await params.applyRemoteCatalogUpdate(lifecycle.signal);
				if (state === "published") params.log.info("remote model catalog applied");
				else if (state === "superseded") params.log.info("remote model catalog check superseded; deferred to the next check");
			}
		} catch (error) {
			if (!lifecycle.signal.aborted) params.log.info("remote model catalog check failed", { error: String(error) });
		}
		return nextCheckInMs;
	});
}
//#endregion
//#region src/infra/update-startup.ts
async function getUpdateEffectiveChannel() {
	const { status } = await initializeGatewayUpdateStatus();
	return resolveEffectiveUpdateChannel({
		currentVersion: VERSION,
		installKind: status.installKind,
		git: status.git
	}).channel;
}
const UPDATE_CHECK_STATE_KEY = "update.checkState";
const UPDATE_CHECK_INTERVAL_MS = 864e5;
const ONE_HOUR_MS = 36e5;
const AUTO_STABLE_DELAY_HOURS = 6;
function shouldSkipCheck(allowInTests) {
	return !allowInTests && Boolean(process.env.VITEST || false);
}
function resolveCheckIntervalMs(cfg, installKind) {
	const channel = normalizeUpdateChannel(cfg.update?.channel) ?? "stable";
	return cfg.update?.auto?.enabled && (channel === "stable" || channel === "beta" || channel === "dev" && installKind === "git") ? ONE_HOUR_MS : UPDATE_CHECK_INTERVAL_MS;
}
function readState() {
	return readConfigMachineState(UPDATE_CHECK_STATE_KEY) ?? {};
}
function writeState(state) {
	writeConfigMachineState(UPDATE_CHECK_STATE_KEY, state);
}
function isPersistedAvailabilityForChannel(params) {
	if (params.state.lastCheckedChannel !== params.channel) return false;
	const tag = params.state.lastAvailableTag?.trim();
	if (params.channel === "stable") return !tag || tag === "latest";
	if (params.channel === "beta") return tag === "beta" || tag === "latest";
	return tag === params.channel;
}
function resolvePersistedUpdateAvailable(state, channel) {
	const latestVersion = state.lastAvailableVersion?.trim();
	if (!latestVersion || !isPersistedAvailabilityForChannel({
		state,
		channel
	})) return null;
	const cmp = compareSemverStrings(VERSION, latestVersion);
	if (cmp == null || cmp >= 0) return null;
	const persistedTag = state.lastAvailableTag?.trim() || channelToNpmTag(channel);
	return {
		currentVersion: VERSION,
		latestVersion,
		channel: persistedTag
	};
}
function clearAvailabilityState(nextState) {
	delete nextState.lastAvailableVersion;
	delete nextState.lastAvailableTag;
}
function resolveUpdateCheckNowMs(valueMs) {
	return asDateTimestampMs(valueMs) ?? asDateTimestampMs(Date.now()) ?? 0;
}
function resolveUpdateCheckTimestamp(valueMs) {
	return timestampMsToIsoString(valueMs) ?? timestampMsToIsoString(resolveUpdateCheckNowMs(Date.now())) ?? (/* @__PURE__ */ new Date()).toISOString();
}
function resolveStableAutoApplyAtMs(params) {
	if (!params.nextState.autoInstallId) params.nextState.autoInstallId = params.nextState.autoInstallId?.trim() || randomUUID();
	if (!(params.nextState.autoFirstSeenVersion === params.version && params.nextState.autoFirstSeenTag === params.tag)) {
		params.nextState.autoFirstSeenVersion = params.version;
		params.nextState.autoFirstSeenTag = params.tag;
		params.nextState.autoFirstSeenAt = resolveUpdateCheckTimestamp(params.nowMs);
	}
	const parsedFirstSeenMs = params.nextState.autoFirstSeenAt ? Date.parse(params.nextState.autoFirstSeenAt) : params.nowMs;
	const firstSeenMs = Number.isFinite(parsedFirstSeenMs) ? parsedFirstSeenMs : params.nowMs;
	const baseDelayMs = AUTO_STABLE_DELAY_HOURS * ONE_HOUR_MS;
	const jitterMs = createHash("sha256").update(`${params.nextState.autoInstallId}:${params.version}:${params.tag}`).digest().readUInt32BE(0) % 43200001;
	return firstSeenMs + baseDelayMs + jitterMs;
}
function clearAutoState(nextState) {
	delete nextState.autoFirstSeenVersion;
	delete nextState.autoFirstSeenTag;
	delete nextState.autoFirstSeenAt;
}
/** Shares local install discovery within the Gateway lifecycle. */
function initializeGatewayUpdateStatus() {
	return currentUpdateCheckLifecycle().initialize();
}
function recordAutoUpdateAttempt(version) {
	const attemptAt = resolveUpdateCheckNowMs(Date.now());
	const attemptState = readState();
	attemptState.autoLastAttemptVersion = version;
	attemptState.autoLastAttemptAt = resolveUpdateCheckTimestamp(attemptAt);
	writeState(attemptState);
}
async function runGatewayUpdateCheck(params, lifecycle = currentUpdateCheckLifecycle()) {
	return lifecycle.run((signal) => runGatewayUpdateCheckOwned({
		...params,
		signal: params.signal ? AbortSignal.any([signal, params.signal]) : signal
	}, lifecycle));
}
async function runGatewayUpdateCheckOwned(params, lifecycle) {
	const setAvailable = (next) => setUpdateAvailableCache({
		next,
		onUpdateAvailableChange: params.onUpdateAvailableChange
	});
	const setSchedule = (next) => setUpdateScheduleCache({
		next,
		onUpdateScheduleChange: params.onUpdateScheduleChange
	});
	params.signal?.throwIfAborted();
	if (shouldSkipCheck(Boolean(params.allowInTests))) return;
	if (params.isNixMode) return;
	const updateCampaign = lifecycle.campaign ??= new UpdateCampaignController(lifecycle.scheduler);
	if (updateCampaign.getState()?.state === "applying") return;
	const cfg = params.getConfig();
	const configChannel = normalizeUpdateChannel(cfg.update?.channel);
	const runAuto = params.runAutoUpdate ?? (async (runParams) => {
		const { runAutoUpdateCommand } = await import("./update-startup-auto-run-BL53jqNo.mjs");
		return runAutoUpdateCommand(runParams, params.log);
	});
	const autoEnabled = Boolean(cfg.update?.auto?.enabled);
	const autoDisabledByEnv = isTruthyEnvValue(process.env.OPENCLAW_NO_AUTO_UPDATE);
	if (cfg.update?.checkOnStart === false || autoDisabledByEnv) {
		updateCampaign.clear();
		setAvailable(null);
		const schedule = getUpdateSchedule();
		const channel = configChannel ?? schedule?.channel ?? "stable";
		const currentSchedule = schedule?.channel === channel ? schedule : {
			channel,
			autoEnabled: false
		};
		setSchedule(withoutUpdateTarget({
			...currentSchedule,
			autoEnabled: false
		}));
		return;
	}
	const autoDisabledByExternalSupervisor = isGatewayExternallySupervised();
	const { installStatus, channel: configuredChannel, readOnlySchedule } = await prepareStartupUpdateInstall(lifecycle.initialize, configChannel, params.signal);
	if (readOnlySchedule) {
		updateCampaign.clear();
		setAvailable(null);
		setSchedule(readOnlySchedule);
		return;
	}
	const autoDesired = (configuredChannel === "stable" || configuredChannel === "beta" || configuredChannel === "dev") && autoEnabled && !autoDisabledByExternalSupervisor;
	if (updateCampaign.getState()?.state === "applying") return;
	const canApply = () => {
		const current = params.getConfig();
		return current.update?.auto?.enabled === true && current.update?.checkOnStart !== false && !isTruthyEnvValue(process.env.OPENCLAW_NO_AUTO_UPDATE) && !isGatewayExternallySupervised() && resolveEffectiveUpdateChannel({
			configChannel: normalizeUpdateChannel(current.update?.channel),
			currentVersion: VERSION,
			...installStatus.status
		}).channel === configuredChannel;
	};
	const schedule = getUpdateSchedule();
	if (schedule !== null && schedule.channel !== configuredChannel) updateCampaign.clear();
	const priorSchedule = schedule?.channel === configuredChannel ? schedule : null;
	const initialSchedule = priorSchedule ? {
		...priorSchedule,
		autoEnabled
	} : {
		channel: configuredChannel,
		autoEnabled
	};
	setSchedule(autoDesired ? initialSchedule : withoutUpdateCampaign(initialSchedule));
	if (!autoDesired) updateCampaign.clear();
	const onCampaignChange = (campaign) => {
		const current = getUpdateSchedule();
		if (!current || current.channel !== configuredChannel) return;
		const target = current.target?.kind === "package" ? current.target.version : current.target?.kind === "git" ? {
			upstreamSha: current.target.upstreamSha,
			commitsBehind: current.target.commitsBehind
		} : void 0;
		if (campaign) params.log.info(`update campaign ${campaign.state}`, {
			campaignId: campaign.id,
			state: campaign.state,
			channel: configuredChannel,
			...target === void 0 ? {} : { target },
			...campaign.applyAtMs === void 0 ? {} : { applyAtMs: campaign.applyAtMs },
			...campaign.holdUntilMs === void 0 ? {} : { holdUntilMs: campaign.holdUntilMs },
			forceAtMs: campaign.forceAtMs
		});
		else params.log.info("update campaign ended", {
			...current.campaign?.id ? { campaignId: current.campaign.id } : {},
			channel: configuredChannel,
			...target === void 0 ? {} : { target }
		});
		setSchedule(campaign ? {
			...current,
			campaign
		} : withoutUpdateCampaign(current));
	};
	if (configuredChannel === "extended-stable" || configuredChannel === "dev") setSchedule(withUpdateInstallStatus(getUpdateSchedule() ?? initialSchedule, installStatus.status, configuredChannel === "dev", installStatus.installReceipt, installStatus.root));
	if (configuredChannel === "extended-stable") {
		if (installStatus.status.installKind !== "package") {
			updateCampaign.clear();
			setAvailable(null);
			setSchedule(withoutUpdateTarget(getUpdateSchedule() ?? initialSchedule));
			return;
		}
	}
	const isDevGit = configuredChannel === "dev" && installStatus?.status.installKind === "git";
	const shouldRunAutoUpdate = autoDesired && (configuredChannel === "stable" || configuredChannel === "beta" || isDevGit);
	if (!shouldRunAutoUpdate) updateCampaign.clear();
	const telemetryUpdate = await checkTelemetryUpdate(params.getConfig, { surface: "gateway" });
	params.signal?.throwIfAborted();
	const state = readState();
	const rawNow = Date.now();
	const now = resolveUpdateCheckNowMs(rawNow);
	const rawNowIsValid = asDateTimestampMs(rawNow) !== void 0;
	const lastCheckedAt = state.lastCheckedAt ? Date.parse(state.lastCheckedAt) : null;
	const persistedAvailable = isDevGit ? null : resolvePersistedUpdateAvailable(state, configuredChannel);
	const cacheMatchesChannel = state.lastCheckedChannel === configuredChannel;
	const shouldBypassSharedThrottle = isDevGit || !cacheMatchesChannel;
	setAvailable(persistedAvailable);
	if (persistedAvailable) setSchedule({
		...getUpdateSchedule() ?? initialSchedule,
		target: {
			kind: "package",
			version: persistedAvailable.latestVersion
		}
	});
	const checkIntervalMs = shouldRunAutoUpdate ? resolveCheckIntervalMs(cfg, installStatus?.status.installKind) : UPDATE_CHECK_INTERVAL_MS;
	if (!shouldBypassSharedThrottle && rawNowIsValid && lastCheckedAt && Number.isFinite(lastCheckedAt)) {
		if (now - lastCheckedAt < checkIntervalMs) return;
	}
	const { root, status, installReceipt } = installStatus;
	const announceUpdate = (target, channel, tag) => updateCampaign.announce({
		target,
		inspect: params.activeWorkInspectors,
		onChange: onCampaignChange,
		apply: ({ forced }) => lifecycle.run(() => runCampaignUpdate({
			channel,
			mode: target.kind === "git" ? "git" : status.packageManager,
			version: target.kind === "git" ? target.upstreamSha : target.version,
			tag,
			forced,
			root: root ?? status.root ?? void 0,
			...target.kind === "git" ? { devTarget: devUpdateTargetFromGitTarget(target) } : {},
			log: params.log,
			runAuto,
			canApply,
			onAttempt: recordAutoUpdateAttempt,
			campaign: updateCampaign,
			onUpdateRunCreated: params.onUpdateRunCreated,
			signal: params.signal
		}))
	});
	setSchedule(withUpdateInstallStatus(getUpdateSchedule() ?? initialSchedule, status, isDevGit, installReceipt, root));
	const nextState = {
		...state,
		lastCheckedAt: resolveUpdateCheckTimestamp(now),
		lastCheckedChannel: configuredChannel
	};
	if (!cacheMatchesChannel) clearAvailabilityState(nextState);
	if (isDevGit) {
		clearAvailabilityState(nextState);
		clearAutoState(nextState);
		const git = status.git;
		if (typeof git?.behind !== "number" || git.behind <= 0 || !git.sha || !git.upstream || !git.upstreamSha) {
			updateCampaign.clear();
			setAvailable(null);
			setSchedule(withoutUpdateTarget(getUpdateSchedule() ?? initialSchedule));
			writeState(nextState);
			return;
		}
		const currentSha = git.sha;
		const upstreamRef = git.upstream;
		const upstreamSha = git.upstreamSha;
		const commitsBehind = git.behind;
		const commits = await resolveDevGitCommits({
			root: git.root,
			currentSha,
			upstreamSha,
			signal: params.signal
		});
		params.signal?.throwIfAborted();
		const target = {
			kind: "git",
			upstreamRef,
			upstreamSha,
			commitsBehind
		};
		if (!updateCampaign.reconcileTarget(target)) return;
		setAvailable({
			currentVersion: VERSION,
			latestVersion: VERSION,
			channel: "dev",
			currentSha,
			upstreamRef,
			upstreamSha,
			...git.repositoryUrl ? { repositoryUrl: git.repositoryUrl } : {},
			commitsBehind,
			commits
		});
		setSchedule({
			...getUpdateSchedule() ?? initialSchedule,
			target
		});
		if (autoEnabled && autoDisabledByExternalSupervisor) params.log.info("auto-update delegated to external supervisor", {
			version: upstreamSha,
			tag: "dev",
			reason: EXTERNAL_SUPERVISOR_UPDATE_REQUIRED_REASON
		});
		const hasTrackedDevUpstream = (git.branch === "main" || git.branch === "HEAD") && git.upstreamSource === "tracking";
		const hasReceiptBackedDetachedHead = git.branch === "HEAD" && git.upstreamSource === "receipt";
		const canRunTrackedDevCampaign = (hasTrackedDevUpstream || hasReceiptBackedDetachedHead) && git.ahead === 0;
		if (shouldRunAutoUpdate && canRunTrackedDevCampaign) {
			const lastAttemptAt = state.autoLastAttemptAt ? Date.parse(state.autoLastAttemptAt) : null;
			if (!(lastAttemptAt != null && Number.isFinite(lastAttemptAt) && now - lastAttemptAt < ONE_HOUR_MS)) announceUpdate(target, "dev", "dev");
		} else updateCampaign.clear();
		writeState(nextState);
		return;
	}
	if (status.installKind !== "package") {
		clearAvailabilityState(nextState);
		clearAutoState(nextState);
		setAvailable(null);
		updateCampaign.clear();
		setSchedule(withoutUpdateTarget(getUpdateSchedule() ?? initialSchedule));
		writeState(nextState);
		return;
	}
	const channel = configuredChannel;
	const resolved = shouldRunAutoUpdate || channel !== "stable" ? await resolveNpmChannelTag({ channel }) : {
		tag: "latest",
		version: telemetryUpdate?.version ?? null
	};
	params.signal?.throwIfAborted();
	const tag = resolved.tag;
	if (!resolved.version) {
		if (channel === "extended-stable") {
			clearAvailabilityState(nextState);
			setAvailable(null);
			updateCampaign.clear();
			setSchedule(withoutUpdateTarget(getUpdateSchedule() ?? initialSchedule));
		}
		writeState(nextState);
		return;
	}
	const cmp = compareSemverStrings(VERSION, resolved.version);
	if (cmp != null && cmp < 0) {
		const nextAvailable = {
			currentVersion: VERSION,
			latestVersion: resolved.version,
			channel: tag
		};
		const target = {
			kind: "package",
			version: resolved.version
		};
		if (!updateCampaign.reconcileTarget(target)) return;
		setSchedule({
			...getUpdateSchedule() ?? initialSchedule,
			target
		});
		setAvailable(nextAvailable);
		nextState.lastAvailableVersion = resolved.version;
		nextState.lastAvailableTag = tag;
		if (state.lastNotifiedVersion !== resolved.version || state.lastNotifiedTag !== tag) {
			const updateNotice = `update available (${tag}): v${resolved.version} (current v${VERSION}). Run: ${formatCliCommand("openclaw update")}`;
			const note = telemetryUpdate?.note ? sanitizeTerminalText(telemetryUpdate.note).trim().slice(0, 500) : void 0;
			params.log.info(note ? `${updateNotice} Note: ${note}` : updateNotice);
			nextState.lastNotifiedVersion = resolved.version;
			nextState.lastNotifiedTag = tag;
		}
		if (channel !== "extended-stable" && autoEnabled && autoDisabledByExternalSupervisor) params.log.info("auto-update delegated to external supervisor", {
			version: resolved.version,
			tag,
			reason: EXTERNAL_SUPERVISOR_UPDATE_REQUIRED_REASON
		});
		if (shouldRunAutoUpdate && (channel === "stable" || channel === "beta")) {
			const lastAttemptAt = state.autoLastAttemptAt ? Date.parse(state.autoLastAttemptAt) : null;
			const recentAttemptForSameVersion = state.autoLastAttemptVersion === resolved.version && lastAttemptAt != null && Number.isFinite(lastAttemptAt) && now - lastAttemptAt < ONE_HOUR_MS;
			let dueNow = channel === "beta";
			let applyAfterMs = null;
			if (channel === "stable") {
				applyAfterMs = resolveStableAutoApplyAtMs({
					nextState,
					nowMs: now,
					version: resolved.version,
					tag
				});
				dueNow = now >= applyAfterMs;
			}
			if (!dueNow) params.log.info("auto-update deferred (stable rollout window active)", {
				version: resolved.version,
				tag,
				applyAfter: applyAfterMs ? resolveUpdateCheckTimestamp(applyAfterMs) : void 0
			});
			else if (recentAttemptForSameVersion) params.log.info("auto-update deferred (recent attempt exists)", {
				version: resolved.version,
				tag
			});
			else announceUpdate(target, channel, tag);
		}
	} else {
		clearAvailabilityState(nextState);
		if (channel !== "extended-stable") clearAutoState(nextState);
		setAvailable(null);
		updateCampaign.clear();
		setSchedule(withoutUpdateTarget(getUpdateSchedule() ?? initialSchedule));
	}
	writeState(nextState);
}
function createGatewayUpdateCheck(params) {
	const { lifecycle } = params;
	let started = false;
	return {
		initialize: lifecycle.initialize,
		stop: lifecycle.stop,
		start: () => {
			if (started || lifecycle.signal.aborted) return;
			started = true;
			lifecycle.schedule("update.check", async () => {
				try {
					await runGatewayUpdateCheck(params, lifecycle);
				} catch {}
				return resolveCheckIntervalMs(params.getConfig(), getUpdateSchedule()?.install?.kind);
			});
			scheduleGatewayRemoteCatalogChecks(params);
		}
	};
}
//#endregion
export { runGatewayUpdateCheck as i, getUpdateEffectiveChannel as n, initializeGatewayUpdateStatus as r, createGatewayUpdateCheck as t };
