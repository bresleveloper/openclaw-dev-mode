import { t as __exportAll } from "./rolldown-runtime-nwUcYXjP.mjs";
import { u as createDiscordClient } from "./send.permissions-BvH_Dr8p.mjs";
import { D as editChannelMessage, f as serializePayload, q as withDiscordRequestAuthority, w as createChannelMessage } from "./discord-cXPUdHQi.mjs";
import { r as createDiscordSendResult } from "./send.receipt-CZ7ks6g7.mjs";
import { _ as SUPPRESS_NOTIFICATIONS_FLAG, c as resolveChannelId, l as resolveDiscordChannel, t as buildDiscordSendError, y as createDiscordMessageNonce } from "./send.shared-D2lh737v.mjs";
import { t as parseAndResolveDiscordTarget } from "./target-resolver-48znkzky.mjs";
import { t as sendMessageDiscord } from "./send.outbound-cQ4Ohmsc.mjs";
import { a as buildDiscordComponentMessage, u as resolveDiscordComponentAttachmentName } from "./components-GePlato3.mjs";
import { n as getOptionalDiscordRuntime } from "./runtime-DcBvHOm1.mjs";
import { hasNonEmptyString, uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
import { ChannelType } from "discord-api-types/v10";
import { loadOutboundMediaFromUrl } from "openclaw/plugin-sdk/outbound-media";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
import { asDateTimestampMs, isFutureDateTimestampMs, resolveDateTimestampMs, resolveExpiresAtMsFromDurationMs } from "openclaw/plugin-sdk/number-runtime";
import { resolveGlobalSingleton } from "openclaw/plugin-sdk/global-singleton";
import { recordChannelActivity } from "openclaw/plugin-sdk/channel-activity-runtime";
import { extensionForMime } from "openclaw/plugin-sdk/media-mime";
import { createPluginStateErrorReporter } from "openclaw/plugin-sdk/plugin-state-runtime";
import { createAsyncLock } from "openclaw/plugin-sdk/async-lock-runtime";
// extensions/discord/src/components-registry-state.ts
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
// extensions/discord/src/components-registry.ts
const DEFAULT_COMPONENT_TTL_MS = 18e5;
const PERSISTENT_COMPONENT_NAMESPACE = "discord.components";
const PERSISTENT_MODAL_NAMESPACE = "discord.modals";
const PERSISTENT_REGISTRY_MAX_ENTRIES = 500;
function formatRegistryError(error) {
	if (!(error instanceof Error)) return { error: formatRegistryErrorValue(error) };
	const details = {};
	const appendError = (prefix, entry) => {
		details[prefix] = String(entry);
		details[`${prefix}Name`] = entry.name;
		details[`${prefix}Message`] = entry.message;
		if (entry.stack) details[`${prefix}Stack`] = entry.stack;
	};
	appendError("error", error);
	const cause = error.cause;
	if (cause instanceof Error) appendError("errorCause", cause);
	else if (cause !== void 0) details.errorCause = formatRegistryErrorValue(cause);
	return details;
}
const reportPersistentComponentRegistryError = createPluginStateErrorReporter(getOptionalDiscordRuntime, "discord", "component-registry-state", "Discord persistent component registry state failed", formatRegistryError);
function formatRegistryErrorValue(value) {
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint" || typeof value === "symbol") return String(value);
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
function openPersistentRegistryStore(cached, namespace) {
	if (discordComponentRegistryState.persistentRegistryDisabled) return;
	if (cached) return cached;
	const runtime = getOptionalDiscordRuntime();
	if (!runtime) return;
	try {
		return runtime.state.openKeyedStore({
			namespace,
			maxEntries: PERSISTENT_REGISTRY_MAX_ENTRIES,
			defaultTtlMs: DEFAULT_COMPONENT_TTL_MS
		});
	} catch (error) {
		disablePersistentComponentRegistry(error);
		return;
	}
}
function getPersistentComponentStore() {
	return discordComponentRegistryState.persistentComponentStore = openPersistentRegistryStore(discordComponentRegistryState.persistentComponentStore, PERSISTENT_COMPONENT_NAMESPACE);
}
function getPersistentModalStore() {
	return discordComponentRegistryState.persistentModalStore = openPersistentRegistryStore(discordComponentRegistryState.persistentModalStore, PERSISTENT_MODAL_NAMESPACE);
}
function pruneUndefinedRegistryValues(value) {
	if (Array.isArray(value)) return value.filter((entry) => entry !== void 0).map(pruneUndefinedRegistryValues);
	if (!value || typeof value !== "object") return value;
	const result = {};
	for (const [key, entry] of Object.entries(value)) {
		if (entry === void 0) continue;
		result[key] = pruneUndefinedRegistryValues(entry);
	}
	return result;
}
function normalizeRegistryEntries(entries, params) {
	return entries.map((entry) => {
		const createdAt = resolveDateTimestampMs(entry.createdAt, params.now);
		const expiresAt = asDateTimestampMs(entry.expiresAt) ?? resolveExpiresAtMsFromDurationMs(params.ttlMs, { nowMs: createdAt }) ?? 0;
		return {
			...entry,
			messageId: params.messageId ?? entry.messageId,
			createdAt,
			expiresAt
		};
	});
}
function resolveEntry(store, params) {
	const entry = store.get(params.id);
	if (!entry) return null;
	const now = Date.now();
	if (entry.expiresAt !== void 0 && !isFutureDateTimestampMs(entry.expiresAt, { nowMs: now })) {
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
	const entryOptions = {
		now,
		ttlMs,
		messageId: params.messageId
	};
	const normalizedEntries = normalizeRegistryEntries(params.entries, entryOptions);
	const normalizedModals = normalizeRegistryEntries(params.modals, entryOptions);
	return discordComponentRegistryState.withRegistryLock(async () => {
		for (const entry of normalizedEntries) discordComponentRegistryState.componentEntries.set(entry.id, entry);
		for (const entry of normalizedModals) discordComponentRegistryState.modalEntries.set(entry.id, entry);
		const pruneAt = Date.now();
		for (const store of [discordComponentRegistryState.componentEntries, discordComponentRegistryState.modalEntries]) for (const [id, entry] of store) if (entry.expiresAt !== void 0 && !isFutureDateTimestampMs(entry.expiresAt, { nowMs: pruneAt })) store.delete(id);
		await Promise.all([registerPersistentRegistryEntries({
			entries: normalizedEntries,
			ttlMs,
			openStore: getPersistentComponentStore
		}), registerPersistentRegistryEntries({
			entries: normalizedModals,
			ttlMs,
			openStore: getPersistentModalStore
		})]);
	});
}
async function resolveDiscordComponentEntryWithPersistence(params) {
	return discordComponentRegistryState.withRegistryLock(async () => {
		const store = discordComponentRegistryState.componentEntries;
		const inMemory = resolveEntry(store, params);
		const entry = inMemory ?? await resolvePersistentRegistryEntry({
			...params,
			openStore: getPersistentComponentStore
		});
		if (entry && params.consume !== false) {
			if (inMemory) for (const id of resolveComponentConsumptionIds(entry)) store.delete(id);
			await Promise.all(resolveComponentConsumptionIds(entry).map((id) => deletePersistentEntry({
				id,
				openStore: getPersistentComponentStore
			})));
		}
		return entry;
	});
}
async function resolveDiscordModalEntryWithPersistence(params) {
	return discordComponentRegistryState.withRegistryLock(async () => {
		const inMemory = resolveEntry(discordComponentRegistryState.modalEntries, params);
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
// extensions/discord/src/send.components.ts
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
async function sendDiscordComponentMessage(to, spec, opts) {
	return await withDiscordRequestAuthority(opts.assertPlatformSendAuthorized, async () => {
		const classicMessage = opts.mediaUrl ? resolveClassicDiscordMessage(spec) : void 0;
		if (classicMessage) return await sendMessageDiscord(to, classicMessage.text, {
			...opts,
			filename: opts.filename?.trim() || classicMessage.filename
		});
		return await writeDiscordComponentMessage(to, spec, opts);
	});
}
async function editDiscordComponentMessage(to, messageId, spec, opts) {
	return await writeDiscordComponentMessage(to, spec, opts, messageId);
}
async function writeDiscordComponentMessage(to, spec, opts, messageId) {
	const creating = messageId === void 0;
	const cfg = requireRuntimeConfig(opts.cfg, creating ? "Discord component send" : "Discord component edit");
	const { token, rest, request, account: accountInfo } = createDiscordClient({
		...opts,
		cfg
	});
	const recipient = await parseAndResolveDiscordTarget(to, {
		cfg,
		accountId: accountInfo.accountId
	}, { defaultKind: "channel" });
	const { channelId } = await resolveChannelId(rest, recipient, request);
	if (creating) {
		const channel = await resolveDiscordChannel(rest, channelId);
		if (channel && DISCORD_FORUM_LIKE_TYPES.has(channel.type)) throw new Error("Discord components are not supported in forum-style channels");
	}
	const messageReference = opts.reply ? {
		message_id: opts.reply.messageId,
		fail_if_not_exists: false
	} : void 0;
	let componentSpec = spec;
	let resolvedFileName;
	let files;
	let attachmentNames;
	if (opts.mediaUrl) {
		const media = await loadOutboundMediaFromUrl(opts.mediaUrl, {
			mediaAccess: opts.mediaAccess,
			mediaLocalRoots: opts.mediaLocalRoots,
			mediaReadFile: opts.mediaReadFile
		});
		const filenameOverride = opts.filename?.trim();
		attachmentNames = extractComponentAttachmentNames(componentSpec);
		const explicitAttachmentName = attachmentNames[0];
		resolvedFileName = filenameOverride || explicitAttachmentName || media.fileName || `upload${extensionForMime(media.contentType) ?? ""}`;
		if (attachmentNames.length === 0) {
			const file = `attachment://${resolvedFileName}`;
			componentSpec = {
				...componentSpec,
				blocks: [...componentSpec.blocks ?? [], {
					type: "file",
					file
				}]
			};
			attachmentNames = [resolveDiscordComponentAttachmentName(file)];
		}
		files = [{
			data: media.buffer,
			name: resolvedFileName,
			contentType: media.contentType
		}];
	}
	const uniqueAttachmentNames = uniqueStrings(attachmentNames ?? extractComponentAttachmentNames(componentSpec));
	if (uniqueAttachmentNames.length > 1) throw new Error("Discord component attachments currently support a single file. Use media-gallery for multiple files.");
	const expectedAttachmentName = uniqueAttachmentNames[0];
	if (expectedAttachmentName && resolvedFileName && expectedAttachmentName !== resolvedFileName) throw new Error(`Component file block expects attachment "${expectedAttachmentName}", but the uploaded file is "${resolvedFileName}". Update components.blocks[].file or provide a matching filename.`);
	if (!opts.mediaUrl && expectedAttachmentName) throw new Error("Discord component file blocks require a media attachment (media/path/filePath).");
	const buildResult = buildDiscordComponentMessage({
		spec: componentSpec,
		sessionKey: opts.sessionKey,
		agentId: opts.agentId,
		accountId: accountInfo.accountId
	});
	const payload = {
		components: buildResult.components,
		allowed_mentions: opts.allowedMentions,
		...opts.silent ? { flags: SUPPRESS_NOTIFICATIONS_FLAG } : {},
		...files ? { files } : {}
	};
	const componentBody = {
		...serializePayload(payload),
		...messageReference ? { message_reference: messageReference } : {}
	};
	const body = creating ? {
		...componentBody,
		nonce: createDiscordMessageNonce(),
		enforce_nonce: true
	} : componentBody;
	let result;
	try {
		result = await request(async () => {
			if (messageId !== void 0) return editChannelMessage(rest, channelId, messageId, { body });
			await opts.onPlatformSendDispatch?.();
			opts.assertPlatformSendAuthorized?.();
			return createChannelMessage(rest, channelId, { body });
		}, "components", creating ? { safety: "nonce-protected-create" } : void 0);
	} catch (err) {
		throw await buildDiscordSendError(err, {
			channelId,
			cfg,
			rest,
			token,
			hasMedia: Boolean(opts.mediaUrl)
		});
	}
	const toDeliveryResult = () => createDiscordSendResult({
		result: creating ? result : {
			id: result.id ?? messageId,
			channel_id: result.channel_id
		},
		fallbackChannelId: channelId,
		kind: "card",
		...opts.reply ? { reply: opts.reply } : {}
	});
	const deliveryResult = creating ? toDeliveryResult() : void 0;
	if (deliveryResult) await opts.onDeliveryResult?.(deliveryResult);
	await registerBuiltDiscordComponentMessage({
		buildResult,
		messageId: result.id ?? messageId,
		ttlMs: accountInfo.config.agentComponents?.ttlMs
	});
	recordChannelActivity({
		channel: "discord",
		accountId: accountInfo.accountId,
		direction: "outbound"
	});
	return deliveryResult ?? toDeliveryResult();
}
export { registerDiscordComponentEntries as a, send_components_exports as i, registerBuiltDiscordComponentMessage as n, resolveDiscordComponentEntryWithPersistence as o, sendDiscordComponentMessage as r, resolveDiscordModalEntryWithPersistence as s, editDiscordComponentMessage as t };
