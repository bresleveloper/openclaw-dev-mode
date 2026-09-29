import "./number-coercion-CLj0HTDM.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import "./paths-DehQwyE0.mjs";
import { E as parseThreadSessionSuffix, O as normalizeSessionKeyPreservingOpaquePeerIds, f as resolveThreadSessionKeys } from "./session-key-CBvmC8zz.mjs";
import "./types.secrets-B5xWSzLp.mjs";
import "./subsystem-DleLyu58.mjs";
import "./dedupe-wpcRBJWZ.mjs";
import { n as getChatChannelMeta, t as findChatChannelMeta } from "./chat-meta-CrZhPtTU.mjs";
import { l as emptyChannelConfigSchema } from "./config-schema-BJ55TtqJ.mjs";
import "./net-DU4aWKLv.mjs";
import "./tailscale-status-Dr51G8r4.mjs";
import "./secure-random-BJtJxP9Y.mjs";
import "./common-XfKigJno.mjs";
import "./delegate-CO9sIBsL.mjs";
import "./resolve-route-zfKT6ZcU.mjs";
import "./typebox-DIBvVmm8.mjs";
import { t as buildOutboundBaseSessionKey } from "./base-session-key-DYnhwAuL.mjs";
import { t as normalizeOutboundThreadId } from "./thread-id-q4UqJ0nc.mjs";
import "./secret-file-BqGFHdII.mjs";
import "./config-helpers--6MdZhMW.mjs";
import { t as buildAccountScopedDmSecurityPolicy } from "./helpers-t_ym8v5h.mjs";
import { r as createTopLevelChannelReplyToModeResolver, t as createScopedAccountReplyToModeResolver } from "./threading-helpers-CMXJIj4M.mjs";
import { i as createAttachedChannelResultAdapter } from "./channel-send-result-BFAnsv6z.mjs";
import { t as createCachedLazyValueGetter } from "./lazy-value-B2wh8onO.mjs";
import "./config-schema-c9utjSlx.mjs";
import "./plugin-entry-BOulgRcx.mjs";
import "./setup-helpers-gXEiNGC9.mjs";
import "./persistent-bindings.resolve-CI-K5lgA.mjs";
//#region src/plugin-sdk/core.ts
function createInlineTextPairingAdapter(params) {
	return {
		idLabel: params.idLabel,
		normalizeAllowEntry: params.normalizeAllowEntry,
		notifyApproval: async (ctx) => {
			await params.notify({
				...ctx,
				message: params.message
			});
		}
	};
}
/** Ensure a configured ACP binding has live runtime state before channel delivery uses it. */
async function ensureConfiguredAcpBindingReady(params) {
	return (await import("./persistent-bindings.lifecycle-BenBq1qy.mjs")).ensureConfiguredAcpBindingReadyCore(params);
}
function getChatChannelMetaForSdk(id) {
	return getChatChannelMeta(id);
}
/** Remove one of the known provider prefixes from a free-form target string. */
function stripChannelTargetPrefix(raw, ...providers) {
	const trimmed = raw.trim();
	for (const provider of providers) {
		const prefix = `${normalizeLowercaseStringOrEmpty(provider)}:`;
		if (normalizeLowercaseStringOrEmpty(trimmed).startsWith(prefix)) return trimmed.slice(prefix.length).trim();
	}
	return trimmed;
}
/** Remove generic target-kind prefixes such as `user:` or `group:`. */
function stripTargetKindPrefix(raw) {
	return raw.replace(/^(user|channel|group|conversation|room|dm):/i, "").trim();
}
/**
* Build the canonical outbound session route payload returned by channel
* message adapters.
*/
function buildChannelOutboundSessionRoute(params) {
	const baseSessionKey = buildOutboundBaseSessionKey({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: params.channel,
		accountId: params.accountId,
		peer: params.peer
	});
	return {
		sessionKey: baseSessionKey,
		baseSessionKey,
		...params.recipientSessionExact !== void 0 ? { recipientSessionExact: params.recipientSessionExact } : {},
		peer: params.peer,
		chatType: params.chatType,
		from: params.from,
		to: params.to,
		...params.threadId !== void 0 ? { threadId: params.threadId } : {}
	};
}
/** Recover the current thread id when the current session belongs to the same base route. */
function recoverCurrentThreadSessionId(params) {
	const current = parseThreadSessionSuffix(params.currentSessionKey);
	if (!current.baseSessionKey || !current.threadId) return;
	if (normalizeSessionKeyPreservingOpaquePeerIds(current.baseSessionKey) !== normalizeSessionKeyPreservingOpaquePeerIds(params.route.baseSessionKey)) return;
	const context = {
		route: params.route,
		currentBaseSessionKey: current.baseSessionKey,
		currentThreadId: current.threadId
	};
	if (params.canRecover && !params.canRecover(context)) return;
	return current.threadId;
}
/** Add thread-aware session keys and route thread ids to an outbound channel route. */
function buildThreadAwareOutboundSessionRoute(params) {
	const recoveredThreadId = recoverCurrentThreadSessionId({
		route: params.route,
		currentSessionKey: params.currentSessionKey,
		canRecover: params.canRecoverCurrentThread
	});
	const candidates = {
		replyToId: resolveThreadAwareOutboundCandidate(params.replyToId),
		threadId: resolveThreadAwareOutboundCandidate(params.threadId),
		currentSession: resolveThreadAwareOutboundCandidate(recoveredThreadId)
	};
	const candidate = (params.precedence ?? [
		"replyToId",
		"threadId",
		"currentSession"
	]).map((source) => candidates[source]).find(Boolean);
	const threadKeys = resolveThreadSessionKeys({
		baseSessionKey: params.route.baseSessionKey,
		threadId: candidate?.sessionThreadId,
		parentSessionKey: candidate ? params.parentSessionKey : void 0,
		useSuffix: params.useSuffix,
		normalizeThreadId: params.normalizeThreadId
	});
	return {
		...params.route,
		sessionKey: threadKeys.sessionKey,
		...candidate !== void 0 ? { threadId: candidate.routeThreadId } : {}
	};
}
function resolveThreadAwareOutboundCandidate(threadId) {
	const sessionThreadId = normalizeOutboundThreadId(threadId);
	if (sessionThreadId === void 0) return;
	return {
		routeThreadId: typeof threadId === "number" ? threadId : sessionThreadId,
		sessionThreadId
	};
}
/**
* Canonical entry helper for channel plugins.
*
* Registers the channel capability and optionally exposes full-runtime hooks
* such as tools or gateway handlers outside setup-only registration modes.
*/
function defineChannelPluginEntry({ id, name, description, plugin, configSchema, setRuntime, registerCliMetadata, registerFull, registerCapabilities }) {
	const getConfigSchema = createCachedLazyValueGetter(configSchema ?? emptyChannelConfigSchema);
	return {
		id,
		name,
		description,
		get configSchema() {
			return getConfigSchema();
		},
		register(api) {
			if (api.registrationMode === "cli-metadata") {
				registerCliMetadata?.(api);
				return;
			}
			if (api.registrationMode === "tool-discovery") {
				registerFull?.(api);
				registerCapabilities?.(api);
				return;
			}
			api.registerChannel({ plugin });
			setRuntime?.(api.runtime);
			if (api.registrationMode === "discovery") {
				registerCliMetadata?.(api);
				registerCapabilities?.(api);
				return;
			}
			if (api.registrationMode !== "full") return;
			registerCliMetadata?.(api);
			registerFull?.(api);
			registerCapabilities?.(api);
		},
		channelPlugin: plugin,
		...setRuntime ? { setChannelRuntime: setRuntime } : {}
	};
}
/**
* Minimal setup-entry helper for channels that ship a separate `setup-entry.ts`.
*
* The setup entry only needs to export `{ plugin }`, but using this helper
* keeps the shape explicit in examples and generated typings.
*/
function defineSetupPluginEntry(plugin) {
	return { plugin };
}
function resolveChatChannelSecurity(security) {
	if (!security) return;
	if (!("dm" in security)) return security;
	return {
		resolveDmPolicy: ({ cfg, accountId, account }) => buildAccountScopedDmSecurityPolicy({
			cfg,
			channelKey: security.dm.channelKey,
			accountId,
			fallbackAccountId: security.dm.resolveFallbackAccountId?.(account) ?? account.accountId,
			policy: security.dm.resolvePolicy(account),
			allowFrom: security.dm.resolveAllowFrom(account) ?? [],
			defaultPolicy: security.dm.defaultPolicy,
			allowFromPathSuffix: security.dm.allowFromPathSuffix,
			policyPathSuffix: security.dm.policyPathSuffix,
			approveChannelId: security.dm.approveChannelId,
			approveHint: security.dm.approveHint,
			normalizeEntry: security.dm.normalizeEntry,
			classifyEntryAuthentication: security.dm.classifyEntryAuthentication,
			inheritSharedDefaultsFromDefaultAccount: security.dm.inheritSharedDefaultsFromDefaultAccount
		}),
		...security.dmRouting ? { dmRouting: security.dmRouting } : {},
		...security.collectWarnings ? { collectWarnings: security.collectWarnings } : {},
		...security.collectAuditFindings ? { collectAuditFindings: security.collectAuditFindings } : {}
	};
}
function resolveChatChannelPairing(pairing) {
	if (!pairing) return;
	if (!("text" in pairing)) return pairing;
	return createInlineTextPairingAdapter(pairing.text);
}
function resolveChatChannelThreading(threading) {
	if (!threading) return;
	if (!("topLevelReplyToMode" in threading) && !("scopedAccountReplyToMode" in threading)) return threading;
	let resolveReplyToMode;
	if ("topLevelReplyToMode" in threading) resolveReplyToMode = createTopLevelChannelReplyToModeResolver(threading.topLevelReplyToMode);
	else resolveReplyToMode = createScopedAccountReplyToModeResolver(threading.scopedAccountReplyToMode);
	return {
		...threading,
		resolveReplyToMode
	};
}
function resolveChatChannelOutbound(outbound) {
	if (!outbound) return;
	if (!("attachedResults" in outbound)) return outbound;
	return {
		...outbound.base,
		...createAttachedChannelResultAdapter(outbound.attachedResults)
	};
}
/**
* Build a chat-style channel plugin by composing common security, pairing,
* threading, and outbound adapters around a channel-specific base.
*/
function createChatChannelPlugin(params) {
	return {
		...params.base,
		capabilities: params.base.capabilities ?? { chatTypes: ["direct"] },
		conversationBindings: {
			supportsCurrentConversationBinding: true,
			...params.base.conversationBindings
		},
		...params.security ? { security: resolveChatChannelSecurity(params.security) } : {},
		...params.pairing ? { pairing: resolveChatChannelPairing(params.pairing) } : {},
		...params.threading ? { threading: resolveChatChannelThreading(params.threading) } : {},
		...params.outbound ? { outbound: resolveChatChannelOutbound(params.outbound) } : {}
	};
}
/** Create the shared base object for channel plugins that override only selected surfaces. */
function createChannelPluginBase(params) {
	return {
		id: params.id,
		meta: {
			...findChatChannelMeta(params.id),
			...params.meta,
			id: params.id
		},
		...params.setupWizard ? { setupWizard: params.setupWizard } : {},
		...params.capabilities ? { capabilities: params.capabilities } : {},
		...params.commands ? { commands: params.commands } : {},
		...params.doctor ? { doctor: params.doctor } : {},
		...params.agentPrompt ? { agentPrompt: params.agentPrompt } : {},
		...params.streaming ? { streaming: params.streaming } : {},
		...params.reload ? { reload: params.reload } : {},
		...params.gatewayMethods ? { gatewayMethods: params.gatewayMethods } : {},
		...params.gatewayMethodDescriptors ? { gatewayMethodDescriptors: params.gatewayMethodDescriptors } : {},
		...params.configSchema ? { configSchema: params.configSchema } : {},
		...params.config ? { config: params.config } : {},
		...params.security ? { security: params.security } : {},
		...params.groups ? { groups: params.groups } : {},
		...params.setup ? { setup: params.setup } : {},
		...params.setupContract ? { setupContract: params.setupContract } : {}
	};
}
//#endregion
export { defineChannelPluginEntry as a, getChatChannelMetaForSdk as c, stripTargetKindPrefix as d, createChatChannelPlugin as i, recoverCurrentThreadSessionId as l, buildThreadAwareOutboundSessionRoute as n, defineSetupPluginEntry as o, createChannelPluginBase as r, ensureConfiguredAcpBindingReady as s, buildChannelOutboundSessionRoute as t, stripChannelTargetPrefix as u };
