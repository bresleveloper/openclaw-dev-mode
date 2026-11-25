import { n as __reExport, t as __exportAll } from "./rolldown-runtime-782esTHO.mjs";
import { _ as resolveClickClackAccountConfig, c as CLICKCLACK_CHANNEL_ID, d as DEFAULT_ACCOUNT_ID, f as isClickClackAccountCurrent, g as resolveClickClackAccountAsync, l as clickClackConfigAdapter, m as listEnabledClickClackAccounts, n as clickClackSetupContract, p as listClickClackAccountIds, s as clickClackConfigSchema, t as clickClackSetupWizard, u as clickClackMeta, v as resolveClickClackAccountMetadata } from "./setup-surface-DSbHN_QA.mjs";
import { a as createClickClackClient, i as ClickClackHttpError, n as resolveChannelId, r as resolveWorkspaceId, s as normalizeClickClackCorrelationId } from "./resolve-qeIY2bou.mjs";
import { n as collectRuntimeConfigAssignments, r as secretTargetRegistryEntries } from "./secret-contract-Dj8nibUr.mjs";
import { resolveChannelMediaMaxBytes } from "openclaw/plugin-sdk/account-helpers";
import { parseDateStringTimestampMs } from "openclaw/plugin-sdk/number-runtime";
import { mergePairLoopGuardConfig } from "openclaw/plugin-sdk/pair-loop-guard-runtime";
import { normalizeTrimmedStringList, readStringField } from "openclaw/plugin-sdk/string-coerce-runtime";
import { buildChannelOutboundSessionRoute, buildThreadAwareOutboundSessionRoute, createChatChannelPlugin } from "openclaw/plugin-sdk/channel-core";
import { buildChannelProgressDraftLine, createChannelMessageAdapterFromOutbound, createChannelMessageReplyPipeline, createMessageReceiptFromOutboundResults, defineChannelMessageAdapter, deriveDurableFinalDeliveryRequirements, formatChannelProgressDraftLineForEntry, isCompleteAgentPreamble } from "openclaw/plugin-sdk/channel-outbound";
import { createComputedAccountStatusAdapter, createDefaultChannelRuntimeState } from "openclaw/plugin-sdk/status-helpers";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { channelReadyPatch, channelStoppedPatch } from "openclaw/plugin-sdk/gateway-runtime";
import { listNativeCommandSpecsForConfig } from "openclaw/plugin-sdk/native-command-registry";
import { createSubsystemLogger, sleepWithAbort } from "openclaw/plugin-sdk/runtime-env";
import { safeParseJson, truncateCodePoints } from "openclaw/plugin-sdk/text-utility-runtime";
import { rawDataToString } from "openclaw/plugin-sdk/webhook-ingress";
import { startWebSocketKeepalive } from "openclaw/plugin-sdk/websocket-runtime";
import { isDeepStrictEqual } from "node:util";
import { parseAccessGroupAllowFromEntry } from "openclaw/plugin-sdk/access-groups";
import { formatNormalizedAllowFromEntries, resolveAllowlistMatchByCandidates } from "openclaw/plugin-sdk/allow-from";
import { normalizeAgentId } from "openclaw/plugin-sdk/routing";
import { createHash, randomUUID } from "node:crypto";
import { createAsyncLock } from "openclaw/plugin-sdk/async-lock-runtime";
import { assertPluginStateReadAvailable, preparePluginStateRead } from "openclaw/plugin-sdk/plugin-state-runtime";
import { sha256Hex } from "openclaw/plugin-sdk/node-crypto-runtime";
import { resolveSessionAgentIdStrict } from "openclaw/plugin-sdk/agent-scope-runtime";
import { captureSessionEntryCurrentCheckAsync } from "openclaw/plugin-sdk/session-binding-runtime";
import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
import { buildChannelInboundEventContext, createChannelInboundEnvelopeBuilderAsync, createChannelPartialDeliveryError, recordChannelBotPairLoopAndCheckSuppression } from "openclaw/plugin-sdk/channel-inbound";
import { extensionForMime } from "openclaw/plugin-sdk/media-mime";
import { loadOutboundMediaFromUrl } from "openclaw/plugin-sdk/outbound-media";
import { sanitizeAssistantVisibleText } from "openclaw/plugin-sdk/text-chunking";
import { raceWithTimeout } from "openclaw/plugin-sdk/time-runtime";
// src/channels/mention-gating.ts
function resolveBotThreadMentionPolicy(params) {
	if (!params.isBotOwnedThread || params.requireMentionInBotThreads === void 0) return {
		requireMention: params.requireMention,
		implicitMentionKinds: params.implicitMentionKinds
	};
	return {
		requireMention: params.requireMentionInBotThreads,
		implicitMentionKinds: params.requireMentionInBotThreads ? params.implicitMentionKinds?.filter((kind) => kind === "native") : params.implicitMentionKinds
	};
}
// \0openclaw:bundled-sdk:openclaw/plugin-sdk/channel-mention-gating
var channel_mention_gating_exports = /* @__PURE__ */ __exportAll({ resolveBotThreadMentionPolicy: () => resolveBotThreadMentionPolicy });
import * as import_openclaw_plugin_sdk_channel_mention_gating from "openclaw/plugin-sdk/channel-mention-gating";
__reExport(channel_mention_gating_exports, import_openclaw_plugin_sdk_channel_mention_gating);
// extensions/clickclack/src/discussions/binding-generation.ts
const GENERATION_STORE_OPTIONS = {
	namespace: "discussion-binding-generations",
	maxEntries: 1e4,
	overflowPolicy: "reject-new"
};
const storesByRuntime$2 = /* @__PURE__ */ new WeakMap();
function withGenerationStore(runtime, run) {
	let owner = storesByRuntime$2.get(runtime);
	if (!owner) {
		owner = {
			store: runtime.state.openKeyedStoreV2(GENERATION_STORE_OPTIONS),
			withLock: createAsyncLock()
		};
		storesByRuntime$2.set(runtime, owner);
	}
	const currentOwner = owner;
	return currentOwner.withLock(() => run(currentOwner));
}
function mutateGeneration(runtime, sessionKey, decide) {
	return withGenerationStore(runtime, async ({ store }) => {
		const { observe, compareAndApply } = store;
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
		generation ??= randomUUID();
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
function getPendingDiscussionOpen(runtime, sessionKey) {
	return withGenerationStore(runtime, async ({ store }) => {
		const entry = await store.lookup(sessionKey);
		return entry?.pending ? {
			sessionKey,
			generation: entry.generation,
			...entry.pending
		} : void 0;
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
// extensions/clickclack/src/discussions/binding-store.ts
/** Retained for the shipped synchronous ScopedSessionAccessProvider contract. */
function bindingMatchesActiveSessionIncarnation(runtime, sessionKey, binding) {
	const entry = runtime.agent.session.getSessionEntry({
		sessionKey,
		readConsistency: "latest"
	});
	return Boolean(entry && binding.sessionId && entry.sessionId === binding.sessionId && entry.archivedAt === void 0);
}
async function readDiscussionSessionEntry(runtime, sessionKey) {
	const params = {
		sessionKey,
		readConsistency: "latest"
	};
	return await runtime.agent.session.getSessionEntryAsync(params);
}
/**
* Refresh the replaceable session attachment without changing the durable room identity.
* The store registers persisted state before reindexing, so a failed write leaves the
* previous attachment authoritative in both persistence and memory.
*/
async function attachBindingToCurrentActiveSession(params) {
	const entry = await readDiscussionSessionEntry(params.runtime, params.sessionKey);
	if (!entry?.sessionId || entry.archivedAt !== void 0) return;
	if (entry.sessionId === params.binding.sessionId && params.binding.detachedAt === void 0) return params.binding;
	const { detachedAt: _detachedAt, ...retained } = params.binding;
	const attached = {
		...retained,
		sessionId: entry.sessionId
	};
	return await params.store.setIfCurrent(params.sessionKey, params.binding, attached) ? attached : void 0;
}
const DISCUSSION_BINDINGS_NAMESPACE = "discussion-bindings";
const MAX_DISCUSSION_BINDINGS = 1e4;
const BINDING_STORE_OPTIONS = {
	namespace: DISCUSSION_BINDINGS_NAMESPACE,
	maxEntries: MAX_DISCUSSION_BINDINGS,
	overflowPolicy: "reject-new"
};
const storesByRuntime$1 = /* @__PURE__ */ new WeakMap();
function channelKey(serverBaseUrl, channelId) {
	return `${serverBaseUrl.replace(/\/+$/u, "")}\0${channelId}`;
}
/** SQLite-backed session/channel bindings with a process-local inbound lookup index. */
var ClickClackDiscussionBindingStore = class {
	#nativeStore;
	#store;
	#sessionByChannel = /* @__PURE__ */ new Map();
	#detachedAtBySession = /* @__PURE__ */ new Map();
	#channelBySession = /* @__PURE__ */ new Map();
	#runtime;
	#withMutation = createAsyncLock();
	#prepared = false;
	#preparing;
	constructor(runtime) {
		this.#runtime = runtime;
	}
	async prepare() {
		if (!this.#prepared) await this.entries();
	}
	async getAsync(sessionKey) {
		return await this.#workerStore().lookup(sessionKey);
	}
	async prepareRead(sessionKey) {
		return await preparePluginStateRead(this.#workerStore(), sessionKey) ?? {
			read: () => this.get(sessionKey),
			release() {}
		};
	}
	get(sessionKey) {
		this.#nativeStore ??= this.#runtime.state.openSyncKeyedStore(BINDING_STORE_OPTIONS);
		return this.#nativeStore.lookup(sessionKey);
	}
	assertReadAvailable() {
		assertPluginStateReadAvailable(this.#workerStore());
	}
	async hasCapacity(sessionKey) {
		return await this.getAsync(sessionKey) !== void 0 || await this.countAsync() < MAX_DISCUSSION_BINDINGS;
	}
	async getByChannel(serverBaseUrl, channelId) {
		const key = channelKey(serverBaseUrl, channelId);
		const sessionKey = this.#sessionByChannel.get(key);
		if (!sessionKey) return;
		const binding = await this.getAsync(sessionKey);
		if (!binding || channelKey(binding.serverBaseUrl, binding.channelId) !== key) {
			if (this.#sessionByChannel.get(key) === sessionKey) this.#sessionByChannel.delete(key);
			return;
		}
		return {
			sessionKey,
			binding
		};
	}
	async setIfCurrent(sessionKey, expected, binding, options) {
		return await this.#mutateIfCurrent(sessionKey, expected, binding, options);
	}
	async observeCurrent(sessionKey) {
		return await this.#withMutation(async () => {
			const observed = await this.#workerStore().observe(sessionKey);
			this.#publish(sessionKey, observed.value);
			return {
				binding: observed.value,
				condition: {
					namespace: DISCUSSION_BINDINGS_NAMESPACE,
					key: sessionKey,
					comparison: observed.comparison
				}
			};
		});
	}
	async deleteIfCurrent(sessionKey, expected, options) {
		return await this.#mutateIfCurrent(sessionKey, expected, void 0, options);
	}
	async #mutateIfCurrent(sessionKey, expected, next, options) {
		return await this.#withMutation(async () => {
			const worker = this.#workerStore();
			const observed = await worker.observe(sessionKey);
			if (!isDeepStrictEqual(observed.value, expected)) {
				this.#publish(sessionKey, observed.value);
				return false;
			}
			const result = await (options?.assertCurrent ? this.#runtime.state.openKeyedStoreV2(BINDING_STORE_OPTIONS, { assertCurrent: options.assertCurrent }) : worker).compareAndApply(sessionKey, observed.comparison, next ? {
				operation: "update",
				action: "set",
				value: next
			} : {
				operation: "delete",
				action: "delete"
			});
			this.#publish(sessionKey, result.status === "conflict" ? result.current.value : next);
			return result.status === "applied";
		});
	}
	#publish(sessionKey, binding) {
		this.#unindex(sessionKey);
		if (binding) this.#index(sessionKey, binding);
	}
	async entries() {
		const load = async () => (await this.#workerStore().entries()).map((entry) => ({
			sessionKey: entry.key,
			binding: entry.value
		}));
		if (this.#prepared) return await load();
		this.#preparing ??= this.#withMutation(async () => {
			const entries = await load();
			for (const { sessionKey, binding } of entries) this.#index(sessionKey, binding);
			this.#prepared = true;
			return entries;
		}).finally(() => {
			this.#preparing = void 0;
		});
		return await this.#preparing;
	}
	async countAsync() {
		return await this.#workerStore().count();
	}
	detachedCount() {
		return this.#detachedAtBySession.size;
	}
	#workerStore() {
		return this.#store ??= this.#runtime.state.openKeyedStoreV2(BINDING_STORE_OPTIONS);
	}
	async oldestDetached() {
		let oldestSessionKey;
		let oldestDetachedAt = Number.POSITIVE_INFINITY;
		for (const [sessionKey, detachedAt] of this.#detachedAtBySession) if (detachedAt < oldestDetachedAt || detachedAt === oldestDetachedAt && (oldestSessionKey === void 0 || sessionKey < oldestSessionKey)) {
			oldestSessionKey = sessionKey;
			oldestDetachedAt = detachedAt;
		}
		if (!oldestSessionKey) return;
		const binding = await this.getAsync(oldestSessionKey);
		if (!binding || binding.detachedAt === void 0) {
			if (this.#detachedAtBySession.get(oldestSessionKey) === oldestDetachedAt) this.#detachedAtBySession.delete(oldestSessionKey);
			return this.oldestDetached();
		}
		return {
			sessionKey: oldestSessionKey,
			binding
		};
	}
	#index(sessionKey, binding) {
		const channel = channelKey(binding.serverBaseUrl, binding.channelId);
		this.#channelBySession.set(sessionKey, channel);
		this.#sessionByChannel.set(channel, sessionKey);
		if (binding.detachedAt !== void 0) this.#detachedAtBySession.set(sessionKey, binding.detachedAt);
	}
	#unindex(sessionKey) {
		const channel = this.#channelBySession.get(sessionKey);
		this.#channelBySession.delete(sessionKey);
		if (channel) this.#sessionByChannel.delete(channel);
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
// extensions/clickclack/src/discussions/naming.ts
function shortSessionHash(sessionKey) {
	return sha256Hex(sessionKey).slice(0, 32);
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
	return `disc-${sha256Hex([
		identity.mainSessionKey,
		identity.sessionId,
		identity.serverBaseUrl,
		identity.channelId,
		identity.externalRef
	].join("\0")).slice(0, 32)}`;
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
	return sha256Hex(token);
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
// extensions/clickclack/src/discussions/eligibility.ts
function discussionAccounts(cfg) {
	return listClickClackAccountIds(cfg).map((accountId) => resolveClickClackAccountMetadata({
		cfg,
		accountId
	})).filter((account) => account.enabled && account.configured && account.discussions.enabled);
}
function normalizedServerBaseUrl(account) {
	return account.baseUrl.replace(/\/+$/u, "");
}
/** Resolves the sole live account and rejects bindings pinned to an older destination. */
function resolveDiscussionBindingAccount(cfg, binding) {
	const accounts = listEnabledClickClackAccounts(cfg).filter((account) => account.configured && account.discussions.enabled);
	return resolveBindingAccount(accounts.length === 1 ? accounts[0] : void 0, binding);
}
function resolveBindingAccount(account, binding) {
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
/** Config and binding checks stay synchronous after credential preparation. */
function isDiscussionAccountCurrent(cfg, account) {
	const accounts = discussionAccounts(cfg);
	const current = accounts.length === 1 ? accounts[0] : void 0;
	return current !== void 0 && current.accountId === account.accountId && current.baseUrl === account.baseUrl && current.apiEndpoint === account.apiEndpoint && current.discussions.workspace === account.discussions.workspace && current.config.tokenFile?.trim() === account.config.tokenFile?.trim() && (current.tokenSource === "tokenFile" || current.token === account.token);
}
function resolvePreparedDiscussionBindingAccount(cfg, binding, account) {
	return isDiscussionAccountCurrent(cfg, account) ? resolveBindingAccount(account, binding) : { state: "unavailable" };
}
async function prepareDiscussionBindingAccount(cfg, binding) {
	const accounts = discussionAccounts(cfg);
	if (accounts.length !== 1) return { state: "unavailable" };
	return resolveBindingAccount(await resolveClickClackAccountAsync({
		cfg,
		accountId: accounts[0].accountId
	}), binding);
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
// extensions/clickclack/src/discussions/revoked-channel-store.ts
const STORE_OPTIONS = {
	namespace: "discussion-revoked-channels",
	maxEntries: 1e5,
	overflowPolicy: "reject-new"
};
const storesByRuntime = /* @__PURE__ */ new WeakMap();
const nativeStoresByRuntime = /* @__PURE__ */ new WeakMap();
const legacyAdoptionsByRuntime = /* @__PURE__ */ new WeakMap();
const legacyAdoptedRuntimes = /* @__PURE__ */ new WeakSet();
function revokedChannelKey(params) {
	return createHash("sha256").update(JSON.stringify([params.serverBaseUrl.replace(/\/+$/u, ""), params.channelId]), "utf8").digest("hex").slice(0, 32);
}
function adoptLegacyMarkers(runtime) {
	let adoption = legacyAdoptionsByRuntime.get(runtime);
	if (!adoption) {
		adoption = (async () => {
			const store = getStore(runtime);
			for (const entry of await store.entries()) if (entry.key.includes("\0")) {
				await store.registerIfAbsent(revokedChannelKey(entry.value), entry.value);
				await store.delete(entry.key);
			}
			legacyAdoptedRuntimes.add(runtime);
		})();
		adoption.catch(() => legacyAdoptionsByRuntime.delete(runtime));
		legacyAdoptionsByRuntime.set(runtime, adoption);
	}
	return adoption;
}
function getStore(runtime) {
	const existing = storesByRuntime.get(runtime);
	if (existing) return existing;
	const created = runtime.state.openKeyedStoreV2(STORE_OPTIONS);
	storesByRuntime.set(runtime, created);
	return created;
}
/** Records managed ownership before its live binding is released. */
async function markClickClackDiscussionChannelRevoked(runtime, sessionKey, binding, options) {
	const value = {
		accountId: binding.accountId,
		serverBaseUrl: binding.serverBaseUrl,
		channelId: binding.channelId,
		revokedAt: Date.now(),
		binding
	};
	await adoptLegacyMarkers(runtime);
	const bindings = getClickClackDiscussionBindingStore(runtime);
	for (;;) {
		const owner = await bindings.observeCurrent(sessionKey);
		const isCurrent = isDeepStrictEqual(owner.binding, binding);
		const observed = await getStore(runtime).observe(revokedChannelKey(value));
		if (observed.value && !observed.value.binding) return isCurrent;
		if (!isCurrent && observed.value) return false;
		let authorityRejected = false;
		try {
			if ((await (isCurrent && options?.assertCurrent ? runtime.state.openKeyedStoreV2(STORE_OPTIONS, { assertCurrent: () => {
				try {
					options.assertCurrent?.();
				} catch (error) {
					authorityRejected = true;
					throw error;
				}
			} }) : getStore(runtime)).compareAndApply(revokedChannelKey(value), observed.comparison, {
				operation: "update",
				action: "set",
				value
			}, { conditions: [owner.condition] })).status !== "conflict") return isCurrent;
		} catch (error) {
			if (authorityRejected) {
				const current = await bindings.observeCurrent(sessionKey);
				if (!isDeepStrictEqual(current.binding, binding)) continue;
			}
			throw error;
		}
	}
}
async function markClickClackDiscussionChannelIdentityRevoked(params) {
	const value = {
		accountId: params.accountId,
		serverBaseUrl: params.serverBaseUrl.replace(/\/+$/u, ""),
		channelId: params.channelId,
		revokedAt: Date.now()
	};
	await adoptLegacyMarkers(params.runtime);
	await getStore(params.runtime).register(revokedChannelKey(value), value);
}
async function clearClickClackDiscussionChannelRevoked(params) {
	await adoptLegacyMarkers(params.runtime);
	await getStore(params.runtime).delete(revokedChannelKey(params));
}
/** Distinguishes a released managed channel from a genuinely ordinary channel. */
function isClickClackDiscussionChannelRevoked(params) {
	if (!legacyAdoptedRuntimes.has(params.runtime)) return true;
	let store = nativeStoresByRuntime.get(params.runtime);
	if (!store) {
		store = params.runtime.state.openSyncKeyedStore(STORE_OPTIONS);
		nativeStoresByRuntime.set(params.runtime, store);
	}
	return revocationApplies(store.lookup(revokedChannelKey(params)), params.binding);
}
async function prepareClickClackDiscussionChannelRevocation(params) {
	await adoptLegacyMarkers(params.runtime);
	const facts = await preparePluginStateRead(getStore(params.runtime), revokedChannelKey(params));
	return {
		isRevoked: (binding) => {
			if (binding && revokedChannelKey(binding) !== revokedChannelKey(params)) return true;
			return facts ? revocationApplies(facts.read(), binding) : isClickClackDiscussionChannelRevoked({
				...params,
				binding
			});
		},
		release: () => facts?.release()
	};
}
async function isClickClackDiscussionChannelRevokedAsync(params) {
	await adoptLegacyMarkers(params.runtime);
	return revocationApplies(await getStore(params.runtime).lookup(revokedChannelKey(params)), params.binding);
}
function revocationApplies(revoked, binding) {
	return Boolean(revoked && (!binding || !revoked.binding || isDeepStrictEqual(revoked.binding, binding)));
}
// extensions/clickclack/src/discussions/session-authority.ts
/** Retain the session owner's receipt-backed facts until the external effect completes. */
async function prepareDiscussionSessionEntry(runtime, sessionKey) {
	const config = runtime.config.current();
	const agentId = resolveSessionAgentIdStrict({
		config,
		sessionKey
	});
	return await captureSessionEntryCurrentCheckAsync({
		agentId,
		sessionKey,
		storePath: runtime.agent.session.resolveStorePath(config.session?.store, { agentId }),
		matchGeneration: false,
		fields: ["sessionId", "archivedAt"]
	});
}
// extensions/clickclack/src/discussions/routing.ts
const discussionsLog = createSubsystemLogger("clickclack/discussions");
async function resolveClickClackDiscussionRoute(params) {
	const store = getClickClackDiscussionBindingStore(params.runtime);
	await store.prepare();
	let matched = await store.getByChannel(params.serverBaseUrl, params.channelId);
	let pending = false;
	if (!matched) {
		pending = await hasPendingDiscussionOpenForDestination(params);
		matched = await store.getByChannel(params.serverBaseUrl, params.channelId);
	}
	let revocation;
	let bindingFacts;
	let session;
	try {
		revocation = await prepareClickClackDiscussionChannelRevocation(params);
		if (revocation.isRevoked(matched?.binding)) return { state: "revoked" };
		if (!matched) return { state: pending ? "revoked" : "unbound" };
		if (matched.binding.accountId !== params.accountId) return { state: "revoked" };
		if (matched.binding.serverBaseUrl !== params.serverBaseUrl.replace(/\/+$/u, "")) return { state: "revoked" };
		const resolved = await prepareDiscussionBindingAccount(params.runtime.config.current(), matched.binding);
		if (resolved.state !== "active") return { state: "revoked" };
		bindingFacts = await store.prepareRead(matched.sessionKey);
		let binding;
		try {
			binding = await attachBindingToCurrentActiveSession({
				runtime: params.runtime,
				store,
				sessionKey: matched.sessionKey,
				binding: matched.binding
			});
		} catch (error) {
			discussionsLog.warn(`discussion attachment refresh failed for channel ${params.channelId}: ${String(error)}`);
			return { state: "revoked" };
		}
		if (!binding) return { state: "revoked" };
		session = await prepareDiscussionSessionEntry(params.runtime, matched.sessionKey);
		session.source();
		const current = bindingFacts.read();
		if (!current || current.externalRef !== binding.externalRef || current.channelId !== binding.channelId || revocation.isRevoked(current) || session.entry?.sessionId !== binding.sessionId || session.entry.archivedAt !== void 0 || resolvePreparedDiscussionBindingAccount(params.runtime.config.current(), binding, resolved.account).state !== "active") return { state: "revoked" };
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
	} catch {
		return { state: "revoked" };
	} finally {
		session?.release();
		bindingFacts?.release();
		revocation?.release();
	}
}
// extensions/clickclack/src/group-policy.ts
function resolveClickClackGroupPolicy(params) {
	const { account, channelId } = params;
	const channelKey = channelId?.trim();
	const groups = channelKey ? account.groups : void 0;
	const wildcard = groups?.["*"];
	const exact = channelKey ? groups?.[channelKey] : void 0;
	return {
		requireMention: exact?.requireMention ?? wildcard?.requireMention ?? account.requireMention === true,
		requireMentionInBotThreads: exact?.requireMentionInBotThreads ?? wildcard?.requireMentionInBotThreads ?? account.requireMentionInBotThreads,
		mentionPatterns: exact?.mentionPatterns ?? wildcard?.mentionPatterns ?? account.mentionPatterns ?? [],
		allowBots: exact?.allowBots ?? wildcard?.allowBots ?? account.allowBots ?? false,
		botLoopProtection: mergePairLoopGuardConfig(account.botLoopProtection, wildcard?.botLoopProtection, exact?.botLoopProtection)
	};
}
// extensions/clickclack/src/runtime.ts
const { setRuntime: setClickClackRuntime, getRuntime: getClickClackRuntime } = createPluginRuntimeStore({
	pluginId: "clickclack",
	errorMessage: "ClickClack runtime not initialized"
});
// extensions/clickclack/src/target.ts
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
function buildClickClackTarget(target) {
	return `${target.kind}:${target.id}`;
}
// extensions/clickclack/src/access.ts
const CHANNEL_ID$2 = "clickclack";
const CLICKCLACK_MENTION_PATTERN = /(?:^|[^a-z0-9_@-])@([a-z0-9][a-z0-9_-]{1,31})(?![a-z0-9_-])/giu;
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
async function isClickClackBotOwnedThread(params) {
	const { account, message } = params;
	if (!account.botUserId || !message.parent_message_id || !message.thread_root_id || message.thread_root_id === message.id || !message.channel_id || message.direct_conversation_id || message.workspace_id !== account.workspace) return false;
	try {
		const root = await createClickClackClient({
			baseUrl: account.apiEndpoint,
			token: account.token
		}).message(message.thread_root_id);
		return root.id === message.thread_root_id && root.thread_root_id === root.id && !root.parent_message_id && !root.direct_conversation_id && root.workspace_id === message.workspace_id && root.channel_id === message.channel_id && root.author_id === account.botUserId;
	} catch {
		return false;
	}
}
async function resolveClickClackInboundAccess(params) {
	const runtime = getClickClackRuntime();
	const rootPolicyConfigured = resolveClickClackGroupPolicy({
		account: params.account,
		channelId: params.message.channel_id
	}).requireMentionInBotThreads !== void 0;
	const isCurrent = () => isClickClackAccountCurrent({
		cfg: runtime.config.current(),
		account: params.account
	});
	const isBotOwnedThread = rootPolicyConfigured && await isClickClackBotOwnedThread(params);
	const routeConfig = rootPolicyConfigured ? runtime.config.current() : params.config;
	const routeAccountConfig = rootPolicyConfigured ? resolveClickClackAccountConfig(routeConfig, params.account.accountId) : params.account;
	const routingMessage = params.message;
	const routingAccount = {
		...params.account,
		agentId: routeAccountConfig.agentId
	};
	const routeRuntime = getClickClackRuntime();
	const isDirect = Boolean(routingMessage.direct_conversation_id);
	const target = buildClickClackTarget(isDirect ? {
		chatType: "direct",
		kind: "dm",
		id: routingMessage.author_id
	} : {
		chatType: "group",
		kind: "channel",
		id: routingMessage.channel_id ?? ""
	});
	const routingConfig = routeConfig;
	const peer = {
		kind: isDirect ? "direct" : "channel",
		id: target
	};
	let accountRoute = routeRuntime.channel.routing.resolveAgentRoute({
		cfg: routingConfig,
		channel: CHANNEL_ID$2,
		accountId: routingAccount.accountId,
		peer
	});
	const agentId = normalizeAgentId(routingAccount.agentId ?? accountRoute.agentId);
	if (agentId !== accountRoute.agentId) {
		const dmScope = routingConfig.session?.dmScope ?? "main";
		const sessionKey = routeRuntime.channel.routing.buildAgentSessionKey({
			agentId,
			mainKey: routingConfig.session?.mainKey,
			channel: CHANNEL_ID$2,
			accountId: routingAccount.accountId,
			peer,
			dmScope,
			identityLinks: routingConfig.session?.identityLinks
		});
		const mainSessionKey = routeRuntime.channel.routing.buildAgentSessionKey({
			agentId,
			mainKey: routingConfig.session?.mainKey,
			channel: CHANNEL_ID$2,
			accountId: routingAccount.accountId,
			dmScope: "main"
		});
		accountRoute = {
			...accountRoute,
			agentId,
			dmScope,
			sessionKey,
			mainSessionKey,
			lastRoutePolicy: sessionKey === mainSessionKey ? "main" : "session"
		};
	}
	const discussionResolution = await (!isDirect && routingMessage.channel_id ? resolveClickClackDiscussionRoute({
		runtime: routeRuntime,
		accountId: routingAccount.accountId,
		serverBaseUrl: routingAccount.baseUrl,
		workspaceId: routingMessage.workspace_id,
		channelId: routingMessage.channel_id
	}) : { state: "unbound" });
	const discussionRoute = discussionResolution.state === "active" ? discussionResolution.route : void 0;
	const preparedRoute = {
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
	const resolveMentionFacts = (mentionConfig, mentionPatterns) => {
		if (preparedRoute.isDirect) return {
			canDetectMention: false,
			wasMentioned: false
		};
		const body = params.message.body;
		if (!body) return {
			canDetectMention: true,
			wasMentioned: false,
			hasAnyMention: false
		};
		const sharedMentionRegexes = (0, channel_mention_gating_exports.buildMentionRegexes)(mentionConfig, preparedRoute.route.agentId, {
			provider: CHANNEL_ID$2,
			conversationId: params.message.channel_id
		});
		const localMentionRegexes = mentionPatterns.length ? (0, channel_mention_gating_exports.buildMentionRegexes)({
			...mentionConfig,
			messages: {
				...mentionConfig.messages,
				groupChat: {
					...mentionConfig.messages?.groupChat,
					mentionPatterns
				}
			}
		}, void 0, {
			provider: CHANNEL_ID$2,
			conversationId: params.message.channel_id
		}) : [];
		const bodyForRegex = (0, channel_mention_gating_exports.normalizeMentionText)(body);
		const hasConfiguredMention = [...sharedMentionRegexes, ...localMentionRegexes].some((regex) => regex.test(bodyForRegex));
		const mentionHandles = [...body.matchAll(CLICKCLACK_MENTION_PATTERN)].map((match) => match[1]?.toLowerCase()).filter((handle) => Boolean(handle));
		const botHandle = params.account.botHandle?.replace(/^@/u, "").trim().toLowerCase();
		return {
			canDetectMention: true,
			wasMentioned: (botHandle ? mentionHandles.includes(botHandle) : false) || hasConfiguredMention,
			hasAnyMention: mentionHandles.length > 0 || hasConfiguredMention
		};
	};
	const cfg = rootPolicyConfigured ? runtime.config.current() : params.config;
	const accountPolicy = rootPolicyConfigured ? resolveClickClackAccountConfig(cfg, params.account.accountId) : params.account;
	const effectiveGroupPolicy = resolveClickClackGroupPolicy({
		account: accountPolicy,
		channelId: params.message.channel_id
	});
	const threadMentionPolicy = resolveBotThreadMentionPolicy({
		isBotOwnedThread,
		requireMentionInBotThreads: effectiveGroupPolicy.requireMentionInBotThreads,
		requireMention: effectiveGroupPolicy.requireMention
	});
	const shouldCheckCommand = runtime.channel.commands.shouldComputeCommandAuthorized(params.message.body, cfg);
	const mentionFacts = resolveMentionFacts(cfg, effectiveGroupPolicy.mentionPatterns);
	const isBotAuthor = params.message.author?.kind === "bot";
	const botMentionAllowed = !isBotAuthor || effectiveGroupPolicy.allowBots === true || effectiveGroupPolicy.allowBots === "mentions" && (preparedRoute.isDirect || mentionFacts.wasMentioned);
	if (!isCurrent() || params.message.kind !== void 0 && params.message.kind !== "message" || !botMentionAllowed) return {
		shouldDispatch: false,
		isCurrent,
		commandAuthorized: false,
		requireMention: threadMentionPolicy.requireMention,
		mentionFacts,
		preparedRoute
	};
	const allowFrom = accountPolicy.allowFrom ?? ["*"];
	const ingressAllowFrom = isBotAuthor ? allowFrom.filter((entry) => normalizeClickClackUserId(entry) !== "*") : allowFrom;
	const botLoopNowMs = parseDateStringTimestampMs(params.message.created_at);
	const botLoopProtection = isBotAuthor && params.message.author_id !== params.account.botUserId && params.account.botUserId ? {
		scopeId: params.account.workspace,
		conversationId: params.message.parent_message_id && params.message.thread_root_id ? params.message.thread_root_id : preparedRoute.isDirect ? params.message.direct_conversation_id ?? params.message.author_id : params.message.channel_id ?? params.message.thread_root_id ?? params.message.author_id,
		senderId: params.message.author_id,
		receiverId: params.account.botUserId,
		eventId: params.message.id,
		...botLoopNowMs !== void 0 ? { nowMs: botLoopNowMs } : {},
		config: effectiveGroupPolicy.botLoopProtection,
		defaultsConfig: cfg.channels?.defaults?.botLoopProtection,
		defaultEnabled: true
	} : void 0;
	const allowTextCommands = accountPolicy.replyMode !== "model" && runtime.channel.commands.shouldHandleTextCommands({
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
			requireMention: threadMentionPolicy.requireMention,
			allowTextCommands
		} },
		command: shouldCheckCommand ? {
			cfg,
			modeWhenAccessGroupsOff: "configured",
			hasControlCommand: runtime.channel.text.hasControlCommand(params.message.body, cfg)
		} : false
	});
	const isAdmissionCurrent = () => {
		if (!isCurrent()) return false;
		const currentCfg = runtime.config.current();
		const currentAccountPolicy = resolveClickClackAccountConfig(currentCfg, params.account.accountId);
		const currentGroupPolicy = resolveClickClackGroupPolicy({
			account: currentAccountPolicy,
			channelId: params.message.channel_id
		});
		const currentAllowFrom = currentAccountPolicy.allowFrom ?? ["*"];
		const currentIngressAllowFrom = isBotAuthor ? currentAllowFrom.filter((entry) => normalizeClickClackUserId(entry) !== "*") : currentAllowFrom;
		const directSenderAllowed = resolveAllowlistMatchByCandidates({
			allowList: formatNormalizedAllowFromEntries({
				allowFrom: currentIngressAllowFrom.filter((entry) => parseAccessGroupAllowFromEntry(entry) === null),
				normalizeEntry: normalizeClickClackUserId
			}),
			candidates: [{
				value: normalizeClickClackUserId(params.message.author_id) ?? void 0,
				source: "id"
			}]
		}).allowed;
		const staticGroupAllowed = currentIngressAllowFrom.some((entry) => {
			const name = parseAccessGroupAllowFromEntry(entry);
			if (!name) return false;
			const group = currentCfg.accessGroups?.[name];
			return group?.type === "message.senders" && resolved.state.allowlists[preparedRoute.isDirect ? "dm" : "group"].accessGroups.matched.includes(name) && isDeepStrictEqual(group, cfg.accessGroups?.[name]);
		});
		if (!directSenderAllowed && !staticGroupAllowed) return false;
		const currentMentionFacts = resolveMentionFacts(currentCfg, currentGroupPolicy.mentionPatterns);
		if (isBotAuthor && currentGroupPolicy.allowBots !== true && !(currentGroupPolicy.allowBots === "mentions" && (preparedRoute.isDirect || currentMentionFacts.wasMentioned))) return false;
		const currentThreadPolicy = resolveBotThreadMentionPolicy({
			isBotOwnedThread,
			requireMentionInBotThreads: currentGroupPolicy.requireMentionInBotThreads,
			requireMention: currentGroupPolicy.requireMention
		});
		return !(0, channel_mention_gating_exports.resolveInboundMentionDecision)({
			facts: currentMentionFacts,
			policy: {
				isGroup: !preparedRoute.isDirect,
				requireMention: currentThreadPolicy.requireMention,
				allowTextCommands: allowTextCommands && currentAccountPolicy.replyMode !== "model" && runtime.channel.commands.shouldHandleTextCommands({
					cfg: currentCfg,
					surface: CHANNEL_ID$2,
					commandSource: "text"
				}),
				hasControlCommand: shouldCheckCommand && runtime.channel.text.hasControlCommand(params.message.body, currentCfg),
				commandAuthorized: resolved.commandAccess.authorized
			}
		}).shouldSkip;
	};
	return {
		shouldDispatch: isAdmissionCurrent() && !preparedRoute.revoked && resolved.ingress.admission === "dispatch",
		isCurrent: isAdmissionCurrent,
		commandAuthorized: resolved.commandAccess.requested ? resolved.commandAccess.authorized : resolved.senderAccess.allowed,
		requireMention: threadMentionPolicy.requireMention,
		mentionFacts,
		botLoopProtection,
		preparedRoute,
		channelIngress: resolved
	};
}
// extensions/clickclack/src/activity.ts
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
const THINKING_ITEM_KINDS = /* @__PURE__ */ new Set([
	"analysis",
	"thinking",
	"reasoning"
]);
function normalizedItemKind(payload) {
	return payload.kind?.trim().toLowerCase() ?? "";
}
/**
* Creates a per-turn activity publisher. Publishing is best-effort: transport
* failures are reported through `onError` and never interrupt the reply turn.
*/
function createClickClackActivityPublisher(params) {
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
		clearTimeout(segment.timer);
		segment.timer = void 0;
		if (!segment.dirty || !segment.body) return Promise.resolve();
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
		const text = payload.progressText?.trim() || payload.summary?.trim() || payload.meta?.trim() || "";
		const body = text && THINKING_ITEM_KINDS.has(normalizedItemKind(payload)) ? `**Thinking**\n\n${text}` : text;
		const key = payload.itemId?.trim() || "turn";
		let segment = commentaryByItem.get(key);
		if (!body) {
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
		}, CLICKCLACK_COMMENTARY_FLUSH_MS);
	};
	const toolRowKey = (payload) => {
		return payload.itemId?.trim() || payload.toolCallId?.trim() || "";
	};
	const handleDiscreteItem = (payload) => {
		let body = formatChannelProgressDraftLineForEntry(void 0, {
			...payload,
			event: "item",
			itemKind: payload.kind
		});
		if (!body) {
			const head = payload.name?.trim() || payload.title?.trim();
			const text = payload.progressText?.trim() || payload.summary?.trim();
			body = head && text ? `**${head}**\n\n${text}` : text || head || payload.status?.trim() || payload.kind?.trim() || "";
		}
		if (!body) return;
		const kind = TOOL_ITEM_KINDS.has(normalizedItemKind(payload)) ? "agent_tool" : "agent_commentary";
		flushAllCommentary();
		const itemKey = toolRowKey(payload);
		const key = `${kind}:${itemKey}`;
		const existing = toolRows.get(key);
		if (!existing || !itemKey) {
			const row = { body };
			if (itemKey) toolRows.set(key, row);
			enqueue(async () => {
				const submittedBody = row.body;
				const posted = await postRow(kind, submittedBody);
				row.messageId = posted.id;
				row.sentBody = submittedBody;
			});
			return;
		}
		if (body === existing.body) return;
		existing.body = body;
		enqueue(async () => {
			if (existing.messageId && existing.body !== existing.sentBody) {
				const submittedBody = existing.body;
				await params.client.updateMessageBody(existing.messageId, submittedBody);
				existing.sentBody = submittedBody;
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
		/** Model/thinking from onModelSelected is stamped onto subsequent activity rows. */
		setProvenance: (next) => {
			provenance = next;
		},
		/** Flushes pending commentary and awaits all outstanding POST/PATCH work. */
		finalize: async () => {
			await flushAllCommentary();
			await chain;
		}
	};
}
// extensions/clickclack/src/outbound.ts
const CLICKCLACK_MAX_UPLOAD_BYTES = 67108864;
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
	return sha256Hex(`${params.deliveryQueueId}\n${params.deliveryPartIndex}`);
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
async function createOutboundContext(params) {
	const account = await resolveClickClackAccountAsync({
		cfg: params.cfg,
		accountId: params.accountId
	});
	return {
		account,
		client: createClickClackClient({
			baseUrl: account.apiEndpoint,
			token: account.token,
			correlationId: params.correlationId,
			beforeRequest: params.assertDirectAdapterHandoff
		})
	};
}
async function sendClickClackText(params) {
	const text = sanitizeAssistantVisibleText(params.text);
	if (!text) return { outcome: "not_sent" };
	const { account, client } = await createOutboundContext(params);
	return { messageId: (await createTargetMessage({
		client,
		workspaceId: await resolveWorkspaceId(client, account.workspace),
		to: params.to,
		text,
		threadId: params.threadId,
		replyToId: params.replyToId,
		provenance: params.provenance,
		nonce: textDeliveryNonce(params),
		onPlatformSendDispatch: params.onPlatformSendDispatch,
		assertDirectAdapterHandoff: params.assertDirectAdapterHandoff
	})).id };
}
async function sendClickClackMedia(params) {
	const nonces = mediaDeliveryNonces(params);
	const { account, client } = await createOutboundContext(params);
	const mediaLoadOptions = {
		maxBytes: Math.min(resolveChannelMediaMaxBytes({
			cfg: params.cfg,
			accountId: account.accountId,
			resolveChannelLimitMb: () => account.config.mediaMaxMb
		}) ?? CLICKCLACK_MAX_UPLOAD_BYTES, CLICKCLACK_MAX_UPLOAD_BYTES),
		mediaAccess: params.mediaAccess,
		mediaLocalRoots: params.mediaLocalRoots,
		mediaReadFile: params.mediaReadFile
	};
	const preloadedMedia = nonces.upload ? void 0 : await loadOutboundMediaFromUrl(params.mediaUrl, mediaLoadOptions);
	const workspaceId = await resolveWorkspaceId(client, account.workspace);
	let upload = nonces.upload ? await client.findUploadByNonce({
		workspaceId,
		nonce: nonces.upload
	}) : void 0;
	let mediaFilename = preloadedMedia?.fileName?.trim();
	if (!upload) {
		const media = preloadedMedia ?? await loadOutboundMediaFromUrl(params.mediaUrl, mediaLoadOptions);
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
	const text = sanitizeAssistantVisibleText(params.text) || mediaFilename || upload.filename || "attachment";
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
/**
* Completes an unknown durable send through ClickClack's message/upload nonces.
* Media recovery never rereads the original source after restart.
*/
async function reconcileClickClackUnknownSend(ctx) {
	if (ctx.payloads.length !== 1 || (ctx.renderedBatchPlan?.items.length ?? 1) !== 1) return {
		status: "unresolved",
		error: "ClickClack reconciliation requires exactly one payload"
	};
	const payload = ctx.payloads[0];
	const plannedMediaUrls = ctx.renderedBatchPlan?.items[0]?.mediaUrls;
	const mediaUrls = normalizeTrimmedStringList(plannedMediaUrls?.length ? plannedMediaUrls : [payload?.mediaUrl, ...payload?.mediaUrls ?? []]);
	const { account, client } = await createOutboundContext({
		cfg: ctx.cfg,
		accountId: ctx.accountId
	});
	const workspaceId = await resolveWorkspaceId(client, account.workspace);
	const effectiveReplyToId = ctx.effectiveReplyToId !== void 0 ? ctx.effectiveReplyToId : ctx.replyToMode === "off" ? void 0 : ctx.replyToId;
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
// extensions/clickclack/src/progress.ts
function normalizedKind(payload) {
	const kind = payload.kind?.trim().toLowerCase();
	if (!kind || kind === "preamble" || kind === "analysis" || kind === "thinking" || kind === "reasoning" || kind === "missing") return "commentary";
	return kind;
}
function progressText(payload) {
	const line = buildChannelProgressDraftLine({
		...payload,
		event: "item",
		itemKind: payload.kind
	})?.text;
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
		const existingAnonymous = payload.phase?.trim().toLowerCase() === "start" ? void 0 : anonymousLines.toReversed().find((line) => line.active);
		const line = existingAnonymous ?? {
			id: `item:${kind}:${++anonymousSequence}`,
			active: true
		};
		if (!existingAnonymous) {
			anonymousLines.push(line);
			anonymousLinesByKind.set(kind, anonymousLines);
		}
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
			for (let frame = queue.shift(); frame; frame = queue.shift()) try {
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
				params.onError?.(error);
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
			const kind = normalizedKind(payload);
			const hidesLine = payload.hideFromChannelProgress || payload.kind === "model-wait" && payload.phase === "end";
			const retractsExistingCommentary = kind === "commentary" && seenLines.has(id) && payload.progressText !== void 0 && payload.progressText.trim() === "";
			if ((hidesLine || retractsExistingCommentary) && queuedLines.get(id)?.payload.op === "append") {
				queuedLines.delete(id);
				seenLines.delete(id);
				return false;
			}
			if (hidesLine) {
				if (seenLines.delete(id)) enqueueLine(id, {
					op: "update",
					line: {
						id,
						kind,
						text: ""
					}
				});
				return false;
			}
			const final = isFinal(payload);
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
			if (!await raceWithTimeout(drain().then(() => true), CLICKCLACK_PROGRESS_FINALIZE_GRACE_MS, () => false)) discardQueuedLines();
		}
	};
}
// extensions/clickclack/src/inbound.ts
const CHANNEL_ID$1 = "clickclack";
const CLICKCLACK_MESSAGE_ID_PATTERN = /^msg_[0-9a-hjkmnp-tv-z]{26}$/u;
function hasClickClackReplyMedia(payload) {
	return Boolean(payload.mediaUrl?.trim() || payload.mediaUrls?.some((mediaUrl) => mediaUrl.trim()));
}
function resolveClickClackAgentRunId(messageId) {
	return CLICKCLACK_MESSAGE_ID_PATTERN.test(messageId) ? `${CHANNEL_ID$1}:${messageId}` : void 0;
}
async function handleClickClackInbound(params) {
	const runtime = getClickClackRuntime();
	const message = params.message;
	const access = params.access ?? await resolveClickClackInboundAccess({
		account: params.account,
		config: params.config,
		message
	});
	if (!access.shouldDispatch || !access.channelIngress || !access.isCurrent()) return;
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
		agentLabel: params.account.name || params.account.botHandle?.trim() || params.account.agentId || params.account.accountId,
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
			const modelAccount = params.account;
			const modelConfig = params.config;
			const correlationId = params.correlationId;
			const modelRuntime = getClickClackRuntime();
			const result = await modelRuntime.llm.complete({
				agentId: route.agentId,
				model: modelAccount.model,
				purpose: "clickclack bot reply",
				systemPrompt: modelAccount.systemPrompt,
				messages: [{
					role: "user",
					content: message.body
				}]
			});
			const completion = result.text.trim();
			if (!completion) {
				modelRuntime.logging.getChildLogger({
					plugin: "clickclack",
					feature: "model-reply"
				}).warn(`[${modelAccount.accountId}] ClickClack model reply produced no sendable text`);
				return;
			}
			const replyPipeline = createChannelMessageReplyPipeline({
				cfg: modelConfig,
				agentId: route.agentId,
				channel: CHANNEL_ID$1,
				accountId: modelAccount.accountId
			});
			replyPipeline.onModelSelected?.({
				provider: result.provider,
				model: result.model,
				thinkLevel: void 0
			});
			const responsePrefix = replyPipeline.resolveResponsePrefix?.();
			const text = responsePrefix && !completion.startsWith(responsePrefix) ? `${responsePrefix} ${completion}` : completion;
			await sendClickClackText({
				cfg: modelConfig,
				accountId: modelAccount.accountId,
				to: target,
				text,
				threadId: message.parent_message_id ? message.thread_root_id : void 0,
				replyToId: message.id,
				correlationId
			});
		} finally {
			await progress?.finalize();
		}
		return;
	}
	let turnProvenance;
	let activity;
	if (params.account.agentActivity) activity = createClickClackActivityPublisher({
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
	const body = (await createChannelInboundEnvelopeBuilderAsync({
		cfg: params.config,
		route
	}))({
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
				const text = payload.text ?? "";
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
// extensions/clickclack/src/gateway.ts
const CLICKCLACK_EVENT_PAGE_LIMIT = 500;
const CLICKCLACK_COMMAND_PATTERN = /^[a-z0-9_-]{1,32}$/u;
const CLICKCLACK_MAX_COMMANDS = 100;
const CLICKCLACK_MAX_DESCRIPTION_LENGTH = 100;
const CLICKCLACK_MAX_ARGS_HINT_LENGTH = 100;
function commandArgsHint(spec) {
	if (spec.args?.length) return truncateCodePoints(spec.args.map((arg) => arg.required ? `<${arg.name}>` : `[${arg.name}]`).join(" "), CLICKCLACK_MAX_ARGS_HINT_LENGTH);
	return spec.acceptsArgs ? "[args]" : "";
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
function payloadString(event, key) {
	return readStringField(event.payload, key) ?? "";
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
async function startClickClackGatewayAccount(ctx) {
	const configuredAccount = ctx.account;
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
	const processIncomingEvent = async (event) => {
		const { abortSignal, cfg: config, log } = ctx;
		const botUserId = account.botUserId;
		const buildContext = ctx.channelRuntime?.inbound.buildContext;
		if (event.type !== "message.created" && event.type !== "thread.reply_created") return;
		if (abortSignal.aborted || payloadString(event, "author_id") === botUserId) return;
		const correlationId = normalizeClickClackCorrelationId(event.payload?.correlation_id);
		const message = await resolveEventMessage({
			client: correlationId ? createClickClackClient({
				baseUrl: account.apiEndpoint,
				token: account.token,
				correlationId
			}) : client,
			event
		});
		if (!message) {
			log?.warn?.(`[${account.accountId}] skipped unreadable ClickClack message before agent dispatch: type=${event.type} messageId=${payloadString(event, "message_id") || "unknown"}`);
			return;
		}
		if (abortSignal.aborted || message.author_id === botUserId) return;
		const access = await resolveClickClackInboundAccess({
			account,
			config,
			message
		});
		if (abortSignal.aborted) return;
		if (!access.shouldDispatch) {
			log?.info(`[${account.accountId}] skipped ClickClack message before agent dispatch: kind=${message.direct_conversation_id ? "dm" : "group"} requireMention=${access.requireMention ?? "unknown"} wasMentioned=${access.mentionFacts.wasMentioned} hasAnyMention=${access.mentionFacts.hasAnyMention ?? "unknown"} commandAuthorized=${access.commandAuthorized}`);
			return;
		}
		await handleClickClackInbound({
			account,
			config,
			message,
			access,
			buildContext,
			...correlationId ? { correlationId } : {}
		});
	};
	if (account.commandMenu) try {
		const commands = mapNativeCommandSpecsToClickClackMenu(listNativeCommandSpecsForConfig(ctx.cfg, { provider: "clickclack" }), ctx.log);
		await client.setBotCommands(commands);
	} catch (error) {
		const status = error instanceof ClickClackHttpError ? error.status : void 0;
		const messagePrefix = `[${account.accountId}] ClickClack command menu sync`;
		if (status === 403) ctx.log?.warn?.(`${messagePrefix} skipped: ${formatErrorMessage(error)}; verify token/workspace command permissions or set commandMenu: false if menus are not needed`);
		else if (status === 404) ctx.log?.debug?.(`${messagePrefix} skipped: server does not support /api/bots/self/commands`);
		else ctx.log?.warn?.(`${messagePrefix} failed: ${formatErrorMessage(error)}`);
	}
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
			} else while (!ctx.abortSignal.aborted) {
				const page = await client.eventPage(workspaceId, {
					afterCursor,
					limit: CLICKCLACK_EVENT_PAGE_LIMIT
				});
				for (const event of page.events) {
					if (ctx.abortSignal.aborted) break;
					if (!event.cursor || event.cursor === afterCursor) throw new Error("ClickClack event backlog returned a non-advancing cursor");
					await processIncomingEvent(event);
					afterCursor = event.cursor;
				}
				if (page.events.length === 0) break;
			}
			if (ctx.abortSignal.aborted) break;
			const socket = client.websocket(workspaceId, afterCursor);
			await new Promise((resolve) => {
				let settled = false;
				let closing = false;
				let loggedMessageFailure = false;
				let messageQueue = Promise.resolve();
				let removeAbortListener;
				let stopKeepalive;
				const finishSocketCycle = () => {
					if (settled) return;
					settled = true;
					stopKeepalive?.();
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
					stopKeepalive = startWebSocketKeepalive(socket, () => {
						ctx.log?.warn?.(`[${account.accountId}] ClickClack websocket heartbeat timed out; reconnecting`);
						socket.terminate();
					});
				});
				socket.on("message", (data) => {
					if (closing || settled) return;
					messageQueue = messageQueue.then(async () => {
						if (ctx.abortSignal.aborted) return;
						const event = safeParseJson(rawDataToString(data));
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
// extensions/clickclack/src/channel.ts
const CHANNEL_ID = CLICKCLACK_CHANNEL_ID;
const clickClackTextMessageAdapter = createChannelMessageAdapterFromOutbound({ outbound: { sendText: async (ctx) => ({
	channel: CHANNEL_ID,
	...await sendClickClackText(ctx)
}) } });
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
		...clickClackTextMessageAdapter.send,
		media: async (ctx) => {
			const messageId = await sendClickClackMedia({
				...ctx,
				cfg: ctx.cfg
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
			normalizeTarget: (raw) => buildClickClackTarget(parseClickClackTarget(raw)),
			inferTargetChatType: ({ to }) => parseClickClackTarget(to).chatType,
			targetResolver: {
				looksLikeId: (raw) => raw.trim().length > 0,
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
			sendText: async (ctx) => ({
				messageId: "",
				...await sendClickClackText({
					...ctx,
					cfg: ctx.cfg
				})
			}),
			sendMedia: async (ctx) => {
				const { mediaUrl, onDeliveryResult } = ctx;
				if (!mediaUrl) throw new Error("ClickClack media send requires mediaUrl");
				return { messageId: await sendClickClackMedia({
					...ctx,
					cfg: ctx.cfg,
					mediaUrl,
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
export { bindingMatchesActiveSessionIncarnation as A, discussionSessionKey as C, slugifyDiscussionLabel as D, resolveDiscussionLabel as E, getPendingDiscussionOpen as F, listPendingDiscussionOpens as I, recordPendingDiscussionOpen as L, readDiscussionSessionEntry as M, clearDiscussionBindingGeneration as N, truncateDiscussionDisplayTitle as O, clearPendingDiscussionOpen as P, reserveDiscussionBindingGeneration as R, discussionExternalRef as S, isDiscussionSessionKey as T, normalizedServerBaseUrl as _, setClickClackRuntime as a, resolvePreparedDiscussionBindingAccount as b, clearClickClackDiscussionChannelRevoked as c, markClickClackDiscussionChannelIdentityRevoked as d, markClickClackDiscussionChannelRevoked as f, isDiscussionAccountCurrent as g, discussionInfoForBinding as h, getClickClackRuntime as i, getClickClackDiscussionBindingStore as j, attachBindingToCurrentActiveSession as k, isClickClackDiscussionChannelRevoked as l, discussionAccounts as m, buildClickClackTarget as n, prepareDiscussionSessionEntry as o, prepareClickClackDiscussionChannelRevocation as p, parseClickClackTarget as r, adoptLegacyMarkers as s, clickClackPlugin as t, isClickClackDiscussionChannelRevokedAsync as u, prepareDiscussionBindingAccount as v, fallbackDiscussionLabel as w, discussionCredentialFingerprint as x, resolveDiscussionBindingAccount as y };
