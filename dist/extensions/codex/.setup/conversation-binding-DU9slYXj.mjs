import { r as isJsonObject } from "./protocol-CaPAVwe9.mjs";
import { g as sessionBindingIdentity, n as assertCodexBindingMayBeReplaced } from "./session-binding-record-BXXjih0v.mjs";
import { d as readCodexRequirementsToml } from "./config-security-BxV4sSRz.mjs";
import { d as readCodexPluginConfig } from "./config-parsing-DsWSCPHO.mjs";
import { d as readCodexEffectiveConfig, n as codexSandboxPolicyForTurn } from "./config-options-l737cwJB.mjs";
import { T as retainSharedCodexAppServerClientByInstanceId } from "./auth-cache-key-aTVcxfbh.mjs";
import { o as resolveCodexDefaultWorkspaceDir } from "./conversation-binding-data-CyPbwaSw.mjs";
import { c as isCodexThreadReadMissingError, o as isCodexAppServerOverloadError, r as CodexAppServerRpcError } from "./rpc-error-CrpIS8O9.mjs";
import { n as projectBoundedCodexVisibleSessionHistory } from "./transcript-history-projection-i-FVpyha.mjs";
import { n as canUseCodexModelBackedApprovalsReviewerForModel, r as resolveOpenClawExecPolicyForCodexAppServer } from "./config-DEC5R1wk.mjs";
import { n as resolveCodexAppServerRuntimeOptions } from "./config-runtime-Be4ZqerX.mjs";
import { n as normalizeCodexAppServerBindingModelProvider, o as resolveModelBackedReviewerPolicyProvider } from "./auth-profile-auwzSwwy.mjs";
import { F as isCodexAppServerLiveThreadClaimed, H as releaseCodexAppServerLiveThread, M as hasCodexAppServerLiveThread, P as isCodexAppServerClientRuntimeLive, d as releaseCodexAppServerClientLease, g as withCodexAppServerClientRequestScope, k as consumeCodexAppServerLiveThread, o as getLeasedSharedCodexAppServerClient } from "./shared-client-BEHXwqz5.mjs";
import { f as assertCodexThreadAcceptsDirectInput, h as assertCodexThreadStartResponse, i as isCodexAppServerIndeterminateRequestCancellationError, l as CodexThreadDirectInputError } from "./client-CKexde4_.mjs";
import { a as isCodexNotificationForTurn, n as getCodexAppServerTurnRouter } from "./turn-router-Cp5PBow8.mjs";
import { f as unsubscribeCodexThreadBestEffort, l as retireUnsafeCodexTurnClientBestEffort, o as closeCodexStartupClientBestEffort, s as interruptCodexTurnAndWaitBestEffort } from "./attempt-client-cleanup-CCBoNjA1.mjs";
import { d as mergeCodexThreadConfigs, s as buildDisabledAppsConfigPatch, t as buildCodexProjectDocThreadConfig } from "./project-doc-thread-config-CH6QVPwq.mjs";
import "./session-binding-2ihjGcI_.mjs";
import { r as resolveCodexAppServerRequestModelSelection, t as CODEX_NATIVE_PERSONALITY_NONE } from "./thread-model-selection-DxposL4X.mjs";
import { a as rollbackCodexAppServerBindingSubscription, c as withExclusiveCodexAppServerThread, n as releaseCodexAppServerBindingSubscription, r as retainCodexAppServerBindingSubscription, t as isSameCodexAppServerThreadOwner } from "./thread-ownership-D2aUUPS_.mjs";
import { i as resolveCodexNativeExecutionPolicy } from "./native-execution-policy-D09tLP-u.mjs";
import { i as resolveCodexNativeExecutionBlock, t as assertNativeConversationApprovalPolicySupported } from "./sandbox-guard-CM3mdNZp.mjs";
import { t as resumeCodexAppServerThread } from "./thread-resume-Bqembgom.mjs";
import { i as resolveCodexSessionPermissionCwd, n as applyCodexSessionPermissionPolicy, t as CODEX_SESSION_PERMISSION_EXEC_MODES } from "./session-permission-policy-DRL1P1o8.mjs";
import { t as resolveCodexAppServerForModelProvider } from "./app-server-policy-R8j31CMk.mjs";
import { f as trackCodexConversationActiveTurn, o as resolveThreadRequestModelProvider, t as buildCodexConversationAgentLookup } from "./conversation-control-C_wnF5yT.mjs";
import { asOptionalRecord, normalizeOptionalString, readNonEmptyStringPreservingWhitespace } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveSessionAgentIdsStrict } from "openclaw/plugin-sdk/agent-scope-runtime";
import { resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import path from "node:path";
import { isIncognitoSessionKey } from "openclaw/plugin-sdk/session-key-runtime";
import { parseAgentSessionKey } from "openclaw/plugin-sdk/routing";
import { fileURLToPath } from "node:url";
import { resolveAgentWorkspaceDir } from "openclaw/plugin-sdk/agent-runtime";
import { embeddedAgentLog, formatErrorMessage, resolveActiveEmbeddedRunSessionId, resolveSandboxContext } from "openclaw/plugin-sdk/agent-harness-runtime";
import { loadExecApprovalsReadOnlyAsync } from "openclaw/plugin-sdk/exec-approvals-runtime";
import { getSessionEntryByIdAsync, resolveStorePath } from "openclaw/plugin-sdk/session-store-runtime";
import { readVisibleSessionTranscriptMessageEntries } from "openclaw/plugin-sdk/session-transcript-runtime";
import { captureSessionEntryCurrentCheckAsync, composeSessionEntryCommitGuards } from "openclaw/plugin-sdk/session-binding-runtime";
//#region extensions/codex/src/conversation-binding-history.ts
async function projectConversationSourceHistory(source, target, config, assertCurrent) {
	const storePath = source.storePath ?? resolveStorePath(config?.session?.store, { agentId: source.agentId });
	const sessionKey = source.sessionKey ?? (await getSessionEntryByIdAsync({
		agentId: source.agentId,
		sessionId: source.sessionId,
		storePath
	}))?.sessionKey;
	if (!sessionKey) return;
	const entries = await readVisibleSessionTranscriptMessageEntries({
		agentId: source.agentId,
		sessionId: source.sessionId,
		sessionKey,
		storePath
	});
	const history = projectBoundedCodexVisibleSessionHistory(entries);
	if (history.length === 0) return;
	const clientLease = await retainSharedCodexAppServerClientByInstanceId(target.clientId);
	if (!clientLease) throw new Error("Codex conversation source history lost its bound client owner.");
	try {
		await clientLease.client.request("thread/inject_items", {
			threadId: target.threadId,
			items: history
		}, { withCurrent: async (write) => {
			await assertCurrent();
			write();
		} });
	} finally {
		await clientLease.release();
	}
}
//#endregion
//#region extensions/codex/src/conversation-binding-preparation.ts
/** Canonical conversation thread preparation, policy, and binding ownership. */
async function resolveConversationAppServerRuntime(params) {
	const source = params.source;
	const agentId = source?.agentId ?? params.agentId ?? (params.config ? resolveSessionAgentIdsStrict({
		sessionKey: params.sessionKey,
		config: params.config
	}).sessionAgentId : void 0);
	const storePath = agentId && (source || params.sessionKey) ? source?.storePath ?? params.storePath ?? resolveStorePath(params.config?.session?.store, { agentId }) : void 0;
	const selectedById = source && !source.sessionKey && storePath ? await getSessionEntryByIdAsync({
		agentId: source.agentId,
		sessionId: source.sessionId,
		storePath
	}) : void 0;
	const sessionKey = source ? source.sessionKey ?? selectedById?.sessionKey : params.sessionKey;
	const ownsSession = source || (parseAgentSessionKey(sessionKey)?.agentId ?? agentId) === agentId;
	const current = sessionKey && storePath && agentId && ownsSession ? await captureSessionEntryCurrentCheckAsync({
		agentId,
		storePath,
		sessionKey,
		fields: [
			"permissionMode",
			"sessionRoot",
			"execHost",
			"execNode",
			"sandbox",
			"sandboxMode",
			"incognito"
		],
		...selectedById ? { expected: selectedById.entry } : {}
	}) : void 0;
	let transferred = false;
	using currentCleanup = { [Symbol.dispose]: () => !transferred && current?.release() };
	const storedEntry = current?.entry;
	const entry = !source || storedEntry?.sessionId === source.sessionId ? storedEntry : void 0;
	if (source && !entry) throw new Error("Codex conversation source session is missing or no longer current; rebind this conversation before retrying.");
	const block = resolveCodexNativeExecutionBlock({
		config: params.config,
		agentId,
		sessionKey,
		storePath,
		executionPolicy: resolveCodexNativeExecutionPolicy({
			config: params.config,
			agentId,
			sessionKey,
			sessionEntry: entry ?? null,
			readRuntimeSessionEntry: false
		}),
		surface: "conversation binding"
	});
	if (block) throw new Error(block);
	const permissionMode = entry?.permissionMode;
	const sessionRoot = permissionMode ? entry?.sessionRoot : void 0;
	const agentWorkspaceDir = params.config && agentId ? resolveAgentWorkspaceDir(params.config, agentId) : resolveCodexDefaultWorkspaceDir(params.pluginConfig);
	const execPolicy = resolveOpenClawExecPolicyForCodexAppServer({
		config: params.config,
		agentId,
		permissionMode,
		execOverrides: permissionMode ? { mode: CODEX_SESSION_PERMISSION_EXEC_MODES[permissionMode] } : void 0,
		approvals: permissionMode === "full" ? void 0 : await loadExecApprovalsReadOnlyAsync()
	});
	const sandboxForPolicy = execPolicy.touched && execPolicy.security === "full" && execPolicy.ask !== "off" ? await resolveSandboxContext({
		config: params.config,
		sessionKey,
		workspaceDir: agentWorkspaceDir
	}) : void 0;
	using _ = { [Symbol.dispose]: () => sandboxForPolicy?.[Symbol.dispose]?.() };
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
	const runtime = applyCodexSessionPermissionPolicy({
		appServer: configuredRuntime,
		permissionMode,
		sessionRoot,
		defaultRoot: agentWorkspaceDir,
		pluginConfig: readCodexPluginConfig(params.pluginConfig),
		canUseAutoReview,
		requirementsToml: readCodexRequirementsToml({}),
		execMode: execPolicy.mode
	});
	await current?.assertCurrent();
	const resolved = {
		release: current?.release ?? (() => {}),
		assertCurrent: current?.assertCurrent ?? (async () => {}),
		source: current?.source,
		sessionKey,
		incognito: source || sessionKey ? entry?.incognito === true || isIncognitoSessionKey(sessionKey) : void 0,
		runtime: resolveCodexAppServerForModelProvider({
			appServer: runtime,
			provider: params.modelProvider,
			model: params.model,
			config: params.config,
			env: process.env,
			agentDir: params.agentDir
		}),
		workspaceDir: resolveCodexSessionPermissionCwd({
			permissionMode,
			sessionRoot,
			defaultRoot: agentWorkspaceDir,
			requestedCwd: params.workspaceDir,
			fallbackCwd: params.workspaceDir
		})
	};
	transferred = true;
	return resolved;
}
const CODEX_CONVERSATION_THREAD_DEVELOPER_INSTRUCTIONS = "This Codex thread is bound to an OpenClaw conversation. Answer normally; OpenClaw will deliver your final response back to the conversation.";
async function resolveThreadBindingRuntime(params) {
	const agentLookup = buildCodexConversationAgentLookup(params);
	const modelProvider = await resolveThreadRequestModelProvider({
		authProfileId: params.authProfileId,
		modelProvider: params.modelProvider,
		...agentLookup
	});
	const modelSelection = params.model?.trim() ? await resolveCodexAppServerRequestModelSelection({
		model: params.model,
		modelProvider,
		authProfileId: params.authProfileId,
		...agentLookup
	}) : void 0;
	const reviewerModelProvider = await resolveModelBackedReviewerPolicyProvider({
		authProfileId: params.authProfileId,
		modelProvider: params.modelProvider,
		...agentLookup
	});
	const { runtime, workspaceDir, assertCurrent, source, sessionKey, incognito, release } = await resolveConversationAppServerRuntime({
		...params,
		modelProvider: reviewerModelProvider
	});
	let transferred = false;
	using _ = { [Symbol.dispose]: () => !transferred && release() };
	assertNativeConversationApprovalPolicySupported(runtime);
	const clientOptions = {
		assertCurrentAsync: assertCurrent,
		startOptions: runtime.start,
		timeoutMs: runtime.requestTimeoutMs,
		authProfileId: params.authProfileId,
		...agentLookup
	};
	transferred = true;
	return {
		release,
		assertCurrent,
		source,
		sessionKey,
		incognito: incognito ?? params.incognito,
		runtime,
		workspaceDir,
		agentLookup,
		model: modelSelection?.model,
		modelProvider: modelSelection?.modelProvider ?? modelProvider,
		clientOptions
	};
}
async function buildConversationThreadRequestForClient(client, resolved, serviceTier, requestOptions) {
	await resolved.assertCurrent();
	const effectiveConfig = await readCodexEffectiveConfig(client, resolved.workspaceDir, requestOptions());
	requestOptions();
	await resolved.assertCurrent();
	const { runtime } = resolved;
	const config = buildCodexProjectDocThreadConfig(mergeCodexThreadConfigs(runtime.networkProxy?.configPatch, buildDisabledAppsConfigPatch()), effectiveConfig);
	return {
		cwd: resolved.workspaceDir,
		...resolved.model ? { model: resolved.model } : {},
		...resolved.modelProvider ? { modelProvider: resolved.modelProvider } : {},
		personality: CODEX_NATIVE_PERSONALITY_NONE,
		approvalPolicy: resolved.runtime.approvalPolicy,
		approvalsReviewer: resolved.runtime.approvalsReviewer,
		...resolved.runtime.sessionRoot ? { runtimeWorkspaceRoots: [resolved.runtime.sessionRoot] } : {},
		...runtime.networkProxy ? { config } : {
			sandbox: runtime.sandbox,
			config
		},
		...serviceTier ? { serviceTier } : {}
	};
}
async function writeThreadBindingFromResponse(params, resolved, client, response, requestOptions) {
	let retained = false;
	let sameOwner = false;
	try {
		const current = await params.bindingStore.readAsync(params.identity);
		assertCodexBindingMayBeReplaced(current, "storing a conversation-bound Codex thread");
		const trackSubscription = !resolved.incognito && isCodexAppServerClientRuntimeLive(client);
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
			const { assertCurrent, withCurrent } = requestOptions();
			await releaseCodexAppServerBindingSubscription(current, {
				assertCurrent,
				withCurrent,
				retainedClientId: client.getInstanceId()
			});
		}
		requestOptions();
		if (!await params.bindingStore.mutate(params.identity, {
			kind: "set",
			binding: {
				threadId: response.thread.id,
				clientId: client.getInstanceId(),
				cwd: resolved.workspaceDir,
				...resolved.incognito ? { conversationIncognito: true } : {},
				authProfileId: params.authProfileId,
				model: response.model ?? resolved.model ?? params.model,
				modelProvider: await normalizeCodexAppServerBindingModelProvider({
					authProfileId: params.authProfileId,
					modelProvider: response.modelProvider ?? resolved.modelProvider ?? params.modelProvider,
					...resolved.agentLookup
				}),
				serviceTier: params.serviceTier ?? resolved.runtime.serviceTier ?? void 0,
				networkProxyProfileName: resolved.runtime.networkProxy?.profileName,
				networkProxyConfigFingerprint: resolved.runtime.networkProxy?.configFingerprint
			}
		}, composeSessionEntryCommitGuards([() => {
			requestOptions();
		}, resolved.source]))) throw new Error("Codex conversation binding changed while storing its thread.");
	} catch (error) {
		if (retained && !sameOwner || !hasCodexAppServerLiveThread(client, response.thread.id)) await rollbackCodexAppServerBindingSubscription(client, response.thread.id, retained);
		throw error;
	}
}
async function bindThread(params, threadId) {
	const current = await params.bindingStore.readAsync(params.identity);
	assertCodexBindingMayBeReplaced(current, "binding a conversation-bound Codex thread");
	const resolved = await resolveThreadBindingRuntime(params);
	let transferred = false;
	using _ = { [Symbol.dispose]: () => !transferred && resolved.release() };
	const clientLease = { client: await getLeasedSharedCodexAppServerClient(resolved.clientOptions) };
	try {
		await withCodexAppServerClientRequestScope({
			lease: clientLease,
			options: resolved.clientOptions,
			run: async (client, connectionRequestOptions) => {
				const requestOptions = () => {
					const options = connectionRequestOptions();
					return {
						...options,
						withCurrent: async (write) => {
							await resolved.assertCurrent();
							options.assertCurrent();
							write();
						}
					};
				};
				const request = await buildConversationThreadRequestForClient(client, resolved, params.serviceTier ?? resolved.runtime.serviceTier, requestOptions);
				let response;
				if (threadId && !resolved.runtime.networkProxy) {
					if (isCodexAppServerLiveThreadClaimed(client, threadId)) throw new Error(`Codex thread ${threadId} has an active run; stop it before binding its conversation.`);
					const { thread } = await client.request("thread/read", {
						threadId,
						includeTurns: false
					}, requestOptions());
					assertCodexThreadAcceptsDirectInput(thread);
					const { assertCurrent, withCurrent } = requestOptions();
					await releaseCodexAppServerLiveThread(client, threadId, assertCurrent, withCurrent);
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
					...resolved.incognito ? { ephemeral: true } : {}
				}, requestOptions());
				await writeThreadBindingFromResponse(params, resolved, client, response, requestOptions);
			}
		});
	} finally {
		releaseCodexAppServerClientLease(clientLease);
	}
	transferred = true;
	return {
		assertCurrent: resolved.assertCurrent,
		source: resolved.source,
		sessionKey: resolved.sessionKey,
		release: resolved.release
	};
}
async function prepareCodexConversationBinding(params) {
	const identity = {
		kind: "conversation",
		bindingId: params.data.bindingId
	};
	const snapshot = await params.bindingStore.readAsync(identity);
	const run = () => params.bindingStore.withLease(identity, async () => {
		const current = await params.bindingStore.readAsync(identity);
		if (current?.threadId !== snapshot?.threadId || current?.clientId !== snapshot?.clientId) throw new Error("Codex conversation binding changed before preparation.");
		const requested = params.data.start && current?.conversationStartId !== params.data.start.id ? params.data.start : void 0;
		if (current && !requested) return;
		const sourceIdentity = params.data.source ? sessionBindingIdentity({
			agentId: params.data.source.agentId,
			sessionId: params.data.source.sessionId,
			sessionKey: params.data.source.sessionKey,
			config: params.config
		}) : void 0;
		const sourceBinding = sourceIdentity ? await params.bindingStore.readAsync(sourceIdentity) : void 0;
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
		const sourceAuthority = await bindThread(bindingParams, threadId);
		using _ = { [Symbol.dispose]: sourceAuthority.release };
		await sourceAuthority.assertCurrent();
		const sourceGuard = sourceAuthority.source;
		const stored = await params.bindingStore.readAsync(identity);
		if (!stored) throw new Error("Codex conversation binding disappeared while initializing its thread.");
		if (sourceIdentity && params.data.source && !current?.conversationSourceTransferComplete) await params.bindingStore.withLease(sourceIdentity, async () => {
			await sourceAuthority.assertCurrent();
			const source = await params.bindingStore.readAsync(sourceIdentity);
			if (source && source.threadId === params.data.source?.threadId) {
				const sourceSessionKey = sourceAuthority.sessionKey;
				if (sourceSessionKey && resolveActiveEmbeddedRunSessionId(sourceSessionKey, { executionStartedOnly: true }) === sourceIdentity.sessionId) throw new Error("Codex source session has an active run; stop it before binding this conversation.");
				if (source.threadId !== stored.threadId) {
					await releaseCodexAppServerBindingSubscription(source, { withCurrent: async (write) => {
						await sourceAuthority.assertCurrent();
						write();
					} });
					await projectConversationSourceHistory(params.data.source, stored, params.config, sourceAuthority.assertCurrent);
				}
				await params.bindingStore.mutate(sourceIdentity, {
					kind: "clear",
					threadId: source.threadId
				}, sourceAuthority.source);
			}
		});
		if (!await params.bindingStore.mutate(identity, {
			kind: "patch",
			threadId: stored.threadId,
			patch: {
				...params.data.start ? { conversationStartId: params.data.start.id } : {},
				...sourceIdentity ? { conversationSourceTransferComplete: true } : {}
			}
		}, sourceGuard)) throw new Error("Codex conversation binding changed while initializing its thread.");
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
	const completeItem = (item, itemId) => {
		assistantTextByItem.delete(itemId);
		const text = item.phase === "commentary" || item.delivery === "async" ? void 0 : readNonEmptyStringPreservingWhitespace(item.text);
		if (text?.trim()) assistantTextByItem.set(itemId, text);
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
			const delta = readNonEmptyStringPreservingWhitespace(params.delta);
			if (!delta) return;
			assistantTextByItem.set(itemId, `${assistantTextByItem.get(itemId) ?? ""}${delta}`);
			return;
		}
		if (notification.method === "item/completed") {
			const item = isJsonObject(params.item) ? params.item : void 0;
			if (item?.type === "agentMessage") {
				const itemId = normalizeOptionalString(item.id) ?? normalizeOptionalString(params.itemId) ?? "assistant";
				completeItem(item, itemId);
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
					completeItem(item, itemId);
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
		if (!/^file:\/\//iu.test(localPath)) return {
			type: "localImage",
			path: localPath
		};
		try {
			const fileUrl = new URL(localPath);
			decodeURIComponent(fileUrl.pathname);
			const normalized = fileURLToPath(fileUrl);
			return normalized ? {
				type: "localImage",
				path: normalized
			} : void 0;
		} catch {
			return;
		}
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
var CodexConversationUnloadedThreadError = class extends Error {
	constructor(threadId, cause) {
		super(cause.message, { cause });
		this.threadId = threadId;
	}
};
async function runBoundTurn(params) {
	const agentLookup = buildCodexConversationAgentLookup({
		agentDir: params.data.agentDir,
		config: params.config
	});
	const identity = {
		kind: "conversation",
		bindingId: params.data.bindingId
	};
	const binding = await params.bindingStore.readAsync(identity);
	if (!binding?.threadId) throw new Error("bound Codex conversation has no thread binding");
	if (params.resumeThreadId && binding.threadId !== params.resumeThreadId) throw new Error("Codex conversation binding changed before recovery; review it before resending.");
	return await withExclusiveCodexAppServerThread({
		bindingStore: params.bindingStore,
		identity,
		threadId: binding.threadId,
		run: async () => {
			const current = await params.bindingStore.readAsync(identity);
			if (!isSameCodexAppServerThreadOwner(current, binding)) throw new Error("Codex conversation binding changed before its turn.");
			assertCodexBindingMayBeReplaced(binding, "running a conversation-bound Codex thread");
			let threadId = binding.threadId;
			const requestedWorkspaceDir = binding.cwd || params.data.workspaceDir;
			const reviewerModelProvider = await resolveModelBackedReviewerPolicyProvider({
				authProfileId: binding.authProfileId,
				modelProvider: binding.modelProvider,
				...agentLookup
			});
			const { runtime, workspaceDir, assertCurrent, release, source, incognito: sourceIncognito } = await resolveConversationAppServerRuntime({
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
			using _ = { [Symbol.dispose]: release };
			const incognito = sourceIncognito ?? params.incognito;
			const { sessionRoot, approvalPolicy, sandbox } = runtime;
			const permissionProfile = runtime.networkProxy?.profileName;
			const networkProxyConfigFingerprint = runtime.networkProxy?.configFingerprint;
			const networkProxyBindingChanged = binding.networkProxyProfileName !== permissionProfile || binding.networkProxyConfigFingerprint !== networkProxyConfigFingerprint;
			if (params.resumeThreadId && networkProxyBindingChanged) throw new Error("Codex conversation policy changed before recovery; rebind the conversation and resend your message.");
			const serviceTier = binding.serviceTier ?? runtime.serviceTier;
			let useStickyNetworkProfile = permissionProfile !== void 0 && !networkProxyBindingChanged;
			assertNativeConversationApprovalPolicySupported(runtime);
			const modelSelection = binding.model ? await resolveCodexAppServerRequestModelSelection({
				model: binding.model,
				modelProvider: binding.modelProvider,
				authProfileId: binding.authProfileId,
				...agentLookup
			}) : void 0;
			const threadRequestRuntime = {
				runtime,
				workspaceDir,
				assertCurrent,
				source,
				incognito,
				...modelSelection
			};
			const clientOptions = {
				assertCurrentAsync: assertCurrent,
				startOptions: runtime.start,
				timeoutMs: runtime.requestTimeoutMs,
				authProfileId: binding.authProfileId,
				...agentLookup
			};
			const client = await getLeasedSharedCodexAppServerClient(clientOptions);
			const clientLease = { client };
			let activeTurnId;
			let activeTurnCleanup = () => void 0;
			let isolatedSubscriptionClient;
			let turnRoute;
			let liveThreadOwnership;
			let ownsNativeSubscription = false;
			let turnSucceeded = false;
			const withCurrent = async (write) => {
				await assertCurrent();
				write();
			};
			const assertResumeInputAllowed = async () => {
				const { thread } = await client.request("thread/read", {
					threadId,
					includeTurns: false
				}, {
					timeoutMs: runtime.requestTimeoutMs,
					withCurrent
				});
				assertCodexThreadAcceptsDirectInput(thread);
			};
			try {
				if (!networkProxyBindingChanged && binding.clientId !== client.getInstanceId()) await assertResumeInputAllowed();
				if (!incognito && isCodexAppServerClientRuntimeLive(client)) {
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
				if (params.resumeThreadId || networkProxyBindingChanged || binding.clientId !== client.getInstanceId() || isCodexAppServerClientRuntimeLive(client) && !incognito && !liveThreadOwnership) {
					if (!networkProxyBindingChanged && binding.clientId === client.getInstanceId()) await assertResumeInputAllowed();
					const result = await withCodexAppServerClientRequestScope({
						lease: clientLease,
						options: clientOptions,
						run: async (requestClient, connectionRequestOptions) => {
							const requestOptions = () => {
								const options = connectionRequestOptions();
								return {
									...options,
									withCurrent: async (write) => {
										await assertCurrent();
										options.assertCurrent();
										write();
									}
								};
							};
							const threadRequest = await buildConversationThreadRequestForClient(requestClient, threadRequestRuntime, serviceTier, requestOptions);
							if (networkProxyBindingChanged) return await requestClient.request("thread/start", {
								...threadRequest,
								developerInstructions: CODEX_CONVERSATION_THREAD_DEVELOPER_INSTRUCTIONS,
								experimentalRawEvents: true,
								...incognito ? { ephemeral: true } : {}
							}, requestOptions());
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
						}
					});
					const response = networkProxyBindingChanged ? assertCodexThreadStartResponse(result) : result;
					threadId = response.thread.id;
					ownsNativeSubscription = true;
					assertCodexThreadAcceptsDirectInput(response.thread);
					if (networkProxyBindingChanged && liveThreadOwnership && (liveThreadOwnership.threadId !== threadId || liveThreadOwnership.client !== client)) {
						const previousOwnership = liveThreadOwnership;
						try {
							await previousOwnership.ownership.release(previousOwnership.threadId);
						} catch (error) {
							if (!(isCodexAppServerClientRuntimeLive(previousOwnership.client) && await retainCodexAppServerBindingSubscription(previousOwnership.client, previousOwnership.threadId, previousOwnership.ownership).catch(() => false))) await closeCodexStartupClientBestEffort(previousOwnership.client);
							liveThreadOwnership = void 0;
							throw error;
						}
						liveThreadOwnership = void 0;
					} else if (networkProxyBindingChanged ? binding.threadId !== threadId : !isSameCodexAppServerThreadOwner(binding, {
						threadId,
						clientId: client.getInstanceId()
					})) await releaseCodexAppServerBindingSubscription(binding, {
						withCurrent,
						retainedClientId: client.getInstanceId()
					});
					const patch = {
						...incognito ? { conversationIncognito: true } : {},
						clientId: client.getInstanceId(),
						cwd: response.thread.cwd ?? (networkProxyBindingChanged ? workspaceDir : binding.cwd),
						model: response.model ?? modelSelection?.model ?? binding.model,
						modelProvider: await normalizeCodexAppServerBindingModelProvider({
							authProfileId: binding.authProfileId,
							modelProvider: response.modelProvider ?? modelSelection?.modelProvider ?? binding.modelProvider,
							...agentLookup
						})
					};
					if (!await params.bindingStore.mutate(identity, networkProxyBindingChanged ? {
						kind: "set",
						binding: {
							threadId,
							...patch,
							authProfileId: binding.authProfileId,
							serviceTier: serviceTier ?? void 0,
							networkProxyProfileName: runtime.networkProxy?.profileName,
							networkProxyConfigFingerprint: runtime.networkProxy?.configFingerprint,
							conversationStartId: binding.conversationStartId,
							conversationSourceTransferComplete: binding.conversationSourceTransferComplete,
							historyCoveredThrough: binding.historyCoveredThrough
						}
					} : {
						kind: "patch",
						threadId: binding.threadId,
						patch
					}, source)) throw new Error(networkProxyBindingChanged ? "Codex conversation binding changed while rotating its thread." : "Codex conversation binding changed while resuming on a new client.");
					if (networkProxyBindingChanged) useStickyNetworkProfile = runtime.networkProxy !== void 0;
				} else if (incognito && !binding.conversationIncognito) {
					if (!await params.bindingStore.mutate(identity, {
						kind: "patch",
						threadId,
						patch: { conversationIncognito: true }
					}, source)) throw new Error("Codex conversation binding changed while recording its source lifecycle.");
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
					approvalsReviewer: runtime.approvalsReviewer,
					...useStickyNetworkProfile ? {} : { sandboxPolicy: codexSandboxPolicyForTurn(sandbox, sessionRoot ?? workspaceDir) },
					...modelSelection?.model ? { model: modelSelection.model } : {},
					personality: CODEX_NATIVE_PERSONALITY_NONE,
					...serviceTier ? { serviceTier } : {}
				}, {
					timeoutMs: runtime.requestTimeoutMs,
					withCurrent
				}).catch((error) => {
					if (!incognito && error instanceof CodexAppServerRpcError && error.method === "turn/start" && error.code === -32600 && error.message === `thread not found: ${threadId}`) throw new CodexConversationUnloadedThreadError(threadId, error);
					throw error;
				})).turn.id;
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
				return { text: replyText || "Codex completed without a text reply." };
			} catch (error) {
				if (params.resumeThreadId && isCodexThreadReadMissingError(error, threadId)) throw new Error("The bound Codex thread is unavailable. Your message was not submitted; rebind the conversation and resend it.", { cause: error });
				if (isCodexAppServerOverloadError(error) && error.method === "thread/resume") throw error;
				if (error instanceof CodexThreadDirectInputError) {
					if (incognito && ownsNativeSubscription) {
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
				if (incognito) {
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
					if (ownsNativeSubscription && isolatedSubscriptionClient !== client && !incognito && isCodexAppServerClientRuntimeLive(client)) {
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
		if (!(error instanceof CodexConversationUnloadedThreadError)) throw error;
		return await runBoundTurn({
			...params,
			resumeThreadId: error.threadId
		});
	}
}
//#endregion
export { runBoundTurnWithMissingThreadRecovery };
