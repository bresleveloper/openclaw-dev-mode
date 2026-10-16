import "./number-coercion-CuVhdCBs.mjs";
import "./types.secrets-DsPRn9Dz.mjs";
import "./paths-DGIwWbpu.mjs";
import "./subsystem-I-uqdx4f.mjs";
import { A as normalizeSessionKeyPreservingOpaquePeerIds, O as parseThreadSessionSuffix, f as resolveThreadSessionKeys } from "./session-key-C09ow4h0.mjs";
import "./dedupe-qhwfyIea.mjs";
import { a as findChatChannelMeta, o as getChatChannelMeta } from "./registry-B3Y-vjit.mjs";
import "./secure-random-Dimnnrm0.mjs";
import { l as emptyChannelConfigSchema } from "./config-schema-Be-FohaC.mjs";
import "./net-C6WEu3pd.mjs";
import "./common-Dyxcwsy8.mjs";
import "./resolve-route-Bzb6opva.mjs";
import "./delegate-De1J04Oe.mjs";
import { t as buildOutboundBaseSessionKey } from "./base-session-key-DjXKFR-f.mjs";
import { t as normalizeOutboundThreadId } from "./thread-id-DdoOCDBe.mjs";
import "./secret-file-B_nJw6pE.mjs";
import "./typebox-X-jU33BZ.mjs";
import "./config-helpers-Ch_BBBFF.mjs";
import { t as buildAccountScopedDmSecurityPolicy } from "./helpers-Bm4RKejp.mjs";
import { r as createTextPairingAdapter } from "./pairing-adapters-Btd3dlBp.mjs";
import { r as createTopLevelChannelReplyToModeResolver, t as createScopedAccountReplyToModeResolver } from "./threading-helpers-CMXJIj4M.mjs";
import { i as createAttachedChannelResultAdapter } from "./channel-send-result-BFAnsv6z.mjs";
import { t as createCachedLazyValueGetter } from "./lazy-value-B2wh8onO.mjs";
import "./config-schema-BBtylDlH.mjs";
import "./plugin-entry-2l_2QeB2.mjs";
import "./tailscale-status-BA6JQcBe.mjs";
import "./setup-helpers-CDK4xLs4.mjs";
import "./persistent-bindings.resolve-BCmDv-WD.mjs";
import "./chat-target-prefixes-C7_cZj_-.mjs";
//#region src/plugin-sdk/core.ts
/** Ensure a configured ACP binding has live runtime state before channel delivery uses it. */
async function ensureConfiguredAcpBindingReady(params) {
	return (await import("./persistent-bindings.lifecycle-Brpf9gUe.mjs")).ensureConfiguredAcpBindingReadyCore(params);
}
function getChatChannelMetaForSdk(id) {
	return getChatChannelMeta(id);
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
	return "text" in pairing ? createTextPairingAdapter(pairing.text) : pairing;
}
function resolveChatChannelThreading(threading) {
	if (!("topLevelReplyToMode" in threading) && !("scopedAccountReplyToMode" in threading)) return threading;
	const resolveReplyToMode = "topLevelReplyToMode" in threading ? createTopLevelChannelReplyToModeResolver(threading.topLevelReplyToMode) : createScopedAccountReplyToModeResolver(threading.scopedAccountReplyToMode);
	return {
		...threading,
		resolveReplyToMode
	};
}
function resolveChatChannelOutbound(outbound) {
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
export { defineChannelPluginEntry as a, getChatChannelMetaForSdk as c, createChatChannelPlugin as i, recoverCurrentThreadSessionId as l, buildThreadAwareOutboundSessionRoute as n, defineSetupPluginEntry as o, createChannelPluginBase as r, ensureConfiguredAcpBindingReady as s, buildChannelOutboundSessionRoute as t };
