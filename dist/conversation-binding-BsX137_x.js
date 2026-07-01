import { i as asOptionalRecord } from "./record-coerce-DHZ4bFlT.js";
import { P as timestampMsToIsoString, j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { o as normalizeSingleOrTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
import { c as isRecord } from "./utils-BApvfmPs.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DOKojISm.js";
import { y as resolveSessionAgentIds } from "./agent-scope-CDZXADgT.js";
import { et as resolveSessionStoreEntry } from "./store-DJ7wx5_V.js";
import { d as resolveStorePath } from "./paths-CHZBIGhF.js";
import { m as loadExecApprovals } from "./exec-approvals-BQlhahST.js";
import { a as resolveWindowsSpawnProgram, r as materializeWindowsSpawnProgram } from "./windows-spawn-CuLQQ8uW.js";
import "./temp-path-BbDdjtr4.js";
import "./number-runtime-DBLVDypr.js";
import { o as resolveSandboxContext } from "./sandbox-yDmlXhAz.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { i as loadSessionStore } from "./session-store-runtime-BlqMkGtn.js";
import "./exec-approvals-runtime-DLgLFr0V.js";
import "./agent-runtime-Dcp8a_4-.js";
import "./agent-harness-runtime-Ogl9lVKP.js";
import { n as isJsonObject } from "./protocol-dh-ETiNd.js";
import { H as readCodexNotificationTurnId, V as readCodexNotificationThreadId, d as resolveCodexAppServerRequestModelSelection, p as resolveCodexBindingModelProviderFallback, t as CODEX_NATIVE_PERSONALITY_NONE } from "./thread-lifecycle-h0GhA0Qx.js";
import { d as resolveCodexAppServerRuntimeOptions, h as resolveOpenClawExecPolicyForCodexAppServer, i as codexSandboxPolicyForTurn, n as canUseCodexModelBackedApprovalsReviewerForModel, o as isCodexFastServiceTier, p as resolveCodexModelBackedReviewerPolicyContext } from "./config-aGxLKWj0.js";
import { r as assertCodexThreadStartResponse } from "./protocol-validators-B19q5BIX.js";
import { a as normalizeCodexAppServerBindingModelProvider, i as isCodexAppServerNativeAuthProfile, l as writeCodexAppServerBinding, n as clearCodexAppServerBinding, o as readCodexAppServerBinding } from "./session-binding-BkFXqxOt.js";
import { t as CODEX_CONTROL_METHODS } from "./capabilities-BnKX6qhJ.js";
import { a as formatCodexDisplayText, t as resolveCodexAppServerForModelProvider } from "./app-server-policy-CEpP7ja-.js";
import { c as getLeasedSharedCodexAppServerClient, u as releaseLeasedSharedCodexAppServerClient, v as resolveCodexAppServerAuthProfileIdForAgent } from "./shared-client-ChYWHlb8.js";
import { n as resolveCodexNativeExecutionBlock, r as resolveCodexNativeSandboxBlock } from "./sandbox-guard-Bz6I90fx.js";
import process$1 from "node:process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { spawn } from "node:child_process";
//#region extensions/codex/src/conversation-binding-data.ts
const BINDING_DATA_VERSION = 1;
function createCodexConversationBindingData(params) {
	const agentDir = params.agentDir?.trim();
	const agentId = params.agentId?.trim();
	return {
		kind: "codex-app-server-session",
		version: BINDING_DATA_VERSION,
		sessionFile: params.sessionFile,
		workspaceDir: params.workspaceDir,
		...agentDir ? { agentDir } : {},
		...agentId ? { agentId } : {}
	};
}
function createCodexCliNodeConversationBindingData(params) {
	const cwd = params.cwd?.trim();
	return {
		kind: "codex-cli-node-session",
		version: BINDING_DATA_VERSION,
		nodeId: params.nodeId,
		sessionId: params.sessionId,
		...cwd ? { cwd } : {}
	};
}
function readCodexConversationBindingData(binding) {
	const data = binding?.data;
	if (!data || typeof data !== "object" || Array.isArray(data)) return;
	return readCodexConversationBindingDataRecord(data);
}
function readCodexConversationBindingDataRecord(data) {
	if (data.kind === "codex-cli-node-session") {
		if (data.version !== BINDING_DATA_VERSION || typeof data.nodeId !== "string" || !data.nodeId.trim() || typeof data.sessionId !== "string" || !data.sessionId.trim()) return;
		return {
			kind: "codex-cli-node-session",
			version: BINDING_DATA_VERSION,
			nodeId: data.nodeId.trim(),
			sessionId: data.sessionId.trim(),
			cwd: typeof data.cwd === "string" && data.cwd.trim() ? data.cwd.trim() : void 0
		};
	}
	if (data.kind !== "codex-app-server-session") return;
	if (data.version !== BINDING_DATA_VERSION || typeof data.sessionFile !== "string" || !data.sessionFile.trim()) return;
	return {
		kind: "codex-app-server-session",
		version: BINDING_DATA_VERSION,
		sessionFile: data.sessionFile,
		workspaceDir: typeof data.workspaceDir === "string" && data.workspaceDir.trim() ? data.workspaceDir : process$1.cwd(),
		agentDir: typeof data.agentDir === "string" && data.agentDir.trim() ? data.agentDir : void 0,
		agentId: typeof data.agentId === "string" && data.agentId.trim() ? data.agentId : void 0
	};
}
function resolveCodexDefaultWorkspaceDir(pluginConfig) {
	return readString$1(asOptionalRecord(asOptionalRecord(pluginConfig)?.appServer), "defaultWorkspaceDir") ?? process$1.cwd();
}
function readString$1(record, key) {
	const value = record?.[key];
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
//#endregion
//#region extensions/codex/src/conversation-control.ts
const CODEX_CONVERSATION_CONTROL_STATE = Symbol.for("openclaw.codex.conversationControl");
function getActiveTurns() {
	const globalState = globalThis;
	globalState[CODEX_CONVERSATION_CONTROL_STATE] ??= /* @__PURE__ */ new Map();
	return globalState[CODEX_CONVERSATION_CONTROL_STATE];
}
function trackCodexConversationActiveTurn(active) {
	const activeTurns = getActiveTurns();
	activeTurns.set(active.sessionFile, active);
	return () => {
		if (activeTurns.get(active.sessionFile)?.turnId === active.turnId) activeTurns.delete(active.sessionFile);
	};
}
function readCodexConversationActiveTurn(sessionFile) {
	return getActiveTurns().get(sessionFile);
}
async function stopCodexConversationTurn(params) {
	const active = readCodexConversationActiveTurn(params.sessionFile);
	if (!active) return {
		stopped: false,
		message: "No active Codex run to stop."
	};
	const runtime = resolveCodexAppServerRuntimeOptions({ pluginConfig: params.pluginConfig });
	const lookup = buildBindingLookup(params);
	const binding = await readCodexAppServerBinding(params.sessionFile, lookup);
	const client = await getLeasedSharedCodexAppServerClient({
		startOptions: runtime.start,
		timeoutMs: runtime.requestTimeoutMs,
		authProfileId: binding?.authProfileId,
		...lookup
	});
	try {
		await client.request("turn/interrupt", {
			threadId: active.threadId,
			turnId: active.turnId
		}, { timeoutMs: runtime.requestTimeoutMs });
	} finally {
		releaseLeasedSharedCodexAppServerClient(client);
	}
	return {
		stopped: true,
		message: "Codex stop requested."
	};
}
async function steerCodexConversationTurn(params) {
	const active = readCodexConversationActiveTurn(params.sessionFile);
	const text = params.message.trim();
	if (!text) return {
		steered: false,
		message: "Usage: /codex steer <message>"
	};
	if (!active) return {
		steered: false,
		message: "No active Codex run to steer."
	};
	const runtime = resolveCodexAppServerRuntimeOptions({ pluginConfig: params.pluginConfig });
	const lookup = buildBindingLookup(params);
	const binding = await readCodexAppServerBinding(params.sessionFile, lookup);
	const client = await getLeasedSharedCodexAppServerClient({
		startOptions: runtime.start,
		timeoutMs: runtime.requestTimeoutMs,
		authProfileId: binding?.authProfileId,
		...lookup
	});
	try {
		await client.request("turn/steer", {
			threadId: active.threadId,
			expectedTurnId: active.turnId,
			input: [{
				type: "text",
				text,
				text_elements: []
			}]
		}, { timeoutMs: runtime.requestTimeoutMs });
	} finally {
		releaseLeasedSharedCodexAppServerClient(client);
	}
	return {
		steered: true,
		message: "Sent steer message to Codex."
	};
}
async function setCodexConversationModel(params) {
	const model = params.model.trim();
	if (!model) return "Usage: /codex model <model>";
	const lookup = buildBindingLookup(params);
	const binding = await requireThreadBinding(params.sessionFile, lookup);
	const reviewerPolicyContext = resolveCodexModelBackedReviewerPolicyContext({
		provider: "codex",
		model,
		bindingModelProvider: binding.modelProvider,
		bindingModel: binding.model,
		nativeAuthProfile: isCodexAppServerNativeAuthProfile({
			authProfileId: binding.authProfileId,
			...lookup
		})
	});
	const runtime = resolveCodexAppServerRuntimeOptions({
		pluginConfig: params.pluginConfig,
		modelProvider: reviewerPolicyContext.modelProvider,
		model: reviewerPolicyContext.model,
		config: params.config,
		agentDir: params.agentDir
	});
	const modelSelection = resolveCodexAppServerRequestModelSelection({
		model,
		modelProvider: resolveConversationControlModelProvider({
			authProfileId: binding.authProfileId,
			bindingModel: binding.model,
			bindingModelProvider: binding.modelProvider,
			currentModel: model,
			...lookup
		}),
		authProfileId: binding.authProfileId,
		...lookup
	});
	const response = await resumeThreadWithOverrides({
		runtime,
		threadId: binding.threadId,
		authProfileId: binding.authProfileId,
		...lookup,
		model: modelSelection.model,
		modelProvider: modelSelection.modelProvider
	});
	await writeCodexAppServerBinding(params.sessionFile, {
		...binding,
		cwd: response.thread.cwd ?? binding.cwd,
		model: response.model ?? modelSelection.model,
		modelProvider: response.modelProvider ?? modelSelection.modelProvider,
		approvalPolicy: binding.approvalPolicy,
		sandbox: binding.sandbox,
		serviceTier: binding.serviceTier ?? runtime.serviceTier ?? void 0
	}, lookup);
	return `Codex model set to ${formatCodexDisplayText(response.model ?? model)}.`;
}
async function setCodexConversationFastMode(params) {
	const lookup = buildBindingLookup(params);
	const binding = await requireThreadBinding(params.sessionFile, lookup);
	if (params.enabled == null) return `Codex fast mode: ${isCodexFastServiceTier(binding.serviceTier) ? "on" : "off"}.`;
	const serviceTier = params.enabled ? "priority" : "flex";
	await writeCodexAppServerBinding(params.sessionFile, {
		...binding,
		serviceTier
	}, lookup);
	return `Codex fast mode ${params.enabled ? "enabled" : "disabled"}.`;
}
async function setCodexConversationPermissions(params) {
	const lookup = buildBindingLookup(params);
	const binding = await requireThreadBinding(params.sessionFile, lookup);
	if (!params.mode) return `Codex permissions: ${formatPermissionsMode(binding)}.`;
	const policy = permissionsForMode(params.mode);
	await writeCodexAppServerBinding(params.sessionFile, {
		...binding,
		approvalPolicy: policy.approvalPolicy,
		sandbox: policy.sandbox
	}, lookup);
	return `Codex permissions set to ${params.mode === "yolo" ? "full access" : "default"}.`;
}
function parseCodexFastModeArg(arg) {
	const normalized = arg?.trim().toLowerCase();
	if (!normalized || normalized === "status") return;
	if (normalized === "on" || normalized === "true" || normalized === "fast") return true;
	if (normalized === "off" || normalized === "false" || normalized === "flex") return false;
}
function parseCodexPermissionsModeArg(arg) {
	const normalized = arg?.trim().toLowerCase();
	if (!normalized || normalized === "status") return;
	if (normalized === "yolo" || normalized === "full" || normalized === "full-access") return "yolo";
	if (normalized === "default" || normalized === "guardian") return "default";
}
function formatPermissionsMode(binding) {
	return binding.approvalPolicy === "never" && binding.sandbox === "danger-full-access" ? "full access" : "default";
}
async function requireThreadBinding(sessionFile, lookup = {}) {
	const binding = await readCodexAppServerBinding(sessionFile, lookup);
	if (!binding?.threadId) throw new Error("No Codex thread is attached to this OpenClaw session yet.");
	return binding;
}
async function resumeThreadWithOverrides(params) {
	const runtime = params.runtime;
	const client = await getLeasedSharedCodexAppServerClient({
		startOptions: runtime.start,
		timeoutMs: runtime.requestTimeoutMs,
		authProfileId: params.authProfileId,
		...buildBindingLookup(params)
	});
	try {
		return await client.request(CODEX_CONTROL_METHODS.resumeThread, {
			threadId: params.threadId,
			...params.model ? { model: params.model } : {},
			...params.modelProvider ? { modelProvider: params.modelProvider } : {},
			approvalPolicy: params.approvalPolicy ?? runtime.approvalPolicy,
			sandbox: params.sandbox ?? runtime.sandbox,
			approvalsReviewer: runtime.approvalsReviewer,
			...params.serviceTier ? { serviceTier: params.serviceTier } : {},
			persistExtendedHistory: true
		}, { timeoutMs: runtime.requestTimeoutMs });
	} finally {
		releaseLeasedSharedCodexAppServerClient(client);
	}
}
function buildBindingLookup(params) {
	const agentDir = params.agentDir?.trim();
	return {
		...agentDir ? { agentDir } : {},
		...params.config ? { config: params.config } : {}
	};
}
function resolveConversationControlModelProvider(params) {
	const modelProvider = resolveCodexBindingModelProviderFallback({
		currentModel: params.currentModel,
		bindingModel: params.bindingModel,
		bindingModelProvider: params.bindingModelProvider
	})?.trim();
	if (!modelProvider || modelProvider.toLowerCase() === "codex") return;
	if (isCodexAppServerNativeAuthProfile(params) && modelProvider.toLowerCase() === "openai") return;
	return modelProvider.toLowerCase() === "openai" ? "openai" : modelProvider;
}
function permissionsForMode(mode) {
	return mode === "yolo" ? {
		approvalPolicy: "never",
		sandbox: "danger-full-access"
	} : {
		approvalPolicy: "on-request",
		sandbox: "workspace-write"
	};
}
//#endregion
//#region extensions/codex/src/conversation-turn-collector.ts
const MAX_PENDING_NOTIFICATIONS_PER_TURN = 100;
function createCodexConversationTurnCollector(threadId) {
	let turnId;
	let completed = false;
	let failedError;
	let timeout;
	const assistantTextByItem = /* @__PURE__ */ new Map();
	const assistantOrder = [];
	const pendingNotificationsByTurnId = /* @__PURE__ */ new Map();
	let resolveCompletion;
	let rejectCompletion;
	const rememberItem = (itemId) => {
		if (!assistantOrder.includes(itemId)) assistantOrder.push(itemId);
	};
	const collectReplyText = () => {
		return assistantOrder.map((itemId) => assistantTextByItem.get(itemId)?.trim()).filter((text) => Boolean(text)).at(-1) ?? "";
	};
	const clearWaitState = () => {
		if (timeout) {
			clearTimeout(timeout);
			timeout = void 0;
		}
		resolveCompletion = void 0;
		rejectCompletion = void 0;
	};
	const finish = () => {
		if (completed) return;
		completed = true;
		if (failedError) rejectCompletion?.(new Error(failedError));
		else resolveCompletion?.({ replyText: collectReplyText() });
		clearWaitState();
	};
	const handleNotification = (notification) => {
		const params = isJsonObject(notification.params) ? notification.params : void 0;
		if (!params || readCodexNotificationThreadId(params) !== threadId) return;
		if (!turnId) {
			const pendingTurnId = readNotificationTurnId(params);
			if (pendingTurnId) {
				const pending = pendingNotificationsByTurnId.get(pendingTurnId) ?? [];
				if (pending.length < MAX_PENDING_NOTIFICATIONS_PER_TURN) {
					pending.push(notification);
					pendingNotificationsByTurnId.set(pendingTurnId, pending);
				}
			}
			return;
		}
		if (!isNotificationForTurn(params, threadId, turnId)) return;
		if (notification.method === "item/agentMessage/delta") {
			const itemId = readString(params, "itemId") ?? readString(params, "id") ?? "assistant";
			const delta = readTextString(params, "delta");
			if (!delta) return;
			rememberItem(itemId);
			assistantTextByItem.set(itemId, `${assistantTextByItem.get(itemId) ?? ""}${delta}`);
			return;
		}
		if (notification.method === "item/completed") {
			const item = isJsonObject(params.item) ? params.item : void 0;
			if (item?.type === "agentMessage") {
				const itemId = readString(item, "id") ?? readString(params, "itemId") ?? "assistant";
				const text = readTextString(item, "text");
				if (text) {
					rememberItem(itemId);
					assistantTextByItem.set(itemId, text);
				}
			}
			return;
		}
		if (notification.method === "turn/completed") {
			const turn = isJsonObject(params.turn) ? params.turn : void 0;
			if (readString(turn, "status") === "failed") failedError = readString(asOptionalRecord(turn?.error), "message") ?? "codex app-server turn failed";
			const items = Array.isArray(turn?.items) ? turn.items : [];
			for (const item of items) {
				if (!isJsonObject(item) || item.type !== "agentMessage") continue;
				const itemId = readString(item, "id") ?? `assistant-${assistantOrder.length + 1}`;
				const text = readTextString(item, "text");
				if (text) {
					rememberItem(itemId);
					assistantTextByItem.set(itemId, text);
				}
			}
			finish();
		}
	};
	return {
		setTurnId(nextTurnId) {
			turnId = nextTurnId;
			const pending = pendingNotificationsByTurnId.get(nextTurnId) ?? [];
			pendingNotificationsByTurnId.clear();
			for (const notification of pending) handleNotification(notification);
		},
		handleNotification,
		wait(params) {
			if (completed) return failedError ? Promise.reject(new Error(failedError)) : Promise.resolve({ replyText: collectReplyText() });
			return new Promise((resolve, reject) => {
				resolveCompletion = resolve;
				rejectCompletion = reject;
				timeout = setTimeout(() => {
					completed = true;
					reject(/* @__PURE__ */ new Error("codex app-server bound turn timed out"));
					clearWaitState();
				}, resolveTimerTimeoutMs(params.timeoutMs, 100, 100));
				timeout.unref?.();
			});
		}
	};
}
function isNotificationForTurn(params, threadId, turnId) {
	if (readCodexNotificationThreadId(params) !== threadId) return false;
	if (!turnId) return true;
	const directTurnId = readString(params, "turnId");
	if (directTurnId) return directTurnId === turnId;
	return readString(isJsonObject(params.turn) ? params.turn : void 0, "id") === turnId;
}
function readNotificationTurnId(params) {
	return readCodexNotificationTurnId(params);
}
function readString(record, key) {
	const value = record?.[key];
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function readTextString(record, key) {
	const value = record?.[key];
	return typeof value === "string" && value.length > 0 ? value : void 0;
}
//#endregion
//#region extensions/codex/src/conversation-turn-input.ts
const IMAGE_EXTENSIONS = new Set([
	".avif",
	".gif",
	".jpeg",
	".jpg",
	".png",
	".webp"
]);
function buildCodexConversationTurnInput(params) {
	return [{
		type: "text",
		text: params.prompt,
		text_elements: []
	}, ...extractInboundMedia(params.event).map(toCodexImageInput).filter((item) => item !== void 0)];
}
function extractInboundMedia(event) {
	const metadata = event.metadata ?? {};
	const paths = normalizeSingleOrTrimmedStringList(metadata.mediaPaths).concat(normalizeSingleOrTrimmedStringList(metadata.mediaPath));
	const urls = normalizeSingleOrTrimmedStringList(metadata.mediaUrls).concat(normalizeSingleOrTrimmedStringList(metadata.mediaUrl));
	const mimeTypes = normalizeSingleOrTrimmedStringList(metadata.mediaTypes).concat(normalizeSingleOrTrimmedStringList(metadata.mediaType));
	const count = Math.max(paths.length, urls.length, mimeTypes.length);
	const media = [];
	for (let index = 0; index < count; index += 1) media.push({
		path: paths[index],
		url: urls[index],
		mimeType: mimeTypes[index] ?? mimeTypes[0]
	});
	return media;
}
function toCodexImageInput(media) {
	if (!isImageMedia(media)) return;
	const localPath = media.path ?? readLocalMediaPath(media.url);
	if (localPath) {
		const normalized = normalizeFileUrl(localPath);
		return normalized ? {
			type: "localImage",
			path: normalized
		} : void 0;
	}
	return media.url ? {
		type: "image",
		url: media.url
	} : void 0;
}
function isImageMedia(media) {
	if (media.mimeType?.toLowerCase().startsWith("image/")) return true;
	const candidate = media.path ?? media.url;
	if (!candidate) return false;
	return IMAGE_EXTENSIONS.has(path.extname(candidate.split(/[?#]/, 1)[0] ?? "").toLowerCase());
}
function normalizeFileUrl(value) {
	if (!value.startsWith("file://")) return value;
	try {
		return fileURLToPath(value);
	} catch {
		return;
	}
}
function readLocalMediaPath(value) {
	if (!value) return;
	if (value.startsWith("file://")) return value;
	if (value.startsWith("//")) return;
	if (path.isAbsolute(value) || path.win32.isAbsolute(value)) return value;
	return /^[a-z][a-z0-9+.-]*:/i.test(value) ? void 0 : value;
}
//#endregion
//#region extensions/codex/src/node-cli-sessions.ts
const CODEX_CLI_SESSIONS_LIST_COMMAND = "codex.cli.sessions.list";
const CODEX_CLI_SESSION_RESUME_COMMAND = "codex.cli.session.resume";
const DEFAULT_SESSION_LIMIT = 10;
const MAX_SESSION_LIMIT = 50;
const DEFAULT_RESUME_TIMEOUT_MS = 20 * 6e4;
const SESSION_ID_PATTERN = /^[A-Za-z0-9._:-]{1,128}$/;
const activeResumeSessions = /* @__PURE__ */ new Set();
const DEFAULT_RESUME_SPAWN_RUNTIME = {
	platform: process$1.platform,
	env: process$1.env,
	execPath: process$1.execPath
};
function createCodexCliSessionNodeHostCommands() {
	return [{
		command: CODEX_CLI_SESSIONS_LIST_COMMAND,
		cap: "codex-cli-sessions",
		handle: listLocalCodexCliSessions
	}, {
		command: CODEX_CLI_SESSION_RESUME_COMMAND,
		cap: "codex-cli-sessions",
		dangerous: true,
		handle: resumeLocalCodexCliSession
	}];
}
function createCodexCliSessionNodeInvokePolicies() {
	return [{
		commands: [CODEX_CLI_SESSIONS_LIST_COMMAND],
		defaultPlatforms: [
			"macos",
			"linux",
			"windows"
		],
		handle: (ctx) => ctx.invokeNode()
	}, {
		commands: [CODEX_CLI_SESSION_RESUME_COMMAND],
		dangerous: true,
		handle: (ctx) => ctx.invokeNode()
	}];
}
async function listCodexCliSessionsOnNode(params) {
	const node = await resolveCodexCliNode({
		runtime: params.runtime,
		requestedNode: params.requestedNode,
		command: CODEX_CLI_SESSIONS_LIST_COMMAND
	});
	return {
		node,
		result: parseCodexCliSessionsListResult(await params.runtime.nodes.invoke({
			nodeId: readNodeId(node),
			command: CODEX_CLI_SESSIONS_LIST_COMMAND,
			params: {
				limit: params.limit,
				filter: params.filter
			},
			timeoutMs: 15e3
		}))
	};
}
async function resolveCodexCliSessionForBindingOnNode(params) {
	const listing = await listCodexCliSessionsOnNode({
		runtime: params.runtime,
		requestedNode: params.requestedNode,
		filter: params.sessionId,
		limit: MAX_SESSION_LIMIT
	});
	if (!listing.node.commands?.includes("codex.cli.session.resume")) throw new Error(`Node ${formatNodeLabel(listing.node)} does not expose ${CODEX_CLI_SESSION_RESUME_COMMAND}.`);
	return {
		node: listing.node,
		session: listing.result.sessions.find((session) => session.sessionId === params.sessionId)
	};
}
async function resumeCodexCliSessionOnNode(params) {
	const payload = unwrapNodeInvokePayload(await params.runtime.nodes.invoke({
		nodeId: params.nodeId,
		command: CODEX_CLI_SESSION_RESUME_COMMAND,
		params: {
			sessionId: params.sessionId,
			prompt: params.prompt,
			cwd: params.cwd,
			timeoutMs: params.timeoutMs
		},
		timeoutMs: (params.timeoutMs ?? DEFAULT_RESUME_TIMEOUT_MS) + 5e3
	}));
	if (!isRecord(payload) || payload.ok !== true || typeof payload.text !== "string") throw new Error("Codex CLI resume returned an invalid payload.");
	return {
		ok: true,
		sessionId: typeof payload.sessionId === "string" ? payload.sessionId : params.sessionId,
		text: payload.text
	};
}
function formatCodexCliSessions(params) {
	if (params.result.sessions.length === 0) return `No Codex CLI sessions returned from ${formatCodexDisplayText(formatNodeLabel(params.node))}.`;
	return [`Codex CLI sessions on ${formatCodexDisplayText(formatNodeLabel(params.node))}:`, ...params.result.sessions.map((session) => {
		const details = [session.cwd, session.updatedAt].filter((value) => Boolean(value));
		return `- ${formatCodexDisplayText(session.sessionId)}${session.lastMessage ? ` - ${formatCodexDisplayText(session.lastMessage)}` : ""}${details.length > 0 ? ` (${details.map(formatCodexDisplayText).join(", ")})` : ""}\n  Bind: /codex resume ${formatCodexDisplayText(session.sessionId)} --host ${formatCodexDisplayText(readNodeId(params.node))} --bind here`;
	})].join("\n");
}
async function listLocalCodexCliSessions(paramsJSON) {
	const params = readRecordParam(paramsJSON);
	const limit = normalizeLimit(params.limit);
	const filter = typeof params.filter === "string" ? params.filter.trim().toLowerCase() : "";
	const codexHome = resolveCodexHome();
	const summaries = await readHistorySessions(codexHome);
	await hydrateSessionFiles(codexHome, summaries);
	await hydrateSessionsFromSessionFiles(codexHome, summaries);
	const sessions = [...summaries.values()].filter((session) => {
		if (!filter) return true;
		return [
			session.sessionId,
			session.cwd,
			session.lastMessage
		].some((value) => value?.toLowerCase().includes(filter));
	}).toSorted((a, b) => compareOptionalStringsDesc(a.updatedAt, b.updatedAt)).slice(0, limit);
	return JSON.stringify({
		sessions,
		codexHome
	});
}
async function resumeLocalCodexCliSession(paramsJSON) {
	const params = readRecordParam(paramsJSON);
	const sessionId = typeof params.sessionId === "string" ? params.sessionId.trim() : "";
	const prompt = typeof params.prompt === "string" ? params.prompt.trim() : "";
	if (!sessionId || !SESSION_ID_PATTERN.test(sessionId)) throw new Error("Missing or invalid Codex CLI session id.");
	if (!prompt) throw new Error("Missing Codex CLI prompt.");
	if (activeResumeSessions.has(sessionId)) throw new Error(`Codex CLI session ${sessionId} already has an active resume turn.`);
	activeResumeSessions.add(sessionId);
	try {
		const text = await runCodexExecResume({
			sessionId,
			prompt,
			cwd: typeof params.cwd === "string" && params.cwd.trim() ? params.cwd.trim() : void 0,
			timeoutMs: normalizeTimeoutMs(params.timeoutMs)
		});
		return JSON.stringify({
			ok: true,
			sessionId,
			text: text.trim() || "Codex completed without a text reply."
		});
	} finally {
		activeResumeSessions.delete(sessionId);
	}
}
async function runCodexExecResume(params) {
	const outputPath = path.join(await fs.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-codex-cli-")), "last-message.txt");
	try {
		const invocation = resolveCodexCliResumeSpawnInvocation([
			"exec",
			"resume",
			"--skip-git-repo-check",
			"--output-last-message",
			outputPath,
			params.sessionId,
			"-"
		], {
			platform: process$1.platform,
			env: process$1.env,
			execPath: process$1.execPath
		});
		const child = spawn(invocation.command, invocation.args, {
			cwd: params.cwd || process$1.cwd(),
			stdio: [
				"pipe",
				"pipe",
				"pipe"
			],
			env: process$1.env,
			shell: invocation.shell,
			windowsHide: invocation.windowsHide
		});
		const stdout = [];
		const stderr = [];
		let timedOut = false;
		let forceKillTimeout;
		const timeout = setTimeout(() => {
			timedOut = true;
			child.kill("SIGTERM");
			forceKillTimeout = setTimeout(() => child.kill("SIGKILL"), 2e3);
			forceKillTimeout.unref?.();
		}, params.timeoutMs);
		child.stdout.on("data", (chunk) => stdout.push(chunk));
		child.stderr.on("data", (chunk) => stderr.push(chunk));
		child.stdin.end(params.prompt);
		const exitCode = await new Promise((resolve, reject) => {
			child.on("error", reject);
			child.on("exit", (code) => resolve(code));
		}).finally(() => {
			clearTimeout(timeout);
			if (forceKillTimeout) clearTimeout(forceKillTimeout);
		});
		if (timedOut) throw new Error(`codex exec resume timed out after ${String(params.timeoutMs)}ms`);
		if (exitCode !== 0) {
			const message = Buffer.concat(stderr).toString("utf8").trim() || Buffer.concat(stdout).toString("utf8").trim() || `codex exec resume exited with code ${String(exitCode)}`;
			throw new Error(message);
		}
		return await fs.readFile(outputPath, "utf8");
	} finally {
		await fs.rm(path.dirname(outputPath), {
			recursive: true,
			force: true
		});
	}
}
function resolveCodexCliResumeSpawnInvocation(args, runtime = DEFAULT_RESUME_SPAWN_RUNTIME) {
	const resolved = materializeWindowsSpawnProgram(resolveWindowsSpawnProgram({
		command: "codex",
		platform: runtime.platform,
		env: runtime.env,
		execPath: runtime.execPath,
		packageName: "@openai/codex"
	}), args);
	return {
		command: resolved.command,
		args: resolved.argv,
		shell: resolved.shell,
		windowsHide: resolved.windowsHide
	};
}
async function readHistorySessions(codexHome) {
	const summaries = /* @__PURE__ */ new Map();
	const content = await readFileIfExists(path.join(codexHome, "history.jsonl"));
	if (!content) return summaries;
	for (const line of content.split(/\r?\n/u)) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		let parsed;
		try {
			parsed = JSON.parse(trimmed);
		} catch {
			continue;
		}
		if (!isRecord(parsed) || typeof parsed.session_id !== "string") continue;
		const sessionId = parsed.session_id.trim();
		if (!sessionId) continue;
		const entry = summaries.get(sessionId) ?? {
			sessionId,
			messageCount: 0
		};
		entry.messageCount += 1;
		if (typeof parsed.text === "string" && parsed.text.trim()) entry.lastMessage = truncateText(parsed.text.trim(), 140);
		if (typeof parsed.ts === "number") entry.updatedAt = timestampMsToIsoString(parsed.ts * 1e3) ?? entry.updatedAt;
		summaries.set(sessionId, entry);
	}
	return summaries;
}
async function hydrateSessionFiles(codexHome, summaries) {
	if (summaries.size === 0) return;
	const files = await findSessionFiles(path.join(codexHome, "sessions"), 4);
	const pending = new Set(summaries.keys());
	for (const file of files) {
		const basename = path.basename(file);
		const sessionId = [...pending].find((id) => basename.includes(id));
		if (!sessionId) continue;
		const entry = summaries.get(sessionId);
		if (!entry) continue;
		entry.sessionFile = file;
		const cwd = readSessionMetaCwd(await readFirstLine(file) ?? "");
		if (cwd) entry.cwd = cwd;
		pending.delete(sessionId);
		if (pending.size === 0) return;
	}
}
async function hydrateSessionsFromSessionFiles(codexHome, summaries) {
	const files = await findSessionFiles(path.join(codexHome, "sessions"), 4);
	for (const file of files) {
		const summary = await readSessionFileSummary(file);
		if (!summary) continue;
		const existing = summaries.get(summary.sessionId);
		summaries.set(summary.sessionId, {
			...summary,
			...existing,
			cwd: existing?.cwd ?? summary.cwd,
			sessionFile: existing?.sessionFile ?? summary.sessionFile,
			updatedAt: existing?.updatedAt ?? summary.updatedAt,
			lastMessage: existing?.lastMessage ?? summary.lastMessage,
			messageCount: existing?.messageCount ?? summary.messageCount
		});
	}
}
async function readSessionFileSummary(file) {
	const content = await readFileIfExists(file);
	if (!content) return null;
	let sessionId = "";
	let cwd;
	let updatedAt;
	let lastMessage;
	let messageCount = 0;
	for (const line of content.split(/\r?\n/u)) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		let parsed;
		try {
			parsed = JSON.parse(trimmed);
		} catch {
			continue;
		}
		if (!isRecord(parsed)) continue;
		if (typeof parsed.timestamp === "string" && parsed.timestamp.trim()) updatedAt = parsed.timestamp.trim();
		if (parsed.type === "session_meta" && isRecord(parsed.payload)) {
			if (typeof parsed.payload.id === "string" && parsed.payload.id.trim()) sessionId = parsed.payload.id.trim();
			if (typeof parsed.payload.cwd === "string" && parsed.payload.cwd.trim()) cwd = parsed.payload.cwd.trim();
			continue;
		}
		const messageText = readResponseItemMessageText(parsed);
		if (messageText) {
			messageCount += 1;
			lastMessage = truncateText(messageText, 140);
		}
	}
	if (!sessionId) sessionId = readSessionIdFromFilename(file) ?? "";
	if (!sessionId) return null;
	return {
		sessionId,
		updatedAt: updatedAt ?? await readFileMtimeIso(file),
		lastMessage,
		cwd,
		sessionFile: file,
		messageCount
	};
}
async function findSessionFiles(dir, maxDepth) {
	if (maxDepth < 0) return [];
	let entries;
	try {
		entries = await fs.readdir(dir, { withFileTypes: true });
	} catch {
		return [];
	}
	const files = [];
	for (const entry of entries) {
		const entryPath = path.join(dir, entry.name);
		if (entry.isDirectory()) files.push(...await findSessionFiles(entryPath, maxDepth - 1));
		else if (entry.isFile() && entry.name.endsWith(".jsonl")) files.push(entryPath);
	}
	return files;
}
function readSessionMetaCwd(line) {
	try {
		const parsed = JSON.parse(line);
		if (!isRecord(parsed) || parsed.type !== "session_meta" || !isRecord(parsed.payload)) return;
		return typeof parsed.payload.cwd === "string" && parsed.payload.cwd.trim() ? parsed.payload.cwd.trim() : void 0;
	} catch {
		return;
	}
}
function readResponseItemMessageText(parsed) {
	if (parsed.type !== "response_item" || !isRecord(parsed.payload)) return;
	if (parsed.payload.type !== "message") return;
	if ((typeof parsed.payload.role === "string" ? parsed.payload.role : "") !== "user") return;
	const parts = (Array.isArray(parsed.payload.content) ? parsed.payload.content : []).flatMap((entry) => {
		if (!isRecord(entry)) return [];
		const text = typeof entry.text === "string" ? entry.text : typeof entry.input_text === "string" ? entry.input_text : void 0;
		return text?.trim() ? [text.trim()] : [];
	});
	return parts.length > 0 ? parts.join(" ") : void 0;
}
function readSessionIdFromFilename(file) {
	return path.basename(file).match(/[0-9a-f]{8}-[0-9a-f-]{27,}/iu)?.[0];
}
async function resolveCodexCliNode(params) {
	const list = await params.runtime.nodes.list(params.requestedNode ? void 0 : { connected: true });
	const requested = params.requestedNode?.trim();
	const candidates = list.nodes.filter((node) => {
		if (requested) return [
			node.nodeId,
			node.displayName,
			node.remoteIp
		].some((value) => value === requested);
		return node.connected === true && node.commands?.includes(params.command);
	});
	if (candidates.length === 0) throw new Error(requested ? `Codex CLI node ${requested} was not found.` : "No connected node exposes Codex CLI session commands.");
	const usable = candidates.filter((node) => node.commands?.includes(params.command));
	if (usable.length === 0) throw new Error(`Node ${requested ?? "candidate"} does not expose ${params.command}.`);
	if (usable.length > 1) throw new Error("Multiple Codex CLI-capable nodes connected. Pass --host <node-id>.");
	return usable[0];
}
function parseCodexCliSessionsListResult(raw) {
	const payload = unwrapNodeInvokePayload(raw);
	if (!isRecord(payload) || !Array.isArray(payload.sessions)) throw new Error("Codex CLI session list returned an invalid payload.");
	return {
		codexHome: typeof payload.codexHome === "string" ? payload.codexHome : "",
		sessions: payload.sessions.flatMap((entry) => {
			if (!isRecord(entry) || typeof entry.sessionId !== "string") return [];
			return [{
				sessionId: entry.sessionId,
				updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : void 0,
				lastMessage: typeof entry.lastMessage === "string" ? entry.lastMessage : void 0,
				cwd: typeof entry.cwd === "string" ? entry.cwd : void 0,
				sessionFile: typeof entry.sessionFile === "string" ? entry.sessionFile : void 0,
				messageCount: typeof entry.messageCount === "number" && Number.isFinite(entry.messageCount) ? entry.messageCount : 0
			}];
		})
	};
}
function unwrapNodeInvokePayload(raw) {
	const record = isRecord(raw) ? raw : {};
	if (typeof record.payloadJSON === "string" && record.payloadJSON.trim()) try {
		return JSON.parse(record.payloadJSON);
	} catch (error) {
		throw new Error("Codex CLI node command returned malformed payloadJSON.", { cause: error });
	}
	if ("payload" in record) return record.payload;
	return raw;
}
function readRecordParam(paramsJSON) {
	if (!paramsJSON?.trim()) return {};
	try {
		const parsed = JSON.parse(paramsJSON);
		return isRecord(parsed) ? parsed : {};
	} catch {
		return {};
	}
}
function resolveCodexHome() {
	return process$1.env.CODEX_HOME?.trim() || path.join(os.homedir(), ".codex");
}
async function readFileIfExists(file) {
	try {
		return await fs.readFile(file, "utf8");
	} catch {
		return;
	}
}
async function readFirstLine(file) {
	return (await readFileIfExists(file))?.split(/\r?\n/u)[0];
}
async function readFileMtimeIso(file) {
	try {
		return (await fs.stat(file)).mtime.toISOString();
	} catch {
		return;
	}
}
function normalizeLimit(value) {
	return typeof value === "number" && Number.isFinite(value) ? Math.min(MAX_SESSION_LIMIT, Math.max(1, Math.floor(value))) : DEFAULT_SESSION_LIMIT;
}
function normalizeTimeoutMs(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.min(60 * 6e4, Math.floor(value)) : DEFAULT_RESUME_TIMEOUT_MS;
}
function truncateText(value, max) {
	return value.length > max ? `${value.slice(0, max - 3)}...` : value;
}
function compareOptionalStringsDesc(a, b) {
	return (b ?? "").localeCompare(a ?? "");
}
function readNodeId(node) {
	if (!node.nodeId) throw new Error("Codex CLI node did not include a node id.");
	return node.nodeId;
}
function formatNodeLabel(node) {
	return [
		node.displayName,
		node.nodeId,
		node.remoteIp
	].filter(Boolean).join(" / ") || "node";
}
//#endregion
//#region extensions/codex/src/conversation-binding.ts
const DEFAULT_BOUND_TURN_TIMEOUT_MS = 20 * 6e4;
const DEFAULT_AGENT_ID = "main";
const VALID_AGENT_ID_PATTERN = /^[a-z0-9][a-z0-9_-]{0,63}$/i;
const INVALID_AGENT_ID_CHARS_PATTERN = /[^a-z0-9_-]+/g;
const LEADING_DASH_PATTERN = /^-+/;
const TRAILING_DASH_PATTERN = /-+$/;
const NATIVE_CONVERSATION_INTERACTIVE_APPROVALS_UNAVAILABLE = "OpenClaw native Codex conversation binding cannot route interactive approvals yet; use the Codex harness or explicit /acp spawn codex for that workflow.";
async function resolveConversationAppServerRuntime(params) {
	const execPolicy = resolveConversationExecPolicy({
		config: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	});
	const sandboxForPolicy = execPolicy.touched && execPolicy.security === "full" && execPolicy.ask !== "off" ? await resolveSandboxContext({
		config: params.config,
		sessionKey: params.sessionKey,
		workspaceDir: params.workspaceDir
	}) : void 0;
	return {
		execPolicy,
		runtime: resolveCodexAppServerRuntimeOptions({
			pluginConfig: params.pluginConfig,
			execPolicy,
			modelProvider: params.modelProvider,
			model: params.model,
			config: params.config,
			agentDir: params.agentDir,
			openClawSandboxActive: Boolean(sandboxForPolicy?.enabled)
		})
	};
}
const CODEX_CONVERSATION_GLOBAL_STATE = Symbol.for("openclaw.codex.conversationBinding");
const CODEX_CONVERSATION_THREAD_DEVELOPER_INSTRUCTIONS = "This Codex thread is bound to an OpenClaw conversation. Answer normally; OpenClaw will deliver your final response back to the conversation.";
function getGlobalState() {
	const globalState = globalThis;
	globalState[CODEX_CONVERSATION_GLOBAL_STATE] ??= { queues: /* @__PURE__ */ new Map() };
	return globalState[CODEX_CONVERSATION_GLOBAL_STATE];
}
async function startCodexConversationThread(params) {
	const workspaceDir = params.workspaceDir?.trim() || resolveCodexDefaultWorkspaceDir(params.pluginConfig);
	const agentDir = params.agentDir?.trim();
	const agentLookup = buildAgentLookup({
		agentDir,
		config: params.config
	});
	const existingBinding = await readCodexAppServerBinding(params.sessionFile, { ...agentLookup });
	const authProfileId = resolveCodexAppServerAuthProfileIdForAgent({
		authProfileId: params.authProfileId ?? existingBinding?.authProfileId,
		...agentLookup
	});
	if (params.threadId?.trim()) await attachExistingThread({
		pluginConfig: params.pluginConfig,
		sessionFile: params.sessionFile,
		threadId: params.threadId.trim(),
		workspaceDir,
		...agentDir ? { agentDir } : {},
		model: params.model,
		modelProvider: params.modelProvider,
		authProfileId,
		approvalPolicy: params.approvalPolicy,
		sandbox: params.sandbox,
		serviceTier: params.serviceTier,
		config: params.config,
		sessionKey: params.sessionKey,
		agentId: params.agentId
	});
	else await createThread({
		pluginConfig: params.pluginConfig,
		sessionFile: params.sessionFile,
		workspaceDir,
		...agentDir ? { agentDir } : {},
		model: params.model,
		modelProvider: params.modelProvider,
		authProfileId,
		approvalPolicy: params.approvalPolicy,
		sandbox: params.sandbox,
		serviceTier: params.serviceTier,
		config: params.config,
		sessionKey: params.sessionKey,
		agentId: params.agentId
	});
	return createCodexConversationBindingData({
		sessionFile: params.sessionFile,
		workspaceDir,
		...agentDir ? { agentDir } : {},
		agentId: params.agentId
	});
}
async function handleCodexConversationInboundClaim(event, ctx, options = {}) {
	const data = readCodexConversationBindingData(ctx.pluginBinding);
	if (!data) return;
	if (event.commandAuthorized !== true) return { handled: true };
	const prompt = event.bodyForAgent?.trim() || event.content?.trim() || "";
	if (!prompt) return { handled: true };
	const nativeExecutionBlock = data.kind === "codex-cli-node-session" ? resolveCodexNativeSandboxBlock({
		config: options.config,
		sessionKey: event.sessionKey ?? ctx.sessionKey,
		surface: "Codex CLI node conversation binding"
	}) : resolveCodexNativeExecutionBlock({
		config: options.config,
		sessionKey: event.sessionKey ?? ctx.sessionKey,
		agentId: data.agentId,
		surface: "Codex app-server conversation binding"
	});
	if (nativeExecutionBlock) return {
		handled: true,
		reply: { text: nativeExecutionBlock }
	};
	if (data.kind === "codex-cli-node-session") {
		const resume = options.resumeCodexCliSessionOnNode;
		if (!resume) return {
			handled: true,
			reply: { text: "Codex CLI node binding is unavailable because Gateway node runtime is not attached." }
		};
		try {
			return {
				handled: true,
				reply: (await enqueueBoundTurn(`${data.nodeId}:${data.sessionId}`, async () => {
					return { reply: { text: (await resume({
						nodeId: data.nodeId,
						sessionId: data.sessionId,
						prompt,
						cwd: data.cwd,
						timeoutMs: options.timeoutMs
					})).text.trim() || "Codex completed without a text reply." } };
				})).reply
			};
		} catch (error) {
			return {
				handled: true,
				reply: { text: `Codex CLI node turn failed: ${formatCodexDisplayText(formatErrorMessage(error))}` }
			};
		}
	}
	try {
		return {
			handled: true,
			reply: (await enqueueBoundTurn(data.sessionFile, () => runBoundTurnWithMissingThreadRecovery({
				data,
				prompt,
				event,
				config: options.config,
				sessionKey: event.sessionKey ?? ctx.sessionKey,
				pluginConfig: options.pluginConfig,
				timeoutMs: options.timeoutMs
			}))).reply
		};
	} catch (error) {
		return {
			handled: true,
			reply: { text: `Codex app-server turn failed: ${formatCodexDisplayText(formatErrorMessage(error))}` }
		};
	}
}
async function handleCodexConversationBindingResolved(event) {
	if (event.status !== "denied") return;
	const data = readCodexConversationBindingDataRecord(event.request.data ?? {});
	if (!data || data.kind !== "codex-app-server-session") return;
	await clearCodexAppServerBinding(data.sessionFile);
}
async function resolveThreadBindingRuntime(params) {
	const agentLookup = buildAgentLookup({
		agentDir: params.agentDir,
		config: params.config
	});
	const modelProvider = resolveThreadRequestModelProvider({
		authProfileId: params.authProfileId,
		modelProvider: params.modelProvider,
		...agentLookup
	});
	const modelSelection = resolveOptionalThreadRequestModelSelection({
		model: params.model,
		modelProvider,
		authProfileId: params.authProfileId,
		...agentLookup
	});
	const reviewerModelProvider = resolveModelBackedReviewerPolicyProvider({
		authProfileId: params.authProfileId,
		modelProvider: params.modelProvider,
		...agentLookup
	});
	const { execPolicy, runtime } = await resolveConversationAppServerRuntime({
		pluginConfig: params.pluginConfig,
		config: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		workspaceDir: params.workspaceDir,
		modelProvider: reviewerModelProvider,
		model: params.model,
		agentDir: params.agentDir
	});
	const modelScopedRuntime = resolveCodexAppServerForModelProvider({
		appServer: runtime,
		provider: reviewerModelProvider,
		model: params.model,
		config: params.config,
		env: process.env,
		agentDir: params.agentDir
	});
	assertNativeConversationApprovalPolicySupported({
		execPolicy,
		approvalPolicy: execPolicy?.touched ? modelScopedRuntime.approvalPolicy : params.approvalPolicy ?? modelScopedRuntime.approvalPolicy,
		approvalsReviewer: modelScopedRuntime.approvalsReviewer,
		modelBackedApprovalsReviewerUnavailable: !canUseCodexModelBackedApprovalsReviewerForModel({
			modelProvider: reviewerModelProvider,
			model: params.model,
			config: params.config,
			env: process.env,
			agentDir: params.agentDir
		})
	});
	const client = await getLeasedSharedCodexAppServerClient({
		startOptions: runtime.start,
		timeoutMs: runtime.requestTimeoutMs,
		authProfileId: params.authProfileId,
		...agentLookup
	});
	return {
		execPolicy,
		runtime: modelScopedRuntime,
		agentLookup,
		model: modelSelection?.model,
		modelProvider: modelSelection?.modelProvider ?? modelProvider,
		client
	};
}
function buildThreadRequestRuntimeOptions(params, resolved) {
	const serviceTier = params.serviceTier ?? resolved.runtime.serviceTier;
	const sandbox = resolved.execPolicy?.touched ? resolved.runtime.sandbox : params.sandbox ?? resolved.runtime.sandbox;
	return {
		approvalPolicy: resolved.execPolicy?.touched ? resolved.runtime.approvalPolicy : params.approvalPolicy ?? resolved.runtime.approvalPolicy,
		approvalsReviewer: resolved.runtime.approvalsReviewer,
		...codexConversationSandboxOrPermissions(resolved.runtime, sandbox),
		...serviceTier ? { serviceTier } : {}
	};
}
function codexConversationSandboxOrPermissions(runtime, sandbox) {
	const networkProxy = runtime.networkProxy;
	if (networkProxy) return { config: networkProxy.configPatch };
	return { sandbox };
}
async function requestNewConversationBindingThread(params, resolved) {
	return await resolved.client.request("thread/start", {
		cwd: params.workspaceDir,
		...resolved.model ? { model: resolved.model } : {},
		...resolved.modelProvider ? { modelProvider: resolved.modelProvider } : {},
		personality: CODEX_NATIVE_PERSONALITY_NONE,
		...buildThreadRequestRuntimeOptions(params, resolved),
		developerInstructions: CODEX_CONVERSATION_THREAD_DEVELOPER_INSTRUCTIONS,
		experimentalRawEvents: true,
		persistExtendedHistory: true
	}, { timeoutMs: resolved.runtime.requestTimeoutMs });
}
async function writeThreadBindingFromResponse(params, resolved, response) {
	const runtimeApprovalPolicy = typeof resolved.runtime.approvalPolicy === "string" ? resolved.runtime.approvalPolicy : void 0;
	await writeCodexAppServerBinding(params.sessionFile, {
		threadId: response.thread.id,
		cwd: response.thread.cwd ?? params.workspaceDir,
		authProfileId: params.authProfileId,
		model: response.model ?? resolved.model ?? params.model,
		modelProvider: normalizeCodexAppServerBindingModelProvider({
			authProfileId: params.authProfileId,
			modelProvider: response.modelProvider ?? resolved.modelProvider ?? params.modelProvider,
			...resolved.agentLookup
		}),
		approvalPolicy: resolved.execPolicy?.touched ? runtimeApprovalPolicy : params.approvalPolicy ?? runtimeApprovalPolicy,
		sandbox: resolved.execPolicy?.touched ? resolved.runtime.sandbox : params.sandbox ?? resolved.runtime.sandbox,
		serviceTier: params.serviceTier ?? resolved.runtime.serviceTier ?? void 0,
		networkProxyProfileName: resolved.runtime.networkProxy?.profileName,
		networkProxyConfigFingerprint: resolved.runtime.networkProxy?.configFingerprint
	}, { ...resolved.agentLookup });
}
async function attachExistingThread(params) {
	const resolved = await resolveThreadBindingRuntime(params);
	try {
		await writeThreadBindingFromResponse(params, resolved, resolved.runtime.networkProxy ? await requestNewConversationBindingThread(params, resolved) : await resolved.client.request(CODEX_CONTROL_METHODS.resumeThread, {
			threadId: params.threadId,
			...resolved.model ? { model: resolved.model } : {},
			...resolved.modelProvider ? { modelProvider: resolved.modelProvider } : {},
			personality: CODEX_NATIVE_PERSONALITY_NONE,
			...buildThreadRequestRuntimeOptions(params, resolved),
			persistExtendedHistory: true
		}, { timeoutMs: resolved.runtime.requestTimeoutMs }));
	} finally {
		releaseLeasedSharedCodexAppServerClient(resolved.client);
	}
}
async function createThread(params) {
	const resolved = await resolveThreadBindingRuntime(params);
	try {
		await writeThreadBindingFromResponse(params, resolved, await requestNewConversationBindingThread(params, resolved));
	} finally {
		releaseLeasedSharedCodexAppServerClient(resolved.client);
	}
}
async function runBoundTurn(params) {
	const agentLookup = buildAgentLookup({
		agentDir: params.data.agentDir,
		config: params.config
	});
	const binding = await readCodexAppServerBinding(params.data.sessionFile, agentLookup);
	if (!binding?.threadId) throw new Error("bound Codex conversation has no thread binding");
	let threadId = binding.threadId;
	const workspaceDir = binding.cwd || params.data.workspaceDir;
	const reviewerModelProvider = resolveModelBackedReviewerPolicyProvider({
		authProfileId: binding.authProfileId,
		modelProvider: binding.modelProvider,
		...agentLookup
	});
	const { execPolicy, runtime } = await resolveConversationAppServerRuntime({
		pluginConfig: params.pluginConfig,
		config: params.config,
		agentId: params.data.agentId,
		sessionKey: params.sessionKey,
		workspaceDir,
		modelProvider: reviewerModelProvider,
		model: binding.model,
		agentDir: params.data.agentDir
	});
	const modelScopedRuntime = resolveCodexAppServerForModelProvider({
		appServer: runtime,
		provider: reviewerModelProvider,
		model: binding.model,
		config: params.config,
		env: process.env,
		agentDir: params.data.agentDir
	});
	const modelBackedApprovalsReviewerUnavailable = !canUseCodexModelBackedApprovalsReviewerForModel({
		modelProvider: reviewerModelProvider,
		model: binding.model,
		config: params.config,
		env: process.env,
		agentDir: params.data.agentDir
	});
	const useModelScopedPolicy = execPolicy?.touched === true || modelBackedApprovalsReviewerUnavailable;
	const approvalPolicy = useModelScopedPolicy ? modelScopedRuntime.approvalPolicy : binding.approvalPolicy ?? modelScopedRuntime.approvalPolicy;
	const sandbox = useModelScopedPolicy ? modelScopedRuntime.sandbox : binding.sandbox ?? modelScopedRuntime.sandbox;
	const permissionProfile = modelScopedRuntime.networkProxy?.profileName;
	const networkProxyConfigFingerprint = modelScopedRuntime.networkProxy?.configFingerprint;
	const networkProxyBindingChanged = binding.networkProxyProfileName !== permissionProfile || binding.networkProxyConfigFingerprint !== networkProxyConfigFingerprint;
	const serviceTier = binding.serviceTier ?? runtime.serviceTier;
	let useStickyNetworkProfile = permissionProfile !== void 0 && binding.networkProxyProfileName === permissionProfile && binding.networkProxyConfigFingerprint === networkProxyConfigFingerprint;
	assertNativeConversationApprovalPolicySupported({
		execPolicy,
		approvalPolicy,
		approvalsReviewer: modelScopedRuntime.approvalsReviewer,
		modelBackedApprovalsReviewerUnavailable
	});
	const modelSelection = binding.model ? resolveCodexAppServerRequestModelSelection({
		model: binding.model,
		modelProvider: binding.modelProvider,
		authProfileId: binding.authProfileId,
		...agentLookup
	}) : void 0;
	const client = await getLeasedSharedCodexAppServerClient({
		startOptions: runtime.start,
		timeoutMs: runtime.requestTimeoutMs,
		authProfileId: binding.authProfileId,
		...agentLookup
	});
	let notificationCleanup = () => void 0;
	let requestCleanup = () => void 0;
	try {
		if (networkProxyBindingChanged) {
			const response = assertCodexThreadStartResponse(await client.request("thread/start", {
				cwd: workspaceDir,
				...modelSelection?.model ? { model: modelSelection.model } : {},
				...modelSelection?.modelProvider ? { modelProvider: modelSelection.modelProvider } : {},
				personality: CODEX_NATIVE_PERSONALITY_NONE,
				approvalPolicy,
				approvalsReviewer: modelScopedRuntime.approvalsReviewer,
				...modelScopedRuntime.networkProxy ? { config: modelScopedRuntime.networkProxy.configPatch } : { sandbox },
				...serviceTier ? { serviceTier } : {},
				developerInstructions: CODEX_CONVERSATION_THREAD_DEVELOPER_INSTRUCTIONS,
				experimentalRawEvents: true,
				persistExtendedHistory: true
			}, { timeoutMs: runtime.requestTimeoutMs }));
			threadId = response.thread.id;
			await writeCodexAppServerBinding(params.data.sessionFile, {
				threadId,
				cwd: response.thread.cwd ?? workspaceDir,
				authProfileId: binding.authProfileId,
				model: response.model ?? modelSelection?.model ?? binding.model,
				modelProvider: normalizeCodexAppServerBindingModelProvider({
					authProfileId: binding.authProfileId,
					modelProvider: response.modelProvider ?? modelSelection?.modelProvider ?? binding.modelProvider,
					...agentLookup
				}),
				approvalPolicy: typeof approvalPolicy === "string" ? approvalPolicy : void 0,
				sandbox,
				serviceTier: serviceTier ?? void 0,
				networkProxyProfileName: modelScopedRuntime.networkProxy?.profileName,
				networkProxyConfigFingerprint: modelScopedRuntime.networkProxy?.configFingerprint
			}, agentLookup);
			useStickyNetworkProfile = modelScopedRuntime.networkProxy !== void 0;
		}
		const collector = createCodexConversationTurnCollector(threadId);
		notificationCleanup = client.addNotificationHandler((notification) => collector.handleNotification(notification));
		requestCleanup = client.addRequestHandler(async (request) => {
			if (request.method === "item/tool/call") return {
				contentItems: [{
					type: "inputText",
					text: "OpenClaw native Codex conversation binding does not expose dynamic OpenClaw tools yet."
				}],
				success: false
			};
			if (request.method === "item/commandExecution/requestApproval" || request.method === "item/fileChange/requestApproval") return {
				decision: "decline",
				reason: "OpenClaw native Codex conversation binding cannot route interactive approvals yet; use the Codex harness or explicit /acp spawn codex for that workflow."
			};
			if (request.method === "item/permissions/requestApproval") return {
				permissions: {},
				scope: "turn"
			};
			if (request.method.includes("requestApproval")) return {
				decision: "decline",
				reason: "OpenClaw native Codex conversation binding cannot route interactive approvals yet; use the Codex harness or explicit /acp spawn codex for that workflow."
			};
		});
		const turnId = (await client.request("turn/start", {
			threadId,
			input: buildCodexConversationTurnInput({
				prompt: params.prompt,
				event: params.event
			}),
			cwd: workspaceDir,
			approvalPolicy,
			approvalsReviewer: modelScopedRuntime.approvalsReviewer,
			...useStickyNetworkProfile ? {} : { sandboxPolicy: codexSandboxPolicyForTurn(sandbox, workspaceDir) },
			...modelSelection?.model ? { model: modelSelection.model } : {},
			personality: CODEX_NATIVE_PERSONALITY_NONE,
			...serviceTier ? { serviceTier } : {}
		}, { timeoutMs: runtime.requestTimeoutMs })).turn.id;
		const activeCleanup = trackCodexConversationActiveTurn({
			sessionFile: params.data.sessionFile,
			threadId,
			turnId
		});
		collector.setTurnId(turnId);
		return { reply: { text: (await collector.wait({ timeoutMs: params.timeoutMs ?? DEFAULT_BOUND_TURN_TIMEOUT_MS }).finally(activeCleanup)).replyText.trim() || "Codex completed without a text reply." } };
	} finally {
		notificationCleanup();
		requestCleanup();
		releaseLeasedSharedCodexAppServerClient(client);
	}
}
function assertNativeConversationApprovalPolicySupported(params) {
	if (params.approvalPolicy !== "never" && (params.execPolicy?.touched === true || params.modelBackedApprovalsReviewerUnavailable && params.approvalsReviewer === "user")) throw new Error(NATIVE_CONVERSATION_INTERACTIVE_APPROVALS_UNAVAILABLE);
}
async function runBoundTurnWithMissingThreadRecovery(params) {
	try {
		return await runBoundTurn(params);
	} catch (error) {
		if (!isCodexThreadNotFoundError(error)) throw error;
		const agentLookup = buildAgentLookup({
			agentDir: params.data.agentDir,
			config: params.config
		});
		const binding = await readCodexAppServerBinding(params.data.sessionFile, agentLookup);
		const useCurrentRuntimePolicy = resolveConversationExecPolicy({
			config: params.config,
			agentId: params.data.agentId,
			sessionKey: params.sessionKey
		}).touched;
		await startCodexConversationThread({
			pluginConfig: params.pluginConfig,
			sessionFile: params.data.sessionFile,
			workspaceDir: binding?.cwd || params.data.workspaceDir,
			...agentLookup,
			model: binding?.model,
			modelProvider: binding?.modelProvider,
			authProfileId: binding?.authProfileId,
			approvalPolicy: useCurrentRuntimePolicy ? void 0 : binding?.approvalPolicy,
			sandbox: useCurrentRuntimePolicy ? void 0 : binding?.sandbox,
			serviceTier: binding?.serviceTier,
			config: params.config,
			sessionKey: params.sessionKey,
			agentId: params.data.agentId
		});
		return await runBoundTurn(params);
	}
}
function resolveConversationExecPolicy(params) {
	const agentId = params.agentId ?? (params.config ? resolveSessionAgentIds({
		sessionKey: params.sessionKey,
		config: params.config
	}).sessionAgentId : void 0);
	return resolveOpenClawExecPolicyForCodexAppServer({
		config: params.config,
		agentId,
		execOverrides: readSessionExecOverrides({
			config: params.config,
			agentId,
			sessionKey: params.sessionKey
		}),
		approvals: loadExecApprovals()
	});
}
function readSessionExecOverrides(params) {
	const sessionKey = params.sessionKey?.trim();
	if (!params.config || !sessionKey) return;
	if (!canReadSessionExecOverrides({
		config: params.config,
		agentId: params.agentId,
		sessionKey
	})) return;
	const entry = resolveSessionStoreEntry({
		store: loadSessionStore(resolveStorePath(params.config.session?.store, { agentId: params.agentId }), { skipCache: true }),
		sessionKey
	}).existing;
	if (!entry?.execSecurity && !entry?.execAsk) return;
	return {
		security: entry.execSecurity,
		ask: entry.execAsk
	};
}
function canReadSessionExecOverrides(params) {
	const agentId = normalizeAgentIdOrDefault(params.agentId);
	if (!agentId) return true;
	const sessionAgentId = parseAgentIdFromSessionKey(params.sessionKey);
	if (!sessionAgentId) return isDefaultAgentSessionKeyForAgent({
		config: params.config,
		agentId
	});
	return sessionAgentId === agentId;
}
function parseAgentIdFromSessionKey(sessionKey) {
	const raw = sessionKey?.trim();
	if (!raw) return;
	const parts = raw.toLowerCase().split(":").filter(Boolean);
	if (parts.length < 3 || parts[0] !== "agent" || !parts[2]) return;
	return normalizeAgentIdOrDefault(parts[1]);
}
function isDefaultAgentSessionKeyForAgent(params) {
	return normalizeAgentId(params.agentId) === resolveDefaultPolicyAgentId(params.config);
}
function resolveDefaultPolicyAgentId(config) {
	const agents = (config.agents?.list ?? []).filter((entry) => entry !== null && typeof entry === "object");
	return normalizeAgentId((agents.find((entry) => entry?.default) ?? agents[0])?.id);
}
function normalizeAgentIdOrDefault(value) {
	const normalized = normalizeAgentId(value);
	return normalized === DEFAULT_AGENT_ID && !(value ?? "").trim() ? void 0 : normalized;
}
function normalizeAgentId(value) {
	const trimmed = (value ?? "").trim();
	if (!trimmed) return DEFAULT_AGENT_ID;
	const normalized = trimmed.toLowerCase();
	if (VALID_AGENT_ID_PATTERN.test(trimmed)) return normalized;
	return normalized.replace(INVALID_AGENT_ID_CHARS_PATTERN, "-").replace(LEADING_DASH_PATTERN, "").replace(TRAILING_DASH_PATTERN, "").slice(0, 64) || DEFAULT_AGENT_ID;
}
function isCodexThreadNotFoundError(error) {
	const message = formatErrorMessage(error);
	return /\bthread not found:/iu.test(message) || /\bbound Codex conversation has no thread binding\b/u.test(message);
}
function enqueueBoundTurn(key, run) {
	const state = getGlobalState();
	const next = (state.queues.get(key) ?? Promise.resolve()).then(run, run);
	const queued = next.then(() => void 0, () => void 0);
	state.queues.set(key, queued);
	next.finally(() => {
		if (state.queues.get(key) === queued) state.queues.delete(key);
	}).catch(() => void 0);
	return next;
}
function resolveThreadRequestModelProvider(params) {
	const modelProvider = params.modelProvider?.trim();
	if (!modelProvider || modelProvider.toLowerCase() === "codex") return;
	if (isCodexAppServerNativeAuthProfile(params) && modelProvider.toLowerCase() === "openai") return;
	return modelProvider.toLowerCase() === "openai" ? "openai" : modelProvider;
}
function resolveOptionalThreadRequestModelSelection(params) {
	if (!params.model?.trim()) return;
	return resolveCodexAppServerRequestModelSelection({
		model: params.model,
		modelProvider: params.modelProvider,
		authProfileId: params.authProfileId,
		agentDir: params.agentDir,
		config: params.config
	});
}
function resolveModelBackedReviewerPolicyProvider(params) {
	const modelProvider = params.modelProvider?.trim();
	if (modelProvider && modelProvider.toLowerCase() !== "codex") return modelProvider.toLowerCase() === "openai" ? "openai" : modelProvider;
	return isCodexAppServerNativeAuthProfile(params) ? "openai" : void 0;
}
function buildAgentLookup(params) {
	const agentDir = params.agentDir?.trim();
	return {
		...agentDir ? { agentDir } : {},
		...params.config ? { config: params.config } : {}
	};
}
//#endregion
export { steerCodexConversationTurn as _, createCodexCliSessionNodeInvokePolicies as a, readCodexConversationBindingData as b, resolveCodexCliSessionForBindingOnNode as c, parseCodexFastModeArg as d, parseCodexPermissionsModeArg as f, setCodexConversationPermissions as g, setCodexConversationModel as h, createCodexCliSessionNodeHostCommands as i, resumeCodexCliSessionOnNode as l, setCodexConversationFastMode as m, handleCodexConversationInboundClaim as n, formatCodexCliSessions as o, readCodexConversationActiveTurn as p, startCodexConversationThread as r, listCodexCliSessionsOnNode as s, handleCodexConversationBindingResolved as t, formatPermissionsMode as u, stopCodexConversationTurn as v, resolveCodexDefaultWorkspaceDir as x, createCodexCliNodeConversationBindingData as y };
