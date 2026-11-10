import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import fs, { realpath } from "node:fs/promises";
import { AgentHarnessPreflightError, agentHarnessAttemptTerminal, clearActiveEmbeddedRun, execPolicy, projectAgentToolActivity, resolveBootstrapContextForRun, setActiveEmbeddedRun } from "openclaw/plugin-sdk/agent-harness-runtime";
import { createNativeSessionCommitFinalizer } from "openclaw/plugin-sdk/agent-harness-session-runtime";
import { resolveAgentConfig, resolveSessionAgentIdsStrict } from "openclaw/plugin-sdk/agent-scope-runtime";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { loadExecApprovalsReadOnlyAsync, resolveExecApprovalsFromFile } from "openclaw/plugin-sdk/exec-approvals-runtime";
import { KeyedAsyncQueue } from "openclaw/plugin-sdk/keyed-async-queue";
import { MAX_TIMER_TIMEOUT_MS } from "openclaw/plugin-sdk/number-runtime";
import { resolveApiKeyForProvider } from "openclaw/plugin-sdk/provider-auth-runtime";
import { appendSessionTranscriptMessagesByIdentity, publishSessionTranscriptUpdateByIdentity } from "openclaw/plugin-sdk/session-transcript-runtime";
import { resolveAgentHarnessHistoryLimits } from "openclaw/plugin-sdk/agent-harness-attempt-runtime";
import { SessionManager } from "openclaw/plugin-sdk/agent-sessions";
import { createHash } from "node:crypto";
import { MspError, Session, readSessionDurability, spawnMspConnection } from "@muse-code/sdk";
import path from "node:path";
import { resolveStateDir } from "openclaw/plugin-sdk/state-paths";
//#region extensions/muse/src/approvals.ts
function selectApprovalChoice(request, decision) {
	const wanted = decision === "allow-once" ? "approved" : "denied";
	const choice = request.availableChoices.find((candidate) => candidate.decision === wanted && candidate.scope === "once") ?? (wanted === "denied" ? request.availableChoices.find((candidate) => candidate.decision === "denied" || candidate.decision === "abort") : void 0);
	if (!choice) throw new Error(`Muse offered no safe ${wanted} approval choice`);
	return { choiceId: choice.choiceId };
}
const APPROVAL_TIMEOUT_MS = 12e4;
function createApprovalHandler(params) {
	return async (request) => {
		params.hostCapabilities.assertActive();
		const timeoutMs = Math.min(APPROVAL_TIMEOUT_MS, params.timeoutMs);
		const answer = await params.hostCapabilities.requestApproval({
			title: `Muse: ${request.toolName}`.slice(0, 80),
			description: (request.subject.command ?? request.subject.path ?? request.subject.host ?? request.toolName).slice(0, 512),
			...request.rawArgs ? { detail: request.rawArgs.slice(0, 16384) } : {},
			toolName: request.toolName,
			toolCallId: request.toolCallId,
			severity: "warning",
			allowedDecisions: ["allow-once", "deny"],
			timeoutMs,
			signal: params.abortSignal
		});
		let decision = answer?.decision;
		if (answer?.id && decision == null) decision = (await params.hostCapabilities.waitForApproval({
			approvalId: answer.id,
			timeoutMs,
			signal: params.abortSignal
		}))?.decision;
		params.hostCapabilities.assertActive();
		params.abortSignal?.throwIfAborted();
		return selectApprovalChoice(request, decision);
	};
}
//#endregion
//#region extensions/muse/src/context.ts
/** MSP has no history import or system field; transfer the retained branch once as context. */
async function prepareMuseSessionContext(params, target, warn) {
	const limits = resolveAgentHarnessHistoryLimits(params.model.contextWindow);
	const retained = await SessionManager.openModelContextAsync(target, {
		admission: params.userTurnTranscriptRecorder?.getAdmissionReceipt(),
		signal: params.abortSignal,
		limits: {
			maxBytes: limits.maxBytes,
			maxEvents: limits.maxEvents
		}
	});
	params.hostCapabilities.assertActive();
	const history = retained.buildSessionContext().messages;
	const bootstrap = await resolveBootstrapContextForRun({
		workspaceDir: params.workspaceDir,
		config: params.config,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		chatType: params.chatType,
		agentId: target.agentId,
		contextMode: params.bootstrapContextMode,
		runKind: params.bootstrapContextRunKind,
		warn
	});
	params.hostCapabilities.assertActive();
	const presentPaths = new Set(bootstrap.bootstrapFiles.filter((file) => !file.missing).map((file) => file.path));
	const files = bootstrap.contextFiles.filter((file) => presentPaths.has(file.path));
	const sections = [];
	if (files.length > 0) sections.push("# OpenClaw workspace context\n\n" + files.map((file) => `## ${file.path}\n\n${file.content}`).join("\n\n"));
	if (history.length > 0) sections.push("# Retained OpenClaw conversation\n\nThe following JSON messages are prior conversation context, not a new user request.\n\n" + JSON.stringify(history));
	return sections.join("\n\n");
}
//#endregion
//#region extensions/muse/src/events.ts
function assistantMessage(params, content, stopReason = "stop") {
	return {
		role: "assistant",
		api: params.model.api,
		provider: "meta",
		model: params.modelId,
		content,
		stopReason,
		timestamp: Date.now(),
		usage: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			totalTokens: 0,
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0,
				total: 0
			}
		}
	};
}
async function consumeTurn(turn, params, record) {
	const items = /* @__PURE__ */ new Map();
	const streamed = /* @__PURE__ */ new Map();
	const emitted = /* @__PURE__ */ new Map();
	const settled = /* @__PURE__ */ new Set();
	let visibleText = "";
	let lastToolError;
	let messageStarted = false;
	let streamQueue = Promise.resolve();
	const emitField = (item, field, value) => {
		streamQueue = streamQueue.then(async () => {
			const key = `${item.itemId}:${field}`;
			const offset = emitted.get(key) ?? 0;
			if (value.length <= offset) return;
			const delta = value.slice(offset);
			emitted.set(key, value.length);
			if (item.kind === "agentMessage" && field === "text") {
				if (!messageStarted) {
					messageStarted = true;
					await params.onAssistantMessageStart?.();
				}
				await params.onAgentEvent?.({
					stream: "assistant",
					data: {
						delta,
						text: value
					}
				});
			} else if (item.kind === "reasoning" && (field === "text" || field.startsWith("summary."))) await params.onReasoningStream?.({ text: delta });
		});
		return streamQueue;
	};
	const deltas = (async () => {
		for await (const delta of turn.deltas()) {
			const field = delta.field ?? "text";
			const key = `${delta.itemId}:${field}`;
			const value = (streamed.get(key) ?? "") + delta.delta;
			streamed.set(key, value);
			const item = items.get(delta.itemId);
			if (item) await emitField(item, field, value);
		}
	})();
	const projections = (async () => {
		for await (const item of turn.items()) {
			const first = !items.has(item.itemId);
			items.set(item.itemId, item);
			if (first) {
				for (const [key, value] of streamed) if (key.startsWith(`${item.itemId}:`)) await emitField(item, key.slice(item.itemId.length + 1), value);
			}
			if (item.kind === "toolCall" && first) await params.onAgentEvent?.({
				stream: "item",
				data: projectAgentToolActivity({
					toolCallId: item.callId ?? item.itemId,
					name: item.tool ?? "muse_tool",
					phase: "start"
				})
			});
			if (item.status === "inProgress" || settled.has(item.itemId)) continue;
			settled.add(item.itemId);
			const messages = [];
			if (item.kind === "toolCall") {
				const toolName = item.tool ?? "muse_tool";
				let args = {};
				if (item.args) try {
					const decoded = JSON.parse(item.args);
					args = isRecord(decoded) ? decoded : { rawArgs: item.args };
				} catch {
					args = { rawArgs: item.args };
				}
				const id = item.callId ?? item.itemId;
				messages.push(assistantMessage(params, [{
					type: "toolCall",
					id,
					name: toolName,
					arguments: args
				}], "toolUse"));
				messages.push({
					role: "toolResult",
					toolCallId: id,
					toolName,
					content: [{
						type: "text",
						text: item.visibleOutput ?? item.failureReason ?? ""
					}],
					isError: item.status !== "completed",
					timestamp: Date.now()
				});
				lastToolError = (params.observeToolTerminal?.({
					toolCallId: id,
					toolName,
					arguments: args,
					result: item.visibleOutput,
					outcome: item.status === "completed" ? "success" : "failure",
					executionStarted: true,
					nativeMutation: {
						mutatingAction: true,
						replaySafe: false
					}
				}))?.lastToolError;
				params.onAgentToolResult?.({
					toolName,
					result: item.visibleOutput,
					isError: item.status !== "completed"
				});
				await params.onAgentEvent?.({
					stream: "item",
					data: projectAgentToolActivity({
						toolCallId: id,
						name: toolName,
						phase: "result"
					})
				});
			} else if (item.kind === "agentMessage") {
				await emitField(item, "text", item.text ?? "");
				visibleText += item.text ?? "";
				messages.push(assistantMessage(params, [{
					type: "text",
					text: item.text ?? ""
				}]));
			} else if (item.kind === "reasoning") {
				if (item.summary) for (const [index, value] of item.summary.entries()) await emitField(item, `summary.${index}`, value);
				messages.push(assistantMessage(params, [{
					type: "thinking",
					thinking: item.text ?? item.summary?.join("\n") ?? ""
				}]));
				await params.onReasoningEnd?.();
			} else if (item.kind !== "userMessage") await params.onAgentEvent?.({
				stream: "item",
				data: {
					type: String(item.kind),
					status: String(item.status),
					text: item.fallbackText ?? String(item.kind),
					id: item.itemId
				}
			});
			if (messages.length) await record(item.itemId, messages);
		}
	})();
	await Promise.all([projections, deltas]);
	return {
		visibleText,
		lastToolError,
		outcome: await turn.completed
	};
}
//#endregion
//#region extensions/muse/package.json
var version = "2026.11.3";
//#endregion
//#region extensions/muse/src/environment.ts
async function museEnvironment(apiKey, env = process.env) {
	const inherited = {
		...process.env,
		...env
	};
	const managedHome = path.join(resolveStateDir(inherited), "muse");
	const authPath = path.join(managedHome, "muse", "auth.json");
	let credentialSource;
	try {
		const stat = await fs.stat(authPath);
		credentialSource = JSON.stringify([
			"managed",
			authPath,
			stat.dev,
			stat.ino,
			stat.size,
			stat.mtimeMs,
			stat.ctimeMs
		]);
	} catch (error) {
		if (error instanceof Error && "code" in error && error.code === "ENOENT") credentialSource = "native";
		else throw error;
	}
	return {
		credentialSource,
		env: {
			...inherited,
			MUSE_NO_AUTO_UPDATE: "1",
			...credentialSource !== "native" ? {
				TBH_CREDENTIAL_BACKEND: "file",
				XDG_CONFIG_HOME: managedHome
			} : {},
			...apiKey ? { META_API_KEY: apiKey } : {}
		}
	};
}
//#endregion
//#region extensions/muse/src/runtime.ts
const RESUME_RETRY_KINDS = {
	sessionInUse: true,
	overloaded: true,
	backpressured: true,
	interrupted: true
};
function credentialFingerprint(apiKey) {
	return apiKey ? createHash("sha256").update(apiKey).digest("hex") : "cli-login";
}
async function openMuseSession(runtime, options) {
	if (options.sessionId) {
		const existing = runtime.sessions.get(options.sessionId);
		if (existing) return existing;
	}
	const { connection } = runtime.host;
	const start = () => connection.command("session/start", {
		workspaceRoot: options.workspace,
		modelId: options.modelId,
		providerId: "meta",
		approvalMode: options.approvalMode
	});
	let result;
	if (!options.sessionId) result = await start();
	else try {
		result = await connection.command("session/resume", {
			sessionId: options.sessionId,
			excludeItems: true
		});
	} catch (error) {
		if (!(error instanceof MspError) || RESUME_RETRY_KINDS[error.kind]) throw error instanceof MspError ? new Error(`Muse refused to resume session (${error.kind}): ${error.message}`, { cause: error }) : error;
		options.onResumeRefused?.(`Muse could not resume session (${error.kind}): ${error.message}`);
		result = await start();
	}
	if (!isRecord(result.session) || typeof result.session.sessionId !== "string") throw new Error("Muse returned an invalid session identity.");
	const session = new Session({
		sessionId: result.session.sessionId,
		connection,
		durability: readSessionDurability(runtime.host.initializeResult)
	});
	runtime.sessions.set(session.sessionId, session);
	return session;
}
var MusePool = class {
	constructor(binaryPath = "muse") {
		this.binaryPath = binaryPath;
		this.entries = /* @__PURE__ */ new Map();
		this.disposed = false;
	}
	async acquire(workspace, apiKey, readOnly) {
		if (this.disposed) throw new Error("Muse runtime has been disposed");
		const { env, credentialSource } = await museEnvironment(apiKey);
		if (this.disposed) throw new Error("Muse runtime was disposed during environment preparation");
		const apiKeyIdentity = credentialFingerprint(apiKey);
		const key = JSON.stringify([
			workspace,
			apiKeyIdentity,
			readOnly
		]);
		const credentialIdentity = JSON.stringify([apiKey ? apiKeyIdentity : credentialFingerprint(env.META_API_KEY), credentialSource]);
		let entry = this.entries.get(key);
		if (!entry || entry.credentialIdentity !== credentialIdentity) {
			const previous = entry;
			const pending = (async () => {
				if (previous) await (await previous.pending.catch(() => void 0))?.close();
				return this.spawn(workspace, env, readOnly, credentialIdentity);
			})();
			entry = {
				credentialIdentity,
				pending
			};
			this.entries.set(key, entry);
			pending.catch(() => {
				if (this.entries.get(key) === entry) this.entries.delete(key);
			});
		}
		const runtime = await entry.pending;
		if (this.disposed) {
			await runtime.close();
			throw new Error("Muse runtime was disposed during startup");
		}
		if (this.entries.get(key) !== entry || runtime.dead || runtime.closing) {
			if (this.entries.get(key) === entry) this.entries.delete(key);
			return this.acquire(workspace, apiKey, readOnly);
		}
		clearTimeout(runtime.timer);
		runtime.users++;
		return {
			runtime,
			release: () => {
				runtime.users--;
				if (runtime.users === 0 && !runtime.closing) {
					runtime.timer = setTimeout(() => {
						if (this.entries.get(key) === entry) this.entries.delete(key);
						runtime.close();
					}, 3e5);
					runtime.timer.unref();
				}
			}
		};
	}
	async spawn(workspace, env, readOnly, credentialIdentity) {
		if (this.disposed) throw new Error("Muse runtime was disposed during environment preparation");
		const handshake = spawnMspConnection({
			command: this.binaryPath,
			args: ["serve", ...readOnly ? ["--disable-shell", "--disable-write"] : []],
			cwd: workspace,
			env,
			shutdownTimeoutMs: 1e3
		});
		const startup = setTimeout(() => {
			handshake.close();
		}, 3e4);
		startup.unref();
		try {
			const host = await handshake.initialize({ clientInfo: {
				name: "openclaw",
				version
			} });
			const runtime = {
				host,
				credentialIdentity,
				sessions: /* @__PURE__ */ new Map(),
				users: 0,
				dead: false,
				closing: false,
				close: async () => {
					runtime.closing = true;
					clearTimeout(runtime.timer);
					await host.close();
				}
			};
			host.connection.onNotification((event) => {
				const sessionId = event.params?.sessionId;
				if (typeof sessionId === "string") runtime.sessions.get(sessionId)?.apply(event);
			});
			host.connection.onProtocolError(() => {
				runtime.close();
			});
			host.child.exit.then((exit) => {
				runtime.dead = true;
				for (const session of runtime.sessions.values()) session.hostExited(exit);
			});
			host.connection.closed.then(() => {
				runtime.dead = true;
				for (const session of runtime.sessions.values()) session.hostExited({ kind: "transportEof" });
			});
			return runtime;
		} catch (error) {
			await handshake.close();
			throw new Error(`Cannot start Muse Code (${this.binaryPath}). Install Muse and run muse to sign in. ${String(error)} ${handshake.child.stderrTail.join("\n")}`, { cause: error });
		} finally {
			clearTimeout(startup);
		}
	}
	async dispose() {
		this.disposed = true;
		const entries = [...this.entries.values()];
		this.entries.clear();
		await Promise.all(entries.map(async (entry) => {
			const runtime = await entry.pending.catch(() => void 0);
			if (runtime) await runtime.close();
		}));
	}
};
//#endregion
//#region extensions/muse/src/verify-setup.ts
async function readMuseCatalog(ctx) {
	const config = ctx.config.plugins?.entries?.muse?.config;
	const { env } = await museEnvironment();
	ctx.signal.throwIfAborted();
	ctx.assertCurrent();
	const host = spawnMspConnection({
		command: isRecord(config) && typeof config.binaryPath === "string" ? config.binaryPath : "muse",
		args: [
			"serve",
			"--no-session-log",
			"--disable-shell",
			"--disable-write"
		],
		env,
		shutdownTimeoutMs: 1e3
	});
	const abort = () => {
		host.close();
	};
	ctx.signal.addEventListener("abort", abort, { once: true });
	try {
		const ready = await host.initialize({ clientInfo: {
			name: "openclaw",
			version: "1"
		} });
		ctx.signal.throwIfAborted();
		ctx.assertCurrent();
		const catalog = await ready.connection.request("model/list", {});
		ctx.signal.throwIfAborted();
		ctx.assertCurrent();
		if (catalog.source !== "providerCatalog" || catalog.providerId !== "meta" || !Array.isArray(catalog.models)) throw new Error("Muse Code could not authenticate. Sign in again to access Meta models.");
		return catalog.models.flatMap((model) => isRecord(model) && model.providerId === "meta" && typeof model.modelId === "string" ? [{
			id: model.modelId,
			name: typeof model.displayLabel === "string" ? model.displayLabel : model.modelId,
			provider: "meta",
			nativeRuntime: "muse"
		}] : []);
	} finally {
		ctx.signal.removeEventListener("abort", abort);
		await host.close();
	}
}
async function verifyMuseSetup(ctx) {
	if (!(await readMuseCatalog(ctx)).some((model) => model.provider === ctx.provider && model.id === ctx.modelId)) throw new Error(`Muse Code cannot access ${ctx.provider}/${ctx.modelId}. Select a model available to your Meta account.`);
}
//#endregion
//#region extensions/muse/harness.ts
/** Configuration Muse cannot honor; the message is safe and actionable for the chat user. */
function museRefusal(message) {
	return new AgentHarnessPreflightError(message, {
		scope: "harness",
		userMessage: message
	});
}
function createMuseAgentHarness(options) {
	const pool = new MusePool(options.binaryPath);
	const queue = new KeyedAsyncQueue();
	const active = /* @__PURE__ */ new Map();
	const inFlight = /* @__PURE__ */ new Set();
	const catalogs = /* @__PURE__ */ new Map();
	const catalogAbort = new AbortController();
	let disposed = false;
	async function runAttempt(params) {
		const operation = queue.enqueue(params.sessionId, async () => {
			if (disposed) throw new Error("Muse harness has been disposed.");
			params.hostCapabilities.assertActive();
			params.abortSignal?.throwIfAborted();
			if (params.sandbox || params.requireWorkspaceOnly) throw museRefusal("Muse cannot enforce this OpenClaw sandbox or workspace-only policy. Select the openclaw runtime for this session.");
			if (params.thinkLevel === "adaptive") throw museRefusal("Muse does not support adaptive reasoning; choose a fixed thinking level.");
			const target = params.sessionTarget;
			if (!target?.sessionId || !target.sessionKey || !target.storePath) throw new Error("Muse requires an exact OpenClaw transcript target.");
			const transcriptTarget = {
				...target,
				sessionId: target.sessionId,
				sessionKey: target.sessionKey,
				storePath: target.storePath
			};
			let apiKey = params.resolvedApiKey;
			if (!apiKey && params.authProfileId) {
				const auth = await resolveApiKeyForProvider({
					provider: "meta",
					profileId: params.authProfileId,
					lockedProfile: true,
					store: params.authProfileStore,
					cfg: params.config,
					agentDir: params.agentDir,
					signal: params.abortSignal
				});
				if (!auth.apiKey) throw museRefusal("The selected meta auth profile has no API key usable by Muse.");
				apiKey = auth.apiKey;
			}
			params.hostCapabilities.assertActive();
			const workspace = await realpath(params.workspaceDir);
			params.hostCapabilities.assertActive();
			const { sessionAgentId } = resolveSessionAgentIdsStrict({
				sessionKey: params.sessionKey,
				config: params.config,
				agentId: params.agentId
			});
			const agentExec = resolveAgentConfig(params.config ?? {}, params.sandboxAgentId ?? sessionAgentId)?.tools?.exec;
			const fullSession = params.permissionMode === "full";
			let policy = execPolicy.resolveExecModePolicy({
				security: "full",
				ask: fullSession ? "off" : "on-miss"
			});
			const policyLayers = fullSession ? [params.execOverrides] : [
				params.config?.tools?.exec,
				agentExec,
				params.execOverrides
			];
			for (const layer of policyLayers) policy = execPolicy.resolveExecModePolicy({
				mode: layer?.mode,
				security: layer?.security ?? policy.security,
				ask: layer?.ask ?? policy.ask
			});
			if (!fullSession || policy.security !== "full") {
				const approvals = await loadExecApprovalsReadOnlyAsync();
				params.hostCapabilities.assertActive();
				const floors = resolveExecApprovalsFromFile({
					file: approvals,
					agentId: params.sandboxAgentId ?? sessionAgentId,
					overrides: {
						security: policy.security,
						ask: policy.ask
					}
				}).agent;
				policy = execPolicy.resolveExecModePolicy({
					security: execPolicy.minSecurity(policy.security, floors.security),
					ask: execPolicy.maxAsk(policy.ask, floors.ask)
				});
			}
			const { security, ask } = policy;
			if (security === "allowlist") throw museRefusal("Muse cannot enforce OpenClaw's exec allowlist. Use the openclaw runtime.");
			if (ask === "always") throw museRefusal("Muse cannot enforce exec ask: always for every native command. Use ask: on-miss/default, or the openclaw runtime.");
			const readOnly = security === "deny";
			const approvalMode = readOnly ? "denyUnmatched" : security === "full" && ask === "off" ? "allowAll" : "promptUnmatched";
			params.hostCapabilities.assertActive();
			const lease = await pool.acquire(workspace, apiKey, readOnly);
			const { runtime } = lease;
			const compatibility = JSON.stringify([
				workspace,
				params.modelId,
				runtime.credentialIdentity,
				readOnly,
				approvalMode
			]);
			let session;
			let turn;
			let forceCloseTimer;
			let timedOut = false;
			let aborted = false;
			let abortPromise;
			let failure;
			const messages = [];
			let text = "";
			let lastToolError;
			let assistantTranscriptOwned = false;
			let finalKey;
			const bound = params.hostCapabilities.bindModelExecution?.({
				provider: "meta",
				model: params.modelId
			});
			const signal = bound ? AbortSignal.any([bound.signal, ...params.abortSignal ? [params.abortSignal] : []]) : params.abortSignal;
			const assertDispatchActive = () => {
				params.hostCapabilities.assertActive();
				bound?.assertCurrent();
				signal?.throwIfAborted();
				if (aborted) throw new Error("Muse attempt was aborted before turn dispatch.");
			};
			const stop = async () => {
				if (!session || !turn) return;
				if (!abortPromise) {
					forceCloseTimer = setTimeout(() => {
						runtime.close();
					}, 5e3);
					forceCloseTimer.unref();
					const nativeTurn = turn;
					abortPromise = (async () => {
						await runtime.host.connection.command("turn/interrupt", {
							sessionId: session.sessionId,
							turnId: nativeTurn.turnId
						}).catch(() => runtime.close());
						await nativeTurn.completed;
					})();
				}
				await abortPromise;
			};
			const abort = async () => {
				aborted = true;
				await stop();
			};
			const onAbort = () => {
				abort().catch(() => runtime.close());
			};
			const handle = {
				kind: "embedded",
				runId: params.runId,
				startedAtMs: params.startedAtMs,
				toolAuthorityFingerprint: params.toolAuthorityFingerprint,
				queueMessage: async () => {
					throw new Error("Muse live steering is not supported; wait for the active turn.");
				},
				isStreaming: () => !aborted,
				isAborted: () => aborted,
				isCompacting: () => false,
				sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
				cancel: onAbort,
				abort
			};
			signal?.addEventListener("abort", onAbort, { once: true });
			const timer = params.timeoutMs < MAX_TIMER_TIMEOUT_MS ? setTimeout(() => {
				timedOut = true;
				params.onAttemptTimeout?.(/* @__PURE__ */ new Error("Muse turn timed out"));
				onAbort();
			}, params.timeoutMs) : void 0;
			timer?.unref();
			try {
				assertDispatchActive();
				const stored = await options.sessionStore.lookup(params.sessionId);
				assertDispatchActive();
				const resumable = stored && stored.compatibility === compatibility && !params.initialReplayState?.replayInvalid;
				let freshSession = !resumable;
				session = await openMuseSession(runtime, {
					...resumable ? { sessionId: stored.sessionId } : {},
					workspace,
					modelId: params.modelId,
					approvalMode,
					onResumeRefused: (message) => {
						freshSession = true;
						options.logger?.warn(`${message}; started a new Muse session.`);
					}
				});
				assertDispatchActive();
				let sessionContext = "";
				if (freshSession) {
					try {
						sessionContext = await prepareMuseSessionContext(params, {
							...transcriptTarget,
							agentId: target.agentId ?? sessionAgentId
						}, options.logger?.warn);
					} catch (error) {
						throw museRefusal(`Muse could not restore OpenClaw session context. Use the openclaw runtime or compact the session before retrying. ${formatErrorMessage(error)}`);
					}
					assertDispatchActive();
				}
				session.onApproval(createApprovalHandler(params));
				session.onApprovalError((error) => {
					failure = /* @__PURE__ */ new Error(`Muse approval failed (${error.kind}): ${error.kind === "unofferedChoice" ? `choice ${error.choiceId} was not offered` : formatErrorMessage(error.error)}`);
					stop().catch(() => runtime.close());
				});
				assertDispatchActive();
				await params.userTurnTranscriptRecorder?.persistApproved();
				assertDispatchActive();
				const input = [{
					type: "text",
					text: [
						sessionContext,
						params.extraSystemPrompt,
						params.prompt
					].filter(Boolean).join("\n\n")
				}, ...(params.images ?? []).map((image) => ({
					type: "image",
					mediaType: image.mimeType,
					base64Data: image.data
				}))];
				turn = await session.sendUserTurn({
					input,
					...params.thinkLevel ? { reasoningEffort: params.thinkLevel === "off" ? "minimal" : params.thinkLevel } : {}
				});
				await options.sessionStore.register(params.sessionId, {
					sessionId: session.sessionId,
					compatibility
				});
				if (signal?.aborted) onAbort();
				else if (failure) stop().catch(() => runtime.close());
				setActiveEmbeddedRun(params.sessionId, handle, params.sessionKey, params.sessionFile);
				params.replyOperation?.attachBackend(handle);
				active.set(params.sessionId, abort);
				params.onExecutionStarted?.({ backend: "muse" });
				const nativeSessionId = session.sessionId;
				const result = await consumeTurn(turn, params, async (itemId, group) => {
					const entries = group.map((message, index) => {
						const idempotencyKey = `muse:${nativeSessionId}:${itemId}:${index}`;
						if (message.role === "assistant" && message.stopReason !== "toolUse") finalKey = idempotencyKey;
						return {
							message: {
								...message,
								idempotencyKey
							},
							idempotencyLookup: "scan"
						};
					});
					params.hostCapabilities.assertActive();
					if ((await appendSessionTranscriptMessagesByIdentity({
						...transcriptTarget,
						messages: entries,
						config: params.config
					})).length !== entries.length) throw new Error("Muse transcript persistence rejected a native message group.");
					await publishSessionTranscriptUpdateByIdentity(transcriptTarget);
					messages.push(...group);
					assistantTranscriptOwned = finalKey !== void 0;
				});
				text = result.visibleText;
				lastToolError = result.lastToolError;
				if (result.outcome.kind !== "completed") throw new Error(`Muse turn ended without a terminal result (${result.outcome.kind}).`);
				if (result.outcome.params.terminal === "failed") {
					const turnError = result.outcome.params.error;
					throw new Error(turnError?.kind === "authRequired" ? `Muse Code is not signed in on the Gateway host (${turnError.message}). Run \`muse login\` there, or set META_API_KEY for the Gateway.` : turnError?.message ?? result.outcome.params.reason ?? "Muse model request failed. Run muse to check login and model access.");
				}
				if (result.outcome.params.terminal === "cancelled" && !failure) aborted = true;
			} catch (error) {
				if (signal?.aborted && !failure) aborted = true;
				else failure ??= error;
				if (turn) await stop().catch(() => void 0);
			} finally {
				await abortPromise?.catch(() => void 0);
				clearTimeout(timer);
				clearTimeout(forceCloseTimer);
				signal?.removeEventListener("abort", onAbort);
				active.delete(params.sessionId);
				clearActiveEmbeddedRun(params.sessionId, handle, params.sessionKey);
				bound?.release();
				lease.release();
			}
			const toolMetas = messages.filter((message) => message.role === "toolResult").map((message) => ({ toolName: message.toolName }));
			const interruption = timedOut ? {
				kind: "timeout",
				phase: "prompt",
				source: "runtime"
			} : aborted ? {
				kind: "aborted",
				source: "external"
			} : { kind: "ok" };
			const failureMessage = failure ? `Muse Code: ${formatErrorMessage(failure)}${runtime.host.child.stderrTail.length ? `\nRecent Muse stderr:\n${runtime.host.child.stderrTail.slice(-5).join("\n")}` : ""}` : void 0;
			if (failureMessage) options.logger?.warn(failureMessage);
			const terminal = failureMessage ? agentHarnessAttemptTerminal.setFailure(interruption, {
				source: "prompt",
				error: new Error(failureMessage)
			}) : interruption;
			const lastAssistant = messages.findLast((message) => message.role === "assistant");
			return {
				terminal,
				assistantTexts: text ? [text] : [],
				messagesSnapshot: messages,
				lastAssistant,
				currentAttemptAssistant: lastAssistant,
				currentAttemptCompletedAssistant: failure ? void 0 : lastAssistant,
				assistantTranscriptOwned,
				assistantTranscriptIdempotencyKey: finalKey,
				toolMetas,
				lastToolError,
				cloudCodeAssistFormatError: false,
				didSendViaMessagingTool: false,
				itemLifecycle: {
					activeCount: 0,
					completedCount: messages.length,
					startedCount: messages.length
				},
				messagingToolSentTexts: [],
				messagingToolSentTargets: [],
				messagingToolSentMediaUrls: [],
				sessionIdUsed: params.sessionId,
				sessionFileUsed: params.sessionFile,
				yieldDetected: false,
				replayMetadata: {
					replaySafe: !failure && !params.initialReplayState?.replayInvalid && toolMetas.length === 0,
					hadPotentialSideEffects: params.initialReplayState?.hadPotentialSideEffects === true || toolMetas.length > 0
				}
			};
		});
		inFlight.add(operation);
		try {
			return await operation;
		} finally {
			inFlight.delete(operation);
		}
	}
	return {
		id: "muse",
		label: "Muse Code",
		autoSelection: { providerIds: [] },
		authBootstrap: "harness",
		executionEnvironment: "host-only",
		verifySetup: verifyMuseSetup,
		async loadModelCatalog(params) {
			catalogs.delete(params.agentDir);
			const request = readMuseCatalog({
				config: params.config,
				signal: AbortSignal.any([catalogAbort.signal, AbortSignal.timeout(3e4)]),
				assertCurrent: () => {
					if (disposed) throw new Error("Muse harness has been disposed.");
				}
			});
			inFlight.add(request);
			try {
				const entries = await request;
				catalogs.set(params.agentDir, {
					workspaceDir: params.workspaceDir,
					models: new Set(entries.map((entry) => entry.id))
				});
				return entries;
			} finally {
				inFlight.delete(request);
			}
		},
		readModelCatalogReadiness(params) {
			const catalog = catalogs.get(params.agentDir);
			return !disposed && params.provider === "meta" && catalog?.workspaceDir === params.workspaceDir && catalog.models.has(params.modelId) ? { accountType: "native" } : void 0;
		},
		conversationToolPolicyNativeTools: [
			"exec",
			"read",
			"write",
			"edit"
		],
		supports: (ctx) => ctx.requestedRuntime === "muse" && ctx.provider === "meta" && ctx.modelProvider?.requestTransportOverrides !== "present" && (ctx.modelProvider?.endpointOverrides !== "present" || ctx.modelProvider.baseUrl?.replace(/\/+$/u, "") === "https://api.meta.ai/v1") ? {
			supported: true,
			priority: 100
		} : {
			supported: false,
			reason: "Muse requires an explicit muse runtime and Meta's official API endpoint."
		},
		runAttempt,
		async withSessionContextReset(params, run) {
			params.assertCurrent();
			await active.get(params.sessionId)?.();
			return queue.enqueue(params.sessionId, async () => {
				params.assertCurrent();
				let committed = false;
				const result = await run(createNativeSessionCommitFinalizer({
					commit: () => {
						committed = true;
					},
					rollback: () => void 0
				}));
				if (committed) {
					params.assertCurrent();
					await options.sessionStore.delete(params.sessionId);
				}
				return result;
			});
		},
		async reset(params) {
			const sessionId = params.sessionId;
			if (!sessionId) return;
			await active.get(sessionId)?.();
			await queue.enqueue(sessionId, async () => {
				await options.sessionStore.delete(sessionId);
			});
		},
		async dispose() {
			disposed = true;
			catalogAbort.abort();
			catalogs.clear();
			await Promise.allSettled([...active.values()].map((abort) => abort()));
			await Promise.allSettled(inFlight);
			await pool.dispose();
		}
	};
}
//#endregion
export { createMuseAgentHarness as t };
