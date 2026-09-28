const require_rolldown_runtime = require("./rolldown-runtime-VH7oDXx4.cjs");
let node_url = require("node:url");
let openclaw_plugin_sdk_ssrf_runtime = require("openclaw/plugin-sdk/ssrf-runtime");
let openclaw_plugin_sdk_error_runtime = require("openclaw/plugin-sdk/error-runtime");
let node_crypto = require("node:crypto");
let node_fs_promises = require("node:fs/promises");
node_fs_promises = require_rolldown_runtime.__toESM(node_fs_promises, 1);
let node_path = require("node:path");
node_path = require_rolldown_runtime.__toESM(node_path, 1);
let node_timers_promises = require("node:timers/promises");
let node_events = require("node:events");
let node_http = require("node:http");
//#region extensions/msteams/src/qa/bot-framework-server.ts
const AMBIGUOUS_GATEWAY_TIMEOUT_MARKER = "QA-MSTEAMS-AMBIGUOUS-504";
async function readJson(request) {
	const chunks = [];
	for await (const chunk of request) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
	const body = Buffer.concat(chunks).toString("utf8");
	return body ? JSON.parse(body) : {};
}
function sendJson(response, status, body) {
	response.writeHead(status, { "content-type": "application/json" });
	response.end(JSON.stringify(body));
}
function parseConversationPath(pathname) {
	const match = /\/v3\/conversations\/([^/]+)\/activities(?:\/[^/]+)?$/u.exec(pathname);
	if (!match) return;
	const encodedConversationId = match[1];
	if (!encodedConversationId) return;
	const [conversationId, threadId] = decodeURIComponent(encodedConversationId).split(";messageid=", 2);
	if (!conversationId) return;
	return {
		conversationId,
		threadId
	};
}
async function startMSTeamsQaBotFrameworkServer(options) {
	const server = (0, node_http.createServer)((request, response) => {
		(async () => {
			if (request.headers["x-openclaw-msteams-qa-nonce"] !== options.nonce || request.headers.authorization !== `Bearer ${options.botToken}`) {
				sendJson(response, 401, { error: "unauthorized" });
				return;
			}
			const route = parseConversationPath(new URL(request.url ?? "/", "http://127.0.0.1").pathname);
			if (request.method !== "POST" || !route) {
				sendJson(response, 404, { error: "not found" });
				return;
			}
			const activity = await readJson(request);
			const activityId = `qa-outbound-${(0, node_crypto.randomUUID)()}`;
			await options.onOutbound({
				activity,
				activityId,
				conversationId: route.conversationId,
				...route.threadId ? { threadId: route.threadId } : {}
			});
			const acceptedButTimedOut = activity.type === "message" && typeof activity.text === "string" && activity.text.includes(AMBIGUOUS_GATEWAY_TIMEOUT_MARKER);
			sendJson(response, acceptedButTimedOut ? 504 : 200, acceptedButTimedOut ? { error: "gateway timeout after acceptance" } : { id: activityId });
		})().catch((error) => {
			sendJson(response, 500, { error: (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(error) });
		});
	});
	server.listen(0, "127.0.0.1");
	await (0, node_events.once)(server, "listening");
	const { port } = server.address();
	return {
		baseUrl: `http://127.0.0.1:${port}/`,
		async close() {
			server.close();
			await (0, node_events.once)(server, "close");
		}
	};
}
async function reserveMSTeamsQaWebhookPort() {
	const server = (0, node_http.createServer)();
	server.listen(0, "127.0.0.1");
	await (0, node_events.once)(server, "listening");
	const { port } = server.address();
	server.close();
	await (0, node_events.once)(server, "close");
	return port;
}
//#endregion
//#region extensions/msteams/src/qa/adapter.runtime.ts
const SERVICE_URL = "https://smba.trafficmanager.net/qa";
const APP_ID = "qa-msteams-app";
const TENANT_ID = "qa-msteams-tenant";
const DRIVER_ID = "qa-msteams-driver";
const DRIVER_AAD_OBJECT_ID = "00000000-0000-4000-8000-000000000002";
const TEAM_ID = "qa-msteams-team";
const TEAM_AAD_GROUP_ID = "00000000-0000-4000-8000-000000000001";
const DEFAULT_ACCOUNT_ID = "default";
function nativeConversationId(logicalId) {
	return logicalId.startsWith("19:") ? logicalId : `19:${logicalId}@thread.tacv2`;
}
function renderMSTeamsQaText(text) {
	const mentionText = "<at>openclaw</at>";
	const renderedText = text.replace(/@openclaw\b/giu, mentionText);
	return {
		text: renderedText,
		...renderedText === text ? {} : { entities: [{
			type: "mention",
			text: mentionText,
			mentioned: {
				id: APP_ID,
				name: "OpenClaw QA"
			}
		}] }
	};
}
function activityText(activity) {
	return typeof activity.text === "string" ? activity.text : "";
}
function createMSTeamsQaBotToken() {
	const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
	return [
		encode({
			alg: "none",
			typ: "JWT"
		}),
		encode({
			appid: APP_ID,
			jti: (0, node_crypto.randomUUID)(),
			tid: TENANT_ID
		}),
		"qa"
	].join(".");
}
async function waitForMSTeamsChannelReady(gateway, timeoutMs = 6e4, pollIntervalMs = 500) {
	const deadline = Date.now() + timeoutMs;
	let lastAccounts;
	while (Date.now() < deadline) {
		const accounts = (await gateway.call("channels.status", {
			probe: false,
			timeoutMs: 2e3
		}, { timeoutMs: 5e3 })).channelAccounts?.msteams ?? [];
		lastAccounts = accounts;
		const account = accounts.find((entry) => entry.accountId === DEFAULT_ACCOUNT_ID);
		if (account?.running === true && account.restartPending !== true) return;
		await (0, node_timers_promises.setTimeout)(pollIntervalMs);
	}
	throw new Error(`msteams did not become ready; last accounts: ${JSON.stringify(lastAccounts)}`);
}
async function createMSTeamsQaTransportAdapter(context) {
	const accountId = context.adapterOptions?.sutAccountId?.trim() || DEFAULT_ACCOUNT_ID;
	const webhookPort = await reserveMSTeamsQaWebhookPort();
	const nonce = (0, node_crypto.randomUUID)();
	const botToken = createMSTeamsQaBotToken();
	const bootstrapPath = node_path.default.join(context.outputDir, ".msteams-private-qa-bootstrap.mjs");
	const busByNativeMessageId = /* @__PURE__ */ new Map();
	const nativeByBusMessageId = /* @__PURE__ */ new Map();
	const conversationKindByNativeId = /* @__PURE__ */ new Map();
	const logicalConversationByNativeId = /* @__PURE__ */ new Map();
	const requireGroupMention = context.adapterOptions?.transportPolicy?.requireGroupMention === true;
	const connector = await startMSTeamsQaBotFrameworkServer({
		botToken,
		nonce,
		async onOutbound(outbound) {
			const kind = conversationKindByNativeId.get(outbound.conversationId) ?? "channel";
			const conversationId = logicalConversationByNativeId.get(outbound.conversationId) ?? outbound.conversationId;
			const message = await context.messages.addOutboundMessage({
				accountId,
				to: `${kind === "direct" ? "dm" : kind}:${conversationId}`,
				senderId: APP_ID,
				text: activityText(outbound.activity),
				timestamp: Date.now(),
				...outbound.threadId ? { threadId: busByNativeMessageId.get(outbound.threadId) ?? outbound.threadId } : {}
			});
			nativeByBusMessageId.set(message.id, outbound.activityId);
			busByNativeMessageId.set(outbound.activityId, message.id);
			conversationKindByNativeId.set(outbound.conversationId, kind);
		}
	});
	try {
		await node_fs_promises.default.mkdir(context.outputDir, { recursive: true });
		await node_fs_promises.default.writeFile(bootstrapPath, [
			"const key = Symbol.for(\"openclaw.msteams.privateQaRuntime\");",
			`globalThis[key] = ${JSON.stringify({
				connectorUrl: connector.baseUrl,
				nonce,
				botToken
			})};`,
			""
		].join("\n"), {
			encoding: "utf8",
			mode: 384
		});
	} catch (error) {
		await connector.close().catch(() => void 0);
		throw error;
	}
	const bootstrapUrl = (0, node_url.pathToFileURL)(bootstrapPath).href;
	return {
		id: "msteams",
		label: "Microsoft Teams live",
		accountId,
		requiredPluginIds: ["msteams"],
		supportedActions: [],
		async sendInbound(input) {
			const conversationId = nativeConversationId(input.conversation.id);
			const nativeThreadId = input.threadId ? nativeByBusMessageId.get(input.threadId) ?? input.threadId : void 0;
			conversationKindByNativeId.set(conversationId, input.conversation.kind);
			logicalConversationByNativeId.set(conversationId, input.conversation.id);
			const activityId = `qa-inbound-${(0, node_crypto.randomUUID)()}`;
			const activity = {
				id: activityId,
				type: "message",
				...renderMSTeamsQaText(input.text),
				timestamp: (/* @__PURE__ */ new Date()).toISOString(),
				channelId: "msteams",
				serviceUrl: SERVICE_URL,
				from: {
					id: DRIVER_ID,
					aadObjectId: DRIVER_AAD_OBJECT_ID,
					name: input.senderName ?? "Teams QA Driver"
				},
				recipient: {
					id: APP_ID,
					name: "OpenClaw QA"
				},
				conversation: {
					id: nativeThreadId ? `${conversationId};messageid=${nativeThreadId}` : conversationId,
					conversationType: input.conversation.kind === "direct" ? "personal" : input.conversation.kind === "group" ? "groupChat" : "channel",
					tenantId: TENANT_ID
				},
				...input.replyToId ? { replyToId: input.replyToId } : {},
				channelData: {
					tenant: { id: TENANT_ID },
					team: {
						id: TEAM_ID,
						aadGroupId: TEAM_AAD_GROUP_ID
					},
					channel: { id: conversationId }
				}
			};
			const webhookUrl = `http://127.0.0.1:${webhookPort}/api/messages`;
			const { response, release } = await (0, openclaw_plugin_sdk_ssrf_runtime.fetchWithSsrFGuard)({
				url: webhookUrl,
				init: {
					method: "POST",
					headers: {
						authorization: "Bearer private-qa",
						"content-type": "application/json"
					},
					body: JSON.stringify(activity)
				},
				policy: (0, openclaw_plugin_sdk_ssrf_runtime.ssrfPolicyFromHttpBaseUrlAllowedOrigin)(webhookUrl),
				maxRedirects: 0,
				auditContext: "msteams-private-qa-ingress"
			});
			try {
				await response.text();
				if (!response.ok) throw new Error(`Microsoft Teams QA ingress returned HTTP ${response.status}`);
			} finally {
				await release();
			}
			const message = await context.messages.addInboundMessage({
				...input,
				accountId,
				senderId: DRIVER_ID
			});
			nativeByBusMessageId.set(message.id, activityId);
			busByNativeMessageId.set(activityId, message.id);
			return message;
		},
		resetTransport() {
			busByNativeMessageId.clear();
			nativeByBusMessageId.clear();
			conversationKindByNativeId.clear();
			logicalConversationByNativeId.clear();
		},
		createGatewayConfig: () => ({ channels: { msteams: {
			enabled: true,
			appId: APP_ID,
			appPassword: "private-qa-secret",
			tenantId: TENANT_ID,
			dmPolicy: "allowlist",
			allowFrom: [DRIVER_AAD_OBJECT_ID],
			groupPolicy: "open",
			requireMention: requireGroupMention,
			replyStyle: "thread",
			webhook: {
				port: webhookPort,
				path: "/api/messages"
			}
		} } }),
		createRuntimeEnvPatch: () => ({
			OPENCLAW_BUILD_PRIVATE_QA: "1",
			NODE_OPTIONS: [process.env.NODE_OPTIONS?.trim(), `--import=${bootstrapUrl}`].filter(Boolean).join(" ")
		}),
		createRuntimePreloads: () => [bootstrapUrl],
		waitReady: async ({ gateway, timeoutMs, pollIntervalMs }) => await waitForMSTeamsChannelReady(gateway, timeoutMs, pollIntervalMs),
		buildAgentDelivery: ({ target }) => ({
			channel: "msteams",
			to: target,
			replyChannel: "msteams",
			replyTo: target
		}),
		async handleAction() {
			throw new Error("Microsoft Teams live QA adapter does not implement transport actions");
		},
		createReportNotes: () => ["Uses a loopback Bot Framework Connector with the real Microsoft Teams plugin and Gateway."],
		async cleanup() {
			try {
				await connector.close();
			} finally {
				await node_fs_promises.default.rm(bootstrapPath, { force: true });
			}
		}
	};
}
//#endregion
exports.createMSTeamsQaTransportAdapter = createMSTeamsQaTransportAdapter;
