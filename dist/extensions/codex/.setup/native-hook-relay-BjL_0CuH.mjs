import { r as isJsonObject } from "./protocol-CaPAVwe9.mjs";
import { l as fingerprintCodexPolicy } from "./config-security-BxV4sSRz.mjs";
import { x as nativeHookRelayUnregisterQueue } from "./shared-client-BEHXwqz5.mjs";
import { O as resolveCodexToolAbortTerminalReason } from "./client-CKexde4_.mjs";
import { V as normalizeCodexDynamicToolName } from "./thread-requests-AxL6-JUD.mjs";
import { t as codexNativeSubagentMonitorRuntime } from "./native-subagent-monitor-CQk9y8zO.mjs";
import { createHash } from "node:crypto";
import { addTimerTimeoutGraceMs, finiteSecondsToTimerSafeMilliseconds } from "openclaw/plugin-sdk/number-runtime";
import { escapeRegExp } from "openclaw/plugin-sdk/text-utility-runtime";
import path from "node:path";
import { toErrorObject } from "openclaw/plugin-sdk/error-runtime";
import { KeyedAsyncQueue } from "openclaw/plugin-sdk/keyed-async-queue";
import { emitTrustedDiagnosticEvent } from "openclaw/plugin-sdk/diagnostic-runtime";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
import { pinExecToolTarget } from "openclaw/plugin-sdk/codex-mcp-projection";
import { loadNodeExecAvailability } from "openclaw/plugin-sdk/node-selection-runtime";
import { registerNativeHookRelayForBundledRuntime } from "openclaw/plugin-sdk/native-hook-relay-runtime";
//#region extensions/codex/src/app-server/shell-dynamic-tools.ts
const CODEX_NODE_EXEC_DYNAMIC_TOOL_NAME = "node_exec";
const CODEX_GATEWAY_EXEC_DYNAMIC_TOOL_NAME = "gateway_exec";
const CODEX_GATEWAY_PROCESS_DYNAMIC_TOOL_NAME = "gateway_process";
const CODEX_DISABLED_NATIVE_SHELL_DYNAMIC_TOOLS = /* @__PURE__ */ new Set([
	"exec",
	"process",
	"sandbox_exec",
	"sandbox_process",
	CODEX_GATEWAY_EXEC_DYNAMIC_TOOL_NAME,
	CODEX_GATEWAY_PROCESS_DYNAMIC_TOOL_NAME,
	CODEX_NODE_EXEC_DYNAMIC_TOOL_NAME
]);
const PROCESS_FOLLOWUP_TEXT = "Use process (list/poll/log/write/send-keys/submit/paste/kill/clear/remove) for follow-up.";
function isCodexDynamicToolExcluded(config, names) {
	const normalizedNames = new Set(names.map((name) => normalizeCodexDynamicToolName(name)));
	return (config.codexDynamicToolsExclude ?? []).some((name) => normalizedNames.has(normalizeCodexDynamicToolName(name)));
}
async function createNodeExecAliasDynamicTool(execTool, node, discoverySignal, availabilityRef) {
	const pinnedNode = node?.trim();
	const availability = await (availabilityRef ? availabilityRef.current ??= loadNodeExecAvailability(discoverySignal) : loadNodeExecAvailability(discoverySignal));
	discoverySignal?.throwIfAborted();
	if (!availability.isAvailable(pinnedNode)) return;
	const pinnedTool = pinExecToolTarget(execTool, {
		host: "node",
		...pinnedNode ? { node: pinnedNode } : {}
	});
	return {
		...pinnedTool,
		name: CODEX_NODE_EXEC_DYNAMIC_TOOL_NAME,
		description: pinnedNode ? "Run a shell command to completion on the OpenClaw configured remote node for this session. This tool always uses OpenClaw host=node internally and follows the existing node exec approval and allowlist policy. Remote-node background follow-up is unavailable. Use Codex's native shell for local app-server work when it is available." : "Run a shell command to completion on an OpenClaw remote node. The sole connected node that can execute commands is selected automatically; select by name or id when several can. This tool always uses OpenClaw host=node internally and follows the existing node exec approval and allowlist policy. Remote-node background follow-up is unavailable. Use Codex's native shell for local app-server work when it is available.",
		execute: withProcessFollowupText(pinnedTool, "Remote-node background follow-up is unavailable. Wait for the command to complete.")
	};
}
function createGatewayExecProjection(createProjection, execTool, params) {
	return createProjection(execTool, {
		kind: "exec",
		name: CODEX_GATEWAY_EXEC_DYNAMIC_TOOL_NAME,
		description: "Run a shell command through OpenClaw on the Gateway host for OpenClaw-managed Gateway environment access, including Secret Store agent-readable environment values and protected egress sentinels. Native Codex shell remains preferred for ordinary local work. This tool always uses OpenClaw host=gateway internally and follows Gateway exec approval and allowlist policy.",
		followupText: params.processAliasAvailable ? "Use gateway_process (list/poll/log/write/send-keys/submit/paste/kill/clear/remove) for follow-up." : "Background session follow-up is unavailable because gateway_process is not exposed. Rerun without background=true and set yieldMs high enough to wait for completion.",
		...params.ask ? { ask: params.ask } : {}
	});
}
function createGatewayProcessProjection(createProjection, processTool) {
	return createProjection(processTool, {
		kind: "process",
		name: CODEX_GATEWAY_PROCESS_DYNAMIC_TOOL_NAME,
		description: "Manage background shell sessions in the existing per-session OpenClaw process scope: list, poll, log, write, send-keys, submit, paste, kill, clear, or remove. Use for gateway_exec follow-up; use native Codex shell session handling for ordinary local work."
	});
}
function createSandboxShellProjection(tool, kind) {
	const projected = {
		...tool,
		name: `sandbox_${kind}`,
		description: kind === "exec" ? "Run a shell command through OpenClaw's configured sandbox backend for this session. Use when OpenClaw sandboxing is active or when a command must execute in the sandbox backend, such as an SSH-backed sandbox or Docker container-path bind layout. Use Codex's native shell only when no OpenClaw sandbox is active and native Code Mode is available." : "Manage background shell sessions through OpenClaw's configured sandbox backend for this session: list, poll, log, write, send-keys, submit, paste, kill, clear, or remove. Use only for sandbox follow-up; use Codex's native shell session handling only when no OpenClaw sandbox is active and native Code Mode is available."
	};
	if (kind === "exec") projected.execute = withProcessFollowupText(tool, "Use sandbox_process (list/poll/log/write/send-keys/submit/paste/kill/clear/remove) for follow-up.");
	return projected;
}
function withProcessFollowupText(tool, followupText) {
	return async (toolCallId, args, signal, onUpdate) => {
		const result = await tool.execute(toolCallId, args, signal, onUpdate);
		return {
			...result,
			content: result.content.map((item) => item.type === "text" ? Object.assign({}, item, { text: item.text.replace(PROCESS_FOLLOWUP_TEXT, followupText) }) : item)
		};
	};
}
/** Keeps replacement shell tools direct even when model metadata mandates Codex Code Mode. */
function placeDisabledNativeShellToolsInDirectNamespace(tools, nativeToolSurfaceEnabled) {
	if (nativeToolSurfaceEnabled !== false) return tools;
	for (const tool of tools) if (CODEX_DISABLED_NATIVE_SHELL_DYNAMIC_TOOLS.has(normalizeCodexDynamicToolName(tool.name))) tool.catalogMode = "direct-only";
	return tools;
}
//#endregion
//#region extensions/codex/src/app-server/native-hook-relay-remote.ts
const projections = new KeyedAsyncQueue();
const projectionOwners = /* @__PURE__ */ new Map();
/** Native ephemeral threads keep their command config across foreground runs. */
function codexNativeHookRemoteCredentialPath(config, relayId, generation) {
	return path.posix.join(config.credentialDirectory, `${encodeURIComponent(relayId)}.${encodeURIComponent(generation)}.json`);
}
/** The deployment owns the private directory; the live relay owns this projection. */
function createCodexNativeHookRemoteCredential(params) {
	const credentialPath = codexNativeHookRemoteCredentialPath(params.config, params.relay.relayId, params.relay.generation);
	const owner = Symbol("native-hook-credential");
	let preparation;
	let removal;
	let disposed = false;
	return {
		path: credentialPath,
		prepare() {
			if (disposed) return Promise.reject(/* @__PURE__ */ new Error("Native hook relay credential is closed"));
			preparation ??= projections.enqueue(credentialPath, async () => {
				if (disposed) throw new Error("Native hook relay credential is closed");
				params.assertCurrent();
				const { token } = params.relay.enableRemoteCallback();
				projectionOwners.set(credentialPath, owner);
				const credential = {
					url: `${params.config.url.replace(/\/$/, "")}/${encodeURIComponent(params.relay.relayId)}`,
					token
				};
				try {
					await params.client.request("fs/writeFile", {
						path: credentialPath,
						dataBase64: Buffer.from(JSON.stringify(credential)).toString("base64")
					}, {
						timeoutMs: params.timeoutMs,
						signal: params.signal,
						assertCurrent: params.assertCurrent,
						withCurrent: async (write) => {
							await params.assertCurrentAsync?.();
							params.assertCurrent();
							write();
						}
					});
				} catch {
					throw new Error("Could not deliver the native hook relay credential to Codex");
				}
				params.assertCurrent();
				if (disposed) throw new Error("Native hook relay credential closed during delivery");
			});
			return preparation;
		},
		dispose() {
			disposed = true;
			if (!preparation) return Promise.resolve();
			removal ??= projections.enqueue(credentialPath, async () => {
				if (projectionOwners.get(credentialPath) !== owner) return;
				try {
					await params.client.request("fs/remove", {
						path: credentialPath,
						force: true,
						recursive: false
					}, { timeoutMs: params.timeoutMs });
				} catch {
					throw new Error("Could not remove the retired native hook relay credential from Codex");
				} finally {
					projectionOwners.delete(credentialPath);
				}
			});
			return removal;
		}
	};
}
//#endregion
//#region extensions/codex/src/app-server/native-hook-relay.ts
const CODEX_NATIVE_HOOK_RELAY_EVENTS = [
	"pre_tool_use",
	"post_tool_use",
	"permission_request",
	"before_agent_finalize"
];
const CODEX_NATIVE_HOOK_RELAY_EVENTS_WITH_APP_SERVER_APPROVALS = CODEX_NATIVE_HOOK_RELAY_EVENTS.filter((event) => event !== "permission_request");
const CODEX_NATIVE_HOOK_RELAY_MIN_TTL_MS = 18e5;
/** Extra relay lifetime after the expected turn budget, preventing late hook drops. */
const CODEX_NATIVE_HOOK_RELAY_TTL_GRACE_MS = 3e5;
const CODEX_NATIVE_HOOK_RELAY_COMMAND_MIN_PARENT_MARGIN_MS = 250;
const CODEX_NATIVE_HOOK_RELAY_COMMAND_MAX_PARENT_MARGIN_MS = 1e3;
const CODEX_NATIVE_HOOK_RELAY_DEFAULT_TIMEOUT_SEC = 10;
const CODEX_NATIVE_HOOK_RELAY_UNREGISTER_GRACE_MS = 1e4;
const CODEX_NATIVE_HOOK_RELAY_UNREGISTER_EXTRA_GRACE_MS = 5e3;
const MAX_PENDING_DIRECT_CHILD_ADMISSIONS = 32;
const CODEX_NATIVE_SPAWN_HOOK_NAMES = ["spawn_agent", "Agent"];
const CODEX_HOOK_MATCHER_NAMES_BY_TOOL_ID = {
	exec: [
		"Bash",
		"exec",
		"exec_command"
	],
	process: ["process", "write_stdin"],
	read: [
		"read",
		"Read",
		"read_file"
	],
	write: ["write", "Write"],
	edit: ["edit", "Edit"],
	ls: ["ls", "list_dir"],
	grep: [
		"grep",
		"Grep",
		"grep_files"
	],
	find: ["find", "Glob"],
	view_image: ["view_image"],
	apply_patch: [
		"apply_patch",
		"Write",
		"Edit"
	],
	spawn_agent: CODEX_NATIVE_SPAWN_HOOK_NAMES
};
var CodexManagedHooksOnlyError = class extends Error {
	constructor() {
		super("Codex managed-only hooks disable the OpenClaw native hook relay; refusing unenforced execution");
		this.name = "CodexManagedHooksOnlyError";
	}
};
/** Enterprise managed-only policy silently drops the session-layer hooks that enforce OpenClaw. */
async function assertCodexNativeHookRelayAllowed(client, signal, timeoutMs) {
	const response = await client.request("configRequirements/read", void 0, {
		signal,
		...timeoutMs === void 0 ? {} : { timeoutMs }
	});
	if (!isJsonObject(response) || !Object.hasOwn(response, "requirements")) throw new Error("Codex configRequirements/read returned an invalid hook policy response");
	const requirements = response.requirements;
	if (requirements === null) return;
	if (!isJsonObject(requirements)) throw new Error("Codex configRequirements/read returned invalid hook policy requirements");
	const managedOnly = requirements.allowManagedHooksOnly;
	if (managedOnly !== void 0 && managedOnly !== null && typeof managedOnly !== "boolean") throw new Error("Codex configRequirements/read returned invalid managed-only hook policy");
	if (managedOnly === true) throw new CodexManagedHooksOnlyError();
}
/** Defers relay unregister so late native hook subprocesses can still resolve. */
function scheduleCodexNativeHookRelayUnregister(params) {
	const hookTimeoutMs = finiteSecondsToTimerSafeMilliseconds(normalizeHookTimeoutSec(params.hookTimeoutSec)) ?? 0;
	nativeHookRelayUnregisterQueue.schedule(params.relay, Math.max(CODEX_NATIVE_HOOK_RELAY_UNREGISTER_GRACE_MS, addTimerTimeoutGraceMs(hookTimeoutMs, CODEX_NATIVE_HOOK_RELAY_UNREGISTER_EXTRA_GRACE_MS) ?? 0));
}
/** Records a native pre-tool failure that Codex does not project as a tool item. */
function emitCodexNativePreToolUseFailureDiagnostic(params) {
	emitTrustedDiagnosticEvent({
		type: "tool.execution.error",
		...params.agentId ? { agentId: params.agentId } : {},
		sessionId: params.sessionId,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		runId: params.runId,
		toolName: params.failure.toolName,
		toolCallId: params.failure.toolCallId,
		durationMs: params.failure.durationMs,
		errorCategory: "before_tool_call",
		terminalReason: params.terminalReason ?? (params.signal?.aborted ? resolveCodexToolAbortTerminalReason(params.signal) : params.failure.disposition),
		...params.sourceTimestampMs !== void 0 ? { sourceTimestampMs: params.sourceTimestampMs } : {}
	});
}
function createCodexNativeHookRelay(params) {
	if (params.options?.enabled === false) return;
	const modelInputTools = params.nativeModelAdmission?.tools ?? ["multi_agent_v1send_input"];
	const directChildClaims = /* @__PURE__ */ new Map();
	const pendingDirectChildAdmissions = /* @__PURE__ */ new Map();
	let foregroundClosed = false;
	let successfulYieldRetentionAuthorized = false;
	const assertClaim = (threadId, claim) => () => directChildClaims.get(threadId) === claim;
	const rejectPendingAdmissions = (reason) => {
		for (const pending of pendingDirectChildAdmissions.values()) pending.reject(new Error(reason));
		pendingDirectChildAdmissions.clear();
	};
	let releaseProcessAdmission;
	let releaseExecutionPolicy;
	let processAdmissionDisposed = false;
	let remoteCredential;
	let remoteCleanup;
	const relay = registerNativeHookRelayForBundledRuntime({
		provider: "codex",
		relayId: buildCodexNativeHookRelayId({
			agentId: params.agentId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey
		}),
		...params.generation ? { generation: params.generation } : {},
		...params.generationMismatchGraceMs ? { generationMismatchGraceMs: params.generationMismatchGraceMs } : {},
		...params.agentId ? { agentId: params.agentId } : {},
		sessionId: params.sessionId,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		...params.config ? { config: params.config } : {},
		autoApproveMcpTools: params.autoApproveMcpTools,
		projectedMcpServers: params.projectedMcpServers,
		runId: params.runId,
		...params.channelId ? { channelId: params.channelId } : {},
		...params.requester ? { requester: params.requester } : {},
		...params.approvalContext ? { approvalContext: params.approvalContext } : {},
		allowedEvents: params.events,
		preToolUseLoopDetection: params.loopDetectionPreToolUseRelay,
		ttlMs: resolveCodexNativeHookRelayTtlMs({
			explicitTtlMs: params.options?.ttlMs,
			attemptTimeoutMs: params.attemptTimeoutMs,
			startupTimeoutMs: params.startupTimeoutMs,
			turnStartTimeoutMs: params.turnStartTimeoutMs
		}),
		signal: params.signal,
		runBeforeToolCall: params.hostCapabilities.runBeforeToolCall,
		executionAdmission: params.nativeProcessAuthority || params.nativeModelAdmission || params.hostCapabilities.workspaceReadiness ? {
			toolNames: [
				...params.nativeProcessAuthority ? ["exec"] : [],
				...params.nativeModelAdmission ? modelInputTools : [],
				...params.hostCapabilities.workspaceReadiness?.toolNames ?? []
			],
			admit: async (invocation, assertAdmissionCurrent, preparation) => {
				const payload = invocation.rawPayload;
				const toolName = CODEX_NATIVE_SPAWN_HOOK_NAMES.includes(invocation.toolName ?? "") ? "spawn_agent" : invocation.toolName;
				if (params.nativeModelAdmission && toolName && modelInputTools.includes(toolName)) {
					const admission = params.nativeModelAdmission;
					if (toolName.endsWith("spawn_agent")) return () => {
						assertAdmissionCurrent();
						if (!readCodexNativeChildThreadId(payload)) try {
							params.hostCapabilities.assertNativeSubagentSpawnAllowed?.();
						} catch (error) {
							return `${toErrorObject(error, "Native spawn participant selection failed").message} Use sessions_spawn with the requester's requester_profile.id as user.`;
						}
					};
					const input = isJsonObject(payload) ? payload.tool_input : void 0;
					const targetThreadId = isJsonObject(input) && typeof input.target === "string" ? input.target.trim() : void 0;
					const threadId = readCodexNativeChildThreadId(payload) ?? admission.threadId();
					if (!threadId || !targetThreadId || !invocation.turnId || !invocation.toolUseId) throw new Error("Codex native input requires exact sender, receiver, turn, and tool identities");
					assertAdmissionCurrent();
					const request = {
						client: admission.client(),
						threadId,
						turnId: invocation.turnId,
						itemId: invocation.toolUseId
					};
					await codexNativeSubagentMonitorRuntime.prepareModelInput({
						...request,
						target: targetThreadId,
						readQualification: admission.readQualification,
						signal: preparation.signal,
						assertCurrent: preparation.assertCurrent
					});
					assertAdmissionCurrent();
					return;
				}
				if (!params.nativeProcessAuthority || ![
					"Bash",
					"exec",
					"exec_command"
				].includes(invocation.toolName ?? "")) return;
				const rootThreadId = isJsonObject(payload) && typeof payload.session_id === "string" ? payload.session_id.trim() : void 0;
				const childThreadId = readCodexNativeChildThreadId(payload);
				const threadId = childThreadId ?? rootThreadId;
				if (!threadId || !invocation.turnId || !invocation.toolUseId) throw new Error("Codex native process admission requires exact thread, turn, and tool identities");
				params.nativeProcessAuthority.owner.admit(params.nativeProcessAuthority.client(), {
					threadId,
					turnId: invocation.turnId,
					itemId: invocation.toolUseId
				}, assertAdmissionCurrent, childThreadId ? rootThreadId : void 0);
			}
		} : void 0,
		approvalHost: params.hostCapabilities,
		assertActive: () => {
			params.hostCapabilities.assertActive();
			params.assertCurrent?.();
		},
		assertActiveAsync: params.assertCurrentAsync,
		retention: {
			readClaim: readCodexNativeChildThreadId,
			shouldRetainAfterForegroundClose: () => successfulYieldRetentionAuthorized && directChildClaims.size > 0,
			allowPreToolUse: (childThreadId) => directChildClaims.has(childThreadId),
			awaitForegroundAdmission: (childThreadId, signal) => {
				const existingClaim = directChildClaims.get(childThreadId);
				if (existingClaim) return Promise.resolve(assertClaim(childThreadId, existingClaim));
				if (foregroundClosed) return Promise.reject(/* @__PURE__ */ new Error("native hook relay foreground admission unavailable"));
				let pending = pendingDirectChildAdmissions.get(childThreadId);
				if (!pending) {
					if (pendingDirectChildAdmissions.size >= MAX_PENDING_DIRECT_CHILD_ADMISSIONS) return Promise.reject(/* @__PURE__ */ new Error("native hook relay foreground admission capacity reached"));
					pending = {
						...createDeferred(),
						waiters: 0
					};
					pendingDirectChildAdmissions.set(childThreadId, pending);
				}
				const admission = pending;
				admission.waiters++;
				let onAbort;
				return new Promise((resolve, reject) => {
					admission.promise.then(resolve, reject);
					onAbort = () => reject(toErrorObject(signal?.reason, "native hook relay admission aborted"));
					signal?.addEventListener("abort", onAbort, { once: true });
					if (signal?.aborted) onAbort();
				}).then((claim) => assertClaim(childThreadId, claim)).finally(() => {
					if (onAbort) signal?.removeEventListener("abort", onAbort);
					admission.waiters--;
					if (admission.waiters === 0 && pendingDirectChildAdmissions.get(childThreadId) === admission) pendingDirectChildAdmissions.delete(childThreadId);
				});
			},
			onDispose: () => {
				foregroundClosed = true;
				rejectPendingAdmissions("native hook relay registration closed");
				processAdmissionDisposed = true;
				releaseProcessAdmission?.();
				releaseExecutionPolicy?.();
				if (remoteCredential) {
					remoteCleanup = remoteCredential.dispose().catch((error) => params.remoteCallback?.onCleanupFailure(toErrorObject(error, "Native hook relay credential cleanup failed")));
					nativeHookRelayUnregisterQueue.track(remoteCleanup);
				}
			}
		},
		onPreToolUseFailure: params.onPreToolUseFailure,
		command: {
			nice: 10,
			timeoutMs: params.hostCapabilities.workspaceReadiness ? Math.max(params.options?.gatewayTimeoutMs ?? 0, params.attemptTimeoutMs) : params.options?.gatewayTimeoutMs
		}
	});
	if (!processAdmissionDisposed) try {
		releaseExecutionPolicy = params.retainExecutionPolicy?.();
		releaseProcessAdmission = params.nativeProcessAuthority?.owner.retainAdmission();
	} catch (error) {
		relay.unregister();
		throw error;
	}
	if (params.remoteCallback) {
		remoteCredential = createCodexNativeHookRemoteCredential({
			...params.remoteCallback,
			relay,
			signal: params.signal,
			assertCurrent: () => {
				params.hostCapabilities.assertActive();
				params.assertCurrent?.();
			},
			assertCurrentAsync: params.assertCurrentAsync
		});
		if (processAdmissionDisposed) remoteCredential.dispose();
	}
	return {
		...relay,
		unregister: () => {
			foregroundClosed = true;
			rejectPendingAdmissions("native hook relay foreground closed");
			relay.unregister();
		},
		prepareInvocation: async () => {
			await relay.prepareInvocation();
			await remoteCredential?.prepare();
		},
		drain: async () => {
			await relay.drain();
			await remoteCleanup;
		},
		commandForEvent: (event, commandOptions) => relay.commandForEvent(event, {
			...commandOptions,
			...remoteCredential ? { remoteCredentialPath: remoteCredential.path } : {}
		}),
		authorizeRetentionAfterSuccessfulYield: () => {
			successfulYieldRetentionAuthorized = true;
		},
		hasClaimedDirectChild: () => directChildClaims.size > 0,
		rejectPendingDirectChild: (threadIdInput, reason) => {
			const threadId = threadIdInput.trim();
			const pending = threadId ? pendingDirectChildAdmissions.get(threadId) : void 0;
			if (!pending) return;
			pendingDirectChildAdmissions.delete(threadId);
			pending.reject(new Error(reason));
		},
		claimDirectChild: (threadIdInput) => {
			const threadId = threadIdInput.trim();
			if (!threadId || directChildClaims.has(threadId)) return () => void 0;
			const claim = Symbol(threadId);
			directChildClaims.set(threadId, claim);
			const pending = pendingDirectChildAdmissions.get(threadId);
			pendingDirectChildAdmissions.delete(threadId);
			pending?.resolve(claim);
			return () => {
				if (directChildClaims.get(threadId) !== claim) return;
				directChildClaims.delete(threadId);
				if (foregroundClosed && directChildClaims.size === 0) {
					relay.unregister();
					nativeHookRelayUnregisterQueue.track(relay.drain());
				}
			};
		}
	};
}
function readCodexNativeChildThreadId(rawPayload) {
	if (!isJsonObject(rawPayload) || typeof rawPayload.agent_id !== "string") return;
	return rawPayload.agent_id.trim() || void 0;
}
function resolveCodexNativeHookRelayEvents(params) {
	if (params.configuredEvents?.length) return params.configuredEvents;
	return params.appServer.approvalPolicy === "never" ? CODEX_NATIVE_HOOK_RELAY_EVENTS : CODEX_NATIVE_HOOK_RELAY_EVENTS_WITH_APP_SERVER_APPROVALS;
}
function resolveCodexNativeHookRelayTtlMs(params) {
	if (params.explicitTtlMs !== void 0) return params.explicitTtlMs;
	const relayBudgetMs = params.attemptTimeoutMs + params.startupTimeoutMs + params.turnStartTimeoutMs + CODEX_NATIVE_HOOK_RELAY_TTL_GRACE_MS;
	return Math.max(CODEX_NATIVE_HOOK_RELAY_MIN_TTL_MS, Math.floor(relayBudgetMs));
}
function buildCodexNativeHookRelayId(params) {
	const hash = createHash("sha256");
	hash.update("openclaw:codex:native-hook-relay:v1");
	hash.update("\0");
	hash.update(params.agentId?.trim() || "");
	hash.update("\0");
	hash.update(params.sessionKey?.trim() || params.sessionId);
	return `codex-${hash.digest("hex").slice(0, 40)}`;
}
const CODEX_HOOK_EVENTS = {
	pre_tool_use: {
		name: "PreToolUse",
		keyLabel: "pre_tool_use"
	},
	post_tool_use: {
		name: "PostToolUse",
		keyLabel: "post_tool_use"
	},
	permission_request: {
		name: "PermissionRequest",
		keyLabel: "permission_request"
	},
	before_agent_finalize: {
		name: "Stop",
		keyLabel: "stop"
	}
};
const CODEX_SESSION_FLAGS_HOOK_SOURCE_PATHS = ["/<session-flags>/config.toml", "<session-flags>/config.toml"];
function buildCodexNativeHookRelayConfig(params) {
	const events = params.events?.length ? params.events : CODEX_NATIVE_HOOK_RELAY_EVENTS;
	const selectedEvents = new Set(events);
	const config = { "features.hooks": true };
	const hookState = {};
	for (const event of CODEX_NATIVE_HOOK_RELAY_EVENTS) {
		const { name, keyLabel } = CODEX_HOOK_EVENTS[event];
		const selected = selectedEvents.has(event);
		const shouldRelay = params.relay.shouldRelayEvent(event);
		if (!selected || !shouldRelay) {
			if (selected || params.clearOmittedEvents) config[`hooks.${name}`] = [];
			if (params.clearOmittedEvents) for (const sourcePath of CODEX_SESSION_FLAGS_HOOK_SOURCE_PATHS) hookState[`${sourcePath}:${keyLabel}:0:0`] = { enabled: false };
			continue;
		}
		const timeout = normalizeHookTimeoutSec(params.hookTimeoutSec);
		const command = params.relay.commandForEvent(event, {
			timeoutMs: resolveCodexNativeHookRelayCommandTimeoutMs(timeout),
			...params.remoteCredentialPath ? { remoteCredentialPath: params.remoteCredentialPath } : {}
		});
		const matcher = buildCodexNativeToolMatcher(params.relay.toolMatcherForEvent(event));
		const group = {
			...matcher ? { matcher } : {},
			hooks: [{
				type: "command",
				command,
				timeout,
				async: false,
				statusMessage: "OpenClaw native hook relay"
			}]
		};
		config[`hooks.${name}`] = [group];
		const state = {
			enabled: true,
			trusted_hash: `sha256:${fingerprintCodexPolicy({
				event_name: keyLabel,
				...group
			})}`
		};
		for (const sourcePath of CODEX_SESSION_FLAGS_HOOK_SOURCE_PATHS) hookState[`${sourcePath}:${keyLabel}:0:0`] = state;
	}
	config["hooks.state"] = hookState;
	return config;
}
function buildCodexNativeHookRelayDisabledConfig() {
	return {
		"features.hooks": false,
		"hooks.PreToolUse": [],
		"hooks.PostToolUse": [],
		"hooks.PermissionRequest": [],
		"hooks.Stop": []
	};
}
function normalizeHookTimeoutSec(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.ceil(value) : CODEX_NATIVE_HOOK_RELAY_DEFAULT_TIMEOUT_SEC;
}
function resolveCodexNativeHookRelayCommandTimeoutMs(hookTimeoutSec) {
	const parentTimeoutMs = finiteSecondsToTimerSafeMilliseconds(normalizeHookTimeoutSec(hookTimeoutSec)) ?? 5e3;
	const parentMarginMs = Math.min(CODEX_NATIVE_HOOK_RELAY_COMMAND_MAX_PARENT_MARGIN_MS, Math.max(CODEX_NATIVE_HOOK_RELAY_COMMAND_MIN_PARENT_MARGIN_MS, Math.floor(parentTimeoutMs / 5)));
	return Math.max(1, parentTimeoutMs - parentMarginMs);
}
function buildCodexNativeToolMatcher(toolNames) {
	if (toolNames === void 0) return;
	if (toolNames.length === 0) throw new TypeError("Codex native hook matcher requires at least one tool name");
	const nativeNames = /* @__PURE__ */ new Set();
	let hasCustomToolName = false;
	for (const toolName of toolNames) {
		const canonicalToolName = toolName.trim();
		if (!canonicalToolName || canonicalToolName === "*") throw new TypeError("Codex native hook matcher requires canonical OpenClaw tool ids");
		const nativeAliases = CODEX_HOOK_MATCHER_NAMES_BY_TOOL_ID[canonicalToolName];
		if (!nativeAliases) hasCustomToolName = true;
		for (const nativeName of nativeAliases ?? [canonicalToolName]) nativeNames.add(nativeName);
	}
	const sortedNames = Array.from(nativeNames).toSorted();
	if (!hasCustomToolName && sortedNames.every((toolName) => /^[A-Za-z0-9_]+$/.test(toolName))) return sortedNames.join("|");
	return `(?i)^(?:${sortedNames.map(escapeRegExp).join("|")})$`;
}
//#endregion
export { createGatewayProcessProjection as _, buildCodexNativeHookRelayDisabledConfig as a, isCodexDynamicToolExcluded as b, emitCodexNativePreToolUseFailureDiagnostic as c, scheduleCodexNativeHookRelayUnregister as d, codexNativeHookRemoteCredentialPath as f, createGatewayExecProjection as g, CODEX_NODE_EXEC_DYNAMIC_TOOL_NAME as h, buildCodexNativeHookRelayConfig as i, resolveCodexNativeHookRelayEvents as l, CODEX_GATEWAY_PROCESS_DYNAMIC_TOOL_NAME as m, CodexManagedHooksOnlyError as n, buildCodexNativeHookRelayId as o, CODEX_GATEWAY_EXEC_DYNAMIC_TOOL_NAME as p, assertCodexNativeHookRelayAllowed as r, createCodexNativeHookRelay as s, CODEX_NATIVE_HOOK_RELAY_TTL_GRACE_MS as t, resolveCodexNativeHookRelayTtlMs as u, createNodeExecAliasDynamicTool as v, placeDisabledNativeShellToolsInDirectNamespace as x, createSandboxShellProjection as y };
