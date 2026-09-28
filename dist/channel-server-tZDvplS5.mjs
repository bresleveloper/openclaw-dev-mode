import { j as resolveIntegerOption } from "./number-coercion-CLj0HTDM.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { Et as _enum, Fn as object, Jn as string, Lt as boolean, Pn as number, xn as literal } from "./schemas-BOYIvvln.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { d as readPersistedMediaFacts, s as isMeaningfulMediaFact } from "./media-facts-BEHTU0wM.mjs";
import { i as extractFirstTextBlock } from "./chat-message-content-D14VlZZc.mjs";
import { randomUUID } from "node:crypto";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
//#region src/mcp/channel-shared.ts
/** Raw MCP notification schema emitted by Claude channel clients for permission prompts. */
const ClaudePermissionRequestSchema = object({
	method: literal("notifications/claude/channel/permission_request"),
	params: object({
		request_id: string(),
		tool_name: string(),
		description: string(),
		input_preview: string()
	})
});
/** Resolve the visible message id, including OpenClaw metadata attached to raw entries. */
function resolveMessageId(entry) {
	return normalizeOptionalString(entry.id) ?? (entry["__openclaw"] && typeof entry["__openclaw"] === "object" ? normalizeOptionalString(entry["__openclaw"].id) : void 0);
}
/** Build the text summary format expected by simple MCP tool results. */
function summarizeResult(label, count) {
	return { content: [{
		type: "text",
		text: `${label}: ${count}`
	}] };
}
/** Build a text summary plus pretty JSON payload for MCP clients without structured rendering. */
function summarizeStructuredResult(label, count, payload) {
	return { content: [{
		type: "text",
		text: `${label}: ${count}\n\n${JSON.stringify(payload, null, 2)}`
	}] };
}
function resolveConversationChannel(row) {
	return normalizeOptionalLowercaseString(normalizeOptionalString(row.deliveryContext?.channel) ?? normalizeOptionalString(row.lastChannel) ?? normalizeOptionalString(row.channel) ?? normalizeOptionalString(row.origin?.provider));
}
/** Convert a Gateway session row into a reply-capable conversation descriptor. */
function toConversation(row) {
	const channel = resolveConversationChannel(row);
	const to = normalizeOptionalString(row.deliveryContext?.to) ?? normalizeOptionalString(row.lastTo);
	if (!channel || !to) return null;
	return {
		sessionKey: row.key,
		channel,
		to,
		accountId: normalizeOptionalString(row.deliveryContext?.accountId) ?? normalizeOptionalString(row.lastAccountId) ?? normalizeOptionalString(row.origin?.accountId),
		threadId: row.deliveryContext?.threadId ?? row.lastThreadId ?? row.origin?.threadId,
		label: normalizeOptionalString(row.label),
		displayName: normalizeOptionalString(row.displayName),
		derivedTitle: normalizeOptionalString(row.derivedTitle),
		lastMessagePreview: normalizeOptionalString(row.lastMessagePreview),
		updatedAt: typeof row.updatedAt === "number" ? row.updatedAt : null
	};
}
/** Check whether a queued event should be visible to a poll or wait call. */
function matchEventFilter(event, filter) {
	if (event.cursor <= filter.afterCursor) return false;
	if (!filter.sessionKey) return true;
	return "sessionKey" in event && event.sessionKey === filter.sessionKey;
}
/** Return non-text content blocks plus canonical persisted media from a raw message payload. */
function extractAttachmentsFromMessage(message) {
	if (!message || typeof message !== "object") return [];
	const content = message.content;
	const contentAttachments = Array.isArray(content) ? content.filter((entry) => {
		if (!entry || typeof entry !== "object") return false;
		return normalizeOptionalString(entry.type) !== "text";
	}) : [];
	const mediaAttachments = (readPersistedMediaFacts(message) ?? []).filter(isMeaningfulMediaFact).map((media) => ({
		type: "openclaw_media",
		media: Object.fromEntries(Object.entries(media).filter(([, value]) => value !== void 0))
	}));
	return [...contentAttachments, ...mediaAttachments];
}
/** Normalize approval identifiers before local tracking or resolution. */
function normalizeApprovalId(value) {
	const id = normalizeOptionalString(value);
	return id ? id.trim() : void 0;
}
//#endregion
//#region src/mcp/channel-bridge.ts
const CLAUDE_PERMISSION_REPLY_RE = /^(yes|no)\s+([a-km-z]{5})$/i;
const QUEUE_LIMIT = 1e3;
const CONVERSATIONS_LIST_LIMIT = 500;
const MESSAGES_READ_LIMIT = 200;
const EVENTS_POLL_LIMIT = 200;
const EVENTS_WAIT_TIMEOUT_LIMIT_MS = 3e5;
const PENDING_CLAUDE_PERMISSION_TTL_MS = 36e5;
const PENDING_APPROVAL_DEFAULT_TTL_MS = 18e5;
const PENDING_SWEEP_INTERVAL_MS = 3e5;
/** Connects the MCP server surface to a Gateway client and queues channel events for polling. */
var OpenClawChannelBridge = class {
	constructor(cfg, params) {
		this.cfg = cfg;
		this.params = params;
		this.gateway = null;
		this.queue = [];
		this.pendingWaiters = /* @__PURE__ */ new Set();
		this.pendingClaudePermissions = /* @__PURE__ */ new Map();
		this.pendingApprovals = /* @__PURE__ */ new Map();
		this.pendingSweepInterval = null;
		this.server = null;
		this.cursor = 0;
		this.closed = false;
		this.ready = false;
		this.started = false;
		this.retryingInitialConnect = false;
		this.supportsExactMessageLookup = false;
		this.readySettled = false;
		this.verbose = params.verbose;
		this.claudeChannelMode = params.claudeChannelMode;
		this.readyPromise = new Promise((resolve, reject) => {
			this.resolveReady = resolve;
			this.rejectReady = reject;
		});
	}
	/** Attach the MCP server used for outbound protocol notifications. */
	setServer(server) {
		this.server = server;
	}
	/** Start the Gateway connection and resolve only after session subscription succeeds. */
	async start() {
		if (this.started) {
			await this.readyPromise;
			return;
		}
		this.started = true;
		const [{ resolveGatewayClientBootstrap }, { GatewayClient: GatewayClientCtor }, { startGatewayClientWhenEventLoopReady }, { APPROVALS_SCOPE, READ_SCOPE, WRITE_SCOPE }, { GATEWAY_CLIENT_CAPS, GATEWAY_CLIENT_MODES, GATEWAY_CLIENT_NAMES }] = await Promise.all([
			import("./client-bootstrap-DFsOcSzX.mjs"),
			import("./client-C7CcBmgR.mjs"),
			import("./readiness-DWcwcaqR.mjs"),
			import("./method-scopes-BYju7Jxc.mjs"),
			import("./client-info-DCTonJd_.mjs")
		]);
		const bootstrap = await resolveGatewayClientBootstrap({
			config: this.cfg,
			gatewayUrl: this.params.gatewayUrl,
			explicitAuth: {
				token: this.params.gatewayToken,
				password: this.params.gatewayPassword
			},
			env: process.env
		});
		if (this.closed) {
			this.resolveReadyOnce();
			return;
		}
		this.gateway = new GatewayClientCtor({
			url: bootstrap.url,
			token: bootstrap.auth.token,
			password: bootstrap.auth.password,
			preauthHandshakeTimeoutMs: bootstrap.preauthHandshakeTimeoutMs,
			tlsFingerprint: bootstrap.tlsFingerprint,
			clientName: GATEWAY_CLIENT_NAMES.CLI,
			clientDisplayName: "OpenClaw MCP",
			clientVersion: VERSION,
			mode: GATEWAY_CLIENT_MODES.CLI,
			caps: [GATEWAY_CLIENT_CAPS.APPROVALS],
			scopes: [
				READ_SCOPE,
				WRITE_SCOPE,
				APPROVALS_SCOPE
			],
			requestTimeoutMs: 18e4,
			onEvent: (event) => {
				this.dispatchGatewayEvent(event);
			},
			onHelloOk: (hello) => {
				this.supportsExactMessageLookup = hello.features.methods.includes("chat.message.get");
				this.retryingInitialConnect = false;
				this.handleHelloOk();
			},
			onConnectError: (error) => {
				const normalizedError = error instanceof Error ? error : new Error(String(error));
				if (shouldRetryInitialMcpGatewayConnect(normalizedError)) {
					this.retryingInitialConnect = true;
					return;
				}
				this.rejectReadyOnce(normalizedError);
			},
			onClose: (code, reason) => {
				if (!this.ready && !this.closed && !this.retryingInitialConnect) this.rejectReadyOnce(/* @__PURE__ */ new Error(`gateway closed before ready (${code}): ${reason}`));
				this.retryingInitialConnect = false;
			}
		});
		if (!(await startGatewayClientWhenEventLoopReady(this.gateway, { clientOptions: { preauthHandshakeTimeoutMs: bootstrap.preauthHandshakeTimeoutMs } })).ready) this.rejectReadyOnce(/* @__PURE__ */ new Error("gateway event loop readiness timeout"));
		await this.readyPromise;
	}
	/** Wait until the bridge has subscribed to Gateway session events. */
	async waitUntilReady() {
		await this.readyPromise;
	}
	/** Stop Gateway IO and release waiters so MCP shutdown cannot hang on pending polls. */
	async close() {
		if (this.closed) return;
		this.closed = true;
		this.resolveReadyOnce();
		if (this.pendingSweepInterval) {
			clearInterval(this.pendingSweepInterval);
			this.pendingSweepInterval = null;
		}
		this.pendingClaudePermissions.clear();
		this.pendingApprovals.clear();
		for (const waiter of this.pendingWaiters) waiter.settle(null);
		const gateway = this.gateway;
		this.gateway = null;
		await gateway?.stopAndWait();
	}
	/** List Gateway sessions that have enough routing metadata to be channel conversations. */
	async listConversations(params) {
		await this.waitUntilReady();
		const limit = resolveIntegerOption(params?.limit, 50, {
			min: 1,
			max: CONVERSATIONS_LIST_LIMIT
		});
		const response = await this.requestGateway("sessions.list", {
			limit,
			search: params?.search,
			includeDerivedTitles: params?.includeDerivedTitles ?? true,
			includeLastMessage: params?.includeLastMessage ?? true
		});
		const requestedChannel = normalizeOptionalLowercaseString(params?.channel);
		return (response.sessions ?? []).map(toConversation).filter((conversation) => Boolean(conversation)).filter((conversation) => requestedChannel ? normalizeLowercaseStringOrEmpty(conversation.channel) === requestedChannel : true);
	}
	/** Resolve one conversation by its stable session key. */
	async getConversation(sessionKey) {
		const normalizedSessionKey = sessionKey.trim();
		if (!normalizedSessionKey) return null;
		await this.waitUntilReady();
		const response = await this.requestGateway("sessions.describe", {
			key: normalizedSessionKey,
			includeDerivedTitles: true,
			includeLastMessage: true
		});
		return response.session ? toConversation(response.session) : null;
	}
	/** Read recent history through the Gateway session API. */
	async readMessages(sessionKey, limit = 20) {
		await this.waitUntilReady();
		const requestLimit = resolveIntegerOption(limit, 20, {
			min: 1,
			max: MESSAGES_READ_LIMIT
		});
		return (await this.requestGateway("sessions.get", {
			key: sessionKey,
			limit: requestLimit
		})).messages ?? [];
	}
	async readMessage(sessionKey, messageId, legacyLimit = 100) {
		await this.waitUntilReady();
		if (!this.supportsExactMessageLookup) return (await this.readMessages(sessionKey, legacyLimit)).find((entry) => resolveMessageId(entry) === messageId) ?? null;
		const result = await this.requestGateway("chat.message.get", {
			sessionKey,
			messageId
		});
		return result.ok === true ? result.message ?? null : null;
	}
	/** Send a reply using the same channel route stored on the conversation. */
	async sendMessage(params) {
		const conversation = await this.getConversation(params.sessionKey);
		if (!conversation) throw new Error(`Conversation not found for session ${params.sessionKey}`);
		return await this.requestGateway("send", {
			to: conversation.to,
			channel: conversation.channel,
			accountId: conversation.accountId,
			threadId: conversation.threadId == null ? void 0 : String(conversation.threadId),
			message: params.text,
			sessionKey: conversation.sessionKey,
			idempotencyKey: randomUUID()
		});
	}
	/** Return locally tracked approval requests that are still open. */
	listPendingApprovals() {
		this.sweepPendingExpired();
		return [...this.pendingApprovals.values()].map((entry) => entry.approval).toSorted((a, b) => {
			return (a.createdAtMs ?? 0) - (b.createdAtMs ?? 0);
		});
	}
	/** Forward an MCP approval decision to the matching Gateway approval resolver. */
	async respondToApproval(params) {
		if (params.kind === "exec") return await this.requestGateway("exec.approval.resolve", {
			id: params.id,
			decision: params.decision
		});
		return await this.requestGateway("plugin.approval.resolve", {
			id: params.id,
			decision: params.decision
		});
	}
	/** Poll queued events after a cursor without consuming them. */
	pollEvents(filter, limit = 20) {
		const eventLimit = resolveIntegerOption(limit, 20, {
			min: 1,
			max: EVENTS_POLL_LIMIT
		});
		const events = this.queue.filter((event) => matchEventFilter(event, filter)).slice(0, eventLimit);
		const gap = this.resolveCursorGap(filter.afterCursor);
		return {
			events,
			nextCursor: events.at(-1)?.cursor ?? (gap ? gap.oldest_available_cursor - 1 : filter.afterCursor),
			...gap ? { gap } : {}
		};
	}
	/** Wait for the next matching event, returning a closed outcome on every settle path. */
	async waitForEvent(filter, timeoutMs = 3e4, signal) {
		signal?.throwIfAborted();
		const existing = this.queue.find((event) => matchEventFilter(event, filter));
		const gap = this.resolveCursorGap(filter.afterCursor);
		if (existing || gap) return {
			event: existing ?? null,
			...gap ? { gap } : {}
		};
		const waitTimeoutMs = resolveIntegerOption(timeoutMs, 3e4, {
			min: 1,
			max: EVENTS_WAIT_TIMEOUT_LIMIT_MS
		});
		return await new Promise((resolve) => {
			let settled = false;
			const onAbort = () => waiter.settle(null);
			const waiter = {
				filter,
				settle: (event) => {
					if (settled) return;
					settled = true;
					this.pendingWaiters.delete(waiter);
					clearTimeout(timeout);
					signal?.removeEventListener("abort", onAbort);
					const currentGap = this.resolveCursorGap(filter.afterCursor);
					resolve({
						event,
						...currentGap ? { gap: currentGap } : {}
					});
				}
			};
			const timeout = setTimeout(() => {
				waiter.settle(null);
			}, waitTimeoutMs);
			signal?.addEventListener("abort", onAbort, { once: true });
			this.pendingWaiters.add(waiter);
			if (signal?.aborted) waiter.settle(null);
		});
	}
	/** Accept a Claude channel permission notification and expose it through event polling. */
	async handleClaudePermissionRequest(params) {
		if (this.closed) return;
		this.pendingClaudePermissions.set(params.requestId, Date.now());
		this.ensurePendingSweeper();
		this.enqueue({
			cursor: this.nextCursor(),
			type: "claude_permission_request",
			requestId: params.requestId,
			toolName: params.toolName,
			description: params.description,
			inputPreview: params.inputPreview
		});
		if (this.verbose) process.stderr.write(`openclaw mcp: pending Claude permission ${params.requestId}\n`);
	}
	async requestGateway(method, params) {
		if (!this.gateway) throw new Error("Gateway client is not ready");
		return await this.gateway.request(method, params);
	}
	async sendNotification(notification) {
		if (!this.server || this.closed) return "unavailable";
		try {
			await this.server.server.notification(notification);
			return "delivered";
		} catch (error) {
			if (this.closed) return "unavailable";
			process.stderr.write(`openclaw mcp: notification ${notification.method} failed\n`);
			if (this.verbose) process.stderr.write(`openclaw mcp: notification ${notification.method} error: ${String(error)}\n`);
			return "failed";
		}
	}
	async handleHelloOk() {
		try {
			await this.requestGateway("sessions.subscribe", {});
			this.ready = true;
			this.resolveReadyOnce();
		} catch (error) {
			this.rejectReadyOnce(error instanceof Error ? error : new Error(String(error)));
		}
	}
	resolveReadyOnce() {
		if (this.readySettled) return;
		this.readySettled = true;
		this.resolveReady();
	}
	rejectReadyOnce(error) {
		if (this.readySettled) return;
		this.readySettled = true;
		this.rejectReady(error);
	}
	nextCursor() {
		this.cursor += 1;
		return this.cursor;
	}
	resolveCursorGap(afterCursor) {
		const oldestAvailableCursor = this.queue[0]?.cursor;
		return oldestAvailableCursor !== void 0 && afterCursor < oldestAvailableCursor - 1 ? {
			requested_after_cursor: afterCursor,
			oldest_available_cursor: oldestAvailableCursor
		} : void 0;
	}
	enqueue(event) {
		this.queue.push(event);
		while (this.queue.length > QUEUE_LIMIT) this.queue.shift();
		for (const waiter of this.pendingWaiters) {
			const matches = matchEventFilter(event, waiter.filter);
			if (matches || this.resolveCursorGap(waiter.filter.afterCursor)) waiter.settle(matches ? event : null);
		}
	}
	trackApproval(kind, payload) {
		if (this.closed) return;
		const id = normalizeApprovalId(payload.id);
		if (!id) return;
		this.pendingApprovals.set(id, {
			approval: {
				kind,
				id,
				request: payload.request && typeof payload.request === "object" ? payload.request : void 0,
				createdAtMs: typeof payload.createdAtMs === "number" ? payload.createdAtMs : void 0,
				expiresAtMs: typeof payload.expiresAtMs === "number" ? payload.expiresAtMs : void 0
			},
			trackedAtMs: Date.now()
		});
		this.ensurePendingSweeper();
	}
	ensurePendingSweeper() {
		if (this.pendingSweepInterval || this.closed) return;
		this.pendingSweepInterval = setInterval(() => {
			this.sweepPendingExpired();
		}, PENDING_SWEEP_INTERVAL_MS);
		this.pendingSweepInterval.unref();
	}
	sweepPendingExpired(now = Date.now()) {
		for (const [id, createdAtMs] of this.pendingClaudePermissions) if (now - createdAtMs >= PENDING_CLAUDE_PERMISSION_TTL_MS) this.pendingClaudePermissions.delete(id);
		for (const [id, entry] of this.pendingApprovals) if (now >= (entry.approval.expiresAtMs ?? entry.trackedAtMs + PENDING_APPROVAL_DEFAULT_TTL_MS)) this.pendingApprovals.delete(id);
		if (this.pendingSweepInterval && this.pendingClaudePermissions.size === 0 && this.pendingApprovals.size === 0) {
			clearInterval(this.pendingSweepInterval);
			this.pendingSweepInterval = null;
		}
	}
	resolveTrackedApproval(payload) {
		const id = normalizeApprovalId(payload.id);
		if (id) this.pendingApprovals.delete(id);
	}
	async dispatchGatewayEvent(event) {
		try {
			await this.handleGatewayEvent(event);
		} catch (error) {
			process.stderr.write(`openclaw mcp: gateway event ${event.event} failed\n`);
			if (this.verbose) process.stderr.write(`openclaw mcp: gateway event ${event.event} error: ${String(error)}\n`);
		}
	}
	async handleGatewayEvent(event) {
		switch (event.event) {
			case "session.message":
				await this.handleSessionMessageEvent(event.payload);
				return;
			case "exec.approval.requested": {
				const raw = event.payload ?? {};
				this.trackApproval("exec", raw);
				this.enqueue({
					cursor: this.nextCursor(),
					type: "exec_approval_requested",
					raw
				});
				return;
			}
			case "exec.approval.resolved": {
				const raw = event.payload ?? {};
				this.resolveTrackedApproval(raw);
				this.enqueue({
					cursor: this.nextCursor(),
					type: "exec_approval_resolved",
					raw
				});
				return;
			}
			case "plugin.approval.requested": {
				const raw = event.payload ?? {};
				this.trackApproval("plugin", raw);
				this.enqueue({
					cursor: this.nextCursor(),
					type: "plugin_approval_requested",
					raw
				});
				return;
			}
			case "plugin.approval.resolved": {
				const raw = event.payload ?? {};
				this.resolveTrackedApproval(raw);
				this.enqueue({
					cursor: this.nextCursor(),
					type: "plugin_approval_resolved",
					raw
				});
			}
		}
	}
	async handleSessionMessageEvent(payload) {
		const sessionKey = normalizeOptionalString(payload.sessionKey);
		if (!sessionKey) return;
		const conversation = toConversation({
			key: sessionKey,
			lastChannel: normalizeOptionalString(payload.lastChannel),
			lastTo: normalizeOptionalString(payload.lastTo),
			lastAccountId: normalizeOptionalString(payload.lastAccountId),
			lastThreadId: payload.lastThreadId
		}) ?? void 0;
		const role = normalizeOptionalString(payload.message?.role);
		const text = extractFirstTextBlock(payload.message);
		const permissionMatch = text ? CLAUDE_PERMISSION_REPLY_RE.exec(text) : null;
		if (role === "user" && payload.senderIsOwner === true && permissionMatch) {
			const requestId = normalizeOptionalLowercaseString(permissionMatch[2]);
			if (requestId && this.pendingClaudePermissions.has(requestId)) {
				if (await this.sendNotification({
					method: "notifications/claude/channel/permission",
					params: {
						request_id: requestId,
						behavior: normalizeLowercaseStringOrEmpty(permissionMatch[1]).startsWith("y") ? "allow" : "deny"
					}
				}) === "delivered") this.pendingClaudePermissions.delete(requestId);
				return;
			}
		}
		this.enqueue({
			cursor: this.nextCursor(),
			type: "message",
			sessionKey,
			conversation,
			messageId: normalizeOptionalString(payload.messageId),
			messageSeq: typeof payload.messageSeq === "number" ? payload.messageSeq : void 0,
			role,
			text,
			raw: payload
		});
		if (!this.shouldEmitClaudeChannel(role, conversation)) return;
		await this.sendNotification({
			method: "notifications/claude/channel",
			params: {
				content: text ?? "[non-text message]",
				meta: {
					session_key: sessionKey,
					channel: conversation?.channel ?? "",
					to: conversation?.to ?? "",
					account_id: conversation?.accountId ?? "",
					thread_id: conversation?.threadId == null ? "" : String(conversation.threadId),
					message_id: normalizeOptionalString(payload.messageId) ?? ""
				}
			}
		});
	}
	shouldEmitClaudeChannel(role, conversation) {
		if (this.claudeChannelMode === "off") return false;
		if (role !== "user") return false;
		return Boolean(conversation);
	}
};
function shouldRetryInitialMcpGatewayConnect(error) {
	if (error.name === "GatewayClientRequestError" && "retryable" in error && typeof error.retryable === "boolean") return error.retryable;
	const message = error.message.toLowerCase();
	return message.includes("gateway request timeout for connect") || message.includes("gateway connect challenge timeout");
}
//#endregion
//#region src/mcp/channel-tools.ts
/**
* MCP tool registration for channel conversation access.
*
* Tool handlers stay thin: schemas validate public inputs and the bridge owns
* Gateway readiness, routing, event queueing, and approval resolution.
*/
/** Return protocol capabilities advertised when Claude channel mode is enabled. */
function getChannelMcpCapabilities(claudeChannelMode) {
	if (claudeChannelMode === "off") return;
	return { experimental: {
		"claude/channel": {},
		"claude/channel/permission": {}
	} };
}
/** Register all channel MCP tools against a server instance. */
function registerChannelMcpTools(server, bridge) {
	server.tool("conversations_list", "List OpenClaw channel-backed conversations available through session routes.", {
		limit: number().int().min(1).max(500).optional(),
		search: string().optional(),
		channel: string().optional(),
		includeDerivedTitles: boolean().optional(),
		includeLastMessage: boolean().optional()
	}, async (args) => {
		const conversations = await bridge.listConversations(args);
		return {
			...summarizeStructuredResult("conversations", conversations.length, { conversations }),
			structuredContent: { conversations }
		};
	});
	server.tool("conversation_get", "Get one OpenClaw conversation by session key.", { session_key: string().min(1) }, async ({ session_key }) => {
		const conversation = await bridge.getConversation(session_key);
		if (!conversation) return {
			content: [{
				type: "text",
				text: `conversation not found: ${session_key}`
			}],
			isError: true
		};
		return {
			content: [{
				type: "text",
				text: `conversation ${conversation.sessionKey}`
			}],
			structuredContent: { conversation }
		};
	});
	server.tool("messages_read", "Read recent messages for one OpenClaw conversation.", {
		session_key: string().min(1),
		limit: number().int().min(1).max(200).optional()
	}, async ({ session_key, limit }) => {
		const messages = await bridge.readMessages(session_key, limit ?? 20);
		return {
			...summarizeStructuredResult("messages", messages.length, { messages }),
			structuredContent: { messages }
		};
	});
	server.tool("attachments_fetch", "List non-text attachments for a message in one OpenClaw conversation.", {
		session_key: string().min(1),
		message_id: string().min(1),
		limit: number().int().min(1).max(200).optional()
	}, async ({ session_key, message_id, limit }) => {
		const message = await bridge.readMessage(session_key, message_id, limit ?? 100);
		if (!message) return {
			content: [{
				type: "text",
				text: `message not found: ${message_id}`
			}],
			isError: true
		};
		const attachments = extractAttachmentsFromMessage(message);
		return {
			...summarizeResult("attachments", attachments.length),
			structuredContent: {
				attachments,
				message
			}
		};
	});
	server.tool("events_poll", "Poll queued OpenClaw conversation events since a cursor.", {
		after_cursor: number().int().min(0).optional(),
		session_key: string().optional(),
		limit: number().int().min(1).max(200).optional()
	}, async ({ after_cursor, session_key, limit }) => {
		const { events, nextCursor, gap } = bridge.pollEvents({
			afterCursor: after_cursor ?? 0,
			sessionKey: normalizeOptionalString(session_key)
		}, limit ?? 20);
		return {
			...summarizeResult("events", events.length),
			structuredContent: {
				events,
				next_cursor: nextCursor,
				...gap ? { gap } : {}
			}
		};
	});
	server.tool("events_wait", "Wait for the next queued OpenClaw conversation event.", {
		after_cursor: number().int().min(0).optional(),
		session_key: string().optional(),
		timeout_ms: number().int().min(1).max(3e5).optional()
	}, async ({ after_cursor, session_key, timeout_ms }, extra) => {
		const { event, gap } = await bridge.waitForEvent({
			afterCursor: after_cursor ?? 0,
			sessionKey: normalizeOptionalString(session_key)
		}, timeout_ms ?? 3e4, extra.signal);
		return {
			content: [{
				type: "text",
				text: event ? `event ${event.cursor}` : gap ? `event gap before ${gap.oldest_available_cursor}` : "timeout"
			}],
			structuredContent: {
				event,
				...gap ? { gap } : {}
			}
		};
	});
	server.tool("messages_send", "Send a message back through the same OpenClaw conversation route.", {
		session_key: string().min(1),
		text: string().min(1)
	}, async ({ session_key, text }) => {
		return {
			content: [{
				type: "text",
				text: "sent"
			}],
			structuredContent: { result: await bridge.sendMessage({
				sessionKey: session_key,
				text
			}) }
		};
	});
	server.tool("permissions_list_open", "List open OpenClaw exec or plugin approval requests visible through the Gateway.", {}, async () => {
		const approvals = bridge.listPendingApprovals();
		return {
			...summarizeResult("approvals", approvals.length),
			structuredContent: { approvals }
		};
	});
	server.tool("permissions_respond", "Allow or deny one pending OpenClaw exec or plugin approval request.", {
		kind: _enum(["exec", "plugin"]),
		id: string().min(1),
		decision: _enum([
			"allow-once",
			"allow-always",
			"deny"
		])
	}, async ({ kind, id, decision }) => {
		return {
			content: [{
				type: "text",
				text: "approval resolved"
			}],
			structuredContent: { result: await bridge.respondToApproval({
				kind,
				id,
				decision
			}) }
		};
	});
}
//#endregion
//#region src/mcp/channel-server-runtime.ts
async function resolveMcpConfig(config) {
	if (config) return config;
	const { getRuntimeConfig } = await import("./config/config.js");
	return getRuntimeConfig();
}
async function createChannelMcpRuntime(opts = {}) {
	const cfg = await resolveMcpConfig(opts.config);
	const claudeChannelMode = opts.claudeChannelMode ?? "auto";
	const capabilities = getChannelMcpCapabilities(claudeChannelMode);
	const server = new McpServer({
		name: "openclaw",
		version: VERSION
	}, capabilities ? { capabilities } : void 0);
	const bridge = new OpenClawChannelBridge(cfg, {
		gatewayUrl: opts.gatewayUrl,
		gatewayToken: opts.gatewayToken,
		gatewayPassword: opts.gatewayPassword,
		claudeChannelMode,
		verbose: opts.verbose ?? false
	});
	bridge.setServer(server);
	server.server.setNotificationHandler(ClaudePermissionRequestSchema, async ({ params }) => {
		await bridge.handleClaudePermissionRequest({
			requestId: params.request_id,
			toolName: params.tool_name,
			description: params.description,
			inputPreview: params.input_preview
		});
	});
	registerChannelMcpTools(server, bridge);
	return {
		server,
		bridge,
		start: async () => {
			await bridge.start();
		},
		close: async () => {
			const errors = (await Promise.allSettled([bridge.close(), server.close()])).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
			if (errors.length === 1) throw errors[0];
			if (errors.length > 1) throw new AggregateError(errors, "OpenClaw channel MCP shutdown failed");
		}
	};
}
//#endregion
//#region src/mcp/channel-server.ts
/** Serve the channel MCP server over stdio until transport or process shutdown. */
async function serveOpenClawChannelMcp(opts = {}) {
	const { server, start, close } = await createChannelMcpRuntime(opts);
	const transport = new StdioServerTransport();
	let shuttingDown = false;
	let closePromise;
	let resolveClosed;
	const closed = new Promise((resolve) => {
		resolveClosed = resolve;
	});
	const shutdown = () => {
		if (shuttingDown) return;
		shuttingDown = true;
		process.stdin.off("end", shutdown);
		process.stdin.off("close", shutdown);
		process.off("SIGINT", shutdown);
		process.off("SIGTERM", shutdown);
		closePromise = Promise.resolve().then(close);
		closePromise.then(resolveClosed, resolveClosed);
	};
	transport["onclose"] = shutdown;
	process.stdin.once("end", shutdown);
	process.stdin.once("close", shutdown);
	process.once("SIGINT", shutdown);
	process.once("SIGTERM", shutdown);
	try {
		await server.connect(transport);
		await start();
		await closed;
		await closePromise;
	} finally {
		shutdown();
		await closed;
		await closePromise;
	}
}
//#endregion
export { serveOpenClawChannelMcp };
