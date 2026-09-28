import { n as captureAsyncWorkTracker } from "./async-work-scope-CWk2dk1h.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { T as hasAgentRosterProperty, a as resolveAgentDir, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { A as parseAgentSessionKey, S as isSubagentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { l as normalizeToolPolicyName, o as expandToolGroups } from "./tool-policy-shared-auQCQEhM.mjs";
import "./tool-policy-YDdaK0oX.mjs";
import { t as DEFAULT_CONTEXT_TOKENS } from "./defaults-BbU4k6fu.mjs";
import { y as resolveSessionAgentIds } from "./agent-scope-CTuYDtny.mjs";
import { t as findModelCatalogEntry } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { n as resolveApiKeyForProfile } from "./oauth-BAupA9eR.mjs";
import { r as hasUsableOAuthCredential } from "./credential-state-CWZ_V0ds.mjs";
import { f as resolveRuntimeAuthProfileAgentDir } from "./store-CTvq6MSF.mjs";
import { a as buildOAuthRefreshFailureLoginCommand } from "./oauth-refresh-failure-CVji5U1C.mjs";
import { s as resolveContextEngine } from "./registry-BKkCbmgx.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-tOGjxVvH.mjs";
import { n as isKnownCliHistoryBoundary, r as runWithCliHistoryWriter } from "./cli-history-boundary-CwwMqsE-.mjs";
import { n as assertOwnedTranscriptWriteCommit } from "./transcript-write-context-MlBhwaKa.mjs";
import { n as canonicalizeMainSessionAlias } from "./main-session-De-bcoks.mjs";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-BbOBKQM3.mjs";
import { a as resolveAuthProfileOrder, l as isSetupCredentialAccessible } from "./order-BQhYF772.mjs";
import { o as loadAuthProfileStoreForRuntime } from "./store-runtime-CzCVI_rv.mjs";
import { n as loadManifestModelCatalog } from "./model-catalog-Dt2JkTIv.mjs";
import { t as applyPluginTextReplacements } from "./plugin-text-transforms-CuF3jf1R.mjs";
import { i as resolveCliBackendConfig } from "./cli-backends-CNff5-1q.mjs";
import { n as DEFAULT_BOOTSTRAP_FILENAME } from "./workspace-bootstrap-policy-DSEIbIS8.mjs";
import { i as isWorkspaceBootstrapPending } from "./workspace-mlzi3k1x.mjs";
import { o as waitForSessionTranscriptProjection } from "./session-transcript-reconcile-Cef06Gbk.mjs";
import { a as runWithSessionTranscriptReadFence, r as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-Crjo4FKU.mjs";
import { d as patchSessionEntryCore, l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import { l as readSessionTranscriptWatermark } from "./session-accessor-C05KQ5A3.mjs";
import { n as resolveSessionTranscriptDatabasePath } from "./session-accessor.transcript-target-CV-eEST-.mjs";
import { r as validateSessionTranscriptContextAdmission } from "./session-accessor.sqlite-model-context-Dxi3aFzy.mjs";
import { d as readPreparedRunOperatorAuthority, f as resolveAdmittedRunActiveAssertion, o as getAdmittedRunDelegatedAuthority, p as resolvePreparedRunAdmission, u as readAdmittedRunOperatorAuthority } from "./admitted-run-context-BNasoszr.mjs";
import { a as annotateInterSessionPromptText } from "./input-provenance-C4tQegGN.mjs";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-GvZUbuy9.mjs";
import { a as hashCliSessionText, c as resolveCliSessionReuse, r as buildCliSessionDriftNote } from "./cli-session-CeXeyPue.mjs";
import { n as createAgentQuestionAnswerAuthority } from "./host-private-capabilities-D8EEgJHq.mjs";
import { i as buildGenericCliContextEngineHostSupport, r as assertContextEngineHostSupport } from "./host-compat-xESS3bi6.mjs";
import { t as ensureContextEnginesInitialized } from "./init-Det6CNcL.mjs";
import { a as resolveContextTokensForModel } from "./context-na2bB1IO.mjs";
import { t as resolveModelContextWindowProfile } from "./model-context-window-CoR3Uyg1.mjs";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-DHYohf4q.mjs";
import { t as claimHeartbeatContextForUserRun } from "./heartbeat-outcome-store-Do2Z0dgV.mjs";
import { t as isHeartbeatLifecycleRunKind } from "./bootstrap-mode-HvSedbJl.mjs";
import { n as buildCurrentInboundPrompt } from "./runtime-context-prompt-Jr1ZDwll.mjs";
import { a as remapSkillReferencePaths, i as mapSandboxSkillEntriesForPrompt, n as resolveEmbeddedRunSkillEntries, o as resolveSandboxSkillRuntimeInputs, t as collectRuntimeChannelCapabilities } from "./runtime-capabilities-CJ-I3wZ8.mjs";
import { n as resolveSkillsPrompt } from "./workspace-skill-prompt-B1KKDxz4.mjs";
import { a as buildBootstrapTruncationReportMeta, i as buildBootstrapPromptWarningNotice, n as buildBootstrapBudgetState, r as buildBootstrapInjectionStats } from "./bootstrap-budget-DZWwd3xP.mjs";
import { a as resolveBootstrapContextForRun, i as makeBootstrapWarn } from "./bootstrap-files-Cueaawuk.mjs";
import { g as resolveWorkspaceBootstrapRouting, h as isPrimaryBootstrapRun } from "./openclaw-tools-C9d9-ZpX.mjs";
import { t as ensureSandboxWorkspaceForSession } from "./context-Csq-w9NQ.mjs";
import "./sandbox-wz8zRGj4.mjs";
import { t as SessionManager } from "./session-manager-Bb7qQp5M.mjs";
import { t as buildSessionContext } from "./session-manager-codec-DW3_Rlj9.mjs";
import { l as resolvePromptBuildHookResult, n as waitForDeferredTurnMaintenanceForSession } from "./context-engine-maintenance-DR58exyi.mjs";
import { a as resolveContextWindowInfo } from "./context-window-guard-BHx3Iiy5.mjs";
import { r as messageToolOwnsVisibleReply } from "./source-reply-delivery-mode-XpBChpaV.mjs";
import { a as assertNativeCronCreatorCapabilities } from "./cron-tool-creator-cap-CrhAXfqG.mjs";
import { n as mergeForcedEmbeddedAttemptToolsAllow, t as applyEmbeddedAttemptToolsAllow } from "./attempt-tool-construction-plan-DN-5OrUy.mjs";
import { t as buildAgentHookContextChannelFields } from "./hook-agent-context-C33rGaR3.mjs";
import { n as composeSystemPromptWithHookContext } from "./attempt-thread-helpers-4QItXoFy.mjs";
import { o as appendModelIdentitySystemPrompt, s as buildModelIdentityPromptLine } from "./system-prompt-params-CQI69lAx.mjs";
import { t as prepareReplyToolAuthority } from "./reply-tool-authority-_0-jZU7C.mjs";
import { t as buildSystemPromptReport } from "./system-prompt-report-DGQFUGNu.mjs";
import { a as selectContextEngineForTranscriptHost, n as drainPendingContextEngineTurnsBeforeRun } from "./context-engine-turn-attempt-O6C2wPbH.mjs";
import { n as redactRunIdentifier, r as resolveRunWorkspaceDir, t as recordAdmittedModelRoutingDecision } from "./model-routing-decision-j5P1RtjY.mjs";
import { t as resolveReusableWorkspaceSkillSnapshot } from "./session-snapshot-BXS6dUP9.mjs";
import { t as resolveBundledCliBackendAuthPolicy } from "./cli-backend-auth-policy-BJQR9lNK.mjs";
import { a as buildSystemAgentToolsMcpServerConfig } from "./openclaw-tools-serve-config-C8JxIGR6.mjs";
import { n as resolveCliAuthBindingFingerprint, r as resolveCliAuthEpoch } from "./cli-auth-epoch-B8HYTC0l.mjs";
import { n as cliBackendLog } from "./log-lbZDIx37.mjs";
import { a as normalizeCliModel, i as isClaudeCliBackendId } from "./helpers-BIwgJvqv.mjs";
import { t as bindAgentRunTerminalWriteContext } from "./agent-run-terminal-writes-CCfF2RZR.mjs";
import { t as CliBackendAuthProfilePreparationError } from "./cli-backend-errors-ngojFnXq.mjs";
import { a as prepareCliBundleMcpConfig, c as applyClaudeManagedMcpTimeout, n as composeCliPromptContext, o as resolveCliNativeWebSearchEnabled, r as prepareCliSystemPrompt, s as CLAUDE_MANAGED_MCP_TIMEOUT_MS, t as buildCliTurnAppendContext } from "./prompt-context-CFHVUjG9.mjs";
import { _ as resolveCliExecutionTarget, g as createCliRunCurrentAssertion, o as getCliLiveSessionGeneration, v as retainCliPluginExecutionConsumer, y as runCliCleanup } from "./cli-live-session-registry-CVRY7R5X.mjs";
import { a as createMcpLoopbackServerConfig, o as getActiveMcpLoopbackRuntime } from "./mcp-http.loopback-runtime-CFrmBr1v.mjs";
import { a as mintMcpLoopbackClientGrant, d as revokeMcpLoopbackClientGrant, n as bindMcpLoopbackClientGrantAdmission, p as transferMcpLoopbackClientGrant, r as deactivateMcpLoopbackClientGrantCapture, t as activateMcpLoopbackClientGrantCapture } from "./mcp-grant-store-C4TWuDzs.mjs";
import { n as ensureMcpLoopbackServer } from "./mcp-http-8pRKhQK0.mjs";
import { n as resolveMcpLoopbackPolicyTools, r as resolveMcpLoopbackScopedTools } from "./mcp-http.runtime-2gXF6nlA.mjs";
import { a as loadCliSessionPromptContext, c as CliAuthProfilePreparationError, d as claudeCliSessionTranscriptHasOrphanedToolUse, i as loadCliSessionHistoryMessages, n as hasCliSessionTranscript, o as resolveAutoCliSessionReseedHistoryChars, t as buildCliSessionHistoryPrompt, u as claudeCliSessionTranscriptHasContent } from "./session-history-Dlx6QSWT.mjs";
import { t as prepareRootedExecutionCapability } from "./rooted-run-params-DBoBO8ki.mjs";
import { i as normalizeOptionalMcpContextValue, n as buildCliMcpGrantContext, r as finalizeCliMcpGrant } from "./mcp-grant-context-BmbT_OKN.mjs";
import { accessSync } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { createHash } from "node:crypto";
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
/**
* Materializes selected OpenClaw skills as a temporary Claude CLI plugin.
*/
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
/** Returns whether a resolved skill file is readable before linking it into the Claude plugin. */
function isClaudeCliSkillFileAccessible(skillFilePath) {
	try {
		accessSync(skillFilePath);
		return true;
	} catch {
		return false;
	}
}
async function collectClaudePluginSkills(snapshot) {
	const skills = snapshot?.resolvedSkills ?? [];
	if (skills.length === 0) return [];
	const usedTargetNames = /* @__PURE__ */ new Set();
	const materialized = [];
	for (const skill of skills) {
		const name = skill.name?.trim();
		const skillFilePath = skill.filePath?.trim();
		if (!name || !skillFilePath) continue;
		if (!isClaudeCliSkillFileAccessible(skillFilePath)) {
			cliBackendLog.warn(`claude skill plugin skipped missing skill file: ${skillFilePath}`);
			continue;
		}
		materialized.push({
			name,
			sourceDir: path.dirname(skillFilePath),
			targetDirName: sanitizeSkillDirName(name, usedTargetNames)
		});
	}
	return materialized;
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
	const skills = await collectClaudePluginSkills(params.skillsSnapshot);
	if (skills.length === 0) return {
		args: [],
		cleanup: async () => {}
	};
	const tempDir = await fs$1.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-claude-skills-"));
	const pluginDir = path.join(tempDir, OPENCLAW_CLAUDE_PLUGIN_NAME);
	const manifestDir = path.join(pluginDir, ".claude-plugin");
	const skillsDir = path.join(pluginDir, "skills");
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
		await fs$1.rm(tempDir, {
			recursive: true,
			force: true
		});
		return {
			args: [],
			cleanup: async () => {}
		};
	}
	return {
		args: ["--plugin-dir", pluginDir],
		pluginDir,
		cleanup: async () => {
			await fs$1.rm(tempDir, {
				recursive: true,
				force: true
			});
		}
	};
}
//#endregion
//#region src/agents/cli-runner/history-boundary.ts
/**
* History belongs to the local transcript, not the latest native handle. Cover only
* a proven-empty start or the contiguous events of the previously admitted CLI run.
* An account transition, old-runtime write, import or unknown legacy prefix stays
* unknown until an explicitly empty context starts a new history boundary.
*/
async function prepareCliHistoryBoundary(params, identity) {
	const source = params.sessionTarget;
	if (params.sessionManager || !source || source.sessionId !== params.sessionId || params.sessionKey !== void 0 && params.sessionKey !== source.sessionKey || !resolveAdmittedRunActiveAssertion(params.admittedRunContext, params.abortSignal)) return;
	const target = {
		...source,
		storePath: resolveSessionTranscriptDatabasePath(source)
	};
	const assertCurrent = createCliRunCurrentAssertion(params);
	await waitForSessionTranscriptProjection(target, params.abortSignal);
	assertCurrent();
	const snapshot = loadSessionEntryReadOnly(target);
	if (!snapshot || snapshot.sessionId !== target.sessionId) return;
	const watermark = readSessionTranscriptWatermark(target);
	const admission = resolveSessionTranscriptReadFence(target);
	validateSessionTranscriptContextAdmission(target, admission);
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
	const fingerprint = owner ? createHash("sha256").update(JSON.stringify([
		"cli-history-v1",
		normalizeProviderId(params.provider),
		owner
	])).digest("hex") : void 0;
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
	const boundary = allowed && fingerprint ? {
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
	};
	if (!await patchSessionEntryCore(target, (current) => {
		if (current.sessionId !== target.sessionId || current.lifecycleRevision !== snapshot.lifecycleRevision || current.activeWriterRunId !== snapshot.activeWriterRunId || current.activeWriterRunId !== void 0 && current.activeWriterRunId !== writerRunId || params.expectedLifecycleRevision !== void 0 && current.lifecycleRevision !== params.expectedLifecycleRevision) throw new Error("CLI history owner changed before preparation");
		return { cliHistoryBoundary: boundary };
	}, {
		preserveActivity: true,
		skipMaintenance: true,
		assertCommitAllowed: () => {
			assertCurrent();
			assertOwnedTranscriptWriteCommit(target);
			validateSessionTranscriptContextAdmission(target, admission);
			const fresh = readSessionTranscriptWatermark(target);
			if (fresh.generation !== watermark.generation || fresh.maxSeq !== watermark.maxSeq) throw new Error("CLI history changed before preparation");
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
		expectedWriterRunId: snapshot.activeWriterRunId,
		assertCurrent: assertWriterCurrent,
		assertReadable: () => {
			assertWriterCurrent();
			const current = loadSessionEntryReadOnly(target);
			const proof = current?.cliHistoryBoundary;
			const tip = readSessionTranscriptWatermark(target);
			if (!current || current.sessionId !== target.sessionId || current.lifecycleRevision !== snapshot.lifecycleRevision || current.activeWriterRunId !== snapshot.activeWriterRunId || !isKnownCliHistoryBoundary(proof) || proof.sessionId !== target.sessionId || proof.writerRunId !== writerRunId || proof.authFingerprint !== boundary.authFingerprint || proof.generation !== tip.generation || proof.maxSeq !== tip.maxSeq) throw new Error("CLI history authority changed before execution");
		}
	};
	const authority = getAdmittedRunDelegatedAuthority(params.admittedRunContext);
	if (!authority) throw new Error("CLI history writer is no longer active");
	bindAgentRunTerminalWriteContext(authority, { run: (write) => runWithCliHistoryWriter(writer, write) });
	return writer;
}
//#endregion
//#region src/agents/cli-runner/prepare-claude.ts
const CLAUDE_CLI_CONTEXT_MODEL_ALIASES = {
	opus: "claude-opus-5",
	"opus-5": "claude-opus-5",
	"opus-5.5": "claude-opus-5-5",
	"opus-5-5": "claude-opus-5-5",
	"opus-4.8": "claude-opus-4-8",
	"opus-4-8": "claude-opus-4-8",
	"opus-4.7": "claude-opus-4-7",
	"opus-4-7": "claude-opus-4-7",
	"opus-4.6": "claude-opus-4-6",
	"opus-4-6": "claude-opus-4-6",
	sonnet: "claude-sonnet-5",
	"sonnet-5": "claude-sonnet-5",
	"sonnet-4.6": "claude-sonnet-4-6",
	"sonnet-4-6": "claude-sonnet-4-6",
	fable: "claude-fable-5-1",
	"fable-5": "claude-fable-5",
	"fable-5.1": "claude-fable-5-1",
	"fable-5-1": "claude-fable-5-1"
};
function detectNodeClaudePlacement(params) {
	if (params.backendId === "claude-cli" && params.execHost === "node" && !params.execNode?.trim()) throw new Error("node-placed Claude CLI session is missing execNode");
	return params.backendId === "claude-cli" && params.execHost === "node" && Boolean(params.execNode?.trim());
}
//#endregion
//#region src/agents/cli-runner/tool-authority.ts
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
/**
* Prepares CLI backend run context: backend config, prompts, bootstrap context,
* MCP, auth epoch, and reusable session metadata.
*/
function unsupportedIsolatedCompletionError(backendId) {
	const error = /* @__PURE__ */ new Error(`CLI backend "${backendId}" does not support isolated completion; OpenClaw did not start the run.`);
	error.name = "IsolatedCompletionUnsupportedError";
	error.code = "unsupported";
	return error;
}
function resolveClaudeCliContextModelId(modelId) {
	const trimmed = modelId.trim();
	const lower = trimmed.toLowerCase();
	return CLAUDE_CLI_CONTEXT_MODEL_ALIASES[lower] ?? trimmed;
}
const defaultPrepareDeps = {
	isWorkspaceBootstrapPending,
	makeBootstrapWarn,
	resolveBootstrapContextForRun,
	getActiveMcpLoopbackRuntime,
	ensureMcpLoopbackServer,
	createMcpLoopbackServerConfig,
	activateMcpLoopbackClientGrantCapture,
	bindMcpLoopbackClientGrantAdmission,
	deactivateMcpLoopbackClientGrantCapture,
	mintMcpLoopbackClientGrant,
	revokeMcpLoopbackClientGrant,
	transferMcpLoopbackClientGrant,
	resolveMcpLoopbackPolicyTools,
	resolveMcpLoopbackScopedTools,
	resolveOpenClawReferencePaths: async (params) => (await import("./docs-path-Shkm1CLl.mjs")).resolveOpenClawReferencePaths(params),
	prepareClaudeCliSkillsPlugin,
	claudeCliSessionTranscriptHasContent,
	claudeCliSessionTranscriptHasOrphanedToolUse,
	getCliLiveSessionGeneration,
	resolveApiKeyForProfile,
	loadManifestModelCatalog
};
const prepareDeps = { ...defaultPrepareDeps };
function findSelectableContextWindowEntry(params) {
	for (const provider of params.providers) for (const model of params.models) {
		const entry = findModelCatalogEntry(params.catalog, {
			provider,
			modelId: model
		});
		if (entry?.contextWindows?.length) return entry;
	}
}
function resolveReusableCliSessionId(reusableCliSession) {
	return reusableCliSession.mode === "reuse" || reusableCliSession.mode === "reuse-with-drift" ? reusableCliSession.sessionId : void 0;
}
function resolveCliSessionInvalidatedReason(reusableCliSession) {
	return reusableCliSession.mode === "invalidate" ? reusableCliSession.invalidatedReason : void 0;
}
function prependCliSessionDriftUserContext(context, reusableCliSession) {
	if (reusableCliSession.mode !== "reuse-with-drift") return context;
	const note = buildCliSessionDriftNote(reusableCliSession.drift.reasons);
	if (!context) return { text: note };
	return {
		...context,
		text: [note, context.text].join("\n\n"),
		...context.resumableText ? { resumableText: [note, context.resumableText].join("\n\n") } : {}
	};
}
async function resolveCliSkillsPrompt(params) {
	params.assertCurrent();
	const skillsSnapshot = params.skillsSnapshot ?? (await resolveReusableWorkspaceSkillSnapshot({
		assertCurrent: params.assertCurrent,
		workspaceDir: params.workspaceDir,
		executionWorkspaceDir: params.executionWorkspaceDir,
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
	if (!sandboxWorkspace) {
		const { shouldLoadSkillEntries, skillEntries, loadSkillEntries, preserveEntryOrder } = await resolveEmbeddedRunSkillEntries({
			assertCurrent: params.assertCurrent,
			workspaceDir: params.workspaceDir,
			executionWorkspaceDir: params.executionWorkspaceDir,
			config: params.config,
			agentId: params.agentId,
			skillsSnapshot
		});
		return { prompt: await resolveSkillsPrompt({
			assertCurrent: params.assertCurrent,
			skillsSnapshot,
			entries: shouldLoadSkillEntries ? skillEntries : void 0,
			loadEntries: loadSkillEntries,
			workspaceDir: params.workspaceDir,
			config: params.config,
			agentId: params.agentId,
			preserveEntryOrder
		}) };
	}
	const { skillsEligibility, skillUsagePaths, skillsPromptWorkspaceDir, skillsSnapshot: skillsSnapshotForRun, skillsWorkspaceDir, workspaceOnly } = resolveSandboxSkillRuntimeInputs({
		sandbox: {
			enabled: true,
			...sandboxWorkspace.containerWorkdir ? { containerWorkdir: sandboxWorkspace.containerWorkdir } : {},
			...sandboxWorkspace.skillsEligibility ? { skillsEligibility: sandboxWorkspace.skillsEligibility } : {},
			...sandboxWorkspace.skillUsagePaths ? { skillUsagePaths: sandboxWorkspace.skillUsagePaths } : {},
			...sandboxWorkspace.skillsWorkspaceDir ? { skillsWorkspaceDir: sandboxWorkspace.skillsWorkspaceDir } : {},
			...sandboxWorkspace.workspaceAccess ? { workspaceAccess: sandboxWorkspace.workspaceAccess } : {}
		},
		skillsAnchorWorkspace: sandboxWorkspace.workspaceDir,
		skillsSnapshot
	});
	const { shouldLoadSkillEntries, skillEntries, preserveEntryOrder } = await resolveEmbeddedRunSkillEntries({
		assertCurrent: params.assertCurrent,
		workspaceDir: skillsWorkspaceDir,
		config: params.config,
		agentId: params.agentId,
		eligibility: skillsEligibility,
		skillsSnapshot: skillsSnapshotForRun,
		workspaceOnly
	});
	const promptSkillEntries = mapSandboxSkillEntriesForPrompt({
		entries: shouldLoadSkillEntries ? skillEntries : void 0,
		skillsWorkspaceDir,
		skillsPromptWorkspaceDir
	});
	return {
		usagePaths: skillUsagePaths,
		prompt: await resolveSkillsPrompt({
			assertCurrent: params.assertCurrent,
			skillsSnapshot: skillsSnapshotForRun,
			entries: promptSkillEntries,
			workspaceDir: skillsPromptWorkspaceDir,
			config: params.config,
			agentId: params.agentId,
			eligibility: skillsEligibility,
			preserveEntryOrder
		})
	};
}
/** Overrides preparation dependencies for CLI runner tests. */
function setCliRunnerPrepareTestDeps(overrides) {
	Object.assign(prepareDeps, overrides);
}
/** Restores preparation dependencies after CLI runner tests. */
function resetCliRunnerPrepareTestDeps() {
	Object.assign(prepareDeps, defaultPrepareDeps);
}
/** Returns whether profile-owned prepared execution should skip local CLI epoch hashing. */
function shouldSkipLocalCliCredentialEpoch(params) {
	return Boolean(params.authEpochMode === "profile-only" && params.authProfileId && params.authCredential && params.preparedExecution);
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.cliRunnerPrepareTestApi")] = {
	resetCliRunnerPrepareTestDeps,
	setCliRunnerPrepareTestDeps: (overrides) => {
		setCliRunnerPrepareTestDeps(overrides);
	}
};
function shouldResolveAuthProfileForExecution(params) {
	if (!params.policy) return false;
	if (!params.authCredential) return params.policy.strictSelectedProfile;
	if (params.authCredential.type === "oauth") return params.policy.oauthRefreshOwner === "core";
	return params.authCredential.type === "api_key" || params.authCredential.type === "token";
}
function describeCliAuthProfileResolutionFailure(profileId, failure) {
	switch (failure.kind) {
		case "resolved-as-other": return `selected auth profile "${profileId}" resolved as "${failure.resolvedProfileId}"`;
		case "unmaterialized": return `could not materialize selected auth profile "${profileId}"`;
	}
	return failure;
}
function buildCliAuthProfileResolutionError(params) {
	const loginCommand = buildOAuthRefreshFailureLoginCommand(params.provider, { profileId: params.profileId });
	const reason = describeCliAuthProfileResolutionFailure(params.profileId, params.failure);
	return new CliAuthProfilePreparationError({
		message: `CLI backend "${params.backendId}" ${reason}. Re-authenticate with: ${loginCommand}. OpenClaw did not start the run.`,
		profileId: params.profileId,
		provider: params.provider,
		agentDir: params.agentDir
	});
}
/** Builds the complete context required to execute a CLI-backed agent run. */
async function prepareCliRunContext(inputParams) {
	if (!inputParams.sessionManager && inputParams.sessionTarget) {
		const { restoreSessionColdTranscript } = await import("./session-cold-storage-CDCnO_Bk.mjs");
		await restoreSessionColdTranscript(inputParams.sessionTarget);
	}
	return runWithSessionTranscriptReadFence(inputParams.sessionManager ? void 0 : inputParams.userTurnTranscriptRecorder?.getAdmissionReceipt(), () => prepareCliRunContextWithinReadFence(inputParams));
}
async function prepareCliRunContextWithinReadFence(inputParams) {
	let params = inputParams.config ? inputParams : {
		...inputParams,
		config: getRuntimeConfig()
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
			entries: { [sessionOwner]: { default: true } }
		}
	};
	const { started, startedMonotonicMs } = captureCliRunStartTime();
	const executionMode = params.executionMode ?? "agent";
	const isSideQuestion = executionMode === "side-question";
	const isControlOperation = params.controlOperation !== void 0;
	const skipsTurnPreparation = isSideQuestion || isControlOperation;
	const admitPreparedParams = async (candidate) => {
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
			agentId: workspaceResolution.agentId,
			admittedRunContext
		};
	};
	const runtimeChatType = params.chatType ?? params.sessionEntry?.chatType;
	const workspaceResolution = resolveRunWorkspaceDir({
		workspaceDir: params.rootedExecution?.root ?? params.workspaceDir,
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
	const cwd = params.rootedExecution ? resolveUserPath(params.rootedExecution.root) : params.cwd ? resolveUserPath(params.cwd) : workspaceDir;
	const cwdHash = hashCliSessionText(cwd);
	const backendResolved = resolveCliBackendConfig(params.provider, params.config, { agentId: workspaceResolution.agentId });
	if (!backendResolved) throw new Error(`Unknown CLI backend: ${params.provider}`);
	const backendAuthPolicy = resolveBundledCliBackendAuthPolicy(backendResolved.id);
	const canEnforceExactToolAvailability = backendResolved.nativeToolMode === "selectable" && (backendResolved.toolAvailabilityEnforcement === "execution-args" && backendResolved.resolveExecutionArgs !== void 0 || backendResolved.toolAvailabilityEnforcement === "prepare-execution" && backendResolved.prepareExecution !== void 0);
	const questionOperation = params.toolAuthorityFingerprint ? params.replyOperation : void 0;
	const questionSessionKey = params.sessionKey ?? params.sessionId;
	const questionAbortSignal = params.abortSignal;
	const assertQuestionSourceCurrent = params.assertCurrent;
	const questionSnapshot = questionOperation ? void 0 : prepareCliReplyToolAuthority(params, {
		agentId: workspaceResolution.agentId,
		workspaceDir,
		cwd
	});
	let runtimeToolsAllowPolicy;
	const rootedToolsAllow = params.rootedExecution ? params.cliToolAvailability?.openClaw : void 0;
	if (params.toolsAllow !== void 0) {
		if (params.cliToolAvailability !== void 0) throw new Error(`CLI backend ${backendResolved.id} received conflicting runtime tool policies`);
		if (params.toolsAllow.some((toolName) => normalizeToolPolicyName(toolName) === "*")) params = {
			...params,
			toolsAllow: void 0
		};
		else {
			runtimeToolsAllowPolicy = [...params.toolsAllow];
			const fallbackOpenClawTools = uniqueStrings(expandToolGroups(params.toolsAllow).map((toolName) => normalizeToolPolicyName(toolName)).filter(Boolean));
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
	if (params.disableTools === true && !isSideQuestion && canEnforceExactToolAvailability) {
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
	const internalParams = params;
	const nodeClaudePlacement = detectNodeClaudePlacement({
		backendId: backendResolved.id,
		execHost: params.sessionEntry?.execHost,
		execNode: params.sessionEntry?.execNode
	});
	let rootedExecution;
	if (params.rootedExecution) {
		const rootedRequest = params.rootedExecution;
		if (backendResolved.isolatesInstructionsWithExactTools !== true) throw new Error(`CLI backend "${backendResolved.id}" does not declare instruction isolation with exact tools; collection review skipped`);
		if (!canEnforceExactToolAvailability || !backendResolved.bundleMcp || nodeClaudePlacement || skipsTurnPreparation || params.disableTools) throw new Error("CLI runtime cannot enforce rooted execution with mediated tools; collection review skipped");
		params = {
			...params,
			workspaceDir,
			cwd,
			disableCliLiveSession: true,
			cliToolAvailability: {
				native: [],
				openClaw: params.cliToolAvailability?.openClaw ?? []
			}
		};
		const admittedParams = await admitPreparedParams(params);
		const assertRootedCurrent = resolveAdmittedRunActiveAssertion(admittedParams.admittedRunContext, params.abortSignal);
		if (!assertRootedCurrent) throw new Error("Rooted CLI execution requires active admitted run authority");
		params = {
			...admittedParams,
			assertCurrent: () => {
				admittedParams.assertCurrent?.();
				admittedParams.abortSignal?.throwIfAborted();
				assertRootedCurrent();
			}
		};
		params.abortSignal?.throwIfAborted();
		assertRootedCurrent();
		rootedExecution = await prepareRootedExecutionCapability({
			rootedExecution: rootedRequest,
			config: params.config,
			agentId: workspaceResolution.agentId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			sandboxSessionKey: policySessionKey,
			sandboxAgentId: policyAgentId,
			execOverrides: params.execOverrides,
			permissionMode: params.sessionEntry?.permissionMode,
			skillsSnapshot: params.skillsSnapshot
		});
	}
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
	let authCredential;
	let resolvedProfileAuth;
	const loadScopedAuthStore = (options = {}) => {
		params.assertCurrent?.();
		return loadAuthProfileStoreForRuntime(agentDir, {
			readOnly: options.readOnly ?? true,
			profileId: options.profileId,
			externalCli: externalCliDiscoveryForProviderAuth({
				cfg: params.config,
				provider: params.provider,
				...options.profileId ? { profileId: options.profileId } : {}
			})
		});
	};
	if (effectiveAuthProfileId) {
		authStore = loadScopedAuthStore({ profileId: effectiveAuthProfileId });
		authCredential = authStore.profiles[effectiveAuthProfileId];
	} else if (backendResolved.autoSelectAuthProfile !== false && (backendResolved.authEpochMode === "profile-only" || backendResolved.prepareExecution)) {
		authStore = loadScopedAuthStore();
		effectiveAuthProfileId = resolveAuthProfileOrder({
			cfg: params.config,
			store: authStore,
			provider: params.provider,
			includePendingOAuthRefresh: true
		})[0]?.trim() || void 0;
		if (effectiveAuthProfileId) authCredential = authStore.profiles[effectiveAuthProfileId];
	}
	if (effectiveAuthProfileId && authCredential && !isSetupCredentialAccessible({
		profileId: effectiveAuthProfileId,
		credential: authCredential,
		agentDir
	})) throw new Error("This saved sign-in is inactive. Test and activate it in Model Setup.");
	if (backendAuthPolicy?.nativeAuthProfileIds !== void 0 && effectiveAuthProfileId !== void 0 && backendAuthPolicy.nativeAuthProfileIds.includes(effectiveAuthProfileId)) {
		effectiveAuthProfileId = void 0;
		authCredential = void 0;
	} else if (effectiveAuthProfileId && shouldResolveAuthProfileForExecution({
		policy: backendAuthPolicy,
		authCredential
	})) {
		const authProfileId = effectiveAuthProfileId;
		const writableAuthStore = loadScopedAuthStore({
			profileId: authProfileId,
			readOnly: false
		});
		const resolvedAuth = await prepareDeps.resolveApiKeyForProfile({
			cfg: params.config,
			store: writableAuthStore,
			profileId: authProfileId,
			agentDir,
			...backendAuthPolicy?.strictSelectedProfile ? { allowProfileFallback: false } : {}
		});
		params.assertCurrent?.();
		if (!resolvedAuth && backendAuthPolicy?.strictSelectedProfile) throw buildCliAuthProfileResolutionError({
			backendId: backendResolved.id,
			profileId: authProfileId,
			provider: writableAuthStore.profiles[authProfileId]?.provider ?? params.provider,
			agentDir,
			failure: { kind: "unmaterialized" }
		});
		if (resolvedAuth && backendAuthPolicy?.strictSelectedProfile && resolvedAuth.profileId !== authProfileId) throw buildCliAuthProfileResolutionError({
			backendId: backendResolved.id,
			profileId: authProfileId,
			provider: writableAuthStore.profiles[authProfileId]?.provider ?? params.provider,
			agentDir,
			failure: {
				kind: "resolved-as-other",
				resolvedProfileId: resolvedAuth.profileId
			}
		});
		const resolvedAuthProfileId = resolvedAuth?.profileId ?? authProfileId;
		authStore = loadScopedAuthStore({ profileId: resolvedAuthProfileId });
		authCredential = resolvedAuth?.credential ?? authStore.profiles[resolvedAuthProfileId];
		if (backendAuthPolicy?.strictSelectedProfile && (!authCredential || authCredential.type === "oauth" && !hasUsableOAuthCredential(authCredential))) throw buildCliAuthProfileResolutionError({
			backendId: backendResolved.id,
			profileId: authProfileId,
			provider: resolvedAuth?.provider ?? params.provider,
			agentDir,
			failure: { kind: "unmaterialized" }
		});
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
	const messageToolPolicyHash = bindingSourceReplyDeliveryMode !== void 0 || (hasCliSessionBindingFacts ? bindingFacts.requireExplicitMessageTarget !== void 0 || bindingRequireExplicitMessageTarget : params.requireExplicitMessageTarget !== void 0 || bindingRequireExplicitMessageTarget) ? hashCliSessionText(JSON.stringify({
		sourceReplyDeliveryMode: bindingSourceReplyDeliveryMode,
		requireExplicitMessageTarget: bindingRequireExplicitMessageTarget
	})) : void 0;
	const modelId = (params.model ?? "default").trim() || "default";
	const modelProvider = normalizeOptionalMcpContextValue(params.modelProvider) ?? normalizeOptionalMcpContextValue(params.provider) ?? params.provider;
	const normalizedCatalogModel = normalizeCliModel(modelId, backendResolved.config);
	const normalizedModel = backendResolved.resolveModelId?.({
		modelId: normalizedCatalogModel,
		contextWindow: params.contextWindow
	}) ?? normalizedCatalogModel;
	const questionRoute = {
		provider: modelProvider,
		model: modelId
	};
	const questionFingerprint = questionOperation ? questionOperation.bindToolAuthorityRoute(questionRoute) : questionSnapshot?.fingerprint(questionRoute);
	if (questionOperation) params = {
		...params,
		toolAuthorityFingerprint: questionFingerprint
	};
	const bindQuestionAnswerAuthorityForSession = (sessionKey, assertActive) => createAgentQuestionAnswerAuthority({
		sessionKey,
		fingerprint: questionFingerprint,
		project: (caller) => questionOperation ? questionOperation.projectToolAuthorityFingerprint(caller) : questionSnapshot?.project(caller, questionRoute),
		assertActive: () => {
			assertActive();
			assertQuestionSourceCurrent?.();
			questionAbortSignal?.throwIfAborted();
			if (questionOperation && (questionOperation.result || questionOperation.toolAuthorityRoute?.provider !== questionRoute.provider || questionOperation.toolAuthorityRoute.model !== questionRoute.model || questionOperation.toolAuthorityFingerprint !== questionFingerprint)) throw new Error("question creator reply authority is no longer active");
			assertActive();
		}
	});
	const bindQuestionAnswerAuthority = (assertActive) => bindQuestionAnswerAuthorityForSession(questionSessionKey, assertActive);
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
	const promptBuildHookResult = await (async () => {
		if (skipsTurnPreparation) return;
		try {
			return await resolvePromptBuildHookResult({
				config: runConfig,
				prompt: params.prompt,
				messages: await loadOpenClawHistoryMessages(),
				hookCtx: promptBuildHookContext,
				hookRunner: promptBuildHookRunner,
				bootstrapContextRunKind: params.bootstrapContextRunKind
			});
		} catch (error) {
			cliBackendLog.warn(`cli prompt-build hook preparation failed: ${String(error)}`);
			return;
		}
	})();
	const promptBuildToolsAllow = mergeForcedEmbeddedAttemptToolsAllow(promptBuildHookResult?.toolsAllow, { forceMessageTool: messageToolOwnsVisibleReply({ sourceReplyDeliveryMode: bindingSourceReplyDeliveryMode }) });
	const promptBuildRestrictsTools = promptBuildToolsAllow !== void 0 && !promptBuildToolsAllow.some((toolName) => normalizeToolPolicyName(toolName) === "*");
	const isClaudeCli = isClaudeCliBackendId(params.provider);
	const requestedContextModelId = isClaudeCli ? resolveClaudeCliContextModelId(modelId) : modelId;
	const normalizedContextModelId = isClaudeCli ? resolveClaudeCliContextModelId(normalizedCatalogModel) : normalizedCatalogModel;
	const contextModelIds = [requestedContextModelId, ...normalizedContextModelId !== requestedContextModelId ? [normalizedContextModelId] : []];
	const resolveContextModelTokens = (contextModelId) => resolveContextTokensForModel({
		cfg: params.config,
		provider: params.provider,
		modelProvider: backendResolved.modelProvider,
		model: contextModelId,
		modelContextWindow: params.modelContextWindow,
		modelContextTokens: params.modelContextTokens,
		allowAsyncLoad: false,
		allowUnscopedModelLookup: false
	});
	let modelContextTokens;
	for (const contextModelId of contextModelIds) {
		const candidateContextTokens = resolveContextModelTokens(contextModelId);
		if (candidateContextTokens !== void 0) modelContextTokens = modelContextTokens === void 0 ? candidateContextTokens : Math.min(modelContextTokens, candidateContextTokens);
	}
	modelContextTokens ??= DEFAULT_CONTEXT_TOKENS;
	const selectableContextEntry = findSelectableContextWindowEntry({
		catalog: params.config ? prepareDeps.loadManifestModelCatalog({
			config: params.config,
			workspaceDir
		}) : [],
		providers: uniqueStrings([params.provider, backendResolved.modelProvider].filter((provider) => typeof provider === "string" && provider.length > 0)),
		models: uniqueStrings([modelId, normalizedCatalogModel])
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
	const autoReseedHistoryChars = isClaudeCli ? resolveAutoCliSessionReseedHistoryChars(contextWindowInfo.tokens) : void 0;
	const sessionLabel = params.sessionKey ?? params.sessionId;
	const { bootstrapFiles, contextFiles: resolvedContextFiles } = skipsTurnPreparation ? {
		bootstrapFiles: [],
		contextFiles: []
	} : await prepareDeps.resolveBootstrapContextForRun({
		workspaceDir: params.bootstrapWorkspaceDir ?? workspaceDir,
		config: params.config,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		bootstrapUserProfileId: params.bootstrapUserProfileId,
		chatType: runtimeChatType,
		agentId: sessionAgentId,
		contextMode: params.bootstrapContextMode,
		runKind: params.bootstrapContextRunKind,
		warn: prepareDeps.makeBootstrapWarn({
			sessionLabel,
			workspaceDir,
			warn: (message) => cliBackendLog.warn(message)
		})
	});
	const canonicalWorkspace = resolveUserPath(resolveAgentWorkspaceDir(params.config ?? {}, workspaceResolution.agentId));
	const selectedNativeToolsProvideFileAccess = params.cliToolAvailability === void 0 || params.cliToolAvailability.native.length > 0;
	const hasBootstrapFileAccess = (backendResolved.nativeToolMode === "always-on" || backendResolved.nativeToolMode === "selectable") && selectedNativeToolsProvideFileAccess && params.disableTools !== true;
	const bootstrapRouting = skipsTurnPreparation || !canTransportSystemPrompt(backendResolved.config) ? void 0 : await resolveWorkspaceBootstrapRouting({
		isWorkspaceBootstrapPending: prepareDeps.isWorkspaceBootstrapPending,
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
	const systemAgentMcpConfig = internalParams.systemAgentTool ? buildSystemAgentToolsMcpServerConfig(internalParams.systemAgentTool) : void 0;
	const bundleMcpEnabled = !nodeClaudePlacement && !skipsTurnPreparation && !systemAgentMcpConfig && backendResolved.bundleMcp && params.disableTools !== true;
	let mcpLoopbackRuntime = bundleMcpEnabled ? prepareDeps.getActiveMcpLoopbackRuntime() : void 0;
	if (bundleMcpEnabled && !mcpLoopbackRuntime) {
		try {
			await prepareDeps.ensureMcpLoopbackServer();
		} catch (error) {
			throw new Error(`Bundled MCP is enabled, but the OpenClaw MCP loopback server failed to start: ${String(error)}`, { cause: error });
		}
		mcpLoopbackRuntime = prepareDeps.getActiveMcpLoopbackRuntime();
	}
	if (bundleMcpEnabled && !mcpLoopbackRuntime) throw new Error("Bundled MCP is enabled, but the OpenClaw MCP loopback server did not publish a runtime after startup.");
	const mcpDeliveryCaptureEnabled = bundleMcpEnabled && Boolean(mcpLoopbackRuntime);
	const nodeWorkshopEnabled = nodeClaudePlacement && !skipsTurnPreparation && params.disableTools !== true && params.skillLibraryAuthoring !== void 0;
	const shouldMaterializeRuntimePolicy = runtimeToolsAllowPolicy !== void 0 && !nodeClaudePlacement && !skipsTurnPreparation && !systemAgentMcpConfig && params.disableTools !== true;
	const skillLibraryAuthoring = nodeWorkshopEnabled && params.skillLibraryAuthoring ? {
		...params.skillLibraryAuthoring,
		defaultTarget: "personal"
	} : params.skillLibraryAuthoring;
	const mcpContextBase = mcpLoopbackRuntime || shouldMaterializeRuntimePolicy || nodeWorkshopEnabled ? buildCliMcpGrantContext({
		run: params,
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
		store: authStore ?? loadScopedAuthStore()
	} : void 0;
	const requestedLoopbackToolsAllow = runtimeToolsAllowPolicy ?? (rootedExecution ? rootedToolsAllow : params.cliToolAvailability?.openClaw);
	const mcpProjectionContext = mcpContextBase && requestedLoopbackToolsAllow !== void 0 ? {
		...mcpContextBase,
		toolsAllow: [...requestedLoopbackToolsAllow]
	} : mcpContextBase;
	const resolveProjectedTools = runtimeToolsAllowPolicy !== void 0 || rootedExecution && rootedToolsAllow === void 0 ? prepareDeps.resolveMcpLoopbackPolicyTools : prepareDeps.resolveMcpLoopbackScopedTools;
	params.assertCurrent?.();
	const projectedToolsBeforePromptBuild = (bundleMcpEnabled || shouldMaterializeRuntimePolicy || nodeWorkshopEnabled) && mcpProjectionContext ? (await resolveProjectedTools({
		cfg: runConfig,
		signal: params.abortSignal,
		context: mcpProjectionContext,
		rootedExecution,
		...skillLibraryAuthoring ? { skillLibraryAuthoring } : {},
		...mcpToolAuth ? { authProfileStore: mcpToolAuth.store } : {},
		...mcpToolAuth?.agentDir ? { authProfileStoreAgentDir: mcpToolAuth.agentDir } : {}
	})).tools : [];
	params.assertCurrent?.();
	const hookFilteredProjectedTools = applyEmbeddedAttemptToolsAllow(projectedToolsBeforePromptBuild, promptBuildToolsAllow);
	if (promptBuildRestrictsTools && (backendResolved.nativeToolMode === "always-on" || backendResolved.nativeToolMode === "selectable" && !canEnforceExactToolAvailability)) throw new Error(`CLI backend "${backendResolved.id}" cannot enforce before_prompt_build tool restrictions. Use a backend with exact tool availability or remove the hook restriction. OpenClaw did not start the run.`);
	if (promptBuildRestrictsTools && params.cliToolAvailability === void 0 && backendResolved.nativeToolMode === "selectable" || runtimeToolsAllowPolicy !== void 0 && shouldMaterializeRuntimePolicy || rootedExecution) params = {
		...params,
		cliToolAvailability: {
			native: [],
			openClaw: hookFilteredProjectedTools.map((tool) => tool.name)
		}
	};
	if (params.cliToolAvailability && promptBuildToolsAllow !== void 0) {
		const filterToolNames = (names) => applyEmbeddedAttemptToolsAllow(names.map((name) => ({ name })), promptBuildToolsAllow).map((tool) => tool.name);
		params = {
			...params,
			cliToolAvailability: {
				native: filterToolNames(params.cliToolAvailability.native),
				openClaw: filterToolNames(params.cliToolAvailability.openClaw)
			}
		};
	}
	const projectedTools = applyEmbeddedAttemptToolsAllow(hookFilteredProjectedTools, params.cliToolAvailability?.openClaw);
	const nodeSkillWorkshop = nodeWorkshopEnabled ? projectedTools.find((tool) => tool.name === "skill_workshop") : void 0;
	const promptTools = bundleMcpEnabled ? projectedTools : nodeSkillWorkshop ? [nodeSkillWorkshop] : [];
	const authorizedPromptBuildResult = await (async () => {
		const toolAuthorityFingerprint = params.toolAuthorityFingerprint;
		if (!promptBuildHookRunner || !toolAuthorityFingerprint) return;
		const admittedParams = await admitPreparedParams(params);
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
	const restrictedLoopbackToolsAllow = params.cliToolAvailability?.openClaw ?? (promptBuildRestrictsTools ? projectedTools.map((tool) => tool.name) : void 0);
	const projectNativeToolAuthority = !skipsTurnPreparation && params.disableTools !== true && !nodeClaudePlacement ? backendResolved.projectNativeToolAuthority : void 0;
	const mcpGrant = finalizeCliMcpGrant(mcpContextBase, restrictedLoopbackToolsAllow, Boolean(projectNativeToolAuthority), params.assertCurrent);
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
		const mcpClientGrant = mcpLoopbackRuntime && mcpGrant ? prepareDeps.mintMcpLoopbackClientGrant({
			...mcpGrant,
			runtimeOwnerToken: mcpLoopbackRuntime.ownerToken,
			admittedRunContext: params.admittedRunContext,
			messageActionTurnCapability: params.messageActionTurnCapability,
			abortSignal: params.abortSignal,
			bindQuestionAnswerAuthority: (assertActive) => bindQuestionAnswerAuthorityForSession(mcpGrant.context.sessionKey, assertActive),
			...skillLibraryAuthoring ? { skillLibraryAuthoring } : {},
			rootedExecution,
			...mcpToolAuth ? { toolAuth: mcpToolAuth } : {}
		}) : void 0;
		const bindMcpClientGrantAdmission = (admittedRunContext) => {
			if (mcpClientGrant && mcpLoopbackRuntime && !prepareDeps.bindMcpLoopbackClientGrantAdmission({
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
					if (!prepareDeps.transferMcpLoopbackClientGrant({
						sourceToken: mcpClientGrant.token,
						targetToken: processToken,
						runtimeOwnerToken: mcpLoopbackRuntime.ownerToken
					})) throw new Error("CLI MCP client grant could not transfer onto the live process bearer");
					activeToken = processToken;
				},
				revokeProcessToken: () => {
					prepareDeps.revokeMcpLoopbackClientGrant(activeToken);
				},
				activate: (captureKey, assertCurrent) => {
					const activated = prepareDeps.activateMcpLoopbackClientGrantCapture({
						token: activeToken,
						runtimeOwnerToken: mcpLoopbackRuntime.ownerToken,
						captureKey,
						assertCurrent
					});
					if (!activated) throw new Error("CLI MCP client grant is no longer valid for this Gateway runtime");
					activeCapture = activated;
				},
				deactivate: (captureKey) => {
					prepareDeps.deactivateMcpLoopbackClientGrantCapture({
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
		const cleanupMcpClientGrant = mcpClientGrant ? async () => {
			if (mcpClientGrantRevoked) return;
			mcpClientGrantRevoked = true;
			prepareDeps.revokeMcpLoopbackClientGrant(mcpClientGrant.token);
		} : void 0;
		cleanupPreparedResources = cleanupMcpClientGrant;
		const rawLoopbackServerConfig = mcpLoopbackRuntime ? prepareDeps.createMcpLoopbackServerConfig(mcpLoopbackRuntime.port) : void 0;
		const loopbackServerConfig = rawLoopbackServerConfig && backendResolved.bundleMcpMode === "claude-config-file" ? applyClaudeManagedMcpTimeout(rawLoopbackServerConfig) : rawLoopbackServerConfig;
		const sandboxStatus = resolveSandboxRuntimeStatus({
			cfg: runConfig,
			sessionKey: policySessionKey,
			agentId: policyAgentId
		});
		const nativeMcpCapabilityProfile = resolveConversationCapabilityProfile({
			config: runConfig,
			sessionKey: policySessionKey,
			runSessionKey: params.sessionKey && params.sessionKey !== policySessionKey ? params.sessionKey : void 0,
			sessionId: params.sessionId,
			runId: params.runId,
			agentId: policyAgentId,
			agentDir,
			agentAccountId: params.agentAccountId,
			messageProvider: params.messageProvider ?? params.messageChannel,
			messageChannel: params.messageChannel,
			chatType: runtimeChatType,
			currentChannelId: params.currentChannelId,
			currentThreadTs: params.currentThreadTs,
			currentMessageId: params.currentMessageId,
			groupId: params.groupId,
			groupChannel: params.groupChannel,
			groupSpace: params.groupSpace,
			spawnedBy: params.spawnedBy,
			senderId: params.senderId,
			senderName: params.senderName,
			senderUsername: params.senderUsername,
			senderE164: params.senderE164,
			senderIsOwner: params.senderIsOwner,
			modelProvider,
			modelId,
			modelContextWindowTokens: contextWindowInfo.tokens,
			workspaceDir,
			cwd,
			skillsSnapshot: params.skillsSnapshot,
			sandboxToolPolicy: sandboxStatus.sandboxed ? sandboxStatus.toolPolicy : void 0,
			runtimeToolAllowlist: runtimeToolsAllowPolicy,
			inheritRuntimeToolAllowlist: true,
			inputProvenance: params.inputProvenance,
			scheduledToolPolicy: params.scheduledToolPolicy
		});
		const preparedBackend = await prepareCliBundleMcpConfig({
			enabled: bundleMcpEnabled || systemAgentMcpConfig !== void 0,
			mode: backendResolved.bundleMcpMode,
			backend: backendResolved.config,
			workspaceDir,
			config: params.config,
			toolOverrides: params.toolOverrides,
			agentDir,
			...systemAgentMcpConfig ? { exclusiveConfig: systemAgentMcpConfig } : restrictedLoopbackToolsAllow && loopbackServerConfig ? { exclusiveConfig: loopbackServerConfig } : {},
			additionalConfig: restrictedLoopbackToolsAllow ? void 0 : loopbackServerConfig,
			env: mcpLoopbackRuntime && mcpClientGrant ? {
				OPENCLAW_MCP_TOKEN: mcpClientGrant.token,
				OPENCLAW_MCP_CLI_CAPTURE_KEY: ""
			} : void 0,
			warn: (message) => cliBackendLog.warn(message),
			...!systemAgentMcpConfig && !restrictedLoopbackToolsAllow ? { nativeMcpPolicy: {
				sessionId: params.sessionId,
				...params.sessionKey ? { sessionKey: params.sessionKey } : {},
				capabilityProfile: nativeMcpCapabilityProfile,
				...runtimeToolsAllowPolicy !== void 0 ? { runtimeToolsAllow: runtimeToolsAllowPolicy } : {}
			} } : {}
		});
		const cleanupPreparedBackend = preparedBackend.cleanup || cleanupMcpClientGrant ? async () => {
			try {
				await preparedBackend.cleanup?.();
			} finally {
				await cleanupMcpClientGrant?.();
			}
		} : void 0;
		cleanupPreparedResources = cleanupPreparedBackend;
		const prepareExecutionContext = {
			config: params.config,
			workspaceDir,
			agentDir,
			provider: params.provider,
			modelId,
			...params.contextWindow ? { contextWindow: params.contextWindow } : {},
			contextTokenBudget: contextWindowInfo.tokens,
			thinkingLevel: params.thinkLevel === "ultra" ? "max" : params.thinkLevel,
			authProfileId: effectiveAuthProfileId,
			executionMode,
			toolAvailability: params.cliToolAvailability,
			env: preparedBackend.env
		};
		const privatePrepareExecutionContext = params.isolatedCompletion ? {
			...prepareExecutionContext,
			isolatedCompletionCwd: cwd,
			isolatedCompletionModelId: normalizedModel,
			isolatedCompletionPrompt: params.prompt,
			isolatedCompletionSystemPrompt: params.extraSystemPrompt ?? ""
		} : prepareExecutionContext;
		try {
			params.assertCurrent?.();
			preparedExecution = await backendResolved.prepareExecution?.(backendAuthPolicy ? {
				...privatePrepareExecutionContext,
				authCredential
			} : privatePrepareExecutionContext) ?? void 0;
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
		const preparedBackendCleanup = cleanupPreparedBackend || preparedExecution?.cleanup || pluginExecutionConsumer ? async () => {
			try {
				const cleanupExecution = () => preparedExecution?.cleanup?.();
				await (pluginExecutionConsumer ? pluginExecutionConsumer.run(cleanupExecution) : cleanupExecution());
			} finally {
				try {
					await cleanupPreparedBackend?.();
				} finally {
					pluginExecutionConsumer?.release();
				}
			}
		} : void 0;
		cleanupPreparedResources = preparedBackendCleanup;
		params.assertCurrent?.();
		if (params.isolatedCompletion && preparedExecution?.isolatedCompletionEnforced !== true) throw unsupportedIsolatedCompletionError(backendResolved.id);
		if (params.cliToolAvailability && backendResolved.toolAvailabilityEnforcement === "prepare-execution" && preparedExecution?.toolAvailabilityEnforced !== true) throw new Error(`CLI backend ${backendResolved.id} did not enforce exact per-run tool availability during execution preparation`);
		const skipLocalCredentialEpoch = shouldSkipLocalCliCredentialEpoch({
			authEpochMode: backendResolved.authEpochMode,
			authProfileId: effectiveAuthProfileId,
			authCredential,
			preparedExecution
		});
		const authEpoch = await resolveCliAuthEpoch({
			provider: params.provider,
			agentDir,
			authProfileId: effectiveAuthProfileId,
			skipLocalCredential: skipLocalCredentialEpoch
		});
		const authBindingFingerprint = params.onSuccessfulAuthBinding ? resolveCliAuthBindingFingerprint({
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
		const claudeSkillsPlugin = rootedExecution || skipsTurnPreparation || nodeClaudePlacement ? {
			args: [],
			cleanup: async () => {}
		} : await prepareDeps.prepareClaudeCliSkillsPlugin({
			backendId: backendResolved.id,
			skillsSnapshot: params.skillsSnapshot
		});
		let claudeSkillsPluginClaimed = false;
		const claimLiveSessionResources = claudeSkillsPlugin.args.length > 0 ? () => {
			if (claudeSkillsPluginClaimed) return;
			claudeSkillsPluginClaimed = true;
			return claudeSkillsPlugin.cleanup;
		} : void 0;
		const preparedCleanup = preparedBackendCleanup || claudeSkillsPlugin.args.length > 0 ? async () => {
			try {
				if (!claudeSkillsPluginClaimed) await claudeSkillsPlugin.cleanup();
			} finally {
				await preparedBackendCleanup?.();
			}
		} : void 0;
		cleanupPreparedResources = preparedCleanup ?? preparedBackendCleanup;
		const preparedBackendClearEnv = [...preparedBackend.backend.clearEnv ?? [], ...preparedExecution?.clearEnv ?? []];
		const processPerTurnBackend = (() => {
			const { liveSession: _liveSession, ...backend } = preparedBackend.backend;
			return backend;
		})();
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
		const promptToolNamesHash = bundleMcpEnabled && mcpLoopbackRuntime ? hashCliSessionText(JSON.stringify(promptTools.map((tool) => tool.name).toSorted())) : void 0;
		const ignoreCliSessionCandidate = isSideQuestion || preparedBackendFinal.backend.sessionMode === "none";
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
		const candidateClaudeCliSessionId = resolveReusableCliSessionId(backendReusableCliSession)?.trim() || void 0;
		const hasClaudeCliCandidate = !isControlOperation && !nodeClaudePlacement && candidateClaudeCliSessionId !== void 0 && isClaudeCliBackendId(params.provider);
		const claudeCliTranscriptMissing = hasClaudeCliCandidate && !await prepareDeps.claudeCliSessionTranscriptHasContent({
			sessionId: candidateClaudeCliSessionId,
			workspaceDir: cwd
		});
		const managedClaudeLiveSessionGeneration = claudeCliTranscriptMissing && backendResolved.id === "claude-cli" && "liveSession" in preparedBackendFinal.backend && preparedBackendFinal.backend.liveSession === "claude-stdio" && preparedBackendFinal.backend.output === "jsonl" && preparedBackendFinal.backend.input === "stdin" && prepareDeps.getCliLiveSessionGeneration({
			backendId: backendResolved.id,
			agentAccountId: params.agentAccountId,
			agentId: workspaceResolution.agentId,
			authProfileId: effectiveAuthProfileId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey
		});
		const hasManagedClaudeLiveSession = Boolean(managedClaudeLiveSessionGeneration);
		const claudeCliTranscriptOrphanedToolUse = hasClaudeCliCandidate && !claudeCliTranscriptMissing && await prepareDeps.claudeCliSessionTranscriptHasOrphanedToolUse({
			sessionId: candidateClaudeCliSessionId,
			workspaceDir: cwd
		});
		const claudeCliInvalidatedReason = claudeCliTranscriptMissing && !hasManagedClaudeLiveSession ? "missing-transcript" : claudeCliTranscriptOrphanedToolUse ? "orphaned-tool-use" : void 0;
		const reusableCliSession = claudeCliInvalidatedReason ? {
			mode: "invalidate",
			invalidatedReason: claudeCliInvalidatedReason
		} : backendReusableCliSession;
		const reusableCliSessionId = resolveReusableCliSessionId(reusableCliSession);
		const invalidatedReason = resolveCliSessionInvalidatedReason(reusableCliSession);
		if (invalidatedReason) cliBackendLog.info(`cli session reset: provider=${params.provider} reason=${invalidatedReason}`);
		const openClawReferences = skipsTurnPreparation ? {
			docsPath: null,
			sourcePath: null
		} : await prepareDeps.resolveOpenClawReferencePaths({
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
		const preparedSkills = rootedExecution ? { prompt: params.skillsSnapshot?.prompt ?? "" } : skipsTurnPreparation || nodeClaudePlacement || claudeSkillsPlugin.args.length > 0 ? { prompt: "" } : await resolveCliSkillsPrompt({
			assertCurrent: assertSkillsCurrent,
			skillsSnapshot: params.skillsSnapshot,
			workspaceDir,
			executionWorkspaceDir: params.sessionEntry?.worktree?.canonicalWorkspaceDir ?? cwd,
			config: params.config,
			agentId: sessionAgentId,
			sessionKey: params.sessionKey?.trim() || params.sessionId
		});
		assertSkillsCurrent();
		const systemPromptSkillsPrompt = preparedSkills.prompt;
		const runtimeChannel = skipsTurnPreparation ? void 0 : normalizeMessageChannel(params.messageChannel ?? params.messageProvider);
		const runtimeCapabilities = skipsTurnPreparation ? void 0 : collectRuntimeChannelCapabilities({
			cfg: params.config,
			channel: runtimeChannel,
			accountId: params.agentAccountId
		});
		const builtSystemPrompt = isControlOperation ? "" : isSideQuestion ? extraSystemPrompt : await prepareCliSystemPrompt({
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
			ownerNumbers: params.ownerNumbers,
			docsPath: openClawReferences.docsPath ?? void 0,
			sourcePath: openClawReferences.sourcePath ?? void 0,
			skillsPrompt: systemPromptSkillsPrompt,
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
			systemPrompt: builtSystemPrompt
		}) ?? builtSystemPrompt : builtSystemPrompt;
		const allowRawTranscriptReseed = backendResolved.config.reseedFromRawTranscriptWhenUncompacted === true;
		const historyParams = params = await admitPreparedParams(params);
		const cliHistoryWriter = !isSideQuestion ? await prepareCliHistoryBoundary(historyParams, { credential: authCredential }) : void 0;
		const rawTranscriptReseedReason = !(params.sessionManager !== void 0 || cliHistoryWriter !== void 0) ? "auth-unknown" : reusableCliSessionId ? "session-expired" : invalidatedReason ?? (ignoreCliSessionCandidate ? void 0 : "missing-transcript");
		const sessionPromptContext = skipsTurnPreparation || params.isolatedCompletion ? void 0 : await loadCliSessionPromptContext({
			abortSignal: params.abortSignal,
			sessionManager: params.sessionManager,
			sessionTarget: params.sessionTarget,
			allowRawTranscriptReseed,
			rawTranscriptReseedReason
		});
		const finalizedTranscriptPrompt = (params.finalizePromptForResolvedTools || sessionPromptContext?.durableContext) && params.transcriptPrompt === void 0 ? params.prompt : params.transcriptPrompt;
		let promptContext;
		let promptForHooks;
		let preparedPrompt = isControlOperation ? params.prompt : params.finalizePromptForResolvedTools?.({
			prompt: params.prompt,
			messageToolAvailable
		}) ?? params.prompt;
		if (!isControlOperation && params.skillsSnapshot?.librarySelections?.length) preparedPrompt = remapSkillReferencePaths(preparedPrompt, preparedSkills.usagePaths);
		if (!skipsTurnPreparation) {
			try {
				const hookResult = promptBuildHookResult;
				const prependContext = [
					sessionPromptContext?.durableContext,
					hookResult?.prependContext,
					authorizedPromptBuildResult?.prependContext
				].filter((value) => Boolean(value?.trim())).join("\n\n");
				const appendContext = await buildCliTurnAppendContext({
					capabilityToolNames: new Set(promptTools.map((tool) => tool.name)),
					sessionKey: params.sessionKey,
					agentId: sessionAgentId,
					backend: preparedBackendFinal.backend,
					isNewSession: !reusableCliSessionId?.trim() || reusableCliSession.mode === "reuse-with-drift",
					systemPrompt,
					context: [hookResult?.appendContext, authorizedPromptBuildResult?.appendContext]
				});
				const logicalPrompt = composeCliPromptContext(preparedPrompt, {
					prependContext,
					appendContext
				});
				if ((prependContext || appendContext) && executionTarget.kind === "plugin") {
					promptContext = {
						...prependContext ? { prependContext } : {},
						...appendContext ? { appendContext } : {}
					};
					promptForHooks = logicalPrompt;
				} else preparedPrompt = logicalPrompt;
				const hookSystemPrompt = hookResult?.systemPrompt?.trim();
				if (hookSystemPrompt) systemPrompt = hookSystemPrompt;
				systemPrompt = composeSystemPromptWithHookContext({
					baseSystemPrompt: systemPrompt,
					prependSystemContext: hookResult?.prependSystemContext,
					appendSystemContext: hookResult?.appendSystemContext
				}) ?? systemPrompt;
			} catch (error) {
				cliBackendLog.warn(`cli prompt-build hook preparation failed: ${String(error)}`);
			}
			params.assertCurrent?.();
			params.abortSignal?.throwIfAborted();
		}
		let historyPromptCurrentTurn = preparedPrompt;
		if (!skipsTurnPreparation) {
			const currentInboundContext = prependCliSessionDriftUserContext(params.currentInboundContext, reusableCliSession);
			const renderCurrentPrompt = (prompt, preferResumableText = false) => annotateInterSessionPromptText(buildCurrentInboundPrompt({
				context: currentInboundContext,
				prompt,
				preferResumableText
			}), params.inputProvenance);
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
			sandbox: rootedExecution ? {
				mode: sandboxStatus.mode,
				sandboxed: Boolean(rootedExecution.sandbox)
			} : {
				mode: "off",
				sandboxed: false
			},
			systemPrompt,
			injectedWorkspaceFiles: bootstrapInjectionStats,
			skillsPrompt: systemPromptSkillsPrompt,
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
			effectiveAuthProfileId,
			...authStore ? { authProfileStore: authStore } : {},
			agentDir,
			started,
			startedMonotonicMs,
			workspaceDir,
			cwd,
			backendResolved,
			preparedBackend: preparedBackendFinal,
			...loopbackServerConfig && !systemAgentMcpConfig && backendResolved.bundleMcpMode === "claude-config-file" ? { managedMcpToolTimeoutMs: CLAUDE_MANAGED_MCP_TIMEOUT_MS } : {},
			executionTarget,
			...pluginExecutionConsumer ? { pluginExecutionConsumer } : {},
			reusableCliSession,
			contextEngineConfig: runConfig,
			modelId,
			normalizedModel,
			contextWindowInfo,
			systemPrompt,
			systemPromptReport,
			claudeSkillsPluginArgs: claudeSkillsPlugin.args,
			...cliHistoryWriter ? { cliHistoryWriter } : {},
			authEpoch,
			authBindingFingerprint,
			...skipLocalCredentialEpoch ? { authBindingSkipsLocalCredential: true } : {},
			authEpochVersion: 7,
			extraSystemPromptHash,
			messageToolPolicyHash,
			promptToolNamesHash,
			...resultContentSourceByToolName.size > 0 ? { resultContentSourceByToolName } : {},
			cwdHash,
			...mcpDeliveryCaptureEnabled ? { mcpDeliveryCapture: true } : {}
		});
		const admitFinalParams = () => admitPreparedParams({
			...params,
			config: runConfig,
			prompt: preparedPrompt,
			transcriptPrompt: finalizedTranscriptPrompt,
			...requireExplicitMessageTarget ? { requireExplicitMessageTarget: true } : {}
		});
		const bindPreparedParams = (preparedParams) => {
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
		};
		if (skipsTurnPreparation) {
			const preparedParams = await admitFinalParams();
			bindPreparedParams(preparedParams);
			return {
				...buildPreparedContext(preparedParams),
				hadSessionFile: false
			};
		}
		ensureContextEnginesInitialized();
		const contextEngineAgentDir = resolveAgentDir(runConfig, sessionAgentId);
		const contextEngineHostSupport = buildGenericCliContextEngineHostSupport({
			backendId: backendResolved.id,
			capabilities: backendResolved.contextEngineHostCapabilities
		});
		let resolvedContextEngine;
		let deferContextEngineDisposalUntil = params.contextEngineLogicalTurnLease?.deferDisposalUntil;
		if (params.contextEngineLogicalTurnLease) {
			selectContextEngineForTranscriptHost({
				lease: params.contextEngineLogicalTurnLease,
				host: contextEngineHostSupport,
				operation: "agent-run",
				recorder: params.userTurnTranscriptRecorder
			});
			await drainPendingContextEngineTurnsBeforeRun({
				admission: params.userTurnTranscriptRecorder?.getAdmissionReceipt(),
				isHeartbeat: isHeartbeatLifecycleRunKind(params.bootstrapContextRunKind),
				lease: params.contextEngineLogicalTurnLease,
				recorder: params.userTurnTranscriptRecorder,
				sessionTarget: params.sessionTarget
			});
			resolvedContextEngine = params.contextEngineLogicalTurnLease.begin().engine;
		} else {
			const trackDisposal = captureAsyncWorkTracker();
			const ownedEngine = await resolveContextEngine(runConfig, {
				agentDir: contextEngineAgentDir,
				workspaceDir
			});
			resolvedContextEngine = ownedEngine;
			const previousCleanup = cleanupPreparedResources;
			const disposalHolds = /* @__PURE__ */ new Set();
			deferContextEngineDisposalUntil = (promise) => {
				disposalHolds.add(promise);
				promise.finally(() => disposalHolds.delete(promise)).catch(() => {});
			};
			cleanupPreparedResources = async () => {
				try {
					if (disposalHolds.size > 0) trackDisposal(async () => {
						await Promise.allSettled(disposalHolds);
						await runCliCleanup(params, "cli-context-engine-release", async () => {
							await ownedEngine.dispose?.();
						});
					}).catch((error) => {
						cliBackendLog.warn(`CLI context engine cleanup failed: ${String(error)}`);
					});
					else await ownedEngine.dispose?.();
				} finally {
					await previousCleanup?.();
				}
			};
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
		bindPreparedParams(preparedParams);
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
		return {
			...buildPreparedContext(preparedParams),
			...managedClaudeLiveSessionGeneration ? { requiredClaudeLiveSessionGeneration: managedClaudeLiveSessionGeneration } : {},
			hadSessionFile,
			contextEngine,
			deferContextEngineDisposalUntil,
			contextEngineTurnPrompt,
			...promptContext ? {
				promptContext,
				promptForHooks
			} : {},
			...nodeSkillWorkshop ? { nodeSkillWorkshop } : {},
			...openClawHistoryPrompt ? { openClawHistoryPrompt } : {}
		};
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
}
//#endregion
export { detectNodeClaudePlacement as n, prepareCliRunContext as t };
