import { A as serializePayload, C as withDiscordRequestAuthority, Ut as __exportAll, ft as editChannelMessage, st as createChannelMessage } from "./discord-BXpHW-cu.mjs";
import { d as buildDiscordComponentMessage, f as buildDiscordComponentMessageFlags, g as resolveDiscordComponentAttachmentName } from "./components-yBEb75bB.mjs";
import { n as getOptionalDiscordRuntime } from "./runtime-DgnVQ7zW.mjs";
import { l as createDiscordSendResult } from "./retry-BEYkDy0P.mjs";
import { E as SUPPRESS_NOTIFICATIONS_FLAG, K as parseAndResolveChannelRecipient, N as createDiscordClient, O as createDiscordMessageNonce, l as resolveChannelId, t as buildDiscordSendError, u as resolveDiscordChannel } from "./send.shared-VNvWfX2T.mjs";
import { t as sendMessageDiscord } from "./send.outbound-QTyuFupn.mjs";
import { ChannelType } from "discord-api-types/v10";
import { asDateTimestampMs, isFutureDateTimestampMs, resolveDateTimestampMs, resolveExpiresAtMsFromDurationMs } from "openclaw/plugin-sdk/number-runtime";
import { resolveGlobalSingleton } from "openclaw/plugin-sdk/global-singleton";
import { hasNonEmptyString, uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
import { recordChannelActivity } from "openclaw/plugin-sdk/channel-activity-runtime";
import { extensionForMime } from "openclaw/plugin-sdk/media-mime";
import { loadOutboundMediaFromUrl } from "openclaw/plugin-sdk/outbound-media";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
import { createPluginStateErrorReporter } from "openclaw/plugin-sdk/plugin-state-runtime";
import { createAsyncLock } from "openclaw/plugin-sdk/async-lock-runtime";
//#region extensions/discord/src/components-registry-state.ts
const discordComponentRegistryState = resolveGlobalSingleton(Symbol.for("openclaw.discord.componentRegistryState"), () => ({
	withRegistryLock: createAsyncLock(),
	componentEntries: /* @__PURE__ */ new Map(),
	modalEntries: /* @__PURE__ */ new Map(),
	persistentComponentStore: void 0,
	persistentModalStore: void 0,
	persistentRegistryDisabled: false
}), (state) => state.withRegistryLock(async () => {
	state.componentEntries.clear();
	state.modalEntries.clear();
	state.persistentComponentStore = void 0;
	state.persistentModalStore = void 0;
	state.persistentRegistryDisabled = false;
}));
//#endregion
//#region extensions/discord/src/components-registry.ts
const DEFAULT_COMPONENT_TTL_MS = 18e5;
const PERSISTENT_COMPONENT_NAMESPACE = "discord.components";
const PERSISTENT_MODAL_NAMESPACE = "discord.modals";
const PERSISTENT_COMPONENT_MAX_ENTRIES = 500;
const PERSISTENT_MODAL_MAX_ENTRIES = 500;
function getComponentEntries() {
	return discordComponentRegistryState.componentEntries;
}
function getModalEntries() {
	return discordComponentRegistryState.modalEntries;
}
function formatRegistryError(error) {
	if (!(error instanceof Error)) return { error: formatRegistryErrorValue(error) };
	const details = {
		error: String(error),
		errorName: error.name,
		errorMessage: error.message
	};
	if (error.stack) details.errorStack = error.stack;
	const cause = error.cause;
	if (cause instanceof Error) {
		details.errorCause = String(cause);
		details.errorCauseName = cause.name;
		details.errorCauseMessage = cause.message;
		if (cause.stack) details.errorCauseStack = cause.stack;
	} else if (cause !== void 0) details.errorCause = formatRegistryErrorValue(cause);
	return details;
}
const reportPersistentComponentRegistryError = createPluginStateErrorReporter(getOptionalDiscordRuntime, "discord", "component-registry-state", "Discord persistent component registry state failed", formatRegistryError);
function formatRegistryErrorValue(value) {
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint" || typeof value === "symbol") return String(value);
	if (value === null) return "null";
	try {
		return JSON.stringify(value) ?? Object.prototype.toString.call(value);
	} catch {
		return Object.prototype.toString.call(value);
	}
}
function disablePersistentComponentRegistry(error) {
	discordComponentRegistryState.persistentRegistryDisabled = true;
	discordComponentRegistryState.persistentComponentStore = void 0;
	discordComponentRegistryState.persistentModalStore = void 0;
	reportPersistentComponentRegistryError(error);
}
function getPersistentComponentStore() {
	if (discordComponentRegistryState.persistentRegistryDisabled) return;
	if (discordComponentRegistryState.persistentComponentStore) return discordComponentRegistryState.persistentComponentStore;
	const runtime = getOptionalDiscordRuntime();
	if (!runtime) return;
	try {
		discordComponentRegistryState.persistentComponentStore = runtime.state.openKeyedStore({
			namespace: PERSISTENT_COMPONENT_NAMESPACE,
			maxEntries: PERSISTENT_COMPONENT_MAX_ENTRIES,
			defaultTtlMs: DEFAULT_COMPONENT_TTL_MS
		});
		return discordComponentRegistryState.persistentComponentStore;
	} catch (error) {
		disablePersistentComponentRegistry(error);
		return;
	}
}
function getPersistentModalStore() {
	if (discordComponentRegistryState.persistentRegistryDisabled) return;
	if (discordComponentRegistryState.persistentModalStore) return discordComponentRegistryState.persistentModalStore;
	const runtime = getOptionalDiscordRuntime();
	if (!runtime) return;
	try {
		discordComponentRegistryState.persistentModalStore = runtime.state.openKeyedStore({
			namespace: PERSISTENT_MODAL_NAMESPACE,
			maxEntries: PERSISTENT_MODAL_MAX_ENTRIES,
			defaultTtlMs: DEFAULT_COMPONENT_TTL_MS
		});
		return discordComponentRegistryState.persistentModalStore;
	} catch (error) {
		disablePersistentComponentRegistry(error);
		return;
	}
}
function isExpired(entry, now) {
	return entry.expiresAt !== void 0 && !isFutureDateTimestampMs(entry.expiresAt, { nowMs: now });
}
function normalizeEntryTimestamps(entry, now, ttlMs) {
	const createdAt = resolveDateTimestampMs(entry.createdAt, now);
	const expiresAt = asDateTimestampMs(entry.expiresAt) ?? resolveExpiresAtMsFromDurationMs(ttlMs, { nowMs: createdAt }) ?? 0;
	return {
		...entry,
		createdAt,
		expiresAt
	};
}
function pruneUndefinedRegistryValues(value) {
	if (Array.isArray(value)) return value.filter((entry) => entry !== void 0).map((entry) => pruneUndefinedRegistryValues(entry));
	if (!value || typeof value !== "object") return value;
	const result = {};
	for (const [key, entry] of Object.entries(value)) {
		if (entry === void 0) continue;
		result[key] = pruneUndefinedRegistryValues(entry);
	}
	return result;
}
function normalizeRegistryEntries(entries, params) {
	const normalizedEntries = [];
	for (const entry of entries) {
		const normalized = normalizeEntryTimestamps({
			...entry,
			messageId: params.messageId ?? entry.messageId
		}, params.now, params.ttlMs);
		normalizedEntries.push(normalized);
	}
	return normalizedEntries;
}
function resolveEntry(store, params) {
	const entry = store.get(params.id);
	if (!entry) return null;
	if (isExpired(entry, Date.now())) {
		store.delete(params.id);
		return null;
	}
	if (params.consume !== false) store.delete(params.id);
	return entry;
}
function readPersistedRegistryEntry(persisted) {
	if (persisted?.version !== 1 || typeof persisted.entry?.id !== "string") return null;
	return persisted.entry;
}
async function registerPersistentRegistryEntries(params) {
	if (params.entries.length === 0) return;
	const store = params.openStore();
	if (!store) return;
	await Promise.all(params.entries.map(async (entry) => {
		try {
			const persistedEntry = pruneUndefinedRegistryValues(entry);
			await store.register(entry.id, {
				version: 1,
				entry: persistedEntry
			}, { ttlMs: params.ttlMs });
		} catch (error) {
			disablePersistentComponentRegistry(error);
		}
	}));
}
async function registerPersistentEntries(params) {
	await Promise.all([registerPersistentRegistryEntries({
		entries: params.entries,
		ttlMs: params.ttlMs,
		openStore: getPersistentComponentStore
	}), registerPersistentRegistryEntries({
		entries: params.modals,
		ttlMs: params.ttlMs,
		openStore: getPersistentModalStore
	})]);
}
async function deletePersistentEntry(params) {
	const store = params.openStore();
	if (!store) return;
	try {
		await store.delete(params.id);
	} catch (error) {
		disablePersistentComponentRegistry(error);
	}
}
function resolveComponentConsumptionIds(entry) {
	if (!entry.consumptionGroupId) return [entry.id];
	const ids = entry.consumptionGroupEntryIds?.filter((id) => typeof id === "string" && id) ?? [];
	return ids.length > 0 ? uniqueStrings(ids) : [entry.id];
}
function deleteComponentConsumptionGroup(entry) {
	const store = getComponentEntries();
	for (const id of resolveComponentConsumptionIds(entry)) store.delete(id);
}
async function deletePersistentComponentConsumptionGroup(entry) {
	await Promise.all(resolveComponentConsumptionIds(entry).map((id) => deletePersistentEntry({
		id,
		openStore: getPersistentComponentStore
	})));
}
async function resolvePersistentRegistryEntry(params) {
	const store = params.openStore();
	if (!store) return null;
	try {
		return readPersistedRegistryEntry(params.consume === false ? await store.lookup(params.id) : await store.consume(params.id));
	} catch (error) {
		disablePersistentComponentRegistry(error);
		return null;
	}
}
function registerDiscordComponentEntries(params) {
	const now = Date.now();
	const ttlMs = params.ttlMs ?? DEFAULT_COMPONENT_TTL_MS;
	const normalizedEntries = normalizeRegistryEntries(params.entries, {
		now,
		ttlMs,
		messageId: params.messageId
	});
	const normalizedModals = normalizeRegistryEntries(params.modals, {
		now,
		ttlMs,
		messageId: params.messageId
	});
	return discordComponentRegistryState.withRegistryLock(async () => {
		for (const entry of normalizedEntries) getComponentEntries().set(entry.id, entry);
		for (const entry of normalizedModals) getModalEntries().set(entry.id, entry);
		await registerPersistentEntries({
			entries: normalizedEntries,
			modals: normalizedModals,
			ttlMs
		});
	});
}
function resolveDiscordComponentEntry(params) {
	const entry = resolveEntry(getComponentEntries(), params);
	if (entry && params.consume !== false) deleteComponentConsumptionGroup(entry);
	return entry;
}
async function resolveDiscordComponentEntryWithPersistence(params) {
	return discordComponentRegistryState.withRegistryLock(async () => {
		const inMemory = resolveDiscordComponentEntry(params);
		if (inMemory) {
			if (params.consume !== false) await deletePersistentComponentConsumptionGroup(inMemory);
			return inMemory;
		}
		const persisted = await resolvePersistentRegistryEntry({
			...params,
			openStore: getPersistentComponentStore
		});
		if (persisted && params.consume !== false) await deletePersistentComponentConsumptionGroup(persisted);
		return persisted;
	});
}
function resolveDiscordModalEntry(params) {
	return resolveEntry(getModalEntries(), params);
}
async function resolveDiscordModalEntryWithPersistence(params) {
	return discordComponentRegistryState.withRegistryLock(async () => {
		const inMemory = resolveDiscordModalEntry(params);
		if (inMemory) {
			if (params.consume !== false) await deletePersistentEntry({
				...params,
				openStore: getPersistentModalStore
			});
			return inMemory;
		}
		return await resolvePersistentRegistryEntry({
			...params,
			openStore: getPersistentModalStore
		});
	});
}
//#endregion
//#region extensions/discord/src/send.components.ts
var send_components_exports = /* @__PURE__ */ __exportAll({
	editDiscordComponentMessage: () => editDiscordComponentMessage,
	registerBuiltDiscordComponentMessage: () => registerBuiltDiscordComponentMessage,
	sendDiscordComponentMessage: () => sendDiscordComponentMessage
});
const DISCORD_FORUM_LIKE_TYPES = /* @__PURE__ */ new Set([ChannelType.GuildForum, ChannelType.GuildMedia]);
function extractComponentAttachmentNames(spec) {
	const names = [];
	for (const block of spec.blocks ?? []) if (block.type === "file") names.push(resolveDiscordComponentAttachmentName(block.file));
	return names;
}
function hasComponentAttachmentBlock(spec) {
	return (spec.blocks ?? []).some((block) => block.type === "file");
}
function withImplicitComponentAttachmentBlock(spec, attachmentName) {
	if (!attachmentName || hasComponentAttachmentBlock(spec)) return spec;
	return {
		...spec,
		blocks: [...spec.blocks ?? [], {
			type: "file",
			file: `attachment://${attachmentName}`
		}]
	};
}
function resolveClassicDiscordMessage(spec) {
	if (spec.modal || spec.container) return;
	const parts = hasNonEmptyString(spec.text) ? [spec.text] : [];
	let captionToMatch = parts[0];
	let filename;
	for (const block of spec.blocks ?? []) if (block.type === "text") {
		if (!hasNonEmptyString(block.text)) continue;
		if (block.text !== captionToMatch) parts.push(block.text);
		captionToMatch = void 0;
	} else if (block.type === "file" && !block.spoiler && filename === void 0) filename = resolveDiscordComponentAttachmentName(block.file);
	else return;
	return {
		text: parts.join("\n\n"),
		filename
	};
}
function registerBuiltDiscordComponentMessage(params) {
	return registerDiscordComponentEntries({
		entries: params.buildResult.entries,
		modals: params.buildResult.modals,
		messageId: params.messageId,
		ttlMs: params.ttlMs
	});
}
function resolveDiscordComponentRegistryTtlMs(accountConfig) {
	const ttlMs = accountConfig?.agentComponents?.ttlMs;
	return typeof ttlMs === "number" && Number.isFinite(ttlMs) && ttlMs > 0 ? Math.floor(ttlMs) : void 0;
}
async function buildDiscordComponentPayload(params) {
	const messageReference = params.opts.reply ? {
		message_id: params.opts.reply.messageId,
		fail_if_not_exists: false
	} : void 0;
	let spec = params.spec;
	let resolvedFileName;
	let files;
	if (params.opts.mediaUrl) {
		const media = await loadOutboundMediaFromUrl(params.opts.mediaUrl, {
			mediaAccess: params.opts.mediaAccess,
			mediaLocalRoots: params.opts.mediaLocalRoots,
			mediaReadFile: params.opts.mediaReadFile
		});
		const filenameOverride = params.opts.filename?.trim();
		const explicitAttachmentName = extractComponentAttachmentNames(spec)[0];
		resolvedFileName = filenameOverride || explicitAttachmentName || media.fileName || `upload${extensionForMime(media.contentType) ?? ""}`;
		spec = withImplicitComponentAttachmentBlock(spec, resolvedFileName);
		files = [{
			data: media.buffer,
			name: resolvedFileName,
			contentType: media.contentType
		}];
	}
	const attachmentNames = extractComponentAttachmentNames(spec);
	const uniqueAttachmentNames = uniqueStrings(attachmentNames);
	if (uniqueAttachmentNames.length > 1) throw new Error("Discord component attachments currently support a single file. Use media-gallery for multiple files.");
	const expectedAttachmentName = uniqueAttachmentNames[0];
	if (expectedAttachmentName && resolvedFileName && expectedAttachmentName !== resolvedFileName) throw new Error(`Component file block expects attachment "${expectedAttachmentName}", but the uploaded file is "${resolvedFileName}". Update components.blocks[].file or provide a matching filename.`);
	if (!params.opts.mediaUrl && expectedAttachmentName) throw new Error("Discord component file blocks require a media attachment (media/path/filePath).");
	const buildResult = buildDiscordComponentMessage({
		spec,
		sessionKey: params.opts.sessionKey,
		agentId: params.opts.agentId,
		accountId: params.accountId
	});
	const flags = buildDiscordComponentMessageFlags(buildResult.components);
	const finalFlags = params.opts.silent ? (flags ?? 0) | SUPPRESS_NOTIFICATIONS_FLAG : flags ?? void 0;
	const payload = {
		components: buildResult.components,
		allowed_mentions: params.opts.allowedMentions,
		...finalFlags ? { flags: finalFlags } : {},
		...files ? { files } : {}
	};
	return {
		body: {
			...serializePayload(payload),
			...messageReference ? { message_reference: messageReference } : {}
		},
		buildResult
	};
}
async function sendDiscordComponentMessage(to, spec, opts) {
	return await withDiscordRequestAuthority(opts.assertPlatformSendAuthorized, () => sendDiscordComponentMessageInternal(to, spec, opts));
}
async function sendDiscordComponentMessageInternal(to, spec, opts) {
	const classicMessage = opts.mediaUrl ? resolveClassicDiscordMessage(spec) : void 0;
	if (classicMessage) return await sendMessageDiscord(to, classicMessage.text, {
		cfg: opts.cfg,
		accountId: opts.accountId,
		token: opts.token,
		rest: opts.rest,
		mediaUrl: opts.mediaUrl,
		filename: opts.filename?.trim() || classicMessage.filename,
		mediaLocalRoots: opts.mediaLocalRoots,
		mediaReadFile: opts.mediaReadFile,
		mediaAccess: opts.mediaAccess,
		reply: opts.reply,
		silent: opts.silent,
		textLimit: opts.textLimit,
		maxLinesPerMessage: opts.maxLinesPerMessage,
		tableMode: opts.tableMode,
		chunkMode: opts.chunkMode,
		onDeliveryResult: opts.onDeliveryResult,
		onPlatformSendDispatch: opts.onPlatformSendDispatch,
		assertPlatformSendAuthorized: opts.assertPlatformSendAuthorized,
		...opts.suppressEmbeds === void 0 ? {} : { suppressEmbeds: opts.suppressEmbeds }
	});
	const cfg = requireRuntimeConfig(opts.cfg, "Discord component send");
	const { token, rest, request, account: accountInfo } = createDiscordClient({
		...opts,
		cfg
	});
	const recipient = await parseAndResolveChannelRecipient(to, cfg, accountInfo.accountId);
	const { channelId } = await resolveChannelId(rest, recipient, request);
	const channel = await resolveDiscordChannel(rest, channelId);
	if (channel && DISCORD_FORUM_LIKE_TYPES.has(channel.type)) throw new Error("Discord components are not supported in forum-style channels");
	const { body: componentBody, buildResult } = await buildDiscordComponentPayload({
		spec,
		opts,
		accountId: accountInfo.accountId
	});
	const body = {
		...componentBody,
		nonce: createDiscordMessageNonce(),
		enforce_nonce: true
	};
	let result;
	try {
		result = await request(async () => {
			await opts.onPlatformSendDispatch?.();
			opts.assertPlatformSendAuthorized?.();
			return createChannelMessage(rest, channelId, { body });
		}, "components", { safety: "nonce-protected-create" });
	} catch (err) {
		throw await buildDiscordSendError(err, {
			channelId,
			cfg,
			rest,
			token,
			hasMedia: Boolean(opts.mediaUrl)
		});
	}
	const deliveryResult = createDiscordSendResult({
		result,
		fallbackChannelId: channelId,
		kind: "card",
		...opts.reply ? { reply: opts.reply } : {}
	});
	await opts.onDeliveryResult?.(deliveryResult);
	await registerBuiltDiscordComponentMessage({
		buildResult,
		messageId: result.id,
		ttlMs: resolveDiscordComponentRegistryTtlMs(accountInfo.config)
	});
	recordChannelActivity({
		channel: "discord",
		accountId: accountInfo.accountId,
		direction: "outbound"
	});
	return deliveryResult;
}
async function editDiscordComponentMessage(to, messageId, spec, opts) {
	const cfg = requireRuntimeConfig(opts.cfg, "Discord component edit");
	const { token, rest, request, account: accountInfo } = createDiscordClient({
		...opts,
		cfg
	});
	const recipient = await parseAndResolveChannelRecipient(to, cfg, accountInfo.accountId);
	const { channelId } = await resolveChannelId(rest, recipient, request);
	const { body, buildResult } = await buildDiscordComponentPayload({
		spec,
		opts,
		accountId: accountInfo.accountId
	});
	let result;
	try {
		result = await request(() => editChannelMessage(rest, channelId, messageId, { body }), "components");
	} catch (err) {
		throw await buildDiscordSendError(err, {
			channelId,
			cfg,
			rest,
			token,
			hasMedia: Boolean(opts.mediaUrl)
		});
	}
	await registerBuiltDiscordComponentMessage({
		buildResult,
		messageId: result.id ?? messageId,
		ttlMs: resolveDiscordComponentRegistryTtlMs(accountInfo.config)
	});
	recordChannelActivity({
		channel: "discord",
		accountId: accountInfo.accountId,
		direction: "outbound"
	});
	return createDiscordSendResult({
		result: {
			id: result.id ?? messageId,
			channel_id: result.channel_id
		},
		fallbackChannelId: channelId,
		kind: "card",
		...opts.reply ? { reply: opts.reply } : {}
	});
}
//#endregion
export { registerDiscordComponentEntries as a, send_components_exports as i, registerBuiltDiscordComponentMessage as n, resolveDiscordComponentEntryWithPersistence as o, sendDiscordComponentMessage as r, resolveDiscordModalEntryWithPersistence as s, editDiscordComponentMessage as t };
