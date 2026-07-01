import { t as log } from "./logger-DibNup0x.js";
import "./agent-harness-runtime-Ogl9lVKP.js";
import { d as resolveCodexAppServerRuntimeOptions } from "./config-aGxLKWj0.js";
import { c as withCodexAppServerBindingLock, l as writeCodexAppServerBinding, o as readCodexAppServerBinding, t as CODEX_APP_SERVER_BINDING_GUARDED_REQUEST_TIMEOUT_MS } from "./session-binding-BkFXqxOt.js";
import { u as releaseLeasedSharedCodexAppServerClient } from "./shared-client-ChYWHlb8.js";
import { n as resolveCodexNativeExecutionBlock } from "./sandbox-guard-Bz6I90fx.js";
import { t as defaultLeasedCodexAppServerClientFactory } from "./client-factory-CAYIb9bX.js";
//#region extensions/codex/src/app-server/compact.ts
/**
* Native Codex app-server compaction bridge for bound OpenClaw sessions.
*/
const warnedIgnoredCompactionOverrides = /* @__PURE__ */ new Set();
/**
* Starts native Codex compaction for a manually requested bound session, or
* reports why Codex-owned automatic compaction should handle the trigger.
*/
async function maybeCompactCodexAppServerSession(params, options = {}) {
	warnIfIgnoringOpenClawCompactionOverrides(params);
	return compactCodexNativeThread(params, options);
}
function warnIfIgnoringOpenClawCompactionOverrides(params) {
	const ignoredConfig = readIgnoredCompactionOverridePaths(params);
	if (ignoredConfig.length === 0) return;
	const warningKey = ignoredConfig.join("\0");
	if (warnedIgnoredCompactionOverrides.has(warningKey)) return;
	warnedIgnoredCompactionOverrides.add(warningKey);
	log.warn("ignoring OpenClaw compaction overrides for Codex app-server compaction; Codex uses native server-side compaction", {
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		ignoredConfig
	});
}
function readIgnoredCompactionOverridePaths(params) {
	const ignored = /* @__PURE__ */ new Set();
	for (const entry of readCompactionOverrideEntries(params)) {
		const localProvider = typeof entry.record.provider === "string" ? entry.record.provider.trim() : "";
		const inheritedProvider = !localProvider && typeof entry.inheritedRecord?.provider === "string" ? entry.inheritedRecord.provider.trim() : "";
		const providerPath = localProvider ? `${entry.path}.compaction.provider` : inheritedProvider && entry.inheritedPath ? `${entry.inheritedPath}.compaction.provider` : void 0;
		if (typeof entry.record.model === "string" && entry.record.model.trim()) ignored.add(`${entry.path}.compaction.model`);
		if (providerPath) ignored.add(providerPath);
	}
	return [...ignored];
}
function readCompactionOverrideEntries(params) {
	const entries = [];
	const defaultCompaction = readRecord(readRecord(params.config?.agents)?.defaults)?.compaction;
	const defaultRecord = readRecord(defaultCompaction);
	if (defaultRecord) entries.push({
		path: "agents.defaults",
		record: defaultRecord
	});
	const agentId = readAgentIdFromSessionKey(params.sessionKey ?? params.sandboxSessionKey);
	if (!agentId) return entries;
	const agentCompaction = readRecord((Array.isArray(params.config?.agents?.list) ? params.config.agents.list : []).find((agent) => {
		return (typeof agent?.id === "string" ? agent.id.trim().toLowerCase() : "") === agentId;
	}))?.compaction;
	const agentRecord = readRecord(agentCompaction);
	if (agentRecord) entries.push({
		path: `agents.list.${agentId}`,
		record: agentRecord,
		inheritedRecord: defaultRecord,
		inheritedPath: "agents.defaults"
	});
	return entries;
}
function readAgentIdFromSessionKey(sessionKey) {
	const parts = sessionKey?.trim().toLowerCase().split(":").filter(Boolean) ?? [];
	if (parts.length < 3 || parts[0] !== "agent") return;
	return parts[1]?.trim() || void 0;
}
function readRecord(value) {
	return value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
async function compactCodexNativeThread(params, options = {}) {
	if (params.trigger !== "manual" && !options.allowNonManualNativeRequest) {
		log.info("skipping codex app-server compaction for non-manual trigger", {
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			trigger: params.trigger
		});
		return {
			ok: true,
			compacted: false,
			reason: "codex app-server owns automatic compaction",
			result: {
				summary: "",
				firstKeptEntryId: "",
				tokensBefore: params.currentTokenCount ?? 0,
				details: {
					backend: "codex-app-server",
					skipped: true,
					reason: "non_manual_trigger",
					trigger: params.trigger ?? "unknown"
				}
			}
		};
	}
	const nativeExecutionBlock = resolveCodexNativeExecutionBlock({
		config: params.config,
		sessionKey: params.sandboxSessionKey ?? params.sessionKey,
		sessionId: params.sessionId,
		surface: "native compaction"
	});
	if (nativeExecutionBlock) return {
		ok: false,
		compacted: false,
		reason: nativeExecutionBlock
	};
	const appServer = resolveCodexAppServerRuntimeOptions({ pluginConfig: options.pluginConfig });
	const initialBinding = await readCodexAppServerBinding(params.sessionFile, { config: params.config });
	if (!initialBinding?.threadId) return failedCodexThreadBindingCompactionResult(params, {
		reason: "no codex app-server thread binding",
		recovery: "missing_thread_binding"
	});
	let binding = initialBinding;
	const requestedAuthProfileId = params.authProfileId?.trim() || void 0;
	if (requestedAuthProfileId && binding.authProfileId && binding.authProfileId !== requestedAuthProfileId) return {
		ok: false,
		compacted: false,
		reason: "auth profile mismatch for session binding"
	};
	const shouldReleaseDefaultLease = !options.clientFactory;
	const client = await (options.clientFactory ?? defaultLeasedCodexAppServerClientFactory)(appServer.start, requestedAuthProfileId ?? binding.authProfileId, params.agentDir, params.config);
	try {
		if (options.allowNonManualNativeRequest) {
			const guardedResult = await withCodexAppServerBindingLock(params.sessionFile, async () => {
				const currentBinding = await readCodexAppServerBinding(params.sessionFile, { config: params.config });
				if (params.abortSignal?.aborted) return {
					started: false,
					result: skippedCodexNativeCompactionResult(params, {
						reason: "codex app-server compaction aborted before native compaction",
						code: "aborted_before_native_compaction",
						expectedThreadId: binding.threadId,
						currentThreadId: currentBinding?.threadId
					})
				};
				if (!currentBinding || !isSameNativeCompactionBinding(currentBinding, binding)) {
					log.warn("skipping codex app-server compaction because the thread binding changed", {
						sessionId: params.sessionId,
						sessionKey: params.sessionKey,
						expectedThreadId: binding.threadId,
						currentThreadId: currentBinding?.threadId
					});
					return {
						started: false,
						result: skippedCodexNativeCompactionResult(params, {
							reason: "codex app-server binding changed before native compaction",
							code: "binding_changed_before_native_compaction",
							expectedThreadId: binding.threadId,
							currentThreadId: currentBinding?.threadId
						})
					};
				}
				binding = currentBinding;
				await clearContextEngineProjectionBeforeNativeCompaction({
					sessionId: params.sessionId,
					sessionFile: params.sessionFile,
					binding,
					config: params.config
				});
				await client.request("thread/compact/start", { threadId: binding.threadId }, { timeoutMs: Math.min(appServer.requestTimeoutMs, CODEX_APP_SERVER_BINDING_GUARDED_REQUEST_TIMEOUT_MS) });
				return { started: true };
			});
			if (!guardedResult.started) return guardedResult.result;
		} else await client.request("thread/compact/start", { threadId: binding.threadId });
		log.info("started codex app-server compaction", {
			sessionId: params.sessionId,
			threadId: binding.threadId
		});
	} catch (error) {
		if (isCodexThreadNotFoundError(error)) return failedCodexThreadBindingCompactionResult(params, {
			threadId: binding.threadId,
			reason: formatCompactionError(error),
			recovery: "stale_thread_binding"
		});
		log.warn("codex app-server compaction failed", {
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			threadId: binding.threadId,
			reason: formatCompactionError(error)
		});
		return {
			ok: false,
			compacted: false,
			reason: formatCompactionError(error)
		};
	} finally {
		if (shouldReleaseDefaultLease) releaseLeasedSharedCodexAppServerClient(client);
	}
	const resultDetails = {
		backend: "codex-app-server",
		threadId: binding.threadId,
		signal: "thread/compact/start",
		pending: true,
		...options.allowNonManualNativeRequest ? {
			request: "after_context_engine",
			trigger: params.trigger ?? "unknown"
		} : {}
	};
	return {
		ok: true,
		compacted: false,
		result: {
			summary: "",
			firstKeptEntryId: "",
			tokensBefore: params.currentTokenCount ?? 0,
			details: resultDetails
		}
	};
}
function skippedCodexNativeCompactionResult(params, skipped) {
	return {
		ok: true,
		compacted: false,
		reason: skipped.reason,
		result: {
			summary: "",
			firstKeptEntryId: "",
			tokensBefore: params.currentTokenCount ?? 0,
			details: {
				backend: "codex-app-server",
				skipped: true,
				reason: skipped.code,
				request: "after_context_engine",
				trigger: params.trigger ?? "unknown",
				...skipped.expectedThreadId ? { expectedThreadId: skipped.expectedThreadId } : {},
				...skipped.currentThreadId ? { currentThreadId: skipped.currentThreadId } : {}
			}
		}
	};
}
function failedCodexThreadBindingCompactionResult(params, recovery) {
	log.warn("codex app-server compaction could not use thread binding", {
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		threadId: recovery.threadId,
		reason: recovery.reason,
		recovery: recovery.recovery
	});
	return {
		ok: false,
		compacted: false,
		reason: recovery.reason,
		failure: {
			reason: recovery.recovery,
			rawError: recovery.reason
		}
	};
}
async function clearContextEngineProjectionBeforeNativeCompaction(params) {
	const contextEngineBinding = params.binding.contextEngine;
	if (!contextEngineBinding?.projection) return;
	await writeCodexAppServerBinding(params.sessionFile, {
		...params.binding,
		contextEngine: {
			...contextEngineBinding,
			projection: void 0
		},
		createdAt: params.binding.createdAt
	}, { config: params.config });
	log.info("cleared codex context-engine projection before native compaction", {
		sessionId: params.sessionId,
		threadId: params.binding.threadId,
		previousEpoch: contextEngineBinding.projection.epoch,
		previousFingerprint: contextEngineBinding.projection.fingerprint
	});
}
function isSameNativeCompactionBinding(current, expected) {
	return current.threadId === expected.threadId && current.authProfileId === expected.authProfileId && current.contextEngine?.engineId === expected.contextEngine?.engineId && current.contextEngine?.policyFingerprint === expected.contextEngine?.policyFingerprint && current.contextEngine?.projection?.mode === expected.contextEngine?.projection?.mode && current.contextEngine?.projection?.epoch === expected.contextEngine?.projection?.epoch && current.contextEngine?.projection?.fingerprint === expected.contextEngine?.projection?.fingerprint;
}
function isCodexThreadNotFoundError(error) {
	return formatCompactionError(error).toLowerCase().includes("thread not found");
}
function formatCompactionError(error) {
	if (error instanceof Error) return error.message;
	return String(error);
}
//#endregion
export { maybeCompactCodexAppServerSession };
