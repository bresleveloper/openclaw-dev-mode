import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { I as resolveTimestampMsToIsoString, R as timestampMsToIsoString, o as asDateTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { t as parseBoolean } from "./boolean-coercion-1HZNNkFl.mjs";
import { a as asOptionalRecord, c as isRecord, i as asOptionalObjectRecord, u as readStringField } from "./record-coerce-TIsquoVR.mjs";
import "./utils-gjJ-tD2q.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { P as runWithDiagnosticTraceContext, k as getActiveDiagnosticTraceContext, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-C91J-XX8.mjs";
import { t as freezeJsonSnapshot } from "./immutable-data-DqJSDH8t.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { t as SessionMetadataUnavailableError } from "./session-metadata-unavailable-error-DwD7IuoE.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey, T as parseCronRunScopeSuffix, w as isSubagentSessionKey } from "./session-key-CSDERtm3.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import { _ as resolveDefaultAgentId, a as resolveAgentDir, w as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { At as validateCronAddParams, Bt as validateCronUpdateParams, Ft as validateCronRunParams, Fu as CronHistoryResultSchema, It as validateCronRunsParams, Lt as validateCronScratchGetParams, Mt as validateCronHistoryParams, Ng as errorShape, Nt as validateCronListParams, Pt as validateCronRemoveParams, Rt as validateCronScratchSetParams, bc as validateWakeParams, jt as validateCronGetParams, zt as validateCronStatusParams } from "./src-pLJQA6J5.mjs";
import { W as isUserModelAuthProfileId } from "./user-model-account-authority-DFFjC5J5.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { _ as readAgentDatabaseAdmissionRefusal, s as createAgentDatabaseAdmissionErrorShape } from "./agent-database-admission-CeDA0ojh.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-CsnAJK7x.mjs";
import { n as operatorScopeSatisfied } from "./operator-scope-compat-Ci6GBcmU.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { r as bindCronSelfRemovalCommitGuard } from "./active-jobs-CqHAjCGh.mjs";
import { n as cronJobUsesToolRuntime } from "./tools-allow-BHyxEpHd.mjs";
import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { n as authorizeGatewaySessionCreation } from "./operator-role-policy-Coro3qc5.mjs";
import { a as validateTargetProviderPrefix, t as resolveTargetPrefixedChannel } from "./channel-target-prefix-D9KEia-0.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { a as resolveSessionStoreIdentity } from "./session-store-key-DKpto8R6.mjs";
import { a as isAgentHarnessSessionKey, d as resolveAgentHarnessSessionStoreEntryError, n as AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE, r as AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE } from "./agent-harness-session-key-zbrcLVpT.mjs";
import { r as requireSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import { t as loadGatewaySessionEntryReadOnlyInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
import { o as prepareProjectedSessionSharing } from "./session-sharing-read-B9_xLej9.mjs";
import "./session-sharing-DuL10izq.mjs";
import { r as registerSerializedJsonArray } from "./serialized-json-IhaVUH2u.mjs";
import { t as createPreparedReadHandler } from "./prepared-read-C_6yTKv-.mjs";
import { c as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-DJRpB3Nd.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-Dm5zJglt.mjs";
import { r as tryResolveCronJobEffectiveAgentId, t as CRON_AGENT_SELECTION_REQUIRED_MESSAGE } from "./agent-id-C6uS-TyD.mjs";
import { t as resolveCronAgentSessionKey } from "./session-key-CWEGpfa5.mjs";
import { a as resolveCronDeliverySessionKey, r as isInvalidCronSessionTargetIdError, s as resolveCronSessionTargetSessionKey } from "./session-target-d98pYOqN.mjs";
import { n as resolveCronJobBoundSessionKeys } from "./job-session-bindings-JxvgRjIX.mjs";
import { n as resolveOperatorSessionCreation } from "./session-creation-provenance-CZ3I7AOG.mjs";
import { t as CRON_JOB_SCRATCH_MAX_BYTES } from "./scratch-contract-B-Laspel.mjs";
import { n as defineValidatedGatewayHandler, t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { t as parseAbsoluteTimeMs } from "./parse-B3paXGEX.mjs";
import { a as hasCanonicalCronDeliveryMode, n as assertCanonicalCronDeliveryMode, t as CRON_DELIVERY_REPAIR_REQUIRED_MESSAGE } from "./delivery-codec-DMPX9PBc.mjs";
import { r as normalizeCronJobPatch, t as normalizeCronJobCreate } from "./normalize-D_B-pqo1.mjs";
import { i as getCronManagementAuthority, p as withCronManagementGrant } from "./cron-creator-authority-grant-BdRpVx3w.mjs";
import { t as createStageTimingTracker } from "./stage-timing-BUG4Fnsv.mjs";
import { n as listConfiguredMessageChannels } from "./channel-selection-D2GvoKZ-.mjs";
import { n as hasExplicitCronDeliveryTarget, t as assertCronDeliveryInputNonBlankFields } from "./delivery-target-validation-DmeSlZGT.mjs";
import { t as resolveSimpleCompletionSelectionForAgent } from "./simple-completion-selection-pOIS3Loe.mjs";
import { t as readSessionHistoryPageInWorker } from "./session-history-worker-runtime-UlzjKIVK.mjs";
import { t as cronStoreKey } from "./key-BBZ40bDq.mjs";
import { t as resolveCronJobConfigRevision } from "./config-revision-lawlsaMs.mjs";
import { i as readCronRunRecords, r as readCronRunHistoryBinding } from "./read-only-BTIc_b6f.mjs";
import { t as resolveCronDeliveryPlan } from "./delivery-plan-BCh_72BD.mjs";
import { r as resolveFailureAlert } from "./failure-alerts-Cgi3Ds94.mjs";
import { r as projectCronRunHistoryPage, t as isInvalidCronRunJobIdError } from "./run-history-Dl-K-0P9.mjs";
import { t as createRestartRecoveryOperatorSource } from "./operator-run-recovery-source-Cq--QOeE.mjs";
import { i as cronScratchReadView, r as cronJobReadView, t as cronAddResultReadView } from "./job-read-view-BBk7z_Xr.mjs";
import { n as captureCronInferenceBinding, t as acquireCronInferenceAuthorization } from "./inference-binding.runtime-B87hdhJk.mjs";
import { n as requiresExternalCronDelivery, r as resolveDeliveryTarget, t as prepareCronDeliveryTargetContexts } from "./delivery-target-Djb3Xk-t.mjs";
import { n as applyJobPatch } from "./jobs-hhS-jgmc.mjs";
import { t as assertActiveAgentRuntimeAuthority } from "./agent-runtime-authority-B3KjbGu2.mjs";
import "./slow-request-diagnostics-Ba6xRXbV.mjs";
import { t as preparePersonalModelAccountSelection } from "./users-model-account-access-CmjctvSj.mjs";
import { t as getGatewayProcessInstanceId } from "./process-instance-CwB3RMsz.mjs";
import { a as cronPatchSessionRefsMatchCaller, c as resolveCronJobOwnerAgentId, d as resolveCronScheduledToolPolicyForCaller, i as cronJobMatchesDeclarationScope, l as resolveCronMutationCommitGuard, n as cronCreateMatchesCallerScope, o as readCronCallerScope, r as cronJobMatchesCallerScope, s as resolveCronCreatorAuthorityCapture, t as applyCronCreateCallerScopeDefault, u as resolveCronRequesterProvenanceForJob } from "./cron-caller-scope-mSZERe9F.mjs";
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
function prepareCronDeliveryPreview(params) {
	if (!hasCanonicalCronDeliveryMode(params.job.delivery)) return { preview: {
		label: "delivery requires review",
		detail: CRON_DELIVERY_REPAIR_REQUIRED_MESSAGE,
		failed: true
	} };
	const agentId = tryResolveCronJobEffectiveAgentId(params.job, params.defaultAgentId ?? tryResolveAmbientOwnerAgentId(params.cfg));
	const refusal = agentId ? readAgentDatabaseAdmissionRefusal(agentId) : void 0;
	if (refusal) return { preview: {
		label: `agent ${agentId} unavailable`,
		detail: `${refusal.reason}\n${refusal.repairHint}`,
		failed: true
	} };
	const plan = resolveCronDeliveryPlan(params.job);
	if (plan.mode === "none" && !hasExplicitCronDeliveryTarget(plan)) return { preview: {
		label: "not requested",
		detail: "not requested"
	} };
	if (plan.mode === "webhook") return { preview: {
		label: plan.to ? `webhook:${plan.to}` : "webhook",
		detail: plan.to ? "webhook" : "webhook target missing",
		...!plan.to ? { failed: true } : {}
	} };
	const requestedChannel = plan.channel ?? "last";
	if (!agentId) return { preview: {
		label: `${plan.mode} -> unresolved owner`,
		detail: CRON_AGENT_SELECTION_REQUIRED_MESSAGE,
		failed: true
	} };
	return {
		plan,
		requestedChannel,
		agentId,
		sessionTarget: params.job.sourceConversation || params.job.payload.kind === "agentTurn" ? params.job.sessionTarget : void 0,
		deliverySessionKey: resolveCronDeliverySessionKey(params.job),
		sourceConversation: plan.mode === "announce" ? params.job.sourceConversation : void 0
	};
}
async function resolvePreparedCronDeliveryPreview(cfg, prepared, sessionContext) {
	if (prepared.preview) return prepared.preview;
	const { plan, requestedChannel, agentId, sessionTarget, deliverySessionKey, sourceConversation } = prepared;
	let resolved;
	try {
		if (sessionContext && !sessionContext.ok) throw sessionContext.error;
		resolved = await resolveDeliveryTarget(cfg, agentId, {
			...plan,
			sessionTarget,
			sourceConversation,
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
		if ((sessionTarget === "current" || sourceConversation !== void 0) && plan.mode === "announce" && !resolved.sourceConversationUnavailable && !requiresExternalCronDelivery(plan, resolved)) return {
			label: `announce -> ${sessionTarget === "current" ? "current session" : "creating conversation"}`,
			detail: "commits to this conversation (no external channel route)"
		};
		const detail = plan.mode === "none" ? `message tool target unresolved: ${resolved.error.message}` : `${requestedChannel === "last" ? "last -> no route, will be blocked: " : ""}${resolved.error.message}`;
		return {
			label: `${plan.mode} -> ${formatTarget(requestedChannel, plan.to ?? null)}`,
			detail: plan.mode === "none" ? detail : `${detail} Configure a channel and delivery target, or use delivery:{mode:"none"} for no automatic delivery.`,
			...plan.mode !== "none" ? { failed: true } : {}
		};
	}
	return {
		label: `${plan.mode} -> ${formatTarget(resolved.channel, resolved.to)}`,
		detail: plan.mode === "announce" ? "commits to the destination conversation; sends one external notification" : requestedChannel !== "last" ? "explicit" : deliverySessionKey ? `resolved from last, session ${deliverySessionKey}` : "resolved from last, main session"
	};
}
/** Builds the user-visible cron delivery preview for one job without sending anything. */
async function resolveCronDeliveryPreview(params) {
	const { failed: _failed, ...preview } = await resolvePreparedCronDeliveryPreview(params.cfg, prepareCronDeliveryPreview(params));
	return preview;
}
/** Reuses the preview decision without adding successful-route bytes to update results. */
async function resolveCronDeliveryFailurePreview(params) {
	const { failed, ...preview } = await resolvePreparedCronDeliveryPreview(params.cfg, prepareCronDeliveryPreview(params));
	return failed ? preview : void 0;
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
		const { failed: _failed, ...preview } = await resolvePreparedCronDeliveryPreview(params.cfg, prepared[index], context);
		return [job.id, preview];
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
//#region src/gateway/server-methods/cron-error-classification.ts
var CronJobConfigRevisionConflictError = class extends Error {
	constructor(expectedConfigRevision, actualConfigRevision) {
		super("cron job definition no longer matches the loaded version");
		this.expectedConfigRevision = expectedConfigRevision;
		this.actualConfigRevision = actualConfigRevision;
	}
};
function isCronInvalidRequestError(err) {
	const message = formatErrorMessage(err);
	return message === "Agent-less cron job has no resolvable owner. Pass --agent <id> when creating or editing the job, or set agents.defaults.systemAgent.agentId." || message === "cron delivery requires an explicit mode: \"none\", \"announce\", or \"webhook\"; run openclaw doctor --fix for legacy settings or explicitly edit delivery.mode" || message.startsWith("unknown cron job id:") || message.startsWith("cron job already exists:") || message.includes("cron job id must not be blank") || message.includes("cron declarationKey") || message.includes("cron displayName") || message.includes("cron announce delivery requires an explicit channel") || message.includes("cron script payload has a syntax error") || message.includes("cron trigger script has a syntax error") || message.includes("cron script payload must not be empty") || message.includes("cron script payloads cannot be combined") || message.includes("cron script payloads are disabled") || message.includes("cron triggers are disabled") || message.includes("cron triggers require") || message.includes("cron trigger every interval") || message.includes("cron job is missing sessionTarget") || message.includes("invalid cron sessionTarget session id") || message.startsWith("cron sessionTarget \"") || message.includes("has no upcoming run time and would never fire") || message.includes("sessionTarget \"main\" is only valid for the default agent") || message.includes("cron.update payload.kind=\"systemEvent\" requires text") || message.includes("cron.update payload.kind=\"agentTurn\" requires message") || message.includes("cron webhook delivery requires") || message.includes("delivery.channel") || message.includes("delivery.accountId") || message.includes("delivery.failureDestination.channel") || message.includes("failureAlert.channel") || message.includes("cron completion destination webhook requires") || message.includes("cron failure destination webhook requires") || message.includes("cron channel delivery config is only supported") || message.includes("cron delivery.failureDestination is only supported");
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
/** The Gateway projection owns sharing facts and consumes committed write receipts. */
function createCronSessionVisibility(client, context) {
	return {
		prepare() {
			if (!resolveCronEntryFilter(client, context.getRuntimeConfig())) return;
			return requireSessionRowProjection(context).prepareSelection({ metadataOnly: true });
		},
		resolve() {
			if (!resolveCronEntryFilter(client, context.getRuntimeConfig())) return;
			return (sessionKey, agentId) => {
				const cfg = context.getRuntimeConfig();
				const filter = resolveCronEntryFilter(client, cfg);
				if (!filter) return true;
				const identity = resolveSessionStoreIdentity({
					sessionKey,
					agentId,
					cfg
				});
				const projection = requireSessionRowProjection(context);
				let query = {
					agentId: identity.agentId,
					key: identity.canonicalKey
				};
				const parsed = parseAgentSessionKey(sessionKey);
				if (parsed?.agentId === "main" && !isIncognitoSessionKey(sessionKey) && !listAgentIds(cfg).includes(parsed.agentId)) {
					const retained = {
						agentId: parsed.agentId,
						key: `agent:${parsed.agentId}:${parsed.rest}`
					};
					if (projection.capture(retained)) query = retained;
				}
				const target = projection.sharingTarget(query);
				return Boolean(target && filter(target.canonicalKey, target.entry));
			};
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
		const visibilityRead = createCronSessionVisibility(client, context);
		const loaded = await context.cron.readJob(jobId);
		const prepareVisibility = scope.checkVisibility && visibilityRead.resolve() !== void 0;
		if (prepareVisibility) await visibilityRead.prepare();
		if (scope.checkVisibility) assertCronReadCurrent(options);
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
	const sessionVisibility = createCronSessionVisibility(client, context);
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
		await sessionVisibility.prepare();
		const select = () => readCronRunHistoryBinding(storeKey, params.id, {
			runId: params.runId,
			runAtMs: params.runAtMs
		});
		const selected = await select();
		if (!selected) {
			fail();
			return;
		}
		const { sessionKey, sessionId, binding } = selected;
		const agentId = parseAgentSessionKey(sessionKey)?.agentId ?? selected.agentId;
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
		const physical = await readSessionHistoryPageInWorker({
			kind: "transcript-binding",
			params: { target: scope }
		}, opts.signal);
		const { baseSessionKey } = parseCronRunScopeSuffix(sessionKey);
		if (!physical || physical.sessionKey !== sessionKey && physical.sessionKey !== baseSessionKey) {
			fail();
			return;
		}
		const { handleChatHistoryRequest } = await import("./chat-history-handler-4I_MiJPZ.mjs");
		await handleChatHistoryRequest({
			...opts,
			method: "chat.history",
			retainedTranscript: {
				sessionId,
				verifyRetainedState: async () => {
					await context.cron.readJob(params.id);
					return (await select())?.binding === binding;
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
	}
};
//#endregion
//#region src/gateway/server-methods/cron-input-validation.ts
async function captureCronInferenceForCaller(params, caller) {
	let selection;
	let authority;
	return {
		inferenceBinding: await captureCronInferenceBinding({
			...params,
			retainAuthorization: (captured) => {
				authority = captured;
			},
			authorizeProfile: async (profileId, inherited) => {
				if (isUserModelAuthProfileId(profileId) && !inherited) {
					selection = await preparePersonalModelAccountSelection(caller, profileId);
					return selection.assertCurrent;
				}
			}
		}),
		assertInferenceSelectionCurrent: () => {
			selection?.assertCurrent();
			authority?.assertCurrent();
		},
		disposeInferenceAuthorization: () => authority?.dispose()
	};
}
function requiresExplicitAgentRuntimeToolsAllow(params) {
	return params.callerScope !== void 0 && !params.callerScope.manageAll && cronJobUsesToolRuntime(params.job) && params.job.payload.toolsAllow === void 0;
}
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
	if ("agentId" in params.patch || "sessionTarget" in params.patch || "sessionKey" in params.patch) await assertCronDoesNotTargetAgentHarness(nextJob, params.cfg);
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
async function assertCronDoesNotTargetAgentHarness(input, cfg) {
	const targetSessionKey = resolveCronSessionTargetSessionKey(input.sessionTarget) ?? (input.sessionTarget === "current" ? input.sessionKey?.trim() : void 0);
	if (!targetSessionKey) return;
	const loaded = await loadGatewaySessionEntryReadOnlyInWorker({
		cfg,
		key: targetSessionKey,
		agentId: input.agentId?.trim() || void 0
	});
	const reservedKey = isAgentHarnessSessionKey(targetSessionKey) || isAgentHarnessSessionKey(loaded.canonicalKey);
	if (loaded.entry?.modelSelectionLocked === true) throw new Error(reservedKey ? AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE : AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE);
	if (!reservedKey || loaded.entry) return;
	throw new Error(AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE);
}
async function captureCronCreatorSession(job, callerScope, caller, cfg, hasRuntimeAuthority = false) {
	const operatorAuthority = caller.client?.internal?.operatorRunAuthority;
	const hasConversationResult = job.sessionTarget !== "main" && (job.payload.kind === "agentTurn" || job.payload.kind === "script" || job.payload.kind === "command");
	const sessionKey = callerScope?.sessionKey ?? (hasConversationResult ? job.sessionKey : void 0);
	const agentId = callerScope?.agentId ?? job.agentId;
	const loaded = sessionKey ? await loadGatewaySessionEntryReadOnlyInWorker({
		cfg,
		key: sessionKey,
		agentId
	}) : void 0;
	const creatorSession = loaded?.entry;
	const operatorSource = callerScope && loaded && creatorSession && operatorAuthority && operatorScopeSatisfied("operator.write", operatorAuthority.scopes) && job.payload.kind === "agentTurn" && job.sessionTarget === `session:${loaded.canonicalKey}` && caller.client?.internal?.agentRuntimeIdentity ? createRestartRecoveryOperatorSource({
		authority: operatorAuthority,
		entry: creatorSession,
		agentId: loaded.agentId,
		sessionKey: loaded.canonicalKey,
		sourceRunId: caller.client.internal.agentRuntimeIdentity.operationalRunInstance.runId
	}) : void 0;
	const sourceConversation = hasConversationResult && loaded && creatorSession?.sessionId ? {
		sessionKey: loaded.canonicalKey,
		sessionId: creatorSession.sessionId,
		lifecycleRevision: creatorSession.lifecycleRevision
	} : void 0;
	const actor = callerScope ? creatorSession?.createdActor : resolveOperatorSessionCreation(caller.client).actor;
	const actorId = normalizeOptionalString(actor?.id);
	const createdActor = actor ? {
		...actor,
		...actorId ? { id: actorId } : {}
	} : void 0;
	const inference = !hasRuntimeAuthority && job.payload.kind === "agentTurn" && job.sessionTarget !== "main" ? await captureCronInferenceForCaller({
		cfg,
		agentId: agentId ?? resolveDefaultAgentId(cfg),
		model: job.payload.model,
		sessionEntry: callerScope ? creatorSession : void 0
	}, caller) : void 0;
	const assertCreatorCurrent = inference || operatorSource ? () => {
		inference?.assertInferenceSelectionCurrent?.();
		if (operatorSource) operatorAuthority?.assertCurrent();
	} : void 0;
	return {
		...inference,
		...operatorSource ? { operatorSource } : {},
		assertCreatorCurrent,
		...sourceConversation ? { sourceConversation } : {},
		...createdActor ? { createdActor } : {},
		...callerScope && creatorSession?.skillLibrarySelections ? { skillLibrarySelections: creatorSession.skillLibrarySelections } : {}
	};
}
/** Only an explicitly selected account changes an existing job’s inference ownership. */
async function captureCronUpdatedInferenceBinding(nextJob, patch, cfg, caller) {
	if (nextJob.runtimeAuthority !== void 0 || nextJob.payload.kind !== "agentTurn") return;
	const model = patch.payload && "model" in patch.payload ? patch.payload.model : void 0;
	const agentId = nextJob.agentId ?? resolveDefaultAgentId(cfg);
	const selection = model ? resolveSimpleCompletionSelectionForAgent({
		cfg,
		agentId,
		modelRef: model
	}) : null;
	const cliExecution = selection ? resolveCliRuntimeExecutionProvider({
		cfg,
		agentId,
		provider: selection.provider,
		modelId: selection.modelId,
		authProfileId: selection.profileId
	}) : void 0;
	if (!model || !selection?.profileId) {
		if (patch.agentId !== void 0 && nextJob.inferenceBinding) {
			const authority = await acquireCronInferenceAuthorization({
				binding: nextJob.inferenceBinding,
				cfg,
				agentDir: resolveAgentDir(cfg, agentId)
			});
			return {
				inferenceBinding: void 0,
				assertInferenceSelectionCurrent: () => authority.assertCurrent(),
				disposeInferenceAuthorization: () => authority.dispose()
			};
		}
		return;
	}
	const inference = await captureCronInferenceForCaller({
		cfg,
		agentId: nextJob.agentId ?? resolveDefaultAgentId(cfg),
		model
	}, caller);
	if (!inference.inferenceBinding) {
		if (cliExecution && !nextJob.inferenceBinding) return;
		throw new Error("The selected automation account is unavailable.");
	}
	return inference;
}
/** Waiting cannot finish while the caller owns the execution or result conversation lane. */
async function cronRunQueuesBehindCaller(params) {
	const { job, cfg, callerSessionKey } = params;
	if (!callerSessionKey) return false;
	if (job.sessionTarget === "main") return true;
	const agentId = normalizeAgentId(job.agentId ?? params.resolveDefaultAgentId());
	const isCallerSession = (sessionKey) => sessionKey !== void 0 && resolveCronAgentSessionKey({
		sessionKey,
		agentId,
		mainKey: cfg.session?.mainKey,
		cfg
	}) === callerSessionKey;
	if (job.payload.kind === "agentTurn" && isCallerSession(resolveCronSessionTargetSessionKey(job.sessionTarget))) return true;
	const delivery = resolveCronDeliveryPlan(job);
	if (!delivery.requested) return false;
	const sourceSessionKey = resolveCronDeliverySessionKey(job);
	try {
		const resolved = await resolveDeliveryTarget(cfg, agentId, {
			...delivery,
			sessionTarget: job.sessionTarget,
			sourceConversation: job.sourceConversation,
			sessionKey: sourceSessionKey
		}, { dryRun: true });
		if (resolved.ok) return isCallerSession(resolved.sessionRoute?.sessionKey);
		return !requiresExternalCronDelivery(delivery, resolved) && isCallerSession(sourceSessionKey);
	} catch {
		return true;
	}
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
const projections = /* @__PURE__ */ new WeakMap();
/** Each owner's revision covers the filtered rows; the default agent completes presentation identity. */
function projectCronListJobs(owner, page, compact) {
	const defaultAgentId = owner.getDefaultAgentId();
	const key = JSON.stringify([
		page.snapshotRevision,
		page.offset,
		page.limit,
		defaultAgentId
	]);
	const mode = compact ? "compact" : "full";
	let cached = projections.get(owner);
	if (!cached) {
		cached = {};
		projections.set(owner, cached);
	}
	if (cached[mode]?.key !== key) cached[mode] = {
		key,
		jobs: prepareJobs(page.jobs, defaultAgentId, compact)
	};
	return cached[mode].jobs;
}
function prepareJobs(jobs, defaultAgentId, compact) {
	const rows = jobs.map((job) => freezeJsonSnapshot({
		...compact ? compactCronListJob(job) : cronJobReadView(job),
		effectiveAgentId: tryResolveCronJobEffectiveAgentId(job, defaultAgentId) ?? null
	}));
	return registerSerializedJsonArray(Object.freeze(rows), rows.map((row) => JSON.stringify(row)));
}
function compactCronListJob(job) {
	const compact = {
		id: job.id,
		name: job.name,
		agentId: job.agentId,
		updatedAtMs: job.updatedAtMs,
		declarationKey: job.declarationKey || void 0,
		displayName: job.displayName || void 0,
		owner: job.owner,
		enabled: job.enabled,
		nextRunAt: timestampMsToIsoString(job.state.nextRunAtMs) ?? null,
		nextRunAtMs: job.state.nextRunAtMs ?? null,
		scheduleKind: job.schedule.kind,
		...job.schedule.kind === "at" || job.schedule.kind === "every" || job.schedule.kind === "cron" ? { schedule: job.schedule } : {},
		trigger: job.trigger ? true : void 0,
		lastRunAt: timestampMsToIsoString(job.state.lastRunAtMs) ?? null,
		lastRunAtMs: job.state.lastRunAtMs ?? null,
		lastRunStatus: job.state.lastRunStatus ?? job.state.lastStatus ?? null,
		lastRunError: job.state.lastError ?? null,
		runningAtMs: job.state.runningAtMs,
		autoDisabled: job.state.autoDisabled,
		lastDelivered: job.state.lastDelivered,
		lastDeliveryStatus: job.state.lastDeliveryStatus,
		lastDeliveryError: job.state.lastDeliveryError,
		deliverySuppressionReason: job.state.deliverySuppressionReason,
		lastFailureNotificationDelivered: job.state.lastFailureNotificationDelivered,
		lastFailureNotificationDeliveryStatus: job.state.lastFailureNotificationDeliveryStatus,
		lastFailureNotificationDeliveryError: job.state.lastFailureNotificationDeliveryError
	};
	for (const [key, value] of Object.entries(compact)) if (value === void 0) Reflect.deleteProperty(compact, key);
	return compact;
}
//#endregion
//#region src/gateway/server-methods/cron-list.ts
const cronListHandler = createPreparedReadHandler((options) => {
	const { params, respond: originalRespond, context, client } = options;
	const diagnostics = startCronListDiagnostics(context.logGateway, originalRespond);
	const respondToCaller = diagnostics?.respond ?? originalRespond;
	const visibilityRead = createCronSessionVisibility(client, context);
	let handlerOutcome = "returned";
	let prepared = false;
	try {
		if (!assertValidParams(params, validateCronListParams, "cron.list", respondToCaller)) return;
		const p = params;
		const admittedScope = readCronCallerScope(client);
		const callerScope = admittedScope?.manageAll ? void 0 : admittedScope;
		const requestedAgentId = p.agentId ? normalizeAgentId(p.agentId) : void 0;
		if (callerScope && requestedAgentId && requestedAgentId !== callerScope.agentId) {
			respondInvalidCronParams(respondToCaller, "cron.list", "agentId outside caller scope");
			return;
		}
		const release = (outcome) => {
			diagnostics?.finish(outcome);
		};
		const shareable = !callerScope && !visibilityRead.resolve();
		diagnostics?.setRequestMode({
			compact: p.compact === true,
			previewsRequested: p.compact !== true && p.includeDeliveryPreviews !== false,
			scopeApplied: !shareable
		});
		prepared = true;
		return {
			shareable,
			respond: respondToCaller,
			assertCurrent: () => assertCronReadCurrent(options),
			release,
			run: async (respond) => {
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
				await visibilityRead.prepare();
				const cronVisibility = visibilityRead.resolve();
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
				diagnostics?.setReturnedCount(page.jobs.length);
				diagnostics?.mark("projection");
				const jobs = projectCronListJobs(context.cron, page, p.compact === true);
				if (p.compact === true || p.includeDeliveryPreviews === false) {
					assertPageCurrent();
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
			}
		};
	} catch (error) {
		handlerOutcome = "threw";
		throw error;
	} finally {
		if (!prepared) diagnostics?.finish(handlerOutcome);
	}
});
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
const cronRunsHandler = async (options) => {
	const { params, respond, context, client } = options;
	if (!assertValidParams(params, validateCronRunsParams, "cron.runs", respond)) return;
	const p = params;
	const hasJobSelector = p.id !== void 0 || p.jobId !== void 0;
	const jobId = resolveCronJobId(p);
	const scope = p.scope ?? (hasJobSelector ? "job" : "all");
	const visibilityRead = createCronSessionVisibility(client, context);
	const assertCurrent = (storeKey) => {
		assertCronReadCurrent(options);
		if (cronStoreKey(context.cronStorePath) !== storeKey) throw new Error("Cron history store changed; retry the request");
	};
	if (scope === "all") {
		if (readCronCallerScope(client)) {
			respondInvalidCronParams(respond, "cron.runs", "scope all is not allowed by caller scope");
			return;
		}
		const listedJobs = await context.cron.list({ includeDisabled: true });
		const storeKey = cronStoreKey(context.cronStorePath);
		const records = await readCronRunRecords(storeKey);
		await visibilityRead.prepare();
		assertCurrent(storeKey);
		const jobs = filterCronRunLogJobsByAgent(listedJobs.flatMap(({ id }) => {
			const job = context.cron.getJob(id);
			return job ? [job] : [];
		}), p.agentId, context.cron.getDefaultAgentId());
		if (readCronCallerScope(client)) throw new Error("Cron history scope changed; retry the request");
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
		respond(true, projectCronRunHistoryPage(records, {
			...pageOptions,
			entryFilter: visibility ? (entry) => visibleIds.has(entry.jobId) && (!entry.sessionKey || visibility(entry.sessionKey, p.agentId)) : void 0
		}), void 0);
		return;
	}
	if (!jobId) {
		respondMissingCronJobId(respond, "cron.runs");
		return;
	}
	try {
		await context.cron.readJob(jobId);
		const storeKey = cronStoreKey(context.cronStorePath);
		const records = await readCronRunRecords(storeKey, jobId);
		await visibilityRead.prepare();
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
		const pageOptions = {
			storeKey,
			jobId,
			...cronRunLogPageFilters(p),
			jobNameById: matchedJob && typeof matchedJob.name === "string" ? { [jobId]: matchedJob.name } : void 0
		};
		const page = projectCronRunHistoryPage(records, {
			...pageOptions,
			entryFilter: visibility ? (entry) => !entry.sessionKey || visibility(entry.sessionKey, matchedJob?.agentId) : void 0
		});
		if (!job && page.total === 0 && projectCronRunHistoryPage(records, {
			storeKey,
			jobId,
			limit: 1
		}).total === 0) {
			respondCronJobNotFound(respond, jobId);
			return;
		}
		respond(true, page, void 0);
	} catch (error) {
		if (!isInvalidCronRunJobIdError(error)) throw error;
		respondInvalidCronParams(respond, "cron.runs", "invalid id");
	}
};
//#endregion
//#region src/gateway/server-methods/cron-runtime-authority.ts
const AUTHORITY_GUARDED_READS = /* @__PURE__ */ new Set([
	"cron.list",
	"cron.get",
	"cron.runs",
	"cron.history"
]);
function wrapCronHandlersWithRuntimeAuthority(handlers) {
	for (const [method, handler] of Object.entries(handlers)) {
		const wrapped = async (args) => {
			const identity = args.client?.internal?.agentRuntimeIdentity;
			if (!identity) return await handler(args);
			const grant = identity.cronManagementGrant;
			let succeeded = false;
			const run = async () => {
				assertActiveAgentRuntimeAuthority(args.client, args.context);
				await handler({
					...args,
					respond: (...response) => {
						if (AUTHORITY_GUARDED_READS.has(method)) {
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
		if (handler.prepareRead) {
			const prepareRead = handler.prepareRead;
			wrapped.prepareRead = (args) => args.client?.internal?.agentRuntimeIdentity ? { run: (respond) => wrapped({
				...args,
				respond
			}) } : prepareRead(args);
		}
		handlers[method] = wrapped;
	}
}
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
//#region src/gateway/server-methods/cron-wake.ts
const cronWakeHandler = async ({ params, respond, context, client, sessionMutationCommitGuard }) => {
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
		const loaded = await loadGatewaySessionEntryReadOnlyInWorker({
			cfg: context.getRuntimeConfig(),
			key: sessionKey,
			...resolvedAgentId ? { agentId: resolvedAgentId } : {},
			assertActive: sessionMutationCommitGuard
		});
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
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "wake agentId contradicts the agent that owns sessionKey; pass a single wake target"));
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
	respond(true, await context.cron.wake({
		mode: p.mode,
		text: p.text,
		commitGuard: () => {
			sessionMutationCommitGuard?.();
			assertActiveAgentRuntimeAuthority(client, context);
		},
		...sessionKey ? { sessionKey } : {},
		...resolvedAgentId ? { agentId: resolvedAgentId } : {}
	}), void 0);
};
//#endregion
//#region src/gateway/server-methods/cron.ts
const cronHandlers = {
	wake: cronWakeHandler,
	"cron.list": cronListHandler,
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
	"cron.add": async ({ params, respond, context, client, signal, sessionMutationCommitGuard, hasCurrentClientAuthority }) => {
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
		const jobCreate = applyCronCreateCallerScopeDefault(candidate, callerScope);
		let capture;
		try {
			capture = resolveCronCreatorAuthorityCapture(callerScope);
		} catch (err) {
			respondInvalidCronParams(respond, "cron.add", formatErrorMessage(err));
			return;
		}
		const assertMutationCurrent = resolveCronMutationCommitGuard(client, context, void 0, {
			sessionMutationCommitGuard,
			hasCurrentClientAuthority
		});
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
		let creatorOptions;
		const commitGuard = () => {
			assertMutationCurrent?.();
			capture?.assertCurrent();
			creatorOptions?.assertCreatorCurrent?.();
		};
		try {
			const runtimeAuthority = capture?.captureRuntimeAuthority();
			capture &&= {
				...capture,
				captureRuntimeAuthority: () => runtimeAuthority
			};
			creatorOptions = await captureCronCreatorSession(jobCreate, callerScope, {
				client,
				context,
				signal
			}, cfg, runtimeAuthority !== void 0);
			await assertCronDoesNotTargetAgentHarness(jobCreate, cfg);
			await assertValidCronCreateDelivery(cfg, jobCreate);
		} catch (err) {
			creatorOptions?.disposeInferenceAuthorization?.();
			respondInvalidCronParams(respond, "cron.add", formatErrorMessage(err));
			return;
		}
		const previewContext = {
			cfg,
			defaultAgentId: context.cron.getDefaultAgentId()
		};
		let deliveryPreview;
		let result;
		try {
			deliveryPreview = await resolveCronDeliveryPreview({
				...previewContext,
				job: {
					...jobCreate,
					sourceConversation: creatorOptions.sourceConversation
				}
			});
			result = await context.cron.add(jobCreate, {
				enabledExplicit,
				...creatorOptions,
				commitGuard,
				...capture ? { captureRuntimeAuthority: capture.captureRuntimeAuthority } : {},
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
		} finally {
			creatorOptions.disposeInferenceAuthorization?.();
		}
		const job = "job" in result ? result.job : result;
		context.logGateway.info("cron: job added", {
			jobId: job.id,
			declarationKey: job.declarationKey,
			schedule: jobCreate.schedule
		});
		respond(true, cronAddResultReadView({
			result,
			deliveryPreview: "job" in result && !result.created ? await resolveCronDeliveryPreview({
				...previewContext,
				job
			}) : deliveryPreview
		}), void 0);
	},
	"cron.update": async ({ params, respond, context, client, signal, sessionMutationCommitGuard, hasCurrentClientAuthority }) => {
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
		const creatorScope = callerScope?.manageAll && (!callerScope.sessionKey || currentJob.owner?.sessionKey !== callerScope.sessionKey || normalizeAccountId(currentJob.owner?.accountId) !== callerScope.accountId) ? void 0 : callerScope && {
			...callerScope,
			manageAll: void 0
		};
		let capture;
		let inference;
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
		let deliveryPreview;
		const validateUpdate = async (jobToUpdate) => {
			const nextJob = await assertValidCronUpdatePatch({
				cfg,
				defaultAgentId: context.cron.getDefaultAgentId(),
				currentJob: jobToUpdate,
				patch
			});
			if (callerScope?.manageAll && creatorScope && patch.payload?.toolsAllow?.length && (!capture || jobToUpdate.owner?.sessionKey !== creatorScope.sessionKey || !cronJobMatchesCallerScope({
				job: jobToUpdate,
				callerScope: creatorScope
			}) || !cronCreateMatchesCallerScope({
				job: nextJob,
				callerScope: creatorScope
			}))) throw new TypeError(`Cannot authorize toolsAllow: ${patch.payload?.toolsAllow?.join(", ") ?? ""}. Recreate the automation from a fresh authenticated owner turn to capture app authority.`);
			if (touchesToolRuntime && requiresExplicitAgentRuntimeToolsAllow({
				job: nextJob,
				callerScope
			}) && !isLegacyCreatorPromptUpdate(jobToUpdate, patch, callerScope)) throw new TypeError("agent-runtime tool jobs require an explicit payload.toolsAllow cap");
			return nextJob;
		};
		try {
			capture = resolveCronCreatorAuthorityCapture(creatorScope);
			const runtimeAuthority = capture?.captureRuntimeAuthority();
			capture &&= {
				...capture,
				captureRuntimeAuthority: () => runtimeAuthority
			};
			const nextJob = await validateUpdate(currentJob);
			inference = runtimeAuthority ? void 0 : await captureCronUpdatedInferenceBinding(nextJob, patch, cfg, {
				client,
				context,
				signal
			});
		} catch (err) {
			respondInvalidCronParams(respond, "cron.update", formatErrorMessage(err));
			return;
		}
		const commitGuard = resolveCronMutationCommitGuard(client, context, void 0, {
			sessionMutationCommitGuard: () => {
				sessionMutationCommitGuard?.();
				capture?.assertCurrent();
				inference?.assertInferenceSelectionCurrent();
			},
			hasCurrentClientAuthority
		});
		const updateOptions = {
			...touchesToolRuntime ? {
				scheduledToolPolicy: callerScope?.manageAll && !capture ? null : resolveCronScheduledToolPolicyForCaller(callerScope),
				toolsAllowExecTarget: callerScope?.toolsAllowExecTarget
			} : {},
			...inference?.inferenceBinding ? { inferenceBinding: inference.inferenceBinding } : {},
			commitGuard,
			...capture ? { captureRuntimeAuthority: capture.captureRuntimeAuthority } : {}
		};
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
				const nextJob = await validateUpdate(lockedJob);
				deliveryPreview = await resolveCronDeliveryFailurePreview({
					cfg,
					defaultAgentId: context.cron.getDefaultAgentId(),
					job: nextJob
				});
				updateOptions.toolsAllowProvenance = resolveCronRequesterProvenanceForJob(lockedJob, readCronCallerScope(client));
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
		} finally {
			inference?.disposeInferenceAuthorization();
		}
		context.logGateway.info("cron: job updated", { jobId });
		respond(true, {
			...cronJobReadView(job),
			...deliveryPreview ? { deliveryPreview } : {}
		}, void 0);
	},
	"cron.remove": scopedCronJobHandler("cron.remove", validateCronRemoveParams, async ({ respond, context, client, sessionMutationCommitGuard, hasCurrentClientAuthority }, { jobId, callerScope, job }) => {
		const defaultAgentId = context.cron.getDefaultAgentId();
		const usesCurrentJobCapability = !cronJobMatchesCallerScope({
			job,
			callerScope,
			defaultAgentId
		});
		const expectedConfigRevision = usesCurrentJobCapability ? resolveCronJobConfigRevision(job) : void 0;
		let result;
		try {
			let commitGuard = resolveCronMutationCommitGuard(client, context, {
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
			if (identity && validateAuthority && commitGuard && callerScope?.currentJobId === jobId) commitGuard = bindCronSelfRemovalCommitGuard(jobId, identity.operationalRunInstance, commitGuard, () => {
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
		const runQueuesBehindCaller = p.waitTimeoutMs !== void 0 && "enqueued" in result && await cronRunQueuesBehindCaller({
			job,
			cfg: context.getRuntimeConfig(),
			callerSessionKey,
			resolveDefaultAgentId: () => context.cron.getDefaultAgentId()
		});
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
wrapCronHandlersWithRuntimeAuthority(cronHandlers);
//#endregion
export { cronHandlers };
