import { n as coerceErrorMessage } from "./error-coercion-BwMr25F8.mjs";
import { n as captureAsyncWorkTracker, t as AsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-CwTBwQp1.mjs";
import { o as resolveFreshSessionTotalTokens } from "./types-BGDhC4_W.mjs";
import { i as readSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { a as resolveCliBackendConfig } from "./cli-backends-BzVT3JSM.mjs";
import { o as resolveContextEngine } from "./registry-BNFZRyO5.mjs";
import { r as resolveCompactionTimeoutMs, t as compactContextEngineWithSafetyTimeout } from "./compaction-safety-timeout-Cgwbj_da.mjs";
import { t as acquireAgentRunPreparedModelRuntime } from "./prepared-model-runtime-wDlPVSla.mjs";
import { i as resolveLiveToolResultMaxChars } from "./tool-result-limits-tYfGdUlb.mjs";
import { a as isBenignCompactionSkipReason, o as isBenignCompactionSkipResult } from "./compact-reasons-DEvuk_7a.mjs";
import { i as buildGenericCliContextEngineHostSupport } from "./host-compat-DWLjZN89.mjs";
import { t as registerLegacyContextEngine } from "./init-g-4TXKd7.mjs";
import { s as buildContextEngineRuntimeSettings } from "./context-engine-lifecycle-8o0i3Txa.mjs";
import { t as runWithAsyncWorkResources } from "./async-work-resources-DmPouonj.mjs";
import { a as maybeCompactAgentHarnessSession, o as isRecoverableNativeHarnessBindingFailure, t as acceptCompactionSuccessor } from "./compaction-successor-DzFpzm0P.mjs";
import { r as retainAgentHarnessCompactionSource } from "./host-capability-CtHEkIpy.mjs";
import "./tool-result-truncation-B6wvsjzz.mjs";
import { l as shouldPreemptivelyCompactBeforePrompt } from "./preemptive-compaction-Dka97wCW.mjs";
import { d as buildEmbeddedCompactionRuntimeContext, t as runContextEngineMaintenance } from "./context-engine-maintenance-DybI5s-J.mjs";
import { t as SessionManager } from "./session-manager-Mve5HWCW.mjs";
import { n as createPreparedEmbeddedAgentSettingsManager } from "./agent-project-settings-BRSKWrAu.mjs";
import { a as resolveEffectiveCompactionMode, n as applyAgentAutoCompactionGuard } from "./agent-settings-p_B_SpGc.mjs";
import { t as ensureSelectedAgentHarnessPlugin } from "./runtime-plugin-Cq540iGR.mjs";
import { n as clearCliSessionInStore } from "./cli-session-store-BqSinGQ9.mjs";
import { n as recordCliCompactionInStore, t as normalizeSessionTokenCount } from "./session-store-UkHKmgnn.mjs";
//#region src/agents/command/cli-compaction-context.ts
function buildCliCompactionParams(params) {
	return {
		agentId: params.sessionAgentId,
		config: params.cfg,
		sessionKey: params.sessionKey,
		workspaceDir: params.workspaceDir,
		cwd: params.cwd,
		agentDir: params.agentDir,
		provider: params.provider,
		model: params.model,
		skillsSnapshot: params.skillsSnapshot,
		messageChannel: params.messageChannel,
		agentAccountId: params.agentAccountId,
		senderIsOwner: params.senderIsOwner,
		thinkLevel: params.thinkLevel,
		extraSystemPrompt: params.extraSystemPrompt
	};
}
function buildCliCompactionRuntimeContext(params) {
	return {
		...buildEmbeddedCompactionRuntimeContext({
			...buildCliCompactionParams(params),
			messageProvider: params.messageChannel,
			authProfileId: params.authProfileId,
			modelId: params.model,
			harnessRuntime: params.harnessRuntime,
			modelSelectionLocked: params.modelSelectionLocked
		}),
		currentTokenCount: params.currentTokenCount,
		tokenBudget: params.contextTokenBudget,
		trigger: params.trigger
	};
}
//#endregion
//#region src/agents/command/cli-compaction.ts
const CODEX_APP_SERVER_OWNS_AUTO_COMPACTION_REASON = "codex app-server owns automatic compaction";
const log = createSubsystemLogger("agents/cli-compaction");
function isNativeHarnessCompactionSession(sessionEntry, provider) {
	const harnessId = sessionEntry?.agentHarnessId?.trim().toLowerCase();
	if (!harnessId || normalizeOptionalAgentRuntimeId(harnessId) === "openclaw") return false;
	const providerId = provider.trim().toLowerCase();
	return harnessId === providerId || harnessId === "copilot" && providerId === "github-copilot" || harnessId === "codex" && (providerId === "codex" || providerId === "openai");
}
async function compactCliTranscript(params) {
	const runtimeContext = buildCliCompactionRuntimeContext({
		...params,
		trigger: "cli_budget"
	});
	const runtimeSettings = buildContextEngineRuntimeSettings({
		contextEngineHost: buildGenericCliContextEngineHostSupport({
			backendId: params.provider,
			capabilities: ["compact", "maintain"]
		}),
		provider: params.provider,
		requestedModel: params.model,
		resolvedModel: params.model,
		selectedContextEngineId: params.contextEngine.info.id,
		contextEngineSelectionSource: "configured",
		promptTokenBudget: params.contextTokenBudget
	});
	let compactResult;
	params.assertActive();
	try {
		compactResult = await compactContextEngineWithSafetyTimeout(params.contextEngine, {
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			sessionTarget: {
				agentId: params.agentId,
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				...params.storePath ? { storePath: params.storePath } : {}
			},
			tokenBudget: params.contextTokenBudget,
			currentTokenCount: params.currentTokenCount,
			force: true,
			compactionTarget: "budget",
			runtimeContext,
			runtimeSettings
		}, resolveCompactionTimeoutMs(params.cfg), params.abortSignal);
	} catch (error) {
		const reason = coerceErrorMessage(error);
		if (isBenignCompactionSkipReason(reason)) {
			log.info(`CLI transcript compaction skipped for ${params.provider}/${params.model}: ${reason}`);
			return { compacted: false };
		}
		log.warn(`CLI transcript compaction failed for ${params.provider}/${params.model}: ${reason}`);
		return {
			compacted: false,
			failureReason: reason
		};
	}
	if (!compactResult.ok || !compactResult.compacted) {
		const reason = compactResult.reason;
		if (isBenignCompactionSkipResult(compactResult)) {
			log.info(`CLI transcript compaction skipped for ${params.provider}/${params.model}: ${reason}`);
			return { compacted: false };
		}
		log.warn(`CLI transcript compaction did not reduce context for ${params.provider}/${params.model}: ${reason ?? "compaction did not reduce context"}`);
		return {
			compacted: false,
			failureReason: compactResult.reason ?? "compaction did not reduce context"
		};
	}
	const result = compactResult.result;
	const successor = await acceptCompactionSuccessor({
		expectedEntry: params.expectedEntry,
		assertActive: params.assertActive,
		onCommitted: params.onCommitted,
		config: params.cfg,
		currentSessionFile: params.sessionFile,
		currentTarget: {
			agentId: params.agentId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		},
		result: compactResult
	});
	const outcome = {
		compacted: true,
		accepted: successor,
		...result?.tokensAfter !== void 0 ? { tokensAfter: result.tokensAfter } : {}
	};
	try {
		params.assertActive();
		await runContextEngineMaintenance({
			contextEngine: params.contextEngine,
			sessionId: successor.sessionId,
			sessionKey: params.sessionKey,
			sessionFile: successor.sessionFile,
			sessionTarget: successor.sessionTarget,
			reason: "compaction",
			...successor.previousSessionId ? {} : { sessionManager: params.sessionManager },
			runtimeContext,
			runtimeSettings,
			config: params.cfg,
			assertActive: params.assertActive
		});
	} catch (error) {
		try {
			params.assertActive();
		} catch {
			return outcome;
		}
		if (!params.bestEffortMaintenance) throw error;
		log.warn(`CLI transcript compaction maintenance failed after fallback for ${params.provider}/${params.model}: ${coerceErrorMessage(error)}`);
	}
	return outcome;
}
async function compactNativeHarnessCliTranscript(params) {
	let result;
	try {
		try {
			var _usingCtx$1 = _usingCtx();
			const nativeHarnessId = params.sessionEntry.agentHarnessId?.trim();
			const modelSelectionLocked = params.sessionEntry.modelSelectionLocked === true;
			const authProfileId = params.sessionEntry.authProfileOverride?.trim() || void 0;
			const preparedModelRuntime = _usingCtx$1.a(await acquireAgentRunPreparedModelRuntime({
				config: params.cfg,
				agentId: params.sessionAgentId,
				agentDir: params.agentDir,
				workspaceDir: params.workspaceDir,
				allowGatewaySubagentBinding: true,
				runtimePluginSelections: [{
					provider: params.provider,
					modelId: params.model,
					agentId: params.sessionAgentId,
					...nativeHarnessId ? { runtime: nativeHarnessId } : {}
				}]
			}, params.pluginGeneration ? { pluginGeneration: params.pluginGeneration } : {})).snapshot;
			result = await withPluginRuntimeGenerationScope(preparedModelRuntime, async () => {
				await ensureSelectedAgentHarnessPlugin({
					provider: params.provider,
					modelId: params.model,
					config: params.cfg,
					sessionKey: params.sessionKey,
					workspaceDir: params.workspaceDir,
					agentId: params.sessionAgentId,
					...nativeHarnessId ? { agentHarnessRuntimeOverride: nativeHarnessId } : {},
					pluginRegistry: preparedModelRuntime.pluginRegistry
				});
				params.assertActive();
				return await maybeCompactAgentHarnessSession({
					...buildCliCompactionParams(params),
					sessionId: params.sessionId,
					sessionFile: params.sessionFile,
					authProfileId,
					contextTokenBudget: params.contextTokenBudget,
					currentTokenCount: params.currentTokenCount,
					trigger: "budget",
					force: true,
					modelSelectionLocked,
					allowGatewaySubagentBinding: true,
					contextEngine: params.contextEngine,
					contextEngineRuntimeContext: buildCliCompactionRuntimeContext({
						...params,
						authProfileId,
						harnessRuntime: nativeHarnessId,
						modelSelectionLocked,
						trigger: "cli_native_budget"
					}),
					...nativeHarnessId ? { agentHarnessId: nativeHarnessId } : {},
					abortSignal: params.abortSignal
				}, {
					preparedModelRuntime,
					sourceAuthority: params.sourceAuthority
				});
			});
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			await _usingCtx$1.d();
		}
	} catch (error) {
		const reason = coerceErrorMessage(error);
		log.warn(`CLI native harness compaction failed for ${params.provider}/${params.model}: ${reason}`);
		return {
			compacted: false,
			failureReason: reason
		};
	}
	if (!result?.ok || !result.compacted) {
		const reason = result?.reason;
		if (result && isBenignCompactionSkipResult(result) || result?.ok === true && result.reason === CODEX_APP_SERVER_OWNS_AUTO_COMPACTION_REASON) {
			log.info(`CLI native harness compaction skipped for ${params.provider}/${params.model}: ${reason}`);
			return { compacted: false };
		}
		const recoverableBindingFailure = isRecoverableNativeHarnessBindingFailure(result);
		const fallbackToContextEngine = params.sessionEntry.modelSelectionLocked !== true && (result?.ok === false && result.failure?.reason === "unsupported_harness_compaction" || recoverableBindingFailure);
		log.warn(`CLI native harness compaction did not reduce context for ${params.provider}/${params.model}: ${reason}`);
		return {
			compacted: false,
			fallbackToContextEngine,
			clearCliSessionBinding: params.sessionEntry.modelSelectionLocked !== true && recoverableBindingFailure,
			failureReason: result?.reason ?? "native harness compaction did not reduce context"
		};
	}
	return {
		compacted: true,
		result
	};
}
/** Runs pre-turn compaction for a CLI session and returns the updated session entry. */
async function runCliTurnCompactionLifecycle(input, host) {
	const storePath = input.storePath;
	const contextTokenBudget = normalizeSessionTokenCount(input.sessionEntry?.contextTokens);
	if (!storePath || !contextTokenBudget) return input.sessionEntry;
	return await runWithAsyncWorkResources(async (onAcquired) => {
		const sourceAuthority = host.sourceAuthority;
		onAcquired({
			release: retainAgentHarnessCompactionSource(sourceAuthority),
			releaseBeforeResultWhenIdle: true
		});
		const operatorAuthority = sourceAuthority.operatorAuthority;
		const assertSourceActive = sourceAuthority.assertActive;
		const sourceSignal = operatorAuthority?.signal;
		const abortSignal = input.abortSignal && sourceSignal ? AbortSignal.any([input.abortSignal, sourceSignal]) : input.abortSignal ?? sourceSignal;
		const params = {
			...input,
			abortSignal
		};
		const assertActive = composeSessionSourceAssertion([
			assertSourceActive,
			operatorAuthority?.assertCurrent,
			host.assertActive
		], (assertSources) => {
			params.abortSignal?.throwIfAborted();
			assertSources();
		});
		assertActive();
		const capturedEntry = await readSessionEntryReadOnlyInWorker({
			agentId: params.sessionAgentId,
			sessionKey: params.sessionKey,
			storePath,
			readConsistency: "latest"
		}, assertActive);
		const expectedEntry = {
			sessionId: params.sessionId,
			lifecycleRevision: capturedEntry?.lifecycleRevision,
			activeWriterRunId: capturedEntry?.activeWriterRunId
		};
		const onCommitted = (accepted) => {
			if (params.sessionStore) params.sessionStore[params.sessionKey] = accepted.entry;
			host.onCommitted?.(accepted);
		};
		const sessionManager = await SessionManager.openAsync({
			agentId: params.sessionAgentId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			storePath
		});
		assertActive();
		const sessionFile = params.sessionKey;
		const settingsManager = createPreparedEmbeddedAgentSettingsManager({
			sessionId: params.sessionId,
			cwd: params.cwd ?? params.workspaceDir,
			agentDir: params.agentDir,
			cfg: params.cfg,
			pluginMetadataSnapshot: params.pluginGeneration?.pluginMetadataSnapshot ?? getCurrentPluginMetadataSnapshot({
				config: params.cfg,
				env: process.env,
				workspaceDir: params.workspaceDir
			}),
			contextTokenBudget
		});
		assertActive();
		const preemptiveCompaction = shouldPreemptivelyCompactBeforePrompt({
			messages: sessionManager.buildSessionContext().messages,
			prompt: "",
			contextTokenBudget,
			reserveTokens: settingsManager.getCompactionReserveTokens(),
			toolResultMaxChars: resolveLiveToolResultMaxChars({ contextWindowTokens: contextTokenBudget })
		});
		const currentTokenCount = Math.max(preemptiveCompaction.estimatedPromptTokens, normalizeSessionTokenCount(resolveFreshSessionTotalTokens(params.sessionEntry)) ?? 0);
		if (!preemptiveCompaction.shouldCompact && currentTokenCount <= preemptiveCompaction.promptBudgetBeforeReserve) return params.sessionEntry;
		const cliBackendId = params.cliBackendId?.trim() || params.provider;
		const resolvedBackend = resolveCliBackendConfig(cliBackendId, params.cfg);
		const nativeSessionEntry = isNativeHarnessCompactionSession(params.sessionEntry, params.provider) ? params.sessionEntry : void 0;
		const lockedHarnessRuntime = normalizeOptionalAgentRuntimeId(params.sessionEntry?.agentHarnessId);
		if (params.sessionEntry?.modelSelectionLocked === true && lockedHarnessRuntime !== "openclaw" && !nativeSessionEntry) throw new Error("CLI compaction cannot replace a model-locked native harness runtime");
		if (resolvedBackend?.ownsNativeCompaction && !nativeSessionEntry) {
			log.info(`CLI backend "${cliBackendId}" owns native compaction — deferring to backend`);
			return params.sessionEntry;
		}
		let compactionKind;
		let contextCompactionOutcome;
		let nativeOutcome;
		let resolvedContextEngine;
		const authProfileId = params.sessionEntry?.authProfileOverride?.trim() || void 0;
		const work = new AsyncWorkScope();
		const trackCleanup = captureAsyncWorkTracker();
		let result;
		let failure;
		try {
			result = await work.run(async () => {
				if (!nativeSessionEntry) assertActive();
				resolvedContextEngine = await resolveContextEngine(params.cfg, { initialize: registerLegacyContextEngine });
				applyAgentAutoCompactionGuard({
					settingsManager,
					contextEngineInfo: resolvedContextEngine.info,
					compactionMode: resolveEffectiveCompactionMode(params.cfg)
				});
				if (nativeSessionEntry) {
					nativeOutcome = await compactNativeHarnessCliTranscript({
						...params,
						sessionFile,
						sessionEntry: nativeSessionEntry,
						contextTokenBudget,
						currentTokenCount,
						contextEngine: resolvedContextEngine,
						assertActive,
						sourceAuthority: {
							assertActive,
							operatorAuthority
						}
					});
					if (nativeOutcome.compacted) compactionKind = "native-harness";
					else if (!nativeOutcome.fallbackToContextEngine && nativeOutcome.failureReason) throw new Error(`CLI native harness compaction failed for ${params.provider}/${params.model}: ${nativeOutcome.failureReason}`);
				}
				if (!nativeOutcome || nativeOutcome.fallbackToContextEngine) {
					assertActive();
					const contextOutcome = await compactCliTranscript({
						...params,
						agentId: params.sessionAgentId,
						contextEngine: resolvedContextEngine,
						sessionFile,
						sessionManager,
						storePath,
						harnessRuntime: params.sessionEntry?.agentHarnessId,
						modelSelectionLocked: params.sessionEntry?.modelSelectionLocked,
						contextTokenBudget,
						currentTokenCount,
						authProfileId,
						bestEffortMaintenance: nativeOutcome?.fallbackToContextEngine === true,
						expectedEntry,
						assertActive,
						onCommitted
					});
					contextCompactionOutcome = contextOutcome;
					compactionKind = contextOutcome.compacted ? "context-engine" : void 0;
					if (!compactionKind && contextOutcome.failureReason) throw new Error(`CLI transcript compaction failed for ${params.provider}/${params.model}: ${contextOutcome.failureReason}`);
				}
				if (nativeOutcome?.clearCliSessionBinding && !compactionKind && params.sessionStore) {
					assertActive();
					return await clearCliSessionInStore({
						agentId: params.sessionAgentId,
						provider: params.provider,
						sessionKey: params.sessionKey,
						sessionStore: params.sessionStore,
						storePath,
						expectedSessionId: params.sessionId,
						assertCommitAllowed: assertActive
					}) ?? params.sessionEntry;
				}
				if (!compactionKind || !params.sessionStore) return params.sessionEntry;
				const recorded = await recordCliCompactionInStore({
					agentId: params.sessionAgentId,
					compactionKind,
					sessionKey: params.sessionKey,
					sessionStore: params.sessionStore,
					storePath,
					tokensAfter: nativeOutcome?.result?.result?.tokensAfter ?? contextCompactionOutcome?.tokensAfter,
					expectedSession: contextCompactionOutcome?.accepted?.entry ?? expectedEntry
				});
				if (!recorded) throw new Error("Session changed before CLI compaction could be recorded");
				return recorded;
			});
		} catch (error) {
			failure = { error };
		}
		const cleanup = async () => {
			try {
				await AsyncWorkScope.runWhenAllIdle(() => [work], () => resolvedContextEngine?.dispose?.());
			} finally {
				await work.run(() => work.drain());
			}
		};
		if (work.hasPendingWork) trackCleanup(cleanup).catch((error) => {
			log.warn(`CLI compaction engine cleanup failed: ${String(error)}`);
		});
		else try {
			await cleanup();
		} catch (error) {
			failure ??= { error };
		}
		if (failure) throw failure.error;
		return result;
	});
}
//#endregion
export { runCliTurnCompactionLifecycle };
