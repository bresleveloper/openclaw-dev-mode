import { b as resolveClickClackAccount, d as isClickClackChannelNameConflict, l as ClickClackHttpError, u as createClickClackClient, v as listClickClackAccountIds } from "./setup-surface-BBl3rvVx.mjs";
import { C as slugifyDiscussionLabel, D as listPendingDiscussionOpens, E as clearPendingDiscussionOpen, O as recordPendingDiscussionOpen, S as resolveDiscussionLabel, T as clearDiscussionBindingGeneration, _ as getClickClackDiscussionBindingStore, b as fallbackDiscussionLabel, c as markClickClackDiscussionChannelIdentityRevoked, d as discussionInfoForBinding, f as normalizedServerBaseUrl, g as bindingMatchesActiveSessionIncarnation, h as attachBindingToCurrentActiveSession, k as reserveDiscussionBindingGeneration, l as markClickClackDiscussionChannelRevoked, o as clearClickClackDiscussionChannelRevoked, p as resolveDiscussionBindingAccount, s as isClickClackDiscussionChannelRevoked, u as discussionAccounts, v as discussionCredentialFingerprint, w as truncateDiscussionDisplayTitle, x as isDiscussionSessionKey, y as discussionExternalRef } from "./channel-CT4CVd4d.mjs";
import "../api.js";
import { randomUUID } from "node:crypto";
import { buildControlUiSessionPath, registerSessionDiscussionProvider } from "openclaw/plugin-sdk/session-discussion";
import { createSessionVisibilityChecker } from "openclaw/plugin-sdk/session-visibility";
import { resolveSessionAgentIdStrict } from "openclaw/plugin-sdk/agent-scope-runtime";
import { textResult } from "openclaw/plugin-sdk/tool-results";
//#region extensions/clickclack/src/discussions/binding-retention.ts
var DetachedDiscussionBindingRetention = class {
	#runtime;
	#store;
	#maxRetained;
	constructor(options) {
		this.#runtime = options.runtime;
		this.#store = options.store;
		this.#maxRetained = options.maxRetained;
	}
	mark(sessionKey, binding) {
		const current = this.#store.get(sessionKey);
		if (!current || !this.#sameRoom(current, binding)) return;
		if (current.detachedAt === void 0) this.#store.set(sessionKey, {
			...current,
			detachedAt: Date.now()
		});
		while (this.#store.detachedCount() > this.#maxRetained) if (!this.#pruneOldest()) throw new Error("ClickClack detached discussion binding retention could not be reduced");
	}
	clear(sessionKey, binding) {
		const current = this.#store.get(sessionKey);
		if (!current || !this.#sameRoom(current, binding)) return;
		if (current.detachedAt === void 0) return current;
		const { detachedAt: _detachedAt, ...retained } = current;
		this.#store.set(sessionKey, retained);
		return retained;
	}
	ensureCapacity(sessionKey) {
		while (!this.#store.hasCapacity(sessionKey)) if (!this.#pruneOldest()) throw new Error("ClickClack discussion binding capacity is exhausted");
	}
	#pruneOldest() {
		for (;;) {
			const oldest = this.#store.oldestDetached();
			if (!oldest) return false;
			const current = this.#store.get(oldest.sessionKey);
			if (!current || current.detachedAt === void 0) continue;
			if (this.#runtime.agent.session.getSessionEntry({
				sessionKey: oldest.sessionKey,
				readConsistency: "latest"
			})) {
				this.clear(oldest.sessionKey, current);
				continue;
			}
			markClickClackDiscussionChannelRevoked(this.#runtime, current);
			this.#store.delete(oldest.sessionKey);
			return true;
		}
	}
	#sameRoom(left, right) {
		return left.serverBaseUrl === right.serverBaseUrl && left.channelId === right.channelId && left.externalRef === right.externalRef;
	}
};
//#endregion
//#region extensions/clickclack/src/discussions/control-session-url.ts
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
//#endregion
//#region extensions/clickclack/src/discussions/history-format.ts
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
//#endregion
//#region extensions/clickclack/src/discussions/installation.ts
const INSTALLATION_NAMESPACE = "discussion-installation";
const INSTALLATION_KEY = "current";
/** Returns the durable installation namespace used in server-visible ownership refs. */
async function getClickClackDiscussionInstallationId(runtime) {
	const store = runtime.state.openKeyedStore({
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
//#endregion
//#region extensions/clickclack/src/discussions/reconcile-scheduler.ts
const RECONCILE_DEBOUNCE_MS = 250;
const RECONCILE_RETRY_MS = 1e3;
const RECONCILE_RETRY_MAX_MS = 6e4;
/**
* Per-session debounced reconcile scheduling with failure backoff.
* Contracts: bursts coalesce onto the earliest scheduled run (steady event
* traffic can never postpone one); a failed run sets a not-before floor with
* growing backoff that later events cannot undercut; events during an
* in-flight run collapse into one follow-up scheduled after settlement; and
* `supersede()` invalidates callbacks from earlier activations so stop/start
* cycles cannot corrupt the bookkeeping of the next one.
*/
var DiscussionReconcileScheduler = class {
	#hooks;
	#timers = /* @__PURE__ */ new Map();
	#retryState = /* @__PURE__ */ new Map();
	#inFlight = /* @__PURE__ */ new Set();
	#followUps = /* @__PURE__ */ new Set();
	#generation = 0;
	constructor(hooks) {
		this.#hooks = hooks;
	}
	/** Invalidates callbacks scheduled by prior activations. */
	supersede() {
		this.#generation += 1;
	}
	clear() {
		for (const scheduled of this.#timers.values()) clearTimeout(scheduled.timer);
		this.#timers.clear();
		this.#retryState.clear();
		this.#inFlight.clear();
		this.#followUps.clear();
	}
	schedule(sessionKey, delayMs = RECONCILE_DEBOUNCE_MS) {
		if (!this.#hooks.shouldSchedule(sessionKey)) return;
		if (this.#inFlight.has(sessionKey)) {
			this.#followUps.add(sessionKey);
			return;
		}
		const retry = this.#retryState.get(sessionKey);
		const fireAt = Math.max(Date.now() + delayMs, retry?.notBefore ?? 0);
		const existing = this.#timers.get(sessionKey);
		if (existing) {
			if (existing.fireAt <= fireAt) return;
			clearTimeout(existing.timer);
		}
		const generation = this.#generation;
		const timer = setTimeout(() => {
			if (generation !== this.#generation) return;
			this.#timers.delete(sessionKey);
			this.#inFlight.add(sessionKey);
			this.#hooks.run(sessionKey).then(() => {
				if (generation !== this.#generation) return;
				this.#retryState.delete(sessionKey);
			}, (error) => {
				if (generation !== this.#generation || !this.#hooks.shouldSchedule(sessionKey)) return;
				const previous = this.#retryState.get(sessionKey);
				const nextRetryMs = Math.min(previous === void 0 ? RECONCILE_RETRY_MS : previous.delayMs * 2, RECONCILE_RETRY_MAX_MS);
				this.#retryState.set(sessionKey, {
					delayMs: nextRetryMs,
					notBefore: Date.now() + nextRetryMs
				});
				this.#hooks.warn(`discussion event reconcile failed for ${sessionKey}; retrying in ${nextRetryMs}ms: ${String(error)}`);
				this.#followUps.add(sessionKey);
			}).finally(() => {
				if (generation !== this.#generation) return;
				this.#inFlight.delete(sessionKey);
				if (this.#followUps.delete(sessionKey)) this.schedule(sessionKey);
			});
		}, Math.max(fireAt - Date.now(), 0));
		timer.unref?.();
		this.#timers.set(sessionKey, {
			fireAt,
			timer
		});
	}
};
//#endregion
//#region extensions/clickclack/src/discussions/service-open.ts
const CHANNEL_NAME_MUTATION_ATTEMPTS$1 = 4;
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
function assertManagedChannelContract(channel, expected) {
	const displayTitleMatches = !("display_title" in channel) || channel.display_title === expected.displayTitle;
	if (channel.external_managed !== true || (channel.external_ref ?? "") !== (expected.externalRef ?? "") || (channel.sidebar_section ?? "") !== (expected.section ?? "") || (channel.external_url ?? "") !== (expected.externalUrl ?? "") || !displayTitleMatches) throw new Error(`ClickClack server does not support the managed discussion channel contract for ${expected.sessionKey}`);
}
function assertManagedChannelListContract(channels) {
	if (channels.some((channel) => typeof channel.external_managed !== "boolean" || channel.external_ref !== void 0 && typeof channel.external_ref !== "string" || channel.external_url !== void 0 && typeof channel.external_url !== "string" || channel.sidebar_section !== void 0 && typeof channel.sidebar_section !== "string")) throw new Error("ClickClack server does not advertise the managed discussion contract");
}
async function openClickClackDiscussionBinding(params) {
	const { account, runtime, sessionKey, store } = params;
	const entry = runtime.agent.session.getSessionEntry({
		sessionKey,
		readConsistency: "latest"
	});
	if (!entry || entry.archivedAt !== void 0) return;
	if (!entry.sessionId?.trim()) throw new Error("OpenClaw session does not yet have a concrete session id");
	const client = params.clientFactory(account);
	const workspace = (await client.workspaces()).find((candidate) => candidate.id === account.discussions.workspace || candidate.slug === account.discussions.workspace || candidate.name === account.discussions.workspace);
	if (!workspace) throw new Error(`ClickClack discussions workspace not found: ${account.discussions.workspace}`);
	if (!workspace.route_id) throw new Error("ClickClack discussions workspace is missing its route id");
	const serverBaseUrl = normalizedServerBaseUrl(account);
	const credentialFingerprint = discussionCredentialFingerprint(account.token);
	const unresolved = (await listPendingDiscussionOpens(runtime)).find((pending) => pending.sessionKey === sessionKey);
	if (unresolved && (unresolved.accountId !== account.accountId || unresolved.credentialFingerprint !== credentialFingerprint || unresolved.serverBaseUrl !== serverBaseUrl || unresolved.workspaceId !== workspace.id)) {
		await params.reconcilePendingOpen(unresolved);
		if ((await listPendingDiscussionOpens(runtime)).some((pending) => pending.sessionKey === sessionKey)) throw new Error("A previous ClickClack discussion open is still unresolved; restore its credential and retry");
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
	const assertCurrentAuthority = () => {
		const currentAccounts = discussionAccounts(runtime.config.current());
		const currentAccount = currentAccounts.length === 1 ? currentAccounts[0] : void 0;
		const currentEntry = runtime.agent.session.getSessionEntry({
			sessionKey,
			readConsistency: "latest"
		});
		if (!currentAccount || currentAccount.accountId !== account.accountId || normalizedServerBaseUrl(currentAccount) !== serverBaseUrl || currentAccount.apiEndpoint !== account.apiEndpoint || discussionCredentialFingerprint(currentAccount.token) !== credentialFingerprint || currentAccount.discussions.workspace !== account.discussions.workspace || !currentEntry?.sessionId || currentEntry.archivedAt !== void 0) throw new Error("ClickClack discussion authority changed while opening the channel");
	};
	return await params.withChannelMutationLock(async () => {
		params.ensureBindingCapacity(sessionKey);
		let channels = await client.channels(workspace.id);
		assertManagedChannelListContract(channels);
		const destinationIdentity = [serverBaseUrl, workspace.id].join("\0");
		const bindingGeneration = await reserveDiscussionBindingGeneration({
			runtime,
			sessionKey,
			accountId: account.accountId,
			credentialFingerprint,
			destinationIdentity,
			createGeneration: params.bindingGenerationFactory
		});
		const externalRef = discussionExternalRef(params.installationId, sessionKey, destinationIdentity, bindingGeneration);
		let adopted;
		let managedFields;
		let resolved;
		for (let attempt = 0; attempt < CHANNEL_NAME_MUTATION_ATTEMPTS$1; attempt += 1) {
			adopted = channels.find((candidate) => candidate.external_managed === true && candidate.external_ref === externalRef);
			managedFields = {
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
			assertCurrentAuthority();
			try {
				if (adopted) {
					markClickClackDiscussionChannelIdentityRevoked({
						runtime,
						accountId: account.accountId,
						serverBaseUrl,
						channelId: adopted.id
					});
					resolved = await client.updateChannel(adopted.id, managedFields);
				} else {
					resolved = await client.createChannel(workspace.id, {
						...managedFields,
						kind: "public"
					});
					markClickClackDiscussionChannelIdentityRevoked({
						runtime,
						accountId: account.accountId,
						serverBaseUrl,
						channelId: resolved.id
					});
				}
				break;
			} catch (error) {
				if (isClickClackChannelNameConflict(error) && attempt < 3) {
					channels = await client.channels(workspace.id);
					assertManagedChannelListContract(channels);
					continue;
				}
				const definitiveNoCreate = isDefinitiveNoCreateHttpError(error);
				try {
					const relisted = await client.channels(workspace.id);
					assertManagedChannelListContract(relisted);
					const recovered = relisted.find((candidate) => candidate.external_managed === true && candidate.external_ref === externalRef);
					if (recovered) {
						adopted = recovered;
						markClickClackDiscussionChannelIdentityRevoked({
							runtime,
							accountId: account.accountId,
							serverBaseUrl,
							channelId: recovered.id
						});
						assertCurrentAuthority();
						resolved = await client.updateChannel(recovered.id, managedFields);
						break;
					}
					if (definitiveNoCreate) await clearDiscussionBindingGeneration({
						runtime,
						sessionKey,
						expectedGeneration: bindingGeneration
					});
				} catch {
					if (definitiveNoCreate && !adopted) await clearDiscussionBindingGeneration({
						runtime,
						sessionKey,
						expectedGeneration: bindingGeneration
					});
				}
				throw error;
			}
		}
		if (!resolved || !managedFields) throw new Error("ClickClack discussion channel name retries were exhausted");
		try {
			assertManagedChannelContract(resolved, {
				sessionKey,
				externalRef,
				section,
				externalUrl,
				displayTitle
			});
			if (adopted) assertChannelPatch(resolved, managedFields);
		} catch (error) {
			await clearPendingDiscussionOpen({
				runtime,
				sessionKey,
				expectedGeneration: bindingGeneration
			});
			params.warn(`incompatible discussion channel remains quarantined: ${resolved.id}`);
			throw error;
		}
		if (!resolved.route_id) {
			await clearPendingDiscussionOpen({
				runtime,
				sessionKey,
				expectedGeneration: bindingGeneration
			});
			params.warn(`route-less discussion channel remains quarantined: ${resolved.id}`);
			throw new Error("ClickClack discussion channel is missing its route id");
		}
		const channel = resolved;
		const currentEntry = runtime.agent.session.getSessionEntry({
			sessionKey,
			readConsistency: "latest"
		});
		if (!currentEntry?.sessionId || currentEntry.archivedAt !== void 0) {
			await clearPendingDiscussionOpen({
				runtime,
				sessionKey,
				expectedGeneration: bindingGeneration
			});
			params.warn(`unattached discussion channel remains quarantined: ${channel.id}`);
			throw new Error("OpenClaw session became inactive while opening its ClickClack discussion");
		}
		const currentLabel = resolveDiscussionLabel(currentEntry, sessionKey, agentId);
		const currentDisplayTitle = currentLabel === fallback ? "" : truncateDiscussionDisplayTitle(currentLabel);
		const currentSection = currentEntry.category?.trim() || account.discussions.section;
		const currentExternalUrl = controlSessionUrl(account.discussions.controlUrlBase, sessionKey, account.agentId ?? agentId, config.session?.mainKey, currentLabel) ?? "";
		let currentChannel = channel;
		if (currentEntry.sessionId !== entry.sessionId || currentLabel !== label || currentDisplayTitle !== displayTitle || currentSection !== section || currentExternalUrl !== (externalUrl ?? "")) try {
			for (let attempt = 0; attempt < CHANNEL_NAME_MUTATION_ATTEMPTS$1; attempt += 1) {
				const latestManagedFields = {
					...managedFields,
					name: await resolveAvailableChannelName({
						client,
						workspaceId: workspace.id,
						label: currentLabel,
						sessionKey,
						agentId,
						ownChannelId: channel.id
					}),
					external_url: currentExternalUrl,
					sidebar_section: currentSection,
					display_title: currentDisplayTitle
				};
				try {
					assertCurrentAuthority();
					currentChannel = await client.updateChannel(channel.id, latestManagedFields);
					assertChannelPatch(currentChannel, latestManagedFields);
					break;
				} catch (error) {
					if (!isClickClackChannelNameConflict(error) || attempt === 3) throw error;
				}
			}
		} catch (error) {
			await clearPendingDiscussionOpen({
				runtime,
				sessionKey,
				expectedGeneration: bindingGeneration
			});
			params.warn(`unattached discussion channel remains quarantined: ${channel.id}`);
			throw error;
		}
		const nextBinding = {
			accountId: account.accountId,
			agentId,
			sessionId: currentEntry.sessionId,
			serverBaseUrl,
			credentialFingerprint,
			externalRef,
			externalUrl: currentExternalUrl,
			workspaceRef: account.discussions.workspace,
			workspaceId: workspace.id,
			channelId: channel.id,
			channelRouteId: channel.route_id,
			workspaceRouteId: workspace.route_id,
			section: currentSection,
			archived: false,
			label: currentLabel,
			...currentChannel.display_title !== void 0 ? { displayTitle: currentChannel.display_title } : {}
		};
		try {
			assertCurrentAuthority();
			store.set(sessionKey, nextBinding);
		} catch (error) {
			await clearPendingDiscussionOpen({
				runtime,
				sessionKey,
				expectedGeneration: bindingGeneration
			});
			params.warn(`unbound discussion channel remains quarantined: ${channel.id}`);
			throw error;
		}
		await params.finalizePendingBinding(sessionKey, nextBinding);
		return nextBinding;
	});
}
async function reconcilePendingDiscussionOpen(params) {
	const { pending } = params;
	const currentBinding = params.store.get(pending.sessionKey);
	if (currentBinding?.externalRef === pending.externalRef) {
		await params.finalizePendingBinding(pending.sessionKey, currentBinding);
		return;
	}
	const cfg = params.runtime.config.current();
	const account = listClickClackAccountIds(cfg).map((accountId) => resolveClickClackAccount({
		cfg,
		accountId
	})).find((candidate) => candidate.configured && normalizedServerBaseUrl(candidate) === pending.serverBaseUrl && discussionCredentialFingerprint(candidate.token) === pending.credentialFingerprint);
	if (!account) return;
	const client = params.clientFactory(account);
	const entry = params.runtime.agent.session.getSessionEntry({
		sessionKey: pending.sessionKey,
		readConsistency: "latest"
	});
	const activeAccounts = discussionAccounts(cfg);
	const retryAccount = activeAccounts.length === 1 ? activeAccounts[0] : void 0;
	if (params.allowRetry !== false && entry?.sessionId && entry.archivedAt === void 0 && retryAccount && normalizedServerBaseUrl(retryAccount) === pending.serverBaseUrl && discussionCredentialFingerprint(retryAccount.token) === pending.credentialFingerprint) {
		if ((await params.clientFactory(retryAccount).workspaces()).find((candidate) => candidate.id === retryAccount.discussions.workspace || candidate.slug === retryAccount.discussions.workspace || candidate.name === retryAccount.discussions.workspace)?.id === pending.workspaceId) {
			await params.open(pending.sessionKey);
			return;
		}
	}
	const channels = await client.channels(pending.workspaceId);
	assertManagedChannelListContract(channels);
	const channel = channels.find((candidate) => candidate.external_managed === true && candidate.external_ref === pending.externalRef);
	if (channel) {
		markClickClackDiscussionChannelIdentityRevoked({
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
		return;
	}
	await clearDiscussionBindingGeneration({
		runtime: params.runtime,
		sessionKey: pending.sessionKey,
		expectedGeneration: pending.generation
	});
}
//#endregion
//#region extensions/clickclack/src/discussions/service.ts
const RECONCILE_INTERVAL_MS = 6e4;
const CHANNEL_NAME_MUTATION_ATTEMPTS = 4;
var ClickClackDiscussionService = class {
	#runtime;
	#store;
	#clientFactory;
	#installationId;
	#bindingGenerationFactory;
	#detachedBindings;
	#timersEnabled;
	#sessionLocks = /* @__PURE__ */ new Map();
	#reconcileScheduler = new DiscussionReconcileScheduler({
		shouldSchedule: () => !this.#closed,
		run: async (sessionKey) => await this.reconcile(sessionKey),
		warn: (message) => this.#logger().warn(message)
	});
	#channelMutationLock = Promise.resolve();
	#timer;
	#reconcileAllPromise;
	#unsubscribeSessionsChanged;
	#closed = false;
	#activation = 0;
	#cleanupPromise;
	#operations = /* @__PURE__ */ new Set();
	constructor(runtime, options = {}) {
		this.#runtime = runtime;
		this.#store = getClickClackDiscussionBindingStore(runtime);
		this.#clientFactory = options.clientFactory ?? ((account) => createClickClackClient({
			baseUrl: account.apiEndpoint,
			token: account.token
		}));
		this.#installationId = options.installationId;
		this.#bindingGenerationFactory = options.bindingGenerationFactory ?? randomUUID;
		this.#detachedBindings = new DetachedDiscussionBindingRetention({
			runtime,
			store: this.#store,
			maxRetained: options.maxRetainedDetachedBindings ?? 1e3
		});
		this.#timersEnabled = options.startTimer !== false;
		this.provider = {
			id: "clickclack",
			info: async ({ sessionKey }) => await this.info(sessionKey),
			open: async ({ sessionKey }) => await this.open(sessionKey)
		};
		if (options.gatewayEvents) this.bindGatewayEvents(options.gatewayEvents).catch((error) => {
			this.#logger().warn(`discussion activation failed: ${String(error)}`);
		});
		if (this.#timersEnabled && !options.gatewayEvents) this.#withOperation(() => this.#ensureTimer()).catch((error) => {
			this.#logger().warn(`discussion timer initialization failed: ${String(error)}`);
		});
	}
	async bindGatewayEvents(gatewayEvents) {
		const activation = ++this.#activation;
		if (this.#cleanupPromise) await this.#cleanupPromise;
		if (activation !== this.#activation) return;
		this.#cleanupPromise = void 0;
		this.#unsubscribeSessionsChanged?.();
		this.#closed = false;
		this.#reconcileScheduler.supersede();
		this.#unsubscribeSessionsChanged = gatewayEvents?.onSessionsChanged((event) => {
			this.#withOperation(async () => {
				if (this.#store.get(event.sessionKey) || (await listPendingDiscussionOpens(this.#runtime)).some((pending) => pending.sessionKey === event.sessionKey)) {
					if (activation === this.#activation) this.#reconcileScheduler.schedule(event.sessionKey);
				}
			}).catch((error) => {
				this.#logger().warn(`discussion event admission failed: ${String(error)}`);
			});
		});
		await this.#withOperation(async () => {
			for (const sessionKey of await this.#listReconcileSessionKeys()) {
				if (activation !== this.#activation) return;
				this.#reconcileScheduler.schedule(sessionKey, 0);
			}
			await this.#ensureTimer();
		});
	}
	hasEnabledAccount() {
		return discussionAccounts(this.#currentConfig()).length === 1;
	}
	async info(sessionKey) {
		return await this.#withOperation(() => this.#withSessionLock(sessionKey, async () => {
			if (discussionAccounts(this.#currentConfig()).length !== 1) return { state: "none" };
			const existing = this.#store.get(sessionKey);
			if (existing) {
				const resolved = await this.#resolveBindingForUse(existing);
				if (resolved.state === "retargeted") {
					this.#revokeAndDeleteBinding(sessionKey, existing);
					return { state: "available" };
				}
				if (resolved.state === "stale") {
					await this.#releaseStaleBinding(sessionKey, existing);
					return { state: "available" };
				}
				if (resolved.state !== "active") return { state: "none" };
				await this.#finalizePendingBinding(sessionKey, existing);
				await this.#reconcileBinding(sessionKey, existing, resolved.account);
				const current = this.#store.get(sessionKey);
				if (!current) return { state: this.hasEnabledAccount() ? "available" : "none" };
				return discussionInfoForBinding(current, resolved.account);
			}
			return { state: "available" };
		}));
	}
	async open(sessionKey) {
		return await this.#withOperation(() => this.#withSessionLock(sessionKey, () => this.#open(sessionKey)));
	}
	async #open(sessionKey) {
		this.#installationId ??= await getClickClackDiscussionInstallationId(this.#runtime);
		const accounts = discussionAccounts(this.#currentConfig());
		if (accounts.length > 1) throw new Error("ClickClack discussions require exactly one enabled discussion account");
		const account = accounts[0];
		if (!account) return { state: "none" };
		const existing = this.#store.get(sessionKey);
		if (existing) {
			const resolved = await this.#resolveBindingForUse(existing);
			if (resolved.state === "retargeted") this.#revokeAndDeleteBinding(sessionKey, existing);
			else if (resolved.state === "stale") await this.#releaseStaleBinding(sessionKey, existing);
			else if (resolved.state === "active") {
				await this.#finalizePendingBinding(sessionKey, existing);
				await this.#reconcileBinding(sessionKey, existing, resolved.account);
				const current = this.#store.get(sessionKey);
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
				bindingGenerationFactory: this.#bindingGenerationFactory,
				sessionKey,
				ensureTimer: () => this.#ensureTimer(),
				reconcilePendingOpen: async (pending) => await this.#reconcilePendingOpen(pending, { allowRetry: false }),
				withChannelMutationLock: async (run) => await this.#withChannelMutationLock(run),
				ensureBindingCapacity: (key) => this.#detachedBindings.ensureCapacity(key),
				finalizePendingBinding: (key, nextBinding) => this.#finalizePendingBinding(key, nextBinding),
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
			await this.#withSessionLock(sessionKey, async () => {
				const binding = this.#store.get(sessionKey);
				if (binding) await this.#reconcileBinding(sessionKey, binding);
				const pending = (await listPendingDiscussionOpens(this.#runtime)).find((candidate) => candidate.sessionKey === sessionKey);
				if (pending) await this.#reconcilePendingOpen(pending);
			});
		} finally {
			await this.#ensureTimer();
		}
	}
	async reconcileAll() {
		return await this.#withOperation(async () => {
			if (this.#reconcileAllPromise) return await this.#reconcileAllPromise;
			this.#reconcileAllPromise = (async () => {
				try {
					for (const sessionKey of await this.#listReconcileSessionKeys()) try {
						await this.#reconcile(sessionKey);
					} catch (error) {
						this.#logger().warn(`discussion reconcile failed for ${sessionKey}: ${String(error)}`);
					}
				} finally {
					await this.#ensureTimer();
				}
			})().finally(() => {
				this.#reconcileAllPromise = void 0;
			});
			return await this.#reconcileAllPromise;
		});
	}
	async readLatestMessages(sessionKey, limit) {
		return await this.#withOperation(() => this.#withSessionLock(sessionKey, async () => {
			const binding = this.#store.get(sessionKey);
			if (!binding) return { text: "No discussion is bound to this session." };
			const resolved = await this.#resolveBindingForUse(binding);
			if (resolved.state === "retargeted") return { text: "No discussion is bound to this session." };
			if (resolved.state === "stale") return { text: "No discussion is bound to this session." };
			if (resolved.state !== "active") return { text: "No discussion is bound to this session." };
			const attached = this.#refreshSessionAttachment(sessionKey, binding);
			if (!attached) return { text: "No discussion is bound to this session." };
			if (isClickClackDiscussionChannelRevoked({
				runtime: this.#runtime,
				serverBaseUrl: binding.serverBaseUrl,
				channelId: binding.channelId
			})) return { text: "No discussion is bound to this session." };
			return {
				binding: attached,
				text: formatDiscussionHistory(await this.#clientFactory(resolved.account).latestChannelMessages(attached.channelId, limit)) || "The bound discussion has no messages yet."
			};
		}));
	}
	cleanup() {
		this.#closed = true;
		this.#activation += 1;
		this.#unsubscribeSessionsChanged?.();
		this.#unsubscribeSessionsChanged = void 0;
		this.#reconcileScheduler.supersede();
		this.#reconcileScheduler.clear();
		if (this.#timer) {
			clearInterval(this.#timer);
			this.#timer = void 0;
		}
		this.#cleanupPromise ??= Promise.allSettled(this.#operations).then(() => void 0);
		return this.#cleanupPromise;
	}
	async #reconcileBinding(sessionKey, binding, resolvedAccount) {
		await this.#finalizePendingBinding(sessionKey, binding);
		if (isClickClackDiscussionChannelRevoked({
			runtime: this.#runtime,
			serverBaseUrl: binding.serverBaseUrl,
			channelId: binding.channelId
		})) {
			this.#store.delete(sessionKey);
			return;
		}
		const entry = this.#runtime.agent.session.getSessionEntry({
			sessionKey,
			readConsistency: "latest"
		});
		if (!entry) {
			this.#detachedBindings.mark(sessionKey, binding);
			return;
		}
		const activeBinding = this.#detachedBindings.clear(sessionKey, binding);
		if (!activeBinding) return;
		const resolved = resolvedAccount ? resolveDiscussionBindingAccount(this.#currentConfig(), activeBinding) : await this.#resolveBindingForUse(activeBinding);
		if (resolved.state === "retargeted") {
			this.#revokeAndDeleteBinding(sessionKey, activeBinding);
			return;
		}
		if (resolved.state === "stale") {
			await this.#releaseStaleBinding(sessionKey, activeBinding);
			return;
		}
		if (resolved.state !== "active") return;
		const account = resolved.account;
		if (!account.baseUrl || !account.token) throw new Error(`ClickClack discussion account is no longer configured: ${activeBinding.accountId}`);
		if (entry.archivedAt !== void 0) return;
		const attached = this.#refreshSessionAttachment(sessionKey, activeBinding);
		if (!attached) return;
		const currentBinding = attached;
		const fallback = fallbackDiscussionLabel(sessionKey, currentBinding.agentId);
		const label = resolveDiscussionLabel(entry, sessionKey, currentBinding.agentId);
		const section = entry.category?.trim() || account.discussions.section;
		const externalUrl = controlSessionUrl(account.discussions.controlUrlBase, sessionKey, account.agentId ?? "main", this.#currentConfig().session?.mainKey, label) ?? "";
		const patch = {};
		const labelChanged = label !== currentBinding.label;
		const desiredDisplayTitle = label === fallback ? "" : truncateDiscussionDisplayTitle(label);
		const serverSupportsDisplayTitle = this.#store.entries().some(({ binding: candidate }) => candidate.displayTitle !== void 0 && candidate.serverBaseUrl === currentBinding.serverBaseUrl && candidate.accountId === currentBinding.accountId);
		const shouldBackfillDisplayTitle = desiredDisplayTitle !== "" && currentBinding.displayTitle !== desiredDisplayTitle && serverSupportsDisplayTitle;
		if (labelChanged || shouldBackfillDisplayTitle) patch.display_title = desiredDisplayTitle;
		if (section !== currentBinding.section) patch.sidebar_section = section;
		if (externalUrl !== currentBinding.externalUrl) patch.external_url = externalUrl;
		if (Object.keys(patch).length === 0 && !labelChanged) return;
		const client = this.#clientFactory(account);
		let updated;
		if (labelChanged) updated = await this.#withChannelMutationLock(async () => {
			for (let attempt = 0; attempt < CHANNEL_NAME_MUTATION_ATTEMPTS; attempt += 1) {
				patch.name = await resolveAvailableChannelName({
					client,
					workspaceId: currentBinding.workspaceId,
					label,
					sessionKey,
					agentId: currentBinding.agentId,
					ownChannelId: currentBinding.channelId
				});
				try {
					const renamed = await client.updateChannel(currentBinding.channelId, patch);
					assertChannelPatch(renamed, patch);
					return renamed;
				} catch (error) {
					if (!isClickClackChannelNameConflict(error) || attempt === 3) throw error;
				}
			}
			throw new Error("ClickClack discussion channel name retries were exhausted");
		});
		else {
			updated = await client.updateChannel(currentBinding.channelId, patch);
			assertChannelPatch(updated, patch);
		}
		const latestBinding = this.#store.get(sessionKey);
		if (!latestBinding || latestBinding.serverBaseUrl !== currentBinding.serverBaseUrl || latestBinding.channelId !== currentBinding.channelId || latestBinding.externalRef !== currentBinding.externalRef) return;
		const nextBinding = {
			...latestBinding,
			externalUrl,
			label,
			section,
			...updated.display_title !== void 0 ? { displayTitle: updated.display_title } : {}
		};
		if (updated.display_title === void 0) delete nextBinding.displayTitle;
		this.#store.set(sessionKey, nextBinding);
	}
	#refreshSessionAttachment(sessionKey, binding) {
		try {
			return attachBindingToCurrentActiveSession({
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
	async #reconcilePendingOpen(pending, options = {}) {
		await reconcilePendingDiscussionOpen({
			runtime: this.#runtime,
			store: this.#store,
			clientFactory: this.#clientFactory,
			pending,
			...options,
			finalizePendingBinding: (key, binding) => this.#finalizePendingBinding(key, binding),
			open: (key) => this.#open(key)
		});
	}
	async #releaseStaleBinding(sessionKey, binding) {
		await clearDiscussionBindingGeneration({
			runtime: this.#runtime,
			sessionKey
		});
		this.#revokeAndDeleteBinding(sessionKey, binding);
	}
	#revokeAndDeleteBinding(sessionKey, binding) {
		markClickClackDiscussionChannelRevoked(this.#runtime, binding);
		this.#store.delete(sessionKey);
	}
	async #finalizePendingBinding(sessionKey, binding) {
		const pending = (await listPendingDiscussionOpens(this.#runtime)).find((candidate) => candidate.sessionKey === sessionKey && candidate.externalRef === binding.externalRef);
		if (pending) {
			clearClickClackDiscussionChannelRevoked({
				runtime: this.#runtime,
				serverBaseUrl: binding.serverBaseUrl,
				channelId: binding.channelId
			});
			await clearDiscussionBindingGeneration({
				runtime: this.#runtime,
				sessionKey,
				expectedGeneration: pending.generation
			});
		}
	}
	async #resolveBindingForUse(binding) {
		const resolved = resolveDiscussionBindingAccount(this.#currentConfig(), binding);
		if (resolved.state !== "active") return resolved;
		const workspace = (await this.#clientFactory(resolved.account).workspaces()).find((candidate) => candidate.id === resolved.account.discussions.workspace || candidate.slug === resolved.account.discussions.workspace || candidate.name === resolved.account.discussions.workspace);
		const current = resolveDiscussionBindingAccount(this.#currentConfig(), binding);
		if (current.state !== "active") return current;
		return workspace?.id === binding.workspaceId ? current : { state: "retargeted" };
	}
	#currentConfig() {
		return this.#runtime.config.current();
	}
	async #ensureTimer() {
		if (this.#closed) return;
		const hasPendingOpens = (await listPendingDiscussionOpens(this.#runtime)).length > 0;
		const needsBindingPoll = this.#unsubscribeSessionsChanged === void 0 && this.#store.count() > 0;
		if (this.#closed || !hasPendingOpens && !needsBindingPoll) {
			if (this.#timer) {
				clearInterval(this.#timer);
				this.#timer = void 0;
			}
			return;
		}
		if (!this.#timersEnabled || this.#timer) return;
		this.#timer = setInterval(() => {
			this.reconcileAll().catch((error) => {
				this.#logger().warn(`discussion reconcile pass failed: ${String(error)}`);
			});
		}, RECONCILE_INTERVAL_MS);
		this.#timer.unref?.();
	}
	async #listReconcileSessionKeys() {
		return /* @__PURE__ */ new Set([...this.#store.entries().map(({ sessionKey }) => sessionKey), ...(await listPendingDiscussionOpens(this.#runtime)).map(({ sessionKey }) => sessionKey)]);
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
	async #withSessionLock(sessionKey, run) {
		const current = (this.#sessionLocks.get(sessionKey) ?? Promise.resolve()).catch(() => void 0).then(run);
		this.#sessionLocks.set(sessionKey, current);
		try {
			return await current;
		} finally {
			if (this.#sessionLocks.get(sessionKey) === current) this.#sessionLocks.delete(sessionKey);
		}
	}
	async #withChannelMutationLock(run) {
		const current = this.#channelMutationLock.catch(() => void 0).then(run);
		this.#channelMutationLock = current;
		return await current;
	}
};
//#endregion
//#region extensions/clickclack/src/discussions/tool-policy.ts
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
function isClickClackDiscussionSessionTarget(params) {
	const matched = getClickClackDiscussionBindingStore(params.runtime).getByDiscussionSession(params.requesterSessionKey);
	if (matched && matched.sessionKey === params.targetSessionKey && !isClickClackDiscussionChannelRevoked({
		runtime: params.runtime,
		serverBaseUrl: matched.binding.serverBaseUrl,
		channelId: matched.binding.channelId
	}) && bindingMatchesActiveSessionIncarnation(params.runtime, matched.sessionKey, matched.binding) && resolveDiscussionBindingAccount(params.runtime.config.current(), matched.binding).state === "active") return matched;
}
/** Restricts a discussion side session's session tools to its attached main session. */
function enforceClickClackDiscussionToolTarget(params) {
	const callerSessionKey = params.context.sessionKey;
	if (!callerSessionKey) return;
	const { toolName } = params.event;
	if (toolName !== "session_status" && !toolName.startsWith("sessions_")) return;
	const matched = getClickClackDiscussionBindingStore(params.runtime).getByDiscussionSession(callerSessionKey);
	if (!matched) return isDiscussionSessionKey(callerSessionKey) ? blockedResult() : void 0;
	const targetsMain = Boolean(isClickClackDiscussionSessionTarget({
		runtime: params.runtime,
		requesterSessionKey: callerSessionKey,
		targetSessionKey: matched.sessionKey
	})) && TARGETED_SESSION_TOOLS.has(toolName) && params.event.params.sessionKey === matched.sessionKey;
	const usesAlternateSendTarget = toolName === "sessions_send" && (params.event.params.label !== void 0 || params.event.params.agentId !== void 0);
	const mutatesStatus = toolName === "session_status" && params.event.params.model !== void 0;
	const selectsHistoryIncarnation = toolName === "sessions_history" && params.event.params.sessionId !== void 0;
	if (targetsMain && !usesAlternateSendTarget && !mutatesStatus && !selectsHistoryIncarnation) return;
	return blockedResult();
}
//#endregion
//#region extensions/clickclack/src/discussions/tool.ts
const DEFAULT_MESSAGE_LIMIT = 30;
const MAX_MESSAGE_LIMIT = 200;
function createClickClackDiscussionTool(params) {
	return {
		name: "discussion",
		label: "Discussion",
		description: "Read the latest messages from the ClickClack discussion bound to this session.",
		parameters: {
			type: "object",
			properties: { limit: {
				type: "integer",
				minimum: 1,
				maximum: MAX_MESSAGE_LIMIT,
				description: `Maximum messages to return (default ${DEFAULT_MESSAGE_LIMIT}).`
			} },
			additionalProperties: false
		},
		async execute(_toolCallId, input) {
			if (!params.sessionKey) return textResult("No discussion is bound to this session.", { bound: false });
			const requested = typeof input === "object" && input !== null && "limit" in input ? Number(input.limit) : DEFAULT_MESSAGE_LIMIT;
			const limit = Number.isInteger(requested) ? Math.max(1, Math.min(MAX_MESSAGE_LIMIT, requested)) : DEFAULT_MESSAGE_LIMIT;
			const result = await params.service.readLatestMessages(params.sessionKey, limit);
			return textResult(result.text, {
				bound: Boolean(result.binding),
				limit,
				...result.binding ? { channelId: result.binding.channelId } : {}
			});
		}
	};
}
//#endregion
//#region extensions/clickclack/src/discussions/register.ts
function registerClickClackDiscussions(api) {
	if (api.registrationMode === "tool-discovery") {
		api.registerTool(() => null, { name: "discussion" });
		return;
	}
	const service = new ClickClackDiscussionService(api.runtime);
	api.registerService({
		id: "clickclack-discussion-session-events",
		start: ({ gatewayEvents }) => service.bindGatewayEvents(gatewayEvents),
		stop: () => service.cleanup()
	});
	api.registerTool((context) => createClickClackDiscussionTool({
		service,
		sessionKey: context.sessionKey
	}));
	api.on("before_tool_call", (event, context) => enforceClickClackDiscussionToolTarget({
		runtime: api.runtime,
		event,
		context
	}));
	const unregisterSessionAccess = createSessionVisibilityChecker.registerScopedAccessProvider(({ requesterSessionKey, targetSessionKey }) => {
		const target = isClickClackDiscussionSessionTarget({
			runtime: api.runtime,
			requesterSessionKey,
			targetSessionKey
		});
		return target ? { expectedSessionId: target.binding.sessionId } : void 0;
	});
	registerSessionDiscussionProvider(service.provider);
	api.lifecycle.registerRuntimeLifecycle({
		id: "clickclack-discussions",
		description: "Stops the lifecycle reconciler for managed ClickClack discussions.",
		cleanup: () => {
			unregisterSessionAccess();
			return service.cleanup();
		}
	});
}
//#endregion
export { registerClickClackDiscussions as t };
