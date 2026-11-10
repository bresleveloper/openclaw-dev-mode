import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as captureAsyncWorkTracker } from "./async-work-scope-BH2yUdBz.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import "./utils-gjJ-tD2q.mjs";
import { n as resolveSessionSkillExecutionWorkspace } from "./workspace-skill-roots-CL28VeX5.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { t as SkillLibraryError } from "./skill-library-error-z-Nwz4n5.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { m as hasLiveAgentRunContext } from "./agent-run-registry-gmaPgO-n.mjs";
import { f as sessionEntryCommitGuardOptions, o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { M as parseAgentSessionKey, w as isSubagentSessionKey } from "./session-key-CSDERtm3.mjs";
import { a as resolveAgentDir, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { t as hasAgentRosterProperty } from "./agent-roster-gkYP38su.mjs";
import { r as hasUsableOAuthCredential } from "./credential-state-NmgqOc1o.mjs";
import { t as DEFAULT_CONTEXT_TOKENS } from "./defaults-Bg930vxE.mjs";
import { _ as resolveSessionAgentIds } from "./agent-scope-DXrnO3F4.mjs";
import { c as normalizeToolPolicyName, i as expandToolGroups } from "./tool-policy-shared-PsZCKeeN.mjs";
import "./tool-policy-14GRhbFd.mjs";
import { t as findModelCatalogEntry } from "./model-catalog-lookup-BJKolYfz.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import { _ as resolveAdmittedRunActiveAssertion, b as runWithPreparedRunSourceScope, g as readRunOperatorAuthority, h as readPreparedRunOperatorAuthority, m as readAdmittedRunOperatorAuthority, n as assertOperatorModelAllowed, u as getAdmittedRunDelegatedAuthority, v as resolvePreparedRunAdmission } from "./admitted-run-context-h1ULFETN.mjs";
import { f as revokeMcpLoopbackClientGrant, h as transferMcpLoopbackClientGrant, i as deactivateMcpLoopbackClientGrantCapture, m as revokeMintedMcpLoopbackClientGrant, n as activateMcpLoopbackClientGrantCapture, o as mintMcpLoopbackClientGrant, r as bindMcpLoopbackClientGrantAdmission } from "./server-connection-work-CPT9-wld.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { a as runWithCliHistoryWriter, i as isKnownCliHistoryBoundary } from "./cli-history-boundary-B1eSXpAQ.mjs";
import { a as intersectSessionEventToolsAllow } from "./session-event-handoff-BLWR3ywE.mjs";
import { _ as narrowSessionEventSettings } from "./gateway-caller-context-Be176_GV.mjs";
import { r as getPluginToolMeta } from "./tool-metadata-CaNEdKPR.mjs";
import { n as canonicalizeMainSessionAlias } from "./main-session-CHYPkxYr.mjs";
import { a as buildOAuthRefreshFailureLoginCommand } from "./oauth-refresh-failure-H1_-S915.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { i as runWithSessionTranscriptReadFence, n as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { c as waitForSessionTranscriptProjection } from "./session-transcript-reconcile-BkwlDaaD.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { o as patchSessionEntryCore } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { i as captureOwnedTranscriptWriteAssertion } from "./transcript-write-context-C02sC3zd.mjs";
import "./config-B3oiWDlr.mjs";
import { t as withSessionTranscriptReadSource } from "./session-transcript-read-source-Bmo2UYck.mjs";
import { n as readSessionTranscriptAnchorsAsync } from "./session-transcript-anchor-read-DMRJnQDO.mjs";
import { n as recordModelFallbackStop } from "./model-fallback-stop-BtVvqU7l.mjs";
import { i as resolveSessionTranscriptDatabasePath } from "./session-accessor.transcript-target-DDngfM5X.mjs";
import { s as resolveProviderThinkingLevel } from "./thinking-BCNoGfZ5.mjs";
import { a as resolveAuthProfileOrder, c as isSetupCredentialAccessible } from "./order-CElLtwMu.mjs";
import { t as applyPluginTextReplacements } from "./plugin-text-transforms-B25e5LoI.mjs";
import { a as resolveCliBackendConfig } from "./cli-backends-BzVT3JSM.mjs";
import { a as resolveContextTokensForModel } from "./context-XynHJtne.mjs";
import { i as overlayConfiguredModelCatalog, n as loadManifestModelCatalog } from "./model-catalog-vYmFg90_.mjs";
import { t as resolveModelContextWindowProfile } from "./model-context-window-CoR3Uyg1.mjs";
import { n as DEFAULT_BOOTSTRAP_FILENAME } from "./workspace-bootstrap-policy-wM0DWL3B.mjs";
import { f as resolveRuntimeAuthProfileAgentDir } from "./store-BPXZsh12.mjs";
import { o as resolveContextEngine } from "./registry-BNFZRyO5.mjs";
import { n as getGlobalHookRunner } from "./hook-runner-global-yjqy4fXI.mjs";
import { c as createAgentQuestionAnswerAuthority, m as prepareReplyToolAuthorityCallerRead } from "./host-private-capabilities-eTr803c9.mjs";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-kYfv_bUN.mjs";
import { f as loadAuthProfileStoreForRuntimeAsync } from "./store-runtime-CwqGD12G.mjs";
import { i as resolveSandboxRuntimeStatusAsync } from "./runtime-status-DWm-5zUj.mjs";
import { n as resolveExecConfigState } from "./exec-defaults-DrIV-0KT.mjs";
import { a as isWorkspaceBootstrapPending } from "./workspace-3xrXOvoY.mjs";
import { a as hashCliSessionText, c as resolveCliSessionReuse } from "./cli-session-CBCjrsL6.mjs";
import { n as resolveEffectiveToolFsWorkspaceOnly } from "./tool-fs-policy-C65zBDHN.mjs";
import { n as acquireSessionMcpRuntime } from "./agent-bundle-mcp-manager-api-BF9Uyz8N.mjs";
import { t as loadSessionMcpConfig } from "./agent-bundle-mcp-runtime-config-BY_ItTpJ.mjs";
import { n as resolveApiKeyForProfile } from "./oauth-RJ_g0pTu.mjs";
import { i as buildGenericCliContextEngineHostSupport, r as assertContextEngineHostSupport } from "./host-compat-DWLjZN89.mjs";
import { r as materializeBundleMcpToolsForRun } from "./agent-bundle-mcp-materialize-BoIwB4F1.mjs";
import "./agent-bundle-mcp-tools-CR5Vro5t.mjs";
import { t as registerLegacyContextEngine } from "./init-g-4TXKd7.mjs";
import { t as prepareConversationCapabilityProfile } from "./conversation-capability-profile-BVWQsqkw.mjs";
import { t as buildAgentHookContextChannelFields } from "./hook-agent-context-C9bjjC7S.mjs";
import { r as messageToolOwnsVisibleReply, t as buildHarnessVisibleReplyGuidance } from "./source-reply-delivery-mode-CC4nGK9E.mjs";
import { g as resolveWorkspaceBootstrapRouting, h as isPrimaryBootstrapRun } from "./openclaw-tools-lor9xxfh.mjs";
import { t as isHeartbeatLifecycleRunKind } from "./bootstrap-mode-BarAnCx4.mjs";
import { n as prepareReplyToolAuthority } from "./reply-tool-authority-X6nNd9fP.mjs";
import { n as assertNativeCronCreatorCapabilities } from "./cron-tool-BLlbTzAZ.mjs";
import { r as remapSkillReferencePaths } from "./sandbox-skills-DF-8lllB.mjs";
import { t as claimHeartbeatContextForUserRun } from "./heartbeat-outcome-store-DsHDfEuS.mjs";
import { n as resolveRuntimeSkillsPrompt } from "./skills-prompt-2hkPSs7i.mjs";
import { i as buildBootstrapTruncationReportMeta, n as buildBootstrapBudgetState, r as buildBootstrapInjectionStats, s as buildBootstrapPromptWarningNotice } from "./bootstrap-budget-96UImSUD.mjs";
import { i as resolveBootstrapContextForRun, r as makeBootstrapWarn } from "./bootstrap-files-B2csFCe1.mjs";
import { t as ensureSandboxWorkspaceForSession } from "./context-Dz5vxKlZ.mjs";
import "./sandbox-4O9XYRNc.mjs";
import { n as waitForDeferredTurnMaintenanceForSession, s as resolvePromptBuildHookResult } from "./context-engine-maintenance-DybI5s-J.mjs";
import { a as resolveContextWindowInfo } from "./context-window-guard-y7ROXMY6.mjs";
import { t as applyFinalEffectiveToolPolicy } from "./effective-tool-policy-jDkqpuYg.mjs";
import { a as shouldCreateBundleMcpRuntimeForAttempt, n as mergeForcedEmbeddedAttemptToolsAllow, t as applyEmbeddedAttemptToolsAllow } from "./attempt-tool-construction-plan-D12sns28.mjs";
import { t as SessionManager } from "./session-manager-Mve5HWCW.mjs";
import { t as buildSessionContext } from "./session-manager-codec-DTpe_z-3.mjs";
import { r as buildModelIdentityPromptLine, t as appendModelIdentitySystemPrompt } from "./system-prompt-BDZF44Ov.mjs";
import { t as resolveRuntimeChannelPromptContext } from "./runtime-capabilities-CasEQ37J.mjs";
import { t as buildSystemPromptReport } from "./system-prompt-report-C-WiMmkI.mjs";
import { t as bindAgentRunTerminalWriteContext } from "./agent-run-terminal-writes-D1C5plfs.mjs";
import { t as beginContextEngineLogicalTurn } from "./context-engine-turn-begin-BnNzqIXZ.mjs";
import { i as resolveRunWorkspaceDir, t as redactRunIdentifier } from "./workspace-run-BDvmk-WD.mjs";
import { t as recordAdmittedModelRoutingDecision } from "./model-routing-decision-CSasL009.mjs";
import { t as resolveReusableWorkspaceSkillSnapshot } from "./session-snapshot-DMYLVDi5.mjs";
import { t as resolveBundledCliBackendAuthPolicy } from "./cli-backend-auth-policy-BJQR9lNK.mjs";
import { a as buildSystemAgentToolsMcpServerConfig } from "./openclaw-tools-serve-config-Cxb58Zge.mjs";
import { n as resolveCliAuthBindingFingerprint, r as resolveCliAuthEpoch } from "./cli-auth-epoch-DfSBzPUX.mjs";
import { a as projectNativeMcpRunContext } from "./bundle-mcp-codex-BSlJ5O5A.mjs";
import { n as cliBackendLog } from "./log-wVbGxCir.mjs";
import { a as normalizeCliModel, i as isClaudeCliBackendId, r as cliSessionToolNames } from "./helpers-pkXnPWuP.mjs";
import { t as CliBackendAuthProfilePreparationError } from "./cli-backend-errors-ngojFnXq.mjs";
import { c as CLAUDE_MANAGED_MCP_TIMEOUT_MS, i as prepareCliTurnPromptContext, l as applyClaudeManagedMcpTimeout, n as createCliCurrentPromptRenderer, o as prepareCliBundleMcpConfig, r as prepareCliSystemPrompt, s as resolveCliNativeWebSearchEnabled, t as composeCliPromptContext } from "./prompt-context-Cdevq6tT.mjs";
import { C as unsupportedIsolatedCompletionError, S as retainCliPluginExecutionConsumer, T as sequenceCliCleanups, b as createCliRunCurrentAssertion, o as getCliLiveSessionGeneration, w as runCliCleanup, x as resolveCliExecutionTarget } from "./cli-live-session-registry-dDPsvSOh.mjs";
import { t as resolveCliSessionId } from "./cli-run-recovery-uVHzVd4q.mjs";
import { a as createMcpLoopbackServerConfig, o as getActiveMcpLoopbackRuntime } from "./mcp-http.loopback-runtime-DxTYlVrU.mjs";
import { n as ensureMcpLoopbackServer, r as setBundleMcpToolServerInstructions } from "./mcp-http-DG-PZ6Kr.mjs";
import { n as resolveMcpLoopbackPolicyTools, r as resolveMcpLoopbackScopedTools } from "./mcp-http.runtime-BRgokr0L.mjs";
import { a as loadCliSessionPromptContext, c as CliAuthProfilePreparationError, d as claudeCliSessionTranscriptHasOrphanedToolUse, i as loadCliSessionHistoryMessages, n as hasCliSessionTranscript, o as resolveAutoCliSessionReseedHistoryChars, t as buildCliSessionHistoryPrompt, u as claudeCliSessionTranscriptHasContent } from "./session-history-CjZwLj4j.mjs";
import { t as ensureWritableSkillDirectories } from "./skill-directory-modes-DeO1nfYy.mjs";
import { n as buildCliMcpGrantContext, r as finalizeCliMcpGrant } from "./mcp-grant-context-CW5tETiH.mjs";
import { existsSync } from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { ensureSystemPromptCacheBoundary } from "@openclaw/ai/internal/shared";
//#region src/agents/cli-runner/bootstrap-transport.ts
function canTransportSystemPrompt(backend) {
	return backend.systemPromptWhen !== "never" && Boolean(backend.systemPromptArg || backend.systemPromptFileArg || backend.systemPromptFileConfigKey);
}
/** Refresh first-only and live CLI prompts when personal context changes or disappears. */
function resolveCliBootstrapPromptHash(params) {
	const personal = params.contextFiles.filter((file) => file.personalUser);
	if (params.bootstrapMode === "none" && params.bootstrapTruncationNotice === void 0 && personal.length === 0) return params.baseHash;
	return hashCliSessionText(JSON.stringify([
		params.baseHash ?? null,
		params.bootstrapMode,
		params.bootstrapTruncationNotice !== void 0,
		...personal.length ? [personal] : []
	]));
}
//#endregion
//#region src/agents/cli-runner/claude-skills-plugin.ts
const CLAUDE_CLI_BACKEND_ID = "claude-cli";
const OPENCLAW_CLAUDE_PLUGIN_NAME = "openclaw-skills";
function sanitizeSkillDirName(name, used) {
	const base = name.trim().replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "skill";
	const safeBase = base.startsWith(".") ? `skill-${base.replace(/^\.+/, "") || "skill"}` : base;
	let candidate = safeBase;
	for (let index = 2; used.has(candidate); index += 1) candidate = `${safeBase}-${index}`;
	used.add(candidate);
	return candidate;
}
async function linkOrCopySkillDir(params) {
	try {
		await fs$1.symlink(params.sourceDir, params.targetDir, process.platform === "win32" ? "junction" : "dir");
	} catch {
		await fs$1.cp(params.sourceDir, params.targetDir, {
			recursive: true,
			force: true,
			verbatimSymlinks: true
		});
		await ensureWritableSkillDirectories(path.dirname(params.targetDir), path.basename(params.targetDir));
	}
}
/** Prepares Claude CLI `--plugin-dir` args for the current session skill snapshot. */
async function prepareClaudeCliSkillsPlugin(params) {
	if (normalizeLowercaseStringOrEmpty(params.backendId) !== CLAUDE_CLI_BACKEND_ID) return {
		args: [],
		cleanup: async () => {}
	};
	if (params.skillsSnapshot?.librarySelections?.length) return {
		args: [],
		cleanup: async () => {}
	};
	const usedTargetNames = /* @__PURE__ */ new Set();
	const skills = (params.skillsSnapshot?.resolvedSkills ?? []).flatMap((skill) => {
		const name = skill.name?.trim();
		const skillFilePath = skill.filePath?.trim();
		if (!name || !skillFilePath) return [];
		if (!existsSync(skillFilePath)) {
			cliBackendLog.warn(`claude skill plugin skipped missing skill file: ${skillFilePath}`);
			return [];
		}
		return [{
			name,
			sourceDir: path.dirname(skillFilePath),
			targetDirName: sanitizeSkillDirName(name, usedTargetNames)
		}];
	});
	if (skills.length === 0) return {
		args: [],
		cleanup: async () => {}
	};
	const tempDir = await fs$1.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-claude-skills-"));
	const cleanup = () => fs$1.rm(tempDir, {
		recursive: true,
		force: true
	});
	const pluginDir = path.join(tempDir, OPENCLAW_CLAUDE_PLUGIN_NAME);
	const manifestDir = path.join(pluginDir, ".claude-plugin");
	const skillsDir = path.join(pluginDir, "skills");
	try {
		await fs$1.mkdir(manifestDir, {
			recursive: true,
			mode: 448
		});
		await fs$1.mkdir(skillsDir, {
			recursive: true,
			mode: 448
		});
		const manifest = {
			name: OPENCLAW_CLAUDE_PLUGIN_NAME,
			version: "0.0.0",
			description: "Session-scoped OpenClaw skills selected for this agent run.",
			skills: "./skills"
		};
		await fs$1.writeFile(path.join(manifestDir, "plugin.json"), `${JSON.stringify(manifest, null, 2)}\n`, {
			encoding: "utf-8",
			mode: 384
		});
		let linkedSkillCount = 0;
		for (const skill of skills) try {
			await linkOrCopySkillDir({
				sourceDir: skill.sourceDir,
				targetDir: path.join(skillsDir, skill.targetDirName)
			});
			linkedSkillCount += 1;
		} catch (error) {
			cliBackendLog.warn(`claude skill plugin skipped ${skill.name}: ${error instanceof Error ? error.message : String(error)}`);
		}
		if (linkedSkillCount === 0) {
			await cleanup();
			return {
				args: [],
				cleanup: async () => {}
			};
		}
		return {
			args: ["--plugin-dir", pluginDir],
			pluginDir,
			cleanup
		};
	} catch (error) {
		await cleanup().catch(() => void 0);
		throw error;
	}
}
//#endregion
//#region src/agents/cli-runner/history-boundary.ts
/**
* Another writer or lifecycle owns the session history. Local session state, not a provider
* failure: model fallback must stop instead of replaying the turn on another candidate.
*/
var CliHistoryOwnerChangedError = class extends Error {
	constructor() {
		super("CLI history owner changed before preparation");
		this.name = "CliHistoryOwnerChangedError";
	}
};
/**
* History belongs to the local transcript, not the latest native handle. Cover only
* a proven-empty start or the contiguous events of the previously admitted CLI run.
* An account transition, old-runtime write, import or unknown legacy prefix stays
* unknown until an explicitly empty context starts a new history boundary.
*/
async function prepareCliHistoryBoundary(params, identity) {
	try {
		return await prepareCliHistoryBoundaryOnce(params, identity);
	} catch (error) {
		if (params.abortSignal?.aborted || !(error instanceof Error) || error.message !== "CLI history changed before preparation") throw error;
	}
	return prepareCliHistoryBoundaryOnce(params, identity);
}
async function prepareCliHistoryBoundaryOnce(params, identity) {
	const source = params.sessionTarget;
	if (params.sessionManager || !source || source.sessionId !== params.sessionId || params.sessionKey !== void 0 && params.sessionKey !== source.sessionKey || !resolveAdmittedRunActiveAssertion(params.admittedRunContext, params.abortSignal)) return;
	const requested = {
		...source,
		storePath: resolveSessionTranscriptDatabasePath(source)
	};
	const admission = resolveSessionTranscriptReadFence(requested);
	const capturedAdmission = admission && structuredClone(admission);
	const assertRunCurrent = createCliRunCurrentAssertion(params);
	const assertOwned = captureOwnedTranscriptWriteAssertion(requested);
	const memory = captureSessionActorStorageOwner(requested, {
		assertCurrent: assertRunCurrent,
		authorize() {}
	});
	let assertPhysicalSource = () => {
		memory?.owner?.assertCurrent();
		memory?.binding?.actor.assertReadable();
		memory?.authority.assertCurrent();
	};
	const plan = memory ? await planCliHistoryBoundary(params, identity, {
		...requested,
		storePath: memory.path
	}, capturedAdmission, assertRunCurrent) : await withSessionTranscriptReadSource(requested, ({ scope, expectedIdentity, assertCurrent: assertReaderCurrent }) => {
		const target = {
			...requested,
			storePath: scope.storePath
		};
		assertPhysicalSource = () => {
			if (expectedIdentity) assertExistingDatabaseIdentity(target.storePath, expectedIdentity.key, expectedIdentity.birthtime);
		};
		return planCliHistoryBoundary(params, identity, target, capturedAdmission, () => {
			assertReaderCurrent();
			assertRunCurrent();
		});
	}, params.abortSignal);
	if (!plan) return;
	const { target, snapshot, watermark, boundary, allowed, writerRunId } = plan;
	const assertCurrent = composeSessionSourceAssertion([assertRunCurrent], (assertSource) => {
		assertSource();
		assertPhysicalSource();
	});
	assertCurrent();
	const commitGuard = sessionEntryCommitGuardOptions(composeSessionSourceAssertion([assertCurrent, composeSessionSourceAssertion([assertOwned], (assertSource) => {
		if (snapshot.activeWriterRunId !== void 0 && snapshot.activeWriterRunId !== writerRunId && hasLiveAgentRunContext(snapshot.activeWriterRunId)) throw new CliHistoryOwnerChangedError();
		assertSource();
	})]));
	if (!await patchSessionEntryCore(target, (current) => {
		if (current.sessionId !== target.sessionId || current.lifecycleRevision !== snapshot.lifecycleRevision || current.activeWriterRunId !== snapshot.activeWriterRunId || params.expectedLifecycleRevision !== void 0 && current.lifecycleRevision !== params.expectedLifecycleRevision) throw new CliHistoryOwnerChangedError();
		return {
			activeWriterRunId: writerRunId,
			cliHistoryBoundary: boundary
		};
	}, {
		preserveActivity: true,
		skipMaintenance: true,
		onCommitted: (entry) => {
			const callerEntry = params.sessionEntry;
			if (callerEntry?.sessionId === snapshot.sessionId && callerEntry.lifecycleRevision === snapshot.lifecycleRevision && callerEntry.activeWriterRunId === snapshot.activeWriterRunId) callerEntry.activeWriterRunId = entry.activeWriterRunId;
		},
		...commitGuard,
		workerGuard: {
			...commitGuard.workerGuard,
			cliHistory: {
				sessionId: target.sessionId,
				admission: capturedAdmission,
				watermark
			}
		}
	}) || !allowed || boundary.state !== "known") return;
	const assertActive = resolveAdmittedRunActiveAssertion(params.admittedRunContext);
	const assertWriterCurrent = () => {
		params.assertCurrent?.();
		if (!assertActive) throw new Error("CLI history writer is no longer active");
		assertActive();
	};
	const writer = {
		target: { ...target },
		runId: writerRunId,
		authFingerprint: boundary.authFingerprint,
		lifecycleRevision: snapshot.lifecycleRevision,
		assertCurrent: assertWriterCurrent,
		assertReadable: async () => {
			assertWriterCurrent();
			assertPhysicalSource();
			const authority = memory ? void 0 : (await readSessionTranscriptAnchorsAsync(target, {
				entryIds: [],
				contextAuthority: true
			}, params.abortSignal)).contextAuthority;
			assertWriterCurrent();
			assertPhysicalSource();
			const facts = memory?.binding?.actor.target.sessionKey === target.sessionKey ? memory.binding.actor.snapshot(memory.authority) : memory?.owner?.readSession(target.sessionKey, memory.authority);
			const current = memory ? facts?.entry : authority?.entry;
			const proof = current?.cliHistoryBoundary;
			const tip = memory ? facts?.transcript.watermark : authority?.watermark;
			if (!current || current.sessionId !== target.sessionId || current.lifecycleRevision !== snapshot.lifecycleRevision || current.activeWriterRunId !== writerRunId || !isKnownCliHistoryBoundary(proof) || proof.sessionId !== target.sessionId || proof.writerRunId !== writerRunId || proof.authFingerprint !== boundary.authFingerprint || !tip || proof.generation !== tip.generation || proof.maxSeq !== tip.maxSeq) throw new Error("CLI history authority changed before execution");
		}
	};
	const authority = getAdmittedRunDelegatedAuthority(params.admittedRunContext);
	if (!authority) throw new Error("CLI history writer is no longer active");
	bindAgentRunTerminalWriteContext(authority, { run: (write) => runWithCliHistoryWriter(writer, write) });
	return writer;
}
async function planCliHistoryBoundary(params, identity, target, admission, assertCurrent) {
	await waitForSessionTranscriptProjection(target, params.abortSignal);
	assertCurrent();
	const facts = await readSessionTranscriptAnchorsAsync(target, {
		entryIds: [],
		contextAuthority: true,
		...admission ? { contextValidation: { admission } } : {}
	}, params.abortSignal);
	assertCurrent();
	const authority = facts.contextAuthority;
	const snapshot = authority?.entry;
	if (!authority || !snapshot || snapshot.sessionId !== target.sessionId) return;
	const { watermark } = authority;
	const priorMaxSeq = admission ? admission.rawSeq - 1 : watermark.maxSeq;
	const currentUserIsLast = !admission || watermark.maxSeq === admission.rawSeq;
	const stored = snapshot.cliHistoryBoundary;
	const credential = identity.credential;
	const owner = credential?.type === "oauth" ? credential.accountId?.trim() || credential.email?.trim() ? [
		"oauth",
		credential.provider,
		credential.accountId,
		credential.email,
		credential.clientId,
		credential.enterpriseUrl,
		credential.projectId
	] : void 0 : credential?.type === "api_key" && credential.key?.trim() ? [
		"api_key",
		credential.provider,
		credential.key
	] : credential?.type === "token" && credential.token?.trim() ? [
		"token",
		credential.provider,
		credential.token
	] : void 0;
	const fingerprint = owner ? sha256Hex(JSON.stringify([
		"cli-history-v1",
		normalizeProviderId(params.provider),
		owner
	])) : void 0;
	const writerRunId = params.expectedWriterRunId ?? params.runId;
	let allowed = Boolean(fingerprint && currentUserIsLast && params.cliSessionBinding?.forceReuse !== true && isKnownCliHistoryBoundary(stored) && stored.sessionId === target.sessionId && stored.authFingerprint === fingerprint && stored.generation === watermark.generation && (stored.maxSeq === priorMaxSeq || admission && stored.writerRunId === writerRunId && stored.maxSeq === watermark.maxSeq));
	if (!allowed && fingerprint && currentUserIsLast && !params.cliSessionId && !params.cliSessionBinding) {
		let truncated = false;
		const branch = (await SessionManager.openBoundedAsync(target, {
			signal: params.abortSignal,
			maxBytes: 1048576,
			maxEvents: 100,
			onTruncated: () => {
				truncated = true;
			}
		})).getBranch();
		assertCurrent();
		allowed = !truncated && buildSessionContext(branch).messages.length === 0;
	}
	allowed &&= watermark.maxSeq === null || typeof watermark.generation === "string";
	if (!allowed && !stored) return;
	return {
		target,
		snapshot,
		watermark,
		boundary: allowed && fingerprint ? {
			version: 1,
			sessionId: target.sessionId,
			state: "known",
			authFingerprint: fingerprint,
			generation: watermark.generation,
			maxSeq: watermark.maxSeq,
			writerRunId
		} : {
			version: 1,
			sessionId: target.sessionId,
			state: "unknown"
		},
		allowed,
		writerRunId
	};
}
//#endregion
//#region src/agents/cli-runner/loopback-bundle-mcp.ts
/**
* Exclusive CLI runs cannot pass configured MCP servers to the CLI: native
* servers bypass per-turn caps. Materialize them as OpenClaw tools instead, so
* the Gateway lists one stable catalog and enforces each turn's policy on call.
*/
async function prepareCliLoopbackBundleMcp(params) {
	const { run } = params;
	if (!run.sessionId) return;
	const configuredServers = loadSessionMcpConfig({
		workspaceDir: params.workspaceDir,
		cfg: params.config,
		toolOverrides: run.toolOverrides,
		logDiagnostics: false
	});
	if (Object.keys(configuredServers.loaded.mcpServers).length === 0) return;
	const capabilityProfile = await params.resolveCapabilityProfile();
	const mcpConfig = {
		workspaceDir: params.workspaceDir,
		cfg: params.config,
		toolOverrides: run.toolOverrides,
		toolDenylist: capabilityProfile.policy.explicitToolDenylist
	};
	const { loaded, safeServerNamesByServer } = loadSessionMcpConfig({
		...mcpConfig,
		logDiagnostics: false
	});
	if (Object.keys(loaded.mcpServers).length === 0) return;
	const toolsAllow = params.runtimeToolsAllow ?? run.cliToolAvailability?.openClaw;
	if (!shouldCreateBundleMcpRuntimeForAttempt({
		toolsEnabled: true,
		disableTools: run.disableTools,
		toolsAllow,
		resolveConfiguredMcpNamespaces: () => Object.keys(params.config.mcp?.servers ?? {}).flatMap((name) => {
			const safeName = Object.hasOwn(loaded.mcpServers, name) ? safeServerNamesByServer.get(name) : void 0;
			return safeName ? [`${safeName}__`] : [];
		})
	})) return;
	let materialized;
	try {
		const acquisition = await acquireSessionMcpRuntime({
			...mcpConfig,
			sessionId: run.sessionId,
			sessionKey: run.sessionKey,
			agentId: params.agentId,
			agentDir: params.agentDir,
			requesterSenderId: void 0,
			agentAccountId: run.agentAccountId,
			messageChannel: run.messageChannel ?? run.messageProvider
		});
		materialized = await materializeBundleMcpToolsForRun({
			...acquisition,
			agentId: params.agentId
		});
		const servers = acquisition.runtime.peekCatalog()?.servers ?? {};
		for (const tool of materialized.tools) {
			const serverName = getPluginToolMeta(tool)?.mcp?.serverName;
			if (serverName && Object.hasOwn(servers, serverName)) setBundleMcpToolServerInstructions(tool, serverName, servers[serverName]?.instructions);
		}
	} catch (error) {
		cliBackendLog.warn(`configured MCP servers unavailable for this CLI run: ${String(error)}`);
		return;
	}
	if (materialized.restrictAppTools) materialized.restrictAppTools(applyFinalEffectiveToolPolicy({
		bundledTools: applyEmbeddedAttemptToolsAllow(materialized.appTools ?? materialized.tools, toolsAllow, { toolMeta: (tool) => getPluginToolMeta(tool) }),
		config: params.config,
		workspaceDir: params.workspaceDir,
		conversationCapabilityProfile: capabilityProfile,
		warn: (message) => cliBackendLog.warn(message)
	}));
	let owned = true;
	const dispose = () => materialized.dispose();
	return {
		tools: materialized.tools,
		takeCleanup: () => {
			owned = false;
			return dispose;
		},
		[Symbol.asyncDispose]: async () => {
			if (owned) {
				owned = false;
				await dispose();
			}
		}
	};
}
//#endregion
//#region src/agents/cli-runner/prepare-claude.ts
const CLAUDE_CLI_CONTEXT_MODEL_ALIASES = {
	opus: "claude-opus-5-5",
	"opus-5": "claude-opus-5",
	"opus-5-5": "claude-opus-5-5",
	"opus-4-8": "claude-opus-4-8",
	"opus-4-7": "claude-opus-4-7",
	"opus-4-6": "claude-opus-4-6",
	sonnet: "claude-sonnet-5-5",
	"sonnet-5-5": "claude-sonnet-5-5",
	"sonnet-5": "claude-sonnet-5",
	"sonnet-4-6": "claude-sonnet-4-6",
	fable: "claude-fable-5-1",
	"fable-5": "claude-fable-5",
	"fable-5-1": "claude-fable-5-1"
};
function resolveClaudeCliContextModelId(modelId) {
	const trimmed = modelId.trim();
	const alias = trimmed.toLowerCase().replace(/-(\d+)\.(\d+)$/, "-$1-$2");
	return CLAUDE_CLI_CONTEXT_MODEL_ALIASES[alias] ?? trimmed;
}
function detectNodeClaudePlacement(params) {
	if (params.backendId === "claude-cli" && params.execHost === "node" && !params.execNode?.trim()) throw new Error("node-placed Claude CLI session is missing execNode");
	return params.backendId === "claude-cli" && params.execHost === "node" && Boolean(params.execNode?.trim());
}
//#endregion
//#region src/agents/cli-runner/run-admission.ts
/** Keep the logical model ceiling across CLI transport mapping and asynchronous preparation. */
function prepareCliRunModelAuthority(params) {
	const operatorAuthority = readRunOperatorAuthority(params);
	const model = params.requesterModel;
	assertOperatorModelAllowed(operatorAuthority, model);
	if (!operatorAuthority) return params;
	const assertCallerCurrent = params.assertCurrent;
	return {
		...params,
		assertCurrent: () => {
			assertCallerCurrent?.();
			assertOperatorModelAllowed(operatorAuthority, model);
		}
	};
}
async function admitCliRunParams(candidate, agentId) {
	const admittedRunContext = await resolvePreparedRunAdmission({
		runId: candidate.runId,
		runtimeKind: "embedded",
		admittedRunContext: candidate.admittedRunContext,
		preparedRunAdmission: candidate.preparedRunAdmission
	});
	candidate.assertCurrent?.();
	const { preparedRunAdmission: _preparedRunAdmission, ...rest } = candidate;
	return {
		...rest,
		agentId,
		admittedRunContext
	};
}
//#endregion
//#region src/agents/cli-runner/prepare-mcp.ts
/** Project native MCP from the same requester and runtime cap as mediated tools. */
async function resolveCliNativeMcpPolicy(run, options) {
	const requesterSessionKey = run.sessionKey ?? options.policySessionKey;
	const sandboxStatus = await resolveSandboxRuntimeStatusAsync({
		cfg: options.config,
		sessionKey: options.policySessionKey,
		agentId: options.policyAgentId,
		preparedSessionEntry: options.policySessionKey === run.sessionKey ? run.sessionEntry : void 0
	});
	return prepareConversationCapabilityProfile({
		...projectNativeMcpRunContext(run),
		config: options.config,
		sessionKey: options.policySessionKey,
		sandboxSessionKey: requesterSessionKey,
		preparedSessionEntry: run.sessionEntry && requesterSessionKey ? {
			sessionKey: requesterSessionKey,
			entry: run.sessionEntry
		} : void 0,
		runSessionKey: run.sessionKey && run.sessionKey !== options.policySessionKey ? run.sessionKey : void 0,
		agentId: options.policyAgentId,
		modelProvider: options.modelProvider,
		modelId: options.modelId,
		workspaceDir: options.workspaceDir,
		cwd: options.cwd,
		sandboxToolPolicy: sandboxStatus.sandboxed ? sandboxStatus.toolPolicy : void 0,
		runtimeToolAllowlist: options.runtimeToolsAllowPolicy,
		inheritRuntimeToolAllowlist: true
	});
}
/** Project the CLI tool surface before prompt construction, retaining its exact run admission. */
async function prepareCliMcpToolProjection(params, options) {
	const requestedToolsAllow = options.runtimeToolsAllowPolicy ?? params.cliToolAvailability?.openClaw;
	const context = requestedToolsAllow !== void 0 ? {
		...options.context,
		toolsAllow: [...requestedToolsAllow]
	} : options.context;
	const resolveTools = options.runtimeToolsAllowPolicy !== void 0 ? options.resolvePolicyTools : options.resolveScopedTools;
	const admittedParams = await admitCliRunParams(params, options.agentId);
	const { tools } = await resolveTools({
		...options.scope,
		defaultMediatedToolNames: options.defaultMediatedToolNames,
		signal: admittedParams.abortSignal,
		context,
		admittedRunContext: admittedParams.admittedRunContext
	});
	return {
		params: admittedParams,
		tools
	};
}
/** Resolve default coding ownership without changing exact, standalone, or node runs. */
function resolveCliMcpToolOwnership(run, options) {
	return {
		hostOwnedTools: options.enabled && resolveExecConfigState({
			cfg: run.config,
			sessionEntry: run.sessionEntry,
			execOverrides: run.execOverrides,
			agentId: run.agentId,
			sessionKey: run.sessionKey
		}).host !== "node" && run.cliToolAvailability === void 0 && options.backend.nativeToolMode === "selectable" && options.backend.toolAvailabilityEnforcement === "execution-args" && options.backend.resolveExecutionArgs !== void 0 ? options.backend.hostOwnedTools?.map(normalizeToolPolicyName) : void 0,
		nodeWorkshopEnabled: options.nodePlacement && !options.skipPreparation && run.disableTools !== true && run.skillLibraryAuthoring !== void 0
	};
}
/** Bind the projected catalog and native authority to one prepared CLI grant. */
function prepareCliMcpGrant(run, options) {
	const exclusiveTools = run.cliToolAvailability !== void 0 || options.promptBuildRestrictsTools;
	const toolsAllow = run.cliToolAvailability?.openClaw ?? (exclusiveTools || options.hostOwnedTools !== void 0 ? options.tools.map((tool) => tool.name) : void 0);
	const projectNativeToolAuthority = options.nativeAuthorityAllowed && run.disableTools !== true ? options.projectNativeToolAuthority : void 0;
	return {
		exclusiveTools,
		projectNativeToolAuthority,
		mcpGrant: finalizeCliMcpGrant(options.context, toolsAllow, Boolean(projectNativeToolAuthority), run)
	};
}
//#endregion
//#region src/agents/cli-runner/model-capabilities.ts
/** Selects both CLI capabilities from the same logical/native catalog identity. */
function resolveCliCatalogCapabilities(params) {
	const providers = uniqueStrings([params.provider, params.modelProvider].filter((provider) => Boolean(provider)));
	const models = uniqueStrings([params.modelId, params.normalizedModel]);
	let thinkingEntry;
	let selectableContextEntry;
	for (const provider of providers) {
		for (const modelId of models) {
			const entry = findModelCatalogEntry(params.catalog, {
				provider,
				modelId
			});
			thinkingEntry ??= entry;
			if (entry?.contextWindows?.length) {
				selectableContextEntry = entry;
				break;
			}
		}
		if (selectableContextEntry) break;
	}
	return {
		selectableContextEntry,
		providerThinkingLevel: resolveProviderThinkingLevel({
			provider: thinkingEntry?.provider ?? params.modelProvider ?? params.provider,
			model: thinkingEntry?.id ?? params.normalizedModel,
			catalog: params.catalog,
			agentRuntime: params.agentRuntime,
			level: params.thinkLevel
		})
	};
}
//#endregion
//#region src/agents/cli-runner/prepare-model-context.ts
/** Resolve alias-aware model limits and effort from the same prepared catalog. */
function prepareCliModelContext({ params, backendResolved, runConfig, workspaceDir, modelId, normalizedCatalogModel }) {
	const isClaudeCli = isClaudeCliBackendId(params.provider);
	const requestedContextModelId = isClaudeCli ? resolveClaudeCliContextModelId(modelId) : modelId;
	const normalizedContextModelId = isClaudeCli ? resolveClaudeCliContextModelId(normalizedCatalogModel) : normalizedCatalogModel;
	const contextTokenCandidates = uniqueStrings([requestedContextModelId, normalizedContextModelId]).map((model) => resolveContextTokensForModel({
		cfg: params.config,
		provider: params.provider,
		modelProvider: backendResolved.modelProvider,
		model,
		modelContextWindow: params.modelContextWindow,
		modelContextTokens: params.modelContextTokens,
		allowAsyncLoad: false,
		allowUnscopedModelLookup: false
	})).filter((tokens) => tokens !== void 0);
	let modelContextTokens = contextTokenCandidates.length ? Math.min(...contextTokenCandidates) : DEFAULT_CONTEXT_TOKENS;
	const { selectableContextEntry, providerThinkingLevel } = resolveCliCatalogCapabilities({
		catalog: overlayConfiguredModelCatalog({
			catalog: loadManifestModelCatalog({
				config: runConfig,
				workspaceDir
			}),
			config: runConfig,
			workspaceDir
		}),
		provider: params.provider,
		modelProvider: backendResolved.modelProvider,
		modelId,
		normalizedModel: normalizedCatalogModel,
		agentRuntime: backendResolved.id,
		thinkLevel: params.thinkLevel
	});
	if (selectableContextEntry) {
		const contextWindowProfile = resolveModelContextWindowProfile({
			catalogEntry: selectableContextEntry,
			selected: params.contextWindow
		});
		if (contextWindowProfile.contextWindow && contextWindowProfile.contextTokens !== void 0) modelContextTokens = Math.min(modelContextTokens, contextWindowProfile.contextTokens);
	}
	const resolvedContextWindowInfo = resolveContextWindowInfo({
		cfg: params.config,
		provider: params.provider,
		modelId,
		modelContextTokens,
		defaultTokens: DEFAULT_CONTEXT_TOKENS
	});
	const contextWindowInfo = resolvedContextWindowInfo.tokens > modelContextTokens ? {
		tokens: modelContextTokens,
		source: "model"
	} : resolvedContextWindowInfo;
	return {
		contextWindowInfo,
		providerThinkingLevel,
		autoReseedHistoryChars: isClaudeCli ? resolveAutoCliSessionReseedHistoryChars(contextWindowInfo.tokens) : void 0
	};
}
//#endregion
//#region src/agents/cli-runner/prepare-source.ts
/** Restore the selected source before preparing against its exact current-turn fence. */
async function runWithCliPreparationSource(params, prepare) {
	if (!params.sessionManager && params.sessionTarget) {
		const { restoreSessionColdTranscript } = await import("./session-cold-storage-Doo7Aerf.mjs");
		await restoreSessionColdTranscript(params.sessionTarget);
	}
	return runWithSessionTranscriptReadFence(params.sessionManager ? void 0 : params.userTurnTranscriptRecorder?.getAdmissionReceipt(), () => runWithPreparedRunSourceScope(params, prepare));
}
//#endregion
//#region src/agents/cli-runner/prepare-tool-policy.ts
/**
* Translate the caller's runtime tool cap into the CLI run's exact tool availability.
* Native CLI tools cannot enforce channel or inherited completion caps, so those
* runs expose their whole surface through the mediated MCP policy projection.
*/
async function resolveCliRuntimeToolPolicy(input) {
	let { params } = input;
	let runtimeToolsAllowPolicy;
	let managedNativeTools = [];
	if (params.toolsAllow !== void 0) {
		if (params.cliToolAvailability !== void 0) throw new Error(`CLI backend ${input.backendId} received conflicting runtime tool policies`);
		if (params.toolsAllow.some((toolName) => normalizeToolPolicyName(toolName) === "*")) params = {
			...params,
			toolsAllow: void 0
		};
		else {
			runtimeToolsAllowPolicy = [...params.toolsAllow];
			const fallbackOpenClawTools = expandToolGroups(params.toolsAllow);
			if (fallbackOpenClawTools.includes("write") && !fallbackOpenClawTools.includes("apply_patch")) fallbackOpenClawTools.push("apply_patch");
			params = {
				...params,
				toolsAllow: void 0,
				cliToolAvailability: {
					native: [],
					openClaw: fallbackOpenClawTools
				}
			};
		}
	}
	if (params.disableTools === true && !input.isSideQuestion && input.canEnforceExactToolAvailability) {
		runtimeToolsAllowPolicy = void 0;
		params = {
			...params,
			toolsAllow: void 0,
			cliToolAvailability: {
				native: [],
				openClaw: []
			}
		};
	}
	const requesterSessionKey = params.sessionKey ?? input.policySessionKey;
	const requesterPolicy = params.disableTools === true || params.trustedInternalHandoff ? void 0 : (await prepareConversationCapabilityProfile({
		...params,
		agentId: input.policyAgentId,
		sessionKey: input.policySessionKey,
		sandboxSessionKey: requesterSessionKey,
		preparedSessionEntry: params.sessionEntry && requesterSessionKey ? {
			sessionKey: requesterSessionKey,
			entry: params.sessionEntry
		} : void 0,
		modelProvider: params.modelProvider ?? params.provider,
		modelId: params.model
	})).policy;
	const senderRestricted = requesterPolicy?.inheritedToolPolicySource === "sender";
	const delegatedExecution = Boolean(requesterPolicy?.delegatedToolPolicy);
	const workspaceOnly = params.controlOperation === void 0 && !(input.isSideQuestion && input.sideQuestionToolMode === "disabled") && resolveEffectiveToolFsWorkspaceOnly({
		cfg: params.config,
		agentId: input.policyAgentId
	});
	const ordinaryClaudeMediation = input.backendId === "claude-cli" && input.bundleMcp && input.canEnforceExactToolAvailability && !input.isSideQuestion && !input.skipsTurnPreparation && params.sessionEntry?.execHost !== "node" && params.cliToolAvailability === void 0 && resolveExecConfigState({
		cfg: params.config,
		sessionEntry: params.sessionEntry,
		execOverrides: params.execOverrides,
		agentId: input.policyAgentId,
		sessionKey: input.policySessionKey
	}).host !== "node";
	if ((params.trustedInternalHandoff || senderRestricted || delegatedExecution || workspaceOnly || ordinaryClaudeMediation) && params.disableTools !== true) {
		if (!input.canEnforceExactToolAvailability || !input.bundleMcp || input.skipsTurnPreparation || params.sessionEntry?.execHost === "node" || params.trustedInternalHandoff?.settleBatch !== void 0) throw new Error(`CLI backend ${input.backendId} cannot enforce ${senderRestricted ? "conversation" : delegatedExecution ? "delegated execution" : params.trustedInternalHandoff ? "completion" : "workspace-only"} tool policy`);
		managedNativeTools = params.cliToolAvailability === void 0 && !senderRestricted && !delegatedExecution && !workspaceOnly ? [...input.resolveManagedNativeTools?.({
			config: params.config,
			agentId: input.policyAgentId
		}) ?? []] : [];
		const exactWorkspaceTools = workspaceOnly && params.cliToolAvailability && runtimeToolsAllowPolicy === void 0 ? [...params.cliToolAvailability.openClaw, ...input.projectNativeToolAuthority?.(params.cliToolAvailability.native) ?? []] : void 0;
		if (exactWorkspaceTools === void 0) runtimeToolsAllowPolicy ??= senderRestricted ? params.cliToolAvailability?.openClaw ?? ["*"] : ["*"];
		params = {
			...params,
			toolsAllow: void 0,
			cliToolAvailability: {
				native: managedNativeTools,
				openClaw: exactWorkspaceTools ?? []
			}
		};
	}
	return {
		params,
		runtimeToolsAllowPolicy,
		managedNativeTools
	};
}
/**
* Bootstrap routing needs the run's final file access: a native file-capable
* selection, or Claude's mediated OpenClaw read plus write tools. Managed native
* selections confer no file capability by backend contract.
*/
function resolveCliBootstrapFileAccess(input) {
	const { backend, params, managedNativeTools, projectedToolNames } = input;
	const selectedNativeToolsProvideFileAccess = params.cliToolAvailability === void 0 || params.cliToolAvailability.native.some((name) => !managedNativeTools.includes(name));
	const mediatedBootstrapFileAccess = backend.id === "claude-cli" && projectedToolNames.includes("read") && projectedToolNames.some((name) => ["write", "apply_patch"].includes(name));
	return ((backend.nativeToolMode === "always-on" || backend.nativeToolMode === "selectable") && selectedNativeToolsProvideFileAccess || mediatedBootstrapFileAccess) && params.disableTools !== true;
}
/** Apply a `before_prompt_build` tool cap to both native and mediated CLI tools. */
function capCliToolAvailability(availability, toolsAllow) {
	const cap = (names) => applyEmbeddedAttemptToolsAllow(names.map((name) => ({ name })), toolsAllow).map((tool) => tool.name);
	return {
		native: cap(availability.native),
		openClaw: cap(availability.openClaw)
	};
}
/** Operator-managed native tools that survived every later per-turn cap. */
function keptManagedNativeTools(managedNativeTools, params) {
	return managedNativeTools.filter((name) => params.cliToolAvailability?.native.includes(name));
}
//#endregion
//#region src/agents/cli-runner/skills-prompt.ts
async function resolveCliSkillsPrompt(params) {
	params.assertCurrent();
	const agentWorkspaceDir = resolveAgentWorkspaceDir(params.config ?? {}, params.agentId);
	const executionWorkspace = resolveSessionSkillExecutionWorkspace(params.run.sessionEntry?.worktree?.canonicalWorkspaceDir, params.executionWorkspaceDir);
	const skillsSnapshot = params.run.skillsSnapshot ?? (await resolveReusableWorkspaceSkillSnapshot({
		assertCurrent: params.assertCurrent,
		workspaceDir: agentWorkspaceDir,
		...executionWorkspace,
		config: params.config ?? {},
		agentId: params.agentId,
		watch: false
	})).snapshot;
	params.assertCurrent();
	const sandboxWorkspace = await ensureSandboxWorkspaceForSession({
		skillsSnapshot,
		config: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		workspaceDir: params.workspaceDir
	});
	params.assertCurrent();
	return resolveRuntimeSkillsPrompt({
		sandbox: sandboxWorkspace ? {
			...sandboxWorkspace,
			enabled: true
		} : void 0,
		skillsAnchorWorkspace: sandboxWorkspace?.workspaceDir ?? agentWorkspaceDir,
		skillsSnapshot,
		assertCurrent: params.assertCurrent,
		...executionWorkspace,
		config: params.config,
		agentId: params.agentId
	});
}
//#endregion
//#region src/agents/cli-runner/stable-skill-authoring.ts
const MAX_REMEMBERED_SESSIONS = 512;
const shapes = /* @__PURE__ */ new Map();
/**
* Keeps the skill_workshop definition stable across a session's CLI turns.
*
* Only human turns receive personal-library authority, so completion and other
* internal turns would otherwise publish a different skill_workshop schema and
* break the native prompt cache. Those turns reuse the session's last shape
* with an expired grant: the definition matches and personal-library calls are
* refused. Workshop calls through the workspace-default wrapper keep the
* ordinary no-grant rule (unsandboxed runs only), so this definition neither
* revokes nor widens workspace access.
*/
function resolveStableCliSkillAuthoring(sessionKey, authoring) {
	const key = sessionKey?.trim();
	if (!key) return authoring;
	if (authoring) {
		shapes.delete(key);
		shapes.set(key, {
			defaultTarget: authoring.defaultTarget,
			multipleProfiles: authoring.multipleProfiles
		});
		if (shapes.size > MAX_REMEMBERED_SESSIONS) shapes.delete(shapes.keys().next().value);
		return authoring;
	}
	const shape = shapes.get(key);
	if (!shape) return;
	const expired = () => new SkillLibraryError("AUTHORITY_EXPIRED", "Skill authoring needs a fresh message from the person requesting the change.");
	return {
		target: "personal",
		defaultTarget: shape.defaultTarget,
		multipleProfiles: shape.multipleProfiles,
		bind: () => {},
		assertWorkspaceCurrent: (run) => {
			if (run?.sandboxed !== false) throw new SkillLibraryError("FORBIDDEN", "Workshop is unavailable in a sandboxed run without library-authoring authority.");
		},
		invoke: async () => {
			throw expired();
		}
	};
}
//#endregion
//#region src/agents/cli-runner/tool-authority.ts
/** Bind CLI and loopback questions to the original creator, not their callback transport. */
function bindCliQuestionAnswerAuthority(params) {
	params.assertSourceCurrent?.();
	return (sessionKey, assertActive) => {
		const source = params.readSource();
		source?.assertCurrent();
		const authority = createAgentQuestionAnswerAuthority({
			sessionKey,
			requesterProfileId: source?.profileId,
			fingerprint: params.fingerprint,
			prepareCaller: async (caller) => prepareReplyToolAuthorityCallerRead(params.operation?.projectToolAuthorityFingerprintAsync ?? params.snapshot?.projectAsync, caller, params.fingerprint, params.route, () => authority.assertActive()),
			project: (caller) => params.operation ? params.operation.projectToolAuthorityFingerprint(caller) : params.snapshot?.project(caller, params.route),
			assertActive: () => {
				assertActive();
				source?.assertCurrent();
				params.assertSourceCurrent?.();
				params.signal?.throwIfAborted();
				if (params.operation && (params.operation.result || params.operation.toolAuthorityRoute?.provider !== params.route.provider || params.operation.toolAuthorityRoute.model !== params.route.model || params.operation.toolAuthorityFingerprint !== params.fingerprint)) throw new Error("question creator reply authority is no longer active");
				assertActive();
			}
		});
		return authority;
	};
}
/** Capture the original CLI caller before native tool availability replaces its tool cap. */
function prepareCliReplyToolAuthority(params, workspace) {
	return prepareReplyToolAuthority({
		originatingChannel: normalizeMessageChannel(params.messageChannel),
		toolsAllow: params.toolsAllow,
		disableTools: params.disableTools,
		operatorAuthority: readAdmittedRunOperatorAuthority(params.admittedRunContext) ?? readPreparedRunOperatorAuthority(params.preparedRunAdmission),
		run: {
			...params,
			agentId: workspace.agentId,
			chatType: params.chatType ?? params.sessionEntry?.chatType,
			provider: params.modelProvider ?? params.provider,
			model: params.model ?? "default",
			workspaceDir: workspace.workspaceDir,
			cwd: workspace.cwd,
			permissionMode: params.sessionEntry?.permissionMode,
			toolOverrides: params.toolOverrides ?? params.sessionEntry?.toolOverrides,
			senderId: params.senderId ?? void 0,
			senderName: params.senderName ?? void 0,
			senderUsername: params.senderUsername ?? void 0,
			senderE164: params.senderE164 ?? void 0,
			groupId: params.groupId ?? void 0,
			groupChannel: params.groupChannel ?? void 0,
			groupSpace: params.groupSpace ?? void 0,
			spawnedBy: params.spawnedBy ?? void 0
		}
	});
}
/** Keep creator facts together while backend preparation translates the run's tool policy. */
function captureCliRunToolAuthority(params, workspace) {
	const operation = params.toolAuthorityFingerprint ? params.replyOperation : void 0;
	const snapshot = operation ? void 0 : prepareCliReplyToolAuthority(params, workspace);
	const sessionKey = params.sessionKey ?? params.sessionId;
	const signal = params.abortSignal;
	const assertSourceCurrent = params.assertCurrent;
	const sourcePolicy = captureCliSessionEventSourcePolicy(params);
	return {
		[Symbol.dispose]() {
			snapshot?.close();
		},
		finalizeSessionEventSourcePolicy(run, promptToolsAllow) {
			return Object.freeze({
				...sourcePolicy,
				toolsAllow: intersectSessionEventToolsAllow(sourcePolicy.toolsAllow, promptToolsAllow, run.disableTools ? [] : run.cliToolAvailability?.native.length === 0 ? run.cliToolAvailability.openClaw : void 0)
			});
		},
		hasReplyOperation: Boolean(operation),
		async bindQuestions(route, readSource) {
			const fingerprint = operation ? await operation.bindToolAuthorityRouteAsync(route) : await snapshot?.fingerprintAsync(route);
			const bind = bindCliQuestionAnswerAuthority({
				operation,
				snapshot,
				route,
				fingerprint,
				readSource,
				assertSourceCurrent,
				signal
			});
			return {
				fingerprint,
				bindQuestionAnswerAuthorityForSession: bind,
				bindQuestionAnswerAuthority: (assertActive) => bind(sessionKey, assertActive)
			};
		}
	};
}
/** Capture the original caller before CLI policy replaces its canonical tool allowlist. */
function captureCliSessionEventSourcePolicy(params) {
	return Object.freeze({
		toolsAllow: intersectSessionEventToolsAllow(params.disableTools ? [] : params.toolsAllow),
		settings: structuredClone({
			permissionMode: params.sessionEntry?.permissionMode,
			toolOverrides: narrowSessionEventSettings({ toolOverrides: params.toolOverrides }, { toolOverrides: params.sessionEntry?.toolOverrides }).toolOverrides
		})
	});
}
//#endregion
//#region src/agents/cli-runner/types.ts
function captureCliRunStartTime() {
	return {
		started: Date.now(),
		startedMonotonicMs: performance.now()
	};
}
//#endregion
//#region src/agents/cli-runner/prepare.ts
async function prepareCliRunContext(inputParams) {
	return runWithCliPreparationSource(inputParams, () => prepareCliRunContextWithinReadFence(inputParams));
}
async function prepareCliRunContextWithinReadFence(inputParams) {
	try {
		var _usingCtx$1 = _usingCtx();
		let params = inputParams.config ? inputParams : {
			...inputParams,
			config: readRuntimeConfig()
		};
		if (params.sessionManager) params = {
			...params,
			sessionFile: `in-memory:${params.sessionManager.getSessionId()}`,
			sessionTarget: void 0,
			storePath: void 0,
			expectedLifecycleRevision: void 0,
			expectedWriterRunId: void 0,
			userTurnTranscriptRecorder: void 0,
			persistAssistantTranscript: void 0,
			prepareAssistantTranscriptMessage: void 0,
			contextEngineLogicalTurnLease: void 0,
			onContextEngineTurnCandidate: void 0
		};
		const runConfig = params.config;
		const sessionOwner = normalizeAgentId(parseAgentSessionKey(params.sessionKey)?.agentId || params.agentId?.trim() || "main");
		const workspaceConfig = hasAgentRosterProperty(runConfig) ? runConfig : {
			...runConfig,
			agents: {
				...runConfig.agents,
				entries: { [sessionOwner]: {} }
			}
		};
		const { started, startedMonotonicMs } = captureCliRunStartTime();
		const executionMode = params.executionMode ?? "agent";
		const isSideQuestion = executionMode === "side-question";
		const isControlOperation = params.controlOperation !== void 0;
		const skipsTurnPreparation = isSideQuestion || isControlOperation;
		const runtimeChatType = params.chatType ?? params.sessionEntry?.chatType;
		const workspaceResolution = resolveRunWorkspaceDir({
			workspaceDir: params.workspaceDir,
			sessionKey: params.sessionKey,
			agentId: sessionOwner,
			config: workspaceConfig
		});
		const resolvedWorkspace = workspaceResolution.workspaceDir;
		const redactedSessionId = redactRunIdentifier(params.sessionId);
		const redactedSessionKey = redactRunIdentifier(params.sessionKey);
		const redactedWorkspace = redactRunIdentifier(resolvedWorkspace);
		if (workspaceResolution.usedFallback) cliBackendLog.warn(`[workspace-fallback] caller=runCliAgent reason=${workspaceResolution.fallbackReason} run=${params.runId} session=${redactedSessionId} sessionKey=${redactedSessionKey} agent=${workspaceResolution.agentId} workspace=${redactedWorkspace}`);
		const workspaceDir = resolvedWorkspace;
		const suppliedSessionKey = params.sessionKey?.trim();
		if (suppliedSessionKey) params = {
			...params,
			sessionKey: canonicalizeMainSessionAlias({
				cfg: runConfig,
				agentId: workspaceResolution.agentId,
				sessionKey: suppliedSessionKey
			})
		};
		if (!params.isolatedCompletion && !isControlOperation && !params.sessionManager) await waitForDeferredTurnMaintenanceForSession(params.sessionKey ?? params.sessionId);
		const policySessionKey = params.runtimePolicySessionKey ?? params.sessionKey;
		const policyAgentId = resolveSessionAgentIds({
			sessionKey: policySessionKey,
			config: runConfig,
			fallbackAgentId: params.runtimePolicySessionKey ? params.agentId : workspaceResolution.agentId
		}).sessionAgentId;
		const cwd = params.cwd ? resolveUserPath(params.cwd) : workspaceDir;
		const cwdHash = hashCliSessionText(cwd);
		const backendResolved = resolveCliBackendConfig(params.provider, params.config, { agentId: workspaceResolution.agentId });
		if (!backendResolved) throw new Error(`Unknown CLI backend: ${params.provider}`);
		params = prepareCliRunModelAuthority(params);
		const backendAuthPolicy = resolveBundledCliBackendAuthPolicy(backendResolved.id);
		const canEnforceExactToolAvailability = backendResolved.nativeToolMode === "selectable" && (backendResolved.toolAvailabilityEnforcement === "execution-args" && backendResolved.resolveExecutionArgs !== void 0 || backendResolved.toolAvailabilityEnforcement === "prepare-execution" && backendResolved.prepareExecution !== void 0);
		const callerToolAuthorityResources = _usingCtx$1.u(new DisposableStack());
		const callerToolAuthority = callerToolAuthorityResources.use(captureCliRunToolAuthority(params, {
			agentId: workspaceResolution.agentId,
			workspaceDir,
			cwd
		}));
		const finishPreparation = (prepared) => {
			const resources = callerToolAuthorityResources.move();
			prepared.preparedBackend.cleanup = sequenceCliCleanups(prepared.preparedBackend.cleanup, () => resources.dispose());
			return prepared;
		};
		const toolPolicy = await resolveCliRuntimeToolPolicy({
			params,
			policySessionKey,
			policyAgentId,
			backendId: backendResolved.id,
			bundleMcp: backendResolved.bundleMcp,
			canEnforceExactToolAvailability,
			projectNativeToolAuthority: backendResolved.projectNativeToolAuthority,
			resolveManagedNativeTools: backendResolved.resolveManagedNativeTools,
			sideQuestionToolMode: backendResolved.sideQuestionToolMode,
			isSideQuestion,
			skipsTurnPreparation
		});
		params = toolPolicy.params;
		const { runtimeToolsAllowPolicy, managedNativeTools } = toolPolicy;
		const internalParams = params;
		const nodeClaudePlacement = detectNodeClaudePlacement({
			backendId: backendResolved.id,
			execHost: params.sessionEntry?.execHost,
			execNode: params.sessionEntry?.execNode
		});
		params.assertCurrent?.();
		params.abortSignal?.throwIfAborted();
		if (nodeClaudePlacement && params.cliToolAvailability) params = {
			...params,
			cliToolAvailability: {
				native: params.cliToolAvailability.native,
				openClaw: params.cliToolAvailability.openClaw.filter((name) => name === "skill_workshop")
			}
		};
		if (params.cliToolAvailability !== void 0 && !canEnforceExactToolAvailability) throw new Error(`CLI backend "${backendResolved.id}" cannot enforce this run's tool cap. Upgrade its plugin and retry; if current, ask its maintainer to add exact-cap support. OpenClaw did not start the run.`);
		const sideQuestionDisablesNativeTools = isSideQuestion && backendResolved.sideQuestionToolMode === "disabled";
		const requestedNoNativeTools = params.cliToolAvailability?.native.length === 0;
		if (params.disableTools === true && (backendResolved.nativeToolMode === "always-on" || backendResolved.nativeToolMode === "selectable" && !requestedNoNativeTools) && !sideQuestionDisablesNativeTools) throw new Error(`CLI backend ${backendResolved.id} cannot run with tools disabled because it exposes native tools`);
		const { sessionAgentId } = resolveSessionAgentIds({
			sessionKey: params.sessionKey,
			config: params.config,
			agentId: sessionOwner
		});
		const agentDir = params.agentDir ?? resolveAgentDir(params.config ?? {}, sessionAgentId);
		const requestedAuthProfileId = params.authProfileId?.trim() || void 0;
		let effectiveAuthProfileId = requestedAuthProfileId ?? backendResolved.defaultAuthProfileId?.trim() ?? void 0;
		let authStore;
		let resolvedProfileAuth;
		const loadScopedAuthStore = (options = {}) => {
			params.assertCurrent?.();
			return loadAuthProfileStoreForRuntimeAsync(agentDir, {
				readOnly: true,
				profileId: options.profileId,
				externalCli: externalCliDiscoveryForProviderAuth({
					cfg: params.config,
					provider: params.provider,
					...options.profileId ? { profileId: options.profileId } : {}
				})
			});
		};
		if (effectiveAuthProfileId) authStore = await loadScopedAuthStore({ profileId: effectiveAuthProfileId });
		else if (backendResolved.autoSelectAuthProfile !== false && (backendResolved.authEpochMode === "profile-only" || backendResolved.prepareExecution)) {
			authStore = await loadScopedAuthStore();
			effectiveAuthProfileId = resolveAuthProfileOrder({
				cfg: params.config,
				store: authStore,
				provider: params.provider,
				includePendingOAuthRefresh: true
			})[0]?.trim() || void 0;
		}
		let authCredential = effectiveAuthProfileId ? authStore?.profiles[effectiveAuthProfileId] : void 0;
		if (effectiveAuthProfileId && authCredential && !isSetupCredentialAccessible({
			profileId: effectiveAuthProfileId,
			credential: authCredential,
			agentDir
		})) throw new Error("This saved sign-in is inactive. Test and activate it in Model Setup.");
		if (backendAuthPolicy?.nativeAuthProfileIds !== void 0 && effectiveAuthProfileId !== void 0 && backendAuthPolicy.nativeAuthProfileIds.includes(effectiveAuthProfileId)) {
			effectiveAuthProfileId = void 0;
			authCredential = void 0;
		} else if (params.nativeAuthOnly && effectiveAuthProfileId) {
			const refusal = /* @__PURE__ */ new Error("Automation has no recorded inference account. Explicitly select its account with a model@profile update before running it.");
			recordModelFallbackStop(refusal);
			throw refusal;
		} else if (effectiveAuthProfileId && backendAuthPolicy && (authCredential ? authCredential.type !== "oauth" || backendAuthPolicy.oauthRefreshOwner === "core" : backendAuthPolicy.strictSelectedProfile)) {
			const authProfileId = effectiveAuthProfileId;
			const profileResolutionError = (provider, resolvedProfileId) => {
				const loginCommand = buildOAuthRefreshFailureLoginCommand(provider, { profileId: authProfileId });
				const reason = resolvedProfileId !== void 0 ? `selected auth profile "${authProfileId}" resolved as "${resolvedProfileId}"` : `could not materialize selected auth profile "${authProfileId}"`;
				return new CliAuthProfilePreparationError({
					message: `CLI backend "${backendResolved.id}" ${reason}. Re-authenticate with: ${loginCommand}. OpenClaw did not start the run.`,
					profileId: authProfileId,
					provider,
					agentDir
				});
			};
			const selectedAuthStore = await loadScopedAuthStore({ profileId: authProfileId });
			const resolvedAuth = await resolveApiKeyForProfile({
				cfg: params.config,
				store: selectedAuthStore,
				profileId: authProfileId,
				agentDir,
				...backendAuthPolicy?.strictSelectedProfile ? { allowProfileFallback: false } : {}
			});
			params.assertCurrent?.();
			if (backendAuthPolicy.strictSelectedProfile && resolvedAuth?.profileId !== authProfileId) throw profileResolutionError(resolvedAuth?.provider ?? selectedAuthStore.profiles[authProfileId]?.provider ?? params.provider, resolvedAuth?.profileId);
			const resolvedAuthProfileId = resolvedAuth?.profileId ?? authProfileId;
			authStore = await loadScopedAuthStore({ profileId: resolvedAuthProfileId });
			authCredential = resolvedAuth?.credential ?? authStore.profiles[resolvedAuthProfileId];
			if (backendAuthPolicy?.strictSelectedProfile && (!authCredential || authCredential.type === "oauth" && !hasUsableOAuthCredential(authCredential))) throw profileResolutionError(resolvedAuth?.provider ?? params.provider);
			if (resolvedAuth && authCredential) {
				effectiveAuthProfileId = resolvedAuthProfileId;
				resolvedProfileAuth = {
					apiKey: resolvedAuth.apiKey,
					profileId: resolvedAuthProfileId,
					source: `profile:${resolvedAuthProfileId}`,
					mode: resolvedAuth.profileType === "api_key" ? "api-key" : resolvedAuth.profileType
				};
				if (authCredential.type === "api_key") authCredential = {
					...authCredential,
					key: resolvedAuth.apiKey
				};
				else if (authCredential.type === "token") authCredential = {
					...authCredential,
					token: resolvedAuth.apiKey
				};
			}
		}
		const extraSystemPrompt = params.extraSystemPrompt?.trim() ?? "";
		const bindingFacts = params.cliSessionBindingFacts;
		const bindingExtraSystemPromptStatic = bindingFacts?.extraSystemPromptStatic ?? params.extraSystemPromptStatic;
		const baseExtraSystemPromptHash = bindingExtraSystemPromptStatic !== void 0 ? hashCliSessionText(bindingExtraSystemPromptStatic.trim() || void 0) : hashCliSessionText(extraSystemPrompt);
		const requireExplicitMessageTarget = params.requireExplicitMessageTarget ?? isSubagentSessionKey(params.sessionKey);
		const hasCliSessionBindingFacts = bindingFacts !== void 0;
		const bindingRequireExplicitMessageTarget = bindingFacts?.requireExplicitMessageTarget ?? (hasCliSessionBindingFacts ? isSubagentSessionKey(params.sessionKey) : requireExplicitMessageTarget);
		const bindingSourceReplyDeliveryMode = hasCliSessionBindingFacts ? bindingFacts.sourceReplyDeliveryMode : params.sourceReplyDeliveryMode;
		const messageToolPolicyHash = bindingSourceReplyDeliveryMode !== void 0 || bindingRequireExplicitMessageTarget || (bindingFacts ?? params).requireExplicitMessageTarget !== void 0 ? hashCliSessionText(JSON.stringify({
			sourceReplyDeliveryMode: bindingSourceReplyDeliveryMode,
			requireExplicitMessageTarget: bindingRequireExplicitMessageTarget
		})) : void 0;
		const modelId = (params.model ?? "default").trim() || "default";
		const modelProvider = normalizeOptionalString(params.modelProvider) ?? normalizeOptionalString(params.provider) ?? params.provider;
		const normalizedCatalogModel = normalizeCliModel(modelId, backendResolved.config);
		const normalizedModel = backendResolved.resolveModelId?.({
			modelId: normalizedCatalogModel,
			contextWindow: params.contextWindow
		}) ?? normalizedCatalogModel;
		const { fingerprint: questionFingerprint, bindQuestionAnswerAuthority, bindQuestionAnswerAuthorityForSession } = await callerToolAuthority.bindQuestions({
			provider: modelProvider,
			model: modelId
		}, () => readRunOperatorAuthority(params));
		if (callerToolAuthority.hasReplyOperation) params = {
			...params,
			toolAuthorityFingerprint: questionFingerprint
		};
		const modelDisplay = `${params.provider}/${modelId}`;
		let openClawHistoryMessages;
		const loadOpenClawHistoryMessages = async () => {
			openClawHistoryMessages ??= await loadCliSessionHistoryMessages(params);
			return openClawHistoryMessages;
		};
		const promptBuildHookContext = {
			runId: params.runId,
			agentId: sessionAgentId,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId,
			workspaceDir,
			modelProviderId: params.provider,
			modelId,
			trigger: params.trigger,
			inputProvenance: params.inputProvenance,
			...buildAgentHookContextChannelFields(params)
		};
		const promptBuildHookRunner = skipsTurnPreparation ? void 0 : getGlobalHookRunner();
		let promptBuildHookResult;
		if (!skipsTurnPreparation) try {
			promptBuildHookResult = await resolvePromptBuildHookResult({
				config: runConfig,
				prompt: params.prompt,
				messages: await loadOpenClawHistoryMessages(),
				hookCtx: promptBuildHookContext,
				hookRunner: promptBuildHookRunner
			});
		} catch (error) {
			cliBackendLog.warn(`cli prompt-build hook preparation failed: ${String(error)}`);
		}
		const promptBuildToolsAllow = mergeForcedEmbeddedAttemptToolsAllow(promptBuildHookResult?.toolsAllow, { forceMessageTool: messageToolOwnsVisibleReply({ sourceReplyDeliveryMode: bindingSourceReplyDeliveryMode }) });
		const promptBuildRestrictsTools = promptBuildToolsAllow !== void 0 && !promptBuildToolsAllow.some((toolName) => normalizeToolPolicyName(toolName) === "*");
		const { contextWindowInfo, providerThinkingLevel, autoReseedHistoryChars } = prepareCliModelContext({
			params,
			backendResolved,
			runConfig,
			workspaceDir,
			modelId,
			normalizedCatalogModel
		});
		const sessionLabel = params.sessionKey ?? params.sessionId;
		const { bootstrapFiles, contextFiles: resolvedContextFiles } = skipsTurnPreparation ? {
			bootstrapFiles: [],
			contextFiles: []
		} : await resolveBootstrapContextForRun({
			workspaceDir: params.bootstrapWorkspaceDir ?? workspaceDir,
			config: params.config,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId,
			bootstrapUserProfileId: params.bootstrapUserProfileId,
			chatType: runtimeChatType,
			agentId: sessionAgentId,
			contextMode: params.bootstrapContextMode,
			runKind: params.bootstrapContextRunKind,
			warn: makeBootstrapWarn({
				sessionLabel,
				workspaceDir,
				warn: (message) => cliBackendLog.warn(message)
			})
		});
		const systemAgentMcpConfig = internalParams.systemAgentTool ? buildSystemAgentToolsMcpServerConfig(internalParams.systemAgentTool) : void 0;
		const canUseGatewayTools = !nodeClaudePlacement && !skipsTurnPreparation && !systemAgentMcpConfig;
		const bundleMcpEnabled = canUseGatewayTools && backendResolved.bundleMcp && params.disableTools !== true;
		let mcpLoopbackRuntime = bundleMcpEnabled ? getActiveMcpLoopbackRuntime() : void 0;
		if (bundleMcpEnabled && !mcpLoopbackRuntime) {
			try {
				await ensureMcpLoopbackServer();
			} catch (error) {
				throw new Error(`Bundled MCP is enabled, but the OpenClaw MCP loopback server failed to start: ${String(error)}`, { cause: error });
			}
			mcpLoopbackRuntime = getActiveMcpLoopbackRuntime();
		}
		if (bundleMcpEnabled && !mcpLoopbackRuntime) throw new Error("Bundled MCP is enabled, but the OpenClaw MCP loopback server did not publish a runtime after startup.");
		const { nodeWorkshopEnabled, hostOwnedTools } = resolveCliMcpToolOwnership(params, {
			backend: backendResolved,
			enabled: bundleMcpEnabled,
			nodePlacement: nodeClaudePlacement,
			skipPreparation: skipsTurnPreparation
		});
		const shouldMaterializeRuntimePolicy = runtimeToolsAllowPolicy !== void 0 && canUseGatewayTools && params.disableTools !== true;
		const skillLibraryAuthoring = resolveStableCliSkillAuthoring(params.sessionKey, nodeWorkshopEnabled && params.skillLibraryAuthoring ? {
			...params.skillLibraryAuthoring,
			defaultTarget: "personal"
		} : params.skillLibraryAuthoring);
		const mcpContextBase = mcpLoopbackRuntime || shouldMaterializeRuntimePolicy || nodeWorkshopEnabled ? buildCliMcpGrantContext({
			run: {
				...params,
				workspaceDir
			},
			config: runConfig,
			requireExplicitMessageTarget,
			agentId: sessionAgentId,
			runtimePolicyAgentId: params.runtimePolicySessionKey ? policyAgentId : void 0,
			modelProvider,
			modelId
		}) : void 0;
		const mcpToolAuthAgentDir = mcpContextBase ? resolveRuntimeAuthProfileAgentDir(agentDir) : void 0;
		const mcpToolAuth = mcpContextBase ? {
			...mcpToolAuthAgentDir ? { agentDir: mcpToolAuthAgentDir } : {},
			store: authStore ?? await loadScopedAuthStore()
		} : void 0;
		params.assertCurrent?.();
		const loopbackBundleMcp = _usingCtx$1.a(mcpLoopbackRuntime && mcpContextBase && (params.cliToolAvailability !== void 0 || shouldMaterializeRuntimePolicy || promptBuildRestrictsTools) ? await prepareCliLoopbackBundleMcp({
			run: params,
			config: runConfig,
			workspaceDir,
			agentId: sessionAgentId,
			agentDir,
			resolveCapabilityProfile: () => resolveCliNativeMcpPolicy(params, {
				config: runConfig,
				policySessionKey,
				policyAgentId,
				modelProvider,
				modelId,
				workspaceDir,
				cwd,
				runtimeToolsAllowPolicy
			}),
			runtimeToolsAllow: runtimeToolsAllowPolicy
		}) : void 0);
		params.assertCurrent?.();
		const mcpProjection = mcpContextBase ? await prepareCliMcpToolProjection(params, {
			agentId: workspaceResolution.agentId,
			context: mcpContextBase,
			runtimeToolsAllowPolicy,
			defaultMediatedToolNames: hostOwnedTools,
			scope: {
				cfg: runConfig,
				...skillLibraryAuthoring ? { skillLibraryAuthoring } : {},
				...loopbackBundleMcp ? { bundledTools: loopbackBundleMcp.tools } : {},
				...mcpToolAuth ? { authProfileStore: mcpToolAuth.store } : {},
				...mcpToolAuth?.agentDir ? { authProfileStoreAgentDir: mcpToolAuth.agentDir } : {}
			},
			resolvePolicyTools: resolveMcpLoopbackPolicyTools,
			resolveScopedTools: resolveMcpLoopbackScopedTools
		}) : {
			params,
			tools: []
		};
		params = mcpProjection.params;
		params.assertCurrent?.();
		const hookFilteredProjectedTools = applyEmbeddedAttemptToolsAllow(mcpProjection.tools, promptBuildToolsAllow);
		if (promptBuildRestrictsTools && (backendResolved.nativeToolMode === "always-on" || backendResolved.nativeToolMode === "selectable" && !canEnforceExactToolAvailability)) throw new Error(`CLI backend "${backendResolved.id}" cannot enforce before_prompt_build tool restrictions. Use a backend with exact tool availability or remove the hook restriction. OpenClaw did not start the run.`);
		if (promptBuildRestrictsTools && params.cliToolAvailability === void 0 && backendResolved.nativeToolMode === "selectable" || shouldMaterializeRuntimePolicy) params = {
			...params,
			cliToolAvailability: {
				native: params.cliToolAvailability?.native ?? [],
				openClaw: hookFilteredProjectedTools.map((tool) => tool.name)
			}
		};
		if (params.cliToolAvailability && promptBuildToolsAllow !== void 0) params = {
			...params,
			cliToolAvailability: capCliToolAvailability(params.cliToolAvailability, promptBuildToolsAllow)
		};
		const projectedTools = applyEmbeddedAttemptToolsAllow(hookFilteredProjectedTools, params.cliToolAvailability?.openClaw);
		const canonicalWorkspace = resolveUserPath(resolveAgentWorkspaceDir(params.config ?? {}, workspaceResolution.agentId));
		const hasBootstrapFileAccess = resolveCliBootstrapFileAccess({
			backend: backendResolved,
			params,
			managedNativeTools,
			projectedToolNames: projectedTools.map((tool) => tool.name)
		});
		const bootstrapRouting = skipsTurnPreparation || !canTransportSystemPrompt(backendResolved.config) ? void 0 : await resolveWorkspaceBootstrapRouting({
			isWorkspaceBootstrapPending,
			bootstrapFiles,
			bootstrapFilesProvideAccess: false,
			bootstrapContextRunKind: params.bootstrapContextRunKind,
			trigger: params.trigger,
			sessionKey: params.sessionKey,
			isPrimaryRun: isPrimaryBootstrapRun(params.sessionKey),
			isCanonicalWorkspace: canonicalWorkspace === resolvedWorkspace,
			effectiveWorkspace: workspaceDir,
			resolvedWorkspace,
			hasBootstrapFileAccess
		});
		const bootstrapMode = bootstrapRouting?.bootstrapMode ?? "none";
		const includeBootstrapInSystemContext = bootstrapRouting?.includeBootstrapInSystemContext ?? true;
		const contextFiles = includeBootstrapInSystemContext ? resolvedContextFiles : resolvedContextFiles.filter((file) => !/(^|[\\/])BOOTSTRAP\.md$/iu.test(file.path.trim()));
		const bootstrapFilesForInjectionStats = includeBootstrapInSystemContext ? bootstrapFiles : bootstrapFiles.filter((file) => file.name !== DEFAULT_BOOTSTRAP_FILENAME);
		const bootstrapInjectionStats = buildBootstrapInjectionStats({
			bootstrapFiles: bootstrapFilesForInjectionStats,
			injectedFiles: contextFiles
		});
		const { bootstrapAnalysis, bootstrapMaxChars, bootstrapPromptWarning, bootstrapPromptWarningMode, bootstrapTotalMaxChars } = buildBootstrapBudgetState({
			config: params.config,
			agentId: sessionAgentId,
			files: bootstrapInjectionStats,
			seenSignatures: params.bootstrapPromptWarningSignaturesSeen,
			previousSignature: params.bootstrapPromptWarningSignature
		});
		const bootstrapTruncationNotice = buildBootstrapPromptWarningNotice(bootstrapPromptWarning.lines);
		const nodeSkillWorkshop = nodeWorkshopEnabled ? projectedTools.find((tool) => tool.name === "skill_workshop") : void 0;
		const promptTools = bundleMcpEnabled ? projectedTools : nodeSkillWorkshop ? [nodeSkillWorkshop] : [];
		const authorizedPromptBuildResult = await (async () => {
			const toolAuthorityFingerprint = params.toolAuthorityFingerprint;
			if (!promptBuildHookRunner || !toolAuthorityFingerprint) return;
			const admittedParams = await admitCliRunParams(params, workspaceResolution.agentId);
			params = admittedParams;
			const assertHostActive = resolveAdmittedRunActiveAssertion(admittedParams.admittedRunContext, admittedParams.abortSignal);
			if (!assertHostActive) return;
			try {
				return await promptBuildHookRunner.runAuthorizedPromptBuild({
					prompt: params.prompt,
					messages: await loadOpenClawHistoryMessages()
				}, promptBuildHookContext, {
					toolAuthorityFingerprint,
					activeToolNames: promptTools.map((tool) => tool.name),
					assertHostActive
				});
			} catch (error) {
				cliBackendLog.warn(`authorized CLI prompt-build hook failed: ${String(error)}`);
				return;
			}
		})();
		params.assertCurrent?.();
		const messageToolAvailable = promptTools.some((tool) => normalizeToolPolicyName(tool.name) === "message");
		const resultContentSourceByToolName = new Map(promptTools.flatMap((tool) => tool.resultContentSource ? [[tool.name, tool.resultContentSource]] : []));
		const sessionEventSourcePolicy = callerToolAuthority.finalizeSessionEventSourcePolicy(params, promptBuildToolsAllow);
		const { mcpGrant, projectNativeToolAuthority, exclusiveTools } = prepareCliMcpGrant(params, {
			context: mcpContextBase,
			tools: projectedTools,
			promptBuildRestrictsTools,
			hostOwnedTools,
			nativeAuthorityAllowed: !skipsTurnPreparation && !nodeClaudePlacement,
			projectNativeToolAuthority: backendResolved.projectNativeToolAuthority
		});
		const extraSystemPromptHash = resolveCliBootstrapPromptHash({
			baseHash: params.cliToolAvailability ? hashCliSessionText(JSON.stringify([
				baseExtraSystemPromptHash ?? null,
				params.cliToolAvailability.native.toSorted(),
				params.cliToolAvailability.openClaw.toSorted()
			])) : baseExtraSystemPromptHash,
			bootstrapMode,
			bootstrapTruncationNotice,
			contextFiles
		});
		let cleanupPreparedResources;
		let preparedExecution;
		try {
			const mcpClientGrant = mcpLoopbackRuntime && mcpGrant ? mintMcpLoopbackClientGrant({
				...mcpGrant,
				sessionEventSourcePolicy,
				runtimeOwnerToken: mcpLoopbackRuntime.ownerToken,
				bindQuestionAnswerAuthority: (assertActive) => bindQuestionAnswerAuthorityForSession(mcpGrant.context.sessionKey, assertActive),
				...skillLibraryAuthoring ? { skillLibraryAuthoring } : {},
				...loopbackBundleMcp ? { bundledTools: loopbackBundleMcp.tools } : {},
				...mcpToolAuth ? { toolAuth: mcpToolAuth } : {}
			}) : void 0;
			const bindMcpClientGrantAdmission = (admittedRunContext) => {
				if (mcpClientGrant && mcpLoopbackRuntime && !bindMcpLoopbackClientGrantAdmission({
					token: mcpClientGrant.token,
					runtimeOwnerToken: mcpLoopbackRuntime.ownerToken,
					admittedRunContext
				})) throw new Error("CLI MCP client grant is no longer valid for this admitted run");
			};
			const mcpClientGrantCapture = mcpClientGrant && mcpLoopbackRuntime ? (() => {
				let activeToken = mcpClientGrant.token;
				let activeCapture = false;
				return {
					transportToken: mcpClientGrant.token,
					adoptProcessToken: (processToken) => {
						if (activeToken === processToken) return;
						if (!transferMcpLoopbackClientGrant({
							sourceToken: mcpClientGrant.token,
							targetToken: processToken,
							runtimeOwnerToken: mcpLoopbackRuntime.ownerToken
						})) throw new Error("CLI MCP client grant could not transfer onto the live process bearer");
						activeToken = processToken;
					},
					revokeProcessToken: () => {
						revokeMcpLoopbackClientGrant(activeToken);
					},
					activate: (captureKey, assertCurrent) => {
						const activated = activateMcpLoopbackClientGrantCapture({
							token: activeToken,
							runtimeOwnerToken: mcpLoopbackRuntime.ownerToken,
							captureKey,
							assertCurrent
						});
						if (!activated) throw new Error("CLI MCP client grant is no longer valid for this Gateway runtime");
						activeCapture = activated;
					},
					deactivate: (captureKey) => {
						deactivateMcpLoopbackClientGrantCapture({
							token: activeToken,
							runtimeOwnerToken: mcpLoopbackRuntime.ownerToken,
							captureKey
						});
					},
					...projectNativeToolAuthority ? { captureNativeTools: (tools) => {
						params.assertCurrent?.();
						params.abortSignal?.throwIfAborted();
						if (!activeCapture || !activeCapture.captureNativeToolAuthority(null)) throw new Error("Native tool authority capture is no longer active.");
						if (!Array.isArray(tools) || !tools.every((name) => typeof name === "string")) throw new Error("Native runtime reported an invalid tool list; start a fresh session.");
						const selected = params.cliToolAvailability?.native;
						const capabilities = projectNativeToolAuthority(selected ? tools.filter((name) => selected.includes(name)) : tools);
						assertNativeCronCreatorCapabilities(capabilities);
						const allowed = resolveCliNativeWebSearchEnabled(params, backendResolved) ? capabilities : capabilities.filter((name) => name !== "web_search");
						if (!activeCapture.captureNativeToolAuthority(allowed)) throw new Error("Native tool authority capture is no longer active.");
					} } : {}
				};
			})() : void 0;
			let mcpClientGrantRevoked = false;
			const cleanupMcpClientGrant = sequenceCliCleanups(mcpClientGrant ? async () => {
				if (mcpClientGrantRevoked) return;
				mcpClientGrantRevoked = true;
				revokeMintedMcpLoopbackClientGrant(mcpClientGrant);
			} : void 0, loopbackBundleMcp?.takeCleanup());
			cleanupPreparedResources = cleanupMcpClientGrant;
			const rawLoopbackServerConfig = mcpLoopbackRuntime ? createMcpLoopbackServerConfig(mcpLoopbackRuntime.port) : void 0;
			const loopbackServerConfig = rawLoopbackServerConfig && backendResolved.bundleMcpMode === "claude-config-file" ? applyClaudeManagedMcpTimeout(rawLoopbackServerConfig) : rawLoopbackServerConfig;
			const nativeMcpCapabilityProfile = await resolveCliNativeMcpPolicy(params, {
				config: runConfig,
				policySessionKey,
				policyAgentId,
				modelProvider,
				modelId,
				workspaceDir,
				cwd,
				runtimeToolsAllowPolicy
			});
			const preparedBackend = await prepareCliBundleMcpConfig({
				enabled: bundleMcpEnabled || systemAgentMcpConfig !== void 0,
				mode: backendResolved.bundleMcpMode,
				backend: backendResolved.config,
				workspaceDir,
				config: params.config,
				toolOverrides: params.toolOverrides,
				agentDir,
				...systemAgentMcpConfig ? { exclusiveConfig: systemAgentMcpConfig } : exclusiveTools && loopbackServerConfig ? { exclusiveConfig: loopbackServerConfig } : {},
				additionalConfig: exclusiveTools ? void 0 : loopbackServerConfig,
				env: mcpLoopbackRuntime && mcpClientGrant ? {
					OPENCLAW_MCP_TOKEN: mcpClientGrant.token,
					OPENCLAW_MCP_CLI_CAPTURE_KEY: ""
				} : void 0,
				warn: (message) => cliBackendLog.warn(message),
				...!systemAgentMcpConfig && !exclusiveTools ? { nativeMcpPolicy: {
					sessionId: params.sessionId,
					...params.sessionKey ? { sessionKey: params.sessionKey } : {},
					capabilityProfile: nativeMcpCapabilityProfile,
					...runtimeToolsAllowPolicy !== void 0 ? { runtimeToolsAllow: runtimeToolsAllowPolicy } : {}
				} } : {}
			});
			const cleanupPreparedBackend = sequenceCliCleanups(preparedBackend.cleanup && (() => preparedBackend.cleanup?.()), cleanupMcpClientGrant);
			cleanupPreparedResources = cleanupPreparedBackend;
			const prepareExecutionContext = {
				config: params.config,
				workspaceDir,
				agentDir,
				provider: params.provider,
				modelId,
				...params.contextWindow ? { contextWindow: params.contextWindow } : {},
				contextTokenBudget: contextWindowInfo.tokens,
				thinkingLevel: providerThinkingLevel,
				authProfileId: effectiveAuthProfileId,
				executionMode,
				toolAvailability: params.cliToolAvailability,
				env: preparedBackend.env,
				...params.isolatedCompletion ? {
					isolatedCompletionCwd: cwd,
					isolatedCompletionModelId: normalizedModel,
					isolatedCompletionPrompt: params.prompt,
					isolatedCompletionSystemPrompt: params.extraSystemPrompt ?? ""
				} : {}
			};
			try {
				params.assertCurrent?.();
				const backendPrepareContext = backendAuthPolicy ? {
					...prepareExecutionContext,
					authCredential
				} : prepareExecutionContext;
				preparedExecution = await backendResolved.prepareExecution?.(backendPrepareContext) ?? void 0;
			} catch (error) {
				if (error instanceof CliBackendAuthProfilePreparationError && effectiveAuthProfileId) throw new CliAuthProfilePreparationError({
					message: error.message,
					profileId: effectiveAuthProfileId,
					provider: authStore?.profiles[effectiveAuthProfileId]?.provider ?? params.provider,
					agentDir,
					cause: error
				});
				throw error;
			}
			const pluginExecutionConsumer = retainCliPluginExecutionConsumer(preparedExecution?.execute);
			const cleanupExecution = () => preparedExecution?.cleanup?.();
			const preparedBackendCleanup = sequenceCliCleanups(pluginExecutionConsumer ? () => pluginExecutionConsumer.run(cleanupExecution) : preparedExecution?.cleanup && cleanupExecution, cleanupPreparedBackend, pluginExecutionConsumer && (() => pluginExecutionConsumer.release()));
			cleanupPreparedResources = preparedBackendCleanup;
			params.assertCurrent?.();
			if (params.isolatedCompletion && preparedExecution?.isolatedCompletionEnforced !== true) throw unsupportedIsolatedCompletionError(backendResolved.id);
			if (params.cliToolAvailability && backendResolved.toolAvailabilityEnforcement === "prepare-execution" && preparedExecution?.toolAvailabilityEnforced !== true) throw new Error(`CLI backend ${backendResolved.id} did not enforce exact per-run tool availability during execution preparation`);
			const skipLocalCredentialEpoch = Boolean(backendResolved.authEpochMode === "profile-only" && effectiveAuthProfileId && authCredential && preparedExecution);
			const authEpoch = await resolveCliAuthEpoch({
				provider: params.provider,
				agentDir,
				authProfileId: effectiveAuthProfileId,
				skipLocalCredential: skipLocalCredentialEpoch
			});
			const authBindingFingerprint = params.onSuccessfulAuthBinding ? await resolveCliAuthBindingFingerprint({
				provider: params.provider,
				config: runConfig,
				agentDir,
				...effectiveAuthProfileId ? { authProfileId: effectiveAuthProfileId } : {},
				...resolvedProfileAuth ? { resolvedAuth: resolvedProfileAuth } : {},
				...skipLocalCredentialEpoch ? { skipLocalCredential: true } : {}
			}) : void 0;
			const preparedBackendEnv = preparedExecution?.env && Object.keys(preparedExecution.env).length > 0 ? {
				...preparedBackend.env,
				...preparedExecution.env
			} : preparedBackend.env;
			const preparedBackendBeforeExecution = preparedBackend.beforeExecution || preparedExecution?.beforeExecution ? async () => {
				await preparedBackend.beforeExecution?.();
				await preparedExecution?.beforeExecution?.();
			} : void 0;
			const claudeSkillsPlugin = skipsTurnPreparation || nodeClaudePlacement || params.cliToolAvailability !== void 0 ? {
				args: [],
				cleanup: async () => {}
			} : await prepareClaudeCliSkillsPlugin({
				backendId: backendResolved.id,
				skillsSnapshot: params.skillsSnapshot
			});
			let claudeSkillsPluginClaimed = false;
			const claimLiveSessionResources = claudeSkillsPlugin.args.length > 0 ? () => {
				if (claudeSkillsPluginClaimed) return;
				claudeSkillsPluginClaimed = true;
				return claudeSkillsPlugin.cleanup;
			} : void 0;
			const preparedCleanup = sequenceCliCleanups(preparedBackendCleanup || claudeSkillsPlugin.args.length > 0 ? async () => {
				if (!claudeSkillsPluginClaimed) await claudeSkillsPlugin.cleanup();
			} : void 0, preparedBackendCleanup);
			cleanupPreparedResources = preparedCleanup;
			const preparedBackendClearEnv = [...preparedBackend.backend.clearEnv ?? [], ...preparedExecution?.clearEnv ?? []];
			const { liveSession: _liveSession, ...processPerTurnBackend } = preparedBackend.backend;
			const preparedBackendFinal = {
				...preparedBackend,
				backend: {
					...isSideQuestion ? {
						...processPerTurnBackend,
						sessionMode: "none"
					} : params.disableCliLiveSession ? processPerTurnBackend : preparedBackend.backend,
					...preparedBackendClearEnv.length > 0 ? { clearEnv: uniqueStrings(preparedBackendClearEnv) } : {}
				},
				...preparedBackendEnv ? { env: preparedBackendEnv } : {},
				...preparedBackendBeforeExecution ? { beforeExecution: preparedBackendBeforeExecution } : {},
				...claimLiveSessionResources ? { claimLiveSessionResources } : {},
				...preparedExecution?.secretInput ? { secretInput: preparedExecution.secretInput } : {},
				...mcpClientGrantCapture ? { mcpClientGrantCapture } : {},
				...preparedCleanup ? { cleanup: preparedCleanup } : {}
			};
			const executionTarget = resolveCliExecutionTarget({
				params,
				backendId: backendResolved.id,
				execute: preparedExecution?.execute
			});
			const promptToolNamesHash = bundleMcpEnabled ? hashCliSessionText(JSON.stringify(cliSessionToolNames(promptTools))) : void 0;
			const ignoreCliSessionCandidate = preparedBackendFinal.backend.sessionMode === "none";
			const controlOperationCliSessionId = isControlOperation ? params.cliSessionBinding?.sessionId?.trim() || params.cliSessionId?.trim() : void 0;
			const reusableCliSessionCandidate = ignoreCliSessionCandidate ? { mode: "none" } : controlOperationCliSessionId ? {
				mode: "reuse",
				sessionId: controlOperationCliSessionId
			} : params.cliSessionBinding ? resolveCliSessionReuse({
				binding: params.cliSessionBinding,
				authProfileId: effectiveAuthProfileId,
				authEpoch,
				authEpochVersion: 7,
				extraSystemPromptHash,
				messageToolPolicyHash,
				promptToolNamesHash,
				cwdHash,
				mcpConfigHash: preparedBackendFinal.mcpConfigHash,
				mcpResumeHash: preparedBackendFinal.mcpResumeHash
			}) : params.cliSessionId ? {
				mode: "reuse",
				sessionId: params.cliSessionId
			} : { mode: "none" };
			const backendReusableCliSession = reusableCliSessionCandidate.mode === "reuse-with-drift" && !canTransportSystemPrompt(preparedBackendFinal.backend) ? {
				mode: "invalidate",
				invalidatedReason: "system-prompt"
			} : reusableCliSessionCandidate;
			const candidateClaudeCliSessionId = resolveCliSessionId(backendReusableCliSession)?.trim() || void 0;
			const hasClaudeCliCandidate = !isControlOperation && !nodeClaudePlacement && candidateClaudeCliSessionId !== void 0 && isClaudeCliBackendId(params.provider);
			const claudeCliTranscriptMissing = hasClaudeCliCandidate && !await claudeCliSessionTranscriptHasContent({
				sessionId: candidateClaudeCliSessionId,
				workspaceDir: cwd
			});
			const managedClaudeLiveSessionGeneration = claudeCliTranscriptMissing && backendResolved.id === "claude-cli" && "liveSession" in preparedBackendFinal.backend && preparedBackendFinal.backend.liveSession === "claude-stdio" && preparedBackendFinal.backend.output === "jsonl" && preparedBackendFinal.backend.input === "stdin" && getCliLiveSessionGeneration({
				backendId: backendResolved.id,
				agentId: workspaceResolution.agentId,
				sessionId: params.sessionId,
				sessionKey: params.sessionKey
			});
			const hasManagedClaudeLiveSession = Boolean(managedClaudeLiveSessionGeneration);
			const claudeCliTranscriptOrphanedToolUse = hasClaudeCliCandidate && !claudeCliTranscriptMissing && await claudeCliSessionTranscriptHasOrphanedToolUse({
				sessionId: candidateClaudeCliSessionId,
				workspaceDir: cwd
			});
			const claudeCliInvalidatedReason = claudeCliTranscriptMissing && !hasManagedClaudeLiveSession ? "missing-transcript" : claudeCliTranscriptOrphanedToolUse ? "orphaned-tool-use" : void 0;
			const reusableCliSession = claudeCliInvalidatedReason ? {
				mode: "invalidate",
				invalidatedReason: claudeCliInvalidatedReason
			} : backendReusableCliSession;
			const reusableCliSessionId = resolveCliSessionId(reusableCliSession);
			const invalidatedReason = reusableCliSession.mode === "invalidate" ? reusableCliSession.invalidatedReason : void 0;
			if (invalidatedReason) cliBackendLog.info(`cli session reset: provider=${params.provider} reason=${invalidatedReason}`);
			const openClawReferences = skipsTurnPreparation ? {
				docsPath: null,
				sourcePath: null
			} : await (await import("./docs-path-B_MUigIk.mjs")).resolveOpenClawReferencePaths({
				workspaceDir,
				argv1: process.argv[1],
				cwd,
				moduleUrl: import.meta.url
			});
			const skillPreparationParams = params;
			const assertSkillsCurrent = skillPreparationParams.admittedRunContext ? createCliRunCurrentAssertion({
				...skillPreparationParams,
				admittedRunContext: skillPreparationParams.admittedRunContext
			}) : () => {
				skillPreparationParams.assertCurrent?.();
				skillPreparationParams.abortSignal?.throwIfAborted();
				skillPreparationParams.preparedRunAdmission?.assertSourceCurrent();
			};
			const preparedSkills = skipsTurnPreparation || nodeClaudePlacement || claudeSkillsPlugin.args.length > 0 ? { prompt: "" } : await resolveCliSkillsPrompt({
				assertCurrent: assertSkillsCurrent,
				run: params,
				workspaceDir,
				executionWorkspaceDir: cwd,
				config: params.config,
				agentId: sessionAgentId,
				sessionKey: params.sessionKey?.trim() || params.sessionId
			});
			assertSkillsCurrent();
			const { runtimeChannel, runtimeCapabilities, customInlineButtonHint, messageToolHints } = resolveRuntimeChannelPromptContext({
				cfg: params.config,
				channel: skipsTurnPreparation ? void 0 : params.messageChannel ?? params.messageProvider,
				accountId: params.agentAccountId
			});
			const requesterProfileId = readRunOperatorAuthority(params)?.profileId;
			const builtSystemPrompt = isControlOperation ? "" : isSideQuestion ? extraSystemPrompt : await prepareCliSystemPrompt({
				preparedTtsPreferences: params.preparedTtsPreferences,
				requesterProfileId,
				workspaceDir,
				cwd,
				config: params.config,
				extraSystemPrompt,
				sourceReplyDeliveryMode: bindingSourceReplyDeliveryMode,
				requireExplicitMessageTarget: bindingRequireExplicitMessageTarget,
				silentReplyPromptMode: params.silentReplyPromptMode,
				runtimeChannel,
				runtimeChatType,
				runtimeCapabilities,
				customInlineButtonHint,
				messageToolHints,
				ownerNumbers: params.ownerNumbers,
				docsPath: openClawReferences.docsPath ?? void 0,
				sourcePath: openClawReferences.sourcePath ?? void 0,
				skillsPrompt: preparedSkills.prompt,
				tools: promptTools,
				contextFiles,
				bootstrapMode,
				bootstrapTruncationNotice,
				modelDisplay,
				agentId: sessionAgentId,
				sessionKey: params.sessionKey,
				sessionId: params.sessionId
			});
			let systemPrompt = !skipsTurnPreparation ? backendResolved.transformSystemPrompt?.({
				config: params.config,
				workspaceDir,
				provider: params.provider,
				modelId,
				modelDisplay,
				agentId: sessionAgentId,
				systemPrompt: builtSystemPrompt,
				openClawMcpToolNames: systemAgentMcpConfig ? ["openclaw"] : bundleMcpEnabled ? projectedTools.map((tool) => tool.name) : []
			}) ?? builtSystemPrompt : builtSystemPrompt;
			const allowRawTranscriptReseed = backendResolved.config.reseedFromRawTranscriptWhenUncompacted === true;
			const historyParams = params = await admitCliRunParams(params, workspaceResolution.agentId);
			const cliHistoryWriter = !isSideQuestion ? await prepareCliHistoryBoundary(historyParams, { credential: authCredential }) : void 0;
			const rawTranscriptReseedReason = !(params.sessionManager !== void 0 || cliHistoryWriter !== void 0) ? "auth-unknown" : reusableCliSessionId ? "session-expired" : invalidatedReason ?? (ignoreCliSessionCandidate ? void 0 : "missing-transcript");
			const sessionPromptContext = skipsTurnPreparation || params.isolatedCompletion ? void 0 : await loadCliSessionPromptContext({
				...params,
				allowRawTranscriptReseed,
				rawTranscriptReseedReason,
				nativeSessionId: reusableCliSessionId,
				tools: promptTools
			});
			const effectiveReplyGuidance = skipsTurnPreparation || params.isolatedCompletion ? void 0 : buildHarnessVisibleReplyGuidance({
				sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
				messageToolAvailable,
				requireExplicitMessageTarget
			});
			const finalizedTranscriptPrompt = (params.finalizePromptForResolvedTools || sessionPromptContext?.durableContext || sessionPromptContext?.sessionGapContext || sessionPromptContext?.resumeContext || effectiveReplyGuidance) && params.transcriptPrompt === void 0 ? params.prompt : params.transcriptPrompt;
			let promptContext;
			let promptForHooks;
			let preparedPrompt = isControlOperation ? params.prompt : params.finalizePromptForResolvedTools?.({
				prompt: params.prompt,
				messageToolAvailable
			}) ?? params.prompt;
			if (!isControlOperation && params.skillsSnapshot?.librarySelections?.length) preparedPrompt = remapSkillReferencePaths(preparedPrompt, preparedSkills.usagePaths);
			let historyPromptCurrentTurn = preparedPrompt;
			if (!skipsTurnPreparation) {
				({prompt: preparedPrompt, systemPrompt, promptContext, promptForHooks} = await prepareCliTurnPromptContext({
					configuredTimezone: params.config?.agents?.defaults?.userTimezone,
					prompt: preparedPrompt,
					systemPrompt,
					privateContext: executionTarget.kind === "plugin",
					backendId: backendResolved.id,
					runtimeFactsInTurn: params.runtimeFactsInTurn,
					deliveryGuidance: effectiveReplyGuidance,
					hookResult: promptBuildHookResult,
					prependContext: [
						sessionPromptContext?.durableContext,
						promptBuildHookResult?.prependContext,
						authorizedPromptBuildResult?.prependContext
					],
					requesterProfileId,
					capabilityToolNames: new Set(promptTools.map((tool) => tool.name)),
					sessionKey: params.sessionKey,
					agentId: sessionAgentId,
					backend: preparedBackendFinal.backend,
					isNewSession: !reusableCliSessionId?.trim() || reusableCliSession.mode === "reuse-with-drift",
					thinkLevel: params.thinkLevel,
					nativeDelegationTools: keptManagedNativeTools(managedNativeTools, params),
					runtimeContextFragments: params.runtimeContextFragments,
					sessionTarget: params.isolatedCompletion ? void 0 : cliHistoryWriter?.target,
					context: [promptBuildHookResult?.appendContext, authorizedPromptBuildResult?.appendContext]
				}));
				params.assertCurrent?.();
				params.abortSignal?.throwIfAborted();
				const renderCurrentPrompt = createCliCurrentPromptRenderer(params, reusableCliSession, sessionPromptContext);
				const preferResumableText = params.currentInboundEventKind === "room_event" && Boolean(reusableCliSessionId);
				historyPromptCurrentTurn = renderCurrentPrompt(preparedPrompt);
				preparedPrompt = renderCurrentPrompt(preparedPrompt, preferResumableText);
				if (promptForHooks !== void 0) promptForHooks = renderCurrentPrompt(promptForHooks, preferResumableText);
			}
			let openClawHistoryPrompt = !skipsTurnPreparation && (!reusableCliSessionId || allowRawTranscriptReseed) ? buildCliSessionHistoryPrompt({
				messages: sessionPromptContext?.reseedMessages ?? [],
				prompt: historyPromptCurrentTurn,
				maxHistoryChars: autoReseedHistoryChars
			}) : void 0;
			const systemPromptWithReplacements = skipsTurnPreparation ? systemPrompt : applyPluginTextReplacements(systemPrompt, backendResolved.textTransforms?.input);
			systemPrompt = skipsTurnPreparation ? systemPromptWithReplacements : appendModelIdentitySystemPrompt({
				systemPrompt: buildModelIdentityPromptLine(modelDisplay) && systemPromptWithReplacements.trim().length > 0 ? ensureSystemPromptCacheBoundary(systemPromptWithReplacements) : systemPromptWithReplacements,
				model: modelDisplay
			});
			if (sessionPromptContext?.resumeContext) promptForHooks = composeCliPromptContext(promptForHooks ?? preparedPrompt, { prependContext: sessionPromptContext.resumeContext });
			const systemPromptReport = buildSystemPromptReport({
				source: "run",
				generatedAt: Date.now(),
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				provider: params.provider,
				model: modelId,
				workspaceDir,
				bootstrapMaxChars,
				bootstrapTotalMaxChars,
				bootstrapTruncation: buildBootstrapTruncationReportMeta({
					analysis: bootstrapAnalysis,
					warningMode: bootstrapPromptWarningMode,
					warning: bootstrapPromptWarning
				}),
				sandbox: {
					mode: "off",
					sandboxed: false
				},
				systemPrompt,
				injectedWorkspaceFiles: bootstrapInjectionStats,
				skillsPrompt: preparedSkills.prompt,
				tools: promptTools,
				currentTurn: {
					...params.currentInboundEventKind ? { kind: params.currentInboundEventKind } : {},
					promptChars: preparedPrompt.length,
					runtimeContextChars: [promptContext?.prependContext, promptContext?.appendContext].filter(Boolean).join("\n\n").length
				}
			});
			const buildPreparedContext = (preparedParams) => ({
				params: preparedParams,
				bindQuestionAnswerAuthority,
				sessionEventSourcePolicy,
				effectiveAuthProfileId,
				...authStore ? { authProfileStore: authStore } : {},
				agentDir,
				started,
				startedMonotonicMs,
				workspaceDir,
				cwd,
				backendResolved,
				hostOwnedTools,
				preparedBackend: preparedBackendFinal,
				...loopbackServerConfig && !systemAgentMcpConfig && backendResolved.bundleMcpMode === "claude-config-file" ? { managedMcpToolTimeoutMs: CLAUDE_MANAGED_MCP_TIMEOUT_MS } : {},
				executionTarget,
				...pluginExecutionConsumer ? { pluginExecutionConsumer } : {},
				reusableCliSession,
				contextEngineConfig: runConfig,
				modelId,
				normalizedModel,
				providerThinkingLevel,
				contextWindowInfo,
				systemPrompt,
				systemPromptReport,
				claudeSkillsPluginArgs: claudeSkillsPlugin.args,
				...cliHistoryWriter ? { cliHistoryWriter } : {},
				resumeContext: sessionPromptContext?.resumeContext,
				transcriptCursor: sessionPromptContext?.transcriptCursor,
				authEpoch,
				authBindingFingerprint,
				...skipLocalCredentialEpoch ? { authBindingSkipsLocalCredential: true } : {},
				authEpochVersion: 7,
				extraSystemPromptHash,
				messageToolPolicyHash,
				promptToolNamesHash,
				...resultContentSourceByToolName.size > 0 ? { resultContentSourceByToolName } : {},
				cwdHash,
				...bundleMcpEnabled ? { mcpDeliveryCapture: true } : {}
			});
			const admitFinalParams = async () => {
				const preparedParams = await admitCliRunParams({
					...params,
					config: runConfig,
					prompt: preparedPrompt,
					transcriptPrompt: finalizedTranscriptPrompt,
					...requireExplicitMessageTarget ? { requireExplicitMessageTarget: true } : {}
				}, workspaceResolution.agentId);
				bindMcpClientGrantAdmission(preparedParams.admittedRunContext);
				if (!isControlOperation) recordAdmittedModelRoutingDecision({
					admittedRunContext: preparedParams.admittedRunContext,
					abortSignal: preparedParams.abortSignal,
					requestedProvider: params.modelRoutingProvenance?.requestedProvider ?? params.modelProvider ?? params.provider,
					requestedModel: params.modelRoutingProvenance?.requestedModel ?? params.model ?? "default",
					selectedProvider: params.modelProvider ?? params.provider,
					selectedModel: normalizedModel,
					selectionMode: requestedAuthProfileId ? "explicit" : "automatic",
					credentialProfileId: effectiveAuthProfileId,
					fallbackSelected: params.modelRoutingProvenance?.stage === "fallback",
					fallbackReason: params.modelRoutingProvenance?.fallbackReason
				});
				return preparedParams;
			};
			if (skipsTurnPreparation) return finishPreparation({
				...buildPreparedContext(await admitFinalParams()),
				hadSessionFile: false
			});
			const contextEngineAgentDir = resolveAgentDir(runConfig, sessionAgentId);
			const contextEngineHostSupport = buildGenericCliContextEngineHostSupport({
				backendId: backendResolved.id,
				capabilities: backendResolved.contextEngineHostCapabilities
			});
			let resolvedContextEngine;
			let deferContextEngineDisposalUntil = params.contextEngineLogicalTurnLease?.deferDisposalUntil;
			if (params.contextEngineLogicalTurnLease) resolvedContextEngine = (await beginContextEngineLogicalTurn({
				lease: params.contextEngineLogicalTurnLease,
				host: contextEngineHostSupport,
				recorder: params.userTurnTranscriptRecorder,
				isHeartbeat: isHeartbeatLifecycleRunKind(params.bootstrapContextRunKind),
				sessionTarget: params.sessionTarget
			})).engine;
			else {
				const trackDisposal = captureAsyncWorkTracker();
				const ownedEngine = await resolveContextEngine(runConfig, {
					initialize: registerLegacyContextEngine,
					agentDir: contextEngineAgentDir,
					workspaceDir
				});
				resolvedContextEngine = ownedEngine;
				const disposalHolds = /* @__PURE__ */ new Set();
				deferContextEngineDisposalUntil = (promise) => {
					disposalHolds.add(promise);
					promise.finally(() => disposalHolds.delete(promise)).catch(() => {});
				};
				cleanupPreparedResources = sequenceCliCleanups(async () => {
					if (disposalHolds.size > 0) trackDisposal(async () => {
						await Promise.allSettled(disposalHolds);
						await runCliCleanup(params, "cli-context-engine-release", async () => {
							await ownedEngine.dispose?.();
						});
					}).catch((error) => {
						cliBackendLog.warn(`CLI context engine cleanup failed: ${String(error)}`);
					});
					else await ownedEngine.dispose?.();
				}, cleanupPreparedResources);
				preparedBackendFinal.cleanup = cleanupPreparedResources;
			}
			const contextEngine = resolvedContextEngine.info.id !== "legacy" ? resolvedContextEngine : void 0;
			if (contextEngine) assertContextEngineHostSupport({
				contextEngine,
				operation: "agent-run",
				host: contextEngineHostSupport
			});
			const hadSessionFile = await hasCliSessionTranscript(params);
			const contextEngineTurnPrompt = params.transcriptPrompt ?? params.prompt;
			let preparedParams = await admitFinalParams();
			const note = await claimHeartbeatContextForUserRun({
				...preparedParams,
				agentId: sessionAgentId,
				storePath: params.sessionTarget?.storePath ?? params.storePath,
				detached: Boolean(params.sessionManager || params.isolatedCompletion),
				assertCurrent: createCliRunCurrentAssertion(preparedParams)
			});
			if (note) {
				preparedParams = {
					...preparedParams,
					transcriptPrompt: finalizedTranscriptPrompt ?? params.prompt
				};
				const append = (text) => composeCliPromptContext(text, { appendContext: note });
				if (executionTarget.kind === "plugin") {
					promptContext = {
						...promptContext,
						appendContext: append(promptContext?.appendContext ?? "")
					};
					promptForHooks = append(promptForHooks ?? preparedParams.prompt);
				} else {
					preparedParams.prompt = append(preparedParams.prompt);
					if (openClawHistoryPrompt) openClawHistoryPrompt = append(openClawHistoryPrompt);
				}
			}
			return finishPreparation({
				...buildPreparedContext(preparedParams),
				...managedClaudeLiveSessionGeneration ? { requiredClaudeLiveSessionGeneration: managedClaudeLiveSessionGeneration } : {},
				hadSessionFile,
				contextEngine,
				deferContextEngineDisposalUntil,
				contextEngineTurnPrompt,
				...promptContext ? { promptContext } : {},
				...promptForHooks !== void 0 ? { promptForHooks } : {},
				...nodeSkillWorkshop ? { nodeSkillWorkshop } : {},
				...openClawHistoryPrompt ? { openClawHistoryPrompt } : {}
			});
		} catch (err) {
			try {
				await runCliCleanup(params, "cli-prepare-failure", async () => {
					await cleanupPreparedResources?.();
				});
			} catch (cleanupErr) {
				cliBackendLog.warn(`cli backend cleanup after prepare failure failed: ${String(cleanupErr)}`);
			}
			throw err;
		}
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
//#endregion
export { detectNodeClaudePlacement as n, prepareCliRunContext as t };
