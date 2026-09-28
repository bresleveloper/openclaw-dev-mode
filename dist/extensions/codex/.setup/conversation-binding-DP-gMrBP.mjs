import { m as sessionBindingIdentity, n as assertCodexBindingMayBeReplaced } from "./session-binding-record-BGoz8wOK.mjs";
import { y as readCodexRequirementsToml } from "./config-security-BEReZ6go.mjs";
import { d as readCodexPluginConfig } from "./config-parsing-CcB9iPoq.mjs";
import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import { d as readCodexEffectiveConfig, n as codexSandboxPolicyForTurn } from "./config-options-BvaRs51b.mjs";
import { o as resolveCodexDefaultWorkspaceDir } from "./conversation-binding-data-CrcyZk6O.mjs";
import { n as projectBoundedCodexVisibleSessionHistory } from "./transcript-history-projection-ZZpkFkJ_.mjs";
import { n as resolveOpenClawExecPolicyForCodexAppServer, t as canUseCodexModelBackedApprovalsReviewerForModel } from "./config-BoTP_mrL.mjs";
import { n as resolveCodexAppServerRuntimeOptions } from "./config-runtime-C8Rw1m1m.mjs";
import { n as normalizeCodexAppServerBindingModelProvider, t as isCodexAppServerNativeAuthProfile } from "./auth-profile-WqZtZfXN.mjs";
import { I as hasCodexAppServerLiveThread, N as consumeCodexAppServerLiveThread, R as isCodexAppServerClientRuntimeLive, U as releaseCodexAppServerLiveThread, _ as retainSharedCodexAppServerClientByInstanceId, c as getLeasedSharedCodexAppServerClient, m as releaseCodexAppServerClientLease, x as withLeasedCodexAppServerClientStartSelectionRetry, z as isCodexAppServerLiveThreadClaimed } from "./shared-client-DA4VR4Eb.mjs";
import { h as CodexThreadDirectInputError, l as isCodexAppServerOverloadError, s as isCodexAppServerIndeterminateRequestCancellationError, v as assertCodexThreadAcceptsDirectInput, x as assertCodexThreadStartResponse } from "./client-Cs08OXVQ.mjs";
import { c as isCodexAppServerUnsafeSubscriptionError, h as getCodexAppServerTurnRouter, o as closeCodexStartupClientBestEffort, p as unsubscribeCodexThreadBestEffort, s as interruptCodexTurnAndWaitBestEffort, u as retireUnsafeCodexTurnClientBestEffort, v as isCodexNotificationForTurn } from "./attempt-client-cleanup-CEv1cKwF.mjs";
import { _ as resolveCodexAppServerRequestModelSelection, _t as buildDisabledAppsConfigPatch, b as buildCodexProjectDocThreadConfig, h as CODEX_NATIVE_PERSONALITY_NONE, xt as mergeCodexThreadConfigs } from "./thread-requests-BLvGkP2R.mjs";
import "./thread-lifecycle-B3mfz1TG.mjs";
import "./session-binding-Cm0apEbd.mjs";
import { t as resumeCodexAppServerThread } from "./thread-resume-DIBXwOpE.mjs";
import { a as rollbackCodexAppServerBindingSubscription, n as releaseCodexAppServerBindingSubscription, r as retainCodexAppServerBindingSubscription, s as withExclusiveCodexAppServerThread, t as isSameCodexAppServerThreadOwner } from "./thread-ownership-DcTtAcXj.mjs";
import { a as resolveCodexAppServerForModelProvider, i as resolveCodexSessionPermissionCwd, n as applyCodexSessionPermissionPolicy, t as CODEX_SESSION_PERMISSION_EXEC_MODES } from "./session-permission-policy-BI1QK_98.mjs";
import { u as trackCodexConversationActiveTurn } from "./conversation-control-uK9Jomlc.mjs";
import { asOptionalRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveSessionAgentIdsStrict } from "openclaw/plugin-sdk/agent-scope-runtime";
import { resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveAgentWorkspaceDir } from "openclaw/plugin-sdk/agent-runtime";
import { embeddedAgentLog, formatErrorMessage, resolveActiveEmbeddedRunSessionId, resolveSandboxContext } from "openclaw/plugin-sdk/agent-harness-runtime";
import { loadExecApprovals } from "openclaw/plugin-sdk/exec-approvals-runtime";
import { getSessionEntry, resolveStorePath, resolveTranscriptSessionKeyBySessionId } from "openclaw/plugin-sdk/session-store-runtime";
import { readVisibleSessionTranscriptMessageEntries } from "openclaw/plugin-sdk/session-transcript-runtime";
//#region extensions/codex/src/conversation-binding-preparation.ts
/** Canonical conversation thread preparation, policy, and binding ownership. */
const NATIVE_CONVERSATION_INTERACTIVE_APPROVALS_UNAVAILABLE = "OpenClaw native Codex conversation binding cannot route interactive approvals yet; use the Codex harness or explicit /acp spawn codex for that workflow.";
async function resolveConversationAppServerRuntime(params) {
	const source = params.source;
	const agentId = source?.agentId ?? params.agentId ?? (params.config ? resolveSessionAgentIdsStrict({
		sessionKey: params.sessionKey,
		config: params.config
	}).sessionAgentId : void 0);
	const storePath = agentId && (source || params.sessionKey) ? resolveStorePath(params.config?.session?.store, { agentId }) : void 0;
	const sessionKey = source ? source.sessionKey ?? (storePath ? resolveTranscriptSessionKeyBySessionId({
		agentId: source.agentId,
		sessionId: source.sessionId,
		storePath
	}) : void 0) : params.sessionKey;
	const storedEntry = sessionKey && storePath ? getSessionEntry({
		agentId,
		storePath,
		sessionKey,
		readConsistency: "latest"
	}) : void 0;
	const entry = !source || storedEntry?.sessionId === source.sessionId ? storedEntry : void 0;
	if (source && !entry) throw new Error("Codex conversation source session is missing or no longer current; rebind this conversation before retrying.");
	const permissionMode = entry?.permissionMode;
	const sessionRoot = permissionMode ? entry?.sessionRoot : void 0;
	const agentWorkspaceDir = params.config && agentId ? resolveAgentWorkspaceDir(params.config, agentId) : resolveCodexDefaultWorkspaceDir(params.pluginConfig);
	const execPolicy = resolveOpenClawExecPolicyForCodexAppServer({
		config: params.config,
		agentId,
		permissionMode,
		execOverrides: permissionMode ? { mode: CODEX_SESSION_PERMISSION_EXEC_MODES[permissionMode] } : void 0,
		approvals: permissionMode === "full" ? void 0 : loadExecApprovals()
	});
	const sandboxForPolicy = execPolicy.touched && execPolicy.security === "full" && execPolicy.ask !== "off" ? await resolveSandboxContext({
		config: params.config,
		sessionKey,
		workspaceDir: agentWorkspaceDir
	}) : void 0;
	const configuredRuntime = resolveCodexAppServerRuntimeOptions({
		pluginConfig: params.pluginConfig,
		execPolicy,
		modelProvider: params.modelProvider,
		model: params.model,
		config: params.config,
		agentDir: params.agentDir,
		openClawSandboxActive: Boolean(sandboxForPolicy?.enabled)
	});
	const canUseAutoReview = canUseCodexModelBackedApprovalsReviewerForModel({
		modelProvider: params.modelProvider,
		model: params.model,
		config: params.config,
		env: process.env,
		agentDir: params.agentDir
	});
	return {
		runtime: applyCodexSessionPermissionPolicy({
			appServer: configuredRuntime,
			permissionMode,
			sessionRoot,
			defaultRoot: agentWorkspaceDir,
			pluginConfig: readCodexPluginConfig(params.pluginConfig),
			canUseAutoReview,
			requirementsToml: readCodexRequirementsToml({}),
			execMode: execPolicy.mode
		}),
		workspaceDir: resolveCodexSessionPermissionCwd({
			permissionMode,
			sessionRoot,
			defaultRoot: agentWorkspaceDir,
			requestedCwd: params.workspaceDir,
			fallbackCwd: params.workspaceDir
		})
	};
}
const CODEX_CONVERSATION_THREAD_DEVELOPER_INSTRUCTIONS = "This Codex thread is bound to an OpenClaw conversation. Answer normally; OpenClaw will deliver your final response back to the conversation.";
async function resolveThreadBindingRuntime(params) {
	const agentLookup = buildCodexConversationAgentLookup({
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
	const { runtime, workspaceDir } = await resolveConversationAppServerRuntime({
		pluginConfig: params.pluginConfig,
		config: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		source: params.source,
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
	assertNativeConversationApprovalPolicySupported(modelScopedRuntime);
	const clientOptions = {
		startOptions: runtime.start,
		timeoutMs: runtime.requestTimeoutMs,
		authProfileId: params.authProfileId,
		...agentLookup
	};
	return {
		runtime: modelScopedRuntime,
		workspaceDir,
		agentLookup,
		model: modelSelection?.model,
		modelProvider: modelSelection?.modelProvider ?? modelProvider,
		clientOptions
	};
}
function buildConversationThreadRequest(resolved, serviceTier, effectiveNativeConfig) {
	return {
		cwd: resolved.workspaceDir,
		...resolved.model ? { model: resolved.model } : {},
		...resolved.modelProvider ? { modelProvider: resolved.modelProvider } : {},
		personality: CODEX_NATIVE_PERSONALITY_NONE,
		approvalPolicy: resolved.runtime.approvalPolicy,
		approvalsReviewer: resolved.runtime.approvalsReviewer,
		...resolved.runtime.sessionRoot ? { runtimeWorkspaceRoots: [resolved.runtime.sessionRoot] } : {},
		...codexConversationSandboxOrPermissions(resolved.runtime, resolved.runtime.sandbox, effectiveNativeConfig),
		...serviceTier ? { serviceTier } : {}
	};
}
async function buildConversationThreadRequestForClient(client, resolved, serviceTier, requestOptions) {
	const effectiveConfig = await readCodexEffectiveConfig(client, resolved.workspaceDir, requestOptions());
	requestOptions();
	return buildConversationThreadRequest(resolved, serviceTier, effectiveConfig);
}
function codexConversationSandboxOrPermissions(runtime, sandbox, effectiveNativeConfig) {
	const networkProxy = runtime.networkProxy;
	const config = buildCodexProjectDocThreadConfig(mergeCodexThreadConfigs(networkProxy?.configPatch, buildDisabledAppsConfigPatch()), effectiveNativeConfig);
	return networkProxy ? { config } : {
		sandbox,
		config
	};
}
async function writeThreadBindingFromResponse(params, resolved, client, response, requestOptions) {
	let retained = false;
	let sameOwner = false;
	try {
		const current = params.bindingStore.read(params.identity);
		assertCodexBindingMayBeReplaced(current, "storing a conversation-bound Codex thread");
		const trackSubscription = !params.incognito && isCodexAppServerClientRuntimeLive(client);
		sameOwner = isSameCodexAppServerThreadOwner(current, {
			threadId: response.thread.id,
			clientId: client.getInstanceId()
		});
		requestOptions();
		assertCodexThreadAcceptsDirectInput(response.thread);
		if (trackSubscription) {
			retained = await retainCodexAppServerBindingSubscription(client, response.thread.id);
			if (!retained) throw new Error("Codex conversation thread lost its native subscription owner.");
		}
		if (current && !sameOwner) {
			const { assertCurrent } = requestOptions();
			await releaseCodexAppServerBindingSubscription(current, { assertCurrent });
		}
		requestOptions();
		if (!await params.bindingStore.mutate(params.identity, {
			kind: "set",
			binding: {
				threadId: response.thread.id,
				clientId: client.getInstanceId(),
				cwd: resolved.workspaceDir,
				authProfileId: params.authProfileId,
				model: response.model ?? resolved.model ?? params.model,
				modelProvider: normalizeCodexAppServerBindingModelProvider({
					authProfileId: params.authProfileId,
					modelProvider: response.modelProvider ?? resolved.modelProvider ?? params.modelProvider,
					...resolved.agentLookup
				}),
				serviceTier: params.serviceTier ?? resolved.runtime.serviceTier ?? void 0,
				networkProxyProfileName: resolved.runtime.networkProxy?.profileName,
				networkProxyConfigFingerprint: resolved.runtime.networkProxy?.configFingerprint
			}
		}, requestOptions)) throw new Error("Codex conversation binding changed while storing its thread.");
	} catch (error) {
		if (retained && !sameOwner || !hasCodexAppServerLiveThread(client, response.thread.id)) await rollbackCodexAppServerBindingSubscription(client, response.thread.id, retained);
		throw error;
	}
}
async function bindThread(params, threadId) {
	const current = params.bindingStore.read(params.identity);
	assertCodexBindingMayBeReplaced(current, "binding a conversation-bound Codex thread");
	const resolved = await resolveThreadBindingRuntime(params);
	const clientLease = { client: await getLeasedSharedCodexAppServerClient(resolved.clientOptions) };
	try {
		await withLeasedCodexAppServerClientStartSelectionRetry({
			lease: clientLease,
			options: resolved.clientOptions,
			run: async (client, requestOptions) => {
				const request = await buildConversationThreadRequestForClient(client, resolved, params.serviceTier ?? resolved.runtime.serviceTier, requestOptions);
				let response;
				if (threadId && !resolved.runtime.networkProxy) {
					if (isCodexAppServerLiveThreadClaimed(client, threadId)) throw new Error(`Codex thread ${threadId} has an active run; stop it before binding its conversation.`);
					const { thread } = await client.request("thread/read", {
						threadId,
						includeTurns: false
					}, requestOptions());
					assertCodexThreadAcceptsDirectInput(thread);
					const { assertCurrent } = requestOptions();
					await releaseCodexAppServerLiveThread(client, threadId, assertCurrent);
					if (isCodexAppServerLiveThreadClaimed(client, threadId)) throw new Error(`Codex thread ${threadId} has an active run; stop it before binding its conversation.`);
					response = await resumeCodexAppServerThread({
						client,
						abandonClient: () => closeCodexStartupClientBestEffort(client),
						request: {
							...request,
							threadId
						},
						requestResume: (resumeRequest) => client.request("thread/resume", resumeRequest, requestOptions())
					});
				} else response = await client.request("thread/start", {
					...request,
					developerInstructions: CODEX_CONVERSATION_THREAD_DEVELOPER_INSTRUCTIONS,
					experimentalRawEvents: true,
					...params.incognito ? { ephemeral: true } : {}
				}, requestOptions());
				await writeThreadBindingFromResponse(params, resolved, client, response, requestOptions);
			}
		});
	} finally {
		releaseCodexAppServerClientLease(clientLease);
	}
}
function assertNativeConversationApprovalPolicySupported(runtime) {
	if (runtime.approvalPolicy !== "never" && runtime.approvalsReviewer === "user") throw new Error(NATIVE_CONVERSATION_INTERACTIVE_APPROVALS_UNAVAILABLE);
}
async function prepareCodexConversationBinding(params, options = {}) {
	const identity = {
		kind: "conversation",
		bindingId: params.data.bindingId
	};
	const snapshot = params.bindingStore.read(identity);
	const run = () => params.bindingStore.withLease(identity, async () => {
		const current = params.bindingStore.read(identity);
		if (current?.threadId !== snapshot?.threadId || current?.clientId !== snapshot?.clientId) throw new Error("Codex conversation binding changed before preparation.");
		const requested = params.data.start && current?.conversationStartId !== params.data.start.id ? params.data.start : void 0;
		if (current && !requested && !options.forceNew) return;
		const sourceIdentity = params.data.source ? sessionBindingIdentity({
			agentId: params.data.source.agentId,
			sessionId: params.data.source.sessionId,
			sessionKey: params.data.source.sessionKey,
			config: params.config
		}) : void 0;
		const sourceBinding = sourceIdentity ? params.bindingStore.read(sourceIdentity) : void 0;
		assertCodexBindingMayBeReplaced(current, "initializing a conversation-bound Codex thread");
		assertCodexBindingMayBeReplaced(sourceBinding, "transferring a session into a conversation-bound Codex thread");
		const inherited = current ?? sourceBinding;
		const agentLookup = buildCodexConversationAgentLookup({
			agentDir: params.data.agentDir,
			config: params.config
		});
		const bindingParams = {
			bindingStore: params.bindingStore,
			identity,
			pluginConfig: params.pluginConfig,
			workspaceDir: requested ? params.data.workspaceDir : inherited?.cwd ?? params.data.workspaceDir,
			...agentLookup,
			model: requested?.model ?? inherited?.model,
			modelProvider: requested?.modelProvider ?? inherited?.modelProvider,
			authProfileId: requested?.authProfileId ?? inherited?.authProfileId,
			serviceTier: inherited?.serviceTier,
			config: params.config,
			sessionKey: params.data.legacyBinding ? params.sessionKey : params.data.source?.sessionKey,
			source: params.data.source,
			incognito: params.incognito,
			agentId: params.data.source?.agentId ?? params.data.agentId
		};
		const threadId = requested?.threadId;
		await bindThread(bindingParams, options.forceNew ? void 0 : threadId);
		const stored = params.bindingStore.read(identity);
		if (!stored) throw new Error("Codex conversation binding disappeared while initializing its thread.");
		if (sourceIdentity && params.data.source && !current?.conversationSourceTransferComplete) await params.bindingStore.withLease(sourceIdentity, async () => {
			const source = params.bindingStore.read(sourceIdentity);
			if (source && source.threadId === params.data.source?.threadId) {
				const sourceSessionKey = sourceIdentity.sessionKey ?? resolveTranscriptSessionKeyBySessionId({
					agentId: sourceIdentity.agentId,
					sessionId: sourceIdentity.sessionId,
					storePath: resolveStorePath(params.config?.session?.store, { agentId: sourceIdentity.agentId })
				});
				if (sourceSessionKey && resolveActiveEmbeddedRunSessionId(sourceSessionKey) === sourceIdentity.sessionId) throw new Error("Codex source session has an active run; stop it before binding this conversation.");
				if (source.threadId !== stored.threadId) {
					await releaseCodexAppServerBindingSubscription(source);
					await projectConversationSourceHistory(params.data.source, stored, params.config);
				}
				await params.bindingStore.mutate(sourceIdentity, {
					kind: "clear",
					threadId: source.threadId
				});
			}
		});
		if (!await params.bindingStore.mutate(identity, {
			kind: "patch",
			threadId: stored.threadId,
			patch: {
				...params.data.start ? { conversationStartId: params.data.start.id } : {},
				...sourceIdentity ? { conversationSourceTransferComplete: true } : {}
			}
		})) throw new Error("Codex conversation binding changed while initializing its thread.");
	});
	const threadId = params.data.start?.threadId ?? snapshot?.threadId;
	if (threadId) await withExclusiveCodexAppServerThread({
		bindingStore: params.bindingStore,
		identity,
		threadId,
		run
	});
	else await run();
}
async function projectConversationSourceHistory(source, target, config) {
	const storePath = resolveStorePath(config?.session?.store, { agentId: source.agentId });
	const sessionKey = source.sessionKey ?? resolveTranscriptSessionKeyBySessionId({
		agentId: source.agentId,
		sessionId: source.sessionId,
		storePath
	});
	if (!sessionKey) return;
	const entries = await readVisibleSessionTranscriptMessageEntries({
		agentId: source.agentId,
		sessionId: source.sessionId,
		sessionKey,
		storePath
	});
	const history = projectBoundedCodexVisibleSessionHistory(entries);
	if (history.length === 0) return;
	const clientLease = retainSharedCodexAppServerClientByInstanceId(target.clientId);
	if (!clientLease) throw new Error("Codex conversation source history lost its bound client owner.");
	try {
		await clientLease.client.request("thread/inject_items", {
			threadId: target.threadId,
			items: history
		});
	} finally {
		clientLease.release();
	}
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
function buildCodexConversationAgentLookup(params) {
	const agentDir = params.agentDir?.trim();
	return {
		...agentDir ? { agentDir } : {},
		...params.config ? { config: params.config } : {}
	};
}
//#endregion
//#region extensions/codex/src/conversation-turn-collector.ts
/** Identifies a timer that expired in the bound-turn collector itself. */
var CodexConversationTurnTimeoutError = class extends Error {
	constructor() {
		super("codex app-server bound turn timed out");
		this.name = "CodexConversationTurnTimeoutError";
	}
};
function createCodexConversationTurnCollector(threadId) {
	let turnId;
	let completed = false;
	let failedError;
	let timeout;
	const assistantTextByItem = /* @__PURE__ */ new Map();
	let resolveCompletion;
	let rejectCompletion;
	const collectReplyText = () => {
		return [...assistantTextByItem.values()].map((text) => text.trim()).filter(Boolean).at(-1) ?? "";
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
		if (!params || !turnId || !isCodexNotificationForTurn(params, threadId, turnId)) return;
		if (notification.method === "item/agentMessage/delta") {
			const itemId = normalizeOptionalString(params.itemId) ?? "assistant";
			const delta = readTextString(params, "delta");
			if (!delta) return;
			assistantTextByItem.set(itemId, `${assistantTextByItem.get(itemId) ?? ""}${delta}`);
			return;
		}
		if (notification.method === "item/completed") {
			const item = isJsonObject(params.item) ? params.item : void 0;
			if (item?.type === "agentMessage") {
				const itemId = normalizeOptionalString(item.id) ?? normalizeOptionalString(params.itemId) ?? "assistant";
				assistantTextByItem.delete(itemId);
				const text = readAssistantReplyText(item);
				if (text?.trim()) assistantTextByItem.set(itemId, text);
			}
			return;
		}
		if (notification.method === "turn/completed") {
			const turn = isJsonObject(params.turn) ? params.turn : void 0;
			const status = normalizeOptionalString(turn?.status);
			if (status === "failed") failedError = normalizeOptionalString(asOptionalRecord(turn?.error)?.message) ?? "codex app-server turn failed";
			else if (status === "interrupted") failedError = "codex app-server turn interrupted";
			else if (status !== "completed") failedError = "codex app-server turn completed without a valid terminal status";
			if (status === "completed") {
				const items = Array.isArray(turn?.items) ? turn.items : [];
				for (const item of items) {
					if (!isJsonObject(item) || item.type !== "agentMessage") continue;
					const itemId = normalizeOptionalString(item.id) ?? `assistant-${assistantTextByItem.size + 1}`;
					assistantTextByItem.delete(itemId);
					const text = readAssistantReplyText(item);
					if (text?.trim()) assistantTextByItem.set(itemId, text);
				}
			}
			finish();
		}
	};
	return {
		setTurnId(nextTurnId) {
			turnId = nextTurnId;
		},
		handleNotification,
		wait(params) {
			if (completed) return failedError ? Promise.reject(new Error(failedError)) : Promise.resolve({ replyText: collectReplyText() });
			return new Promise((resolve, reject) => {
				resolveCompletion = resolve;
				rejectCompletion = reject;
				timeout = setTimeout(() => {
					completed = true;
					reject(new CodexConversationTurnTimeoutError());
					clearWaitState();
				}, resolveTimerTimeoutMs(params.timeoutMs, 100, 100));
				timeout.unref?.();
			});
		}
	};
}
function readAssistantReplyText(item) {
	return item.phase === "commentary" || item.delivery === "async" ? void 0 : readTextString(item, "text");
}
function readTextString(record, key) {
	const value = record?.[key];
	return typeof value === "string" && value.length > 0 ? value : void 0;
}
//#endregion
//#region extensions/codex/src/conversation-turn-input.ts
const IMAGE_EXTENSIONS = /* @__PURE__ */ new Set([
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
	}, ...(params.event.media ?? []).map(toCodexImageInput).filter((item) => item !== void 0)];
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
	if (media.kind === "image" || media.contentType?.toLowerCase().startsWith("image/")) return true;
	const candidate = media.path ?? media.url;
	if (!candidate) return false;
	return IMAGE_EXTENSIONS.has(path.extname(candidate.split(/[?#]/, 1)[0] ?? "").toLowerCase());
}
function normalizeFileUrl(value) {
	if (!/^file:\/\//iu.test(value)) return value;
	try {
		const fileUrl = new URL(value);
		decodeURIComponent(fileUrl.pathname);
		return fileURLToPath(fileUrl);
	} catch {
		return;
	}
}
function readLocalMediaPath(value) {
	if (!value) return;
	if (/^file:\/\//iu.test(value)) return value;
	if (value.startsWith("//")) return;
	if (path.isAbsolute(value) || path.win32.isAbsolute(value)) return value;
	return /^[a-z][a-z0-9+.-]*:/i.test(value) ? void 0 : value;
}
//#endregion
//#region extensions/codex/src/conversation-binding.ts
const DEFAULT_BOUND_TURN_TIMEOUT_MS = 12e5;
async function runBoundTurn(params) {
	const agentLookup = buildCodexConversationAgentLookup({
		agentDir: params.data.agentDir,
		config: params.config
	});
	const identity = {
		kind: "conversation",
		bindingId: params.data.bindingId
	};
	const binding = params.bindingStore.read(identity);
	if (!binding?.threadId) throw new Error("bound Codex conversation has no thread binding");
	return await withExclusiveCodexAppServerThread({
		bindingStore: params.bindingStore,
		identity,
		threadId: binding.threadId,
		run: async () => {
			const current = params.bindingStore.read(identity);
			if (!isSameCodexAppServerThreadOwner(current, binding)) throw new Error("Codex conversation binding changed before its turn.");
			assertCodexBindingMayBeReplaced(binding, "running a conversation-bound Codex thread");
			let threadId = binding.threadId;
			const requestedWorkspaceDir = binding.cwd || params.data.workspaceDir;
			const reviewerModelProvider = resolveModelBackedReviewerPolicyProvider({
				authProfileId: binding.authProfileId,
				modelProvider: binding.modelProvider,
				...agentLookup
			});
			const { runtime, workspaceDir } = await resolveConversationAppServerRuntime({
				pluginConfig: params.pluginConfig,
				config: params.config,
				agentId: params.data.source?.agentId ?? params.data.agentId,
				sessionKey: params.data.legacyBinding ? params.sessionKey : params.data.source?.sessionKey,
				source: params.data.source,
				workspaceDir: requestedWorkspaceDir,
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
			const sessionRoot = modelScopedRuntime.sessionRoot;
			const approvalPolicy = modelScopedRuntime.approvalPolicy;
			const sandbox = modelScopedRuntime.sandbox;
			const permissionProfile = modelScopedRuntime.networkProxy?.profileName;
			const networkProxyConfigFingerprint = modelScopedRuntime.networkProxy?.configFingerprint;
			const networkProxyBindingChanged = binding.networkProxyProfileName !== permissionProfile || binding.networkProxyConfigFingerprint !== networkProxyConfigFingerprint;
			const serviceTier = binding.serviceTier ?? runtime.serviceTier;
			let useStickyNetworkProfile = permissionProfile !== void 0 && binding.networkProxyProfileName === permissionProfile && binding.networkProxyConfigFingerprint === networkProxyConfigFingerprint;
			assertNativeConversationApprovalPolicySupported(modelScopedRuntime);
			const modelSelection = binding.model ? resolveCodexAppServerRequestModelSelection({
				model: binding.model,
				modelProvider: binding.modelProvider,
				authProfileId: binding.authProfileId,
				...agentLookup
			}) : void 0;
			const threadRequestRuntime = {
				runtime: modelScopedRuntime,
				workspaceDir,
				...modelSelection
			};
			const clientOptions = {
				startOptions: runtime.start,
				timeoutMs: runtime.requestTimeoutMs,
				authProfileId: binding.authProfileId,
				...agentLookup
			};
			let client = await getLeasedSharedCodexAppServerClient(clientOptions);
			const clientLease = { client };
			let activeTurnId;
			let activeTurnCleanup = () => void 0;
			let isolatedSubscriptionClient;
			let turnRoute;
			let liveThreadOwnership;
			let ownsNativeSubscription = false;
			let turnSucceeded = false;
			const assertResumeInputAllowed = async () => {
				const { thread } = await client.request("thread/read", {
					threadId,
					includeTurns: false
				}, { timeoutMs: runtime.requestTimeoutMs });
				assertCodexThreadAcceptsDirectInput(thread);
			};
			try {
				if (!networkProxyBindingChanged && binding.clientId !== client.getInstanceId()) await assertResumeInputAllowed();
				if (!params.incognito && isCodexAppServerClientRuntimeLive(client)) {
					const ownership = await consumeCodexAppServerLiveThread(client, threadId);
					if (ownership) {
						liveThreadOwnership = {
							client,
							threadId,
							ownership
						};
						ownsNativeSubscription = true;
					}
				}
				if (networkProxyBindingChanged) {
					const response = assertCodexThreadStartResponse(await withLeasedCodexAppServerClientStartSelectionRetry({
						lease: clientLease,
						options: clientOptions,
						run: async (requestClient, requestOptions) => {
							const threadRequest = await buildConversationThreadRequestForClient(requestClient, threadRequestRuntime, serviceTier, requestOptions);
							return await requestClient.request("thread/start", {
								...threadRequest,
								developerInstructions: CODEX_CONVERSATION_THREAD_DEVELOPER_INSTRUCTIONS,
								experimentalRawEvents: true,
								...params.incognito ? { ephemeral: true } : {}
							}, requestOptions());
						},
						onClientChange: (nextClient) => {
							client = nextClient;
						}
					}));
					threadId = response.thread.id;
					ownsNativeSubscription = true;
					assertCodexThreadAcceptsDirectInput(response.thread);
					if (liveThreadOwnership && (liveThreadOwnership.threadId !== threadId || liveThreadOwnership.client !== client)) {
						const previousOwnership = liveThreadOwnership;
						try {
							await previousOwnership.ownership.release(previousOwnership.threadId);
						} catch (error) {
							if (!(isCodexAppServerClientRuntimeLive(previousOwnership.client) && await retainCodexAppServerBindingSubscription(previousOwnership.client, previousOwnership.threadId, previousOwnership.ownership).catch(() => false))) await closeCodexStartupClientBestEffort(previousOwnership.client);
							liveThreadOwnership = void 0;
							throw error;
						}
						liveThreadOwnership = void 0;
					} else if (binding.threadId !== threadId) await releaseCodexAppServerBindingSubscription(binding);
					if (!await params.bindingStore.mutate(identity, {
						kind: "set",
						binding: {
							threadId,
							clientId: client.getInstanceId(),
							cwd: response.thread.cwd ?? workspaceDir,
							authProfileId: binding.authProfileId,
							model: response.model ?? modelSelection?.model ?? binding.model,
							modelProvider: normalizeCodexAppServerBindingModelProvider({
								authProfileId: binding.authProfileId,
								modelProvider: response.modelProvider ?? modelSelection?.modelProvider ?? binding.modelProvider,
								...agentLookup
							}),
							serviceTier: serviceTier ?? void 0,
							networkProxyProfileName: modelScopedRuntime.networkProxy?.profileName,
							networkProxyConfigFingerprint: modelScopedRuntime.networkProxy?.configFingerprint,
							conversationStartId: binding.conversationStartId,
							conversationSourceTransferComplete: binding.conversationSourceTransferComplete,
							historyCoveredThrough: binding.historyCoveredThrough
						}
					})) throw new Error("Codex conversation binding changed while rotating its thread.");
					useStickyNetworkProfile = modelScopedRuntime.networkProxy !== void 0;
				} else if (binding.clientId !== client.getInstanceId() || isCodexAppServerClientRuntimeLive(client) && !params.incognito && !liveThreadOwnership) {
					if (binding.clientId === client.getInstanceId()) await assertResumeInputAllowed();
					const response = await withLeasedCodexAppServerClientStartSelectionRetry({
						lease: clientLease,
						options: clientOptions,
						run: async (requestClient, requestOptions) => {
							const threadRequest = await buildConversationThreadRequestForClient(requestClient, threadRequestRuntime, serviceTier, requestOptions);
							return await resumeCodexAppServerThread({
								client: requestClient,
								onSubscriptionReleased: () => {
									isolatedSubscriptionClient = requestClient;
								},
								abandonClient: async () => {
									await closeCodexStartupClientBestEffort(requestClient);
									isolatedSubscriptionClient = requestClient;
								},
								request: {
									threadId,
									...threadRequest
								},
								requestResume: (request) => requestClient.request("thread/resume", request, requestOptions())
							});
						},
						onClientChange: (nextClient) => {
							client = nextClient;
						}
					});
					threadId = response.thread.id;
					ownsNativeSubscription = true;
					assertCodexThreadAcceptsDirectInput(response.thread);
					if (!isSameCodexAppServerThreadOwner(binding, {
						threadId,
						clientId: client.getInstanceId()
					})) await releaseCodexAppServerBindingSubscription(binding);
					if (!await params.bindingStore.mutate(identity, {
						kind: "patch",
						threadId: binding.threadId,
						patch: {
							clientId: client.getInstanceId(),
							cwd: response.thread.cwd ?? binding.cwd,
							model: response.model ?? modelSelection?.model ?? binding.model,
							modelProvider: normalizeCodexAppServerBindingModelProvider({
								authProfileId: binding.authProfileId,
								modelProvider: response.modelProvider ?? modelSelection?.modelProvider ?? binding.modelProvider,
								...agentLookup
							})
						}
					})) throw new Error("Codex conversation binding changed while resuming on a new client.");
				}
				const turnCollector = createCodexConversationTurnCollector(threadId);
				turnRoute = getCodexAppServerTurnRouter(client).reserveThread({
					threadId,
					onNotification: turnCollector.handleNotification
				});
				turnRoute.armTurn();
				activeTurnId = (await client.request("turn/start", {
					threadId,
					input: buildCodexConversationTurnInput({
						prompt: params.prompt,
						event: params.event
					}),
					cwd: workspaceDir,
					...sessionRoot ? { runtimeWorkspaceRoots: [sessionRoot] } : {},
					approvalPolicy,
					approvalsReviewer: modelScopedRuntime.approvalsReviewer,
					...useStickyNetworkProfile ? {} : { sandboxPolicy: codexSandboxPolicyForTurn(sandbox, sessionRoot ?? workspaceDir) },
					...modelSelection?.model ? { model: modelSelection.model } : {},
					personality: CODEX_NATIVE_PERSONALITY_NONE,
					...serviceTier ? { serviceTier } : {}
				}, { timeoutMs: runtime.requestTimeoutMs })).turn.id;
				activeTurnCleanup = trackCodexConversationActiveTurn({
					identity,
					client,
					requestTimeoutMs: runtime.requestTimeoutMs,
					threadId,
					turnId: activeTurnId
				});
				turnCollector.setTurnId(activeTurnId);
				await turnRoute.bindTurn(activeTurnId);
				const replyText = (await turnCollector.wait({ timeoutMs: params.timeoutMs ?? DEFAULT_BOUND_TURN_TIMEOUT_MS })).replyText.trim();
				turnSucceeded = true;
				return { reply: { text: replyText || "Codex completed without a text reply." } };
			} catch (error) {
				if (isCodexAppServerOverloadError(error) && error.method === "thread/resume") throw error;
				if (error instanceof CodexThreadDirectInputError) {
					if (params.incognito && ownsNativeSubscription) {
						if (!await unsubscribeCodexThreadBestEffort(client, {
							threadId,
							timeoutMs: 5e3
						})) await retireUnsafeCodexTurnClientBestEffort(client, "parent-owned thread unsubscribe");
					}
					throw error;
				}
				if (error instanceof CodexConversationTurnTimeoutError && activeTurnId || turnRoute && isCodexAppServerIndeterminateRequestCancellationError(error)) {
					if (!await interruptCodexTurnAndWaitBestEffort(client, {
						threadId,
						turnId: activeTurnId ?? ""
					})) {
						await retireUnsafeCodexTurnClientBestEffort(client, "turn interrupt");
						isolatedSubscriptionClient = client;
					}
				}
				if (params.incognito) {
					if (await params.bindingStore.mutate(identity, {
						kind: "clear",
						threadId
					}) && isolatedSubscriptionClient !== client) {
						if (!await unsubscribeCodexThreadBestEffort(client, {
							threadId,
							timeoutMs: 5e3
						})) await retireUnsafeCodexTurnClientBestEffort(client, "thread unsubscribe");
					}
				}
				throw error;
			} finally {
				activeTurnCleanup();
				turnRoute?.release();
				try {
					if (ownsNativeSubscription && isolatedSubscriptionClient !== client && !params.incognito && isCodexAppServerClientRuntimeLive(client)) {
						const currentLiveThreadOwnership = liveThreadOwnership?.client === client && liveThreadOwnership.threadId === threadId ? liveThreadOwnership.ownership : void 0;
						let retained = false;
						if (turnSucceeded) retained = await params.bindingStore.withLease(identity, async () => {
							const latest = params.bindingStore.read(identity);
							if (latest?.threadId !== threadId || latest.clientId !== client.getInstanceId()) return false;
							return await retainCodexAppServerBindingSubscription(client, threadId, currentLiveThreadOwnership);
						});
						if (!retained) {
							if (!(currentLiveThreadOwnership ? await currentLiveThreadOwnership.release(threadId).then(() => true) : await unsubscribeCodexThreadBestEffort(client, {
								threadId,
								timeoutMs: 5e3
							}))) await closeCodexStartupClientBestEffort(client);
						}
					}
				} catch (error) {
					embeddedAgentLog.warn("codex conversation subscription cleanup failed", {
						threadId,
						reason: formatErrorMessage(error)
					});
					await closeCodexStartupClientBestEffort(client);
				} finally {
					releaseCodexAppServerClientLease(clientLease);
				}
			}
		}
	});
}
async function runBoundTurnWithMissingThreadRecovery(params) {
	await prepareCodexConversationBinding(params);
	try {
		return await runBoundTurn(params);
	} catch (error) {
		if (!isCodexThreadNotFoundError(error)) throw error;
		await prepareCodexConversationBinding(params, { forceNew: true });
		return await runBoundTurn(params);
	}
}
function isCodexThreadNotFoundError(error) {
	if (isCodexAppServerOverloadError(error) || isCodexAppServerUnsafeSubscriptionError(error)) return false;
	const message = formatErrorMessage(error);
	return /\bthread not found:/iu.test(message) || /\bbound Codex conversation has no thread binding\b/u.test(message);
}
//#endregion
export { runBoundTurnWithMissingThreadRecovery };
