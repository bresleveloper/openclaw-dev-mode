import { createRequire } from "node:module";
import { bufferToBlobPart } from "openclaw/plugin-sdk/blob-runtime";
import { redactToolPayloadText } from "openclaw/plugin-sdk/logging-core";
import { readProviderJsonResponse, readResponseTextLimited } from "openclaw/plugin-sdk/provider-http";
import path from "node:path";
//#region extensions/clickclack/src/ws-runtime.ts
const require = createRequire(import.meta.url);
const WebSocket = require(path.join(path.dirname(require.resolve("ws/package.json")), "index.js"));
//#endregion
//#region extensions/clickclack/src/http-client.ts
/**
* Serializes optional provenance into the wire fields. Unknown JSON fields
* are ignored by servers without the provenance columns, so these are safe
* to send unconditionally when present.
*/
function provenanceFields(provenance) {
	const fields = {};
	if (provenance?.model?.trim()) fields.author_model = provenance.model.trim();
	if (provenance?.thinking?.trim()) fields.author_thinking = provenance.thinking.trim();
	if (provenance?.runtime?.trim()) fields.author_runtime = provenance.runtime.trim();
	return fields;
}
const CLICKCLACK_ERROR_BODY_LIMIT_BYTES = 8192;
const CLICKCLACK_CORRELATION_ID_MAX_LENGTH = 128;
const CLICKCLACK_CORRELATION_ID_PATTERN = /^[A-Za-z0-9._:-]+$/u;
const CLICKCLACK_CORRELATION_ID_HEADER = "X-Correlation-ID";
const CLICKCLACK_INBOUND_JSON_LIMIT_BYTES = 16777216;
const CLICKCLACK_WEBSOCKET_HANDSHAKE_TIMEOUT_MS = 3e4;
const CLICKCLACK_EPHEMERAL_REQUEST_TIMEOUT_MS = 15e3;
const CLICKCLACK_MESSAGE_PAGE_LIMIT = 200;
const CLICKCLACK_DISCUSSION_ROOT_PAGE_LIMIT = 8;
const CLICKCLACK_DISCUSSION_THREAD_REQUEST_LIMIT = 24;
function compareMessages(left, right) {
	return left.created_at.localeCompare(right.created_at) || left.id.localeCompare(right.id);
}
function keepLatestMessages(messages, limit) {
	return messages.toSorted(compareMessages).slice(-limit);
}
var ClickClackHttpError = class extends Error {
	constructor(status, detail, headers) {
		super(`ClickClack ${status}: ${detail}`);
		this.status = status;
		this.headers = headers;
	}
};
/** Matches the workspace/name uniqueness error returned by current ClickClack servers. */
function isClickClackChannelNameConflict(error) {
	if (!(error instanceof ClickClackHttpError) || error.status !== 400 && error.status !== 409) return false;
	const message = error.message.toLowerCase();
	return (message.includes("unique") || message.includes("duplicate")) && message.includes("channel") && /workspace.*name|name.*workspace/u.test(message);
}
/** Accepts the same bounded request-correlation shape as the ClickClack API. */
function normalizeClickClackCorrelationId(value) {
	if (typeof value !== "string") return;
	const normalized = value.trim();
	if (!normalized || normalized.length > CLICKCLACK_CORRELATION_ID_MAX_LENGTH || !CLICKCLACK_CORRELATION_ID_PATTERN.test(normalized)) return;
	return normalized;
}
function createClickClackClient(options) {
	const baseUrl = options.baseUrl.replace(/\/$/, "");
	const fetcher = options.fetch ?? fetch;
	const correlationId = normalizeClickClackCorrelationId(options.correlationId);
	const headers = {
		Authorization: `Bearer ${options.token}`,
		Accept: "application/json"
	};
	async function request(path, init = {}, requestOptions = {}) {
		const requestHeaders = new Headers(init.headers);
		for (const [key, value] of Object.entries(headers)) requestHeaders.set(key, value);
		if (correlationId) requestHeaders.set(CLICKCLACK_CORRELATION_ID_HEADER, correlationId);
		if (init.body && !(init.body instanceof FormData)) requestHeaders.set("Content-Type", "application/json");
		const controller = requestOptions.timeoutMs !== void 0 && !init.signal ? new AbortController() : void 0;
		const timeout = controller ? setTimeout(() => controller.abort(), requestOptions.timeoutMs) : void 0;
		try {
			const response = await fetcher(`${baseUrl}${path}`, {
				...init,
				...controller ? { signal: controller.signal } : {},
				headers: requestHeaders
			});
			if (!response.ok) {
				const detail = await readResponseTextLimited(response, CLICKCLACK_ERROR_BODY_LIMIT_BYTES);
				throw new ClickClackHttpError(response.status, redactToolPayloadText(detail), new Headers(response.headers));
			}
			if (requestOptions.responseMode === "none") {
				try {
					await response.body?.cancel();
				} catch {}
				return;
			}
			return await readProviderJsonResponse(response, "ClickClack response", { maxBytes: CLICKCLACK_INBOUND_JSON_LIMIT_BYTES });
		} finally {
			if (timeout) clearTimeout(timeout);
		}
	}
	async function requestObject(key, path, init) {
		return (await request(path, init))[key];
	}
	async function fetchEventPage(workspaceId, pageOptions = {}) {
		const query = new URLSearchParams({ workspace_id: workspaceId });
		if (pageOptions.afterCursor) query.set("after_cursor", pageOptions.afterCursor);
		if (pageOptions.limit !== void 0) query.set("limit", String(pageOptions.limit));
		if (pageOptions.includeTail) query.set("include_tail", "true");
		const data = await request(`/api/realtime/events?${query.toString()}`);
		return {
			events: data.events,
			...typeof data.tail_cursor === "string" ? { tailCursor: data.tail_cursor } : {}
		};
	}
	async function createMessage(path, body, opts) {
		return requestObject("message", path, {
			method: "POST",
			body: JSON.stringify({
				body,
				...opts?.quotedMessageId ? { quoted_message_id: opts.quotedMessageId } : {},
				...opts?.nonce ? { nonce: opts.nonce } : {},
				...provenanceFields(opts?.provenance)
			})
		});
	}
	async function findByNonce(kind, params) {
		const query = new URLSearchParams({
			workspace_id: params.workspaceId,
			nonce: params.nonce
		});
		try {
			return (await request(`/api/${kind}s/by-nonce?${query.toString()}`))[kind];
		} catch (error) {
			if (error instanceof ClickClackHttpError && error.status === 404) {
				if (error.headers.get(`X-ClickClack-${kind}-Nonce`) === "supported") return;
				throw new Error(`ClickClack server does not support durable ${kind} nonce lookup`, { cause: error });
			}
			throw error;
		}
	}
	return {
		me: async () => requestObject("user", "/api/me"),
		setBotCommands: async (commands) => requestObject("bot_commands", "/api/bots/self/commands", {
			method: "PUT",
			body: JSON.stringify({ commands })
		}),
		workspaces: async () => requestObject("workspaces", "/api/workspaces"),
		channels: async (workspaceId) => requestObject("channels", `/api/workspaces/${encodeURIComponent(workspaceId)}/channels`),
		createChannel: async (workspaceId, channel) => requestObject("channel", `/api/workspaces/${encodeURIComponent(workspaceId)}/channels`, {
			method: "POST",
			body: JSON.stringify(channel)
		}),
		updateChannel: async (channelId, patch) => requestObject("channel", `/api/channels/${encodeURIComponent(channelId)}`, {
			method: "PATCH",
			body: JSON.stringify(patch)
		}),
		channelMessages: async (channelId, afterSeq, limit = 20) => requestObject("messages", `/api/channels/${encodeURIComponent(channelId)}/messages?after_seq=${afterSeq}&limit=${limit}`),
		latestChannelMessages: async (channelId, limit = 30) => {
			const boundedLimit = Math.max(1, Math.min(CLICKCLACK_MESSAGE_PAGE_LIMIT, limit));
			let beforeSeq;
			let latest = [];
			let rootPageCount = 0;
			let threadRequestCount = 0;
			let truncated = false;
			while (true) {
				rootPageCount += 1;
				const query = new URLSearchParams({ limit: String(CLICKCLACK_MESSAGE_PAGE_LIMIT) });
				if (beforeSeq !== void 0) query.set("before_seq", String(beforeSeq));
				const page = await request(`/api/channels/${encodeURIComponent(channelId)}/messages?${query.toString()}`);
				for (const root of page.messages) {
					latest = keepLatestMessages([...latest, root], boundedLimit);
					const lastReplyAt = root.thread_state?.last_reply_at;
					const cutoff = latest.length === boundedLimit ? latest[0]?.created_at : void 0;
					if (!root.thread_state?.reply_count || lastReplyAt !== void 0 && cutoff !== void 0 && lastReplyAt < cutoff) continue;
					if (threadRequestCount >= CLICKCLACK_DISCUSSION_THREAD_REQUEST_LIMIT) {
						truncated = true;
						continue;
					}
					threadRequestCount += 1;
					const threadQuery = new URLSearchParams({ limit: String(CLICKCLACK_MESSAGE_PAGE_LIMIT) });
					const thread = await request(`/api/messages/${encodeURIComponent(root.id)}/thread?${threadQuery.toString()}`);
					if (thread.replies.length < root.thread_state.reply_count) {
						truncated = true;
						continue;
					}
					latest = keepLatestMessages([...latest, ...thread.replies], boundedLimit);
				}
				if (!page.has_older) return {
					messages: latest,
					truncated
				};
				if (rootPageCount >= CLICKCLACK_DISCUSSION_ROOT_PAGE_LIMIT) return {
					messages: latest,
					truncated: true
				};
				if (page.messages.length === 0 || !Number.isSafeInteger(page.oldest_seq) || page.oldest_seq < 0 || page.oldest_seq === beforeSeq) throw new Error("ClickClack message pagination did not advance");
				beforeSeq = page.oldest_seq;
			}
		},
		directMessages: async (conversationId, afterSeq, limit = 20) => requestObject("messages", `/api/dms/${encodeURIComponent(conversationId)}/messages?after_seq=${afterSeq}&limit=${limit}`),
		thread: async (messageId) => await request(`/api/messages/${encodeURIComponent(messageId)}/thread`),
		message: async (messageId) => requestObject("message", `/api/messages/${encodeURIComponent(messageId)}`),
		findMessageByNonce: async (params) => findByNonce("message", params),
		createChannelMessage: async (channelId, body, opts) => createMessage(`/api/channels/${encodeURIComponent(channelId)}/messages`, body, opts),
		createThreadReply: async (messageId, body, opts) => createMessage(`/api/messages/${encodeURIComponent(messageId)}/thread/replies`, body, {
			nonce: opts?.nonce,
			provenance: opts?.provenance
		}),
		createDirectConversation: async (workspaceId, memberIds) => requestObject("conversation", "/api/dms", {
			method: "POST",
			body: JSON.stringify({
				workspace_id: workspaceId,
				member_ids: memberIds
			})
		}),
		createUpload: async (params) => {
			const form = new FormData();
			const bytes = bufferToBlobPart(params.buffer);
			form.append("file", new Blob([bytes], { type: params.contentType }), params.filename);
			const query = new URLSearchParams({ workspace_id: params.workspaceId });
			if (params.nonce) query.set("nonce", params.nonce);
			return requestObject("upload", `/api/uploads?${query.toString()}`, {
				method: "POST",
				body: form
			});
		},
		findUploadByNonce: async (params) => findByNonce("upload", params),
		attachUpload: async (messageId, uploadId) => {
			await request(`/api/messages/${encodeURIComponent(messageId)}/attachments`, {
				method: "POST",
				body: JSON.stringify({ upload_id: uploadId })
			});
		},
		/**
		* POSTs a durable agent activity row (agent_commentary / agent_tool)
		* through the normal message create path. Requires a bot token carrying
		* the agent_activity:write scope on the ClickClack side.
		*/
		createActivityMessage: async (params) => {
			if (!params.channelId && !params.conversationId) throw new Error("createActivityMessage requires a channelId or conversationId");
			return requestObject("message", params.channelId ? `/api/channels/${encodeURIComponent(params.channelId)}/messages` : `/api/dms/${encodeURIComponent(params.conversationId ?? "")}/messages`, {
				method: "POST",
				body: JSON.stringify({
					body: params.body,
					kind: params.kind,
					turn_id: params.turnId,
					...provenanceFields(params.provenance)
				})
			});
		},
		updateMessageBody: async (messageId, body) => requestObject("message", `/api/messages/${encodeURIComponent(messageId)}`, {
			method: "PATCH",
			body: JSON.stringify({ body })
		}),
		/**
		* Publishes an ephemeral realtime signal such as native agent progress.
		* These frames are intentionally not persisted as messages.
		*/
		publishEphemeral: async (params) => {
			await request("/api/realtime/ephemeral", {
				method: "POST",
				body: JSON.stringify({
					workspace_id: params.workspaceId,
					...params.channelId ? { channel_id: params.channelId } : {},
					...params.conversationId ? { direct_conversation_id: params.conversationId } : {},
					type: params.type,
					payload: params.payload ?? {}
				})
			}, {
				timeoutMs: CLICKCLACK_EPHEMERAL_REQUEST_TIMEOUT_MS,
				responseMode: "none"
			});
		},
		createDirectMessage: async (conversationId, body, opts) => createMessage(`/api/dms/${encodeURIComponent(conversationId)}/messages`, body, {
			quotedMessageId: opts?.quotedMessageId,
			nonce: opts?.nonce
		}),
		events: async (workspaceId, afterCursor) => (await fetchEventPage(workspaceId, { afterCursor })).events,
		eventPage: fetchEventPage,
		websocket: (workspaceId, afterCursor) => {
			const url = new URL(`${baseUrl}/api/realtime/ws`);
			url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
			url.searchParams.set("workspace_id", workspaceId);
			if (afterCursor) url.searchParams.set("after_cursor", afterCursor);
			return new WebSocket(url, {
				headers: { Authorization: `Bearer ${options.token}` },
				handshakeTimeout: CLICKCLACK_WEBSOCKET_HANDSHAKE_TIMEOUT_MS,
				maxPayload: CLICKCLACK_INBOUND_JSON_LIMIT_BYTES
			});
		}
	};
}
//#endregion
//#region extensions/clickclack/src/resolve.ts
function findClickClackWorkspace(workspaces, selector) {
	return workspaces.find((candidate) => candidate.id === selector || candidate.slug === selector || candidate.name === selector);
}
async function resolveWorkspaceId(client, workspace) {
	if (workspace.startsWith("wsp_")) return workspace;
	const found = findClickClackWorkspace(await client.workspaces(), workspace);
	if (!found) throw new Error(`ClickClack workspace not found: ${workspace}`);
	return found.id;
}
async function resolveChannelId(client, workspaceId, channel) {
	if (channel.startsWith("chn_")) return channel;
	const found = (await client.channels(workspaceId)).find((candidate) => candidate.id === channel || candidate.name === channel);
	if (!found) throw new Error(`ClickClack channel not found: ${channel}`);
	return found.id;
}
//#endregion
export { createClickClackClient as a, ClickClackHttpError as i, resolveChannelId as n, isClickClackChannelNameConflict as o, resolveWorkspaceId as r, normalizeClickClackCorrelationId as s, findClickClackWorkspace as t };
