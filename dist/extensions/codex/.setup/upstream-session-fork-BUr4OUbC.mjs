import { m as sessionBindingIdentity } from "./session-binding-record-BGoz8wOK.mjs";
import { d as readCodexPluginConfig } from "./config-parsing-CcB9iPoq.mjs";
import { i as isJsonObject, r as flattenCodexDynamicToolFunctions } from "./protocol-CANUwXJ3.mjs";
import { s as assertCodexModelBackedReviewerEffectiveConfig } from "./config-options-BvaRs51b.mjs";
import { o as readCodexSessionMeta } from "./session-catalog-events-Bj6j94E_.mjs";
import { n as withCodexAppServerThreadMutation } from "./incognito-session-uhrBF6wJ.mjs";
import { i as readUpstreamUserText, r as readMirrorIdentity } from "./upstream-prompt-provenance-LphB8slG.mjs";
import { i as projectCodexUserItemText } from "./transcript-history-projection-ZZpkFkJ_.mjs";
import { n as codexUpstreamBaseline, t as codexLastTerminalTurnId } from "./session-upstream-marker-D15C9NHp.mjs";
import { r as buildCodexPluginAppCacheKey } from "./plugin-app-cache-key-B2CsSdnV.mjs";
import { t as CodexAppServerScopedRequestRejectedError } from "./request-D2L0zMrq.mjs";
import { n as resolveOpenClawExecPolicyForCodexAppServer } from "./config-BoTP_mrL.mjs";
import { r as resolveCodexSupervisionAppServerRuntimeOptions } from "./config-runtime-C8Rw1m1m.mjs";
import { a as fingerprintCodexMirrorSourceMessage, c as readCodexMirrorSourceFingerprint } from "./transcript-mirror-attestation-CzM-94NC.mjs";
import { I as hasCodexAppServerLiveThread, M as claimCodexAppServerLiveThread, f as readCodexAppServerClientDesktopGenerationFingerprint } from "./shared-client-DA4VR4Eb.mjs";
import { l as isCodexAppServerOverloadError, u as isCodexAppServerPrewriteRequestCancellationError, v as assertCodexThreadAcceptsDirectInput, y as assertCodexThreadForkResponse } from "./client-Cs08OXVQ.mjs";
import { B as parseCodexNativeToolCatalog, Ct as shouldBuildCodexPluginThreadConfig, E as buildCodexNativeHookRelayConfig, F as checkCodexThreadAppAvailability, H as resolveCodexNativeSkillIsolation, K as codexDynamicToolsFingerprint, O as buildCodexNativeHookRelayId, T as assertCodexNativeHookRelayAllowed, V as applyCodexNativeSkillIsolation, X as fingerprintJsonObject, Z as fingerprintUserMcpServersConfigPatch, a as buildCodexThreadConfiguration, j as resolveCodexNativeHookRelayEvents, m as buildDeveloperInstructions, mt as buildCodexPluginThreadConfig, p as resolveCodexWebSearchPlan, xt as mergeCodexThreadConfigs } from "./thread-requests-BLvGkP2R.mjs";
import "./session-binding-Cm0apEbd.mjs";
import { a as refreshCodexThreadPolicy, n as CodexThreadPolicyHandoffError } from "./thread-policy-DGuQsuFC.mjs";
import "./thread-ownership-DcTtAcXj.mjs";
import { n as resolveCodexNativeExecutionPolicy } from "./native-execution-policy-umd0tgh4.mjs";
import { d as isCodexDynamicToolExcluded, n as resolveCodexProviderWebSearchSupportForClient } from "./provider-capabilities-BfE88FZ5.mjs";
import { u as prepareCodexWorkspaceDeveloperInstructions } from "./attempt-workspace-context-DUVEn_CS.mjs";
import { n as prepareCodexSessionInitialization } from "./session-initialization-rcgbZiid.mjs";
import { createImportedCodexSession } from "./session-history-import-D-3wAgOP.mjs";
import { isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import { lstat } from "node:fs/promises";
import { root } from "openclaw/plugin-sdk/file-access-runtime";
import { constants, createZstdDecompress } from "node:zlib";
import { resolveAgentWorkspaceDir } from "openclaw/plugin-sdk/agent-runtime";
import { loadCodexBundleMcpThreadConfig } from "openclaw/plugin-sdk/agent-harness-runtime";
import { loadExecApprovals } from "openclaw/plugin-sdk/exec-approvals-runtime";
import { resolveStorePath } from "openclaw/plugin-sdk/session-store-runtime";
import { buildCodexUserMcpServersThreadConfigPatchForRuntime, resolveCodexMcpToolOverridesForAgent } from "openclaw/plugin-sdk/codex-mcp-projection";
import { buildNativeHookRelayCommandPlan } from "openclaw/plugin-sdk/native-hook-relay-runtime";
import { appendSessionTranscriptMessagesByIdentity, readVisibleSessionTranscriptMessageEntries } from "openclaw/plugin-sdk/session-transcript-runtime";
//#region extensions/codex/src/session-rollout-snapshot.ts
const CHUNK_BYTES = 65536;
const META_BYTES = 1048576;
const COMPRESSED_BYTES = 8388608;
const DEADLINE_MS = 5e3;
const utf8Decoder = new TextDecoder("utf-8", { fatal: true });
function parseMetadata(line, threadId) {
	const parsed = JSON.parse(utf8Decoder.decode(line));
	if (!isRecord(parsed) || parsed.type !== "session_meta" || !isRecord(parsed.payload) || parsed.payload.id !== threadId) throw new Error("Codex rollout does not belong to the bound thread");
	return parsed.payload;
}
/** Read immutable metadata while pinning the entire rollout against concurrent writers. */
async function readCodexRolloutSnapshot(params) {
	const deadline = Date.now() + DEADLINE_MS;
	const check = () => {
		params.assertCurrent();
		if (Date.now() >= deadline) throw new Error("Codex rollout metadata observation timed out");
	};
	check();
	const rootStat = await lstat(params.sessionsRoot);
	if (!rootStat.isDirectory() || rootStat.isSymbolicLink()) throw new Error("Codex rollout root is not a verified local directory");
	const safeRoot = await root(params.sessionsRoot, {
		hardlinks: "reject",
		symlinks: "reject",
		maxBytes: Number.MAX_SAFE_INTEGER
	});
	const plain = params.rolloutPath.endsWith(".zst") ? params.rolloutPath.slice(0, -4) : params.rolloutPath;
	let selected = plain;
	let opened;
	try {
		opened = await safeRoot.open(path.relative(params.sessionsRoot, selected));
	} catch (error) {
		if (!isRecord(error) || error.code !== "not-found" && error.code !== "ENOENT") throw error;
		selected = `${plain}.zst`;
		opened = await safeRoot.open(path.relative(params.sessionsRoot, selected));
	}
	try {
		check();
		const snapshot = opened.stat;
		const unchanged = (stat) => stat.dev === snapshot.dev && stat.ino === snapshot.ino && stat.size === snapshot.size && stat.mtimeMs === snapshot.mtimeMs && stat.ctimeMs === snapshot.ctimeMs && stat.nlink === 1;
		if (!snapshot.size) throw new Error("Codex rollout metadata is incomplete");
		const compressed = selected.endsWith(".zst");
		if (compressed && snapshot.size > COMPRESSED_BYTES) throw new Error("Compressed Codex rollout exceeds the observation limit");
		const input = opened.handle.createReadStream({
			autoClose: false,
			highWaterMark: CHUNK_BYTES,
			end: snapshot.size - 1
		});
		const decoder = compressed ? createZstdDecompress({
			chunkSize: CHUNK_BYTES,
			params: { [constants.ZSTD_d_windowLogMax]: 25 }
		}) : void 0;
		if (decoder) {
			input.on("error", (error) => decoder.destroy(error));
			input.pipe(decoder);
		}
		const reader = decoder ?? input;
		const timer = setTimeout(() => reader.destroy(/* @__PURE__ */ new Error("Codex rollout metadata observation timed out")), Math.max(1, deadline - Date.now()));
		let metadata;
		const chunks = [];
		let total = 0;
		try {
			for await (const chunk of reader) {
				check();
				const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
				const newline = bytes.indexOf(10);
				const prefix = newline < 0 ? bytes : bytes.subarray(0, newline);
				total += prefix.length;
				if (total > META_BYTES) throw new Error("Codex rollout metadata exceeds the observation limit");
				chunks.push(prefix);
				if (newline >= 0) {
					metadata = parseMetadata(Buffer.concat(chunks), params.threadId);
					if (!unchanged(await opened.handle.stat())) throw new Error("Codex rollout changed during metadata observation");
					break;
				}
			}
		} finally {
			clearTimeout(timer);
			reader.destroy();
			input.destroy();
		}
		if (!metadata) throw new Error("Codex rollout metadata is incomplete");
		const assertUnchanged = async () => {
			params.assertCurrent();
			if (selected !== plain) {
				try {
					await lstat(plain);
				} catch (error) {
					if (!isRecord(error) || error.code !== "ENOENT") throw error;
					return await verifySelected();
				}
				throw new Error("Codex rollout selection changed during metadata observation");
			}
			await verifySelected();
		};
		const verifySelected = async () => {
			params.assertCurrent();
			const currentRoot = await lstat(params.sessionsRoot);
			const fresh = await safeRoot.open(path.relative(params.sessionsRoot, selected));
			try {
				const stat = fresh.stat;
				if (!unchanged(stat) || currentRoot.isSymbolicLink() || currentRoot.ino !== rootStat.ino || currentRoot.dev !== rootStat.dev) throw new Error("Codex rollout changed during metadata observation");
			} finally {
				await fresh.handle.close();
			}
			params.assertCurrent();
		};
		await assertUnchanged();
		check();
		return {
			metadata,
			assertUnchanged
		};
	} finally {
		await opened.handle.close();
	}
}
//#endregion
//#region extensions/codex/src/app-server/canonical-fork-preparation.ts
/** Creation preserves native declarations; admitted turns own all live executors. */
async function prepareCanonicalCodexFork(params) {
	const { created, initialization, config, context } = params;
	const assertCurrent = initialization.assertCurrent;
	assertCurrent();
	if (!initialization.prepareNativeToolPolicy) throw new Error("Canonical Codex forks require host native tool policy preparation. Update the Gateway before retrying.");
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
				approvals: loadExecApprovals()
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
	const relay = buildNativeHookRelayCommandPlan({
		provider: "codex",
		agentId: created.agentId,
		sessionKey: created.key,
		config,
		relayId: buildCodexNativeHookRelayId({
			agentId: created.agentId,
			sessionKey: created.key,
			sessionId: created.sessionId
		}),
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
	const developerInstructions = [buildDeveloperInstructions(promptContext, { dynamicTools }), workspaceInstructions].filter(Boolean).join("\n\n");
	const bundleConfig = bundleMcp.configPatch;
	if (bundleConfig && !isJsonObject(bundleConfig)) throw new Error("Invalid child MCP thread configuration");
	const threadConfig = applyCodexNativeSkillIsolation(mergeCodexThreadConfigs(bundleConfig, userMcp, apps?.configPatch, appServer.networkProxy?.configPatch, buildCodexNativeHookRelayConfig({
		relay,
		events,
		clearOmittedEvents: true
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
		if (!block || typeof block !== "object" || Array.isArray(block)) return;
		const typed = block;
		if (typed.type !== "text" || typeof typed.text !== "string") return;
		texts.push(typed.text);
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
			if (turn.status === "inProgress") return failure("in-progress-turn", "This Codex turn is still in progress. Wait for it to finish, then try forking again.");
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
		const selected = canonical ? entries.slice(0, entries.indexOf(target) + 1) : [];
		const displayPrefix = selected.slice(0, -1);
		if (canonical && (displayPrefix.length > 200 || Buffer.byteLength(JSON.stringify(displayPrefix)) > 524288)) return failure("upstream-unavailable", "The local display prefix exceeds the safe fork-copy limit. Use native Codex to fork this conversation.");
		const frozen = structuredClone(selected);
		const prefix = frozen.slice(0, -1);
		return resolved.ok ? {
			...resolved,
			editorText: textOnlyMessage("content" in target.message ? target.message.content : void 0),
			...canonical ? { canonical: {
				thread,
				turns,
				prefix,
				assertUnchanged: async () => {
					const current = await readVisibleSessionTranscriptMessageEntries(params);
					const index = current.findIndex((entry) => entry.entryId === params.entryId);
					if (index < 0 || !isDeepStrictEqual(current.slice(0, index + 1), frozen)) throw new Error("The local Codex fork prefix changed during initialization");
					const currentThread = await params.control.readThread(threadId, false);
					assertCodexThreadAcceptsDirectInput(currentThread);
					if (currentThread.id !== thread.id || currentThread.path !== thread.path || currentThread.cwd !== thread.cwd || currentThread.historyMode !== thread.historyMode || currentThread.model !== thread.model || currentThread.modelProvider !== thread.modelProvider || currentThread.status?.type === "active") throw new Error("The canonical Codex source changed during initialization");
					const currentTurns = await listCodexUpstreamTurns(params.control, threadId);
					const cut = turns.findIndex((turn) => turn.id === resolved.boundary.beforeTurnId);
					if (!isDeepStrictEqual(currentTurns.slice(0, cut + 1), turns.slice(0, cut + 1))) throw new Error("The canonical Codex fork boundary changed during initialization");
				}
			} } : {}
		} : resolved;
	} catch {
		return failure("upstream-unavailable", "The Codex thread could not be read. Check that Codex is available, then try again.");
	}
}
function precheckCodexUpstreamForkBoundary(params) {
	const target = params.turns.find((turn) => turn.id === params.boundary.beforeTurnId);
	if (!target) return failure("upstream-unavailable", "The Codex thread changed before it could be forked. Refresh the session and try again.");
	if (target.status === "inProgress") return failure("in-progress-turn", "This Codex turn is still in progress. Wait for it to finish, then try forking again.");
	return {
		ok: true,
		boundary: params.boundary
	};
}
//#endregion
//#region extensions/codex/src/app-server/canonical-session-fork.ts
/** Native history stays native; only the verified local display prefix is copied. */
async function forkCanonicalCodexSession(params) {
	const { fork, resolved, control, bindingStore, sourceBinding, config } = params;
	const context = control.forkContext;
	if (!context?.localSessionsRoot || !resolved.canonical.thread.path) throw new Error("Canonical Codex forks require the verified local rollout on its selected connection. Fork an original imported message instead.");
	const model = normalizeOptionalString(resolved.canonical.thread.model);
	const modelProvider = normalizeOptionalString(resolved.canonical.thread.modelProvider);
	if (!model || !modelProvider) throw new Error("Codex did not report the canonical thread's model selection. Use Codex 0.153.0 or newer, or fork an original imported message instead.");
	const sourceIdentity = sessionBindingIdentity({
		...fork.source,
		config
	});
	return bindingStore.withLease(sourceIdentity, async () => {
		if (!isDeepStrictEqual(bindingStore.read(sourceIdentity), sourceBinding)) throw new Error("Codex canonical source binding changed before initialization");
		let freshThreadId;
		let ownership;
		let subscriptionReleased = false;
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
					if (!created.initialization) throw new Error("Canonical Codex forks require host creation authority");
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
								if (!subscriptionReleased) {
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
								subscriptionReleased = true;
								assertCurrent();
							});
						}
					});
					const assertCurrent = () => {
						fork.assertCurrent();
						initialization.assertCurrent();
						if (ownership && !subscriptionReleased) ownership.assertCurrent();
					};
					const snapshot = await readCodexRolloutSnapshot({
						sessionsRoot: context.localSessionsRoot,
						rolloutPath: resolved.canonical.thread.path,
						threadId: sourceBinding.threadId,
						assertCurrent
					});
					assertCurrent();
					if (!sourceBinding.dynamicToolsFingerprint) throw new Error("The canonical source has no verified native catalog binding");
					const sourceCatalog = parseCodexNativeToolCatalog(snapshot.metadata, sourceBinding.threadId, sourceBinding.dynamicToolsFingerprint);
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
					await snapshot.assertUnchanged();
					assertCurrent();
					await resolved.canonical.assertUnchanged();
					assertCurrent();
					if (!isDeepStrictEqual(bindingStore.read(sourceIdentity), sourceBinding)) throw new Error("Codex canonical source binding changed during preparation");
					assertCurrent();
					let raw;
					try {
						raw = await control.forkThread({
							...prepared.request,
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
					} catch (error) {
						control.retireConnection?.();
						throw error;
					}
					if (!response.thread.id.trim() || response.thread.id === sourceBinding.threadId || response.thread.id === fork.upstream.threadId || response.thread.forkedFromId !== sourceBinding.threadId || await bindingStore.hasOtherThreadOwner(response.thread.id)) {
						control.retireConnection?.();
						throw new Error("Codex fork returned an unsafe native thread identity");
					}
					freshThreadId = response.thread.id;
					ownership = await claimCodexAppServerLiveThread(context.client, freshThreadId);
					if (!ownership) {
						control.retireConnection?.();
						throw new Error("Codex fork subscription ownership could not be acquired");
					}
					assertCurrent();
					if (response.model !== model || response.thread.model !== model || response.modelProvider !== modelProvider || response.thread.modelProvider !== modelProvider) throw new Error("Codex fork did not preserve the exact canonical source and selected native model");
					const turns = await listCodexUpstreamTurns(control, freshThreadId);
					assertCurrent();
					const cut = resolved.canonical.turns.findIndex((turn) => turn.id === resolved.boundary.beforeTurnId);
					if (cut < 0 || !isDeepStrictEqual(turns, resolved.canonical.turns.slice(0, cut))) throw new Error("Codex did not apply the exact beforeTurnId cut. Reconnect to a compatible server and retry.");
					const metadata = response.thread.path ? await readCodexSessionMeta(context.localSessionsRoot, response.thread.path, freshThreadId) : void 0;
					assertCurrent();
					if (!metadata || metadata.model_provider !== modelProvider) throw new Error("The fresh Codex fork metadata could not be verified");
					const childCatalog = parseCodexNativeToolCatalog(metadata, freshThreadId);
					if (!isDeepStrictEqual(sourceCatalog, childCatalog)) throw new Error("Codex fork did not preserve the actual native tool catalog");
					await snapshot.assertUnchanged();
					assertCurrent();
					await checkCodexThreadAppAvailability({
						client: context.client,
						threadId: freshThreadId,
						appIds: prepared.provisionalAppIds
					});
					assertCurrent();
					await resolved.canonical.assertUnchanged();
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
					const appended = await appendSessionTranscriptMessagesByIdentity({
						config,
						storePath: resolveStorePath(config.session?.store, { agentId: created.agentId }),
						agentId: created.agentId,
						sessionKey: created.key,
						sessionId: created.sessionId,
						messages: resolved.canonical.prefix.map((entry) => ({
							message: structuredClone(entry.message),
							idempotencyLookup: "scan"
						}))
					});
					assertCurrent();
					if (appended.length !== resolved.canonical.prefix.length || appended.some((item, index) => !item.appended || !isDeepStrictEqual(item.message, resolved.canonical.prefix[index]?.message) || index > 0 && item.effectiveParentId !== appended[index - 1]?.messageId)) throw new Error("The canonical Codex display prefix could not be copied completely");
					initialization.link({
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
					await ownership.release(freshThreadId, assertCurrent);
					subscriptionReleased = true;
					initialization.assertCurrent();
					await resolved.canonical.assertUnchanged();
					initialization.assertCurrent();
					if (!isDeepStrictEqual(bindingStore.read(sourceIdentity), sourceBinding)) throw new Error("Codex source binding changed before fork readiness");
					initialization.assertCurrent();
					return { pluginExtensions: created.entry.pluginExtensions };
				}
			}).finally(() => {
				if (freshThreadId && !subscriptionReleased && hasCodexAppServerLiveThread(context.client, freshThreadId)) control.retireConnection?.();
			})).key,
			...resolved.editorText !== void 0 ? { editorText: resolved.editorText } : {}
		};
	});
}
//#endregion
//#region extensions/codex/src/app-server/upstream-session-fork.ts
function readConnectionFingerprint(ref) {
	if (!isRecord(ref)) return;
	return typeof ref.connectionFingerprint === "string" && ref.connectionFingerprint.trim() ? ref.connectionFingerprint : void 0;
}
async function forkCodexUpstreamSession(params, options) {
	try {
		const sourceFingerprint = params.upstream.kind === "codex-app-server" ? readConnectionFingerprint(params.upstream.ref) : void 0;
		const requestControl = sourceFingerprint ? await options.controlFactory.forUpstream(params.source.agentId, sourceFingerprint) : void 0;
		if (!sourceFingerprint || !requestControl) return {
			status: "failed",
			code: "upstream-unavailable",
			message: "This Codex thread is not available on the current connection. Reconnect to its host and try again."
		};
		return await requestControl.withPinnedConnection(async (control) => {
			const sourceBinding = options.bindingStore.read(sessionBindingIdentity({
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
			if (sourceFingerprint !== control.connectionFingerprint || supervised && (sourceBinding.supervisionSourceThreadId !== params.upstream.threadId || (sourceBinding.pendingSupervisionBranch?.connectionFingerprint ?? sourceBinding.appServerRuntimeFingerprint) !== sourceFingerprint)) return {
				status: "failed",
				code: "upstream-unavailable",
				message: "This Codex thread is not available on the current connection. Reconnect to its host and try again."
			};
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
			const liveTurns = await listCodexUpstreamTurns(control, sourceThreadId);
			const precheck = precheckCodexUpstreamForkBoundary({
				boundary: resolved.boundary,
				turns: liveTurns
			});
			if (!precheck.ok) return {
				status: "failed",
				code: precheck.code,
				message: precheck.message
			};
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
							initialization.link({
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
				return {
					status: "failed",
					code: "upstream-unavailable",
					message: error instanceof Error ? error.message : "The Codex fork could not be imported. Refresh sessions and try again."
				};
			}
		});
	} catch (error) {
		return {
			status: "failed",
			code: "upstream-unavailable",
			message: error instanceof Error ? error.message : "The Codex thread could not be forked. Check that Codex is available, then try again."
		};
	}
}
//#endregion
export { forkCodexUpstreamSession };
