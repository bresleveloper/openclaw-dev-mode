const require_rolldown_runtime = require("./rolldown-runtime-CiKaZLfC.cjs");
let node_url = require("node:url");
let openclaw_plugin_sdk_ssrf_runtime = require("openclaw/plugin-sdk/ssrf-runtime");
let openclaw_plugin_sdk_error_runtime = require("openclaw/plugin-sdk/error-runtime");
let node_crypto = require("node:crypto");
let node_path = require("node:path");
node_path = require_rolldown_runtime.__toESM(node_path, 1);
let node_fs_promises = require("node:fs/promises");
node_fs_promises = require_rolldown_runtime.__toESM(node_fs_promises, 1);
let node_timers_promises = require("node:timers/promises");
let node_events = require("node:events");
let node_http = require("node:http");
let node_stream_consumers = require("node:stream/consumers");
let openclaw_plugin_sdk_http_response_runtime = require("openclaw/plugin-sdk/http-response-runtime");
// extensions/msteams/src/qa/bot-framework-server.ts
const AMBIGUOUS_GATEWAY_TIMEOUT_MARKER = "QA-MSTEAMS-AMBIGUOUS-504";
async function readJson(request) {
	const body = (await (0, node_stream_consumers.buffer)(request)).toString("utf8");
	return body ? JSON.parse(body) : {};
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
				(0, openclaw_plugin_sdk_http_response_runtime.writeJsonWithoutCharset)(response, 401, { error: "unauthorized" });
				return;
			}
			const route = parseConversationPath(new URL(request.url ?? "/", "http://127.0.0.1").pathname);
			if (request.method !== "POST" || !route) {
				(0, openclaw_plugin_sdk_http_response_runtime.writeJsonWithoutCharset)(response, 404, { error: "not found" });
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
			(0, openclaw_plugin_sdk_http_response_runtime.writeJsonWithoutCharset)(response, acceptedButTimedOut ? 504 : 200, acceptedButTimedOut ? { error: "gateway timeout after acceptance" } : { id: activityId });
		})().catch((error) => {
			(0, openclaw_plugin_sdk_http_response_runtime.writeJsonWithoutCharset)(response, 500, { error: (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(error) });
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
// extensions/msteams/src/qa/adapter.runtime.ts
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
		if (account?.running === true && account.lifecycle === "ready" && account.connected === true && account.restartPending !== true) return;
		await (0, node_timers_promises.setTimeout)(pollIntervalMs);
	}
	throw new Error(`msteams did not become ready; last accounts: ${JSON.stringify(lastAccounts)}`);
}
async function createMSTeamsQaTransportAdapter(context) {
	const accountId = context.adapterOptions?.sutAccountId?.trim() || DEFAULT_ACCOUNT_ID;
	let webhookUrl;
	const nonce = (0, node_crypto.randomUUID)();
	const botToken = createMSTeamsQaBotToken();
	const bootstrapPath = node_path.default.join(context.outputDir, ".msteams-private-qa-bootstrap.mjs");
	const busByNativeMessageId = /* @__PURE__ */ new Map();
	const nativeByBusMessageId = /* @__PURE__ */ new Map();
	const conversations = /* @__PURE__ */ new Map();
	const requireGroupMention = context.adapterOptions?.transportPolicy?.requireGroupMention === true;
	const connector = await startMSTeamsQaBotFrameworkServer({
		botToken,
		nonce,
		async onOutbound(outbound) {
			const conversation = conversations.get(outbound.conversationId);
			const kind = conversation?.kind ?? "channel";
			const conversationId = conversation?.id ?? outbound.conversationId;
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
			const { id, kind } = input.conversation;
			const conversationId = nativeConversationId(id);
			const nativeThreadId = input.threadId ? nativeByBusMessageId.get(input.threadId) ?? input.threadId : void 0;
			conversations.set(conversationId, {
				id,
				kind
			});
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
					conversationType: kind === "direct" ? "personal" : kind === "group" ? "groupChat" : "channel",
					tenantId: TENANT_ID
				},
				...input.replyToId ? { replyToId: input.replyToId } : {},
				channelData: {
					tenant: { id: TENANT_ID },
					...kind === "channel" ? {
						team: {
							id: TEAM_ID,
							aadGroupId: TEAM_AAD_GROUP_ID
						},
						channel: { id: conversationId }
					} : {}
				}
			};
			if (!webhookUrl) throw new Error("Microsoft Teams QA Gateway URL has not been configured");
			const { response, release } = await (0, openclaw_plugin_sdk_ssrf_runtime.fetchWithSsrFGuard)({
				url: webhookUrl,
				init: {
					method: "POST",
					headers: {
						authorization: `Bearer ${botToken}`,
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
			conversations.clear();
		},
		createGatewayConfig: () => {
			return { channels: { msteams: {
				enabled: true,
				appId: APP_ID,
				appPassword: "private-qa-secret",
				tenantId: TENANT_ID,
				dmPolicy: "allowlist",
				allowFrom: [DRIVER_AAD_OBJECT_ID],
				groupPolicy: "open",
				requireMention: requireGroupMention,
				replyStyle: "thread",
				webhook: { path: "/api/messages" },
				legacyWebhook: false
			} } };
		},
		createRuntimeEnvPatch: () => ({
			OPENCLAW_BUILD_PRIVATE_QA: "1",
			NODE_OPTIONS: [process.env.NODE_OPTIONS?.trim(), `--import=${bootstrapUrl}`].filter(Boolean).join(" ")
		}),
		createRuntimePreloads: () => [bootstrapUrl],
		prepareFlow: async ({ gateway }) => {
			webhookUrl = new URL("/api/messages", gateway.baseUrl).toString();
		},
		waitReady: ({ gateway, timeoutMs, pollIntervalMs }) => waitForMSTeamsChannelReady(gateway, timeoutMs, pollIntervalMs),
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
exports.createMSTeamsQaTransportAdapter = createMSTeamsQaTransportAdapter;
