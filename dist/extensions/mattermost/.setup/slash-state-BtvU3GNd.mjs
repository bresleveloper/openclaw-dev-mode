import { t as getMattermostRuntime } from "./runtime-CNB4YGqJ.mjs";
import { n as normalizeCallbackPath, r as resolveCallbackHost, t as collectMattermostCallbackPaths } from "./callback-host-CBsPjVAZ.mjs";
import { r as createMattermostClient, s as fetchMattermostChannel, v as sendMattermostTyping } from "./client-f2qstbX3.mjs";
import { D as sendHttpRequestRejection, b as logTypingFailure, h as isRequestBodyLimitError, i as normalizeMattermostAllowList, l as buildPreparedModelsProviderData, p as createWebhookInFlightLimiter, t as authorizeMattermostCommandInvocation, x as readRequestBodyWithLimit } from "./monitor-auth-aZ0b1gqx.mjs";
import { a as resolveMattermostPresentation, i as requiresMattermostMediaUpload } from "./normalize-DhF6_2lt.mjs";
import { t as sendMessageMattermost } from "./send-BI4525Fd.mjs";
import { createHash } from "node:crypto";
import { safeEqualSecret } from "openclaw/plugin-sdk/security-runtime";
import { asFiniteNumber, normalizeOptionalString, normalizeStringifiedOptionalString, readStringField } from "openclaw/plugin-sdk/string-coerce-runtime";
import { truncateUtf16Safe, truncateUtf8Prefix } from "openclaw/plugin-sdk/text-utility-runtime";
import { createAcceptedChannelDeliveryResult, createChannelPartialDeliveryError, isChannelPartialDeliveryError } from "openclaw/plugin-sdk/channel-inbound";
import { asDateTimestampMs, parseStrictInteger, resolveExpiresAtMsFromDurationMs } from "openclaw/plugin-sdk/number-runtime";
import { resolveStoredModelOverride } from "openclaw/plugin-sdk/command-auth-native";
import { deliverTextOrMediaReply, isReasoningReplyPayload, resolveSendableOutboundReplyParts } from "openclaw/plugin-sdk/reply-payload";
import { resolveGlobalMap } from "openclaw/plugin-sdk/global-singleton";
import { resolveHumanDelayConfig } from "openclaw/plugin-sdk/agent-runtime";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
import { finalizeInboundContext } from "openclaw/plugin-sdk/reply-runtime";
import { getSessionEntry, resolveStorePath } from "openclaw/plugin-sdk/session-store-runtime";
import { normalizeProviderId } from "openclaw/plugin-sdk/provider-model-shared";
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
			response_url: read("response_url")
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
//#endregion
//#region extensions/mattermost/src/mattermost/model-picker.ts
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
function paginateItems(items, page, pageSize = MODELS_PAGE_SIZE) {
	const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
	const safePage = Math.max(1, Math.min(normalizePage(page), totalPages));
	const start = (safePage - 1) * pageSize;
	return {
		items: items.slice(start, start + pageSize),
		page: safePage,
		totalPages,
		hasPrev: safePage > 1,
		hasNext: safePage < totalPages,
		totalItems: items.length
	};
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
function getProviderModels(data, provider) {
	return [...data.byProvider.get(normalizeProviderId(provider)) ?? /* @__PURE__ */ new Set()].toSorted();
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
function buildMattermostAllowedModelRefs(data) {
	const refs = /* @__PURE__ */ new Set();
	for (const provider of data.providers) for (const model of data.byProvider.get(provider) ?? []) refs.add(`${provider}/${model}`);
	return refs;
}
function resolveMattermostModelPickerCurrentModel(params) {
	const fallback = `${params.data.resolvedDefault.provider}/${params.data.resolvedDefault.model}`;
	try {
		const storePath = resolveStorePath(params.cfg.session?.store, { agentId: params.route.agentId });
		const loadSessionEntry = (sessionKey) => getSessionEntry({
			storePath,
			sessionKey,
			...params.readConsistency === "latest" ? { readConsistency: "latest" } : {}
		});
		const sessionEntry = loadSessionEntry(params.route.sessionKey);
		const override = resolveStoredModelOverride({
			sessionEntry,
			loadSessionEntry,
			sessionKey: params.route.sessionKey,
			parentSessionKey: sessionEntry?.parentSessionKey,
			defaultProvider: params.data.resolvedDefault.provider
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
	const models = getProviderModels(params.data, provider);
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
	const page = paginateItems(models, params.page);
	const rows = page.items.map((model) => {
		const isCurrent = current?.provider === provider && current?.model === model;
		return [buildButton({
			action: "select",
			ownerUserId: params.ownerUserId,
			text: isCurrent ? `${model} [current]` : model,
			provider,
			model,
			page: page.page,
			style: isCurrent ? "primary" : "default"
		})];
	});
	const navRow = [];
	if (page.hasPrev) navRow.push(buildButton({
		action: "list",
		ownerUserId: params.ownerUserId,
		text: "Prev",
		provider,
		page: page.page - 1
	}));
	if (page.hasNext) navRow.push(buildButton({
		action: "list",
		ownerUserId: params.ownerUserId,
		text: "Next",
		provider,
		page: page.page + 1
	}));
	if (navRow.length > 0) rows.push(navRow);
	rows.push([buildButton({
		action: "back",
		ownerUserId: params.ownerUserId,
		text: "Back to providers"
	})]);
	return {
		text: [
			`Models (${provider}) - ${page.totalItems} available`,
			formatCurrentModelLine(params.currentModel),
			`Page ${page.page}/${page.totalPages}`,
			"Select a model to switch immediately."
		].join("\n"),
		buttons: rows
	};
}
//#endregion
//#region extensions/mattermost/src/mattermost/reply-delivery.ts
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
	const chunkMode = params.core.channel.text.resolveChunkMode(params.cfg, "mattermost", params.accountId);
	const results = [];
	const acceptedContents = [];
	const sendAccepted = async (text, mediaUrl) => {
		const result = await params.sendMessage(`channel:${params.channelId}`, text, {
			cfg: params.cfg,
			accountId: params.accountId,
			...mediaUrl ? {
				mediaUrl,
				mediaLocalRoots
			} : {},
			...requiresMattermostMediaUpload(mediaUrl) ? { requireMediaUpload: true } : {},
			...results.length === 0 && reply.mediaUrls.length < 2 && presentation.buttons.length ? { buttons: presentation.buttons } : {},
			replyToId: params.replyToId
		});
		results.push(result);
		acceptedContents.push(result.content);
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
		const failedPartial = isChannelPartialDeliveryError(error) ? error.deliveryResult : void 0;
		if (results.length === 0 && failedPartial?.visibleReplySent !== true) throw error;
		throw createChannelPartialDeliveryError(error, createAcceptedChannelDeliveryResult({
			results: results.map((result) => ({ receipt: result.receipt })),
			deliveryResults: failedPartial ? [failedPartial] : [],
			kind: reply.mediaUrls.length > 0 ? "media" : "text",
			...params.replyToId ? { replyToId: params.replyToId } : {},
			content: joinMattermostVisibleContent([...acceptedContents, failedPartial?.content])
		}));
	}
	if (outcome === "empty") return {
		outcome,
		visibleReplySent: false,
		suppression: { reason: "no_visible_result" }
	};
	return {
		outcome,
		...createAcceptedChannelDeliveryResult({
			results: results.map((result) => ({ receipt: result.receipt })),
			kind: outcome,
			...params.replyToId ? { replyToId: params.replyToId } : {},
			content: joinMattermostVisibleContent(acceptedContents)
		})
	};
}
//#endregion
//#region extensions/mattermost/src/mattermost/slash-http.ts
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
const SECRET_LOG_KEYS = /* @__PURE__ */ new Set([
	"access_token",
	"authorization",
	"bottoken",
	"client_secret",
	"refresh_token",
	"token"
]);
function sendSlashCommandResponse(res, status, body) {
	res.statusCode = status;
	res.setHeader("Content-Type", "application/json; charset=utf-8");
	res.end(JSON.stringify(body));
}
function findRegisteredCommandForPayload(params) {
	const trigger = normalizeSlashCommandTrigger(params.payload.command);
	return params.registeredCommands.find((cmd) => cmd.teamId === params.payload.team_id && cmd.trigger === trigger);
}
function isDeletedMattermostCommand(command) {
	return typeof command.delete_at === "number" && command.delete_at > 0;
}
function sanitizeCommandLookupError(error) {
	const sanitized = (error instanceof Error ? error.message : String(error)).replace(/[\r\n\t]/gu, " ").replace(/https?:\/\/[^\s)\]}]+/giu, (urlText) => {
		try {
			const url = new URL(urlText);
			if (url.username || url.password) {
				url.username = "redacted";
				url.password = "redacted";
			}
			for (const key of url.searchParams.keys()) if (SECRET_LOG_KEYS.has(key.toLowerCase())) url.searchParams.set(key, "redacted");
			return url.toString();
		} catch {
			return urlText;
		}
	}).replace(/(^|[^\w-])(Bearer|Token)\s+[A-Za-z0-9._~+/=-]+/giu, "$1$2 [redacted]").replace(/\b(token|authorization|access_token|refresh_token|client_secret|botToken)\b(\s*["']?\s*(?:=|:)\s*["']?)[^"',\s;}]+/giu, "$1$2[redacted]");
	return truncateUtf16Safe(sanitized, 300);
}
function sanitizeMattermostLogValue(value) {
	return truncateUtf16Safe(value.replace(/[\r\n\t]/gu, " "), 200);
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
	const validNow = asDateTimestampMs(now);
	if (validNow === void 0) {
		commandValidationFailureCache.clear();
		return;
	}
	for (const [key, entry] of commandValidationFailureCache) {
		const expiresAt = asDateTimestampMs(entry.expiresAt);
		if (expiresAt === void 0 || expiresAt <= validNow) commandValidationFailureCache.delete(key);
	}
	pruneMapToMaxSize(commandValidationFailureCache, COMMAND_VALIDATION_FAILURE_CACHE_MAX_KEYS);
}
function hasCachedCommandValidationFailure(key, now = Date.now()) {
	sweepCommandValidationFailureCache(now);
	return commandValidationFailureCache.has(key);
}
function cacheCommandValidationFailure(key, accountId) {
	const now = Date.now();
	sweepCommandValidationFailureCache(now);
	const expiresAt = resolveExpiresAtMsFromDurationMs(COMMAND_VALIDATION_FAILURE_CACHE_MS, { nowMs: now });
	if (expiresAt === void 0) {
		commandValidationFailureCache.delete(key);
		return;
	}
	commandValidationFailureCache.set(key, {
		accountId,
		expiresAt
	});
}
function sweepCommandValidationLookupRateLimit(now = Date.now()) {
	const validNow = asDateTimestampMs(now);
	if (validNow === void 0) {
		commandValidationLookupRateLimit.clear();
		return;
	}
	const staleAfterMs = COMMAND_VALIDATION_LOOKUP_REFILL_MS * COMMAND_VALIDATION_LOOKUP_BURST * 2;
	for (const [key, entry] of commandValidationLookupRateLimit) {
		const updatedAt = asDateTimestampMs(entry.updatedAt);
		if (updatedAt === void 0 || validNow - updatedAt > staleAfterMs) commandValidationLookupRateLimit.delete(key);
	}
	pruneMapToMaxSize(commandValidationLookupRateLimit, COMMAND_VALIDATION_LOOKUP_RATE_LIMIT_MAX_KEYS);
}
function reserveCommandValidationLookup(params) {
	const rawNow = params.now ?? Date.now();
	const now = asDateTimestampMs(rawNow);
	if (now === void 0) {
		commandValidationLookupRateLimit.clear();
		return { allowed: true };
	}
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
		commandLookupFallbackDetail = `command lookup by id returned deleted command ${sanitizeMattermostLogValue(commandLookupResult.id)}`;
	} catch (err) {
		commandLookupError = err;
	}
	try {
		const currentCommands = await withCommandLookupTimeout((signal) => listMattermostCommands(params.client, params.registered.teamId, { signal }));
		if (commandLookupError) params.log?.(`mattermost: slash command lookup by id failed for /${sanitizeMattermostLogValue(params.registered.trigger)}; using team list fallback: ${sanitizeCommandLookupError(commandLookupError)}`);
		else if (commandLookupFallbackDetail) params.log?.(`mattermost: slash ${commandLookupFallbackDetail} for /${sanitizeMattermostLogValue(params.registered.trigger)}; using team list fallback`);
		return currentCommands.find((cmd) => cmd.id === params.registered.id) ?? commandLookupResult;
	} catch (err) {
		const primaryDetail = commandLookupError ? `; command lookup: ${sanitizeCommandLookupError(commandLookupError)}` : commandLookupFallbackDetail ? `; command lookup: ${commandLookupFallbackDetail}` : "";
		params.log?.(`mattermost: slash command registration check failed for /${sanitizeMattermostLogValue(params.registered.trigger)}: ${sanitizeCommandLookupError(err)}${primaryDetail}`);
		return null;
	}
}
async function fetchCurrentMattermostCommand(params) {
	const key = commandLookupKey(params.client, params.registered, params.accountId);
	const existing = commandLookupInflight.get(key);
	if (existing) return await existing.promise;
	const lookup = fetchCurrentMattermostCommandUncached(params).finally(() => {
		commandLookupInflight.delete(key);
	});
	commandLookupInflight.set(key, {
		accountId: params.accountId,
		promise: lookup
	});
	return await lookup;
}
async function validateMattermostSlashCommandToken(params) {
	const lookupKey = commandLookupKey(params.client, params.registeredCommand, params.accountId);
	if (hasCachedCommandValidationFailure(lookupKey)) return false;
	if (!commandLookupInflight.has(lookupKey)) {
		const reservation = reserveCommandValidationLookup({
			key: lookupKey,
			accountId: params.accountId
		});
		if (!reservation.allowed) {
			if (reservation.shouldLog) params.log?.(`mattermost: slash command validation lookup rate-limited for /${sanitizeMattermostLogValue(params.registeredCommand.trigger)}`);
			return false;
		}
	}
	const current = await fetchCurrentMattermostCommand({
		accountId: params.accountId,
		client: params.client,
		registered: params.registeredCommand,
		log: params.log
	});
	if (!current || isDeletedMattermostCommand(current)) {
		cacheCommandValidationFailure(lookupKey, params.accountId);
		return false;
	}
	if (current.id !== params.registeredCommand.id || current.team_id !== params.registeredCommand.teamId || current.trigger !== params.registeredCommand.trigger || current.method !== "P" || current.url !== params.registeredCommand.url) {
		cacheCommandValidationFailure(lookupKey, params.accountId);
		return false;
	}
	if (!current.token || !safeEqualSecret(params.payload.token, current.token)) {
		cacheCommandValidationFailure(lookupKey, params.accountId);
		return false;
	}
	commandValidationFailureCache.delete(lookupKey);
	return true;
}
async function authorizeSlashInvocation(params) {
	const { account, cfg, client, commandText, channelId, senderId, senderName, log } = params;
	const core = getMattermostRuntime();
	let channelInfo = null;
	try {
		channelInfo = await fetchMattermostChannel(client, channelId);
	} catch (err) {
		log?.(`mattermost: slash channel lookup failed for ${sanitizeMattermostLogValue(channelId)}: ${sanitizeCommandLookupError(err)}`);
	}
	if (!channelInfo) return {
		ok: false,
		denyResponse: {
			response_type: "ephemeral",
			text: "Temporary error: unable to determine channel type. Please try again."
		}
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
				denyResponse: {
					response_type: "ephemeral",
					text: core.channel.pairing.buildPairingReply({
						channel: "mattermost",
						idLine: `Your Mattermost user id: ${senderId}`,
						code
					})
				}
			};
		}
		return {
			ok: false,
			denyResponse: {
				response_type: "ephemeral",
				text: decision.denyReason === "unknown-channel" ? "Temporary error: unable to determine channel type. Please try again." : decision.denyReason === "dm-disabled" ? "This bot is not accepting direct messages." : decision.denyReason === "channels-disabled" ? "Slash commands are disabled in channels." : decision.denyReason === "channel-no-allowlist" ? "Slash commands are not configured for this channel (no allowlist)." : "Unauthorized."
			}
		};
	}
	return decision;
}
function createSlashCommandHttpHandler(params) {
	const { account, cfg, runtime, registeredCommands, triggerMap, log, bodyTimeoutMs } = params;
	return async (req, res, bufferedBody, onRequestAuthenticated) => {
		if (req.method !== "POST") {
			res.statusCode = 405;
			res.setHeader("Allow", "POST");
			res.end("Method Not Allowed");
			return;
		}
		let body;
		try {
			body = bufferedBody ?? await readRequestBodyWithLimit(req, {
				maxBytes: MAX_BODY_BYTES,
				timeoutMs: bodyTimeoutMs ?? BODY_READ_TIMEOUT_MS,
				destroyOnLimit: false
			});
		} catch (error) {
			if (isRequestBodyLimitError(error, "REQUEST_BODY_TIMEOUT")) {
				await sendHttpRequestRejection(req, res, 408, "Request body timeout");
				return;
			}
			await sendHttpRequestRejection(req, res, 413, "Payload Too Large");
			return;
		}
		const contentType = req.headers["content-type"] ?? "";
		const payload = parseSlashCommandPayload(body, contentType);
		if (!payload) {
			sendSlashCommandResponse(res, 400, {
				response_type: "ephemeral",
				text: "Invalid slash command payload."
			});
			return;
		}
		const registeredCommand = findRegisteredCommandForPayload({
			registeredCommands,
			payload
		});
		if (!registeredCommand || !safeEqualSecret(payload.token, registeredCommand.token)) {
			sendSlashCommandResponse(res, 401, {
				response_type: "ephemeral",
				text: "Unauthorized: invalid command token."
			});
			return;
		}
		const client = createMattermostClient({
			baseUrl: account.baseUrl ?? "",
			botToken: account.botToken ?? "",
			allowPrivateNetwork: account.config.network?.dangerouslyAllowPrivateNetwork === true
		});
		if (!await validateMattermostSlashCommandToken({
			accountId: account.accountId,
			client,
			registeredCommand,
			payload,
			log
		})) {
			sendSlashCommandResponse(res, 401, {
				response_type: "ephemeral",
				text: "Unauthorized: invalid command token."
			});
			return;
		}
		onRequestAuthenticated?.();
		const trigger = normalizeSlashCommandTrigger(payload.command);
		const commandText = resolveCommandText(trigger, payload.text, triggerMap);
		const channelId = payload.channel_id;
		const senderId = payload.user_id;
		const senderName = payload.user_name ?? senderId;
		const auth = await authorizeSlashInvocation({
			account,
			cfg,
			client,
			commandText,
			channelId,
			senderId,
			senderName,
			log
		});
		if (!auth.ok) {
			sendSlashCommandResponse(res, 200, auth.denyResponse);
			return;
		}
		log?.(`mattermost: slash command /${sanitizeMattermostLogValue(trigger)} from ${sanitizeMattermostLogValue(senderName)} in ${sanitizeMattermostLogValue(channelId)}`);
		sendSlashCommandResponse(res, 200, {
			response_type: "ephemeral",
			text: "Processing..."
		});
		try {
			await handleSlashCommandAsync({
				account,
				cfg,
				runtime,
				client,
				commandText,
				channelId,
				senderId,
				senderName,
				teamId: payload.team_id,
				triggerId: payload.trigger_id,
				kind: auth.kind,
				chatType: auth.chatType,
				channelDisplay: auth.channelDisplay,
				roomLabel: auth.roomLabel,
				commandAuthorized: auth.commandAuthorized,
				log
			});
		} catch (err) {
			log?.(`mattermost: slash command handler error: ${sanitizeCommandLookupError(err)}`);
			try {
				const to = `channel:${channelId}`;
				await sendMessageMattermost(to, "Sorry, something went wrong processing that command.", {
					cfg,
					accountId: account.accountId
				});
			} catch {}
		}
	};
}
async function handleSlashCommandAsync(params) {
	const { account, cfg, runtime, client, commandText, channelId, senderId, senderName, teamId, kind, chatType, channelDisplay, roomLabel, commandAuthorized, triggerId, log } = params;
	const core = getMattermostRuntime();
	const route = core.channel.routing.resolveAgentRoute({
		cfg,
		channel: "mattermost",
		accountId: account.accountId,
		teamId,
		peer: {
			kind,
			id: kind === "direct" ? senderId : channelId
		}
	});
	const fromLabel = kind === "direct" ? `Mattermost DM from ${senderName}` : `Mattermost message in ${roomLabel} from ${senderName}`;
	const to = kind === "direct" ? `user:${senderId}` : `channel:${channelId}`;
	const pickerEntry = resolveMattermostModelPickerEntry(commandText);
	if (pickerEntry) {
		const sessionEntry = getSessionEntry({
			storePath: resolveStorePath(cfg.session?.store, { agentId: route.agentId }),
			sessionKey: route.sessionKey,
			readConsistency: "latest"
		});
		const data = await buildPreparedModelsProviderData(cfg, route.agentId, { sessionEntry });
		if (data.providers.length === 0) {
			await sendMessageMattermost(`channel:${channelId}`, [data.refreshWarning, "No models available."].filter(Boolean).join("\n\n"), {
				cfg,
				accountId: account.accountId
			});
			return;
		}
		const viewParams = {
			ownerUserId: senderId,
			data,
			currentModel: resolveMattermostModelPickerCurrentModel({
				cfg,
				route,
				data
			})
		};
		const view = pickerEntry.kind === "summary" ? renderMattermostModelSummaryView(viewParams) : pickerEntry.kind === "providers" ? renderMattermostProviderPickerView(viewParams) : renderMattermostModelsPickerView({
			...viewParams,
			provider: pickerEntry.provider,
			page: 1
		});
		await sendMessageMattermost(`channel:${channelId}`, [data.refreshWarning, view.text].filter(Boolean).join("\n\n"), {
			cfg,
			accountId: account.accountId,
			buttons: view.buttons
		});
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
		MessageSid: triggerId ?? `slash-${Date.now()}`,
		Timestamp: Date.now(),
		WasMentioned: true,
		CommandAuthorized: commandAuthorized,
		InboundAccessAuthorized: true,
		CommandSource: "native",
		OriginatingChannel: "mattermost",
		OriginatingTo: to
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
			deliver: async (payload) => {
				const result = await deliverMattermostReplyPayload({
					core,
					cfg,
					payload,
					channelId,
					accountId: account.accountId,
					agentId: route.agentId,
					textLimit,
					tableMode,
					sendMessage: sendMessageMattermost
				});
				if (result.visibleReplySent) runtime.log?.(`delivered slash reply to ${to}`);
				return result;
			},
			onError: (err, info) => {
				runtime.error?.(`mattermost slash ${info.kind} reply failed: ${sanitizeCommandLookupError(err)}`);
			}
		},
		replyPipeline: { typing: {
			start: () => sendMattermostTyping(client, { channelId }),
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
}
//#endregion
//#region extensions/mattermost/src/mattermost/slash-state.ts
const MULTI_ACCOUNT_BODY_MAX_BYTES = 65536;
const MULTI_ACCOUNT_BODY_TIMEOUT_MS = 5e3;
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
			source,
			handler: match.handler,
			accountIds: [match.accountId]
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
	const { account, commandTokens, registeredCommands, triggerMap, api, log } = params;
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
		commandTokens: new Set(commandTokens),
		registeredCommands,
		handler
	});
	log?.(`mattermost: slash commands activated for account ${accountId} (${registeredCommands.length} commands)`);
}
function deactivateSlashCommands(accountId) {
	for (const [stateAccountId, state] of accountStates) {
		if (accountId && stateAccountId !== accountId) continue;
		state.commandTokens.clear();
		state.registeredCommands = [];
		state.handler = null;
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
			sendSlashCommandResponse(res, 503, {
				response_type: "ephemeral",
				text: "Slash commands are not yet initialized. Please try again in a moment."
			});
			return;
		}
		if (accountStates.size === 1) {
			const state = accountStates.values().next().value;
			if (!state?.handler) {
				sendSlashCommandResponse(res, 503, {
					response_type: "ephemeral",
					text: "Slash commands are not yet initialized. Please try again in a moment."
				});
				return;
			}
			await state.handler(req, res, void 0, onRequestAuthenticated);
			return;
		}
		let bodyStr;
		try {
			bodyStr = await readRequestBodyWithLimit(req, {
				maxBytes: MULTI_ACCOUNT_BODY_MAX_BYTES,
				timeoutMs: MULTI_ACCOUNT_BODY_TIMEOUT_MS,
				destroyOnLimit: false
			});
		} catch (error) {
			if (isRequestBodyLimitError(error, "REQUEST_BODY_TIMEOUT")) {
				await sendHttpRequestRejection(req, res, 408, "Request body timeout");
				return;
			}
			await sendHttpRequestRejection(req, res, 413, "Payload Too Large");
			return;
		}
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
			sendSlashCommandResponse(res, 401, {
				response_type: "ephemeral",
				text: "Unauthorized: invalid command token."
			});
			return;
		}
		if (match.kind === "ambiguous") {
			api.logger.warn?.(`mattermost: slash callback matched multiple accounts via ${match.source} (${match.accountIds.join(", ")})`);
			sendSlashCommandResponse(res, 409, {
				response_type: "ephemeral",
				text: match.source === "token" ? "Conflict: command token is not unique across accounts." : "Conflict: slash command is not unique across accounts."
			});
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
//#endregion
export { resolveSlashCommandConfig as _, deliverMattermostReplyPayload as a, parseMattermostModelPickerContext as c, resolveMattermostModelPickerCurrentModel as d, DEFAULT_COMMAND_SPECS as f, resolveCallbackUrl as g, registerSlashCommands as h, registerSlashCommandRoute as i, renderMattermostModelsPickerView as l, isSlashCommandsEnabled as m, deactivateSlashCommands as n, joinMattermostVisibleContent as o, cleanupSlashCommands as p, getSlashCommandState as r, buildMattermostAllowedModelRefs as s, activateSlashCommands as t, renderMattermostProviderPickerView as u };
