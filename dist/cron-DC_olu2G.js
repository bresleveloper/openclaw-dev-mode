import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { M as resolveTimestampMsToIsoString, o as asDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { a as isSubagentSessionKey, c as parseAgentSessionKey } from "./session-key-utils-C7uT9A4s.js";
import { c as resolveDefaultAgentId } from "./agent-scope-config-C3ijpoNo.js";
import { i as normalizeMessageChannel, t as isDeliverableMessageChannel } from "./message-channel-normalize-DleKV4yQ.js";
import "./message-channel-B4LS2Kcc.js";
import { r as normalizeCronJobPatch, t as normalizeCronJobCreate } from "./normalize-BzS-Bdfc.js";
import { i as parseAbsoluteTimeMs } from "./stagger-q3jv0Ns2.js";
import { i as resolveCronDeliverySessionKey, n as isInvalidCronSessionTargetIdError } from "./session-target-BoV6mLXy.js";
import { i as readCronRunLogEntriesPageAll, n as isInvalidCronRunLogJobIdError, r as readCronRunLogEntriesPage } from "./run-log-CU0WssU1.js";
import { t as assertCronDeliveryInputNonBlankFields } from "./delivery-target-validation-rI-6HP-3.js";
import { n as listConfiguredMessageChannels } from "./channel-selection-DAY9l73H.js";
import { a as validateTargetProviderPrefix, t as resolveTargetPrefixedChannel } from "./channel-target-prefix-B-U8aKKo.js";
import { mn as errorShape, pn as ErrorCodes } from "./schema-Ctppm7Dp.js";
import { B as validateCronRunParams, H as validateCronStatusParams, I as validateCronAddParams, L as validateCronGetParams, R as validateCronListParams, U as validateCronUpdateParams, V as validateCronRunsParams, or as validateWakeParams, t as formatValidationErrors, z as validateCronRemoveParams } from "./src-CSp7rUPX.js";
import { n as resolveCronDeliveryPlan, t as hasExplicitCronDeliveryTarget } from "./delivery-plan-D4344R2m.js";
import { n as applyJobPatch, y as resolveDeliveryTarget } from "./jobs-CReewaU5.js";
//#region src/cron/delivery-preview.ts
/** Builds dry-run cron delivery labels for CLI/UI list surfaces. */
function formatTarget(channel, to) {
	if (!channel) return "last";
	if (to) return `${channel}:${to}`;
	return channel;
}
function formatDeliveryDetail(params) {
	if (params.requestedChannel === "last" || !params.requestedChannel) {
		if (!params.resolved) return params.error ? `last -> no route, will fail-closed: ${params.error}` : "last -> no route, will fail-closed";
		return params.sessionKey ? `resolved from last, session ${params.sessionKey}` : "resolved from last, main session";
	}
	return params.resolved ? "explicit" : params.error ?? "unresolved";
}
/** Builds the user-visible cron delivery preview for one job without sending anything. */
async function resolveCronDeliveryPreview(params) {
	const plan = resolveCronDeliveryPlan(params.job);
	if (plan.mode === "none" && !hasExplicitCronDeliveryTarget(plan)) return {
		label: "not requested",
		detail: "not requested"
	};
	if (plan.mode === "webhook") return {
		label: plan.to ? `webhook:${plan.to}` : "webhook",
		detail: plan.to ? "webhook" : "webhook target missing"
	};
	const requestedChannel = plan.channel ?? "last";
	const agentId = params.job.agentId?.trim() || params.defaultAgentId || resolveDefaultAgentId(params.cfg);
	const deliverySessionKey = resolveCronDeliverySessionKey(params.job);
	const resolved = await resolveDeliveryTarget(params.cfg, agentId, {
		channel: requestedChannel,
		to: plan.to,
		threadId: plan.threadId,
		accountId: plan.accountId,
		sessionKey: deliverySessionKey
	}, { dryRun: true });
	if (!resolved.ok) return {
		label: `${plan.mode} -> ${formatTarget(requestedChannel, plan.to ?? null)}`,
		detail: plan.mode === "none" ? `message tool target unresolved: ${resolved.error.message}` : formatDeliveryDetail({
			requestedChannel,
			resolved: false,
			sessionKey: deliverySessionKey,
			error: resolved.error.message
		})
	};
	return {
		label: `${plan.mode} -> ${formatTarget(resolved.channel, resolved.to)}`,
		detail: formatDeliveryDetail({
			requestedChannel,
			resolved: true,
			sessionKey: deliverySessionKey
		})
	};
}
/** Builds cron delivery previews keyed by job id. */
async function resolveCronDeliveryPreviews(params) {
	const entries = await Promise.all(params.jobs.map(async (job) => [job.id, await resolveCronDeliveryPreview({
		cfg: params.cfg,
		defaultAgentId: params.defaultAgentId,
		job
	})]));
	return Object.fromEntries(entries);
}
//#endregion
//#region src/cron/validate-timestamp.ts
/** Validates user-supplied one-shot cron timestamps before scheduling. */
const ONE_MINUTE_MS = 60 * 1e3;
const TEN_YEARS_MS = 10 * 365.25 * 24 * 60 * 60 * 1e3;
/**
* Validates one-shot cron timestamps with a small past grace window and far-future cap.
*/
function validateScheduleTimestamp(schedule, nowMs = Date.now()) {
	if (schedule.kind !== "at") return { ok: true };
	const atRaw = normalizeOptionalString(schedule.at) ?? "";
	const atMs = atRaw ? parseAbsoluteTimeMs(atRaw) : null;
	if (atMs === null || !Number.isFinite(atMs)) return {
		ok: false,
		message: `Invalid schedule.at: expected ISO-8601 timestamp (got ${schedule.at})`
	};
	const referenceNowMs = asDateTimestampMs(nowMs) ?? asDateTimestampMs(Date.now()) ?? 0;
	const diffMs = atMs - referenceNowMs;
	if (diffMs < -6e4) {
		const nowDate = resolveTimestampMsToIsoString(referenceNowMs);
		return {
			ok: false,
			message: `schedule.at is in the past: ${resolveTimestampMsToIsoString(atMs)} (${Math.floor(-diffMs / ONE_MINUTE_MS)} minutes ago). Current time: ${nowDate}`
		};
	}
	if (diffMs > TEN_YEARS_MS) return {
		ok: false,
		message: `schedule.at is too far in the future: ${resolveTimestampMsToIsoString(atMs)} (${Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1e3))} years ahead). Maximum allowed: 10 years`
	};
	return { ok: true };
}
//#endregion
//#region src/gateway/server-methods/cron.ts
function compactCronListJob(job) {
	return {
		id: job.id,
		name: job.name,
		enabled: job.enabled,
		nextRunAtMs: job.state.nextRunAtMs ?? null,
		scheduleKind: job.schedule.kind,
		lastRunStatus: job.state.lastRunStatus ?? job.state.lastStatus ?? null
	};
}
async function listConfiguredAnnounceChannelIds(cfg) {
	return await listConfiguredMessageChannels(cfg);
}
function hasExplicitChannelConfigEntry(cfg) {
	const channels = cfg.channels;
	if (!channels || typeof channels !== "object" || Array.isArray(channels)) return false;
	return Object.entries(channels).some(([channelId, entry]) => {
		if (channelId === "defaults" || channelId === "modelByChannel") return false;
		if (!entry || typeof entry !== "object" || Array.isArray(entry)) return false;
		return Object.keys(entry).length > 0;
	});
}
async function assertConfiguredAnnounceChannel(params) {
	if (params.channel === "last") return;
	const configuredChannels = (await listConfiguredAnnounceChannelIds(params.cfg)).toSorted();
	const normalizedChannel = normalizeMessageChannel(params.channel);
	if (!normalizedChannel) {
		if (configuredChannels.length <= 1) return;
		throw new Error(`${params.field} is required when multiple channels are configured: ${configuredChannels.join(", ")}`);
	}
	if (configuredChannels.length === 0) {
		if (!hasExplicitChannelConfigEntry(params.cfg)) {
			if (!isDeliverableMessageChannel(normalizedChannel)) throw new Error(`${params.field} is not a known channel: ${normalizedChannel}`);
			return;
		}
		throw new Error(`${params.field} is not configured: ${normalizedChannel}`);
	}
	if (configuredChannels.includes(normalizedChannel)) return;
	throw new Error(`${params.field} must be one of: ${configuredChannels.join(", ")}`);
}
function resolveAnnounceValidationChannel(params) {
	if (params.channel && params.channel !== "last") return params.channel;
	return resolveTargetPrefixedChannel(params.to) ?? params.channel;
}
function assertCompatibleAnnounceTarget(params) {
	if (!params.channel || params.channel === "last") return;
	const error = validateTargetProviderPrefix({
		channel: params.channel,
		to: params.to
	});
	if (error) throw new Error(`${params.field}: ${error.message}`);
}
async function assertValidCronAnnounceDelivery(params) {
	if (params.delivery && (params.delivery.mode ?? "announce") === "announce") {
		assertCompatibleAnnounceTarget({
			channel: params.delivery.channel,
			to: params.delivery.to,
			field: "delivery.channel"
		});
		await assertConfiguredAnnounceChannel({
			cfg: params.cfg,
			channel: resolveAnnounceValidationChannel({
				channel: params.delivery.channel,
				to: params.delivery.to
			}),
			field: "delivery.channel"
		});
	}
	const failureDestination = params.delivery?.failureDestination;
	if (failureDestination && (failureDestination.mode ?? "announce") === "announce") {
		if (failureDestination.channel === void 0 && failureDestination.to === void 0 && failureDestination.accountId === void 0 && failureDestination.mode === void 0) return;
		assertCompatibleAnnounceTarget({
			channel: failureDestination.channel,
			to: failureDestination.to,
			field: "delivery.failureDestination.channel"
		});
		await assertConfiguredAnnounceChannel({
			cfg: params.cfg,
			channel: resolveAnnounceValidationChannel({
				channel: failureDestination.channel,
				to: failureDestination.to
			}),
			field: "delivery.failureDestination.channel"
		});
	}
}
async function assertValidCronCreateDelivery(cfg, jobCreate) {
	await assertValidCronAnnounceDelivery({
		cfg,
		delivery: jobCreate.delivery
	});
}
async function assertValidCronUpdatePatch(params) {
	const nextJob = structuredClone(params.currentJob);
	applyJobPatch(nextJob, params.patch, { defaultAgentId: params.defaultAgentId });
	if ("delivery" in params.patch) {
		const delivery = params.patch.delivery?.channel === null && nextJob.delivery && (nextJob.delivery.mode ?? "announce") === "announce" && nextJob.delivery.channel === void 0 && resolveTargetPrefixedChannel(nextJob.delivery.to) === void 0 ? {
			...nextJob.delivery,
			channel: "last"
		} : nextJob.delivery;
		await assertValidCronAnnounceDelivery({
			cfg: params.cfg,
			delivery
		});
	}
}
function resolveCronJobId(params) {
	return params.id ?? params.jobId;
}
function respondInvalidCronParams(respond, method, reason) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid ${method} params: ${reason}`));
}
function respondMissingCronJobId(respond, method) {
	respondInvalidCronParams(respond, method, "missing id");
}
function cronRunLogPageFilters(params) {
	return {
		limit: params.limit,
		offset: params.offset,
		statuses: params.statuses,
		status: params.status,
		runId: params.runId,
		deliveryStatuses: params.deliveryStatuses,
		deliveryStatus: params.deliveryStatus,
		query: params.query,
		sortDir: params.sortDir
	};
}
function isCronInvalidRequestError(err) {
	const message = formatErrorMessage(err);
	return message.startsWith("unknown cron job id:") || message.includes("cron job is missing sessionTarget") || message.includes("invalid cron sessionTarget session id") || message.includes("main cron jobs require payload.kind=\"systemEvent\"") || message.includes("isolated/current/session cron jobs require payload.kind=\"agentTurn\"") || message.includes("has no upcoming run time and would never fire") || message.includes("sessionTarget \"main\" is only valid for the default agent") || message.includes("cron.update payload.kind=\"systemEvent\" requires text") || message.includes("cron.update payload.kind=\"agentTurn\" requires message") || message.includes("cron webhook delivery requires") || message.includes("cron completion destination webhook requires") || message.includes("cron failure destination webhook requires") || message.includes("cron channel delivery config is only supported") || message.includes("cron delivery.failureDestination is only supported");
}
/** Gateway request handlers for cron jobs and cron run-log access. */
const cronHandlers = {
	wake: ({ params, respond, context }) => {
		if (!validateWakeParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid wake params: ${formatValidationErrors(validateWakeParams.errors)}`));
			return;
		}
		const p = params;
		const sessionKey = p.sessionKey?.trim() || void 0;
		const agentId = p.agentId?.trim() || void 0;
		if (sessionKey && isSubagentSessionKey(sessionKey)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "wake sessionKey cannot target a subagent session"));
			return;
		}
		const sessionKeyAgentId = sessionKey ? parseAgentSessionKey(sessionKey)?.agentId?.trim().toLowerCase() : void 0;
		if (agentId && sessionKeyAgentId && agentId.toLowerCase() !== sessionKeyAgentId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "wake agentId contradicts the agent that owns sessionKey; pass a single canonical wake target"));
			return;
		}
		respond(true, context.cron.wake({
			mode: p.mode,
			text: p.text,
			...sessionKey ? { sessionKey } : {},
			...agentId ? { agentId } : {}
		}), void 0);
	},
	"cron.list": async ({ params, respond, context }) => {
		if (!validateCronListParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid cron.list params: ${formatValidationErrors(validateCronListParams.errors)}`));
			return;
		}
		const p = params;
		const page = await context.cron.listPage({
			includeDisabled: p.includeDisabled,
			limit: p.limit,
			offset: p.offset,
			query: p.query,
			enabled: p.enabled,
			scheduleKind: p.scheduleKind,
			lastRunStatus: p.lastRunStatus,
			sortBy: p.sortBy,
			sortDir: p.sortDir,
			agentId: p.agentId
		});
		if (p.compact === true) {
			respond(true, {
				...page,
				jobs: page.jobs.map(compactCronListJob)
			}, void 0);
			return;
		}
		const deliveryPreviews = await resolveCronDeliveryPreviews({
			cfg: context.getRuntimeConfig(),
			defaultAgentId: context.cron.getDefaultAgentId(),
			jobs: page.jobs
		});
		respond(true, {
			...page,
			deliveryPreviews
		}, void 0);
	},
	"cron.status": async ({ params, respond, context }) => {
		if (!validateCronStatusParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid cron.status params: ${formatValidationErrors(validateCronStatusParams.errors)}`));
			return;
		}
		respond(true, await context.cron.status(), void 0);
	},
	"cron.get": async ({ params, respond, context }) => {
		if (!validateCronGetParams(params)) {
			respondInvalidCronParams(respond, "cron.get", formatValidationErrors(validateCronGetParams.errors));
			return;
		}
		const jobId = resolveCronJobId(params);
		if (!jobId) {
			respondMissingCronJobId(respond, "cron.get");
			return;
		}
		const job = await context.cron.readJob(jobId);
		if (!job) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `cron job not found: ${jobId}`));
			return;
		}
		respond(true, job, void 0);
	},
	"cron.add": async ({ params, respond, context }) => {
		const sessionKey = typeof params?.sessionKey === "string" ? params.sessionKey : void 0;
		let normalized;
		try {
			assertCronDeliveryInputNonBlankFields(params?.delivery);
			normalized = normalizeCronJobCreate(params, { sessionContext: { sessionKey } }) ?? params;
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid cron.add params: ${formatErrorMessage(err)}`));
			return;
		}
		if (!validateCronAddParams(normalized)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid cron.add params: ${formatValidationErrors(validateCronAddParams.errors)}`));
			return;
		}
		const jobCreate = normalized;
		const cfg = context.getRuntimeConfig();
		const timestampValidation = validateScheduleTimestamp(jobCreate.schedule);
		if (!timestampValidation.ok) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, timestampValidation.message));
			return;
		}
		try {
			await assertValidCronCreateDelivery(cfg, jobCreate);
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid cron.add params: ${formatErrorMessage(err)}`));
			return;
		}
		let job;
		try {
			job = await context.cron.add(jobCreate);
		} catch (err) {
			if (!(err instanceof TypeError) && !(err instanceof RangeError) && !isCronInvalidRequestError(err)) throw err;
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid cron.add params: ${formatErrorMessage(err)}`));
			return;
		}
		context.logGateway.info("cron: job created", {
			jobId: job.id,
			schedule: jobCreate.schedule
		});
		respond(true, job, void 0);
	},
	"cron.update": async ({ params, respond, context }) => {
		let normalizedPatch;
		try {
			const rawPatch = params?.patch;
			assertCronDeliveryInputNonBlankFields(rawPatch && typeof rawPatch === "object" ? rawPatch.delivery : void 0);
			normalizedPatch = normalizeCronJobPatch(rawPatch);
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid cron.update params: ${formatErrorMessage(err)}`));
			return;
		}
		const candidate = normalizedPatch && typeof params === "object" && params !== null ? {
			...params,
			patch: normalizedPatch
		} : params;
		if (!validateCronUpdateParams(candidate)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid cron.update params: ${formatValidationErrors(validateCronUpdateParams.errors)}`));
			return;
		}
		const p = candidate;
		const jobId = p.id ?? p.jobId;
		if (!jobId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid cron.update params: missing id"));
			return;
		}
		const patch = p.patch;
		const cfg = context.getRuntimeConfig();
		const currentJob = await context.cron.readJob(jobId);
		if (!currentJob) {
			respondInvalidCronParams(respond, "cron.update", "id not found");
			return;
		}
		if (patch.schedule) {
			const timestampValidation = validateScheduleTimestamp(patch.schedule);
			if (!timestampValidation.ok) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, timestampValidation.message));
				return;
			}
		}
		try {
			await assertValidCronUpdatePatch({
				cfg,
				defaultAgentId: context.cron.getDefaultAgentId(),
				currentJob,
				patch
			});
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid cron.update params: ${formatErrorMessage(err)}`));
			return;
		}
		let job;
		try {
			job = await context.cron.update(jobId, patch);
		} catch (err) {
			if (!(err instanceof TypeError) && !(err instanceof RangeError) && !isCronInvalidRequestError(err)) throw err;
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid cron.update params: ${formatErrorMessage(err)}`));
			return;
		}
		context.logGateway.info("cron: job updated", { jobId });
		respond(true, job, void 0);
	},
	"cron.remove": async ({ params, respond, context }) => {
		if (!validateCronRemoveParams(params)) {
			respondInvalidCronParams(respond, "cron.remove", formatValidationErrors(validateCronRemoveParams.errors));
			return;
		}
		const jobId = resolveCronJobId(params);
		if (!jobId) {
			respondMissingCronJobId(respond, "cron.remove");
			return;
		}
		const result = await context.cron.remove(jobId);
		if (!result.removed) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid cron.remove params: id not found"));
			return;
		}
		context.logGateway.info("cron: job removed", { jobId });
		respond(true, result, void 0);
	},
	"cron.run": async ({ params, respond, context }) => {
		if (!validateCronRunParams(params)) {
			respondInvalidCronParams(respond, "cron.run", formatValidationErrors(validateCronRunParams.errors));
			return;
		}
		const p = params;
		const jobId = resolveCronJobId(p);
		if (!jobId) {
			respondMissingCronJobId(respond, "cron.run");
			return;
		}
		let result;
		try {
			result = await context.cron.enqueueRun(jobId, p.mode ?? "force");
		} catch (error) {
			if (isInvalidCronSessionTargetIdError(error)) {
				respond(true, {
					ok: true,
					ran: false,
					reason: "invalid-spec"
				}, void 0);
				return;
			}
			if (isCronInvalidRequestError(error)) {
				respondInvalidCronParams(respond, "cron.run", formatErrorMessage(error));
				return;
			}
			throw error;
		}
		respond(true, result, void 0);
	},
	"cron.runs": async ({ params, respond, context }) => {
		if (!validateCronRunsParams(params)) {
			respondInvalidCronParams(respond, "cron.runs", formatValidationErrors(validateCronRunsParams.errors));
			return;
		}
		const p = params;
		const explicitScope = p.scope;
		const jobId = resolveCronJobId(p);
		const scope = explicitScope ?? (jobId ? "job" : "all");
		if (scope === "job" && !jobId) {
			respondMissingCronJobId(respond, "cron.runs");
			return;
		}
		if (scope === "all") {
			const jobs = await context.cron.list({ includeDisabled: true });
			const jobNameById = Object.fromEntries(jobs.filter((job) => typeof job.id === "string" && typeof job.name === "string").map((job) => [job.id, job.name]));
			respond(true, await readCronRunLogEntriesPageAll({
				storePath: context.cronStorePath,
				...cronRunLogPageFilters(p),
				jobNameById
			}), void 0);
			return;
		}
		try {
			const matchedJob = (await context.cron.list({ includeDisabled: true })).find((job) => job.id === jobId);
			const jobNameById = matchedJob && typeof matchedJob.name === "string" ? { [jobId]: matchedJob.name } : void 0;
			respond(true, await readCronRunLogEntriesPage({
				storePath: context.cronStorePath,
				jobId,
				...cronRunLogPageFilters(p),
				jobNameById
			}), void 0);
		} catch (err) {
			if (!isInvalidCronRunLogJobIdError(err)) throw err;
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid cron.runs params: invalid id"));
		}
	}
};
//#endregion
export { cronHandlers };
