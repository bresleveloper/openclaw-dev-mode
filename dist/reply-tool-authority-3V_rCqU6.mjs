import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as cloneConfigWithResolutionFacts } from "./resolution-facts-CSuKIPux.mjs";
import { r as attachToolAllowlistIntersection, u as readToolAllowlistIntersection } from "./tool-policy-shared-auQCQEhM.mjs";
import { a as isRuntimeToolAllowed, o as isToolAllowedByPolicies } from "./tool-policy-match-Bv2XOvEF.mjs";
import "./tool-policy-YDdaK0oX.mjs";
import { r as isDevMode } from "./globals-QODkv80i.mjs";
import { a as hasGatewayClientCap, t as GATEWAY_CLIENT_CAPS } from "./client-info-B_ICKCYw.mjs";
import { t as normalizeChatType } from "./chat-type-Dbv0JQHI.mjs";
import { r as resolveGroupSessionKey } from "./group-B8HN3m8j.mjs";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-GvZUbuy9.mjs";
import { t as resolveOriginMessageProvider } from "./origin-routing-jrHjZJWx.mjs";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-CET85wnK.mjs";
import { i as resolveConversationToolPolicies } from "./conversation-tool-policy-pipeline-lj6t0cRI.mjs";
import { r as GATEWAY_OWNER_ONLY_CORE_TOOLS } from "./dangerous-tools-D5_2xo_6.mjs";
import { createHash } from "node:crypto";
//#region src/auto-reply/reply/reply-tool-authority.ts
/** Projects current inbound facts against the active run's frozen authority snapshot. */
function resolveInboundReplyToolAuthorityOverlay(params) {
	const { ctx } = params;
	return {
		operatorAuthority: params.operatorAuthority,
		permissionMode: params.sessionEntry?.permissionMode,
		toolOverrides: params.sessionEntry?.toolOverrides,
		originatingChannel: ctx.OriginatingChannel,
		messageProvider: resolveOriginMessageProvider({
			originatingChannel: ctx.OriginatingChannel,
			provider: ctx.Provider ?? ctx.Surface
		}),
		chatType: normalizeChatType(ctx.ChatType),
		agentAccountId: ctx.AccountId,
		conversationToolPolicy: ctx.ConversationToolPolicy,
		groupId: resolveGroupSessionKey(ctx)?.id,
		groupChannel: normalizeOptionalString(ctx.GroupChannel) ?? normalizeOptionalString(ctx.GroupSubject),
		groupSpace: normalizeOptionalString(ctx.GroupSpace),
		memberRoleIds: Array.isArray(ctx.MemberRoleIds) ? ctx.MemberRoleIds.map((roleId) => normalizeOptionalString(roleId)).filter((roleId) => Boolean(roleId)) : void 0,
		spawnedBy: normalizeOptionalString(params.sessionEntry?.spawnedBy),
		senderId: normalizeOptionalString(ctx.SenderId),
		senderName: normalizeOptionalString(ctx.SenderName),
		senderUsername: normalizeOptionalString(ctx.SenderUsername),
		senderE164: normalizeOptionalString(ctx.SenderE164),
		senderIsOwner: params.senderIsOwner,
		inputProvenance: ctx.InputProvenance,
		trustedInternalHandoff: void 0,
		scheduledToolPolicy: void 0,
		runtimePluginToolGrant: void 0,
		toolsAllow: params.toolsAllow,
		disableTools: params.disableTools,
		traceAuthorized: params.senderIsOwner || (ctx.GatewayClientScopes ?? []).includes("operator.admin"),
		approvalReviewerDeviceId: normalizeOptionalString(ctx.ApprovalReviewerDeviceId),
		clientCaps: ctx.GatewayClientCaps,
		gatewayUiCommandTarget: ctx.GatewayUiCommandTarget,
		toolBindings: ctx.GatewayRunToolBindings
	};
}
function snapshotFollowupRunToolAuthority(run) {
	const toolsAllow = run.toolsAllow ? [...run.toolsAllow] : void 0;
	const intersection = run.toolsAllow ? readToolAllowlistIntersection(run.toolsAllow)?.map((restriction) => restriction.slice()) : void 0;
	if (toolsAllow && intersection) attachToolAllowlistIntersection(toolsAllow, intersection);
	return {
		originatingChannel: run.originatingChannel,
		operatorAuthority: run.operatorAuthority,
		toolsAllow,
		disableTools: run.disableTools === true,
		run: {
			...run.run,
			config: run.run.config ? cloneConfigWithResolutionFacts(run.run.config) : void 0,
			conversationToolPolicy: structuredClone(run.run.conversationToolPolicy),
			inputProvenance: structuredClone(run.run.inputProvenance),
			scheduledToolPolicy: structuredClone(run.run.scheduledToolPolicy),
			runtimePluginToolGrant: structuredClone(run.run.runtimePluginToolGrant),
			trustedInternalHandoff: structuredClone(run.run.trustedInternalHandoff),
			toolOverrides: structuredClone(run.run.toolOverrides),
			execOverrides: structuredClone(run.run.execOverrides),
			bashElevated: structuredClone(run.run.bashElevated),
			toolBindings: structuredClone(run.run.toolBindings),
			clientCaps: run.run.clientCaps ? [...run.run.clientCaps] : void 0,
			gatewayUiCommandTarget: structuredClone(run.run.gatewayUiCommandTarget),
			memberRoleIds: run.run.memberRoleIds ? [...run.run.memberRoleIds] : void 0
		}
	};
}
function applyReplyToolAuthorityOverlay(snapshot, overlay) {
	return {
		...snapshot,
		originatingChannel: overlay.originatingChannel,
		operatorAuthority: overlay.operatorAuthority,
		toolsAllow: overlay.toolsAllow,
		disableTools: overlay.disableTools,
		run: {
			...snapshot.run,
			permissionMode: overlay.permissionMode,
			toolOverrides: overlay.toolOverrides,
			messageProvider: overlay.messageProvider,
			chatType: overlay.chatType,
			agentAccountId: overlay.agentAccountId,
			conversationToolPolicy: overlay.conversationToolPolicy,
			groupId: overlay.groupId,
			groupChannel: overlay.groupChannel,
			groupSpace: overlay.groupSpace,
			memberRoleIds: overlay.memberRoleIds,
			spawnedBy: overlay.spawnedBy,
			senderId: overlay.senderId,
			senderName: overlay.senderName,
			senderUsername: overlay.senderUsername,
			senderE164: overlay.senderE164,
			senderIsOwner: overlay.senderIsOwner,
			inputProvenance: overlay.inputProvenance,
			trustedInternalHandoff: overlay.trustedInternalHandoff,
			scheduledToolPolicy: overlay.scheduledToolPolicy,
			runtimePluginToolGrant: overlay.runtimePluginToolGrant,
			traceAuthorized: overlay.traceAuthorized,
			approvalReviewerDeviceId: overlay.approvalReviewerDeviceId,
			clientCaps: overlay.clientCaps,
			gatewayUiCommandTarget: overlay.gatewayUiCommandTarget,
			toolBindings: overlay.toolBindings
		}
	};
}
function resolveReplyToolAuthorityContext(snapshot, route) {
	const execution = snapshot.run;
	const provider = route?.provider ?? execution.provider;
	const model = route?.model ?? execution.model;
	const policySessionKey = execution.runtimePolicySessionKey ?? execution.sessionKey;
	const sandboxRuntime = resolveSandboxRuntimeStatus({
		cfg: execution.config,
		agentId: execution.agentId,
		sessionKey: execution.sessionKey,
		classificationSessionKey: policySessionKey
	});
	return {
		provider,
		model,
		capabilityProfile: resolveConversationCapabilityProfile({
			config: execution.config,
			sessionId: execution.sessionId,
			sessionKey: execution.sessionKey,
			sandboxSessionKey: policySessionKey,
			agentId: execution.agentId,
			agentDir: execution.agentDir,
			agentAccountId: execution.agentAccountId,
			modelProvider: provider,
			modelId: model,
			messageProvider: execution.messageProvider,
			messageChannel: snapshot.originatingChannel,
			chatType: execution.chatType,
			conversationToolPolicy: execution.conversationToolPolicy,
			groupId: execution.groupId,
			groupChannel: execution.groupChannel,
			groupSpace: execution.groupSpace,
			memberRoleIds: execution.memberRoleIds,
			spawnedBy: execution.spawnedBy,
			senderId: execution.senderId,
			senderName: execution.senderName,
			senderUsername: execution.senderUsername,
			senderE164: execution.senderE164,
			senderIsOwner: execution.senderIsOwner,
			workspaceDir: execution.workspaceDir,
			cwd: execution.cwd,
			sandboxToolPolicy: sandboxRuntime.sandboxed ? sandboxRuntime.toolPolicy : void 0,
			inputProvenance: execution.inputProvenance,
			trustedInternalHandoff: execution.trustedInternalHandoff,
			scheduledToolPolicy: execution.scheduledToolPolicy,
			runtimePluginToolGrant: execution.runtimePluginToolGrant
		})
	};
}
function isReplyToolAllowed(input, toolName, preparedProfile) {
	if (input.disableTools === true || !isRuntimeToolAllowed(toolName, input.toolsAllow)) return false;
	const policies = resolveConversationToolPolicies({ capabilityProfile: preparedProfile ?? resolveReplyToolAuthorityContext(input).capabilityProfile });
	return isToolAllowedByPolicies(toolName, [...Object.values(policies), input.run.senderIsOwner === false && !isDevMode() ? { deny: [...GATEWAY_OWNER_ONLY_CORE_TOOLS] } : void 0]);
}
/** Browser identity matters to admission only while this turn can control the UI. */
function resolveReplyScreenToolTarget(input, preparedProfile) {
	return input.run.gatewayUiCommandTarget && hasGatewayClientCap(input.run.clientCaps, GATEWAY_CLIENT_CAPS.UI_COMMANDS) && isReplyToolAllowed(input, "screen", preparedProfile) ? input.run.gatewayUiCommandTarget : void 0;
}
/** Profile appearance remains requester-scoped even without browser control. */
function resolveReplyThemeProfileId(input, preparedProfile) {
	return input.run.gatewayUiCommandTarget?.profileId && isReplyToolAllowed(input, "theme", preparedProfile) ? input.run.gatewayUiCommandTarget.profileId : void 0;
}
const operatorAuthorityIdentities = resolveGlobalSingleton(Symbol.for("openclaw.replyOperatorAuthorityIdentities"), () => ({
	keys: /* @__PURE__ */ new WeakMap(),
	nextId: 1
}));
/** Compare original live owners without treating profile labels as authority. */
function resolveReplyOperatorAuthorityKey(authority) {
	if (!authority) return "";
	const identity = (value) => {
		let key = operatorAuthorityIdentities.keys.get(value);
		if (key === void 0) {
			key = operatorAuthorityIdentities.nextId++;
			operatorAuthorityIdentities.keys.set(value, key);
		}
		return key;
	};
	return JSON.stringify([
		authority.profileId,
		[...new Set(authority.scopes.map((scope) => scope.trim()).filter(Boolean))].toSorted(),
		identity(authority.source ?? authority)
	]);
}
function resolveReplyToolAuthorityInputFingerprint(snapshot, route) {
	const execution = snapshot.run;
	const { provider, model, capabilityProfile } = resolveReplyToolAuthorityContext(snapshot, route);
	return createHash("sha256").update(stableStringify({
		provider,
		model,
		policy: capabilityProfile.policy,
		operatorAuthority: resolveReplyOperatorAuthorityKey(snapshot.operatorAuthority),
		toolsAllow: snapshot.toolsAllow,
		toolsAllowIntersection: snapshot.toolsAllow ? readToolAllowlistIntersection(snapshot.toolsAllow) : void 0,
		disableTools: snapshot.disableTools === true,
		sessionFile: execution.sessionFile,
		agentDir: execution.agentDir,
		workspaceDir: execution.workspaceDir,
		cwd: execution.cwd,
		permissionMode: execution.permissionMode,
		toolOverrides: execution.toolOverrides,
		execOverrides: execution.execOverrides,
		elevatedLevel: execution.elevatedLevel,
		bashElevated: execution.bashElevated,
		traceAuthorized: execution.traceAuthorized === true,
		authProfileId: execution.authProfileId,
		clientCaps: [...new Set(execution.clientCaps ?? [])].toSorted(),
		gatewayUiCommandTarget: resolveReplyScreenToolTarget(snapshot, capabilityProfile),
		themeProfileId: resolveReplyThemeProfileId(snapshot, capabilityProfile),
		toolBindings: execution.toolBindings
	})).digest("hex");
}
/** Fingerprints the complete model-facing tool authority owned by one queued turn. */
function resolveFollowupRunToolAuthorityFingerprint(run, route) {
	return resolveReplyToolAuthorityInputFingerprint(snapshotFollowupRunToolAuthority(run), route);
}
/** Capture execution policy once; incoming overlays replace only caller-owned facts. */
function prepareReplyToolAuthority(run, narrow) {
	const snapshot = snapshotFollowupRunToolAuthority(run);
	return {
		fingerprint: (route) => resolveReplyToolAuthorityInputFingerprint(snapshot, route),
		project: (overlay, route) => {
			const incoming = applyReplyToolAuthorityOverlay(snapshot, overlay);
			return resolveReplyToolAuthorityInputFingerprint(narrow ? narrow(incoming) : incoming, route);
		}
	};
}
//#endregion
export { resolveReplyScreenToolTarget as a, resolveReplyOperatorAuthorityKey as i, resolveFollowupRunToolAuthorityFingerprint as n, resolveReplyThemeProfileId as o, resolveInboundReplyToolAuthorityOverlay as r, prepareReplyToolAuthority as t };
