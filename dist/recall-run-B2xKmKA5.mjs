import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as resolveAgentDir, d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { n as parseSqliteSessionFileMarker, t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { s as patchSessionEntry, t as cleanupSessionLifecycleArtifacts } from "./session-store-runtime-BS2ijndm.mjs";
import "./routing-CEr1aXk1.mjs";
import { c as readSessionTranscriptEvents } from "./session-transcript-runtime-Bo9r2tlZ.mjs";
import "./agent-runtime-BhLWDirV.mjs";
import { s as ACTIVE_MEMORY_RECALL_LANE, t as ACTIVE_MEMORY_CLEANUP_RETRY_DELAYS_MS } from "./types-DgEaE0BK.mjs";
import { c as resolvePersistentTranscriptBaseDir, l as resolveSafeTranscriptDir, r as isMissingRegisteredMemoryToolsError } from "./config-BzmnyTfk.mjs";
import { r as buildRecallPrompt } from "./prompt-C_-mB5HW.mjs";
import { h as toSingleLineErrorMessage } from "./recall-state-5LQNrO5V.mjs";
import { a as resolveRecallRunChannelContext } from "./session-DJIe3gwV.mjs";
import { t as readMergedActiveMemoryTranscriptState } from "./transcript-watch-jwW3PeYQ.mjs";
import { i as readMemoryToolResultEvidence, o as readPartialAssistantTextFromSources, t as attachPartialTimeoutData } from "./transcript-result-DRiLFirn.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import { setTimeout } from "node:timers/promises";
//#region extensions/active-memory/recall-run.ts
async function persistActiveMemoryTranscriptArtifact(params) {
	const events = /* @__PURE__ */ new Set();
	for (const source of params.sources) {
		let sourceEvents;
		try {
			sourceEvents = await readSessionTranscriptEvents(source);
		} catch {
			continue;
		}
		for (const event of sourceEvents) events.add(JSON.stringify(event));
	}
	if (events.size === 0) return;
	await fs.mkdir(path.dirname(params.sessionFile), {
		recursive: true,
		mode: 448
	});
	await fs.writeFile(params.sessionFile, `${[...events].join("\n")}\n`, {
		encoding: "utf8",
		mode: 384
	});
}
async function cleanupActiveMemoryRecallSession(params) {
	const sessionKeySegmentPrefix = parseAgentSessionKey(params.sessionKey)?.rest ?? params.sessionKey;
	let lastError;
	for (const delayMs of ACTIVE_MEMORY_CLEANUP_RETRY_DELAYS_MS) {
		if (delayMs > 0) await setTimeout(delayMs);
		try {
			const result = await cleanupSessionLifecycleArtifacts({
				agentId: params.agentId,
				archiveRemovedEntryTranscripts: false,
				orphanTranscriptMinAgeMs: 0,
				sessionKeySegmentPrefix,
				storePath: params.storePath,
				transcriptContentMarker: `"runId":"${params.sessionId}"`
			});
			if (result.removedEntries !== 1) throw new Error(`active-memory recall cleanup removed ${String(result.removedEntries)} sessions`);
			return;
		} catch (error) {
			lastError = error;
		}
	}
	throw lastError instanceof Error ? lastError : /* @__PURE__ */ new Error(`active-memory recall cleanup failed: ${String(lastError)}`);
}
async function runRecallSubagent(params) {
	const workspaceDir = resolveAgentWorkspaceDir(params.runtimeConfig, params.agentId);
	const agentDir = resolveAgentDir(params.runtimeConfig, params.agentId);
	const modelRef = params.modelRef;
	if (!modelRef) return { rawReply: "NONE" };
	const subagentSessionId = `active-memory-${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}`;
	const parentSessionKey = params.parentSessionKey;
	const subagentScope = parentSessionKey ?? params.sessionId ?? crypto.randomUUID();
	const subagentSuffix = `active-memory:${crypto.createHash("sha1").update(`${subagentScope}:${params.query}:${subagentSessionId}`).digest("hex").slice(0, 12)}`;
	const subagentSessionKey = parentSessionKey ? `${parentSessionKey}:${subagentSuffix}` : `agent:${params.agentId}:${subagentSuffix}`;
	const persistedDir = params.config.persistTranscripts ? resolveSafeTranscriptDir(resolvePersistentTranscriptBaseDir(params.api, params.agentId), params.config.transcriptDir) : void 0;
	const artifactSessionFile = persistedDir !== void 0 ? path.join(persistedDir, `${subagentSessionId}.jsonl`) : void 0;
	const storePath = params.storePath;
	const runtimeSessionFile = formatSqliteSessionFileMarker({
		agentId: params.agentId,
		sessionId: subagentSessionId,
		storePath
	});
	const runtimeSource = {
		agentId: params.agentId,
		sessionId: subagentSessionId,
		sessionKey: subagentSessionKey,
		storePath
	};
	const transcriptSources = [runtimeSource];
	let harnessHasUsableMemoryResult = false;
	let harnessHasUnavailableMemorySearchResult = false;
	let transcriptArtifactPersisted = false;
	let runtimeSessionCreated = false;
	let resultStatus;
	const readRecallEvidence = async () => {
		const state = await readMergedActiveMemoryTranscriptState({
			sources: transcriptSources,
			toolsAllow: params.config.toolsAllow
		});
		return {
			...state,
			hasUsableMemoryResult: state.hasUsableMemoryResult || harnessHasUsableMemoryResult,
			hasUnavailableMemorySearchResult: state.hasUnavailableMemorySearchResult || harnessHasUnavailableMemorySearchResult
		};
	};
	const cleanupRecallResources = async () => {
		try {
			if (runtimeSessionCreated) {
				if (artifactSessionFile && !transcriptArtifactPersisted) await persistActiveMemoryTranscriptArtifact({
					sources: transcriptSources,
					sessionFile: artifactSessionFile
				}).catch((error) => {
					const message = toSingleLineErrorMessage(error);
					params.api.logger.debug?.(`active-memory: failed to persist recall transcript ${artifactSessionFile}: ${message}`);
				});
				await cleanupActiveMemoryRecallSession({
					agentId: params.agentId,
					sessionId: subagentSessionId,
					sessionKey: subagentSessionKey,
					storePath
				}).catch((error) => {
					const message = toSingleLineErrorMessage(error);
					params.api.logger.warn?.(`active-memory: failed to clean up recall session ${subagentSessionKey}: ${message}`);
					throw error;
				});
			}
		} catch (error) {
			attachPartialTimeoutData(error, { cleanupFailed: true });
			throw error;
		}
	};
	try {
		const runtimeEntry = {
			pluginOwnerId: params.api.id,
			sessionId: subagentSessionId,
			sessionFile: runtimeSessionFile,
			updatedAt: Date.now()
		};
		if ((await patchSessionEntry({
			agentId: params.agentId,
			fallbackEntry: runtimeEntry,
			replaceEntry: true,
			sessionKey: subagentSessionKey,
			skipMaintenance: true,
			storePath,
			update: (_entry, context) => context.existingEntry ? null : runtimeEntry
		}))?.sessionId !== subagentSessionId) throw new Error(`active-memory recall session already exists: ${subagentSessionKey}`);
		runtimeSessionCreated = true;
		params.onTranscriptSources?.(transcriptSources);
		if (persistedDir) {
			await fs.mkdir(persistedDir, {
				recursive: true,
				mode: 448
			});
			await fs.chmod(persistedDir, 448).catch(() => void 0);
		}
		const prompt = buildRecallPrompt({
			config: params.config,
			query: params.query,
			searchQuery: params.searchQuery
		});
		const { messageChannel, messageProvider } = resolveRecallRunChannelContext({
			api: params.api,
			agentId: params.agentId,
			sessionKey: parentSessionKey,
			sessionId: params.sessionId,
			messageProvider: params.messageProvider,
			channelId: params.channelId
		});
		const embeddedTimeoutMs = params.config.timeoutMs + params.config.setupGraceTimeoutMs;
		const result = await params.api.runtime.agent.runEmbeddedAgent({
			sessionId: subagentSessionId,
			sessionKey: subagentSessionKey,
			agentId: params.agentId,
			sessionTarget: {
				agentId: params.agentId,
				sessionId: subagentSessionId,
				sessionKey: subagentSessionKey,
				storePath
			},
			messageChannel,
			messageProvider,
			sessionFile: runtimeSessionFile,
			workspaceDir,
			agentDir,
			config: params.runtimeConfig,
			prompt,
			provider: modelRef.provider,
			model: modelRef.model,
			lane: ACTIVE_MEMORY_RECALL_LANE,
			timeoutMs: embeddedTimeoutMs,
			runId: subagentSessionId,
			trigger: "manual",
			conversationRecall: params.conversationRecall,
			memoryAudience: params.memoryAudience,
			toolsAllow: [...params.config.toolsAllow],
			disableMessageTool: true,
			allowGatewaySubagentBinding: true,
			bootstrapContextMode: "lightweight",
			verboseLevel: "off",
			thinkLevel: params.config.thinking,
			fastMode: params.fastMode,
			reasoningLevel: "off",
			silentExpected: true,
			authProfileFailurePolicy: "local",
			cliBackendDispatch: "subscription-auth",
			cleanupBundleMcpOnRunEnd: true,
			abortSignal: params.abortSignal,
			onAgentToolResult: (event) => {
				const evidence = readMemoryToolResultEvidence({
					...event,
					toolsAllow: params.config.toolsAllow
				});
				harnessHasUsableMemoryResult ||= evidence.hasUsableMemoryResult;
				harnessHasUnavailableMemorySearchResult ||= evidence.hasUnavailableMemorySearchResult;
			}
		}).finally(params.onEmbeddedRunSettled);
		resultStatus = result.meta.error ? "failed" : void 0;
		const agentMeta = result.meta.agentMeta;
		const activeSessionFile = normalizeOptionalString(agentMeta?.sessionFile);
		const activeSessionId = parseSqliteSessionFileMarker(activeSessionFile)?.sessionId ?? (activeSessionFile === subagentSessionKey ? normalizeOptionalString(agentMeta?.sessionId) : void 0);
		if (activeSessionId && activeSessionId !== subagentSessionId) transcriptSources.push({
			...runtimeSource,
			sessionId: activeSessionId
		});
		params.onTranscriptSources?.(transcriptSources);
		if (params.abortSignal?.aborted) {
			const reason = params.abortSignal.reason;
			if (reason instanceof Error) throw reason;
			const abortErr = reason !== void 0 ? new Error("Operation aborted", { cause: reason }) : /* @__PURE__ */ new Error("Operation aborted");
			abortErr.name = "AbortError";
			throw abortErr;
		}
		const rawReply = (result.payloads ?? []).filter((payload) => payload.isError !== true).map((payload) => payload.text?.trim() ?? "").filter(Boolean).join("\n").trim();
		if (artifactSessionFile) {
			await persistActiveMemoryTranscriptArtifact({
				sources: transcriptSources,
				sessionFile: artifactSessionFile
			});
			transcriptArtifactPersisted = true;
		}
		return {
			rawReply: rawReply || "NONE",
			resultStatus,
			transcriptPath: artifactSessionFile,
			...await readRecallEvidence()
		};
	} catch (error) {
		if (params.abortSignal?.aborted) {
			const partialReply = await readPartialAssistantTextFromSources(transcriptSources);
			attachPartialTimeoutData(error, {
				rawReply: partialReply ?? void 0,
				resultStatus,
				...await readRecallEvidence()
			});
		}
		if (!params.abortSignal?.aborted && isMissingRegisteredMemoryToolsError(error, params.config.toolsAllow)) {
			params.api.logger.debug?.(`active-memory: no configured memory tools available; skipping sub-agent`);
			return {
				rawReply: "NONE",
				resultStatus: "unavailable"
			};
		}
		if (!params.abortSignal?.aborted) {
			const message = toSingleLineErrorMessage(error);
			params.api.logger.warn?.(`active-memory: memory sub-agent failed, skipping recall: ${message}`);
			return {
				rawReply: "NONE",
				resultStatus: "failed"
			};
		}
		throw error;
	} finally {
		await cleanupRecallResources();
	}
}
//#endregion
export { runRecallSubagent as t };
