import { n as normalizeCallbackPath, r as resolveCallbackHost, t as collectMattermostCallbackPaths } from "./callback-host-CRQTeNn9.mjs";
import { g as parseMattermostApiStatus, r as createMattermostClient, s as fetchMattermostChannel, v as sendMattermostTyping } from "./client-CVipK0N2.mjs";
import { O as sendHttpRequestRejection, S as readRequestBodyWithLimit, a as normalizeMattermostAllowList, b as logTypingFailure, g as isRequestBodyLimitError, m as createWebhookInFlightLimiter, n as authorizeMattermostCommandInvocation, t as MATTERMOST_PAIRING_QUEUE_FULL_TEXT, u as buildPreparedModelsProviderData } from "./monitor-auth-C9TiGGVQ.mjs";
import { t as getMattermostRuntime } from "./runtime-y_L8jPMH.mjs";
import { a as resolveMattermostPresentation, f as resolveMattermostReplyToMode, i as requiresMattermostMediaUpload } from "./normalize-V4AG9QEw.mjs";
import { t as sendMessageMattermost } from "./send-DvlK-nOQ.mjs";
import { createHash } from "node:crypto";
import { sendJson } from "openclaw/plugin-sdk/http-response-runtime";
import { safeEqualSecret } from "openclaw/plugin-sdk/security-runtime";
import { asFiniteNumber, normalizeOptionalString, normalizeStringifiedOptionalString, readStringField } from "openclaw/plugin-sdk/string-coerce-runtime";
import { truncateUtf8Prefix } from "openclaw/plugin-sdk/text-utility-runtime";
import { parseStrictInteger } from "openclaw/plugin-sdk/number-runtime";
import { createChannelDeliveryAccumulator, resolveChannelStreamingPreviewToolProgress } from "openclaw/plugin-sdk/channel-outbound";
import { resolveStoredModelOverrideAsync } from "openclaw/plugin-sdk/command-auth-native";
import { resolveOutboundMediaAccessForConfig } from "openclaw/plugin-sdk/outbound-media";
import { countOutboundMedia, deliverTextOrMediaReply, isReasoningReplyPayload, resolveSendableOutboundReplyParts } from "openclaw/plugin-sdk/reply-payload";
import { resolveGlobalMap } from "openclaw/plugin-sdk/global-singleton";
import { resolveHumanDelayConfig } from "openclaw/plugin-sdk/agent-runtime";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
import { finalizeInboundContext } from "openclaw/plugin-sdk/reply-runtime";
import { getSessionEntryAsync, resolveStorePath } from "openclaw/plugin-sdk/session-store-runtime";
import { recordDeliveredCommandExchange } from "openclaw/plugin-sdk/session-transcript-runtime";
import { normalizeProviderId } from "openclaw/plugin-sdk/provider-model-shared";
import { resolveThreadSessionKeys } from "openclaw/plugin-sdk/routing";
import { getAgentScopedMediaLocalRoots } from "openclaw/plugin-sdk/media-runtime";
const MATTERMOST_COMMAND_DESCRIPTION_MAX_BYTES = 128;
/**
* Built-in OpenClaw commands to register as native slash commands.
* These mirror the text-based commands already handled by the gateway.
*/
const DEFAULT_COMMAND_SPECS = [
	{
		originalName: "status",
		description: "Show session status (model, usage, uptime)"
	},
	{
		originalName: "model",
		description: "View or change the current model",
		autoCompleteHint: "[model-name] [--runtime runtime]"
	},
	{
		originalName: "models",
		description: "Browse available models",
		autoCompleteHint: "[provider]"
	},
	{
		originalName: "new",
		description: "Start a new conversation session"
	},
	{
		originalName: "help",
		description: "Show available commands"
	},
	{
		originalName: "think",
		description: "Set thinking/reasoning level",
		autoCompleteHint: "[off|low|medium|high]"
	},
	{
		originalName: "reasoning",
		description: "Toggle reasoning mode",
		autoCompleteHint: "[on|off]"
	},
	{
		originalName: "verbose",
		description: "Toggle verbose mode",
		autoCompleteHint: "[on|off]"
	},
	{
		originalName: "queue",
		description: "Adjust active-run queue behavior",
		autoCompleteHint: "[steer|followup|collect|interrupt] [debounce:2s] [cap:N] [drop:old|new|summarize]"
	}
].map((spec) => Object.assign(spec, {
	trigger: `oc_${spec.originalName}`,
	autoComplete: true
}));
async function listMattermostCommands(client, teamId, init) {
	return await client.request(`/commands?team_id=${encodeURIComponent(teamId)}&custom_only=true`, init);
}
async function getMattermostCommand(client, commandId, init) {
	return await client.request(`/commands/${encodeURIComponent(commandId)}`, init);
}
async function deleteMattermostCommand(client, commandId) {
	await client.request(`/commands/${encodeURIComponent(commandId)}`, {
		method: "DELETE",
		discardResponse: true
	});
}
/** Reconcile owned commands without modifying another integration's trigger. */
async function registerSlashCommands(params) {
	const { client, teamId, creatorUserId, callbackUrl, commands, log } = params;
	const normalizedCreatorUserId = creatorUserId.trim();
	if (!normalizedCreatorUserId) throw new Error("creatorUserId is required for slash command reconciliation");
	let existing;
	try {
		existing = await listMattermostCommands(client, teamId);
	} catch (err) {
		log?.(`mattermost: failed to list existing commands: ${String(err)}`);
		throw err;
	}
	const existingByTrigger = /* @__PURE__ */ new Map();
	for (const cmd of existing) {
		const list = existingByTrigger.get(cmd.trigger) ?? [];
		list.push(cmd);
		existingByTrigger.set(cmd.trigger, list);
	}
	const registered = [];
	for (const spec of commands) {
		const description = truncateUtf8Prefix(spec.description, MATTERMOST_COMMAND_DESCRIPTION_MAX_BYTES);
		const existingForTrigger = existingByTrigger.get(spec.trigger) ?? [];
		const ownedCommands = existingForTrigger.filter((cmd) => cmd.creator_id?.trim() === normalizedCreatorUserId);
		if (ownedCommands.length === 0 && existingForTrigger.length > 0) {
			log?.(`mattermost: trigger /${spec.trigger} already used by non-OpenClaw command(s); skipping to avoid mutating external integrations`);
			continue;
		}
		if (ownedCommands.length > 1) log?.(`mattermost: multiple owned commands found for /${spec.trigger}; using the first and leaving extras untouched`);
		const existingCmd = ownedCommands[0];
		const command = {
			team_id: teamId,
			trigger: spec.trigger,
			method: "P",
			url: callbackUrl,
			description,
			auto_complete: spec.autoComplete,
			auto_complete_desc: description,
			auto_complete_hint: spec.autoCompleteHint
		};
		const recordCommand = (receipt, managed) => {
			registered.push({
				id: receipt.id,
				trigger: spec.trigger,
				teamId,
				token: receipt.token,
				url: callbackUrl,
				managed
			});
		};
		if (existingCmd?.url === callbackUrl && existingCmd.method === "P") {
			log?.(`mattermost: command /${spec.trigger} already registered (id=${existingCmd.id})`);
			recordCommand(existingCmd, false);
			continue;
		}
		if (existingCmd) {
			log?.(`mattermost: command /${spec.trigger} exists with different callback settings; updating (id=${existingCmd.id})`);
			try {
				recordCommand(await client.request(`/commands/${encodeURIComponent(existingCmd.id)}`, {
					method: "PUT",
					body: JSON.stringify({
						id: existingCmd.id,
						...command
					})
				}), false);
				continue;
			} catch (err) {
				log?.(`mattermost: failed to update command /${spec.trigger} (id=${existingCmd.id}): ${String(err)}`);
				try {
					await deleteMattermostCommand(client, existingCmd.id);
					log?.(`mattermost: deleted stale command /${spec.trigger} (id=${existingCmd.id})`);
				} catch (deleteErr) {
					log?.(`mattermost: failed to delete stale command /${spec.trigger} (id=${existingCmd.id}): ${String(deleteErr)}`);
					continue;
				}
			}
		}
		try {
			const created = await client.request("/commands", {
				method: "POST",
				body: JSON.stringify(command)
			});
			log?.(`mattermost: registered command /${spec.trigger} (id=${created.id})`);
			recordCommand(created, true);
		} catch (err) {
			log?.(`mattermost: failed to register command /${spec.trigger}: ${String(err)}`);
		}
	}
	return registered;
}
async function cleanupSlashCommands(params) {
	const { client, commands, log } = params;
	for (const cmd of commands) {
		if (!cmd.managed) continue;
		try {
			await deleteMattermostCommand(client, cmd.id);
			log?.(`mattermost: deleted command /${cmd.trigger} (id=${cmd.id})`);
		} catch (err) {
			log?.(`mattermost: failed to delete command /${cmd.trigger}: ${String(err)}`);
		}
	}
}
function parseSlashCommandPayload(body, contentType) {
	if (!body) return null;
	try {
		const json = contentType?.includes("application/json");
		const parsed = json ? JSON.parse(body) : void 0;
		const form = json ? void 0 : new URLSearchParams(body);
		const read = (key) => {
			const value = form ? form.get(key) : parsed?.[key];
			return typeof value === "string" ? value : void 0;
		};
		const token = read("token");
		const teamId = read("team_id");
		const channelId = read("channel_id");
		const userId = read("user_id");
		const command = read("command");
		if (!token || !teamId || !channelId || !userId || !command) return null;
		return {
			token,
			team_id: teamId,
			team_domain: read("team_domain"),
			channel_id: channelId,
			channel_name: read("channel_name"),
			user_id: userId,
			user_name: read("user_name"),
			command,
			text: read("text") ?? "",
			trigger_id: read("trigger_id"),
			response_url: read("response_url"),
			root_id: read("root_id")
		};
	} catch {
		return null;
	}
}
/**
* Map the trigger word back to the original OpenClaw command name.
* e.g. "oc_status" -> "/status", "oc_model" -> "/model"
*/
function resolveCommandText(trigger, text, triggerMap) {
	const commandName = triggerMap?.get(trigger) ?? (trigger.startsWith("oc_") ? trigger.slice(3) : trigger);
	const args = text.trim();
	return args ? `/${commandName} ${args}` : `/${commandName}`;
}
function normalizeSlashCommandTrigger(command) {
	return command.replace(/^\//, "").trim();
}
function resolveSlashCommandConfig(raw) {
	return {
		native: raw?.native ?? "auto",
		nativeSkills: raw?.nativeSkills ?? "auto",
		callbackPath: normalizeCallbackPath(raw?.callbackPath),
		callbackUrl: normalizeOptionalString(raw?.callbackUrl)
	};
}
function isSlashCommandsEnabled(config) {
	return config.native === true;
}
function resolveCallbackUrl(params) {
	if (params.config.callbackUrl) return params.config.callbackUrl;
	const host = resolveCallbackHost(params.gatewayHost);
	const path = normalizeCallbackPath(params.config.callbackPath);
	return `http://${host}:${params.gatewayPort}${path}`;
}
// extensions/mattermost/src/mattermost/model-picker.ts
const MATTERMOST_MODEL_PICKER_CONTEXT_KEY = "oc_model_picker";
const MODELS_PAGE_SIZE = 8;
const ACTION_IDS = {
	providers: "mdlprov",
	list: "mdllist",
	select: "mdlsel",
	back: "mdlback"
};
function splitModelRef(modelRef) {
	const match = normalizeOptionalString(modelRef)?.match(/^([^/]+)\/(.+)$/u);
	if (!match) return null;
	const rawProvider = match[1];
	if (!rawProvider) return null;
	const provider = normalizeProviderId(rawProvider);
	const model = normalizeOptionalString(match[2]);
	if (!provider || !model) return null;
	return {
		provider,
		model
	};
}
function normalizePage(value) {
	return Math.max(1, Math.floor(asFiniteNumber(value) ?? 1));
}
function buildButton(params) {
	const baseState = {
		action: params.action,
		ownerUserId: params.ownerUserId,
		...params.action === "list" || params.action === "select" ? {
			provider: normalizeProviderId(params.provider ?? ""),
			page: normalizePage(params.page)
		} : {},
		...params.action === "select" ? { model: normalizeStringifiedOptionalString(params.model) ?? "" } : {}
	};
	const digest = createHash("sha256").update(JSON.stringify(baseState)).digest("hex").slice(0, 12);
	return {
		id: `${ACTION_IDS[baseState.action]}${digest}`,
		text: params.text,
		...params.style ? { style: params.style } : {},
		context: {
			[MATTERMOST_MODEL_PICKER_CONTEXT_KEY]: true,
			...baseState
		}
	};
}
function formatCurrentModelLine(currentModel) {
	const parsed = splitModelRef(currentModel);
	if (!parsed) return "Current: default";
	return `Current: ${parsed.provider}/${parsed.model}`;
}
function resolveMattermostModelPickerEntry(commandText) {
	const normalized = commandText.trim().replace(/\s+/g, " ");
	if (/^\/model$/i.test(normalized)) return { kind: "summary" };
	if (/^\/models$/i.test(normalized)) return { kind: "providers" };
	const providerMatch = normalized.match(/^\/models\s+(\S+)$/i);
	if (!providerMatch?.[1]) return null;
	return {
		kind: "models",
		provider: normalizeProviderId(providerMatch[1])
	};
}
function parseMattermostModelPickerContext(context) {
	if (!context || context[MATTERMOST_MODEL_PICKER_CONTEXT_KEY] !== true) return null;
	const ownerUserId = normalizeOptionalString(context.ownerUserId) ?? "";
	const action = normalizeOptionalString(context.action) ?? "";
	if (!ownerUserId) return null;
	if (action === "providers" || action === "back") return {
		action,
		ownerUserId
	};
	const provider = normalizeProviderId(readStringField(context, "provider") ?? "");
	const page = asFiniteNumber(context.page) ?? parseStrictInteger(context.page);
	if (!provider) return null;
	if (action === "list") return {
		action,
		ownerUserId,
		provider,
		page: normalizePage(page)
	};
	if (action === "select") {
		const model = normalizeOptionalString(context.model) ?? "";
		if (!model) return null;
		return {
			action,
			ownerUserId,
			provider,
			page: normalizePage(page),
			model
		};
	}
	return null;
}
async function resolveMattermostModelPickerCurrentModel(params) {
	const fallback = `${params.data.resolvedDefault.provider}/${params.data.resolvedDefault.model}`;
	try {
		const storePath = resolveStorePath(params.cfg.session?.store, { agentId: params.route.agentId });
		const loadSessionEntry = (sessionKey) => getSessionEntryAsync({
			agentId: params.route.agentId,
			storePath,
			sessionKey
		});
		const sessionEntry = params.sessionEntry;
		const override = await resolveStoredModelOverrideAsync({
			sessionEntry,
			sessionKey: params.route.sessionKey,
			parentSessionKey: sessionEntry?.parentSessionKey,
			defaultProvider: params.data.resolvedDefault.provider,
			loadSessionEntry
		});
		if (!override?.model) return fallback;
		const provider = (override.provider || params.data.resolvedDefault.provider).trim();
		return provider ? `${provider}/${override.model}` : fallback;
	} catch {
		return fallback;
	}
}
function renderMattermostModelSummaryView(params) {
	return {
		text: [
			formatCurrentModelLine(params.currentModel),
			"",
			"Tap below to browse models, or use:",
			"/oc_model <provider/model> to switch",
			"Browse keeps the current runtime; use /oc_model <provider/model> --runtime <runtime> to switch runtime too",
			"/oc_model status for details"
		].join("\n"),
		buttons: [[buildButton({
			action: "providers",
			ownerUserId: params.ownerUserId,
			text: "Browse providers",
			style: "primary"
		})]]
	};
}
function renderMattermostProviderPickerView(params) {
	const currentProvider = splitModelRef(params.currentModel)?.provider;
	const rows = params.data.providers.map((provider) => [buildButton({
		action: "list",
		ownerUserId: params.ownerUserId,
		text: `${provider} (${params.data.byProvider.get(provider)?.size ?? 0})`,
		provider,
		page: 1,
		style: provider === currentProvider ? "primary" : "default"
	})]);
	return {
		text: [
			formatCurrentModelLine(params.currentModel),
			"",
			"Select a provider:"
		].join("\n"),
		buttons: rows
	};
}
function renderMattermostModelsPickerView(params) {
	const provider = normalizeProviderId(params.provider);
	const models = [...params.data.byProvider.get(provider) ?? []].toSorted();
	const current = splitModelRef(params.currentModel);
	if (models.length === 0) return {
		text: [
			formatCurrentModelLine(params.currentModel),
			"",
			`Unknown provider: ${provider}`
		].join("\n"),
		buttons: [[buildButton({
			action: "back",
			ownerUserId: params.ownerUserId,
			text: "Back to providers"
		})]]
	};
	const totalPages = Math.ceil(models.length / MODELS_PAGE_SIZE);
	const page = Math.min(normalizePage(params.page), totalPages);
	const start = (page - 1) * MODELS_PAGE_SIZE;
	const rows = models.slice(start, start + MODELS_PAGE_SIZE).map((model) => {
		const isCurrent = current?.provider === provider && current?.model === model;
		return [buildButton({
			action: "select",
			ownerUserId: params.ownerUserId,
			text: isCurrent ? `${model} [current]` : model,
			provider,
			model,
			page,
			style: isCurrent ? "primary" : "default"
		})];
	});
	const navRow = [];
	if (page > 1) navRow.push(buildButton({
		action: "list",
		ownerUserId: params.ownerUserId,
		text: "Prev",
		provider,
		page: page - 1
	}));
	if (page < totalPages) navRow.push(buildButton({
		action: "list",
		ownerUserId: params.ownerUserId,
		text: "Next",
		provider,
		page: page + 1
	}));
	if (navRow.length > 0) rows.push(navRow);
	rows.push([buildButton({
		action: "back",
		ownerUserId: params.ownerUserId,
		text: "Back to providers"
	})]);
	return {
		text: [
			`Models (${provider}) - ${models.length} available`,
			formatCurrentModelLine(params.currentModel),
			`Page ${page}/${totalPages}`,
			"Select a model to switch immediately."
		].join("\n"),
		buttons: rows
	};
}
// extensions/mattermost/src/mattermost/monitor-context.ts
function shouldUpdateMattermostDraftToolProgress(account) {
	return account.streamingMode !== "off" && resolveChannelStreamingPreviewToolProgress(account.config, account.streamingMode !== "progress", account.streamingMode);
}
function buildMattermostButtonInteractionMessageSid(params) {
	return `interaction:${params.postId}:${params.actionId}`;
}
function resolveMattermostReplyRootId(params) {
	const threadRootId = normalizeOptionalString(params.threadRootId);
	if (params.kind === "direct" && !threadRootId) return;
	if (threadRootId) return threadRootId;
	return normalizeOptionalString(params.replyToId);
}
function resolveMattermostInteractionReplyRootId(params) {
	const interactionMessageSid = normalizeOptionalString(params.interactionMessageSid);
	const replyToId = normalizeOptionalString(params.replyToId);
	const providerReplyToId = replyToId === interactionMessageSid ? normalizeOptionalString(params.sourcePostId) : replyToId;
	return resolveMattermostReplyRootId({
		kind: params.kind,
		threadRootId: params.threadRootId,
		replyToId: providerReplyToId
	});
}
function canFinalizeMattermostPreviewInPlace(params) {
	return resolveMattermostReplyRootId({
		kind: params.kind,
		threadRootId: params.threadRootId,
		replyToId: params.replyToId
	}) === params.previewRootId?.trim();
}
function formatMattermostFinalDeliveryOutcomeLog(params) {
	if (params.outcome === "text" || params.outcome === "media") return `delivered reply to ${params.to}`;
	if (params.outcome === "empty") {
		const finalText = params.payload.text?.trim() ?? "";
		const mediaUrlCount = countOutboundMedia(params.payload);
		if (finalText.length > 0 || mediaUrlCount > 0) return `mattermost no-visible-reply: no-visible-reply-after-final-delivery to=${params.to} accountId=${params.accountId} agentId=${params.agentId ?? "unknown"} outcome=${params.outcome} finalTextLength=${finalText.length} mediaUrlCount=${mediaUrlCount}`;
	}
}
function resolveMattermostThreadSessionContext(params) {
	const effectiveReplyToId = params.kind === "direct" && params.replyToMode === "off" ? void 0 : normalizeOptionalString(params.threadRootId) ?? (params.replyToMode !== "off" ? normalizeOptionalString(params.postId) : void 0);
	const threadKeys = resolveThreadSessionKeys({
		baseSessionKey: params.baseSessionKey,
		threadId: effectiveReplyToId,
		normalizeThreadId: (threadId) => threadId,
		parentSessionKey: effectiveReplyToId && params.kind !== "direct" ? params.baseSessionKey : void 0
	});
	return {
		effectiveReplyToId,
		sessionKey: threadKeys.sessionKey,
		parentSessionKey: threadKeys.parentSessionKey
	};
}
// extensions/mattermost/src/mattermost/reply-delivery.ts
/** Represents distinct provider posts without collapsing their visible boundary. */
function joinMattermostVisibleContent(contents) {
	return contents.filter((content) => Boolean(content)).join("\n");
}
async function deliverMattermostReplyPayload(params) {
	if (isReasoningReplyPayload(params.payload)) return {
		outcome: "reasoning_skipped",
		visibleReplySent: false,
		suppression: { reason: "no_visible_result" }
	};
	const presentation = resolveMattermostPresentation(params.payload);
	const reply = resolveSendableOutboundReplyParts(params.payload, { text: params.core.channel.text.convertMarkdownTables(presentation.text, params.tableMode) });
	const mediaLocalRoots = getAgentScopedMediaLocalRoots(params.cfg, params.agentId);
	const mediaAccess = resolveOutboundMediaAccessForConfig(params.cfg);
	const chunkMode = params.core.channel.text.resolveChunkMode(params.cfg, "mattermost", params.accountId);
	const accepted = createChannelDeliveryAccumulator({
		kind: reply.mediaUrls.length > 0 ? "media" : "text",
		...params.replyToId ? { replyToId: params.replyToId } : {}
	});
	const sendAccepted = async (text, mediaUrl) => {
		const result = await params.sendMessage(`channel:${params.channelId}`, text, {
			cfg: params.cfg,
			accountId: params.accountId,
			...mediaUrl ? {
				mediaUrl,
				mediaLocalRoots,
				mediaAccess
			} : {},
			...requiresMattermostMediaUpload(mediaUrl) ? { requireMediaUpload: true } : {},
			...accepted.size === 0 && reply.mediaUrls.length < 2 && presentation.buttons.length ? { buttons: presentation.buttons } : {},
			replyToId: params.replyToId
		});
		accepted.add({ receipt: result.receipt }, result.content);
	};
	let outcome;
	try {
		outcome = await deliverTextOrMediaReply({
			payload: params.payload,
			text: reply.text,
			chunkText: (value) => params.core.channel.text.chunkMarkdownTextWithMode(value, params.textLimit, chunkMode),
			sendText: sendAccepted,
			sendMedia: ({ mediaUrl, caption }) => sendAccepted(caption ?? "", mediaUrl)
		});
	} catch (error) {
		throw accepted.partialError(error);
	}
	return {
		outcome,
		...accepted.result()
	};
}
// extensions/mattermost/src/mattermost/slash-http.ts
const MAX_BODY_BYTES = 65536;
const BODY_READ_TIMEOUT_MS = 5e3;
const COMMAND_LOOKUP_TIMEOUT_MS = 1e3;
const COMMAND_VALIDATION_FAILURE_CACHE_MS = 5e3;
const COMMAND_VALIDATION_FAILURE_CACHE_MAX_KEYS = 2e3;
const COMMAND_VALIDATION_LOOKUP_BURST = 20;
const COMMAND_VALIDATION_LOOKUP_REFILL_MS = 500;
const COMMAND_VALIDATION_LOOKUP_LIMIT_LOG_MS = 5e3;
const COMMAND_VALIDATION_LOOKUP_RATE_LIMIT_MAX_KEYS = 2e3;
const commandLookupInflight = /* @__PURE__ */ new Map();
const commandValidationFailureCache = /* @__PURE__ */ new Map();
const commandValidationLookupRateLimit = /* @__PURE__ */ new Map();
function sendSlashCommandResponse(res, status, text) {
	sendJson(res, status, {
		response_type: "ephemeral",
		text
	});
}
async function readSlashCommandBody(req, res) {
	try {
		return await readRequestBodyWithLimit(req, {
			maxBytes: MAX_BODY_BYTES,
			timeoutMs: BODY_READ_TIMEOUT_MS,
			destroyOnLimit: false
		});
	} catch (error) {
		if (isRequestBodyLimitError(error, "REQUEST_BODY_TIMEOUT")) await sendHttpRequestRejection(req, res, 408, "Request body timeout");
		else await sendHttpRequestRejection(req, res, 413, "Payload Too Large");
		return;
	}
}
function findRegisteredCommandForPayload(params) {
	const trigger = normalizeSlashCommandTrigger(params.payload.command);
	return params.registeredCommands.find((cmd) => cmd.teamId === params.payload.team_id && cmd.trigger === trigger);
}
function isDeletedMattermostCommand(command) {
	return typeof command.delete_at === "number" && command.delete_at > 0;
}
async function withCommandLookupTimeout(task) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), COMMAND_LOOKUP_TIMEOUT_MS);
	try {
		return await task(controller.signal);
	} finally {
		clearTimeout(timeout);
	}
}
function commandLookupKey(client, registered, accountId) {
	return `${client.apiBaseUrl}:${accountId}:${registered.teamId}:${registered.id}`;
}
function clearMattermostSlashCommandValidationCacheForAccount(accountId) {
	for (const cache of [
		commandValidationFailureCache,
		commandLookupInflight,
		commandValidationLookupRateLimit
	]) for (const [key, entry] of cache) if (entry.accountId === accountId) cache.delete(key);
}
function sweepCommandValidationFailureCache(now = Date.now()) {
	for (const [key, entry] of commandValidationFailureCache) if (entry.expiresAt <= now) commandValidationFailureCache.delete(key);
	pruneMapToMaxSize(commandValidationFailureCache, COMMAND_VALIDATION_FAILURE_CACHE_MAX_KEYS);
}
function hasCachedCommandValidationFailure(key, now = Date.now()) {
	sweepCommandValidationFailureCache(now);
	return commandValidationFailureCache.has(key);
}
function cacheCommandValidationFailure(key, accountId) {
	const now = Date.now();
	sweepCommandValidationFailureCache(now);
	commandValidationFailureCache.set(key, {
		accountId,
		expiresAt: now + COMMAND_VALIDATION_FAILURE_CACHE_MS
	});
}
function sweepCommandValidationLookupRateLimit(now = Date.now()) {
	const staleAfterMs = COMMAND_VALIDATION_LOOKUP_REFILL_MS * COMMAND_VALIDATION_LOOKUP_BURST * 2;
	for (const [key, entry] of commandValidationLookupRateLimit) if (now - entry.updatedAt > staleAfterMs) commandValidationLookupRateLimit.delete(key);
	pruneMapToMaxSize(commandValidationLookupRateLimit, COMMAND_VALIDATION_LOOKUP_RATE_LIMIT_MAX_KEYS);
}
function reserveCommandValidationLookup(params) {
	const now = Date.now();
	sweepCommandValidationLookupRateLimit(now);
	const existing = commandValidationLookupRateLimit.get(params.key);
	if (!existing) {
		commandValidationLookupRateLimit.set(params.key, {
			accountId: params.accountId,
			tokens: 19,
			updatedAt: now,
			lastLimitedLogAt: 0
		});
		return { allowed: true };
	}
	const refill = Math.floor((now - existing.updatedAt) / COMMAND_VALIDATION_LOOKUP_REFILL_MS);
	if (refill > 0) {
		existing.tokens = Math.min(COMMAND_VALIDATION_LOOKUP_BURST, existing.tokens + refill);
		existing.updatedAt += refill * COMMAND_VALIDATION_LOOKUP_REFILL_MS;
	}
	if (existing.tokens <= 0) {
		const shouldLog = now - existing.lastLimitedLogAt >= COMMAND_VALIDATION_LOOKUP_LIMIT_LOG_MS;
		if (shouldLog) existing.lastLimitedLogAt = now;
		return {
			allowed: false,
			shouldLog
		};
	}
	existing.tokens -= 1;
	return { allowed: true };
}
async function fetchCurrentMattermostCommandUncached(params) {
	let commandLookupResult = null;
	let commandLookupError;
	let commandLookupFallbackDetail;
	try {
		commandLookupResult = await withCommandLookupTimeout((signal) => getMattermostCommand(params.client, params.registered.id, { signal }));
		if (!isDeletedMattermostCommand(commandLookupResult)) return commandLookupResult;
		commandLookupFallbackDetail = "command lookup by id returned deleted command";
	} catch (err) {
		commandLookupError = err;
	}
	try {
		const currentCommands = await withCommandLookupTimeout((signal) => listMattermostCommands(params.client, params.registered.teamId, { signal }));
		if (commandLookupError) params.log?.(`mattermost: slash command lookup by id failed for /${params.registered.trigger}; using team list fallback (status=${parseMattermostApiStatus(commandLookupError) ?? "unknown"})`);
		else if (commandLookupFallbackDetail) params.log?.(`mattermost: slash ${commandLookupFallbackDetail} for /${params.registered.trigger}; using team list fallback`);
		return currentCommands.find((cmd) => cmd.id === params.registered.id) ?? commandLookupResult;
	} catch (err) {
		const primaryDetail = commandLookupError ? `; command lookup status=${parseMattermostApiStatus(commandLookupError) ?? "unknown"}` : commandLookupFallbackDetail ? `; command lookup: ${commandLookupFallbackDetail}` : "";
		params.log?.(`mattermost: slash command registration check failed for /${params.registered.trigger} (status=${parseMattermostApiStatus(err) ?? "unknown"})${primaryDetail}`);
		return null;
	}
}
function createSlashCommandHttpHandler(params) {
	const { account, cfg, runtime, registeredCommands, triggerMap, log } = params;
	return async (req, res, bufferedBody, onRequestAuthenticated) => {
		if (req.method !== "POST") {
			res.statusCode = 405;
			res.setHeader("Allow", "POST");
			res.end("Method Not Allowed");
			return;
		}
		const body = bufferedBody ?? await readSlashCommandBody(req, res);
		if (body === void 0) return;
		const payload = parseSlashCommandPayload(body, req.headers["content-type"] ?? "");
		if (!payload) {
			sendSlashCommandResponse(res, 400, "Invalid slash command payload.");
			return;
		}
		const registeredCommand = findRegisteredCommandForPayload({
			registeredCommands,
			payload
		});
		if (!registeredCommand || !safeEqualSecret(payload.token, registeredCommand.token)) {
			sendSlashCommandResponse(res, 401, "Unauthorized: invalid command token.");
			return;
		}
		const client = createMattermostClient({
			baseUrl: account.baseUrl ?? "",
			botToken: account.botToken ?? "",
			allowPrivateNetwork: account.config.network?.dangerouslyAllowPrivateNetwork === true
		});
		const validationAccountId = account.accountId;
		const admittedCommand = registeredCommand;
		const token = payload.token;
		async function validateMattermostSlashCommandToken() {
			const lookupKey = commandLookupKey(client, admittedCommand, validationAccountId);
			if (hasCachedCommandValidationFailure(lookupKey)) return false;
			if (!commandLookupInflight.has(lookupKey)) {
				const reservation = reserveCommandValidationLookup({
					key: lookupKey,
					accountId: validationAccountId
				});
				if (!reservation.allowed) {
					if (reservation.shouldLog) log?.(`mattermost: slash command validation lookup rate-limited for /${admittedCommand.trigger}`);
					return false;
				}
			}
			let current;
			const existing = commandLookupInflight.get(lookupKey);
			if (existing) current = await existing.promise;
			else {
				const lookup = fetchCurrentMattermostCommandUncached({
					client,
					registered: admittedCommand,
					log
				}).finally(() => {
					commandLookupInflight.delete(lookupKey);
				});
				commandLookupInflight.set(lookupKey, {
					accountId: validationAccountId,
					promise: lookup
				});
				current = await lookup;
			}
			if (!current || isDeletedMattermostCommand(current)) {
				cacheCommandValidationFailure(lookupKey, validationAccountId);
				return false;
			}
			if (current.id !== admittedCommand.id || current.team_id !== admittedCommand.teamId || current.trigger !== admittedCommand.trigger || current.method !== "P" || current.url !== admittedCommand.url) {
				cacheCommandValidationFailure(lookupKey, validationAccountId);
				return false;
			}
			if (!current.token || !safeEqualSecret(token, current.token)) {
				cacheCommandValidationFailure(lookupKey, validationAccountId);
				return false;
			}
			commandValidationFailureCache.delete(lookupKey);
			return true;
		}
		if (!await validateMattermostSlashCommandToken()) {
			sendSlashCommandResponse(res, 401, "Unauthorized: invalid command token.");
			return;
		}
		onRequestAuthenticated?.();
		const commandText = resolveCommandText(normalizeSlashCommandTrigger(payload.command), payload.text, triggerMap);
		const channelId = payload.channel_id;
		const senderId = payload.user_id;
		const senderName = payload.user_name ?? senderId;
		async function authorizeSlashInvocation() {
			const core = getMattermostRuntime();
			let channelInfo = null;
			try {
				channelInfo = await fetchMattermostChannel(client, channelId);
			} catch (err) {
				log?.(`mattermost: slash channel lookup failed (status=${parseMattermostApiStatus(err) ?? "unknown"})`);
			}
			if (!channelInfo) return {
				ok: false,
				denyText: "Temporary error: unable to determine channel type. Please try again."
			};
			const allowTextCommands = core.channel.commands.shouldHandleTextCommands({
				cfg,
				surface: "mattermost"
			});
			const hasControlCommand = core.channel.text.hasControlCommand(commandText, cfg);
			const storeAllowFrom = normalizeMattermostAllowList(await core.channel.pairing.readAllowFromStore({
				channel: "mattermost",
				accountId: account.accountId
			}).catch(() => []));
			const decision = await authorizeMattermostCommandInvocation({
				account,
				cfg,
				senderId,
				senderName,
				channelId,
				channelInfo,
				storeAllowFrom,
				allowTextCommands,
				hasControlCommand
			});
			if (!decision.ok) {
				if (decision.denyReason === "dm-pairing") {
					const { code } = await core.channel.pairing.upsertPairingRequest({
						channel: "mattermost",
						accountId: account.accountId,
						id: senderId,
						meta: { name: senderName }
					});
					return {
						ok: false,
						denyText: code ? core.channel.pairing.buildPairingReply({
							channel: "mattermost",
							idLine: `Your Mattermost user id: ${senderId}`,
							code
						}) : MATTERMOST_PAIRING_QUEUE_FULL_TEXT
					};
				}
				return {
					ok: false,
					denyText: decision.denyReason === "unknown-channel" ? "Temporary error: unable to determine channel type. Please try again." : decision.denyReason === "dm-disabled" ? "This bot is not accepting direct messages." : decision.denyReason === "channels-disabled" ? "Slash commands are disabled in channels." : decision.denyReason === "channel-no-allowlist" ? "Slash commands are not configured for this channel (no allowlist)." : "Unauthorized."
				};
			}
			return decision;
		}
		const auth = await authorizeSlashInvocation();
		if (!auth.ok) {
			sendSlashCommandResponse(res, 200, auth.denyText);
			return;
		}
		sendSlashCommandResponse(res, 200, "Processing...");
		let replyRootId;
		try {
			const { kind, chatType, channelDisplay, roomLabel, commandAuthorized } = auth;
			const teamId = payload.team_id;
			const triggerId = payload.trigger_id;
			const core = getMattermostRuntime();
			const channelRoute = core.channel.routing.resolveAgentRoute({
				cfg,
				channel: "mattermost",
				accountId: account.accountId,
				teamId,
				peer: {
					kind,
					id: kind === "direct" ? senderId : channelId
				}
			});
			const thread = resolveMattermostThreadSessionContext({
				baseSessionKey: channelRoute.sessionKey,
				kind,
				replyToMode: resolveMattermostReplyToMode(account, kind),
				threadRootId: payload.root_id
			});
			const route = {
				...channelRoute,
				sessionKey: thread.sessionKey
			};
			replyRootId = thread.effectiveReplyToId;
			const fromLabel = kind === "direct" ? `Mattermost DM from ${senderName}` : `Mattermost message in ${roomLabel} from ${senderName}`;
			const to = kind === "direct" ? `user:${senderId}` : `channel:${channelId}`;
			const messageSid = triggerId ?? `slash-${Date.now()}`;
			const pickerEntry = resolveMattermostModelPickerEntry(commandText);
			if (pickerEntry) {
				const accountId = account.accountId;
				const sessionEntry = await getSessionEntryAsync({
					agentId: route.agentId,
					storePath: resolveStorePath(cfg.session?.store, { agentId: route.agentId }),
					sessionKey: route.sessionKey,
					readConsistency: "latest"
				});
				const recordModelPickerExchange = (replyText) => recordDeliveredCommandExchange({
					config: cfg,
					agentId: route.agentId,
					sessionKey: route.sessionKey,
					expectedSessionId: sessionEntry?.sessionId,
					commandText,
					commandId: `mattermost:${accountId}:${channelId}:${messageSid}`,
					replyId: "model-picker",
					replyText
				});
				const data = await buildPreparedModelsProviderData(cfg, route.agentId, { sessionEntry });
				if (data.providers.length === 0) {
					await recordModelPickerExchange((await sendMessageMattermost(`channel:${channelId}`, [data.refreshWarning, "No models available."].filter(Boolean).join("\n\n"), {
						cfg,
						accountId,
						replyToId: replyRootId
					})).content);
					return;
				}
				const viewParams = {
					ownerUserId: senderId,
					data,
					currentModel: await resolveMattermostModelPickerCurrentModel({
						cfg,
						route,
						data,
						sessionEntry
					})
				};
				const view = pickerEntry.kind === "summary" ? renderMattermostModelSummaryView(viewParams) : pickerEntry.kind === "providers" ? renderMattermostProviderPickerView(viewParams) : renderMattermostModelsPickerView({
					...viewParams,
					provider: pickerEntry.provider,
					page: 1
				});
				await recordModelPickerExchange([(await sendMessageMattermost(`channel:${channelId}`, [data.refreshWarning, view.text].filter(Boolean).join("\n\n"), {
					cfg,
					accountId,
					buttons: view.buttons,
					replyToId: replyRootId
				})).content, ...view.buttons.map((row) => row.map((button) => button.text).join(", "))].join("\n"));
				runtime.log?.(`delivered model picker to ${to}`);
				return;
			}
			const ctxPayload = finalizeInboundContext({
				Body: commandText,
				BodyForAgent: commandText,
				RawBody: commandText,
				CommandBody: commandText,
				From: kind === "direct" ? `mattermost:${senderId}` : kind === "group" ? `mattermost:group:${channelId}` : `mattermost:channel:${channelId}`,
				To: to,
				SessionKey: route.sessionKey,
				ParentSessionKey: thread.parentSessionKey,
				AccountId: route.accountId,
				ChatType: chatType,
				ConversationRouteContextObserved: true,
				ConversationRoutePeerId: kind === "direct" ? senderId : channelId,
				ConversationLabel: fromLabel,
				GroupSpace: teamId,
				GroupSubject: kind !== "direct" ? channelDisplay || roomLabel : void 0,
				SenderName: senderName,
				SenderId: senderId,
				Provider: "mattermost",
				Surface: "mattermost",
				MessageSid: messageSid,
				Timestamp: Date.now(),
				WasMentioned: true,
				CommandAuthorized: commandAuthorized,
				InboundAccessAuthorized: true,
				CommandSource: "native",
				OriginatingChannel: "mattermost",
				OriginatingTo: to,
				ReplyToId: replyRootId,
				MessageThreadId: replyRootId
			});
			const textLimit = core.channel.text.resolveTextChunkLimit(cfg, "mattermost", account.accountId, { fallbackLimit: account.textChunkLimit ?? 4e3 });
			const tableMode = core.channel.text.resolveMarkdownTableMode({
				cfg,
				channel: "mattermost",
				accountId: account.accountId
			});
			await core.channel.inbound.dispatch({
				cfg,
				channel: "mattermost",
				accountId: account.accountId,
				route: {
					agentId: route.agentId,
					dmScope: route.dmScope,
					sessionKey: route.sessionKey
				},
				ctxPayload,
				delivery: {
					observeMessageSent: true,
					deliver: async (replyPayload) => {
						const result = await deliverMattermostReplyPayload({
							core,
							cfg,
							payload: replyPayload,
							channelId,
							accountId: account.accountId,
							agentId: route.agentId,
							replyToId: replyRootId,
							textLimit,
							tableMode,
							sendMessage: sendMessageMattermost
						});
						if (result.visibleReplySent) runtime.log?.(`delivered slash reply to ${to}`);
						return result;
					},
					onError: (err, info) => {
						runtime.error?.(`mattermost slash ${info.kind} reply failed (status=${parseMattermostApiStatus(err) ?? "unknown"})`);
					}
				},
				replyPipeline: { typing: {
					start: () => sendMattermostTyping(client, {
						channelId,
						parentId: replyRootId
					}),
					onStartError: (err) => {
						logTypingFailure({
							log: (message) => log?.(message),
							channel: "mattermost",
							target: channelId,
							error: err
						});
					}
				} },
				dispatcherOptions: { humanDelay: resolveHumanDelayConfig(cfg, route.agentId) },
				replyOptions: { disableBlockStreaming: typeof account.blockStreaming === "boolean" ? !account.blockStreaming : void 0 }
			});
		} catch (err) {
			log?.(`mattermost: slash command handler error (status=${parseMattermostApiStatus(err) ?? "unknown"})`);
			try {
				const to = `channel:${channelId}`;
				await sendMessageMattermost(to, "Sorry, something went wrong processing that command.", {
					cfg,
					accountId: account.accountId,
					replyToId: replyRootId
				});
			} catch {}
		}
	};
}
// extensions/mattermost/src/mattermost/slash-state.ts
const slashRouteInFlightLimiter = createWebhookInFlightLimiter();
const SLASH_ROUTE_IN_FLIGHT_KEY = "mattermost:slash";
const SLASH_AUTHENTICATED_IN_FLIGHT_KEY = `${SLASH_ROUTE_IN_FLIGHT_KEY}:authenticated`;
const accountStates = resolveGlobalMap(Symbol.for("openclaw.mattermost.slash-account-states"));
function resolveSlashRouteInFlightKey(authorization) {
	const token = authorization?.match(/^Token ([^,\s]+)$/iu)?.[1];
	if (!token) return SLASH_ROUTE_IN_FLIGHT_KEY;
	let matched = false;
	for (const state of accountStates.values()) for (const commandToken of state.commandTokens) matched = safeEqualSecret(token, commandToken) || matched;
	return matched ? `${SLASH_AUTHENTICATED_IN_FLIGHT_KEY}:${createHash("sha256").update(`${SLASH_AUTHENTICATED_IN_FLIGHT_KEY}:${token}`).digest("hex")}` : SLASH_ROUTE_IN_FLIGHT_KEY;
}
function resolveSlashHandler(source, matchesState) {
	const matches = [];
	for (const [accountId, state] of accountStates) if (state.handler && matchesState(state)) matches.push({
		accountId,
		handler: state.handler
	});
	if (matches.length === 0) return { kind: "none" };
	if (matches.length === 1) {
		const match = matches[0];
		if (!match) return { kind: "none" };
		return {
			kind: "single",
			handler: match.handler
		};
	}
	return {
		kind: "ambiguous",
		source,
		accountIds: matches.map((entry) => entry.accountId)
	};
}
function resolveSlashHandlerForCommand(params) {
	const trigger = normalizeSlashCommandTrigger(params.command);
	if (!trigger) return { kind: "none" };
	return resolveSlashHandler("command", (state) => state.registeredCommands.some((cmd) => cmd.teamId === params.teamId && cmd.trigger === trigger));
}
function getSlashCommandState(accountId) {
	return accountStates.get(accountId) ?? null;
}
/**
* Activate slash commands for a specific account.
* Called from the monitor after bot connects.
*/
function activateSlashCommands(params) {
	const { account, registeredCommands, triggerMap, api, log } = params;
	const accountId = account.accountId;
	const handler = createSlashCommandHttpHandler({
		account,
		cfg: api.cfg,
		runtime: api.runtime,
		registeredCommands,
		triggerMap,
		log
	});
	accountStates.set(accountId, {
		commandTokens: new Set(registeredCommands.map((command) => command.token).filter(Boolean)),
		registeredCommands,
		handler
	});
	log?.(`mattermost: slash commands activated for account ${accountId} (${registeredCommands.length} commands)`);
}
function deactivateSlashCommands(accountId) {
	for (const stateAccountId of accountStates.keys()) {
		if (accountId && stateAccountId !== accountId) continue;
		clearMattermostSlashCommandValidationCacheForAccount(stateAccountId);
		accountStates.delete(stateAccountId);
	}
}
/**
* Register the HTTP route for slash command callbacks.
* Called during plugin registration.
*
* The single HTTP route dispatches to the correct per-account handler by
* matching the inbound token against each account's known tokens, falling back
* to registered team/trigger ownership so upstream validation can accept a
* rotated Mattermost token.
*/
function registerSlashCommandRoute(api) {
	const dispatchRoute = async (req, res, onRequestAuthenticated) => {
		if (accountStates.size === 0) {
			sendSlashCommandResponse(res, 503, "Slash commands are not yet initialized. Please try again in a moment.");
			return;
		}
		if (accountStates.size === 1) {
			const state = accountStates.values().next().value;
			if (!state?.handler) {
				sendSlashCommandResponse(res, 503, "Slash commands are not yet initialized. Please try again in a moment.");
				return;
			}
			await state.handler(req, res, void 0, onRequestAuthenticated);
			return;
		}
		const bodyStr = await readSlashCommandBody(req, res);
		if (bodyStr === void 0) return;
		let token = null;
		const ct = req.headers["content-type"] ?? "";
		try {
			if (ct.includes("application/json")) token = JSON.parse(bodyStr).token ?? null;
			else token = new URLSearchParams(bodyStr).get("token");
		} catch {}
		let match = token ? resolveSlashHandler("token", (state) => state.commandTokens.has(token)) : { kind: "none" };
		if (match.kind === "none") {
			const payload = parseSlashCommandPayload(bodyStr, ct);
			if (payload) match = resolveSlashHandlerForCommand({
				teamId: payload.team_id,
				command: payload.command
			});
		}
		if (match.kind === "none") {
			sendSlashCommandResponse(res, 401, "Unauthorized: invalid command token.");
			return;
		}
		if (match.kind === "ambiguous") {
			api.logger.warn?.(`mattermost: slash callback matched multiple accounts via ${match.source} (${match.accountIds.join(", ")})`);
			sendSlashCommandResponse(res, 409, match.source === "token" ? "Conflict: command token is not unique across accounts." : "Conflict: slash command is not unique across accounts.");
			return;
		}
		await match.handler(req, res, bodyStr, onRequestAuthenticated);
	};
	const routeHandler = async (req, res) => {
		const inFlightKey = resolveSlashRouteInFlightKey(req.headers.authorization);
		if (!slashRouteInFlightLimiter.tryAcquire(inFlightKey)) {
			await sendHttpRequestRejection(req, res, 429, "Too Many Requests");
			return;
		}
		let released = false;
		const release = () => {
			if (released) return;
			released = true;
			slashRouteInFlightLimiter.release(inFlightKey);
		};
		try {
			await dispatchRoute(req, res, release);
		} finally {
			release();
		}
	};
	for (const callbackPath of collectMattermostCallbackPaths(api.config.channels?.mattermost)) api.registerHttpRoute({
		path: callbackPath,
		auth: "plugin",
		handler: routeHandler
	});
}
export { resolveSlashCommandConfig as C, resolveCallbackUrl as S, resolveMattermostModelPickerCurrentModel as _, deliverMattermostReplyPayload as a, isSlashCommandsEnabled as b, canFinalizeMattermostPreviewInPlace as c, resolveMattermostReplyRootId as d, resolveMattermostThreadSessionContext as f, renderMattermostProviderPickerView as g, renderMattermostModelsPickerView as h, registerSlashCommandRoute as i, formatMattermostFinalDeliveryOutcomeLog as l, parseMattermostModelPickerContext as m, deactivateSlashCommands as n, joinMattermostVisibleContent as o, shouldUpdateMattermostDraftToolProgress as p, getSlashCommandState as r, buildMattermostButtonInteractionMessageSid as s, activateSlashCommands as t, resolveMattermostInteractionReplyRootId as u, DEFAULT_COMMAND_SPECS as v, registerSlashCommands as x, cleanupSlashCommands as y };
