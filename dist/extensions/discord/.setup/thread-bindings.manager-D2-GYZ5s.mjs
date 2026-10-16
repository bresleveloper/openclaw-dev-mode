import { t as __exportAll } from "./rolldown-runtime-B4FMCO8f.mjs";
import { A as isDiscordThreadChannelType } from "./allow-list-vxkG9_JD.mjs";
import { P as createDiscordRestClient } from "./send.shared-C4CN24D9.mjs";
import { C as withDiscordRequestAuthority, tt as createChannelWebhook, ut as getChannel } from "./discord-9gysrhzp.mjs";
import { h as canFallbackDiscordWebhookSend, m as resolveDiscordChannelId } from "./send.receipt-DVOg2Oaw.mjs";
import { c as sendWebhookMessageDiscord, u as createThreadDiscord } from "./send-CJk3VP5q.mjs";
import { t as sendMessageDiscord } from "./send.outbound-rOboMO_6.mjs";
import { A as resolveBindingRecordKey, C as getThreadBindingToken, D as rememberReusableWebhook, E as refreshUnboundThreadWebhookIdentity, F as resolveThreadBindingMaxAgeMs$1, I as shouldDefaultPersist, L as toBindingRecordKey, M as resolveThreadBindingIdleTimeoutMs$1, O as rememberThreadBindingToken, R as toReusableWebhookKey, S as forgetThreadBindingToken, T as normalizeThreadBindingDurationMs, _ as MANAGERS_BY_ACCOUNT_ID, b as THREAD_BINDING_TOUCH_PERSIST_MIN_INTERVAL_MS, c as drainThreadBindingAccountOperations, d as runThreadBindingAccountOperation, f as runThreadBindingMutation, g as BINDINGS_BY_THREAD_ID, h as updateBindingRecordSync, j as resolvePreparedThreadBindingLifecycle, k as resolveBindingIdsForSession, l as drainThreadBindingMutations, m as snapshotThreadBindingJson, p as shouldPersistAnyBindingState, s as commitBindingRecord, v as PERSIST_BY_ACCOUNT_ID, w as normalizeTargetKind, x as ensureBindingsLoadedAsync, y as REUSABLE_WEBHOOKS_BY_ACCOUNT_CHANNEL } from "./thread-bindings.session-updates-Bu_CGr_O.mjs";
import { n as resolveDiscordChannelInfoSafe, t as resolveDiscordChannelIdSafe } from "./channel-access-BRp3Y-rF.mjs";
import { createSubsystemLogger, logVerbose } from "openclaw/plugin-sdk/runtime-env";
import { asOptionalObjectRecord, normalizeOptionalString, normalizeOptionalStringifiedId } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeAccountId } from "openclaw/plugin-sdk/routing";
import { getRuntimeConfigSnapshot } from "openclaw/plugin-sdk/runtime-config-snapshot";
import { parseStrictNonNegativeInteger as parseStrictNonNegativeInteger$1 } from "openclaw/plugin-sdk/number-runtime";
import { SYSTEM_MARK } from "openclaw/plugin-sdk/text-chunking";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { registerSessionBindingAdapter, resolveThreadBindingConversationIdFromBindingId, resolveThreadBindingFarewellText, resolveThreadBindingThreadName, unregisterSessionBindingAdapter } from "openclaw/plugin-sdk/conversation-runtime";
import { resolveSessionAgentIdStrict } from "openclaw/plugin-sdk/agent-scope-runtime";
//#region extensions/discord/src/monitor/thread-bindings.persona.ts
const THREAD_BINDING_PERSONA_MAX_CHARS = 80;
function normalizePersonaLabel(value) {
	if (!value) return;
	return value.replace(/\s+/g, " ").trim() || void 0;
}
function resolveThreadBindingPersona(params) {
	const base = normalizePersonaLabel(params.label) || normalizePersonaLabel(params.agentId) || "agent";
	return truncateUtf16Safe(`${SYSTEM_MARK} ${base}`, THREAD_BINDING_PERSONA_MAX_CHARS);
}
function resolveThreadBindingPersonaFromRecord(record) {
	return resolveThreadBindingPersona(record);
}
//#endregion
//#region extensions/discord/src/monitor/thread-bindings.types.ts
const THREAD_BINDINGS_SWEEP_INTERVAL_MS = 12e4;
const DEFAULT_THREAD_BINDING_IDLE_TIMEOUT_MS = 864e5;
//#endregion
//#region extensions/discord/src/monitor/thread-bindings.discord-api.ts
const log = createSubsystemLogger("discord/thread-bindings");
function buildThreadTarget(threadId) {
	return /^(channel:|user:)/i.test(threadId) ? threadId : `channel:${threadId}`;
}
function isThreadArchived(raw) {
	if (!raw || typeof raw !== "object") return false;
	const asRecord = raw;
	return asRecord.archived === true || asRecord.thread_metadata?.archived === true || asRecord.threadMetadata?.archived === true;
}
function normalizeDiscordBindingChannelId(raw) {
	const trimmed = normalizeOptionalString(raw) ?? "";
	if (!trimmed) return null;
	try {
		return resolveDiscordChannelId(trimmed);
	} catch {
		return null;
	}
}
function summarizeDiscordError(err) {
	if (err instanceof Error) return err.message;
	if (typeof err === "string") return err;
	if (typeof err === "number" || typeof err === "boolean" || typeof err === "bigint" || typeof err === "symbol") return String(err);
	return "error";
}
function extractDiscordErrorStatus(err) {
	if (!err || typeof err !== "object") return;
	const candidate = err;
	return parseStrictNonNegativeInteger$1(candidate.status) ?? parseStrictNonNegativeInteger$1(candidate.statusCode) ?? parseStrictNonNegativeInteger$1(candidate.response?.status);
}
function extractDiscordErrorCode(err) {
	if (!err || typeof err !== "object") return;
	const candidate = err;
	return parseStrictNonNegativeInteger$1(candidate.code) ?? parseStrictNonNegativeInteger$1(candidate.rawError?.code) ?? parseStrictNonNegativeInteger$1(candidate.body?.code) ?? parseStrictNonNegativeInteger$1(candidate.response?.body?.code) ?? parseStrictNonNegativeInteger$1(candidate.response?.data?.code);
}
function isDiscordThreadGoneError(err) {
	if (extractDiscordErrorCode(err) === 10003) return true;
	const status = extractDiscordErrorStatus(err);
	return status === 404 || status === 403;
}
async function maybeSendBindingMessage(params) {
	const assertCurrent = params.assertCurrent;
	const text = params.text.trim();
	if (!text) return;
	const record = params.record;
	const { webhookId, webhookToken } = record;
	if (params.preferWebhook !== false && webhookId && webhookToken) try {
		await withDiscordRequestAuthority(assertCurrent, () => {
			assertCurrent?.();
			return sendWebhookMessageDiscord(text, {
				cfg: params.cfg,
				webhookId,
				webhookToken,
				accountId: record.accountId,
				threadId: record.threadId,
				username: resolveThreadBindingPersonaFromRecord(record)
			});
		});
		return;
	} catch (err) {
		const fallbackToBot = canFallbackDiscordWebhookSend(err);
		log.warn("discord thread binding webhook send failed", {
			error: summarizeDiscordError(err),
			fallbackToBot
		});
		if (!fallbackToBot) return;
	}
	try {
		await withDiscordRequestAuthority(assertCurrent, () => {
			assertCurrent?.();
			return sendMessageDiscord(buildThreadTarget(record.threadId), text, {
				cfg: params.cfg,
				accountId: record.accountId
			});
		});
	} catch (err) {
		logVerbose(`discord thread binding fallback send failed: ${summarizeDiscordError(err)}`);
	}
}
async function createWebhookForChannel(params) {
	const assertCreateAllowed = params.assertCreateAllowed;
	try {
		const rest = createDiscordRestClient({
			cfg: params.cfg,
			accountId: params.accountId,
			token: params.token
		}).rest;
		const created = await withDiscordRequestAuthority(assertCreateAllowed, () => {
			assertCreateAllowed?.();
			return createChannelWebhook(rest, params.channelId, { body: { name: "OpenClaw Agents" } });
		});
		const webhookId = normalizeOptionalString(created?.id) ?? "";
		const webhookToken = normalizeOptionalString(created?.token) ?? "";
		if (!webhookId || !webhookToken) return {};
		return {
			webhookId,
			webhookToken
		};
	} catch (err) {
		logVerbose(`discord thread binding webhook create failed for ${params.channelId}: ${summarizeDiscordError(err)}`);
		return {};
	}
}
function findReusableWebhook(params) {
	const reusableKey = toReusableWebhookKey(params);
	const cached = REUSABLE_WEBHOOKS_BY_ACCOUNT_CHANNEL.get(reusableKey);
	if (cached) return {
		webhookId: cached.webhookId,
		webhookToken: cached.webhookToken
	};
	for (const record of BINDINGS_BY_THREAD_ID.values()) {
		if (record.accountId !== params.accountId || record.channelId !== params.channelId || !record.webhookId || !record.webhookToken) continue;
		rememberReusableWebhook(record);
		return {
			webhookId: record.webhookId,
			webhookToken: record.webhookToken
		};
	}
	return {};
}
async function resolveChannelIdForBinding(params) {
	const explicit = normalizeDiscordBindingChannelId(params.channelId);
	if (explicit) return explicit;
	const lookupThreadId = normalizeDiscordBindingChannelId(params.threadId);
	if (!lookupThreadId) return null;
	try {
		const rest = createDiscordRestClient({
			cfg: params.cfg,
			accountId: params.accountId,
			token: params.token
		}).rest;
		const channel = await getChannel(rest, lookupThreadId);
		const channelInfo = resolveDiscordChannelInfoSafe(channel);
		const channelId = normalizeOptionalString(resolveDiscordChannelIdSafe(channel)) ?? "";
		const type = channelInfo.type;
		const parentId = normalizeOptionalString(channelInfo.parentId) ?? "";
		if (parentId && isDiscordThreadChannelType(type)) return parentId;
		return channelId || null;
	} catch (err) {
		logVerbose(`discord thread binding channel resolve failed for ${lookupThreadId}: ${summarizeDiscordError(err)}`);
		return null;
	}
}
async function createThreadForBinding(params) {
	const assertCreateAllowed = params.assertCreateAllowed;
	try {
		const created = await createThreadDiscord(params.channelId, { name: params.threadName }, {
			cfg: params.cfg,
			accountId: params.accountId,
			token: params.token,
			...assertCreateAllowed ? { assertCreateAllowed } : {}
		});
		return (normalizeOptionalString(created?.id) ?? "") || null;
	} catch (err) {
		logVerbose(`discord thread binding auto-thread create failed for ${params.channelId}: ${summarizeDiscordError(err)}`);
		return null;
	}
}
//#endregion
//#region extensions/discord/src/monitor/thread-bindings.session-adapter.ts
function toSessionBindingRecord(record, defaults) {
	const bindingId = resolveBindingRecordKey({
		accountId: record.accountId,
		threadId: record.threadId
	}) ?? `${record.accountId}:${record.threadId}`;
	const lifecycle = resolvePreparedThreadBindingLifecycle({
		record,
		...defaults
	});
	return {
		bindingId,
		targetSessionKey: record.targetSessionKey,
		targetKind: record.targetKind === "subagent" ? "subagent" : "session",
		conversation: {
			channel: "discord",
			accountId: record.accountId,
			conversationId: record.threadId,
			parentConversationId: record.channelId
		},
		status: "active",
		boundAt: record.boundAt,
		expiresAt: lifecycle.expiresAt,
		metadata: {
			agentId: record.agentId,
			label: record.label,
			webhookId: record.webhookId,
			webhookToken: record.webhookToken,
			boundBy: record.boundBy,
			lastActivityAt: record.lastActivityAt,
			idleTimeoutMs: lifecycle.idleTimeoutMs,
			maxAgeMs: lifecycle.maxAgeMs,
			...record.metadata
		}
	};
}
function createThreadBindingSessionAdapter(params) {
	const serializeBinding = (entry) => toSessionBindingRecord(entry, params.defaults);
	return {
		channel: "discord",
		accountId: params.accountId,
		capabilities: { placements: ["current", "child"] },
		bind: async (input) => {
			const assertCurrent = input.assertCurrent;
			if (input.conversation.channel !== "discord") return null;
			const targetSessionKey = input.targetSessionKey.trim();
			if (!targetSessionKey) return null;
			const conversationId = normalizeOptionalString(input.conversation.conversationId) ?? "";
			const placement = input.placement === "child" ? "child" : "current";
			const metadata = asOptionalObjectRecord(snapshotThreadBindingJson(input.metadata ? { ...input.metadata } : void 0)) ?? {};
			const targetKind = input.targetKind === "subagent" ? "subagent" : "acp";
			const label = normalizeOptionalString(metadata.label);
			const threadName = normalizeOptionalString(metadata.threadName);
			const introText = normalizeOptionalString(metadata.introText);
			const boundBy = normalizeOptionalString(metadata.boundBy);
			const agentId = normalizeOptionalString(metadata.agentId);
			let threadId;
			let channelId;
			let createThread = false;
			if (placement === "child") {
				createThread = true;
				channelId = normalizeDiscordBindingChannelId(input.conversation.parentConversationId) ?? void 0;
				if (!channelId && conversationId) channelId = await resolveChannelIdForBinding({
					cfg: params.resolveCurrentCfg(),
					accountId: params.accountId,
					token: params.resolveCurrentToken(),
					threadId: conversationId
				}) ?? void 0;
			} else threadId = conversationId || void 0;
			const bound = await params.manager.bindTarget({
				threadId,
				channelId,
				createThread,
				threadName,
				targetKind,
				targetSessionKey,
				agentId,
				label,
				boundBy,
				introText,
				metadata,
				...assertCurrent ? { assertCurrent } : {}
			});
			return bound ? serializeBinding(bound) : null;
		},
		listBySession: (targetSessionKey) => params.manager.listBySessionKey(targetSessionKey).map(serializeBinding),
		resolveByConversation: (ref) => {
			if (ref.channel !== "discord") return null;
			const binding = params.manager.getByThreadId(ref.conversationId);
			return binding ? serializeBinding(binding) : null;
		},
		touch: (bindingId, at) => {
			const threadId = resolveThreadBindingConversationIdFromBindingId({
				accountId: params.accountId,
				bindingId
			});
			if (threadId) params.manager.touchThreadSync({
				threadId,
				at,
				persist: true
			});
		},
		touchAsync: async (bindingId, at) => {
			const threadId = resolveThreadBindingConversationIdFromBindingId({
				accountId: params.accountId,
				bindingId
			});
			if (!threadId) return;
			await params.manager.touchThread({
				threadId,
				at,
				persist: true
			});
		},
		unbind: async (input) => {
			if (input.targetSessionKey?.trim()) return (await params.manager.unbindBySessionKey({
				targetSessionKey: input.targetSessionKey,
				reason: input.reason
			})).map(serializeBinding);
			const threadId = resolveThreadBindingConversationIdFromBindingId({
				accountId: params.accountId,
				bindingId: input.bindingId
			});
			if (!threadId) return [];
			const removed = await params.manager.unbindThread({
				threadId,
				reason: input.reason
			});
			return removed ? [serializeBinding(removed)] : [];
		}
	};
}
/** Disabled bindings have a live empty owner; retirement still makes that owner unavailable. */
function createNoopThreadBindingManager(accountIdRaw) {
	const accountId = normalizeAccountId(accountIdRaw);
	const adapter = {
		channel: "discord",
		accountId,
		capabilities: {
			bindSupported: false,
			unbindSupported: false,
			placements: []
		},
		listBySession: () => [],
		resolveByConversation: () => null
	};
	registerSessionBindingAdapter(adapter);
	return {
		accountId,
		isStopping: () => false,
		getIdleTimeoutMs: () => DEFAULT_THREAD_BINDING_IDLE_TIMEOUT_MS,
		getMaxAgeMs: () => 0,
		getByThreadId: () => void 0,
		getBySessionKey: () => void 0,
		listBySessionKey: () => [],
		listBindings: () => [],
		touchThread: async () => null,
		touchThreadSync: () => null,
		bindTarget: async () => null,
		unbindThread: async () => null,
		unbindBySessionKey: async () => [],
		notifyUnbound: () => {},
		stop: async () => unregisterSessionBindingAdapter({
			channel: "discord",
			accountId,
			adapter
		})
	};
}
//#endregion
//#region extensions/discord/src/monitor/thread-bindings.manager.ts
var thread_bindings_manager_exports = /* @__PURE__ */ __exportAll({
	createThreadBindingManager: () => createThreadBindingManager,
	getThreadBindingManager: () => getThreadBindingManager
});
function isDirectConversationBindingId(value) {
	const trimmed = normalizeOptionalString(value);
	return Boolean(trimmed && /^(user:|channel:)/i.test(trimmed));
}
async function createThreadBindingManager(input) {
	const params = { ...input };
	await ensureBindingsLoadedAsync();
	const manager = await runThreadBindingMutation(async () => createLoadedThreadBindingManager(params));
	if (manager.isStopping()) {
		await manager.stop();
		return await createThreadBindingManager(params);
	}
	return manager;
}
function createLoadedThreadBindingManager(params) {
	const accountId = normalizeAccountId(params.accountId);
	const existing = MANAGERS_BY_ACCOUNT_ID.get(accountId);
	if (existing) {
		rememberThreadBindingToken({
			accountId,
			token: params.token
		});
		return existing;
	}
	rememberThreadBindingToken({
		accountId,
		token: params.token
	});
	const persist = params.persist ?? shouldDefaultPersist();
	PERSIST_BY_ACCOUNT_ID.set(accountId, persist);
	const idleTimeoutMs = normalizeThreadBindingDurationMs(params.idleTimeoutMs, DEFAULT_THREAD_BINDING_IDLE_TIMEOUT_MS);
	const maxAgeMs = normalizeThreadBindingDurationMs(params.maxAgeMs, 0);
	const resolveCurrentCfg = () => getRuntimeConfigSnapshot() ?? params.cfg;
	const resolveCurrentToken = () => getThreadBindingToken(accountId) ?? params.token;
	const getCurrentBinding = (threadId) => MANAGERS_BY_ACCOUNT_ID.get(accountId) === manager ? manager.getByThreadId(threadId) : void 0;
	let stopping = false;
	let stopPromise;
	let sweepPromise;
	const assertManagerCurrent = () => {
		if (MANAGERS_BY_ACCOUNT_ID.get(accountId) !== manager) throw new Error("Discord thread binding manager was retired");
	};
	const runOwnedMutation = (operation) => {
		if (stopping) return Promise.reject(/* @__PURE__ */ new Error("Discord thread binding manager is stopping"));
		return runThreadBindingAccountOperation([manager], async () => {
			assertManagerCurrent();
			return await operation();
		});
	};
	const mutate = (operation) => runOwnedMutation(() => runThreadBindingMutation(async () => {
		assertManagerCurrent();
		return await operation();
	}));
	let sweepTimer = null;
	const runSweepOnce = async () => {
		const bindings = manager.listBindings();
		if (bindings.length === 0) return;
		let rest = null;
		for (const snapshotBinding of bindings) {
			const binding = getCurrentBinding(snapshotBinding.threadId);
			if (!binding || stopping) continue;
			const now = Date.now();
			const lifecycle = resolvePreparedThreadBindingLifecycle({
				record: binding,
				idleTimeoutMs,
				maxAgeMs
			});
			const { expiresAt, reason } = lifecycle;
			if (expiresAt != null && reason && now >= expiresAt) {
				await manager.unbindThread({
					threadId: binding.threadId,
					expected: binding,
					reason,
					sendFarewell: true,
					farewellText: resolveThreadBindingFarewellText({
						reason,
						idleTimeoutMs: lifecycle.idleTimeoutMs,
						maxAgeMs: lifecycle.maxAgeMs
					})
				});
				continue;
			}
			if (isDirectConversationBindingId(binding.threadId)) continue;
			if (!rest) try {
				const cfg = resolveCurrentCfg();
				rest = createDiscordRestClient({
					cfg,
					accountId,
					token: resolveCurrentToken()
				}).rest;
			} catch {
				return;
			}
			try {
				const channel = await getChannel(rest, binding.threadId);
				if (getCurrentBinding(binding.threadId) !== binding) continue;
				if (!channel || typeof channel !== "object") {
					logVerbose(`discord thread binding sweep probe returned invalid payload for ${binding.threadId}`);
					continue;
				}
				if (isThreadArchived(channel)) await manager.unbindThread({
					threadId: binding.threadId,
					expected: binding,
					reason: "thread-archived",
					sendFarewell: true
				});
			} catch (err) {
				if (getCurrentBinding(binding.threadId) !== binding) continue;
				if (isDiscordThreadGoneError(err)) {
					logVerbose(`discord thread binding sweep removing stale binding ${binding.threadId}: ${summarizeDiscordError(err)}`);
					await manager.unbindThread({
						threadId: binding.threadId,
						expected: binding,
						reason: "thread-delete",
						sendFarewell: false
					});
					continue;
				}
				logVerbose(`discord thread binding sweep probe failed for ${binding.threadId}: ${summarizeDiscordError(err)}`);
			}
		}
	};
	const unbindThread = async (unbindParams) => {
		const bindingKey = resolveBindingRecordKey({
			accountId,
			threadId: unbindParams.threadId
		});
		if (!bindingKey) return null;
		const existingLocal = BINDINGS_BY_THREAD_ID.get(bindingKey);
		if (!existingLocal || existingLocal.accountId !== accountId || unbindParams.expected && existingLocal !== unbindParams.expected) return null;
		await commitBindingRecord({
			bindingKey,
			previous: existingLocal,
			next: null,
			persist: unbindParams.persist ?? persist,
			assertCurrent: assertManagerCurrent
		});
		const removed = existingLocal;
		manager.notifyUnbound(removed, unbindParams);
		return removed;
	};
	const manager = {
		accountId,
		isStopping: () => stopping,
		notifyUnbound: (removed, notification) => {
			refreshUnboundThreadWebhookIdentity(removed);
			if (notification.sendFarewell !== false) {
				const cfg = resolveCurrentCfg();
				const farewell = resolveThreadBindingFarewellText({
					reason: notification.reason,
					farewellText: notification.farewellText,
					idleTimeoutMs: resolveThreadBindingIdleTimeoutMs$1({
						record: removed,
						defaultIdleTimeoutMs: idleTimeoutMs
					}),
					maxAgeMs: resolveThreadBindingMaxAgeMs$1({
						record: removed,
						defaultMaxAgeMs: maxAgeMs
					})
				});
				if (cfg) maybeSendBindingMessage({
					cfg,
					record: removed,
					text: farewell,
					preferWebhook: false
				});
			}
		},
		getIdleTimeoutMs: () => idleTimeoutMs,
		getMaxAgeMs: () => maxAgeMs,
		getByThreadId: (threadId) => {
			const key = resolveBindingRecordKey({
				accountId,
				threadId
			});
			if (!key) return;
			const entry = BINDINGS_BY_THREAD_ID.get(key);
			if (!entry || entry.accountId !== accountId) return;
			return entry;
		},
		getBySessionKey: (targetSessionKey) => {
			return manager.listBySessionKey(targetSessionKey)[0];
		},
		listBySessionKey: (targetSessionKey) => {
			return resolveBindingIdsForSession({
				targetSessionKey,
				accountId
			}).map((bindingKey) => BINDINGS_BY_THREAD_ID.get(bindingKey)).filter((entry) => Boolean(entry));
		},
		listBindings: () => [...BINDINGS_BY_THREAD_ID.values()].filter((entry) => entry.accountId === accountId),
		touchThreadSync: (input) => {
			assertManagerCurrent();
			if (stopping) throw new Error("Discord thread binding manager is stopping");
			const key = resolveBindingRecordKey({
				accountId,
				threadId: input.threadId
			});
			if (!key) return null;
			const at = typeof input.at === "number" && Number.isFinite(input.at) ? Math.max(0, Math.floor(input.at)) : Date.now();
			return updateBindingRecordSync({
				bindingKey: key,
				transform: (record) => ({
					...record,
					lastActivityAt: Math.max(record.lastActivityAt || 0, at)
				}),
				persist: (input.persist ?? persist) && shouldPersistAnyBindingState(),
				minIntervalMs: THREAD_BINDING_TOUCH_PERSIST_MIN_INTERVAL_MS
			});
		},
		touchThread: (input) => {
			const touchParams = {
				...input,
				at: typeof input.at === "number" && Number.isFinite(input.at) ? Math.max(0, Math.floor(input.at)) : Date.now()
			};
			return mutate(async () => {
				const key = resolveBindingRecordKey({
					accountId,
					threadId: touchParams.threadId
				});
				if (!key) return null;
				const existingResult = BINDINGS_BY_THREAD_ID.get(key);
				if (!existingResult || existingResult.accountId !== accountId) return null;
				const nextRecord = {
					...existingResult,
					lastActivityAt: Math.max(existingResult.lastActivityAt || 0, touchParams.at)
				};
				await commitBindingRecord({
					bindingKey: key,
					previous: existingResult,
					next: nextRecord,
					persist: (touchParams.persist ?? persist) && shouldPersistAnyBindingState(),
					minIntervalMs: THREAD_BINDING_TOUCH_PERSIST_MIN_INTERVAL_MS,
					assertCurrent: assertManagerCurrent
				});
				return nextRecord;
			});
		},
		bindTarget: async (input) => {
			const bindParams = {
				...input,
				metadata: asOptionalObjectRecord(snapshotThreadBindingJson(input.metadata ? { ...input.metadata } : void 0))
			};
			return runOwnedMutation(async () => {
				const assertCurrent = bindParams.assertCurrent;
				assertCurrent?.();
				const cfg = resolveCurrentCfg();
				let threadId = normalizeOptionalStringifiedId(bindParams.threadId);
				let channelId = normalizeOptionalString(bindParams.channelId) ?? "";
				const directConversationBinding = isDirectConversationBindingId(threadId) || isDirectConversationBindingId(channelId);
				let nativeBindingCreated = false;
				const targetSessionKey = normalizeOptionalString(bindParams.targetSessionKey) ?? "";
				if (!targetSessionKey) return null;
				const targetKind = normalizeTargetKind(bindParams.targetKind, targetSessionKey);
				let agentId = normalizeOptionalString(bindParams.agentId);
				if (!threadId && bindParams.createThread) {
					if (!channelId) return null;
					agentId ??= resolveSessionAgentIdStrict({
						config: cfg,
						sessionKey: targetSessionKey
					});
					const threadName = resolveThreadBindingThreadName({
						agentId: bindParams.agentId,
						label: bindParams.label
					});
					threadId = await createThreadForBinding({
						cfg,
						accountId,
						token: resolveCurrentToken(),
						channelId,
						threadName: normalizeOptionalString(bindParams.threadName) ?? threadName,
						...assertCurrent ? { assertCreateAllowed: assertCurrent } : {}
					}) ?? void 0;
					nativeBindingCreated = Boolean(threadId);
				}
				if (!threadId) return null;
				if (!channelId && directConversationBinding) channelId = threadId;
				if (!channelId) channelId = await resolveChannelIdForBinding({
					cfg,
					accountId,
					token: resolveCurrentToken(),
					threadId,
					channelId: bindParams.channelId
				}) ?? "";
				if (!channelId) return null;
				const existingValue = manager.getByThreadId(threadId);
				const previous = existingValue?.targetSessionKey === targetSessionKey && existingValue.targetKind === targetKind ? existingValue : void 0;
				agentId ??= normalizeOptionalString(previous?.agentId) ?? resolveSessionAgentIdStrict({
					config: cfg,
					sessionKey: targetSessionKey
				});
				let webhookId = normalizeOptionalString(bindParams.webhookId) ?? normalizeOptionalString(existingValue?.webhookId) ?? "";
				let webhookToken = normalizeOptionalString(bindParams.webhookToken) ?? normalizeOptionalString(existingValue?.webhookToken) ?? "";
				if (!directConversationBinding && (!webhookId || !webhookToken)) {
					const cachedWebhook = findReusableWebhook({
						accountId,
						channelId
					});
					webhookId = cachedWebhook.webhookId ?? "";
					webhookToken = cachedWebhook.webhookToken ?? "";
				}
				if (!directConversationBinding && (!webhookId || !webhookToken)) {
					const createdWebhook = await createWebhookForChannel({
						cfg,
						accountId,
						token: resolveCurrentToken(),
						channelId,
						...assertCurrent ? { assertCreateAllowed: assertCurrent } : {}
					});
					webhookId = createdWebhook.webhookId ?? "";
					webhookToken = createdWebhook.webhookToken ?? "";
					nativeBindingCreated ||= Boolean(webhookId && webhookToken);
				}
				const now = Date.now();
				const record = {
					accountId,
					channelId,
					threadId,
					targetKind,
					targetSessionKey,
					agentId,
					label: normalizeOptionalString(bindParams.label) ?? normalizeOptionalString(previous?.label),
					webhookId: webhookId || void 0,
					webhookToken: webhookToken || void 0,
					boundBy: normalizeOptionalString(bindParams.boundBy) ?? normalizeOptionalString(previous?.boundBy) ?? "system",
					boundAt: now,
					lastActivityAt: now,
					idleTimeoutMs: typeof existingValue?.idleTimeoutMs === "number" ? existingValue.idleTimeoutMs : idleTimeoutMs,
					maxAgeMs: typeof existingValue?.maxAgeMs === "number" ? existingValue.maxAgeMs : maxAgeMs,
					metadata: {
						...previous?.metadata,
						...bindParams.metadata
					}
				};
				if (!nativeBindingCreated) assertCurrent?.();
				await runThreadBindingMutation(() => commitBindingRecord({
					bindingKey: toBindingRecordKey({
						accountId,
						threadId
					}),
					previous: existingValue,
					next: record,
					persist,
					assertCurrent: () => {
						assertManagerCurrent();
						if (!nativeBindingCreated) assertCurrent?.();
					}
				}));
				const introText = bindParams.introText?.trim();
				if (introText && cfg) maybeSendBindingMessage({
					cfg,
					record,
					text: introText,
					assertCurrent: () => {
						assertCurrent?.();
						const current = getCurrentBinding(record.threadId);
						if (!current || current.targetSessionKey !== record.targetSessionKey || current.targetKind !== record.targetKind) throw new Error("Discord thread binding changed before its intro");
					}
				});
				return record;
			});
		},
		unbindThread: (input) => {
			const unbindParams = { ...input };
			return mutate(() => unbindThread(unbindParams));
		},
		unbindBySessionKey: (input) => {
			const unbindParams = { ...input };
			return mutate(async () => {
				const ids = resolveBindingIdsForSession({
					targetSessionKey: unbindParams.targetSessionKey,
					accountId,
					targetKind: unbindParams.targetKind
				});
				if (ids.length === 0) return [];
				const removed = [];
				for (const bindingKey of ids) {
					const binding = BINDINGS_BY_THREAD_ID.get(bindingKey);
					if (!binding) continue;
					const entry = await unbindThread({
						threadId: binding.threadId,
						reason: unbindParams.reason,
						sendFarewell: unbindParams.sendFarewell,
						farewellText: unbindParams.farewellText
					});
					if (entry) removed.push(entry);
				}
				return removed;
			});
		},
		stop: () => {
			if (stopPromise) return stopPromise;
			stopping = true;
			if (sweepTimer) {
				clearInterval(sweepTimer);
				sweepTimer = null;
			}
			stopPromise = (async () => {
				await sweepPromise;
				await drainThreadBindingAccountOperations(manager);
				await drainThreadBindingMutations();
				if (MANAGERS_BY_ACCOUNT_ID.get(accountId) === manager) {
					MANAGERS_BY_ACCOUNT_ID.delete(accountId);
					forgetThreadBindingToken(accountId);
				}
				unregisterSessionBindingAdapter({
					channel: "discord",
					accountId,
					adapter: sessionBindingAdapter
				});
			})();
			return stopPromise;
		}
	};
	if (params.enableSweeper !== false) {
		sweepTimer = setInterval(() => {
			if (stopping || sweepPromise) return;
			sweepPromise = runSweepOnce().catch((error) => {
				logVerbose(`discord thread binding sweep failed: ${String(error)}`);
			}).finally(() => {
				sweepPromise = void 0;
			});
		}, THREAD_BINDINGS_SWEEP_INTERVAL_MS);
		if (!(process.env.VITEST || false)) sweepTimer.unref?.();
	}
	const sessionBindingAdapter = createThreadBindingSessionAdapter({
		accountId,
		manager,
		defaults: {
			idleTimeoutMs,
			maxAgeMs
		},
		resolveCurrentCfg,
		resolveCurrentToken
	});
	registerSessionBindingAdapter(sessionBindingAdapter);
	MANAGERS_BY_ACCOUNT_ID.set(accountId, manager);
	return manager;
}
function getThreadBindingManager(accountId) {
	const normalized = normalizeAccountId(accountId);
	return MANAGERS_BY_ACCOUNT_ID.get(normalized) ?? null;
}
//#endregion
export { isThreadArchived as a, resolveThreadBindingPersonaFromRecord as c, createNoopThreadBindingManager as i, getThreadBindingManager as n, resolveChannelIdForBinding as o, thread_bindings_manager_exports as r, resolveThreadBindingPersona as s, createThreadBindingManager as t };
