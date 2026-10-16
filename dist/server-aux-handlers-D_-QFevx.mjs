import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as AsyncWorkScope } from "./async-work-scope-BYeX3gh6.mjs";
import { i as getOrCreatePromise, n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import "./src-CdRlGRnW.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { d as normalizeStringEntries, y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { h as parseSecretRef } from "./types.secrets-DsPRn9Dz.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as resolveControlUiWebPushUrl } from "./control-ui-shared-DqFhbHR8.mjs";
import { t as cloneConfigWithResolutionFacts } from "./resolution-facts-HH1cnmIY.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { i as resolveManifestContractOwnerPluginId } from "./plugin-registry-contributions-JwCDUODD.mjs";
import { l as getRuntimeConfigSourceSnapshot, o as getRuntimeConfigSnapshot } from "./runtime-snapshot-DYptB0Cf.mjs";
import { b as registerAgentRunDelegatedAuthorityClosedHandler } from "./agent-run-registry-BaxMDLZF.mjs";
import { a as READ_SCOPE$1, n as APPROVALS_SCOPE$1 } from "./operator-scopes-DsrPoRc4.mjs";
import { f as assertExpectedResolvedSecretValue, i as createResolverContext } from "./runtime-shared-7qI1DEx4.mjs";
import { r as discoverConfigSecretTargetsByIds } from "./target-registry-query-f56MMhmb.mjs";
import { i as setPathExistingStrict } from "./path-utils-DQXhHs4r.mjs";
import "./target-registry-1a6D8fYt.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./io-CUI9EWW_.mjs";
import "./config-CzeZu5J_.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CqBAHB04.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-DeTO1ikE.mjs";
import "./message-channel-j-k-Nup3.mjs";
import { i as resolveProjectedMcpCodexToolApprovalMode } from "./mcp-codex-tool-approval-DQZI_si1.mjs";
import "./plugin-registry-Cl9kmLsR.mjs";
import { d as isTrustedSecretSurfaceUnavailableError, f as listActiveCredentialDegradedOwners } from "./runtime-degraded-state-oevwKU3u.mjs";
import { t as formatFencedCodeBlock } from "./markdown-code-Buzx6wvi.mjs";
import { n as channelRouteDedupeKey } from "./channel-route-BIxMkFzo.mjs";
import { T as runWithRetainedGatewayRootWork } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { l as getActiveSecretsRuntimeSnapshotRevisionState, s as getActiveSecretsRuntimeEnvState, u as getActiveSecretsRuntimeSnapshotState } from "./runtime-state-D5wZ6Dom.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { v as resolveExecApprovalRequestAllowedDecisions } from "./exec-approvals-authorization.kernel-C_vJhPCn.mjs";
import "./exec-approvals-B1rZTeax.mjs";
import { i as loadOrCreateProcessDeviceIdentity } from "./device-identity-KmxGQO-v.mjs";
import { n as getLoadedChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import { t as resolveChannelApprovalAdapter } from "./plugins-Z9_SzFi0.mjs";
import { n as resolveSecretRefValue } from "./resolve-DDYPuZjk.mjs";
import "./method-scopes-BrMPjfvW.mjs";
import { i as sanitizeExecApprovalWarningText } from "./exec-approval-text-sanitize-Dzmx1bRZ.mjs";
import { a as buildPluginApprovalRequestMessage, i as buildPluginApprovalExpiredMessage, r as approvalDecisionLabel } from "./plugin-approvals-BXljsQyC.mjs";
import { t as resolveCanonicalPluginApprovalRequestAllowedDecisions } from "./plugin-approval-canonical-decisions-FUO82dRh.mjs";
import { t as canChannelEnforcePluginReviewerPolicy } from "./approval-channel-policy-support-DWQOjoD0.mjs";
import { _ as sameWorkerSessionTurnClaim } from "./placement-record-BfcBeilz.mjs";
import { n as find } from "./placement-row-codec-DzKFQEtn.mjs";
import { r as hasActiveNativeApprovalRoute } from "./approval-native-route-coordinator-D2ixPswr.mjs";
import { n as disconnectStaleSharedGatewayAuthClients } from "./server-shared-auth-generation-C2ZgQQOt.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-Bm4RKejp.mjs";
import { t as analyzeCommandSecretAssignmentsFromSnapshot } from "./command-config-8PaTMA3L.mjs";
import { t as resolveRuntimeWebTools } from "./runtime-web-tools-BHnCM2Do.mjs";
import { n as hasEffectivePairedDeviceRole } from "./device-pairing-identity-f0QUXRJo.mjs";
import { i as listDevicePairing } from "./device-pairing-Drmq_Czv.mjs";
import { t as matchesApprovalRequestFilters } from "./approval-request-filters-RxKxwld1.mjs";
import { f as formatExecApprovalExpiresIn } from "./exec-approval-reply-Df1HgEq-.mjs";
import { l as resolveApprovalRequestKind } from "./approval-request-account-binding-I7l4AwjN.mjs";
import { n as buildSystemAgentApprovalResolvedText, t as SYSTEM_AGENT_APPROVAL_EXPIRED_TEXT } from "./approval-terminal-D_V2O5Tg.mjs";
import { t as createPendingApprovalRegistry } from "./pending-approval-registry-Ba8xUSFo.mjs";
import { t as resolveExecApprovalCommandDisplay } from "./exec-approval-command-display-BGbZnsXu.mjs";
import { t as SYSTEM_AGENT_APPROVAL_DECISIONS } from "./system-agent-approvals-r0J6k0r_.mjs";
import { a as buildTypedApprovalPendingReplyPayload, i as buildPluginApprovalResolvedReplyPayload, n as buildApprovalResolvedReplyPayload, o as buildTypedPluginApprovalPendingReplyPayload } from "./approval-renderers-WuEQu7Ju.mjs";
import { o as diffConfigPaths, t as buildGatewayReloadPlan } from "./config-reload-plan-rFxyKwyb.mjs";
import { t as isChannelStartupSuppressedByEnvironment } from "./server-sidecar-startup-mode-De0PJqUq.mjs";
import { g as resolveApnsRelayConfigFromEnv, n as clearApnsRegistrationIfCurrent, s as loadApnsRegistrations } from "./push-apns-store-BNQPyh4x.mjs";
import { _ as webPushAgentAllowed, f as isWebPushQuietHours, m as normalizeWebPushDisplayLabel, v as webPushCategoryEnabled } from "./push-web-store.records-CGk3CZmD.mjs";
import { t as QuestionManager } from "./question-manager-CWgnAtGc.mjs";
import { n as isApprovalRecordVisibleToClient, t as canAccessApprovalSession } from "./approval-record-lookup-C4cH7L-g.mjs";
import { a as pruneTerminalOperatorApprovals, t as closeOrphanedOperatorApprovals } from "./operator-approval-store.transitions-CL3SwJLb.mjs";
import { i as getOperatorApprovalDetailed } from "./operator-approval-store-cPImwg80.mjs";
import { t as resolveApprovalSessionAudienceWithFallback } from "./approval-session-audience-Dq5k-x4s.mjs";
import { t as canAccessOperatorApproval } from "./operator-approval-authorization-BCjW3avN.mjs";
import { c as listTerminalWebPushApprovalDeliveryIds, l as listWebPushApprovalDeliveryTargets, o as deleteWebPushApprovalDeliveryTargets, r as prepareWebPushNotificationSender, s as hasBoundWebPushSubscriptions, u as prepareWebPushApprovalDeliveries } from "./push-web-CligmjCq.mjs";
import { i as withCurrentWebPushAuthority, n as webPushSessionAccess, r as webPushTargetClient, t as listCurrentWebPushTargets } from "./web-push-authority-hkrb9gNs.mjs";
import { a as sendApnsPluginApprovalAlert, c as resolveApnsAuthConfigFromEnv, i as sendApnsExecApprovalResolvedWake, o as sendApnsPluginApprovalResolvedWake, r as sendApnsExecApprovalAlert, s as shouldClearStoredApnsRegistration } from "./push-apns-DWV7vQst.mjs";
import { t as ExecApprovalManager } from "./exec-approval-manager-D2juUf4U.mjs";
import { t as publishAppliedApprovalResolution } from "./approval-publication-CaBaAmYD.mjs";
import { t as refreshModelRuntimeAfterHotReload } from "./server-reload-model-runtime-scope-cy8BkIse.mjs";
import { createHash, randomUUID } from "node:crypto";
//#region src/infra/exec-approval-forwarder.messages.ts
function formatApprovalCommand(command) {
	return !command.includes("\n") && !command.includes("`") ? {
		inline: true,
		text: `\`${command}\``
	} : {
		inline: false,
		text: formatFencedCodeBlock(command)
	};
}
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
	const command = formatApprovalCommand(resolveExecApprovalCommandDisplay(request.request).commandText);
	if (command.inline) lines.push(`Command: ${command.text}`);
	else lines.push("Command:", command.text);
	if (request.request.cwd) lines.push(`CWD: ${request.request.cwd}`);
	if (request.request.nodeId) lines.push(`Node: ${request.request.nodeId}`);
	if (Array.isArray(request.request.envKeys) && request.request.envKeys.length > 0) lines.push(`Env overrides: ${request.request.envKeys.join(", ")}`);
	if (request.request.host) lines.push(`Host: ${request.request.host}`);
	if (request.request.agentId) lines.push(`Agent: ${request.request.agentId}`);
	if (request.request.security) lines.push(`Security: ${request.request.security}`);
	if (request.request.ask) lines.push(`Ask: ${request.request.ask}`);
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
function buildApprovalRenderPayload(params) {
	const channel = normalizeMessageChannel(params.target.channel) ?? params.target.channel;
	return (channel ? params.resolveRenderer(resolveChannelApprovalAdapter(getLoadedChannelPlugin(channel)))?.(params.renderParams) : null) ?? params.buildFallback();
}
function buildForwardedExecPendingPayload(params) {
	return buildApprovalRenderPayload({
		target: params.target,
		renderParams: params,
		resolveRenderer: (adapter) => adapter?.render?.exec?.buildPendingPayload,
		buildFallback: () => buildTypedApprovalPendingReplyPayload({
			approvalKind: "exec",
			approvalId: params.request.id,
			approvalSlug: params.request.id.slice(0, 8),
			text: buildForwardedExecApprovalRequest(params.request, params.nowMs),
			agentId: params.request.request.agentId ?? null,
			allowedDecisions: resolveExecApprovalRequestAllowedDecisions(params.request.request),
			sessionKey: params.request.request.sessionKey ?? null
		})
	});
}
function buildForwardedExecResolvedPayload(params) {
	return buildApprovalRenderPayload({
		target: params.target,
		renderParams: params,
		resolveRenderer: (adapter) => adapter?.render?.exec?.buildResolvedPayload,
		buildFallback: () => buildApprovalResolvedReplyPayload({
			approvalId: params.resolved.id,
			approvalSlug: params.resolved.id.slice(0, 8),
			text: buildForwardedExecApprovalResolved(params.resolved)
		})
	});
}
function buildForwardedPluginPendingPayload(params) {
	return buildApprovalRenderPayload({
		target: params.target,
		renderParams: params,
		resolveRenderer: (adapter) => adapter?.render?.plugin?.buildPendingPayload,
		buildFallback: () => buildTypedPluginApprovalPendingReplyPayload({
			request: params.request,
			nowMs: params.nowMs,
			text: buildPluginApprovalRequestMessage(params.request, params.nowMs),
			allowedDecisions: resolveCanonicalPluginApprovalRequestAllowedDecisions(params.request.request)
		})
	});
}
function buildForwardedPluginResolvedPayload(params) {
	return buildApprovalRenderPayload({
		target: params.target,
		renderParams: params,
		resolveRenderer: (adapter) => adapter?.render?.plugin?.buildResolvedPayload,
		buildFallback: () => buildPluginApprovalResolvedReplyPayload({ resolved: params.resolved })
	});
}
function buildForwardedSystemAgentApprovalRequest(request, nowMs) {
	const expiresIn = Math.max(0, Math.round((request.expiresAtMs - nowMs) / 1e3));
	return [
		"🛠️ OpenClaw change requires approval",
		`Change: ${request.request.description}`,
		...request.request.agentId ? [`Agent: ${request.request.agentId}`] : [],
		`ID: ${request.id}`,
		`Expires in: ${expiresIn}s`,
		`Reply with: /approve ${request.id} ${SYSTEM_AGENT_APPROVAL_DECISIONS.join("|")}`
	].join("\n");
}
function buildForwardedSystemAgentPendingPayload(params) {
	return buildTypedApprovalPendingReplyPayload({
		approvalKind: "system-agent",
		approvalId: params.request.id,
		approvalSlug: params.request.id.slice(0, 8),
		text: buildForwardedSystemAgentApprovalRequest(params.request, params.nowMs),
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
const loadExecApprovalForwarderRuntime = createLazyRuntimeModule(() => import("./exec-approval-forwarder.runtime.js"));
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
function shouldSkipForwardingFallback(params) {
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
	if (!(adapter?.delivery?.shouldSuppressForwardingFallback?.(fallbackInput) ?? false) || !plugin) return false;
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
	return loadExecApprovalForwarderRuntime().then(({ resolveExecApprovalSessionTarget }) => {
		const resolvedTarget = resolveExecApprovalSessionTarget({
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
			if (!seen.has(key)) {
				seen.add(key);
				targets.push({
					...sessionTarget,
					source: "session"
				});
			}
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
		return targets.filter((target) => !shouldSkipForwardingFallback({
			approvalKind: params.strategy.kind,
			target,
			cfg: paramsForRoute.cfg,
			routeRequest: paramsForRoute.routeRequest,
			approvalRequest: paramsForRoute.approvalRequest,
			nativeRouteCoordinator
		}));
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
		getConfig: deps.getConfig ?? getRuntimeConfig,
		deliver: deps.deliver ?? (async (params) => {
			const { sendDurableMessageBatchCore } = await loadExecApprovalForwarderRuntime();
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
function hasProviderOverrides(overrides) {
	return normalizeOptionalString(overrides?.webSearch) !== void 0 || normalizeOptionalString(overrides?.webFetch) !== void 0;
}
function applyProviderOverridesToConfig(config, overrides) {
	if (!hasProviderOverrides(overrides)) return config;
	const next = cloneConfigWithResolutionFacts(config);
	const tools = next.tools ??= {};
	const web = tools.web ??= {};
	const webSearch = normalizeOptionalString(overrides?.webSearch);
	if (webSearch) {
		const search = web.search ??= {};
		search.provider = webSearch;
	}
	const webFetch = normalizeOptionalString(overrides?.webFetch);
	if (webFetch) {
		const fetch = web.fetch ??= {};
		fetch.provider = webFetch;
	}
	return next;
}
function pluginIdFromRuntimeWebPath(path) {
	return /^plugins\.entries\.([^.]+)\.config\.(webSearch|webFetch)\.apiKey$/.exec(path)?.[1];
}
function isProviderOverridePath(params) {
	for (const [overrideKey, kind, contract] of [[
		"webSearch",
		"search",
		"webSearchProviders"
	], [
		"webFetch",
		"fetch",
		"webFetchProviders"
	]]) {
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
	if (!hasProviderOverrides(params.providerOverrides)) return params.inactiveRefPaths;
	const inactive = new Set(params.inactiveRefPaths);
	const defaults = params.sourceConfig.secrets?.defaults;
	for (const target of discoverConfigSecretTargetsByIds(params.sourceConfig, params.targetIds)) {
		if (params.allowedPaths && !params.allowedPaths.has(target.path)) continue;
		if (!pluginIdFromRuntimeWebPath(target.path)) continue;
		if (!(parseSecretRef(target.refValue, defaults) ?? parseSecretRef(target.value, defaults))) continue;
		if (params.forcedActivePaths?.has(target.path) || params.optionalActivePaths?.has(target.path)) continue;
		if (isProviderOverridePath({
			config: params.sourceConfig,
			path: target.path,
			providerOverrides: params.providerOverrides
		})) continue;
		inactive.add(target.path);
		setPathExistingStrict(params.resolvedConfig, target.pathSegments, target.value);
	}
	return [...inactive];
}
function filterInactiveRefPaths(params) {
	return params.inactiveRefPaths.filter((path) => {
		if (params.allowedPaths && !params.allowedPaths.has(path)) return false;
		if (params.forcedActivePaths?.has(path) || params.optionalActivePaths?.has(path)) return false;
		if (!hasProviderOverrides(params.providerOverrides)) return true;
		return !isProviderOverridePath({
			config: params.config,
			path,
			providerOverrides: params.providerOverrides
		});
	});
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
	return resolveCommandSecretsFromSnapshot({
		...params,
		activeSnapshot
	});
}
async function resolveCommandSecretsFromSnapshot(params) {
	const hasOverrides = hasProviderOverrides(params.providerOverrides);
	const sourceConfig = applyProviderOverridesToConfig(params.activeSnapshot.sourceConfig, params.providerOverrides);
	const resolvedConfig = applyProviderOverridesToConfig(params.activeSnapshot.config, params.providerOverrides);
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
	const warningSource = context?.warnings ?? params.activeSnapshot.warnings;
	let inactiveRefPaths = filterInactiveRefPaths({
		config: sourceConfig,
		providerOverrides: params.providerOverrides,
		allowedPaths: params.allowedPaths,
		forcedActivePaths: params.forcedActivePaths,
		optionalActivePaths: params.optionalActivePaths,
		inactiveRefPaths: [...new Set(warningSource.filter((warning) => warning.code === "SECRETS_REF_IGNORED_INACTIVE_SURFACE").map((warning) => warning.path))]
	});
	inactiveRefPaths = restoreInactiveWebCommandSecretTargets({
		sourceConfig,
		resolvedConfig,
		targetIds: params.targetIds,
		inactiveRefPaths,
		providerOverrides: params.providerOverrides,
		allowedPaths: params.allowedPaths,
		forcedActivePaths: params.forcedActivePaths,
		optionalActivePaths: params.optionalActivePaths
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
	if (params.terminal) return {
		title: `${label}OpenClaw approval updated`,
		body: params.preferences.detailLevel === "private" ? "This approval is no longer pending." : `Approval${agent} is no longer pending.`
	};
	return {
		title: `${label}OpenClaw approval requested`,
		body: params.preferences.detailLevel === "private" ? "Open OpenClaw to review this request." : `Open OpenClaw to review an approval${agent}.`
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
		requiredScopes: [APPROVALS_SCOPE$1, READ_SCOPE$1]
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
				requiredScopes: [APPROVALS_SCOPE$1, READ_SCOPE$1]
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
const APPROVALS_SCOPE = "operator.approvals";
const READ_SCOPE = "operator.read";
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
function resolveActiveOperatorToken(device) {
	const operatorToken = device.tokens?.[OPERATOR_ROLE];
	if (!operatorToken || operatorToken.revokedAtMs) return null;
	return operatorToken;
}
async function resolvePairedTargets(params) {
	const deviceIds = (await listDevicePairing()).paired.filter((device) => {
		if (!isIosPlatform(device.platform) || !hasEffectivePairedDeviceRole(device, OPERATOR_ROLE)) return false;
		const operatorToken = resolveActiveOperatorToken(device);
		if (params.requireApprovalScope && (!operatorToken || !roleScopesAllow({
			role: OPERATOR_ROLE,
			requestedScopes: [APPROVALS_SCOPE, READ_SCOPE],
			allowedScopes: operatorToken.scopes
		}))) return false;
		return params.isTargetVisible?.({
			deviceId: device.deviceId,
			scopes: operatorToken?.scopes ?? []
		}) ?? true;
	}).map((device) => device.deviceId);
	return deviceIds.length > 0 ? await loadApnsRegistrations(deviceIds) : [];
}
async function resolveDeliveryPlan(params) {
	const targets = params.explicitNodeIds?.length ? await loadApnsRegistrations(params.explicitNodeIds) : await resolvePairedTargets({
		requireApprovalScope: params.requireApprovalScope,
		isTargetVisible: params.isTargetVisible
	});
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
		const relay = resolveApnsRelayConfigFromEnv(process.env, getRuntimeConfig().gateway, { registrationRelayOrigin: target.registration.relayOrigin });
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
	const gatewayDeviceId = loadOrCreateProcessDeviceIdentity().deviceId;
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
	const sendCleanupPushForApproval = async (approvalId) => {
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
			requireApprovalScope: false,
			explicitNodeIds: deliveryState.nodeIds,
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
					requireApprovalScope: true,
					isTargetVisible: opts?.isTargetVisible,
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
		/** Sends cleanup wakes for resolved approval requests. */
		async handleResolved(resolved) {
			await sendCleanupPushForApproval(resolved.id);
		},
		/** Sends cleanup wakes for expired approval requests. */
		async handleExpired(request) {
			await sendCleanupPushForApproval(request.id);
		}
	};
}
/** Creates iOS push delivery for exec approval requests. */
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
/** Creates iOS push delivery for plugin approval requests. */
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
function hasExactAttachedSession(value, sessionId) {
	const parsed = safeParseJson(value);
	return Array.isArray(parsed) && parsed.length === 1 && parsed[0] === sessionId;
}
function isPlacementBindingCurrent(database, binding) {
	const placement = find(database.db, binding.sessionId);
	if (placement?.state !== "active" || placement.executionMode !== "remote-exec" || placement.agentId !== binding.agentId || placement.sessionKey !== binding.sessionKey || placement.environmentId !== binding.environmentId || placement.activeOwnerEpoch !== binding.ownerEpoch || placement.generation !== binding.placementGeneration || placement.remoteWorkspaceDir !== binding.cwd) return false;
	const stateDb = getNodeSqliteKysely(database.db);
	const environment = executeSqliteQueryTakeFirstSync(database.db, stateDb.selectFrom("worker_environments").select([
		"state",
		"node_device_id",
		"owner_epoch",
		"attached_session_ids_json"
	]).where("environment_id", "=", binding.environmentId));
	return environment?.state === "attached" && environment.node_device_id === binding.nodeId && environment.owner_epoch === binding.ownerEpoch && hasExactAttachedSession(environment.attached_session_ids_json, binding.sessionId);
}
/** Resolves the exact active node-backed placement from Gateway-owned rows. */
function resolvePlacementStandingGrantBinding(input) {
	if (!input.pluginId.trim() || !input.command.trim() || !input.approvalScope.trim() || !input.agentId.trim() || !input.sessionKey.trim() || !input.nodeId.trim() || !input.pairingGeneration.trim()) return null;
	return runOpenClawStateWriteTransaction((database) => {
		const stateDb = getNodeSqliteKysely(database.db);
		const candidates = executeSqliteQuerySync(database.db, stateDb.selectFrom("worker_session_placements").select("session_id").where("agent_id", "=", input.agentId).where("session_key", "=", input.sessionKey).where("state", "=", "active").where("execution_mode", "=", "remote-exec").limit(2)).rows;
		if (candidates.length !== 1) return null;
		const placement = find(database.db, candidates[0].session_id);
		if (placement?.state !== "active" || placement.executionMode !== "remote-exec" || !placement.environmentId || !placement.activeOwnerEpoch || !placement.remoteWorkspaceDir) return null;
		const binding = {
			pluginId: input.pluginId,
			command: input.command,
			approvalScope: input.approvalScope,
			agentId: input.agentId,
			sessionKey: input.sessionKey,
			sessionId: placement.sessionId,
			nodeId: input.nodeId,
			pairingGeneration: input.pairingGeneration,
			environmentId: placement.environmentId,
			ownerEpoch: placement.activeOwnerEpoch,
			placementGeneration: placement.generation,
			cwd: placement.remoteWorkspaceDir
		};
		return isPlacementBindingCurrent(database, binding) ? binding : null;
	}, input.databaseOptions);
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
function resolveRetainedGrant(params) {
	const key = placementGrantKey(params.binding);
	const grant = params.grants.get(key);
	if (!grant) return { outcome: "no-grant" };
	if (grant.expiresAtMs <= params.nowMs) {
		params.grants.delete(key);
		return { outcome: "expired" };
	}
	if (grant.nodeId !== params.binding.nodeId) {
		params.grants.delete(key);
		return { outcome: "node-changed" };
	}
	if (grant.pairingGeneration !== params.binding.pairingGeneration) {
		params.grants.delete(key);
		return { outcome: "pairing-changed" };
	}
	return runOpenClawStateWriteTransaction((database) => {
		if (!(grant.sessionKey === params.binding.sessionKey && grant.environmentId === params.binding.environmentId && grant.ownerEpoch === params.binding.ownerEpoch && grant.placementGeneration === params.binding.placementGeneration && grant.cwd === params.binding.cwd) || !isPlacementBindingCurrent(database, params.binding)) {
			params.grants.delete(key);
			return find(database.db, params.binding.sessionId) ? { outcome: "placement-changed" } : { outcome: "placement-missing" };
		}
		const stateDb = getNodeSqliteKysely(database.db);
		const approval = executeSqliteQueryTakeFirstSync(database.db, stateDb.selectFrom("operator_approvals").select([
			"status",
			"decision",
			"runtime_epoch"
		]).where("approval_id", "=", grant.mintedByApprovalId));
		if (!approval) {
			params.grants.delete(key);
			return { outcome: "approval-missing" };
		}
		if (approval.runtime_epoch !== params.runtimeEpoch || approval.status !== "allowed" || approval.decision !== "allow-always") {
			params.grants.delete(key);
			return { outcome: "approval-not-allow-always" };
		}
		return {
			outcome: "consumed",
			grant
		};
	}, params.databaseOptions);
}
function createPlacementStandingGrantRuntime(params) {
	const grants = /* @__PURE__ */ new Map();
	const now = params.now ?? Date.now;
	const resolve = (binding) => resolveRetainedGrant({
		grants,
		binding,
		runtimeEpoch: params.runtimeEpoch,
		nowMs: now(),
		databaseOptions: params.databaseOptions
	});
	return {
		resolveBinding: (input) => resolvePlacementStandingGrantBinding({
			...input,
			databaseOptions: params.databaseOptions
		}),
		retain: (grant) => {
			const maxExpiresAtMs = grant.nowMs + PLACEMENT_GRANT_TTL_MS;
			const expiresAtMs = Math.min(grant.expiresAtMs ?? maxExpiresAtMs, maxExpiresAtMs);
			if (expiresAtMs <= grant.nowMs) return false;
			try {
				const retained = runOpenClawStateWriteTransaction((database) => {
					if (!isPlacementBindingCurrent(database, grant)) return null;
					const stateDb = getNodeSqliteKysely(database.db);
					const approval = executeSqliteQueryTakeFirstSync(database.db, stateDb.selectFrom("operator_approvals").select([
						"status",
						"decision",
						"runtime_epoch"
					]).where("approval_id", "=", grant.approvalId));
					if (approval?.runtime_epoch !== params.runtimeEpoch || approval.status !== "allowed" || approval.decision !== "allow-always") return null;
					return {
						pluginId: grant.pluginId,
						command: grant.command,
						approvalScope: grant.approvalScope,
						agentId: grant.agentId,
						sessionKey: grant.sessionKey,
						sessionId: grant.sessionId,
						nodeId: grant.nodeId,
						pairingGeneration: grant.pairingGeneration,
						environmentId: grant.environmentId,
						ownerEpoch: grant.ownerEpoch,
						placementGeneration: grant.placementGeneration,
						cwd: grant.cwd,
						mintedByApprovalId: grant.approvalId,
						expiresAtMs
					};
				}, params.databaseOptions);
				if (!retained) return false;
				grants.set(placementGrantKey(retained), retained);
				return true;
			} catch {
				return false;
			}
		},
		validate: resolve,
		consume: resolve
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
		reason: params.reason,
		manager: params.manager,
		publish: params.publish,
		matches: (pending) => {
			const bound = pending.agentRuntimeDelegatedAuthority;
			return bound?.claimId === params.authority.claimId && bound.lifecycleGeneration === params.authority.lifecycleGeneration && bound.operationalRunInstance.instanceId === params.authority.operationalRunInstance.instanceId && bound.operationalRunInstance.runId === params.authority.operationalRunInstance.runId;
		}
	});
}
/** Settles approvals whose authoritative worker turn claim has been fenced. */
function cancelWorkerTurnClaimBoundApprovals(params) {
	return cancelMatchingApprovals({
		manager: params.manager,
		publish: params.publish,
		matches: (pending) => {
			const authority = pending.agentRuntimeDelegatedAuthority;
			return authority?.kind === "worker" && params.claim.owner.kind === "worker" && sameWorkerSessionTurnClaim(authority.turnClaim, params.claim);
		}
	});
}
/** Preserves legacy run-id abort cleanup only for records without delegated authority. */
function cancelUnboundRunApprovals(params) {
	return cancelMatchingApprovals({
		manager: params.manager,
		publish: params.publish,
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
		const startTarget = ({ channel, accountId }) => accountId ? manager.startChannel(channel, accountId, { preserveManualStop: true }) : manager.startChannel(channel);
		const stopTarget = ({ channel, accountId }) => accountId ? manager.stopChannel(channel, accountId, { manual: false }) : manager.stopChannel(channel);
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
				if (!transaction.isCurrent()) throw new Error("secrets.reload was superseded by a newer config write");
				break;
			}
			const { prepared, plan, credentialOwners, generationOwnership, isCurrent } = transaction;
			await transaction.modelPublication;
			if (!isCurrent()) throw new Error("secrets.reload was superseded by a newer config write");
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
					const assertGenerationOwned = () => {
						if (!isCurrent()) throw new Error("secrets.reload was superseded by a newer config write");
					};
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
	const approvalStartupNowMs = Date.now();
	closeOrphanedOperatorApprovals({
		runtimeEpoch: approvalPersistence.runtimeEpoch,
		nowMs: approvalStartupNowMs
	});
	pruneTerminalOperatorApprovals({ nowMs: approvalStartupNowMs });
	const presentationWork = new AsyncWorkScope();
	const trackPresentationWork = (run) => presentationWork.track(() => runWithRetainedGatewayRootWork(run));
	const createApprovalManager = (approvalKind, resolveAllowedDecisions, resolveStandingGrantMint, retainPlacementStandingGrant) => new ExecApprovalManager({
		scheduler: params.scheduler,
		approvalKind,
		persistence: approvalPersistence,
		resolveAudienceSessionKeys: resolveApprovalSessionAudienceWithFallback,
		resolveAllowedDecisions,
		...resolveStandingGrantMint ? { resolveStandingGrantMint } : {},
		...retainPlacementStandingGrant ? { retainPlacementStandingGrant } : {},
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
		getRuntimeConfig,
		log: params.log
	});
	const execApprovalIosPushDelivery = createExecApprovalIosPushDelivery({ log: params.log });
	const loadExecApprovalHandlers = createLazyPromise(() => import("./exec-approval-B1Adqwjy.mjs").then(({ createExecApprovalHandlers }) => createExecApprovalHandlers(execApprovalManager, {
		forwarder: execApprovalForwarder,
		iosPushDelivery: execApprovalIosPushDelivery
	})), { cacheRejections: true });
	const reloadSecrets = createGatewaySecretsReloader(params);
	const loadSecretsModule = createLazyPromise(() => import("./secrets-tfCr8trb.mjs"), { cacheRejections: true });
	const loadSecretStoreWriteService = createLazyPromise(async () => {
		const { createSecretStoreWriteService } = await loadSecretsModule();
		return createSecretStoreWriteService({
			reloadSecrets,
			log: params.log
		});
	}, { cacheRejections: true });
	const questionManager = new QuestionManager(params.scheduler, () => params.log.warn?.("Question terminal publication failed; answer state retained."));
	const loadQuestionHandlers = createLazyPromise(async () => {
		const [{ createQuestionHandlers }, storeWriteService] = await Promise.all([import("./question-DQsnLvPQ.mjs"), loadSecretStoreWriteService()]);
		return createQuestionHandlers(questionManager, storeWriteService, params.scheduler);
	}, { cacheRejections: true });
	const pluginApprovalManager = createApprovalManager("plugin", resolveCanonicalPluginApprovalRequestAllowedDecisions, (request) => {
		if (request.runId && params.hasRunAbortMarker?.(request.runId) === true) return null;
		if (request.mcpTool && request.agentId && request.agentId !== "*") {
			const servers = getRuntimeConfig().mcp?.servers;
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
	}, placementStandingGrants.retain);
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
	const unregisterApprovalAuthorityObserver = () => {
		unregisterWorkerTurnClaimClosedObserver?.();
		unregisterApprovalAuthorityClosedObserver();
	};
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
	const loadPluginApprovalHandlers = createLazyPromise(() => import("./plugin-approval-N-QSexzb.mjs").then(({ createPluginApprovalHandlers }) => createPluginApprovalHandlers(pluginApprovalManager, {
		forwarder: execApprovalForwarder,
		iosPushDelivery: pluginApprovalIosPushDelivery
	})), { cacheRejections: true });
	const loadApprovalHandlers = createLazyPromise(() => import("./approval-B_OyQgro.mjs").then(({ createApprovalHandlers }) => createApprovalHandlers({
		execApprovalManager,
		pluginApprovalManager,
		systemAgentApprovalManager,
		forwarder: execApprovalForwarder,
		iosPushDelivery: execApprovalIosPushDelivery,
		pluginIosPushDelivery: pluginApprovalIosPushDelivery
	})), { cacheRejections: true });
	const loadSecretsHandlers = createLazyPromise(async () => {
		const [{ createSecretsHandlers }, storeWriteService] = await Promise.all([loadSecretsModule(), loadSecretStoreWriteService()]);
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
			unregisterApprovalAuthorityObserver();
			beginCloseApprovalObservers();
			for (const manager of approvalManagers) manager.retire();
			questionManager.close();
			await questionManager.drain();
			await Promise.all(approvalManagers.map((manager) => manager.drain()));
			await presentationWork.drain();
			await execApprovalForwarder.stop();
			approvalPublicationContext = void 0;
			pendingAuthorityPublications.length = 0;
		})();
		return stopPromise;
	};
	trackPresentationWork(() => approvalWebPushDelivery.recoverTerminalDeliveries().catch((error) => {
		params.log.error?.(`approval Web Push restart recovery failed: ${String(error)}`);
	}));
	return {
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
			"exec.approval.get": createLazyHandler("exec.approval.get", loadExecApprovalHandlers),
			"exec.approval.list": createLazyHandler("exec.approval.list", loadExecApprovalHandlers),
			"exec.approval.request": createLazyHandler("exec.approval.request", loadExecApprovalHandlers),
			"exec.approval.waitDecision": createLazyHandler("exec.approval.waitDecision", loadExecApprovalHandlers),
			"exec.approval.resolve": createLazyHandler("exec.approval.resolve", loadExecApprovalHandlers),
			"exec.approval.grants.list": createLazyHandler("exec.approval.grants.list", loadExecApprovalHandlers),
			"exec.approval.grants.revoke": createLazyHandler("exec.approval.grants.revoke", loadExecApprovalHandlers),
			"plugin.approval.list": createLazyHandler("plugin.approval.list", loadPluginApprovalHandlers),
			"plugin.approval.request": createLazyHandler("plugin.approval.request", loadPluginApprovalHandlers),
			"plugin.approval.waitDecision": createLazyHandler("plugin.approval.waitDecision", loadPluginApprovalHandlers),
			"plugin.approval.resolve": createLazyHandler("plugin.approval.resolve", loadPluginApprovalHandlers),
			"approval.get": createLazyHandler("approval.get", loadApprovalHandlers),
			"approval.history": createLazyHandler("approval.history", loadApprovalHandlers),
			"approval.resolve": createLazyHandler("approval.resolve", loadApprovalHandlers),
			"question.request": createLazyHandler("question.request", loadQuestionHandlers),
			"question.waitAnswer": createLazyHandler("question.waitAnswer", loadQuestionHandlers),
			"question.resolve": createLazyHandler("question.resolve", loadQuestionHandlers),
			"question.get": createLazyHandler("question.get", loadQuestionHandlers),
			"question.list": createLazyHandler("question.list", loadQuestionHandlers),
			"secrets.reload": createLazyHandler("secrets.reload", loadSecretsHandlers),
			"secrets.resolve": createLazyHandler("secrets.resolve", loadSecretsHandlers),
			"secrets.store.list": createLazyHandler("secrets.store.list", loadSecretsHandlers),
			"secrets.store.set": createLazyHandler("secrets.store.set", loadSecretsHandlers),
			"secrets.store.delete": createLazyHandler("secrets.store.delete", loadSecretsHandlers)
		}
	};
}
//#endregion
export { createGatewayAuxHandlers };
