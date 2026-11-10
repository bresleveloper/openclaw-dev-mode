import { n as flattenCodexDynamicToolFunctions, r as isJsonObject } from "./protocol-CaPAVwe9.mjs";
import { g as sessionBindingIdentity } from "./session-binding-record-BXXjih0v.mjs";
import { d as readCodexPluginConfig } from "./config-parsing-DsWSCPHO.mjs";
import { s as assertCodexModelBackedReviewerEffectiveConfig } from "./config-options-l737cwJB.mjs";
import { t as withCodexAppServerThreadMutation } from "./thread-ownership-queue-CeyYScUC.mjs";
import { i as CodexAppServerScopedRequestRejectedError, o as isCodexAppServerOverloadError } from "./rpc-error-CrpIS8O9.mjs";
import { a as readUpstreamUserText, i as readMirrorIdentity } from "./upstream-prompt-provenance-Ccd9MFRJ.mjs";
import { r as projectCodexUserItemText } from "./transcript-history-projection-i-FVpyha.mjs";
import { n as codexUpstreamBaseline, t as codexLastTerminalTurnId } from "./session-upstream-marker-D15C9NHp.mjs";
import { r as buildCodexPluginAppCacheKey } from "./plugin-app-cache-key-CKBEird9.mjs";
import { n as readCodexSessionMeta } from "./session-catalog-provenance-Dg9s12z-.mjs";
import "./request-i8njrYRU.mjs";
import { r as resolveOpenClawExecPolicyForCodexAppServer } from "./config-DEC5R1wk.mjs";
import { r as resolveCodexSupervisionAppServerRuntimeOptions } from "./config-runtime-Be4ZqerX.mjs";
import { l as readCodexMirrorSourceFingerprint, o as fingerprintCodexMirrorSourceMessage } from "./transcript-mirror-attestation-BzUXnrvv.mjs";
import { M as hasCodexAppServerLiveThread, O as claimCodexAppServerLiveThread, Q as wasCodexAppServerThreadClosed, l as readCodexAppServerClientDesktopGenerationFingerprint } from "./shared-client-BEHXwqz5.mjs";
import { f as assertCodexThreadAcceptsDirectInput, o as isCodexAppServerPrewriteRequestCancellationError, p as assertCodexThreadForkResponse } from "./client-CKexde4_.mjs";
import { n as CODEX_APP_SERVER_UNSUBSCRIBE_TIMEOUT_MS } from "./attempt-client-cleanup-CCBoNjA1.mjs";
import { d as mergeCodexThreadConfigs, i as buildCodexPluginThreadConfig, p as shouldBuildCodexPluginThreadConfig } from "./project-doc-thread-config-CH6QVPwq.mjs";
import { E as fingerprintJsonObject, O as fingerprintUserMcpServersConfigPatch, S as codexDynamicToolsFingerprint, a as buildCodexThreadConfiguration, h as resolveCodexWebSearchPlan, v as buildDeveloperInstructions } from "./thread-requests-AxL6-JUD.mjs";
import "./session-binding-2ihjGcI_.mjs";
import "./thread-ownership-D2aUUPS_.mjs";
import { i as resolveCodexNativeExecutionPolicy } from "./native-execution-policy-D09tLP-u.mjs";
import { n as CodexThreadPolicyHandoffError, o as refreshCodexThreadPolicy } from "./thread-policy-euNesaIC.mjs";
import { b as isCodexDynamicToolExcluded, f as codexNativeHookRemoteCredentialPath, i as buildCodexNativeHookRelayConfig, l as resolveCodexNativeHookRelayEvents, o as buildCodexNativeHookRelayId, r as assertCodexNativeHookRelayAllowed } from "./native-hook-relay-BjL_0CuH.mjs";
import { i as checkCodexThreadAppAvailability, l as parseCodexNativeToolCatalog, n as resolveCodexNativeSkillIsolation, t as applyCodexNativeSkillIsolation } from "./native-skill-isolation-I9pwA5O6.mjs";
import { c as prepareCodexWorkspaceDeveloperInstructions } from "./attempt-workspace-context-DB49mGbM.mjs";
import { n as resolveCodexProviderWebSearchSupportForClient } from "./provider-capabilities-DEpu9dJL.mjs";
import { n as prepareCodexSessionInitialization } from "./session-initialization-ofysoXPn.mjs";
import { createImportedCodexSession } from "./session-history-import-Dc1KgLf1.mjs";
import { isRecord, normalizeOptionalString, readNonBlankString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { resolveAgentWorkspaceDir } from "openclaw/plugin-sdk/agent-runtime";
import { embeddedAgentLog, loadCodexBundleMcpThreadConfig } from "openclaw/plugin-sdk/agent-harness-runtime";
import { loadExecApprovalsReadOnlyAsync } from "openclaw/plugin-sdk/exec-approvals-runtime";
import { resolveStorePath } from "openclaw/plugin-sdk/session-store-runtime";
import { appendSessionTranscriptMessagesByIdentity, readVisibleSessionTranscriptMessageEntries } from "openclaw/plugin-sdk/session-transcript-runtime";
import { buildCodexUserMcpServersThreadConfigPatchForRuntime, resolveCodexMcpToolOverridesForAgent } from "openclaw/plugin-sdk/codex-mcp-projection";
import { buildNativeHookRelayCommandPlan } from "openclaw/plugin-sdk/native-hook-relay-runtime";
//#region extensions/codex/src/app-server/canonical-fork-preparation.ts
/** Creation preserves native declarations; admitted turns own all live executors. */
async function prepareCanonicalCodexFork(params) {
	const { created, initialization, config, context } = params;
	const assertCurrent = initialization.assertCurrent;
	assertCurrent();
	if (!initialization.prepareNativeToolPolicy) throw new Error("Forking an OpenClaw Codex session requires host native tool policy preparation. Update the Gateway before retrying.");
	const workspaceDir = resolveAgentWorkspaceDir(config, created.agentId);
	const cwd = created.entry.spawnedCwd ?? workspaceDir;
	const execution = resolveCodexNativeExecutionPolicy({
		config,
		agentId: created.agentId,
		sessionKey: created.key,
		sessionEntry: created.entry
	});
	if (params.sandbox === "required" || !execution.nativeToolSurfaceAllowed || execution.effectiveExecHost !== "gateway" || context.appServer.remoteWorkspaceRoot) throw new Error("This child requires an execution environment that cannot be prepared during a native fork. Fork an original imported message instead.");
	const pluginConfig = readCodexPluginConfig(context.pluginConfig);
	const appServer = {
		...resolveCodexSupervisionAppServerRuntimeOptions({
			pluginConfig,
			config,
			agentDir: context.agentDir,
			model: params.model,
			modelProvider: params.modelProvider,
			execPolicy: resolveOpenClawExecPolicyForCodexAppServer({
				config,
				agentId: created.agentId,
				approvals: await loadExecApprovalsReadOnlyAsync()
			})
		}),
		start: context.appServer.start
	};
	const { webSearchAllowed: hostWebSearchAllowed } = await initialization.prepareNativeToolPolicy({
		provider: params.modelProvider,
		runtimeProvider: "codex",
		id: params.model
	});
	assertCurrent();
	const webSearchAllowed = hostWebSearchAllowed && !isCodexDynamicToolExcluded(pluginConfig, ["web_search"]);
	const dynamicTools = params.dynamicTools;
	const nativeProviderWebSearchSupport = await resolveCodexProviderWebSearchSupportForClient({
		client: context.client,
		timeoutMs: appServer.requestTimeoutMs,
		modelProviderOverride: params.modelProvider,
		signal: AbortSignal.timeout(appServer.requestTimeoutMs)
	});
	assertCurrent();
	const webSearch = resolveCodexWebSearchPlan({
		config,
		nativeToolSurfaceEnabled: true,
		nativeProviderWebSearchSupport,
		webSearchAllowed
	});
	const toolOverrides = resolveCodexMcpToolOverridesForAgent(config, {
		agentId: created.agentId,
		toolOverrides: created.entry.toolOverrides
	});
	const bundleMcp = await loadCodexBundleMcpThreadConfig({
		workspaceDir,
		agentId: created.agentId,
		cfg: config,
		toolOverrides,
		preparationOnly: true
	});
	assertCurrent();
	if (bundleMcp.diagnostics.length) throw new Error("The child's MCP configuration could not be prepared completely.");
	const userMcp = await buildCodexUserMcpServersThreadConfigPatchForRuntime(config, {
		agentId: created.agentId,
		agentDir: context.agentDir,
		toolOverrides,
		preparationOnly: true
	});
	assertCurrent();
	const apps = shouldBuildCodexPluginThreadConfig(pluginConfig) ? await buildCodexPluginThreadConfig({
		pluginConfig,
		configCwd: cwd,
		appCacheKey: buildCodexPluginAppCacheKey({
			appServer,
			agentDir: context.agentDir,
			runtimeIdentity: context.client.getRuntimeIdentity(),
			desktopGenerationFingerprint: readCodexAppServerClientDesktopGenerationFingerprint(context.client)
		}),
		request: async (method, requestParams) => {
			assertCurrent();
			if (![
				"plugin/list",
				"plugin/read",
				"plugin/installed",
				"app/list",
				"app/read",
				"app/installed",
				"config/read",
				"configRequirements/read"
			].includes(method)) throw new Error("Codex plugin setup is required before native fork preparation.");
			const response = await context.client.request(method, requestParams);
			assertCurrent();
			return response;
		}
	}) : void 0;
	assertCurrent();
	if (apps?.diagnostics.length) throw new Error("Codex app policy is not ready for a native fork. Complete plugin setup and retry.");
	const nativeSkillIsolation = await resolveCodexNativeSkillIsolation({
		client: context.client,
		cwd,
		codexHome: appServer.start.codexHome ?? appServer.start.env?.CODEX_HOME,
		home: appServer.start.env?.HOME,
		userProfile: appServer.start.env?.USERPROFILE
	});
	assertCurrent();
	const generation = randomUUID();
	const relayId = buildCodexNativeHookRelayId({
		agentId: created.agentId,
		sessionKey: created.key,
		sessionId: created.sessionId
	});
	const relay = buildNativeHookRelayCommandPlan({
		provider: "codex",
		agentId: created.agentId,
		sessionKey: created.key,
		config,
		relayId,
		generation,
		preToolUseLoopDetection: appServer.loopDetectionPreToolUseRelay
	});
	const events = resolveCodexNativeHookRelayEvents({ appServer });
	if (events.includes("pre_tool_use") && relay.shouldRelayEvent("pre_tool_use")) {
		await assertCodexNativeHookRelayAllowed(context.client);
		assertCurrent();
	}
	await assertCodexModelBackedReviewerEffectiveConfig({
		client: context.client,
		approvalsReviewer: appServer.approvalsReviewer,
		cwd
	});
	assertCurrent();
	const workspaceInstructions = await prepareCodexWorkspaceDeveloperInstructions({
		config,
		agentId: created.agentId,
		sessionKey: created.key,
		sessionId: created.sessionId,
		workspaceDir,
		cwd
	});
	assertCurrent();
	const promptContext = {
		config,
		agentId: created.agentId,
		sessionKey: created.key,
		modelId: params.model
	};
	const developerInstructions = [buildDeveloperInstructions(promptContext, {
		dynamicTools,
		nativeCodeModeOnlyEnabled: appServer.codeModeOnly
	}), workspaceInstructions].filter(Boolean).join("\n\n");
	const bundleConfig = bundleMcp.configPatch;
	if (bundleConfig && !isJsonObject(bundleConfig)) throw new Error("Invalid child MCP thread configuration");
	const threadConfig = applyCodexNativeSkillIsolation(mergeCodexThreadConfigs(bundleConfig, userMcp, apps?.configPatch, appServer.networkProxy?.configPatch, buildCodexNativeHookRelayConfig({
		relay,
		events,
		clearOmittedEvents: true,
		...appServer.nativeHookRelay ? { remoteCredentialPath: codexNativeHookRemoteCredentialPath(appServer.nativeHookRelay, relayId, generation) } : {}
	})), nativeSkillIsolation);
	return {
		request: buildCodexThreadConfiguration(promptContext, {
			cwd,
			appServer,
			dynamicTools,
			developerInstructions,
			config: threadConfig,
			nativeCodeModeEnabled: true,
			nativeCodeModeOnlyEnabled: appServer.codeModeOnly,
			nativeProviderWebSearchSupport,
			webSearchAllowed,
			hostSystemAgentActive: false
		}),
		provisionalAppIds: apps?.provisionalAppIds ?? [],
		bindingPolicy: {
			nativeHookRelayGeneration: generation,
			agentWorkspaceDeveloperInstructions: workspaceInstructions,
			networkProxyProfileName: appServer.networkProxy?.profileName,
			networkProxyConfigFingerprint: appServer.networkProxy?.configFingerprint,
			nativeSkillIsolationFingerprint: nativeSkillIsolation ? fingerprintJsonObject({
				version: 1,
				disabledUserSkillPaths: nativeSkillIsolation.disabledUserSkillPaths
			}) : void 0,
			userMcpServersFingerprint: fingerprintUserMcpServersConfigPatch(userMcp),
			mcpServersFingerprint: bundleMcp.fingerprint,
			webSearchThreadConfigFingerprint: fingerprintJsonObject(webSearch.threadConfig),
			pluginAppsFingerprint: apps?.fingerprint,
			pluginAppsInputFingerprint: apps?.inputFingerprint,
			pluginAppPolicyContext: apps?.policyContext
		}
	};
}
//#endregion
//#region extensions/codex/src/app-server/upstream-fork-boundary.ts
const IN_PROGRESS_TURN_MESSAGE = "This Codex turn is still in progress. Wait for it to finish, then try forking again.";
const TURN_PAGE_LIMIT = 100;
function failure(code, message) {
	return {
		ok: false,
		code,
		message
	};
}
function textOnlyMessage(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return;
	const texts = [];
	for (const block of content) {
		if (!isRecord(block) || block.type !== "text" || typeof block.text !== "string") return;
		texts.push(block.text);
	}
	return texts.join("\n");
}
function resolveCodexUpstreamForkBoundaryFromTurns(params) {
	let localIndex = 0;
	let matchedPrefix = false;
	for (const [turnIndex, turn] of params.turns.entries()) {
		let userMessagesInTurn = 0;
		for (const item of turn.items) {
			if (item.type !== "userMessage") continue;
			const isSteer = userMessagesInTurn > 0;
			userMessagesInTurn += 1;
			const local = params.localPrefix[localIndex];
			const identity = local && readMirrorIdentity(local.message);
			const matchesIdentity = identity === `${turn.id}:${item.id}` || !isSteer && identity === `${turn.id}:prompt`;
			if (!matchedPrefix && !matchesIdentity) continue;
			const nativeText = textOnlyMessage(item.content);
			if (nativeText === void 0) return failure("drift-mismatch", "A message before the fork point contains images or attachments that cannot be verified across OpenClaw and Codex. Fork from a text-only span instead.");
			const upstreamText = local && readUpstreamUserText(local.message);
			const text = upstreamText ? nativeText : projectCodexUserItemText(item);
			if (!text) continue;
			matchedPrefix = true;
			const localText = textOnlyMessage(local && "content" in local.message ? local.message.content : void 0);
			const upstreamPromptVerified = !upstreamText || local?.message.role === "user" && readCodexMirrorSourceFingerprint(local.message) === fingerprintCodexMirrorSourceMessage(local.message);
			if (!matchesIdentity || !upstreamPromptVerified || localText === void 0 || text !== (upstreamText ?? localText)) return failure("drift-mismatch", "The local conversation no longer matches the Codex thread. Refresh the session and try again.");
			if (localIndex < params.localPrefix.length - 1) {
				localIndex += 1;
				continue;
			}
			if (isSteer) return failure("steer-message", "This message steered an existing Codex turn and cannot be forked independently. Fork from the turn's first message instead.");
			if (turn.status === "inProgress") return failure("in-progress-turn", IN_PROGRESS_TURN_MESSAGE);
			const retained = turnIndex > 0 ? params.turns[turnIndex - 1] : void 0;
			return {
				ok: true,
				boundary: {
					beforeTurnId: turn.id,
					lastRetainedTurnId: retained?.id ?? null
				}
			};
		}
	}
	return failure("drift-mismatch", "The local history has no verified boundary in this Codex thread. Use native Codex to fork this conversation.");
}
async function listCodexUpstreamTurns(control, threadId) {
	const turns = [];
	const seenCursors = /* @__PURE__ */ new Set();
	let cursor;
	for (;;) {
		const page = await control.listTurnPage({
			threadId,
			limit: TURN_PAGE_LIMIT,
			sortDirection: "asc",
			itemsView: "full",
			...cursor ? { cursor } : {}
		});
		turns.push(...page.data);
		const nextCursor = page.nextCursor?.trim() || void 0;
		if (!nextCursor) return turns;
		if (seenCursors.has(nextCursor)) throw new Error("Codex returned a repeated thread/turns/list cursor");
		seenCursors.add(nextCursor);
		cursor = nextCursor;
	}
}
async function resolveCodexUpstreamForkBoundary(params) {
	try {
		const entries = await readVisibleSessionTranscriptMessageEntries({
			agentId: params.agentId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		});
		const visibleUserEntries = entries.filter((entry) => entry.role === "user");
		const targetIndex = visibleUserEntries.findIndex((entry) => entry.entryId === params.entryId);
		if (targetIndex < 0) return failure("drift-mismatch", "The local message could not be mapped to the Codex thread. Refresh the session and try again.");
		const target = visibleUserEntries[targetIndex];
		const isOriginal = (entry) => {
			const identity = readMirrorIdentity(entry.message);
			return Boolean(identity && "idempotencyKey" in entry.message && entry.message.idempotencyKey === `codex-app-server:${params.threadId}:history:${identity}` && readCodexMirrorSourceFingerprint(entry.message));
		};
		const canonical = Boolean(params.canonicalThreadId && !isOriginal(target));
		const threadId = canonical ? params.canonicalThreadId : params.threadId;
		const thread = await params.control.readThread(threadId, false);
		if (thread.id !== threadId) return failure("upstream-unavailable", "This Codex thread is unavailable or its identity changed.");
		assertCodexThreadAcceptsDirectInput(thread);
		if (thread.status?.type === "active") return failure("in-progress-turn", "This Codex thread is active. Wait for it to finish before forking.");
		const localPrefix = visibleUserEntries.slice(0, targetIndex + 1).filter((entry) => {
			if (!canonical) return true;
			if (isOriginal(entry)) return false;
			const meta = "__openclaw" in entry.message ? entry.message["__openclaw"] : void 0;
			const blocked = isRecord(meta) ? meta.beforeAgentRunBlocked : void 0;
			return !(entry !== target && isRecord(blocked) && typeof blocked.blockedBy === "string" && typeof blocked.blockedAt === "number");
		});
		const turns = await listCodexUpstreamTurns(params.control, threadId);
		const resolved = resolveCodexUpstreamForkBoundaryFromTurns({
			turns,
			localPrefix
		});
		const displayPrefix = (canonical ? entries.slice(0, entries.indexOf(target) + 1) : []).slice(0, -1);
		if (canonical && (displayPrefix.length > 200 || Buffer.byteLength(JSON.stringify(displayPrefix)) > 524288)) return failure("upstream-unavailable", "The local display prefix exceeds the safe fork-copy limit. Use native Codex to fork this conversation.");
		return resolved.ok ? {
			...resolved,
			editorText: textOnlyMessage("content" in target.message ? target.message.content : void 0),
			...canonical ? { canonical: {
				thread,
				turns,
				prefix: displayPrefix
			} } : {}
		} : resolved;
	} catch {
		return failure("upstream-unavailable", "The Codex thread could not be read. Check that Codex is available, then try again.");
	}
}
//#endregion
//#region extensions/codex/src/app-server/canonical-session-fork.ts
/** Resolves once the connection closes the thread or exits; both drop its writer lock. */
function waitForCodexForkUnload(client, threadId) {
	return new Promise((resolve) => {
		const finish = (unloaded) => {
			clearTimeout(timer);
			stopNotifications();
			stopClose();
			resolve(unloaded);
		};
		const timer = setTimeout(() => finish(false), CODEX_APP_SERVER_UNSUBSCRIBE_TIMEOUT_MS);
		const stopNotifications = client.addNotificationHandler((notification) => {
			if (notification.method === "thread/closed" && isJsonObject(notification.params) && notification.params.threadId === threadId) finish(true);
		});
		const stopClose = client.addCloseHandler(() => finish(true));
		if (wasCodexAppServerThreadClosed(client, threadId) || client.getCloseError()) finish(true);
	});
}
/** Native history stays native; only the verified local display prefix is copied. */
async function forkCanonicalCodexSession(params) {
	const { fork, resolved, control, bindingStore, sourceBinding, config } = params;
	const context = control.forkContext;
	if (!context?.localSessionsRoot || !resolved.canonical.thread.path) throw new Error("Forking an OpenClaw Codex session requires the verified local rollout on its selected connection. Fork an original imported message instead.");
	const model = normalizeOptionalString(resolved.canonical.thread.model);
	const modelProvider = normalizeOptionalString(resolved.canonical.thread.modelProvider);
	if (!model || !modelProvider) throw new Error("Codex did not report the source thread's model selection. Use Codex 0.153.0 or newer, or fork an original imported message instead.");
	const sourceIdentity = sessionBindingIdentity({
		...fork.source,
		config
	});
	return bindingStore.withLease(sourceIdentity, async () => {
		if (!isDeepStrictEqual(bindingStore.read(sourceIdentity), sourceBinding)) throw new Error("Codex source binding changed before initialization");
		let freshThreadId;
		let ownership;
		let ownershipTransferred = false;
		let policyWriteUncertain = false;
		return {
			status: "created",
			key: (await params.runtime.agent.session.createSessionEntry({
				cfg: config,
				key: fork.targetKey,
				agentId: fork.source.agentId,
				spawnedCwd: resolved.canonical.thread.cwd ?? sourceBinding.cwd,
				initialEntry: {
					agentHarnessId: params.harnessRuntimeId,
					modelSelectionLocked: true
				},
				afterCreate: async (created) => {
					if (!created.initialization) throw new Error("Forking an OpenClaw Codex session requires host creation authority");
					const host = created.initialization;
					const initialization = prepareCodexSessionInitialization({
						initialization: host,
						bindingStore,
						identity: sessionBindingIdentity({
							agentId: created.agentId,
							sessionId: created.sessionId,
							sessionKey: created.key,
							config
						}),
						assertCleanupAllowed: () => {
							if (policyWriteUncertain) throw new Error("Fresh Codex policy delivery is uncertain; cleanup could not be verified. Inspect the retained thread before retrying.");
						},
						prepareCleanup: () => async (assertCurrent) => {
							if (!freshThreadId) return;
							const threadId = freshThreadId;
							await withCodexAppServerThreadMutation(threadId, async () => {
								assertCurrent();
								if (!ownershipTransferred) {
									if (!ownership) throw new Error("The fresh Codex fork has no verified subscription owner; inspect it before retrying.");
									ownership.assertCurrent();
								}
								if (await bindingStore.hasOtherThreadOwner(threadId)) throw new Error("Codex fork cleanup refused: a successor owns the native thread");
								assertCurrent();
								try {
									await control.archiveThread(threadId, assertCurrent);
								} catch (cause) {
									control.retireConnection?.();
									throw new Error("Fresh Codex fork cleanup could not be verified; inspect the retained thread before retrying.", { cause });
								}
								ownershipTransferred = true;
								assertCurrent();
							});
						}
					});
					const assertCurrent = () => {
						fork.assertCurrent();
						initialization.assertCurrent();
						if (ownership && !ownershipTransferred) ownership.assertCurrent();
					};
					const metadata = await readCodexSessionMeta(context.localSessionsRoot, resolved.canonical.thread.path.replace(/\.zst$/, ""), sourceBinding.threadId, { canonicalSource: true });
					assertCurrent();
					if (!metadata) throw new Error("The source Codex rollout metadata could not be verified");
					if (!sourceBinding.dynamicToolsFingerprint) throw new Error("The source session has no verified native catalog binding");
					const sourceCatalog = parseCodexNativeToolCatalog(metadata, sourceBinding.threadId, sourceBinding.dynamicToolsFingerprint);
					const prepared = await prepareCanonicalCodexFork({
						created,
						initialization: host,
						config,
						context,
						model,
						modelProvider,
						sandbox: fork.sandbox,
						dynamicTools: sourceCatalog
					});
					assertCurrent();
					if (!isDeepStrictEqual(bindingStore.read(sourceIdentity), sourceBinding)) throw new Error("Codex source binding changed during preparation");
					assertCurrent();
					let raw;
					try {
						raw = await control.forkThread({
							...prepared.request,
							config: {
								...prepared.request.config,
								thread_unload_delay_secs: 0
							},
							threadId: sourceBinding.threadId,
							beforeTurnId: resolved.boundary.beforeTurnId,
							model,
							modelProvider,
							threadSource: "appServer",
							excludeTurns: true
						}, assertCurrent);
					} catch (error) {
						if (!(error instanceof CodexAppServerScopedRequestRejectedError)) control.retireConnection?.();
						throw error;
					}
					let response;
					try {
						response = assertCodexThreadForkResponse(raw);
						if (!response.thread.id.trim() || response.thread.id === sourceBinding.threadId || response.thread.id === fork.upstream.threadId || response.thread.forkedFromId !== sourceBinding.threadId || await bindingStore.hasOtherThreadOwner(response.thread.id)) throw new Error("Codex fork returned an unsafe native thread identity");
					} catch (error) {
						control.retireConnection?.();
						throw error;
					}
					freshThreadId = response.thread.id;
					ownership = await claimCodexAppServerLiveThread(context.client, freshThreadId);
					if (!ownership) {
						control.retireConnection?.();
						throw new Error("Codex fork subscription ownership could not be acquired");
					}
					assertCurrent();
					if (response.model !== model || response.thread.model !== model || response.modelProvider !== modelProvider || response.thread.modelProvider !== modelProvider) throw new Error("Codex fork did not preserve the exact source session and selected native model");
					const turns = await listCodexUpstreamTurns(control, freshThreadId);
					assertCurrent();
					const cut = resolved.canonical.turns.findIndex((turn) => turn.id === resolved.boundary.beforeTurnId);
					if (cut < 0 || !isDeepStrictEqual(turns, resolved.canonical.turns.slice(0, cut))) throw new Error("Codex did not apply the exact beforeTurnId cut. Reconnect to a compatible server and retry.");
					const childMetadata = response.thread.path ? await readCodexSessionMeta(context.localSessionsRoot, response.thread.path, freshThreadId) : void 0;
					assertCurrent();
					if (!childMetadata || childMetadata.model_provider !== modelProvider) throw new Error("The fresh Codex fork metadata could not be verified");
					const childCatalog = parseCodexNativeToolCatalog(childMetadata, freshThreadId);
					if (!isDeepStrictEqual(sourceCatalog, childCatalog)) throw new Error("Codex fork did not preserve the actual native tool catalog");
					await checkCodexThreadAppAvailability({
						client: context.client,
						threadId: freshThreadId,
						appIds: prepared.provisionalAppIds
					});
					assertCurrent();
					try {
						await refreshCodexThreadPolicy({
							client: context.client,
							threadId: freshThreadId,
							developerInstructions: prepared.request.developerInstructions,
							timeoutMs: context.appServer.requestTimeoutMs,
							assertCurrent
						});
					} catch (error) {
						if (error instanceof CodexThreadPolicyHandoffError && error.outcome === "unknown") {
							policyWriteUncertain = true;
							control.retireConnection?.();
						}
						throw error;
					}
					await appendSessionTranscriptMessagesByIdentity({
						config,
						storePath: resolveStorePath(config.session?.store, { agentId: created.agentId }),
						agentId: created.agentId,
						sessionKey: created.key,
						sessionId: created.sessionId,
						messages: resolved.canonical.prefix.map((entry) => ({
							message: entry.message,
							idempotencyLookup: "scan"
						}))
					});
					assertCurrent();
					await initialization.linkAsync({
						sessionKey: created.key,
						agentId: created.agentId,
						catalogId: fork.upstream.catalogId,
						hostId: fork.upstream.hostId,
						threadId: fork.upstream.threadId,
						upstreamKind: fork.upstream.kind,
						upstreamRef: fork.upstream.ref,
						marker: codexUpstreamBaseline({
							...response.thread,
							turns
						}, normalizeOptionalString)
					});
					await initialization.bind({
						threadId: freshThreadId,
						connectionScope: "supervision",
						supervisionSourceThreadId: fork.upstream.threadId,
						preserveNativeModel: true,
						conversationSourceTransferComplete: true,
						cwd: prepared.request.cwd ?? "",
						rolloutPath: response.thread.path ?? void 0,
						model,
						modelProvider,
						appServerRuntimeFingerprint: control.connectionFingerprint,
						dynamicToolsFingerprint: codexDynamicToolsFingerprint(childCatalog),
						dynamicToolsContainDeferred: flattenCodexDynamicToolFunctions(childCatalog).some((tool) => tool.deferLoading === true),
						...prepared.bindingPolicy,
						historyCoveredThrough: (/* @__PURE__ */ new Date()).toISOString()
					});
					assertCurrent();
					const unloaded = waitForCodexForkUnload(context.client, freshThreadId);
					await ownership.release(freshThreadId, () => {
						fork.assertCurrent();
						initialization.assertCurrent();
					});
					ownershipTransferred = true;
					if (!await unloaded) embeddedAgentLog.warn("codex canonical fork did not unload before readiness", { threadId: freshThreadId });
					initialization.assertCurrent();
					if (!isDeepStrictEqual(bindingStore.read(sourceIdentity), sourceBinding)) throw new Error("Codex source binding changed before fork readiness");
					initialization.assertCurrent();
					return { pluginExtensions: created.entry.pluginExtensions };
				}
			}).finally(() => {
				if (freshThreadId && !ownershipTransferred && hasCodexAppServerLiveThread(context.client, freshThreadId)) control.retireConnection?.();
			})).key,
			...resolved.editorText !== void 0 ? { editorText: resolved.editorText } : {}
		};
	});
}
//#endregion
//#region extensions/codex/src/app-server/upstream-session-fork.ts
const UNAVAILABLE_CONNECTION_MESSAGE = "This Codex thread is not available on the current connection. Reconnect to its host and try again.";
function unavailable(message) {
	return {
		status: "failed",
		code: "upstream-unavailable",
		message
	};
}
async function forkCodexUpstreamSession(params, options) {
	try {
		const sourceFingerprint = params.upstream.kind === "codex-app-server" && isRecord(params.upstream.ref) ? readNonBlankString(params.upstream.ref.connectionFingerprint) : void 0;
		const requestControl = sourceFingerprint ? await options.controlFactory.forUpstream(params.source.agentId, sourceFingerprint) : void 0;
		if (!sourceFingerprint || !requestControl) return unavailable(UNAVAILABLE_CONNECTION_MESSAGE);
		return await requestControl.withPinnedConnection(async (control) => {
			const sourceBinding = await options.bindingStore.readAsync(sessionBindingIdentity({
				...params.source,
				config: options.resolveConfig?.()
			}));
			const supervised = sourceBinding?.connectionScope === "supervision";
			const sourceThreadId = params.upstream.threadId;
			let initializerOwnsFork = false;
			const archiveFreshFork = async (forkedThreadId, assertCurrent) => withCodexAppServerThreadMutation(forkedThreadId, async () => {
				assertCurrent?.();
				if (await options.bindingStore.hasOtherThreadOwner(forkedThreadId)) throw new Error("Codex fork cleanup refused: the native thread has another owner");
				assertCurrent?.();
				try {
					await control.archiveThread(forkedThreadId, assertCurrent);
					assertCurrent?.();
				} catch (cause) {
					control.retireConnection?.();
					throw new Error("Codex fork cleanup could not be verified; inspect the retained native thread before retrying.", { cause });
				}
			});
			if (sourceFingerprint !== control.connectionFingerprint || supervised && (sourceBinding.supervisionSourceThreadId !== params.upstream.threadId || (sourceBinding.pendingSupervisionBranch?.connectionFingerprint ?? sourceBinding.appServerRuntimeFingerprint) !== sourceFingerprint)) return unavailable(UNAVAILABLE_CONNECTION_MESSAGE);
			const resolved = await resolveCodexUpstreamForkBoundary({
				...params.source,
				threadId: sourceThreadId,
				canonicalThreadId: supervised && !sourceBinding.pendingSupervisionBranch ? sourceBinding.threadId : void 0,
				control
			});
			if (!resolved.ok) return {
				status: "failed",
				code: resolved.code,
				message: resolved.message
			};
			if (resolved.canonical && sourceBinding) return await forkCanonicalCodexSession({
				fork: params,
				resolved: {
					...resolved,
					canonical: resolved.canonical
				},
				sourceBinding,
				control,
				bindingStore: options.bindingStore,
				runtime: options.runtime,
				harnessRuntimeId: options.harnessRuntimeId,
				config: options.resolveConfig?.() ?? {}
			});
			let response;
			let threadId;
			try {
				const rawResponse = await control.forkThread({
					threadId: sourceThreadId,
					beforeTurnId: resolved.boundary.beforeTurnId,
					...params.sandbox === "required" ? { sandbox: "workspace-write" } : {},
					excludeTurns: true
				}, params.assertCurrent);
				response = assertCodexThreadForkResponse(rawResponse);
				threadId = response.thread.id.trim();
				if (!threadId) throw new Error("Codex thread/fork response did not include a thread id");
				if (threadId === sourceThreadId || threadId === sourceBinding?.threadId) throw new Error("Codex thread/fork response reused the source thread id");
			} catch (error) {
				if (!(error instanceof CodexAppServerScopedRequestRejectedError) && !isCodexAppServerPrewriteRequestCancellationError(error) && !isCodexAppServerOverloadError(error)) control.retireConnection?.();
				throw error;
			}
			const forkedThreadId = threadId;
			try {
				const connectionFingerprint = normalizeOptionalString(control.connectionFingerprint);
				if (!connectionFingerprint) throw new Error("Codex fork connection did not include a fingerprint");
				const forkedTurns = await listCodexUpstreamTurns(control, threadId);
				const expectedLastTurnId = resolved.boundary.lastRetainedTurnId;
				if ((forkedTurns.at(-1)?.id ?? null) !== expectedLastTurnId) throw new Error("This Codex version does not support message-level forks. Update Codex, reconnect, and try again.");
				const forkedThread = {
					...response.thread,
					turns: forkedTurns
				};
				const throughTurnId = codexLastTerminalTurnId(forkedThread, normalizeOptionalString) ?? null;
				const marker = codexUpstreamBaseline(forkedThread, normalizeOptionalString);
				const config = options.resolveConfig?.() ?? {};
				return {
					status: "created",
					key: (await createImportedCodexSession({
						runtime: options.runtime,
						bindingStore: options.bindingStore,
						prepareCleanup: () => {
							initializerOwnsFork = true;
							return (assertCurrent) => archiveFreshFork(forkedThreadId, assertCurrent);
						},
						config,
						key: params.targetKey,
						agentId: params.source.agentId,
						thread: forkedThread,
						throughTurnId,
						initialEntry: {
							agentHarnessId: options.harnessRuntimeId,
							modelSelectionLocked: true
						},
						afterImport: async (entry, initialization) => {
							await initialization.linkAsync({
								sessionKey: entry.key,
								agentId: entry.agentId,
								catalogId: params.upstream.catalogId,
								hostId: params.upstream.hostId,
								threadId,
								upstreamKind: params.upstream.kind,
								upstreamRef: {
									connectionFingerprint,
									threadId
								},
								marker
							});
							await initialization.bind({
								threadId,
								connectionScope: "supervision",
								supervisionSourceThreadId: threadId,
								preserveNativeModel: true,
								conversationSourceTransferComplete: true,
								pendingSupervisionBranch: {
									sourceThreadId: threadId,
									connectionFingerprint,
									...throughTurnId ? { lastTurnId: throughTurnId } : {}
								},
								cwd: forkedThread.cwd ?? "",
								model: response.model,
								modelProvider: response.modelProvider ?? void 0,
								historyCoveredThrough: (/* @__PURE__ */ new Date()).toISOString()
							});
							return { pluginExtensions: entry.entry.pluginExtensions };
						}
					})).key,
					...resolved.editorText !== void 0 ? { editorText: resolved.editorText } : {}
				};
			} catch (error) {
				if (!initializerOwnsFork) await options.bindingStore.withThreadArchiveFence(() => archiveFreshFork(forkedThreadId));
				return unavailable(error instanceof Error ? error.message : "The Codex fork could not be imported. Refresh sessions and try again.");
			}
		});
	} catch (error) {
		return unavailable(error instanceof Error ? error.message : "The Codex thread could not be forked. Check that Codex is available, then try again.");
	}
}
//#endregion
export { forkCodexUpstreamSession };
