import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { I as resolveTimestampMsToIsoString, R as timestampMsToIsoString, o as asDateTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { t as parseBoolean } from "./boolean-coercion-1HZNNkFl.mjs";
import { a as asOptionalRecord, c as isRecord, i as asOptionalObjectRecord, u as readStringField } from "./record-coerce-TIsquoVR.mjs";
import "./utils-DgZn2dLu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { P as runWithDiagnosticTraceContext, k as getActiveDiagnosticTraceContext, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-BADdmgZf.mjs";
import { t as SessionMetadataUnavailableError } from "./session-metadata-unavailable-error-DwD7IuoE.mjs";
import { V as cronRunRecordToRunLogEntry } from "./openclaw-state-db-fast-path-CPAamWzU.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { C as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import { M as parseAgentSessionKey, T as parseCronRunScopeSuffix, w as isSubagentSessionKey } from "./session-key-C09ow4h0.mjs";
import { n as normalizeAccountId } from "./account-id-DbRsdayc.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CqBAHB04.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-DeTO1ikE.mjs";
import "./message-channel-j-k-Nup3.mjs";
import { g as readAgentDatabaseAdmissionRefusal, s as createAgentDatabaseAdmissionErrorShape } from "./agent-database-admission-dWNS6Rcs.mjs";
import { St as validateCronUpdateParams, _t as validateCronRunParams, bt as validateCronScratchSetParams, ec as validateWakeParams, ft as validateCronAddParams, gt as validateCronRemoveParams, ht as validateCronListParams, mt as validateCronHistoryParams, pt as validateCronGetParams, vt as validateCronRunsParams, wu as CronHistoryResultSchema, xt as validateCronStatusParams, yt as validateCronScratchGetParams } from "./src-l2dWvEsN.mjs";
import { n as bindGatewayDeviceRevocation } from "./device-revocation-DeateGFe.mjs";
import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { n as authorizeGatewaySessionCreation } from "./operator-role-policy-BqPaarjx.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-D_rRUHd5.mjs";
import { a as isAgentHarnessSessionKey, d as resolveAgentHarnessSessionStoreEntryError, n as AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE, r as AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE } from "./agent-harness-session-key-D8EQIzja.mjs";
import { t as parseAbsoluteTimeMs } from "./parse-BEO0zOri.mjs";
import { n as createTrustedCronScheduledToolPolicy, t as createAccountCronScheduledToolPolicy } from "./scheduled-tool-policy-CYthJ0r4.mjs";
import { r as normalizeCronJobPatch, t as normalizeCronJobCreate } from "./normalize-Lu86QQtC.mjs";
import { a as resolveCronDeliverySessionKey, r as isInvalidCronSessionTargetIdError, s as resolveCronSessionTargetSessionKey } from "./session-target-DJsUULzX.mjs";
import { a as hasCanonicalCronDeliveryMode, n as assertCanonicalCronDeliveryMode, t as CRON_DELIVERY_REPAIR_REQUIRED_MESSAGE } from "./delivery-codec-DMPX9PBc.mjs";
import { n as cronJobUsesToolRuntime } from "./tools-allow-BpmRg2Op.mjs";
import { r as bindCronSelfRemovalCommitGuard } from "./active-jobs-BS2UT6i2.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { i as resolveSessionStoreIdentity } from "./session-store-key-Ci099tm9.mjs";
import { t as CRON_JOB_SCRATCH_MAX_BYTES } from "./scratch-contract-B-Laspel.mjs";
import { a as validateTargetProviderPrefix, t as resolveTargetPrefixedChannel } from "./channel-target-prefix-DIR59G50.mjs";
import { a as getCronManagementCallerOrigin, d as resolveCronCreatorAuthorityGrantProvenance, i as getCronManagementAuthority, n as consumeCronCreatorAuthorityGrant, o as getCronManagementChannelRequester, p as withCronManagementGrant } from "./cron-creator-authority-grant-B3kDRd63.mjs";
import { t as createStageTimingTracker } from "./stage-timing-BUG4Fnsv.mjs";
import { $ as resolveCronJobBoundSessionKeys } from "./session-row-prepared-read-BwiDGjfX.mjs";
import { n as resolveCronJobEffectiveAgentId, r as tryResolveCronJobEffectiveAgentId, t as CRON_AGENT_SELECTION_REQUIRED_MESSAGE } from "./agent-id-uYw1RFJQ.mjs";
import { t as resolveCronAgentSessionKey } from "./session-key-C18RZBZJ.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DrLraxiU.mjs";
import { u as prepareProjectedSessionSharing } from "./session-sharing-target-read-DUttMvj3.mjs";
import "./session-sharing-50mq9oo9.mjs";
import { r as prepareSessionMutationFacts } from "./session-sharing-preparation-BwpUabTn.mjs";
import { n as listConfiguredMessageChannels } from "./channel-selection-D6ROr8H-.mjs";
import { t as assertCronDeliveryInputNonBlankFields } from "./delivery-target-validation-D5dmr1ev.mjs";
import "./session-utils-N4Q5NAko.mjs";
import { t as cronStoreKey } from "./key-BBZ40bDq.mjs";
import { t as resolveCronJobConfigRevision } from "./config-revision-DVuJ106z.mjs";
import { r as readCronRunRecords } from "./read-only-BnZqzQN0.mjs";
import { n as resolveCronDeliveryPlan, t as hasExplicitCronDeliveryTarget } from "./delivery-plan-1uq0obi_.mjs";
import { a as isInvalidCronRunJobIdError, n as applyJobPatch, s as projectCronRunHistoryPage } from "./jobs-CYR_Cvky.mjs";
import { i as resolveFailureAlert } from "./failure-alerts-FnwyRSnJ.mjs";
import { i as cronScratchReadView, r as cronJobReadView, t as cronAddResultReadView } from "./job-read-view-CgKmbr9p.mjs";
import { t as readSessionHistoryPageInWorker } from "./session-history-worker-runtime-C6BcrSvb.mjs";
import { n as requiresExternalCronDelivery, r as resolveDeliveryTarget, t as prepareCronDeliveryTargetContexts } from "./delivery-target-kx29Zebe.mjs";
import { n as resolveOperatorSessionCreation } from "./session-creation-provenance-CZ3I7AOG.mjs";
import { t as assertActiveAgentRuntimeAuthority } from "./agent-runtime-authority-Bf7e1KZt.mjs";
import { n as defineValidatedGatewayHandler, t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import "./slow-request-diagnostics-D4R2ZRNA.mjs";
import { t as getGatewayProcessInstanceId } from "./process-instance-CwB3RMsz.mjs";
import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";
import { Value } from "typebox/value";
//#region src/cron/delivery-channel-validation.ts
function hasExplicitChannelConfigEntry(cfg) {
	const channels = cfg.channels;
	if (!channels || typeof channels !== "object" || Array.isArray(channels)) return false;
	return Object.entries(channels).some(([channelId, entry]) => {
		if (channelId === "defaults" || channelId === "modelByChannel") return false;
		return Boolean(entry && typeof entry === "object" && !Array.isArray(entry) && Object.keys(entry).length > 0);
	});
}
async function assertConfiguredAnnounceChannel(params) {
	if (params.channel === "last") return;
	const normalizedChannel = normalizeMessageChannel(params.channel);
	if (!normalizedChannel && params.field === "delivery.channel") return;
	const configuredChannels = (await listConfiguredMessageChannels(params.cfg)).toSorted();
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
	if (!configuredChannels.includes(normalizedChannel)) throw new Error(`${params.field} must be one of: ${configuredChannels.join(", ")}`);
}
/**
* Rejects an announce account the operator has turned off in config, so a job is
* not scheduled against a route its owner already disabled - the same late failure
* this file prevents for `channel` (see `assertValidCronFailureAlert`).
*
* Scoped to a matching `accounts.<id>.enabled: false` entry, and nothing else.
* Cron delivery ids are not always operator-typed (`delivery-context.ts` copies
* the current context account into inferred jobs); channel `isEnabled` adapters
* report unlisted or credential-suppressed accounts as not enabled; and a
* top-level `channels.<id>.enabled: false` is not uniformly channel-wide - twitch
* resolves named accounts from `accounts` alone. Only the account entry itself is
* an unambiguous statement about this route.
*/
function assertEnabledAnnounceAccount(params) {
	if (!params.accountId || !params.channel || params.channel === "last") return;
	const channel = normalizeMessageChannel(params.channel) ?? params.channel;
	const channelConfig = params.cfg.channels?.[channel];
	if (!channelConfig || typeof channelConfig !== "object" || Array.isArray(channelConfig)) return;
	const accounts = channelConfig.accounts;
	if (resolveChannelAccountEntry(accounts, params.accountId, channel, normalizeAccountId)?.enabled !== false) return;
	throw new Error(`${params.field}: account "${params.accountId}" is disabled for channel ${channel}`);
}
function resolveAnnounceValidationChannel(params) {
	return params.channel && params.channel !== "last" ? params.channel : resolveTargetPrefixedChannel(params.to) ?? params.channel;
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
	assertCanonicalCronDeliveryMode(params.delivery);
	if (params.delivery?.mode === "announce") {
		assertCompatibleAnnounceTarget({
			channel: params.delivery.channel,
			to: params.delivery.to,
			field: "delivery.channel"
		});
		await assertConfiguredAnnounceChannel({
			cfg: params.cfg,
			channel: resolveAnnounceValidationChannel(params.delivery),
			field: "delivery.channel"
		});
		assertEnabledAnnounceAccount({
			cfg: params.cfg,
			channel: resolveAnnounceValidationChannel(params.delivery),
			accountId: params.delivery.accountId,
			field: "delivery.accountId"
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
			channel: resolveAnnounceValidationChannel(failureDestination),
			field: "delivery.failureDestination.channel"
		});
	}
}
/**
* Validates the per-job `failureAlert` channel the same way announce delivery is
* validated. `failureAlert` is a distinct field from `delivery.failureDestination`
* (its own store columns and delivery path), so it needs its own check - otherwise
* an explicit unknown channel (e.g. a Slack `C0...` id passed to
* `--failure-alert-channel`) is stored and only fails later as `channel_not_found`.
*/
async function assertValidCronFailureAlert(params) {
	const failureAlert = resolveFailureAlert({ deps: { cronConfig: params.cfg.cron } }, {
		delivery: params.delivery,
		failureAlert: params.failureAlert
	});
	if (!failureAlert || failureAlert.mode === "webhook") return;
	assertCompatibleAnnounceTarget({
		channel: failureAlert.channel,
		to: failureAlert.to,
		field: "failureAlert.channel"
	});
	await assertConfiguredAnnounceChannel({
		cfg: params.cfg,
		channel: failureAlert.channel,
		field: "failureAlert.channel"
	});
}
async function assertValidCronCreateDelivery(cfg, job) {
	await assertValidCronAnnounceDelivery({
		cfg,
		delivery: job.delivery
	});
	await assertValidCronFailureAlert({
		cfg,
		failureAlert: job.failureAlert,
		delivery: job.delivery
	});
}
//#endregion
//#region src/cron/delivery-preview.ts
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
function prepareCronDeliveryPreview(params) {
	if (!hasCanonicalCronDeliveryMode(params.job.delivery)) return { preview: {
		label: "delivery requires review",
		detail: CRON_DELIVERY_REPAIR_REQUIRED_MESSAGE
	} };
	const agentId = tryResolveCronJobEffectiveAgentId(params.job, params.defaultAgentId ?? tryResolveAmbientOwnerAgentId(params.cfg));
	const refusal = agentId ? readAgentDatabaseAdmissionRefusal(agentId) : void 0;
	if (refusal) return { preview: {
		label: `agent ${agentId} unavailable`,
		detail: `${refusal.reason}\n${refusal.repairHint}`
	} };
	const plan = resolveCronDeliveryPlan(params.job);
	if (plan.mode === "none" && !hasExplicitCronDeliveryTarget(plan)) return { preview: {
		label: "not requested",
		detail: "not requested"
	} };
	if (plan.mode === "webhook") return { preview: {
		label: plan.to ? `webhook:${plan.to}` : "webhook",
		detail: plan.to ? "webhook" : "webhook target missing"
	} };
	const requestedChannel = plan.channel ?? "last";
	if (!agentId) return { preview: {
		label: `${plan.mode} -> unresolved owner`,
		detail: CRON_AGENT_SELECTION_REQUIRED_MESSAGE
	} };
	return {
		plan,
		requestedChannel,
		agentId,
		sessionTarget: params.job.payload.kind === "agentTurn" ? params.job.sessionTarget : void 0,
		deliverySessionKey: resolveCronDeliverySessionKey(params.job)
	};
}
async function resolvePreparedCronDeliveryPreview(cfg, prepared, sessionContext) {
	if (prepared.preview) return prepared.preview;
	const { plan, requestedChannel, agentId, sessionTarget, deliverySessionKey } = prepared;
	let resolved;
	try {
		if (sessionContext && !sessionContext.ok) throw sessionContext.error;
		resolved = await resolveDeliveryTarget(cfg, agentId, {
			...plan,
			sessionTarget,
			sessionKey: deliverySessionKey
		}, {
			dryRun: true,
			...sessionContext ? { sessionContext: sessionContext.value } : {}
		});
	} catch (error) {
		if (!(error instanceof SessionMetadataUnavailableError)) throw error;
		return {
			label: `${plan.mode} -> ${formatTarget(requestedChannel, plan.to ?? null)}`,
			detail: `delivery preview unavailable: ${formatErrorMessage(error)}`
		};
	}
	if (!resolved.ok) {
		if (sessionTarget === "current" && plan.mode === "announce" && !requiresExternalCronDelivery(plan, resolved)) return {
			label: "announce -> current session",
			detail: "commits to this conversation (no external channel route)"
		};
		return {
			label: `${plan.mode} -> ${formatTarget(requestedChannel, plan.to ?? null)}`,
			detail: plan.mode === "none" ? `message tool target unresolved: ${resolved.error.message}` : formatDeliveryDetail({
				requestedChannel,
				resolved: false,
				sessionKey: deliverySessionKey,
				error: resolved.error.message
			})
		};
	}
	return {
		label: `${plan.mode} -> ${formatTarget(resolved.channel, resolved.to)}`,
		detail: formatDeliveryDetail({
			requestedChannel,
			resolved: true,
			sessionKey: deliverySessionKey
		})
	};
}
/** Builds the user-visible cron delivery preview for one job without sending anything. */
async function resolveCronDeliveryPreview(params) {
	return resolvePreparedCronDeliveryPreview(params.cfg, prepareCronDeliveryPreview(params));
}
/** Builds cron delivery previews keyed by job id. */
async function resolveCronDeliveryPreviews(params) {
	const prepared = params.jobs.map((job) => prepareCronDeliveryPreview({
		...params,
		job
	}));
	const targets = prepared.flatMap((preview, index) => preview.preview ? [] : [{
		index,
		agentId: preview.agentId,
		sessionKey: preview.deliverySessionKey
	}]);
	const contexts = await prepareCronDeliveryTargetContexts(params.cfg, targets);
	const contextByIndex = new Map(targets.map((target, index) => [target.index, contexts[index]]));
	const entries = await Promise.all(params.jobs.map(async (job, index) => {
		const context = contextByIndex.get(index);
		return [job.id, await resolvePreparedCronDeliveryPreview(params.cfg, prepared[index], context)];
	}));
	return Object.fromEntries(entries);
}
//#endregion
//#region src/cron/validate-timestamp.ts
/** Validates user-supplied one-shot cron timestamps before scheduling. */
const ONE_MINUTE_MS = 6e4;
const TEN_YEARS_MS = 315576e6;
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
		message: `schedule.at is too far in the future: ${resolveTimestampMsToIsoString(atMs)} (${Math.floor(diffMs / 315576e5)} years ahead). Maximum allowed: 10 years`
	};
	return { ok: true };
}
//#endregion
//#region src/gateway/server-methods/cron-caller-scope.ts
function resolveCronCreatorAuthorityCapture(callerScope) {
	const grant = callerScope?.cronCreatorAuthorityGrant;
	if (!grant) return;
	if (resolveCronCreatorAuthorityGrantProvenance(grant, grant.runId)?.capturesRuntimeAuthority === false) return;
	if (callerScope.toolsAllowProvenance?.source !== "final-executable-surface") throw new TypeError("cron creator authority grant is missing tool-surface provenance");
	let consumed;
	return {
		captureRuntimeAuthority() {
			consumed = consumeCronCreatorAuthorityGrant(grant);
			return consumed.authority;
		},
		assertCurrent() {
			consumed?.assertCurrent();
		}
	};
}
function resolveCronMutationCommitGuard(client, context, jobScope, callerAuthority) {
	const validatesAuthority = client?.internal?.agentRuntimeIdentity && context.validateAgentRuntimeApprovalAuthority;
	const identity = client?.internal?.agentRuntimeIdentity;
	const manageAll = identity ? getCronManagementAuthority(identity) : void 0;
	const creatorGrant = identity?.cronCreatorAuthorityGrant;
	const requesterGrant = creatorGrant && identity && resolveCronCreatorAuthorityGrantProvenance(creatorGrant, identity.operationalRunInstance.runId)?.capturesRuntimeAuthority === false ? creatorGrant : void 0;
	if (!validatesAuthority && !jobScope?.callerScope && !manageAll && !requesterGrant && !callerAuthority?.sessionMutationCommitGuard && !callerAuthority?.hasCurrentClientAuthority) return;
	let consumedRequester;
	return bindGatewayDeviceRevocation(() => {
		callerAuthority?.sessionMutationCommitGuard?.();
		if (callerAuthority?.hasCurrentClientAuthority?.() === false) throw new TypeError("Gateway caller authority is no longer active.");
		manageAll?.();
		if (validatesAuthority) assertActiveAgentRuntimeAuthority(client, context);
		if (jobScope?.callerScope) {
			const callerScope = readCronCallerScope(client);
			const job = context.cron.getJob(jobScope.jobId);
			if (!callerScope || !job || jobScope.expectedConfigRevision !== void 0 && resolveCronJobConfigRevision(job) !== jobScope.expectedConfigRevision || !cronJobMatchesCallerScope({
				job,
				callerScope,
				defaultAgentId: context.cron.getDefaultAgentId(),
				allowCurrentJob: jobScope.allowCurrentJob
			})) throw new TypeError(`unknown cron job id: ${jobScope.jobId}`);
		}
		if (requesterGrant) {
			if (consumedRequester) consumedRequester.assertCurrent();
			else consumedRequester = consumeCronCreatorAuthorityGrant(requesterGrant);
		}
	}, callerAuthority?.hasCurrentClientAuthority);
}
function readCronCallerScope(client) {
	const identity = client?.internal?.agentRuntimeIdentity;
	if (!identity?.agentId) return;
	const cronSelfManagementContext = identity.cronSelfManagementContext;
	const currentJobId = cronSelfManagementContext && Date.now() < cronSelfManagementContext.expiresAtMs ? cronSelfManagementContext.jobId.trim() || void 0 : void 0;
	const sourceChannel = identity.turnSourceChannel?.trim().toLowerCase();
	const manageAll = getCronManagementAuthority(identity);
	const fallbackCallerOrigin = sourceChannel ? {
		kind: "external",
		channel: sourceChannel
	} : identity.turnSourceLocal === true ? { kind: "local" } : { kind: "unknown" };
	const grantProvenance = identity.cronCreatorAuthorityGrant ? resolveCronCreatorAuthorityGrantProvenance(identity.cronCreatorAuthorityGrant, identity.operationalRunInstance.runId) : void 0;
	const requester = manageAll ? getCronManagementChannelRequester(identity) : grantProvenance?.channelRequester;
	const authenticatedCallerOrigin = manageAll ? getCronManagementCallerOrigin(identity) : grantProvenance?.callerOrigin;
	const callerOrigin = authenticatedCallerOrigin ?? fallbackCallerOrigin;
	const channelRequester = requester && requester.channel === sourceChannel && requester.accountId === normalizeAccountId(identity.turnSourceAccountId) ? requester : void 0;
	const surfaceProvenance = !manageAll && identity.cronToolsAllowCapture === "final-executable-surface" ? {
		version: 1,
		source: "final-executable-surface",
		callerOrigin
	} : void 0;
	const authenticatedRequesterProvenance = authenticatedCallerOrigin ? {
		version: 1,
		source: "authenticated-requester",
		callerOrigin: authenticatedCallerOrigin,
		...channelRequester ? { channelRequester } : {}
	} : channelRequester ? {
		version: 1,
		source: "authenticated-requester",
		channelRequester
	} : void 0;
	const toolsAllowProvenance = surfaceProvenance ? {
		...surfaceProvenance,
		...channelRequester ? { channelRequester } : {}
	} : authenticatedRequesterProvenance;
	return {
		kind: "agentTool",
		agentId: normalizeAgentId(identity.agentId),
		sessionKey: identity.sessionKey?.trim() || void 0,
		accountId: normalizeAccountId(identity.turnSourceAccountId),
		currentJobId,
		manageAll,
		...toolsAllowProvenance ? { toolsAllowProvenance } : {},
		...surfaceProvenance && identity.cronExecToolTarget?.host === "gateway" ? { toolsAllowExecTarget: {
			version: 1,
			...identity.cronExecToolTarget
		} } : {},
		...!manageAll && identity.cronCreatorAuthorityGrant ? { cronCreatorAuthorityGrant: identity.cronCreatorAuthorityGrant } : {}
	};
}
/** Management access can reauthorize origin, but cannot lend another account native identity. */
function resolveCronRequesterProvenanceForJob(job, callerScope) {
	const provenance = callerScope?.toolsAllowProvenance;
	if (!provenance?.channelRequester) return provenance;
	if (job.owner?.sessionKey === callerScope?.sessionKey && normalizeAccountId(job.owner?.accountId) === callerScope?.accountId) return provenance;
	if (provenance.source === "final-executable-surface") {
		const { channelRequester: _requester, ...surfaceProvenance } = provenance;
		return surfaceProvenance;
	}
	return provenance.callerOrigin ? {
		version: 1,
		source: "authenticated-requester",
		callerOrigin: provenance.callerOrigin
	} : void 0;
}
/** Converts the authenticated gateway caller into server-only scheduled authority provenance. */
function resolveCronScheduledToolPolicyForCaller(callerScope) {
	if (!callerScope) return createTrustedCronScheduledToolPolicy();
	const policy = callerScope.sessionKey ? createAccountCronScheduledToolPolicy({
		ownerSessionKey: callerScope.sessionKey,
		ownerAccountId: callerScope.accountId
	}) : void 0;
	if (!policy) throw new TypeError("agent-runtime cron mutations require an authenticated session identity");
	return policy;
}
function parseAgentIdFromSessionRef(value, fallbackAgentId) {
	const trimmed = value?.trim();
	return trimmed ? parseAgentSessionKey(trimmed)?.agentId ?? fallbackAgentId : void 0;
}
function resolveCronJobOwnerAgentId(job) {
	const ownerAgentId = job.owner?.agentId?.trim() || parseAgentIdFromSessionRef(job.owner?.sessionKey);
	return ownerAgentId ? normalizeAgentId(ownerAgentId) : void 0;
}
function isOperatorCommandCronJob(job) {
	return job.payload.kind === "command" || job.schedule.kind === "on-exit" || job.schedule.kind === "stream";
}
function cronJobMatchesCallerScope(params) {
	if (!params.callerScope) return true;
	if (params.callerScope.manageAll) {
		params.callerScope.manageAll();
		return true;
	}
	if (isOperatorCommandCronJob(params.job)) return false;
	const effectiveAgentId = tryResolveCronJobEffectiveAgentId(params.job, params.defaultAgentId);
	const policy = params.job.scheduledToolPolicy;
	if (params.allowCurrentJob === true && params.callerScope.currentJobId === params.job.id && effectiveAgentId === params.callerScope.agentId && (policy?.mode !== "account" || normalizeAccountId(policy.ownerAccountId) === params.callerScope.accountId)) return true;
	if (policy && (policy.mode === "trusted" || params.callerScope.sessionKey?.trim() !== policy.ownerSessionKey || params.job.owner?.sessionKey?.trim() !== policy.ownerSessionKey || params.callerScope.accountId !== normalizeAccountId(policy.ownerAccountId))) return false;
	const ownerAccountId = params.job.owner?.accountId;
	if (ownerAccountId && normalizeAccountId(ownerAccountId) !== params.callerScope.accountId) return false;
	const ownerAgentId = resolveCronJobOwnerAgentId(params.job);
	if (ownerAgentId) return ownerAgentId === params.callerScope.agentId;
	if (effectiveAgentId !== params.callerScope.agentId) return false;
	return cronPatchSessionRefsMatchCaller(params.job, params.callerScope);
}
function cronJobMatchesDeclarationScope(params) {
	if (params.callerScope) return cronJobMatchesCallerScope(params);
	if (normalizeAccountId(params.job.owner?.accountId) !== normalizeAccountId(params.input.owner?.accountId)) return false;
	const inputOwnerSessionKey = params.input.owner?.sessionKey;
	const inputOwnerAgentId = resolveCronJobOwnerAgentId(params.input);
	if (inputOwnerSessionKey && !inputOwnerAgentId) return params.job.owner?.sessionKey === inputOwnerSessionKey;
	const inputAgentId = inputOwnerAgentId ?? resolveCronJobEffectiveAgentId(params.input, params.defaultAgentId);
	return (resolveCronJobOwnerAgentId(params.job) ?? tryResolveCronJobEffectiveAgentId(params.job, params.defaultAgentId)) === inputAgentId;
}
function cronCreateMatchesCallerScope(params) {
	if (!params.callerScope) return true;
	if (resolveCronJobEffectiveAgentId(params.job, params.defaultAgentId) !== params.callerScope.agentId) return false;
	return cronPatchSessionRefsMatchCaller(params.job, params.callerScope);
}
function applyCronCreateCallerScopeDefault(job, callerScope) {
	if (!callerScope) return job;
	return {
		...job,
		agentId: job.agentId?.trim() ? job.agentId : callerScope.agentId,
		owner: {
			agentId: callerScope.agentId,
			...callerScope.sessionKey ? { sessionKey: callerScope.sessionKey } : {},
			accountId: callerScope.accountId
		}
	};
}
function cronPatchSessionRefsMatchCaller(patch, callerScope) {
	if (!callerScope || callerScope.manageAll) {
		callerScope?.manageAll?.();
		return true;
	}
	const target = patch.sessionTarget?.trim();
	return [patch.sessionKey, target?.startsWith("session:") ? target.slice(8) : void 0].every((ref) => {
		const agentId = parseAgentIdFromSessionRef(ref, callerScope.agentId);
		return !agentId || normalizeAgentId(agentId) === callerScope.agentId;
	});
}
//#endregion
//#region src/gateway/server-methods/cron-error-classification.ts
function isCronInvalidRequestError(err) {
	const message = formatErrorMessage(err);
	return message === "Agent-less cron job has no resolvable owner. Pass --agent <id> when creating or editing the job, or set agents.defaults.systemAgent.agentId." || message === "cron delivery requires an explicit mode: \"none\", \"announce\", or \"webhook\"; run openclaw doctor --fix for legacy settings or explicitly edit delivery.mode" || message.startsWith("unknown cron job id:") || message.startsWith("cron job already exists:") || message.includes("cron job id must not be blank") || message.includes("cron declarationKey") || message.includes("cron displayName") || message.includes("cron announce delivery requires an explicit channel") || message.includes("cron script payload has a syntax error") || message.includes("cron trigger script has a syntax error") || message.includes("cron script payload must not be empty") || message.includes("cron script payloads cannot be combined") || message.includes("cron script payloads are disabled") || message.includes("cron triggers are disabled") || message.includes("cron triggers require") || message.includes("cron trigger every interval") || message.includes("cron job is missing sessionTarget") || message.includes("invalid cron sessionTarget session id") || message.includes("main cron jobs require payload.kind=\"systemEvent\"") || message.includes("isolated/current/session cron jobs require payload.kind=\"agentTurn\"") || message.includes("has no upcoming run time and would never fire") || message.includes("sessionTarget \"main\" is only valid for the default agent") || message.includes("cron.update payload.kind=\"systemEvent\" requires text") || message.includes("cron.update payload.kind=\"agentTurn\" requires message") || message.includes("cron webhook delivery requires") || message.includes("delivery.channel") || message.includes("delivery.accountId") || message.includes("delivery.failureDestination.channel") || message.includes("failureAlert.channel") || message.includes("cron completion destination webhook requires") || message.includes("cron failure destination webhook requires") || message.includes("cron channel delivery config is only supported") || message.includes("cron delivery.failureDestination is only supported");
}
//#endregion
//#region src/gateway/server-methods/cron-visibility.ts
function resolveCronEntryFilter(client, cfg) {
	const identity = client?.internal?.agentRuntimeIdentity;
	if (identity && getCronManagementAuthority(identity)) return;
	const sharing = prepareProjectedSessionSharing({
		client,
		cfg,
		isMember: () => false
	});
	return sharing.sessionCap === "none" ? sharing.entryFilter : void 0;
}
/** Request custody belongs to the existing exact sharing reader, including after awaits. */
function createCronSessionVisibility(client, getConfig) {
	const reads = /* @__PURE__ */ new Map();
	const keyFor = (target, cfg) => {
		const identity = resolveSessionStoreIdentity({
			...target,
			cfg
		});
		return {
			...identity,
			key: `${identity.agentId}\0${identity.canonicalKey}`
		};
	};
	return {
		prepare(targets) {
			const cfg = getConfig();
			if (!resolveCronEntryFilter(client, cfg) || !targets.some((target) => target && !reads.has(keyFor(target, cfg).key))) return;
			return (async () => {
				for (const target of targets) {
					if (!target) continue;
					const { key, agentId } = keyFor(target, cfg);
					if (!reads.has(key)) reads.set(key, await prepareSessionMutationFacts({
						cfg,
						sessionKey: target.sessionKey,
						agentId,
						allowMissing: true
					}));
				}
			})();
		},
		resolve() {
			if (!resolveCronEntryFilter(client, getConfig())) return;
			return (sessionKey, agentId) => {
				const cfg = getConfig();
				const filter = resolveCronEntryFilter(client, cfg);
				if (!filter) return true;
				const { key } = keyFor({
					sessionKey,
					agentId
				}, cfg);
				const target = reads.get(key)?.readCurrent(cfg).target;
				return Boolean(target && filter(target.canonicalKey, target.entry));
			};
		},
		release() {
			for (const read of reads.values()) read.release();
			reads.clear();
		}
	};
}
function cronJobVisibilityTarget(job, defaultAgentId) {
	if (!job) return;
	const sessionKey = job.owner?.sessionKey ?? resolveCronSessionTargetSessionKey(job.sessionTarget) ?? job.sessionKey;
	if (!sessionKey) return;
	const agentId = resolveCronJobOwnerAgentId(job) ?? tryResolveCronJobEffectiveAgentId(job, defaultAgentId);
	return agentId ? {
		sessionKey,
		agentId
	} : void 0;
}
function cronJobIsVisible(job, visibility, defaultAgentId) {
	if (!visibility) return true;
	const target = cronJobVisibilityTarget(job, defaultAgentId);
	return Boolean(target && visibility(target.sessionKey, target.agentId));
}
//#endregion
//#region src/gateway/server-methods/cron-job-access.ts
function isLegacyCreatorPromptUpdate(job, patch, callerScope) {
	return callerScope?.sessionKey !== void 0 && job.owner?.sessionKey === callerScope.sessionKey && job.owner?.accountId === callerScope.accountId && job.scheduledToolPolicy === void 0 && job.payload.kind === "agentTurn" && patch.payload !== void 0 && (patch.payload.kind === void 0 || patch.payload.kind === "agentTurn") && Object.keys(patch).every((key) => key === "payload") && Object.keys(patch.payload).every((key) => key === "kind" || key === "message");
}
function respondRefusedCronAgent(agentId, respond) {
	const refusal = agentId ? readAgentDatabaseAdmissionRefusal(agentId) : void 0;
	if (!refusal) return false;
	respond(false, void 0, createAgentDatabaseAdmissionErrorShape(refusal));
	return true;
}
function assertCronReadCurrent(options) {
	options.signal?.throwIfAborted();
	if (options.hasCurrentClientAuthority?.() === false) throw new Error("Cron history authority closed");
	assertActiveAgentRuntimeAuthority(options.client, options.context);
}
function resolveCronJobId(params) {
	return normalizeOptionalString(params.id ?? params.jobId);
}
function respondInvalidCronParams(respond, method, reason) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid ${method} params: ${reason}`));
}
function respondMissingCronJobId(respond, method) {
	respondInvalidCronParams(respond, method, "missing id");
}
function respondCronJobNotFound(respond, jobId, options = {}) {
	const message = options.preserveCronGetWireMessage ? `cron job not found: ${jobId}. List automations and retry with a current job id.` : `Automation not found: ${jobId}. List automations and retry with a current job id.`;
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `${message} For cross-session management, use a fresh authenticated configured channel owner or Control UI administrator turn or the Automations page.`, { details: {
		code: GatewayErrorDetailCodes.CRON_JOB_NOT_FOUND,
		jobId
	} }));
}
function scopedCronJobHandler(method, validate, run, scope = {}) {
	return defineValidatedGatewayHandler(method, validate, async (options) => {
		const { params, respond, client, context } = options;
		const jobId = resolveCronJobId(params);
		if (!jobId) {
			respondMissingCronJobId(respond, method);
			return;
		}
		const visibilityRead = createCronSessionVisibility(client, () => context.getRuntimeConfig());
		try {
			const loaded = await context.cron.readJob(jobId);
			const prepareVisibility = scope.checkVisibility && visibilityRead.resolve() !== void 0;
			if (scope.checkVisibility) assertCronReadCurrent(options);
			if (prepareVisibility) {
				await visibilityRead.prepare([cronJobVisibilityTarget(loaded, context.cron.getDefaultAgentId())]);
				assertCronReadCurrent(options);
			}
			const callerScope = readCronCallerScope(client);
			const job = prepareVisibility ? context.cron.getJob(jobId) : loaded;
			const visibility = scope.checkVisibility ? visibilityRead.resolve() : void 0;
			if (!job || scope.checkVisibility && !cronJobIsVisible(job, visibility, context.cron.getDefaultAgentId()) || !cronJobMatchesCallerScope({
				job,
				callerScope,
				defaultAgentId: context.cron.getDefaultAgentId(),
				allowCurrentJob: scope.allowCurrentJob
			})) {
				respondCronJobNotFound(respond, jobId, scope);
				return;
			}
			return await run(options, {
				jobId,
				callerScope,
				job
			});
		} finally {
			visibilityRead.release();
		}
	});
}
//#endregion
//#region src/gateway/server-methods/cron-history.ts
const MAX_CRON_HISTORY_BYTES = 4194304;
const cronHistoryHandler = async (opts) => {
	const { params, respond, context, client } = opts;
	if (!assertValidParams(params, validateCronHistoryParams, "cron.history", respond)) return;
	if (!params.runId && params.runAtMs === void 0) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "cron.history requires an id and exact runId or runAtMs"));
		return;
	}
	const fail = () => respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "The recorded cron transcript is unavailable. Refresh the run and try again."));
	const storeKey = cronStoreKey(context.cronStorePath);
	const sessionVisibility = createCronSessionVisibility(client, () => context.getRuntimeConfig());
	const assertAllowed = (sessionKey, agentId) => {
		assertCronReadCurrent(opts);
		const callerScope = readCronCallerScope(client);
		const visibility = sessionVisibility.resolve();
		const job = context.cron.getJob(params.id);
		const defaultAgentId = context.cron.getDefaultAgentId();
		if ((callerScope || visibility) && (!job || !cronJobMatchesCallerScope({
			job,
			callerScope,
			defaultAgentId,
			allowCurrentJob: true
		}) || !cronJobIsVisible(job, visibility, defaultAgentId))) throw new Error("Cron job not found");
		if (sessionKey && visibility && !visibility(sessionKey, agentId)) throw new Error("Cron transcript not found");
	};
	try {
		await context.cron.readJob(params.id);
		assertCronReadCurrent(opts);
		await sessionVisibility.prepare([cronJobVisibilityTarget(context.cron.getJob(params.id), context.cron.getDefaultAgentId())]);
		assertAllowed();
		const select = async () => (await readCronRunRecords(storeKey, params.id)).flatMap((record) => {
			const entry = cronRunRecordToRunLogEntry(record);
			return entry && (!params.runId || entry.runId === params.runId) && (params.runAtMs === void 0 || entry.runAtMs === params.runAtMs) ? [{
				record,
				entry
			}] : [];
		});
		const matches = await select();
		assertAllowed();
		const selected = matches.length === 1 ? matches[0] : void 0;
		const sessionKey = selected?.entry.sessionKey;
		const sessionId = selected?.entry.sessionId;
		if (!selected || !sessionKey || !sessionId) {
			fail();
			return;
		}
		const agentId = parseAgentSessionKey(sessionKey)?.agentId ?? selected.record.agentId;
		const bindingFor = (value) => createHash("sha256").update(JSON.stringify([
			storeKey,
			value.record.id,
			value.record.runId,
			value.entry.jobId,
			value.entry.runId,
			value.entry.runAtMs,
			value.entry.sessionKey,
			value.entry.sessionId,
			value.record.agentId
		])).digest("base64url");
		const binding = bindingFor(selected);
		let offset = 0;
		if (params.cursor) {
			const cursor = JSON.parse(Buffer.from(params.cursor, "base64url").toString("utf8"));
			if (!Array.isArray(cursor) || cursor.length !== 2 || cursor[0] !== binding || !Number.isSafeInteger(cursor[1]) || cursor[1] < 0) throw new Error("Invalid cron history cursor");
			offset = cursor[1];
		}
		const scope = {
			agentId,
			sessionId,
			storePath: resolveSessionStorePathCore(context.getRuntimeConfig().session?.store, { agentId })
		};
		const assertCurrent = (transcriptSessionKey) => {
			if (cronStoreKey(context.cronStorePath) !== storeKey || resolveSessionStorePathCore(context.getRuntimeConfig().session?.store, { agentId }) !== scope.storePath) throw new Error("Cron history store changed");
			assertAllowed(transcriptSessionKey, agentId);
		};
		assertCurrent();
		const physical = await readSessionHistoryPageInWorker({
			kind: "transcript-binding",
			params: { target: scope }
		}, opts.signal);
		assertCurrent();
		const { baseSessionKey } = parseCronRunScopeSuffix(sessionKey);
		if (!physical || physical.sessionKey !== sessionKey && physical.sessionKey !== baseSessionKey) {
			fail();
			return;
		}
		await sessionVisibility.prepare([{
			sessionKey: physical.sessionKey,
			agentId
		}]);
		assertCurrent(physical.sessionKey);
		const { handleChatHistoryRequest } = await import("./chat-history-handler-3CaPO4dh.mjs");
		assertCurrent(physical.sessionKey);
		await handleChatHistoryRequest({
			...opts,
			method: "chat.history",
			retainedTranscript: {
				sessionId,
				verifyRetainedState: async () => {
					await context.cron.readJob(params.id);
					assertCurrent(physical.sessionKey);
					const current = await select();
					assertCurrent(physical.sessionKey);
					return current.length === 1 && bindingFor(current[0]) === binding;
				}
			},
			params: {
				sessionKey: physical.sessionKey,
				...agentId ? { agentId } : {},
				limit: params.limit ?? 100,
				offset,
				maxBytes: 4177920
			},
			respond: (ok, payload, error) => {
				if (!ok) {
					respond(false, void 0, error);
					return;
				}
				const page = asOptionalRecord(payload);
				const result = {
					messages: page?.messages,
					...page?.activity ? { activity: page.activity } : {},
					...page?.hasMore === true && typeof page.nextOffset === "number" ? { nextCursor: Buffer.from(JSON.stringify([binding, page.nextOffset])).toString("base64url") } : {}
				};
				if (!Value.Check(CronHistoryResultSchema, result) || Buffer.byteLength(JSON.stringify(result)) > MAX_CRON_HISTORY_BYTES) throw new Error("Invalid cron transcript page");
				assertCurrent(physical.sessionKey);
				respond(true, result);
			}
		});
	} catch {
		fail();
	} finally {
		sessionVisibility.release();
	}
};
//#endregion
//#region src/gateway/server-methods/cron-input-validation.ts
function normalizeCronRequestDeliveryMode(input) {
	const delivery = input?.delivery;
	if (typeof delivery?.mode === "string" && delivery.mode.trim().toLowerCase() === "deliver") delivery.mode = "announce";
}
/** Validate authored fields before normalization can erase blank or invalid input. */
function normalizeCronAddRequest(params) {
	const rawParams = asOptionalObjectRecord(params);
	for (const key of ["declarationKey", "displayName"]) {
		const value = rawParams?.[key];
		if (typeof value === "string" && value.trim().length === 0) throw new Error(`${key} must not be blank`);
	}
	const hasEnabled = Boolean(rawParams && Object.hasOwn(rawParams, "enabled"));
	const parsedEnabled = hasEnabled ? parseBoolean(rawParams?.enabled) : void 0;
	if (hasEnabled && parsedEnabled === void 0) throw new Error("enabled must be a boolean");
	assertCronDeliveryInputNonBlankFields(rawParams?.delivery);
	const normalized = normalizeCronJobCreate(params, { sessionContext: { sessionKey: readStringField(rawParams, "sessionKey") } });
	normalizeCronRequestDeliveryMode(normalized);
	return {
		candidate: normalized ?? params,
		enabledExplicit: parsedEnabled !== void 0
	};
}
function normalizeCronUpdateRequest(params) {
	const rawParams = asOptionalObjectRecord(params);
	const rawPatch = rawParams?.patch;
	const patchFields = asOptionalObjectRecord(rawPatch);
	const rawDisplayName = patchFields?.displayName;
	if (typeof rawDisplayName === "string" && rawDisplayName.trim().length === 0) throw new Error("displayName must not be blank");
	assertCronDeliveryInputNonBlankFields(patchFields?.delivery);
	const normalizedPatch = normalizeCronJobPatch(rawPatch);
	normalizeCronRequestDeliveryMode(normalizedPatch);
	return {
		candidate: normalizedPatch && rawParams ? {
			...rawParams,
			patch: normalizedPatch
		} : params,
		normalizedPatch
	};
}
async function assertValidCronUpdatePatch(params) {
	const nextJob = structuredClone(params.currentJob);
	applyJobPatch(nextJob, params.patch, {
		defaultAgentId: params.defaultAgentId,
		cronConfig: params.cfg.cron
	});
	if ("agentId" in params.patch || "sessionTarget" in params.patch || "sessionKey" in params.patch) assertCronDoesNotTargetAgentHarness(nextJob);
	const effectiveDelivery = params.patch.delivery?.channel === null && nextJob.delivery && (nextJob.delivery.mode ?? "announce") === "announce" && nextJob.delivery.channel === void 0 && resolveTargetPrefixedChannel(nextJob.delivery.to) === void 0 ? {
		...nextJob.delivery,
		channel: "last"
	} : nextJob.delivery;
	if ("delivery" in params.patch) await assertValidCronAnnounceDelivery({
		cfg: params.cfg,
		delivery: effectiveDelivery
	});
	const failureAlertPatch = params.patch.failureAlert;
	const failureAlertRoutingPatched = failureAlertPatch && ("channel" in failureAlertPatch || "to" in failureAlertPatch || "mode" in failureAlertPatch);
	const currentAlert = resolveFailureAlert({ deps: { cronConfig: params.cfg.cron } }, params.currentJob);
	const nextAlert = resolveFailureAlert({ deps: { cronConfig: params.cfg.cron } }, {
		...nextJob,
		delivery: effectiveDelivery
	});
	const alertNewlyEnabled = currentAlert === null && nextAlert !== null;
	const alertRouteChanged = currentAlert?.mode !== nextAlert?.mode || currentAlert?.channel !== nextAlert?.channel || currentAlert?.to !== nextAlert?.to || currentAlert?.accountId !== nextAlert?.accountId || currentAlert?.threadId !== nextAlert?.threadId;
	if (failureAlertRoutingPatched || alertNewlyEnabled || alertRouteChanged && (params.patch.delivery !== void 0 || failureAlertPatch === null)) await assertValidCronFailureAlert({
		cfg: params.cfg,
		failureAlert: nextJob.failureAlert,
		delivery: effectiveDelivery
	});
	return nextJob;
}
function assertCronDoesNotTargetAgentHarness(input) {
	const targetSessionKey = resolveCronSessionTargetSessionKey(input.sessionTarget) ?? (input.sessionTarget === "current" ? input.sessionKey?.trim() : void 0);
	if (!targetSessionKey) return;
	const loaded = loadGatewaySessionEntryReadOnly(targetSessionKey, input.agentId?.trim() ? { agentId: input.agentId.trim() } : {});
	const reservedKey = isAgentHarnessSessionKey(targetSessionKey) || isAgentHarnessSessionKey(loaded.canonicalKey);
	if (loaded.entry?.modelSelectionLocked === true) throw new Error(reservedKey ? AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE : AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE);
	if (!reservedKey || loaded.entry) return;
	throw new Error(AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE);
}
function createCronCreatorSessionGuard(callerScope, creatorSession) {
	const selectionIdentity = JSON.stringify(creatorSession?.skillLibrarySelections);
	return () => {
		if (creatorSession && callerScope?.sessionKey) {
			const latest = loadGatewaySessionEntryReadOnly(callerScope.sessionKey, { agentId: callerScope.agentId }).entry;
			if (latest?.sessionId !== creatorSession.sessionId || latest.lifecycleRevision !== creatorSession.lifecycleRevision || JSON.stringify(latest.skillLibrarySelections) !== selectionIdentity) throw new Error("Creator session changed before scheduling; retry from the current turn.");
		}
	};
}
//#endregion
//#region src/gateway/server-methods/cron-list-diagnostics.ts
function startCronListDiagnostics(log, respond) {
	if (!areDiagnosticsEnabledForProcess()) return;
	let checkpoint = performance.now();
	const startedAt = checkpoint;
	const timing = createStageTimingTracker(() => checkpoint);
	const trace = getActiveDiagnosticTraceContext();
	let phase = "setup";
	let phaseStartedAt = checkpoint;
	let listingMs = 0;
	let sourcePageMs = 0;
	let sourcePageCount = 0;
	let scopeAttemptCount = 0;
	let returnedCount;
	let requestMode;
	let responseOutcome = "none";
	let finished = false;
	const mark = (nextPhase) => {
		if (finished) return;
		checkpoint = performance.now();
		timing.mark(phase);
		if (phase === "listing") listingMs = checkpoint - phaseStartedAt;
		phase = nextPhase;
		phaseStartedAt = checkpoint;
	};
	return {
		mark,
		setRequestMode(mode) {
			requestMode = mode;
		},
		setReturnedCount(count) {
			returnedCount = count;
		},
		startScopeAttempt() {
			scopeAttemptCount++;
		},
		startSourcePage() {
			sourcePageCount++;
			const pageStartedAt = performance.now();
			return () => {
				sourcePageMs += performance.now() - pageStartedAt;
			};
		},
		respond: ((...args) => {
			mark("response");
			responseOutcome = args[0] ? "ok" : "error";
			try {
				return respond(...args);
			} catch (error) {
				responseOutcome = "threw";
				throw error;
			} finally {
				mark("handlerExit");
			}
		}),
		finish(handlerOutcome) {
			if (finished) return;
			mark("handlerExit");
			finished = true;
			const elapsedMs = checkpoint - startedAt;
			if (elapsedMs < 1e3 || !areDiagnosticsEnabledForProcess()) return;
			try {
				runWithDiagnosticTraceContext(trace, () => log.warn("cron: slow list request", {
					operation: "cron.list",
					elapsedMs: Math.round(elapsedMs),
					phaseDurationsMs: Object.fromEntries(timing.snapshot().stages.map((stage) => [stage.name, stage.durationMs])),
					sourcePageMs: Math.round(sourcePageMs),
					sourcePageCount,
					scopeAttemptCount,
					...returnedCount === void 0 ? {} : { returnedCount },
					...requestMode?.scopeApplied ? { scopeProcessingMs: Math.round(listingMs - sourcePageMs) } : {},
					...requestMode,
					handlerOutcome,
					responseOutcome
				}));
			} catch {}
		}
	};
}
//#endregion
//#region src/gateway/server-methods/cron-list-projection.ts
function compactCronListJob(job) {
	return {
		id: job.id,
		name: job.name,
		...job.agentId !== void 0 ? { agentId: job.agentId } : {},
		updatedAtMs: job.updatedAtMs,
		...job.declarationKey ? { declarationKey: job.declarationKey } : {},
		...job.displayName ? { displayName: job.displayName } : {},
		...job.owner ? { owner: job.owner } : {},
		enabled: job.enabled,
		nextRunAt: timestampMsToIsoString(job.state.nextRunAtMs) ?? null,
		nextRunAtMs: job.state.nextRunAtMs ?? null,
		scheduleKind: job.schedule.kind,
		...job.schedule.kind === "at" || job.schedule.kind === "every" || job.schedule.kind === "cron" ? { schedule: job.schedule } : {},
		...job.trigger ? { trigger: true } : {},
		lastRunAt: timestampMsToIsoString(job.state.lastRunAtMs) ?? null,
		lastRunAtMs: job.state.lastRunAtMs ?? null,
		lastRunStatus: job.state.lastRunStatus ?? job.state.lastStatus ?? null,
		lastRunError: job.state.lastError ?? null,
		...job.state.runningAtMs !== void 0 ? { runningAtMs: job.state.runningAtMs } : {},
		...job.state.autoDisabled !== void 0 ? { autoDisabled: job.state.autoDisabled } : {},
		...job.state.lastDelivered !== void 0 ? { lastDelivered: job.state.lastDelivered } : {},
		...job.state.lastDeliveryStatus !== void 0 ? { lastDeliveryStatus: job.state.lastDeliveryStatus } : {},
		...job.state.lastDeliveryError !== void 0 ? { lastDeliveryError: job.state.lastDeliveryError } : {},
		...job.state.deliverySuppressionReason !== void 0 ? { deliverySuppressionReason: job.state.deliverySuppressionReason } : {},
		...job.state.lastFailureNotificationDelivered !== void 0 ? { lastFailureNotificationDelivered: job.state.lastFailureNotificationDelivered } : {},
		...job.state.lastFailureNotificationDeliveryStatus !== void 0 ? { lastFailureNotificationDeliveryStatus: job.state.lastFailureNotificationDeliveryStatus } : {},
		...job.state.lastFailureNotificationDeliveryError !== void 0 ? { lastFailureNotificationDeliveryError: job.state.lastFailureNotificationDeliveryError } : {}
	};
}
//#endregion
//#region src/gateway/server-methods/cron-run-log-filters.ts
function filterCronRunLogJobsByAgent(jobs, agentId, defaultAgentId) {
	if (!agentId) return [...jobs];
	const normalizedAgentId = normalizeAgentId(agentId);
	return jobs.filter((job) => tryResolveCronJobEffectiveAgentId(job, defaultAgentId) === normalizedAgentId);
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
//#endregion
//#region src/gateway/server-methods/cron-runs.ts
function collectSessionTargets(records, options, agentId) {
	const targets = [];
	projectCronRunHistoryPage(records, {
		...options,
		entryFilter: (entry) => {
			if (options.entryFilter?.(entry) !== false) {
				const sessionKey = entry.sessionKey?.trim();
				if (sessionKey) targets.push({
					sessionKey,
					agentId: parseAgentSessionKey(sessionKey)?.agentId ?? agentId
				});
			}
			return false;
		}
	});
	return targets;
}
const cronRunsHandler = async (options) => {
	const { params, respond, context, client } = options;
	if (!assertValidParams(params, validateCronRunsParams, "cron.runs", respond)) return;
	const p = params;
	const hasJobSelector = p.id !== void 0 || p.jobId !== void 0;
	const jobId = resolveCronJobId(p);
	const scope = p.scope ?? (hasJobSelector ? "job" : "all");
	const visibilityRead = createCronSessionVisibility(client, () => context.getRuntimeConfig());
	const assertCurrent = (storeKey) => {
		assertCronReadCurrent(options);
		if (cronStoreKey(context.cronStorePath) !== storeKey) throw new Error("Cron history store changed; retry the request");
	};
	try {
		if (scope === "all") {
			if (readCronCallerScope(client)) {
				respondInvalidCronParams(respond, "cron.runs", "scope all is not allowed by caller scope");
				return;
			}
			const listedJobs = await context.cron.list({ includeDisabled: true });
			const storeKey = cronStoreKey(context.cronStorePath);
			const records = await readCronRunRecords(storeKey);
			assertCurrent(storeKey);
			const currentJobs = () => filterCronRunLogJobsByAgent(listedJobs.flatMap(({ id }) => {
				const job = context.cron.getJob(id);
				return job ? [job] : [];
			}), p.agentId, context.cron.getDefaultAgentId());
			for (;;) {
				assertCurrent(storeKey);
				if (readCronCallerScope(client)) throw new Error("Cron history scope changed; retry the request");
				const jobs = currentJobs();
				const pendingJobs = visibilityRead.prepare(jobs.map((job) => cronJobVisibilityTarget(job, context.cron.getDefaultAgentId())));
				if (pendingJobs) {
					await pendingJobs;
					continue;
				}
				const visibility = visibilityRead.resolve();
				const visibleJobs = jobs.filter((job) => cronJobIsVisible(job, visibility, context.cron.getDefaultAgentId()));
				const visibleIds = new Set(visibleJobs.map((job) => job.id));
				const pageOptions = {
					storeKey,
					...cronRunLogPageFilters(p),
					agentId: p.agentId,
					jobNameById: Object.fromEntries(visibleJobs.map((job) => [job.id, job.name])),
					entryFilter: visibility ? (entry) => visibleIds.has(entry.jobId) : void 0
				};
				const pendingRecords = visibility && visibilityRead.prepare(collectSessionTargets(records, pageOptions, p.agentId));
				if (pendingRecords) {
					await pendingRecords;
					continue;
				}
				assertCurrent(storeKey);
				respond(true, projectCronRunHistoryPage(records, {
					...pageOptions,
					entryFilter: visibility ? (entry) => visibleIds.has(entry.jobId) && (!entry.sessionKey || visibility(entry.sessionKey, p.agentId)) : void 0
				}), void 0);
				return;
			}
		}
		if (!jobId) {
			respondMissingCronJobId(respond, "cron.runs");
			return;
		}
		try {
			await context.cron.readJob(jobId);
			const storeKey = cronStoreKey(context.cronStorePath);
			const records = await readCronRunRecords(storeKey, jobId);
			assertCurrent(storeKey);
			const readCurrentJob = () => {
				assertCurrent(storeKey);
				const callerScope = readCronCallerScope(client);
				const job = context.cron.getJob(jobId);
				const visibility = visibilityRead.resolve();
				const defaultAgentId = context.cron.getDefaultAgentId();
				const matchedJob = job && filterCronRunLogJobsByAgent([job], p.agentId, defaultAgentId).length > 0 && cronJobIsVisible(job, visibility, defaultAgentId) && cronJobMatchesCallerScope({
					job,
					callerScope,
					defaultAgentId,
					allowCurrentJob: true
				}) ? job : void 0;
				if ((callerScope || p.agentId || visibility) && !matchedJob) {
					respondCronJobNotFound(respond, jobId);
					return;
				}
				return {
					job,
					matchedJob,
					visibility
				};
			};
			for (;;) {
				assertCurrent(storeKey);
				const job = context.cron.getJob(jobId);
				const defaultAgentId = context.cron.getDefaultAgentId();
				const pendingJob = visibilityRead.prepare(filterCronRunLogJobsByAgent(job ? [job] : [], p.agentId, defaultAgentId).map((target) => cronJobVisibilityTarget(target, defaultAgentId)));
				if (pendingJob) {
					await pendingJob;
					continue;
				}
				const current = readCurrentJob();
				if (!current) return;
				const { visibility } = current;
				const pageOptions = {
					storeKey,
					jobId,
					...cronRunLogPageFilters(p),
					jobNameById: current.matchedJob && typeof current.matchedJob.name === "string" ? { [jobId]: current.matchedJob.name } : void 0
				};
				const pendingRecords = visibility && visibilityRead.prepare(collectSessionTargets(records, pageOptions, current.matchedJob?.agentId));
				if (pendingRecords) {
					await pendingRecords;
					continue;
				}
				assertCurrent(storeKey);
				const page = projectCronRunHistoryPage(records, {
					...pageOptions,
					entryFilter: visibility ? (entry) => !entry.sessionKey || visibility(entry.sessionKey, current.matchedJob?.agentId) : void 0
				});
				if (!current.job && page.total === 0 && projectCronRunHistoryPage(records, {
					storeKey,
					jobId,
					limit: 1
				}).total === 0) {
					respondCronJobNotFound(respond, jobId);
					return;
				}
				respond(true, page, void 0);
				return;
			}
		} catch (error) {
			if (!isInvalidCronRunJobIdError(error)) throw error;
			respondInvalidCronParams(respond, "cron.runs", "invalid id");
		}
	} finally {
		visibilityRead.release();
	}
};
//#endregion
//#region src/gateway/server-methods/cron-scratch.ts
const cronScratchHandlers = {
	"cron.scratch.get": scopedCronJobHandler("cron.scratch.get", validateCronScratchGetParams, async (options, { jobId }) => {
		const { respond, context, client } = options;
		const assertCurrent = () => {
			assertCronReadCurrent(options);
			const job = context.cron.getJob(jobId);
			if (!job || !cronJobMatchesCallerScope({
				job,
				callerScope: readCronCallerScope(client),
				defaultAgentId: context.cron.getDefaultAgentId()
			})) throw new Error("Cron scratch owner changed before reply");
		};
		assertCurrent();
		const state = await context.cron.readScratch(jobId, {
			assertCurrent,
			signal: options.signal
		});
		assertCurrent();
		respond(true, {
			scratch: cronScratchReadView(state.scratch),
			currentRevision: state.currentRevision,
			maxBytes: CRON_JOB_SCRATCH_MAX_BYTES
		}, void 0);
	}),
	"cron.scratch.set": scopedCronJobHandler("cron.scratch.set", validateCronScratchSetParams, async ({ params, respond, context, client, sessionMutationCommitGuard, hasCurrentClientAuthority }, { jobId, callerScope }) => {
		const p = params;
		try {
			const commitGuard = resolveCronMutationCommitGuard(client, context, {
				callerScope,
				jobId
			}, {
				sessionMutationCommitGuard,
				hasCurrentClientAuthority
			});
			const result = await context.cron.writeScratch(jobId, {
				content: p.content,
				expectedRevision: p.expectedRevision,
				...commitGuard ? { commitGuard } : {}
			});
			if (!result.ok) {
				respond(true, result, void 0);
				return;
			}
			respond(true, {
				ok: true,
				scratch: cronScratchReadView(result.scratch),
				currentRevision: result.currentRevision,
				maxBytes: CRON_JOB_SCRATCH_MAX_BYTES
			}, void 0);
		} catch (error) {
			respondInvalidCronParams(respond, "cron.scratch.set", formatErrorMessage(error));
		}
	})
};
//#endregion
//#region src/gateway/server-methods/cron.ts
var CronJobConfigRevisionConflictError = class extends Error {
	constructor(expectedConfigRevision, actualConfigRevision) {
		super("cron job definition no longer matches the loaded version");
		this.expectedConfigRevision = expectedConfigRevision;
		this.actualConfigRevision = actualConfigRevision;
	}
};
function requiresExplicitAgentRuntimeToolsAllow(params) {
	return params.callerScope !== void 0 && !params.callerScope.manageAll && cronJobUsesToolRuntime(params.job) && params.job.payload.toolsAllow === void 0;
}
const cronHandlers = {
	wake: async ({ params, respond, context, client, sessionMutationCommitGuard }) => {
		if (!assertValidParams(params, validateWakeParams, "wake", respond)) return;
		const p = params;
		const sessionKey = p.sessionKey?.trim() || void 0;
		const agentId = p.agentId?.trim() || void 0;
		const callerScope = readCronCallerScope(client);
		const requestedOwner = sessionKey ? resolveRequestedSessionAgentId(context.getRuntimeConfig(), sessionKey, agentId ?? callerScope?.agentId) : void 0;
		if (requestedOwner && !requestedOwner.ok) {
			respond(false, void 0, requestedOwner.error);
			return;
		}
		const resolvedAgentId = requestedOwner?.agentId ?? callerScope?.agentId ?? agentId;
		if (sessionKey && isAgentHarnessSessionKey(sessionKey)) {
			const loaded = loadGatewaySessionEntryReadOnly(sessionKey, resolvedAgentId ? { agentId: resolvedAgentId } : {});
			const harnessSessionError = loaded.entry ? resolveAgentHarnessSessionStoreEntryError(loaded.canonicalKey, loaded.entry) : AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE;
			if (harnessSessionError) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, harnessSessionError));
				return;
			}
		}
		if (sessionKey && isSubagentSessionKey(sessionKey)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "wake sessionKey cannot target a subagent session"));
			return;
		}
		const sessionKeyAgentId = sessionKey ? parseAgentSessionKey(sessionKey)?.agentId?.trim().toLowerCase() : void 0;
		if (callerScope && agentId && normalizeAgentId(agentId) !== callerScope.agentId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "wake agentId outside caller scope"));
			return;
		}
		if (agentId && sessionKeyAgentId && agentId.toLowerCase() !== sessionKeyAgentId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "wake agentId contradicts the agent that owns sessionKey; pass a single canonical wake target"));
			return;
		}
		const wakeConfig = context.getRuntimeConfig();
		if (respondRefusedCronAgent(resolvedAgentId, respond)) return;
		if (wakeConfig.gateway?.roles) {
			const knownWakeAgentId = resolvedAgentId ?? context.cron.getDefaultAgentId();
			const wakeAgent = knownWakeAgentId ? {
				ok: true,
				agentId: knownWakeAgentId
			} : resolveRequestedSessionAgentId(wakeConfig, sessionKey ?? "main");
			if (!wakeAgent.ok) {
				respond(false, void 0, wakeAgent.error);
				return;
			}
			const wakeAccessError = authorizeGatewaySessionCreation({
				cfg: wakeConfig,
				client,
				agentId: wakeAgent.agentId
			});
			if (wakeAccessError) {
				respond(false, void 0, wakeAccessError);
				return;
			}
		}
		await context.cron.prepareWake?.();
		sessionMutationCommitGuard?.();
		assertActiveAgentRuntimeAuthority(client, context);
		respond(true, context.cron.wake({
			mode: p.mode,
			text: p.text,
			...sessionKey ? { sessionKey } : {},
			...resolvedAgentId ? { agentId: resolvedAgentId } : {}
		}), void 0);
	},
	"cron.list": async (options) => {
		const { params, respond: originalRespond, context, client } = options;
		const diagnostics = startCronListDiagnostics(context.logGateway, originalRespond);
		const respond = diagnostics?.respond ?? originalRespond;
		const visibilityRead = createCronSessionVisibility(client, () => context.getRuntimeConfig());
		let handlerOutcome = "returned";
		try {
			if (!assertValidParams(params, validateCronListParams, "cron.list", respond)) return;
			const p = params;
			const admittedScope = readCronCallerScope(client);
			const callerScope = admittedScope?.manageAll ? void 0 : admittedScope;
			const requestedAgentId = p.agentId ? normalizeAgentId(p.agentId) : void 0;
			if (callerScope && requestedAgentId && requestedAgentId !== callerScope.agentId) {
				respondInvalidCronParams(respond, "cron.list", "agentId outside caller scope");
				return;
			}
			const listOptions = {
				includeDisabled: p.includeDisabled,
				limit: p.limit,
				offset: p.offset,
				query: p.query,
				enabled: p.enabled,
				scheduleKind: p.scheduleKind,
				lastRunStatus: p.lastRunStatus,
				trigger: p.trigger,
				sortBy: p.sortBy,
				sortDir: p.sortDir,
				agentId: callerScope ? void 0 : p.agentId
			};
			const matchesRequestScope = (job) => {
				const scope = readCronCallerScope(client);
				const currentScope = scope?.manageAll ? void 0 : scope;
				const currentDefault = context.cron.getDefaultAgentId();
				return cronJobMatchesCallerScope({
					job,
					callerScope: currentScope,
					defaultAgentId: currentDefault,
					allowCurrentJob: true
				}) && (!p.sessionKey || resolveCronJobBoundSessionKeys(job, {
					cfg: context.getRuntimeConfig(),
					defaultAgentId: currentDefault
				}).has(p.sessionKey) && (parseAgentSessionKey(p.sessionKey) !== null || !p.sessionAgentId || (resolveCronJobOwnerAgentId(job) ?? tryResolveCronJobEffectiveAgentId(job, currentDefault)) === normalizeAgentId(p.sessionAgentId)));
			};
			if (visibilityRead.resolve()) {
				const loadedJobs = [];
				await context.cron.listPage(listOptions, (job) => {
					if (matchesRequestScope(job)) loadedJobs.push(job);
					return false;
				});
				assertCronReadCurrent(options);
				await visibilityRead.prepare(loadedJobs.map((job) => cronJobVisibilityTarget(job, context.cron.getDefaultAgentId())));
			}
			assertCronReadCurrent(options);
			const cronVisibility = visibilityRead.resolve();
			const defaultAgentId = context.cron.getDefaultAgentId();
			diagnostics?.setRequestMode({
				compact: p.compact === true,
				previewsRequested: p.compact !== true && p.includeDeliveryPreviews !== false,
				scopeApplied: Boolean(callerScope || cronVisibility)
			});
			diagnostics?.mark("listing");
			const selectedJobIds = /* @__PURE__ */ new Set();
			const matchesCurrentJob = (job) => matchesRequestScope(job) && cronJobIsVisible(job, visibilityRead.resolve(), context.cron.getDefaultAgentId());
			const assertPageCurrent = () => {
				assertCronReadCurrent(options);
				const currentScope = readCronCallerScope(client);
				if (Boolean(currentScope && !currentScope.manageAll) !== Boolean(callerScope) || Boolean(visibilityRead.resolve()) !== Boolean(cronVisibility)) throw new Error("Cron list visibility changed; refresh the page");
				for (const id of selectedJobIds) {
					const current = context.cron.getJob(id);
					if (!current || !matchesCurrentJob(current)) throw new Error("Cron list visibility changed; refresh the page");
				}
			};
			let matchesJob;
			if (callerScope || cronVisibility || p.sessionKey) {
				diagnostics?.startScopeAttempt();
				matchesJob = (job) => {
					const matched = matchesCurrentJob(job);
					if (matched) selectedJobIds.add(job.id);
					return matched;
				};
			}
			let page;
			const finishPage = diagnostics?.startSourcePage();
			try {
				page = await context.cron.listPage(listOptions, matchesJob);
			} finally {
				finishPage?.();
			}
			if (matchesJob) for (const job of page.jobs) selectedJobIds.add(job.id);
			assertPageCurrent();
			diagnostics?.setReturnedCount(page.jobs.length);
			diagnostics?.mark("projection");
			const jobs = page.jobs.map((job) => ({
				...p.compact === true ? compactCronListJob(job) : cronJobReadView(job),
				effectiveAgentId: tryResolveCronJobEffectiveAgentId(job, defaultAgentId) ?? null
			}));
			if (p.compact === true || p.includeDeliveryPreviews === false) {
				respond(true, {
					...page,
					jobs
				}, void 0);
				return;
			}
			diagnostics?.mark("previews");
			const deliveryPreviews = await resolveCronDeliveryPreviews({
				cfg: context.getRuntimeConfig(),
				defaultAgentId: context.cron.getDefaultAgentId(),
				jobs: page.jobs
			});
			assertPageCurrent();
			respond(true, {
				...page,
				jobs,
				deliveryPreviews
			}, void 0);
		} catch (error) {
			handlerOutcome = "threw";
			throw error;
		} finally {
			visibilityRead.release();
			diagnostics?.finish(handlerOutcome);
		}
	},
	"cron.status": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateCronStatusParams, "cron.status", respond)) return;
		respond(true, await context.cron.status(), void 0);
	},
	"cron.get": scopedCronJobHandler("cron.get", validateCronGetParams, ({ respond }, { job }) => respond(true, cronJobReadView(job), void 0), {
		allowCurrentJob: true,
		checkVisibility: true,
		preserveCronGetWireMessage: true
	}),
	...cronScratchHandlers,
	"cron.add": async ({ params, respond, context, client, sessionMutationCommitGuard, hasCurrentClientAuthority }) => {
		let candidate;
		let enabledExplicit;
		try {
			({candidate, enabledExplicit} = normalizeCronAddRequest(params));
		} catch (err) {
			respondInvalidCronParams(respond, "cron.add", formatErrorMessage(err));
			return;
		}
		if (!assertValidParams(candidate, validateCronAddParams, "cron.add", respond)) return;
		const callerScope = readCronCallerScope(client);
		const operatorActor = callerScope ? void 0 : resolveOperatorSessionCreation(client).actor;
		const creatorSession = callerScope?.sessionKey ? loadGatewaySessionEntryReadOnly(callerScope.sessionKey, { agentId: callerScope.agentId }).entry : void 0;
		const actor = operatorActor ?? creatorSession?.createdActor;
		const actorId = normalizeOptionalString(actor?.id);
		const createdActor = actor ? {
			...actor,
			...actorId ? { id: actorId } : {}
		} : void 0;
		let captureRuntimeAuthority;
		let assertCapturedAuthorityCurrent;
		try {
			const capture = resolveCronCreatorAuthorityCapture(callerScope);
			captureRuntimeAuthority = capture?.captureRuntimeAuthority;
			assertCapturedAuthorityCurrent = capture?.assertCurrent;
		} catch (err) {
			respondInvalidCronParams(respond, "cron.add", formatErrorMessage(err));
			return;
		}
		const assertMutationCurrent = resolveCronMutationCommitGuard(client, context, void 0, {
			sessionMutationCommitGuard,
			hasCurrentClientAuthority
		});
		const assertCreatorSessionCurrent = createCronCreatorSessionGuard(callerScope, creatorSession);
		const commitGuard = () => {
			assertMutationCurrent?.();
			assertCapturedAuthorityCurrent?.();
			assertCreatorSessionCurrent();
		};
		const jobCreate = applyCronCreateCallerScopeDefault(candidate, callerScope);
		const cfg = context.getRuntimeConfig();
		if (!cronCreateMatchesCallerScope({
			job: jobCreate,
			callerScope,
			defaultAgentId: context.cron.getDefaultAgentId()
		})) {
			respondInvalidCronParams(respond, "cron.add", "job agentId outside caller scope");
			return;
		}
		if (requiresExplicitAgentRuntimeToolsAllow({
			job: jobCreate,
			callerScope
		})) {
			respondInvalidCronParams(respond, "cron.add", "agent-runtime tool jobs require an explicit payload.toolsAllow cap");
			return;
		}
		const timestampValidation = validateScheduleTimestamp(jobCreate.schedule);
		if (!timestampValidation.ok) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, timestampValidation.message));
			return;
		}
		if (respondRefusedCronAgent(tryResolveCronJobEffectiveAgentId(jobCreate, context.cron.getDefaultAgentId()), respond)) return;
		try {
			assertCronDoesNotTargetAgentHarness(jobCreate);
			await assertValidCronCreateDelivery(cfg, jobCreate);
		} catch (err) {
			respondInvalidCronParams(respond, "cron.add", formatErrorMessage(err));
			return;
		}
		const deliveryPreview = await resolveCronDeliveryPreview({
			cfg,
			defaultAgentId: context.cron.getDefaultAgentId(),
			job: jobCreate
		});
		let result;
		try {
			result = await context.cron.add(jobCreate, {
				enabledExplicit,
				...createdActor ? { createdActor } : {},
				...creatorSession?.skillLibrarySelections ? { skillLibrarySelections: creatorSession.skillLibrarySelections } : {},
				commitGuard,
				...captureRuntimeAuthority ? { captureRuntimeAuthority } : {},
				matchesExisting: (job) => cronJobMatchesDeclarationScope({
					job,
					input: jobCreate,
					callerScope,
					defaultAgentId: context.cron.getDefaultAgentId()
				}),
				...cronJobUsesToolRuntime(jobCreate) ? {
					scheduledToolPolicy: resolveCronScheduledToolPolicyForCaller(callerScope),
					...callerScope?.toolsAllowProvenance ? { toolsAllowProvenance: callerScope.toolsAllowProvenance } : {},
					...callerScope?.toolsAllowExecTarget ? { toolsAllowExecTarget: callerScope.toolsAllowExecTarget } : {}
				} : {}
			});
		} catch (err) {
			if (!(err instanceof TypeError) && !(err instanceof RangeError) && !isCronInvalidRequestError(err)) throw err;
			respondInvalidCronParams(respond, "cron.add", formatErrorMessage(err));
			return;
		}
		const job = "job" in result ? result.job : result;
		context.logGateway.info("cron: job added", {
			jobId: job.id,
			declarationKey: job.declarationKey,
			schedule: jobCreate.schedule
		});
		respond(true, cronAddResultReadView({
			result,
			deliveryPreview
		}), void 0);
	},
	"cron.update": async ({ params, respond, context, client, sessionMutationCommitGuard, hasCurrentClientAuthority }) => {
		let candidate;
		let normalizedPatch;
		try {
			({candidate, normalizedPatch} = normalizeCronUpdateRequest(params));
		} catch (err) {
			respondInvalidCronParams(respond, "cron.update", formatErrorMessage(err));
			return;
		}
		if (!assertValidParams(candidate, validateCronUpdateParams, "cron.update", respond)) return;
		if (!normalizedPatch) {
			respondInvalidCronParams(respond, "cron.update", "patch did not normalize");
			return;
		}
		const p = candidate;
		const callerScope = readCronCallerScope(client);
		let captureRuntimeAuthority;
		let assertCapturedAuthorityCurrent;
		try {
			const capture = resolveCronCreatorAuthorityCapture(callerScope);
			captureRuntimeAuthority = capture?.captureRuntimeAuthority;
			assertCapturedAuthorityCurrent = capture?.assertCurrent;
		} catch (err) {
			respondInvalidCronParams(respond, "cron.update", formatErrorMessage(err));
			return;
		}
		const commitGuard = resolveCronMutationCommitGuard(client, context, void 0, {
			sessionMutationCommitGuard: assertCapturedAuthorityCurrent ? () => {
				sessionMutationCommitGuard?.();
				assertCapturedAuthorityCurrent?.();
			} : sessionMutationCommitGuard,
			hasCurrentClientAuthority
		});
		const jobId = resolveCronJobId(p);
		if (!jobId) {
			respondMissingCronJobId(respond, "cron.update");
			return;
		}
		const patch = normalizedPatch;
		const cfg = context.getRuntimeConfig();
		const currentJob = await context.cron.readJob(jobId);
		if (!currentJob || !cronJobMatchesCallerScope({
			job: currentJob,
			callerScope,
			defaultAgentId: context.cron.getDefaultAgentId()
		})) {
			respondCronJobNotFound(respond, jobId);
			return;
		}
		if (callerScope && !callerScope.manageAll && "agentId" in patch) {
			respondInvalidCronParams(respond, "cron.update", "agentId cannot be changed by caller scope");
			return;
		}
		if (!cronPatchSessionRefsMatchCaller(patch, callerScope)) {
			respondInvalidCronParams(respond, "cron.update", "session target outside caller scope");
			return;
		}
		if (("agentId" in patch || "sessionTarget" in patch || "sessionKey" in patch) && respondRefusedCronAgent(tryResolveCronJobEffectiveAgentId({
			...currentJob,
			...patch
		}, context.cron.getDefaultAgentId()), respond)) return;
		if (patch.schedule) {
			const timestampValidation = validateScheduleTimestamp(patch.schedule);
			if (!timestampValidation.ok) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, timestampValidation.message));
				return;
			}
		}
		const touchesToolRuntime = patch.payload !== void 0 || Object.hasOwn(patch, "trigger");
		const validateUpdate = async (jobToUpdate) => {
			const nextJob = await assertValidCronUpdatePatch({
				cfg,
				defaultAgentId: context.cron.getDefaultAgentId(),
				currentJob: jobToUpdate,
				patch
			});
			if (touchesToolRuntime && requiresExplicitAgentRuntimeToolsAllow({
				job: nextJob,
				callerScope
			}) && !isLegacyCreatorPromptUpdate(jobToUpdate, patch, callerScope)) throw new TypeError("agent-runtime tool jobs require an explicit payload.toolsAllow cap");
		};
		try {
			await validateUpdate(currentJob);
		} catch (err) {
			respondInvalidCronParams(respond, "cron.update", formatErrorMessage(err));
			return;
		}
		const updateOptions = touchesToolRuntime || commitGuard || captureRuntimeAuthority || callerScope?.toolsAllowProvenance ? {
			...touchesToolRuntime ? {
				scheduledToolPolicy: callerScope?.manageAll ? null : resolveCronScheduledToolPolicyForCaller(callerScope),
				toolsAllowExecTarget: callerScope?.toolsAllowExecTarget
			} : {},
			...commitGuard ? { commitGuard } : {},
			...captureRuntimeAuthority ? { captureRuntimeAuthority } : {}
		} : void 0;
		let job;
		try {
			job = await context.cron.updateWithPrecondition(jobId, patch, async (lockedJob) => {
				if (!cronJobMatchesCallerScope({
					job: lockedJob,
					callerScope,
					defaultAgentId: context.cron.getDefaultAgentId()
				})) throw new Error(`unknown cron job id: ${jobId}`);
				if (p.expectedConfigRevision !== void 0) {
					const actualConfigRevision = resolveCronJobConfigRevision(lockedJob);
					if (actualConfigRevision !== p.expectedConfigRevision) throw new CronJobConfigRevisionConflictError(p.expectedConfigRevision, actualConfigRevision);
				}
				await validateUpdate(lockedJob);
				if (updateOptions) updateOptions.toolsAllowProvenance = resolveCronRequesterProvenanceForJob(lockedJob, readCronCallerScope(client));
			}, updateOptions);
		} catch (err) {
			if (err instanceof CronJobConfigRevisionConflictError) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "cron job definition no longer matches the loaded version; review the latest version before retrying", { details: {
					code: "CRON_JOB_CHANGED",
					expectedConfigRevision: err.expectedConfigRevision,
					actualConfigRevision: err.actualConfigRevision
				} }));
				return;
			}
			if (!(err instanceof TypeError) && !(err instanceof RangeError) && !isCronInvalidRequestError(err)) throw err;
			respondInvalidCronParams(respond, "cron.update", formatErrorMessage(err));
			return;
		}
		context.logGateway.info("cron: job updated", { jobId });
		respond(true, cronJobReadView(job), void 0);
	},
	"cron.remove": scopedCronJobHandler("cron.remove", validateCronRemoveParams, async ({ respond, context, client, sessionMutationCommitGuard, hasCurrentClientAuthority }, { jobId, callerScope, job }) => {
		const usesCurrentJobCapability = !cronJobMatchesCallerScope({
			job,
			callerScope,
			defaultAgentId: context.cron.getDefaultAgentId()
		});
		const expectedConfigRevision = usesCurrentJobCapability ? resolveCronJobConfigRevision(job) : void 0;
		let result;
		try {
			const commitGuard = resolveCronMutationCommitGuard(client, context, {
				callerScope,
				jobId,
				allowCurrentJob: usesCurrentJobCapability,
				expectedConfigRevision
			}, {
				sessionMutationCommitGuard,
				hasCurrentClientAuthority
			});
			const identity = client?.internal?.agentRuntimeIdentity;
			const validateAuthority = context.validateAgentRuntimeApprovalAuthority;
			if (identity && validateAuthority && commitGuard && callerScope?.currentJobId === jobId) bindCronSelfRemovalCommitGuard(jobId, identity.operationalRunInstance, commitGuard, () => {
				if (!validateAuthority(identity) || readCronCallerScope(client)?.currentJobId !== jobId) throw new TypeError("cron self-removal authority is no longer active");
			});
			result = commitGuard ? await context.cron.remove(jobId, { commitGuard }) : await context.cron.remove(jobId);
		} catch (error) {
			if (error instanceof TypeError || isCronInvalidRequestError(error)) {
				respondInvalidCronParams(respond, "cron.remove", formatErrorMessage(error));
				return;
			}
			throw error;
		}
		if (!result.removed) {
			respondCronJobNotFound(respond, jobId);
			return;
		}
		context.logGateway.info("cron: job removed", { jobId });
		respond(true, result, void 0);
	}, { allowCurrentJob: true }),
	"cron.run": scopedCronJobHandler("cron.run", validateCronRunParams, async (options, { jobId, callerScope, job }) => {
		const { params: p, respond, context, client, sessionMutationCommitGuard, hasCurrentClientAuthority } = options;
		if (p.expectedProcessInstanceId && p.expectedProcessInstanceId !== getGatewayProcessInstanceId()) {
			respondInvalidCronParams(respond, "cron.run", "Gateway process changed after preflight");
			return;
		}
		let result;
		try {
			const commitGuard = resolveCronMutationCommitGuard(client, context, {
				callerScope,
				jobId
			}, {
				sessionMutationCommitGuard,
				hasCurrentClientAuthority
			});
			result = commitGuard ? await context.cron.enqueueRun(jobId, p.mode ?? "force", { commitGuard }) : await context.cron.enqueueRun(jobId, p.mode ?? "force");
		} catch (error) {
			if (error instanceof TypeError) {
				respondInvalidCronParams(respond, "cron.run", formatErrorMessage(error));
				return;
			}
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
		const ack = {
			...result,
			processInstanceId: getGatewayProcessInstanceId()
		};
		const callerSessionKey = client?.internal?.agentRuntimeIdentity?.sessionKey;
		const dependentSessionKey = job.payload.kind !== "agentTurn" ? void 0 : job.sessionTarget === "current" ? resolveCronDeliveryPlan(job).requested ? job.sessionKey : void 0 : resolveCronSessionTargetSessionKey(job.sessionTarget);
		const cfg = context.getRuntimeConfig();
		const runQueuesBehindCaller = callerSessionKey !== void 0 && (job.sessionTarget === "main" || dependentSessionKey !== void 0 && resolveCronAgentSessionKey({
			sessionKey: dependentSessionKey,
			agentId: normalizeAgentId(job.agentId ?? context.cron.getDefaultAgentId()),
			mainKey: cfg.session?.mainKey,
			cfg
		}) === callerSessionKey);
		let run;
		let finished = false;
		if (p.waitTimeoutMs !== void 0 && "enqueued" in result && !runQueuesBehindCaller) finished = await context.cron.waitForManualRun(result.runId, p.waitTimeoutMs, options.signal);
		if (finished && "enqueued" in result) try {
			await cronRunsHandler({
				...options,
				params: {
					id: jobId,
					runId: result.runId,
					limit: 1
				},
				respond: (ok, page) => {
					run = ok && isRecord(page) && Array.isArray(page.entries) ? page.entries[0] : void 0;
				}
			});
			assertCronReadCurrent(options);
			const identity = client?.internal?.agentRuntimeIdentity;
			if (identity) getCronManagementAuthority(identity)?.();
		} catch {
			run = void 0;
			finished = false;
		}
		respond(true, run ? {
			...ack,
			run
		} : finished ? {
			...ack,
			finished
		} : ack, void 0);
	}),
	"cron.history": cronHistoryHandler,
	"cron.runs": cronRunsHandler
};
for (const [method, handler] of Object.entries(cronHandlers)) cronHandlers[method] = async (args) => {
	const identity = args.client?.internal?.agentRuntimeIdentity;
	if (!identity) return await handler(args);
	const grant = identity.cronManagementGrant;
	let succeeded = false;
	const run = async () => {
		assertActiveAgentRuntimeAuthority(args.client, args.context);
		await handler({
			...args,
			respond: (...response) => {
				if (method === "cron.list" || method === "cron.get" || method === "cron.runs" || method === "cron.history") {
					assertActiveAgentRuntimeAuthority(args.client, args.context);
					getCronManagementAuthority(identity)?.();
				}
				succeeded = response[0];
				args.respond(...response);
			}
		});
	};
	try {
		await (grant ? withCronManagementGrant(grant, identity, method, run) : run());
	} catch (error) {
		if (!(error instanceof TypeError)) throw error;
		respondInvalidCronParams(args.respond, method, error.message);
	} finally {
		if (grant) args.context.logGateway.info("cron: admin management", {
			method,
			runId: identity.operationalRunInstance.runId,
			instanceId: identity.operationalRunInstance.instanceId,
			ok: succeeded
		});
	}
};
//#endregion
export { cronHandlers as t };
