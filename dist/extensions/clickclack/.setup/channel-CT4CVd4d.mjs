import { _ as DEFAULT_ACCOUNT_ID, b as resolveClickClackAccount, c as resolveWorkspaceId, f as normalizeClickClackCorrelationId, g as clickClackMeta, h as clickClackConfigAdapter, l as ClickClackHttpError, m as CLICKCLACK_CHANNEL_ID, n as clickClackSetupContract, p as clickClackConfigSchema, s as resolveChannelId, t as clickClackSetupWizard, u as createClickClackClient, y as listEnabledClickClackAccounts } from "./setup-surface-BBl3rvVx.mjs";
import { n as collectRuntimeConfigAssignments, r as secretTargetRegistryEntries } from "./secret-contract-BKkzzjBA.mjs";
import { resolveChannelMediaMaxBytes } from "openclaw/plugin-sdk/account-helpers";
import { parseDateStringTimestampMs } from "openclaw/plugin-sdk/number-runtime";
import { mergePairLoopGuardConfig } from "openclaw/plugin-sdk/pair-loop-guard-runtime";
import { readStringField } from "openclaw/plugin-sdk/string-coerce-runtime";
import { buildChannelOutboundSessionRoute, buildThreadAwareOutboundSessionRoute, createChatChannelPlugin } from "openclaw/plugin-sdk/channel-core";
import { buildChannelProgressDraftLine, createChannelMessageReplyPipeline, createMessageReceiptFromOutboundResults, defineChannelMessageAdapter, deriveDurableFinalDeliveryRequirements, formatChannelProgressDraftLineForEntry, isCompleteAgentPreamble } from "openclaw/plugin-sdk/channel-outbound";
import { createComputedAccountStatusAdapter, createDefaultChannelRuntimeState } from "openclaw/plugin-sdk/status-helpers";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { channelReadyPatch, channelStoppedPatch } from "openclaw/plugin-sdk/gateway-runtime";
import { sleepWithAbort } from "openclaw/plugin-sdk/runtime-env";
import { rawDataToString } from "openclaw/plugin-sdk/webhook-ingress";
import { normalizeAgentId } from "openclaw/plugin-sdk/routing";
import { createHash, randomUUID } from "node:crypto";
import { truncateCodePoints } from "openclaw/plugin-sdk/text-utility-runtime";
import { buildMentionRegexes, normalizeMentionText } from "openclaw/plugin-sdk/channel-mention-gating";
import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
import { listNativeCommandSpecsForConfig } from "openclaw/plugin-sdk/native-command-registry";
import { buildChannelInboundEventContext, createChannelInboundEnvelopeBuilder, createChannelPartialDeliveryError, recordChannelBotPairLoopAndCheckSuppression } from "openclaw/plugin-sdk/channel-inbound";
import { extensionForMime } from "openclaw/plugin-sdk/media-mime";
import { loadOutboundMediaFromUrl } from "openclaw/plugin-sdk/outbound-media";
import { FormatCapabilityProfile, renderMarkdownWithMarkers, sanitizeAssistantVisibleText } from "openclaw/plugin-sdk/text-chunking";
//#region extensions/clickclack/src/discussions/binding-generation.ts
const GENERATION_STORE_OPTIONS = {
	namespace: "discussion-binding-generations",
	maxEntries: 1e4,
	overflowPolicy: "reject-new"
};
const storesByRuntime$2 = /* @__PURE__ */ new WeakMap();
function withGenerationStore(runtime, run) {
	let owner = storesByRuntime$2.get(runtime);
	if (!owner) {
		const store = runtime.state.openKeyedStore(GENERATION_STORE_OPTIONS);
		owner = {
			store,
			...!store.observe || !store.compareAndApply ? { native: runtime.state.openSyncKeyedStore(GENERATION_STORE_OPTIONS) } : {},
			tail: Promise.resolve()
		};
		storesByRuntime$2.set(runtime, owner);
	}
	const currentOwner = owner;
	const current = owner.tail.then(() => run(currentOwner));
	owner.tail = current.then(() => void 0, () => void 0);
	return current;
}
function mutateGeneration(runtime, sessionKey, decide) {
	return withGenerationStore(runtime, async ({ store, native }) => {
		if (native) {
			const current = native.lookup(sessionKey);
			const next = decide(current);
			if (next.value !== current) {
				if (next.value) native.register(sessionKey, next.value);
				else native.delete(sessionKey);
			}
			return next.result;
		}
		const { observe, compareAndApply } = store;
		if (!observe || !compareAndApply) throw new Error("ClickClack generation comparison capabilities changed");
		let observed = await observe(sessionKey);
		for (;;) {
			const next = decide(observed.value);
			const outcome = await compareAndApply(sessionKey, observed.comparison, next.value === observed.value ? {
				operation: "update",
				action: "keep"
			} : next.value ? {
				operation: "update",
				action: "set",
				value: next.value
			} : {
				operation: "delete",
				action: "delete"
			});
			if (outcome.status !== "conflict") return next.result;
			observed = outcome.current;
		}
	});
}
/** Reserves a generation so an interrupted channel create can be adopted on retry. */
function reserveDiscussionBindingGeneration(params) {
	let generation;
	return mutateGeneration(params.runtime, params.sessionKey, (existing) => {
		const existingAccountId = existing?.accountId ?? existing?.pending?.accountId;
		const existingCredentialFingerprint = existing?.credentialFingerprint ?? existing?.pending?.credentialFingerprint;
		if (existing?.destinationIdentity === params.destinationIdentity && existingAccountId === params.accountId && existingCredentialFingerprint === params.credentialFingerprint) return {
			value: existing.accountId && existing.credentialFingerprint ? existing : {
				...existing,
				accountId: params.accountId,
				credentialFingerprint: params.credentialFingerprint
			},
			result: existing.generation
		};
		generation ??= (params.createGeneration ?? randomUUID)();
		return {
			value: {
				accountId: params.accountId,
				credentialFingerprint: params.credentialFingerprint,
				destinationIdentity: params.destinationIdentity,
				generation
			},
			result: generation
		};
	});
}
/** Clears only the completed reservation; future opens must mint a new ownership ref. */
function clearDiscussionBindingGeneration(params) {
	return mutateGeneration(params.runtime, params.sessionKey, (existing) => ({
		value: existing && params.expectedGeneration && existing.generation !== params.expectedGeneration ? existing : void 0,
		result: void 0
	}));
}
/** Quarantines a destination before the first fallible channel create. */
function recordPendingDiscussionOpen(params) {
	return mutateGeneration(params.runtime, params.sessionKey, (existing) => {
		if (!existing || existing.generation !== params.generation) throw new Error("ClickClack discussion generation changed before channel creation");
		if (existing.accountId !== params.pending.accountId || existing.credentialFingerprint !== params.pending.credentialFingerprint) throw new Error("ClickClack discussion ownership changed before channel creation");
		return {
			value: {
				...existing,
				pending: params.pending
			},
			result: void 0
		};
	});
}
function listPendingDiscussionOpens(runtime) {
	return withGenerationStore(runtime, async ({ store }) => (await store.entries()).flatMap((entry) => entry.value.pending ? [{
		sessionKey: entry.key,
		generation: entry.value.generation,
		...entry.value.pending
	}] : []));
}
/** Stops destination-wide quarantine after the exact remote channel is known. */
function clearPendingDiscussionOpen(params) {
	return mutateGeneration(params.runtime, params.sessionKey, (existing) => {
		if (!existing || existing.generation !== params.expectedGeneration || !existing.pending) return {
			value: existing,
			result: void 0
		};
		return {
			value: {
				accountId: existing.accountId ?? existing.pending.accountId,
				credentialFingerprint: existing.credentialFingerprint ?? existing.pending.credentialFingerprint,
				destinationIdentity: existing.destinationIdentity,
				generation: existing.generation
			},
			result: void 0
		};
	});
}
async function hasPendingDiscussionOpenForDestination(params) {
	const serverBaseUrl = params.serverBaseUrl.replace(/\/+$/u, "");
	return (await listPendingDiscussionOpens(params.runtime)).some((pending) => pending.serverBaseUrl === serverBaseUrl && pending.workspaceId === params.workspaceId);
}
//#endregion
//#region extensions/clickclack/src/discussions/naming.ts
function shortSessionHash(sessionKey) {
	return createHash("sha256").update(sessionKey).digest("hex").slice(0, 32);
}
function slugifyLabel(label) {
	return label.normalize("NFKD").replace(/[\u0300-\u036f]/gu, "").toLowerCase().replace(/[^a-z0-9]+/gu, "-").replace(/^-+|-+$/gu, "").slice(0, 80).replace(/-+$/gu, "");
}
function fallbackDiscussionLabel(sessionKey, agentId) {
	const agentSegment = agentId?.trim() ? slugifyLabel(agentId) : "";
	const hash = shortSessionHash(sessionKey).slice(0, 8);
	return `s-${agentSegment ? `${agentSegment}-` : ""}${hash}`;
}
function resolveDiscussionLabel(entry, sessionKey, agentId) {
	return entry.label?.trim() || entry.displayName?.trim() || entry.subject?.trim() || fallbackDiscussionLabel(sessionKey, agentId);
}
function truncateDiscussionDisplayTitle(label) {
	return truncateCodePoints(label, 200).trim();
}
function slugifyDiscussionLabel(label, sessionKey) {
	return slugifyLabel(label) || fallbackDiscussionLabel(sessionKey);
}
function discussionSessionPeerId(identity) {
	return `disc-${createHash("sha256").update([
		identity.mainSessionKey,
		identity.sessionId,
		identity.serverBaseUrl,
		identity.channelId,
		identity.externalRef
	].join("\0")).digest("hex").slice(0, 32)}`;
}
function isDiscussionSessionKey(sessionKey) {
	return sessionKey.includes(":clickclack:") && /:channel:disc-[0-9a-f]{32}$/u.test(sessionKey);
}
function discussionExternalRef(installationId, mainSessionKey, destinationIdentity, bindingGeneration) {
	return `openclaw:${installationId}:${shortSessionHash([
		mainSessionKey,
		destinationIdentity,
		bindingGeneration
	].join("\0"))}`;
}
function discussionCredentialFingerprint(token) {
	return createHash("sha256").update(token).digest("hex");
}
function discussionSessionKey(params) {
	return params.runtime.channel.routing.buildAgentSessionKey({
		agentId: params.agentId,
		channel: "clickclack",
		accountId: params.accountId,
		peer: {
			kind: "channel",
			id: discussionSessionPeerId(params)
		}
	});
}
//#endregion
//#region extensions/clickclack/src/discussions/binding-store.ts
function bindingMatchesActiveSessionIncarnation(runtime, sessionKey, binding) {
	const entry = runtime.agent.session.getSessionEntry({
		sessionKey,
		readConsistency: "latest"
	});
	return Boolean(entry && binding.sessionId && entry.sessionId === binding.sessionId && entry.archivedAt === void 0);
}
/**
* Refresh the replaceable session attachment without changing the durable room identity.
* The store registers persisted state before reindexing, so a failed write leaves the
* previous attachment authoritative in both persistence and memory.
*/
function attachBindingToCurrentActiveSession(params) {
	const entry = params.runtime.agent.session.getSessionEntry({
		sessionKey: params.sessionKey,
		readConsistency: "latest"
	});
	if (!entry?.sessionId || entry.archivedAt !== void 0) return;
	if (entry.sessionId === params.binding.sessionId) {
		if (params.binding.detachedAt === void 0) return params.binding;
		const { detachedAt: _detachedAt, ...attached } = params.binding;
		params.store.set(params.sessionKey, attached);
		return attached;
	}
	const { detachedAt: _detachedAt, ...retained } = params.binding;
	const attached = {
		...retained,
		sessionId: entry.sessionId
	};
	params.store.set(params.sessionKey, attached);
	return attached;
}
const DISCUSSION_BINDINGS_NAMESPACE = "discussion-bindings";
const MAX_DISCUSSION_BINDINGS = 1e4;
const MAX_RETAINED_DETACHED_DISCUSSION_BINDINGS = 1e3;
const storesByRuntime$1 = /* @__PURE__ */ new WeakMap();
function channelKey(serverBaseUrl, channelId) {
	return `${serverBaseUrl.replace(/\/+$/u, "")}\0${channelId}`;
}
/** SQLite-backed session/channel bindings with a process-local inbound lookup index. */
var ClickClackDiscussionBindingStore = class {
	#store;
	#sessionByChannel = /* @__PURE__ */ new Map();
	#mainByDiscussionSession = /* @__PURE__ */ new Map();
	#detachedAtBySession = /* @__PURE__ */ new Map();
	#runtime;
	constructor(runtime) {
		this.#runtime = runtime;
		this.#store = runtime.state.openSyncKeyedStore({
			namespace: DISCUSSION_BINDINGS_NAMESPACE,
			maxEntries: MAX_DISCUSSION_BINDINGS,
			overflowPolicy: "reject-new"
		});
		for (const entry of this.#store.entries()) this.#index(entry.key, entry.value);
	}
	get(sessionKey) {
		return this.#store.lookup(sessionKey);
	}
	hasCapacity(sessionKey) {
		return this.get(sessionKey) !== void 0 || this.count() < MAX_DISCUSSION_BINDINGS;
	}
	getByChannel(serverBaseUrl, channelId) {
		const key = channelKey(serverBaseUrl, channelId);
		const sessionKey = this.#sessionByChannel.get(key);
		if (!sessionKey) return;
		const binding = this.get(sessionKey);
		if (!binding) {
			this.#sessionByChannel.delete(key);
			return;
		}
		return {
			sessionKey,
			binding
		};
	}
	set(sessionKey, binding) {
		const previous = this.get(sessionKey);
		this.#store.register(sessionKey, binding);
		if (previous) this.#unindex(sessionKey, previous);
		this.#index(sessionKey, binding);
	}
	delete(sessionKey) {
		const previous = this.get(sessionKey);
		const deleted = this.#store.delete(sessionKey);
		if (deleted && previous) this.#unindex(sessionKey, previous);
		return deleted;
	}
	getByDiscussionSession(sideSessionKey) {
		const sessionKey = this.#mainByDiscussionSession.get(sideSessionKey);
		if (!sessionKey) return;
		const binding = this.get(sessionKey);
		return binding ? {
			sessionKey,
			binding
		} : void 0;
	}
	entries() {
		return this.#store.entries().map((entry) => ({
			sessionKey: entry.key,
			binding: entry.value
		}));
	}
	count() {
		return this.#store.count?.() ?? this.#store.entries().length;
	}
	detachedCount() {
		return this.#detachedAtBySession.size;
	}
	oldestDetached() {
		let oldestSessionKey;
		let oldestDetachedAt = Number.POSITIVE_INFINITY;
		for (const [sessionKey, detachedAt] of this.#detachedAtBySession) if (detachedAt < oldestDetachedAt || detachedAt === oldestDetachedAt && (oldestSessionKey === void 0 || sessionKey < oldestSessionKey)) {
			oldestSessionKey = sessionKey;
			oldestDetachedAt = detachedAt;
		}
		if (!oldestSessionKey) return;
		const binding = this.get(oldestSessionKey);
		if (!binding || binding.detachedAt === void 0) {
			this.#detachedAtBySession.delete(oldestSessionKey);
			return this.oldestDetached();
		}
		return {
			sessionKey: oldestSessionKey,
			binding
		};
	}
	#index(sessionKey, binding) {
		this.#sessionByChannel.set(channelKey(binding.serverBaseUrl, binding.channelId), sessionKey);
		const sideSessionKey = discussionSessionKey({
			runtime: this.#runtime,
			agentId: binding.agentId,
			mainSessionKey: sessionKey,
			sessionId: binding.sessionId,
			accountId: binding.accountId,
			serverBaseUrl: binding.serverBaseUrl,
			channelId: binding.channelId,
			externalRef: binding.externalRef
		});
		if (sideSessionKey) this.#mainByDiscussionSession.set(sideSessionKey, sessionKey);
		if (binding.detachedAt !== void 0) this.#detachedAtBySession.set(sessionKey, binding.detachedAt);
	}
	#unindex(sessionKey, binding) {
		this.#sessionByChannel.delete(channelKey(binding.serverBaseUrl, binding.channelId));
		const sideSessionKey = discussionSessionKey({
			runtime: this.#runtime,
			agentId: binding.agentId,
			mainSessionKey: sessionKey,
			sessionId: binding.sessionId,
			accountId: binding.accountId,
			serverBaseUrl: binding.serverBaseUrl,
			channelId: binding.channelId,
			externalRef: binding.externalRef
		});
		if (sideSessionKey) this.#mainByDiscussionSession.delete(sideSessionKey);
		this.#detachedAtBySession.delete(sessionKey);
	}
};
function getClickClackDiscussionBindingStore(runtime) {
	const existing = storesByRuntime$1.get(runtime);
	if (existing) return existing;
	const created = new ClickClackDiscussionBindingStore(runtime);
	storesByRuntime$1.set(runtime, created);
	return created;
}
//#endregion
//#region extensions/clickclack/src/discussions/eligibility.ts
function discussionAccounts(cfg) {
	return listEnabledClickClackAccounts(cfg).filter((account) => account.configured && account.discussions.enabled);
}
function normalizedServerBaseUrl(account) {
	return account.baseUrl.replace(/\/+$/u, "");
}
/** Resolves the sole live account and rejects bindings pinned to an older destination. */
function resolveDiscussionBindingAccount(cfg, binding) {
	const accounts = discussionAccounts(cfg);
	if (accounts.length !== 1) return { state: "unavailable" };
	const account = accounts[0];
	if (!account) return { state: "unavailable" };
	if (account.accountId !== binding.accountId || normalizedServerBaseUrl(account) !== binding.serverBaseUrl || account.discussions.workspace !== binding.workspaceRef || binding.credentialFingerprint !== void 0 && discussionCredentialFingerprint(account.token) !== binding.credentialFingerprint) return {
		state: "stale",
		account
	};
	return {
		state: "active",
		account
	};
}
/** Public embed/open URLs for one bound discussion channel. */
function discussionInfoForBinding(binding, account) {
	const baseUrl = normalizedServerBaseUrl(account);
	return {
		state: "open",
		embedUrl: `${baseUrl}/embed/channel/${encodeURIComponent(binding.workspaceRouteId)}/${encodeURIComponent(binding.channelRouteId)}?openclawHostTheme=1`,
		openUrl: `${baseUrl}/app/${encodeURIComponent(binding.workspaceRouteId)}/${encodeURIComponent(binding.channelRouteId)}`
	};
}
//#endregion
//#region extensions/clickclack/src/discussions/revoked-channel-store.ts
const REVOKED_CHANNELS_NAMESPACE = "discussion-revoked-channels";
const MAX_REVOKED_CHANNELS = 1e5;
const storesByRuntime = /* @__PURE__ */ new WeakMap();
function revokedChannelKey(params) {
	return [params.serverBaseUrl.replace(/\/+$/u, ""), params.channelId].join("\0");
}
function getStore(runtime) {
	const existing = storesByRuntime.get(runtime);
	if (existing) return existing;
	const created = runtime.state.openSyncKeyedStore({
		namespace: REVOKED_CHANNELS_NAMESPACE,
		maxEntries: MAX_REVOKED_CHANNELS,
		overflowPolicy: "reject-new"
	});
	storesByRuntime.set(runtime, created);
	return created;
}
/** Records managed ownership before its live binding is released. */
function markClickClackDiscussionChannelRevoked(runtime, binding) {
	const value = {
		accountId: binding.accountId,
		serverBaseUrl: binding.serverBaseUrl,
		channelId: binding.channelId,
		revokedAt: Date.now()
	};
	getStore(runtime).register(revokedChannelKey(value), value);
}
function markClickClackDiscussionChannelIdentityRevoked(params) {
	const value = {
		accountId: params.accountId,
		serverBaseUrl: params.serverBaseUrl.replace(/\/+$/u, ""),
		channelId: params.channelId,
		revokedAt: Date.now()
	};
	getStore(params.runtime).register(revokedChannelKey(value), value);
}
function clearClickClackDiscussionChannelRevoked(params) {
	getStore(params.runtime).delete(revokedChannelKey(params));
}
/** Distinguishes a released managed channel from a genuinely ordinary channel. */
function isClickClackDiscussionChannelRevoked(params) {
	return Boolean(getStore(params.runtime).lookup(revokedChannelKey(params)));
}
//#endregion
//#region extensions/clickclack/src/discussions/routing.ts
async function resolveClickClackDiscussionRoute(params) {
	const store = getClickClackDiscussionBindingStore(params.runtime);
	let matched = store.getByChannel(params.serverBaseUrl, params.channelId);
	let pending = false;
	if (!matched) {
		pending = await hasPendingDiscussionOpenForDestination(params);
		matched = store.getByChannel(params.serverBaseUrl, params.channelId);
	}
	if (isClickClackDiscussionChannelRevoked(params)) return { state: "revoked" };
	if (!matched) return { state: pending ? "revoked" : "unbound" };
	if (matched.binding.accountId !== params.accountId) return { state: "revoked" };
	if (matched.binding.serverBaseUrl !== params.serverBaseUrl.replace(/\/+$/u, "")) return { state: "revoked" };
	if (resolveDiscussionBindingAccount(params.runtime.config.current(), matched.binding).state !== "active") return { state: "revoked" };
	let binding;
	try {
		binding = attachBindingToCurrentActiveSession({
			runtime: params.runtime,
			store,
			sessionKey: matched.sessionKey,
			binding: matched.binding
		});
	} catch (error) {
		params.runtime.logging.getChildLogger({
			plugin: "clickclack",
			feature: "discussions"
		}).warn(`discussion attachment refresh failed for channel ${params.channelId}: ${String(error)}`);
		return { state: "revoked" };
	}
	if (!binding) return { state: "revoked" };
	const sessionKey = discussionSessionKey({
		runtime: params.runtime,
		agentId: binding.agentId,
		mainSessionKey: matched.sessionKey,
		sessionId: binding.sessionId,
		accountId: params.accountId,
		serverBaseUrl: binding.serverBaseUrl,
		channelId: binding.channelId,
		externalRef: binding.externalRef
	});
	if (!sessionKey) return { state: "revoked" };
	return {
		state: "active",
		route: {
			agentId: binding.agentId,
			sessionKey,
			systemPrompt: [
				"You are the side agent for a ClickClack discussion attached to an OpenClaw session.",
				`The main session key is ${matched.sessionKey}.`,
				"Observe it with sessions_history and session_status (using changesSince for incremental checks).",
				"Use sessions_send to relay or steer the main session only when the humans in this discussion ask you to.",
				"These session tools are host-scoped to the attached main session; do not attempt session discovery or alternate targets."
			].join(" ")
		}
	};
}
//#endregion
//#region extensions/clickclack/src/group-policy.ts
/**
* Resolves bot-authored message policy using the same exact, wildcard, and
* account-level precedence as mention gating.
*/
function resolveClickClackBotPolicy(params) {
	const { account, channelId } = params;
	const channelKey = channelId?.trim();
	const groups = channelKey ? account.groups : void 0;
	const wildcard = groups?.["*"];
	const exact = channelKey ? groups?.[channelKey] : void 0;
	return {
		allowBots: exact?.allowBots ?? wildcard?.allowBots ?? account.allowBots ?? false,
		botLoopProtection: mergePairLoopGuardConfig(account.botLoopProtection, wildcard?.botLoopProtection, exact?.botLoopProtection)
	};
}
/**
* Resolves the effective group policy for a ClickClack channel.
*
* Lookup order:
*  1. Exact channel ID in `groups`
*  2. Wildcard `'*'` entry in `groups`
*  3. Account-level `requireMention` / `mentionPatterns`
*  4. Backward-compatible default: { requireMention: false, mentionPatterns: [] }
*/
function resolveClickClackGroupPolicy(params) {
	const { account, channelId } = params;
	const accountPolicy = {
		requireMention: account.requireMention === true,
		mentionPatterns: account.mentionPatterns ?? []
	};
	const channelKey = channelId?.trim();
	const groups = channelKey ? account.groups : void 0;
	const wildcard = groups?.["*"];
	const exact = channelKey ? groups?.[channelKey] : void 0;
	return {
		requireMention: exact?.requireMention ?? wildcard?.requireMention ?? accountPolicy.requireMention,
		mentionPatterns: exact?.mentionPatterns ?? wildcard?.mentionPatterns ?? accountPolicy.mentionPatterns
	};
}
//#endregion
//#region extensions/clickclack/src/mention-facts.ts
/**
* Detects whether a ClickClack group message contains a direct mention of the
* current account.
*
* Pure helper – no side effects, no runtime imports.
*/
const CLICKCLACK_MENTION_PATTERN = /(?:^|[^a-z0-9_@-])@([a-z0-9][a-z0-9_-]{1,31})(?![a-z0-9_-])/giu;
function buildLocalMentionRegexes(params) {
	if (params.mentionPatterns.length === 0) return [];
	const cfg = params.cfg;
	const syntheticCfg = {
		...cfg,
		messages: {
			...cfg?.messages,
			groupChat: {
				...cfg?.messages?.groupChat,
				mentionPatterns: params.mentionPatterns
			}
		}
	};
	return buildMentionRegexes(syntheticCfg, void 0, {
		provider: "clickclack",
		conversationId: params.channelId
	});
}
function resolveMentionHandles(body) {
	return [...body.matchAll(CLICKCLACK_MENTION_PATTERN)].map((match) => match[1]?.toLowerCase()).filter((handle) => Boolean(handle));
}
/**
* Builds mention facts for a ClickClack message.
*
* Rules:
* - DMs always have canDetectMention: false, wasMentioned: false
*   (DMs bypass mention gating).
* - Group messages: canDetectMention: true when body text is available.
* - Checks the message body against shared and account-local mention patterns.
* - If botHandle is provided and the message body contains its ClickClack
*   `@handle`, treat it as a mention.
* - Shared patterns default to the routed agent's identity name when none are configured.
*/
function resolveClickClackMentionFacts(params) {
	const { isDirect, body, mentionPatterns, botHandle, cfg, agentId, channelId } = params;
	if (isDirect) return {
		canDetectMention: false,
		wasMentioned: false
	};
	if (!body) return {
		canDetectMention: true,
		wasMentioned: false,
		hasAnyMention: false
	};
	const sharedMentionRegexes = buildMentionRegexes(cfg, agentId, {
		provider: "clickclack",
		conversationId: channelId
	});
	const localMentionRegexes = buildLocalMentionRegexes({
		cfg,
		mentionPatterns,
		channelId
	});
	const mentionRegexes = [...sharedMentionRegexes, ...localMentionRegexes];
	const bodyForRegex = normalizeMentionText(body);
	const hasConfiguredMention = mentionRegexes.some((regex) => regex.test(bodyForRegex));
	const mentionHandles = resolveMentionHandles(body);
	const normalizedBotHandle = botHandle?.replace(/^@/u, "").trim().toLowerCase();
	return {
		canDetectMention: true,
		wasMentioned: (normalizedBotHandle ? mentionHandles.includes(normalizedBotHandle) : false) || hasConfiguredMention,
		hasAnyMention: mentionHandles.length > 0 || hasConfiguredMention
	};
}
//#endregion
//#region extensions/clickclack/src/runtime.ts
/**
* Runtime store for host-provided OpenClaw services used by the ClickClack
* bundled plugin.
*/
const { setRuntime: setClickClackRuntime, getRuntime: getClickClackRuntime } = createPluginRuntimeStore({
	pluginId: "clickclack",
	errorMessage: "ClickClack runtime not initialized"
});
//#endregion
//#region extensions/clickclack/src/target.ts
/**
* Parses `channel:name`, `thread:msg_id`, `dm:usr_id`, or a bare channel name.
*/
function parseClickClackTarget(raw) {
	const value = raw.trim();
	if (!value) throw new Error("ClickClack target is required");
	const [prefix, ...rest] = value.split(":");
	const body = rest.join(":").trim();
	if (prefix === "channel" && body) return {
		chatType: "group",
		kind: "channel",
		id: body
	};
	if (prefix === "thread" && body) return {
		chatType: "group",
		kind: "thread",
		id: body
	};
	if (prefix === "dm" && body) return {
		chatType: "direct",
		kind: "dm",
		id: body
	};
	if (!body) return {
		chatType: "group",
		kind: "channel",
		id: value
	};
	throw new Error(`Unsupported ClickClack target: ${raw}`);
}
/** Formats a parsed ClickClack target back into canonical target syntax. */
function buildClickClackTarget(target) {
	return `${target.kind}:${target.id}`;
}
/** Normalizes user-entered ClickClack target text for channel routing. */
function normalizeClickClackTarget(raw) {
	return buildClickClackTarget(parseClickClackTarget(raw));
}
/** Reports whether a target string can be offered to the ClickClack parser. */
function looksLikeClickClackTarget(raw) {
	return /^(channel|thread|dm):/i.test(raw.trim()) || raw.trim().length > 0;
}
//#endregion
//#region extensions/clickclack/src/access.ts
const CHANNEL_ID$2 = "clickclack";
function normalizeClickClackUserId(value) {
	const trimmed = value.trim();
	if (!trimmed) return null;
	const withoutProvider = trimmed.replace(/^(clickclack|cc):/i, "").trim();
	return withoutProvider.match(/^dm:(.+)$/i)?.[1]?.trim() || withoutProvider || null;
}
const clickClackIngressIdentity = {
	key: "user-id",
	normalizeEntry: normalizeClickClackUserId,
	normalizeSubject: normalizeClickClackUserId,
	isWildcardEntry: (entry) => normalizeClickClackUserId(entry) === "*",
	entryIdPrefix: "clickclack-user"
};
function resolveClickClackBotLoopConversationId(params) {
	if (params.message.parent_message_id && params.message.thread_root_id) return params.message.thread_root_id;
	return params.isDirect ? params.message.direct_conversation_id ?? params.message.author_id : params.message.channel_id ?? params.message.thread_root_id ?? params.message.author_id;
}
function resolveAccountAgentRoute(params) {
	const runtime = getClickClackRuntime();
	const peer = {
		kind: params.isDirect ? "direct" : "channel",
		id: params.target
	};
	const route = runtime.channel.routing.resolveAgentRoute({
		cfg: params.cfg,
		channel: CHANNEL_ID$2,
		accountId: params.account.accountId,
		peer
	});
	const agentId = normalizeAgentId(params.account.agentId ?? route.agentId);
	if (agentId === route.agentId) return route;
	const dmScope = params.cfg.session?.dmScope ?? "main";
	const sessionKey = runtime.channel.routing.buildAgentSessionKey({
		agentId,
		mainKey: params.cfg.session?.mainKey,
		channel: CHANNEL_ID$2,
		accountId: params.account.accountId,
		peer,
		dmScope,
		identityLinks: params.cfg.session?.identityLinks
	});
	const mainSessionKey = runtime.channel.routing.buildAgentSessionKey({
		agentId,
		mainKey: params.cfg.session?.mainKey,
		channel: CHANNEL_ID$2,
		accountId: params.account.accountId,
		dmScope: "main"
	});
	return {
		...route,
		agentId,
		dmScope,
		sessionKey,
		mainSessionKey,
		lastRoutePolicy: sessionKey === mainSessionKey ? "main" : "session"
	};
}
async function resolvePreparedInboundRoute(params) {
	const runtime = getClickClackRuntime();
	const isDirect = Boolean(params.message.direct_conversation_id);
	const target = buildClickClackTarget(isDirect ? {
		chatType: "direct",
		kind: "dm",
		id: params.message.author_id
	} : {
		chatType: "group",
		kind: "channel",
		id: params.message.channel_id ?? ""
	});
	const accountRoute = resolveAccountAgentRoute({
		cfg: params.config,
		account: params.account,
		target,
		isDirect
	});
	const discussionResolution = !isDirect && params.message.channel_id ? await resolveClickClackDiscussionRoute({
		runtime,
		accountId: params.account.accountId,
		serverBaseUrl: params.account.baseUrl,
		workspaceId: params.message.workspace_id,
		channelId: params.message.channel_id
	}) : { state: "unbound" };
	const discussionRoute = discussionResolution.state === "active" ? discussionResolution.route : void 0;
	return {
		isDirect,
		target,
		route: discussionRoute ? {
			...accountRoute,
			agentId: discussionRoute.agentId,
			sessionKey: discussionRoute.sessionKey,
			lastRoutePolicy: "session"
		} : accountRoute,
		discussionRoute,
		revoked: discussionResolution.state === "revoked"
	};
}
/**
* Resolves whether a ClickClack message should enter the agent pipeline and
* whether its command-style body may run tools.
*/
async function resolveClickClackInboundAccess(params) {
	const runtime = getClickClackRuntime();
	const cfg = params.config;
	const preparedRoute = await resolvePreparedInboundRoute(params);
	const shouldCheckCommand = runtime.channel.commands.shouldComputeCommandAuthorized(params.message.body, cfg);
	const effectiveGroupPolicy = resolveClickClackGroupPolicy({
		account: params.account,
		channelId: params.message.channel_id
	});
	const mentionFacts = resolveClickClackMentionFacts({
		isDirect: preparedRoute.isDirect,
		body: params.message.body,
		mentionPatterns: effectiveGroupPolicy.mentionPatterns,
		botHandle: params.account.botHandle,
		cfg,
		agentId: preparedRoute.route.agentId,
		channelId: params.message.channel_id
	});
	if (params.message.kind !== void 0 && params.message.kind !== "message") return {
		shouldDispatch: false,
		commandAuthorized: false,
		requireMention: effectiveGroupPolicy.requireMention,
		mentionFacts,
		preparedRoute
	};
	const effectiveBotPolicy = resolveClickClackBotPolicy({
		account: params.account,
		channelId: params.message.channel_id
	});
	const isBotAuthor = params.message.author?.kind === "bot";
	const ingressAllowFrom = isBotAuthor ? params.account.allowFrom.filter((entry) => normalizeClickClackUserId(entry) !== "*") : params.account.allowFrom;
	if (!(!isBotAuthor || effectiveBotPolicy.allowBots === true || effectiveBotPolicy.allowBots === "mentions" && (preparedRoute.isDirect || mentionFacts.wasMentioned))) return {
		shouldDispatch: false,
		commandAuthorized: false,
		requireMention: effectiveGroupPolicy.requireMention,
		mentionFacts,
		preparedRoute
	};
	const botLoopNowMs = parseDateStringTimestampMs(params.message.created_at);
	const botLoopProtection = isBotAuthor && params.message.author_id !== params.account.botUserId && params.account.botUserId ? {
		scopeId: params.account.workspace,
		conversationId: resolveClickClackBotLoopConversationId({
			message: params.message,
			isDirect: preparedRoute.isDirect
		}),
		senderId: params.message.author_id,
		receiverId: params.account.botUserId,
		eventId: params.message.id,
		...botLoopNowMs !== void 0 ? { nowMs: botLoopNowMs } : {},
		config: effectiveBotPolicy.botLoopProtection,
		defaultsConfig: cfg.channels?.defaults?.botLoopProtection,
		defaultEnabled: true
	} : void 0;
	const allowTextCommands = params.account.replyMode === "agent" && runtime.channel.commands.shouldHandleTextCommands({
		cfg,
		surface: CHANNEL_ID$2,
		commandSource: "text"
	});
	const resolved = await runtime.channel.inbound.ingress.resolveStable({
		channelId: CHANNEL_ID$2,
		accountId: params.account.accountId,
		identity: clickClackIngressIdentity,
		cfg,
		subject: { stableId: params.message.author_id },
		conversation: {
			kind: preparedRoute.isDirect ? "direct" : "group",
			id: preparedRoute.isDirect ? params.message.direct_conversation_id ?? params.message.author_id : params.message.channel_id ?? params.message.thread_root_id
		},
		contextBinding: {
			agentId: preparedRoute.route.agentId,
			sessionKey: preparedRoute.route.sessionKey,
			nativeChannelId: params.message.channel_id || params.message.direct_conversation_id,
			messageId: params.message.id,
			inboundEventKind: "user_request"
		},
		allowFrom: ingressAllowFrom,
		dmPolicy: "allowlist",
		groupPolicy: "allowlist",
		mentionFacts,
		policy: { activation: {
			requireMention: effectiveGroupPolicy.requireMention,
			allowTextCommands
		} },
		command: shouldCheckCommand ? {
			cfg,
			modeWhenAccessGroupsOff: "configured"
		} : false
	});
	return {
		shouldDispatch: !preparedRoute.revoked && resolved.ingress.admission === "dispatch",
		commandAuthorized: resolved.commandAccess.requested ? resolved.commandAccess.authorized : resolved.senderAccess.allowed,
		requireMention: effectiveGroupPolicy.requireMention,
		mentionFacts,
		botLoopProtection,
		preparedRoute,
		channelIngress: resolved
	};
}
//#endregion
//#region extensions/clickclack/src/command-menu.ts
const CLICKCLACK_COMMAND_PATTERN = /^[a-z0-9_-]{1,32}$/u;
const CLICKCLACK_MAX_COMMANDS = 100;
const CLICKCLACK_MAX_DESCRIPTION_LENGTH = 100;
const CLICKCLACK_MAX_ARGS_HINT_LENGTH = 100;
function commandArgsHint(spec) {
	if (spec.args?.length) return truncateCodePoints(spec.args.map((arg) => arg.required ? `<${arg.name}>` : `[${arg.name}]`).join(" "), CLICKCLACK_MAX_ARGS_HINT_LENGTH);
	return spec.acceptsArgs ? "[args]" : "";
}
function errorStatus(error) {
	if (!error || typeof error !== "object" || !("status" in error)) return;
	const status = error.status;
	return typeof status === "number" ? status : void 0;
}
function mapNativeCommandSpecsToClickClackMenu(specs, log) {
	const commands = [];
	const seen = /* @__PURE__ */ new Set();
	const invalidNames = /* @__PURE__ */ new Set();
	for (const spec of specs) {
		if (spec.isAlias) continue;
		const command = spec.name.trim().toLowerCase();
		if (!CLICKCLACK_COMMAND_PATTERN.test(command)) {
			invalidNames.add(spec.name.trim() || "<empty>");
			continue;
		}
		if (seen.has(command)) continue;
		seen.add(command);
		const description = spec.description.trim() || command;
		commands.push({
			command,
			description: truncateCodePoints(description, CLICKCLACK_MAX_DESCRIPTION_LENGTH),
			args_hint: commandArgsHint(spec)
		});
	}
	if (invalidNames.size > 0) log?.warn?.(`ClickClack command menu skipped invalid native command names: ${[...invalidNames].map((name) => JSON.stringify(name)).join(", ")}`);
	return commands.slice(0, CLICKCLACK_MAX_COMMANDS);
}
async function syncClickClackCommandMenu(params) {
	try {
		const commands = mapNativeCommandSpecsToClickClackMenu(listNativeCommandSpecsForConfig(params.cfg, { provider: "clickclack" }), params.log);
		await params.client.setBotCommands(commands);
	} catch (error) {
		const status = errorStatus(error);
		const messagePrefix = `[${params.accountId}] ClickClack command menu sync`;
		if (status === 403) {
			params.log?.warn?.(`${messagePrefix} skipped: ${formatErrorMessage(error)}; verify token/workspace command permissions or set commandMenu: false if menus are not needed`);
			return;
		}
		if (status === 404) {
			params.log?.debug?.(`${messagePrefix} skipped: server does not support /api/bots/self/commands`);
			return;
		}
		params.log?.warn?.(`${messagePrefix} failed: ${formatErrorMessage(error)}`);
	}
}
//#endregion
//#region extensions/clickclack/src/activity.ts
/**
* Publishes agent activity (streamed commentary + tool progress) into
* ClickClack as durable `agent_commentary` / `agent_tool` message rows,
* coalesced so one logical step becomes one row instead of a row per frame.
*
* Ported from the clickglass agent-bridge sidecar, adapted from gateway
* websocket frames to the in-process `replyOptions.onItemEvent` seam:
*
* - Commentary/reasoning arrives as cumulative text snapshots per item id.
*   Each segment becomes one durable row: POSTed when the segment starts
*   streaming and PATCHed (debounced) as the snapshot grows, so prose
*   interleaves chronologically with tool rows.
* - Tool/step items can emit several frames (start/update/complete) for the
*   same call, sometimes with lane-prefixed ids (`tool:X`, `command:X`).
*   Normalize the prefix away to one key per call, POST one row on the first
*   frame, and PATCH it when a later frame carries a strictly longer body.
*/
/** Debounce window for PATCHing streaming commentary snapshots. */
const CLICKCLACK_COMMENTARY_FLUSH_MS = 700;
/** Item kinds rendered as agent_tool rows; everything else is commentary. */
const TOOL_ITEM_KINDS = /* @__PURE__ */ new Set([
	"tool",
	"command",
	"command_output",
	"patch",
	"search",
	"api"
]);
/** Item kinds that never become durable rows (ephemeral or plumbing lanes). */
const SKIPPED_ITEM_KINDS = /* @__PURE__ */ new Set(["lifecycle"]);
/** Item kinds emitted as cumulative commentary snapshots. */
const STREAMING_COMMENTARY_ITEM_KINDS = /* @__PURE__ */ new Set([
	"preamble",
	"commentary",
	"analysis",
	"thinking",
	"reasoning"
]);
/** Provider-specific reasoning lanes normalized into one ClickClack label. */
const THINKING_ITEM_KINDS = /* @__PURE__ */ new Set([
	"analysis",
	"thinking",
	"reasoning"
]);
function normalizedItemKind(payload) {
	return payload.kind?.trim().toLowerCase() ?? "";
}
function commentaryBody(payload) {
	const text = payload.progressText?.trim() || payload.summary?.trim() || payload.meta?.trim() || "";
	if (!text) return "";
	const kind = normalizedItemKind(payload);
	if (THINKING_ITEM_KINDS.has(kind)) return `**Thinking**\n\n${text}`;
	return text;
}
function activityBody(payload) {
	const line = formatChannelProgressDraftLineForEntry(void 0, {
		event: "item",
		itemId: payload.itemId,
		toolCallId: payload.toolCallId,
		itemKind: payload.kind,
		title: payload.title,
		name: payload.name,
		phase: payload.phase,
		status: payload.status,
		summary: payload.summary,
		progressText: payload.progressText,
		meta: payload.meta,
		commandBearing: payload.commandBearing
	})?.trim();
	if (line) return line;
	const head = payload.name?.trim() || payload.title?.trim();
	const text = payload.progressText?.trim() || payload.summary?.trim();
	if (head && text) return `**${head}**\n\n${text}`;
	if (text) return text;
	if (head) return head;
	return payload.status?.trim() || payload.kind?.trim() || "";
}
/**
* Creates a per-turn activity publisher. Publishing is best-effort: transport
* failures are reported through `onError` and never interrupt the reply turn.
*/
function createClickClackActivityPublisher(params) {
	const flushMs = params.flushMs ?? CLICKCLACK_COMMENTARY_FLUSH_MS;
	const commentaryByItem = /* @__PURE__ */ new Map();
	const toolRows = /* @__PURE__ */ new Map();
	let provenance;
	let chain = Promise.resolve();
	const enqueue = (work) => {
		chain = chain.then(work).catch((error) => {
			params.onError?.(error);
		});
		return chain;
	};
	const postRow = (kind, body) => params.client.createActivityMessage({
		channelId: params.target.channelId,
		conversationId: params.target.conversationId,
		body,
		kind,
		turnId: params.turnId,
		provenance
	});
	const flushCommentary = (segmentKey) => {
		const segment = commentaryByItem.get(segmentKey);
		if (!segment) return Promise.resolve();
		if (segment.timer) {
			clearTimeout(segment.timer);
			segment.timer = void 0;
		}
		if (!segment.dirty || !segment.body.trim()) return Promise.resolve();
		segment.dirty = false;
		const body = segment.body;
		return enqueue(async () => {
			if (segment.messageId) {
				await params.client.updateMessageBody(segment.messageId, body);
				return;
			}
			const posted = await postRow("agent_commentary", body);
			segment.messageId = posted.id;
		});
	};
	const flushAllCommentary = () => {
		const flushes = [...commentaryByItem.keys()].map((key) => flushCommentary(key));
		return Promise.all(flushes).then(() => void 0);
	};
	const handleCommentary = (payload) => {
		const body = commentaryBody(payload);
		const key = payload.itemId?.trim() || "turn";
		let segment = commentaryByItem.get(key);
		if (!body.trim()) {
			if (segment) {
				clearTimeout(segment.timer);
				commentaryByItem.delete(key);
				const retracted = segment;
				enqueue(async () => {
					if (retracted.messageId) await params.client.updateMessageBody(retracted.messageId, "");
				});
			}
			return;
		}
		if (!segment) {
			segment = {
				body: "",
				dirty: false
			};
			commentaryByItem.set(key, segment);
		}
		if (body === segment.body) return;
		segment.body = body;
		segment.dirty = true;
		if (!segment.timer) segment.timer = setTimeout(() => {
			segment.timer = void 0;
			flushCommentary(key);
		}, flushMs);
	};
	const toolRowKey = (payload) => {
		return payload.itemId?.trim() || payload.toolCallId?.trim() || "";
	};
	const handleDiscreteItem = (payload) => {
		const body = activityBody(payload);
		if (!body) return;
		const kind = TOOL_ITEM_KINDS.has(payload.kind?.trim().toLowerCase() ?? "") ? "agent_tool" : "agent_commentary";
		flushAllCommentary();
		const key = `${kind}:${toolRowKey(payload)}`;
		const existing = toolRows.get(key);
		if (!existing || !toolRowKey(payload)) {
			const row = { body };
			if (toolRowKey(payload)) toolRows.set(key, row);
			enqueue(async () => {
				const posted = await postRow(kind, row.body);
				row.messageId = posted.id;
				row.sentBody = row.body;
			});
			return;
		}
		if (body === existing.body) return;
		existing.body = body;
		enqueue(async () => {
			if (existing.messageId && existing.body !== existing.sentBody) {
				await params.client.updateMessageBody(existing.messageId, existing.body);
				existing.sentBody = existing.body;
			}
		});
	};
	return {
		onItemEvent: (payload) => {
			if (payload.hideFromChannelProgress || payload.suppressChannelProgress || payload.suppressDurableProgress) {
				const key = toolRowKey(payload);
				const row = key ? toolRows.get(`agent_tool:${key}`) : void 0;
				if (row) {
					toolRows.delete(`agent_tool:${key}`);
					enqueue(async () => {
						if (row.messageId) await params.client.updateMessageBody(row.messageId, "");
					});
				}
				return false;
			}
			if (payload.kind === "preamble" && !isCompleteAgentPreamble(payload)) return false;
			const kind = normalizedItemKind(payload);
			if (STREAMING_COMMENTARY_ITEM_KINDS.has(kind)) {
				handleCommentary(payload);
				return false;
			}
			if (SKIPPED_ITEM_KINDS.has(kind)) return false;
			handleDiscreteItem(payload);
			return false;
		},
		setProvenance: (next) => {
			provenance = next;
		},
		finalize: async () => {
			await flushAllCommentary();
			await chain;
		}
	};
}
//#endregion
//#region extensions/clickclack/src/outbound.ts
/**
* Outbound ClickClack delivery helpers for channel messages, thread replies,
* and direct messages.
*/
const CLICKCLACK_MAX_UPLOAD_BYTES = 67108864;
const CLICKCLACK_FORMAT_PROFILE = FormatCapabilityProfile.define({
	mechanism: "markdown",
	chunk: {
		limit: 1048576,
		unit: "bytes"
	}
});
function renderClickClackMarkdown(markdown) {
	return renderMarkdownWithMarkers({
		text: markdown,
		styles: [],
		links: []
	}, {
		styleMarkers: {},
		escapeText: (text) => text
	}, CLICKCLACK_FORMAT_PROFILE);
}
async function createTargetMessage(params) {
	const parsed = parseClickClackTarget(params.to);
	const explicitThreadId = params.threadId == null ? "" : String(params.threadId);
	const replyToId = params.replyToId == null ? "" : String(params.replyToId);
	if (explicitThreadId || parsed.kind === "thread") {
		const rootId = explicitThreadId || parsed.id;
		params.assertDirectAdapterHandoff?.();
		await params.onPlatformSendDispatch?.();
		return await params.client.createThreadReply(rootId, params.text, {
			provenance: params.provenance,
			nonce: params.nonce
		});
	}
	if (parsed.kind === "dm") {
		const dm = await params.client.createDirectConversation(params.workspaceId, [parsed.id]);
		params.assertDirectAdapterHandoff?.();
		await params.onPlatformSendDispatch?.();
		return await params.client.createDirectMessage(dm.id, params.text, {
			quotedMessageId: replyToId || void 0,
			nonce: params.nonce
		});
	}
	const channelId = await resolveChannelId(params.client, params.workspaceId, parsed.id);
	params.assertDirectAdapterHandoff?.();
	await params.onPlatformSendDispatch?.();
	return await params.client.createChannelMessage(channelId, params.text, {
		provenance: params.provenance,
		quotedMessageId: replyToId || void 0,
		nonce: params.nonce
	});
}
function durableDeliveryDigest(params) {
	if (!params.deliveryQueueId) return;
	if (!Number.isSafeInteger(params.deliveryPartIndex) || (params.deliveryPartIndex ?? -1) < 0) throw new Error("ClickClack durable delivery requires a stable delivery part index");
	return createHash("sha256").update(`${params.deliveryQueueId}\n${params.deliveryPartIndex}`).digest("hex");
}
function mediaDeliveryNonces(params) {
	const digest = durableDeliveryDigest(params);
	if (!digest) return {};
	return {
		message: `openclaw-media:${digest}`,
		upload: `openclaw-upload:${digest}`
	};
}
function textDeliveryNonce(params) {
	const digest = durableDeliveryDigest(params);
	return digest ? `openclaw-text:${digest}` : void 0;
}
async function attachUploadRetrySafe(params) {
	try {
		await params.client.attachUpload(params.messageId, params.uploadId);
	} catch (firstError) {
		params.assertDirectAdapterHandoff?.();
		try {
			if ((await params.client.message(params.messageId)).attachments?.some((attachment) => attachment.id === params.uploadId)) return;
		} catch {}
		params.assertDirectAdapterHandoff?.();
		try {
			await params.client.attachUpload(params.messageId, params.uploadId);
		} catch {
			throw firstError;
		}
	}
}
function createOutboundContext(params) {
	const account = resolveClickClackAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const assertDirectAdapterHandoff = params.assertDirectAdapterHandoff;
	const fetcher = fetch;
	return {
		account,
		client: createClickClackClient({
			baseUrl: account.apiEndpoint,
			token: account.token,
			correlationId: params.correlationId,
			fetch: assertDirectAdapterHandoff ? (input, init) => {
				assertDirectAdapterHandoff();
				return fetcher(input, init);
			} : void 0
		})
	};
}
/**
* Sends visible text to a normalized ClickClack target and returns the created
* message id, or undefined when sanitization removes all content.
*/
async function sendClickClackText(params) {
	const text = renderClickClackMarkdown(sanitizeAssistantVisibleText(params.text));
	if (!text) return;
	const { account, client } = createOutboundContext(params);
	return (await createTargetMessage({
		client,
		workspaceId: await resolveWorkspaceId(client, account.workspace),
		to: params.to,
		text,
		threadId: params.threadId,
		replyToId: params.replyToId,
		provenance: params.provenance,
		nonce: textDeliveryNonce({
			deliveryQueueId: params.deliveryQueueId,
			deliveryPartIndex: params.deliveryPartIndex
		}),
		onPlatformSendDispatch: params.onPlatformSendDispatch,
		assertDirectAdapterHandoff: params.assertDirectAdapterHandoff
	})).id;
}
/** Resolves, uploads, sends, then attaches one file to a ClickClack message. */
async function sendClickClackMedia(params) {
	const nonces = mediaDeliveryNonces({
		deliveryQueueId: params.deliveryQueueId,
		deliveryPartIndex: params.deliveryPartIndex
	});
	const { account, client } = createOutboundContext(params);
	const maxBytes = Math.min(resolveChannelMediaMaxBytes({
		cfg: params.cfg,
		accountId: account.accountId,
		resolveChannelLimitMb: () => account.config.mediaMaxMb
	}) ?? CLICKCLACK_MAX_UPLOAD_BYTES, CLICKCLACK_MAX_UPLOAD_BYTES);
	const preloadedMedia = nonces.upload ? void 0 : await loadOutboundMediaFromUrl(params.mediaUrl, {
		maxBytes,
		mediaAccess: params.mediaAccess,
		mediaLocalRoots: params.mediaLocalRoots,
		mediaReadFile: params.mediaReadFile
	});
	const workspaceId = await resolveWorkspaceId(client, account.workspace);
	let upload = nonces.upload ? await client.findUploadByNonce({
		workspaceId,
		nonce: nonces.upload
	}) : void 0;
	let mediaFilename = preloadedMedia?.fileName?.trim();
	if (!upload) {
		const media = preloadedMedia ?? await loadOutboundMediaFromUrl(params.mediaUrl, {
			maxBytes,
			mediaAccess: params.mediaAccess,
			mediaLocalRoots: params.mediaLocalRoots,
			mediaReadFile: params.mediaReadFile
		});
		const contentType = media.contentType?.trim() || "application/octet-stream";
		const filename = media.fileName?.trim() || `attachment${extensionForMime(contentType) ?? ""}`;
		mediaFilename = filename;
		upload = await client.createUpload({
			workspaceId,
			buffer: media.buffer,
			filename,
			contentType,
			...nonces.upload ? { nonce: nonces.upload } : {}
		});
	}
	const text = renderClickClackMarkdown(sanitizeAssistantVisibleText(params.text)) || mediaFilename || upload.filename || "attachment";
	const message = await createTargetMessage({
		client,
		workspaceId,
		to: params.to,
		text,
		threadId: params.threadId,
		replyToId: params.replyToId,
		nonce: nonces.message,
		onPlatformSendDispatch: params.onPlatformSendDispatch,
		assertDirectAdapterHandoff: params.assertDirectAdapterHandoff
	});
	const receipt = createMessageReceiptFromOutboundResults({
		results: [{
			channel: "clickclack",
			messageId: message.id
		}],
		threadId: params.threadId == null ? void 0 : String(params.threadId),
		replyToId: params.replyToId == null ? void 0 : String(params.replyToId),
		kind: "text"
	});
	try {
		await params.onDeliveryResult?.({
			messageId: message.id,
			receipt
		});
		await attachUploadRetrySafe({
			client,
			messageId: message.id,
			uploadId: upload.id,
			assertDirectAdapterHandoff: params.assertDirectAdapterHandoff
		});
	} catch (error) {
		throw createChannelPartialDeliveryError(error, {
			visibleReplySent: true,
			messageIds: [message.id],
			receipt
		});
	}
	return message.id;
}
function collectReconciliationMediaUrls(ctx) {
	const planned = ctx.renderedBatchPlan?.items[0]?.mediaUrls;
	if (planned?.length) return planned.map((url) => url.trim()).filter(Boolean);
	const payload = ctx.payloads[0];
	return [payload?.mediaUrl, ...payload?.mediaUrls ?? []].map((url) => url?.trim()).filter((url) => Boolean(url));
}
/**
* Completes an unknown durable send through ClickClack's message/upload nonces.
* Media recovery never rereads the original source after restart.
*/
async function reconcileClickClackUnknownSend(ctx) {
	if (ctx.payloads.length !== 1 || (ctx.renderedBatchPlan?.items.length ?? 1) !== 1) return {
		status: "unresolved",
		error: "ClickClack reconciliation requires exactly one payload"
	};
	const mediaUrls = collectReconciliationMediaUrls(ctx);
	const { account, client } = createOutboundContext({
		cfg: ctx.cfg,
		accountId: ctx.accountId
	});
	const workspaceId = await resolveWorkspaceId(client, account.workspace);
	const effectiveReplyToId = ctx.effectiveReplyToId !== void 0 ? ctx.effectiveReplyToId : ctx.replyToMode === "off" ? void 0 : ctx.replyToId;
	const payload = ctx.payloads[0];
	const caption = ctx.renderedBatchPlan?.items[0]?.text ?? payload?.text ?? "";
	if (mediaUrls.length === 0) {
		const nonce = textDeliveryNonce({
			deliveryQueueId: ctx.queueId,
			deliveryPartIndex: 0
		});
		if (!nonce || !sanitizeAssistantVisibleText(caption)) return { status: "not_sent" };
		const message = await client.findMessageByNonce({
			workspaceId,
			nonce
		});
		if (!message) return { status: "not_sent" };
		const receipt = createMessageReceiptFromOutboundResults({
			results: [{
				channel: "clickclack",
				messageId: message.id
			}],
			threadId: ctx.threadId == null ? void 0 : String(ctx.threadId),
			replyToId: effectiveReplyToId ?? void 0,
			kind: "text"
		});
		return {
			status: "sent",
			messageId: message.id,
			receipt
		};
	}
	const parts = await Promise.all(mediaUrls.map(async (_mediaUrl, index) => {
		const nonces = mediaDeliveryNonces({
			deliveryQueueId: ctx.queueId,
			deliveryPartIndex: index
		});
		if (!nonces.upload || !nonces.message) throw new Error("ClickClack durable media nonces were not derived");
		const [upload, message] = await Promise.all([client.findUploadByNonce({
			workspaceId,
			nonce: nonces.upload
		}), client.findMessageByNonce({
			workspaceId,
			nonce: nonces.message
		})]);
		return {
			upload,
			message
		};
	}));
	for (const part of parts) {
		if (part.message && !part.upload) return {
			status: "unresolved",
			error: `ClickClack message ${part.message.id} exists without its nonce-keyed upload`,
			retryable: false
		};
		if (!part.message) return { status: "not_sent" };
	}
	const messageIds = [];
	for (const part of parts) {
		const message = part.message;
		const upload = part.upload;
		if (!message || !upload) throw new Error("ClickClack reconciliation state changed unexpectedly");
		if (!message.attachments?.some((attachment) => attachment.id === upload.id)) await attachUploadRetrySafe({
			client,
			messageId: message.id,
			uploadId: upload.id
		});
		messageIds.push(message.id);
	}
	const receipt = createMessageReceiptFromOutboundResults({
		results: messageIds.map((messageId) => ({
			channel: "clickclack",
			messageId
		})),
		threadId: ctx.threadId == null ? void 0 : String(ctx.threadId),
		replyToId: effectiveReplyToId ?? void 0,
		kind: "media"
	});
	const messageId = messageIds.at(-1);
	return {
		status: "sent",
		...messageId ? { messageId } : {},
		receipt
	};
}
//#endregion
//#region extensions/clickclack/src/progress.ts
/**
* Publishes ClickClack's native ephemeral agent.progress signal for one
* OpenClaw turn. ClickClack renders this as its compact "Agent is
* responding" status and the detailed progress lines above the composer.
*/
function normalizedKind(payload) {
	const kind = payload.kind?.trim().toLowerCase();
	if (!kind || kind === "preamble" || kind === "analysis" || kind === "thinking" || kind === "reasoning" || kind === "missing") return "commentary";
	return kind;
}
function progressText(payload) {
	if (payload.kind !== "preamble" && payload.title) return payload.title;
	const line = buildChannelProgressDraftLine({
		event: "item",
		itemId: payload.itemId,
		toolCallId: payload.toolCallId,
		itemKind: payload.kind,
		title: payload.title,
		name: payload.name,
		phase: payload.phase,
		status: payload.status,
		summary: payload.summary,
		progressText: payload.progressText,
		meta: payload.meta,
		commandBearing: payload.commandBearing
	})?.text?.trim();
	if (line) return line;
	return payload.progressText?.trim() || payload.summary?.trim() || payload.title?.trim() || payload.name?.trim() || payload.meta?.trim() || payload.status?.trim() || "Working";
}
function isFinal(payload) {
	const phase = payload.phase?.trim().toLowerCase();
	const status = payload.status?.trim().toLowerCase();
	return phase === "end" || status === "completed" || status === "failed" || status === "blocked";
}
function createLineIdResolver() {
	const anonymousLinesByKind = /* @__PURE__ */ new Map();
	let anonymousSequence = 0;
	return (payload) => {
		const identity = payload.itemId?.trim() || payload.toolCallId?.trim();
		if (identity) return `item:${identity}`;
		const kind = normalizedKind(payload);
		const anonymousLines = anonymousLinesByKind.get(kind) ?? [];
		const line = (payload.phase?.trim().toLowerCase() === "start" ? void 0 : anonymousLines.toReversed().find((line) => line.active)) ?? (() => {
			const created = {
				id: `item:${kind}:${++anonymousSequence}`,
				active: true
			};
			anonymousLines.push(created);
			anonymousLinesByKind.set(kind, anonymousLines);
			return created;
		})();
		if (isFinal(payload)) line.active = false;
		return line.id;
	};
}
const CLICKCLACK_PROGRESS_UPDATE_INTERVAL_MS = 100;
const CLICKCLACK_PROGRESS_FINALIZE_GRACE_MS = 1e3;
function createClickClackAgentProgressPublisher(params) {
	let sequence = 0;
	const queue = [];
	const queuedLines = /* @__PURE__ */ new Map();
	let drainPromise;
	let lineDrainTimer;
	let started = false;
	let cleared = false;
	const seenLines = /* @__PURE__ */ new Set();
	const resolveLineId = createLineIdResolver();
	const drain = () => {
		if (drainPromise) return drainPromise;
		drainPromise = (async () => {
			while (queue.length > 0) {
				const frame = queue.shift();
				if (!frame) continue;
				if (frame.lineId) queuedLines.delete(frame.lineId);
				try {
					await params.client.publishEphemeral({
						...params.target,
						type: "agent.progress",
						payload: {
							turn_id: params.turnId,
							seq: ++sequence,
							...frame.payload
						}
					});
				} catch (error) {
					try {
						params.onError?.(error);
					} catch {}
				}
			}
		})().finally(() => {
			drainPromise = void 0;
			if (queue.length > 0) drain();
		});
		return drainPromise;
	};
	const enqueue = (payload) => {
		queue.push({ payload });
		drain();
	};
	const flushQueuedLines = () => {
		for (const [lineId, frame] of queuedLines) {
			queuedLines.delete(lineId);
			queue.push(frame);
		}
		drain();
	};
	const discardQueuedLines = () => {
		queuedLines.clear();
		const controlFrames = queue.filter((frame) => !frame.lineId);
		queue.splice(0, queue.length, ...controlFrames);
	};
	const waitForDrainWithinFinalizeGrace = async (pending) => {
		let timeout;
		let drained = false;
		try {
			await Promise.race([pending.then(() => {
				drained = true;
			}), new Promise((resolve) => {
				timeout = setTimeout(resolve, CLICKCLACK_PROGRESS_FINALIZE_GRACE_MS);
			})]);
			return drained;
		} finally {
			if (timeout) clearTimeout(timeout);
		}
	};
	const scheduleLineDrain = () => {
		if (lineDrainTimer) return;
		lineDrainTimer = setTimeout(() => {
			lineDrainTimer = void 0;
			flushQueuedLines();
		}, CLICKCLACK_PROGRESS_UPDATE_INTERVAL_MS);
	};
	const enqueueLine = (lineId, payload) => {
		const queued = queuedLines.get(lineId);
		if (queued) {
			const op = payload.op === "finalize" ? "finalize" : queued.payload.op === "append" ? "append" : payload.op;
			queued.payload = {
				...payload,
				...op ? { op } : {}
			};
			return;
		}
		const frame = {
			lineId,
			payload
		};
		queuedLines.set(lineId, frame);
		scheduleLineDrain();
	};
	return {
		start() {
			if (started) return;
			started = true;
			enqueue({
				op: "append",
				line: {
					id: "turn",
					kind: "commentary",
					text: params.agentLabel ? `${params.agentLabel} is responding` : "Agent is responding",
					status: "running"
				}
			});
		},
		onItemEvent(payload) {
			if (!started || cleared) return false;
			if (payload.suppressChannelProgress || payload.kind === "preamble" && !isCompleteAgentPreamble(payload)) return false;
			const id = resolveLineId(payload);
			if (payload.hideFromChannelProgress) {
				if (seenLines.delete(id)) enqueueLine(id, {
					op: "update",
					line: {
						id,
						kind: normalizedKind(payload),
						text: ""
					}
				});
				return false;
			}
			const final = isFinal(payload);
			const kind = normalizedKind(payload);
			const retractsExistingCommentary = kind === "commentary" && seenLines.has(id) && payload.progressText !== void 0 && payload.progressText.trim() === "";
			if (retractsExistingCommentary && queuedLines.get(id)?.payload.op === "append") {
				queuedLines.delete(id);
				seenLines.delete(id);
				return false;
			}
			const line = {
				id,
				kind,
				text: retractsExistingCommentary ? "" : progressText(payload),
				status: payload.status?.trim() || (final ? "blocked" : "running")
			};
			if (payload.name?.trim()) line.tool_name = payload.name.trim();
			enqueueLine(id, {
				op: final ? "finalize" : seenLines.has(id) ? "update" : "append",
				line
			});
			seenLines.add(id);
			return false;
		},
		async finalize() {
			if (!started || cleared) return;
			cleared = true;
			if (lineDrainTimer) {
				clearTimeout(lineDrainTimer);
				lineDrainTimer = void 0;
			}
			flushQueuedLines();
			enqueue({ op: "clear" });
			if (!await waitForDrainWithinFinalizeGrace(drain())) discardQueuedLines();
		}
	};
}
//#endregion
//#region extensions/clickclack/src/inbound.ts
const CHANNEL_ID$1 = "clickclack";
const CLICKCLACK_MESSAGE_ID_PATTERN = /^msg_[0-9a-hjkmnp-tv-z]{26}$/u;
function hasClickClackReplyMedia(payload) {
	return Boolean(payload.mediaUrl?.trim() || payload.mediaUrls?.some((mediaUrl) => typeof mediaUrl === "string" && mediaUrl.trim()));
}
function resolveClickClackAgentRunId(messageId) {
	return CLICKCLACK_MESSAGE_ID_PATTERN.test(messageId) ? `${CHANNEL_ID$1}:${messageId}` : void 0;
}
async function dispatchModelReply(params) {
	const runtime = getClickClackRuntime();
	const result = await runtime.llm.complete({
		agentId: params.route.agentId,
		model: params.account.model,
		purpose: "clickclack bot reply",
		systemPrompt: params.account.systemPrompt,
		messages: [{
			role: "user",
			content: params.message.body
		}]
	});
	const completion = result.text.trim();
	if (!completion) {
		runtime.logging.getChildLogger({
			plugin: "clickclack",
			feature: "model-reply"
		}).warn(`[${params.account.accountId}] ClickClack model reply produced no sendable text`);
		return;
	}
	const replyPipeline = createChannelMessageReplyPipeline({
		cfg: params.cfg,
		agentId: params.route.agentId,
		channel: CHANNEL_ID$1,
		accountId: params.account.accountId
	});
	replyPipeline.onModelSelected?.({
		provider: result.provider,
		model: result.model,
		thinkLevel: void 0
	});
	const responsePrefix = replyPipeline.resolveResponsePrefix?.();
	const text = responsePrefix && !completion.startsWith(responsePrefix) ? `${responsePrefix} ${completion}` : completion;
	await sendClickClackText({
		cfg: params.cfg,
		accountId: params.account.accountId,
		to: params.target,
		text,
		threadId: params.message.parent_message_id ? params.message.thread_root_id : void 0,
		replyToId: params.message.id,
		correlationId: params.correlationId
	});
}
/**
* Dispatches one already-fetched ClickClack message through the configured
* reply mode for its account.
*/
async function handleClickClackInbound(params) {
	const runtime = getClickClackRuntime();
	const message = params.message;
	const access = params.access ?? await resolveClickClackInboundAccess({
		account: params.account,
		config: params.config,
		message
	});
	if (!access.shouldDispatch || !access.channelIngress) return;
	const conversationId = message.channel_id || message.direct_conversation_id;
	if (!conversationId) return;
	const { discussionRoute, isDirect, route, target } = access.preparedRoute;
	const progress = params.account.nativeProgress ? createClickClackAgentProgressPublisher({
		client: createClickClackClient({
			baseUrl: params.account.apiEndpoint,
			token: params.account.token,
			correlationId: params.correlationId
		}),
		target: message.channel_id ? {
			workspaceId: message.workspace_id,
			channelId: message.channel_id
		} : {
			workspaceId: message.workspace_id,
			conversationId
		},
		turnId: message.id,
		agentLabel: params.account.name?.trim() || params.account.botHandle?.trim() || params.account.agentId?.trim() || params.account.accountId,
		onError: (error) => {
			runtime.logging.getChildLogger({
				plugin: "clickclack",
				feature: "agent-progress"
			}).warn(`clickclack progress publish failed: ${String(error)}`);
		}
	}) : void 0;
	if (params.account.replyMode === "model" && !discussionRoute) {
		if (access.botLoopProtection) {
			const loopResult = recordChannelBotPairLoopAndCheckSuppression(access.botLoopProtection);
			if (loopResult.suppressed) {
				runtime.logging.getChildLogger({
					plugin: "clickclack",
					feature: "bot-loop-protection"
				}).warn(`[${params.account.accountId}] ClickClack bot-pair loop suppressed for ${Math.max(0, Math.ceil((loopResult.cooldownUntilMs - Date.now()) / 1e3))}s`);
				return;
			}
		}
		progress?.start();
		try {
			await dispatchModelReply({
				account: params.account,
				cfg: params.config,
				message,
				route,
				target,
				correlationId: params.correlationId
			});
		} finally {
			await progress?.finalize();
		}
		return;
	}
	let turnProvenance;
	let activity;
	if (params.account.agentActivity && (message.channel_id || message.direct_conversation_id)) activity = createClickClackActivityPublisher({
		client: createClickClackClient({
			baseUrl: params.account.apiEndpoint,
			token: params.account.token,
			correlationId: params.correlationId
		}),
		target: message.channel_id ? { channelId: message.channel_id } : { conversationId: message.direct_conversation_id },
		turnId: message.id,
		onError: (error) => {
			runtime.logging.getChildLogger({
				plugin: "clickclack",
				feature: "agent-activity"
			}).warn(`clickclack activity publish failed: ${String(error)}`);
		}
	});
	const senderName = message.author?.display_name || message.author_id;
	const body = createChannelInboundEnvelopeBuilder({
		cfg: params.config,
		route
	})({
		channel: "ClickClack",
		from: senderName,
		timestamp: new Date(message.created_at),
		body: message.body
	});
	const ctxPayload = (params.buildContext ?? buildChannelInboundEventContext)({
		channelIngress: access.channelIngress,
		channel: CHANNEL_ID$1,
		accountId: route.accountId ?? params.account.accountId,
		messageId: message.id,
		messageIdFull: message.id,
		timestamp: new Date(message.created_at).getTime(),
		from: target,
		sender: {
			id: message.author_id,
			name: senderName
		},
		conversation: {
			kind: isDirect ? "direct" : "group",
			id: conversationId,
			label: isDirect ? senderName : message.channel_id,
			threadId: message.parent_message_id ? message.thread_root_id : void 0,
			nativeChannelId: conversationId
		},
		route: {
			agentId: route.agentId,
			dmScope: route.dmScope,
			accountId: route.accountId,
			routeSessionKey: route.sessionKey
		},
		reply: {
			to: target,
			originatingTo: target,
			replyToId: message.id,
			messageThreadId: message.parent_message_id ? message.thread_root_id : void 0,
			threadParentId: message.parent_message_id ? message.thread_root_id : void 0
		},
		message: {
			body,
			bodyForAgent: message.body,
			rawBody: message.body,
			commandBody: message.body
		},
		access: {
			commands: { authorized: access.commandAuthorized },
			mentions: access.mentionFacts
		},
		extra: {
			GroupChannel: message.channel_id,
			...discussionRoute ? { GroupSystemPrompt: discussionRoute.systemPrompt } : {}
		}
	});
	const runId = resolveClickClackAgentRunId(message.id);
	const activityReplyOptions = {
		...activity ? { onModelSelected: (ctx) => {
			turnProvenance = {
				model: ctx.provider && ctx.model ? `${ctx.provider}/${ctx.model}` : ctx.model,
				thinking: ctx.thinkLevel
			};
			activity.setProvenance(turnProvenance);
		} } : {},
		...progress || activity ? {
			onItemEvent: (payload) => {
				progress?.onItemEvent(payload);
				activity?.onItemEvent(payload);
				return false;
			},
			commentaryProgressEnabled: true,
			suppressDefaultToolProgressMessages: true,
			allowProgressCallbacksWhenSourceDeliverySuppressed: true
		} : {}
	};
	progress?.start();
	const dispatch = () => runtime.channel.inbound.dispatch({
		cfg: params.config,
		channel: CHANNEL_ID$1,
		accountId: params.account.accountId,
		route: {
			agentId: route.agentId,
			dmScope: route.dmScope,
			sessionKey: route.sessionKey
		},
		ctxPayload,
		botLoopProtection: access.botLoopProtection,
		toolsAllow: params.account.toolsAllow,
		replyOptions: {
			...runId ? { runId } : {},
			...activityReplyOptions
		},
		delivery: {
			deliver: async (payload) => {
				if (hasClickClackReplyMedia(payload)) throw new Error("ClickClack media reply requires durable delivery");
				const text = payload && typeof payload === "object" && "text" in payload ? payload.text ?? "" : "";
				if (!text.trim()) return;
				await sendClickClackText({
					cfg: params.config,
					accountId: params.account.accountId,
					to: target,
					text,
					threadId: message.parent_message_id ? message.thread_root_id : void 0,
					replyToId: message.id,
					provenance: turnProvenance,
					correlationId: params.correlationId
				});
			},
			durable: (payload) => {
				if (!hasClickClackReplyMedia(payload)) return false;
				const threadId = message.parent_message_id ? message.thread_root_id : void 0;
				return {
					to: target,
					threadId,
					replyToId: message.id,
					requiredCapabilities: deriveDurableFinalDeliveryRequirements({
						payload,
						threadId,
						replyToId: message.id,
						reconcileUnknownSend: true
					})
				};
			},
			onError: (error) => {
				throw error instanceof Error ? error : /* @__PURE__ */ new Error(`clickclack dispatch failed: ${String(error)}`);
			}
		},
		replyPipeline: {},
		record: { onRecordError: (error) => {
			throw error instanceof Error ? error : /* @__PURE__ */ new Error(`clickclack session record failed: ${String(error)}`);
		} }
	});
	try {
		await dispatch();
	} finally {
		await progress?.finalize();
		await activity?.finalize();
	}
}
//#endregion
//#region extensions/clickclack/src/gateway.ts
const CLICKCLACK_EVENT_PAGE_LIMIT = 500;
function payloadString(event, key) {
	return readStringField(event.payload, key) ?? "";
}
function eventCorrelationId(event) {
	return normalizeClickClackCorrelationId(event.payload?.correlation_id);
}
async function resolveEventMessage(params) {
	const messageId = payloadString(params.event, "message_id");
	if (!messageId) return null;
	try {
		return await params.client.message(messageId);
	} catch (error) {
		if (error instanceof ClickClackHttpError && error.status === 404) return null;
		throw error;
	}
}
function parseSocketEvent(data) {
	try {
		return JSON.parse(rawDataToString(data));
	} catch {
		return null;
	}
}
async function processEvent(params) {
	if (params.event.type !== "message.created" && params.event.type !== "thread.reply_created") return;
	if (params.abortSignal.aborted || payloadString(params.event, "author_id") === params.botUserId) return;
	const correlationId = eventCorrelationId(params.event);
	const message = await resolveEventMessage({
		client: correlationId ? createClickClackClient({
			baseUrl: params.account.apiEndpoint,
			token: params.account.token,
			correlationId
		}) : params.client,
		event: params.event
	});
	if (!message) {
		params.log?.warn?.(`[${params.account.accountId}] skipped unreadable ClickClack message before agent dispatch: type=${params.event.type} messageId=${payloadString(params.event, "message_id") || "unknown"}`);
		return;
	}
	if (params.abortSignal.aborted || message.author_id === params.botUserId) return;
	const access = await resolveClickClackInboundAccess({
		account: params.account,
		config: params.config,
		message
	});
	if (params.abortSignal.aborted) return;
	if (!access.shouldDispatch) {
		params.log?.info(`[${params.account.accountId}] skipped ClickClack message before agent dispatch: kind=${message.direct_conversation_id ? "dm" : "group"} requireMention=${access.requireMention ?? "unknown"} wasMentioned=${access.mentionFacts.wasMentioned} hasAnyMention=${access.mentionFacts.hasAnyMention ?? "unknown"} commandAuthorized=${access.commandAuthorized}`);
		return;
	}
	await handleClickClackInbound({
		account: params.account,
		config: params.config,
		message,
		access,
		buildContext: params.buildContext,
		...correlationId ? { correlationId } : {}
	});
}
async function drainEventBacklog(params) {
	let afterCursor = params.afterCursor;
	while (!params.abortSignal.aborted) {
		const events = (await params.client.eventPage(params.workspaceId, {
			afterCursor,
			limit: CLICKCLACK_EVENT_PAGE_LIMIT
		})).events;
		for (const event of events) {
			if (params.abortSignal.aborted) return afterCursor;
			if (!event.cursor || event.cursor === afterCursor) throw new Error("ClickClack event backlog returned a non-advancing cursor");
			await params.onEvent(event);
			afterCursor = event.cursor;
		}
		if (events.length === 0) return afterCursor;
	}
	return afterCursor;
}
async function startClickClackGatewayAccount(ctx) {
	const configuredAccount = resolveClickClackAccount({
		cfg: ctx.cfg,
		accountId: ctx.account.accountId
	});
	if (!configuredAccount.configured) throw new Error(`ClickClack is not configured for account "${configuredAccount.accountId}"`);
	const client = createClickClackClient({
		baseUrl: configuredAccount.apiEndpoint,
		token: configuredAccount.token
	});
	const workspaceId = await resolveWorkspaceId(client, configuredAccount.workspace);
	const me = await client.me();
	const account = {
		...configuredAccount,
		workspace: workspaceId,
		botUserId: configuredAccount.botUserId ?? me.id,
		botHandle: me.handle
	};
	const processIncomingEvent = (event) => processEvent({
		abortSignal: ctx.abortSignal,
		account,
		config: ctx.cfg,
		client,
		event,
		botUserId: account.botUserId,
		buildContext: ctx.channelRuntime?.inbound.buildContext,
		log: ctx.log
	});
	if (account.commandMenu) await syncClickClackCommandMenu({
		cfg: ctx.cfg,
		client,
		log: ctx.log,
		accountId: account.accountId
	});
	ctx.setStatus({
		accountId: account.accountId,
		running: true,
		lifecycle: "starting",
		configured: true,
		enabled: account.enabled,
		baseUrl: account.baseUrl
	});
	let afterCursor = "";
	let initialized = false;
	try {
		while (!ctx.abortSignal.aborted) {
			if (!initialized) {
				const page = await client.eventPage(workspaceId, { includeTail: true });
				if (page.tailCursor !== void 0) afterCursor = page.tailCursor;
				else for (const event of page.events) afterCursor = event.cursor || afterCursor;
				initialized = true;
			} else afterCursor = await drainEventBacklog({
				client,
				workspaceId,
				afterCursor,
				abortSignal: ctx.abortSignal,
				onEvent: processIncomingEvent
			});
			if (ctx.abortSignal.aborted) break;
			const socket = client.websocket(workspaceId, afterCursor);
			await new Promise((resolve) => {
				let settled = false;
				let closing = false;
				let loggedMessageFailure = false;
				let messageQueue = Promise.resolve();
				let removeAbortListener;
				const finishSocketCycle = () => {
					if (settled) return;
					settled = true;
					removeAbortListener?.();
					removeAbortListener = void 0;
					resolve();
				};
				const finishAfterQueuedMessages = () => {
					messageQueue.then(() => finishSocketCycle(), () => finishSocketCycle());
				};
				const reconnectAfterMessageFailure = (error) => {
					if (settled || ctx.abortSignal.aborted) return;
					if (!loggedMessageFailure) {
						loggedMessageFailure = true;
						ctx.log?.warn?.(`[${account.accountId}] ClickClack event processing failed; reconnecting: ${error instanceof Error ? error.message : formatErrorMessage(error)}`);
					}
					if (!closing) {
						closing = true;
						socket.close();
					}
				};
				const abort = () => {
					socket.close();
					finishSocketCycle();
				};
				ctx.abortSignal.addEventListener("abort", abort, { once: true });
				removeAbortListener = () => ctx.abortSignal.removeEventListener("abort", abort);
				socket.on("open", () => {
					ctx.setStatus(channelReadyPatch({ accountId: account.accountId }));
				});
				socket.on("message", (data) => {
					if (closing || settled) return;
					messageQueue = messageQueue.then(async () => {
						if (ctx.abortSignal.aborted) return;
						const event = parseSocketEvent(data);
						if (!event) {
							ctx.log?.warn?.(`[${account.accountId}] skipped malformed ClickClack websocket event`);
							return;
						}
						await processIncomingEvent(event);
						afterCursor = event.cursor || afterCursor;
					});
					messageQueue.catch(reconnectAfterMessageFailure);
				});
				socket.on("close", () => {
					closing = true;
					if (!ctx.abortSignal.aborted) ctx.setStatus({
						accountId: account.accountId,
						connected: false,
						lifecycle: "recovering"
					});
					finishAfterQueuedMessages();
				});
				socket.on("error", (error) => {
					if (settled || ctx.abortSignal.aborted) {
						finishSocketCycle();
						return;
					}
					if (closing) return;
					ctx.log?.warn?.(`[${account.accountId}] ClickClack websocket error; reconnecting: ${error instanceof Error ? error.message : String(error)}`);
					ctx.setStatus({
						accountId: account.accountId,
						connected: false,
						lifecycle: "recovering",
						lastError: error instanceof Error ? error.message : String(error)
					});
					closing = true;
					socket.close();
				});
			});
			if (!ctx.abortSignal.aborted) try {
				await sleepWithAbort(account.reconnectMs, ctx.abortSignal);
			} catch (error) {
				if (!ctx.abortSignal.aborted) throw error;
			}
		}
	} finally {
		ctx.setStatus(channelStoppedPatch({ accountId: account.accountId }));
	}
}
//#endregion
//#region extensions/clickclack/src/channel.ts
/**
* ClickClack channel plugin definition: target parsing, account config, status,
* gateway startup, and outbound delivery wiring.
*/
const CHANNEL_ID = CLICKCLACK_CHANNEL_ID;
const clickClackMessageAdapter = defineChannelMessageAdapter({
	id: CHANNEL_ID,
	durableFinal: {
		capabilities: {
			text: true,
			media: true,
			replyTo: true,
			thread: true,
			messageSendingHooks: true,
			reconcileUnknownSend: true
		},
		reconcileUnknownSendKinds: {
			text: true,
			media: true
		},
		reconcileUnknownSend: reconcileClickClackUnknownSend
	},
	send: {
		text: async (ctx) => {
			const messageId = await sendClickClackText({
				cfg: ctx.cfg,
				accountId: ctx.accountId,
				to: ctx.to,
				text: ctx.text,
				threadId: ctx.threadId,
				replyToId: ctx.replyToId,
				deliveryQueueId: ctx.deliveryQueueId,
				deliveryPartIndex: ctx.deliveryPartIndex,
				onPlatformSendDispatch: ctx.onPlatformSendDispatch,
				assertDirectAdapterHandoff: ctx.assertDirectAdapterHandoff
			});
			const threadId = ctx.threadId == null ? void 0 : String(ctx.threadId);
			const replyToId = ctx.replyToId ?? void 0;
			return {
				...messageId ? { messageId } : {},
				receipt: createMessageReceiptFromOutboundResults({
					results: messageId ? [{
						channel: CHANNEL_ID,
						messageId
					}] : [],
					threadId,
					replyToId,
					kind: "text"
				})
			};
		},
		media: async (ctx) => {
			const messageId = await sendClickClackMedia({
				cfg: ctx.cfg,
				accountId: ctx.accountId,
				to: ctx.to,
				text: ctx.text,
				mediaUrl: ctx.mediaUrl,
				mediaAccess: ctx.mediaAccess,
				mediaLocalRoots: ctx.mediaLocalRoots,
				mediaReadFile: ctx.mediaReadFile,
				threadId: ctx.threadId,
				replyToId: ctx.replyToId,
				deliveryQueueId: ctx.deliveryQueueId,
				deliveryPartIndex: ctx.deliveryPartIndex,
				onPlatformSendDispatch: ctx.onPlatformSendDispatch,
				assertDirectAdapterHandoff: ctx.assertDirectAdapterHandoff,
				onDeliveryResult: ctx.onDeliveryResult
			});
			const threadId = ctx.threadId == null ? void 0 : String(ctx.threadId);
			const replyToId = ctx.replyToId ?? void 0;
			return {
				messageId,
				receipt: createMessageReceiptFromOutboundResults({
					results: [{
						channel: CHANNEL_ID,
						messageId
					}],
					threadId,
					replyToId,
					kind: "media"
				})
			};
		}
	}
});
/**
* Channel plugin instance registered by the bundled ClickClack entry.
*/
const clickClackPlugin = createChatChannelPlugin({
	base: {
		id: CHANNEL_ID,
		meta: clickClackMeta,
		capabilities: {
			chatTypes: ["direct", "group"],
			threads: true,
			media: true,
			blockStreaming: true
		},
		reload: { configPrefixes: ["channels.clickclack"] },
		configSchema: clickClackConfigSchema,
		config: clickClackConfigAdapter,
		setupContract: clickClackSetupContract,
		setupWizard: clickClackSetupWizard,
		secrets: {
			secretTargetRegistryEntries,
			collectRuntimeConfigAssignments
		},
		messaging: {
			targetPrefixes: ["clickclack", "cc"],
			normalizeTarget: normalizeClickClackTarget,
			inferTargetChatType: ({ to }) => parseClickClackTarget(to).chatType,
			targetResolver: {
				looksLikeId: looksLikeClickClackTarget,
				hint: "<channel:name|dm:usr_id|thread:msg_id>"
			},
			resolveOutboundSessionRoute: ({ cfg, agentId, accountId, target, replyToId, threadId, currentSessionKey }) => {
				const parsed = parseClickClackTarget(target);
				const baseRoute = buildChannelOutboundSessionRoute({
					cfg,
					agentId,
					channel: CHANNEL_ID,
					accountId,
					recipientSessionExact: parsed.kind === "dm",
					peer: {
						kind: parsed.chatType === "direct" ? "direct" : "channel",
						id: buildClickClackTarget(parsed)
					},
					chatType: parsed.chatType,
					from: `clickclack:${accountId ?? DEFAULT_ACCOUNT_ID}`,
					to: buildClickClackTarget(parsed)
				});
				return buildThreadAwareOutboundSessionRoute({
					route: baseRoute,
					replyToId,
					threadId: threadId ?? (parsed.kind === "thread" ? parsed.id : void 0),
					currentSessionKey,
					useSuffix: false,
					canRecoverCurrentThread: () => true
				});
			},
			resolveSessionConversation: ({ rawId }) => {
				const parsed = parseClickClackTarget(rawId);
				if (parsed.kind === "dm") return null;
				return {
					id: parsed.id,
					threadId: parsed.kind === "thread" ? parsed.id : void 0,
					baseConversationId: parsed.id,
					parentConversationCandidates: [parsed.id]
				};
			}
		},
		status: createComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID),
			buildChannelSummary: ({ snapshot }) => ({
				ok: snapshot.configured,
				label: snapshot.configured ? "configured" : "missing config",
				detail: snapshot.baseUrl ?? ""
			}),
			resolveAccountSnapshot: ({ account }) => ({
				accountId: account.accountId,
				name: account.name,
				enabled: account.enabled,
				configured: account.configured,
				extra: {
					baseUrl: account.baseUrl,
					tokenSource: account.tokenSource,
					tokenStatus: account.tokenStatus
				}
			})
		}),
		gateway: { startAccount: startClickClackGatewayAccount },
		message: clickClackMessageAdapter
	},
	outbound: {
		base: { deliveryMode: "direct" },
		attachedResults: {
			channel: CHANNEL_ID,
			sendText: async ({ cfg, to, text, accountId, threadId, replyToId, deliveryQueueId, deliveryPartIndex, onPlatformSendDispatch, assertDirectAdapterHandoff }) => {
				return { messageId: await sendClickClackText({
					cfg,
					accountId,
					to,
					text,
					threadId,
					replyToId,
					deliveryQueueId,
					deliveryPartIndex,
					onPlatformSendDispatch,
					assertDirectAdapterHandoff
				}) ?? "" };
			},
			sendMedia: async ({ cfg, to, text, mediaUrl, mediaAccess, mediaLocalRoots, mediaReadFile, accountId, threadId, replyToId, deliveryQueueId, deliveryPartIndex, onPlatformSendDispatch, assertDirectAdapterHandoff, onDeliveryResult }) => {
				if (!mediaUrl) throw new Error("ClickClack media send requires mediaUrl");
				return { messageId: await sendClickClackMedia({
					cfg,
					accountId,
					to,
					text,
					mediaUrl,
					mediaAccess,
					mediaLocalRoots,
					mediaReadFile,
					threadId,
					replyToId,
					deliveryQueueId,
					deliveryPartIndex,
					onPlatformSendDispatch,
					assertDirectAdapterHandoff,
					onDeliveryResult: onDeliveryResult ? ({ messageId: acceptedMessageId, receipt }) => onDeliveryResult({
						channel: CHANNEL_ID,
						messageId: acceptedMessageId,
						receipt
					}) : void 0
				}) };
			}
		}
	}
});
//#endregion
export { slugifyDiscussionLabel as C, listPendingDiscussionOpens as D, clearPendingDiscussionOpen as E, recordPendingDiscussionOpen as O, resolveDiscussionLabel as S, clearDiscussionBindingGeneration as T, getClickClackDiscussionBindingStore as _, setClickClackRuntime as a, fallbackDiscussionLabel as b, markClickClackDiscussionChannelIdentityRevoked as c, discussionInfoForBinding as d, normalizedServerBaseUrl as f, bindingMatchesActiveSessionIncarnation as g, attachBindingToCurrentActiveSession as h, getClickClackRuntime as i, reserveDiscussionBindingGeneration as k, markClickClackDiscussionChannelRevoked as l, MAX_RETAINED_DETACHED_DISCUSSION_BINDINGS as m, buildClickClackTarget as n, clearClickClackDiscussionChannelRevoked as o, resolveDiscussionBindingAccount as p, parseClickClackTarget as r, isClickClackDiscussionChannelRevoked as s, clickClackPlugin as t, discussionAccounts as u, discussionCredentialFingerprint as v, truncateDiscussionDisplayTitle as w, isDiscussionSessionKey as x, discussionExternalRef as y };
