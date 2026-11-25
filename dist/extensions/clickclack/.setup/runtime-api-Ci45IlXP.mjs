import { g as resolveClickClackAccountAsync, p as listClickClackAccountIds, v as resolveClickClackAccountMetadata } from "./setup-surface-DSbHN_QA.mjs";
import { A as bindingMatchesActiveSessionIncarnation, C as discussionSessionKey, D as slugifyDiscussionLabel, E as resolveDiscussionLabel, F as getPendingDiscussionOpen, I as listPendingDiscussionOpens, L as recordPendingDiscussionOpen, M as readDiscussionSessionEntry, N as clearDiscussionBindingGeneration, O as truncateDiscussionDisplayTitle, P as clearPendingDiscussionOpen, R as reserveDiscussionBindingGeneration, S as discussionExternalRef, T as isDiscussionSessionKey, _ as normalizedServerBaseUrl, b as resolvePreparedDiscussionBindingAccount, c as clearClickClackDiscussionChannelRevoked, d as markClickClackDiscussionChannelIdentityRevoked, f as markClickClackDiscussionChannelRevoked, g as isDiscussionAccountCurrent, h as discussionInfoForBinding, j as getClickClackDiscussionBindingStore, k as attachBindingToCurrentActiveSession, l as isClickClackDiscussionChannelRevoked, m as discussionAccounts, o as prepareDiscussionSessionEntry, p as prepareClickClackDiscussionChannelRevocation, s as adoptLegacyMarkers, u as isClickClackDiscussionChannelRevokedAsync, v as prepareDiscussionBindingAccount, w as fallbackDiscussionLabel, x as discussionCredentialFingerprint, y as resolveDiscussionBindingAccount } from "./channel-BH4RFKFX.mjs";
import { a as createClickClackClient, i as ClickClackHttpError, o as isClickClackChannelNameConflict, t as findClickClackWorkspace } from "./resolve-qeIY2bou.mjs";
import "../api.js";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
import { createAsyncLock } from "openclaw/plugin-sdk/async-lock-runtime";
import { resolveSessionAgentIdStrict } from "openclaw/plugin-sdk/agent-scope-runtime";
import { buildControlUiSessionPath, registerSessionDiscussionProvider } from "openclaw/plugin-sdk/session-discussion";
import { createSessionVisibilityChecker } from "openclaw/plugin-sdk/session-visibility";
import { textResult } from "openclaw/plugin-sdk/tool-results";
import { KeyedAsyncQueue } from "openclaw/plugin-sdk/keyed-async-queue";
// extensions/clickclack/src/discussions/binding-retention.ts
const MAX_RETAINED_DETACHED_DISCUSSION_BINDINGS = 1e3;
var DetachedDiscussionBindingRetention = class {
	#runtime;
	#store;
	constructor(options) {
		this.#runtime = options.runtime;
		this.#store = options.store;
	}
	async mark(sessionKey, binding) {
		const current = await this.#store.getAsync(sessionKey);
		if (!current || !isDeepStrictEqual(current, binding)) return;
		if (current.detachedAt === void 0) await this.#store.setIfCurrent(sessionKey, current, {
			...current,
			detachedAt: Date.now()
		});
		while (this.#store.detachedCount() > MAX_RETAINED_DETACHED_DISCUSSION_BINDINGS) if (!await this.#pruneOldest()) throw new Error("ClickClack detached discussion binding retention could not be reduced");
	}
	async clear(sessionKey, binding) {
		const current = await this.#store.getAsync(sessionKey);
		if (!current || !isDeepStrictEqual(current, binding)) return;
		if (current.detachedAt === void 0) return current;
		const { detachedAt: _detachedAt, ...retained } = current;
		return await this.#store.setIfCurrent(sessionKey, current, retained) ? retained : void 0;
	}
	async ensureCapacity(sessionKey) {
		await this.#store.prepare();
		while (!await this.#store.hasCapacity(sessionKey)) if (!await this.#pruneOldest()) throw new Error("ClickClack discussion binding capacity is exhausted");
	}
	async #pruneOldest() {
		for (;;) {
			const oldest = await this.#store.oldestDetached();
			if (!oldest) return false;
			const current = oldest.binding;
			const session = await prepareDiscussionSessionEntry(this.#runtime, oldest.sessionKey);
			try {
				if (session.entry) {
					await this.clear(oldest.sessionKey, current);
					continue;
				}
				const authority = { assertCurrent: session.source };
				if (!await markClickClackDiscussionChannelRevoked(this.#runtime, oldest.sessionKey, current, authority)) continue;
				if (await this.#store.deleteIfCurrent(oldest.sessionKey, current, authority)) return true;
			} finally {
				session.release();
			}
		}
	}
};
// extensions/clickclack/src/discussions/control-session-url.ts
function controlSessionUrl(baseUrl, sessionKey, fallbackAgentId, mainKey, displayName) {
	if (!baseUrl) return;
	const url = new URL(baseUrl);
	const path = buildControlUiSessionPath({
		namespace: "chat",
		sessionKey,
		fallbackAgentId,
		basePath: url.pathname,
		displayName,
		mainKey
	});
	if (!path) return;
	url.pathname = path;
	url.hash = "";
	return url.toString();
}
// extensions/clickclack/src/discussions/installation.ts
const INSTALLATION_NAMESPACE = "discussion-installation";
const INSTALLATION_KEY = "current";
/** Returns the durable installation namespace used in server-visible ownership refs. */
async function getClickClackDiscussionInstallationId(runtime) {
	const store = runtime.state.openKeyedStoreV2({
		namespace: INSTALLATION_NAMESPACE,
		maxEntries: 1,
		overflowPolicy: "reject-new"
	});
	const existing = (await store.lookup(INSTALLATION_KEY))?.id;
	if (existing) return existing;
	const id = randomUUID();
	await store.registerIfAbsent(INSTALLATION_KEY, { id });
	const persisted = (await store.lookup(INSTALLATION_KEY))?.id;
	if (!persisted) throw new Error("ClickClack discussion installation identity is unavailable; retry opening the discussion");
	return persisted;
}
// extensions/clickclack/src/discussions/service-history.ts
function discussionRecordJson(value) {
	return JSON.stringify(value).replace(/[\u0085\u2028\u2029]/gu, (separator) => `\\u${separator.charCodeAt(0).toString(16).padStart(4, "0")}`);
}
/** Renders channel history as line-per-message records for the discussion tool. */
function formatDiscussionHistory(history) {
	const text = history.messages.map((message) => {
		const author = message.author?.display_name || message.author?.handle || message.author_id || "Unknown";
		return `timestamp=${discussionRecordJson(message.created_at)} [Author ${discussionRecordJson(author)} id=${discussionRecordJson(message.author_id)}] text=${discussionRecordJson(message.body)}`;
	}).join("\n");
	const truncationNote = history.truncated ? "\n[History scan reached its safety bound; older active threads may be omitted.]" : "";
	return text ? `${text}${truncationNote}` : "";
}
async function readDiscussionHistory(params) {
	const { runtime, store, sessionKey, binding, client, limit } = params;
	const bindingFacts = await store.prepareRead(sessionKey);
	let revocation;
	let session;
	try {
		const channelRevocation = await prepareClickClackDiscussionChannelRevocation({
			runtime,
			...binding
		});
		revocation = channelRevocation;
		const sessionEntry = await prepareDiscussionSessionEntry(runtime, sessionKey);
		session = sessionEntry;
		const canReadHistory = () => {
			try {
				sessionEntry.source();
				const current = bindingFacts.read();
				const config = runtime.config.current();
				return current !== void 0 && current.externalRef === binding.externalRef && current.serverBaseUrl === binding.serverBaseUrl && current.channelId === binding.channelId && sessionEntry.entry?.sessionId === binding.sessionId && sessionEntry.entry.archivedAt === void 0 && resolvePreparedDiscussionBindingAccount(config, binding, params.account).state === "active" && !channelRevocation.isRevoked(current);
			} catch {
				return false;
			}
		};
		if (!canReadHistory()) return { text: "No discussion is bound to this session." };
		const history = await client.latestChannelMessages(binding.channelId, limit);
		if (!canReadHistory()) return { text: "No discussion is bound to this session." };
		return {
			binding,
			text: formatDiscussionHistory(history) || "The bound discussion has no messages yet."
		};
	} finally {
		session?.release();
		revocation?.release();
		bindingFacts.release();
	}
}
// extensions/clickclack/src/discussions/service-open.ts
const CHANNEL_NAME_MUTATION_ATTEMPTS = 4;
function isDefinitiveNoCreateHttpError(error) {
	if (!(error instanceof ClickClackHttpError) || error.status < 400 || error.status >= 500) return false;
	return ![
		408,
		409,
		425,
		429
	].includes(error.status);
}
async function resolveAvailableChannelName(params) {
	const desired = slugifyDiscussionLabel(params.label, params.sessionKey);
	const channels = params.channels ?? await params.client.channels(params.workspaceId);
	const occupied = new Set(channels.filter((channel) => channel.id !== params.ownChannelId).map((channel) => channel.name));
	if (!occupied.has(desired)) return desired;
	for (let suffix = 2; suffix <= 20; suffix += 1) {
		const candidate = `${desired}-${suffix}`;
		if (!occupied.has(candidate)) return candidate;
	}
	const fallback = fallbackDiscussionLabel(params.sessionKey, params.agentId);
	if (!occupied.has(fallback)) return fallback;
	for (let suffix = 2;; suffix += 1) {
		const candidate = `${fallback}-${suffix}`;
		if (!occupied.has(candidate)) return candidate;
	}
}
function assertChannelPatch(channel, patch) {
	for (const key of [
		"archived",
		"external_managed",
		"external_ref",
		"external_url",
		"display_title",
		"name",
		"sidebar_section"
	]) {
		const expected = patch[key];
		if (expected === void 0) continue;
		if (key === "display_title" && !(key in channel)) continue;
		if ((key === "external_ref" || key === "external_url" || key === "sidebar_section" ? channel[key] ?? "" : channel[key]) !== expected) throw new Error(`ClickClack channel update did not apply ${key}`);
	}
}
async function renameDiscussionChannel(params) {
	for (let attempt = 0; attempt < CHANNEL_NAME_MUTATION_ATTEMPTS; attempt += 1) {
		const patch = {
			...params.patch,
			name: await resolveAvailableChannelName({
				...params,
				ownChannelId: params.channelId
			})
		};
		try {
			params.assertCurrentAuthority?.();
			const channel = await params.client.updateChannel(params.channelId, patch);
			assertChannelPatch(channel, patch);
			return channel;
		} catch (error) {
			if (!isClickClackChannelNameConflict(error) || attempt === 3) throw error;
		}
	}
	throw new Error("ClickClack discussion channel name retries were exhausted");
}
function assertManagedChannelListContract(channels) {
	if (channels.some((channel) => typeof channel.external_managed !== "boolean" || channel.external_ref !== void 0 && typeof channel.external_ref !== "string" || channel.external_url !== void 0 && typeof channel.external_url !== "string" || channel.sidebar_section !== void 0 && typeof channel.sidebar_section !== "string")) throw new Error("ClickClack server does not advertise the managed discussion contract");
}
async function finalizePendingDiscussionBinding(runtime, sessionKey, binding) {
	const pending = await getPendingDiscussionOpen(runtime, sessionKey);
	if (pending?.externalRef === binding.externalRef) {
		await clearClickClackDiscussionChannelRevoked({
			runtime,
			serverBaseUrl: binding.serverBaseUrl,
			channelId: binding.channelId
		});
		await clearDiscussionBindingGeneration({
			runtime,
			sessionKey,
			expectedGeneration: pending.generation
		});
	}
}
async function openClickClackDiscussionBinding(params) {
	const { account, runtime, sessionKey, store } = params;
	const entry = await readDiscussionSessionEntry(runtime, sessionKey);
	if (!entry || entry.archivedAt !== void 0) return;
	if (!entry.sessionId?.trim()) throw new Error("OpenClaw session does not yet have a concrete session id");
	const client = params.clientFactory(account);
	const workspaces = await client.workspaces();
	const workspace = findClickClackWorkspace(workspaces, account.discussions.workspace);
	if (!workspace) throw new Error(`ClickClack discussions workspace not found: ${account.discussions.workspace}`);
	if (!workspace.route_id) throw new Error("ClickClack discussions workspace is missing its route id");
	const serverBaseUrl = normalizedServerBaseUrl(account);
	const credentialFingerprint = discussionCredentialFingerprint(account.token);
	const revokeChannel = (channelId) => markClickClackDiscussionChannelIdentityRevoked({
		runtime,
		accountId: account.accountId,
		serverBaseUrl,
		channelId
	});
	const unresolved = await getPendingDiscussionOpen(runtime, sessionKey);
	if (unresolved && (unresolved.accountId !== account.accountId || unresolved.credentialFingerprint !== credentialFingerprint || unresolved.serverBaseUrl !== serverBaseUrl || unresolved.workspaceId !== workspace.id)) {
		await reconcilePendingDiscussionOpen({
			runtime,
			store,
			clientFactory: params.clientFactory,
			pending: unresolved,
			allowRetry: false
		});
		if (await getPendingDiscussionOpen(runtime, sessionKey)) throw new Error("A previous ClickClack discussion open is still unresolved; restore its credential and retry");
	}
	const config = runtime.config.current();
	const agentId = resolveSessionAgentIdStrict({
		config,
		sessionKey
	});
	const fallback = fallbackDiscussionLabel(sessionKey, agentId);
	const label = resolveDiscussionLabel(entry, sessionKey, agentId);
	const displayTitle = label === fallback ? "" : truncateDiscussionDisplayTitle(label);
	const section = entry.category?.trim() || account.discussions.section;
	const externalUrl = controlSessionUrl(account.discussions.controlUrlBase, sessionKey, account.agentId ?? agentId, config.session?.mainKey, label);
	const withCurrentAuthority = async (operation) => {
		const session = await prepareDiscussionSessionEntry(runtime, sessionKey);
		try {
			const assertCurrentAuthority = () => {
				session.source();
				const currentEntry = session.entry;
				if (!isDiscussionAccountCurrent(runtime.config.current(), account) || !currentEntry?.sessionId || currentEntry.archivedAt !== void 0) throw new Error("ClickClack discussion authority changed while opening the channel");
				return currentEntry;
			};
			assertCurrentAuthority();
			return await operation(assertCurrentAuthority);
		} finally {
			session.release();
		}
	};
	return await params.withChannelMutationLock(async () => {
		await params.ensureBindingCapacity(sessionKey);
		let channels = await client.channels(workspace.id);
		assertManagedChannelListContract(channels);
		const destinationIdentity = [serverBaseUrl, workspace.id].join("\0");
		const bindingGeneration = await reserveDiscussionBindingGeneration({
			runtime,
			sessionKey,
			accountId: account.accountId,
			credentialFingerprint,
			destinationIdentity
		});
		const generationScope = {
			runtime,
			sessionKey,
			expectedGeneration: bindingGeneration
		};
		const externalRef = discussionExternalRef(params.installationId, sessionKey, destinationIdentity, bindingGeneration);
		let adopted;
		let managedFields;
		let resolved;
		for (let attempt = 0; attempt < CHANNEL_NAME_MUTATION_ATTEMPTS; attempt += 1) {
			adopted = channels.find((candidate) => candidate.external_managed === true && candidate.external_ref === externalRef);
			const fields = {
				name: await resolveAvailableChannelName({
					client,
					workspaceId: workspace.id,
					label,
					sessionKey,
					agentId,
					channels,
					ownChannelId: adopted?.id
				}),
				external_managed: true,
				external_ref: externalRef,
				external_url: externalUrl ?? "",
				sidebar_section: section,
				display_title: displayTitle
			};
			managedFields = fields;
			await recordPendingDiscussionOpen({
				runtime,
				sessionKey,
				generation: bindingGeneration,
				pending: {
					accountId: account.accountId,
					serverBaseUrl,
					workspaceId: workspace.id,
					sessionId: entry.sessionId,
					externalRef,
					credentialFingerprint
				}
			});
			await params.ensureTimer();
			if (adopted) {
				const channelId = adopted.id;
				await withCurrentAuthority(() => revokeChannel(channelId));
			}
			let attempted = false;
			try {
				resolved = await withCurrentAuthority(() => {
					attempted = true;
					return adopted ? client.updateChannel(adopted.id, fields) : client.createChannel(workspace.id, {
						...fields,
						kind: "public"
					});
				});
				if (!adopted) await revokeChannel(resolved.id);
				break;
			} catch (error) {
				if (!attempted) throw error;
				if (isClickClackChannelNameConflict(error) && attempt < 3) {
					channels = await withCurrentAuthority(() => client.channels(workspace.id));
					assertManagedChannelListContract(channels);
					continue;
				}
				const definitiveNoCreate = isDefinitiveNoCreateHttpError(error);
				try {
					const relisted = await withCurrentAuthority(() => client.channels(workspace.id));
					assertManagedChannelListContract(relisted);
					const recovered = relisted.find((candidate) => candidate.external_managed === true && candidate.external_ref === externalRef);
					if (recovered) {
						adopted = recovered;
						await revokeChannel(recovered.id);
						resolved = await withCurrentAuthority(() => client.updateChannel(recovered.id, fields));
						break;
					}
					if (definitiveNoCreate) await clearDiscussionBindingGeneration(generationScope);
				} catch {
					if (definitiveNoCreate && !adopted) await clearDiscussionBindingGeneration(generationScope);
				}
				throw error;
			}
		}
		if (!resolved || !managedFields) throw new Error("ClickClack discussion channel name retries were exhausted");
		try {
			const displayTitleMatches = !("display_title" in resolved) || resolved.display_title === displayTitle;
			if (resolved.external_managed !== true || (resolved.external_ref ?? "") !== (externalRef ?? "") || (resolved.sidebar_section ?? "") !== (section ?? "") || (resolved.external_url ?? "") !== (externalUrl ?? "") || !displayTitleMatches) throw new Error(`ClickClack server does not support the managed discussion channel contract for ${sessionKey}`);
			if (adopted) assertChannelPatch(resolved, managedFields);
		} catch (error) {
			await clearPendingDiscussionOpen(generationScope);
			params.warn(`incompatible discussion channel remains quarantined: ${resolved.id}`);
			throw error;
		}
		if (!resolved.route_id) {
			await clearPendingDiscussionOpen(generationScope);
			params.warn(`route-less discussion channel remains quarantined: ${resolved.id}`);
			throw new Error("ClickClack discussion channel is missing its route id");
		}
		const channel = resolved;
		const currentEntry = await readDiscussionSessionEntry(runtime, sessionKey);
		if (!currentEntry?.sessionId || currentEntry.archivedAt !== void 0) {
			await clearPendingDiscussionOpen(generationScope);
			params.warn(`unattached discussion channel remains quarantined: ${channel.id}`);
			throw new Error("OpenClaw session became inactive while opening its ClickClack discussion");
		}
		const nextBinding = {
			accountId: account.accountId,
			agentId,
			sessionId: currentEntry.sessionId,
			serverBaseUrl,
			credentialFingerprint,
			externalRef,
			externalUrl: externalUrl ?? "",
			workspaceRef: account.discussions.workspace,
			workspaceId: workspace.id,
			channelId: channel.id,
			channelRouteId: channel.route_id,
			workspaceRouteId: workspace.route_id,
			section,
			archived: false,
			label,
			...channel.display_title !== void 0 ? { displayTitle: channel.display_title } : {}
		};
		try {
			if (!await withCurrentAuthority(async (assertCurrentAuthority) => {
				nextBinding.sessionId = assertCurrentAuthority().sessionId;
				return await store.setIfCurrent(sessionKey, void 0, nextBinding, { assertCurrent: () => {
					if (assertCurrentAuthority().sessionId !== nextBinding.sessionId) throw new Error("ClickClack discussion session changed before binding committed");
				} });
			})) {
				await clearPendingDiscussionOpen(generationScope);
				params.warn(`superseded discussion channel remains quarantined: ${channel.id}`);
				return;
			}
		} catch (error) {
			await clearPendingDiscussionOpen(generationScope);
			params.warn(`unbound discussion channel remains quarantined: ${channel.id}`);
			throw error;
		}
		await finalizePendingDiscussionBinding(runtime, sessionKey, nextBinding);
		return nextBinding;
	});
}
/** Returns whether the service should retry inside its current session queue. */
async function reconcilePendingDiscussionOpen(params) {
	const { pending } = params;
	const currentBinding = await params.store.getAsync(pending.sessionKey);
	if (currentBinding?.externalRef === pending.externalRef) {
		await finalizePendingDiscussionBinding(params.runtime, pending.sessionKey, currentBinding);
		return false;
	}
	const cfg = params.runtime.config.current();
	const candidates = listClickClackAccountIds(cfg).map((accountId) => resolveClickClackAccountMetadata({
		cfg,
		accountId
	})).filter((account) => normalizedServerBaseUrl(account) === pending.serverBaseUrl);
	const account = (await Promise.all(candidates.map(({ accountId }) => resolveClickClackAccountAsync({
		cfg,
		accountId
	})))).find((candidate) => candidate.configured && normalizedServerBaseUrl(candidate) === pending.serverBaseUrl && discussionCredentialFingerprint(candidate.token) === pending.credentialFingerprint);
	if (!account) return false;
	const client = params.clientFactory(account);
	const entry = await readDiscussionSessionEntry(params.runtime, pending.sessionKey);
	const retryAccount = isDiscussionAccountCurrent(params.runtime.config.current(), account) ? account : void 0;
	if (params.allowRetry !== false && entry?.sessionId && entry.archivedAt === void 0 && retryAccount && normalizedServerBaseUrl(retryAccount) === pending.serverBaseUrl && discussionCredentialFingerprint(retryAccount.token) === pending.credentialFingerprint) {
		const workspaces = await params.clientFactory(retryAccount).workspaces();
		if (findClickClackWorkspace(workspaces, retryAccount.discussions.workspace)?.id === pending.workspaceId) return true;
	}
	const channels = await client.channels(pending.workspaceId);
	assertManagedChannelListContract(channels);
	const channel = channels.find((candidate) => candidate.external_managed === true && candidate.external_ref === pending.externalRef);
	if (channel) {
		await markClickClackDiscussionChannelIdentityRevoked({
			runtime: params.runtime,
			accountId: pending.accountId,
			serverBaseUrl: pending.serverBaseUrl,
			channelId: channel.id
		});
		await clearPendingDiscussionOpen({
			runtime: params.runtime,
			sessionKey: pending.sessionKey,
			expectedGeneration: pending.generation
		});
		return false;
	}
	await clearDiscussionBindingGeneration({
		runtime: params.runtime,
		sessionKey: pending.sessionKey,
		expectedGeneration: pending.generation
	});
	return false;
}
// extensions/clickclack/src/discussions/service.ts
const RECONCILE_INTERVAL_MS = 6e4;
const RECONCILE_DEBOUNCE_MS = 250;
const RECONCILE_RETRY_MS = 1e3;
const RECONCILE_RETRY_MAX_MS = 6e4;
var ClickClackDiscussionService = class {
	#runtime;
	#store;
	#clientFactory;
	#installationId;
	#detachedBindings;
	#sessionQueue = new KeyedAsyncQueue();
	#scheduler;
	#scheduleReconcile;
	#withChannelMutationLock = createAsyncLock();
	#timer;
	#unsubscribeSessionsChanged;
	#closed = false;
	#cleanupPromise;
	#operations = /* @__PURE__ */ new Set();
	constructor(runtime) {
		this.#runtime = runtime;
		this.#store = getClickClackDiscussionBindingStore(runtime);
		this.#clientFactory = (account) => createClickClackClient({
			baseUrl: account.apiEndpoint,
			token: account.token
		});
		this.#detachedBindings = new DetachedDiscussionBindingRetention({
			runtime,
			store: this.#store
		});
		this.provider = {
			id: "clickclack",
			info: ({ sessionKey }) => this.info(sessionKey),
			open: ({ sessionKey }) => this.open(sessionKey)
		};
	}
	async bindGatewayEvents(gatewayEvents, scheduler) {
		if (this.#cleanupPromise) await this.#cleanupPromise;
		if (this.#scheduler) await this.#scheduler.stop();
		this.#cleanupPromise = void 0;
		this.#unsubscribeSessionsChanged?.();
		this.#closed = false;
		this.#scheduler = scheduler.scope();
		this.#timer = void 0;
		const activationScheduler = this.#scheduler;
		/**
		* Per-session debounced reconcile scheduling with failure backoff.
		* Contracts: bursts coalesce onto the earliest scheduled run (steady event
		* traffic can never postpone one); a failed run sets a not-before floor with
		* growing backoff that later events cannot undercut; events during an
		* in-flight run collapse into one follow-up scheduled after settlement; and
		* each service activation owns a separate scheduler scope and retry state.
		*/
		const retryState = /* @__PURE__ */ new Map();
		const inFlight = /* @__PURE__ */ new Set();
		const followUps = /* @__PURE__ */ new Set();
		const scheduleReconcile = (sessionKey, delayMs = RECONCILE_DEBOUNCE_MS) => {
			if (activationScheduler.signal.aborted) return;
			if (inFlight.has(sessionKey)) {
				followUps.add(sessionKey);
				return;
			}
			const retry = retryState.get(sessionKey);
			const fireAt = Math.max(activationScheduler.now() + delayMs, retry?.notBefore ?? 0);
			activationScheduler.schedule({
				id: `session:${sessionKey}`,
				atMs: fireAt,
				mode: "earliest",
				run: async () => {
					inFlight.add(sessionKey);
					try {
						await this.reconcile(sessionKey);
						retryState.delete(sessionKey);
					} catch (error) {
						if (activationScheduler.signal.aborted) return;
						const previous = retryState.get(sessionKey);
						const nextRetryMs = Math.min(previous === void 0 ? RECONCILE_RETRY_MS : previous.delayMs * 2, RECONCILE_RETRY_MAX_MS);
						retryState.set(sessionKey, {
							delayMs: nextRetryMs,
							notBefore: activationScheduler.now() + nextRetryMs
						});
						this.#logger().warn(`discussion event reconcile failed for ${sessionKey}; retrying in ${nextRetryMs}ms: ${String(error)}`);
						followUps.add(sessionKey);
					} finally {
						inFlight.delete(sessionKey);
						if (!activationScheduler.signal.aborted && followUps.delete(sessionKey)) scheduleReconcile(sessionKey);
					}
				}
			});
		};
		this.#scheduleReconcile = scheduleReconcile;
		this.#unsubscribeSessionsChanged = gatewayEvents?.onSessionsChanged((event) => {
			this.#withOperation(async () => {
				if (await this.#store.getAsync(event.sessionKey) || await getPendingDiscussionOpen(this.#runtime, event.sessionKey)) this.#scheduleReconcile?.(event.sessionKey);
			}).catch((error) => {
				this.#logger().warn(`discussion event admission failed: ${String(error)}`);
			});
		});
		await this.#withOperation(async () => {
			for (const sessionKey of await this.#listReconcileSessionKeys()) this.#scheduleReconcile?.(sessionKey, 0);
			await this.#ensureTimer();
		});
	}
	hasEnabledAccount() {
		return discussionAccounts(this.#currentConfig()).length === 1;
	}
	async prepareBindingAccount(binding) {
		const resolved = await prepareDiscussionBindingAccount(this.#currentConfig(), binding);
		return resolved.state === "active" ? resolvePreparedDiscussionBindingAccount(this.#currentConfig(), binding, resolved.account) : resolved;
	}
	async info(sessionKey) {
		return await this.#withOperation(() => this.#sessionQueue.enqueue(sessionKey, async () => {
			await this.#store.prepare();
			if (discussionAccounts(this.#currentConfig()).length !== 1) return { state: "none" };
			const existing = await this.#store.getAsync(sessionKey);
			if (existing) {
				const resolved = await this.#resolveBindingForUse(existing);
				if (resolved.state === "retargeted") {
					await this.#revokeAndDeleteBinding(sessionKey, existing);
					return { state: "available" };
				}
				if (resolved.state === "stale") {
					await this.#releaseStaleBinding(sessionKey, existing);
					return { state: "available" };
				}
				if (resolved.state !== "active") return { state: "none" };
				await this.#reconcileBinding(sessionKey, existing, resolved.account);
				const current = await this.#store.getAsync(sessionKey);
				if (!current) return { state: this.hasEnabledAccount() ? "available" : "none" };
				return discussionInfoForBinding(current, resolved.account);
			}
			return { state: "available" };
		}));
	}
	async open(sessionKey) {
		return await this.#withOperation(() => this.#sessionQueue.enqueue(sessionKey, async () => {
			await this.#store.prepare();
			return await this.#open(sessionKey);
		}));
	}
	async #open(sessionKey) {
		this.#installationId ??= await getClickClackDiscussionInstallationId(this.#runtime);
		const accounts = discussionAccounts(this.#currentConfig());
		if (accounts.length > 1) throw new Error("ClickClack discussions require exactly one enabled discussion account");
		const selected = accounts[0];
		if (!selected) return { state: "none" };
		const account = await resolveClickClackAccountAsync({
			cfg: this.#currentConfig(),
			accountId: selected.accountId
		});
		if (!isDiscussionAccountCurrent(this.#currentConfig(), account)) return { state: "none" };
		const existing = await this.#store.getAsync(sessionKey);
		if (existing) {
			const resolved = await this.#resolveBindingForUse(existing, account);
			if (resolved.state === "retargeted") {
				if (!await this.#revokeAndDeleteBinding(sessionKey, existing)) return { state: "available" };
			} else if (resolved.state === "stale") {
				if (!await this.#releaseStaleBinding(sessionKey, existing)) return { state: "available" };
			} else if (resolved.state === "active") {
				await this.#reconcileBinding(sessionKey, existing, resolved.account);
				const current = await this.#store.getAsync(sessionKey);
				if (current) return discussionInfoForBinding(current, resolved.account);
			}
		}
		let binding;
		try {
			binding = await openClickClackDiscussionBinding({
				runtime: this.#runtime,
				store: this.#store,
				account,
				clientFactory: this.#clientFactory,
				installationId: this.#installationId,
				sessionKey,
				ensureTimer: () => this.#ensureTimer(),
				withChannelMutationLock: (run) => this.#withChannelMutationLock(run),
				ensureBindingCapacity: (key) => this.#detachedBindings.ensureCapacity(key),
				warn: (message) => this.#logger().warn(message)
			});
		} finally {
			await this.#ensureTimer();
		}
		if (!binding) return { state: "available" };
		return discussionInfoForBinding(binding, account);
	}
	async reconcile(sessionKey) {
		return await this.#withOperation(() => this.#reconcile(sessionKey));
	}
	async #reconcile(sessionKey) {
		try {
			await this.#sessionQueue.enqueue(sessionKey, async () => {
				await this.#store.prepare();
				const binding = await this.#store.getAsync(sessionKey);
				if (binding) await this.#reconcileBinding(sessionKey, binding);
				const pending = await getPendingDiscussionOpen(this.#runtime, sessionKey);
				if (pending) {
					if (await reconcilePendingDiscussionOpen({
						runtime: this.#runtime,
						store: this.#store,
						clientFactory: this.#clientFactory,
						pending
					})) await this.#open(sessionKey);
				}
			});
		} finally {
			await this.#ensureTimer();
		}
	}
	async reconcileAll() {
		return await this.#withOperation(async () => {
			try {
				for (const sessionKey of await this.#listReconcileSessionKeys()) try {
					await this.#reconcile(sessionKey);
				} catch (error) {
					this.#logger().warn(`discussion reconcile failed for ${sessionKey}: ${String(error)}`);
				}
			} finally {
				await this.#ensureTimer();
			}
		});
	}
	async readLatestMessages(sessionKey, limit) {
		return await this.#withOperation(() => this.#sessionQueue.enqueue(sessionKey, async () => {
			await this.#store.prepare();
			const binding = await this.#store.getAsync(sessionKey);
			if (!binding) return { text: "No discussion is bound to this session." };
			const resolved = await this.#resolveBindingForUse(binding);
			if (resolved.state !== "active") return { text: "No discussion is bound to this session." };
			const attached = await this.#refreshSessionAttachment(sessionKey, binding);
			if (!attached) return { text: "No discussion is bound to this session." };
			return await readDiscussionHistory({
				runtime: this.#runtime,
				store: this.#store,
				sessionKey,
				binding: attached,
				account: resolved.account,
				client: this.#clientFactory(resolved.account),
				limit
			});
		}));
	}
	cleanup() {
		this.#closed = true;
		this.#unsubscribeSessionsChanged?.();
		this.#unsubscribeSessionsChanged = void 0;
		this.#scheduleReconcile = void 0;
		this.#timer = void 0;
		this.#cleanupPromise ??= Promise.allSettled([this.#scheduler?.stop(), ...this.#operations]).then(() => void 0);
		return this.#cleanupPromise;
	}
	async #reconcileBinding(sessionKey, binding, resolvedAccount) {
		await finalizePendingDiscussionBinding(this.#runtime, sessionKey, binding);
		if (await isClickClackDiscussionChannelRevokedAsync({
			runtime: this.#runtime,
			serverBaseUrl: binding.serverBaseUrl,
			channelId: binding.channelId,
			binding
		})) {
			await this.#store.deleteIfCurrent(sessionKey, binding);
			return;
		}
		const entry = await readDiscussionSessionEntry(this.#runtime, sessionKey);
		if (!entry) {
			await this.#detachedBindings.mark(sessionKey, binding);
			return;
		}
		const activeBinding = await this.#detachedBindings.clear(sessionKey, binding);
		if (!activeBinding) return;
		const resolved = resolvedAccount ? resolvePreparedDiscussionBindingAccount(this.#currentConfig(), activeBinding, resolvedAccount) : await this.#resolveBindingForUse(activeBinding);
		if (resolved.state === "retargeted") {
			await this.#revokeAndDeleteBinding(sessionKey, activeBinding);
			return;
		}
		if (resolved.state === "stale") {
			await this.#releaseStaleBinding(sessionKey, activeBinding);
			return;
		}
		if (resolved.state !== "active") return;
		if (!resolved.account.baseUrl || !resolved.account.token) throw new Error(`ClickClack discussion account is no longer configured: ${activeBinding.accountId}`);
		if (entry.archivedAt !== void 0) return;
		const labelForBackfill = resolveDiscussionLabel(entry, sessionKey, activeBinding.agentId);
		const desiredBackfillTitle = labelForBackfill === fallbackDiscussionLabel(sessionKey, activeBinding.agentId) ? "" : truncateDiscussionDisplayTitle(labelForBackfill);
		let bindingForAttachment = activeBinding;
		let observedSiblingTitleSupport = false;
		if (labelForBackfill === activeBinding.label && desiredBackfillTitle !== "" && activeBinding.displayTitle === void 0) {
			const bindings = await this.#store.entries();
			const freshBinding = await this.#store.getAsync(sessionKey);
			if (!freshBinding || freshBinding.serverBaseUrl !== activeBinding.serverBaseUrl || freshBinding.channelId !== activeBinding.channelId || freshBinding.externalRef !== activeBinding.externalRef) return;
			if (await isClickClackDiscussionChannelRevokedAsync({
				runtime: this.#runtime,
				serverBaseUrl: freshBinding.serverBaseUrl,
				channelId: freshBinding.channelId,
				binding: freshBinding
			})) {
				await this.#store.deleteIfCurrent(sessionKey, freshBinding);
				return;
			}
			bindingForAttachment = freshBinding;
			observedSiblingTitleSupport = bindings.some(({ binding: candidate }) => candidate.displayTitle !== void 0 && candidate.serverBaseUrl === freshBinding.serverBaseUrl && candidate.accountId === freshBinding.accountId);
		}
		const current = resolvePreparedDiscussionBindingAccount(this.#currentConfig(), bindingForAttachment, resolved.account);
		if (current.state !== "active") return;
		const account = current.account;
		const attached = await this.#refreshSessionAttachment(sessionKey, bindingForAttachment);
		if (!attached || attached.sessionId !== entry.sessionId) return;
		const currentBinding = attached;
		const fallback = fallbackDiscussionLabel(sessionKey, currentBinding.agentId);
		const label = resolveDiscussionLabel(entry, sessionKey, currentBinding.agentId);
		const section = entry.category?.trim() || account.discussions.section;
		const externalUrl = controlSessionUrl(account.discussions.controlUrlBase, sessionKey, account.agentId ?? "main", this.#currentConfig().session?.mainKey, label) ?? "";
		const patch = {};
		const labelChanged = label !== currentBinding.label;
		const desiredDisplayTitle = label === fallback ? "" : truncateDiscussionDisplayTitle(label);
		const serverSupportsDisplayTitle = currentBinding.displayTitle !== void 0 || observedSiblingTitleSupport;
		const shouldBackfillDisplayTitle = desiredDisplayTitle !== "" && currentBinding.displayTitle !== desiredDisplayTitle && serverSupportsDisplayTitle;
		if (labelChanged || shouldBackfillDisplayTitle) patch.display_title = desiredDisplayTitle;
		if (section !== currentBinding.section) patch.sidebar_section = section;
		if (externalUrl !== currentBinding.externalUrl) patch.external_url = externalUrl;
		if (Object.keys(patch).length === 0 && !labelChanged) return;
		const bindingFacts = await this.#store.prepareRead(sessionKey);
		let revocation;
		let session;
		try {
			revocation = await prepareClickClackDiscussionChannelRevocation({
				runtime: this.#runtime,
				serverBaseUrl: currentBinding.serverBaseUrl,
				channelId: currentBinding.channelId
			});
			const isRevoked = revocation.isRevoked;
			session = await prepareDiscussionSessionEntry(this.#runtime, sessionKey);
			const sessionAuthority = session;
			const client = this.#clientFactory(account);
			const assertCurrentAuthority = () => {
				sessionAuthority.source();
				const bound = bindingFacts.read();
				if (!bound || bound.externalRef !== currentBinding.externalRef || bound.serverBaseUrl !== currentBinding.serverBaseUrl || bound.channelId !== currentBinding.channelId || sessionAuthority.entry?.sessionId !== currentBinding.sessionId || sessionAuthority.entry.archivedAt !== void 0 || resolvePreparedDiscussionBindingAccount(this.#currentConfig(), currentBinding, account).state !== "active" || isRevoked(bound)) throw new Error("ClickClack discussion authority changed before channel update");
			};
			let updated;
			if (labelChanged) updated = await this.#withChannelMutationLock(() => renameDiscussionChannel({
				client,
				workspaceId: currentBinding.workspaceId,
				channelId: currentBinding.channelId,
				label,
				sessionKey,
				agentId: currentBinding.agentId,
				patch,
				assertCurrentAuthority
			}));
			else {
				assertCurrentAuthority();
				updated = await client.updateChannel(currentBinding.channelId, patch);
				assertChannelPatch(updated, patch);
			}
			const nextBinding = {
				...currentBinding,
				externalUrl,
				label,
				section,
				...updated.display_title !== void 0 ? { displayTitle: updated.display_title } : {}
			};
			if (updated.display_title === void 0) delete nextBinding.displayTitle;
			await this.#store.setIfCurrent(sessionKey, currentBinding, nextBinding);
		} finally {
			session?.release();
			revocation?.release();
			bindingFacts.release();
		}
	}
	async #refreshSessionAttachment(sessionKey, binding) {
		try {
			return await attachBindingToCurrentActiveSession({
				runtime: this.#runtime,
				store: this.#store,
				sessionKey,
				binding
			});
		} catch (error) {
			this.#logger().warn(`discussion attachment refresh failed for ${sessionKey}: ${String(error)}`);
			return;
		}
	}
	async #releaseStaleBinding(sessionKey, binding) {
		const pending = await getPendingDiscussionOpen(this.#runtime, sessionKey);
		if (pending?.externalRef === binding.externalRef) await clearDiscussionBindingGeneration({
			runtime: this.#runtime,
			sessionKey,
			expectedGeneration: pending.generation
		});
		return await this.#revokeAndDeleteBinding(sessionKey, binding);
	}
	async #revokeAndDeleteBinding(sessionKey, binding) {
		if (!await markClickClackDiscussionChannelRevoked(this.#runtime, sessionKey, binding)) return false;
		return await this.#store.deleteIfCurrent(sessionKey, binding);
	}
	async #resolveBindingForUse(binding, account) {
		const resolved = account ? resolvePreparedDiscussionBindingAccount(this.#currentConfig(), binding, account) : await this.prepareBindingAccount(binding);
		if (resolved.state !== "active") return resolved;
		const workspaces = await this.#clientFactory(resolved.account).workspaces();
		const workspace = findClickClackWorkspace(workspaces, resolved.account.discussions.workspace);
		const current = resolvePreparedDiscussionBindingAccount(this.#currentConfig(), binding, resolved.account);
		if (current.state !== "active") return current;
		return workspace?.id === binding.workspaceId ? current : { state: "retargeted" };
	}
	#currentConfig() {
		return this.#runtime.config.current();
	}
	async #ensureTimer() {
		if (this.#closed) return;
		const hasPendingOpens = (await listPendingDiscussionOpens(this.#runtime)).length > 0;
		const needsBindingPoll = this.#unsubscribeSessionsChanged === void 0 && await this.#store.countAsync() > 0;
		if (this.#closed || !hasPendingOpens && !needsBindingPoll) {
			if (this.#timer) {
				this.#timer.cancel();
				this.#timer = void 0;
			}
			return;
		}
		if (!this.#scheduler || this.#scheduler.signal.aborted || this.#timer) return;
		this.#timer = this.#scheduler.schedule({
			id: "reconcile-all",
			delayMs: RECONCILE_INTERVAL_MS,
			everyMs: RECONCILE_INTERVAL_MS,
			run: () => this.reconcileAll().catch((error) => {
				this.#logger().warn(`discussion reconcile pass failed: ${String(error)}`);
			})
		});
	}
	async #listReconcileSessionKeys() {
		return /* @__PURE__ */ new Set([...(await this.#store.entries()).map(({ sessionKey }) => sessionKey), ...(await listPendingDiscussionOpens(this.#runtime)).map(({ sessionKey }) => sessionKey)]);
	}
	#logger() {
		return this.#runtime.logging.getChildLogger({
			plugin: "clickclack",
			feature: "discussions"
		});
	}
	#withOperation(run) {
		if (this.#closed) return Promise.reject(/* @__PURE__ */ new Error("ClickClack discussion service is stopped"));
		const operation = Promise.resolve().then(run);
		this.#operations.add(operation);
		operation.then(() => this.#operations.delete(operation), () => this.#operations.delete(operation));
		return operation;
	}
};
// extensions/clickclack/src/discussions/register.ts
const DEFAULT_MESSAGE_LIMIT = 30;
const MAX_MESSAGE_LIMIT = 200;
const DiscussionParameters = {
	type: "object",
	properties: { limit: {
		type: "integer",
		minimum: 1,
		maximum: MAX_MESSAGE_LIMIT,
		description: `Maximum messages to return (default ${DEFAULT_MESSAGE_LIMIT}).`
	} },
	additionalProperties: false
};
const TARGETED_SESSION_TOOLS = /* @__PURE__ */ new Set([
	"sessions_history",
	"sessions_send",
	"session_status"
]);
function blockedResult() {
	return {
		block: true,
		blockReason: `ClickClack discussion sessions may use ${[...TARGETED_SESSION_TOOLS].join(", ")} only with their attached main session.`
	};
}
function registerClickClackDiscussions(api) {
	if (api.registrationMode === "tool-discovery") {
		api.registerTool(() => null, { name: "discussion" });
		return;
	}
	const runtime = api.runtime;
	adoptLegacyMarkers(runtime);
	const service = new ClickClackDiscussionService(runtime);
	function isClickClackDiscussionSessionTarget(params) {
		if (!isDiscussionSessionKey(params.requesterSessionKey)) return;
		const { targetSessionKey } = params;
		let binding;
		try {
			const store = getClickClackDiscussionBindingStore(runtime);
			store.assertReadAvailable();
			binding = store.get(targetSessionKey);
		} catch {
			return;
		}
		return currentDiscussionTarget(params, binding, (current) => isClickClackDiscussionChannelRevoked({
			runtime,
			serverBaseUrl: current.serverBaseUrl,
			channelId: current.channelId,
			binding: current
		}), (current) => bindingMatchesActiveSessionIncarnation(runtime, targetSessionKey, current));
	}
	function currentDiscussionTarget(params, binding, isRevoked, isActiveSession, preparedAccount) {
		const { targetSessionKey } = params;
		const cfg = runtime.config.current();
		if (binding && discussionSessionKey({
			runtime,
			mainSessionKey: targetSessionKey,
			...binding
		}) === params.requesterSessionKey && !isRevoked(binding) && isActiveSession(binding) && (preparedAccount ? resolvePreparedDiscussionBindingAccount(cfg, binding, preparedAccount) : resolveDiscussionBindingAccount(cfg, binding)).state === "active") return {
			sessionKey: targetSessionKey,
			binding
		};
	}
	async function resolveClickClackDiscussionSessionTarget(params) {
		if (!isDiscussionSessionKey(params.requesterSessionKey)) return;
		let facts;
		let revocation;
		let session;
		try {
			facts = await getClickClackDiscussionBindingStore(runtime).prepareRead(params.targetSessionKey);
			const binding = facts.read();
			if (!binding) return;
			revocation = await prepareClickClackDiscussionChannelRevocation({
				runtime,
				...binding
			});
			const resolved = await service.prepareBindingAccount(binding);
			if (resolved.state !== "active") return;
			session = await prepareDiscussionSessionEntry(runtime, params.targetSessionKey);
			session.source();
			const entry = session.entry;
			return currentDiscussionTarget(params, facts.read(), revocation.isRevoked, (current) => entry?.sessionId === current.sessionId && entry.archivedAt === void 0, resolved.account);
		} catch {
			return;
		} finally {
			session?.release();
			revocation?.release();
			facts?.release();
		}
	}
	api.registerService({
		id: "clickclack-discussion-session-events",
		apiVersion: 2,
		start: ({ gatewayEvents, scheduler }) => service.bindGatewayEvents(gatewayEvents, scheduler),
		stop: () => service.cleanup()
	});
	api.registerTool(({ sessionKey }) => ({
		name: "discussion",
		label: "Discussion",
		description: "Read the latest messages from the ClickClack discussion bound to this session.",
		parameters: DiscussionParameters,
		async execute(_toolCallId, input) {
			if (!sessionKey) return textResult("No discussion is bound to this session.", { bound: false });
			const requested = typeof input === "object" && input !== null && "limit" in input ? Number(input.limit) : DEFAULT_MESSAGE_LIMIT;
			const limit = Number.isInteger(requested) ? Math.max(1, Math.min(MAX_MESSAGE_LIMIT, requested)) : DEFAULT_MESSAGE_LIMIT;
			const result = await service.readLatestMessages(sessionKey, limit);
			return textResult(result.text, {
				bound: Boolean(result.binding),
				limit,
				...result.binding ? { channelId: result.binding.channelId } : {}
			});
		}
	}));
	api.on("before_tool_call", async (event, context) => {
		const callerSessionKey = context.sessionKey;
		if (!callerSessionKey || !isDiscussionSessionKey(callerSessionKey)) return;
		const { toolName } = event;
		if (toolName !== "session_status" && !toolName.startsWith("sessions_")) return;
		const usesAlternateSendTarget = toolName === "sessions_send" && (event.params.label !== void 0 || event.params.agentId !== void 0);
		const mutatesStatus = toolName === "session_status" && event.params.model !== void 0;
		const selectsHistoryIncarnation = toolName === "sessions_history" && event.params.sessionId !== void 0;
		const targetSessionKey = event.params.sessionKey;
		if (TARGETED_SESSION_TOOLS.has(toolName) && typeof targetSessionKey === "string" && !usesAlternateSendTarget && !mutatesStatus && !selectsHistoryIncarnation && await resolveClickClackDiscussionSessionTarget({
			requesterSessionKey: callerSessionKey,
			targetSessionKey
		})) return;
		return blockedResult();
	});
	const unregisterSessionAccess = createSessionVisibilityChecker.registerScopedAccessProvider(({ requesterSessionKey, targetSessionKey }) => {
		const target = isClickClackDiscussionSessionTarget({
			requesterSessionKey,
			targetSessionKey
		});
		return target ? { expectedSessionId: target.binding.sessionId } : void 0;
	}, { async resolveAsync({ requesterSessionKey, targetSessionKey }) {
		const target = await resolveClickClackDiscussionSessionTarget({
			requesterSessionKey,
			targetSessionKey
		});
		return target ? { expectedSessionId: target.binding.sessionId } : void 0;
	} });
	registerSessionDiscussionProvider(service.provider);
	api.lifecycle.registerRuntimeLifecycle({
		id: "clickclack-discussions",
		description: "Stops the lifecycle reconciler for managed ClickClack discussions.",
		cleanup: ({ reason, sessionKey, runId }) => {
			if (sessionKey === void 0 && runId === void 0 && (reason === "restart" || reason === "disable")) {
				unregisterSessionAccess();
				return service.cleanup();
			}
		}
	});
}
export { registerClickClackDiscussions as t };
