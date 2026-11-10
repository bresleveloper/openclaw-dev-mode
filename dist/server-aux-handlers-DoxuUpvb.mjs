import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { i as collectNestedErrorCandidates } from "./error-coercion-BwMr25F8.mjs";
import { r as getAsyncWorkSignal, t as AsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
import "./src-Djeo9OvP.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { d as normalizeStringEntries, y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { h as parseSecretRef } from "./types.secrets-Dgbd2kyP.mjs";
import { n as computeBackoff } from "./src-Bzfi3cQM.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as resolveDatabasePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { j as readSqliteDatabaseWriteTokenForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { i as getOrCreatePromise, n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { d as isSqliteWorkerError } from "./sqlite-worker-contract-DhDutMia.mjs";
import { g as readRuntimeConfig, l as getRuntimeConfigSourceSnapshot, o as getRuntimeConfigSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { t as cloneConfigWithResolutionFacts } from "./resolution-facts-D_pto3MV.mjs";
import { x as registerAgentRunDelegatedAuthorityClosedHandler } from "./agent-run-registry-gmaPgO-n.mjs";
import { k as runWithRetainedGatewayRootWork } from "./gateway-work-admission-FWbk4b3p.mjs";
import { f as isTrustedSecretSurfaceUnavailableError, p as listActiveCredentialDegradedOwners } from "./runtime-degraded-state-SptB0g_t.mjs";
import { c as getActiveSecretsRuntimeSnapshotRevisionState, l as getActiveSecretsRuntimeSnapshotState, o as getActiveSecretsRuntimeEnvState } from "./runtime-state-DDDhACod.mjs";
import "./backoff-N5Hi0doU.mjs";
import { i as resolveManifestContractOwnerPluginId } from "./plugin-registry-contributions-BDlJJbko.mjs";
import { a as READ_SCOPE, n as APPROVALS_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import { a as createResolverContext, p as assertExpectedResolvedSecretValue } from "./runtime-shared-DqMZ_k3n.mjs";
import { r as discoverConfigSecretTargetsByIds } from "./target-registry-query-DOYceNvb.mjs";
import { i as setPathExistingStrict } from "./path-utils-aDSU1mEq.mjs";
import "./target-registry-CSb4wosA.mjs";
import "./io-DIF-KW3P.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-CsnAJK7x.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
import "./method-scopes-Bcx3NDQr.mjs";
import { n as getLoadedChannelPlugin } from "./registry-B91r5qN6.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { n as channelRouteDedupeKey } from "./channel-route-2bD3dZs2.mjs";
import { s as resolveExecApprovalRequestAllowedDecisions } from "./exec-approvals-policy-Cd5JaUxb.mjs";
import { t as resolveChannelApprovalAdapter } from "./plugins-CCVkYF8m.mjs";
import { t as formatFencedCodeBlock } from "./markdown-code-Buzx6wvi.mjs";
import "./config-B3oiWDlr.mjs";
import "./plugin-registry-BKRXR0Si.mjs";
import { n as resolveControlUiWebPushUrl } from "./control-ui-shared-DqFhbHR8.mjs";
import "./exec-approvals-ByI8H66l.mjs";
import { n as hasEffectivePairedDeviceRole } from "./device-pairing-identity-BRtdqCdi.mjs";
import { i as loadOrCreateProcessDeviceIdentityAsync } from "./device-identity-async-BBs_AIYT.mjs";
import { i as sanitizeExecApprovalWarningText } from "./exec-approval-text-sanitize-pO0fnlnc.mjs";
import { _ as webPushAgentAllowed, f as isWebPushQuietHours, m as normalizeWebPushDisplayLabel, v as webPushCategoryEnabled } from "./push-web-store.records-Bum4pQI9.mjs";
import { c as listTerminalWebPushApprovalDeliveryIds, l as listWebPushApprovalDeliveryTargets, o as deleteWebPushApprovalDeliveryTargets, r as prepareWebPushNotificationSender, s as hasBoundWebPushSubscriptions, u as prepareWebPushApprovalDeliveries } from "./push-web-BTMTakTG.mjs";
import { i as listDevicePairing } from "./device-pairing-_Xo0MHGf.mjs";
import { i as withCurrentWebPushAuthority, n as webPushSessionAccess, r as webPushTargetClient, t as listCurrentWebPushTargets } from "./web-push-authority-BMaaFG0X.mjs";
import { n as disconnectStaleSharedGatewayAuthClients } from "./server-shared-auth-generation-CqbvG8L5.mjs";
import { t as isChannelStartupSuppressedByEnvironment } from "./server-sidecar-startup-mode-BZT1Vmld.mjs";
import { o as diffConfigPaths, t as buildGatewayReloadPlan } from "./config-reload-plan-B6NE-M4X.mjs";
import { n as resolveSecretRefValue } from "./resolve-D1-YVpS6.mjs";
import { i as resolveProjectedMcpCodexToolApprovalMode } from "./mcp-codex-tool-approval-DQZI_si1.mjs";
import { a as buildPluginApprovalRequestMessage, i as buildPluginApprovalExpiredMessage, r as approvalDecisionLabel } from "./plugin-approvals-CNVcvn9G.mjs";
import { t as resolveCanonicalPluginApprovalRequestAllowedDecisions } from "./plugin-approval-canonical-decisions-Dx5Fhv49.mjs";
import { t as canChannelEnforcePluginReviewerPolicy } from "./approval-channel-policy-support-DWQOjoD0.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-CYrCYT-h.mjs";
import { r as hasActiveNativeApprovalRoute } from "./approval-native-route-coordinator-Bf_JrqoL.mjs";
import { t as analyzeCommandSecretAssignmentsFromSnapshot } from "./command-config-DQfEL9Yk.mjs";
import { t as resolveRuntimeWebTools } from "./runtime-web-tools-6rNTYk8t.mjs";
import { t as matchesApprovalRequestFilters } from "./approval-request-filters-BYgsD07g.mjs";
import { u as formatExecApprovalExpiresIn } from "./exec-approval-reply-Dn62m4ql.mjs";
import { g as resolveApprovalRequestKind } from "./approval-request-account-binding-CVzeB0WI.mjs";
import { n as buildSystemAgentApprovalResolvedText, t as SYSTEM_AGENT_APPROVAL_EXPIRED_TEXT } from "./approval-terminal-D_V2O5Tg.mjs";
import { t as createPendingApprovalRegistry } from "./pending-approval-registry-Ba8xUSFo.mjs";
import { t as resolveExecApprovalCommandDisplay } from "./exec-approval-command-display-CXSi5KK6.mjs";
import { t as SYSTEM_AGENT_APPROVAL_DECISIONS } from "./system-agent-approvals-r0J6k0r_.mjs";
import { a as buildTypedApprovalPendingReplyPayload, i as buildPluginApprovalResolvedReplyPayload, n as buildApprovalResolvedReplyPayload, o as buildTypedPluginApprovalPendingReplyPayload } from "./approval-renderers-Cd_8TpLz.mjs";
import { v as sameWorkerSessionTurnClaim } from "./placement-record-CBaaHws5.mjs";
import { r as fromRow } from "./placement-row-codec-DhdW6tSs.mjs";
import { a as getOperatorApprovalDetailed, c as isOperatorApprovalStoreRefusal, f as readPlacementStandingGrant, i as forceDenyOperatorApproval, m as resolveOperatorApproval, n as consumeOperatorApprovalAllowOnce, o as insertOperatorApproval, p as recoverOperatorApprovalsOnStartup, s as isOperatorApprovalStoreOutcomeUnknown } from "./operator-approval-store-CHMiK9vK.mjs";
import { n as clearApnsRegistrationIfCurrent, s as loadApnsRegistrations } from "./push-apns-store-D7QEuLwt.mjs";
import { t as QuestionManager } from "./question-manager-9Aoc5s7A.mjs";
import { n as isApprovalRecordVisibleToClient, t as canAccessApprovalSession } from "./approval-record-lookup-KFM8XG5s.mjs";
import { t as resolveApprovalSessionAudienceWithFallback } from "./approval-session-audience-gHq0_Gba.mjs";
import { t as canAccessOperatorApproval } from "./operator-approval-authorization-C9wV2RU-.mjs";
import { a as sendApnsPluginApprovalAlert, c as resolveApnsRelayConfigFromEnv, i as sendApnsExecApprovalResolvedWake, l as resolveApnsAuthConfigFromEnv, o as sendApnsPluginApprovalResolvedWake, r as sendApnsExecApprovalAlert, s as shouldClearStoredApnsRegistration } from "./push-apns-CQbSKavc.mjs";
import { a as prepareExecApprovalStandingGrant, c as assertExecApprovalMutationPersistenceCurrent, d as readUncertainExecApprovalVerdict, f as runWithExecApprovalMutationPersistence, i as prepareExecApprovalRedemptionWindow, l as assertUncertainExecApprovalPersistenceCurrent, o as projectClosedApprovalResolution, r as ExecApprovalLifecycle, s as projectRepairedApprovalResolution, u as captureExecApprovalMutationPersistence } from "./exec-approval-lifecycle-BEqOgI73.mjs";
import { i as prepareExecApprovalRegistration, n as createExecApprovalRecord, r as prepareExecApprovalPresentation } from "./exec-approval-registration-CWvugAG3.mjs";
import { t as publishAppliedApprovalResolution } from "./approval-publication-BwNXuWUp.mjs";
import { r as refreshModelRuntimeAfterHotReload } from "./server-reload-model-runtime-scope-3YBunbac.mjs";
import { createHash, randomUUID } from "node:crypto";
//#region src/infra/exec-approval-forwarder.messages.ts
function buildForwardedExecApprovalRequest(request, nowMs) {
	const allowedDecisions = resolveExecApprovalRequestAllowedDecisions(request.request);
	const decisionText = allowedDecisions.join("|");
	const lines = ["🔒 Exec approval required", `ID: ${request.id}`];
	const warningText = request.request.warningText?.trim();
	if (warningText) lines.push("", warningText);
	const analysisWarningLines = normalizeStringEntries(request.request.commandAnalysis?.warningLines.map(sanitizeExecApprovalWarningText)).slice(0, 5);
	if (analysisWarningLines && analysisWarningLines.length > 0) {
		lines.push("", "Command analysis:");
		for (const line of analysisWarningLines) lines.push(`- ${line}`);
	}
	const command = resolveExecApprovalCommandDisplay(request.request).commandText;
	if (!command.includes("\n") && !command.includes("`")) lines.push(`Command: \`${command}\``);
	else lines.push("Command:", formatFencedCodeBlock(command));
	const appendField = (field, label) => {
		if (request.request[field]) lines.push(`${label}: ${request.request[field]}`);
	};
	appendField("cwd", "CWD");
	appendField("nodeId", "Node");
	if (Array.isArray(request.request.envKeys) && request.request.envKeys.length > 0) lines.push(`Env overrides: ${request.request.envKeys.join(", ")}`);
	appendField("host", "Host");
	appendField("agentId", "Agent");
	appendField("security", "Security");
	appendField("ask", "Ask");
	lines.push(`Expires in: ${formatExecApprovalExpiresIn(request.expiresAtMs, nowMs)}`);
	lines.push("Mode: foreground (interactive approvals available in this chat).");
	lines.push(allowedDecisions.includes("allow-always") ? "Background mode note: non-interactive runs cannot wait for chat approvals; use pre-approved policy (allow-always or ask=off)." : "Background mode note: non-interactive runs cannot wait for chat approvals; the effective policy still requires per-run approval unless ask=off.");
	lines.push(`Reply with: /approve ${request.id} ${decisionText}`);
	if (!allowedDecisions.includes("allow-always")) lines.push("Allow Always is unavailable for this command.");
	return lines.join("\n");
}
function buildForwardedExecApprovalResolved(resolved) {
	return `${`✅ Exec approval ${approvalDecisionLabel(resolved.decision)}.`}${resolved.resolvedBy ? ` Resolved by ${resolved.resolvedBy}.` : ""} ID: ${resolved.id}`;
}
function buildForwardedExecApprovalExpired(request) {
	return `⏱️ Exec approval expired. ID: ${request.id}`;
}
function resolveApprovalRenderer(target) {
	const channel = normalizeMessageChannel(target.channel) ?? target.channel;
	return channel ? resolveChannelApprovalAdapter(getLoadedChannelPlugin(channel))?.render : void 0;
}
function buildForwardedExecPendingPayload(params) {
	const render = resolveApprovalRenderer(params.target)?.exec?.buildPendingPayload;
	return render?.(params) ?? buildTypedApprovalPendingReplyPayload({
		approvalKind: "exec",
		approvalId: params.request.id,
		approvalSlug: params.request.id.slice(0, 8),
		text: buildForwardedExecApprovalRequest(params.request, params.nowMs),
		agentId: params.request.request.agentId ?? null,
		allowedDecisions: resolveExecApprovalRequestAllowedDecisions(params.request.request),
		sessionKey: params.request.request.sessionKey ?? null
	});
}
function buildForwardedExecResolvedPayload(params) {
	const render = resolveApprovalRenderer(params.target)?.exec?.buildResolvedPayload;
	return render?.(params) ?? buildApprovalResolvedReplyPayload({
		approvalId: params.resolved.id,
		approvalSlug: params.resolved.id.slice(0, 8),
		text: buildForwardedExecApprovalResolved(params.resolved)
	});
}
function buildForwardedPluginPendingPayload(params) {
	const render = resolveApprovalRenderer(params.target)?.plugin?.buildPendingPayload;
	return render?.(params) ?? buildTypedPluginApprovalPendingReplyPayload({
		request: params.request,
		nowMs: params.nowMs,
		text: buildPluginApprovalRequestMessage(params.request, params.nowMs),
		allowedDecisions: resolveCanonicalPluginApprovalRequestAllowedDecisions(params.request.request)
	});
}
function buildForwardedPluginResolvedPayload(params) {
	const render = resolveApprovalRenderer(params.target)?.plugin?.buildResolvedPayload;
	return render?.(params) ?? buildPluginApprovalResolvedReplyPayload({ resolved: params.resolved });
}
function buildForwardedSystemAgentPendingPayload(params) {
	const { request, nowMs } = params;
	const expiresIn = Math.max(0, Math.round((request.expiresAtMs - nowMs) / 1e3));
	return buildTypedApprovalPendingReplyPayload({
		approvalKind: "system-agent",
		approvalId: params.request.id,
		approvalSlug: params.request.id.slice(0, 8),
		text: [
			"🛠️ OpenClaw change requires approval",
			`Change: ${request.request.description}`,
			...request.request.agentId ? [`Agent: ${request.request.agentId}`] : [],
			`ID: ${request.id}`,
			`Expires in: ${expiresIn}s`,
			`Reply with: /approve ${request.id} ${SYSTEM_AGENT_APPROVAL_DECISIONS.join("|")}`
		].join("\n"),
		agentId: params.request.request.agentId ?? null,
		allowedDecisions: SYSTEM_AGENT_APPROVAL_DECISIONS,
		sessionKey: params.request.request.sessionKey ?? null
	});
}
function buildForwardedSystemAgentResolvedPayload(params) {
	const { resolved } = params;
	return buildApprovalResolvedReplyPayload({
		approvalId: resolved.id,
		approvalSlug: resolved.id.slice(0, 8),
		text: resolved.terminalStatus === "expired" ? SYSTEM_AGENT_APPROVAL_EXPIRED_TEXT : buildSystemAgentApprovalResolvedText({
			approvalKind: "system-agent",
			approvalId: resolved.id,
			phase: "resolved",
			title: "OpenClaw change",
			description: resolved.request?.description ?? null,
			metadata: [],
			commandText: resolved.request?.description ?? "",
			operationSummary: resolved.request?.description ?? "the requested change",
			decision: resolved.decision,
			resolvedBy: resolved.resolvedBy,
			applicationStatus: resolved.applicationStatus,
			terminalStatus: resolved.terminalStatus
		})
	});
}
//#endregion
//#region src/infra/exec-approval-forwarder.ts
const log = createSubsystemLogger("gateway/exec-approvals");
const SYNTHETIC_APPROVAL_REQUEST_ID = "__approval-routing__";
function buildTargetKey(target) {
	const channel = normalizeMessageChannel(target.channel) ?? target.channel;
	return channelRouteDedupeKey({
		channel,
		to: target.to,
		accountId: target.accountId,
		threadId: target.threadId
	});
}
function buildSyntheticApprovalRequest(routeRequest) {
	return {
		approvalKind: "exec",
		id: SYNTHETIC_APPROVAL_REQUEST_ID,
		request: {
			command: "",
			...extractApprovalRouteRequest(routeRequest)
		},
		createdAtMs: 0,
		expiresAtMs: 0
	};
}
function restoreApprovalRequestForSuppression(params) {
	if (!params.request) return;
	const restored = {
		id: params.id,
		request: params.request,
		createdAtMs: 0,
		expiresAtMs: 0
	};
	try {
		if (resolveApprovalRequestKind(restored) !== params.approvalKind) return;
		return restored;
	} catch {
		return;
	}
}
async function shouldSkipForwardingFallback(params) {
	const channel = normalizeMessageChannel(params.target.channel) ?? params.target.channel;
	if (!channel) return false;
	const plugin = getLoadedChannelPlugin(channel);
	if (params.approvalKind === "plugin" && !canChannelEnforcePluginReviewerPolicy(params.cfg, channel, plugin?.approvalCapability)) return true;
	const adapter = resolveChannelApprovalAdapter(plugin);
	const fallbackInput = {
		cfg: params.cfg,
		approvalKind: params.approvalKind,
		target: params.target,
		request: params.approvalRequest ?? buildSyntheticApprovalRequest(params.routeRequest)
	};
	if (adapter?.delivery?.shouldBlockForwardingFallback?.(fallbackInput)) return true;
	const delivery = adapter?.delivery;
	if (!(delivery?.shouldSuppressForwardingFallbackAsync ? await delivery.shouldSuppressForwardingFallbackAsync(fallbackInput) : delivery?.shouldSuppressForwardingFallback?.(fallbackInput) ?? false) || !plugin) return false;
	return hasActiveNativeApprovalRoute(params.nativeRouteCoordinator, {
		channel,
		accountId: normalizeOptionalString(params.target.accountId) ?? resolveChannelDefaultAccountId({
			plugin,
			cfg: params.cfg
		}),
		approvalKind: params.approvalKind
	});
}
function normalizeTurnSourceChannel(value) {
	const normalized = value ? normalizeMessageChannel(value) : void 0;
	if (!normalized || !isDeliverableMessageChannel(normalized) && normalized !== "webchat" && normalized !== "tui") return;
	return normalized;
}
function normalizeForwardingTurnSourceChannel(value, approvalKind) {
	const normalized = normalizeTurnSourceChannel(value);
	if (approvalKind === "exec" && normalized && !isDeliverableMessageChannel(normalized)) return;
	return normalized;
}
function extractApprovalRouteRequest(request) {
	if (!request) return null;
	return {
		agentId: request.agentId ?? null,
		sessionKey: request.sessionKey ?? null,
		turnSourceChannel: request.turnSourceChannel ?? null,
		turnSourceTo: request.turnSourceTo ?? null,
		turnSourceAccountId: request.turnSourceAccountId ?? null,
		turnSourceThreadId: request.turnSourceThreadId ?? null
	};
}
function defaultResolveSessionTarget(params) {
	return import("./exec-approval-forwarder.runtime.js").then(async ({ resolveExecApprovalSessionTargetAsync }) => {
		const resolvedTarget = await resolveExecApprovalSessionTargetAsync({
			cfg: params.cfg,
			request: params.request,
			turnSourceChannel: normalizeTurnSourceChannel(params.request.request.turnSourceChannel),
			turnSourceTo: normalizeOptionalString(params.request.request.turnSourceTo),
			turnSourceAccountId: normalizeOptionalString(params.request.request.turnSourceAccountId),
			turnSourceThreadId: params.request.request.turnSourceThreadId ?? void 0
		});
		if (!resolvedTarget?.channel || !resolvedTarget.to) return null;
		const channel = resolvedTarget.channel;
		if (!isDeliverableMessageChannel(channel)) return null;
		return {
			channel,
			to: resolvedTarget.to,
			accountId: resolvedTarget.accountId,
			threadId: resolvedTarget.threadId
		};
	});
}
async function deliverToTargets(params) {
	const deliveries = params.targets.map(async (target) => {
		if (params.shouldSend && !params.shouldSend()) return;
		const channel = normalizeMessageChannel(target.channel) ?? target.channel;
		if (!isDeliverableMessageChannel(channel)) return;
		try {
			const payload = params.buildPayload(target);
			await params.beforeDeliver?.(target, payload);
			const send = await params.deliver({
				cfg: params.cfg,
				channel,
				to: target.to,
				accountId: target.accountId,
				threadId: target.threadId,
				payloads: [payload]
			});
			if (send.status === "failed" || send.status === "partial_failed") throw send.error;
		} catch (err) {
			log.error(`exec approvals: failed to deliver to ${channel}:${target.to}: ${String(err)}`);
		}
	});
	await Promise.allSettled(deliveries);
}
async function resolveForwardTargets(params) {
	const mode = params.config?.mode ?? "session";
	const targets = [];
	const seen = /* @__PURE__ */ new Set();
	if (mode === "session" || mode === "both") {
		const sessionRouteRequest = {
			...params.routeRequest,
			turnSourceChannel: normalizeForwardingTurnSourceChannel(params.routeRequest.turnSourceChannel, params.approvalKind)
		};
		const sessionTarget = await params.resolveSessionTarget({
			cfg: params.cfg,
			request: buildSyntheticApprovalRequest(sessionRouteRequest)
		});
		if (sessionTarget) {
			const key = buildTargetKey(sessionTarget);
			seen.add(key);
			targets.push({
				...sessionTarget,
				source: "session"
			});
		}
	}
	if (mode === "targets" || mode === "both") {
		const explicitTargets = params.config?.targets ?? [];
		for (const target of explicitTargets) {
			const key = buildTargetKey(target);
			if (seen.has(key)) continue;
			seen.add(key);
			targets.push({
				...target,
				source: "target"
			});
		}
	}
	return targets;
}
function createApprovalHandlers(params) {
	const pending = createPendingApprovalRegistry();
	const work = new AsyncWorkScope();
	let stopped = false;
	let stopPromise;
	const trackDelivery = (run) => work.track(() => runWithRetainedGatewayRootWork(run));
	const resolveTargets = async (paramsForRoute) => {
		if (!paramsForRoute.config?.enabled || !matchesApprovalRequestFilters({
			request: paramsForRoute.routeRequest,
			agentFilter: paramsForRoute.config.agentFilter,
			sessionFilter: paramsForRoute.config.sessionFilter,
			fallbackAgentIdFromSessionKey: true
		})) return [];
		if (params.strategy.liveOriginOnly) {
			const origin = normalizeMessageChannel(paramsForRoute.routeRequest.turnSourceChannel ?? "");
			if (!origin || !isDeliverableMessageChannel(origin) || !normalizeOptionalString(paramsForRoute.routeRequest.turnSourceTo)) return [];
		}
		const targets = await resolveForwardTargets({
			...paramsForRoute,
			approvalKind: params.strategy.kind,
			resolveSessionTarget: params.resolveSessionTarget
		});
		const nativeRouteCoordinator = params.getNativeApprovalRouteCoordinator();
		const selected = await Promise.all(targets.map(async (target) => !await shouldSkipForwardingFallback({
			approvalKind: params.strategy.kind,
			target,
			cfg: paramsForRoute.cfg,
			routeRequest: paramsForRoute.routeRequest,
			approvalRequest: paramsForRoute.approvalRequest,
			nativeRouteCoordinator
		})));
		return targets.filter((_, index) => selected[index]);
	};
	const deliverResolved = async (resolved, entry) => {
		const cfg = params.getConfig();
		const routeRequest = entry?.routeRequest ?? extractApprovalRouteRequest(resolved.request);
		const targets = entry?.targets ?? (routeRequest ? await resolveTargets({
			cfg,
			config: params.strategy.config(cfg),
			routeRequest,
			approvalRequest: restoreApprovalRequestForSuppression({
				approvalKind: params.strategy.kind,
				id: resolved.id,
				request: resolved.request
			})
		}) : []);
		if (!targets.length) return;
		await deliverToTargets({
			cfg,
			targets,
			buildPayload: (target) => params.strategy.buildResolvedPayload({
				cfg,
				resolved,
				target
			}),
			deliver: params.deliver
		});
	};
	const handleRequested = async (request) => {
		const cfg = params.getConfig();
		const config = params.strategy.config(cfg);
		const requestId = request.id;
		const routeRequest = extractApprovalRouteRequest(request.request) ?? {};
		const pendingEntry = pending.begin(requestId, {
			routeRequest,
			targets: []
		});
		let filteredTargets;
		try {
			filteredTargets = await resolveTargets({
				cfg,
				config,
				routeRequest,
				approvalRequest: request
			});
		} catch (error) {
			pending.remove(requestId, pendingEntry);
			throw error;
		}
		if (filteredTargets.length === 0) {
			pending.remove(requestId, pendingEntry);
			return false;
		}
		pendingEntry.value = {
			routeRequest,
			targets: filteredTargets
		};
		const buildExpiredText = params.strategy.buildExpiredText;
		if (buildExpiredText) {
			const expiresInMs = Math.max(0, request.expiresAtMs - params.nowMs());
			pending.scheduleExpiry(pendingEntry, expiresInMs, (expired) => trackDelivery(() => deliverToTargets({
				cfg,
				targets: expired.value.targets,
				buildPayload: () => ({ text: buildExpiredText(request) }),
				deliver: params.deliver
			})).catch((err) => {
				log.error(`${params.strategy.kind} approvals: failed to deliver expiry notification for ${requestId}: ${String(err)}`);
			}));
		}
		trackDelivery(() => deliverToTargets({
			cfg,
			targets: filteredTargets,
			buildPayload: (target) => params.strategy.buildPendingPayload({
				cfg,
				request,
				target,
				nowMs: params.nowMs()
			}),
			beforeDeliver: async (target, payload) => {
				const channel = normalizeMessageChannel(target.channel) ?? target.channel;
				if (!channel) return;
				await getLoadedChannelPlugin(channel)?.outbound?.beforeDeliverPayload?.({
					cfg,
					target,
					payload,
					hint: {
						kind: "approval-pending",
						approvalKind: params.strategy.kind
					}
				});
			},
			deliver: params.deliver,
			shouldSend: () => pending.isCurrent(pendingEntry)
		}).then(() => pending.completeDelivery(pendingEntry, pendingEntry.value))).catch((err) => {
			log.error(`${params.strategy.kind} approvals: failed to deliver request ${requestId}: ${String(err)}`);
		});
		return true;
	};
	const handleResolved = async (resolved) => {
		const settled = pending.settle(resolved.id, (entry) => deliverResolved(resolved, entry.value));
		if (settled.status === "queued") return;
		if (settled.status === "taken") {
			await settled.terminal(settled.entry);
			return;
		}
		if (!params.strategy.liveOriginOnly) await deliverResolved(resolved);
	};
	return {
		handleRequested: (request) => stopped ? Promise.resolve(false) : trackDelivery(() => handleRequested(request)),
		handleResolved: (resolved) => stopped ? Promise.resolve() : trackDelivery(() => handleResolved(resolved)),
		stop: () => {
			if (!stopPromise) {
				stopped = true;
				pending.stopExpiryTimers();
				stopPromise = work.drain().then(() => pending.clear());
			}
			return stopPromise;
		}
	};
}
const execApprovalStrategy = {
	kind: "exec",
	config: (cfg) => cfg.approvals?.exec,
	buildExpiredText: buildForwardedExecApprovalExpired,
	buildPendingPayload: buildForwardedExecPendingPayload,
	buildResolvedPayload: buildForwardedExecResolvedPayload
};
const pluginApprovalStrategy = {
	kind: "plugin",
	config: (cfg) => cfg.approvals?.plugin,
	buildExpiredText: buildPluginApprovalExpiredMessage,
	buildPendingPayload: buildForwardedPluginPendingPayload,
	buildResolvedPayload: buildForwardedPluginResolvedPayload
};
const SYSTEM_AGENT_FORWARDING = {
	enabled: true,
	mode: "session"
};
const systemAgentApprovalStrategy = {
	kind: "system-agent",
	config: () => SYSTEM_AGENT_FORWARDING,
	buildPendingPayload: buildForwardedSystemAgentPendingPayload,
	buildResolvedPayload: buildForwardedSystemAgentResolvedPayload,
	liveOriginOnly: true
};
function createExecApprovalForwarder(deps = {}) {
	const handlerDeps = {
		getConfig: deps.getConfig ?? readRuntimeConfig,
		deliver: deps.deliver ?? (async (params) => {
			const { sendDurableMessageBatchCore } = await import("./exec-approval-forwarder.runtime.js");
			return sendDurableMessageBatchCore(params);
		}),
		nowMs: deps.nowMs ?? Date.now,
		resolveSessionTarget: deps.resolveSessionTarget ?? defaultResolveSessionTarget,
		getNativeApprovalRouteCoordinator: deps.getNativeApprovalRouteCoordinator ?? (() => void 0)
	};
	const execHandlers = createApprovalHandlers({
		...handlerDeps,
		strategy: execApprovalStrategy
	});
	const pluginHandlers = createApprovalHandlers({
		...handlerDeps,
		strategy: pluginApprovalStrategy
	});
	const systemAgentHandlers = createApprovalHandlers({
		...handlerDeps,
		strategy: systemAgentApprovalStrategy
	});
	return {
		handleRequested: execHandlers.handleRequested,
		handleResolved: execHandlers.handleResolved,
		handlePluginApprovalRequested: pluginHandlers.handleRequested,
		handlePluginApprovalResolved: pluginHandlers.handleResolved,
		handleSystemAgentApprovalRequested: systemAgentHandlers.handleRequested,
		handleSystemAgentApprovalResolved: systemAgentHandlers.handleResolved,
		stop: async () => {
			await Promise.all([
				execHandlers.stop(),
				pluginHandlers.stop(),
				systemAgentHandlers.stop()
			]);
		}
	};
}
//#endregion
//#region src/secrets/runtime-command-secrets.ts
/** Resolves command-scoped secrets, including web provider override credentials. */
const WEB_PROVIDER_OVERRIDES = [[
	"webSearch",
	"search",
	"webSearchProviders"
], [
	"webFetch",
	"fetch",
	"webFetchProviders"
]];
function hasProviderOverrides(overrides) {
	return WEB_PROVIDER_OVERRIDES.some(([key]) => normalizeOptionalString(overrides?.[key]) !== void 0);
}
function applyProviderOverridesToConfig(config, overrides) {
	if (!hasProviderOverrides(overrides)) return config;
	const next = cloneConfigWithResolutionFacts(config);
	const tools = next.tools ??= {};
	const web = tools.web ??= {};
	for (const [key, kind] of WEB_PROVIDER_OVERRIDES) {
		const provider = normalizeOptionalString(overrides?.[key]);
		if (provider) {
			const tool = web[kind] ??= {};
			tool.provider = provider;
		}
	}
	return next;
}
function pluginIdFromRuntimeWebPath(path) {
	return /^plugins\.entries\.([^.]+)\.config\.(webSearch|webFetch)\.apiKey$/.exec(path)?.[1];
}
function isProviderOverridePath(params) {
	for (const [overrideKey, kind, contract] of WEB_PROVIDER_OVERRIDES) {
		const provider = normalizeOptionalString(params.providerOverrides?.[overrideKey]);
		if (!provider) continue;
		if (params.config.tools?.web?.[kind]?.enabled === false) return false;
		const pluginId = pluginIdFromRuntimeWebPath(params.path);
		if (pluginId && params.path.endsWith(`.config.${overrideKey}.apiKey`)) return resolveManifestContractOwnerPluginId({
			contract,
			value: provider,
			origin: "bundled",
			config: params.config
		}) === pluginId;
	}
	return false;
}
function restoreInactiveWebCommandSecretTargets(params) {
	const inactive = new Set(params.inactiveRefPaths);
	const defaults = params.sourceConfig.secrets?.defaults;
	for (const target of discoverConfigSecretTargetsByIds(params.sourceConfig, params.targetIds)) {
		if (!pluginIdFromRuntimeWebPath(target.path)) continue;
		if (!(parseSecretRef(target.refValue, defaults) ?? parseSecretRef(target.value, defaults))) continue;
		if (!params.isInactivePath(target.path)) continue;
		inactive.add(target.path);
		setPathExistingStrict(params.resolvedConfig, target.pathSegments, target.value);
	}
	return [...inactive];
}
async function resolveForcedActiveCommandSecretTargets(params) {
	const activePaths = /* @__PURE__ */ new Set([...params.forcedActivePaths ?? [], ...params.optionalActivePaths ?? []]);
	if (activePaths.size === 0) return;
	const context = createResolverContext({
		sourceConfig: params.sourceConfig,
		env: getActiveSecretsRuntimeEnvState()
	});
	const defaults = params.sourceConfig.secrets?.defaults;
	for (const target of discoverConfigSecretTargetsByIds(params.sourceConfig, params.targetIds)) {
		if (params.allowedPaths && !params.allowedPaths.has(target.path)) continue;
		if (!activePaths.has(target.path)) continue;
		const ref = parseSecretRef(target.refValue, defaults) ?? parseSecretRef(target.value, defaults);
		if (!ref) continue;
		try {
			const resolved = await resolveSecretRefValue(ref, {
				config: params.sourceConfig,
				env: context.env,
				cache: context.cache
			});
			assertExpectedResolvedSecretValue({
				value: resolved,
				expected: target.entry.expectedResolvedValue,
				errorMessage: target.entry.expectedResolvedValue === "string" ? `${target.path} resolved to a non-string or empty value.` : `${target.path} resolved to an unsupported value type.`
			});
			setPathExistingStrict(params.resolvedConfig, target.pathSegments, resolved);
		} catch {}
	}
}
/**
* Resolves command-scoped SecretRef assignments from the active runtime snapshot.
* Provider overrides are evaluated against cloned snapshot config.
*/
function resolveCommandSecretsFromActiveRuntimeSnapshot(params) {
	const activeSnapshot = getActiveSecretsRuntimeSnapshotState();
	if (!activeSnapshot) throw new Error("Secrets runtime snapshot is not active.");
	if (params.targetIds.size === 0) return Promise.resolve({
		assignments: [],
		diagnostics: [],
		inactiveRefPaths: []
	});
	return resolveCommandSecretsFromSnapshot(activeSnapshot, { ...params });
}
async function resolveCommandSecretsFromSnapshot(activeSnapshot, params) {
	const hasOverrides = hasProviderOverrides(params.providerOverrides);
	const sourceConfig = applyProviderOverridesToConfig(activeSnapshot.sourceConfig, params.providerOverrides);
	const resolvedConfig = applyProviderOverridesToConfig(activeSnapshot.config, params.providerOverrides);
	const context = hasOverrides ? createResolverContext({
		sourceConfig,
		env: getActiveSecretsRuntimeEnvState()
	}) : void 0;
	if (context) await resolveRuntimeWebTools({
		sourceConfig,
		resolvedConfig,
		context
	});
	await resolveForcedActiveCommandSecretTargets({
		sourceConfig,
		resolvedConfig,
		targetIds: params.targetIds,
		allowedPaths: params.allowedPaths,
		forcedActivePaths: params.forcedActivePaths,
		optionalActivePaths: params.optionalActivePaths
	});
	const warningSource = context?.warnings ?? activeSnapshot.warnings;
	const isInactivePath = (path) => {
		if (params.allowedPaths && !params.allowedPaths.has(path) || params.forcedActivePaths?.has(path) || params.optionalActivePaths?.has(path)) return false;
		return !hasOverrides || !isProviderOverridePath({
			config: sourceConfig,
			path,
			providerOverrides: params.providerOverrides
		});
	};
	let inactiveRefPaths = [...new Set(warningSource.filter((warning) => warning.code === "SECRETS_REF_IGNORED_INACTIVE_SURFACE").map((warning) => warning.path))].filter(isInactivePath);
	if (hasOverrides) inactiveRefPaths = restoreInactiveWebCommandSecretTargets({
		sourceConfig,
		resolvedConfig,
		targetIds: params.targetIds,
		inactiveRefPaths,
		isInactivePath
	});
	const analyzeAssignments = () => analyzeCommandSecretAssignmentsFromSnapshot({
		sourceConfig,
		resolvedConfig,
		targetIds: params.targetIds,
		inactiveRefPaths: new Set(inactiveRefPaths),
		...params.allowedPaths ? { allowedPaths: params.allowedPaths } : {}
	});
	let analyzed = analyzeAssignments();
	if (hasOverrides) {
		const impliedInactivePaths = analyzed.unresolved.filter((entry) => pluginIdFromRuntimeWebPath(entry.path)).filter((entry) => !isProviderOverridePath({
			config: sourceConfig,
			path: entry.path,
			providerOverrides: params.providerOverrides
		})).map((entry) => entry.path);
		if (impliedInactivePaths.length > 0) {
			inactiveRefPaths = uniqueStrings([...inactiveRefPaths, ...impliedInactivePaths]);
			analyzed = analyzeAssignments();
		}
	}
	const optionalActiveUnresolvedPaths = analyzed.unresolved.filter((entry) => params.optionalActivePaths?.has(entry.path)).map((entry) => entry.path);
	if (optionalActiveUnresolvedPaths.length > 0) {
		inactiveRefPaths = uniqueStrings([...inactiveRefPaths, ...optionalActiveUnresolvedPaths]);
		analyzed = analyzeAssignments();
	}
	return {
		assignments: analyzed.assignments,
		diagnostics: analyzed.diagnostics,
		inactiveRefPaths
	};
}
//#endregion
//#region src/gateway/approval-web-push.ts
const WEB_PUSH_APPROVAL_TIMEOUT_MS = 1e4;
const WEB_PUSH_TERMINAL_TTL_SECONDS = 300;
function approvalNotificationCopy(params) {
	const label = params.preferences.label ? `${params.preferences.label} · ` : "";
	const agent = params.agentLabel ? ` for ${params.agentLabel}` : "";
	const privateCopy = params.preferences.detailLevel === "private";
	return {
		title: `${label}OpenClaw approval ${params.terminal ? "updated" : "requested"}`,
		body: params.terminal ? privateCopy ? "This approval is no longer pending." : `Approval${agent} is no longer pending.` : privateCopy ? "Open OpenClaw to review this request." : `Open OpenClaw to review an approval${agent}.`
	};
}
function approvalWebPushTag(approvalId) {
	return `openclaw-approval-${approvalId}`;
}
function approvalWebPushTopic(approvalId) {
	return createHash("sha256").update(`openclaw-approval:${approvalId}`).digest("base64url").slice(0, 32);
}
function sendApprovalNotificationGroups(params) {
	return Promise.all([...params.groups].map(({ copy, subscriptions }) => params.sender({
		subscriptions,
		payload: {
			...copy,
			renotify: false,
			tag: approvalWebPushTag(params.approvalId),
			url: resolveControlUiWebPushUrl(params.cfg, `approve/${encodeURIComponent(params.approvalId)}`)
		},
		deliveryOptions: {
			TTL: params.ttlSeconds,
			urgency: "high",
			timeout: WEB_PUSH_APPROVAL_TIMEOUT_MS,
			topic: approvalWebPushTopic(params.approvalId)
		}
	})));
}
async function deliverBoundApprovalWebPush(params) {
	if (params.record.resolvedAtMs !== void 0 || params.record.expiresAtMs <= Date.now()) return null;
	if (!await hasBoundWebPushSubscriptions(params.stateDir)) return null;
	const sendWebPushNotifications = await prepareWebPushNotificationSender(params.stateDir);
	const source = isRecord(params.record.request) ? params.record.request : void 0;
	const agentId = normalizeOptionalString(source?.agentId);
	const sessionKey = normalizeOptionalString(source?.sessionKey);
	const preparation = {
		...params,
		agentId,
		sessionKeys: sessionKey ? [sessionKey] : []
	};
	const eligibleTargets = (authority) => listCurrentWebPushTargets({
		...authority,
		requiredScopes: [APPROVALS_SCOPE, READ_SCOPE]
	}).filter((target) => {
		const { preferences } = target;
		const client = webPushTargetClient(target);
		return webPushCategoryEnabled(preferences, "approval-requested") && !isWebPushQuietHours(preferences) && webPushAgentAllowed(preferences, agentId) && isApprovalRecordVisibleToClient({
			record: params.record,
			client,
			cfg: authority.cfg,
			prepared: webPushSessionAccess(authority, client)
		});
	});
	const subscriptions = await withCurrentWebPushAuthority(preparation, (authority) => ({ start: () => eligibleTargets(authority).map((target) => target.subscription) }));
	if (!subscriptions?.length) return null;
	const preparedIds = new Set(await prepareWebPushApprovalDeliveries({
		approvalId: params.record.id,
		subscriptions,
		preparedAtMs: Date.now(),
		stateDir: params.stateDir
	}));
	if (preparedIds.size === 0) return null;
	const preparedById = new Map(subscriptions.filter((subscription) => preparedIds.has(subscription.subscriptionId)).map((subscription) => [subscription.subscriptionId, subscription]));
	const groupedResults = await withCurrentWebPushAuthority(preparation, (authority) => {
		const { cfg } = authority;
		const currentEligibleTargets = eligibleTargets({
			...authority,
			subscriptions: authority.subscriptions.filter((subscription) => {
				const prepared = preparedById.get(subscription.subscriptionId);
				return prepared?.deviceId === subscription.deviceId && prepared.userProfileId === subscription.userProfileId;
			})
		});
		const now = Date.now();
		if (currentEligibleTargets.length === 0 || params.record.resolvedAtMs !== void 0 || params.record.expiresAtMs <= now) return;
		const ttlSeconds = Math.ceil((params.record.expiresAtMs - now) / 1e3);
		const agentLabel = normalizeWebPushDisplayLabel(agentId);
		const requestGroups = /* @__PURE__ */ new Map();
		for (const { subscription, preferences } of currentEligibleTargets) {
			const copy = approvalNotificationCopy({
				terminal: false,
				preferences,
				agentLabel
			});
			const key = JSON.stringify(copy);
			const group = requestGroups.get(key) ?? {
				copy,
				subscriptions: []
			};
			group.subscriptions.push(subscription);
			requestGroups.set(key, group);
		}
		return { start: () => sendApprovalNotificationGroups({
			sender: sendWebPushNotifications,
			cfg,
			approvalId: params.record.id,
			ttlSeconds,
			groups: requestGroups.values()
		}) };
	});
	if (!groupedResults) return null;
	const results = groupedResults.flat();
	const definitelyRejectedSubscriptionIds = results.filter((result) => !result.ok && result.statusCode !== void 0).map((result) => result.subscriptionId);
	await deleteWebPushApprovalDeliveryTargets({
		approvalId: params.record.id,
		subscriptionIds: definitelyRejectedSubscriptionIds,
		stateDir: params.stateDir
	});
	return results.some((result) => result.ok || result.statusCode === void 0) ? {
		record: params.record,
		sender: sendWebPushNotifications
	} : null;
}
/** Retains successful request targets so terminal state replaces their tagged alert. */
function createApprovalWebPushDelivery(params) {
	const deliveriesByApprovalId = /* @__PURE__ */ new Map();
	const terminalDeliveriesByApprovalId = /* @__PURE__ */ new Map();
	const handleTerminal = (approval) => getOrCreatePromise(terminalDeliveriesByApprovalId, approval.id, async () => {
		const requestPush = deliveriesByApprovalId.get(approval.id);
		deliveriesByApprovalId.delete(approval.id);
		const requestDelivery = requestPush ? await requestPush : null;
		const sender = requestDelivery?.sender ?? await prepareWebPushNotificationSender(params.stateDir);
		const durableLookup = requestDelivery ? null : await getOperatorApprovalDetailed({
			id: approval.id,
			databaseOptions: params.stateDir ? { env: {
				...process.env,
				OPENCLAW_STATE_DIR: params.stateDir
			} } : void 0
		});
		const durableRecord = durableLookup?.outcome === "found" ? durableLookup.record : null;
		const subscriptions = await listWebPushApprovalDeliveryTargets({
			approvalId: approval.id,
			stateDir: params.stateDir
		});
		if (subscriptions.length === 0) return;
		const suppressedSubscriptionIds = [];
		const source = requestDelivery && isRecord(requestDelivery.record.request) ? requestDelivery.record.request : durableRecord?.source;
		const sessionKey = normalizeOptionalString(source?.sessionKey);
		const groupedResults = await withCurrentWebPushAuthority({
			...params,
			sessionKeys: sessionKey ? [sessionKey] : [],
			agentId: normalizeOptionalString(source?.agentId)
		}, (authority) => {
			const { cfg } = authority;
			const currentTargets = listCurrentWebPushTargets({
				...authority,
				requiredScopes: [APPROVALS_SCOPE, READ_SCOPE]
			});
			const currentTargetsBySubscriptionId = new Map(currentTargets.map((target) => [target.subscription.subscriptionId, target]));
			const terminalGroups = /* @__PURE__ */ new Map();
			for (const subscription of subscriptions) {
				const current = currentTargetsBySubscriptionId.get(subscription.subscriptionId);
				const target = current?.subscription.deviceId === subscription.deviceId && current.subscription.userProfileId === subscription.userProfileId ? current : void 0;
				const client = target ? webPushTargetClient(target) : null;
				const visible = requestDelivery ? Boolean(client && isApprovalRecordVisibleToClient({
					record: requestDelivery.record,
					client,
					cfg,
					prepared: webPushSessionAccess(authority, client)
				})) : Boolean(client && durableRecord && canAccessOperatorApproval({
					client,
					binding: { reviewerDeviceIds: durableRecord.reviewerDeviceIds }
				}) && canAccessApprovalSession({
					cfg,
					client,
					sessionKey: durableRecord.source.sessionKey,
					agentId: durableRecord.source.agentId,
					prepared: webPushSessionAccess(authority, client)
				}));
				if (!target || !visible) {
					suppressedSubscriptionIds.push(subscription.subscriptionId);
					continue;
				}
				const copy = approvalNotificationCopy({
					terminal: true,
					preferences: target.preferences
				});
				const key = JSON.stringify(copy);
				const group = terminalGroups.get(key) ?? {
					copy,
					subscriptions: []
				};
				group.subscriptions.push(target.subscription);
				terminalGroups.set(key, group);
			}
			return { start: () => sendApprovalNotificationGroups({
				sender,
				cfg,
				approvalId: approval.id,
				ttlSeconds: WEB_PUSH_TERMINAL_TTL_SECONDS,
				groups: terminalGroups.values()
			}) };
		});
		if (!groupedResults) return;
		const successfulSubscriptionIds = groupedResults.flat().filter((result) => result.ok).map((result) => result.subscriptionId);
		await deleteWebPushApprovalDeliveryTargets({
			approvalId: approval.id,
			subscriptionIds: [...successfulSubscriptionIds, ...suppressedSubscriptionIds],
			stateDir: params.stateDir
		});
		if (successfulSubscriptionIds.length + suppressedSubscriptionIds.length < subscriptions.length) params.log?.warn?.(`approval Web Push terminal replacement reached ${successfulSubscriptionIds.length}/${subscriptions.length - suppressedSubscriptionIds.length} eligible browsers approvalId=${approval.id}`);
	}, { evictOnSettled: true });
	return {
		/** Sends a request notification only when at least one browser has a durable binding. */
		handleRequested(record) {
			const requestPush = deliverBoundApprovalWebPush({
				record,
				getRuntimeConfig: params.getRuntimeConfig,
				stateDir: params.stateDir
			});
			deliveriesByApprovalId.set(record.id, requestPush);
			return requestPush.then((delivery) => {
				if (!delivery && deliveriesByApprovalId.get(record.id) === requestPush) deliveriesByApprovalId.delete(record.id);
				return Boolean(delivery);
			}, (error) => {
				if (deliveriesByApprovalId.get(record.id) === requestPush) deliveriesByApprovalId.delete(record.id);
				throw error;
			});
		},
		handleResolved: handleTerminal,
		handleExpired: handleTerminal,
		async recoverTerminalDeliveries() {
			let afterApprovalId;
			let throughApprovalId;
			do {
				const page = await listTerminalWebPushApprovalDeliveryIds({
					stateDir: params.stateDir,
					...afterApprovalId ? { afterApprovalId } : {},
					...throughApprovalId ? { throughApprovalId } : {}
				});
				throughApprovalId = page.throughApprovalId ?? void 0;
				for (const approvalId of page.approvalIds) await handleTerminal({ id: approvalId });
				afterApprovalId = page.nextAfterApprovalId ?? void 0;
			} while (afterApprovalId);
		}
	};
}
//#endregion
//#region src/gateway/exec-approval-ios-push.ts
const OPERATOR_ROLE = "operator";
function isIosPlatform(platform) {
	const normalized = normalizeOptionalLowercaseString(platform) ?? "";
	return normalized.startsWith("ios") || normalized.startsWith("ipados");
}
function approvalPushTransport(target, plan) {
	return target.registration.transport === "direct" ? {
		nodeId: target.nodeId,
		registration: target.registration,
		auth: plan.directAuth
	} : {
		nodeId: target.nodeId,
		registration: target.registration,
		relayConfig: plan.relayConfig
	};
}
async function resolvePairedTargets(isTargetVisible) {
	const deviceIds = (await listDevicePairing()).paired.filter((device) => {
		if (!isIosPlatform(device.platform) || !hasEffectivePairedDeviceRole(device, OPERATOR_ROLE)) return false;
		const operatorToken = device.tokens?.[OPERATOR_ROLE];
		if (!operatorToken || operatorToken.revokedAtMs || !roleScopesAllow({
			role: OPERATOR_ROLE,
			requestedScopes: ["operator.approvals", "operator.read"],
			allowedScopes: operatorToken.scopes
		})) return false;
		return isTargetVisible?.({
			deviceId: device.deviceId,
			scopes: operatorToken.scopes
		}) ?? true;
	}).map((device) => device.deviceId);
	return deviceIds.length > 0 ? await loadApnsRegistrations(deviceIds) : [];
}
async function resolveDeliveryPlan(params) {
	const { targets } = params;
	if (targets.length === 0) return { targets: [] };
	const needsDirect = targets.some((target) => target.registration.transport === "direct");
	const needsRelay = targets.some((target) => target.registration.transport === "relay");
	let directAuth;
	if (needsDirect) {
		const auth = await resolveApnsAuthConfigFromEnv(process.env);
		if (auth.ok) directAuth = auth.value;
		else params.log.warn?.(`${params.approvalKind} approvals: iOS direct APNs auth unavailable: ${auth.error}`);
	}
	const relayConfigByNodeId = /* @__PURE__ */ new Map();
	if (needsRelay) for (const target of targets) {
		if (target.registration.transport !== "relay") continue;
		const relay = resolveApnsRelayConfigFromEnv(process.env, readRuntimeConfig().gateway, { registrationRelayOrigin: target.registration.relayOrigin });
		if (relay.ok) relayConfigByNodeId.set(target.nodeId, relay.value);
		else params.log.warn?.(`${params.approvalKind} approvals: iOS relay APNs config unavailable: ${relay.error}`);
	}
	const relayConfig = relayConfigByNodeId.values().next().value;
	return {
		targets: targets.filter((target) => target.registration.transport === "direct" ? Boolean(directAuth) : relayConfigByNodeId.has(target.nodeId) && relayConfigByNodeId.get(target.nodeId)?.baseUrl === relayConfig?.baseUrl),
		directAuth,
		relayConfig
	};
}
async function sendApprovalPushes(params) {
	const gatewayDeviceId = (await loadOrCreateProcessDeviceIdentityAsync()).deviceId;
	const results = await Promise.allSettled(params.plan.targets.map(async (target) => {
		const result = await params.send({
			...approvalPushTransport(target, params.plan),
			approvalId: params.approvalId,
			gatewayDeviceId
		});
		if (shouldClearStoredApnsRegistration({
			registration: target.registration,
			result
		})) await clearApnsRegistrationIfCurrent(target);
		if (!result.ok) params.log.warn?.(`${params.approvalKind} approvals: iOS ${params.label} push failed node=${target.nodeId} status=${result.status} reason=${result.reason ?? "unknown"}`);
		return result.ok;
	}));
	for (const result of results) if (params.label === "request" && result.status === "rejected") {
		const message = formatErrorMessage(result.reason);
		params.log.warn?.(`${params.approvalKind} approvals: iOS ${params.label} push threw error: ${message}`);
	}
	return {
		attempted: params.plan.targets.length,
		delivered: results.filter((result) => result.status === "fulfilled" && result.value).length
	};
}
function createApprovalIosPushDelivery(params) {
	const approvalDeliveriesById = /* @__PURE__ */ new Map();
	const pendingDeliveryStateById = /* @__PURE__ */ new Map();
	const sendCleanupPushForApproval = async ({ id: approvalId }) => {
		const deliveryState = approvalDeliveriesById.get(approvalId) ?? await pendingDeliveryStateById.get(approvalId);
		approvalDeliveriesById.delete(approvalId);
		pendingDeliveryStateById.delete(approvalId);
		if (!deliveryState?.nodeIds.length) {
			params.log.debug?.(`${params.driver.approvalKind} approvals: iOS cleanup push skipped approvalId=${approvalId} reason=missing-targets`);
			return;
		}
		await deliveryState.requestPushPromise;
		const plan = await resolveDeliveryPlan({
			approvalKind: params.driver.approvalKind,
			targets: await loadApnsRegistrations(deliveryState.nodeIds),
			log: params.log
		});
		if (plan.targets.length === 0) return;
		await sendApprovalPushes({
			approvalId,
			plan,
			log: params.log,
			approvalKind: params.driver.approvalKind,
			label: "cleanup",
			send: params.driver.sendResolved
		});
	};
	return {
		/** Sends the initial approval notification to visible iOS operator devices. */
		async handleRequested(request, opts) {
			const deliveryStatePromise = (async () => {
				const plan = await resolveDeliveryPlan({
					approvalKind: params.driver.approvalKind,
					targets: await resolvePairedTargets(opts?.isTargetVisible),
					log: params.log
				});
				if (plan.targets.length === 0) {
					approvalDeliveriesById.delete(request.id);
					return null;
				}
				const deliveryState = {
					nodeIds: plan.targets.map((target) => target.nodeId),
					requestPushPromise: sendApprovalPushes({
						approvalId: request.id,
						plan,
						log: params.log,
						approvalKind: params.driver.approvalKind,
						label: "request",
						send: (push) => params.driver.sendRequested(request, push)
					}).catch((err) => {
						const message = formatErrorMessage(err);
						params.log.error?.(`${params.driver.approvalKind} approvals: iOS request push failed: ${message}`);
						return {
							attempted: plan.targets.length,
							delivered: 0
						};
					})
				};
				approvalDeliveriesById.set(request.id, deliveryState);
				return deliveryState;
			})();
			pendingDeliveryStateById.set(request.id, deliveryStatePromise);
			const deliveryState = await deliveryStatePromise;
			if (pendingDeliveryStateById.get(request.id) === deliveryStatePromise) pendingDeliveryStateById.delete(request.id);
			if (!deliveryState) return false;
			const { attempted, delivered } = await deliveryState.requestPushPromise;
			if (attempted > 0 && delivered === 0) {
				params.log.warn?.(`${params.driver.approvalKind} approvals: iOS request push reached no devices approvalId=${request.id} attempted=${attempted}`);
				if (approvalDeliveriesById.get(request.id)?.requestPushPromise === deliveryState.requestPushPromise) approvalDeliveriesById.delete(request.id);
				return false;
			}
			return true;
		},
		handleResolved: sendCleanupPushForApproval,
		handleExpired: sendCleanupPushForApproval
	};
}
function createExecApprovalIosPushDelivery(params) {
	return createApprovalIosPushDelivery({
		log: params.log,
		driver: {
			approvalKind: "exec",
			sendRequested: (_request, push) => sendApnsExecApprovalAlert(push),
			sendResolved: sendApnsExecApprovalResolvedWake
		}
	});
}
function createPluginApprovalIosPushDelivery(params) {
	return createApprovalIosPushDelivery({
		log: params.log,
		driver: {
			approvalKind: "plugin",
			sendRequested: (request, push) => sendApnsPluginApprovalAlert({
				...push,
				title: request.request.title,
				description: request.request.description
			}),
			sendResolved: sendApnsPluginApprovalResolvedWake
		}
	});
}
//#endregion
//#region src/gateway/exec-approval-authority.ts
var ApprovalMutationRefusedError = class extends Error {};
function isExecApprovalMutationRefused(error) {
	return collectNestedErrorCandidates(error).some((cause) => cause instanceof ApprovalMutationRefusedError) || isOperatorApprovalStoreRefusal(error);
}
/** A refused caller is not storage corruption and must not settle its pending waiter. */
function createExecApprovalMutationGuard(assertActive, assertBinding, caller) {
	return {
		family: caller.guard?.family ?? "worker",
		assertCurrent: () => {
			assertActive();
			try {
				caller.guard?.assertCurrent();
				caller.assertCurrent?.();
				assertBinding();
			} catch (error) {
				throw new ApprovalMutationRefusedError("approval resolver authority is no longer active", { cause: error });
			}
		}
	};
}
function isExecApprovalRuntimeActive(options, record) {
	const delegated = record.agentRuntimeDelegatedAuthority;
	if (delegated && options.validateAgentRuntimeDelegatedAuthority?.(delegated) !== true || record.approvalSignals?.some((signal) => signal.aborted)) return false;
	try {
		return record.approvalAuthority?.() !== false;
	} catch {
		return false;
	}
}
//#endregion
//#region src/gateway/exec-approval-expiry.ts
/** The existing pending entry owns its deadline and any definite-refusal retry. */
var ExecApprovalExpiry = class extends ExecApprovalLifecycle {
	/** Observes a registered decision; Gateway closure rejects the wait, not the approval. */
	awaitDecision(recordId) {
		this.assertNotRetired();
		this.scheduleAuthorityClosure(recordId);
		const snapshot = this.getLocalSnapshot(recordId);
		if (!snapshot) return null;
		if (snapshot.resolvedAtMs === void 0 && snapshot.expiresAtMs <= Date.now()) this.expireDue(recordId).catch((error) => {
			this.reportError(error, {
				approvalId: recordId,
				operation: "expire"
			});
		});
		const entry = this.pending.get(recordId);
		return entry ? this.observeEntry(entry, entry.promise) : null;
	}
	scheduleExpiry(entry, delayMs) {
		if (this.retired || entry.record.resolvedAtMs !== void 0 || this.pending.get(entry.record.id) !== entry) return;
		entry.expiryJob?.cancel();
		entry.expiryJob = this.scheduler.schedule({
			id: `approval:${this.runtimeEpoch}:${this.approvalKind}:${entry.record.id}:expiry`,
			...delayMs === void 0 ? { atMs: entry.record.expiresAtMs } : { delayMs },
			run: async () => {
				if (this.retired || this.pending.get(entry.record.id) !== entry) return;
				entry.expiryJob = null;
				await this.expireDue(entry.record.id).catch((error) => {
					this.reportError(error, {
						approvalId: entry.record.id,
						operation: "expire"
					});
				});
			}
		});
	}
	async expireDue(recordId, authority) {
		authority?.assertCurrent();
		if (this.retired) return false;
		const entry = this.pending.get(recordId);
		if (!entry || entry.record.resolvedAtMs !== void 0) return false;
		this.assertPendingPersistenceCurrent(entry);
		let persistence = entry.expiryPersistence;
		let result;
		try {
			persistence ??= captureExecApprovalMutationPersistence(this.options.persistence);
			entry.expiryPersistence = persistence;
			result = await this.forceDenyDetailed(recordId, "timeout", {
				kind: "system",
				id: null
			}, "expired", void 0, true, null, void 0, authority?.guard);
		} catch (error) {
			if (!persistence && !isExecApprovalMutationRefused(error)) this.settleLocalStorageFailure(recordId);
			if (persistence && (isSqliteWorkerError(error, "overloaded") || isSqliteWorkerError(error, "unavailable"))) {
				assertExecApprovalMutationPersistenceCurrent(persistence);
				this.assertPendingPersistenceCurrent(entry);
				entry.expiryRefusals = (entry.expiryRefusals ?? 0) + 1;
				this.scheduleExpiry(entry, computeBackoff({
					initialMs: 1e3,
					maxMs: 3e4,
					factor: 2,
					jitter: .1
				}, entry.expiryRefusals));
			}
			throw error;
		}
		authority?.assertCurrent();
		if (result.outcome === "not-due") {
			this.scheduleExpiry(entry);
			return false;
		}
		return result.outcome === "denied" || result.outcome === "expired";
	}
};
//#endregion
//#region src/gateway/exec-approval-manager.ts
/** Approval creation and persistence precede every local wait or delivery handoff. */
var ExecApprovalManager = class extends ExecApprovalExpiry {
	constructor(options) {
		super(options.scheduler);
		this.options = options;
	}
	get approvalKind() {
		return this.options.approvalKind ?? "exec";
	}
	get runtimeEpoch() {
		return this.options.persistence.runtimeEpoch;
	}
	create(request, timeoutMs, id) {
		this.assertNotRetired();
		return createExecApprovalRecord(request, timeoutMs, id);
	}
	/** Persist registration before exposing its separate decision promise to delivery. */
	async register(record, _timeoutMs) {
		this.assertNotRetired();
		return this.trackMutation(async () => {
			const requestSignal = getAsyncWorkSignal();
			const assertCurrent = () => {
				requestSignal?.throwIfAborted();
				this.assertNotRetired();
				if (!isExecApprovalRuntimeActive(this.options, record)) throw new Error("approval authority is no longer active");
			};
			assertCurrent();
			const persistence = this.options.persistence;
			const presentation = prepareExecApprovalPresentation(this.approvalKind, record.request, this.options.resolveAllowedDecisions?.(record.request));
			const existing = this.pending.get(record.id);
			if (existing) {
				if (existing.record.resolvedAtMs === void 0) return { decision: existing.promise };
				throw new Error(`approval id '${record.id}' already resolved`);
			}
			const approval = await prepareExecApprovalRegistration({
				record,
				kind: this.approvalKind,
				presentation,
				runtimeEpoch: persistence.runtimeEpoch,
				resolveAudienceSessionKeys: this.options.resolveAudienceSessionKeys
			});
			assertCurrent();
			const inserted = await insertOperatorApproval({
				approval,
				databaseOptions: persistence.databaseOptions,
				assertCurrent
			});
			if (inserted.outcome === "conflict") throw new Error(`approval id '${record.id}' conflicts with persisted state`);
			this.assertNotRetired();
			const raced = this.pending.get(record.id);
			if (raced) {
				if (raced.record.resolvedAtMs === void 0) return { decision: raced.promise };
				throw new Error(`approval id '${record.id}' already resolved`);
			}
			const promise = this.registerEntry(record);
			for (const signal of record.approvalSignals ?? []) {
				if (signal.aborted) {
					this.scheduleAuthorityClosure(record.id);
					continue;
				}
				signal.addEventListener("abort", () => {
					this.scheduleAuthorityClosure(record.id);
				}, { once: true });
			}
			if (inserted.outcome === "inserted") this.emitLifecycle({
				phase: "pending",
				record: inserted.record
			});
			if (!isExecApprovalRuntimeActive(this.options, record)) this.scheduleAuthorityClosure(record.id);
			return { decision: promise };
		});
	}
	scheduleAuthorityClosure(recordId) {
		this.forceDenyIfRuntimeAuthorityClosed(recordId).then((closed) => {
			if (closed?.outcome === "denied" && closed.liveRecord) this.options.onExpired?.(closed.record, closed.liveRecord);
		}).catch((error) => {
			this.reportError(error, {
				approvalId: recordId,
				operation: "expire"
			});
		});
	}
	/** Persist the first verdict, then release the process-local waiter. */
	async resolveDetailed(recordId, decision, resolver, localResolvedBy = null, localResolutionSource = "operator", options = {}) {
		if (this.retired) return { outcome: "not-found" };
		options.guard?.assertCurrent();
		options.assertCurrent?.();
		const capturedEntry = this.pending.get(recordId);
		const retainedPersistence = capturedEntry?.expiryPersistence;
		this.assertPendingPersistenceCurrent(capturedEntry);
		if (decision !== "deny" && capturedEntry && !isExecApprovalRuntimeActive(this.options, capturedEntry.record)) {
			const closed = await this.forceDenyIfRuntimeAuthorityClosed(recordId);
			if (closed) return projectClosedApprovalResolution(closed);
		}
		return this.trackMutation(async () => {
			if (this.retired) return { outcome: "not-found" };
			const nowMs = Date.now();
			const localEntry = capturedEntry;
			let persistence = this.options.persistence;
			if (localEntry?.record.terminalReason === "storage-corrupt") {
				const repaired = await this.persistStorageCorruptDeny(recordId, options.assertCurrent, options.guard);
				return projectRepairedApprovalResolution(repaired, decision);
			}
			if (decision !== "deny" && !localEntry) return { outcome: "not-found" };
			const { standingGrantSpec, standingGrant } = prepareExecApprovalStandingGrant({
				decision,
				record: localEntry?.record,
				options: this.options,
				grantExpiresAtMs: options.grantExpiresAtMs
			});
			let result;
			let committedResolutionKey;
			try {
				persistence = retainedPersistence ?? captureExecApprovalMutationPersistence(persistence);
				const guard = createExecApprovalMutationGuard(() => this.assertNotRetired(), () => {
					if (retainedPersistence) assertExecApprovalMutationPersistenceCurrent(retainedPersistence);
					this.assertPendingPersistenceCurrent(localEntry);
					if (this.pending.get(recordId) !== localEntry || localEntry && localEntry.record.expiresAtMs > nowMs && localEntry.record.expiresAtMs <= Date.now() || decision !== "deny" && (!localEntry || !isExecApprovalRuntimeActive(this.options, localEntry.record))) throw new ApprovalMutationRefusedError("approval authority is no longer active");
					if (standingGrantSpec && localEntry && (JSON.stringify(this.options.resolveStandingGrantMint?.(localEntry.record.request)) !== JSON.stringify(standingGrantSpec) || standingGrantSpec.kind === "mcp-tool" && localEntry.record.mcpToolApprovalActive?.() !== true)) throw new ApprovalMutationRefusedError("approval standing grant authority is no longer active");
				}, options);
				if (retainedPersistence) guard.assertCurrent();
				result = await runWithExecApprovalMutationPersistence(persistence, () => resolveOperatorApproval({
					id: recordId,
					nowMs,
					decision,
					resolver,
					expectedKind: this.approvalKind,
					runtimeEpoch: persistence.runtimeEpoch,
					databaseOptions: persistence.databaseOptions,
					onCommitted: (key) => {
						committedResolutionKey = key;
					},
					guard,
					...standingGrant?.kind === "cron" ? { standingGrant } : {},
					...standingGrant?.kind === "mcp-tool" ? { mcpToolGrant: standingGrant } : {}
				}));
			} catch (error) {
				if (!await this.recoverUnknownVerdict(error, localEntry?.record, persistence, localResolutionSource, committedResolutionKey) && !isExecApprovalMutationRefused(error) && !this.retired && this.pending.get(recordId) === localEntry && (!localEntry || isExecApprovalRuntimeActive(this.options, localEntry.record) && localEntry.record.expiresAtMs > Date.now())) this.settleLocalStorageFailure(recordId);
				throw error;
			}
			if (this.pending.get(recordId) !== localEntry) return result;
			this.assertPendingPersistenceCurrent(localEntry);
			if (result.outcome === "resolved" && standingGrant?.kind === "placement" && localEntry && isExecApprovalRuntimeActive(this.options, localEntry.record)) {
				await (this.options.retainPlacementStandingGrantAsync ?? this.options.retainPlacementStandingGrant)?.({
					...standingGrant,
					approvalId: recordId,
					nowMs: result.record.resolvedAtMs ?? Date.now()
				});
				this.assertPendingPersistenceCurrent(localEntry);
			}
			if (result.outcome === "resolved" || result.outcome === "expired" || result.outcome === "already-resolved") this.settleLocalFromStore(result.record, void 0, localResolvedBy, result.outcome === "resolved" ? localResolutionSource : void 0);
			else if (result.outcome === "not-found" || result.outcome === "corrupt") this.settleLocalStorageFailure(recordId);
			return "record" in result && localEntry ? {
				...result,
				liveRecord: localEntry.record
			} : result;
		}, recordId);
	}
	/** Persist a fail-closed terminal state, then release the local waiter. */
	async forceDenyDetailed(recordId, reason, resolver, status = "denied", localDecision, requireDue = false, localResolvedBy = null, assertResolverCurrent, callerGuard) {
		if (this.retired) return { outcome: "not-found" };
		callerGuard?.assertCurrent();
		assertResolverCurrent?.();
		const capturedEntry = this.pending.get(recordId);
		const retainedPersistence = capturedEntry?.expiryPersistence;
		const capturedRecord = capturedEntry?.record;
		if (!this.retired && status === "cancelled" && capturedRecord) capturedRecord.approvalAuthority = () => false;
		this.assertPendingPersistenceCurrent(capturedEntry);
		return this.trackMutation(async () => {
			if (this.retired) return { outcome: "not-found" };
			let persistence = this.options.persistence;
			const localRecord = capturedRecord;
			if (localRecord?.terminalReason === "storage-corrupt") return this.persistStorageCorruptDeny(recordId, assertResolverCurrent, callerGuard);
			let result;
			try {
				persistence = retainedPersistence ?? captureExecApprovalMutationPersistence(persistence);
				const guard = createExecApprovalMutationGuard(() => this.assertNotRetired(), () => {
					if (retainedPersistence) assertExecApprovalMutationPersistenceCurrent(retainedPersistence);
					this.assertPendingPersistenceCurrent(capturedEntry);
					if (this.pending.get(recordId) !== capturedEntry) throw new Error("approval binding changed before cancellation");
				}, {
					guard: callerGuard,
					assertCurrent: assertResolverCurrent
				});
				if (retainedPersistence) guard.assertCurrent();
				const deny = () => forceDenyOperatorApproval({
					id: recordId,
					status,
					requireDue,
					reason,
					resolver,
					expectedKind: this.approvalKind,
					runtimeEpoch: persistence.runtimeEpoch,
					databaseOptions: persistence.databaseOptions,
					guard
				});
				result = await runWithExecApprovalMutationPersistence(persistence, deny);
			} catch (error) {
				if (!await this.recoverUnknownVerdict(error, localRecord, persistence) && !isExecApprovalMutationRefused(error) && !this.retired && this.pending.get(recordId)?.record === localRecord) this.settleLocalStorageFailure(recordId);
				throw error;
			}
			if (this.pending.get(recordId)?.record !== localRecord) return result;
			this.assertPendingPersistenceCurrent(capturedEntry);
			if (result.outcome === "denied") this.settleLocalFromStore(result.record, localDecision, localResolvedBy);
			else if (result.outcome === "expired" || result.outcome === "already-terminal") this.settleLocalFromStore(result.record, void 0, localResolvedBy);
			else if (result.outcome === "not-found" || result.outcome === "corrupt") this.settleLocalStorageFailure(recordId);
			return "record" in result && localRecord ? {
				...result,
				liveRecord: localRecord
			} : result;
		}, recordId);
	}
	async recoverUnknownVerdict(error, localRecord, persistence, source = "operator", committedResolutionKey) {
		if (isOperatorApprovalStoreOutcomeUnknown(error)) this.retainUncertainVerdict(localRecord, {
			assertCurrent: () => assertExecApprovalMutationPersistenceCurrent(persistence),
			...source === "auto-review" ? { autoReview: { committedResolutionKey } } : {}
		});
		const record = await readUncertainExecApprovalVerdict(error, localRecord && this.pending.get(localRecord.id)?.record === localRecord ? localRecord : void 0, this.approvalKind, persistence);
		if (record && this.pending.get(record.id)?.record === localRecord) {
			assertUncertainExecApprovalPersistenceCurrent(error, persistence);
			if (record.status === "pending" && localRecord) this.clearUncommittedVerdict(localRecord);
			else this.settleLocalFromStore(record, void 0, record.resolver?.id ?? null);
		}
		return record !== void 0;
	}
	/** Reconciles durable truth with an existing waiter without rehydrating its request. */
	async reconcileDurableLookup(initialLookup, localResolvedBy = null, authority) {
		if (this.retired) return null;
		let lookup = initialLookup;
		const recordId = lookup.outcome === "found" ? lookup.record.id : lookup.id;
		authority?.assertCurrent();
		const waited = await this.waitForMutations(recordId);
		authority?.assertCurrent();
		if (waited) {
			const refreshed = await getOperatorApprovalDetailed({
				id: recordId,
				nowMs: Date.now(),
				databaseOptions: this.options.persistence.databaseOptions,
				guard: authority?.guard
			});
			authority?.assertCurrent();
			lookup = refreshed.outcome === "found" ? refreshed : {
				outcome: refreshed.outcome === "corrupt" ? "corrupt" : "missing",
				id: recordId
			};
		}
		if (this.retired) return null;
		const entry = this.pending.get(recordId);
		if (lookup.outcome !== "found") {
			if (entry) this.settleLocalStorageFailure(recordId);
			return null;
		}
		if (!entry || lookup.record.kind !== this.approvalKind || lookup.record.runtimeEpoch !== this.options.persistence.runtimeEpoch) return lookup.record;
		if (lookup.record.status === "pending" && entry.record.terminalReason === "storage-corrupt") {
			const repaired = await this.trackMutation(() => {
				authority?.assertCurrent();
				return this.persistStorageCorruptDeny(recordId, void 0, authority?.guard);
			}, recordId);
			return "record" in repaired ? repaired.record : null;
		}
		if (lookup.record.status !== "pending") this.settleLocalFromStore(lookup.record, void 0, localResolvedBy);
		return lookup.record;
	}
	async persistStorageCorruptDeny(recordId, assertCurrent, callerGuard) {
		callerGuard?.assertCurrent();
		assertCurrent?.();
		const localEntry = this.pending.get(recordId);
		if (!localEntry) return { outcome: "not-found" };
		const result = await forceDenyOperatorApproval({
			id: recordId,
			status: "denied",
			reason: "storage-corrupt",
			resolver: {
				kind: "system",
				id: "storage-error"
			},
			expectedKind: this.approvalKind,
			runtimeEpoch: this.runtimeEpoch,
			databaseOptions: this.options.persistence.databaseOptions,
			guard: createExecApprovalMutationGuard(() => this.assertNotRetired(), () => {
				if (this.pending.get(recordId) !== localEntry) throw new Error("approval binding changed before repair");
			}, {
				guard: callerGuard,
				assertCurrent
			})
		});
		if (result.outcome === "denied" || result.outcome === "expired") this.emitLifecycle({
			phase: "terminal",
			record: result.record
		});
		return "record" in result ? {
			...result,
			liveRecord: localEntry.record
		} : result;
	}
	async resolve(recordId, decision, resolvedBy, options = {}) {
		return (await this.resolveDetailed(recordId, decision, {
			kind: "runtime",
			id: resolvedBy ?? null
		}, resolvedBy ?? null, "operator", options)).outcome === "resolved";
	}
	/**
	* Trusted auto-review resolution (identity-matched approval runtime).
	* Always allow-once; system.run replay validation treats the resulting
	* record more strictly than an operator decision (see #103515).
	*/
	async resolveAutoReview(recordId, resolvedBy, assertCurrent, guard) {
		return (await this.resolveDetailed(recordId, "allow-once", {
			kind: "runtime",
			id: resolvedBy ?? null
		}, resolvedBy ?? null, "auto-review", {
			assertCurrent,
			guard
		})).outcome === "resolved";
	}
	async expire(recordId, resolvedBy) {
		const noRoute = resolvedBy === "no-approval-route";
		return (await this.forceDenyDetailed(recordId, noRoute ? "no-route" : "timeout", {
			kind: "system",
			id: resolvedBy ?? null
		}, noRoute ? "denied" : "expired", noRoute ? null : void 0, false, resolvedBy ?? null)).outcome === "denied";
	}
	async consumeAllowOnce(recordId, consumerId = recordId) {
		const entry = this.pending.get(recordId);
		if (!this.canUseRetainedBinding() || !entry) return false;
		if (!isExecApprovalRuntimeActive(this.options, entry.record)) {
			await this.forceDenyIfRuntimeAuthorityClosed(recordId);
			return false;
		}
		return this.trackMutation(async () => {
			const nowMs = Date.now();
			const graceAnchorMs = this.resolvedGraceAnchorMs(entry, nowMs);
			const redemptionWindowMs = prepareExecApprovalRedemptionWindow(entry.record, graceAnchorMs, nowMs);
			if (redemptionWindowMs === null) return false;
			const persistence = this.options.persistence;
			const result = await consumeOperatorApprovalAllowOnce({
				id: recordId,
				nowMs,
				consumerId,
				expectedKind: this.approvalKind,
				runtimeEpoch: persistence.runtimeEpoch,
				redemptionWindowMs,
				databaseOptions: persistence.databaseOptions,
				assertCurrent: () => {
					const currentNowMs = Date.now();
					const currentGraceAnchorMs = this.resolvedGraceAnchorMs(entry, currentNowMs);
					if (!this.canUseRetainedBinding() || this.pending.get(recordId) !== entry || !isExecApprovalRuntimeActive(this.options, entry.record) || currentGraceAnchorMs === null || currentNowMs - currentGraceAnchorMs >= 15e3) throw new ApprovalMutationRefusedError("approval authority is no longer active");
				}
			}).catch((error) => {
				if (error instanceof ApprovalMutationRefusedError) return null;
				throw error;
			});
			if (!result || result.outcome !== "consumed" || this.pending.get(recordId) !== entry) return false;
			entry.record.consumedDecision = "allow-once";
			entry.record.consumedAtMs = result.record.consumedAtMs;
			entry.record.consumedBy = result.record.consumedBy;
			return isExecApprovalRuntimeActive(this.options, entry.record);
		}, recordId);
	}
	/** Delivery eligibility stays with the exact pending record across adapter awaits. */
	isPendingDeliveryCurrent(record) {
		if (this.retired || this.pending.get(record.id)?.record !== record || record.resolvedAtMs !== void 0 || record.expiresAtMs <= Date.now()) return false;
		if (isExecApprovalRuntimeActive(this.options, record)) return true;
		this.scheduleAuthorityClosure(record.id);
		return false;
	}
	/** Projects an allowed decision only while its exact runtime authority is live. */
	projectDecisionIfActive(recordId, decision) {
		if (decision !== "allow-once" && decision !== "allow-always") return decision;
		const record = this.pending.get(recordId)?.record;
		if (!this.canUseRetainedBinding() || !record) return null;
		if (isExecApprovalRuntimeActive(this.options, record)) return decision;
		this.scheduleAuthorityClosure(recordId);
		return null;
	}
	/** Atomically closes a live approval whose exact runtime owner is gone. */
	async forceDenyIfRuntimeAuthorityClosed(recordId) {
		const record = this.pending.get(recordId)?.record;
		if (!record || isExecApprovalRuntimeActive(this.options, record)) return null;
		return this.forceDenyDetailed(recordId, "run-aborted", {
			kind: "system",
			id: null
		}, "cancelled");
	}
};
//#endregion
//#region src/gateway/lazy-handler.ts
function createLazyHandler(method, loadHandlers) {
	return async (opts) => {
		const handler = (await loadHandlers())[method];
		if (!handler) throw new Error(`lazy gateway handler not found: ${method}`);
		await handler(opts);
	};
}
//#endregion
//#region src/gateway/operator-approval-placement-grants.ts
const PLACEMENT_GRANT_TTL_MS = 2592e6;
function validResolutionInput(input) {
	return [
		input.pluginId,
		input.command,
		input.approvalScope,
		input.agentId,
		input.sessionKey,
		input.nodeId,
		input.pairingGeneration
	].every((value) => value.trim());
}
function resolveBinding(input, rows) {
	if (rows.length !== 1) return null;
	const row = rows[0];
	fromRow(row);
	const attached = safeParseJson(row.attached_session_ids_json ?? "null");
	if (row.agent_id !== input.agentId || row.session_key !== input.sessionKey || row.state !== "active" || row.execution_mode !== "remote-exec" || !row.environment_id || !row.active_owner_epoch || !row.remote_workspace_dir || row.environment_state !== "attached" || row.node_device_id !== input.nodeId || row.owner_epoch !== row.active_owner_epoch || !Array.isArray(attached) || attached.length !== 1 || attached[0] !== row.session_id) return null;
	return {
		pluginId: input.pluginId,
		command: input.command,
		approvalScope: input.approvalScope,
		agentId: input.agentId,
		sessionKey: input.sessionKey,
		nodeId: input.nodeId,
		pairingGeneration: input.pairingGeneration,
		sessionId: row.session_id,
		environmentId: row.environment_id,
		ownerEpoch: row.active_owner_epoch,
		placementGeneration: row.transition_generation,
		cwd: row.remote_workspace_dir
	};
}
function placementGrantKey(binding) {
	return JSON.stringify([
		binding.pluginId,
		binding.command,
		binding.approvalScope,
		binding.agentId,
		binding.sessionId
	]);
}
function matchesGrantOperation(candidate, input) {
	return candidate.pluginId === input.pluginId && candidate.command === input.command && candidate.approvalScope === input.approvalScope && candidate.agentId === input.agentId && candidate.sessionKey === input.sessionKey;
}
function samePlacement(left, right) {
	return left.sessionKey === right.sessionKey && left.sessionId === right.sessionId && left.environmentId === right.environmentId && left.ownerEpoch === right.ownerEpoch && left.placementGeneration === right.placementGeneration && left.cwd === right.cwd;
}
function prepareRetainedGrant(input) {
	const expiresAtMs = Math.min(input.expiresAtMs ?? Infinity, input.nowMs + PLACEMENT_GRANT_TTL_MS);
	if (expiresAtMs <= input.nowMs) return null;
	const { approvalId, nowMs: _nowMs, expiresAtMs: _expiresAtMs, ...binding } = input;
	return {
		...binding,
		mintedByApprovalId: approvalId,
		expiresAtMs
	};
}
function createPlacementStandingGrantRuntime(params) {
	const grants = /* @__PURE__ */ new Map();
	const now = params.now ?? Date.now;
	const databasePath = resolveDatabasePath(params.databaseOptions);
	const validatedReceipts = /* @__PURE__ */ new WeakMap();
	const readAsync = (input) => readPlacementStandingGrant(input, { databaseOptions: params.databaseOptions });
	const checkLocal = (binding) => {
		const key = placementGrantKey(binding);
		const grant = grants.get(key);
		if (!grant) return { outcome: "no-grant" };
		const outcome = grant.expiresAtMs <= now() ? "expired" : grant.nodeId !== binding.nodeId ? "node-changed" : grant.pairingGeneration !== binding.pairingGeneration ? "pairing-changed" : void 0;
		if (outcome) {
			grants.delete(key);
			return { outcome };
		}
		return {
			outcome: "consumed",
			grant
		};
	};
	const checkRows = (binding, grant, rows, invalidate = true) => {
		const current = resolveBinding(binding, rows);
		const row = rows[0];
		const outcome = !current || !samePlacement(current, binding) || !samePlacement(grant, binding) ? row ? "placement-changed" : "placement-missing" : !row?.approval_id ? "approval-missing" : row.runtime_epoch !== params.runtimeEpoch || row.approval_status !== "allowed" || row.decision !== "allow-always" ? "approval-not-allow-always" : void 0;
		if (outcome) {
			if (invalidate) grants.delete(placementGrantKey(binding));
			return { outcome };
		}
		return {
			outcome: "consumed",
			grant
		};
	};
	const consume = (binding) => {
		const result = checkLocal(binding);
		if (result.outcome !== "consumed") return result;
		if (!samePlacement(result.grant, binding)) return { outcome: "placement-changed" };
		const receipt = validatedReceipts.get(result.grant);
		return receipt && receipt === readSqliteDatabaseWriteTokenForPath(databasePath) ? result : { outcome: "no-grant" };
	};
	const validateAsync = async (input) => {
		const binding = { ...input };
		const before = checkLocal(binding);
		if (before.outcome !== "consumed") return before;
		const receipt = readSqliteDatabaseWriteTokenForPath(databasePath);
		const rows = await readAsync({
			...binding,
			approvalId: before.grant.mintedByApprovalId
		});
		const current = checkLocal(binding);
		if (current.outcome !== "consumed") return current;
		if (current.grant !== before.grant) return { outcome: "no-grant" };
		const result = checkRows(binding, current.grant, rows);
		if (result.outcome === "consumed" && receipt) validatedReceipts.set(result.grant, receipt);
		return result;
	};
	const retain = (grant, rows) => {
		if (checkRows(grant, grant, rows, false).outcome !== "consumed") return false;
		grants.set(placementGrantKey(grant), grant);
		return true;
	};
	return {
		resolveBinding: () => {
			throw new Error("Placement grant resolveBinding is asynchronous; use resolveBindingAsync.");
		},
		resolveBindingAsync: async (input) => {
			const captured = { ...input };
			return validResolutionInput(captured) ? resolveBinding(captured, await readAsync(captured)) : null;
		},
		resolveAsync: async (value) => {
			const input = { ...value };
			if (!validResolutionInput(input)) return { binding: null };
			const candidates = new Map([...grants.values()].filter((candidate) => matchesGrantOperation(candidate, input)).map((grant) => [grant.sessionId, grant]));
			const rows = await readAsync({
				...input,
				approvalIdsBySessionId: Object.fromEntries([...candidates].map(([sessionId, grant]) => [sessionId, grant.mintedByApprovalId]))
			});
			const binding = resolveBinding(input, rows);
			const grant = binding ? candidates.get(binding.sessionId) : void 0;
			if (!binding || !grant) return { binding };
			const local = checkLocal(binding);
			return {
				binding,
				...local.outcome === "consumed" && local.grant === grant && checkRows(binding, grant, rows).outcome === "consumed" ? { approvalId: grant.mintedByApprovalId } : {}
			};
		},
		retain: () => {
			throw new Error("Placement grant retain is asynchronous; use retainAsync.");
		},
		retainAsync: async (input) => {
			const grant = prepareRetainedGrant(input);
			if (!grant) return false;
			try {
				return retain(grant, await readAsync({
					...grant,
					approvalId: grant.mintedByApprovalId
				}));
			} catch {
				return false;
			}
		},
		validate: () => {
			throw new Error("Placement grant validate is asynchronous; use validateAsync.");
		},
		validateAsync,
		consumeAsync: validateAsync,
		consume
	};
}
//#endregion
//#region src/gateway/server-methods/approval-run-cancellation.ts
function cancelMatchingApprovals(params) {
	const operations = params.manager.listLocalPendingRecords().filter(params.matches).map((pending) => {
		const resolverId = params.reason && params.reason !== "run-aborted" ? params.reason : null;
		return params.manager.forceDenyDetailed(pending.id, "run-aborted", {
			kind: "system",
			id: resolverId
		}, "cancelled", void 0, false, resolverId).then((result) => {
			if (result.outcome === "denied" && result.liveRecord) {
				params.publish(result.record, result.liveRecord);
				return 1;
			}
			return 0;
		});
	});
	return Promise.all(operations).then((counts) => counts.reduce((sum, count) => sum + count, 0));
}
function cancelAgentRuntimeBoundApprovals(params) {
	return cancelMatchingApprovals({
		...params,
		matches: (pending) => {
			const bound = pending.agentRuntimeDelegatedAuthority;
			return bound?.claimId === params.authority.claimId && bound.lifecycleGeneration === params.authority.lifecycleGeneration && bound.operationalRunInstance.instanceId === params.authority.operationalRunInstance.instanceId && bound.operationalRunInstance.runId === params.authority.operationalRunInstance.runId;
		}
	});
}
/** Settles approvals whose authoritative worker turn claim has been fenced. */
function cancelWorkerTurnClaimBoundApprovals(params) {
	return cancelMatchingApprovals({
		...params,
		matches: (pending) => {
			const authority = pending.agentRuntimeDelegatedAuthority;
			return authority?.kind === "worker" && params.claim.owner.kind === "worker" && sameWorkerSessionTurnClaim(authority.turnClaim, params.claim);
		}
	});
}
/** Preserves legacy run-id abort cleanup only for records without delegated authority. */
function cancelUnboundRunApprovals(params) {
	return cancelMatchingApprovals({
		...params,
		matches: (pending) => !pending.agentRuntimeDelegatedAuthority && pending.request.runId === params.runId
	});
}
//#endregion
//#region src/gateway/server-secrets-reload.ts
/** Keeps snapshot CAS, generation ownership, and exact account recovery in one transaction. */
function createGatewaySecretsReloader(params) {
	const buildReloadPlan = params.buildReloadPlan ?? buildGatewayReloadPlan;
	const manager = params.channelManager;
	const capturePublication = (generationOwnership) => {
		const publishedSnapshotRevision = getActiveSecretsRuntimeSnapshotRevisionState();
		const runtimeConfig = getRuntimeConfigSnapshot();
		if (!runtimeConfig) throw new Error("Secrets runtime activation did not publish config.");
		const isCurrent = () => getActiveSecretsRuntimeSnapshotRevisionState() === publishedSnapshotRevision && getRuntimeConfigSnapshot() === runtimeConfig && params.sharedGatewaySessionGenerationState.owns(generationOwnership);
		const modelPublication = refreshModelRuntimeAfterHotReload({
			config: runtimeConfig,
			agentIds: void 0,
			pluginMetadataSnapshot: void 0,
			isPublicationCurrent: isCurrent
		});
		modelPublication.catch(() => void 0);
		return {
			publishedSnapshotRevision,
			generationOwnership,
			modelPublication,
			isCurrent
		};
	};
	let reloadInFlight = null;
	const runExclusiveReload = (fn, options = {}) => {
		if (reloadInFlight) return options.joinInFlight === false ? reloadInFlight.catch(() => void 0).then(() => runExclusiveReload(fn, options)) : reloadInFlight;
		const run = (async () => {
			try {
				return await fn();
			} finally {
				reloadInFlight = null;
			}
		})();
		reloadInFlight = run;
		return run;
	};
	return (reloadOptions) => runExclusiveReload(async () => {
		let transaction;
		const touchedTargets = [];
		const startTarget = ({ channel, accountId }) => accountId ? manager.startChannel(channel, accountId, {
			reason: "secrets-reload",
			preserveManualStop: true
		}) : manager.startChannel(channel, void 0, { reason: "secrets-reload" });
		const stopTarget = ({ channel, accountId }) => accountId ? manager.stopChannel(channel, accountId, { manual: false }) : manager.stopChannel(channel);
		const assertGenerationOwned = () => {
			if (!transaction?.isCurrent()) throw new Error("secrets.reload was superseded by a newer config write");
		};
		try {
			for (;;) {
				const previousSnapshot = getActiveSecretsRuntimeSnapshotState();
				if (!previousSnapshot) throw new Error("Secrets runtime snapshot is not active.");
				const previousRevision = getActiveSecretsRuntimeSnapshotRevisionState();
				const previousRuntimeSourceConfig = getRuntimeConfigSourceSnapshot() ?? void 0;
				const previousOwnership = params.sharedGatewaySessionGenerationState.capture();
				const previousGeneration = previousOwnership.generation;
				const previousRequiredGeneration = params.sharedGatewaySessionGenerationState.required;
				const prepared = await params.activateRuntimeSecrets(previousSnapshot.sourceConfig, {
					reason: "reload",
					activate: false,
					publishFailureAsDegraded: true,
					forceColdRefKeys: reloadOptions?.forceColdRefKeys,
					canPublishFailureAsDegraded: () => getActiveSecretsRuntimeSnapshotRevisionState() === previousRevision
				});
				const plan = buildReloadPlan(diffConfigPaths(previousSnapshot.config, prepared.config));
				const nextGeneration = params.resolveSharedGatewaySessionGenerationForConfig(prepared.config);
				const credentialOwners = listActiveCredentialDegradedOwners();
				const claimGeneration = () => {
					const generationOwnership = params.sharedGatewaySessionGenerationState.claim(previousOwnership, nextGeneration);
					if (!generationOwnership) throw new Error("Secrets runtime activation did not publish ownership.");
					if (previousGeneration !== nextGeneration) disconnectStaleSharedGatewayAuthClients({
						state: params.sharedGatewaySessionGenerationState,
						clients: params.clients,
						expectedGeneration: nextGeneration,
						revokeSource: false
					});
					transaction = {
						...capturePublication(generationOwnership),
						previousSnapshot,
						previousRuntimeSourceConfig,
						previousGeneration,
						previousRequiredGeneration,
						prepared,
						plan,
						credentialOwners,
						generationChanged: previousGeneration !== nextGeneration
					};
				};
				const ownsPreviousGeneration = () => params.sharedGatewaySessionGenerationState.owns(previousOwnership);
				if (!await params.activateRuntimeSecrets.activatePreparedSnapshotIfCurrent(prepared, previousRevision, {
					reason: "reload",
					activate: true,
					runtimeSourceConfig: previousRuntimeSourceConfig
				}, claimGeneration, ownsPreviousGeneration)) continue;
				if (!transaction) throw new Error("Secrets runtime activation did not publish ownership.");
				assertGenerationOwned();
				break;
			}
			const { prepared, plan, credentialOwners, generationOwnership, isCurrent } = transaction;
			await transaction.modelPublication;
			assertGenerationOwned();
			const targets = [...plan.restartChannels].map((channel) => ({ channel }));
			const accountTargets = /* @__PURE__ */ new Map();
			for (const [channel, accountIds] of plan.restartChannelAccounts ?? []) {
				if (plan.restartChannels.has(channel)) continue;
				for (const accountId of accountIds) {
					const target = {
						channel,
						accountId
					};
					accountTargets.set(`${channel}\0${accountId}`, target);
					targets.push(target);
				}
			}
			for (const owner of credentialOwners) {
				if (owner.ownerKind !== "account") continue;
				const separator = owner.ownerId.indexOf(":");
				if (separator < 0) continue;
				const channel = owner.ownerId.slice(0, separator);
				if (plan.restartChannels.has(channel)) continue;
				const accountId = manager.resolveRuntimeAccountId(channel, owner.ownerId.slice(separator + 1));
				if (!accountId || manager.isManuallyStopped(channel, accountId)) continue;
				const key = `${channel}\0${accountId}`;
				const existing = accountTargets.get(key);
				if (existing) {
					existing.credentialOwnerId = owner.ownerId;
					continue;
				}
				const target = {
					channel,
					accountId,
					credentialOwnerId: owner.ownerId,
					inspectOnly: true
				};
				accountTargets.set(key, target);
				targets.push(target);
			}
			const restartTargets = targets.filter(({ channel, accountId }) => !accountId || !manager.isManuallyStopped(channel, accountId));
			if (restartTargets.length > 0) {
				const restartChannels = [...new Set(restartTargets.map(({ channel }) => channel))];
				if (isChannelStartupSuppressedByEnvironment()) throw new Error(`secrets.reload requires restarting channels: ${restartChannels.join(", ")}`);
				if (params.getChannelAutostartSuppression?.()) throw new Error(`secrets.reload requires restarting channels but channel autostart is suppressed by crash-loop breaker: ${restartChannels.join(", ")}`);
				const failures = [];
				for (const target of restartTargets) {
					const { channel, accountId, credentialOwnerId, inspectOnly } = target;
					const label = accountId ? `${channel} account ${accountId}` : `${channel} channel`;
					assertGenerationOwned();
					params.logChannels.info(`${inspectOnly ? "reinspecting" : "restarting"} ${label} after secrets reload`);
					const touched = {
						target,
						restarted: false
					};
					touchedTargets.push(touched);
					try {
						if (!inspectOnly) {
							await stopTarget(target);
							assertGenerationOwned();
						}
						await startTarget(target);
						touched.restarted = true;
						assertGenerationOwned();
					} catch (error) {
						if (credentialOwnerId && isTrustedSecretSurfaceUnavailableError(error) && error.ownerKind === "account" && error.ownerId === credentialOwnerId && listActiveCredentialDegradedOwners().some((owner) => owner.ownerKind === "account" && owner.ownerId === credentialOwnerId)) {
							touchedTargets.pop();
							continue;
						}
						params.logChannels.info(`failed to restart ${label} after secrets reload`);
						failures.push(accountId ? `${channel}:${accountId}` : channel);
					}
				}
				if (failures.length > 0) throw new Error(`failed to restart channels after secrets reload: ${failures.join(", ")}`);
			}
			if (!isCurrent() || !params.sharedGatewaySessionGenerationState.finalize(generationOwnership, {
				previous: transaction.previousSnapshot.config,
				next: prepared.config
			})) throw new Error("secrets.reload was superseded by a newer config write");
			return { warningCount: prepared.warnings.length };
		} catch (error) {
			if (transaction) {
				const failedTransaction = transaction;
				let restoration;
				try {
					await params.activateRuntimeSecrets.restoreSnapshotIfCurrent(failedTransaction.previousSnapshot, failedTransaction.publishedSnapshotRevision, failedTransaction.prepared, {
						onActivated: () => {
							if (params.sharedGatewaySessionGenerationState.replace(failedTransaction.generationOwnership, {
								current: failedTransaction.previousGeneration,
								required: failedTransaction.previousRequiredGeneration
							}) && failedTransaction.generationChanged) disconnectStaleSharedGatewayAuthClients({
								state: params.sharedGatewaySessionGenerationState,
								clients: params.clients,
								expectedGeneration: failedTransaction.previousGeneration,
								transition: {
									previous: failedTransaction.prepared.config,
									next: failedTransaction.previousSnapshot.config
								}
							});
							restoration = capturePublication(params.sharedGatewaySessionGenerationState.capture());
						},
						runtimeSourceConfig: failedTransaction.previousRuntimeSourceConfig
					});
					await restoration?.modelPublication;
				} catch {
					params.logChannels.info("failed to restore model runtime after secrets reload");
				}
			}
			for (const { target, restarted } of touchedTargets) {
				const { channel, accountId, inspectOnly } = target;
				const label = accountId ? `${channel} account ${accountId}` : `${channel} channel`;
				params.logChannels.info(`rolling back ${label} after secrets reload failure`);
				try {
					if (restarted || inspectOnly) await stopTarget(target);
					if (!inspectOnly) await startTarget(target);
				} catch {
					params.logChannels.info(`failed to roll back ${label} after secrets reload`);
				}
			}
			throw error;
		}
	}, reloadOptions);
}
//#endregion
//#region src/gateway/server-aux-handlers.ts
function createGatewayAuxHandlers(params) {
	const approvalPersistence = { runtimeEpoch: randomUUID() };
	const placementStandingGrants = createPlacementStandingGrantRuntime({ runtimeEpoch: approvalPersistence.runtimeEpoch });
	const ready = recoverOperatorApprovalsOnStartup({
		runtimeEpoch: approvalPersistence.runtimeEpoch,
		nowMs: Date.now()
	});
	const presentationWork = new AsyncWorkScope();
	const trackPresentationWork = (run) => presentationWork.track(() => runWithRetainedGatewayRootWork(run));
	const createApprovalManager = (approvalKind, resolveAllowedDecisions, resolveStandingGrantMint, retainPlacementStandingGrantAsync) => new ExecApprovalManager({
		scheduler: params.scheduler,
		approvalKind,
		persistence: approvalPersistence,
		resolveAudienceSessionKeys: resolveApprovalSessionAudienceWithFallback,
		resolveAllowedDecisions,
		...resolveStandingGrantMint ? { resolveStandingGrantMint } : {},
		...retainPlacementStandingGrantAsync ? { retainPlacementStandingGrantAsync } : {},
		...params.resolveGrantDefaultExpiresAtMs ? { resolveStandingGrantExpiresAtMs: params.resolveGrantDefaultExpiresAtMs } : {},
		onLifecycle: params.onApprovalLifecycle,
		onExpired: (record, liveRecord) => publishAuthorityClosure({
			kind: approvalKind,
			record,
			liveRecord
		}),
		validateAgentRuntimeDelegatedAuthority: params.validateAgentRuntimeDelegatedAuthority,
		onError: (error, context) => params.log.error?.(`${context.approvalKind} approval ${context.operation} failed for ${context.approvalId}: ${String(error)}`)
	});
	const execApprovalManager = createApprovalManager("exec", resolveExecApprovalRequestAllowedDecisions, (request) => {
		const source = request.cronExecutionSource;
		const operationBinding = request.cronOperationBinding?.trim();
		const agentId = request.agentId?.trim();
		if (!source || !operationBinding || !agentId) return null;
		if (request.runId && params.hasRunAbortMarker?.(request.runId) === true) return null;
		return {
			kind: "cron",
			agentId,
			cronJobId: source.jobId,
			jobConfigRevision: source.jobConfigRevision,
			operationBinding
		};
	});
	const execApprovalForwarder = createExecApprovalForwarder({ getNativeApprovalRouteCoordinator: params.getNativeApprovalRouteCoordinator });
	const approvalWebPushDelivery = createApprovalWebPushDelivery({
		getRuntimeConfig: readRuntimeConfig,
		log: params.log
	});
	const execApprovalIosPushDelivery = createExecApprovalIosPushDelivery({ log: params.log });
	const loadExecApprovalHandlers = createLazyPromise(() => import("./exec-approval-B70oQt6z.mjs").then(({ createExecApprovalHandlers }) => createExecApprovalHandlers(execApprovalManager, {
		forwarder: execApprovalForwarder,
		iosPushDelivery: execApprovalIosPushDelivery
	})), { cacheRejections: true });
	const reloadSecrets = createGatewaySecretsReloader(params);
	const loadSecretStoreWriteService = createLazyPromise(async () => {
		const { createSecretStoreWriteService } = await import("./secrets-DIeBuzTr.mjs");
		return createSecretStoreWriteService({
			reloadSecrets,
			log: params.log
		});
	}, { cacheRejections: true });
	const questionManager = new QuestionManager(params.scheduler, () => params.log.warn?.("Question terminal publication failed; answer state retained."));
	const loadQuestionHandlers = createLazyPromise(async () => {
		const [{ createQuestionHandlers }, storeWriteService] = await Promise.all([import("./question-lZ4HKKRO.mjs"), loadSecretStoreWriteService()]);
		return createQuestionHandlers(questionManager, storeWriteService, params.scheduler);
	}, { cacheRejections: true });
	const pluginApprovalManager = createApprovalManager("plugin", resolveCanonicalPluginApprovalRequestAllowedDecisions, (request) => {
		if (request.runId && params.hasRunAbortMarker?.(request.runId) === true) return null;
		if (request.mcpTool && request.agentId && request.agentId !== "*") {
			const servers = readRuntimeConfig().mcp?.servers;
			const server = servers && Object.hasOwn(servers, request.mcpTool.server) ? servers[request.mcpTool.server] : void 0;
			const mode = server && resolveProjectedMcpCodexToolApprovalMode(request.mcpTool.server, server, server);
			if (server && server.enabled !== false && (mode === void 0 || mode === "auto")) return {
				kind: "mcp-tool",
				agentId: request.agentId,
				...request.mcpTool
			};
		}
		if (!request.placementGrant) return null;
		return {
			kind: "placement",
			...request.placementGrant
		};
	}, placementStandingGrants.retainAsync);
	const systemAgentApprovalManager = createApprovalManager("system-agent", () => SYSTEM_AGENT_APPROVAL_DECISIONS);
	const approvalManagers = [
		execApprovalManager,
		pluginApprovalManager,
		systemAgentApprovalManager
	];
	const pluginApprovalIosPushDelivery = createPluginApprovalIosPushDelivery({ log: params.log });
	let approvalPublicationContext;
	const pendingAuthorityPublications = [];
	const publishResolution = ({ kind, record, liveRecord }, context, reason) => {
		trackPresentationWork(() => publishAppliedApprovalResolution({
			record,
			liveRecord,
			context,
			forwarder: execApprovalForwarder,
			...kind === "exec" ? { iosPushDelivery: execApprovalIosPushDelivery } : kind === "plugin" ? { pluginIosPushDelivery: pluginApprovalIosPushDelivery } : {}
		}).catch((error) => {
			context.logGateway?.error?.(`${kind} approvals: ${reason} publication failed: ${String(error)}`);
		}));
	};
	const publishAuthorityClosure = (publication) => {
		if (presentationWork.isClosing) return;
		if (approvalPublicationContext) publishResolution(publication, approvalPublicationContext, "authority-close");
		else pendingAuthorityPublications.push(publication);
	};
	const bindApprovalPublicationContext = (context) => {
		if (presentationWork.isClosing) return;
		approvalPublicationContext = context;
		for (const publication of pendingAuthorityPublications.splice(0)) publishAuthorityClosure(publication);
	};
	const unregisterApprovalAuthorityClosedObserver = registerAgentRunDelegatedAuthorityClosedHandler((authority, approvalReason) => {
		for (const manager of approvalManagers) {
			const kind = manager.approvalKind;
			cancelAgentRuntimeBoundApprovals({
				authority,
				reason: approvalReason,
				manager,
				publish: (record, liveRecord) => publishAuthorityClosure({
					kind,
					record,
					liveRecord
				})
			}).catch((error) => {
				params.log.error?.(`${kind} approvals: authority-close settlement failed: ${String(error)}`);
			});
		}
		questionManager.cancelClosedAuthorities(authority.operationalRunInstance);
		params.onAgentRunAuthorityClosed?.(authority, approvalReason);
	});
	const unregisterWorkerTurnClaimClosedObserver = params.registerWorkerTurnClaimClosedHandler?.((claim) => {
		for (const manager of approvalManagers) {
			const kind = manager.approvalKind;
			cancelWorkerTurnClaimBoundApprovals({
				claim,
				manager,
				publish: (record, liveRecord) => publishAuthorityClosure({
					kind,
					record,
					liveRecord
				})
			}).catch((error) => {
				params.log.error?.(`${kind} approvals: worker-claim settlement failed: ${String(error)}`);
			});
		}
		questionManager.cancelClosedAuthorities({ runId: claim.runId });
	});
	const cancelRunBoundApprovals = (target, context) => {
		if (presentationWork.isClosing) return Promise.resolve(0);
		const cancellations = [];
		for (const manager of approvalManagers) {
			const kind = manager.approvalKind;
			const publish = (record, liveRecord) => publishResolution({
				kind,
				record,
				liveRecord
			}, context, "run-abort");
			cancellations.push(typeof target === "string" ? cancelUnboundRunApprovals({
				runId: target,
				manager,
				publish
			}) : cancelAgentRuntimeBoundApprovals({
				authority: target,
				reason: "permission-change",
				manager,
				publish
			}));
		}
		return Promise.all(cancellations).then((counts) => counts.reduce((sum, count) => sum + count, 0));
	};
	const loadPluginApprovalHandlers = createLazyPromise(() => import("./plugin-approval-DFiBzanU.mjs").then(({ createPluginApprovalHandlers }) => createPluginApprovalHandlers(pluginApprovalManager, {
		forwarder: execApprovalForwarder,
		iosPushDelivery: pluginApprovalIosPushDelivery
	})), { cacheRejections: true });
	const loadApprovalHandlers = createLazyPromise(() => import("./approval-C_dOM3RN.mjs").then(({ createApprovalHandlers }) => createApprovalHandlers({
		execApprovalManager,
		pluginApprovalManager,
		systemAgentApprovalManager,
		forwarder: execApprovalForwarder,
		iosPushDelivery: execApprovalIosPushDelivery,
		pluginIosPushDelivery: pluginApprovalIosPushDelivery
	})), { cacheRejections: true });
	const loadSecretsHandlers = createLazyPromise(async () => {
		const [{ createSecretsHandlers }, storeWriteService] = await Promise.all([import("./secrets-DIeBuzTr.mjs"), loadSecretStoreWriteService()]);
		return createSecretsHandlers({
			reloadSecrets,
			storeWriteService,
			log: params.log,
			resolveSecrets: async ({ allowedPaths, commandName, forcedActivePaths, optionalActivePaths, providerOverrides, targetIds }) => {
				const { assignments, diagnostics, inactiveRefPaths } = await resolveCommandSecretsFromActiveRuntimeSnapshot({
					commandName,
					targetIds: new Set(targetIds),
					...allowedPaths ? { allowedPaths: new Set(allowedPaths) } : {},
					...forcedActivePaths ? { forcedActivePaths: new Set(forcedActivePaths) } : {},
					...optionalActivePaths ? { optionalActivePaths: new Set(optionalActivePaths) } : {},
					...providerOverrides ? { providerOverrides } : {}
				});
				return {
					assignments,
					diagnostics,
					inactiveRefPaths
				};
			}
		});
	}, { cacheRejections: true });
	const beginCloseApprovalObservers = () => {
		for (const manager of approvalManagers) manager.beginClose();
	};
	let stopPromise;
	const stopOperatorInteractions = () => {
		if (!stopPromise) stopPromise = (async () => {
			unregisterWorkerTurnClaimClosedObserver?.();
			unregisterApprovalAuthorityClosedObserver();
			beginCloseApprovalObservers();
			for (const manager of approvalManagers) manager.retire();
			questionManager.close();
			await Promise.allSettled([ready]);
			await questionManager.drain();
			await Promise.all(approvalManagers.map((manager) => manager.drain()));
			await presentationWork.drain();
			await execApprovalForwarder.stop();
			approvalPublicationContext = void 0;
			pendingAuthorityPublications.length = 0;
		})();
		return stopPromise;
	};
	trackPresentationWork(async () => {
		try {
			await ready;
			await approvalWebPushDelivery.recoverTerminalDeliveries();
		} catch (error) {
			params.log.error?.(`approval Web Push restart recovery failed: ${String(error)}`);
		}
	});
	const bindLazyHandlers = (load) => (method) => createLazyHandler(method, load);
	const execApprovalHandler = bindLazyHandlers(loadExecApprovalHandlers);
	const pluginApprovalHandler = bindLazyHandlers(loadPluginApprovalHandlers);
	const approvalHandler = bindLazyHandlers(loadApprovalHandlers);
	const questionHandler = bindLazyHandlers(loadQuestionHandlers);
	const secretsHandler = bindLazyHandlers(loadSecretsHandlers);
	return {
		ready,
		execApprovalManager,
		cancelRunBoundApprovals,
		forwardPluginApprovalRequest: execApprovalForwarder.handlePluginApprovalRequested,
		forwardExecApprovalRequest: execApprovalForwarder.handleRequested,
		forwardSystemAgentApprovalRequest: execApprovalForwarder.handleSystemAgentApprovalRequested,
		forwardSystemAgentApprovalResolved: execApprovalForwarder.handleSystemAgentApprovalResolved,
		execApprovalIosPushDelivery,
		approvalWebPushDelivery,
		pluginApprovalIosPushDelivery,
		pluginApprovalManager,
		placementStandingGrants,
		systemAgentApprovalManager,
		bindApprovalPublicationContext,
		beginCloseApprovalObservers,
		stopOperatorInteractions,
		questionManager,
		extraHandlers: {
			"exec.approval.get": execApprovalHandler("exec.approval.get"),
			"exec.approval.list": execApprovalHandler("exec.approval.list"),
			"exec.approval.request": execApprovalHandler("exec.approval.request"),
			"exec.approval.waitDecision": execApprovalHandler("exec.approval.waitDecision"),
			"exec.approval.resolve": execApprovalHandler("exec.approval.resolve"),
			"exec.approval.grants.list": execApprovalHandler("exec.approval.grants.list"),
			"exec.approval.grants.revoke": execApprovalHandler("exec.approval.grants.revoke"),
			"plugin.approval.list": pluginApprovalHandler("plugin.approval.list"),
			"plugin.approval.request": pluginApprovalHandler("plugin.approval.request"),
			"plugin.approval.waitDecision": pluginApprovalHandler("plugin.approval.waitDecision"),
			"plugin.approval.resolve": pluginApprovalHandler("plugin.approval.resolve"),
			"approval.get": approvalHandler("approval.get"),
			"approval.history": approvalHandler("approval.history"),
			"approval.resolve": approvalHandler("approval.resolve"),
			"question.request": questionHandler("question.request"),
			"question.waitAnswer": questionHandler("question.waitAnswer"),
			"question.resolve": questionHandler("question.resolve"),
			"question.get": questionHandler("question.get"),
			"question.list": questionHandler("question.list"),
			"secrets.reload": secretsHandler("secrets.reload"),
			"secrets.resolve": secretsHandler("secrets.resolve"),
			"secrets.store.list": secretsHandler("secrets.store.list"),
			"secrets.store.set": secretsHandler("secrets.store.set"),
			"secrets.store.delete": secretsHandler("secrets.store.delete"),
			"secrets.store.import": secretsHandler("secrets.store.import"),
			"secrets.store.allowedHosts": secretsHandler("secrets.store.allowedHosts")
		}
	};
}
//#endregion
export { createGatewayAuxHandlers };
