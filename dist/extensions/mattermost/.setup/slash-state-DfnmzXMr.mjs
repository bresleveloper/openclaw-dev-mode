import { t as getMattermostRuntime } from "./runtime-CNB4YGqJ.mjs";
import { c as setInteractionSecret, l as isWildcardBindHost, n as buildButtonProps, o as resolveInteractionCallbackUrl } from "./interactions-rBQWCbK8.mjs";
import { a as createMattermostPost, b as uploadMattermostFile, c as fetchMattermostChannelByName, d as fetchMattermostUser, f as fetchMattermostUserByUsername, g as parseMattermostApiStatus, h as normalizeMattermostBaseUrl, i as createMattermostDirectChannelWithRetry, p as fetchMattermostUserTeams, r as createMattermostClient, s as fetchMattermostChannel, u as fetchMattermostMe, v as sendMattermostTyping } from "./client-BSSVve1x.mjs";
import { D as sendHttpRequestRejection, b as logTypingFailure, h as isRequestBodyLimitError, i as normalizeMattermostAllowList, l as buildPreparedModelsProviderData, o as resolveMattermostTrustedChatKind, p as createWebhookInFlightLimiter, t as authorizeMattermostCommandInvocation, v as loadOutboundMediaFromUrl, x as readRequestBodyWithLimit } from "./monitor-auth-CCpN0z_f.mjs";
import { a as resolveMattermostPresentation, i as requiresMattermostMediaUpload, u as resolveMattermostAccount } from "./normalize-DM54w7ud.mjs";
import { createHash } from "node:crypto";
import { safeEqualSecret } from "openclaw/plugin-sdk/security-runtime";
import { asFiniteNumber, normalizeLowercaseStringOrEmpty, normalizeOptionalString, normalizeStringifiedOptionalString, readStringField } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createAcceptedChannelDeliveryResult, createChannelPartialDeliveryError, isChannelPartialDeliveryError } from "openclaw/plugin-sdk/channel-inbound";
import { asDateTimestampMs, parseStrictInteger, resolveExpiresAtMsFromDurationMs } from "openclaw/plugin-sdk/number-runtime";
import { isPrivateNetworkOptInEnabled } from "openclaw/plugin-sdk/ssrf-runtime";
import { createMessageReceiptFromOutboundResults, listMessageReceiptPlatformIds } from "openclaw/plugin-sdk/channel-outbound";
import { resolveStoredModelOverride } from "openclaw/plugin-sdk/command-auth-native";
import { resolveChannelMediaMaxBytes } from "openclaw/plugin-sdk/account-helpers";
import { deliverTextOrMediaReply, isReasoningReplyPayload, resolveSendableOutboundReplyParts } from "openclaw/plugin-sdk/reply-payload";
import { FormatCapabilityProfile, convertMarkdownTables } from "openclaw/plugin-sdk/text-chunking";
import { getSessionEntry, resolveStorePath } from "openclaw/plugin-sdk/session-store-runtime";
import { getAgentScopedMediaLocalRoots } from "openclaw/plugin-sdk/media-runtime";
import { normalizeProviderId } from "openclaw/plugin-sdk/provider-model-shared";
import { truncateUtf16Safe, truncateUtf8Prefix } from "openclaw/plugin-sdk/text-utility-runtime";
import { resolveHumanDelayConfig } from "openclaw/plugin-sdk/agent-runtime";
import { finalizeInboundContext } from "openclaw/plugin-sdk/reply-runtime";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
import { resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
import { extensionForMime } from "openclaw/plugin-sdk/media-mime";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
const MATTERMOST_COMMAND_DESCRIPTION_MAX_BYTES = 128;
/**
* Built-in OpenClaw commands to register as native slash commands.
* These mirror the text-based commands already handled by the gateway.
*/
const DEFAULT_COMMAND_SPECS = [
	{
		trigger: "oc_status",
		originalName: "status",
		description: "Show session status (model, usage, uptime)",
		autoComplete: true
	},
	{
		trigger: "oc_model",
		originalName: "model",
		description: "View or change the current model",
		autoComplete: true,
		autoCompleteHint: "[model-name] [--runtime runtime]"
	},
	{
		trigger: "oc_models",
		originalName: "models",
		description: "Browse available models",
		autoComplete: true,
		autoCompleteHint: "[provider]"
	},
	{
		trigger: "oc_new",
		originalName: "new",
		description: "Start a new conversation session",
		autoComplete: true
	},
	{
		trigger: "oc_help",
		originalName: "help",
		description: "Show available commands",
		autoComplete: true
	},
	{
		trigger: "oc_think",
		originalName: "think",
		description: "Set thinking/reasoning level",
		autoComplete: true,
		autoCompleteHint: "[off|low|medium|high]"
	},
	{
		trigger: "oc_reasoning",
		originalName: "reasoning",
		description: "Toggle reasoning mode",
		autoComplete: true,
		autoCompleteHint: "[on|off]"
	},
	{
		trigger: "oc_verbose",
		originalName: "verbose",
		description: "Toggle verbose mode",
		autoComplete: true,
		autoCompleteHint: "[on|off]"
	},
	{
		trigger: "oc_queue",
		originalName: "queue",
		description: "Adjust active-run queue behavior",
		autoComplete: true,
		autoCompleteHint: "[steer|followup|collect|interrupt] [debounce:2s] [cap:N] [drop:old|new|summarize]"
	}
];
/**
* List existing custom slash commands for a team.
*/
async function listMattermostCommands(client, teamId, init) {
	return await client.request(`/commands?team_id=${encodeURIComponent(teamId)}&custom_only=true`, init);
}
/**
* Get a custom slash command by id.
*/
async function getMattermostCommand(client, commandId, init) {
	return await client.request(`/commands/${encodeURIComponent(commandId)}`, init);
}
/**
* Create a custom slash command on a Mattermost team.
*/
async function createMattermostCommand(client, params) {
	return await client.request("/commands", {
		method: "POST",
		body: JSON.stringify(params)
	});
}
/**
* Delete a custom slash command.
*/
async function deleteMattermostCommand(client, commandId) {
	await client.request(`/commands/${encodeURIComponent(commandId)}`, { method: "DELETE" });
}
/**
* Update an existing custom slash command.
*/
async function updateMattermostCommand(client, params) {
	return await client.request(`/commands/${encodeURIComponent(params.id)}`, {
		method: "PUT",
		body: JSON.stringify(params)
	});
}
/**
* Register all OpenClaw slash commands for a given team.
* Skips commands that are already registered with the same trigger + callback URL.
* Returns the list of newly created command IDs.
*/
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
		const foreignCommands = existingForTrigger.filter((cmd) => cmd.creator_id?.trim() !== normalizedCreatorUserId);
		if (ownedCommands.length === 0 && foreignCommands.length > 0) {
			log?.(`mattermost: trigger /${spec.trigger} already used by non-OpenClaw command(s); skipping to avoid mutating external integrations`);
			continue;
		}
		if (ownedCommands.length > 1) log?.(`mattermost: multiple owned commands found for /${spec.trigger}; using the first and leaving extras untouched`);
		const existingCmd = ownedCommands[0];
		const existingNeedsUpdate = existingCmd ? existingCmd.url !== callbackUrl || existingCmd.method !== "P" : false;
		if (existingCmd && !existingNeedsUpdate) {
			log?.(`mattermost: command /${spec.trigger} already registered (id=${existingCmd.id})`);
			registered.push({
				id: existingCmd.id,
				trigger: spec.trigger,
				teamId,
				token: existingCmd.token,
				url: callbackUrl,
				managed: false
			});
			continue;
		}
		if (existingCmd && existingNeedsUpdate) {
			log?.(`mattermost: command /${spec.trigger} exists with different callback settings; updating (id=${existingCmd.id})`);
			try {
				const updated = await updateMattermostCommand(client, {
					id: existingCmd.id,
					team_id: teamId,
					trigger: spec.trigger,
					method: "P",
					url: callbackUrl,
					description,
					auto_complete: spec.autoComplete,
					auto_complete_desc: description,
					auto_complete_hint: spec.autoCompleteHint
				});
				registered.push({
					id: updated.id,
					trigger: spec.trigger,
					teamId,
					token: updated.token,
					url: callbackUrl,
					managed: false
				});
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
			const created = await createMattermostCommand(client, {
				team_id: teamId,
				trigger: spec.trigger,
				method: "P",
				url: callbackUrl,
				description,
				auto_complete: spec.autoComplete,
				auto_complete_desc: description,
				auto_complete_hint: spec.autoCompleteHint
			});
			log?.(`mattermost: registered command /${spec.trigger} (id=${created.id})`);
			registered.push({
				id: created.id,
				trigger: spec.trigger,
				teamId,
				token: created.token,
				url: callbackUrl,
				managed: true
			});
		} catch (err) {
			log?.(`mattermost: failed to register command /${spec.trigger}: ${String(err)}`);
		}
	}
	return registered;
}
/**
* Clean up all registered slash commands.
*/
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
/**
* Parse a Mattermost slash command callback payload from a URL-encoded or JSON body.
*/
function parseSlashCommandPayload(body, contentType) {
	if (!body) return null;
	try {
		if (contentType?.includes("application/json")) {
			const parsed = JSON.parse(body);
			const token = typeof parsed.token === "string" ? parsed.token : "";
			const teamId = typeof parsed.team_id === "string" ? parsed.team_id : "";
			const channelId = typeof parsed.channel_id === "string" ? parsed.channel_id : "";
			const userId = typeof parsed.user_id === "string" ? parsed.user_id : "";
			const command = typeof parsed.command === "string" ? parsed.command : "";
			if (!token || !teamId || !channelId || !userId || !command) return null;
			return {
				token,
				team_id: teamId,
				team_domain: typeof parsed.team_domain === "string" ? parsed.team_domain : void 0,
				channel_id: channelId,
				channel_name: typeof parsed.channel_name === "string" ? parsed.channel_name : void 0,
				user_id: userId,
				user_name: typeof parsed.user_name === "string" ? parsed.user_name : void 0,
				command,
				text: typeof parsed.text === "string" ? parsed.text : "",
				trigger_id: typeof parsed.trigger_id === "string" ? parsed.trigger_id : void 0,
				response_url: typeof parsed.response_url === "string" ? parsed.response_url : void 0
			};
		}
		const params = new URLSearchParams(body);
		const token = params.get("token");
		const teamId = params.get("team_id");
		const channelId = params.get("channel_id");
		const userId = params.get("user_id");
		const command = params.get("command");
		if (!token || !teamId || !channelId || !userId || !command) return null;
		return {
			token,
			team_id: teamId,
			team_domain: params.get("team_domain") ?? void 0,
			channel_id: channelId,
			channel_name: params.get("channel_name") ?? void 0,
			user_id: userId,
			user_name: params.get("user_name") ?? void 0,
			command,
			text: params.get("text") ?? "",
			trigger_id: params.get("trigger_id") ?? void 0,
			response_url: params.get("response_url") ?? void 0
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
const DEFAULT_CALLBACK_PATH = "/api/channels/mattermost/command";
/**
* Ensure the callback path starts with a leading `/` to prevent
* malformed URLs like `http://host:portapi/...`.
*/
function normalizeCallbackPath(path) {
	const trimmed = path.trim();
	if (!trimmed) return DEFAULT_CALLBACK_PATH;
	return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}
function resolveSlashCommandConfig(raw) {
	return {
		native: raw?.native ?? "auto",
		nativeSkills: raw?.nativeSkills ?? "auto",
		callbackPath: normalizeCallbackPath(raw?.callbackPath ?? DEFAULT_CALLBACK_PATH),
		callbackUrl: normalizeOptionalString(raw?.callbackUrl)
	};
}
function isSlashCommandsEnabled(config) {
	if (config.native === true) return true;
	if (config.native === false) return false;
	return false;
}
/**
* Build the callback URL that Mattermost will POST to when a command is invoked.
*/
function resolveCallbackUrl(params) {
	if (params.config.callbackUrl) return params.config.callbackUrl;
	let host = params.gatewayHost && !isWildcardBindHost(params.gatewayHost) ? params.gatewayHost : "localhost";
	const path = normalizeCallbackPath(params.config.callbackPath);
	if (host.includes(":") && !(host.startsWith("[") && host.endsWith("]"))) host = `[${host}]`;
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
function readContextString(context, key, fallback = "") {
	return readStringField(context, key) ?? fallback;
}
function readContextNumber(context, key) {
	const value = context[key];
	return asFiniteNumber(value) ?? parseStrictInteger(value);
}
function normalizePage(value) {
	if (!Number.isFinite(value)) return 1;
	return Math.max(1, Math.floor(value));
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
function buildContext(state) {
	return {
		[MATTERMOST_MODEL_PICKER_CONTEXT_KEY]: true,
		...state
	};
}
function buildButtonId(state) {
	const digest = createHash("sha256").update(JSON.stringify(state)).digest("hex").slice(0, 12);
	return `${ACTION_IDS[state.action]}${digest}`;
}
function buildButton(params) {
	const baseState = params.action === "providers" || params.action === "back" ? {
		action: params.action,
		ownerUserId: params.ownerUserId
	} : params.action === "list" ? {
		action: "list",
		ownerUserId: params.ownerUserId,
		provider: normalizeProviderId(params.provider ?? ""),
		page: normalizePage(params.page)
	} : {
		action: "select",
		ownerUserId: params.ownerUserId,
		provider: normalizeProviderId(params.provider ?? ""),
		page: normalizePage(params.page),
		model: normalizeStringifiedOptionalString(params.model) ?? ""
	};
	return {
		id: buildButtonId(baseState),
		text: params.text,
		...params.style ? { style: params.style } : {},
		context: buildContext(baseState)
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
	const ownerUserId = normalizeOptionalString(readContextString(context, "ownerUserId")) ?? "";
	const action = normalizeOptionalString(readContextString(context, "action")) ?? "";
	if (!ownerUserId) return null;
	if (action === "providers" || action === "back") return {
		action,
		ownerUserId
	};
	const provider = normalizeProviderId(readContextString(context, "provider"));
	const page = readContextNumber(context, "page");
	if (!provider) return null;
	if (action === "list") return {
		action,
		ownerUserId,
		provider,
		page: normalizePage(page)
	};
	if (action === "select") {
		const model = normalizeOptionalString(readContextString(context, "model")) ?? "";
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
		const sessionEntry = getSessionEntry({
			storePath,
			sessionKey: params.route.sessionKey,
			...params.readConsistency === "latest" ? { readConsistency: "latest" } : {}
		});
		const override = resolveStoredModelOverride({
			sessionEntry,
			loadSessionEntry: (sessionKey) => getSessionEntry({
				storePath,
				sessionKey,
				...params.readConsistency === "latest" ? { readConsistency: "latest" } : {}
			}),
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
//#region extensions/mattermost/src/mattermost/target-resolution.ts
const MATTERMOST_OPAQUE_TARGET_CACHE_MAX_ENTRIES = 1024;
const MATTERMOST_OPAQUE_TARGET_CACHE_TTL_MS = 3e5;
const mattermostOpaqueTargetCache = /* @__PURE__ */ new Map();
function cacheMattermostOpaqueTarget(key, kind) {
	mattermostOpaqueTargetCache.set(key, {
		kind,
		expiresAt: Date.now() + MATTERMOST_OPAQUE_TARGET_CACHE_TTL_MS
	});
	pruneMapToMaxSize(mattermostOpaqueTargetCache, MATTERMOST_OPAQUE_TARGET_CACHE_MAX_ENTRIES);
}
function getCachedMattermostOpaqueTargetKind(key) {
	const cached = mattermostOpaqueTargetCache.get(key);
	if (!cached) return;
	if (cached.expiresAt <= Date.now()) {
		mattermostOpaqueTargetCache.delete(key);
		return;
	}
	return cached.kind;
}
function cacheKey$1(baseUrl, token, id) {
	return `${baseUrl}::${token}::${id}`;
}
/** Mattermost IDs are 26-character lowercase alphanumeric strings. */
function isMattermostId(value) {
	return /^[a-z0-9]{26}$/.test(value);
}
function parseMattermostTarget(raw) {
	const trimmed = raw.trim();
	if (!trimmed) throw new Error("Recipient is required for Mattermost sends");
	const lower = normalizeLowercaseStringOrEmpty(trimmed);
	if (lower.startsWith("channel:")) {
		const id = trimmed.slice(8).trim();
		if (!id) throw new Error("Channel id is required for Mattermost sends");
		if (id.startsWith("#")) {
			const name = id.slice(1).trim();
			if (!name) throw new Error("Channel name is required for Mattermost sends");
			return {
				kind: "channel-name",
				name
			};
		}
		if (!isMattermostId(id)) return {
			kind: "channel-name",
			name: id
		};
		return {
			kind: "channel",
			id
		};
	}
	if (lower.startsWith("user:")) {
		const id = trimmed.slice(5).trim();
		if (!id) throw new Error("User id is required for Mattermost sends");
		return {
			kind: "user",
			id
		};
	}
	if (lower.startsWith("mattermost:")) {
		const id = trimmed.slice(11).trim();
		if (!id) throw new Error("User id is required for Mattermost sends");
		return {
			kind: "user",
			id
		};
	}
	if (trimmed.startsWith("@")) {
		const username = trimmed.slice(1).trim();
		if (!username) throw new Error("Username is required for Mattermost sends");
		return {
			kind: "user",
			username
		};
	}
	if (trimmed.startsWith("#")) {
		const name = trimmed.slice(1).trim();
		if (!name) throw new Error("Channel name is required for Mattermost sends");
		return {
			kind: "channel-name",
			name
		};
	}
	if (!isMattermostId(trimmed)) return {
		kind: "channel-name",
		name: trimmed
	};
	return {
		kind: "channel",
		id: trimmed
	};
}
function isExplicitMattermostTarget(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return false;
	return /^(channel|user|mattermost):/i.test(trimmed) || trimmed.startsWith("@") || trimmed.startsWith("#");
}
async function resolveMattermostOpaqueTarget(params) {
	const input = params.input.trim();
	if (!input || isExplicitMattermostTarget(input) || !isMattermostId(input)) return null;
	let client;
	if ("client" in params) client = params.client;
	else {
		const account = resolveMattermostAccount({
			cfg: params.cfg,
			accountId: params.accountId
		});
		if (!account.enabled) throw new Error(`Mattermost account "${account.accountId}" is disabled`);
		const token = normalizeOptionalString(account.botToken);
		const baseUrl = normalizeMattermostBaseUrl(account.baseUrl);
		if (!token || !baseUrl) return null;
		client = createMattermostClient({
			baseUrl,
			botToken: token,
			allowPrivateNetwork: isPrivateNetworkOptInEnabled(account.config)
		});
	}
	const key = cacheKey$1(client.baseUrl, client.token, input);
	const cachedKind = getCachedMattermostOpaqueTargetKind(key);
	if (cachedKind) return {
		kind: cachedKind,
		id: input,
		to: cachedKind === "user" ? `user:${input}` : `channel:${input}`
	};
	try {
		await fetchMattermostUser(client, input);
		cacheMattermostOpaqueTarget(key, "user");
		return {
			kind: "user",
			id: input,
			to: `user:${input}`
		};
	} catch (err) {
		if (parseMattermostApiStatus(err) !== 404) return {
			kind: "channel",
			id: input,
			to: `channel:${input}`
		};
	}
	try {
		const channel = await fetchMattermostChannel(client, input);
		const channelKind = resolveMattermostTrustedChatKind({ channelType: channel.type }) === "group" ? "group" : "channel";
		cacheMattermostOpaqueTarget(key, channelKind);
		return {
			kind: channelKind,
			id: input,
			to: `channel:${input}`
		};
	} catch {
		return {
			kind: "channel",
			id: input,
			to: `channel:${input}`
		};
	}
}
//#endregion
//#region extensions/mattermost/src/mattermost/send.ts
const MATTERMOST_BOT_USER_CACHE_MAX_ENTRIES = 64;
const MATTERMOST_TARGET_CACHE_MAX_ENTRIES = 1024;
const MATTERMOST_FORMAT_PROFILE = FormatCapabilityProfile.define({
	mechanism: "markdown",
	chunk: {
		limit: 16383,
		unit: "chars"
	}
});
function renderMattermostMarkdown(markdown, tableMode) {
	return tableMode === "off" && MATTERMOST_FORMAT_PROFILE.constructs.table === "native" ? markdown : convertMarkdownTables(markdown, tableMode);
}
const botUserCache = /* @__PURE__ */ new Map();
const userByNameCache = /* @__PURE__ */ new Map();
const channelByNameCache = /* @__PURE__ */ new Map();
const dmChannelCache = /* @__PURE__ */ new Map();
function cacheOutboundEntry(cache, key, value, maxEntries) {
	cache.delete(key);
	cache.set(key, value);
	pruneMapToMaxSize(cache, maxEntries);
}
const getCore = () => getMattermostRuntime();
function createMattermostSendReceipt(params) {
	return createMessageReceiptFromOutboundResults({
		kind: params.kind,
		...params.replyToId ? { replyToId: params.replyToId } : {},
		results: [{
			channel: "mattermost",
			messageId: params.messageId,
			channelId: params.channelId
		}]
	});
}
function resolveMattermostReceiptKind(params) {
	if (params.fileIds?.length) return "media";
	if (params.buttons?.length || params.props) return "card";
	return "text";
}
function recordMattermostOutboundActivity(accountId) {
	try {
		getCore().channel.activity.record({
			channel: "mattermost",
			accountId,
			direction: "outbound"
		});
	} catch (error) {
		if (!(error instanceof Error) || error.message !== "Mattermost runtime not initialized") throw error;
	}
}
function cacheKey(baseUrl, token) {
	return `${baseUrl}::${token}`;
}
function normalizeMessage(text, mediaUrl) {
	return [normalizeOptionalString(text) ?? "", normalizeOptionalString(mediaUrl)].filter(Boolean).join("\n");
}
function isHttpUrl(value) {
	return /^https?:\/\//i.test(value);
}
async function resolveBotUser(client) {
	const key = cacheKey(client.baseUrl, client.token);
	const cached = botUserCache.get(key);
	if (cached) return cached;
	const user = await fetchMattermostMe(client);
	cacheOutboundEntry(botUserCache, key, user, MATTERMOST_BOT_USER_CACHE_MAX_ENTRIES);
	return user;
}
async function resolveUserIdByUsername(params) {
	const { client, username } = params;
	const key = `${cacheKey(client.baseUrl, client.token)}::${normalizeLowercaseStringOrEmpty(username)}`;
	const cached = userByNameCache.get(key);
	if (cached?.id) return cached.id;
	const user = await fetchMattermostUserByUsername(client, username);
	cacheOutboundEntry(userByNameCache, key, user, MATTERMOST_TARGET_CACHE_MAX_ENTRIES);
	return user.id;
}
async function resolveChannelIdByName(params) {
	const { client, name } = params;
	const key = `${cacheKey(client.baseUrl, client.token)}::channel::${normalizeLowercaseStringOrEmpty(name)}`;
	const cached = channelByNameCache.get(key);
	if (cached) return cached;
	const me = await fetchMattermostMe(client);
	const teams = await fetchMattermostUserTeams(client, me.id);
	for (const team of teams) try {
		const channel = await fetchMattermostChannelByName(client, team.id, name);
		if (channel?.id) {
			cacheOutboundEntry(channelByNameCache, key, channel.id, MATTERMOST_TARGET_CACHE_MAX_ENTRIES);
			return channel.id;
		}
	} catch (error) {
		if (parseMattermostApiStatus(error) !== 404) throw error;
	}
	throw new Error(`Mattermost channel "#${name}" not found in any team the bot belongs to`);
}
function mergeDmRetryOptions(base, override) {
	const merged = {
		maxRetries: override?.maxRetries ?? base?.maxRetries,
		initialDelayMs: override?.initialDelayMs ?? base?.initialDelayMs,
		maxDelayMs: override?.maxDelayMs ?? base?.maxDelayMs,
		timeoutMs: override?.timeoutMs ?? base?.timeoutMs,
		onRetry: override?.onRetry
	};
	if (merged.maxRetries === void 0 && merged.initialDelayMs === void 0 && merged.maxDelayMs === void 0 && merged.timeoutMs === void 0 && merged.onRetry === void 0) return;
	return merged;
}
async function resolveTargetChannelId(params) {
	if (params.target.kind === "channel") return params.target.id;
	if (params.target.kind === "channel-name") return await resolveChannelIdByName({
		client: params.client,
		name: params.target.name
	});
	const userId = params.target.id ? params.target.id : await resolveUserIdByUsername({
		client: params.client,
		username: params.target.username ?? ""
	});
	const dmKey = `${cacheKey(params.client.baseUrl, params.client.token)}::dm::${userId}`;
	const cachedDm = dmChannelCache.get(dmKey);
	if (cachedDm) return cachedDm;
	const botUser = await resolveBotUser(params.client);
	const channel = await createMattermostDirectChannelWithRetry(params.client, [botUser.id, userId], {
		...params.dmRetryOptions,
		onRetry: (attempt, delayMs, error) => {
			params.dmRetryOptions?.onRetry?.(attempt, delayMs, error);
			if (params.logger) params.logger.warn?.(`DM channel creation retry ${attempt} after ${delayMs}ms: ${error.message}`);
		}
	});
	cacheOutboundEntry(dmChannelCache, dmKey, channel.id, MATTERMOST_TARGET_CACHE_MAX_ENTRIES);
	return channel.id;
}
async function resolveMattermostSendContext(to, opts) {
	const core = getCore();
	const logger = core.logging.getChildLogger({ module: "mattermost" });
	if (!opts?.cfg) throw new Error("Mattermost send requires a resolved runtime config. Load and resolve config at the command or gateway boundary, then pass cfg through the runtime path.");
	const cfg = requireRuntimeConfig(opts.cfg, "Mattermost send");
	const account = resolveMattermostAccount({
		cfg,
		accountId: opts.accountId
	});
	const token = normalizeOptionalString(opts.botToken) ?? normalizeOptionalString(account.botToken);
	if (!token) throw new Error(`Mattermost bot token missing for account "${account.accountId}" (set channels.mattermost.accounts.${account.accountId}.botToken or MATTERMOST_BOT_TOKEN for default).`);
	const baseUrl = normalizeMattermostBaseUrl(opts.baseUrl ?? account.baseUrl);
	if (!baseUrl) throw new Error(`Mattermost baseUrl missing for account "${account.accountId}" (set channels.mattermost.accounts.${account.accountId}.baseUrl or MATTERMOST_URL for default).`);
	const client = createMattermostClient({
		baseUrl,
		botToken: token,
		allowPrivateNetwork: isPrivateNetworkOptInEnabled(account.config),
		assertRequestCurrent: opts.assertDirectAdapterHandoff
	});
	const dmRetryOptions = mergeDmRetryOptions(account.config.dmChannelRetry ? {
		maxRetries: account.config.dmChannelRetry.maxRetries,
		initialDelayMs: account.config.dmChannelRetry.initialDelayMs,
		maxDelayMs: account.config.dmChannelRetry.maxDelayMs,
		timeoutMs: account.config.dmChannelRetry.timeoutMs
	} : void 0, opts.dmRetryOptions);
	let channelId;
	try {
		const trimmedTo = normalizeOptionalString(to) ?? "";
		channelId = await resolveTargetChannelId({
			target: parseMattermostTarget((await resolveMattermostOpaqueTarget({
				input: trimmedTo,
				client
			}))?.to ?? trimmedTo),
			client,
			dmRetryOptions,
			logger: core.logging.shouldLogVerbose() ? logger : void 0
		});
	} catch (error) {
		client.assertRequestCurrent?.();
		throw error;
	}
	return {
		cfg,
		accountId: account.accountId,
		client,
		channelId,
		mediaMaxBytes: resolveChannelMediaMaxBytes({
			cfg,
			accountId: account.accountId,
			resolveChannelLimitMb: () => account.config.mediaMaxMb
		})
	};
}
async function sendMessageMattermost(to, text, opts) {
	const core = getCore();
	const logger = core.logging.getChildLogger({ module: "mattermost" });
	const { cfg, accountId, client, channelId, mediaMaxBytes } = await resolveMattermostSendContext(to, opts);
	client.assertRequestCurrent?.();
	let props = opts.props;
	if (!props && Array.isArray(opts.buttons) && opts.buttons.length > 0) {
		setInteractionSecret(accountId, client.token);
		props = buildButtonProps({
			callbackUrl: resolveInteractionCallbackUrl(accountId, {
				gateway: cfg.gateway,
				interactions: resolveMattermostAccount({
					cfg,
					accountId
				}).config?.interactions
			}),
			accountId,
			channelId,
			buttons: opts.buttons,
			text: opts.attachmentText
		});
	}
	let message = normalizeOptionalString(text) ?? "";
	let fileIds;
	let uploadError;
	const mediaUrl = opts.mediaUrl?.trim();
	if (mediaUrl) try {
		const media = await loadOutboundMediaFromUrl(mediaUrl, {
			maxBytes: mediaMaxBytes,
			mediaLocalRoots: opts.mediaLocalRoots,
			mediaReadFile: opts.mediaReadFile,
			workspaceDir: opts.workspaceDir
		});
		fileIds = [(await uploadMattermostFile(client, {
			channelId,
			buffer: media.buffer,
			fileName: media.fileName ?? `upload${extensionForMime(media.contentType) ?? ""}`,
			contentType: media.contentType ?? void 0
		})).id];
	} catch (err) {
		client.assertRequestCurrent?.();
		uploadError = err instanceof Error ? err : new Error(String(err));
		if (opts.requireMediaUpload || mediaMaxBytes !== void 0) throw new Error(`Mattermost media upload failed: ${uploadError.message}`, { cause: err });
		if (core.logging.shouldLogVerbose()) logger.debug?.(`mattermost send: media upload failed, falling back to URL text: ${String(err)}`);
		message = normalizeMessage(message, isHttpUrl(mediaUrl) ? mediaUrl : "");
	}
	if (message) {
		const tableMode = resolveMarkdownTableMode({
			cfg,
			channel: "mattermost",
			accountId
		});
		message = renderMattermostMarkdown(message, tableMode);
	}
	if (!message && (!fileIds || fileIds.length === 0)) {
		if (uploadError) throw new Error(`Mattermost media upload failed: ${uploadError.message}`, { cause: uploadError });
		throw new Error("Mattermost message is empty");
	}
	client.assertRequestCurrent?.();
	try {
		await opts.onPlatformSendDispatch?.();
	} catch (error) {
		client.assertRequestCurrent?.();
		throw error;
	}
	const post = await createMattermostPost(client, {
		channelId,
		message,
		rootId: opts.replyToId,
		fileIds,
		props
	});
	const messageId = post.id;
	const receipt = createMattermostSendReceipt({
		messageId,
		channelId,
		kind: resolveMattermostReceiptKind({
			fileIds,
			buttons: opts.buttons,
			props
		}),
		replyToId: opts.replyToId
	});
	const result = {
		messageId,
		channelId,
		receipt,
		content: post.message ?? message
	};
	try {
		await opts.onDeliveryResult?.(result);
		recordMattermostOutboundActivity(accountId);
	} catch (error) {
		throw createChannelPartialDeliveryError(error, {
			messageIds: listMessageReceiptPlatformIds(receipt),
			receipt,
			visibleReplySent: true,
			content: result.content
		});
	}
	return result;
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
/**
* Read the full request body as a string.
*/
function readBody(req, maxBytes, timeoutMs = BODY_READ_TIMEOUT_MS) {
	return readRequestBodyWithLimit(req, {
		maxBytes,
		timeoutMs,
		destroyOnLimit: false
	});
}
function sendJsonResponse(res, status, body) {
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
	for (const [key, entry] of commandValidationFailureCache) if (entry.accountId === accountId) commandValidationFailureCache.delete(key);
	for (const [key, entry] of commandLookupInflight) if (entry.accountId === accountId) commandLookupInflight.delete(key);
	for (const [key, entry] of commandValidationLookupRateLimit) if (entry.accountId === accountId) commandValidationLookupRateLimit.delete(key);
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
	while (commandValidationFailureCache.size > COMMAND_VALIDATION_FAILURE_CACHE_MAX_KEYS) {
		const oldestKey = commandValidationFailureCache.keys().next().value;
		if (!oldestKey) break;
		commandValidationFailureCache.delete(oldestKey);
	}
}
function hasCachedCommandValidationFailure(key, now = Date.now()) {
	sweepCommandValidationFailureCache(now);
	const validNow = asDateTimestampMs(now);
	if (validNow === void 0) return false;
	const cached = commandValidationFailureCache.get(key);
	if (!cached) return false;
	const expiresAt = asDateTimestampMs(cached.expiresAt);
	if (expiresAt !== void 0 && expiresAt > validNow) return true;
	commandValidationFailureCache.delete(key);
	return false;
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
	while (commandValidationLookupRateLimit.size > COMMAND_VALIDATION_LOOKUP_RATE_LIMIT_MAX_KEYS) {
		const oldestKey = commandValidationLookupRateLimit.keys().next().value;
		if (!oldestKey) break;
		commandValidationLookupRateLimit.delete(oldestKey);
	}
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
		},
		commandAuthorized: false,
		channelInfo: null,
		kind: "channel",
		chatType: "channel",
		channelName: "",
		channelDisplay: "",
		roomLabel: `#${channelId}`
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
				...decision,
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
		const denyText = decision.denyReason === "unknown-channel" ? "Temporary error: unable to determine channel type. Please try again." : decision.denyReason === "dm-disabled" ? "This bot is not accepting direct messages." : decision.denyReason === "channels-disabled" ? "Slash commands are disabled in channels." : decision.denyReason === "channel-no-allowlist" ? "Slash commands are not configured for this channel (no allowlist)." : "Unauthorized.";
		return {
			...decision,
			denyResponse: {
				response_type: "ephemeral",
				text: denyText
			}
		};
	}
	return {
		...decision,
		denyResponse: void 0
	};
}
/**
* Create the HTTP request handler for Mattermost slash command callbacks.
*
* This handler is registered as a plugin HTTP route and receives POSTs
* from the Mattermost server when a user invokes a registered slash command.
*/
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
			body = bufferedBody ?? await readBody(req, MAX_BODY_BYTES, bodyTimeoutMs);
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
			sendJsonResponse(res, 400, {
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
			sendJsonResponse(res, 401, {
				response_type: "ephemeral",
				text: "Unauthorized: invalid command token."
			});
			return;
		}
		const client = createMattermostClient({
			baseUrl: account.baseUrl ?? "",
			botToken: account.botToken ?? "",
			allowPrivateNetwork: isPrivateNetworkOptInEnabled(account.config)
		});
		if (!await validateMattermostSlashCommandToken({
			accountId: account.accountId,
			client,
			registeredCommand,
			payload,
			log
		})) {
			sendJsonResponse(res, 401, {
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
			sendJsonResponse(res, 200, auth.denyResponse ?? {
				response_type: "ephemeral",
				text: "Unauthorized."
			});
			return;
		}
		log?.(`mattermost: slash command /${sanitizeMattermostLogValue(trigger)} from ${sanitizeMattermostLogValue(senderName)} in ${sanitizeMattermostLogValue(channelId)}`);
		sendJsonResponse(res, 200, {
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
				channelName: auth.channelName,
				channelDisplay: auth.channelDisplay,
				roomLabel: auth.roomLabel,
				commandAuthorized: auth.commandAuthorized,
				log
			});
		} catch (err) {
			log?.(`mattermost: slash command handler error: ${sanitizeCommandLookupError(err)}`);
			try {
				await sendMessageMattermost(`channel:${channelId}`, "Sorry, something went wrong processing that command.", {
					cfg,
					accountId: account.accountId
				});
			} catch {}
		}
	};
}
async function handleSlashCommandAsync(params) {
	const { account, cfg, runtime, client, commandText, channelId, senderId, senderName, teamId, kind, chatType, channelName: _channelName, channelDisplay, roomLabel, commandAuthorized, triggerId, log } = params;
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
		const currentModel = resolveMattermostModelPickerCurrentModel({
			cfg,
			route,
			data
		});
		const view = pickerEntry.kind === "summary" ? renderMattermostModelSummaryView({
			ownerUserId: senderId,
			currentModel
		}) : pickerEntry.kind === "providers" ? renderMattermostProviderPickerView({
			ownerUserId: senderId,
			data,
			currentModel
		}) : renderMattermostModelsPickerView({
			ownerUserId: senderId,
			data,
			provider: pickerEntry.provider,
			page: 1,
			currentModel
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
/**
* Shared state for Mattermost slash commands.
*
* Bridges the plugin registration phase (HTTP route) with the monitor phase
* (command registration with MM API). The HTTP handler needs to know which
* tokens are known for fast-path routing, and the monitor needs to store
* registered command IDs.
*
* State is kept per-account so that multi-account deployments don't
* overwrite each other's tokens, registered commands, or handlers.
*/
const MULTI_ACCOUNT_BODY_MAX_BYTES = 65536;
const MULTI_ACCOUNT_BODY_TIMEOUT_MS = 5e3;
const slashRouteInFlightLimiter = createWebhookInFlightLimiter();
const SLASH_ROUTE_IN_FLIGHT_KEY = "mattermost:slash";
const SLASH_AUTHENTICATED_IN_FLIGHT_KEY = `${SLASH_ROUTE_IN_FLIGHT_KEY}:authenticated`;
/**
* Map from accountId → per-account slash command state.
*
* Anchored to globalThis so that jiti-loaded (route registration) and
* native-ESM-loaded (monitor/activation) module instances share the
* same Map. Without this, each module loader creates its own copy of
* the module-level variable and the HTTP handler never sees the tokens
* populated by the monitor.
*/
const ACCOUNT_STATES_KEY = Symbol.for("openclaw.mattermost.slash-account-states");
function getSlashAccountStates() {
	const globalStore = globalThis;
	const existing = globalStore[ACCOUNT_STATES_KEY];
	if (existing instanceof Map) return existing;
	const accountStates = /* @__PURE__ */ new Map();
	globalStore[ACCOUNT_STATES_KEY] = accountStates;
	return accountStates;
}
const accountStates = getSlashAccountStates();
function resolveSlashRouteInFlightKey(authorization) {
	const token = authorization?.match(/^Token ([^,\s]+)$/iu)?.[1];
	if (!token) return SLASH_ROUTE_IN_FLIGHT_KEY;
	let matched = false;
	for (const state of accountStates.values()) for (const commandToken of state.commandTokens) matched = safeEqualSecret(token, commandToken) || matched;
	return matched ? `${SLASH_AUTHENTICATED_IN_FLIGHT_KEY}:${createHash("sha256").update(`${SLASH_AUTHENTICATED_IN_FLIGHT_KEY}:${token}`).digest("hex")}` : SLASH_ROUTE_IN_FLIGHT_KEY;
}
function resolveSlashHandlerForToken(token) {
	const matches = [];
	for (const [accountId, state] of accountStates) if (state.commandTokens.has(token) && state.handler) matches.push({
		accountId,
		handler: state.handler
	});
	if (matches.length === 0) return { kind: "none" };
	if (matches.length === 1) {
		const match = matches[0];
		if (!match) return { kind: "none" };
		return {
			kind: "single",
			source: "token",
			handler: match.handler,
			accountIds: [match.accountId]
		};
	}
	return {
		kind: "ambiguous",
		source: "token",
		accountIds: matches.map((entry) => entry.accountId)
	};
}
function resolveSlashHandlerForCommand(params) {
	const trigger = normalizeSlashCommandTrigger(params.command);
	if (!trigger) return { kind: "none" };
	const matches = [];
	for (const [accountId, state] of accountStates) if (state.handler && state.registeredCommands.some((cmd) => cmd.teamId === params.teamId && cmd.trigger === trigger)) matches.push({
		accountId,
		handler: state.handler
	});
	if (matches.length === 0) return { kind: "none" };
	if (matches.length === 1) {
		const match = matches[0];
		if (!match) return { kind: "none" };
		return {
			kind: "single",
			source: "command",
			handler: match.handler,
			accountIds: [match.accountId]
		};
	}
	return {
		kind: "ambiguous",
		source: "command",
		accountIds: matches.map((entry) => entry.accountId)
	};
}
/**
* Get the slash command state for a specific account, or null if not activated.
*/
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
	const tokenSet = new Set(commandTokens);
	const handler = createSlashCommandHttpHandler({
		account,
		cfg: api.cfg,
		runtime: api.runtime,
		registeredCommands,
		triggerMap,
		log
	});
	accountStates.set(accountId, {
		commandTokens: tokenSet,
		registeredCommands,
		handler,
		account,
		triggerMap: triggerMap ?? /* @__PURE__ */ new Map()
	});
	log?.(`mattermost: slash commands activated for account ${accountId} (${registeredCommands.length} commands)`);
}
/**
* Deactivate slash commands for a specific account (on shutdown/disconnect).
*/
function deactivateSlashCommands(accountId) {
	if (accountId) {
		const state = accountStates.get(accountId);
		if (state) {
			state.commandTokens.clear();
			state.registeredCommands = [];
			state.handler = null;
			clearMattermostSlashCommandValidationCacheForAccount(accountId);
			accountStates.delete(accountId);
		}
	} else {
		for (const [stateAccountId, state] of accountStates) {
			state.commandTokens.clear();
			state.registeredCommands = [];
			state.handler = null;
			clearMattermostSlashCommandValidationCacheForAccount(stateAccountId);
		}
		accountStates.clear();
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
	const mmConfig = api.config.channels?.mattermost;
	const callbackPaths = /* @__PURE__ */ new Set();
	const addCallbackPaths = (raw) => {
		const resolved = resolveSlashCommandConfig(raw);
		callbackPaths.add(resolved.callbackPath);
		if (resolved.callbackUrl) try {
			const urlPath = new URL(resolved.callbackUrl).pathname;
			if (urlPath && urlPath !== resolved.callbackPath) callbackPaths.add(urlPath);
		} catch {}
	};
	const commandsRaw = mmConfig?.commands;
	addCallbackPaths(commandsRaw);
	const accountsRaw = mmConfig?.accounts ?? {};
	for (const accountId of Object.keys(accountsRaw)) {
		const accountCommandsRaw = accountsRaw[accountId]?.commands;
		addCallbackPaths(accountCommandsRaw);
	}
	const dispatchRoute = async (req, res, onRequestAuthenticated) => {
		if (accountStates.size === 0) {
			res.statusCode = 503;
			res.setHeader("Content-Type", "application/json; charset=utf-8");
			res.end(JSON.stringify({
				response_type: "ephemeral",
				text: "Slash commands are not yet initialized. Please try again in a moment."
			}));
			return;
		}
		if (accountStates.size === 1) {
			const state = accountStates.values().next().value;
			if (!state?.handler) {
				res.statusCode = 503;
				res.setHeader("Content-Type", "application/json; charset=utf-8");
				res.end(JSON.stringify({
					response_type: "ephemeral",
					text: "Slash commands are not yet initialized. Please try again in a moment."
				}));
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
		let match = token ? resolveSlashHandlerForToken(token) : { kind: "none" };
		if (match.kind === "none") {
			const payload = parseSlashCommandPayload(bodyStr, ct);
			if (payload) match = resolveSlashHandlerForCommand({
				teamId: payload.team_id,
				command: payload.command
			});
		}
		if (match.kind === "none") {
			res.statusCode = 401;
			res.setHeader("Content-Type", "application/json; charset=utf-8");
			res.end(JSON.stringify({
				response_type: "ephemeral",
				text: "Unauthorized: invalid command token."
			}));
			return;
		}
		if (match.kind === "ambiguous") {
			api.logger.warn?.(`mattermost: slash callback matched multiple accounts via ${match.source} (${match.accountIds.join(", ")})`);
			const conflictText = match.source === "token" ? "Conflict: command token is not unique across accounts." : "Conflict: slash command is not unique across accounts.";
			res.statusCode = 409;
			res.setHeader("Content-Type", "application/json; charset=utf-8");
			res.end(JSON.stringify({
				response_type: "ephemeral",
				text: conflictText
			}));
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
	for (const callbackPath of callbackPaths) api.registerHttpRoute({
		path: callbackPath,
		auth: "plugin",
		handler: routeHandler
	});
}
//#endregion
export { registerSlashCommands as _, sendMessageMattermost as a, joinMattermostVisibleContent as c, renderMattermostModelsPickerView as d, renderMattermostProviderPickerView as f, isSlashCommandsEnabled as g, cleanupSlashCommands as h, registerSlashCommandRoute as i, buildMattermostAllowedModelRefs as l, DEFAULT_COMMAND_SPECS as m, deactivateSlashCommands as n, resolveMattermostOpaqueTarget as o, resolveMattermostModelPickerCurrentModel as p, getSlashCommandState as r, deliverMattermostReplyPayload as s, activateSlashCommands as t, parseMattermostModelPickerContext as u, resolveCallbackUrl as v, resolveSlashCommandConfig as y };
